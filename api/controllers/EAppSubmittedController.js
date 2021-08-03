const sails = require('sails');

const inDevEnvironment = process.env.NODE_ENV === 'development';

const EAppSubmittedController = {
    addDocsAndRenderPage(req, res) {
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
                    EAppSubmittedController._dbColumnData(
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
};

module.exports = EAppSubmittedController;
