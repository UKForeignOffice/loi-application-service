/**
 * DocumentsQuantityController module.
 * @module Controller DocumentsQuantityController
 */

var applicationController   = require('./ApplicationController');

var DocumentsQuantityCtrl = {

    /**
     * Render the document quantity checker page
     * @param req
     * @param res
     */
    userDocumentQuantityPage: function(req, res) {



        var selectedDocsCount = 0;
        sequelize.query('select doc_id, this_doc_count from "UserDocuments" where application_id='+req.session.appId)
        .spread(function (results, metadata) {
            selectedDocsCount = 0;
                for (var i=0;i < results.length; i++) {
                    selectedDocsCount = selectedDocsCount + results[i].this_doc_count;
                }
        })
        .catch(Sequelize.ValidationError, function(error) {
            sails.log(error);
        });

        UserDocumentCount.findOne({where: {
                    application_id:req.session.appId
                }
            }
        )
        .then(function(data) {
            if(data===null) {
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
                    user_data: HelperService.getUserData(req,res)
                });
            }else{
                var nextPage='documentQuantity';
                var anUpdate = false;
                DocumentsQuantityCtrl.populateDocumentCountForm(req,res,nextPage,anUpdate);
                return null;
            }
        })
        .catch(function(error){
            sails.log(error);
        });
    },

    /**
     * Add the user entered, or autommatically populated, document counter to the database
     * @param req
     * @param res
     * @returns {*}
     */
    addDocsQuantity: function (req, res) {

      UserDocumentCount.findAll(
            {
                where: {
                    application_id:req.session.appId
                }
            }
        )
            .then(function (data) {
                // needs replacing with cost for the current service (not hardcoded 30)
                var docs_price = parseInt(req.param('documentCount') * 30);

                if (data.length > 0) {
                    UserDocumentCount.update(
                        {
                            application_id:req.session.appId,
                            doc_count: req.param('documentCount'),
                            price: parseInt(docs_price)
                        },
                        {
                            where: {
                                application_id:req.session.appId
                            }
                        }
                    )
                        .then(function () {

                            if (!req.session.summary) {

                                res.redirect('/postage-send-options');
                            }
                            else {
                               res.redirect('/review-summary');
                            }

                            return null;
                        })
                        .catch(Sequelize.ValidationError, function (error) {
                            sails.log(error);

                            dataValues = [];
                            dataValues.push({
                                documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : ""
                            });

                            return res.view('applicationForms/documentQuantity.ejs', {
                                application_id:req.session.appId,
                                error_report: ValidationService.validateForm({error: error}),
                                form_values: dataValues[0],
                                update: false,
                                return_address: req.param('return_address'),
                                selected_docs_count: false,
                                submit_status: req.session.appSubmittedStatus,
                                current_uri: req.originalUrl,
                                altAddress: req.session.altAddress,
                                summary: req.session.summary,
                                user_data: HelperService.getUserData(req,res)
                            });

                        });
                }
                else {
                    UserDocumentCount.create({
                        application_id:req.session.appId,
                        doc_count: req.param('documentCount'),
                        price: parseInt(docs_price)
                    })
                        .then(function () {

                            // get send options from db
                            getPostagesAvailableSQL = 'select * from "PostagesAvailable" where type=\'send\'';
                            sequelize.query(getPostagesAvailableSQL)
                                .spread(function (results, metadata) {
                                    // Results will be an empty array and metadata will contain the number of affected rows.
                                    SendPostagesAvailable = results;
                                })
                                .then(function () {
                                    res.redirect('/postage-send-options');
                                    return null;
                                });
                            return null;
                        })
                        .catch(function (error) {
                            sails.log(error);

                            dataValues = [];
                            dataValues.push({
                                documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : ""
                            });

                            return res.view('applicationForms/documentQuantity.ejs', {
                                application_id:req.session.appId,
                                error_report: ValidationService.validateForm({error: error}),
                                form_values: dataValues[0],
                                update: false,
                                selected_docs_count: false,
                                submit_status: req.session.appSubmittedStatus,
                                current_uri: req.originalUrl,
                                altAddress: req.session.altAddress,
                                user_data: HelperService.getUserData(req,res),
                                summary: req.session.summary
                            });

                        });
                }
                return null;
            });
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
                return res.view('applicationForms/documentQuantity.ejs',{application_id:req.session.appId,
                    form_values: data.dataValues, error_report:false, update: anUpdate===true?true:false,
                    selected_docs_count: false,
                    submit_status: req.session.appSubmittedStatus,
                    current_uri: req.originalUrl,
                    altAddress: req.session.altAddress,
                    summary: req.session.summary,
                    user_data: HelperService.getUserData(req,res) });
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
