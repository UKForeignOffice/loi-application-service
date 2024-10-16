// @ts-check
const sails = require('sails');
const HelperService = require("../services/HelperService");
const UserDocumentCount = require('../models/index').UserDocumentCount;
const ApplicationPaymentDetails = require('../models/index').ApplicationPaymentDetails;
const AdditionalApplicationInfo = require('../models/index').AdditionalApplicationInfo;
const addUserDataToDB = require('../helper/addUserDataToDB.js');

const CheckUploadedDocumentsController = {
    async renderPage(req, res) {

        if (HelperService.maxFileLimitExceeded(req))
            return res.serverError('maxFileLimitExceeded');

        const userData = HelperService.getUserData(req, res);
        const { uploadedFileData } = req.session.eApp;
        const totalDocuments = uploadedFileData.length;
        const documentNames = uploadedFileData.map((file) => file.filename);
        const totalCost = totalDocuments * req._sails.config.upload.cost_per_document;

        const addUserDataSuccess = await addUserDataToDB(req, res);
        if (!addUserDataSuccess) {
          return
        }

        return res.view('eApostilles/checkUploadedDocuments.ejs', {
            user_data: userData,
            documentNames,
            totalDocuments,
            userRef: req.session.eApp.userRef,
            totalCost: HelperService.formatToUKCurrency(totalCost),
        });
    },

    addDocsToDBHandler(req, res) {
      const expectedAppType = [4]
        if (!HelperService.checkApplicationHasValidSession(req, expectedAppType)) {
            return res.serverError(`Reject this application as appType in session is invalid`);
        }
        try {
            CheckUploadedDocumentsController._checkDocumentCountAndPaymentDetails(
                req,
                res
            );
        } catch (err) {
            sails.log.error(err.message);
            res.serverError();
        }
    },

    _checkDocumentCountAndPaymentDetails(req, res) {
        const { appId, eApp, payment_reference: paymentRef } = req.session;
        const documentCount = eApp.uploadedFileData.length;
        const totalPrice = documentCount * req._sails.config.upload.cost_per_document;
        const redirectUrl = req._sails.config.payment.paymentStartPageUrl
        const params = {
            appId,
            totalPrice,
            paymentRef,
            documentCount,
            redirectUrl,
        };

        CheckUploadedDocumentsController._checkDocumentCountInDB(req, res, params);

        CheckUploadedDocumentsController._checkAdditionalApplicationInfoInDB(
            req,
            res
        );
    },

    _checkDocumentCountInDB(req, res, params) {
        UserDocumentCount.findOne({
            where: {
                application_id: params.appId,
            },
        }).then((data) => {
            if (!data) {
                CheckUploadedDocumentsController._createDocumentCountInDB(
                  req, res, params
                );
            } else {
                CheckUploadedDocumentsController._updateDocumentCountInDB(
                  req, res, params
                );
            }
        });
    },

    _createDocumentCountInDB(req, res, params) {
        return UserDocumentCount.create({
            application_id: params.appId,
            doc_count: params.documentCount,
            price: params.totalPrice,
        })
            .then(() => {
                sails.log.info(
                    `Document count added to db for appId ${params.appId}`
                );
                CheckUploadedDocumentsController._checkPaymentDetailsExistsInDB(
                  req, res, params
                );
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _updateDocumentCountInDB(req, res, params) {
        return UserDocumentCount.update(
            {
                doc_count: params.documentCount,
                price: params.totalPrice,
            },
            { where: { application_id: params.appId } }
        )
            .then(() => {
                sails.log.info(
                    `Document count updated in db for appId ${params.appId}`
                );
                CheckUploadedDocumentsController._checkPaymentDetailsExistsInDB(
                  req, res, params
                );
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _checkPaymentDetailsExistsInDB(req, res, params) {
        return ApplicationPaymentDetails.findOne({
            where: {
                application_id: params.appId,
            },
        }).then((data) => {
            if (!data) {
                CheckUploadedDocumentsController._createPaymentDetailsInDB(
                    params,
                    res
                );
            } else {

              if (data.payment_status === 'AUTHORISED') {
                return res.view('paymentError.ejs', {
                  application_id: req.session.appId,
                  error_report: true,
                  submit_status: req.session.appSubmittedStatus,
                  user_data: HelperService.getUserData(
                    req,
                    res
                  ),
                });
              }

              CheckUploadedDocumentsController._updatePaymentAmountInDB(
                  params,
                  res
                );
            }
        });
    },

    _createPaymentDetailsInDB(params, res) {
        return ApplicationPaymentDetails.create({
            application_id: params.appId,
            payment_amount: params.totalPrice,
            oneclick_reference: params.paymentRef,
        })
            .then(() => {
                sails.log.info(
                    `Payment details added to db for application ${params.appId}`
                );
                res.redirect(307, params.redirectUrl);
            })
            .catch((error) => {
                sails.log.error(error);
                res.serverError();
            });
    },

    _updatePaymentAmountInDB(params, res) {
        return ApplicationPaymentDetails.update(
            {
                payment_amount: params.totalPrice,
                payment_url: null
            },
            { where: { application_id: params.appId } }
        )
            .then(() => {
                sails.log.info(
                    `Payment details updated in db for application ${params.appId}`
                );
                res.redirect(307, params.redirectUrl);
            })
            .catch((error) => {
                sails.log.error(error);
                res.serverError();
            });
    },

    _checkAdditionalApplicationInfoInDB(req, res) {
        const { appId, eApp } = req.session;
        AdditionalApplicationInfo.findOne({
            where: {
                application_id: appId,
            },
        })
            .then((data) => {
                if (!data) {
                    return AdditionalApplicationInfo.create({
                        application_id: appId,
                        user_ref: eApp.userRef,
                    });
                } else {
                    return AdditionalApplicationInfo.update(
                        {
                            user_ref: eApp.userRef,
                        },
                        {
                            where: {
                                application_id: appId,
                            },
                        }
                    );
                }
            })
            .catch((error) => {
                sails.log.error(error);
                res.serverError();
            });
    },
};

module.exports = CheckUploadedDocumentsController;
