// @ts-check
const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require("path");
const sails = require("sails");
const fs = require("fs");
const HelperService = require("../services/HelperService");
const s3 = new AWS.S3();

const inDevEnvironment = process.env.NODE_ENV === 'development';

function uploadFileToStorage(s3BucketName) {
    return inDevEnvironment
        ? uploadFileLocally()
        : uploadFileToS3(s3BucketName);
}

function uploadFileLocally() {
    const uploadFolder = path.resolve('./', 'uploads/');
    const options = {
        destination: (_req, _file, cb) => cb(null, uploadFolder),
        filename: (req, file, cb) => generateFileData(req, file, cb),
    };

    if (!fs.existsSync(uploadFolder)){
        fs.mkdirSync(uploadFolder);
        sails.log.info('Uploads folder created.');
    }

    return multer.diskStorage(options);
}

function uploadFileToS3(s3BucketName) {
    const options = {
        s3,
        bucket: s3BucketName,
        key: (req, file, cb) => generateFileData(req, file, cb, true),
    };
    return multerS3(options);
}

function generateFileData(req, file, cb, forS3 = false) {
    let storageName = `${HelperService.uuid()}_${file.originalname}`;

    if (forS3) {
        const s3FolderName = generateS3FolderName(req);
        storageName = `${s3FolderName}/${storageName}`;
    }

    req.session.eApp.uploadedFileData = [
        ...req.session.eApp.uploadedFileData,
        {
            filename: file.originalname,
            storageName,
            passedVirusCheck: false
        },
    ];
    cb(null, storageName);
}

function generateS3FolderName(req) {
    const folderNameInSession = req.session.eApp.s3FolderName;

    if (!folderNameInSession) {

        const folderUuid = HelperService.uuid();
        const folderName = `${req.session.appId}_${folderUuid}`;
        req.session.eApp.s3FolderName = folderName;
        return folderName;
    }

    return folderNameInSession;
}

module.exports = uploadFileToStorage;
