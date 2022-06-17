// @ts-check
const request = require('supertest');
const fs = require('fs');
const sails = require('sails');
const NodeClam = require('clamscan');
const chai = require('chai');
const path = require('path');
const { expect } = require('chai');
const cheerio = require('cheerio');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const FileUploadController = require('../../../api/controllers/FileUploadController');
const HelperService = require('../../../api/services/HelperService');
const Application = require('../../../api/models/index').Application;
const { max_files_per_application: maxFileLimit } =
    require('../../../config/environment-variables').upload;
const FileType = require('file-type');

const sandbox = sinon.sandbox.create();

const testFileUploadedData = [
    {
        fieldname: 'documents',
        originalname: 'test_upload.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        destination: '/test/location',
        filename: 'be3ad2f823a54812991839c3e856ec0a_test_upload.pdf',
        path: '/test/location/be3ad2f823a54812991839c3e856ec0a_terst_upload.pdf',
        size: 470685,
    },
];

// Tests are timing out
describe.skip('FileUploadController', function () {
    let userId = 100;
    let agent;

    beforeEach(function (done) {
        agent = request.agent(sails.hooks.http.app);
        // in the actual controller this helper returns user data from the session
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            user: {
                id: userId,
            },
        }));
        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should return a redirect to the /upload-files page', function (done) {
        agent
            .post('/upload-file-handler')
            .attach(
                'documents',
                process.cwd() + '/tests/specs/controllers/data/test.pdf'
            )
            .expect(302)
            .then((response) => {
                chai.expect(response.headers.location).to.eql('/upload-files');
                done();
            });
    });

    it('should show uploaded and errored files in the page', function (done) {
        // use a unique user, so the documents cache on the server starts in a blank state
        userId = 101;
        agent
            .post('/upload-file-handler')
            .attach(
                'documents',
                process.cwd() + '/tests/specs/controllers/data/test.pdf'
            )
            .attach(
                'documents',
                process.cwd() + '/tests/specs/controllers/data/fco-logo.png'
            )
            .expect(302)
            .then(() => {
                agent
                    .get('/upload-files')
                    .expect(200)
                    .then((response) => {
                        const $ = cheerio.load(response.text);
                        const uploadedFileName = $(
                            '[data-testid="uploaded-file-0"]'
                        )
                            .text()
                            .trim();
                        chai.expect(uploadedFileName).to.eql('test.pdf');
                        const erroredFileName = $(
                            '[data-testid="errored-file-0"]'
                        )
                            .text()
                            .trim();
                        chai.expect(erroredFileName).to.eql('fco-logo.png');
                        const errorMessage = $(
                            '[data-testid="errored-file-0-error-0"]'
                        )
                            .text()
                            .trim();
                        chai.expect(errorMessage).to.eql(
                            'The file is in the wrong format. Only .pdf files are allowed.'
                        );
                        done();
                    });
            });
    });

    it('should delete a file', (done) => {
        // use a unique user, so the documents cache on the server starts in a blank state
        userId = 102;
        agent
            .post('/upload-file-handler')
            .attach(
                'documents',
                process.cwd() + '/tests/specs/controllers/data/test.pdf'
            )
            .expect(302)
            .then(() => {
                agent
                    .post('/delete-file-handler')
                    .send({ delete: 'test.pdf' })
                    .expect(302)
                    .then(() => {
                        agent
                            .get('/upload-files')
                            .expect(200)
                            .then((response) => {
                                const $ = cheerio.load(response.text);
                                const uploadedFiles = $(
                                    '[data-testid="delete-form"]'
                                );
                                chai.expect(uploadedFiles.length).to.eql(0);
                                done();
                            });
                    });
            });
    });
});

