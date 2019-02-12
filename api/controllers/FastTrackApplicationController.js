/**
 * AdditionalApplicationInfoController module.
 * @module Controller AdditionalApplicationInfoController
 */
var applicationController   = require('./ApplicationController');

var FastTrackApplicationCtrl = {

    /**
     * Render the about documentation page, executing the populate form method
     * if previous records are found, meaning it would be an update.
     * @param req
     * @param res
     */
    AboutDocumentation: function(req, res) {
      Application.findAll({where: {
                    application_id:req.session.appId
                }
            }
        )
            .then(function(data) {
                if(1>data.length) {
                    return res.view('applicationForms/aboutDocuments.ejs', {
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
                    var nextPage='about-application';
                    var anUpdate = false;
                    return FastTrackApplicationCtrl.populateAboutDocsForm(req,res,nextPage,anUpdate);
                }
            }).catch( function(error) {
                sails.log(error);
            });
    },

  /**
   * Render the about documentation page, executing the populate form method
   * if previous records are found, meaning it would be an update.
   * @param req
   * @param res
   */
  AboutApplication: function(req, res) {
    Application.findAll({where: {
        application_id:req.session.appId
      }
      }
    )
      .then(function(data) {
        if(1>data.length) {
          return res.view('applicationForms/aboutApplication.ejs', {
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
          var nextPage='additional-information';
          var anUpdate = false;
          return FastTrackApplicationCtrl.populateAboutApplicationForm(req,res,nextPage,anUpdate);
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
    AddAboutDocumentation: function (req, res) {

        var docsInEU = '';

        if (typeof(req.param('doc_reside_EU')) != 'undefined') {
          docsInEU = JSON.parse(req.param('doc_reside_EU'));
        }

      Application.findAll(
                {
                    where: {
                        application_id:req.session.appId
                    }
                }
            ).then(function (data) {
                    if (data.length > 0) {
                      Application.update({
                                user_ref: req.param('customer_ref')
                            },
                            {
                                where: {
                                    application_id:req.session.appId
                                }
                            })
                            .then(function () {
                            Application.update({
                                      doc_reside_EU: docsInEU
                                },
                                {
                                    where: {application_id:req.session.appId}
                                })
                              .then(function () {
                                  req.session.doc_reside_EU = docsInEU;
                                  if(req.session.summary){
                                    res.redirect('/review-summary');
                                  }
                                  else {
                                    res.redirect('/about-application');
                                  }

                                  return null;
                                }
                              )
                                .catch(Sequelize.ValidationError, function (error) {
                                    sails.log(error);
                                    //console.log('b: ', error);

                                    return res.view('applicationForms/aboutDocuments.ejs', {
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
                                return res.view('applicationForms/aboutDocuments.ejs', {
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
                      Application.create({
                            application_id:req.session.appId,
                            user_ref: req.param('customer_ref')
                        })
                            .then(function (result) {
                            Application.update({
                                doc_reside_EU: docsInEU
                                },
                                {
                                    where: {application_id:req.session.appId}
                                })
                                .then(function () {
                                    //summaryController.fetchAll(req, res, false);

                                    res.redirect('/2about-application2');

                                    return null;
                                })
                                .catch(Sequelize.ValidationError, function (error) {
                                    sails.log(error);
                                    //console.log('b: ', error);

                                    return res.view('applicationForms/aboutDocuments.ejs', {
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
                                return res.view('applicationForms/aboutDocuments.ejs', {
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

    },

  /**
   * Insert user entered information into the database
   * @param req
   * @param res
   * @returns {*}
   */
  AddResidency: function (req, res) {

    var residency = '';

    if (typeof(req.param('residency')) != 'undefined') {
      residency = JSON.parse(req.param('residency'));
    }

    Application.findAll(
      {
        where: {
          application_id: req.session.appId
        }
      }
    ).then(function (data) {
      if (data.length > 0) {
        Application.update({
            user_ref: req.param('customer_ref')
          },
          {
            where: {
              application_id: req.session.appId
            }
          })
          .then(function () {
            Application.update({
                residency: residency
              },
              {
                where: {application_id: req.session.appId}
              })
              .then(function () {
                  req.session.residency = residency;
                  if(req.session.summary){
                    res.redirect('/review-summary');
                  }
                  else {
                    res.redirect('/additional-information');
                  }

                  return null;
                }
              )
              .catch(Sequelize.ValidationError, function (error) {
                sails.log(error);
                //console.log('b: ', error);

                return res.view('applicationForms/aboutApplication.ejs', {
                  application_id: req.session.appId,
                  form_values: req.body,
                  error_report: ValidationService.validateForm({error: error}),
                  changing: req.session.summary ? true : false,
                  submit_status: req.session.appSubmittedStatus,
                  user_data: HelperService.getUserData(req, res),
                  current_uri: req.originalUrl,
                  summary: req.session.summary
                });

              });
            return null;
          })
          .catch(Sequelize.ValidationError, function (error) {
            sails.log(error);
            return res.view('applicationForms/aboutApplication.ejs', {
              application_id: req.session.appId,
              form_values: req.body,
              error_report: ValidationService.validateForm({error: error}),
              changing: req.session.summary ? true : false,
              submit_status: req.session.appSubmittedStatus,
              user_data: HelperService.getUserData(req, res),
              current_uri: req.originalUrl,
              summary: req.session.summary
            });
          });
      } else {
        Application.create({
          application_id: req.session.appId,
          user_ref: req.param('customer_ref')
        })
          .then(function (result) {
            Application.update({
                residency: residency
              },
              {
                where: {application_id: req.session.appId}
              })
              .then(function () {
                //summaryController.fetchAll(req, res, false);

                res.redirect('/additional-information');

                return null;
              })
              .catch(Sequelize.ValidationError, function (error) {
                sails.log(error);
                //console.log('b: ', error);

                return res.view('applicationForms/aboutApplication.ejs', {
                  application_id: req.session.appId,
                  form_values: false,
                  error_report: ValidationService.validateForm({error: error}),
                  changing: false,
                  submit_status: req.session.appSubmittedStatus,
                  user_data: HelperService.getUserData(req, res),
                  current_uri: req.originalUrl,
                  summary: req.session.summary
                });

              });

            return null;
          })
          .catch(Sequelize.ValidationError, function (error) {
            console.log(error);
            sails.log(error);
            return res.view('applicationForms/aboutApplication.ejs', {
              application_id: req.session.appId,
              form_values: false,
              error_report: ValidationService.validateForm({error: error}),
              changing: false,
              submit_status: req.session.appSubmittedStatus,
              user_data: HelperService.getUserData(req, res),
              current_uri: req.originalUrl,
              summary: req.session.summary
            });
          });
      }

      return null;
    }).catch(function (error) {
      sails.log(error);
    });
  },
  /**
     * Populate the About Documentation page with details the user previously entered, as this is an update
     * @param req
     * @param res
     */
    populateAboutDocsForm: function(req, res,nextPage,anUpdate) {

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
                var docsInEU = data.doc_reside_EU;

              Application.findOne(
                    {
                        where: {
                            application_id:req.session.appId
                        }
                    }
                )
                    .then(function(data){
                        return res.view('applicationForms/aboutDocuments.ejs',
                            {application_id:req.session.appId,
                                form_values: data.dataValues,
                                 doc_reside_EU:docsInEU,
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
 * Populate the About your application page with details the user previously entered, as this is an update
 * @param req
 * @param res
 */
populateAboutApplicationForm: function(req, res,nextPage,anUpdate) {
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
      var residency = data.residency;

      Application.findOne(
        {
          where: {
            application_id:req.session.appId
          }
        }
      )
        .then(function(data){
            return res.view('applicationForms/aboutApplication.ejs',
              {application_id:req.session.appId,
                form_values: data.dataValues,
                residency:residency,
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
     * Marty to re-add in
     */
    renderAboutDocumentsPage: function renderAboutDocumentsPage(req, res) {
        res.redirect('/modify-about-documents');
    },

  renderAboutApplicationPage: function renderAboutApplicationPage(req, res) {
    res.redirect('/modify-about-application');
  }

};

module.exports = FastTrackApplicationCtrl;
