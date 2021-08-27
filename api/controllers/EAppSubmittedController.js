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
                    return EAppSubmittedController._renderPageAndSendConfirmationEmail(
                        req,
                        res
                    );
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
            sails.log.error(err.message, err.stack);
            res.serverError();
        }
    },

    _renderPageAndSendConfirmationEmail(req, res) {
        const queryParams = req.params.all();
        const applicationId = queryParams.merchantReference;
        const userDetails = {
            firstName: req.session.account.first_name,
            lastName: req.session.account.last_name,
            email: req.session.email,
            appType: req.session.appType,
            userRef: req.session.user.id,
        };

        EAppSubmittedController._sendConfirmationEmail(
            userDetails,
            applicationId
        );
        return res.view('eApostilles/applicationSubmissionSuccessful.ejs', {
            email: userDetails.email,
            applicationId,
            user_data: HelperService.getUserData(req, res), // needed for inner-header.ejs
        });
    },

    _sendConfirmationEmail(userDetails, applicationId) {
        const emailAddress = userDetails.email;
        const applicationRef = applicationId;
        const sendInformation = {
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
        };
        const userRef = userDetails.userRef;
        const serviceType = userDetails.appType;

        EmailService.submissionConfirmation(
            emailAddress,
            applicationRef,
            sendInformation,
            userRef,
            serviceType
        );
    },
    /**
     * @return {Promise<{application_id: number, uploaded_url: string, filename: string}>}
     **/
    async _dbColumnData(uploadedFile, req) {
        const sessionData = req.session;
        const { s3_bucket: s3Bucket } = req._sails.config.eAppS3Vals;
        let fileUrl = uploadedFile.storageName;

        if (!sessionData.appId) {
            throw new Error('Missing application id');
        }

        if (!inDevEnvironment) {
            fileUrl = await EAppSubmittedController._generateS3PresignedUrl(
                uploadedFile.storageName,
                s3Bucket
            );
            EAppSubmittedController._addSubmittedTag(
                uploadedFile.storageName,
                s3Bucket
            );
        }

        return {
            application_id: sessionData.appId,
            uploaded_url: fileUrl,
            filename: uploadedFile.filename,
        };
    },

    _generateS3PresignedUrl(uploadedfileName, s3Bucket) {
        const EXPIRY_HOURS = 24;
        const EXPIRY_MINUTES = EXPIRY_HOURS * 60;
        const params = {
            Bucket: s3Bucket,
            Key: uploadedfileName,
            Expires: EXPIRY_MINUTES,
        };
        const promise = s3.getSignedUrlPromise('getObject', params);

        return promise.then(
            (url) => {
                sails.log.info(
                    `Presigned url stored in database for ${uploadedfileName}`
                );
                return url;
            },
            (err) => {
                throw new Error(err);
            }
        );
    },

    _addSubmittedTag(uploadedfileName, s3Bucket) {
        const params = {
            Bucket: s3Bucket,
            Key: uploadedfileName,
            Tagging: {
                TagSet: [
                    {
                        Key: 'app_status',
                        Value: 'SUBMITTED',
                    },
                ],
            },
        };
        s3.putObjectTagging(params, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
        sails.log.info(`SUBMITTED tag added to ${uploadedfileName}`);
    },
};

module.exports = EAppSubmittedController;
