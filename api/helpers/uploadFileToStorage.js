const multerS3 = require("multer-s3");
const multer = require("multer");

const { s3_bucket: s3BucketName } = sails.config.eAppS3Vals;
const inDevEnvironment = process.env.NODE_ENV === "development";

function uploadFileToStorage(s3) {
  return inDevEnvironment ? uploadFileLocally() : uploadFileToS3(s3);
}

function uploadFileLocally() {
  const options = {
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => generateFileData(req, file, cb),
  };
  return multer.diskStorage(options);
}

function uploadFileToS3(s3) {
  const options = {
    s3,
    bucket: s3BucketName,
    metadata: (req, _, cb) => cb(null, s3Metadata(req)),
    key: (req, file, cb) => generateFileData(req, file, cb),
  };
  return multerS3(options);
}

function s3Metadata(req) {
  const { email, account } = req.session;
  return {
    userEmail: email,
    userId: account.user_id.toString(),
  };
}

function generateFileData(req, file, cb) {
  const storageName = `${Date.now().toString()}-${file.originalname}`;
  console.log("File details for S3 upload: ", file);
  const s3UrlIfItExists = file.location || "";
  req.session.eApp.uploadedFileData = [
    ...req.session.eApp.uploadedFileData,
    {
      filename: file.originalname,
      storageName,
      location: s3UrlIfItExists,
    },
  ];
  sails.log.info(`${file.originalname} has been successfully uploaded.`);
  cb(null, storageName);
}

module.exports = uploadFileToStorage;
