/**
 * BusinessApplicationController module.
 * @module Controller BusinessApplicationController
 */
var summaryController = require('./SummaryController');
var crypto = require('crypto');
var UserModels = require('../userServiceModels/models.js');



var businessApplicationController = {
    showDocumentQuantityPage: function (req, res) {

      if (req.session.appType != 1) {

        if (typeof req.session.search_history === "undefined") {
          // required to exist for eligibility checker
          req.session.search_history = [];
        }

      }

        UserDocumentCount.find({where:{application_id:req.session.appId}}).then(function(data){
            var user_data= HelperService.getUserData(req,res);
            if(user_data.account === null){
                req.flash('error','You need to complete your account details before using the premium service.');
                res.redirect(user_data.url+'/complete-details');
            }

            var selectedDocsCount = 0;
            if(data !== null){
              selectedDocsCount=data.doc_count;
            }
          else {
              if (typeof req.session.selectedDocuments !== "undefined"){
                selectedDocsCount=req.session.selectedDocuments.documents.length;
              }
            }
            return res.view('businessForms/documentQuantity',{
                application_id:req.session.appId,
                error_report: false,
                submit_status: req.session.appSubmittedStatus,
                current_uri: req.originalUrl,
                form_values: false,
                update: false,
                selected_docs_count:selectedDocsCount,
                doc_cost: req.session.appType == 2 ? 75 : 30,
                summary: false,
                user_data: HelperService.getUserData(req,res)});
        });

    },

    addDocumentCount: function (req, res) {
        UserDocumentCount.find({where:{application_id:req.session.appId}}).then(function(data){
            if(data === null){
                UserDocumentCount.create({
                    application_id:req.session.appId,
                    doc_count:req.body.documentCount,
                    price: req.body.documentCount *(req.session.appType == 2 ? 75 : 30)
                }).then(function(created){
                    return res.redirect('/business-additional-information');
                }).catch(function(error){
                    dataValues = [];
                    dataValues.push({
                        documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : ""
                    });
                    return res.view('businessForms/documentQuantity.ejs', {
                        application_id:req.session.appId,
                        error_report: ValidationService.validateForm({error: error}),
                        form_values: dataValues[0],
                        update: false,
                        return_address: req.param('return_address'),
                        selected_docs_count: false,
                        submit_status: req.session.appSubmittedStatus,
                        doc_cost: req.session.appType == 2 ? 75 : 30,
                        current_uri: req.originalUrl,
                        altAddress: req.session.altAddress,
                        user_data: HelperService.getUserData(req,res)
                    });
                });
            }else{
                UserDocumentCount.update({
                    doc_count:req.body.documentCount,
                    price: req.body.documentCount *(req.session.appType == 2 ? 75 : 30)
                },{
                    where:{application_id:req.session.appId}})
                    .then(function(created){
                        return res.redirect('/business-additional-information');
                    }).catch(function(error){
                        dataValues = [];
                        dataValues.push({
                            documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : ""
                        });
                        return res.view('businessForms/documentQuantity.ejs', {
                            application_id:req.session.appId,
                            error_report: ValidationService.validateForm({error: error}),
                            form_values: dataValues[0],
                            update: false,
                            return_address: req.param('return_address'),
                            selected_docs_count: false,
                            submit_status: req.session.appSubmittedStatus,
                            doc_cost: req.session.appType == 2 ? 75 : 30,
                            current_uri: req.originalUrl,
                            altAddress: req.session.altAddress,
                            user_data: HelperService.getUserData(req,res)
                        });
                    });
            }
        });
    },

    showAdditionalInformation: function (req,res) {
        Application.findOne({where:{application_id:req.session.appId}}) .then(function(application){
            var feedback_consent= application.feedback_consent;
            AdditionalApplicationInfo.findOne({where: {application_id:req.session.appId}}).then(function (data) {
                if(data === null){
                    return res.view('businessForms/additionalInformation.ejs', {
                        application_id:req.session.appId,
                        form_values: false,
                        error_report: false,
                        changing: false,
                        submit_status: req.session.appSubmittedStatus,
                        current_uri: req.originalUrl,
                        user_data: HelperService.getUserData(req,res)
                    });
                }else {
                    return res.view('businessForms/additionalInformation.ejs',
                        {
                            application_id:req.session.appId,
                            form_values: data,
                            feedback_consent: feedback_consent,
                            error_report: false,
                            changing: true,
                            update: true,
                            summary: req.session.summary,
                            submit_status: req.session.appSubmittedStatus,
                            current_uri: req.originalUrl,
                            user_data: HelperService.getUserData(req,res)
                        });
                }
            });
        });

    },

    addAdditionalInformation: function (req, res) {

        // catch those users who don't answer the Feedback Consent question
        var feedbackConsent = false;

        if (req.param('feedback_consent') === undefined) {
            feedbackConsent = false;
        }
        else {
            feedbackConsent = req.param('feedback_consent');
        }
        var user_ref = req.body.customer_ref || '';

        AdditionalApplicationInfo.find({where:{application_id:req.session.appId}}).then(function(data){
            if(data === null){
                AdditionalApplicationInfo.create({
                    application_id:req.session.appId,
                    user_ref:user_ref
                }).then(function(created){
                    Application.update({feedback_consent:feedbackConsent},{
                        where:{application_id:req.session.appId}
                    }).then(function(){
                        businessApplicationController.payForApplication(req,res);
                    });
                })
                    .catch(function(error){
                        dataValues = [];
                        dataValues.push({
                            user_ref:user_ref
                        });
                        return res.view('businessForms/additionalInformation.ejs', {
                            application_id:req.session.appId,
                            error_report: ValidationService.validateForm({error: error}),
                            form_values: dataValues[0],
                            update: false,
                            return_address: req.param('return_address'),
                            submit_status: req.session.appSubmittedStatus,
                            current_uri: req.originalUrl,
                            user_data: HelperService.getUserData(req,res)
                        });
                    });
            }else{
                AdditionalApplicationInfo.update({
                    user_ref:user_ref
                },{
                    where:{application_id:req.session.appId}})
                    .then(function(created){
                        Application.update({feedback_consent:feedbackConsent},{
                            where:{application_id:req.session.appId}
                        }).then(function(){
                            businessApplicationController.payForApplication(req,res);
                        });
                    })
                    .catch(function(error){
                        dataValues = [];
                        dataValues.push({
                            user_ref: req.param('customer_ref') !== '' ? req.param('customer_ref') : ""
                        });
                        return res.view('businessForms/additionalInformation.ejs', {
                            application_id:req.session.appId,
                            error_report: ValidationService.validateForm({error: error}),
                            form_values: dataValues[0],
                            update: false,
                            return_address: req.param('return_address'),
                            submit_status: req.session.appSubmittedStatus,
                            current_uri: req.originalUrl,
                            user_data: HelperService.getUserData(req,res)
                        });
                    });
            }
        });
    },

    payForApplication: function(req,res) {
        UserDocumentCount.findOne({where:{application_id:req.session.appId}}).then(function(data) {
            // should only be one result from query, return the total_price column value
            var totalPrice = data.price;
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
        });

    },

    exportAppData: function(req,res){
        var appId = req.query.merchantReturnData;
        //Call postgres stored procedure to insert and returns 1 if successful or 0 if no insert occurred
        sequelize.query('SELECT * FROM populate_exportedbusinessapplicationdata(' + appId + ')')
            .then(function (results) {
                sails.log("Application export to exports table completed.");
                HelperService.sendRabbitSubmissionMessage(appId);
            })
            .catch(Sequelize.ValidationError, function (error) {
                sails.log(error);
            });
    },

    confirmation: function(req,res){
        var application_id = req.query.merchantReturnData;
        var application_reference = req.query.merchantReference;
        async.series(
            {
                Application: function (callback) {
                    Application.find({where: {application_id: application_id}})
                        .then(function (found) {
                            var appDeets = null;
                            if (found) {
                                appDeets = found;
                            }
                            callback(null, appDeets);

                            return null;
                        }).catch(function (error) {
                            sails.log(error);
                        });
                },

                UserDetails: function (callback) {
                    UserModels.User.findOne({where:{email:req.session.email}}).then(function(user) {
                        UserModels.AccountDetails.findOne({where:{user_id:user.id}}).then(function(account){
                            var userDetails = [null,null];

                            if (user) {
                                userDetails[0] = user;
                            }
                            if (account) {
                                userDetails[1] = account;
                            }
                            callback(null, userDetails);

                            return null;
                        });
                    });

                },

                Receipt: function (callback) {
                    sequelize.query('SELECT * FROM "UserDocumentCount" udc where udc.application_id=' + application_id)
                        .spread(function (results, metadata) {
                            var totalDocPriceDeets = null;
                            if (results) {
                                totalDocPriceDeets = (results[0]);
                            }
                            callback(null, totalDocPriceDeets);

                            return null;
                        }).catch(function (error) {
                            sails.log(error);
                        });
                }

            },
            function (err, results) {
                if(!req.session.appSubmittedStatus) {
                    EmailService.submissionConfirmation(results.UserDetails[0].email, application_reference, HelperService.getBusinessSendInformation(results.Application.serviceType));
                }
                req.session.appSubmittedStatus = true; //true submitted, false not submitted
                return res.view('businessForms/application-successful.ejs',
                    {
                        application_id: application_id,
                        email: results.UserDetails[0].email,
                        unique_application_id: results.Application.unique_app_id,
                        application_type: results.Application.serviceType,
                        receipt: results.Receipt,
                        submit_status: req.session.appSubmittedStatus,
                        user_data: HelperService.getUserData(req,res)
                    });
            });
        }
};
module.exports = businessApplicationController;
