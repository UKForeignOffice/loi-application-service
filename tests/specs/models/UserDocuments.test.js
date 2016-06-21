/**
 * Created by preciousr on 11/11/2015.
 */

var request = require('supertest');
var chai = require('chai');

describe('UserDocumentsModel', function() {

    describe('#Create', function () {
        it('should check that create function works', function (done) {
            UserDocuments.create({
                application_id:1,
                doc_id: 1,
                certified: false,
                this_doc_count:3

            })
                .then(function(created){
                    created.doc_id.should.equal(1);
                    done();
                    return null;
            });
        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            UserDocuments.find({where:{application_id:1}}).then(function(found){
                if (found) {
                    chai.assert.ok(found, 'Found user documents') ;
                }
                done();
                return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            UserDocuments.update({certified:true},{where:{application_id:1}}).then(function(){
                UserDocuments.find({where:{application_id:1}}).then(function(found){
                    found.certified.should.equal(true);
                    done();
                    return null;
                });
                return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            UserDocuments.destroy({where:{application_id:1}}).then(function(){
                UserDocuments.find({where:{application_id:1}})
                    .then(function(err, found){
                        (typeof found).should.equal('undefined');
                        done();
                        return null;
                    });
                return null;
                });
            });
        });


});