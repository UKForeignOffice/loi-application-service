const NodeClam = require('clamscan');
const { resolve } = require('path');
const FileType = require('file-type');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const deleteFileFromStorage = require('./deleteFileFromStorage');

const inDevEnvironment = process.env.NODE_ENV === 'development';
let clamscan;

async function connectToClamAV(req) {
    try {
        const { clamav_enabled: clamavEnabled } = req._sails.config.upload;
        const clamavEnabledStringToBool = JSON.parse(clamavEnabled);

        if (!clamavEnabledStringToBool) {
            throw new Error('ClamAV is not enabled.');
        }

        sails.log.info('Connecting to clamAV...');
        clamscan = await initialiseClamScan(req);
        sails.log.info('Connected successfully 🎉');

        return true;
    } catch (err) {
        sails.log.error(`Clamav connection unavailable. ${err}`);
        return false;
    }
}

function initialiseClamScan(req) {
    const {
        clamav_host: clamavHost,
        clamav_port: clamavPort,
        clamav_debug_enabled: clamavDebugEnabled,
    } = req._sails.config.upload;
    const clamAvOptions = {
        debugMode: JSON.parse(clamavDebugEnabled),
        clamdscan: {
            host: clamavHost,
            port: clamavPort,
            active: true,
        },
    };

    return new NodeClam().init(clamAvOptions);
}

async function virusScanAndCheckFiletype(req) {
    try {
        if (req.files.length === 0) {
            req.session.eApp.uploadMessages.noFileUploadedError = true;
            throw new Error('No files were uploaded.');
        }

        clamscan = await initialiseClamScan(req);
        if (!clamscan) {
            throw new Error('Not connected to clamAV');
        }

        for (const file of req.files) {
            inDevEnvironment
                ? await scanFilesLocally(file, req)
                : await scanStreamOfS3File(file, req);
        }
    } catch (err) {
        sails.log.error(err);
    }
}

async function scanFilesLocally(file, req) {
    try {
        const absoluteFilePath = resolve('uploads', file.filename);
        const fileType = await FileType.fromFile(absoluteFilePath);
        const scanResults = await clamscan.isInfected(absoluteFilePath);

        scanResponses(scanResults, file, req);
        displayFileTypeErrorAndDeleteFile(file, req, fileType);
    } catch (err) {
        throw new Error(err);
    }
}

async function scanStreamOfS3File(file, req) {
    try {
        const storageName = getStorageNameFromSession(file, req);
        const s3Bucket = req._sails.config.upload.s3_bucket;
        const scanResults = await clamscan.scanStream(
            getS3FileStream(storageName, s3Bucket)
        );
        const fileType = await FileType.fromStream(
            getS3FileStream(storageName, s3Bucket)
        );

        addUnsubmittedTag(file, req);
        scanResponses(scanResults, file, req, true);
        displayFileTypeErrorAndDeleteFile(file, req, fileType);
    } catch (err) {
        throw new Error(err);
    }
}

function getS3FileStream(storageName, s3Bucket) {
    return s3
        .getObject({
            Bucket: s3Bucket,
            Key: storageName,
        })
        .createReadStream()
        .on('error', (error) => {
            throw new Error(error);
        })
        .on('end', () => resolve());
}

function displayFileTypeErrorAndDeleteFile(file, req, fileType) {
    if (!fileType || fileType.mime !== 'application/pdf') {
        addErrorsToSession(req, file, [
            'The file is in the wrong file type. Only PDF files are allowed.',
        ]);
        removeFileFromSessionAndDelete(req, file);
        throw new Error(`${file.originalname} is not a PDF.`);
    }
}

function getStorageNameFromSession(file, req) {
    const { uploadedFileData } = req.session.eApp;
    const fileWithStorageNameFound = uploadedFileData.find(
        (uploadedFile) => uploadedFile.filename === file.originalname
    );
    return fileWithStorageNameFound.storageName;
}

function addUnsubmittedTag(file, req) {
    const fileStorageName = getStorageNameFromSession(file, req);
    const fileBelongsToUnsubmittedApplication = {
        Key: 'app_status',
        Value: 'UNSUBMITTED',
    };

    const params = {
        Bucket: req._sails.config.upload.s3_bucket,
        Key: fileStorageName,
        Tagging: {
            TagSet: [fileBelongsToUnsubmittedApplication],
        },
    };

    s3.putObjectTagging(params, (err) => {
        if (err) {
            throw new Error(err);
        }
    });
    sails.log.info(`Only UNSUBMITTED tag added to ${fileStorageName}`);
}

