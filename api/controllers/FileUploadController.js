const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: "eu-west-2"});
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

const multerOptions = {
  storage: uploadFileToStorage(s3),
  fileFilter: checkTypeSizeAndDuplication,
  limits: {
    files: MAX_FILES,
  },
};

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
      FileUploadController._checkFilesForErrors(req, err, res)
    );
  },

  _clearExistingErrorMessages(req) {
    req.session.eApp.uploadMessages.errors = [];
    req.session.eApp.uploadMessages.fileCountError = false;
  },

  _checkFilesForErrors(req, err, res) {
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
      virusScanFile(req, s3);
      FileUploadController._addS3LocationToSession(req);
    }

    FileUploadController._redirectToUploadPage(res);
  },

  _addS3LocationToSession(req) {
    const {uploadedFileData} = req.session.eApp;
    uploadedFileData.forEach((uploadedFile, index) => {
      uploadedFile.location = req.files[index].location;
    });
    req.session.eApp.uploadedFileData = uploadedFileData;
  },

  deleteFileHandler(req, res) {
    const { uploadedFileData } = req.session.eApp;
    if (!req.body.delete) {
      return res.badRequest("Item to delete wasn't specified");
    }
    if (uploadedFileData.length === 0) {
      return res.notFound("Item to delete wasn't found");
    }
    req.session.eApp.uploadedFileData =
      FileUploadController._removeDeletedFileFromArray(req, uploadedFileData);

    FileUploadController._redirectToUploadPage(res);
  },

  _removeDeletedFileFromArray(req, uploadedFileData) {
    return uploadedFileData.filter((uploadedFile) => {
      const fileToDeleteExists = uploadedFile.filename === req.body.delete;
      if (fileToDeleteExists) {
        deleteFileFromStorage(uploadedFile, s3);
      }

      return uploadedFile.filename !== req.body.delete;
    });
  },

  _redirectToUploadPage(res) {
    res.redirect("/upload-files");
  },
};

module.exports = FileUploadController;
