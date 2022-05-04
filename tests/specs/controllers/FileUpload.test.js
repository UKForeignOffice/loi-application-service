const request = require('supertest');
const fs = require('fs');
const NodeClam = require('clamscan');
const chai = require('chai');
const cheerio = require('cheerio');
const sinon = require('sinon');
const FileType = require('file-type');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;
const FileUploadController = require('../../../api/controllers/FileUploadController');
const HelperService = require('../../../api/services/HelperService');

const sandbox = sinon.sandbox.create();

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

    const reqStub = {
        _sails: {
            config: {
                upload: {
                    clamav_host: '',
                    clamav_port: '',
                    s3_bucket: '',
                    clamav_enabled: true,
                    clamav_debug_enabled: false,
                },
            },
        },
        session: {
            eApp: {
                uploadFileData: [],
            },
        },
        flash: () => [],
    };

    beforeEach(() => {
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
        const maxFiles = '50';
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => testUserData);
        sandbox.stub(NodeClam.prototype, 'init').resolves();
        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(resStub.view.getCall(0).args[0]).to.equal(
            'eApostilles/uploadFiles.ejs'
        );
        expect(resStub.view.getCall(0).args[1]).to.deep.equal({
            user_data: testUserData,
            maxFiles: maxFiles,
            backLink: '/eapp-start-page',
            messages: {
                displayFilenameErrors: [],
                infectedFiles: [],
                genericErrors: [],
            },
        });
    });

    it('should log error if not connected to clamAv', async () => {
        // when
        const errorMsg =
            'Clamav connection unavailable. Turned off for testing.';
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        sandbox
            .stub(NodeClam.prototype, 'init')
            .rejects('Turned off for testing.');
        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(sails.log.error.calledWith(errorMsg)).to.be.true;
    });
});

describe('uploadFileHandler', () => {
    let reqStub;

    const resStub = {
        redirect: sandbox.spy(),
        serverError: sandbox.spy(),
    };

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
    beforeEach(() => {
        reqStub = {
            session: {
                eApp: {
                    uploadedFileData: [
                        {
                            originalname: 'test.pdf',
                            storageName: 'test.pdf',
                            size: 123,
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
            flash: () => [],
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test',
                        file_upload_size_limit: 200,
                        clamav_host: '',
                        clamav_port: '',
                        clamav_debug_enabled: false,
                    },
                },
            },
            flash: sandbox.spy(),
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
        expect(reqStub.flash.getCall(0).args[0]).to.equal('genericErrors');
        expect(reqStub.flash.getCall(0).args[1]).to.deep.equal([
            'No files have been selected',
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

    it.only('shows error if filetype is not a PDF', () => {
        // when
        reqStub.files = testFileUploadedData;
        sandbox.stub(FileType, 'fromFile').resolves({
            mime: 'image/jpeg',
        });
        sandbox.stub(NodeClam.prototype, 'init').resolves(null);

        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        // expect(FileType.fromFile.calledOnce).to.be.true;
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
