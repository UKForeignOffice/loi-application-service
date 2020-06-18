/**
 * ApplicationTypeController module.
 * @module Controller ApplicationTypeController
*/

var    UserModels = require('../userServiceModels/models.js');

var validator = require('validator');
var moment = require('moment');
module.exports = {


    /**
     * @function start()
     * @description Start the application process take the user to service selection page. Sent as a POST via a redirect to allow the browser back button to work without refreshing the paghe
     * @param req
     * @param res
     * @return res.redirect
     */
    start: function (req, res) {
        req.session.appSubmittedStatus = false;
        req.session.selectedDocs = [];
        req.session.selectedDocsCount = [];
        req.session.searchTerm = '';
        if(req.query.from){
            if(req.query.from=='dashboard'){
                req.session.startBackLink = '/dashboard';
            }else if(req.query.from == 'home'){
                req.session.startBackLink = '/';
            }
        }
        else{
            req.session.startBackLink = false;
        }
        return res.redirect('/select-service');
    },

    /**
     * @function serviceSelectorPage()
     * @description Render the basic user details page depending on if this is an update or a new application
     * @param req
     * @param res
     * @return res.view
     */
    serviceSelectorPage: function(req, res) {
      // clear down eligibility checker selected documents
      req.session.search_history =[];
      //reset the selected documents
      req.session.selectedDocuments = {
        totalDocCount: 0,
        documents: []
      };
      let disableStandardServiceSection = false;

        if(HelperService.LoggedInStatus(req)) {
            return UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
                return UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
                  let standardServiceRestrictionsEnabled = sails.config.standardServiceRestrictions.enableRestrictions
                  let maxNumOfStandardAppSubmissionsInTimeFrame = sails.config.standardServiceRestrictions.maxNumOfAppSubmissionsInTimeFrame
                  let standardAppCountQuery = 'SELECT count(*) FROM "Application" WHERE "user_id" =:userId and "serviceType" = 1 and "createdAt" > NOW() - INTERVAL \'' + sails.config.standardServiceRestrictions.appSubmissionTimeFrameInDays + ' days\' and ("submitted" =:submitted OR "submitted" =:queued)';

                  return sequelize.query(standardAppCountQuery,{ replacements: {userId: user.id, submitted: 'submitted', queued: 'queued'}, type: sequelize.QueryTypes.SELECT }).then(function (appCount) {

                    if (standardServiceRestrictionsEnabled && appCount[0].count >= maxNumOfStandardAppSubmissionsInTimeFrame) {
                      disableStandardServiceSection = true
                    }

                    req.session.user = user;
                    req.session.account = account;
                    req.session.appId = false; // reset the appId so a new session is used
                    // set initial submit status to false, meaning it application has not yet been submitted
                    req.session.appSubmittedStatus = false;
                    req.session.email_sent = false;

                    return res.view('applicationForms/applicationType.ejs', {
                        application_id: 0,
                        userServiceURL: sails.config.customURLs.userServiceURL,
                        error_report: false,
                        changing: false,
                        form_values: false,
                        submit_status: req.session.appSubmittedStatus,
                        current_uri: req.originalUrl,
                        user_data: HelperService.getUserData(req,res),
                        back_link: req.session.startBackLink,
                        disableStandardServiceSection: disableStandardServiceSection
                    });
                  });
                });
            });

        }else{
            req.session.appId = false; // reset the appId so a new session is used
            // set initial submit status to false, meaning it application has not yet been submitted
            req.session.appSubmittedStatus = false;

            return res.view('applicationForms/applicationType.ejs', {
                application_id: 0,
                userServiceURL: sails.config.customURLs.userServiceURL,
                error_report: false,
                changing: false,
                form_values: false,
                submit_status: req.session.appSubmittedStatus,
                current_uri: req.originalUrl,
                user_data: HelperService.getUserData(req,res),
                back_link: req.session.startBackLink,
                disableStandardServiceSection: disableStandardServiceSection
            });

        }
    },


  /**
   * @function serviceSelectorPageTemp()
   * @description Render the basic user details page depending on if this is an update or a new application
   * @param req
   * @param res
   * @return res.view
   */
  serviceSelectorPageTemp: function(req, res) {
    // clear down eligibility checker selected documents
    req.session.search_history =[];
    //reset the selected documents
    req.session.selectedDocuments = {
      totalDocCount: 0,
      documents: []
    };
    let disableStandardServiceSection = false;

    if(HelperService.LoggedInStatus(req)) {
      return UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
        return UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
          let standardServiceRestrictionsEnabled = sails.config.standardServiceRestrictions.enableRestrictions
          let maxNumOfStandardAppSubmissionsInTimeFrame = sails.config.standardServiceRestrictions.maxNumOfAppSubmissionsInTimeFrame
          let standardAppCountQuery = 'SELECT count(*) FROM "Application" WHERE "user_id" =:userId and "serviceType" = 1 and "createdAt" > NOW() - INTERVAL \'' + sails.config.standardServiceRestrictions.appSubmissionTimeFrameInDays + ' days\' and ("submitted" =:submitted OR "submitted" =:queued)';

          return sequelize.query(standardAppCountQuery,{ replacements: {userId: user.id, submitted: 'submitted', queued: 'queued'}, type: sequelize.QueryTypes.SELECT }).then(function (appCount) {

            if (standardServiceRestrictionsEnabled && appCount[0].count >= maxNumOfStandardAppSubmissionsInTimeFrame) {
              disableStandardServiceSection = true
            }

            req.session.user = user;
            req.session.account = account;
            req.session.appId = false; // reset the appId so a new session is used
            // set initial submit status to false, meaning it application has not yet been submitted
            req.session.appSubmittedStatus = false;
            req.session.email_sent = false;

            return res.view('applicationForms/applicationTypeTemp.ejs', {
              application_id: 0,
              userServiceURL: sails.config.customURLs.userServiceURL,
              error_report: false,
              changing: false,
              form_values: false,
              submit_status: req.session.appSubmittedStatus,
              current_uri: req.originalUrl,
              user_data: HelperService.getUserData(req,res),
              back_link: req.session.startBackLink,
              disableStandardServiceSection: disableStandardServiceSection
            });
          });
        });
      });

    }else{
      req.session.appId = false; // reset the appId so a new session is used
      // set initial submit status to false, meaning it application has not yet been submitted
      req.session.appSubmittedStatus = false;

      return res.view('applicationForms/applicationTypeTemp.ejs', {
        application_id: 0,
        userServiceURL: sails.config.customURLs.userServiceURL,
        error_report: false,
        changing: false,
        form_values: false,
        submit_status: req.session.appSubmittedStatus,
        current_uri: req.originalUrl,
        user_data: HelperService.getUserData(req,res),
        back_link: req.session.startBackLink,
        disableStandardServiceSection: disableStandardServiceSection
      });

    }
  },


    /**
     * @function newApplication()
     * @description A new application started.
     * @param req
     * @param res
     * @return res.view
     */
    newApplication: function (req, res) {
        var company_name = req.session.user && (req.session.user.premiumEnabled || req.session.user.dropOffEnabled) ? req.session.account.company_name :'N/A';


        var selectedServiceType = req.param('app_type_group');
        if (typeof selectedServiceType == 'undefined') {
            selectedServiceType = 'not ok';
        }

        if(selectedServiceType!=1 && !HelperService.LoggedInStatus(req)){
            return res.redirect(sails.config.customURLs.userServiceURL+'/usercheck?next=premiumCheck');
        }

        /**
         * Check the last application reference to ensure a unique reference is assigned to each new application.
         */
        ApplicationReference.findOne()
            .then(function (data) {

                var uniqueApplicationId = HelperService.generateNewApplicationId(data, selectedServiceType);

                /**
                 * Query db for generated applicationid.  If none returned, application id is indeed unique.
                 * set a dummy value for the service type, as this will get changed on Page 2 when the user has actually chosen a service type
                 */
                return sequelize.query('SELECT unique_app_id FROM "Application" WHERE unique_app_id = \'' + uniqueApplicationId + '\';')
                    .spread(function (result, metadata) {

                        // add this to overcome issue with users coming from user management site
                        // where they must register.  registration/login disabled for now.
                        if (req.session && req.session.passport && req.session.passport.user) {
                            user_id = req.session.passport.user;
                        }
                        else {
                            user_id = 0;
                        }

                        if (result.length !== 0) {
                            sails.log.warn('ID already taken, redirecting back to start page');

                            res.redirect('/start');

                            throw "ID already taken";

                        } else
                        {
                            return Application.create({
                                serviceType: selectedServiceType,
                                unique_app_id: uniqueApplicationId,
                                all_info_correct: "-1",
                                user_id: user_id,
                                submitted: 'draft',
                                company_name :company_name,
                                feedback_consent: 0, // set initial value to false to allow create to work
                                doc_reside_EU: 0,
                                residency: 0


                            })
                                .then(function (created) {

                                    createdData = created;

                                    //wipe other session variables
                                    req.session.selectedDocs = '';
                                    req.session.return_address = '';
                                    req.session.appId = false;
                                    req.session.appSubmittedStatus = false;

                                    // Save APPID and ServiceType as NEW sessions
                                    req.session.appId = created.application_id;
                                    req.session.appType = parseInt(req.param('app_type_group'));
                                    if(req.session.appType != 1){
                                        UserModels.User.findOne({where:{email:req.session.email}}).then(function(user) {
                                            UserModels.AccountDetails.findOne({where:{user_id:user.id}}).then(function(account){
                                                UsersBasicDetails.create({
                                                    application_id:req.session.appId,
                                                    first_name: account.first_name,
                                                    last_name: account.last_name,
                                                    telephone: account.telephone,
                                                  mobileNo: account.mobileNo,
                                                  email: user.email,
                                                    confirm_email: user.email,
                                                    has_email: true
                                                }).then(function(){
                                                    if (req.session.appType ==2) {
                                                        return res.redirect('/business-document-quantity?pk_campaign=Premium-Service&pk_kwd=Premium');
                                                    }
                                                    else if (req.session.appType ==3) {
                                                        return res.redirect('/business-document-quantity?pk_campaign=DropOff-Service&pk_kwd=DropOff');
                                                    }
                                                });
                                            });
                                        });
                                    }
                                    else  if (req.session.appType == 1){
                                        req.session.summary = false; // Reset summary session variable
                                        req.session.useDetails = true;
                                        HelperService.resetAddressSessionVariables(req,res);

                                        return res.redirect('/choose-documents-or-skip?pk_campaign=Standard-Service&pk_kwd=Standard');
                                    }
                                })
                                .catch(Sequelize.ValidationError, function (error) {
                                    sails.log.error(error);

                                    var erroneousFields = [];
                                    if (!selectedServiceType || selectedServiceType==='not ok') { erroneousFields.push('app_type_group'); }

                                    return res.view('applicationForms/applicationType.ejs', {application_id:req.session.appId,userServiceURL: sails.config.customURLs.userServiceURL,
                                        error_report: ValidationService.validateForm({error:error, erroneousFields: erroneousFields}), form_values: false, update: false,
                                        submit_status: req.session.appSubmittedStatus,
                                        current_uri: req.originalUrl,
                                        user_data: HelperService.getUserData(req,res)});
                                });
                        }
                    });
            });
    },

    /**
     * @function populateApplicationType()
     * @description Populate the Application Type form with the relevent information as an update is being performed.
     * @param req
     * @param res
     * @return res.view
     */
    populateApplicationType: function(req, res) {

        Application.findOne({where: {
                application_id: req.session.appId
            }}
        )
            .then(function(data){
                return res.view('applicationForms/applicationType.ejs',{application_id:req.session.appId,userServiceURL: sails.config.customURLs.userServiceURL,
                    return_address:req.param('return_address'), form_values: data.dataValues, update: true, error_report: false,
                    loggedIn: HelperService.LoggedInStatus(req), usersEmail: HelperService.LoggedInUserEmail(req),
                    submit_status: req.session.appSubmittedStatus,
                    current_uri: req.originalUrl
                });
            })

            .catch(Sequelize.ValidationError, function(error) {
                sails.log(error);
            });
    }

};
