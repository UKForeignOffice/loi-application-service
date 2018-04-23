/**
 * SummaryController module.
 * @module Controller SummaryController
 */

var summaryCtrl = {

    renderSummaryPage: function renderSummaryPage(req, res, printable, countryHasChanged) {
        printable = false;
        countryHasChanged = false;
        summaryCtrl.fetchAll(req, res, printable, countryHasChanged);
    },

    /**
     * Pulls all specific information provided by user as part of application process and render it all on the summary page
     * @param req
     * @param res
     * @param printable
     * @param countryHasChanged - boolean on whether the users address country has change.  This is used to render the appropriate return postage types.
     * @returns {*}
     */
    fetchAll: function (req, res, printable, countryHasChanged,dashboard) {
        req.session.return_address = 'Summary';
        req.session.summary = true;

        /**
         * If the users address country has change, the user must then change the return postage type,
         * so this forces the user to that page.
         *
         */
        if(typeof(countryHasChanged) !== 'undefined' && countryHasChanged === true){
            req.session.countryHasChanged = countryHasChanged;
            return res.redirect('/modify-postage-return-options');
        }

        fetch('{', printable);

        /*  fetch() is a recursive function that runs through the specified models creating a single data json,
         *   this can be used in the summary view as follows: data.Model.field  e.g. data.YourDetails.first_name
         *
         *   @param data - initial string
         *   @param printable - sets whether to display printable version of summary
         *   @return - returns the view passing the application_id and the data
         *
         *   */
        function fetch(data, printable) {
            var SummaryArray = {};

                async.series({

                        // get highlevel application details
                        Application: function (callback) {
                            Application.findOne({where: {application_id:req.session.appId}})
                                .then(function (found) {
                                    callback(null, found);
                                    return null;
                                })
                                .catch(function (error) {
                                    sails.log(error);
									console.log(error);
                                });
                        },

                        // Get Doc details
                        UserDocuments: function (callback) {
                            var documentDetailsSql = 'select * from "AvailableDocuments" ad join "UserDocuments" ud on ad."doc_id"=ud."doc_id" where  ud.application_id=' + req.session.appId;
                            sequelize.query(documentDetailsSql)
                                .spread(function (results, metadata) {
                                    var userDocsDeets = null;
                                    if (results.length > -1) {
                                        userDocsDeets = results;
                                    }
                                    callback(null, userDocsDeets);
                                    return null;
                                })
                                .catch(function (error) {
                                    sails.log(error);
									console.log(error);
                                });
                        },

                        // get user doc details
                        UserDocumentsCount: function (callback) {
                            UserDocumentCount.find(
                                {
                                    where: {
                                        application_id:req.session.appId
                                    }
                                }
                            )
                                .then(function (found) {
                                    var docDeets = null;
                                    if (found) {
                                        docDeets = found;
                                    }
                                    callback(null, docDeets);
                                    return null;
                                }).catch(function (error) {
                                    sails.log(error);
									                  console.log(error);
                                });


                        },

                        // get user details
                        UsersBasicDetails: function (callback) {
                            UsersBasicDetails.find(
                                {
                                    where: {
                                        application_id:req.session.appId
                                    }
                                }
                            )
                                .then(function (found) {
                                    var basicDeets = null;
                                    if (found) {
                                        basicDeets = found;
                                    }
                                    callback(null, basicDeets);
                                    return null;
                                }).catch(function (error) {
                                    sails.log(error);
									console.log(error);
                                });
                        },

                        // get user address details
                        AddressDetails: function (callback) {
                            AddressDetails.find(
                                {
                                    where: {
                                        application_id:req.session.appId,
                                        type: 'main'
                                    }
                                }
                            )
                                .then(function (found) {
                                    var addDeets = null;
                                    if (found) {
                                        addDeets = found.dataValues;
                                    }
                                    callback(null, addDeets);
                                    return null;
                                }).catch(function (error) {
                                    sails.log(error);
									console.log(error);
                                });
                        },

                        // get alt address details if any
                        AddressDetailsAlt: function (callback) {
                            AddressDetails.find(
                                {
                                    where: {
                                        application_id:req.session.appId,
                                        type: 'alt'
                                    }
                                }
                            )
                                .then(function (found) {
                                    var addDeetsAlt = null;
                                    if (found) {
                                        addDeetsAlt = found.dataValues;
                                    }
                                    callback(null, addDeetsAlt);
                                    return null;
                                }).catch(function (error) {
                                    sails.log(error);
									console.log(error);
                                });
                        },

                        //get user postage details
                        PostageDetails: function (callback) {
                            sequelize.query('SELECT * FROM "PostagesAvailable" pa join "UserPostageDetails" upd on pa.id=upd.postage_available_id where upd.application_id=' + req.session.appId + ' order by pa.id asc')
                                .spread(function (results, metadata) {
                                    found = results;
                                    var postDeets = null;
                                    if (found) {
                                        postDeets = found;
                                    }
                                    callback(null, postDeets);
                                    return null;
                                }).catch(function (error) {
                                    sails.log(error);
									console.log(error);
                                });

                        },

                        // get user address details
                        AdditionalApplicationInfo: function (callback) {
                            AdditionalApplicationInfo.find(
                                {
                                    where: {
                                        application_id:req.session.appId
                                    }
                                }
                            )
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
                    function (err, results) {
                        if (err) {
                            sails.log.error(err);
                        }
                        SummaryArray = results;

						if (printable) {
                            sequelize.query('SELECT DISTINCT application_id, payment_complete, payment_amount, payment_reference,id, "createdAt", "updatedAt", payment_status, oneclick_reference FROM "ApplicationPaymentDetails" WHERE application_id=' + req.session.appId )
                                .spread(function (payment_details, metadata) {

                                  if (payment_details[0].payment_complete===false){
                                    return res.view('404.ejs')

                                  } else {
                                    
                                  }

                                  return res.view('applicationForms/printApplicationCoverSheet.ejs',
                                        {
                                            application_id:req.session.appId,
                                            SummaryArray: SummaryArray,
                                            qrCode: "Application Identifier: " + makeQrCode(SummaryArray.Application.unique_app_id),
                                            submit_status: req.session.appSubmittedStatus,
                                            payment_details: payment_details[0],
                                            dashboard: dashboard,
                                            user_data: HelperService.getUserData(req,res)
                                        }
                                    );
                                });

                        } else {
                            req.session.country = SummaryArray.AddressDetails.country;

                            return res.view('applicationForms/summary.ejs',
                                {
                                    application_id:req.session.appId,
                                    SummaryArray: SummaryArray,
                                    loggedIn: HelperService.LoggedInStatus(req),
                                    usersEmail: HelperService.LoggedInUserEmail(req),
                                    submit_status: req.session.appSubmittedStatus,
                                    dashboard: false,
                                    user_data: HelperService.getUserData(req,res)
                                }
                            );
                        }

                    });
        }


        function makeQrCode(unique_app_id) {
            var qrCode = require('qrcode-npm');
            var qr = qrCode.qrcode(4, 'M');
            qr.addData(unique_app_id);
            qr.make();

            //  qr.createImgTag(4);    // creates an <img> tag as text
            // qr.createTableTag(4);  // creates a <table> tag as text
            return  qr.createImgTag(2);


        }


    }
};

module.exports = summaryCtrl;
