const NodeClam = require("clamscan");
const { resolve } = require("path");

const ONE_HUNDRED_MEGABYTES = 100 * 1_000_000;
const MAX_BYTES_PER_FILE = ONE_HUNDRED_MEGABYTES;

const inDevEnvironment = process.env.NODE_ENV === "development";
const {
  s3_bucket: s3BucketName,
  clamav_host: clamavHost,
  clamav_port: clamavPort,
} = sails.config.eAppS3Vals;

async function virusScanFile(req) {
  try {
    const clamAvOptions = {
      remove_infected: true,
      clamdscan: {
        host: inDevEnvironment ? "127.0.0.1" : clamavHost,
        port: clamavPort,
      },
    };
    const clamscan = await new NodeClam().init(clamAvOptions);

    if (req.files.length === 0) {
      throw new Error("No files were uploaded.");
    }
    req.files.forEach((file) => {
      inDevEnvironment
        ? scanFilesLocally(clamscan, file)
        : scanStreamOfS3File(clamscan, file);
    });
  } catch (err) {
    sails.log.error(err);
  }
}

async function scanFilesLocally(clamscan, file) {
  const absoluteFilePath = resolve("uploads", file.filename);
  const scanResults = await clamscan.is_infected(absoluteFilePath);
  scanResponses(scanResults, file);
}

async function scanStreamOfS3File(clamscan, file) {
  const fileStream = s3
    .getObject({
      Bucket: s3BucketName,
      Key: getStorageNameFromSession(file),
    })
    .createReadStream();

  // TOTO check if  this is needed - fileStream.pipe(res);
  // TODO remove this console log
  console.log(fileStream, "testing steam, remove after AWS test");
  const scanResults = await clamscan.scan_stream(fileStream);
  scanResponses(scanResults, file);
}

function getStorageNameFromSession(file) {
  const { uploadedFileData } = req.session.eApp;
  const fileWithStorageNameFound = uploadedFileData.find(
    (uploadedFile) => uploadedFile.filename === file.originalname
  );
  return fileWithStorageNameFound.storageName;
}

function scanResponses(scanResults, file) {
  const { is_infected, viruses } = scanResults;
  if (is_infected) {
    throw new Error(`${file.originalname} is infected with ${viruses}!`);
  } else {
    sails.log.info(`${file.originalname} is clean.`);
  }
}

function checkTypeSizeAndDuplication(req, file, cb) {
  let errors = [];
  const preventFileUpload = () => cb(null, false);
  const allowFileUplaod = () => cb(null, true);
  const { uploadedFileData } = req.session.eApp;
  const fileAlreadyExists = uploadedFileData.find(
    (existing) => existing.filename === file.originalname
  );

  if (file.mimetype !== "application/pdf") {
    errors.push(
      `The file is in the wrong format. Only .pdf files are allowed.`
    );
  }
  if (file.size > MAX_BYTES_PER_FILE) {
    errors.push(
      `The file is too large (${formatFileSizeMb(file.size)}).
      The maximum size allowed is ${formatFileSizeMb(MAX_BYTES_PER_FILE, 0)}`
    );
  }
  if (fileAlreadyExists) {
    errors.push(
      `You\'ve already uploaded a file named ${file.originalname}. Each file in an application must have a unique name.`
    );
  }

  if (errors.length > 0) {
    addErrorsToSession(req, file, errors);
    preventFileUpload();
  } else {
    allowFileUplaod();
  }
}

function addErrorsToSession(req, file, errors) {
  const { uploadedFileData } = req.session.eApp;
  uploadedFileData.forEach((uploadedFile, index) => {
    const fileWithErrorsFound = uploadedFile.filename === file.originalname;
    if (fileWithErrorsFound) {
      req.session.eApp.uploadedFileData[index].errors = errors;
      req.session.eApp.uploadMessages.errors.push(uploadedFileData[index]);
    }
  });
}

function formatFileSizeMb(bytes, decimalPlaces = 1) {
  return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
}

module.exports = {
  checkTypeSizeAndDuplication,
  virusScanFile,
};
