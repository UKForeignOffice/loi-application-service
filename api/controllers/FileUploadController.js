const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const uploadCache = {};
const MAX_FILES = 20;
const FORM_INPUT_NAME = "documents";
const ONE_HUNDRED_MEGABYTES = 100 * 1_000_000;
const MAX_BYTES_PER_FILE = ONE_HUNDRED_MEGABYTES;
const MULTER_FILE_COUNT_ERR_CODE = "LIMIT_FILE_COUNT";

AWS.config.update({
  region: "eu-west-2",
});

const s3 = new AWS.S3();

const storeLocally = multer.memoryStorage();
const storeInS3 = multerS3({
  s3,
  bucket: sails.config.eAppS3Vals.s3_bucket,
  metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
  key: (req, file, cb) =>
    cb(null, `${Date.now().toString()}-${file.originalname}`),
});

const upload = multer({
  storage: process.env.NODE_ENV === "development" ? storeLocally : storeInS3,
  limits: {
    files: MAX_FILES,
  },
}).array(FORM_INPUT_NAME);


const responseSuccess = (file) => ({
  filename: file.originalname,
});

const responseError = (file, errors) => ({
  errors,
  filename: file.originalname,
});

const formatFileSizeMb = (bytes, decimalPlaces = 1) => {
  return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
};

// TODO remove userId from the code, it's not needed
const FileUploadController = {
  uploadFilesPage(req, res) {
    const userData = HelperService.getUserData(req, res);

    if (!userData.loggedIn) {
      sails.log.error("User is not logged in:", userData);
      return res.forbidden();
    }

    const userId = userData.user.id;
    let errors = [];
    let generalMessage = null;
    let fileCountErrorMsg = false;

    if (userId && uploadCache[userId]) {
      errors = uploadCache[userId].errors || [];
      generalMessage = uploadCache[userId].generalMessage || null;
      fileCountErrorMsg = uploadCache[userId].fileCountErrorMsg;
    }

    return res.view("eApostilles/uploadFiles.ejs", {
      user_data: userData,
      formInputName: FORM_INPUT_NAME,
      error_report: false,
      errors,
      fileCountErrorMsg,
      generalMessage,
    });
  },

  uploadFileHandler(req, res) {
    const { userId } = req.params;

    uploadCache[userId] = {
      uploadedFiles: uploadCache[userId]
        ? uploadCache[userId].uploadedFiles
        : [],
      errors: [],
      generalMessage: null,
    };

    upload(req, res, (err) =>
      FileUploadController._checkFilesForErrors(req, err, res)
    );
  },

  _checkFilesForErrors(req, err, res) {
    const { userId } = req.params;

    if (err && err.code === MULTER_FILE_COUNT_ERR_CODE) {
      uploadCache[userId].fileCountErrorMsg = true;
      sails.log.error(err.message, err.stack);

      FileUploadController._redirectToUploadPage(res);
    } else if (err) {
      sails.log.error(err);
      res.serverError(err);
    } else {
      req.files.forEach((file) =>
        FileUploadController._checkIndividualFilesForErrors(file, userId)
      );
      FileUploadController._updateSessionWithUploadedFiles(req, res, userId);
    }
  },

  _checkIndividualFilesForErrors(file, userId) {
    // non-JS form post - one or many files sent
    const fileData = FileUploadController._checkTypeSizeAndDuplication(
      file,
      uploadCache[userId].uploadedFiles
    );

    if (fileData.errors) {
      uploadCache[userId].errors.push(fileData);
    } else {
      uploadCache[userId].uploadedFiles.push(fileData);
      sails.log.info(`File uploaded successfully: `, fileData);
    }
  },

  _checkTypeSizeAndDuplication(file, uploadedFiles) {
    let fileData;
    let errors = [];
    if (file.mimetype !== "application/pdf") {
      errors.push(
        `The file is in the wrong format. Only .pdf files are allowed.`
      );
    }

    if (file.size > MAX_BYTES_PER_FILE) {
      errors.push(
        `The file is too large (${formatFileSizeMb(
          file.size
        )}). The maximum size allowed is ${formatFileSizeMb(
          MAX_BYTES_PER_FILE,
          0
        )}`
      );
    }

    if (
      uploadedFiles.find((existing) => existing.filename === file.originalname)
    ) {
      errors.push(
        `You\'ve already uploaded a file named ${file.originalname}. Each file in an application must have a unique name`
      );
    }

    if (errors.length > 0) {
      fileData = responseError(file, errors);
    } else {
      fileData = responseSuccess(file);
    }

    return fileData;
  },

  deleteFileHandler(req, res) {
    const { userId } = req.params;
    let uploadedFiles =
      uploadCache[userId] && uploadCache[userId].uploadedFiles;

    if (!req.body.delete) {
      return res.badRequest("Item to delete wasn't specified");
    }

    if (!uploadedFiles) {
      return res.notFound("Item to delete wasn't found");
    }

    uploadCache[userId].uploadedFiles = uploadedFiles.filter((file) => {
      if (file.filename === req.body.delete) {
        sails.log.info(`File deleted: `, req.body.delete);
      }
      return file.filename !== req.body.delete;
    });

    FileUploadController._updateSessionWithUploadedFiles(req, res, userId);
  },

  _updateSessionWithUploadedFiles(req, res, userId) {
    req.session.eApp.uploadedFileData = uploadCache[userId].uploadedFiles;

    FileUploadController._redirectToUploadPage(res);
  },

  _redirectToUploadPage(res) {
    res.redirect("/upload-files");
  },
};

module.exports = FileUploadController;
