const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-2' });

const EAppSubmittedController = require('../../../api/controllers/EAppSubmittedController');

describe('EAppSubmittedController', () => {
    let reqStub;
    let resStub;
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        reqStub = {
            session: {
                appId: 12345,
                eApp: {
                    uploadedFileData: [
                        {
                            filename: 'test1.pdf',
                            storageName: '45678_test1.pdf',
                            location: 'aws_url_45678_test1.pdf',
                        },
                        {
                            filename: 'test2.pdf',
                            storageName: '45678_test2.pdf',
                            location: 'aws_url_45678_test2.pdf',
                        },
                    ],
                },
            },
            _sails: {
                config: {
                    eAppS3Vals: {
                        s3_bucket: 'test-bucket',
                    },
                },
            },
        };

        resStub = {
            view: sandbox.spy(),
            serverError: sandbox.spy(),
        };

        sandbox.spy(sails.log, 'error');
        sandbox.spy(sails.log, 'info');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('addDocsAndRenderPage', () => {
        beforeEach(() => {
            sandbox.stub(s3, 'getSignedUrlPromise').resolves('test_file_url');
        });

        it('should throw an error if no files are found', async () => {
            // when
            reqStub.session.eApp.uploadedFileData = [];
            await EAppSubmittedController.addDocsAndRenderPage(
                reqStub,
                resStub
            );

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
            expect(sails.log.error.calledWith('No files uploaded')).to.be.true;
        });

        it('should upload files to the database if they exist', async () => {
            // when
            const createUploadedDocumentsUrls = sandbox.stub(
                UploadedDocumentUrls,
                'create'
            );
            createUploadedDocumentsUrls.resolves();
            await EAppSubmittedController.addDocsAndRenderPage(
                reqStub,
                resStub
            );

            // then
            const firstCallArgs = {
                application_id: 12345,
                filename: 'test1.pdf',
                uploaded_url: '45678_test1.pdf',
            };
            const secondCallArgs = {
                application_id: 12345,
                filename: 'test2.pdf',
                uploaded_url: '45678_test2.pdf',
            };

            expect(createUploadedDocumentsUrls.callCount).to.equal(2);
            expect(
                createUploadedDocumentsUrls.getCall(0).args[0]
            ).to.deep.equal(firstCallArgs);
            expect(
                createUploadedDocumentsUrls.getCall(1).args[0]
            ).to.deep.equal(secondCallArgs);
        });
    });

    describe('_dbColumnData', () => {
        it('should throw an error if there is no appId', async () => {
            // when
            reqStub.session.appId = null;
            sandbox.stub(UploadedDocumentUrls, 'create').resolves();
            await EAppSubmittedController.addDocsAndRenderPage(
                reqStub,
                resStub
            );

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
            expect(sails.log.error.calledWith('Missing application id')).to.be
                .true;
        });
    });

    describe('_renderPage', () => {
        it('should render submission page', async () => {
            // when
            sandbox.stub(UploadedDocumentUrls, 'create').resolves();
            await EAppSubmittedController.addDocsAndRenderPage(
                reqStub,
                resStub
            );

            // then
            expect(
                resStub.view.calledWith(
                    'eApostilles/applicationSubmissionSuccessful.ejs'
                )
            ).to.be.true;
        });
    });
});