describe('uploadFilesPage', () => {
    let resStub = {};
    let reqStub = {};

    beforeEach(() => {
        reqStub = {
            _sails: {
                config: {
                    upload: {
                        clamav_host: '',
                        clamav_port: '',
                        s3_bucket: '',
                        clamav_enabled: true,
                        clamav_debug_enabled: false,
                        max_files_per_application: 10,
                    },
                },
            },
            files: [],
            session: {
                appId: 123,
                account: {
                    feedback_consent: true,
                },
                eApp: {
                    uploadFileData: [],
                },
                user: {
                    id: 456,
                },
            },
            flash: sandbox.spy(),
        };

        resStub = {
            forbidden: sandbox.spy(),
            view: sandbox.spy(),
            serverError: sandbox.spy(),
        };

        sandbox.spy(sails.log, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should forbid users that are not logged in', async () => {
        // when
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: false,
        }));
        sandbox.stub(NodeClam.prototype, 'init').resolves();
        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(resStub.forbidden.calledOnce).to.be.true;
    });

    it('should load uploadedFiles.ejs with user_data', async () => {
        // when
        const testUserData = {
            loggedIn: true,
            user: 'test_data',
        };
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => testUserData);
        sandbox.stub(NodeClam.prototype, 'init').resolves();
        sandbox
            .stub(FileUploadController, '_addSignedInDetailsToApplication').resolves();
        reqStub.flash = () => [];

        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(resStub.view.firstCall.args[0]).to.equal(
            'eApostilles/uploadFiles.ejs'
        );
        expect(resStub.view.firstCall.args[1]).to.deep.equal({
            user_data: testUserData,
            maxFileLimit,
            filesToDelete: -10,
            backLink: '/completing-your-application',
            messages: {
                displayFilenameErrors: [],
                infectedFiles: [],
                genericErrors: [],
            },
        });
    });

    it('should log error if not connected to clamAV', async () => {
        // when
        const errorMsg =
            'connectToClamAV Error: initialiseClamScan Turned off for testing.';
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        sandbox
            .stub(NodeClam.prototype, 'init')
            .rejects('Turned off for testing.');
        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(sails.log.error.firstCall.args[0]).to.equal(errorMsg);
    });

    // Read docs/eApp-pre-sign-in.md for more info
    it('updates user_id in the Applicaiton table if it is set to 0', async () => {
        // when
        let applicationRowData = {
            user_id: 0,
        };
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        sandbox.stub(NodeClam.prototype, 'init').resolves();
        sandbox.stub(Application, 'findOne').resolves({
            dataValues: applicationRowData,
            update: (arg) => {
                applicationRowData = {
                    ...applicationRowData,
                    ...arg,
                };
            },
        });
        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(applicationRowData.user_id).to.equal(456);
    });

    it('shows an error on page load if max files exceeded', async () => {
        // when
        const arrayWithTestFiles = createOverLimitFileData();

        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        sandbox.stub(NodeClam.prototype, 'init').resolves();

        reqStub.session.eApp.uploadedFileData = arrayWithTestFiles;
        reqStub.files = arrayWithTestFiles;

        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(reqStub.flash.getCall(4).args[0]).to.equal('fileLimitError');
        expect(reqStub.flash.getCall(4).args[1]).to.deep.equal([
            `Too many files uploaded. A maximum of ${maxFileLimit} PDF files can be included in a single application`,
        ]);
    });
});

describe('uploadFileHandler', () => {
    let reqStub;

    const resStub = {
        redirect: sandbox.spy(),
        serverError: sandbox.spy(),
    };

    beforeEach(() => {
        reqStub = {
            session: {
                eApp: {
                    uploadedFileData: [
                        {
                            originalname: 'test.pdf',
                            storageName: 'test.pdf',
                            filename: 'test.pdf',
                            passedVirusCheck: false,
                            size: 470685,
                        },
                    ],
                    uploadMessages: {
                        error: [],
                        fileCountError: false,
                        infectedFiles: [],
                        noFileUploadedError: false,
                    },
                },
            },
            files: [],
            flash: sandbox.spy(),
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test',
                        file_upload_size_limit: 200,
                        clamav_host: '',
                        clamav_port: '',
                        clamav_debug_enabled: false,
                        max_files_per_application: 10,
                    },
                },
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should redirect to upload-files page after uploading a file', () => {
        // when
        sandbox.stub(FileUploadController, '_fileTypeAndVirusScan').resolves();
        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(resStub.redirect.calledWith('/upload-files')).to.be.true;
    });

    it('triggers noFileUploadedError if no files uploaded', () => {
        // when
        reqStub.session.eApp.uploadedFileData = [];
        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(reqStub.flash.firstCall.args[0]).to.equal('genericErrors');
        expect(reqStub.flash.firstCall.args[1]).to.deep.equal([
            'No files have been selected',
        ]);
    });

    it('shows an error if max file limit exceeded', () => {
        // when
        const arrayWithTestFiles = createOverLimitFileData();

        reqStub.session.eApp.uploadedFileData = arrayWithTestFiles;
        reqStub.files = arrayWithTestFiles;

        sandbox.stub(path, 'resolve').resolves('/test/upload/file.pdf');

        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(reqStub.flash.firstCall.args[0]).to.equal('fileLimitError');
        expect(reqStub.flash.firstCall.args[1]).to.deep.equal([
            `Too many files uploaded. A maximum of ${maxFileLimit} PDF files can be included in a single application`,
        ]);
    });

    it('checks filetype when file uploaded', () => {
        // when
        reqStub.files = testFileUploadedData;
        sandbox.stub(FileType, 'fromFile').resolves({
            mime: 'application/pdf',
        });
        sandbox.stub(NodeClam.prototype, 'init').resolves(null);

        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(FileType.fromFile.calledOnce).to.be.true;
    });

    it('redirects to upload files page if filetype is not a PDF', () => {
        // when
        reqStub.files = testFileUploadedData;
        sandbox.stub(FileType, 'fromFile').resolves({
            mime: 'image/jpeg',
        });
        sandbox.stub(NodeClam.prototype, 'init').resolves(null);
        sandbox.stub(fs, 'unlink').callsFake(() => null);

        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(resStub.redirect.firstCall.args[0]).to.equal('/upload-files');
    });

    it('scans for viruses when a file is uploaded', () => {
        // when
        reqStub.files = testFileUploadedData;
        sandbox.stub(FileType, 'fromFile').resolves({
            mime: 'application/pdf',
        });
        const clamscan = sandbox.stub(NodeClam.prototype, 'init');
        clamscan.callsFake(() => ({
            isInfected: sandbox.spy(),
        }));

        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        assertWhenPromisesResolved(() => {
            const { isInfected } = clamscan.firstCall.returnValue;
            expect(isInfected.callCount).to.equal(1);
        });
    });
});

