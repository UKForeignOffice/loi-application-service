const { expect } = require('chai');
const sinon = require('sinon');
const OpenEAppController = require('../../../api/controllers/OpenEAppController');

function assertWhenPromisesResolved(assertion) {
    setTimeout(assertion);
}

describe('OpenEAppController', () => {
    const sandbox = sinon.sandbox.create();
    let reqStub;
    let resStub;
    const resolvedAppData = {
        unique_app_id: 'id_from_apps_table',
        createdAt: '2016-07-19',
    };
    const resolvedCasebookData = [
        {
            applicationReference: 'A-D-21-0809-2034-C968',
            status: 'In progress',
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
                },
            ],
        },
    ];

    const expectedPageData = {
        applicationId: 'id_from_apps_table',
        dateSubmitted: '19 July 2016',
        documents: [
            {
                name: 'client_document_1.pdf',
                status: 'Submitted',
                apostilleReference: '',
            },
        ],
        originalCost: '£30.00',
        paymentRef: '8516285240123586',
        user_data: {
            loggedIn: true,
        },
        daysLeftToDownload: 20,
    };
    const TWENTY_DAYS_BEFORE_DEADLINE = 1629417600000;
    const ELEVEN_DAYS_BEFORE_DEADLINE = 1630281600000;
    const TWO_DAYS_AFTER_DEADLINE = 1633824000000;

    beforeEach(() => {
        reqStub = {
            params: {
                unique_app_id: 'test_unique_app_id',
                password: 'test',
            },
            protocol: 'http',
            headers: {
                host: 'localhost',
            },
            originalUrl: '/test?completedDate=2021-08-19',
            url: '/test?completedDate=2021-08-19',
            _sails: {
                config: {
                    hmacKey: '123',
                    customURLs: '123',
                    casebookCertificate: '123',
                    casebookKey: '123',
                },
            },
        };
        resStub = {
            serverError: sandbox.stub(),
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

    describe('happy path', () => {
        let findApplicationData;
        let callCasebookApi;

        beforeEach(async () => {
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            sandbox
                .stub(Date, 'now')
                .callsFake(() => TWENTY_DAYS_BEFORE_DEADLINE);
            findApplicationData = sandbox
                .stub(Application, 'find')
                .resolves(resolvedAppData);
            callCasebookApi = sandbox
                .stub(OpenEAppController, '_getApplicationDataFromCasebook')
                .resolves(resolvedCasebookData);
            await OpenEAppController.renderPage(reqStub, resStub);
        });

        it('should get data from the Application table', () => {
            // when - beforeEach runs
            // then
            assertWhenPromisesResolved(
                () =>
                    expect(
                        findApplicationData.calledWith({
                            where: { unique_app_id: 'test_unique_app_id' },
                        })
                    ).to.be.true
            );
        });

        it('should call Casebook api to get applicaiton data', () => {
            // when - beforeEach runs
            // then
            assertWhenPromisesResolved(
                () =>
                    expect(callCasebookApi.calledWith(reqStub, resStub)).to.be
                        .true
            );
        });

        it('should render openEApp.ejs page with correct data', () => {
            // when - beforeEach runs
            // then
            assertWhenPromisesResolved(
                () =>
                    expect(
                        resStub.view.calledWith(
                            'eApostilles/openEApp.ejs',
                            expectedPageData
                        )
                    ).to.be.true
            );
        });
    });

    describe('date countdown', () => {
        beforeEach(async () => {
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            sandbox.stub(Application, 'find').resolves(resolvedAppData);
            sandbox
                .stub(OpenEAppController, '_getApplicationDataFromCasebook')
                .resolves(resolvedCasebookData);
        });

        it('returns expired document error if days are negative', async () => {
            // when
            sandbox.stub(Date, 'now').callsFake(() => TWO_DAYS_AFTER_DEADLINE);
            await OpenEAppController.renderPage(reqStub, resStub);

            // then
            const sailsErrorLogObj = sails.log.error.getCall(0).args[0];
            expect(sailsErrorLogObj.message === 'Application has expired').to.be
                .true;
            expect(resStub.serverError.called).to.be.true;
        });
        it('shows correct number of days for 11 day old application', async () => {
            // when
            sandbox.stub(Date, 'now').callsFake(() => ELEVEN_DAYS_BEFORE_DEADLINE);
            await OpenEAppController.renderPage(reqStub, resStub);

            // then
            expectedPageData.daysLeftToDownload = 10;
            expect(
                resStub.view.calledWith(
                    'eApostilles/openEApp.ejs',
                    expectedPageData
                )
            ).to.be.true;
        });
        it('returns error if no date retrieved from query param', async () => {
            // when
            reqStub.originalUrl = '/test';
            sandbox
                .stub(Date, 'now')
                .callsFake(() => TWENTY_DAYS_BEFORE_DEADLINE);
            await OpenEAppController.renderPage(reqStub, resStub);

            // then
            const sailsErrorLogObj = sails.log.error.getCall(0).args[0];
            expect(sailsErrorLogObj.message === 'No date value found in url').to
                .be.true;
            expect(resStub.serverError.called).to.be.true;
        });
    });
});
