const { expect } = require('chai');
const sinon = require('sinon');
const OpenEAppController = require('../../../api/controllers/OpenEAppController');
const CasebookService = require('../../../api/services/CasebookService');
const stream = require('stream');
const util = require('util');

describe('OpenEAppController', () => {
    const sandbox = sinon.sandbox.create();
    let reqStub;
    let resStub;
    const resolvedAppData = {
        unique_app_id: 'id_from_apps_table',
        createdAt: '2021-08-19',
        user_id: 123,
    };
    const resolvedCasebookData = {
        data: [
            {
                applicationReference: 'A-D-21-0809-2034-C968',
                status: 'In progress',
                completedDate: '2021-08-19 00:00',
                payment: {
                    netAmount: 30.0,
                    transactions: [
                        {
                            amount: 30.0,
                            method: 'Credit/Debit Card',
                            reference: '8516285240123586',
                            transactionAmount: 30.0,
                            transactionDate: '',
                            type: 'Initial Incoming',
                        },
                    ],
                },
                documents: [
                    {
                        name: 'client_document_1.pdf',
                        status: 'Submitted',
                        apostilleReference: '',
                        downloadExpired: false,
                    },
                ],
            },
        ],
    };

    const expectedPageData = {
        applicationId: 'id_from_apps_table',
        dateSubmitted: '19 August 2021',
        documents: [
            {
                name: 'client_document_1.pdf',
                status: 'Submitted',
                apostilleReference: '',
                downloadExpired: false,
            },
        ],
        originalCost: '£30.00',
        paymentRef: '8516285240123586',
        user_data: {
            loggedIn: true,
        },
        daysLeftToDownload: 19,
        applicationExpired: false,
        applicationStatus: resolvedCasebookData.data[0].status,
    };
    const TWO_DAYS_AFTER_COMPLETION = 1629417600000;
    const TWELVE_DAYS_AFTER_COMPLETION = 1630281600000;

    beforeEach(() => {
        reqStub = {
            params: {
                unique_app_id: 'test_unique_app_id',
                password: 'test',
                applicationRef: '123',
            },
            protocol: 'http',
            headers: {
                host: 'localhost',
            },
            _sails: {
                config: {
                    hmacKey: '123',
                    customURLs: '123',
                    casebookCertificate: '123',
                    casebookKey: '123',
                    upload: {
                        max_days_to_download: '21',
                    },
                },
            },
            session: {
                user: {
                    id: 123,
                },
            },
        };
        resStub = {
            serverError: sandbox.stub(),
            forbidden: sandbox.stub(),
            view: sandbox.stub(),
        };
        sandbox.spy(sails.log, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should prevent viewing the page if user is not logged in', async () => {
        // when
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: false,
        }));
        await OpenEAppController.renderPage(reqStub, resStub);

        // then
        expect(resStub.serverError.called).to.be.true;
    });

    it('prevents viewing the page if application ref is undefined', async () => {
        // when
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        reqStub.params.unique_app_id = 'undefined';
        await OpenEAppController.renderPage(reqStub, resStub);

        // then
        expect(resStub.serverError.called).to.be.true;
    });

    it("prevents the user from viewing someone else's application", async () => {
        // when
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        sandbox.stub(Application, 'find').resolves({ user_id: 456 });
        await OpenEAppController.renderPage(reqStub, resStub);

        // then
        expect(resStub.forbidden.called).to.be.true;
    });

    describe('happy path', () => {
        let findApplicationData;

        beforeEach(() => {
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            sandbox
                .stub(Date, 'now')
                .callsFake(() => TWO_DAYS_AFTER_COMPLETION);
            findApplicationData = sandbox
                .stub(Application, 'find')
                .resolves(resolvedAppData);
            sandbox
                .stub(OpenEAppController, '_getApplicationDataFromCasebook')
                .resolves(resolvedCasebookData);
            sandbox.stub(OpenEAppController, '_getUserRef').resolves(123456);
        });

        it('should get data from the Application table', async () => {
            // when - beforeEach runs
            await OpenEAppController.renderPage(reqStub, resStub);
            // then
            expect(
                findApplicationData.calledWith({
                    where: { unique_app_id: 'test_unique_app_id' },
                })
            ).to.be.true;
        });

        it('should render openEApp.ejs page with correct data', async () => {
            // when - beforeEach runs
            await OpenEAppController.renderPage(reqStub, resStub);
            // then
            expect(resStub.view.getCall(0).args[1]).to.deep.equal({
                ...expectedPageData,
                daysLeftToDownload: 0,
                userRef: 123456,
            });
        });
    });

    describe('date countdown', () => {
        it('shows correct number of days for 11 day old application', async () => {
            // when
            sandbox.stub(Application, 'find').resolves(resolvedAppData);
            resolvedCasebookData.data[0].status = 'Completed';
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            sandbox
                .stub(OpenEAppController, '_getApplicationDataFromCasebook')
                .resolves(resolvedCasebookData);
            sandbox.stub(OpenEAppController, '_getUserRef').resolves('');
            sandbox
                .stub(Date, 'now')
                .callsFake(() => TWELVE_DAYS_AFTER_COMPLETION);
            await OpenEAppController.renderPage(reqStub, resStub);

            // then
            expectedPageData.daysLeftToDownload = 10;
            expectedPageData.userRef = '';
            expectedPageData.applicationStatus = 'Completed';
            expect(resStub.view.getCall(0).args[1]).to.deep.equal(
                expectedPageData
            );
        });
    });

    describe('_calculateDaysLeftToDownload', () => {
        it('throws error if no date value found', () => {
            // when
            const fn = () =>
                OpenEAppController._calculateDaysLeftToDownload(
                    {
                        completedDate: null,
                    },
                    reqStub
                );

            // then
            expect(fn).to.throw(Error, 'No date value found');
        });

        it('returns expected values', () => {
            // when
            const SEVEN_DAYS_AFTER_COMPLETION = 1629849600000;
            const TWENTY_ONE_DAYS_AFTER_COMPLETION = 1631142000000;

            const currentDates = [
                TWELVE_DAYS_AFTER_COMPLETION,
                SEVEN_DAYS_AFTER_COMPLETION,
                TWO_DAYS_AFTER_COMPLETION,
                TWENTY_ONE_DAYS_AFTER_COMPLETION,
            ];
            const expectedValues = [10, 15, 20, 0];
            const returnedValues = currentDates.map((currentDate) => {
                sandbox.stub(Date, 'now').callsFake(() => currentDate);
                const result = OpenEAppController._calculateDaysLeftToDownload(
                    resolvedCasebookData.data[0],
                    reqStub
                );
                Date.now.restore();
                return result;
            });

            // then
            expect(expectedValues).to.deep.equal(returnedValues);
        });
    });

    describe('downloadReceipt', () => {
        it('throws if there are no documents found', () => {
            // when
            resolvedCasebookData.data.documents = null;
            const fn = () =>
                OpenEAppController._hasApplicationExpired(
                    resolvedCasebookData.data,
                    21
                );

            // then
            expect(fn).to.throw();
        });

        it('returns true if total documents matches expired documents', () => {
            // when
            resolvedCasebookData.data.documents = [
                {
                    name: 'client_document_1.pdf',
                    status: 'Submitted',
                    apostilleReference: '',
                    downloadExpired: true,
                },
                {
                    name: 'client_document_2.pdf',
                    status: 'Submitted',
                    apostilleReference: '',
                    downloadExpired: true,
                },
            ];
            const result = OpenEAppController._hasApplicationExpired(
                resolvedCasebookData.data,
                0
            );

            // then
            expect(result).to.be.true;
        });

        it('returns true if only one document has downloadExpired as true', () => {
            // when
            resolvedCasebookData.data.documents = [
                {
                    name: 'client_document_1.pdf',
                    status: 'Submitted',
                    apostilleReference: '',
                    downloadExpired: true,
                },
                {
                    name: 'client_document_2.pdf',
                    status: 'Submitted',
                    apostilleReference: '',
                    downloadExpired: false,
                },
            ];
            const result = OpenEAppController._hasApplicationExpired(
                resolvedCasebookData.data,
                21
            );

            // then
            expect(result).to.be.true;
        });

        it('returns true if days left to download is below 0', () => {
            // when
            resolvedCasebookData.data.documents = [
                {
                    name: 'client_document_2.pdf',
                    status: 'Submitted',
                    apostilleReference: '',
                    downloadExpired: false,
                },
            ];
            const result = OpenEAppController._hasApplicationExpired(
                resolvedCasebookData.data,
                -1
            );

            // then
            expect(result).to.be.true;
        });
    });

    describe('downloadReceipt', () => {
        beforeEach(() => {
            sandbox.stub(stream, 'finished').returns(null);
            sandbox.stub(util, 'promisify').callsFake(() => () => null);
        });

        it('calls getApplicationReceipt method from CasebookService to stream file', async () => {
            // when
            const getReceipt = sandbox
                .stub(CasebookService, 'getApplicationReceipt')
                .resolves({
                    data: {
                        pipe: () => {},
                    },
                });

            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            sandbox.stub(Application, 'find').resolves({ user_id: 123 });
            await OpenEAppController.downloadReceipt(reqStub, resStub);

            // then
            expect(getReceipt.calledOnce).to.be.true;
        });

        it('triggers serverError when user is not logged in', async () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: false,
            }));
            await OpenEAppController.downloadReceipt(reqStub, resStub);

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
        });

        it('triggers serverError if application ref is undefined', async () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            reqStub.params.applicationRef = 'undefined';
            await OpenEAppController.downloadReceipt(reqStub, resStub);

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
        });

        it("prevents the user from downloading someone else's receipt", async () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            sandbox.stub(Application, 'find').resolves({ user_id: 456 });
            await OpenEAppController.downloadReceipt(reqStub, resStub);

            // then
            expect(resStub.serverError.calledOnce).to.be.true;
        });
    });
});
