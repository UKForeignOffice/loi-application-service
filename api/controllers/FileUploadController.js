const multer = require("multer");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const multerS3 = require("multer-s3");
const fs = require("fs");
const NodeClam = require("clamscan");
const { Readable } = require("stream");

const MAX_FILES = 20;
const FORM_INPUT_NAME = "documents";
const ONE_HUNDRED_MEGABYTES = 100 * 1_000_000;
const MAX_BYTES_PER_FILE = ONE_HUNDRED_MEGABYTES;
const MULTER_FILE_COUNT_ERR_CODE = "LIMIT_FILE_COUNT";

const inDevEnvironment = process.env.NODE_ENV === "development";
const {
  s3_bucket: s3BucketName,
  clamav_host: clamavHost,
  clamav_port: clamavPort,
} = sails.config.eAppS3Vals;

const clamAvOptions = {
  remove_infected: true,
  clamdscan: {
    host: inDevEnvironment ? "127.0.0.1" : clamavHost,
    port: clamavPort,
  },
};

let uploadCache = {
  uploadedFiles: [],
  errors: [],
  generalMessage: null,
  fileCountErrorMsg: false,
};

AWS.config.update({
  region: "eu-west-2",
});

// TODO move multer setup code to new file

const storeLocally = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const storageName = `${Date.now().toString()}-${file.originalname}`;
    // TODO needs to be seperate function
    uploadCache.uploadedFiles = [
      ...uploadCache.uploadedFiles,
      {
        filename: file.originalname,
        storageName,
      },
    ];

    cb(null, storageName);
  },
});

const storeInS3 = multerS3({
  s3,
  bucket: s3BucketName,
  metadata: (req, _, cb) =>
    cb(null, {
      userEmail: req.session.email,
      userId: req.session.account.user_id.toString(),
    }),
  key: (_, file, cb) =>
    cb(null, `${Date.now().toString()}-${file.originalname}`),
});

function formatFileSizeMb(bytes, decimalPlaces = 1) {
  return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
}

async function virusScanFile(req) {
    try {
      const clamscan = await new NodeClam().init(clamAvOptions);
      const { is_infected, file, viruses } = await clamscan.is_infected(
        req.files[req.files.length - 1].path
      );

      if (is_infected) {
        throw new Error(`${file} is infected with ${viruses}!`);
      } else {
        sails.log.info(`${file} is clean.`);
      }
    } catch(err) {
      sails.log.error(err);
    }
}

function checkTypeSizeAndDuplication(req, file, cb) {
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
    uploadCache.uploadedFiles.find(
      (existing) => existing.filename === file.originalname
    )
  ) {
    errors.push(
      `You\'ve already uploaded a file named ${file.originalname}. Each file in an application must have a unique name.`
    );
  }

  if (errors.length > 0) {
    uploadCache.uploadedFiles.forEach((uploadedFile, index) => {
      if (uploadedFile.filename === file.originalname) {
        uploadCache.uploadedFiles[index].errors = errors;
        uploadCache.errors.push(uploadCache.uploadedFiles[index]);
      }
    });
    cb(null, false); // Reject file upload
  } else {
    cb(null, true); // Accept file upload
  }
}

const upload = multer({
  storage: inDevEnvironment ? storeLocally : storeInS3,
  fileFilter: checkTypeSizeAndDuplication,
  limits: {
    files: MAX_FILES,
  },
}).array(FORM_INPUT_NAME);

const FileUploadController = {
  uploadFilesPage(req, res) {
    const userData = HelperService.getUserData(req, res);

    if (!userData.loggedIn) {
      sails.log.error("User is not logged in:", userData);
      return res.forbidden();
    }

    uploadCache.uploadedFiles = req.session.eApp.uploadedFileData;

    return res.view("eApostilles/uploadFiles.ejs", {
      user_data: userData,
    });
  },

  uploadFileHandler(req, res) {
    // Clear existing error and general messages
    uploadCache = {
      ...uploadCache,
      errors: [],
      fileCountErrorMsg: false,
      generalMessage: null,
    };

    upload(req, res, (err) =>
      FileUploadController._checkFilesForErrors(req, err, res)
    );
  },

  _checkFilesForErrors(req, err, res) {
    console.log(req.files, "remove after AWS testing");
    if (err && err.code === MULTER_FILE_COUNT_ERR_CODE) {
      uploadCache.fileCountErrorMsg = true;
      sails.log.error(err.message, err.stack);
    } else if (err) {
      sails.log.error(err);
      res.serverError(err);
    }

    if (inDevEnvironment) {
      virusScanFile(req);
    }

    FileUploadController._updateSessionWithUploadData(req, res);
  },

  deleteFileHandler(req, res) {
    let uploadedFiles = uploadCache && uploadCache.uploadedFiles;

    if (!req.body.delete) {
      return res.badRequest("Item to delete wasn't specified");
    }

    if (!uploadedFiles) {
      return res.notFound("Item to delete wasn't found");
    }

    uploadCache.uploadedFiles = uploadedFiles.filter((uploadedFile) => {
      const fileToDeleteFound = uploadedFile.filename === req.body.delete;

      if (fileToDeleteFound && inDevEnvironment) {
        FileUploadController._deleteFileLocally(uploadedFile);
      }

      if (fileToDeleteFound && !inDevEnvironment) {
        FileUploadController._deleteFileFromS3(uploadedFile);
      }

      return uploadedFile.filename !== req.body.delete;
    });

    FileUploadController._updateSessionWithUploadData(req, res);
  },

  _deleteFileLocally(uploadedFile) {
    fs.unlink(uploadedFile.key, (err) => {
      if (err) {
        sails.log.error(err, err.stack);
      }
      sails.log.info(`File deleted: `, uploadedFile.filename);
    });
  },

  _deleteFileFromS3(uploadedFile) {
    const params = { Bucket: s3BucketName, Key: uploadedFile.key };

    s3.deleteObject(params, (err) => {
      if (err) {
        sails.log.error(err, err.stack);
      } else {
        sails.log.info(`File deleted from S3: `, uploadedFile.filename);
      }
    });
  },

  _updateSessionWithUploadData(req, res) {
    req.session.eApp = {
      uploadedFileData: uploadCache.uploadedFiles,
      uploadMessages: {
        errors: uploadCache.errors,
        general: uploadCache.generalMessage,
        fileCountError: uploadCache.fileCountErrorMsg,
      },
    };

    FileUploadController._redirectToUploadPage(res);
  },

  _redirectToUploadPage(res) {
    res.redirect("/upload-files");
  },
};

module.exports = FileUploadController;
