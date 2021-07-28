const sails = require('sails');

const inDevEnvironment = process.env.NODE_ENV === 'development';
const COST_PER_DOCUMENT = 30;

const CheckUploadedDocumentsController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        return res.view('eApostilles/checkUploadedDocuments.ejs', {
            user_data: userData,
        });
    },

    addDocsToDBHandler(req, res) {
        try {
            const { uploadedFileData } = req.session.eApp;
            if (uploadedFileData.length === 0) {
                throw new Error('No files uploaded');
            }
            uploadedFileData.forEach((uploadedFile) => {
                UploadedDocumentUrls.create(
                    CheckUploadedDocumentsController._dbColumnData(
                        uploadedFile,
                        req
                    )
                )
                    .then(() => {
                        sails.log.info(
                            `Url for document ${uploadedFile.filename} added to db`
                        );
                    })
                    .catch((err) => {
                        sails.log.error(err);
                        res.serverError();
                    });
            });

            CheckUploadedDocumentsController._checkDocumentCountAndPaymentDetails(
                req,
                res
            );
        } catch (err) {
            sails.log.error(err.message, err.stack);
            res.serverError();
        }
    },

    _dbColumnData(uploadedFile, req) {
        const sessionData = req.session;
        const fileUrl = inDevEnvironment
            ? uploadedFile.storageName
            : uploadedFile.location;

        if (!sessionData.appId) {
            throw new Error('Missing application id');
        }
        return {
            application_id: sessionData.appId,
            uploaded_url: fileUrl,
            filename: uploadedFile.filename,
        };
    },

    _checkDocumentCountAndPaymentDetails(req, res) {
        const { appId, eApp, payment_reference: paymentRef } = req.session;
        const documentCount = eApp.uploadedFileData.length;
        const totalPrice = documentCount * COST_PER_DOCUMENT;
        const redirectUrl = req._sails.config.payment.paymentStartPageUrl;
        const paymentParams = { appId, totalPrice, paymentRef, redirectUrl };
        const documentCountParams = {
            appId,
            totalPrice,
            documentCount,
        };
        CheckUploadedDocumentsController._checkDocumentCountInDB(
            documentCountParams,
            res
        );
        // Redirect to payment handled here
        CheckUploadedDocumentsController._checkPaymentDetailsExistsInDB(
            paymentParams,
            res
        );
        // Here for testing purposes, will move to it[s own controller later
        CheckUploadedDocumentsController._checkAdditionalApplicationInfoInDB(
            appId,
            res
        );
    },

    _checkDocumentCountInDB(documentCountParams, res) {
        UserDocumentCount.find({
            where: {
                application_id: documentCountParams.appId,
            },
        }).then((data) => {
            if (!data) {
                CheckUploadedDocumentsController._createDocumentCountInDB(
                    documentCountParams,
                    res
                );
            } else {
                CheckUploadedDocumentsController._updateDocumentCountInDB(
                    documentCountParams,
                    res
                );
            }
        });
    },

    _createDocumentCountInDB(documentCountParams, res) {
        UserDocumentCount.create({
            application_id: documentCountParams.appId,
            doc_count: documentCountParams.documentCount,
            price: documentCountParams.totalPrice,
        })
            .then(() => {
                sails.log.info(
                    `Document count added to db for appId ${documentCountParams.appId}`
                );
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _updateDocumentCountInDB(documentCountParams, res) {
        UserDocumentCount.update(
            {
                doc_count: documentCountParams.documentCount,
                price: documentCountParams.totalPrice,
            },
            { where: { application_id: documentCountParams.appId } }
        )
            .then(() => {
                sails.log.info(
                    `Document count updated in db for appId ${documentCountParams.appId}`
                );
            })
            .catch((err) => {
                sails.log.error(err);
                res.serverError();
            });
    },

    _checkPaymentDetailsExistsInDB(paymentParams, res) {
        ApplicationPaymentDetails.find({
            where: {
                application_id: paymentParams.appId,
            },
        }).then((data) => {
            if (!data) {
                CheckUploadedDocumentsController._createPaymentDetailsInDB(
                    paymentParams,
                    res
                );
            } else {
                CheckUploadedDocumentsController._updatePaymentAmountInDB(
                    paymentParams,
                    res
                );
            }
        });
    },

    _createPaymentDetailsInDB(paymentParams, res) {
        ApplicationPaymentDetails.create({
            application_id: paymentParams.appId,
            payment_amount: paymentParams.totalPrice,
            oneclick_reference: paymentParams.paymentRef,
        })
            .then(() => {
                sails.log.info(
                    `Payment details added to db for application ${paymentParams.appId}`
                );
                res.redirect(307, paymentParams.redirectUrl);
            })
            .catch((error) => {
                sails.log.error(error);
                res.serverError();
            });
    },

    _updatePaymentAmountInDB(paymentParams, res) {
        ApplicationPaymentDetails.update(
            {
                payment_amount: paymentParams.totalPrice,
            },
            { where: { application_id: paymentParams.appId } }
        )
            .then(() => {
                sails.log.info(
                    `Payment details updated in db for application ${paymentParams.appId}`
                );
                res.redirect(307, paymentParams.redirectUrl);
            })
            .catch((error) => {
                sails.log.error(error);
                res.serverError();
            });
    },

    _checkAdditionalApplicationInfoInDB(appId, res) {
        AdditionalApplicationInfo.find({
            where: {
                application_id: appId,
            },
        })
            .then((data) => {
                if (!data) {
                    AdditionalApplicationInfo.create({
                        application_id: appId,
                        user_ref: '', // req.param('customer_ref'),
                    });
                } else {
                    AdditionalApplicationInfo.update(
                        {
                            user_ref: '',
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
