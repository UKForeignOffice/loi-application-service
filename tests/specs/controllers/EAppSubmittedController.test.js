const chai = require('chai');
const sinon = require('sinon');
const { GetObjectCommand, S3 } = require("@aws-sdk/client-s3");
const s3 = new S3();
const {mockClient} = require('aws-sdk-client-mock');
const s3Mock = mockClient(s3);
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;
const EAppSubmittedController = require('../../../api/controllers/EAppSubmittedController');
const UploadedDocumentUrls =
    require('../../../api/models/index').UploadedDocumentUrls;
const HelperService = require('../../../api/services/HelperService');
const EmailService = require('../../../api/services/EmailService');

describe('EAppSubmittedController', () => {
    let reqStub;
    let resStub;
    const sandbox = sinon.createSandbox();

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
            allParams: () => ({ appReference: 'test-merchant-reference' }),
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test-bucket',
                        s3_url_expiry_hours: 100,
                    },
                    views: {
                        locals: {
                            service_public: true,
                        },
                    },
                },
            },
            query: {
                appReference: 'test-merchant-reference',
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
            s3Mock.on(GetObjectCommand).resolves(
              'test_file_url');
        });

        it('should throw an error if no files are found', () => {
            // when
            reqStub.session.eApp.uploadedFileData = [];
            const fnPromise = EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub);

            // then
            expect(fnPromise).to.be.rejectedWith('No uploaded file data found in session');
        });

        it('should upload files to the database if they exist', async () => {
            // when
            const createUploadedDocumentsUrls = sandbox.stub(
                UploadedDocumentUrls,
                'create'
            );

            sandbox
                .stub(EmailService, 'submissionConfirmation')
                .callsFake(() => null);
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
            const fnPromise = EAppSubmittedController._dbColumnData(
                { storageName: 'test_1234.pdf' },
                reqStub
            );

            // then
            await expect(fnPromise).to.be.rejectedWith(
                'Missing application id'
            );
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

            expect(resStub.view.getCall(0).args[0]).to.equal(
                'eApostilles/applicationSubmissionSuccessful.ejs'
            );
            expect(resStub.view.getCall(0).args[1]).to.deep.equal(expectedArgs);
        });

        it('should send confirmation email', () => {
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
    });
});
