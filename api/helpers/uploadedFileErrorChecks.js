const NodeClam = require("clamscan");

const ONE_HUNDRED_MEGABYTES = 100 * 1_000_000;
const MAX_BYTES_PER_FILE = ONE_HUNDRED_MEGABYTES;

const inDevEnvironment = process.env.NODE_ENV === "development";
const { clamav_host: clamavHost, clamav_port: clamavPort } =
  sails.config.eAppS3Vals;

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
    const { is_infected, file, viruses } = await clamscan.is_infected(
      req.files[req.files.length - 1].path
    );

    if (is_infected) {
      throw new Error(`${file} is infected with ${viruses}!`);
    } else {
      sails.log.info(`${file} is clean.`);
    }
  } catch (err) {
    sails.log.error(err);
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
