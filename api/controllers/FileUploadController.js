// @ts-check
const multer = require('multer');
const sails = require('sails');
const { s3_bucket: s3BucketName, max_files_per_application: maxFileLimit } =
    require('../../config/environment-variables').upload;
const { verifyPdfSignature } = require('../../config/environment-variables').views.locals;
const Application = require('../models/index').Application;
const uploadFileToStorage = require('../helper/uploadFileToStorage');
const addNewEappToDB = require('../helper/addNewEappToDB');
const deleteFileFromStorage = require('../helper/deleteFileFromStorage');
const HelperService = require('../services/HelperService');
const {
    virusScan,
    checkTypeAndDuplication,
    removeFilesIfLarge,
    connectToClamAV,
    checkFileType,
    checkFileSignature,
    UserAddressableError,
} = require('../helper/uploadedFileErrorChecks');

const FORM_INPUT_NAME = 'documents';

const inDevEnvironment = process.env.NODE_ENV === 'development';

const POST_UPLOAD_ERROR_MESSAGES = {
    noFileUploadedError: 'No files have been selected',
    fileCountError: `Too many files uploaded. A maximum of ${maxFileLimit} PDF files can be included in a single application`,
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
            await addNewEappToDB(req, res);
            const noUploadFileDataExistsInSession =
                !req.session?.eApp?.uploadedFileData;

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
            let genericErrors = req.flash('genericErrors') ?? [];
            let fileLimitError = req.flash('fileLimitError') ?? [];
            let backLink = '/completing-your-application';
            const fileLimitErrorExists = fileLimitError.length > 0;
            const filesToDelete = req.session.eApp.uploadedFileData.length - Number(maxFileLimit);

            if (!connectedToClamAV) {
                return res.view('eApostilles/serviceError.ejs');
            }

            if (!userData.loggedIn) {
                sails.log.error('User is not logged in');
                return res.redirect('/session-expired');
            }

            if (!fileLimitErrorExists) {
                FileUploadController._maxFileLimitCheck(req);
                fileLimitError = req.flash('fileLimitError');
            }

            await FileUploadController._addSignedInDetailsToApplication(req, res);

            /**
             * prevents genericErrors from showing if filename errors exist
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
                filesToDelete,
                messages: {
                    displayFilenameErrors,
                    infectedFiles,
                    genericErrors: [
                        ...genericErrors,
                        ...fileLimitError,
                    ],
                },
            });
        } catch (err) {
            sails.log.error(err);
            return res.serverError();
        }
    },

    _maxFileLimitCheck(req) {
        if (!HelperService.maxFileLimitExceeded(req)) return;
        req.flash('fileLimitError', [POST_UPLOAD_ERROR_MESSAGES.fileCountError]);
        sails.log.error('maxFileLimitExceeded');
    },

    async _addSignedInDetailsToApplication(req, res) {
        try {
            const PRE_SIGNED_IN_USER_ID = 0;
            const { appId, account } = req.session;
            if (!appId) throw new Error('No application id found in session');
            if (!account) throw new Error('No account info found in session');

            const userId = req.session?.user?.id || req.session?.account?.user_id;
            if (!userId) throw new Error('No user id found in session');

            const feedbackConsent = (account?.feedback_consent) ? account.feedback_consent : false;

            const currentApplicationFromDB = await Application.findOne({
                where: {
                    application_id: appId,
                },
            });
            const appHasCorrectSignInID =
                currentApplicationFromDB.dataValues.user_id !==
                PRE_SIGNED_IN_USER_ID;

            currentApplicationFromDB.update({
                feedback_consent: feedbackConsent,
            });

            sails.log.info(
                `feedback_consent has been updated to ${account.feedback_consent} for application_id ${appId}`
            );

            if (appHasCorrectSignInID) return;

            currentApplicationFromDB.update({
                user_id: userId,
            });

            sails.log.info(
                `user_id has been updated to ${userId} for application_id ${appId}`
            );
        } catch (err) {
            sails.log.error(`_addSignedInDetailsToApplication error: ${err}`);
            return res.view('eApostilles/serviceError.ejs');
        }
    },

    uploadFileHandler(req, res) {
        sails.log.info(`Successfully uploaded ${req.files?.length} file(s).`);
        FileUploadController._errorChecksAfterUpload(req, res);
    },

    async _errorChecksAfterUpload(req, res, err) {
        const hasNoFiles = !req.files || req.files.length === 0;

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
            if (verifyPdfSignature) await checkFileSignature(req);

            !inDevEnvironment &&
                FileUploadController._addS3LocationToSession(req);
        } catch (err) {
            sails.log.error(err);
            if (err instanceof UserAddressableError) {
                FileUploadController._redirectToUploadPage(res);
            } else {
                return res.view('eApostilles/serviceError.ejs');
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
        if (!HelperService.LoggedInStatus(req)) {
          sails.log.error("User is not logged in");
          return res.redirect('/session-expired');
        }

        const { uploadedFileData } = req.session.eApp;

        if (!req.body.delete) {
            sails.log.error("Item to delete wasn't specified");
            return res.badRequest();
        }
        if (uploadedFileData.length === 0) {
            sails.log.error("Item to delete wasn't found");
            return res.notFound();
        }
        req.session.eApp.uploadedFileData = FileUploadController._removeFileFromSessionArray(
          req,
          uploadedFileData
        );
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
      if(res.headersSent){
          return res.end();
      } else {
          return res.redirect('/upload-files');
      }
    },
};

module.exports = FileUploadController;