function scanResponses(scanResults, file, req = null, forS3 = false) {
    const { isInfected, viruses } = scanResults;
    if (isInfected) {
        removeFileFromSessionAndDelete(req, file);
        addInfectedFilenameToSessionErrors(req, file);
        throw new Error(`${file.originalname} is infected with ${viruses}!`);
    }

    sails.log.info(`${file.originalname} is not infected.`);

    if (forS3) {
        addCleanAndUnsubmittedTagsToFile(file, req);
    }
}

function removeFileFromSessionAndDelete(req, file) {
    const { uploadedFileData } = req.session.eApp;
    const { s3_bucket: s3BucketName } = req._sails.config.upload;

    const updatedSession = uploadedFileData.filter((uploadedFile) => {
        const fileToDeleteInSession =
            file.originalname === uploadedFile.filename;
        if (fileToDeleteInSession) {
            deleteFileFromStorage(uploadedFile, s3BucketName);
        }
        return uploadedFile.filename !== file.originalname;
    });
    req.session.eApp.uploadedFileData = updatedSession;
}

function addInfectedFilenameToSessionErrors(req, file) {
    req.session.eApp.uploadMessages.infectedFiles = [
        ...req.session.eApp.uploadMessages.infectedFiles,
        file.originalname,
    ];
}

function addCleanAndUnsubmittedTagsToFile(file, req) {
    const uploadedStorageName = getStorageNameFromSession(file, req);
    const fileNotInfected = {
        Key: 'av-status',
        Value: 'CLEAN',
    };
    const restoreUnsubmittedTag = {
        Key: 'app_status',
        Value: 'UNSUBMITTED',
    };
    const params = {
        Bucket: req._sails.config.upload.s3_bucket,
        Key: uploadedStorageName,
        Tagging: {
            TagSet: [fileNotInfected, restoreUnsubmittedTag],
        },
    };

    s3.putObjectTagging(params, (err) => {
        if (err) {
            throw new Error(err);
        }
    });
    sails.log.info(
        `Both CLEAN and UNSUBMITTED tags added to ${uploadedStorageName}`
    );
}

function checkTypeSizeAndDuplication(req, file, cb) {
    let errors = [];
    const preventFileUpload = () => cb(null, false);
    const allowFileUplaod = () => cb(null, true);
    const { uploadedFileData } = req.session.eApp;
    const fileAlreadyExists = uploadedFileData.find(
        (existing) => existing.filename === file.originalname
    );

    if (file.mimetype !== 'application/pdf') {
        errors.push(
            'The file is in the wrong format. Only .pdf files are allowed.'
        );
    }
    if (fileAlreadyExists) {
        errors.push(
            'You have already uploaded this file. You cannot upload the same file twice.'
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
    const fileNamesWithErrors = req.session.eApp.uploadMessages.errors.map(
        (error) => error.hasOwnProperty('filename') && error.filename
    );
    if (fileNamesWithErrors.includes(file.originalname)) {
        fileNamesWithErrors.forEach((fileName, idx) => {
            if (fileName === file.originalname) {
                req.session.eApp.uploadMessages.errors[idx].errors = [
                    ...req.session.eApp.uploadMessages.errors[idx].errors,
                    ...errors,
                ];
            }
        });
    } else {
        req.session.eApp.uploadMessages.errors.push({
            filename: file.originalname,
            errors,
        });
    }
}

function displayErrorAndRemoveLargeFiles(req) {
    const UPLOAD_LIMIT_TO_MB =
        req._sails.config.upload.file_upload_size_limit * 1_000_000;
    const MAX_BYTES_PER_FILE = UPLOAD_LIMIT_TO_MB;

    for (const file of req.files) {
        if (file.size > MAX_BYTES_PER_FILE) {
            const error = [
                `The file is too big. Each file you upload must be a maximum of ${formatFileSizeMb(
                    MAX_BYTES_PER_FILE,
                    0
                )}`,
            ];
            addErrorsToSession(req, file, error);
            removeFileFromSessionAndDelete(req, file);
        }
    }
}

function formatFileSizeMb(bytes, decimalPlaces = 1) {
    return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
}

module.exports = {
    checkTypeSizeAndDuplication,
    displayErrorAndRemoveLargeFiles,
    virusScanAndCheckFiletype,
    connectToClamAV,
};
