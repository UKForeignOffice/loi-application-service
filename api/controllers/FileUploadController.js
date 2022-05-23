// @ts-check
const multer = require('multer');
const sails = require('sails');
const { s3_bucket: s3BucketName, max_files_per_application: maxFileLimit } = require('../../config/environment-variables').upload;
const Application = require('../models/index').Application;
const uploadFileToStorage = require('../helper/uploadFileToStorage');
const deleteFileFromStorage = require('../helper/deleteFileFromStorage');
const HelperService = require('../services/HelperService');
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
    fileCountError: `You can upload a maximum of ${maxFileLimit} files`,
};

const FileUploadController = {
    setupMulterMiddleware() {
        const multerOptions = {
            storage: uploadFileToStorage(s3BucketName),
            fileFilter: checkTypeAndDuplication,
        };

        return multer(multerOptions).array(FORM_INPUT_NAME);
    },

    async uploadFilesPage(req, res) {
        try {
            const noUploadFileDataExistsInSession =
                !req.session.hasOwnProperty('eApp') ||
                !req.session.eApp.hasOwnProperty('uploadedFileData');
            if (noUploadFileDataExistsInSession) {
                req.session.eApp = {
                    ...req.session.eApp,
                    uploadedFileData: [],
                };
            }
            const connectedToClamAV = await connectToClamAV(req);
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

            FileUploadController._maxFileLimitCheck(req);

            await FileUploadController._addSignedInIdToApplication(req, res);

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
                maxFileLimit,
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

    _maxFileLimitCheck(req) {
        const totalFilesUploaded = req.session.eApp.uploadedFileData.length;

        if (totalFilesUploaded > maxFileLimit) {
            req.flash('genericErrors', [
                POST_UPLOAD_ERROR_MESSAGES.fileCountError,
            ]);
            sails.log.error('maxFileLimitExceeded');
        }
    },

    async _addSignedInIdToApplication(req, res) {
        try {
            const PRE_SIGNED_IN_USER_ID = 0;
            const { appId } = req.session;
            if (!appId) throw new Error('No application id found in session');

            const userId = req.session.user.id || req.session.accunt.user_id;
            if (!userId) throw new Error('No user id found in session');

            const currentApplicationFromDB = await Application.findOne({
                where: {
                    application_id: appId,
                },
            });
            const appHasPreSignedInUserId =
                currentApplicationFromDB.dataValues.user_id === PRE_SIGNED_IN_USER_ID;

            if (!appHasPreSignedInUserId) return;

            currentApplicationFromDB.update({
                user_id: userId,
            });

            sails.log.info(
                `user_id has been updated to ${userId} for application_id ${appId}`
            );
        } catch (err) {
            sails.log.error(`_addSignedInIdToApplication error: ${err}`);
            res.view('eApostilles/serviceError.ejs');
        }
    },

    uploadFileHandler(req, res) {
        sails.log.info('File successfully uploaded.');
        FileUploadController._errorChecksAfterUpload(req, res);
    },

    async _errorChecksAfterUpload(req, res, err) {
        const hasNoFiles = req.files.length === 0;

        // - file length check applicable for if JS is disabled
        if (hasNoFiles) {
            req.flash('genericErrors', [
                POST_UPLOAD_ERROR_MESSAGES.noFileUploadedError,
            ]);
            sails.log.error('No files were uploaded.');
            FileUploadController._redirectToUploadPage(res);
            return;
        }

        removeFilesIfLarge(req);

        FileUploadController._maxFileLimitCheck(req);

        if (err) {
            sails.log.error(err);
        } else {
            await FileUploadController._fileTypeAndVirusScan(req, res);
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
