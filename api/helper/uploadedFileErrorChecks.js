// @ts-check
const NodeClam = require('clamscan');
const sails = require('sails');
const { resolve } = require('path');
const FileType = require('file-type');
const { makeTokenizer } = require('@tokenizer/s3');
const {
    S3Client,
    GetObjectCommand,
    PutObjectTaggingCommand,
} = require('@aws-sdk/client-s3');
const s3 = new S3Client({});

const deleteFileFromStorage = require('./deleteFileFromStorage');

const inDevEnvironment = process.env.NODE_ENV === 'development';
let clamscan = null;

const UPLOAD_ERROR = {
    incorrectFileType: 'The file is not a PDF',
    fileInfected: 'The file is infected with a virus',
};

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
        sails.log.error(`connectToClamAV ${err}`);
        return false;
    }
}

async function initialiseClamScan(req) {
    try {
        const {
            clamav_host: clamavHost,
            clamav_port: clamavPort,
            clamav_debug_enabled: clamavDebugEnabled,
        } = req._sails.config.upload;
        const clamAvOptions = {
            debugMode: JSON.parse(clamavDebugEnabled) || false,
            clamscan: { active: false },
            clamdscan: {
                active: false,
                host: clamavHost,
                port: clamavPort,
            },
        };

        return await new NodeClam().init(clamAvOptions);
    } catch (err) {
        throw new Error(`initialiseClamScan ${err}`);
    }
}

async function checkFileType(req) {
    try {
        sails.log.info('Checking file type...');
        const { uploadedFileData } = req.session.eApp;
        const checkedFilesFromSession =
            removeVirusCheckedFiles(uploadedFileData);

        for (const fileFromSession of checkedFilesFromSession) {
            inDevEnvironment
                ? await checkLocalFileType(fileFromSession, req)
                : await checkS3FileType(fileFromSession, req);

            sails.log.info(
                `${fileFromSession.filename} is the correct file type`
            );
        }
    } catch (err) {
        if (err.message === `Error: ${UPLOAD_ERROR.incorrectFileType}`) {
            throw new UserAddressableError(`checkFileType ${err}`);
        }
        throw new Error(`checkFileType ${err}`);
    }
}

function removeVirusCheckedFiles(uploadedFileData) {
    return uploadedFileData.filter((uploadedFile) => {
        const virusCheckPropertyExists =
            uploadedFile.hasOwnProperty('passedVirusCheck');
        const fileNotPassedVirusCheck =
            !virusCheckPropertyExists ||
            uploadedFile.passedVirusCheck === false;

        return fileNotPassedVirusCheck;
    });
}

async function checkLocalFileType(file, req) {
    try {
        const absoluteFilePath = resolve('uploads', file.storageName);
        const fileType = await FileType.fromFile(absoluteFilePath);

        addErrorToSessionIfNotPDF(file, req, fileType);
    } catch (err) {
        removeSingleFile(req, file);
        throw new Error(err);
    }
}

/**
 * @ref https://github.com/sindresorhus/file-type#filetypefromtokenizertokenizer
 */
async function checkS3FileType(file, req) {
    try {
        const s3Bucket = req._sails.config.upload.s3_bucket;
        const s3Tokenizer = await makeTokenizer(s3, {
            Bucket: s3Bucket,
            Key: file.storageName,
        });
        const fileType = await FileType.fromTokenizer(s3Tokenizer);

        addErrorToSessionIfNotPDF(file, req, fileType);
    } catch (err) {
        removeSingleFile(req, file);
        throw new Error(err);
    }
}

function addErrorToSessionIfNotPDF(file, req, fileType) {
    if (!fileType || fileType.mime !== 'application/pdf') {
        const error = [
            'Wrong file type. Only PDF files are allowed',
        ];
        req.flash('displayFilenameErrors', [
            { filename: file.filename, errors: error },
        ]);
        throw new Error(UPLOAD_ERROR.incorrectFileType);
    }
}

async function virusScan(req) {
    sails.log.info('Scanning for viruses...');

    try {
        clamscan = await initialiseClamScan(req);

        if (!clamscan) {
            throw new Error('Not connected to clamAV');
        }

        const { uploadedFileData } = req.session.eApp;
        const checkedFilesFromSession =
            removeVirusCheckedFiles(uploadedFileData);

        for (const fileFromSession of checkedFilesFromSession) {
            inDevEnvironment
                ? await scanFilesLocally(fileFromSession, req)
                : await scanStreamOfS3File(fileFromSession, req);
        }
    } catch (err) {
        if (err.message === `Error: ${UPLOAD_ERROR.fileInfected}`) {
            throw new UserAddressableError(`virusScan ${err}`);
        }
        throw new Error(`virusScan ${err}`);
    }
}

async function scanFilesLocally(file, req) {
    try {
        const absoluteFilePath = resolve('uploads', file.storageName);
        const scanResults = await clamscan.isInfected(absoluteFilePath);
        scanResponses(scanResults, file, req);
    } catch (err) {
        removeSingleFile(req, file);
        throw new Error(err);
    }
}

async function scanStreamOfS3File(file, req) {
    try {
        const s3Bucket = req._sails.config.upload.s3_bucket;
        const scanResults = await clamscan.scanStream(
            await getS3FileStream(file.storageName, s3Bucket)
        );

        await addUnsubmittedTag(file, req);
        scanResponses(scanResults, file, req, true);
    } catch (err) {
        removeSingleFile(req, file);
        throw new Error(err);
    }
}

