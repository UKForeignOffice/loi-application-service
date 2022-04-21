const multer = require('multer');
const sails = require('sails');
const uploadVariables = require('../../config/environment-variables').upload
const { s3_bucket: s3BucketName, max_files_per_application: maxFiles } = uploadVariables;
const uploadFileToStorage = require('../helper/uploadFileToStorage');
const deleteFileFromStorage = require('../helper/deleteFileFromStorage');
const HelperService = require("../services/HelperService");
const {
    virusScanAndCheckFiletype,
    checkTypeSizeAndDuplication,
    displayErrorAndRemoveLargeFiles,
    connectToClamAV,
} = require('../helper/uploadedFileErrorChecks');

const FORM_INPUT_NAME = 'documents';

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
            maxFiles: maxFiles,
            backLink: '/eapp-start-page',
        });
    },

    uploadFileHandler(req, res) {
        FileUploadController._clearExistingErrorMessages(req);
        sails.log.info('File successfully uploaded.');
        FileUploadController._errorChecksAfterUpload(req, res)
    },

    _multerSetup() {
        const multerOptions = {
            storage: uploadFileToStorage(s3BucketName),
            fileFilter: checkTypeSizeAndDuplication
        };

        return multer(multerOptions).array(FORM_INPUT_NAME);
    },

    _clearExistingErrorMessages(req) {
        req.session.eApp.uploadMessages.errors = [];
        req.session.eApp.uploadMessages.fileCountError = false;
        req.session.eApp.uploadMessages.infectedFiles = [];
        req.session.eApp.uploadMessages.noFileUploadedError = false;
    },

    async _errorChecksAfterUpload(req, res, err) {
        const documentCount = req.session.eApp.uploadedFileData.length;

        displayErrorAndRemoveLargeFiles(req);

        if (documentCount > maxFiles) {
          req.session.eApp.uploadMessages.fileCountError = true;
        }

        if (err) {
              sails.log.error(err);
        } else {
            await virusScanAndCheckFiletype(req);
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
