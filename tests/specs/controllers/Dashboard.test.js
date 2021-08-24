/**
 * Created by amacmillan on 25/01/2016.
 *
 * DashboardController----------------------------------------------------
 *
 *
 */
const { expect } = require('chai');
const sinon = require('sinon');
const dashboardController = require('../../../api/controllers/DashboardController');

describe('DashboardController:', function () {
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

    describe('tests for users flagged to use the eAposttie service', () => {
        let reqStub;
        let resStub;
        const sandbox = sinon.sandbox.create();

        function assertWhenPromisesResolved(assertion) {
            setTimeout(assertion);
        }

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
                            applicationStatusAPIURL: '',
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
            };

            sandbox.spy(sails.log, 'error');
            sandbox.spy(sails.log, 'info');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should process electronic apps if user.electronicEnabled is true', () => {
            // when
            sandbox.stub(Application, 'count').resolves(6);
            sandbox.stub(HelperService, 'refreshUserData').resolves();
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                user: {
                    electronicEnabled: true,
                },
            }));
            sandbox
                .stub(dashboardController, '_displayApplications')
                .callsFake(() => null);
            dashboardController.dashboard(reqStub, resStub);

            // then
            assertWhenPromisesResolved(
                () =>
                    expect(
                        sails.log.info.calledWith(
                            'Fetching electronic and paper applications'
                        )
                    ).to.be.true
            );
        });

        it('should run the eApp specific stored procedure if user.electronicEnabled is true', () => {
            // when
            const electronicEnabled = true;
            const chooseStoredProcedure =
                dashboardController._chooseStoredProcedure(
                    null,
                    electronicEnabled
                );

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
    });

    describe('_userFriendlyStatuses()', () => {
        it('should return Not avialable if casebook does not return a status', () => {
            // when
            const returnedValue = dashboardController._userFriendlyStatuses(
                    null,
                    null
                );

            // then
            expect(returnedValue).to.deep.equal({
                text: 'Not avialable',
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
                'Checked',
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
                dashboardController._userFriendlyStatuses(
                    testArg
                )
            );

            // then
            expect(returnedValues).to.deep.equal(expectedValues);
        });
    });
});
