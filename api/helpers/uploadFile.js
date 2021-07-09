const multerS3 = require("multer-s3");
const multer = require("multer");

const { s3_bucket: s3BucketName } = sails.config.eAppS3Vals;

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
  const {email, account} = req.session;
  return {
    userEmail: email,
    userId: account.user_id.toString(),
  }
}

function generateFileData(req, file, cb) {
  const storageName = `${Date.now().toString()}-${file.originalname}`;
  req.session.eApp.uploadedFileData = [
    ...req.session.eApp.uploadedFileData,
    {
      filename: file.originalname,
      storageName,
    },
  ];
  cb(null, storageName);
}

module.exports = {
  uploadFileToS3,
  uploadFileLocally,
};
