/**
 * Created by preciousr on 11/11/2015.
 *
 *
 * ApplicationTypeController----------------------------------------------------
 *  This controller only has a single function 'new-application()' we test this
 *  under a standard service scenario, a business service scenario and an
 *  erroneous one.
 *
 */
var request = require('supertest');
var chai = require('chai');
var sinon = require('sinon');
var session = require('supertest-session');
var crypto = require('crypto');
var should = require('should');
const { expect } = chai;
const ApplicationTypeController = require('../../../api/controllers/ApplicationTypeController');

var testSession = null;
testSession = session('test');

var testApplicationId = 8072;

var testEmail = 'mark.barlow@digital.fco.gov.uk';
var testApplication_id = 7888;

describe('ApplicationTypeController', function () {
    /**
     * Render the service selector page
     */
    describe.skip('[FUNCTION: serviceSelectorPage()]', function () {
        it('should load the the Service Selector page and populate session vars with empty data if a new application, or current data if an application update ', function (done) {
            User.findOne({ where: { email: testEmail } }).then(function (user) {
                AccountDetails.findOne({ where: { user_id: user.id } }).then(
                    function (account) {
                        testSession.user = user;
                        testSession.account = account;
                        testSession.appId = 0; // reset the appId so a new session is used
                        // set initial submit status to false, meaning it application has not yet been submitted
                        testSession.appSubmittedStatus = false;

                        chai.assert.isOk(
                            account !== null,
                            'Successfully found account details for user ' +
                                testEmail
                        );
                        chai.assert.isOk(
                            testSession.appSubmittedStatus === false,
                            'appSubmittedStatus successfully reset'
                        );
                        chai.assert.isOk(
                            sails.config.customURLs.userServiceURL ==
                                'http://localhost:8080/api/user',
                            'Successfully found Service URL'
                        );

                        /**
                         * tempate find test is in next section
                         */
                        // res.view('applicationForms/applicationType.ejs', {
                        //     application_id: 0,
                        //     userServiceURL: sails.config.customURLs.userServiceURL,
                        //     error_report: false,
                        //     changing: false,
                        //     form_values: false,
                        //     submit_status: req.session.appSubmittedStatus,
                        //     current_uri: req.originalUrl,
                        //     user_data: HelperService.getUserData(req,res)
                        // });
                        done();
                    }
                );
            });
        });

        it('should find the applicationType tempate view', function (done) {
            var fs = require('fs');
            //TODO:: fix this so relative path can be used
            fs.stat(
                'views/applicationForms/applicationType.ejs',
                function (err, stat) {
                    if (err === null) {
                        chai.assert.isOk(
                            stat,
                            'Successfully found applicationType template'
                        );
                        done();
                    } else {
                        chai.assert.isNotOk(
                            err,
                            'Failed to find applicationType template'
                        );
                        done(err);
                    }
                }
            );
        });
    });

    /**
     * Generate Application id and find the appropriate route for a new application
     */
    describe.skip('[FUNCTION: newApplication()]', function () {
        it('should use a generated a unique applicationId and successfully check it is unique, ', function (done) {
            var uniqueApplicationId = 'A-A-16-0203-1234-5842';
            // gets latest Application Reference from db
            ApplicationReference.findOne().then(function (data) {
                if (data !== null) {
                    chai.assert.isOk(
                        data,
                        'Successfully retrieved most current ApplicationReference for this new application'
                    );

                    sequelize
                        .query(
                            'SELECT unique_app_id FROM "Application" WHERE unique_app_id = \'' +
                                uniqueApplicationId +
                                "';"
                        )
                        .spread(function (result, metadata) {
                            if (result.length !== 0) {
                                chai.assert.isNotOk(
                                    result.length === 0,
                                    'Failed to find unique application reference.'
                                );
                            } else {
                                chai.assert.isOk(
                                    result.length === 0,
                                    'Successfully found unique application reference.'
                                );

                                Application.create({
                                    serviceType: 1,
                                    unique_app_id: uniqueApplicationId,
                                    all_info_correct: '-1',
                                    user_id: 100001,
                                    submitted: 'draft',
                                    feedback_consent: true,
                                })
                                    .then(function (created) {
                                        chai.assert.isOk(
                                            created,
                                            'Successfully created new Application record.'
                                        );
                                        done();
                                    })
                                    .catch(
                                        Sequelize.ValidationError,
                                        function (error) {
                                            chai.assert.isNotOk(
                                                error,
                                                'Failed to create new Application record.'
                                            );
                                            done();
                                        }
                                    );
                            }
                        });
                } else {
                    chai.assert.isNotOk(
                        data,
                        'Failed to retrieve most current ApplicationReference for this new application'
                    );
                    done();
                }
            });
        });

        // cant test because controller looks for parameter obtained form helperService
        // it('should find the business-document-quantity route', function(done) {
        //     request(sails.hooks.http.app)
        //         .post('/business-document-quantity')
        //         .send({application_id:1001})
        //         .expect(302)
        //         .end(function(err,res){
        //             if (err){
        //                 console.log(err)
        //             }

        //             res.res.connection._httpMessage.path.should.equal('/business-document-quantity');

        //             done();
        //         })
        // });

        // it('should find the choose-documents-or-skip route', function(done) {
        //     request(sails.hooks.http.app)
        //         .post('/choose-documents-or-skip')
        //         .expect(302)
        //         .end(function(err,res){
        //             if (err){
        //                 console.log(err)
        //             }

        //             res.res.connection._httpMessage.path.should.equal('/choose-documents-or-skip');

        //             done();
        //         })
        // })
    });

    /**
     * Populate the form with data when editing the page (from the summary page or by clicking the in-page back link)
     */
    describe.skip('[FUNCTION: populateApplicationType()]', function () {
        it('should retreive the previously submitted data and populate the form successfully.', function (done) {
            Application.findOne({
                where: {
                    application_id: testApplication_id,
                },
            })
                .then(function (data) {
                    chai.assert.isOk(
                        data,
                        'Successfully found previous record, so ApplicationType form can be populated for editing.'
                    );
                    done();
                })
                .catch(Sequelize.ValidationError, function (error) {
                    chai.assert.isNotOk(
                        error,
                        'Failed to populate the ApplicationType form.'
                    );
                    done(err);
                });
        });
    });

    describe('handleServiceChoice()', () => {
        let reqStub;
        let resStub;
        const sandbox = sinon.sandbox.create();

        beforeEach(() => {
            reqStub = {
                body: {
                    'choose-a-service': 'eApostille',
                },
                session: {
                    startBackLink: '',
                },
                _sails: {
                    config: {
                        customURLs: {
                            userServiceURL: 'http://localhost:8080/api/user',
                        },
                        userServiceSequelize: {
                            host: 'localhost',
                            database: 'FCO-LOI-User',
                            user: 'postgres',
                            password: 'password',
                            port: 5432,
                        },
                    },
                },
            };

            resStub = {
                view: sandbox.spy(),
                redirect: sandbox.spy(),
            };
            sandbox.stub(HelperService, 'getUserData').returns({});
            sandbox.spy(sails.log, 'error');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should not show if user isn't logged in", () => {
            // when
            sandbox
                .stub(HelperService, 'LoggedInStatus')
                .callsFake(() => false);
            ApplicationTypeController.handleServiceChoice(reqStub, resStub);

            // then
            expect(sails.log.error.calledWith('User is not logged in')).to.be
                .true;
            expect(resStub.view.calledWith('404')).to.be.true;
        });

        it('should show error message if no service is selected', () => {
            // when
            sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
            reqStub.body['choose-a-service'] = '';
            ApplicationTypeController.handleServiceChoice(reqStub, resStub);

            // then
            const expectedPageData = {
                userServiceURL: 'http://localhost:8080/api/user',
                error_report: true,
                user_data: {},
                back_link: '',
            };
            expect(sails.log.error.calledWith('No service selected')).to.be
                .true;
            expect(
                resStub.view.calledWith(
                    'eApostilles/applicationType.ejs',
                    expectedPageData
                )
            ).to.be.true;
        });

        it('redirects user to correct page based on thier selection', () => {
            // when
            sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
            const services = ['eApostille', 'standard', 'premium'];
            const expectedUrls = [
                '/new-application?app_type_group=4',
                '/new-application?app_type_group=1',
                '/new-application?app_type_group=2',
            ];

            // then
            services.forEach((service, index) => {
                reqStub.body['choose-a-service'] = service;
                ApplicationTypeController.handleServiceChoice(reqStub, resStub);
                expect(resStub.redirect.calledWith(expectedUrls[index])).to.be
                    .true;
            });
        });
    });
});
