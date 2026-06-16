/**
 * BusinessApplicationController module.
 * @module Controller BusinessApplicationController
 */
const UserModels = require('../userServiceModels/models.js')
const HelperService = require('../services/HelperService')
const ValidationService = require('../services/ValidationService')
const UserDocumentCount = require('../models/index').UserDocumentCount
const AdditionalApplicationInfo = require('../models/index').AdditionalApplicationInfo
const Application = require('../models/index').Application
const ApplicationPaymentDetails = require('../models/index').ApplicationPaymentDetails
const sequelize = require('../models/index').sequelize

const businessApplicationController = {
  showDocumentQuantityPage: (req, res) => {
    if (req.session.appType !== 1) {
      if (typeof req.session.search_history === 'undefined') {
        // required to exist for eligibility checker
        req.session.search_history = []
      }
    }

    UserDocumentCount.findOne({ where: { application_id: req.session.appId } }).then((data) => {
      const user_data = HelperService.getUserData(req, res)
      if (user_data.account === null) {
        req.flash('error', 'You need to complete your account details before using the Next-Day service.')
        res.redirect(`${user_data.url}/complete-details`)
      }

      let selectedDocsCount = 0
      if (data !== null) {
        selectedDocsCount = data.doc_count
      } else {
        if (typeof req.session.selectedDocuments !== 'undefined') {
          selectedDocsCount = req.session.selectedDocuments.totalQuantity
        }
      }
      return res.view('businessForms/documentQuantity', {
        application_id: req.session.appId,
        error_report: false,
        submit_status: req.session.appSubmittedStatus,
        current_uri: req.originalUrl,
        form_values: false,
        update: false,
        selected_docs: req.session.selectedDocuments,
        last_doc_checker_page: req.session.last_doc_checker_page,
        selected_docs_count: selectedDocsCount,
        doc_cost: HelperService.getAppPrice(req),
        summary: false,
        user_data: HelperService.getUserData(req, res),
      })
    })
  },

  /**
   * This method is submitted to by the Document Quantity page. It returns itself if there is an error,
   * and continues to the additional information page if all is ok.
   * As of FCDO-241, it will first send you to the "important information" page before the additional information
   * page.
   * */
  addDocumentCount: async (req, res) => {
    req.session.last_business_application_page = '/business-document-quantity'

    try {
      const data = await UserDocumentCount.findOne({ where: { application_id: req.session.appId } })

      // Make sure user hasn't submitted more than 20 docs for premium applications
      if (req.session.appType === 2 && req.body.documentCount > 20) {
        req.flash('error', 'Max 20 documents')
        return res.redirect('/business-document-quantity?pk_campaign=Premium-Service&pk_kwd=Premium')
      }

      if (!data) {
        try {
          await UserDocumentCount.create({
            application_id: req.session.appId,
            doc_count: req.body.documentCount,
            price: req.body.documentCount * HelperService.getAppPrice(req),
          })
          return res.redirect('/business-additional-information')
        } catch (error) {
          sails.log.error('Error creating user document count:', { error })

          const dataValues = [
            {
              documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : '',
            },
          ]

          return res.view('businessForms/documentQuantity.ejs', {
            application_id: req.session.appId,
            error_report: ValidationService.validateForm({ error: error }),
            form_values: dataValues[0],
            update: false,
            return_address: req.param('return_address'),
            selected_docs_count: false,
            submit_status: req.session.appSubmittedStatus,
            doc_cost: HelperService.getAppPrice(req),
            current_uri: req.originalUrl,
            altAddress: req.session.altAddress,
            user_data: HelperService.getUserData(req, res),
          })
        }
      } else {
        try {
          await UserDocumentCount.update(
            {
              doc_count: req.body.documentCount,
              price: req.body.documentCount * HelperService.getAppPrice(req),
            },
            {
              where: { application_id: req.session.appId },
            },
          )

          const thereIsAPaymentForThisApp = await ApplicationPaymentDetails.findOne({
            where: { application_id: req.session.appId },
          })

          if (thereIsAPaymentForThisApp) {
            await ApplicationPaymentDetails.update(
              {
                payment_url: null,
              },
              {
                where: { application_id: req.session.appId },
              },
            )
          }

          return res.redirect('/business-additional-information')
        } catch (error) {
          sails.log.error('Error updating user document count:', { error })

          const dataValues = [
            {
              documentCount: req.param('documentCount') !== '' ? req.param('documentCount') : '',
            },
          ]

          return res.view('businessForms/documentQuantity.ejs', {
            application_id: req.session.appId,
            error_report: ValidationService.validateForm({ error: error }),
            form_values: dataValues[0],
            update: false,
            return_address: req.param('return_address'),
            selected_docs_count: false,
            submit_status: req.session.appSubmittedStatus,
            doc_cost: HelperService.getAppPrice(req),
            current_uri: req.originalUrl,
            altAddress: req.session.altAddress,
            user_data: HelperService.getUserData(req, res),
          })
        }
      }
    } catch (error) {
      sails.log.error(error)
    }
  },

  showAdditionalInformation: (req, res) => {
    if (req.session.last_business_application_page === '/business-document-quantity') {
      req.session.last_business_application_page = '/check-documents-important-information'

      req.session.importantInfoNextPage = '/business-additional-information'

      return res.redirect('/check-documents-important-information')
    } else {
      delete req.session.importantInfoNextPage

      Application.findOne({ where: { application_id: req.session.appId } })
        .then((application) => {
          const feedback_consent = application.feedback_consent
          AdditionalApplicationInfo.findOne({ where: { application_id: req.session.appId } })
            .then((data) => {
              if (data === null) {
                return res.view('businessForms/additionalInformation.ejs', {
                  application_id: req.session.appId,
                  form_values: false,
                  error_report: false,
                  changing: false,
                  submit_status: req.session.appSubmittedStatus,
                  current_uri: req.originalUrl,
                  user_data: HelperService.getUserData(req, res),
                })
              } else {
                return res.view('businessForms/additionalInformation.ejs', {
                  application_id: req.session.appId,
                  form_values: data,
                  feedback_consent: feedback_consent,
                  error_report: false,
                  changing: true,
                  update: true,
                  summary: req.session.summary,
                  submit_status: req.session.appSubmittedStatus,
                  current_uri: req.originalUrl,
                  user_data: HelperService.getUserData(req, res),
                })
              }
            })
            .catch((error) => {
              sails.log.error('Error fetching additional application info:', { error })
            })
        })
        .catch((error) => {
          sails.log.error('Error fetching application:', { error })
        })
    }
  },

  addAdditionalInformation: (req, res) => {
    // catch those users who don't answer the Feedback Consent question
    let feedbackConsent = false

    if (req.param('feedback_consent') === undefined) {
      feedbackConsent = false
    } else {
      feedbackConsent = req.param('feedback_consent')
    }
    const user_ref = req.body.customer_ref || ''

    AdditionalApplicationInfo.findOne({ where: { application_id: req.session.appId } }).then((data) => {
      if (data === null) {
        AdditionalApplicationInfo.create({
          application_id: req.session.appId,
          user_ref: user_ref,
        })
          .then((_created) => {
            Application.update(
              { feedback_consent: feedbackConsent },
              {
                where: { application_id: req.session.appId },
              },
            ).then(() => {
              businessApplicationController.payForApplication(req, res)
            })
          })
          .catch((error) => {
            const dataValues = []
            dataValues.push({
              user_ref: user_ref,
            })
            return res.view('businessForms/additionalInformation.ejs', {
              application_id: req.session.appId,
              error_report: ValidationService.validateForm({ error: error }),
              form_values: dataValues[0],
              update: false,
              return_address: req.param('return_address'),
              submit_status: req.session.appSubmittedStatus,
              current_uri: req.originalUrl,
              user_data: HelperService.getUserData(req, res),
            })
          })
      } else {
        AdditionalApplicationInfo.update(
          {
            user_ref: user_ref,
          },
          {
            where: { application_id: req.session.appId },
          },
        )
          .then((_created) => {
            Application.update(
              { feedback_consent: feedbackConsent },
              {
                where: { application_id: req.session.appId },
              },
            ).then(() => {
              businessApplicationController.payForApplication(req, res)
            })
          })
          .catch((error) => {
            sails.log.error('Error updating additional application info:', { error })
            const dataValues = []
            dataValues.push({
              user_ref: req.param('customer_ref') !== '' ? req.param('customer_ref') : '',
            })
            return res.view('businessForms/additionalInformation.ejs', {
              application_id: req.session.appId,
              error_report: ValidationService.validateForm({ error: error }),
              form_values: dataValues[0],
              update: false,
              return_address: req.param('return_address'),
              submit_status: req.session.appSubmittedStatus,
              current_uri: req.originalUrl,
              user_data: HelperService.getUserData(req, res),
            })
          })
      }
    })
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
        user_accepts: false,
      })
    }

    const nextPage = req.session.importantInfoNextPage || '/your-basic-details'
    delete req.session.importantInfoNextPage
    return res.redirect(nextPage)
  },

  checkDocumentsImportantInformation: (req, res) =>
    res.view('documentChecker/documentsCheckerImportantInformation', {
      error_report: req.session.importantInfoError?.error_report || null,
      show_accept_error: req.session.importantInfoError?.show_accept_error || false,
      submit_status: req.session.appSubmittedStatus,
      user_data: HelperService.getUserData(req, res),
      user_accepts: false,
    }),

  payForApplication: (req, res) => {
    const expectedAppType = [2, 3]

    if (!HelperService.checkApplicationHasValidSession(req, expectedAppType)) {
      return res.serverError(`Reject this application as appType in session is invalid`)
    }

    UserDocumentCount.findOne({ where: { application_id: req.session.appId } }).then((data) => {
      if (!data) {
        return res.serverError()
      }

      // should only be one result from query, return the total_price column value
      const totalPrice = data.price
      // if a user is currently logged in, get their payment reference
      let payment_ref = '0'
      const userLoggedIn = HelperService.LoggedInStatus(req)
      if (userLoggedIn && req.session.payment_reference) {
        payment_ref = req.session.payment_reference
      }

      // add entry to payment details table (including payment ref if present)
      ApplicationPaymentDetails.findOne({ where: { application_id: req.session.appId } }).then((data) => {
        if (!data) {
          ApplicationPaymentDetails.create({
            application_id: req.session.appId,
            payment_amount: totalPrice,
            oneclick_reference: payment_ref,
          })
            .then(() => {
              // get URL for payment service (environment specific - override in /config/env/<environment>)
              const redirectUrl = sails.config.payment.paymentStartPageUrl

              // redirect - posts to payment service URL (will include application_id from original request as post data)
              return res.redirect(307, redirectUrl)
            })
            .catch((error) => {
              sails.log.error('Error creating application payment details:', { error })
            })
        } else {
          if (data.payment_complete) {
            if (data.payment_status === 'AUTHORISED') {
              return res.view('paymentError.ejs', {
                application_id: req.session.appId,
                error_report: true,
                submit_status: req.session.appSubmittedStatus,
                user_data: HelperService.getUserData(req, res),
              })
            }
            // Cancelled payment so carry on. Probably got here due to browser back button pushing
          }
          // update payment details in case price has changed
          ApplicationPaymentDetails.update(
            {
              payment_amount: totalPrice,
            },
            {
              where: { application_id: req.session.appId },
            },
          )
            .then((_created) => {
              const redirectUrl = sails.config.payment.paymentStartPageUrl
              // redirect - posts to payment service URL (will include application_id from original request as post data)
              return res.redirect(307, redirectUrl)
            })
            .catch((error) => {
              sails.log.error('Error updating application payment details:', { error })
            })
        }
      })
    })
  },

  exportAppData: (req, _res) => {
    const appId = req.query.merchantReturnData

    // Validate and sanitize the appId input
    if (!appId || Number.isNaN(Number(appId))) {
      sails.log.error('Invalid appId provided')
      return
    }

    // Call PostgreSQL stored procedure using parameterized query
    sequelize
      .query('SELECT * FROM populate_exportedbusinessapplicationdata(:appId)', {
        replacements: { appId: appId },
        type: sequelize.QueryTypes.SELECT,
      })
      .then((_results) => {
        sails.log.info('Application export to exports table completed.')
      })
      .catch((error) => {
        sails.log.error('Error exporting application data:', { error })
      })
  },

  confirmation: (req, res) => {
    if (!req.session.appId) {
      //IF YOU'VE GOT HERE AND YOUR SESSION IS NO LONGER AVAILABLE
      //DISPLAY THE SESSION EXPIRED PAGE
      res.clearCookie('LoggedIn')
      return res.redirect(`/session-expired?LoggedIn=${!!req.cookies.LoggedIn}`)
    } else {
      const application_id = req.query.id
      const application_reference = req.query.appReference
      async.series(
        {
          Application: (callback) => {
            Application.findOne({ where: { application_id: application_id } })
              .then((found) => {
                let appDeets = null
                if (found) {
                  appDeets = found
                }
                callback(null, appDeets)

                return null
              })
              .catch((error) => {
                sails.log.error('Error fetching application:', { error })
              })
          },

          UserDetails: (callback) => {
            UserModels.User.findOne({ where: { email: req.session.email } }).then((user) => {
              UserModels.AccountDetails.findOne({ where: { user_id: user.id } }).then((account) => {
                const userDetails = [null, null]

                if (user) {
                  userDetails[0] = user
                }
                if (account) {
                  userDetails[1] = account
                }
                callback(null, userDetails)

                return null
              })
            })
          },

          // get user_ref
          AdditionalApplicationInfo: (callback) => {
            AdditionalApplicationInfo.findOne({ where: { application_id: application_id } })
              .then((found) => {
                let addInfoDeets = null
                if (found) {
                  addInfoDeets = found
                }
                callback(null, addInfoDeets)
                return null
              })
              .catch((error) => {
                sails.log.error('Error fetching additional application info:', { error })
              })
          },

          Receipt: (callback) => {
            sequelize
              .query(`SELECT * FROM "UserDocumentCount" udc where udc.application_id='${application_id}'`, {
                type: sequelize.QueryTypes.SELECT,
              })
              .then((results) => {
                let totalDocPriceDeets = null
                if (results) {
                  totalDocPriceDeets = results[0]
                }
                callback(null, totalDocPriceDeets)

                return null
              })
              .catch((error) => {
                sails.log.error('Error fetching user document count:', { error })
              })
          },
        },
        (_err, results) => {
          const customer_ref = results.AdditionalApplicationInfo.user_ref

          if (!req.session.appSubmittedStatus) {
            EmailService.submissionConfirmation(
              results.UserDetails[0].email,
              application_reference,
              HelperService.getBusinessSendInformation(results.Application.serviceType, req),
              customer_ref,
              results.Application.serviceType,
              results.Application.application_guid,
            )
          }
          req.session.appSubmittedStatus = true //true submitted, false not submitted
          return res.view('businessForms/application-successful.ejs', {
            application_id: application_id,
            email: results.UserDetails[0].email,
            unique_application_id: results.Application.unique_app_id,
            application_type: results.Application.serviceType,
            receipt: results.Receipt,
            submit_status: req.session.appSubmittedStatus,
            user_ref: results.AdditionalApplicationInfo.user_ref,
            user_data: HelperService.getUserData(req, res),
          })
        },
      )
    }
  },
}
module.exports = businessApplicationController
