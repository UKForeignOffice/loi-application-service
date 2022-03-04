/**
 * Created by preciousr on 11/11/2015.
 *
 * DocumentQuantityController----------------------------------------------------
 *
 *
 */
var chai = require('chai');
const sequelize = require('../../../api/models/index').sequelize

describe('DocumentQuantityController', function() {

/* SETUP -----------------------------------------------------------------------------
 *          For this test suite we need an application ID so we set up a new
 *          application record and hold the id in the variable standard_applicationID.
 */
    var standard_applicationID;

    //describe.skip('#SETUP- Create application', function () {
    //    it('should check create a new application', function (done) {
    //        Application.create({serviceType: -1,
    //            all_info_correct: -1})
    //            .then(function(created){
    //                created.should.not.equal(null);
    //                standard_applicationID = created.application_id.toString();
    //                done();
    //            })
    //
    //    })
    //});


/* FUNCTION: userDocumentQuantityPage ---------------------------------------------------------
 * Populate the form with previously submitted data, or leave form empty if no previous data found
 */
    describe('[Function: userDocumentQuantityPage] #STANDARD- Run userDocumentQuantityPage()', function() {
        it('should return user doc count for current application, if found populate the form and allow an update, else leave form empty and allow a create to occur', function (done) {

            /* cause query to return nothing */
            sequelize.query('select doc_id from "UserDocuments" where application_id='+100000000000, {type: sequelize.QueryTypes.SELECT})
                .then(function (results) {
                    selectedDocsCount = results.length;
                })
                .then(function(selectedDocsCount) {
                    if (selectedDocsCount<0) {
                        chai.assert.ok('No user document counts were found, meaning the form will empty and a CREATE can be carried out');
                    }
                });

            /* cause query to return something */
            sequelize.query('select doc_id from "UserDocuments" where application_id='+standard_applicationID, {type: sequelize.QueryTypes.SELECT})
                .then(function (results, metadata) {
                    selectedDocsCount = results.length;
                })
                .then(function(selectedDocsCount) {
                    if (selectedDocsCount>0) {
                        chai.assert.ok('A user document count was found, meaning the form will be populated with previous data and an UPDATE can be carried out');
                    }
                });

            done();
        });
    });

/* FUNCTION: userDocumentQuantityPage ---------------------------------------------------------
 *
 */
    //describe.skip('[Function: addDocsQuantity (UPDATE || CREATE)] #STANDARD- Run addDocsQuantity()', function() {
    //    it('should perform a query to find previous application data and populate the form to UPDATE, or leave blank to CREATE', function (done) {
    //
    //        /* Find a record to cause an update */
    //        UserDocumentCount.findAll(
    //            {
    //                where: {
    //                    application_id: standard_applicationID
    //                }
    //            }
    //        )
    //            .then(function (data) {
    //                if (selectedDocsCount.length>0) {
    //                    chai.assert.ok('A user document count was found, meaning the form will be populated with previous data and an UPDATE will be carried out');
    //                    UserDocumentCount.update(
    //                        {
    //                            application_id: standard_applicationID,
    //                            doc_count: 3, // random value selected as document count
    //                            price: 3 * 30 // number of documents multiplied by 30£
    //                        },
    //                        {
    //                            where: {
    //                                application_id: standard_applicationID
    //                            }
    //                        }
    //                    )
    //                        .then(done.bind(null, null), done);
    //                }
    //
    //                return null;
    //            });
    //
    //        /* Find no record to cause a create */
    //        UserDocumentCount.findAll(
    //            {
    //                where: {
    //                    application_id: 10000000
    //                }
    //            }
    //        )
    //            .then(function (data) {
    //                if (selectedDocsCount.length<1) {
    //                    chai.assert.ok('No user document counts were found, meaning the form will empty and a CREATE will be carried out');
    //                    UserDocumentCount.create({
    //                        application_id:req.session.appId,
    //                        doc_count: 3, // random value selected as document count
    //                        price: 3 * 30 // number of documents multiplied by 30£
    //                    })
    //                        .then(done.bind(null,null), done);
    //                }
    //
    //                return null;
    //            });
    //
    //        done();
    //
    //    })
    //});

    //describe.skip('[Function: addDocsQuantity (UPDATE || CREATE)] #ERRONOUS - Run addDocsQuantity()', function() {
    //    it('should perform a query to find previous application data to update/create, but will instead yield errors when attempting to UPDATE and CREATE', function (done) {
    //
    //        /* Find a record to cause an update */
    //        UserDocumentCount.findAll(
    //            {
    //                where: {
    //                    application_id: standard_applicationID
    //                }
    //            }
    //        )
    //            .then(function (data) {
    //                if (selectedDocsCount.length>0) {
    //                    chai.assert.ok('A user document count was found, meaning the form will be populated with previous data and an UPDATE will be carried out');
    //                    UserDocumentCount.update(
    //                        {
    //                            application_id: standard_applicationID,
    //                            doc_count: x, // invalid character
    //                            price: xx // invalid characters
    //                        },
    //                        {
    //                            where: {
    //                                application_id: standard_applicationID
    //                            }
    //                        }
    //                    )
    //                        .then(function() {
    //                            chai.assert.notOk('The insert data is invalid so errors should be yielded, so you should NOT see this message.');
    //                        })
    //                        .catch(SequelizeValidationError, function(error) {
    //                            chai.assert.ok('The update data is invalid, errors have been yielded. ', error);
    //                        });
    //                }
    //
    //                return null;
    //            });
    //
    //        /* Find no record to cause a create */
    //        UserDocumentCount.findAll(
    //            {
    //                where: {
    //                    application_id: standard_applicationID
    //                }
    //            }
    //        )
    //            .then(function (data) {
    //                if (selectedDocsCount.length<1) {
    //                    chai.assert.ok('No user document counts were found, meaning the form will empty and a CREATE will be carried out, but there insert data is invalid so errors should be yielded');
    //                    UserDocumentCount.create({
    //                        application_id: standard_applicationID,
    //                        doc_count: x, // invalid character
    //                        price: xx // invalid characters
    //                    })
    //                        .then(function() {
    //                            chai.assert.notOk('The insert data is invalid so errors should be yielded, so you should NOT see this message.');
    //                        })
    //                        .catch(SequelizeValidationError, function(error) {
    //                            chai.assert.ok('The insert data is invalid, errors have been yielded. ', error);
    //                        });
    //                }
    //
    //                return null;
    //            });
    //
    //        done();
    //
    //    })
    //});



/* FUNCTION: populateDocumentCountForm() -----------------------------------------------
*
*/
    //describe.skip('[Function: populateDocumentCountForm] #STANDARD- Run populateDocumentCountForm()', function() {
    //    it('should return the previously submitted UserDocumentCount data and passes it to the template to populate the form', function (done) {
    //        UserDocumentCount.findOne(
    //            {
    //                where: {
    //                    application_id: standard_applicationID
    //                }
    //            }
    //        )
    //            .then(done.bind(null, null), done);
    //    })
    //});



});
