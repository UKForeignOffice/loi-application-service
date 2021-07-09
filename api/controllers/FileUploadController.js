const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");
const { resolve } = require("path");
const multer = require("multer");

const { uploadFileToS3, uploadFileLocally } = require("../helpers/uploadFile");
const {
  virusScanFile,
  checkTypeSizeAndDuplication,
} = require("../helpers/uploadedFileErrorChecks");

AWS.config.update({
  region: "eu-west-2",
});

const MAX_FILES = 20;
const FORM_INPUT_NAME = "documents";
const MULTER_FILE_COUNT_ERR_CODE = "LIMIT_FILE_COUNT";
const inDevEnvironment = process.env.NODE_ENV === "development";

const multerOptions = {
  storage: inDevEnvironment ? uploadFileLocally() : uploadFileToS3(s3),
  fileFilter: checkTypeSizeAndDuplication,
  limits: {
    files: MAX_FILES,
  },
};

const uploadFile = multer(multerOptions).array(FORM_INPUT_NAME);

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
    FileUploadController._clearExistingMessages(req);
    uploadFile(req, res, (err) =>
      FileUploadController._checkFilesForErrors(req, err, res)
      //TODO add s3 location to session
    );
  },

  _clearExistingMessages(req) {
    req.session.eApp.uploadMessages.errors = [];
    req.session.eApp.uploadMessages.fileCountError = false;
  },

  _checkFilesForErrors(req, err, res) {
    // TODO remove this console log
    console.log(req.files, "remove after AWS testing");
    if (err && err.code === MULTER_FILE_COUNT_ERR_CODE) {
      req.session.eApp.uploadMessages.fileCountError = true;
      sails.log.error(err.message, err.stack);
    } else if (err) {
      sails.log.error(err);
      res.serverError(err);
    }

    if (inDevEnvironment) {
      virusScanFile(req, s3);
    }

    FileUploadController._redirectToUploadPage(res);
  },

  deleteFileHandler(req, res) {
    const { uploadedFileData } = req.session.eApp;
    if (!req.body.delete) {
      return res.badRequest("Item to delete wasn't specified");
    }
    if (!uploadedFileData.length === 0) {
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
        inDevEnvironment
          ? FileUploadController._deleteFileLocally(uploadedFile)
          : FileUploadController._deleteFileFromS3(uploadedFile);
      }

      return uploadedFile.filename !== req.body.delete;
    });
  },

  _deleteFileLocally(uploadedFile) {
    const absolutePath = resolve("uploads", uploadedFile.storageName);
    fs.unlink(absolutePath, (err) => {
      if (err) {
        sails.log.error(err, err.stack);
      }
      sails.log.info(`File deleted: `, uploadedFile.filename);
    });
  },

  _deleteFileFromS3(uploadedFile) {
    const params = { Bucket: s3BucketName, Key: uploadedFile.storageName };

    s3.deleteObject(params, (err) => {
      if (err) {
        sails.log.error(err, err.stack);
      } else {
        sails.log.info(`File deleted from S3: `, uploadedFile.filename);
      }
    });
  },

  _redirectToUploadPage(res) {
    res.redirect("/upload-files");
  },
};

module.exports = FileUploadController;
