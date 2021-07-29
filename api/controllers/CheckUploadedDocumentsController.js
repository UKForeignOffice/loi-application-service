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
            for (let i = 0; i <= uploadedFileData.length; i++) {
                const endOfLoop = i === uploadedFileData.length;
                if (endOfLoop) {
                    CheckUploadedDocumentsController._checkDocumentCountAndPaymentDetails(
                        req,
                        res
                    );
                } else {
                    UploadedDocumentUrls.create(
                        CheckUploadedDocumentsController._dbColumnData(
                            uploadedFileData[i],
                            req
                        )
                    )
                        .then(() => {
                            sails.log.info(
                                `Url for document ${uploadedFileData[i].filename} added to db`
                            );
                        })
                        .catch((err) => {
                            throw new Error(err);
                        });
                }
            }
        } catch (err) {
            sails.log.error(err.message);
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
        const params = {
            appId,
            totalPrice,
            paymentRef,
            documentCount,
            redirectUrl,
        };

        CheckUploadedDocumentsController._checkDocumentCountInDB(params, res);

        // TODO Here for testing purposes, will move to it's own controller later
        CheckUploadedDocumentsController._checkAdditionalApplicationInfoInDB(
            appId,
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
        UserDocumentCount.create({
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
        UserDocumentCount.update(
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
        ApplicationPaymentDetails.find({
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
        ApplicationPaymentDetails.create({
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
        ApplicationPaymentDetails.update(
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
