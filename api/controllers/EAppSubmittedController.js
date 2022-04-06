// @ts-check
const sails = require('sails');
const AWS = require('aws-sdk');
const EmailService = require("../services/EmailService");
const HelperService = require("../services/HelperService");
const s3 = new AWS.S3();
const inDevEnvironment = process.env.NODE_ENV === 'development';
const UploadedDocumentUrls = require('../models/index').UploadedDocumentUrls;

const EAppSubmittedController = {
    async addDocsAndRenderPage(req, res) {
        try {
            const { uploadedFileData } = req.session.eApp;
            const queryParams = req.params.all();
            if (!queryParams.appReference) {
                throw new Error('Missing reference in query param');
            }

            if (uploadedFileData.length === 0) {
                const serviceIsPublic =
                    req._sails.config.views.locals.service_public;

                if (serviceIsPublic) {
                    throw new Error('No uploaded file data found in session');
                }
                sails.log.error('No uploaded file data found in session - render page for e2e test');
                return EAppSubmittedController._renderPage(req, res);
            }

            for (let i = 0; i <= uploadedFileData.length; i++) {
                const endOfLoop = i === uploadedFileData.length;
                if (endOfLoop) {
                    EAppSubmittedController._sendConfirmationEmail(req);
                    EAppSubmittedController._renderPage(req, res);
                    return;
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

    _renderPage(req, res) {
        const queryParams = req.params.all();

        return res.view('eApostilles/applicationSubmissionSuccessful.ejs', {
            email: req.session.email,
            applicationId: queryParams.appReference,
            user_data: HelperService.getUserData(req, res),
        });
    },

    _sendConfirmationEmail(req) {
        const queryParams = req.params.all();
        const sendInformation = {
            first_name: req.session.account.first_name,
            last_name: req.session.account.last_name,
        };
        const userRef = req.session.user.id;
        const serviceType = req.session.appType;

        EmailService.submissionConfirmation(
            req.session.email,
            queryParams.appReference,
            sendInformation,
            userRef,
            serviceType
        );

        EAppSubmittedController._resetEAppSessionData(req);
    },

    _resetEAppSessionData(req) {
        const newSessionData = {
            s3FolderName: '',
            uploadedFileData: [],
        };
        req.session.eApp = newSessionData;
    },

    /**
     * @return {Promise<{application_id: number, uploaded_url: string, filename: string}>}
     **/
    async _dbColumnData(uploadedFile, req) {
        const sessionData = req.session;
        const { s3_bucket: s3Bucket, s3_url_expiry_hours: s3UrlExpiryHours } =
            req._sails.config.upload;
        let fileUrl = uploadedFile.storageName;

        if (!sessionData.appId) {
            throw new Error('Missing application id');
        }

        if (!inDevEnvironment) {
            fileUrl = await EAppSubmittedController._generateS3PresignedUrl(
                uploadedFile.storageName,
                { s3Bucket, s3UrlExpiryHours }
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

    _generateS3PresignedUrl(uploadedfileName, configParams) {
        const { s3Bucket, s3UrlExpiryHours } = configParams;
        const EXPIRY_MINUTES = s3UrlExpiryHours * 60;
        const params = {
            Bucket: s3Bucket,
            Key: uploadedfileName,
            Expires: EXPIRY_MINUTES,
        };
        const promise = s3.getSignedUrlPromise('getObject', params);

        return promise.then(
            (url) => {
                sails.log.info(
                    `Presigned url generated for ${uploadedfileName}`
                );
                return url;
            },
            (err) => {
                throw new Error(err);
            }
        );
    },

    _addSubmittedTag(uploadedfileName, s3Bucket) {
        const reapplyCleanTag = {
            Key: 'av-status',
            Value: 'CLEAN',
        };
        const fileBelongsToSubmittedApplication = {
            Key: 'app_status',
            Value: 'SUBMITTED',
        };
        const params = {
            Bucket: s3Bucket,
            Key: uploadedfileName,
            Tagging: {
                TagSet: [reapplyCleanTag, fileBelongsToSubmittedApplication],
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
