const inDevEnvironment = process.env.NODE_ENV === 'development';

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
            res.redirect('/check-uploaded-documents');
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
};

module.exports = CheckUploadedDocumentsController;
