const { expect } = require('chai');
const sinon = require('sinon');
const CheckUploadedDocumentsController = require('../../../api/controllers/CheckUploadedDocumentsController');
const UserDocumentCount = require('../../../api/models/index').UserDocumentCount
const ApplicationPaymentDetails = require('../../../api/models/index').ApplicationPaymentDetails
const AdditionalApplicationInfo = require('../../../api/models/index').AdditionalApplicationInfo
const UploadedDocumentUrls = require('../../../api/models/index').UploadedDocumentUrls

describe('CheckUploadedDocumentsController', () => {
    let reqStub;
    let resStub;
    const sandbox = sinon.createSandbox();

    function assertWhenPromisesResolved(assertion) {
        setTimeout(assertion);
    }

    beforeEach(() => {
        reqStub = {
            session: {
                appId: 12345,
                appType: 4,
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
                    upload: {
                        cost_per_document: '30',
                    },
                },
            },
        };

        resStub = {
            redirect: sandbox.spy(),
            serverError: sandbox.spy(),
            view: sandbox.spy(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('renderPage', () => {
        it('should render the check your answers page and pass the correct values', () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true
            }));
            CheckUploadedDocumentsController.renderPage(reqStub, resStub);

            // then
            const expectedParams = {
                user_data: {
                    loggedIn: true,
                },
                documentNames: ['test1.pdf', 'test2.pdf'],
                totalDocuments: 2,
                totalCost: '£60.00'
            };
            expect(
                resStub.view.calledWith(
                    'eApostilles/checkUploadedDocuments.ejs',
                    expectedParams
                )
            );
        });
    });

    describe('_checkDocumentCountAndPaymentDetails', () => {
        it('should check document count', () => {
            // when
            sandbox.stub(UserDocumentCount, 'findAll').resolves(true);
            sandbox.stub(UserDocumentCount, 'update').resolves();
            sandbox.stub(ApplicationPaymentDetails, 'findAll').resolves(true);
            sandbox.stub(ApplicationPaymentDetails, 'update').resolves();
            sandbox.stub(AdditionalApplicationInfo, 'findAll').resolves(true);
            sandbox.stub(AdditionalApplicationInfo, 'update').resolves();

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
        beforeEach(() => {
            sandbox.stub(UserDocumentCount, 'update').resolves();
            sandbox.stub(ApplicationPaymentDetails, 'findAll').resolves(true);
            sandbox.stub(ApplicationPaymentDetails, 'update').resolves();
            sandbox.stub(AdditionalApplicationInfo, 'findAll').resolves(true);
            sandbox.stub(AdditionalApplicationInfo, 'update').resolves();
        });

        it('should try to find an existing document count entry', () => {
            // when
            const findUserDocumentCount = sandbox
                .stub(UserDocumentCount, 'findOne')
                .resolves(true);

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
            sandbox.stub(UserDocumentCount, 'findAll').resolves(true);

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
            sandbox.stub(UserDocumentCount, 'findAll').resolves(false);

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
            sandbox.stub(UserDocumentCount, 'findAll').resolves(true);
            sandbox.stub(UserDocumentCount, 'update').resolves();
            sandbox.stub(AdditionalApplicationInfo, 'findAll').resolves(true);
            sandbox.stub(AdditionalApplicationInfo, 'update').resolves();
        });

        it('should try to find an existing payment details entry', () => {
            // when
            const findApplicationPaymentDetails = sandbox.stub(
                ApplicationPaymentDetails,
                'findOne'
            );

            findApplicationPaymentDetails.resolves(true);
            sandbox.stub(ApplicationPaymentDetails, 'update').resolves();

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
                () =>
                    expect(
                        findApplicationPaymentDetails.calledWith(expectedArg)
                    ).to.be.true
            );
        });

        it('should update the payment details if an entry exists ', () => {
            // when
            sandbox.stub(ApplicationPaymentDetails, 'findAll').resolves(true);
            sandbox.stub(ApplicationPaymentDetails, 'update').resolves();

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

        it.skip('should create new payment details if an entry does NOT exists ', () => {
            // when
            sandbox.stub(ApplicationPaymentDetails, 'findAll').resolves(false);
            sandbox.stub(ApplicationPaymentDetails, 'create').resolves();

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
            sandbox.stub(UploadedDocumentUrls, 'create').resolves();
            sandbox.stub(UserDocumentCount, 'findAll').resolves(true);
            sandbox.stub(UserDocumentCount, 'update').resolves();
            sandbox.stub(ApplicationPaymentDetails, 'findAll').resolves(true);
            sandbox.stub(ApplicationPaymentDetails, 'update').resolves();

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
