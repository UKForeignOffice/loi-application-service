/**
 * Created by amacmillan on 25/01/2016.
 *
 * AuthController----------------------------------------------------
 *
 *
 */
const { expect } = require('chai');
const sails = require('sails');
const sinon = require('sinon');
const AuthController = require('../../../api/controllers/AuthController');
const UserModels = require('../../../api/userServiceModels/models.js');

describe('AuthController:', () => {
    /* FUNCTION: fromSignInPage ---------------------------------------------------------
     *
     */
    //describe.skip('[Function: fromSignInPage]', function() {
    //    it('should not error', function (done) {
    //
    //        async.series({
    //                session : function getSession(callback) {
    //                    var MongoClient = require('mongodb').MongoClient;
    //
    //                    var url = sails.config.customURLs.mongoURL+'User_Service';
    //                    console.log('Attempting to connect to ', url)
    //
    //                    var session;
    //                    MongoClient.connect(url, function (err, db) {
    //                        if (err) {
    //                            console.log(err);
    //                            chai.assert.notOk('There was an error trying to connect to the Mongo DB ', err);
    //                        }
    //
    //                        var collection = db.collection('sessions');
    //
    //                        if (collection.length < 1) {
    //                            chai.assert.notOk('There sessions collection could not be set ', collection);
    //                        }
    //
    //                        collection.find().toArray()
    //                            .then(function (result) {
    //                                if (result.length<0) {
    //                                    chai.assert.notOk('There was a problem with the found sessions collection ', result);
    //                                }
    //                                session = result[0].session;
    //                                callback(null, session);
    //                        });
    //                    });
    //                }
    //
    //            },
    //            function (err, results) {
    //                if(err) {
    //                    chai.assert.notOk('There was a problem with the authentication', err, results);
    //                }
    //                chai.assert.ok('The authentication process went smoothly');
    //            });
    //        done();
    //    });
    //});

    /* FUNCTION: logout ---------------------------------------------------------
     *
     */
    //describe.skip('[Function: logout]', function() {
    //        it('should successfully destroy the users session, and redirect the user to the non-logged in homepage', function (done) {
    //            request(sails.hooks.http.app)
    //                .post('/logout')
    //                .expect(302)
    //                .end(function(err,res, req){
    //                    if (err) {
    //                        chai.assert.notOk('There was a problem with the authentication logging out ', err);
    //                    }
    //
    //                    res.res.connection._httpMessage.path.should.equal('/logout');
    //
    //                    done();
    //                })
    //
    //
    //        });
    //});

    describe('fromSignInPage', () => {
        const sandbox = sinon.sandbox.create();

        let reqStub = {
            session: {
                email: 'foo@bar.com',
                passport: {
                    user: 123
                }
            },
            _sails: {
                config: {
                    session: {
                        cookie: {
                            maxAge: 1800000
                        }
                    }
                }
            },
            query: {
                name: ''
            }
        }

        const resStub = {
            forbidden: () => {},
            cookie: () => {},
            serverError: () => {},
            redirect: sandbox.spy(),
            view: sandbox.spy(),
        }

        beforeEach(() => {
            sandbox.stub(UserModels.User, 'findOne').resolves({
                id: 123,
                premiumEnabled: false
            });
            sandbox.stub(UserModels.AccountDetails, 'findOne').resolves({});
            sandbox.stub(UserModels.SavedAddress, 'findAll').resolves([]);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('redirects to the upload page if continueEAppFlow is true in session', async () => {
            // when
            reqStub.session.continueEAppFlow = true;
            await AuthController.fromSignInPage(reqStub, resStub);

            // then
            expect(resStub.redirect.getCall(0).args[0]).to.equal('/upload-files');
        });

        it('redirect to upload page if continueEAppFlow is true & no "name" query param exists', async () => {
            // when
            reqStub.session.continueEAppFlow = true;
            reqStub.query.name = null;
            await AuthController.fromSignInPage(reqStub, resStub);

            // then
            expect(resStub.redirect.getCall(0).args[0]).to.equal('/upload-files');
        });

        it('redirects to fallback page if there\'s nowhere to redirect', async() => {
            // when
            reqStub.session.continueEAppFlow = false;
            reqStub.query.name = 'premiumCheck';
            await AuthController.fromSignInPage(reqStub, resStub);

            // then
            expect(resStub.view.getCall(0).args[0]).to.equal('upgrade.ejs');
        });
    });

    describe('sessionExpired', () => {
        const sandbox = sinon.sandbox.create();
        let reqStub = {
            query: {
                LoggedIn: true,
            },
            _sails: {
                config: {
                    upload: {
                        s3_bucket: 'test_bucket',
                    },
                    customURLs: {
                        userServiceURL: 'test_url',
                    },
                },
            },
        };
        let resStub = {
            clearCookie: sandbox.spy(),
            view: sandbox.spy(),
        };

        beforeEach(() => {
            sandbox.spy(sails.log, 'info');
            sandbox.spy(sails.log, 'error');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should redirect to session-expired page', () => {
            // when
            AuthController.sessionExpired(reqStub, resStub);

            // then
            expect(resStub.view.calledWith('session-expired.ejs')).to.be.true;
        });

        it('should pass loggedIn value to page', () => {
            // when
            AuthController.sessionExpired(reqStub, resStub);

            // then
            const expectedData = {
                LoggedIn: true,
                special_case: false,
                userServiceURL: 'test_url',
            };
            expect(resStub.view.calledWith('session-expired.ejs', expectedData))
                .to.be.true;
        });
    });
});
