/**
 * Created by preciousr on 11/11/2015.
 * Update by macmillana on 11/01/2016
 *
 * UsersBasicDetailsController----------------------------------------------------
 *  This controller has 2 functions populateBasicDetailsForm which is very simple and
 *  submitBasicDetails which is simple however it can be called in a number of different
 *  ways.
 *
 *
 */
var request = require('supertest');
var chai = require('chai');

describe.skip('UsersBasicDetailsController', function() {


    /**
     * Insert all relevent test data
     */
    //describe("Insert all relevent test data so that testing can be completed", function () {
    //    it('should insert all the relevent test data so that tests for each controller can be done without problems', function (done) {
    //
    //        before(function (done) {
    //            //Create application data
    //            Application.create({
    //                application_id: 100001,
    //                submitted: false,
    //                createdAt: "2016-01-01",
    //                updatedAt: "2016-01-01",
    //                serviceType: -1,
    //                unique_app_id: null,
    //                feedback_consent: null,
    //                application_reference: null,
    //                case_reference: null,
    //                user_id: 0,
    //                all_info_correct: false
    //            })
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test Application record created');
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            //Create User Details data
    //            UsersBasicDetails.create({
    //                first_name: "test firstname",
    //                last_name: "test lastname",
    //                telephone: "01234567890",
    //                email: "test@test.com",
    //                confirm_email: "test@test.com",
    //                updatedAt: "2016-01-05 16:07:30.257 +00:00",
    //                createdAt: "2016-01-05 16:07:30.257 +00:00",
    //                application_id: 100001
    //            })
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test User Details record created');
    //                }).catch(function (error) {
    //                    console.log(error);
    //                    error.should.be(null);
    //                });
    //
    //            //Create User Address Details data
    //            UsersAddressDetails.bulkCreate({
    //                    application_id: 100001,
    //                    full_name: "test return name 1",
    //                    postcode: "m3 6ar",
    //                    address_line1: "10 Angora Drive",
    //                    address_line2: "",
    //                    address_line3: "",
    //                    town: "Salford",
    //                    county: "Lancashire",
    //                    country: "United Kingdom",
    //                    type: "main",
    //                    updatedAt: "2016-01-05",
    //                    createdAt: "2016-01-05"
    //                },
    //                {
    //                    application_id: 100001,
    //                    full_name: "test return name 2",
    //                    postcode: "n12 7db",
    //                    address_line1: "10 Brook Meadow",
    //                    address_line2: "",
    //                    address_line3: "",
    //                    town: "London",
    //                    county: "Greater London",
    //                    country: "United Kingdom",
    //                    type: "alt",
    //                    updatedAt: "2016-01-05",
    //                    createdAt: "2016-01-05"
    //                }
    //            )
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test User Address Details records created');
    //                }).catch(function (error) {
    //                    console.log(error);
    //                    error.should.be(null);
    //                });
    //
    //            //Create User Documents data
    //            UserDocuments.create({
    //                application_id: 100001,
    //                doc_id: 196,
    //                user_doc_id: 1924,
    //                updatedAt: "2016-01-05",
    //                createdAt: "2016-01-05",
    //                certified: true
    //            })
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test User Documents record created');
    //                }).catch(function (error) {
    //                    console.log(error);
    //                    error.should.be(null);
    //                });
    //
    //            UserDocumentCount.create({
    //                doc_count: 1,
    //                application_id: 100001,
    //                createdAt: "2016-01-05",
    //                updatedAt: "2016-01-05",
    //                price: 30
    //            })
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test User Document Count record created');
    //                }).catch(function (error) {
    //                    console.log(error);
    //                    error.should.be(null);
    //                });
    //
    //            UserPostageDetails.create({
    //                postage_available_id: 5,
    //                application_id: 100001,
    //                createdAt: "2016-01-05",
    //                updatedAt: "2016-01-05"
    //            }).then(function (application) {
    //                chai.assert.ok(application, 'New Test User Postage Details record created');
    //            }).catch(function (error) {
    //                console.log(error);
    //                error.should.be(null);
    //            })
    //
    //            AdditionalApplicationInfo.create({
    //                special_instructions: "Test Special Instruction",
    //                user_ref: "Test User Reference",
    //                application_id: 100001,
    //                createdAt: "2016-01-08",
    //                updatedAt: "2016-01-08"
    //            })
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test Additional Application Info record created');
    //                }).catch(function (error) {
    //                    console.log(error);
    //                    error.should.be(null);
    //                });
    //
    //            ExportedApplicationData.create({
    //                application_id: 100001,
    //                application_type: "Standard",
    //                first_name: "test firstname",
    //                last_name: "test lastname",
    //                telephone: "01234567890",
    //                email: "test@test.com",
    //                doc_count: 1,
    //                special_instructions: "",
    //                user_ref: "Test Customer Reference Number",
    //                postage_return_title: "Pre-paid stamped, addressed, A4-sized envelope",
    //                postage_return_prive: 0.00,
    //                postage_send_title: "I will post my documents in the UK",
    //                postage_send_price: 0.00,
    //                main_address_line1: "10 Angora Drive",
    //                main_address_line2: "",
    //                main_address_line2: "",
    //                main_town: "Salford",
    //                main_county: "Lancashire",
    //                main_country: "United Kingdom",
    //                main_full_name: "test return name 1",
    //                alt_address_line1: "10 Brook Meadow",
    //                alt_address_line2: "",
    //                alt_address_line3: "",
    //                alt_town: "London",
    //                alt_county: "Greater London",
    //                alt_country: "United Kingdom",
    //                alt_full_name: "test return name 2",
    //                feedback_consent: false,
    //                total_docs_count_price: 30,
    //                unique_app_id: "A-16-111-0926-F9F0"
    //            })
    //                .then(function (application) {
    //                    chai.assert.ok(application, 'New Test Exported Data record created');
    //                }).catch(function (error) {
    //                    console.log(error);
    //                    error.should.be(null);
    //                });
    //
    //            done();
    //        });
    //        done();
    //    });
    //});



    /* SETUP -----------------------------------------------------------------------------
     *          For this test suite we need an application ID so we set up a new
     *          application record and hold the id in the variable standard_applicationID.
     */
    //describe.skip('#SETUP- Create application', function () {
    //    it('should check create a new application', function (done) {
    //        Application.create({
    //                serviceType: -1,
    //                all_info_correct: -1
    //            })
    //            .then(function(created){
    //                created.should.not.equal(null);
    //                standard_applicationID = created.application_id.toString();
    //                done();
    //            })
    //
    //    })
    //});

/* FUNCTION: populateBasicDetailsForm ---------------------------------------------------------
 *          Test that route works without errors meaning the page is found successfully
 */
    //describe.skip('[Function: populateBasicDetailsForm] #STANDARD- Run populateBasicDetailsForm()', function() {
    //    it('should correctly return successful headers', function (done) {
    //        request(sails.hooks.http.app)
    //            .post('/your-basic-details')
    //            .expect(200)
    //            .end(function(err,res){
    //
    //                if (err){
    //                    console.log(err)
    //                }
    //
    //                var header = res.res.headers;
    //
    //                res.res.connection._httpMessage.path.should.equal('/your-basic-details');
    //                done();
    //            })
    //    });
    //});

    /* FUNCTION: userBasicDetailsPage ---------------------------------------------------------
     *          Test to make sure a record is found or not found successfully for the current user.
     *
     */
    //describe.skip('[Function: userBasicDetailsPage] #STANDARD- Run userBasicDetailsPage()', function() {
    //    it('should correctly return successful headers', function (done) {
    //        request(sails.hooks.http.app)
    //            .post('/your-basic-details')
    //            .expect(200)
    //            .end(function(err,res){
    //                if (err){
    //                    console.log(err)
    //                }
    //
    //                var header = res.res.headers;
    //
    //                // Check the user detail table can be queried without yielding any errors
    //                UsersBasicDetails.findOne({where: {
    //                        application_id: standard_applicationID
    //                    }}
    //                )
    //                    .then(function(data) {
    //                        if(data==null) {
    //                            chai.assert.ok('Successfully checked to see if a user basic details record exists of current application id, a brand new record.');
    //                        } else {
    //                            chai.assert.ok('Successfully checked to see if a user basic details record exists of current application id, update to existing record.');
    //                        }
    //                    })
    //                    .catch( function(error) {
    //                        console.log(error);
    //                        chai.assert.notOk(error, 'There was an error.');
    //                    })
    //
    //                res.res.connection._httpMessage.path.should.equal('/your-basic-details');
    //                done();
    //            });
    //    });
    //});

/* FUNCTION: submitBasicDetails ---------------------------------------------------------
 *          This function is called in 2 different ways:
 *              #CREATE - from /your-address-details
 *                  -Standard Input
 *                  -Erroneous Inputs
 *
 *              TODO- Once the summary page is configured to work for incomplete applications test 2 will work correctly
 *              #UPDATE - from /modify-your-basic-details/success
 *                   -Standard Input
 *                  -Erroneous Inputs
 *
 *
 */
    //describe.skip('[Function: submitBasicDetails (CREATE)] #STANDARD- Run submitBasicDetails()', function() {
    //    it('should correctly create a users basic details', function (done) {
    //                UsersBasicDetails.create({
    //                    application_id: standard_applicationID,
    //                    first_name: "test firstname",
    //                    last_name: "test lastname",
    //                    telephone: "01234567890",
    //                    email: "test@testdomain.com",
    //                    confirm_email: "test@testdomain.com"
    //                })
    //                    .then(function () {
    //                        chai.assert.ok('Success', 'Successfully created a UserBasicDetails record for current user');
    //                    })
    //                    .catch(function (error) {
    //                        chai.assert.notOk('Fail', 'Failed to create a UserBasicDetails record for current user');
    //                    });
    //                done();
    //
    //    });
    //});

    //describe.skip('[Function: submitBasicDetails (CREATE)] #ERRONEOUS- Run submitBasicDetails()', function() {
    //    it('should correctly catch the error', function (done) {
    //
    //        UsersBasicDetails.create()
    //            .then( function() {
    //                console.log('     Test Failed! - Forcing Errors for the Create User Basic Detail record test failed');
    //                chai.assert.notOk('Fail', 'Validation failed as promise has landed in the "then" when it should have landed in the catch denoting an error.');
    //            })
    //            .catch( function(error) {
    //                console.log('     Test Passed! - Forcing Errors for the Create User Basic Detail record test passed');
    //                chai.assert.ok('Success', 'Successfully caused error messages to appear.');
    //                anErrorArrayToTest = error;
    //            })
    //
    //        done();
    //    })
    //});

    //describe('[Function: submitBasicDetails (UPDATE)] #STANDARD- Run submitBasicDetails()', function() {
    //    it('should correctly update a users basic details', function (done) {
    //                // based on the previous test, the findOne of a basic user detail has been tested,
    //                // therefore here we can test based on the assumption that a create or update is to be carried out
    //                UsersBasicDetails.update(
    //                    {
    //                        first_name: "test firstname",
    //                        last_name: "test lastname",
    //                        telephone: "01234567890",
    //                        email: "test@testdomain.com",
    //                        confirm_email: "test@testdomain.com"
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID
    //                        }
    //                    }
    //                ).then(function () {
    //                        console.log('     Test Passed! - Update User Basic Detail record test passed');
    //                        chai.assert.ok('Success', 'Successfully updated the UserBasicDetails record for current user');
    //                    })
    //                    .catch(function(error) {
    //                        console.log('     Test Failed! - Update User Basic Detail record test failed');
    //                        chai.assert.notOk('Fail', 'Failed to update the UserBasicDetails record for current user');
    //                    });
    //
    //                done();
    //    });
    //});

    describe.skip('[Function: submitBasicDetails (UPDATE)] #ERRONEOUS- Run submitBasicDetails()', function() {
        it('should correctly catch the error', function (done) {

            UsersBasicDetails.update({
                first_name: "",
                last_name: "",
                telephone: "",
                email: "",
                confirm_email: ""
            },{where:{}})
                .then( function(data) {
                    console.log('     Test Failed! - Forcing Errors for the Update User Basic Detail record test failed');
                    chai.assert.isNotOk(data, 'Validation failed as promise has landed in the "then" when it should have landed in the catch denoting an error.');
                })
                .catch( function(error) {
                    // If the error IS a validation error
                    if (JSON.stringify(error).indexOf('Validation error')>0) {
                        console.log('     Test Passed! - Forcing Errors for the Update User Basic Detail record test passed');
                        chai.assert.isOk(error, 'Successfully caused error messages to appear.');
                    }

                });

            done();
        });
    });

    //describe.skip('[Function: buildErrorArrays] #ERRONEOUS- Run buildErrorArrays()', function() {
    //    it('should generate correct error array structure to be passed to the template', function (done) {
    //
    //        var erroneousFields = [];
    //
    //        // Cause validation to fail to push items into erronousFields array
    //        if ("first_name" !== '') { erroneousFields.push('first_name') }
    //        if ("last_name" !== '') { erroneousFields.push('last_name') }
    //        if ("telephone" !== '') { erroneousFields.push('telephone') }
    //        if ("email" !== '') { erroneousFields.push('email') }
    //        if ("confirm_email" !== '') { erroneousFields.push('confirm_email') }
    //
    //        erroneousFields.length.should.equal(5);
    //
    //        done();
    //    });
    //});


    /**
     * Remove all test data
     */
    //describe('Remove all inserted test data after all tests have been ran', function () {
    //    it('should remove all inserted test data from the database', function (done) {
    //        after(function (done) {
    //            //Create application data
    //            Application.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            //Create User Details data
    //            UsersBasicDetails.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            //Create User Address Details data
    //            UsersAddressDetails.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            //Create User Documents data
    //            UserDocuments.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            UserDocumentCount.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            UserPostageDetails.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            AdditionalApplicationInfo.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            ExportedApplicationData.destroy({where: {application_id: 100001}})
    //                .then(function (application) {
    //                    //application_id.should.be(null);
    //                }).catch(function (error) {
    //                    //error.should.be(null);
    //                    console.log(error)
    //                });
    //
    //            done();
    //        });
    //        done();
    //    });
    //})
});