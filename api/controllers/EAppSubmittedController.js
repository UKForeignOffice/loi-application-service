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
        const fileUrl = inDevEnvironment
            ? uploadedFile.storageName
            : await EAppSubmittedController._generateS3PresignedUrl(
                  uploadedFile.storageName,
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
        const EXPIRY_HOURS = 24;
        const EXPIRY_MINUTES = EXPIRY_HOURS * 60;
        const params = {
            Bucket: req._sails.config.eAppS3Vals.s3_bucket,
            Key: fileName,
            Expires: EXPIRY_MINUTES,
        };
        const promise = s3.getSignedUrlPromise('getObject', params);

        return promise.then(
            (url) => url,
            (err) => sails.log.error(err)
        );
    },
};

module.exports = EAppSubmittedController;
