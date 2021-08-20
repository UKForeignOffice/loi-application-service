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
                    return EAppSubmittedController._renderPage(res);
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

    _renderPage(res) {
        return res.view('eApostilles/applicationSubmissionSuccessful.ejs', {});
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

    _generateS3PresignedUrl(fileName, req) {
        const EXPIRY_HOURS = 24;
        const EXPIRY_MINUTES = EXPIRY_HOURS * 60;
        const params = {
            Bucket: req._sails.config.eAppS3Vals.s3_bucket,
            Key: fileName,
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
            Key: uploadedFile.storatgeName,
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
        sails.log.info(`Submitted app_status tag added to ${uploadedfileName}`);
    },
};

module.exports = EAppSubmittedController;
