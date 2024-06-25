/**
 * ApplicationController module.
 * @module Controller ApplicationController
 */
const summaryController = require('./SummaryController');
const eAppSubmittedController = require('./EAppSubmittedController');
const crypto = require('crypto');
const helptext = require('../../config/helptext');
const HelperService = require("../services/HelperService");
const ValidationService = require("../services/ValidationService");
const sequelize = require('../models/index').sequelize;
const { Op } = require("sequelize");
const AdditionalApplicationInfo = require('../models/index').AdditionalApplicationInfo
const Application = require('../models/index').Application
const ApplicationPaymentDetails = require('../models/index').ApplicationPaymentDetails
const UsersBasicDetails = require('../models/index').UsersBasicDetails


var applicationController = {
    /**
     * @function showDeclaration
     * @description Take user to the declaration page, after the application process has been completed
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @returns res.redirect
     */
    showDeclaration: function (req, res) {
        if (HelperService.getUserData(req, res).loggedIn) {
            return res.redirect('/review-summary');
        } else {
            return res.redirect('/declaration');
        }
    },

    /**
     * @function declarationPage
     * @description To show the declaration HTML/EJS template
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @returns res.view
     */
    declarationPage: function (req, res) {
        if (HelperService.getUserData(req, res).loggedIn) {
            applicationController.payForApplication(req, res);
            return null;
        }
        return res.view('applicationForms/declaration.ejs', {
            application_id: req.session.appId,
            error_report: false,
            submit_status: req.session.appSubmittedStatus,
            user_data: HelperService.getUserData(req, res),
        });
    },

    /**
     * @function confirmDeclaration
     * @description Confirmation agreed, take user to payment
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return null
     */
    confirmDeclaration: function (req, res) {
        var allInfoCorrect;
        if (req.param('all_info_correct')) {
            allInfoCorrect = 'okay';
        } else {
            allInfoCorrect = 'not ok';
        }

        var id = req.session.appId;

        /**
         * @function Update Application record -
         * @description Update Application table record with temporary value for the confirmation all is correct flag, this will get update later to a true boolean value
         * @param allInfoCorrect {Boolean} - Boolean in the db, string within the sailsapp to force successful validation
         */
        Application.update(
            {
                all_info_correct: allInfoCorrect,
            },
            {
                where: {
                    application_id: id,
                },
            }
        )
            .then(function () {
                applicationController.payForApplication(req, res);

                return null;
            })
            .catch(function (error) {
                sails.log.error(error);

                var erroneousFields = [];
                if (!req.param('all_info_correct')) {
                    erroneousFields.push('all_info_correct');
                }

                var params = {
                    application_id: req.session.appId,
                    error_report: ValidationService.validateForm({
                        error: error,
                        erroneousFields: erroneousFields,
                    }),
                    form_values: false,
                    update: false,
                    submit_status: req.session.appSubmittedStatus,
                    user_data: HelperService.getUserData(req, res),
                };

                return res.view('applicationForms/declaration.ejs', params);
            });
    },

    /**
     * @function payForApplication
     * @description Redirect to payment service, send the application ID
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return res.redirect
     */
    payForApplication: function (req, res) {
      const expectedAppType = [1]
      if (!HelperService.checkApplicationHasValidSession(req, expectedAppType)) {
          return res.serverError(`Reject this application as appType in session is invalid`);
      }

        var queryApplicationPrice_view =
            'select * from "vw_ApplicationPrice" where application_id=' +
            req.session.appId;

        sequelize
            .query(queryApplicationPrice_view, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(function (resultSet) {
                if (resultSet.length != 1) {
                    // throw error if we don't have exactly one result
                    var err = new Error(
                        'vw_ApplicationPrice returned ' +
                            resultSet.length +
                            ' rows instead of exactly 1'
                    );
                    this.emit('error', err);
                } else {
                    // should only be one result from query, return the total_price column value
                    var totalPrice = resultSet[0].total_price;

                    // if a user is currently logged in, get their payment reference
                    var payment_ref = '0';

                    const userLoggedIn = HelperService.LoggedInStatus(req);
                    if (userLoggedIn) {
                        payment_ref = req.session.payment_reference;
                    }

                    // add entry to payment details table (including payment ref if present)
                    ApplicationPaymentDetails.findOne({
                        where: { application_id: req.session.appId },
                    }).then(function (data) {
                        if (!data) {
                            ApplicationPaymentDetails.create({
                                application_id: req.session.appId,
                                payment_amount: totalPrice,
                                oneclick_reference: payment_ref,
                            })
                                .then(function () {
                                    // get URL for payment service (environment specific - override in /config/env/<environment>)
                                    var redirectUrl =
                                        sails.config.payment
                                            .paymentStartPageUrl;

                                    // redirect - posts to payment service URL (will include application_id from original request as post data)
                                    res.redirect(307, redirectUrl);

                                    return null;
                                })
                                .catch(function (error) {
                                    sails.log.error(error);
                                });
                        } else {
                            if (data.payment_complete) {
                                if (data.payment_status == 'AUTHORISED') {
                                    return res.view('paymentError.ejs', {
                                        application_id: req.session.appId,
                                        error_report: true,
                                        submit_status:
                                            req.session.appSubmittedStatus,
                                        user_data: HelperService.getUserData(
                                            req,
                                            res
                                        ),
                                    });
                                }

                                // Cancelled payment so carry on. Probably got here due to browser back button pushing
                            }

                            // update payment details in case price has changed
                            ApplicationPaymentDetails.update(
                                {
                                    payment_amount: totalPrice
                                },
                                {
                                    where: {
                                        application_id: req.session.appId,
                                    },
                                }
                            )
                                .then(function (created) {
                                    var redirectUrl =
                                        sails.config.payment
                                            .paymentStartPageUrl;
                                    // redirect - posts to payment service URL (will include application_id from original request as post data)
                                    return res.redirect(307, redirectUrl);
                                })
                                .catch(function (error) {
                                    sails.log.error(error);
                                });
                        }
                    });
                }

                return null;
            })
            .catch(function (error) {
                sails.log.error(error);
            });

        return null;
    },

    /**
     * @function submitApplication
     * @description Send application, via the exports table, to the IIZUKA Submission API
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return confirmation action
     */
    submitApplication: function (req, res) {
        const { id } = req.query;

        // This prevents users tampering with the URL
        // to render other user's application info
        const { appId } = req.session;
        if (id.toString() !== appId.toString()) {
          sails.log.error('User not authorised to view this application');
          return res.view('500',{});
        }

        sails.log.info(id + ' - attempting to submit application');
        Application.findOne({
            where: {
                application_id: id
            }
        })
            .then(function (application) {
                if (application !== null) {
                    sails.log.info(id + ' - has returned from Gov Pay');
                    if (application.submitted === 'draft') {
                        sails.log.info(
                            id + ' - has not been submitted previously'
                        );
                        sails.log.info(id + ' - exporting app data');
                        applicationController.exportAppData(req, application);
                    } else {
                        sails.log.info(id + ' - has been submitted previously');
                    }
                    if (application.serviceType === 1) {
                        sails.log.info(
                            id +
                                ' - displaying standard confirmation page to user'
                        );
                        return applicationController.confirmation(req, res);
                    } else if (application.serviceType === 4) {
                        sails.log.info(
                            id +
                                ' - displaying eApostille confirmation page to user'
                        );
                        return eAppSubmittedController.addDocsAndRenderPage(
                            req,
                            res
                        );
                    } else {
                        var businessApplicationController = require('./BusinessApplicationController');
                        sails.log.info(
                            id +
                                ' - displaying business confirmation page to user'
                        );
                        return businessApplicationController.confirmation(
                            req,
                            res
                        );
                    }
                }
            })
            .catch(function (error) {
                sails.log.error(id + ' - has encountered an error', error);
            });
    },

    /**
     * @function confirmation
     * @description Get specifics to populate the confirmation page
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return res.view
     */
    confirmation: function (req, res) {
        var application_id = req.query.id;
        var application_reference = req.query.appReference;
        async.series(
            {
                Application: function (callback) {
                    Application.findOne({
                        where: { application_id: application_id },
                    })
                        .then(function (found) {
                            var appDeets = null;
                            if (found) {
                                appDeets = found;
                            }
                            callback(null, appDeets);

                            return null;
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                },

                UsersBasicDetails: function (callback) {
                    UsersBasicDetails.findOne({
                        where: {
                            application_id: application_id,
                        },
                    })
                        .then(function (found) {
                            var basicDeets = null;
                            if (found) {
                                basicDeets = found;
                            }
                            callback(null, basicDeets);

                            return null;
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                },

                PostageDetails: function (callback) {
                    sequelize
                        .query(
                            'SELECT * FROM "PostagesAvailable" pa join "UserPostageDetails" upd on pa.id=upd.postage_available_id where upd.application_id=' +
                                application_id, {type: sequelize.QueryTypes.SELECT}
                        )
                        .then(function (results) {
                            var postDeets = null;
                            if (results) {
                                postDeets = results;
                            }
                            callback(null, postDeets);

                            return null;
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                },

                totalPricePaid: function (callback) {
                    sequelize
                        .query(
                            'SELECT * FROM "UserDocumentCount" udc where udc.application_id=' +
                                application_id, {type: sequelize.QueryTypes.SELECT}
                        )
                        .then(function (results) {
                            var totalDocPriceDeets = null;
                            if (results) {
                                totalDocPriceDeets = results[0];
                            }
                            callback(null, totalDocPriceDeets);

                            return null;
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                },

                documentsSelected: function (callback) {
                    sequelize
                        .query(
                            'SELECT * FROM "UserDocuments" ud join "AvailableDocuments" ad on ud.doc_id=ad.doc_id where ud.application_id=' +
                                application_id, {type: sequelize.QueryTypes.SELECT}
                        )
                        .then(function (results) {
                            var selectedDocDeets = null;
                            if (results) {
                                selectedDocDeets = results;
                            }
                            callback(null, selectedDocDeets);

                            return null;
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                },

                // get user_ref
                AdditionalApplicationInfo: function (callback) {
                    AdditionalApplicationInfo.findOne({
                        where: { application_id: application_id },
                    })
                        .then(function (found) {
                            var addInfoDeets = null;
                            if (found) {
                                addInfoDeets = found;
                            }
                            callback(null, addInfoDeets);
                            return null;
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                },
            },
            function (err, results) {
                // queue message for submission
                // set a session var for submission status, i.e. submitted
                req.session.appSubmittedStatus = true; //true submitted, false not submitted

                //update application_guid so it can be used as the key to print the cover sheet
                crypto.randomBytes(20, function (error, buf) {
                    var token = buf.toString('hex');

                    var id = application_id || req.session.appId;

                    var customer_ref =
                        results.AdditionalApplicationInfo.user_ref;

                    Application.update(
                        {
                            application_guid: token,
                        },
                        {
                            where: {
                                application_id: id,
                                submitted: {
                                  [Op.ne]: 'submitted' },
                            },
                        }
                    )
                        .then(function (updated) {
                            if (
                                req.session.email_sent &&
                                req.session.email_sent === true
                            ) {
                                //application found and updated with guid
                            } else if (
                                req.session.appId &&
                                req.session.appId !== 0
                            ) {
                                if (results.UsersBasicDetails.email !== null) {
                                    EmailService.submissionConfirmation(
                                        results.UsersBasicDetails.email,
                                        application_reference,
                                        HelperService.getSendInformation(
                                            results.PostageDetails
                                        ),
                                        customer_ref,
                                        results.Application.serviceType
                                    );

                                    req.session.email_sent = true;
                                }
                            } else {
                                //do nothing
                            }
                            return res.view(
                                'applicationForms/applicationSubmissionSuccessful.ejs',
                                {
                                    application_id: application_id,
                                    email: results.UsersBasicDetails.email,
                                    unique_application_id:
                                        results.Application.unique_app_id,
                                    postage_details: results.PostageDetails,
                                    total_price: results.totalPricePaid,
                                    docs_selected: results.documentsSelected,
                                    user_data: HelperService.getUserData(
                                        req,
                                        res
                                    ),
                                    user_ref:
                                        results.AdditionalApplicationInfo
                                            .user_ref,
                                    submit_status:
                                        req.session.appSubmittedStatus,
                                    helptext: helptext,
                                }
                            );
                        })
                        .catch(function (error) {
                            sails.log.error(error);
                        });
                });
            }
        );
    },

    /**
     * @function printCoverSheet
     * @description Display the printable version of the summary page
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return action
     */
    printCoverSheet: function (req, res) {
        summaryController.fetchAll(req, res, true);
    },

    /**
     * @function exportAppData
     * @description Move all relevent Application data provided by the user into the Exports table. This table can then be exported as a JSON object directly to the Submission API. This will also keep a history of applications made.
     * @param req {Array} - request object
     * @return send to rabbitmq response
     */
    exportAppData: function (req, application) {
      const appId = req.query.id;

      // Validate the appId to ensure it is a valid number
      if (!appId || isNaN(appId)) {
        sails.log.error('Invalid appId provided');
        return
      }

      const isEApp = application.serviceType === 4;
      const storedProdToUse = isEApp
        ? 'populate_exportedeApostilleAppdata'
        : 'populate_exportedapplicationdata';

      // Call PostgreSQL stored procedure using a parameterized query
      sails.log.info(appId + ' - exporting app data');
      sequelize
        .query(`SELECT * FROM ${storedProdToUse}(:appId)`, {
          replacements: { appId: appId },
          type: sequelize.QueryTypes.SELECT,
        })
        .then(() => {
          sails.log.info('Application export to exports table completed.');
          Application.update(
            {
              submitted: 'queued',
            },
            {
              where: {
                application_id: appId,
              },
            }
          )
            .then(function () {
              sails.log.info('queued ' + appId);
            })
            .catch(function (error) {
              sails.log.error(error);
            });
        })
        .catch(function (error) {
          sails.log.error(error);
        });
    },
};
module.exports = applicationController;

function makeQrCode(unique_app_id) {
    var qrCode = require('qrcode-npm');
    var qr = qrCode.qrcode(4, 'M');
    qr.addData(unique_app_id);
    qr.make();

    //  qr.createImgTag(4);    // creates an <img> tag as text
    // qr.createTableTag(4);  // creates a <table> tag as text
    return qr.createImgTag(2);


}
