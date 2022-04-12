// @ts-check
const multer = require('multer');
const sails = require('sails');

const uploadFileToStorage = require('../helpers/uploadFileToStorage');
const deleteFileFromStorage = require('../helpers/deleteFileFromStorage');
const {
    virusScan,
    checkTypeAndDuplication,
    removeFilesIfLarge,
    connectToClamAV,
    checkFileType,
    UserAdressableError,
} = require('../helpers/uploadedFileErrorChecks');

const FORM_INPUT_NAME = 'documents';
const MULTER_FILE_COUNT_ERR_CODE = 'LIMIT_FILE_COUNT';

const inDevEnvironment = process.env.NODE_ENV === 'development';

const POST_UPLOAD_ERROR_MESSAGES = {
    noFileUploadedError: 'No files have been selected',
    fileCountError: 'You can upload a maximum of 50 files',
};

const FileUploadController = {
    async uploadFilesPage(req, res) {
        try {
            const noUploadFileDataExistsInSession = typeof req.session.eApp.uploadedFileData === 'undefined';
            console.log(noUploadFileDataExistsInSession, "WHY NO WORKING!!!")
            if (noUploadFileDataExistsInSession) {
                req.session.eApp = {
                    uploadedFileData: [],
                };
            }
            const connectedToClamAV = await connectToClamAV(req);
            // @ts-ignore
            const userData = HelperService.getUserData(req, res);
            const displayFilenameErrors = req.flash('displayFilenameErrors');
            const infectedFiles = req.flash('infectedFiles');
            let genericErrors = req.flash('genericErrors');

            if (!connectedToClamAV) {
                return res.view('eApostilles/fileUploadError.ejs');
            }

            if (!userData.loggedIn) {
                sails.log.error('User is not logged in:', userData);
                return res.forbidden();
            }

            // prevents noFileUploadedError from showing if
            if (displayFilenameErrors.length > 0) {
                genericErrors = [];
            }

            return res.view('eApostilles/uploadFiles.ejs', {
                user_data: userData,
                backLink: '/eapp-start-page',
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
        const uploadFileWithMulter = FileUploadController._multerSetup(req);
        uploadFileWithMulter(req, res, (err) => {
            FileUploadController._errorChecksAfterUpload(req, res, err);
        });
    },

    _multerSetup(req) {
        const { s3_bucket: s3BucketName, max_files_per_application: maxFiles } =
            req._sails.config.upload;
        const multerOptions = {
            storage: uploadFileToStorage(s3BucketName),
            fileFilter: checkTypeAndDuplication,
            limits: {
                files: Number(maxFiles),
            },
        };

        return multer(multerOptions).array(FORM_INPUT_NAME);
    },

    async _errorChecksAfterUpload(req, res, err) {
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

        if (err) {
            const fileLimitExceeded = err.code === MULTER_FILE_COUNT_ERR_CODE;
            if (fileLimitExceeded) {
                req.flash('genericErrors', [
                    POST_UPLOAD_ERROR_MESSAGES.fileCountError,
                ]);
                return;
            }
            res.serverError(err);
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
                res.view('eApostilles/fileUploadError.ejs');
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
