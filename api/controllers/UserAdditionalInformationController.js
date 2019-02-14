/**
 * AdditionalApplicationInfoController module.
 * @module Controller AdditionalApplicationInfoController
 */
var applicationController   = require('./ApplicationController');

var UserAdditionalInfoCtrl = {

    /**
     * Render the additional information page, executing the populate form method
     * if previous records are found, meaning it would be an update.
     * @param req
     * @param res
     */
    additionalInformationDetailsPage: function(req, res) {
               AdditionalApplicationInfo.findAll({where: {
                    application_id:req.session.appId
                }
            }
        )
            .then(function(data) {
                if(1>data.length) {
                    return res.view('applicationForms/additionalInformation.ejs', {
                        application_id:req.session.appId,
                        form_values: false,
                        error_report: false,
                        changing: req.session.summary ?  true : false,
                        submit_status: req.session.appSubmittedStatus,
                        user_data: HelperService.getUserData(req,res),
                        current_uri: req.originalUrl,
                        summary: req.session.summary
                    });
                }else{
                    var nextPage='summary';
                    var anUpdate = false;
                    return UserAdditionalInfoCtrl.populateAdditionalInfoForm(req,res,nextPage,anUpdate);
                }
            }).catch( function(error) {
                sails.log(error);
            });
    },

    /**
     * Insert user entered information into the database
     * @param req
     * @param res
     * @returns {*}
     */
    addAdditionalInfo: function (req, res) {
        var feedbackConsent = '';

        if (typeof(req.param('feedback_consent')) != 'undefined') {
            feedbackConsent = JSON.parse(req.param('feedback_consent'));
        }

            AdditionalApplicationInfo.findAll(
                {
                    where: {
                        application_id:req.session.appId
                    }
                }
            ).then(function (data) {
                    if (data.length > 0) {
                        AdditionalApplicationInfo.update({
                                user_ref: req.param('customer_ref')
                            },
                            {
                                where: {
                                    application_id:req.session.appId
                                }
                            })
                            .then(function () {
                            Application.update({
                                    feedback_consent: feedbackConsent
                                },
                                {
                                    where: {application_id:req.session.appId}
                                })
                                .then(function () {
                                    req.session.return_address = 'Summary';
                                    //summaryController.fetchAll(req, res, false);

                                    res.redirect('/review-summary');

                                    return null;
                                })
                                .catch(Sequelize.ValidationError, function (error) {
                                    sails.log(error);
                                    //console.log('b: ', error);

                                    return res.view('applicationForms/additionalInformation.ejs', {
                                        application_id:req.session.appId,
                                        form_values: req.body,
                                        error_report: ValidationService.validateForm({error: error}),
                                        changing: req.session.summary ?  true : false,
                                        submit_status: req.session.appSubmittedStatus,
                                        user_data: HelperService.getUserData(req,res),
                                        current_uri: req.originalUrl,
                                        summary: req.session.summary
                                    });

                                });
                            return null;
                        })
                            .catch(Sequelize.ValidationError, function (error) {
                                sails.log(error);
                                return res.view('applicationForms/additionalInformation.ejs', {
                                    application_id:req.session.appId,
                                    form_values: req.body,
                                    error_report: ValidationService.validateForm({error: error}),
                                    changing: req.session.summary ?  true : false,
                                    submit_status: req.session.appSubmittedStatus,
                                    user_data: HelperService.getUserData(req,res),
                                    current_uri: req.originalUrl,
                                    summary: req.session.summary
                                });
                            });
                    } else {
                        AdditionalApplicationInfo.create({
                            application_id:req.session.appId,
                            user_ref: req.param('customer_ref')
                        })
                            .then(function (result) {
                            Application.update({
                                    feedback_consent: feedbackConsent
                                },
                                {
                                    where: {application_id:req.session.appId}
                                })
                                .then(function () {
                                    //summaryController.fetchAll(req, res, false);

                                    res.redirect('/review-summary');

                                    return null;
                                })
                                .catch(Sequelize.ValidationError, function (error) {
                                    sails.log(error);
                                    //console.log('b: ', error);

                                    return res.view('applicationForms/additionalInformation.ejs', {
                                        application_id:req.session.appId,
                                        form_values: false,
                                        error_report: ValidationService.validateForm({error: error}),
                                        changing: false,
                                        submit_status: req.session.appSubmittedStatus,
                                        user_data: HelperService.getUserData(req,res),
                                        current_uri: req.originalUrl,
                                        summary: req.session.summary
                                    });

                                });

                            return null;
                        })
                            .catch(Sequelize.ValidationError, function (error) {
                                console.log(error);
                                sails.log(error);
                                return res.view('applicationForms/additionalInformation.ejs', {
                                    application_id:req.session.appId,
                                    form_values: false,
                                    error_report: ValidationService.validateForm({error: error}),
                                    changing: false,
                                    submit_status: req.session.appSubmittedStatus,
                                    user_data: HelperService.getUserData(req,res),
                                    current_uri: req.originalUrl,
                                    summary: req.session.summary
                                });
                            });
                    }

                    return null;
                }).catch(function (error) {
                    sails.log(error);
                });

        //} else {
        //    req.flash('message', 'Session timed out, please start a new applications.');
        //    res.redirect('/start');
        //}

    },


    /**
     * Populate the Additional Information page with details the user previously entered, as this is an update
     * @param req
     * @param res
     */
    populateAdditionalInfoForm: function(req, res,nextPage,anUpdate) {
        anUpdate = true;

        var summary=false;
        if( req.session.return_address!='Summary'){ req.session.return_address='Summary';}
        else{
            summary=true;
        }

        Application.findOne({
            where:{
                application_id:req.session.appId
            }
        })
            .then(function(data){
                var feedback_consent= data.feedback_consent;

                AdditionalApplicationInfo.findOne(
                    {
                        where: {
                            application_id:req.session.appId
                        }
                    }
                )
                    .then(function(data){
                        return res.view('applicationForms/additionalInformation.ejs',
                            {application_id:req.session.appId,
                                form_values: data.dataValues,
                                feedback_consent:feedback_consent,
                                error_report: false,
                                changing:req.session.summary ?  true : false,
                                update:anUpdate===true?true:false,
                                summary:req.session.summary,
                                submit_status: req.session.appSubmittedStatus,
                                user_data: HelperService.getUserData(req,res),
                                current_uri: req.originalUrl
                            });
                    }
                ).catch( function(err) {
                        sails.log(error);
                    });
            });
    },

    /**
     * Take user to the Modify Additional Information Page, but via a redirect so the method used is a POST, thus allowing the browser
     * back button to be used without hte need for refreshing the page
     * @param req
     * @param res
     */
    renderAdditionalInformationPage: function renderAdditionalInformationPage(req, res) {
        res.redirect('/modify-additional-information');
    }

};

module.exports = UserAdditionalInfoCtrl;
