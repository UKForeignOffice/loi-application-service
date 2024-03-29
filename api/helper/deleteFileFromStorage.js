const fs = require('fs');
const { resolve } = require('path');
const { S3 } = require("@aws-sdk/client-s3");
const s3 = new S3();

const inDevEnvironment = process.env.NODE_ENV === 'development';

function deleteFileFromStorage(fileDataFromSession, s3BucketName) {
    inDevEnvironment
        ? deleteFileLocally(fileDataFromSession)
        : deleteFileFromS3(fileDataFromSession, s3BucketName);
}

function deleteFileLocally(file) {
    const absolutePath = resolve('uploads', file.storageName);
    fs.unlink(absolutePath, (err) => deleteFileMessage(err, file));
}

function deleteFileFromS3(file, s3BucketName) {
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
