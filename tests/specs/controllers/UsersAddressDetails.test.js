/**
 * Created by preciousr on 11/11/2015.
 *
 * UserAddressDetailsController----------------------------------------------------
 *
 *
 */
var request = require('supertest');
var chai = require('chai');

describe('UserAddressDetailsController', function() {



    /* FUNCTION: userAddressDetailsPage ---------------------------------------------------------
     * Test to find the route, find the method and render the address details form
     *
     */
    //describe.skip('[Function: userAddressDetailsPage] #STANDARD- Run userAddressDetailsPage()', function () {
    //    it('should find route and render user address details form', function (done) {
    //        console.log('yo you yo ', standard_applicationID)
    //        request(sails.hooks.http.app)
    //            .post('/your-address-details')
    //            .expect(200)
    //            .end(function (err, res) {
    //                if (err) {
    //                    console.log(err)
    //                }
    //
    //                var header = res.res.headers;
    //
    //                UsersAddressDetails.findOne({
    //                        where: {
    //                            application_id: standard_applicationID
    //                        }
    //                    }
    //                )
    //                    .then(function() {
    //                        done();
    //
    //                        return null;
    //                    })
    //
    //
    //                res.res.connection._httpMessage.path.should.equal('/your-address-details');
    //
    //            });
    //    })
    //});


    /* FUNCTION: submitAddressDetails() ---------------------------------------------------------
     * Test to submit the address details
     * several outcomes. See Key below.
     *  0. main submitAddressDetails method, this decides which to do of the below.
     *  1. (createNewAddressDetails) create new single address
     *  2. (bulkCreateMainAndAltAddress) create new main, create new alt addresses
     *  3. (destroyThenUpdateExistingAddressDetails) update main, remove (destroy) alt addresses
     *  4. (updateMainUpdateAltAddress) update main, update alt addresses
     *  5. (updateMainCreateAltAddress) update main, create alt address
     *
     */
    //describe.skip('[Function: submitAddressDetails] #STANDARD- Run submitAddressDetails(0)', function () {
    //    it('should return successful test headers', function (done) {
    //        request(sails.hooks.http.app)
    //            .post('/your-address-details')
    //            .expect(200)
    //            .end(function (err, res) {
    //                if (err) {
    //                    console.log(err)
    //                }
    //
    //                var header = res.res.headers;
    //
    //                UsersAddressDetails.findOne({
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'main'
    //                        }
    //                    }
    //                )
    //                    .then(function (data) {
    //                        chai.assert.ok('Success', 'User Address Details query had no errors');
    //                        return null;
    //                    })
    //                    .catch(function (error) {
    //                        chai.assert.notOk('Fail', 'User Address Details query had errors');
    //                        console.log(error);
    //                        return null;
    //                    });
    //
    //
    //                UsersAddressDetails.findAll(
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID
    //                        }
    //                    }
    //                )
    //                    .then(function() {
    //                        done();
    //
    //                        return null;
    //                    });
    //            });
    //    })
    //});
    //
    //describe.skip('[Function: submitAddressDetails] #STANDARD- Run submitAddressDetails(createNewAddressDetails)', function () {
    //    it('should successfully create a single new main address', function (done) {
    //
    //        UsersAddressDetails.create({
    //            application_id: standard_applicationID,
    //            full_name: "test full name",
    //            postcode: "testPcde",
    //            address_line1: "test address line 1",
    //            address_line2: "",
    //            address_line3: "",
    //            town: "test town",
    //            county: "test county",
    //            country: "test country",
    //            type: 'main'
    //        })
    //            .then(function() {
    //                done();
    //                return null;
    //            });
    //    })
    //});
    //
    //describe.skip('[Function: submitAddressDetails] #STANDARD- Run submitAddressDetails(bulkCreateMainAndAltAddress)', function () {
    //    it('should successfully bulkCreate a main and alt address', function (done) {
    //
    //        UsersAddressDetails.bulkCreate([
    //            {
    //                application_id: standard_applicationID,
    //                full_name: "TEST DATA1",
    //                postcode: "TEST DATA",
    //                address_line1: "TEST DATA1",
    //                address_line2: "",
    //                address_line3: "",
    //                town: "TEST DATA1",
    //                county: "TEST DATA1",
    //                country: "TEST DATA1",
    //                type: 'main'
    //            },
    //            {
    //                application_id: standard_applicationID,
    //                full_name: "TEST DATA2",
    //                postcode: "TEST DATA2",
    //                address_line1: "TEST DATA2",
    //                address_line2: "",
    //                address_line3: "",
    //                town: "TEST DATA2",
    //                county: "TEST DATA2",
    //                country: "TEST DATA2",
    //                type: 'alt'
    //            }], {
    //            validate: true
    //        })
    //            .then(function() {
    //                done();
    //                return null;
    //            });
    //
    //    })
    //});
    //
    //describe.skip('[Function: submitAddressDetails] #STANDARD- Run submitAddressDetails(destroyThenUpdateExistingAddressDetails)', function () {
    //    it('should successfully destroy existing alt address and update the current main address', function (done) {
    //
    //        UsersAddressDetails.destroy(
    //            {
    //                where: {
    //                    application_id: standard_applicationID,
    //                    type: 'alt'
    //                }
    //            }
    //        )
    //            .then(function () {
    //                chai.assert.ok('Success', 'Alternative address for test application id ' + standard_applicationID + ' Destroyed');
    //                return null;
    //            })
    //            .catch(function (error) {
    //            chai.assert.notOk('Fail', 'Failed to destroy alternative address');
    //                return null;
    //        });
    //
    //        UsersAddressDetails.update(
    //            {
    //                full_name: "TEST DATA",
    //                postcode: "TEST DATA",
    //                address_line1: "TEST DATA",
    //                address_line2: "",
    //                address_line3: "",
    //                town: "TEST DATA",
    //                county: "TEST DATA",
    //                country: "TEST DATA"
    //            },
    //            {
    //                where: {
    //                    application_id: standard_applicationID,
    //                    type: 'main'
    //                }
    //            })
    //            .then(function() {
    //                done();
    //                return null;
    //            })
    //    })
    //});
    //
    //describe.skip('[Function: submitAddressDetails] #STANDARD- Run submitAddressDetails(updateMainUpdateAltAddress)', function () {
    //    it('should successfully update the main address and update the alt address', function (done) {
    //
    //        async.waterfall([
    //            function (callback) {
    //                UsersAddressDetails.update(
    //                    {
    //                        full_name: "TEST DATA",
    //                        postcode: "TEST DATA",
    //                        address_line1: "TEST DATA",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "TEST DATA",
    //                        county: "TEST DATA",
    //                        country: "TEST DATA"
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'main'
    //                        }
    //                    }
    //                ).then(function (usersaddressdetails) {
    //                        chai.assert.ok(usersaddressdetails, 'Successfully updated the Main address details');
    //                        callback();
    //                        return null;
    //                    })
    //            },
    //
    //            function (callback) {
    //                UsersAddressDetails.update(
    //                    {
    //                        full_name: "TEST DATA",
    //                        postcode: "TEST DATA",
    //                        address_line1: "TEST DATA",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "TEST DATA",
    //                        county: "TEST DATA",
    //                        country: "TEST DATA"
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'alt'
    //                        }
    //                    }).then(function (usersaddressdetails) {
    //                        chai.assert.ok(usersaddressdetails, 'Successfully updated the Alt address details');
    //                        callback();
    //                        return null;
    //                    })
    //            }
    //        ], done())
    //    })
    //});
    //
    //describe.skip('[Function: submitAddressDetails] #STANDARD- Run submitAddressDetails(updateMainCreateAltAddress)', function () {
    //    it('should successfully update the main address and create a new alt address', function (done) {
    //
    //        async.waterfall([
    //            function (callback) {
    //                UsersAddressDetails.update(
    //                    {
    //                        full_name: "TEST DATA",
    //                        postcode: "TEST DATA",
    //                        address_line1: "TEST DATA",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "TEST DATA",
    //                        county: "TEST DATA",
    //                        country: "TEST DATA"
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'main'
    //                        }
    //                    }
    //                ).then(function () {
    //                        chai.assert.ok('Successfully updated the main address details');
    //                        callback();
    //                        return null;
    //                    })
    //            },
    //
    //            function (callback) {
    //                UsersAddressDetails.create(
    //                    {
    //                        application_id: standard_applicationID,
    //                        full_name: "TEST DATA",
    //                        postcode: "TEST DATA",
    //                        address_line1: "TEST DATA",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "TEST DATA",
    //                        county: "TEST DATA",
    //                        country: "TEST DATA",
    //                        type: 'alt'
    //                    }
    //                ).then(function () {
    //                        chai.assert.ok('Successfully created an alt address');
    //                        callback();
    //                        return null;
    //                    })
    //            }
    //        ], done());
    //    })
    //});
    //
    ///*-----------------------------------------------------------------------------------------------------------*/
    //
    //describe.skip('[Function: submitAddressDetails] #ERRONEOUS- Run submitAddressDetails(createNewAddressDetails)', function () {
    //    it('should successfully force an error for creating a single new main address', function (done) {
    //
    //        UsersAddressDetails.create({
    //            application_id: standard_applicationID,
    //            full_name: "",
    //            postcode: "",
    //            address_line1: "",
    //            address_line2: "",
    //            address_line3: "",
    //            town: "",
    //            county: "",
    //            country: "",
    //            type: 'main'
    //        })
    //        .then(done.bind(null, null), done);
    //
    //    })
    //});
    //describe.skip('[Function: submitAddressDetails] #ERRONEOUS- Run submitAddressDetails(bulkCreateMainAndAltAddress)', function () {
    //    it('should successfully force an error for bulkCreating a main and alt address', function (done) {
    //
    //        UsersAddressDetails.bulkCreate([
    //            {
    //                application_id: standard_applicationID,
    //                full_name: "",
    //                postcode: "",
    //                address_line1: "",
    //                address_line2: "",
    //                address_line3: "",
    //                town: "",
    //                county: "",
    //                country: "",
    //                type: 'main'
    //            },
    //            {
    //                application_id: standard_applicationID,
    //                full_name: "",
    //                postcode: "",
    //                address_line1: "",
    //                address_line2: "",
    //                address_line3: "",
    //                town: "",
    //                county: "",
    //                country: "",
    //                type: 'alt'
    //            }], {
    //            validate: true
    //        })
    //            .then(done.bind(null, null), done);
    //
    //
    //    })
    //});
    //describe.skip('[Function: submitAddressDetails] #ERRONEOUS- Run submitAddressDetails(destroyThenUpdateExistingAddressDetails)', function () {
    //    it('should update current main address [destroy cannot be tested]', function (done) {
    //
    //        UsersAddressDetails.update(
    //            {
    //                full_name: "",
    //                postcode: "",
    //                address_line1: "",
    //                address_line2: "",
    //                address_line3: "",
    //                town: "",
    //                county: "",
    //                country: ""
    //            },
    //            {
    //                where: {
    //                    application_id: standard_applicationID,
    //                    type: 'main'
    //                }
    //            })
    //            .then(done.bind(null, null), done);
    //    })
    //});
    //describe.skip('[Function: submitAddressDetails] #ERRONEOUS- Run submitAddressDetails(updateMainUpdateAltAddress)', function () {
    //    it('should update main address and update alt address', function (done) {
    //        async.waterfall([
    //            function (callback) {
    //                UsersAddressDetails.update(
    //                    {
    //                        full_name: "",
    //                        postcode: "",
    //                        address_line1: "",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "",
    //                        county: "",
    //                        country: ""
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'main'
    //                        }
    //                    }
    //                ).then(function () {
    //                        console.log('     Test Failed! - Forcing Errors for the update main address and update alt address failed');
    //                        chai.assert.notOk('Fail', 'Validation failed as promise has landed in the "then" when it should have landed in the catch denoting an error.');
    //                        callback();
    //                        return null;
    //                    })
    //                    .catch(function (error) {
    //                        // If the error IS a validation error
    //                        if (JSON.stringify(error).indexOf('Validation error') > 0) {
    //                            console.log('     Test Passed! - Forcing Errors for the update main address and update alt address passed');
    //                            chai.assert.ok('Success', 'Successfully caused error messages to appear.');
    //                            return null;
    //                        }
    //
    //                    })
    //            },
    //
    //            function (callback) {
    //                UsersAddressDetails.update(
    //                    {
    //                        full_name: "",
    //                        postcode: "",
    //                        address_line1: "",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "",
    //                        county: "",
    //                        country: ""
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'alt'
    //                        }
    //                    }).then(function () {
    //                        console.log('     Test Failed! - Forcing Errors for the update main address and update alt address failed');
    //                        chai.assert.notOk('Fail', 'Validation failed as promise has landed in the "then" when it should have landed in the catch denoting an error.');
    //                        callback();
    //                        return null;
    //                    })
    //                    .catch(function (error) {
    //                        // If the error IS a validation error
    //                        if (JSON.stringify(error).indexOf('Validation error') > 0) {
    //                            console.log('     Test Passed! - Forcing Errors for the update main address and update alt address passed');
    //                            chai.assert.ok('Success', 'Successfully caused error messages to appear.');
    //                            return null;
    //                        }
    //
    //                    })
    //            }
    //        ], done())
    //    })
    //});
    //describe.skip('[Function: submitAddressDetails] #ERRONEOUS- Run submitAddressDetails(updateMainCreateAltAddress)', function () {
    //    it('should return erroneous test headers', function (done) {
    //        async.waterfall([
    //            function (callback) {
    //                UsersAddressDetails.update(
    //                    {
    //                        full_name: "",
    //                        postcode: "",
    //                        address_line1: "",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "",
    //                        county: "",
    //                        country: ""
    //                    },
    //                    {
    //                        where: {
    //                            application_id: standard_applicationID,
    //                            type: 'main'
    //                        }
    //                    }
    //                ).then(function () {
    //                        console.log('     Test Failed! - Forcing Errors for the update main address and create alt address failed');
    //                        chai.assert.notOk('Fail', 'Validation failed as promise has landed in the "then" when it should have landed in the catch denoting an error.');
    //                        callback();
    //                        return null;
    //                    })
    //                    .catch(function (error) {
    //                        // If the error IS a validation error
    //                        if (JSON.stringify(error).indexOf('Validation error') > 0) {
    //                            console.log('     Test Passed! - Forcing Errors for the update main address and create alt address passed');
    //                            chai.assert.ok('Success', 'Successfully caused error messages to appear.');
    //                            return null;
    //                        }
    //
    //                    })
    //            },
    //
    //            function (callback) {
    //                UsersAddressDetails.create(
    //                    {
    //                        application_id: standard_applicationID,
    //                        full_name: "",
    //                        postcode: "",
    //                        address_line1: "",
    //                        address_line2: "",
    //                        address_line3: "",
    //                        town: "",
    //                        county: "",
    //                        country: "",
    //                        type: 'alt'
    //                    }
    //                ).then(function () {
    //                        console.log('     Test Failed! - Forcing Errors for the update main address and create alt address failed');
    //                        chai.assert.notOk('Fail', 'Validation failed as promise has landed in the "then" when it should have landed in the catch denoting an error.');
    //                        callback();
    //                        return null;
    //                    })
    //                    .catch(function (error) {
    //                        // If the error IS a validation error
    //                        if (JSON.stringify(error).indexOf('Validation error') > 0) {
    //                            console.log('     Test Passed! - Forcing Errors for the update main address and create alt address passed');
    //                            chai.assert.ok('Success', 'Successfully caused error messages to appear.');
    //                            return null;
    //                        }
    //
    //                    })
    //            }
    //        ], done());
    //    })
    //});
    //
    ///* FUNCTION: populateAddressDetailsForm ---------------------------------------------------------
    // *          We test this with the standard input.
    // */
    //describe.skip('[Function: populateAddressDetailsForm] #STANDARD- Run populateAddressDetailsForm()', function () {
    //    it('should correctly return successful headers of populateAddressDetailsForm', function (done) {
    //
    //        UsersAddressDetails.findAll(
    //            {
    //                where: {
    //                    application_id: standard_applicationID
    //                }
    //            }
    //        )
    //            .then(function (data) {
    //                var dataValues = [];
    //                //Fixes address swapping bug
    //                var main = 0, alt = 1;
    //
    //                if (data[0].dataValues.type == 'alt') {
    //                    main = 1;
    //                    alt = 0;
    //                }
    //
    //                dataValues.push([{
    //                    full_name: data[main].dataValues.full_name !== '' ? data[main].dataValues.full_name : "",
    //                    postcode: data[main].dataValues.postcode !== '' ? data[main].dataValues.postcode : "",
    //                    address_line1: data[main].dataValues.address_line1 !== '' ? data[main].dataValues.address_line1 : "",
    //                    address_line2: data[main].dataValues.address_line2 !== '' ? data[main].dataValues.address_line2 : "",
    //                    address_line3: data[main].dataValues.address_line3 !== '' ? data[main].dataValues.address_line3 : "",
    //                    town: data[main].dataValues.town !== '' ? data[main].dataValues.town : "",
    //                    county: data[main].dataValues.county !== '' ? data[main].dataValues.county : "",
    //                    country: data[main].dataValues.country !== '' ? data[main].dataValues.country : ""
    //                }, {
    //                    alt_full_name: data[alt] && data[alt].dataValues.full_name !== '' ? data[alt].dataValues.full_name : "",
    //                    alt_postcode: data[alt] && data[alt].dataValues.postcode !== '' ? data[alt].dataValues.postcode : "",
    //                    alt_address_line1: data[alt] && data[alt].dataValues.address_line1 !== '' ? data[alt].dataValues.address_line1 : "",
    //                    alt_address_line2: data[alt] && data[alt].dataValues.address_line2 !== '' ? data[alt].dataValues.address_line2 : "",
    //                    alt_address_line3: data[alt] && data[alt].dataValues.address_line3 !== '' ? data[alt].dataValues.address_line3 : "",
    //                    alt_town: data[alt] && data[alt].dataValues.town !== '' ? data[alt].dataValues.town : "",
    //                    alt_county: data[alt] && data[alt].dataValues.county !== '' ? data[alt].dataValues.county : "",
    //                    alt_country: data[alt] && data[alt].dataValues.country !== '' ? data[alt].dataValues.country : ""
    //                }]);
    //
    //                dataValues.length.should.be.above(0);
    //
    //                done();
    //            });
    //    });
    //
    //});
});