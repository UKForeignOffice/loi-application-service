const multer = require('multer');
const sails = require('sails');

const uploadFileToStorage = require('../helpers/uploadFileToStorage');
const deleteFileFromStorage = require('../helpers/deleteFileFromStorage');
const {
    virusScan,
    checkTypeSizeAndDuplication,
    displayErrorAndRemoveLargeFiles,
    connectToClamAV,
    checkFileType,
} = require('../helpers/uploadedFileErrorChecks');

const FORM_INPUT_NAME = 'documents';
const MULTER_FILE_COUNT_ERR_CODE = 'LIMIT_FILE_COUNT';

const inDevEnvironment = process.env.NODE_ENV === 'development';

const FileUploadController = {
    async uploadFilesPage(req, res) {
        const connectedToClamAV = await connectToClamAV(req);
        const userData = HelperService.getUserData(req, res);

        if (!connectedToClamAV) {
            return res.view('eApostilles/fileUploadError.ejs');
        }

        if (!userData.loggedIn) {
            sails.log.error('User is not logged in:', userData);
            return res.forbidden();
        }
        return res.view('eApostilles/uploadFiles.ejs', {
            user_data: userData,
            backLink: '/eapp-start-page',
        });
    },

    uploadFileHandler(req, res) {
        FileUploadController._clearExistingErrorMessages(req);
        const uploadFileWithMulter = FileUploadController._multerSetup(req);
        uploadFileWithMulter(req, res, (err) => {
            sails.log.info('File successfully uploaded.');
            FileUploadController._errorChecksAfterUpload(req, res, err);
        });
    },

    _multerSetup(req) {
        const { s3_bucket: s3BucketName, max_files_per_application: maxFiles } =
            req._sails.config.upload;
        const multerOptions = {
            storage: uploadFileToStorage(s3BucketName),
            fileFilter: checkTypeSizeAndDuplication,
            limits: {
                files: Number(maxFiles),
            },
        };

        return multer(multerOptions).array(FORM_INPUT_NAME);
    },

    _clearExistingErrorMessages(req) {
        req.session.eApp.uploadMessages.errors = [];
        req.session.eApp.uploadMessages.fileCountError = false;
        req.session.eApp.uploadMessages.infectedFiles = [];
    },

    async _errorChecksAfterUpload(req, res, err) {
        displayErrorAndRemoveLargeFiles(req);
        if (err) {
            const fileLimitExceeded = err.code === MULTER_FILE_COUNT_ERR_CODE;
            if (fileLimitExceeded) {
                req.session.eApp.uploadMessages.fileCountError = true;
            } else {
                res.serverError(err);
            }
            sails.log.error(err);
        } else {
            await checkFileType(req, res);
            await virusScan(req, res);

            !inDevEnvironment &&
                FileUploadController._addS3LocationToSession(req);
        }

        FileUploadController._redirectToUploadPage(res);
    },

    _addS3LocationToSession(req) {
        const { uploadedFileData } = req.session.eApp;
        uploadedFileData.forEach((uploadedFile) => {
            const newFileUploadData = req.files.find(
                (file) => uploadedFile.filename === file.originalname
            );
            if (newFileUploadData) {
                uploadedFile.location = newFileUploadData.location;
            }
        });
        req.session.eApp.uploadedFileData = uploadedFileData;
    },

    deleteFileHandler(req, res) {
        const { uploadedFileData } = req.session.eApp;
        if (!req.body.delete) {
            sails.log.error("Item to delete wasn't specified");
            return res.badRequest();
        }
        if (uploadedFileData.length === 0) {
            sails.log.error("Item to delete wasn't found");
            return res.notFound();
        }
        const updatedSession = FileUploadController._removeFileFromSessionArray(
            req,
            uploadedFileData
        );
        req.session.eApp.uploadedFileData = updatedSession;
        FileUploadController._redirectToUploadPage(res);
    },

    _removeFileFromSessionArray(req, uploadedFileData) {
        const { s3_bucket: s3BucketName } = req._sails.config.upload;
        return uploadedFileData.filter((uploadedFile) => {
            const fileToDeleteExists =
                uploadedFile.filename === req.body.delete;
            if (fileToDeleteExists) {
                deleteFileFromStorage(uploadedFile, s3BucketName);
            }
            return uploadedFile.filename !== req.body.delete;
        });
    },

    _redirectToUploadPage(res) {
        res.redirect('/upload-files');
    },
};

module.exports = FileUploadController;