describe('deleteFileHandler', () => {
    let reqStub;

    const resStub = {
        redirect: sandbox.spy(),
        badRequest: sandbox.spy(),
        notFound: sandbox.spy(),
    };

    beforeEach(() => {
        reqStub = {
            body: {
                delete: null,
            },
            session: {
                eApp: {
                    uploadedFileData: [],
                },
            },
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test',
                    },
                },
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return bad request if body.delete is empty', () => {
        // when
        FileUploadController.deleteFileHandler(reqStub, resStub);

        // then
        expect(resStub.badRequest.calledOnce).to.be.true;
    });

    it('should return not found if no files found in session', () => {
        // when
        reqStub.body.delete = 'test_file.pdf';
        FileUploadController.deleteFileHandler(reqStub, resStub);

        // then
        expect(resStub.notFound.calledOnce).to.be.true;
    });

    it('should redirect to upload-files page after deleting a file', () => {
        // when
        reqStub.body.delete = 'test_file.pdf';
        reqStub.session.eApp.uploadedFileData = [
            {
                filename: 'test_file.pdf',
                storageName: 'test_file.pdf',
            },
        ];
        sandbox.stub(fs, 'unlink').callsFake(() => null);
        FileUploadController.deleteFileHandler(reqStub, resStub);

        // then
        expect(resStub.redirect.calledWith('/upload-files')).to.be.true;
    });

    it('should remove deleted file from sesion', () => {
        // when
        reqStub.body.delete = 'test_file.pdf';
        reqStub.session.eApp.uploadedFileData = [
            {
                filename: 'test_file.pdf',
                storageName: 'test_file.pdf',
            },
            {
                filename: 'test_file_2.pdf',
                storageName: 'test_file_2.pdf',
            },
        ];
        sandbox.stub(fs, 'unlink').callsFake(() => null);

        // then
        expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(2);
        FileUploadController.deleteFileHandler(reqStub, resStub);
        expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(1);
        expect(reqStub.session.eApp.uploadedFileData[0].filename).to.equal(
            'test_file_2.pdf'
        );
    });
});

function assertWhenPromisesResolved(assertion) {
    setTimeout(assertion);
}

function createOverLimitFileData() {
    const overMaxFileLimit = Number(maxFileLimit) + 1;
    const emptyArray = new Array(overMaxFileLimit).fill(undefined);

    return emptyArray.map((_testFile) => createRandomTestFile());
}

function createRandomTestFile() {
    const uuidStr = 'test';
    const randomFileName = `${HelperService.uuid()}.pdf`;
    const testFile = {
        fieldname: 'documents',
        originalname: '',
        encoding: '7bit',
        mimetype: 'application/pdf',
        destination: '/test/location',
        filename: '',
        storageName: '',
        path: '',
        size: 470685,
    };

    testFile.storageName = randomFileName;
    testFile.originalname = randomFileName;
    testFile.filename = `${uuidStr}_${randomFileName}`;
    testFile.path = `/test/${uuidStr}_${randomFileName}`;

    return testFile;
}
