const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-2' });

const inDevEnvironment = process.env.NODE_ENV === 'development';

function uploadFileToStorage(s3BucketName) {
    return inDevEnvironment
        ? uploadFileLocally()
        : uploadFileToS3(s3BucketName);
}

function uploadFileLocally() {
    const options = {
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => generateFileData(req, file, cb),
    };
    return multer.diskStorage(options);
}

function uploadFileToS3(s3BucketName, ) {
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
        },
    ];
    cb(null, storageName);
}

function generateS3FolderName(req) {
    const folderNameInSession = req.session.eApp.s3FolderName;

    if (!folderNameInSession) {
        const folderName = HelperService.uuid();
        req.session.eApp.s3FolderName = folderName;
        return folderName;
    }

    return folderNameInSession;
}

module.exports = uploadFileToStorage;