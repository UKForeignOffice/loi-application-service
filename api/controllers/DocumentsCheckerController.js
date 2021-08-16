/**
 * DocumentsCheckerController module.
 * @module Controller DocumentsCheckerController
 */

var documentsCheckerController = {

    docSelectorStart: function(req, res){
        req.session.search_history =[];

        //reset the selected documents
        req.session.selectedDocuments = {
            totalDocCount: 0,
            documents: []
        };
        req.session.last_doc_checker_page = '/choose-documents-or-skip';
        return res.view('documentChecker/documentsCheckerStart.ejs', {
            application_id:req.session.appId,
            error_report: false,
            form_values: false,
            update: false,
            loggedIn: HelperService.LoggedInStatus(req),
            usersEmail: HelperService.LoggedInUserEmail(req),
            submit_status: req.session.appSubmittedStatus,
            return_to_skip: false,
            pageTitle: "Check if documents can be legalised",
            user_data: HelperService.getUserData(req,res),
            search_term: req.param('query') || req.query.searchTerm || ''
        });
    },

    docsSearch: function (req, res) {
        return res.view('documentChecker/documentsCheckerSearch.ejs', {
            search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm});
    },

    docsSelector: function (req, res) {

        if(req.session.search_history.length===0){
            req.session.search_history.push(null);
            req.session.search_back_hit = false;
        }

        req.session.last_doc_checker_page = "";
        var last_search = false;
        var search_term  = '';
        if(req.query.return){
            if(req.session.azlisting && !req.query.back){
                return res.redirect('/a-to-z-document-listing');
            }else{
                req.session.azlisting=false;
            }
            req.session.search_back_hit = true;
           if(req.param('query') || req.query.searchTerm || req.session.searchTerm) {
               search_term = (req.param('query') || req.query.searchTerm || req.session.searchTerm);
            }
            last_search = req.session.search_history.pop();
        }
        else if(req.query.remove){
            search_term = req.session.searchTerm;
            last_search = req.session.last_search;
        }
        else if(req.query.back && !req.session.search_back_hit){
            req.session.search_history.pop();
            last_search =req.session.search_history.pop();
            req.session.search_back_hit = true;
            search_term = last_search;

        }
        else if(req.query.back){
            last_search =  req.session.search_history.pop();
            search_term = last_search;
        }
        else {
            last_search = req.session.search_history[req.session.search_history.length-1];
            if(req.param('query') || req.query.searchTerm) {
                req.session.search_history.push(req.param('query') || req.query.searchTerm || req.session.searchTerm);
                req.session.searchTerm = (req.param('query') || req.query.searchTerm || req.session.searchTerm);
                search_term = req.session.searchTerm;
            }
            req.session.search_back_hit = false;
        }

        req.session.last_search = last_search;
        //var search_term  = !req.session.searchTerm ? req.param('query') || req.query.searchTerm || last_search || '' : req.session.searchTerm;

        //check if all documents in session
        var selectedDocs = HelperService.getSelectedDocuments(req);



        var view ='documentChecker/documentsCheckerDocsSelector.ejs';
        HelperService.getFilteredDocuments(search_term || '~~noresults~~').then(function (filteredDocuments){
            var attributes = {
                application_id:req.session.appId,
                filtered_documents: filteredDocuments,
                error_report: false,
                update: false,
                selected_docs: selectedDocs,
                loggedIn: HelperService.LoggedInStatus(req),
                usersEmail: HelperService.LoggedInUserEmail(req),
                submit_status: req.session.appSubmittedStatus,
                user_data: HelperService.getUserData(req,res),
                search_term: search_term,
                search_history : req.session.search_history,
                last_search: req.session.last_search,
                session: req.session.cookie.expires,
                maxNumOfDocuments: sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission,
                moment: require('moment')
            };
            if(req.session.azlisting && req.query.remove){
                view = 'documentChecker/documentsCheckerAZListing.ejs';
            }

            if(req.query.ajax){
                view = 'documentChecker/documentCheckerResults.ejs';
                attributes.layout= null;
            }
            return res.view(view,attributes);
        });
    },
    getLastSearch : function(req,res){
        return res.json( req.session.last_search );
    },

    addSelectedDoc: function (req, res) {
        HelperService.addSelectedDocId(req, req.param('doc_id'), (req.query.quantity || 1))
            .then(function (selectedDocs){
                var route = '/select-documents';
                if (req.query.source && req.query.source == 'az'){
                    route = '/a-to-z-document-listing';
                }
                if (req.query.searchTerm){
                    return res.redirect(route + '?searchTerm=' + req.query.searchTerm);
                }
                else {
                    return res.redirect(route);
                }
            });
    },

    addSelectedDocAjax: function (req, res) {
        HelperService.addSelectedDocId(req, req.param('doc_id'), (req.query.quantity || 1))
            .then(function (selectedDocs){
                return res.view('documentChecker/documentsCheckerBasket.ejs',{
                        search_term:!req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm,
                        selected_docs:selectedDocs,
                        source:req.query.source,
                        layout: null
                    }
                );
            });
    },

    removeSelectedDoc: function (req, res) {
        HelperService.removeSelectedDocId(req, req.param('doc_id'))
            .then(function (selectedDocs) {
                var route = '/select-documents';
                if (req.query.source && req.query.source == 'az'){
                    route = '/a-to-z-document-listing';
                }
                return res.redirect(route+'?remove=true');

            });
    },

    removeSelectedDocAjax: function (req, res) {
        HelperService.removeSelectedDocId(req, req.param('doc_id'))
            .then(function (selectedDocs){
                return res.view('documentChecker/documentsCheckerBasket.ejs',{
                        search_term: !req.session.searchTerm ? req.param('query') || req.query.searchTerm || '':req.session.searchTerm,
                        selected_docs:selectedDocs,
                        source:req.query.source,
                        layout: null
                    }
                );
            });
    },

    docsQuery: function (req, res) {
        HelperService.getFilteredDocuments(req.params.query.trim()).then(function (filteredDocuments) {
            if (filteredDocuments && filteredDocuments.length > 0) {
                req.session.searchTerm = req.params.query;
                var doc_titles_start = [];
                for (var i = 0; i < filteredDocuments.length; i++) {
                    doc_titles_start.push(filteredDocuments[i].doc_title_start);
                }

                return res.json(doc_titles_start.slice(0,20));
            }
            else {
                return res.json({});
            }
        });
    },

    /**
     * Confirm document selection and insert all data into the UserDocuments table
     * @param req
     * @param res
     */
    confirmDocuments: function (req, res) {
        var selectedDocuments = req.session.selectedDocuments;

        HelperService.writeSelectedDocsToDb(req).then(function (status) {
            var getSelectedDocInfoSql;

            if (sails.config.standardServiceRestrictions.enableRestrictions  && req.session.appType != 3) {
              if (selectedDocuments &&
                selectedDocuments.totalQuantity > 0 &&
                selectedDocuments.totalQuantity <= sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission ) {
                getSelectedDocInfoSql = HelperService.buildSqlToGetAllUserDocInfo(req);
              } else {
                var search_term = req.session.searchTerm;
                var view ='documentChecker/documentsCheckerDocsSelector.ejs';
                HelperService.getFilteredDocuments(search_term || '~~noresults~~').then(function (filteredDocuments) {
                  var attributes = {
                    application_id: req.session.appId,
                    filtered_documents: filteredDocuments,
                    error_report: true,
                    update: false,
                    selected_docs: selectedDocuments,
                    loggedIn: HelperService.LoggedInStatus(req),
                    usersEmail: HelperService.LoggedInUserEmail(req),
                    submit_status: req.session.appSubmittedStatus,
                    user_data: HelperService.getUserData(req, res),
                    search_term: search_term,
                    search_history: req.session.search_history,
                    last_search: req.session.last_search,
                    session: req.session.cookie.expires,
                    maxNumOfDocuments: sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission,
                    moment: require('moment')
                  };
                  if(req.session.azlisting && req.query.remove){
                    view = 'documentChecker/documentsCheckerAZListing.ejs';
                  }

                  if(req.query.ajax){
                    view = 'documentChecker/documentCheckerResults.ejs';
                    attributes.layout= null;
                  }
                  return res.view(view,attributes);
                });
              }
            } else {
                if (selectedDocuments && selectedDocuments.totalQuantity > 0 ) {
                  getSelectedDocInfoSql = HelperService.buildSqlToGetAllUserDocInfo(req);
              } else {
                // Throw custom error when no documents are created.
                throw new Error('Error - No documents where selected.  Ending this Application and sending user to start page.');
              }
            }

            sequelize.query(getSelectedDocInfoSql)
                .then(function (results) {
                    selectedDocsInfo = results[0];
                    return res.view('documentChecker/documentsCheckerConfirmSelection.ejs', {
                        application_id:req.session.appId,
                        selected_docs: selectedDocsInfo,
                        error_report: false,
                        update: false,
                        loggedIn: HelperService.LoggedInStatus(req),
                        usersEmail: HelperService.LoggedInUserEmail(req),
                        submit_status: req.session.appSubmittedStatus,
                        failed_eligibility: null,
                        reqparams: req.params.all(),
                        user_data: HelperService.getUserData(req,res),
                        last_search:  last_search = req.session.search_history[req.session.search_history.length-1],
                        search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm
                    });
                }).catch(function (error) {
                    sails.log(error);

                    var fieldName = 'Document Selector';
                    var fieldError = error;
                    var fieldSolution = 'Contact FCO.';
                    var questionId = 'document_selector';

                    return res.view('documentChecker/documentsCheckerConfirmSelection.ejs', {
                        application_id:req.session.appId,
                        error_report: ValidationService.buildCustomError(fieldName, fieldError, fieldSolution, questionId),
                        selected_docs: [],
                        update: false,
                        submit_status: req.session.appSubmittedStatus,
                        failed_eligibility: null,
                        reqparams: req.params.all(),
                        user_data: HelperService.getUserData(req,res),
                        search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm
                    });
                });
        });
    },

    azListing: function(req, res) {
        //check if all documents in session
        var selectedDocs = HelperService.getSelectedDocuments(req);
        var application_id = HelperService.validSession(req,res).appId;
        req.session.azlisting = true;

        HelperService.getFilteredDocuments('').then(function (filteredDocuments){
            return res.view('documentChecker/documentsCheckerAZListing.ejs',
                {
                    application_id:req.session.appId,
                    filtered_documents: filteredDocuments,
                    error_report: false,
                    update: false,
                    selected_docs: selectedDocs,
                    submit_status: req.session.appSubmittedStatus,
                    user_data: HelperService.getUserData(req,res),
                    search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm
                });
        });
    },

    /**
     * Check all selected documents are eligible and take the user to the 'certification
     * required' page for those documents that specifically need to be certified.  If no
     * documents selected need to be certified, either due to being an original, then take
     * the user to the user detail pages.
     * @param req
     * @param res
     */
    docsEligibleCheck: function (req, res) {
        // filter out the non-cert required docs
        HelperService.getUserDocs(req.session.appId)
            .then(function(results) {
                var usersDocs = results[0];
                // array of docs
                var eligibleOptionsNotSelected = HelperService.buildArrayOfDocFormatOptionsNotSelected(req,res,usersDocs);
                // array of docs to be certified
                var arrOfDocsToBeCertified = HelperService.buildArrayOfDocsToBeCertified(res,req,usersDocs);
                try {
                    // if array not empty, fail action
                    if (eligibleOptionsNotSelected.length > 0) {
                        throw new Error('No eligibility status for selected documents have been provided.');
                    }
                    if (arrOfDocsToBeCertified.length > 0) {
                        return res.view('documentChecker/documentsCheckerCertifiedCheck.ejs', {
                            application_id:req.session.appId,
                            users_docs: usersDocs,
                            docs_to_cert: arrOfDocsToBeCertified,
                            error_report: false, loggedIn: HelperService.LoggedInStatus(req),
                            submit_status: req.session.appSubmittedStatus,
                            form_values: false,
                            user_data: HelperService.getUserData(req,res),
                            search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm
                        });

                    } else if (req.session.appType == 2){
                        req.session.last_doc_checker_page = '/confirm-documents';
                        return res.redirect('/business-document-quantity?pk_campaign=Premium-Service&pk_kwd=Premium');
                    }
                      else if (req.session.appType == 3){
                      req.session.last_doc_checker_page = '/confirm-documents';
                      return res.redirect('/business-document-quantity?pk_campaign=DropOff-Service&pk_kwd=DropOff');
                    }

                    else {
                      req.session.last_doc_checker_page = '/confirm-documents';
                      return res.redirect('/your-basic-details');
                    }

                }
                catch (error) {
                    console.log(error);

                    var answersSetAsNo = [];
                    for (var i = 0; i < usersDocs.length; i++) {
                        var indexableString = JSON.stringify(req.params.all());
                        if (indexableString.indexOf('docid_' + usersDocs[i].doc_id) === -1) {
                            answersSetAsNo.push('docid_' + usersDocs[i].doc_id);
                        }
                    }

                    var fieldName = 'Document eligibility check';
                    var fieldError = 'Confirm the format for all the documents you plan to send in';
                    var fieldSolution = 'Confirm your *replaceme* format';
                    var questionId = 'document_eligibility_confirm';

                    var getSelectedDocInfoSql = HelperService.buildSqlToGetAllUserDocInfo(req);

                    sequelize.query(getSelectedDocInfoSql)
                        .then(function (results) {
                            selectedDocsInfo = results[0];
                            return res.view('documentChecker/documentsCheckerConfirmSelection.ejs', {
                                application_id: req.session.appId,
                                error_report: ValidationService.buildCustomError(fieldName, fieldError, fieldSolution, questionId),
                                selected_docs: selectedDocsInfo,
                                update: false,
                                submit_status: req.session.appSubmittedStatus,
                                failed_eligibility: answersSetAsNo,
                                reqparams: req.params.all(),
                                user_data: HelperService.getUserData(req, res),
                                search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm
                            });
                        });
                }
            })
            .catch( function(error) {
                console.log(error);
            });
    },


    /**
     * Get all HTML partials for all certifiable selected documents to enable
     * user to agree or disagree that documents have been certified.
     * @param req
     * @param res
     * @returns {*}
     */
    docsCertifiedCheckConfirmDeny:  function (req, res) {
        return HelperService.catchConfirmCertifiedErrors(req, res);
    },

    emailFailedCerts:  function (req, res) {
        if (!req.body.email || req.body.email === '') {
            req.flash('email_error','You must provide an email address');
            return res.view('documentChecker/documentsCheckerNotCertified.ejs',{
                pageTitle: "Get your document certified",
                application_id: req.session.appId,
                failed_certs: req.session.failed_certs?req.session.failed_certs:false,
                failed_certs_string: req.session.failed_certs?req.session.failed_certs:false,
                error_report: null,
                loggedIn: HelperService.LoggedInStatus(req),
                usersEmail: HelperService.LoggedInUserEmail(req),
                submit_status: req.session.appSubmittedStatus,
                current_uri: req.originalUrl,
                last_doc_checker_page: req.session.last_doc_checker_page,
                user_data: HelperService.getUserData(req, res),
                search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm,
                no_email_flash: req.flash('email_error')
            });
        }
        EmailService.failedDocuments(req.body.email, JSON.stringify(req.session.failed_certs));
        return res.view('documentChecker/documentsCheckerFailedDocsEmail.ejs',{
            email:req.body.email,
            search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm,
            user_data: HelperService.getUserData(req,res)
        });
    },

    /**
     * Skip to address page if the user doesnt want to select and documents
     * @param req
     * @param res
     */
    returnToSkipPage: function(req,res){
        req.session.last_doc_checker_page = '/choose-documents-or-skip';
        req.session.search_history =[];
        return res.view('documentChecker/documentsCheckerStart.ejs', {application_id:req.session.appId, error_report: false, form_values: false, update: false, loggedIn: HelperService.LoggedInStatus(req),
            usersEmail: HelperService.LoggedInUserEmail(req),
            submit_status: req.session.appSubmittedStatus,
            current_uri: req.originalUrl,
            return_to_skip: true,
            pageTitle: "Check if documents can be legalised",
            user_data: HelperService.getUserData(req,res),
            search_term: !req.session.searchTerm?req.param('query') || req.query.searchTerm || '':req.session.searchTerm
        });
    },

    /**
     * Method to remove documents from the document list when Javascript is disabled
     * @param req
     * @param res
     */
    manualUpdateDocCount: function(req, res) {
        // this is coming from the basket form, so the onl items posted are the documentID and associated count
        HelperService.updateSelectedDocQuantities(req)
            .then(function (selectedDocs){
                var route = '/select-documents';
                if (req.query.source && req.query.source == 'az'){
                    route = '/a-to-z-document-listing';
                }
                if (req.param('searchTerm')){
                    return res.redirect(route + '?searchTerm=' + req.param('searchTerm'));
                }
                else {
                    return res.redirect(route);
                }
            });
    },
    /**
     * Method to remove documents from the document list when Javascript is enabled
     * @param req
     * @param res
     */
    AJAXUpdateDocCount: function(req, res) {
        // this is coming from the basket form, so the onl items posted are the documentID and associated count
        HelperService.updateSelectedDocQuantities(req)
            .then(function (selectedDocs){
                return res.json('Pass');
            });
    },

    displayImportantInformation: function(req, res) {
        if(req.session.last_business_application_page != null) {
            return res.view('documentChecker/documentsCheckerImportantInformation.ejs', {
                last_business_application_page: req.session.last_business_application_page
            });
        } else {
            return res.view('documentChecker/documentsCheckerImportantInformation.ejs', {
                doc_checker_page_before_important_information: req.session.doc_checker_page_before_important_information
            });
        }
    }
};

module.exports = documentsCheckerController;

