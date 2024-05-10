/**
 * DocumentsQuantityController module.
 * @module Controller DocumentsQuantityController
 */
const HelperService = require("../services/HelperService");
const ValidationService = require("../services/ValidationService");
const sequelize = require('../models/index').sequelize;
const UserDocumentCount = require('../models/index').UserDocumentCount;
const ApplicationPaymentDetails = require('../models/index').ApplicationPaymentDetails;


var DocumentsQuantityCtrl = {

    /**
     * Render the document quantity checker page
     * @param req
     * @param res
     */
    userDocumentQuantityPage: function(req, res) {



        var selectedDocsCount = 0;
        sequelize.query('select doc_id, this_doc_count from "UserDocuments" where application_id='+req.session.appId, {type: sequelize.QueryTypes.SELECT})
        .then(function (results) {
            selectedDocsCount = 0;
                for (var i=0;i < results.length; i++) {
                    selectedDocsCount = selectedDocsCount + results[i].this_doc_count;
                }
        })
        .catch(function(error) {
            sails.log.error(error);
        });

        UserDocumentCount.findOne({where: {
                    application_id:req.session.appId
                }
            }
        )
        .then(function(data) {
            if(data===null) {
              let maxNumOfDocuments = (sails.config.standardServiceRestrictions.enableRestrictions) ? sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission : 999
              return res.view('applicationForms/documentQuantity.ejs', {
                    application_id:req.session.appId,
                    form_values: false,
                    error_report: false,
                    update: false,
                    selected_docs_count: selectedDocsCount,
                    submit_status: req.session.appSubmittedStatus,
                    current_uri: req.originalUrl,
                    altAddress: req.session.altAddress,
                    summary: req.session.summary,
                    user_data: HelperService.getUserData(req,res),
                    maxNumOfDocuments: maxNumOfDocuments
                });
            }else{
                var nextPage='documentQuantity';
                var anUpdate = false;
                DocumentsQuantityCtrl.populateDocumentCountForm(req,res,nextPage,anUpdate);
                return null;
            }
        })
        .catch(function(error){
            sails.log.error(error);
        });
    },

    /**
     * Add the user entered, or autommatically populated, document counter to the database
     * @param req
     * @param res
     * @returns {*}
     */
    addDocsQuantity: async function (req, res) {
      try {
        const data = await UserDocumentCount.findAll({
          where: {
            application_id: req.session.appId
          }
        });

        const docs_price = parseInt(req.param('documentCount') * HelperService.getAppPrice(req));

        if (data.length > 0) {
          try {
            await UserDocumentCount.update(
              {
                application_id: req.session.appId,
                doc_count: req.param('documentCount'),
                price: parseInt(docs_price)
              },
              {
                where: {
                  application_id: req.session.appId
                }
              }
            );

            const thereIsAPaymentForThisApp = await ApplicationPaymentDetails.findOne({
                where: {
                  application_id: req.session.appId
                }
            })

            if (thereIsAPaymentForThisApp) {
              await ApplicationPaymentDetails.update(
                {
                  payment_url: null
                },
                {
                  where: {
                    application_id: req.session.appId
                  }
                }
              );
            }

            if (!req.session.summary) {
              res.redirect('/postage-send-options');
            } else {
              res.redirect('/review-summary');
            }
          } catch (error) {
            sails.log.error(error);

            const dataValues = [{
              documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : ""
            }];

            const maxNumOfDocuments = sails.config.standardServiceRestrictions.enableRestrictions
              ? sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission
              : 999;

            return res.view('applicationForms/documentQuantity.ejs', {
              application_id: req.session.appId,
              error_report: ValidationService.validateForm({ error: error }),
              form_values: dataValues[0],
              update: false,
              return_address: req.param('return_address'),
              selected_docs_count: false,
              submit_status: req.session.appSubmittedStatus,
              current_uri: req.originalUrl,
              altAddress: req.session.altAddress,
              summary: req.session.summary,
              user_data: HelperService.getUserData(req, res),
              maxNumOfDocuments: maxNumOfDocuments
            });
          }
        } else {
          try {
            await UserDocumentCount.create({
              application_id: req.session.appId,
              doc_count: req.param('documentCount'),
              price: parseInt(docs_price)
            });

            const getPostagesAvailableSQL = 'select * from "PostagesAvailable" where type=\'send\'';
            SendPostagesAvailable = await sequelize.query(getPostagesAvailableSQL, {type: sequelize.QueryTypes.SELECT});

            res.redirect('/postage-send-options');
          } catch (error) {
            sails.log.error(error);

            const dataValues = [{
              documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : ""
            }];

            const maxNumOfDocuments = sails.config.standardServiceRestrictions.enableRestrictions
              ? sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission
              : 999;

            return res.view('applicationForms/documentQuantity.ejs', {
              application_id: req.session.appId,
              error_report: ValidationService.validateForm({ error: error }),
              form_values: dataValues[0],
              update: false,
              selected_docs_count: false,
              submit_status: req.session.appSubmittedStatus,
              current_uri: req.originalUrl,
              altAddress: req.session.altAddress,
              user_data: HelperService.getUserData(req, res),
              summary: req.session.summary,
              maxNumOfDocuments: maxNumOfDocuments
            });
          }
        }
      } catch (error) {
        sails.log.error(error);
      }
    },

  /**
     * Populate the form with data from the database
     * @param req
     * @param res
     */
    populateDocumentCountForm: function(req, res, nextpage, anUpdate) {
               UserDocumentCount.findOne(
                {
                    where: {
                        application_id:req.session.appId
                    }
                }
            )
            .then(function(data){
              let maxNumOfDocuments = (sails.config.standardServiceRestrictions.enableRestrictions) ? sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission : 999
              return res.view('applicationForms/documentQuantity.ejs', {
                application_id: req.session.appId,
                form_values: data.dataValues, error_report: false, update: anUpdate === true ? true : false,
                selected_docs_count: false,
                submit_status: req.session.appSubmittedStatus,
                current_uri: req.originalUrl,
                altAddress: req.session.altAddress,
                summary: req.session.summary,
                user_data: HelperService.getUserData(req,res),
                maxNumOfDocuments: maxNumOfDocuments
              });
            })
            .catch(function(error){
                sails.log(error);
            });
        },

    /**
     * Take user to the Modify Document Count Page, but via a redirect so the method used is a POST, thus allowing the browser
     * back button to be used without hte need for refreshing the page
     * @param req
     * @param res
     */
    renderDocumentCountPage: function renderDocumentCountPage(req, res) {
        res.redirect('/modify-how-many-documents');
    }


};

module.exports = DocumentsQuantityCtrl;
