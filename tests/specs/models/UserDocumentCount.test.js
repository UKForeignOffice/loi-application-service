/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('UserDocumentCount', function() {
    describe('#Create', function () {
        it('should check that create function works', function (done) {
            UserDocumentCount.create({application_id:0, doc_count:3,country:'UK', price: 30})
                .then(function(created){
                created.should.not.equal(null);
                done();
                    return null;
            });

        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            UserDocumentCount.find({where:{application_id:0}})
                .then(function(found){
                found.doc_count.should.equal(3);
                done();
                    return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            UserDocumentCount.update({doc_count:4},{where:{application_id:0}})
                .then(function(){
                UserDocumentCount.find({where:{application_id:0}})
                    .then(function(found){
                    found.doc_count.should.equal(4);
                    done();
                        return null;
                });
                    return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            UserDocumentCount.destroy({where:{application_id:0}}).then(function(){
                UserDocumentCount.find({where:{application_id:0}})
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