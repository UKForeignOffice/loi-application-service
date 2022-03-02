const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

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
                account: {
                    first_name: 'John',
                    last_name: 'Doe',
                },
                email: 'test@test.com',
                appType: 4,
                user: {
                    id: 123,
                },
            },
            protocol: 'https',
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test-bucket',
                    },
                },
            },
            params: {
                all: () => ({ appReference: 'test-merchant-reference' }),
            },
            get: (arg) => (arg === 'host' ? 'testHost' : null),
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
            expect(sails.log.error.calledWith('No uploaded file data found in session')).to.be.true;
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

    describe('_renderPageAndSendConfirmationEmail', () => {
        let emailSubmission;
        const stubUserData = {
            account: {
                first_name: 'John',
                last_name: 'Doe',
            },
            url: '',
            loggedIn: true,
            user: {
                email: 'test@test.com',
            },
        };
        beforeEach(async () => {
            sandbox
                .stub(HelperService, 'getUserData')
                .callsFake(() => stubUserData);
            sandbox.stub(UploadedDocumentUrls, 'create').resolves();
            emailSubmission = sandbox
                .stub(EmailService, 'submissionConfirmation')
                .callsFake(() => null);
            await EAppSubmittedController.addDocsAndRenderPage(
                reqStub,
                resStub
            );
        });

        it('should render submission page', () => {
            // when - before each
            // then
            const expectedArgs = {
                email: 'test@test.com',
                applicationId: 'test-merchant-reference',
                user_data: stubUserData,
            };

            expect(
                resStub.view.calledWith(
                    'eApostilles/applicationSubmissionSuccessful.ejs',
                    expectedArgs
                )
            ).to.be.true;
        });

        it('should send confirmaiton email', () => {
            // when - before each
            // then
            expect(
                emailSubmission.calledWith(
                    'test@test.com',
                    'test-merchant-reference',
                    {
                        first_name: 'John',
                        last_name: 'Doe',
                    },
                    123,
                    4
                )
            ).to.be.true;
        });

        it('should reset eApp session data', () => {
            // when - before each
            // then
            const expectedObj = {
                s3FolderName: '',
                uploadedFileData: [],
                uploadMessages: {
                    errors: [],
                    infectedFiles: [],
                    fileCountError: false,
                },
            };
            expect(reqStub.session.eApp).to.deep.equal(expectedObj);
        });
    });
});
