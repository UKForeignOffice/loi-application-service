/**
 * Created by amacmillan on 25/01/2016.
 *
 * AuthController----------------------------------------------------
 *
 *
 */
const { expect } = require('chai');
const fs = require('fs');
const { resolve } = require('path');
const sinon = require('sinon');
const AuthController = require('../../../api/controllers/AuthController');

describe('AuthController:', () => {
    /* FUNCTION: loadDashboard ---------------------------------------------------------
     *
     */
    //describe.skip('[Function: loadDashboard]', function() {
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

    describe('sessionExpired', () => {
        const sandbox = sinon.sandbox.create();
        let reqStub = {
            query: {
                LoggedIn: true,
            },
            _sails: {
                config: {
                    eAppS3Vals: {
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

        it('should delete files if they exist in query param', () => {
            // when
            reqStub.query.UploadedFiles = '3453564526_file_1.pdf,3453454_file_2.pdf';
            const fileDeleted = sandbox
                .stub(fs, 'unlink')
                .callsFake(() => null);
            AuthController.sessionExpired(reqStub, resStub);

            // then
            const expectedArg1 = resolve('uploads', '3453564526_file_1.pdf');
            const expectedArg2 = resolve('uploads', '3453454_file_2.pdf');

            expect(fileDeleted.callCount).to.equal(2);
            expect(fileDeleted.getCall(0).args[0]).to.equal(expectedArg1);
            expect(fileDeleted.getCall(1).args[0]).to.equal(expectedArg2);
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
