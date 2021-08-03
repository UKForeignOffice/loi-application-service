const { expect } = require('chai');
const sinon = require('sinon');
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
        it('should throw an error if no files are found', () => {
            // when
            reqStub.session.eApp.uploadedFileData = [];
            EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub);

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
            expect(sails.log.error.calledWith('No files uploaded')).to.be.true;
        });

        it('should upload files to the database if they exist', () => {
            // when
            const createUploadedDocumentsUrls = sandbox.stub(
                UploadedDocumentUrls,
                'create'
            );
            createUploadedDocumentsUrls.resolves();
            EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub);

            // then
            const firstCallArgs = {
                application_id: 12345,
                filename: 'test1.pdf',
                uploaded_url: 'aws_url_45678_test1.pdf',
            };
            const secondCallArgs = {
                application_id: 12345,
                filename: 'test2.pdf',
                uploaded_url: 'aws_url_45678_test2.pdf',
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
        it('should throw an error if there is no appId', () => {
            // when
            reqStub.session.appId = null;
            EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub);

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
            expect(sails.log.error.calledWith('Missing application id')).to.be
                .true;
        });
    });

    describe('_renderPage', () => {
        it('should render submission page', () => {
            // when
            EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub);

            // then
            expect(
                resStub.view.calledWith(
                    'eApostilles/applicationSubmissionSuccessful.ejs'
                )
            ).to.be.true;
        });
    });
});
