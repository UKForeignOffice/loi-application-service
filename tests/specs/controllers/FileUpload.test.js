const request = require('supertest');
const fs = require('fs');
const NodeClam = require('clamscan');
const chai = require('chai');
const { expect } = require('chai');
const cheerio = require('cheerio');
const sinon = require('sinon');
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
                    clamav_debug_enabled: false
                },
            },
        },
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
        const maxFiles = "50";
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => testUserData);
        sandbox.stub(NodeClam.prototype, 'init').resolves();
        await FileUploadController.uploadFilesPage(reqStub, resStub);

        // then
        expect(
            resStub.view.calledWith('eApostilles/uploadFiles.ejs', {
                user_data: testUserData,
                maxFiles: maxFiles,
                backLink: '/eapp-start-page',
            })
        ).to.be.true;
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

    beforeEach(() => {
        reqStub = {
            session: {
                eApp: {
                    uploadMessages: {
                        error: [],
                        fileCountError: false,
                        infectedFiles: [],
                    },
                },
            },
            files: [],
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test',
                    },
                },
            },
        };
    });

    it('should remove previous error messages before uploading file', () => {
        // when
        reqStub.session.eApp.uploadMessages.fileCountError = true;
        reqStub.session.eApp.uploadMessages.infectedFiles = [
            'infectedFile.pdf',
        ];
        sandbox
            .stub(FileUploadController, '_multerSetup')
            .callsFake(() => () => null);
        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(reqStub.session.eApp.uploadMessages.fileCountError).to.be.false;
        expect(reqStub.session.eApp.uploadMessages.infectedFiles).to.be.empty;
        FileUploadController._multerSetup.restore();
    });

    it.skip('should redirect to upload-files page after uploading a file', () => {
        // when
        sandbox
            .stub(FileUploadController, '_multerSetup')
            .callsFake(
                () => (req, res, err) =>
                    FileUploadController._errorChecksAfterUpload(req, res, err)
            );
        FileUploadController.uploadFileHandler(reqStub, resStub);

        // then
        expect(resStub.redirect.calledWith('/upload-files')).to.be.true;
        FileUploadController._multerSetup.restore();
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
