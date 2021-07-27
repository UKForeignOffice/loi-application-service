const { expect } = require('chai');
const sinon = require('sinon');
const CheckUploadedDocumentsController = require('../../../api/controllers/CheckUploadedDocumentsController');

describe('CheckUploadedDocumentsController', () => {
    let reqStub;
    let resStub;
    const sandbox = sinon.sandbox.create();

    function assertWhenPromisesResolved(assertion) {
        setTimeout(assertion);
    }

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
            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
            expect(sails.log.error.calledWith('Missing application id')).to.be
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

    describe('_checkDocumentCountInDB', () => {
        let createUploadedDocumentsUrls;

        beforeEach(() => {
            createUploadedDocumentsUrls = sandbox.stub(
                UploadedDocumentUrls,
                'create'
            );
            createUploadedDocumentsUrls.resolves();
        });

        it('should try to find an existing document count entry', () => {
            // when
            const findUserDocumentCount = sandbox.stub(
                UserDocumentCount,
                'find'
            );
            findUserDocumentCount.resolves(true);

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            const expectedArg = {
                where: {
                    application_id: 12345,
                },
            };
            expect(findUserDocumentCount.calledWith(expectedArg)).to.be.true;
        });

        it('should update the document count if an entry exists ', () => {
            // when
            const findUserDocumentCount = sandbox.stub(
                UserDocumentCount,
                'find'
            );
            findUserDocumentCount.resolves(true);

            const updateDocumentCountSpy = sandbox.spy(
                CheckUploadedDocumentsController,
                '_updateDocumentCountInDB'
            );

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            assertWhenPromisesResolved(
                () => expect(updateDocumentCountSpy.calledOnce).to.be.true
            );
        });

        it('should create new document count if an entry does NOT exist', () => {
            // when
            const findUserDocumentCount = sandbox.stub(
                UserDocumentCount,
                'find'
            );
            findUserDocumentCount.resolves(false);

            const createDocumentCountSpy = sandbox.spy(
                CheckUploadedDocumentsController,
                '_createDocumentCountInDB'
            );

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            assertWhenPromisesResolved(
                () => expect(createDocumentCountSpy.calledOnce).to.be.true
            );
        });
    });

    describe('_checkPaymentDetailsExistsInDB', () => {
        let createUploadedDocumentsUrls;
        let findUserDocumentCount;
        let updateUserDocumentCount;

        beforeEach(() => {
            createUploadedDocumentsUrls = sandbox.stub(
                UploadedDocumentUrls,
                'create'
            );
            findUserDocumentCount = sandbox.stub(UserDocumentCount, 'find');
            updateUserDocumentCount = sandbox.stub(UserDocumentCount, 'update');

            createUploadedDocumentsUrls.resolves();
            findUserDocumentCount.resolves(true);
            updateUserDocumentCount.resolves();
        });

        it('should try to find an existing payment details entry', () => {
            // when
            const findApplicationPaymentDetails = sandbox.stub(
                ApplicationPaymentDetails,
                'find'
            );
            findApplicationPaymentDetails.resolves(true);

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            const expectedArg = {
                where: {
                    application_id: 12345,
                },
            };
            expect(findApplicationPaymentDetails.calledWith(expectedArg)).to.be
                .true;
        });

        it('should update the payment details if an entry exists ', () => {
            // when
            const findApplicationPaymentDetails = sandbox.stub(
                ApplicationPaymentDetails,
                'find'
            );
            findApplicationPaymentDetails.resolves(true);

            const updatePaymentAmount = sandbox.spy(
                CheckUploadedDocumentsController,
                '_updatePaymentAmountInDB'
            );

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            assertWhenPromisesResolved(
                () => expect(updatePaymentAmount.calledOnce).to.be.true
            );
        });

        it('should create new payment details if an entry does NOT exists ', () => {
            // when
            const findApplicationPaymentDetails = sandbox.stub(
                ApplicationPaymentDetails,
                'find'
            );
            findApplicationPaymentDetails.resolves(false);

            const createPaymentDetails = sandbox.spy(
                CheckUploadedDocumentsController,
                '_createPaymentDetailsInDB'
            );

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            assertWhenPromisesResolved(
                () => expect(createPaymentDetails.calledOnce).to.be.true
            );
        });

    });

    describe('_checkPaymentDetailsExistsInDB', () => {
        it('redirects to payment page after document count and payment details checks', () => {
            // when
            const createUploadedDocumentsUrls = sandbox.stub(
                UploadedDocumentUrls,
                'create'
            );
            const findUserDocumentCount = sandbox.stub(
                UserDocumentCount,
                'find'
            );
            const updateUserDocumentCount = sandbox.stub(
                UserDocumentCount,
                'update'
            );
            const findApplicationPaymentDetails = sandbox.stub(
                ApplicationPaymentDetails,
                'find'
            );
            const updateApplicationPaymentDetails = sandbox.stub(
                ApplicationPaymentDetails,
                'update'
            );
            createUploadedDocumentsUrls.resolves();
            findUserDocumentCount.resolves(true);
            updateUserDocumentCount.resolves();
            findApplicationPaymentDetails.resolves(true);
            updateApplicationPaymentDetails.resolves();

            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );

            // then
            assertWhenPromisesResolved(
                () =>
                    expect(resStub.redirect.calledWith(307, 'stub_payment_url'))
                        .to.be.true
            );
        });
    });
});
