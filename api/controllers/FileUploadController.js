const multer = require('multer');

const uploadCache = {};
const FORM_INPUT_NAME = 'documents';
const MAX_BYTES_PER_FILE = 1_000_000 * 100; // 100Mb
const MAX_FILES = 20;

const storage = multer.memoryStorage();
const upload = multer({ storage }).array(FORM_INPUT_NAME);

const responseSuccess = file => ({
  filename: file.originalname
})

const responseError = (file, errors) => ({
  errors,
  filename: file.originalname,
})

const formatFileSizeMb = (bytes, decimalPlaces = 1) => {
  return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
}

const controller = {
  uploadFilesPage(req, res) {
    const userData = HelperService.getUserData(req, res);

    if (!userData.loggedIn) {
      sails.log.error(`User is not logged in: `, userData);
      return res.forbidden();
    }

    const userId = userData.user.id;
    let uploadedFiles = [];
    let errors = [];
    let overLimitFiles = [];
    let generalMessage = null;

    if (userId && uploadCache[userId]) {
      uploadedFiles = uploadCache[userId].uploadedFiles || [];
      errors = uploadCache[userId].errors || [];
      overLimitFiles = uploadCache[userId].overLimitFiles || [];
      generalMessage = uploadCache[userId].generalMessage || null;
    }

    return res.view("eApostilles/uploadFiles.ejs", {
      user_data: userData,
      formInputName: FORM_INPUT_NAME,
      error_report: false,
      uploadedFiles,
      errors,
      overLimitFiles,
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
      overLimitFiles: [],
      generalMessage: null,
    };

    upload(req, res, (err) => {
      if (err) {
        sails.log.error(err);
      }

      if (req.files.length > MAX_FILES) {
        uploadCache[userId].overLimitFiles.push(fileData);
      }
      // non-JS form post - one or many files sent
      req.files.forEach((file) => {
        const fileData = controller._validateUploadedFile(
          file,
          uploadCache[userId].uploadedFiles
        );
        sails.log.info(`File uploaded: `, fileData);

        if (fileData.errors) {
          uploadCache[userId].errors.push(fileData);
        } else if (uploadCache[userId].uploadedFiles.length < MAX_FILES) {
          uploadCache[userId].uploadedFiles.push(fileData);
        }
      });

      if (uploadCache[userId].overLimitFiles.length > 0) {
        uploadCache[
          userId
        ].generalMessage = `${MAX_FILES} files were uploaded. Please add the remaining ${uploadCache[userId].overLimitFiles.length} files to another application.`;
      }
      res.redirect("/upload-files");
    });
  },

  deleteFileHandler(req, res) {
    const { userId } = req.params;
    let uploadedFiles =
      uploadCache[userId] &&
      uploadCache[userId].uploadedFiles;

    if (!req.body.delete) {
      return res.badRequest("Item to delete wasn't specified");
    }

    if (!uploadedFiles) {
      return res.notFound("Item to delete wasn't found");
    }

    uploadCache[userId].uploadedFiles = uploadedFiles.filter(
      (file) => {
        if (file.filename === req.body.delete) {
          sails.log.info(`File deleted: `, req.body.delete);
        }
        return file.filename !== req.body.delete;
      }
    );
    res.redirect("/upload-files");
  },

  _validateUploadedFile(file, uploadedFiles) {
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
};

module.exports = controller;
