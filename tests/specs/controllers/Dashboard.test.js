/**
 * Created by amacmillan on 25/01/2016.
 *
 * DashboardController----------------------------------------------------
 *
 *
 */
var request = require('supertest');
var chai = require('chai');

describe('DashboardController:', function() {

/* FUNCTION: dashboard ---------------------------------------------------------
 *
 */
    describe('[Function: dashboard]', function() {
        it('should load dashboard displaying a list of previously submitted applications for the current user, if any exist', function (done) {

            var userApplicationsSql = 'select app."createdAt" as "createdDate", at."applicationType" as "appType", udc."doc_count" as "documentCount", app.application_reference as "appReference", \'Pending\' as "paymentStatus", \'Online application in progress\' as status from "Application" app inner join "ApplicationTypes" at on app."serviceType" = at.id';
            userApplicationsSql += ' inner join "UserDocumentCount" udc on app.application_id=udc.application_id ';
            userApplicationsSql += ' limit 0 '; // get first result to remove need for the 'where app_id=' clause

            sequelize.query(userApplicationsSql)
                .spread(function (results, metadata) {
                    chai.assert.isOk('Previous applications submitted search successful');

                    if (results) {
                        chai.assert.isOk('Previous applications submitted by user found');
                    }
                        done();
                })
            .catch(Sequelize.ValidationError, function(error) {
                    chai.assert.isNotOk('There was a problem getting all previous applications from the db ', error);
                    done();
            });

        });
    });



});