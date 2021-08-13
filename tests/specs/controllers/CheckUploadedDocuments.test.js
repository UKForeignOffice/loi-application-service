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
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('_checkDocumentCountAndPaymentDetails', () => {
        it('should check document count', () => {
            // when
            const checkCountSpy = sandbox.spy(
                CheckUploadedDocumentsController,
                '_checkDocumentCountInDB'
            );
            CheckUploadedDocumentsController.addDocsToDBHandler(
                reqStub,
                resStub
            );
            const params = {
                appId: 12345,
                totalPrice: 60,
                documentCount: 2,
                paymentRef: 'FCO-LOI-REF-162',
                redirectUrl: 'stub_payment_url',
            };

            // then
            expect(checkCountSpy.calledWith(params, resStub)).to.be.true;
        });
    });

    describe('_checkDocumentCountInDB', () => {

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

        it.skip('should update the document count if an entry exists ', () => {
            // when
            sandbox.stub(
                UserDocumentCount,
                'find'
            ).resolves(true);

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
            sandbox.stub(
                UserDocumentCount,
                'find'
            ).resolves(false);

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
        beforeEach(() => {
            sandbox
                .stub(UploadedDocumentUrls, 'create')
                .resolves();
            sandbox
                .stub(UserDocumentCount, 'find')
                .resolves(true);
            sandbox
                .stub(UserDocumentCount, 'update')
                .resolves();
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
            assertWhenPromisesResolved(
                () => expect(findApplicationPaymentDetails.calledWith(expectedArg)).to.be
                .true
            );
        });

        it('should update the payment details if an entry exists ', () => {
            // when
            sandbox.stub(
                ApplicationPaymentDetails,
                'find'
            ).resolves(true);

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
            sandbox
                .stub(ApplicationPaymentDetails, 'find')
                .resolves(false);

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
            sandbox
                .stub(UploadedDocumentUrls, 'create')
                .resolves();
            sandbox
                .stub(UserDocumentCount, 'find')
                .resolves(true);
            sandbox
                .stub(UserDocumentCount, 'update')
                .resolves();
            sandbox
                .stub(ApplicationPaymentDetails, 'find')
                .resolves(true);
            sandbox.stub(
                ApplicationPaymentDetails,
                'update'
            ).resolves();

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