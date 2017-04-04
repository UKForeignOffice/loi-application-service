/**
 * ApplicationController module.
 * @module Controller ApplicationController
 */
var summaryController = require('./SummaryController');
var crypto = require('crypto');

var applicationStarted = false;
var createdData;
var helptext = require('../../config/helptext');

var applicationController = {


    /**
     * @function showDeclaration
     * @description Take user to the declaration page, after the application process has been completed
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @returns res.redirect
     */
    showDeclaration: function(req, res) {
        if(HelperService.getUserData(req,res).loggedIn) {
            return res.redirect('/review-summary');
        }else{
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
    declarationPage: function(req, res) {
        if(HelperService.getUserData(req,res).loggedIn){
            applicationController.payForApplication(req, res);
            return null;
        }
        return res.view('applicationForms/declaration.ejs', {
            application_id: req.session.appId,
            error_report: false,
            submit_status: req.session.appSubmittedStatus,
            user_data: HelperService.getUserData(req, res)
        });
    },

    /**
     * @function confirmDeclaration
     * @description Confirmation agreed, take user to payment
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return null
     */
    confirmDeclaration: function(req, res) {
        var allInfoCorrect;
        if (req.param('all_info_correct')) {
            allInfoCorrect = "okay";
        } else {
            allInfoCorrect = "not ok";
        }

        var id = req.session.appId;

        /**
         * @function Update Application record -
         * @description Update Application table record with temporary value for the confirmation all is correct flag, this will get update later to a true boolean value
         * @param allInfoCorrect {Boolean} - Boolean in the db, string within the sailsapp to force successful validation
         */
        Application.update({
            all_info_correct: allInfoCorrect
        }, {
            where: {
                application_id: id
            }
        })
            .then(function() {

                applicationController.payForApplication(req, res);

                return null;

            })
            .catch(Sequelize.ValidationError, function(error) {
                sails.log(error);

                var erroneousFields = [];
                if (!req.param('all_info_correct')) {
                    erroneousFields.push('all_info_correct');
                }

                var params = {
                    application_id: req.session.appId,
                    error_report: ValidationService.validateForm({ error: error, erroneousFields: erroneousFields }),
                    form_values: false,
                    update: false,
                    submit_status: req.session.appSubmittedStatus,
                    user_data: HelperService.getUserData(req, res)
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
    payForApplication: function(req, res) {
        // payment code
        var queryApplicationPrice_view = 'select * from "vw_ApplicationPrice" where application_id=' + req.session.appId;

        sequelize.query(queryApplicationPrice_view, { type: sequelize.QueryTypes.SELECT })
            .then(function(resultSet) {

                if (resultSet.length != 1) {
                    // throw error if we don't have exactly one result
                    var err = new Error("vw_ApplicationPrice returned " + resultSet.length + " rows instead of exactly 1");
                    this.emit('error', err);
                }
                else {
                    // should only be one result from query, return the total_price column value
                    var totalPrice = resultSet[0].total_price;

                    // if a user is currently logged in, get their payment reference
                    var payment_ref = '0';
                    if (req.session && req.session.passport && req.session.passport.user && req.session.payment_reference) {
                        payment_ref = req.session.payment_reference;
                    }

                    // add entry to payment details table (including payment ref if present)
                    ApplicationPaymentDetails.find({where:{application_id:req.session.appId}}).then(function(data) {
                        if(!data){
                            ApplicationPaymentDetails.create({
                                application_id: req.session.appId,
                                payment_amount: totalPrice,
                                oneclick_reference: payment_ref
                            })
                                .then(function () {

                                    // get URL for payment service (environment specific - override in /config/env/<environment>)
                                    var redirectUrl = sails.config.payment.paymentStartPageUrl;

                                    // redirect - posts to payment service URL (will include application_id from original request as post data)
                                    res.redirect(307, redirectUrl);

                                    return null;
                                })
                                .catch(function (error) {
                                    sails.log(error);
                                });
                        }else{

                            if (data.payment_complete) {

                                if (data.payment_status == "AUTHORISED"){
                                    return res.view('paymentError.ejs', {
                                        application_id: req.session.appId,
                                        error_report: true,
                                        submit_status: req.session.appSubmittedStatus,
                                        user_data: HelperService.getUserData(req, res)
                                    });
                                }

                                // Cancelled payment so carry on. Probably got here due to browser back button pushing
                            }

                            // update payment details in case price has changed
                            ApplicationPaymentDetails.update({
                                payment_amount: totalPrice
                            },{
                                where:{application_id:req.session.appId}})
                                .then(function(created){

                                    var redirectUrl = sails.config.payment.paymentStartPageUrl;
                                    // redirect - posts to payment service URL (will include application_id from original request as post data)
                                    res.redirect(307, redirectUrl);

                                }).catch(function(error){
                                    sails.log(error);
                                });

                        }


                    });

                }

                return null;

            })
            .catch(function(error) {
                sails.log(error);
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
    submitApplication: function(req, res) {
        //check that the application has not already been queued or submitted
        var id = req.query.merchantReturnData;
        Application.findOne({
            where: {
                application_id: id,
                submitted: 'draft'
            }
        }).then(function(application) {
            if (application !== null) {
                if (!req.session.appSubmittedStatus) {
                    applicationController.exportAppData(req, res);
                }

                if (application.serviceType == 1) {
                    applicationController.confirmation(req, res);
                }
                else {
                    var businessApplicationController = require('./BusinessApplicationController');
                    businessApplicationController.confirmation(req, res);
                }
            }
            else {
                Application.findOne({
                    where: {
                        application_id: id
                    }
                }).then(function(application) {
                    if (application.serviceType == 1) {
                        return applicationController.confirmation(req, res);
                    }
                    else {
                        var businessApplicationController = require('./BusinessApplicationController');
                        return businessApplicationController.confirmation(req, res);
                    }
                });
            }
        });
    },

    /**
     * @function confirmation
     * @description Get specifics to populate the confirmation page
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return res.view
     */
    confirmation: function(req, res) {

        var application_id = req.query.merchantReturnData;
        var application_reference = req.query.merchantReference;
        async.series(
            {
                Application: function(callback) {
                    Application.find({ where: { application_id: application_id } })
                        .then(function(found) {
                            var appDeets = null;
                            if (found) {
                                appDeets = found;
                            }
                            callback(null, appDeets);

                            return null;
                        }).catch(function(error) {
                            sails.log(error);
                        });
                },

                UsersBasicDetails: function(callback) {
                    UsersBasicDetails.find(
                        {
                            where: {
                                application_id: application_id
                            }
                        }
                    )
                        .then(function(found) {
                            var basicDeets = null;
                            if (found) {
                                basicDeets = found;
                            }
                            callback(null, basicDeets);

                            return null;
                        }).catch(function(error) {
                            sails.log(error);
                        });
                },

                PostageDetails: function(callback) {
                    sequelize.query('SELECT * FROM "PostagesAvailable" pa join "UserPostageDetails" upd on pa.id=upd.postage_available_id where upd.application_id=' + application_id)
                        .spread(function(results, metadata) {
                            var postDeets = null;
                            if (results) {
                                postDeets = results;
                            }
                            callback(null, postDeets);

                            return null;
                        }).catch(function(error) {
                            sails.log(error);
                        });
                },

                totalPricePaid: function(callback) {
                    sequelize.query('SELECT * FROM "UserDocumentCount" udc where udc.application_id=' + application_id)
                        .spread(function(results, metadata) {
                            var totalDocPriceDeets = null;
                            if (results) {
                                totalDocPriceDeets = (results[0]);
                            }
                            callback(null, totalDocPriceDeets);

                            return null;
                        }).catch(function(error) {
                            sails.log(error);
                        });
                },

                documentsSelected: function(callback) {
                    sequelize.query('SELECT * FROM "UserDocuments" ud join "AvailableDocuments" ad on ud.doc_id=ad.doc_id where ud.application_id=' + application_id)
                        .spread(function(results, metadata) {
                            var selectedDocDeets = null;
                            if (results) {
                                selectedDocDeets = results;
                            }
                            callback(null, selectedDocDeets);

                            return null;
                        }).catch(function(error) {
                            sails.log(error);
                        });
                },

              // get user_ref
              AdditionalApplicationInfo: function (callback) {
                AdditionalApplicationInfo.find({where: {application_id: application_id}})
                  .then(function (found) {
                    var addInfoDeets = null;
                    if (found) {
                      addInfoDeets = found;
                    }
                    callback(null, addInfoDeets);
                    return null;
                  }).catch(function (error) {
                  sails.log(error);
                  console.log(error);
                });
              }

            },
            function(err, results) {

                // queue message for submission
                // set a session var for submission status, i.e. submitted
                req.session.appSubmittedStatus = true; //true submitted, false not submitted

                //update application_guid so it can be used as the key to print the cover sheet
                crypto.randomBytes(20, function(error, buf) {
                    var token = buf.toString('hex');

                    var id = application_id || req.session.appId;

                    var customer_ref = results.AdditionalApplicationInfo.user_ref

                    Application.update({
                        application_guid: token
                    }, {
                        where: {
                            application_id: id,
                            submitted: { ne: 'submitted' }
                        }
                    })
                        .then(function(updated) {
                            if (req.session.email_sent && req.session.email_sent===true) {
                                //application found and updated with guid
                            }else{
                                if (results.UsersBasicDetails.email !== null) {
                                    EmailService.submissionConfirmation(results.UsersBasicDetails.email, application_reference, HelperService.getSendInformation(results.PostageDetails), customer_ref);
                                    req.session.email_sent= true;
                                }
                            }
                            return res.view('applicationForms/applicationSubmissionSuccessful.ejs',
                                {
                                    application_id: application_id,
                                    email: results.UsersBasicDetails.email,
                                    unique_application_id: results.Application.unique_app_id,
                                    postage_details: results.PostageDetails,
                                    total_price: results.totalPricePaid,
                                    docs_selected: results.documentsSelected,
                                    user_data: HelperService.getUserData(req, res),
                                    user_ref: results.AdditionalApplicationInfo.user_ref,
                                    submit_status: req.session.appSubmittedStatus,
                                    helptext: helptext
                                });


                        })
                        .catch(Sequelize.ValidationError, function(error) {
                            sails.log(error);
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
    printCoverSheet: function(req, res) {
        summaryController.fetchAll(req, res, true);
    },


     /**
     * @function exportAppData
     * @description Move all relevent Application data provided by the user into the Exports table. This table can then be exported as a JSON object directly to the Submission API. This will also keep a history of applications made.
     * @param req {Array} - request object
     * @return send to rabbitmq response
     */
    exportAppData: function(req, res) {

        var appId = req.query.merchantReturnData;
        //Call postgres stored procedure to insert and returns 1 if successful or 0 if no insert occurred
        sequelize.query('SELECT * FROM populate_exportedapplicationdata(' + appId + ')')
            .then(function(results) {
                sails.log("Application export to exports table completed.");
                HelperService.sendRabbitSubmissionMessage(appId);
            })
            .catch(Sequelize.ValidationError, function(error) {
                sails.log(error);
            });
    }

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
