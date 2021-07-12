const fs = require("fs");
const { resolve } = require("path");

const { s3_bucket: s3BucketName } = sails.config.eAppS3Vals;
const inDevEnvironment = process.env.NODE_ENV === "development";

function deleteFileFromStorage(fileDataFromSession, s3) {
  inDevEnvironment
    ? deleteFileLocally(fileDataFromSession)
    : deleteFileFromS3(fileDataFromSession, s3);
}

function deleteFileLocally(file) {
  const absolutePath = resolve("uploads", file.storageName);
  fs.unlink(absolutePath, (err) => deleteFileMessage(err, file));
}

function deleteFileFromS3(file, s3) {
  const params = { Bucket: s3BucketName, Key: file.storageName };
  s3.deleteObject(params, (err) => deleteFileMessage(err, file));
}

function deleteFileMessage(err, file) {
  if (err) {
    sails.log.error(err, err.stack);
  }
  sails.log.info(`File deleted: `, file.filename);
}

module.exports = deleteFileFromStorage;
