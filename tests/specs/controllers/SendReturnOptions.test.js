/**
 * Created by preciousr on 11/11/2015.
 *
 * SendReturnOptionsController----------------------------------------------------
 *
 *
 */
var request = require('supertest');
var chai = require('chai');

describe('SendReturnOptionsController:', function() {


/* FUNCTION: SendOptionsDetailsPage ---------------------------------------------------------
 *
 */
    //describe.skip('[Function: SendOptionsDetailsPage] #FIND- Run SendOptionsDetailsPage()', function() {
    //    it('should successfully find the method and find the application record instance', function (done) {
    //
    //        Application.findOne({
    //            where: {
    //                application_id: standard_applicationID
    //            }
    //        })
    //            .then(function (data) {
    //                chai.assert.ok('Success', 'Successfully found application record instance.');
    //            })
    //            .catch(function (error) {
    //                chai.assert.notOk('Fail', 'Failed to find application record instance.');
    //            })
    //
    //        done();
    //
    //    });
    //});
    //
    //describe('[Function: sendOptions] #FIND- PostagesAvailable', function() {
    //        it('should successfully be able to query db for send postages available to render the send postage options.', function (done) {
    //
    //            sendPostageInfoSql = 'SELECT * FROM "UserPostageDetails" upd join "PostagesAvailable" pa on upd.postage_available_id=pa.id WHERE pa.type=\'send\' AND upd."application_id"=' + standard_applicationID;
    //
    //            sequelize.query(sendPostageInfoSql, function(err, results){
    //                data = results;
    //            }).then(done.bind(null, null), done)
    //
    //        });
    //});
    //
    //
    //
    //describe('[Function: sendOptions] #CREATE- Run sendOptions()', function() {
    //    it('should successfully create a postage detail record for current user', function (done) {
    //
    //        UserPostageDetails.create({
    //            application_id: standard_applicationID,
    //            postage_available_id: 1
    //        })
    //            .then(done.bind(null,null), done);
    //    });
    //});
    //
    //describe.skip('[Function: sendOptions] #MODIFY- Run sendOptions()', function() {
    //    it('should successfully update the postage detail record for current user', function (done) {
    //
    //        UserPostageDetails.update({
    //                postage_available_id: 1
    //            },
    //            {
    //                where: {
    //                    application_id: standard_applicationID,
    //                    postage_available_id: 1
    //                }
    //            }
    //        )
    //            .then(done.bind(null,null), done);
    //    });
    //});

/* FUNCTION: populatePostageSendOptionsForm ---------------------------------------------------------
 *          We test this with the standard input.
 */
    //describe('[Function: populatePostageSendOptionsForm] #MODIFY- Run populatePostageSendOptionsForm()', function() {
    //    it('should successfully populate the sendpostage form with previously submitted data', function (done) {
    //        Application.findAll({
    //            where: {
    //                application_id: standard_applicationID
    //            }
    //        })
    //            .then(function (data) {
    //                chai.assert.ok('Success', 'Successfully found application record instance.');
    //            })
    //            .catch(function(error) {
    //                chai.assert.notOk('Fail', 'Failed to find application record instance.');
    //            })
    //
    //        done();
    //    });
    //});

/* FUNCTION: returnOptions ---------------------------------------------------------
 *
 */
    //describe('[Function: ReturnOptionsDetailsPage] #FIND- Run ReturnOptionsDetailsPage()', function() {
    //    it('should successfully find the method and find the application record instance', function (done) {
    //
    //        Application.findAll({
    //            where: {
    //                application_id: standard_applicationID
    //            }
    //        })
    //            .then(function (data) {
    //                chai.assert.ok('Success', 'Successfully found application record instance.');
    //            })
    //            .catch(function(error) {
    //                chai.assert.notOk('Fail', 'Failed to find application record instance.');
    //            });
    //
    //        done();
    //    });
    //});

    //describe('[Function: returnOptions] #FIND- PostagesAvailable', function() {
    //    it('should successfully be able to query db for return postages available to render the return postage options.', function (done) {
    //
    //        sendPostageInfoSql = 'SELECT * FROM "UserPostageDetails" upd join "PostagesAvailable" pa on upd.postage_available_id=pa.id WHERE pa.type=\'return\' AND upd."application_id"=' + standard_applicationID;
    //
    //        sequelize.query(sendPostageInfoSql, function(err, results){
    //            data = results;
    //        }).then(done.bind(null, null), done)
    //
    //    });
    //});
    //
    //describe.skip('[Function: returnOptions] #CREATE- Run returnOptions()', function() {
    //    it('should successfully create a postage detail record for current user', function (done) {
    //
    //        UserPostageDetails.create({
    //            application_id: standard_applicationID,
    //            postage_available_id: 4
    //        })
    //            .then(done.bind(null,null), done);
    //    });
    //});
    //
    //describe('[Function: returnOptions] #MODIFY- Run returnOptions()', function() {
    //    it('should successfully update the postage detail record for current user', function (done) {
    //
    //        UserPostageDetails.update({
    //                postage_available_id: 4
    //            },
    //            {
    //                where: {
    //                    application_id: standard_applicationID,
    //                    postage_available_id: 4
    //                }
    //            }
    //        )
    //            .then(done.bind(null,null), done);
    //    });
    //});

/* FUNCTION: populatePostageReturnOptionsForm ---------------------------------------------------------
 *          We test this with the standard input.
 */
    //describe('[Function: populatePostageReturnOptionsForm] #MODIFY- Run populatePostageReturnOptionsForm()', function() {
    //    it('should successfully populate the returnpostage form with previously submitted data', function (done) {
    //        Application.findAll({
    //            where: {
    //                application_id: standard_applicationID
    //            }
    //        })
    //            .then(function (data) {
    //                chai.assert.ok('Success', 'Successfully found application record instance.');
    //            })
    //            .catch(function(error) {
    //                chai.assert.notOk('Fail', 'Failed to find application record instance.');
    //            })
    //
    //        done();
    //    });
    //});



});