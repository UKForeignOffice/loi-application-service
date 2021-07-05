const multer = require("multer");

const uploadCache = {};
const MAX_FILES = 20;
const FORM_INPUT_NAME = "documents";
const ONE_HUNDRED_MEGABYTES = 100 * 1_000_000;
const MAX_BYTES_PER_FILE = ONE_HUNDRED_MEGABYTES;
const MULTER_FILE_COUNT_ERR_CODE = "LIMIT_FILE_COUNT";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    files: MAX_FILES
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

const FileUploadController = {
  uploadFilesPage(req, res) {
    const userData = HelperService.getUserData(req, res);

    if (!userData.loggedIn) {
      sails.log.error(`User is not logged in: `, userData);
      return res.forbidden();
    }

    const userId = userData.user.id;
    let uploadedFiles = [];
    let errors = [];
    let generalMessage = null;

    if (userId && uploadCache[userId]) {
      uploadedFiles = uploadCache[userId].uploadedFiles || [];
      errors = uploadCache[userId].errors || [];
      generalMessage = uploadCache[userId].generalMessage || null;
    }

    return res.view("eApostilles/uploadFiles.ejs", {
      user_data: userData,
      formInputName: FORM_INPUT_NAME,
      error_report: false,
      uploadedFiles,
      errors,
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
      FileUploadController._checkFilesForErrors(req, err)
    );

    FileUploadController._redirectToUploadPage(res);
  },

  _checkFilesForErrors(req, err) {
    const { userId } = req.params;

    if (err && err.code === MULTER_FILE_COUNT_ERR_CODE) {
      uploadCache[userId].generalMessage = "More than 20 files were uploaded.";
      sails.log.error(err.message, err.stack);
    } else if (err) {
      sails.log.error(err);
    }

    // non-JS form post - one or many files sent
    req.files.forEach((file) => {
      const fileData = FileUploadController._checkTypeSizeAndDuplication(
        file,
        uploadCache[userId].uploadedFiles
      );

      if (fileData.errors) {
        uploadCache[userId].errors.push(fileData);
      } else {
        uploadCache[userId].uploadedFiles.push(fileData);
        sails.log.info(`File uploaded: `, fileData);
      }
    });
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

    FileUploadController._redirectToUploadPage(res);
  },

  _redirectToUploadPage(res) {
    res.redirect("/upload-files");
  },
};

module.exports = FileUploadController;
