/**
 * Created by amacmillan on 25/01/2016.
 *
 * AuthController----------------------------------------------------
 *
 *
 */
var request = require('supertest');
var chai = require('chai');

describe('AuthController:', function() {

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

});