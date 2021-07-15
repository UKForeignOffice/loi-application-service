const multer = require("multer");

const uploadFileToStorage = require("../helpers/uploadFileToStorage");
const deleteFileFromStorage = require("../helpers/deleteFileFromStorage");
const {
  virusScanFile,
  checkTypeSizeAndDuplication,
} = require("../helpers/uploadedFileErrorChecks");

const MAX_FILES = 20;
const FORM_INPUT_NAME = "documents";
const MULTER_FILE_COUNT_ERR_CODE = "LIMIT_FILE_COUNT";
const {
  clamav_enabled: clamavEnabled,
  s3_bucket: s3BucketName,
  ...clamavConnectionValues
} = sails.config.eAppS3Vals;

const multerOptions = {
  storage: uploadFileToStorage(s3BucketName),
  fileFilter: checkTypeSizeAndDuplication,
  limits: {
    files: MAX_FILES,
  },
};
const inDevEnvironment = process.env.NODE_ENV === "development";
const uploadFileWithMulter = multer(multerOptions).array(FORM_INPUT_NAME);

const FileUploadController = {
  uploadFilesPage(req, res) {
    const userData = HelperService.getUserData(req, res);
    if (!userData.loggedIn) {
      sails.log.error("User is not logged in:", userData);
      return res.forbidden();
    }
    return res.view("eApostilles/uploadFiles.ejs", {
      user_data: userData,
    });
  },

  uploadFileHandler(req, res) {
    FileUploadController._clearExistingErrorMessages(req);
    uploadFileWithMulter(req, res, (err) =>
      FileUploadController._checkFilesForErrors(req, res, err)
    );
  },

  _clearExistingErrorMessages(req) {
    req.session.eApp.uploadMessages.errors = [];
    req.session.eApp.uploadMessages.fileCountError = false;
  },

  _checkFilesForErrors(req, res, err) {
    if (err) {
      const fileLimitExceeded = err.code === MULTER_FILE_COUNT_ERR_CODE;

      if (fileLimitExceeded) {
        req.session.eApp.uploadMessages.fileCountError = true;
        sails.log.error(err.message, err.stack);
      } else {
        sails.log.error(err);
        res.serverError(err);
      }
    } else {
      clamavEnabled && virusScanFile(req, clamavConnectionValues, s3BucketName);
      !inDevEnvironment && FileUploadController._addS3LocationToSession(req);
    }

    FileUploadController._redirectToUploadPage(res);
  },

  _addS3LocationToSession(req) {
    const { uploadedFileData } = req.session.eApp;
    uploadedFileData.forEach((uploadedFile, index) => {
      uploadedFile.location = req.files[index].location;
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
      sails.log.info("Item to delete wasn't found");
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
    return uploadedFileData.filter((uploadedFile) => {
      const fileToDeleteExists = uploadedFile.filename === req.body.delete;
      if (fileToDeleteExists) {
        deleteFileFromStorage(uploadedFile, s3BucketName);
      }
      return uploadedFile.filename !== req.body.delete;
    });
  },

  _redirectToUploadPage(res) {
    res.redirect("/upload-files");
  },
};

module.exports = FileUploadController;
