const NodeClam = require('clamscan');
const { resolve } = require('path');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-2' });
const { PassThrough } = require('stream');

const deleteFileFromStorage = require('./deleteFileFromStorage');

const TWO_HUNDRED_MEGABYTES = 200 * 1_000_000;
const MAX_BYTES_PER_FILE = TWO_HUNDRED_MEGABYTES;

const inDevEnvironment = process.env.NODE_ENV === 'development';
let clamscan;

async function connectToClamAV(req) {
    try {
        const { clamav_enabled: clamavEnabled } = req._sails.config.eAppS3Vals;
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
    const { clamav_host: clamavHost, clamav_port: clamavPort } =
        req._sails.config.eAppS3Vals;

    const clamAvOptions = {
        clamdscan: {
            host: inDevEnvironment ? '127.0.0.1' : clamavHost,
            port: clamavPort,
        },
    };

    return new NodeClam().init(clamAvOptions);
}

async function virusScanFile(req, res) {
    try {
        clamscan = await initialiseClamScan(req);
        if (req.files.length === 0) {
            throw new Error('No files were uploaded.');
        }

        if (!clamscan) {
            throw new Error('Not connected to clamAV');
        }
        req.files.forEach((file) => {
            inDevEnvironment
                ? scanFilesLocally(file)
                : scanStreamOfS3File(file, req);
        });
    } catch (err) {
        sails.log.error(err);
        return res.serverError();
    }
}

async function scanFilesLocally(file, req) {
    const absoluteFilePath = resolve('uploads', file.filename);
    const scanResults = await clamscan.is_infected(absoluteFilePath);
    scanResponses(scanResults, file, req);
}

async function scanStreamOfS3File(file, req) {
    // pass through to fix AWS timeout issue https://github.com/aws/aws-sdk-js/issues/2087#issuecomment-474722151
    const passThroughStream = new PassThrough();
    let streamCreated = false;

    passThroughStream.on('newListener', (event) => {
        if (!streamCreated && event === 'data') {
            s3.getObject({
                Bucket: req._sails.config.eAppS3Vals.s3_bucket,
                Key: getStorageNameFromSession(file, req),
            })
                .createReadStream()
                .on('error', (error) => {
                    if (error) {
                        passThroughStream.emit('error', error);
                    }
                });
            streamCreated = true;
        }
    });
    addUnsubmittedTag(file, req);
    const scanResults = await clamscan.scan_stream(passThroughStream);
    scanResponses(scanResults, file, req, true);
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
        Bucket: req._sails.config.eAppS3Vals.s3_bucket,
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
    const { is_infected, viruses } = scanResults;
    if (is_infected) {
        const updatedSession = removeInfectedFileFromSessionAndDelete(
            req,
            file
        );
        req.session.eApp.uploadedFileData = updatedSession;
        addInfectedFilenameToSessionErrors(req, file);
        throw new Error(`${file.originalname} is infected with ${viruses}!`);
    }

    sails.log.info(`${file.originalname} is not infected.`);

    if (forS3) {
        addCleanAndUnsubmittedTagsToFile(file, req);
    }
}

function removeInfectedFileFromSessionAndDelete(req, file) {
    const { uploadedFileData } = req.session.eApp;
    return uploadedFileData.filter((uploadedFile) => {
        const fileToDeleteInSession =
            file.originalname === uploadedFile.fileName;
        if (!fileToDeleteInSession) {
            throw new Error(
                `File ${uploadedFile.fileName} does not exist in the session`
            );
        }
        deleteFileFromStorage(fileToDeleteInSession);
        return uploadedFile.filename !== file.originalname;
    });
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
        Bucket: req._sails.config.eAppS3Vals.s3_bucket,
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
    const fileSize = parseInt(req.headers['content-length']);
    const { uploadedFileData } = req.session.eApp;
    const fileAlreadyExists = uploadedFileData.find(
        (existing) => existing.filename === file.originalname
    );

    if (file.mimetype !== 'application/pdf') {
        errors.push(
            'The file is in the wrong format. Only .pdf files are allowed.'
        );
    }
    if (fileSize > MAX_BYTES_PER_FILE) {
        errors.push(
            `The file is too large (${formatFileSizeMb(fileSize)}).
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

function formatFileSizeMb(bytes, decimalPlaces = 1) {
    return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
}

module.exports = {
    checkTypeSizeAndDuplication,
    virusScanFile,
    connectToClamAV,
};