function removeSingleFile(req, file) {
    const { uploadedFileData } = req.session.eApp;
    const { s3_bucket: s3BucketName } = req._sails.config.upload;

    const removeFileFromSession = uploadedFileData.filter((uploadedFile) => {
        const fileName = findFilename(file);
        const fileToDeleteInSession = fileName === uploadedFile.filename;

        if (fileToDeleteInSession) deleteFileFromStorage(uploadedFile, s3BucketName);

        return uploadedFile.filename !== fileName;
    });
    req.session.eApp.uploadedFileData = removeFileFromSession;
}

function findFilename(file) {
 return file.hasOwnProperty('originalname') ? file.originalname : file.filename;
}

async function getS3FileStream(storageName, s3Bucket) {
    try {
        const command = new GetObjectCommand({
            Bucket: s3Bucket,
            Key: storageName,
        });
        const response = await s3.send(command);
        return response.Body;
    } catch (err) {
        throw new Error(`getS3FileStream ${err}`);
    }
}

async function addUnsubmittedTag(file, req) {
    try {
        const fileBelongsToUnsubmittedApplication = {
            Key: 'app_status',
            Value: 'UNSUBMITTED',
        };
        const params = {
            Bucket: req._sails.config.upload.s3_bucket,
            Key: file.storageName,
            Tagging: {
                TagSet: [fileBelongsToUnsubmittedApplication],
            },
        };

        await s3.send(new PutObjectTaggingCommand(params));
        sails.log.info(`Only UNSUBMITTED tag added to ${file.storageName}`);
    } catch (err) {
        throw new Error(`addUnsubmittedTag ${err}`);
    }
}

function scanResponses(scanResults, file, req = null, forS3 = false) {
    const { isInfected } = scanResults;
    if (isInfected) {
        req.flash('infectedFiles', [file.filename]);
        throw new Error(UPLOAD_ERROR.fileInfected);
    }

    passVirusCheck(req, file);

    sails.log.info(`${file.filename} is not infected.`);

    if (file && forS3) {
        addCleanAndUnsubmittedTagsToFile(file, req);
    }
}

function passVirusCheck(req, file) {
    const { uploadedFileData } = req.session.eApp;

    const updatedSession = uploadedFileData.map((uploadedFile) => {
        const currentFile = findFilename(file) === uploadedFile.filename;
        if (currentFile) uploadedFile.passedVirusCheck = true;

        return uploadedFile;
    });

    req.session.eApp.uploadedFileData = updatedSession;
}

async function addCleanAndUnsubmittedTagsToFile(file, req) {
    try {
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
            Key: file.storageName,
            Tagging: {
                TagSet: [fileNotInfected, restoreUnsubmittedTag],
            },
        };

        await s3.send(new PutObjectTaggingCommand(params));

        sails.log.info(
            `Both CLEAN and UNSUBMITTED tags added to ${file.storageName}`
        );
    } catch (err) {
        throw new Error(`addCleanAndUnsubmittedTagsToFile ${err}`);
    }
}

function checkTypeAndDuplication(req, file, cb) {
    let errors = [];
    const preventFileUpload = () => cb(null, false);
    const allowFileUpload = () => cb(null, true);
    const uploadedFileData = req.session.eApp?.uploadedFileData;
    const fileAlreadyExists = uploadedFileData?.find(
      (existing) => existing.filename === file.originalname
    ) ?? null;

  if (file.mimetype !== 'application/pdf') {
        errors.push(
            'The file is in the wrong format. Only .pdf files are allowed.'
        );
    }
    if (fileAlreadyExists) {
        errors.push(
            `You have already uploaded a file named ${file.originalname}. Each file in an application must have a unique name.`
        );
    }

    if (errors.length > 0) {
        req.flash('displayFilenameErrors', [
            { filename: file.originalname, errors },
        ]);
        preventFileUpload();
    } else {
      allowFileUpload();
    }
}

function removeFilesIfLarge(req) {
    const UPLOAD_LIMIT_TO_MB =
        req._sails.config.upload.file_upload_size_limit * 1_000_000;

    for (const file of req.files) {
        const fileSizeInMB = (file.size / 1_000_000).toFixed(3);
        sails.log.info(
            `FILE_SIZE: ${file.originalname} is ${fileSizeInMB} MB.`
        );

        if (file.size > UPLOAD_LIMIT_TO_MB) {
            const error = [
                `File is too big. Each file must be a maximum of ${formatFileSizeMb(
                    UPLOAD_LIMIT_TO_MB,
                    0
                )}`,
            ];
            req.flash('displayFilenameErrors', [
                { filename: file.originalname, errors: error },
            ]);
            removeSingleFile(req, file);
        }
    }
}

function formatFileSizeMb(bytes, decimalPlaces = 1) {
    return `${(bytes / 1_000_000).toFixed(decimalPlaces)}Mb`;
}

class UserAddressableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserAddressableError';
    }
}

module.exports = {
    checkTypeAndDuplication,
    removeFilesIfLarge,
    virusScan,
    connectToClamAV,
    checkFileType,
    UserAddressableError,
};
