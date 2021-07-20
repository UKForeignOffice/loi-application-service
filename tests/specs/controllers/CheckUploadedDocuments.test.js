const { expect } = require('chai');
const sinon = require('sinon');
const CheckUploadedDocumentsController = require('../../../api/controllers/CheckUploadedDocumentsController');

describe('CheckUploadedDocumentsController', () => {
    let reqStub;
    let resStub;
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        reqStub = {
            session: {
                appId: 12345,
                payment_reference: 'FCO-LOI-REF-162',
                eApp: {
                    uploadedFileData: [
                        {
                            fileName: 'test1.pdf',
                            storageName: '45678_test1.pdf',
                            location: 'aws_url_45678_test1.pdf',
                        },
                        {
                            fileName: 'test2.pdf',
                            storageName: '45678_test2.pdf',
                            location: 'aws_url_45678_test2.pdf',
                        },
                    ],
                },
            },
            _sails: {
                config: {
                    payment: {
                        paymentStartPageUrl: 'stub_payment_url',
                    },
                },
            },
        };

        resStub = {
            redirect: sandbox.spy(),
            serverError: sandbox.spy(),
        };

        sandbox.spy(sails.log, 'error');
        sandbox.spy(sails.log, 'info');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('addDocsToDBHandler', () => {
        it('should throw an error if no files are found', () => {
            // when
            reqStub.session.eApp.uploadedFileData = [];
            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

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
            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            const firstCallArgs = {
                application_id: 12345,
                uploaded_url: 'aws_url_45678_test1.pdf',
            };
            const secondCallArgs = {
                application_id: 12345,
                uploaded_url: 'aws_url_45678_test2.pdf',
            };

            expect(createUploadedDocumentsUrls.callCount).to.have.lengthOf(2);
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
            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
            expect(sails.log.error.calledWith('Missing applicaiton id')).to.be
                .true;
        });
    });

    describe('_checkDocumentCountAndPaymentDetails', () => {
        it('should check document count and payment details', () => {
            // when
            sandbox.spy(
                CheckUploadedDocumentsController,
                '_checkDocumentCountInDB'
            );
            sandbox.spy(
                CheckUploadedDocumentsController,
                '_checkPaymentDetailsExistsInDB'
            );
            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );
            const documentCountParams = {
                appId: 12345,
                totalPrice: 60,
                documentCount: 2,
            };
            const paymentParams = {
                appId: 12345,
                totalPrice: 60,
                paymentRef: 'FCO-LOI-REF-162',
                redirectUrl: 'stub_payment_url',
            };

            // then
            expect(
                CheckUploadedDocumentsController._checkDocumentCountInDB.calledWith(
                    documentCountParams,
                    resStub
                )
            ).to.be.true;
            expect(
                CheckUploadedDocumentsController._checkPaymentDetailsExistsInDB.calledWith(
                    paymentParams,
                    resStub
                )
            ).to.be.true;
        });
    });

    it.skip('redirects to the payment page', () => {
        // when
        CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub);

        // then
        expect(resStub.redirect.calledWith(307, 'stub_payment_url')).to.be.true;
    });
});
