// @ts-check
const multer = require('multer');
const sails = require('sails');
const uploadVariables = require('../../config/environment-variables').upload
const { s3_bucket: s3BucketName, max_files_per_application: maxFiles } = uploadVariables;
const uploadFileToStorage = require('../helper/uploadFileToStorage');
const deleteFileFromStorage = require('../helper/deleteFileFromStorage');
const HelperService = require("../services/HelperService");
const {
    virusScan,
    checkTypeAndDuplication,
    removeFilesIfLarge,
    connectToClamAV,
    checkFileType,
    UserAdressableError,
} = require('../helper/uploadedFileErrorChecks');

const FORM_INPUT_NAME = 'documents';

const inDevEnvironment = process.env.NODE_ENV === 'development';

const POST_UPLOAD_ERROR_MESSAGES = {
    noFileUploadedError: 'No files have been selected',
    fileCountError: 'You can upload a maximum of 50 files',
};

const FileUploadController = {
    multerSetup() {
        const multerOptions = {
            storage: uploadFileToStorage(s3BucketName),
            fileFilter: checkTypeAndDuplication
        };

        return multer(multerOptions).array(FORM_INPUT_NAME);
    },

    async uploadFilesPage(req, res) {
        try {
            const noUploadFileDataExistsInSession = !req.session.hasOwnProperty('eApp') || !req.session.eApp.hasOwnProperty('uploadedFileData');
            if (noUploadFileDataExistsInSession) {
                req.session.eApp = {
                    ...req.session.eApp,
                    uploadedFileData: [],
                };
            }
            const connectedToClamAV = await connectToClamAV(req);
            // @ts-ignore
            const userData = HelperService.getUserData(req, res);
            const displayFilenameErrors = req.flash('displayFilenameErrors');
            const infectedFiles = req.flash('infectedFiles');
            let genericErrors = req.flash('genericErrors');
            let backLink = '/eapp-start-page';

            if (!connectedToClamAV) {
                return res.view('eApostilles/serviceError.ejs');
            }

            if (!userData.loggedIn) {
                sails.log.error('User is not logged in:', userData);
                return res.forbidden();
            }

            /**
             * prevents genericErrors from showing if filename erros exist
             * the existence of both error types will confuse the user
             */
            if (displayFilenameErrors.length > 0) {
                genericErrors = [];
            }

            if (req.session.eApp.suitabilityQuestionsSkipped) {
                backLink = '/before-you-apply';
            }

            return res.view('eApostilles/uploadFiles.ejs', {
                user_data: userData,
                maxFiles,
                backLink,
                messages: {
                    displayFilenameErrors,
                    infectedFiles,
                    genericErrors,
                },
            });
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    uploadFileHandler(req, res) {
        sails.log.info('File successfully uploaded.');
        FileUploadController._errorChecksAfterUpload(req, res)
    },

    async _errorChecksAfterUpload(req, res, err) {
        const documentCount = req.session.eApp.uploadedFileData.length;
        const hasNoFiles = req.files.length === 0;
        if (hasNoFiles) {
            req.flash('genericErrors', [
                POST_UPLOAD_ERROR_MESSAGES.noFileUploadedError,
            ]);
            sails.log.error('No files were uploaded.');
            FileUploadController._redirectToUploadPage(res);
            return;
        }

        removeFilesIfLarge(req);

        if (documentCount > maxFiles) {
            req.flash('genericErrors', [
                POST_UPLOAD_ERROR_MESSAGES.fileCountError,
            ]);
            return;
        }

        if (err) {
              sails.log.error(err);
        } else {
            await FileUploadController._fileTypeAndVirusScan(req, res);
            sails.log.info('File successfully uploaded.');
            FileUploadController._redirectToUploadPage(res);
        }
    },

    async _fileTypeAndVirusScan(req, res) {
        try {
            await checkFileType(req);
            await virusScan(req);

            !inDevEnvironment &&
                FileUploadController._addS3LocationToSession(req);
        } catch (err) {
            sails.log.error(err);
            if (err instanceof UserAdressableError) {
                FileUploadController._redirectToUploadPage(res);
            } else {
                res.view('eApostilles/serviceError.ejs');
            }
        }
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
