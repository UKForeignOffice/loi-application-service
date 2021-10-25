/**
 * Created by amacmillan on 25/01/2016.
 *
 * DashboardController----------------------------------------------------
 *
 *
 */
const { expect } = require('chai');
const sinon = require('sinon');
const request = require('request');
const dashboardController = require('../../../api/controllers/DashboardController');
const summaryController = require('../../../api/controllers/SummaryController');

function assertWhenPromisesResolved(assertion) {
    setTimeout(assertion);
}

describe('DashboardController:', () => {
    afterEach(() => {
        sandbox.restore();
    });

    /* FUNCTION: dashboard ---------------------------------------------------------
     *
     */
    // Skipped because tests need postgres server to work
    describe.skip('[Function: dashboard]', function () {
        it('should load dashboard displaying a list of previously submitted applications for the current user, if any exist', function (done) {
            var userApplicationsSql =
                'select app."createdAt" as "createdDate", at."applicationType" as "appType", udc."doc_count" as "documentCount", app.application_reference as "appReference", \'Pending\' as "paymentStatus", \'Online application in progress\' as status from "Application" app inner join "ApplicationTypes" at on app."serviceType" = at.id';
            userApplicationsSql +=
                ' inner join "UserDocumentCount" udc on app.application_id=udc.application_id ';
            userApplicationsSql += ' limit 0 '; // get first result to remove need for the 'where app_id=' clause

            sequelize
                .query(userApplicationsSql)
                .spread(function (results, metadata) {
                    chai.assert.isOk(
                        'Previous applications submitted search successful'
                    );

                    if (results) {
                        chai.assert.isOk(
                            'Previous applications submitted by user found'
                        );
                    }
                    done();
                })
                .catch(Sequelize.ValidationError, function (error) {
                    chai.assert.isNotOk(
                        'There was a problem getting all previous applications from the db ',
                        error
                    );
                    done();
                });
        });
    });

    let reqStub;
    let resStub;
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        reqStub = {
            session: {
                passport: {
                    user: 189,
                },
                user: {
                    id: 128,
                },
                appId: 22,
            },
            _sails: {
                config: {
                    customURLs: {
                        userServiceURL: '',
                        applicationStatusAPIURL: 'https://www.google.com/',
                    },
                    casebookCertificate: '',
                    casebookKey: '',
                    hmacKey: '',
                },
            },
            params: {
                unique_app_id: '123',
            },
            allParams: () => ({ dashboardFilter: '' }),
            flash: sandbox.spy(),
            query: {
                searchText: '',
                sortOrder: 1,
                page: 1,
                ajax: false,
            },
        };

        resStub = {
            view: sandbox.spy(),
            redirect: sandbox.spy(),
            serverError: sandbox.spy(),
        };

        sandbox.spy(sails.log, 'error');
        sandbox.spy(sails.log, 'info');
    });

    it('redirects to the signing page if user is not logged in', () => {
        // when
        reqStub.session.passport = null;
        dashboardController.dashboard(reqStub, resStub);

        // then
        expect(resStub.redirect.getCall(0).args[0]).to.equal('/sign-in');
    });

    it('returns a server error if no user information found', () => {
        // when
        sandbox.stub(Application, 'count').resolves(2);
        sandbox.stub(HelperService, 'refreshUserData').resolves(true);
        sandbox.stub(HelperService, 'getUserData').callsFake(() => null);
        dashboardController.dashboard(reqStub, resStub);

        // then
        assertWhenPromisesResolved(() =>
            expect(resStub.serverError.callCount).to.equal(1)
        );
    });

    it('should run the eApp specific stored procedure if user.electronicEnabled is true', () => {
        // when
        const electronicEnabled = true;
        const chooseStoredProcedure =
            dashboardController._chooseStoredProcedure(null, electronicEnabled);

        // then
        const expectedQueryValue =
            'SELECT * FROM dashboard_data_eapp(:userId, :pageSize, :offset, :sortOrder, :direction, :queryString)';
        expect(chooseStoredProcedure).to.equal(expectedQueryValue);
    });

    it('should display the updated dashboard page', () => {
        // when
        const stubPageAttributes = {
            message: '',
            users_applications: [],
            moment: {},
            offset: 1,
            sortOrder: 1,
            paginationMessage: '',
            currentPage: 1,
            totalPages: 1,
            searchCriteria: '',
            user_data: {
                user: {
                    electronicEnabled: true,
                },
            },
            application_total: 0,
        };
        dashboardController._redirectToPage(
            stubPageAttributes,
            reqStub,
            resStub
        );

        // then
        const expectedPageUrl = 'eApostilles/dashboard.ejs';
        expect(resStub.view.calledWith(expectedPageUrl)).to.be.true;
    });

    it('displays correct pagination using result_count from stored procedure NOT result length', () => {
        // when
        const PAGE_SIZE = 20;
        const OFFSET = 0;
        const results = [
            {
                applicationtype: 'e-Apostille',
                doc_count: 1,
                main_postcode: '',
                payment_amount: '30.00',
                result_count: 35,
                unique_app_id: 'A-D-21-0920-2180-EEE1',
                user_ref: '',
            },
            {
                applicationtype: 'e-Apostille',
                doc_count: 1,
                main_postcode: '',
                payment_amount: '30.00',
                result_count: 35,
                unique_app_id: 'A-D-21-0920-2179-D037',
                user_ref: '',
            },
        ];

        const paginationAndPageTotal =
            dashboardController._paginationAndPageTotal(
                results,
                OFFSET,
                PAGE_SIZE
            );

        // then
        const expectedResult = {
            totalPages: 2,
            paginationMessage:
                'Showing 1 &ndash; 20 of 35 applications submitted in the last 60 days',
        };
        expect(paginationAndPageTotal).to.deep.equal(expectedResult);
    });

    describe('_addCasebookStatusesToResults', () => {
        const emptyCasebookResponse = [];
        beforeEach(() => {
            sandbox.stub(request, 'get').callsFake(() => null);
        });

        it('renders dashboard if there are 0 results', () => {
            // when
            const stubDisplayAppsArgs = {
                userData: {
                    loggedIn: true,
                    user: {
                        electronicEnabled: true,
                    },
                },
                totalApplications: 0,
                offset: 0,
                sortOrder: -1,
                currentPage: 1,
                searchCriteria: '',
                pageSize: 20,
                req: reqStub,
                res: resStub,
                results: [[]],
            };

            dashboardController._addCasebookStatusesToResults(
                emptyCasebookResponse,
                stubDisplayAppsArgs
            );

            // then
            expect(resStub.view.calledOnce).to.be.true;
        });

        it('renders results even if no or error response from casebook', () => {
            // when
            const stubDBResults = [
                {
                    applicationtype: 'e-Apostille',
                    doc_count: 1,
                    main_postcode: '',
                    payment_amount: '30.00',
                    result_count: 2,
                    unique_app_id: 'A-D-21-1008-0547-D546',
                    user_ref: 'timber',
                },
                {
                    applicationtype: 'e-Apostille',
                    doc_count: 1,
                    main_postcode: '',
                    payment_amount: '30.00',
                    result_count: 2,
                    unique_app_id: 'A-D-21-1006-2198-C15C',
                    user_ref: 'ghfghjdf',
                },
            ];

            const stubDisplayAppsArgs = {
                userData: {
                    loggedIn: true,
                    user: {
                        electronicEnabled: true,
                    },
                },
                totalApplications: 2,
                offset: 0,
                sortOrder: -1,
                currentPage: 1,
                searchCriteria: '',
                pageSize: 20,
                req: reqStub,
                res: resStub,
                results: stubDBResults,
            };

            dashboardController._addCasebookStatusesToResults(
                emptyCasebookResponse,
                stubDisplayAppsArgs
            );

            // then
            const expectedUserApplications = [
                {
                    app_status: {
                        text: 'Not available',
                        colorClass: 'govuk-tag--grey',
                    },
                    applicationtype: 'e-Apostille',
                    doc_count: 1,
                    main_postcode: '',
                    payment_amount: '30.00',
                    result_count: 2,
                    tracking_ref: undefined,
                    unique_app_id: 'A-D-21-1008-0547-D546',
                    user_ref: 'timber',
                },
                {
                    app_status: {
                        text: 'Not available',
                        colorClass: 'govuk-tag--grey',
                    },
                    applicationtype: 'e-Apostille',
                    doc_count: 1,
                    main_postcode: '',
                    payment_amount: '30.00',
                    result_count: 2,
                    tracking_ref: undefined,
                    unique_app_id: 'A-D-21-1006-2198-C15C',
                    user_ref: 'ghfghjdf',
                },
            ];
            expect(
                resStub.view.getCall(0).args[1].users_applications
            ).to.deep.equal(expectedUserApplications);
        });
    });

    describe('_calculateSortParams', () => {
        let reqStub;
        let expectedSortParams;
        const resStub = {};
        const totalApplications = 2;
        const userData = {
            loggedIn: true,
        };

        beforeEach(() => {
            reqStub = {
                allParams: () => ({ dashboardFilter: null }),
                session: {
                    passport: {
                        user: 123,
                    },
                },
                query: {
                    page: 1,
                    sortOrder: -1,
                    searchText: '',
                },
            };

            expectedSortParams = {
                storedProcedureArgs: {
                    replacements: {
                        direction: 'desc',
                        offset: 0,
                        pageSize: 20,
                        queryString: '%%',
                        secondaryDirection: null,
                        secondarySortOrder: null,
                        sortOrder: '1',
                        userId: 123,
                    },
                    type: sequelize.QueryTypes.SELECT,
                },
                displayAppsArgs: {
                    currentPage: 1,
                    offset: 0,
                    pageSize: 20,
                    req: reqStub,
                    res: resStub,
                    searchCriteria: '',
                    sortOrder: -1,
                    totalApplications,
                    userData,
                },
            };
        });

        it('returns the default sort params if nothing is changed', () => {
            // when
            const result = dashboardController._calculateSortParams(
                reqStub,
                resStub,
                userData,
                totalApplications
            );

            // then
            expect(result).to.deep.equal(expectedSortParams);
        });

        it('changes sortOrder and direction when date submitted changed', () => {
            // when
            reqStub.query.sortOrder = '2';
            const result = dashboardController._calculateSortParams(
                reqStub,
                resStub,
                userData,
                totalApplications
            );

            // then
            expectedSortParams.storedProcedureArgs.replacements.direction =
                'asc';
            expectedSortParams.storedProcedureArgs.replacements.sortOrder = '2';
            expectedSortParams.storedProcedureArgs.replacements.secondarySortOrder =
                '1';
            expectedSortParams.storedProcedureArgs.replacements.secondaryDirection =
                'desc';
            expectedSortParams.displayAppsArgs.sortOrder = 2;

            expect(result).to.deep.equal(expectedSortParams);
        });

        it('changes sort direction if sortOrder is negative', () => {
            // when
            reqStub.query.sortOrder = '-3';
            const result = dashboardController._calculateSortParams(
                reqStub,
                resStub,
                userData,
                totalApplications
            );

            // then
            expectedSortParams.storedProcedureArgs.replacements.sortOrder =
                '3';
            expectedSortParams.storedProcedureArgs.replacements.secondarySortOrder =
                '1';
            expectedSortParams.storedProcedureArgs.replacements.secondaryDirection =
                'desc';
            expectedSortParams.displayAppsArgs.sortOrder = -3;

            expect(result).to.deep.equal(expectedSortParams);
        });

        it('processes search value correctly', () => {
            // when
            reqStub.allParams = () => ({
                dashboardFilter: 'A-C-21-0920-2173-AD12',
            });
            const result = dashboardController._calculateSortParams(
                reqStub,
                resStub,
                userData,
                totalApplications
            );

            // then
            expectedSortParams.storedProcedureArgs.replacements.queryString =
                '%A-C-21-0920-2173-AD12%';
            expectedSortParams.displayAppsArgs.searchCriteria =
                'A-C-21-0920-2173-AD12';

            expect(result).to.deep.equal(expectedSortParams);
        });
    });

    describe('_userFriendlyStatuses()', () => {
        it('should return Not available if casebook does not return a status', () => {
            // when
            const returnedValue = dashboardController._userFriendlyStatuses(
                null,
                null
            );

            // then
            expect(returnedValue).to.deep.equal({
                text: 'Not available',
                colorClass: 'govuk-tag--grey',
            });
        });

        it('should return the correct status and value for eApps', () => {
            // when
            const testArguments = [
                'Submitted',
                'Received',
                'No Matches',
                'Matches Found',
                'Completed',
            ];
            const expectedValues = [
                {
                    text: 'In progress',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'In progress',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'In progress',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'In progress',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'Completed',
                    colorClass: '',
                },
            ];

            const returnedValues = testArguments.map((testArg) =>
                dashboardController._userFriendlyStatuses(
                    testArg,
                    'e-Apostille'
                )
            );

            // then
            expect(returnedValues).to.deep.equal(expectedValues);
        });

        it('should return the correct status and value for standard apps', () => {
            // when
            const testArguments = [
                'Submitted',
                'In progress',
                'In progress, complex',
                'Awaiting despatch',
                'Despatched',
            ];
            const expectedValues = [
                {
                    text: 'Submitted',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'In progress',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'In progress, complex',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'Awaiting despatch',
                    colorClass: 'govuk-tag--blue',
                },
                {
                    text: 'Despatched',
                    colorClass: '',
                },
            ];

            const returnedValues = testArguments.map((testArg) =>
                dashboardController._userFriendlyStatuses(testArg)
            );

            // then
            expect(returnedValues).to.deep.equal(expectedValues);
        });
    });

    describe('openCoverSheet', () => {
        let reqStub;
        const resStub = {
            view: sandbox.spy(),
        };
        beforeEach(() => {
            reqStub = {
                params: {
                    unique_app_id: 'A-D-21-0920-2180-EEE1',
                },
                session: {
                    appId: undefined,
                    user: {
                        id: 123,
                    },
                },
            };
        });
        it("redirects to 404 page if session and db user ids don't match", () => {
            // when
            sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
            sandbox.stub(Application, 'find').resolves({
                user_id: 100,
                application_id: 124,
            });
            dashboardController.openCoverSheet(reqStub, resStub);

            // then
            assertWhenPromisesResolved(
                () => expect(resStub.view.calledWith('404')).to.be.true
            );
        });

        it('redirect to 404 page if user is not logged in', () => {
            // when
            sandbox
                .stub(HelperService, 'LoggedInStatus')
                .callsFake(() => false);
            dashboardController.openCoverSheet(reqStub, resStub);

            // then
            expect(resStub.view.calledWith('404')).to.be.true;
        });

        it('runs fetchAll function if session and db user ids match', () => {
            // when
            const fetchAllFn = sandbox.stub(summaryController, 'fetchAll');
            sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
            sandbox.stub(Application, 'find').resolves({
                user_id: 123,
                application_id: 124,
            });
            dashboardController.openCoverSheet(reqStub, resStub);

            // then
            assertWhenPromisesResolved(
                () => expect(fetchAllFn.called).to.be.true
            );
        });
    });
});
