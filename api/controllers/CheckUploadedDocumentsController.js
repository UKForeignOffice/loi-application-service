const sails = require('sails');

const COST_PER_DOCUMENT = 30;

const CheckUploadedDocumentsController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        const { uploadedFileData } = req.session.eApp;
        const totalDocuments = uploadedFileData.length;
        const documentNames = uploadedFileData.map((file) => file.filename);
        const totalCost = totalDocuments * COST_PER_DOCUMENT;

        return res.view('eApostilles/checkUploadedDocuments.ejs', {
            user_data: userData,
            documentNames,
            totalDocuments,
            userRef: req.session.eApp.userRef,
            totalCost: HelperService.formatToUKCurrency(totalCost),
        });
    },

    addDocsToDBHandler(req, res) {
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
        const totalPrice = documentCount * COST_PER_DOCUMENT;
        const redirectUrl = req._sails.config.payment.paymentStartPageUrl;
        const params = {
            appId,
            totalPrice,
            paymentRef,
            documentCount,
            redirectUrl,
        };

        CheckUploadedDocumentsController._checkDocumentCountInDB(params, res);

        // TODO Here for testing purposes, will move to it's own controller on user ref ticket
        CheckUploadedDocumentsController._checkAdditionalApplicationInfoInDB(
            req,
            res
        );
    },

    _checkDocumentCountInDB(params, res) {
        UserDocumentCount.find({
            where: {
                application_id: params.appId,
            },
        }).then((data) => {
            if (!data) {
                CheckUploadedDocumentsController._createDocumentCountInDB(
                    params,
                    res
                );
            } else {
                CheckUploadedDocumentsController._updateDocumentCountInDB(
                    params,
                    res
                );
            }
        });
    },

    _createDocumentCountInDB(params, res) {
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
                    params,
                    res
                );
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _updateDocumentCountInDB(params, res) {
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
                    params,
                    res
                );
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _checkPaymentDetailsExistsInDB(params, res) {
        return ApplicationPaymentDetails.find({
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
        AdditionalApplicationInfo.find({
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
