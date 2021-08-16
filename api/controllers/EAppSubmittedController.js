const sails = require('sails');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-2' });

const inDevEnvironment = process.env.NODE_ENV === 'development';

const EAppSubmittedController = {
    async addDocsAndRenderPage(req, res) {
        try {
            const { uploadedFileData } = req.session.eApp;
            if (uploadedFileData.length === 0) {
                throw new Error('No files uploaded');
            }
            for (let i = 0; i <= uploadedFileData.length; i++) {
                const endOfLoop = i === uploadedFileData.length;
                if (endOfLoop) {
                    EAppSubmittedController._sendConfirmationEmail();
                    return EAppSubmittedController._renderPage(req, res);
                }
                UploadedDocumentUrls.create(
                    await EAppSubmittedController._dbColumnData(
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
        } catch (err) {
            sails.log.error(err.message);
            res.serverError();
        }
    },

    _sendConfirmationEmail() {
        const emailAddress = '';
        const applicationRef = '';
        const sendInformation = {firstName: '', lastName: ''};
        const userRef = '';
        const serviceType = 4;

        EmailService.submissionConfirmation(
            emailAddress,
            applicationRef,
            sendInformation,
            userRef,
            serviceType
        );
    },

    _renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        const queryParams = req.params.all();

        return res.view('eApostilles/applicationSubmissionSuccessful.ejs', {
            user_data: userData,
            applicationId: queryParams.merchantReference,
        });
    },

    /**
     * @return {Promise<{application_id: number, uploaded_url: string, filename: string}>}
     **/
    async _dbColumnData(uploadedFile, req) {
        const sessionData = req.session;
        const fileUrl = inDevEnvironment
            ? uploadedFile.storageName
            : await EAppSubmittedController._generateS3PresignedUrl(
                  uploadedFile.filename,
                  req
              );

        if (!sessionData.appId) {
            throw new Error('Missing application id');
        }
        return {
            application_id: sessionData.appId,
            uploaded_url: fileUrl,
            filename: uploadedFile.filename,
        };
    },

    _generateS3PresignedUrl(fileName, req) {
        const params = {
            Bucket: req._sails.config.eAppS3Vals.s3_bucket,
            Key: fileName,
            Expires: 60,
        };
        const promise = s3.getSignedUrlPromise('getObject', params);

        return promise.then(
            (url) => url,
            (err) => sails.log.error(err)
        );
    },
};

module.exports = EAppSubmittedController;
