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
            uploadedFileData.forEach(async (uploadedFile) => {
                await UploadedDocumentUrls.create(
                    CheckUploadedDocumentsController._dbColumnData(
                        uploadedFile,
                        req
                    )
                );
                sails.log.info(
                    `Url for document ${uploadedFile.filename} added to db`
                );
            });
            // Redirect handled here
            CheckUploadedDocumentsController._checkPaymentDetailsExistsInDB(req, res);
        } catch (err) {
            sails.log.error(err);
            res.serverError();
        }
    },

    _dbColumnData(uploadedFile, req) {
        const sessionData = req.session;
        const fileUrl = inDevEnvironment
            ? uploadedFile.storageName
            : uploadedFile.location;

        return {
            application_id: sessionData.appId || 0, // TODO throw error if this value is false
            uploaded_url: fileUrl,
        };
    },

    _checkPaymentDetailsExistsInDB(req, res) {
        const { appId, eApp, payment_reference: paymentRef } = req.session;
        const totalPrice = eApp.uploadedFileData.length * COST_PER_DOCUMENT;
        const redirectUrl = sails.config.payment.paymentStartPageUrl;
        const paymentParams = { appId, totalPrice, paymentRef, redirectUrl };

        ApplicationPaymentDetails.find({
            where: {
                application_id: appId,
            },
        }).then((data) => {
            if (!data) {
                CheckUploadedDocumentsController._addPaymentDetailsToDB(
                    paymentParams, res
                );
            } else {
                CheckUploadedDocumentsController._updatePaymentAmountInDB(
                    paymentParams, res
                );
            }
        });
    },

    _addPaymentDetailsToDB(paymentParams, res) {
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
                    `Payment details updated to db for application ${paymentParams.appId}`
                );
                res.redirect(307, paymentParams.redirectUrl);
            })
            .catch((error) => {
                sails.log.error(error);
                res.serverError();
            });
    },
};

module.exports = CheckUploadedDocumentsController;
