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
  validateUploadedFile: (file, uploadedFiles) => {
    let fileData;
    let errors = []
    if (file.mimetype !== 'application/pdf') {
      errors.push(`The file is in the wrong format. Only .pdf files are allowed.`)
    }
    if (file.size > MAX_BYTES_PER_FILE) {
      errors.push(`The file is too large (${formatFileSizeMb(file.size)}). The maximum size allowed is ${formatFileSizeMb(MAX_BYTES_PER_FILE, 0)}`)
    }
    if (uploadedFiles.find(existing => existing.filename === file.originalname)) {
      errors.push(`You\'ve already uploaded a file named ${file.originalname}. Each file in an application must have a unique name`)
    }
    if (errors.length > 0) {
      fileData = responseError(file, errors);
    } else {
      fileData = responseSuccess(file);
    }
    return fileData
  },

  addDocumentsPage: function (req, res) {
    const userData = HelperService.getUserData(req, res);
    if (!userData.user) {
      return res.forbidden('Please sign in');
    }
    const userId = userData.user.id;
    let uploadedFiles = [];
    let errors = [];
    let overLimitFiles = [];
    let generalMessage = null;
    if (userId && uploadCache[userId]) {
      uploadedFiles = uploadCache[userId].uploadedFiles || []
      errors = uploadCache[userId].errors || []
      overLimitFiles = uploadCache[userId].overLimitFiles || []
      generalMessage = uploadCache[userId].generalMessage || null
    }
    return res.view('eApostilles/uploadFiles.ejs', {
      user_data: userData,
      formInputName: FORM_INPUT_NAME,
      error_report: false,
      uploadedFiles,
      errors,
      overLimitFiles,
      generalMessage
    });
  },

  deleteFileHandler: (req, res) => {
    if (!req.body.delete) {
      return res.badRequest('Item to delete wasn\'t specified')
    }
    const userData = HelperService.getUserData(req, res);
    if (!userData.user) {
      return res.forbidden('Please sign in');
    }
    let uploadedFiles = userData.user && uploadCache[userData.user.id] && uploadCache[userData.user.id].uploadedFiles;
    if (!uploadedFiles) {
      return res.notFound('Item to delete wasn\'t found')
    }
    uploadCache[userData.user.id].uploadedFiles = uploadedFiles.filter(file => file.filename !== req.body.delete);
    return res.redirect('/upload-files');
  },

  uploadFileHandler: (req, res) => {
    const userData = HelperService.getUserData(req, res);
    if (!userData.user) {
      sails.log.error(`User data does not exists: `, userData);
      return res.forbidden('Please sign in');
    }

    const userId = userData.user.id;

    uploadCache[userId] = {
      uploadedFiles: uploadCache[userId] ? uploadCache[userId].uploadedFiles : [],
      errors: [],
      overLimitFiles: [],
      generalMessage: null
    }

    upload(req, res, err => {
      if (err) {
        console.error(err)
      }
      // non-JS form post - one or many files sent
      req.files.forEach(file => {
        const fileData = controller.validateUploadedFile(file, uploadCache[userId].uploadedFiles);
        sails.log.info(`File uploaded using multer with data: `, fileData);

        if (fileData.errors) {
          uploadCache[userId].errors.push(fileData);
        } else if (uploadCache[userId].uploadedFiles.length < MAX_FILES) {
          uploadCache[userId].uploadedFiles.push(fileData);
        } else {
          uploadCache[userId].overLimitFiles.push(fileData);
        }
      })
      if (uploadCache[userId].overLimitFiles.length > 0) {
        uploadCache[userId].generalMessage = `${MAX_FILES} files were uploaded. Please add the remaining ${uploadCache[userId].overLimitFiles.length} files to another application.`;
      }
      res.redirect('/upload-files');
    })
  },
}

module.exports = controller;
