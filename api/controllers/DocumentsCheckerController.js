/**
 * DocumentsCheckerController module.
 * @module Controller DocumentsCheckerController
 */

const HelperService = require('../services/HelperService')
const ValidationService = require('../services/ValidationService')
const sequelize = require('../models/index').sequelize

const documentsCheckerController = {
  docSelectorStart: (req, res) => {
    req.session.search_history = []

    //reset the selected documents
    req.session.selectedDocuments = {
      totalDocCount: 0,
      documents: [],
    }

    req.session.last_doc_checker_page = '/choose-documents-or-skip'

    return res.view('documentChecker/documentsCheckerStart.ejs', {
      application_id: req.session.appId,
      error_report: false,
      form_values: false,
      update: false,
      loggedIn: HelperService.LoggedInStatus(req),
      usersEmail: HelperService.LoggedInUserEmail(req),
      submit_status: req.session.appSubmittedStatus,
      return_to_skip: false,
      pageTitle: 'Check if documents can be legalised',
      user_data: HelperService.getUserData(req, res),
      search_term: req.param('query') || req.query.searchTerm || '',
    })
  },

  docsSearch: (req, res) =>
    res.view('documentChecker/documentsCheckerSearch.ejs', {
      search_term: !req.session.searchTerm ? req.param('query') || req.query.searchTerm || '' : req.session.searchTerm,
    }),

  docsSelector: (req, res) => {
    if (req.session?.search_history?.length === 0) {
      req.session.search_history.push(null)
      req.session.search_back_hit = false
    }

    if (req.session.appType !== 1) req.session.last_doc_checker_page = '/check-documents'

    let last_search = false
    let search_term = ''
    if (req.query.return) {
      if (req.session.azlisting && !req.query.back) {
        return res.redirect('/a-to-z-document-listing')
      } else {
        req.session.azlisting = false
      }
      req.session.search_back_hit = true
      if (req.param('query') || req.query.searchTerm || req.session.searchTerm) {
        search_term = req.param('query') || req.query.searchTerm || req.session.searchTerm
      }
      last_search = req.session.search_history.pop()
    } else if (req.query.remove) {
      search_term = req.session.searchTerm
      last_search = req.session.last_search
    } else if (req.query.back && !req.session.search_back_hit) {
      req.session.search_history.pop()
      last_search = req.session.search_history.pop()
      req.session.search_back_hit = true
      search_term = last_search
    } else if (req.query.back) {
      last_search = req.session.search_history.pop()
      search_term = last_search
    } else {
      last_search = req.session.search_history[req.session.search_history.length - 1]
      if (req.param('query') || req.query.searchTerm) {
        req.session.search_history.push(req.param('query') || req.query.searchTerm || req.session.searchTerm)
        req.session.searchTerm = req.param('query') || req.query.searchTerm || req.session.searchTerm
        search_term = req.session.searchTerm
      }
      req.session.search_back_hit = false
    }

    req.session.last_search = last_search
    //var search_term  = !req.session.searchTerm ? req.param('query') || req.query.searchTerm || last_search || '' : req.session.searchTerm;

    //check if all documents in session
    const selectedDocs = HelperService.getSelectedDocuments(req)

    let view = 'documentChecker/documentsCheckerDocsSelector.ejs'
    HelperService.getFilteredDocuments(search_term || '~~noresults~~').then((filteredDocuments) => {
      const attributes = {
        application_id: req.session.appId,
        filtered_documents: filteredDocuments,
        error_report: false,
        update: false,
        selected_docs: selectedDocs,
        loggedIn: HelperService.LoggedInStatus(req),
        usersEmail: HelperService.LoggedInUserEmail(req),
        submit_status: req.session.appSubmittedStatus,
        user_data: HelperService.getUserData(req, res),
        search_term: search_term,
        search_history: req.session.search_history,
        last_search: req.session.last_search,
        session: req.session.cookie.expires,
        maxNumOfDocuments: sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission,
      }
      if (req.session.azlisting && req.query.remove) {
        view = 'documentChecker/documentsCheckerAZListing.ejs'
      }

      if (req.query.ajax) {
        view = 'documentChecker/documentCheckerResults.ejs'
        attributes.layout = null
      }
      return res.view(view, attributes)
    })
  },
  getLastSearch: (req, res) => res.json(req.session.last_search),

  addSelectedDoc: (req, res) => {
    HelperService.addSelectedDocId(req, req.param('doc_id'), req.query.quantity || 1).then((_selectedDocs) => {
      let route = '/select-documents'
      if (req.query.source && req.query.source === 'az') {
        route = '/a-to-z-document-listing'
      }
      if (req.query.searchTerm) {
        return res.redirect(`${route}?searchTerm=${req.query.searchTerm}`)
      } else {
        return res.redirect(route)
      }
    })
  },

  addSelectedDocAjax: (req, res) => {
    HelperService.addSelectedDocId(req, req.param('doc_id'), req.query.quantity || 1).then((selectedDocs) =>
      res.view('documentChecker/documentsCheckerBasket.ejs', {
        search_term: !req.session.searchTerm
          ? req.param('query') || req.query.searchTerm || ''
          : req.session.searchTerm,
        selected_docs: selectedDocs,
        source: req.query.source,
        layout: null,
      }),
    )
  },

  removeSelectedDoc: (req, res) => {
    HelperService.removeSelectedDocId(req, req.param('doc_id')).then((_selectedDocs) => {
      let route = '/select-documents'
      if (req.query.source && req.query.source === 'az') {
        route = '/a-to-z-document-listing'
      }
      return res.redirect(`${route}?remove=true`)
    })
  },

  removeSelectedDocAjax: (req, res) => {
    HelperService.removeSelectedDocId(req, req.param('doc_id')).then((selectedDocs) =>
      res.view('documentChecker/documentsCheckerBasket.ejs', {
        search_term: !req.session.searchTerm
          ? req.param('query') || req.query.searchTerm || ''
          : req.session.searchTerm,
        selected_docs: selectedDocs,
        source: req.query.source,
        layout: null,
      }),
    )
  },

  docsQuery: (req, res) => {
    HelperService.getFilteredDocuments(req.params.query.trim()).then((filteredDocuments) => {
      if (filteredDocuments && filteredDocuments.length > 0) {
        req.session.searchTerm = req.params.query
        const doc_titles_start = []
        for (let i = 0; i < filteredDocuments.length; i++) {
          doc_titles_start.push(filteredDocuments[i].doc_title_start)
        }

        return res.json(doc_titles_start.slice(0, 20))
      } else {
        return res.json({})
      }
    })
  },

  /**
   * Confirm document selection and insert all data into the UserDocuments table
   * @param req
   * @param res
   */
  confirmDocuments: (req, res) => {
    try {
      const selectedDocuments = req.session.selectedDocuments

      HelperService.writeSelectedDocsToDb(req).then((_status) => {
        let getSelectedDocInfoSql

        if (sails.config.standardServiceRestrictions.enableRestrictions && req.session.appType !== 3) {
          if (
            selectedDocuments?.totalQuantity > 0 &&
            selectedDocuments?.totalQuantity <= sails.config.standardServiceRestrictions.maxNumOfDocumentsPerSubmission
          ) {
            getSelectedDocInfoSql = HelperService.buildSqlToGetAllUserDocInfo(req)
          } else {
            const search_term = req.session.searchTerm
            let view = 'documentChecker/documentsCheckerDocsSelector.ejs'
            HelperService.getFilteredDocuments(search_term || '~~noresults~~').then((filteredDocuments) => {
              const attributes = {
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
              }
              if (req.session.azlisting && req.query.remove) {
                view = 'documentChecker/documentsCheckerAZListing.ejs'
              }

              if (req.query.ajax) {
                view = 'documentChecker/documentCheckerResults.ejs'
                attributes.layout = null
              }
              return res.view(view, attributes)
            })
          }
        } else {
          if (selectedDocuments?.totalQuantity > 0) {
            getSelectedDocInfoSql = HelperService.buildSqlToGetAllUserDocInfo(req)
          } else {
            // Throw custom error when no documents are created.
            console.error(
              'Error - No documents where selected.  Ending this Application and sending user to start page.',
            )
            return res.serverError()
          }
        }

        console.log('Getting selected document info with SQL: ', getSelectedDocInfoSql)

        sequelize
          .query(getSelectedDocInfoSql)
          .then((results) => {
            selectedDocsInfo = results[0]
            return res.view('documentChecker/documentsCheckerConfirmSelection.ejs', {
              application_id: req.session.appId,
              selected_docs: selectedDocsInfo,
              error_report: false,
              update: false,
              loggedIn: HelperService.LoggedInStatus(req),
              usersEmail: HelperService.LoggedInUserEmail(req),
              submit_status: req.session.appSubmittedStatus,
              failed_eligibility: null,
              reqparams: req.allParams(),
              user_data: HelperService.getUserData(req, res),
              last_search: req.session.search_history[req.session.search_history.length - 1],
              search_term: !req.session.searchTerm
                ? req.param('query') || req.query.searchTerm || ''
                : req.session.searchTerm,
            })
          })
          .catch((error) => {
            sails.log.error('Error getting selected document info:', { error })

            const fieldName = 'Document Selector'
            const fieldError = error
            const fieldSolution = 'Contact FCO.'
            const questionId = 'document_selector'

            return res.view('documentChecker/documentsCheckerConfirmSelection.ejs', {
              application_id: req.session.appId,
              error_report: ValidationService.buildCustomError(fieldName, fieldError, fieldSolution, questionId),
              selected_docs: [],
              update: false,
              submit_status: req.session.appSubmittedStatus,
              failed_eligibility: null,
              reqparams: req.allParams(),
              user_data: HelperService.getUserData(req, res),
              search_term: !req.session.searchTerm
                ? req.param('query') || req.query.searchTerm || ''
                : req.session.searchTerm,
            })
          })
      })
    } catch (error) {
      sailes.log.error('Error confirming documents:', { error })
      return res.serverError()
    }
  },

  azListing: (req, res) => {
    //check if all documents in session
    const selectedDocs = HelperService.getSelectedDocuments(req)
    req.session.azlisting = true

    HelperService.getFilteredDocuments('').then((filteredDocuments) =>
      res.view('documentChecker/documentsCheckerAZListing.ejs', {
        application_id: req.session.appId,
        filtered_documents: filteredDocuments,
        error_report: false,
        update: false,
        selected_docs: selectedDocs,
        submit_status: req.session.appSubmittedStatus,
        user_data: HelperService.getUserData(req, res),
        search_term: !req.session.searchTerm
          ? req.param('query') || req.query.searchTerm || ''
          : req.session.searchTerm,
      }),
    )
  },

  docsEligibilityNavigation: (req, res) => {
    HelperService.getUserDocs(req.session.appId)
      .then((results) => {
        const usersDocs = results
        try {
          const eligibleOptionsNotSelected = HelperService.buildArrayOfDocFormatOptionsNotSelected(req, res, usersDocs)
          const docArrays = HelperService.buildArraysOfDocsCertAndWetInk(req, res, usersDocs)
          const arrOfDocsToBeCertified = docArrays.certReqDocs
          const arrOfDocsForWetInk = docArrays.wetInkDocs

          req.session.users_docs = usersDocs
          req.session.docs_to_cert = arrOfDocsToBeCertified
          req.session.docs_require_wet_ink = arrOfDocsForWetInk

          // if array not empty, fail action
          if (eligibleOptionsNotSelected.length > 0) {
            throw new Error('No eligibility status for selected documents have been provided.')
          }

          if (arrOfDocsForWetInk.length > 0) {
            res.redirect('/issuing-authority')
          } else if (arrOfDocsToBeCertified.length > 0) {
            res.redirect('/check-documents-eligible')
          } else if (req.session.appType === 2) {
            req.session.last_doc_checker_page = '/confirm-documents'
            return res.redirect('/business-document-quantity?pk_campaign=Premium-Service&pk_kwd=Premium')
          } else if (req.session.appType === 3) {
            req.session.last_doc_checker_page = '/confirm-documents'
            return res.redirect('/business-document-quantity?pk_campaign=DropOff-Service&pk_kwd=DropOff')
          } else {
            req.session.last_doc_checker_page = '/confirm-documents'
            return res.redirect('/your-basic-details')
          }
        } catch (error) {
          console.log(error)

          const answersSetAsNo = []
          for (let i = 0; i < usersDocs.length; i++) {
            const indexableString = JSON.stringify(req.allParams())
            if (indexableString.indexOf(`docid_${usersDocs[i].doc_id}`) === -1) {
              answersSetAsNo.push(`docid_${usersDocs[i].doc_id}`)
            }
          }

          const fieldName = 'Document eligibility check'
          const fieldError = 'Confirm the format for all the documents you plan to send in'
          const fieldSolution = 'Confirm your *replaceme* format'
          const questionId = 'document_eligibility_confirm'

          const getSelectedDocInfoSql = HelperService.buildSqlToGetAllUserDocInfo(req)

          sequelize.query(getSelectedDocInfoSql).then((results) => {
            const selectedDocsInfo = results[0]
            return res.view('documentChecker/documentsCheckerConfirmSelection.ejs', {
              application_id: req.session.appId,
              error_report: ValidationService.buildCustomError(fieldName, fieldError, fieldSolution, questionId),
              selected_docs: selectedDocsInfo,
              update: false,
              submit_status: req.session.appSubmittedStatus,
              failed_eligibility: answersSetAsNo,
              reqparams: req.allParams(),
              user_data: HelperService.getUserData(req, res),
              search_term: !req.session.searchTerm
                ? req.param('query') || req.query.searchTerm || ''
                : req.session.searchTerm,
            })
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },

  /**
   * Check all selected documents are eligible and take the user to the 'certification
   * required' page for those documents that specifically need to be certified.  If no
   * documents selected need to be certified, either due to being an original, then take
   * the user to the user detail pages.
   * @param req
   * @param res
   */
  docsEligibleCheck: (req, res) => {
    try {
      const users_docs = req.session?.users_docs
      const docs_require_wet_ink = req.session?.docs_require_wet_ink
      const docs_to_cert = req.session?.docs_to_cert

      if (docs_require_wet_ink?.length > 0) {
        req.session.last_doc_checker_page = '/issuing-authority'
      } else {
        req.session.last_doc_checker_page = `/confirm-documents?searchTerm=${!req.session.searchTerm ? req.param('query') || req.query.searchTerm || '' : req.session.searchTerm}`
      }

      if (docs_to_cert.length > 0) {
        return res.view('documentChecker/documentsCheckerCertifiedCheck.ejs', {
          application_id: req.session.appId,
          users_docs: users_docs,
          docs_to_cert: docs_to_cert,
          error_report: false,
          loggedIn: HelperService.LoggedInStatus(req),
          submit_status: req.session.appSubmittedStatus,
          form_values: false,
          user_data: HelperService.getUserData(req, res),
          search_term: !req.session.searchTerm
            ? req.param('query') || req.query.searchTerm || ''
            : req.session.searchTerm,
          last_doc_checker_page: req.session.last_doc_checker_page,
        })
      } else {
        req.session.last_doc_checker_page = '/check-documents-important-information'
        req.session.doc_checker_page_before_important_information = '/issuing-authority'
        res.redirect('/check-documents-important-information')
      }
    } catch (error) {
      console.log(error)
    }
  },

  issuingAuthority: (req, res) => {
    try {
      const users_docs = req.session?.users_docs
      const docs_require_wet_ink = req.session?.docs_require_wet_ink

      return res.view('documentChecker/documentsCheckerWetInk.ejs', {
        application_id: req.session.appId,
        users_docs: users_docs,
        docs_require_wet_ink: docs_require_wet_ink,
        error_report: false,
        loggedIn: HelperService.LoggedInStatus(req),
        submit_status: req.session.appSubmittedStatus,
        form_values: false,
        user_data: HelperService.getUserData(req, res),
        search_term: !req.session.searchTerm
          ? req.param('query') || req.query.searchTerm || ''
          : req.session.searchTerm,
      })
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * Get all HTML partials for all certifiable selected documents to enable
   * user to agree or disagree that documents have been certified.
   * @param req
   * @param res
   * @returns {*}
   */
  docsCertifiedCheckConfirmDeny: (req, res) => HelperService.catchConfirmCertifiedErrors(req, res),

  emailFailedCerts: (req, res) => {
    if (!req.body.email || req.body.email === '') {
      req.flash('email_error', 'You must provide an email address')
      return res.view('documentChecker/documentsCheckerNotCertified.ejs', {
        pageTitle: 'Get your document certified',
        application_id: req.session.appId,
        failed_certs: req.session.failed_certs ? req.session.failed_certs : false,
        failed_certs_string: req.session.failed_certs ? req.session.failed_certs : false,
        error_report: null,
        loggedIn: HelperService.LoggedInStatus(req),
        usersEmail: HelperService.LoggedInUserEmail(req),
        submit_status: req.session.appSubmittedStatus,
        current_uri: req.originalUrl,
        last_doc_checker_page: req.session.last_doc_checker_page,
        user_data: HelperService.getUserData(req, res),
        search_term: !req.session.searchTerm
          ? req.param('query') || req.query.searchTerm || ''
          : req.session.searchTerm,
        no_email_flash: req.flash('email_error'),
      })
    }
    EmailService.failedDocuments(req.body.email, JSON.stringify(req.session.failed_certs))
    req.flash('failed_docs_email', req.body.email)
    return res.redirect('/email-failed-certs/sent')
  },

  failedDocsEmailSent: (req, res) => {
    const email = req.flash('failed_docs_email').toString()
    if (!email) {
      return res.redirect('/check-documents-certified/confirm')
    }

    return res.view('documentChecker/documentsCheckerFailedDocsEmail.ejs', {
      email: email,
      search_term: !req.session.searchTerm ? req.param('query') || req.query.searchTerm || '' : req.session.searchTerm,
      user_data: HelperService.getUserData(req, res),
    })
  },

  /**
   * Skip to address page if the user doesnt want to select and documents
   * @param req
   * @param res
   */
  returnToSkipPage: (req, res) => {
    req.session.last_doc_checker_page = '/choose-documents-or-skip'

    req.session.search_history = []
    return res.view('documentChecker/documentsCheckerStart.ejs', {
      application_id: req.session.appId,
      error_report: false,
      form_values: false,
      update: false,
      loggedIn: HelperService.LoggedInStatus(req),
      usersEmail: HelperService.LoggedInUserEmail(req),
      submit_status: req.session.appSubmittedStatus,
      current_uri: req.originalUrl,
      return_to_skip: true,
      pageTitle: 'Check if documents can be legalised',
      user_data: HelperService.getUserData(req, res),
      search_term: !req.session.searchTerm ? req.param('query') || req.query.searchTerm || '' : req.session.searchTerm,
    })
  },

  /**
   * Method to remove documents from the document list when Javascript is disabled
   * @param req
   * @param res
   */
  manualUpdateDocCount: (req, res) => {
    // this is coming from the basket form, so the onl items posted are the documentID and associated count
    HelperService.updateSelectedDocQuantities(req).then((_selectedDocs) => {
      let route = '/select-documents'
      if (req.query.source && req.query.source === 'az') {
        route = '/a-to-z-document-listing'
      }
      if (req.param('searchTerm')) {
        return res.redirect(`${route}?searchTerm=${req.param('searchTerm')}`)
      } else {
        return res.redirect(route)
      }
    })
  },
  /**
   * Method to remove documents from the document list when Javascript is enabled
   * @param req
   * @param res
   */
  AJAXUpdateDocCount: (req, res) => {
    // this is coming from the basket form, so the onl items posted are the documentID and associated count
    HelperService.updateSelectedDocQuantities(req).then((_selectedDocs) => res.json('Pass'))
  },

  displayImportantInformation: (req, res) => {
    const error_report = null

    if (req.session.last_business_application_page != null) {
      return res.view('documentChecker/documentsCheckerImportantInformation.ejs', {
        last_business_application_page: req.session.last_business_application_page,
        user_data: HelperService.getUserData(req, res),
        error_report: error_report,
        user_accepts: false,
      })
    } else {
      return res.view('documentChecker/documentsCheckerImportantInformation.ejs', {
        doc_checker_page_before_important_information: req.session.doc_checker_page_before_important_information,
        user_data: HelperService.getUserData(req, res),
        error_report: error_report,
        user_accepts: false,
      })
    }
  },

  submitImportantInformation: (req, res) => {
    const userAccepts = req.body.user_accepts

    if (!userAccepts) {
      const error_report = [
        [
          {
            errMsgs: [
              {
                questionId: 'user_accepts',
                fieldSolution:
                  'Confirm that your documents meet the requirements for legalisation and that you understand that you will not receive a refund if they are rejected',
              },
            ],
          },
        ],
      ]

      return res.view('documentChecker/documentsCheckerImportantInformation', {
        show_accept_error: true,
        error_report,
        submit_status: req.session.appSubmittedStatus,
        user_data: HelperService.getUserData(req, res),
        user_accepts: userAccepts,
      })
    }

    if (req.session.appType === 2 || req.session.appType === 3) {
      return res.redirect('/business-additional-information')
    }

    return res.redirect('/your-basic-details')
  },
}

module.exports = documentsCheckerController
