/**
 * Created by preciousr on 11/11/2015.
 */
describe('AvailableDocumentsModel', function() {
    describe('#Create', function () {
        it('should check that create function works', function (done) {
            AvailableDocuments.create({doc_id:999, doc_title:'Birth Certificate', doc_type_id:1, html_id:'1'})
                .then(function(created){
                created.should.not.equal(null);
                done();
                    return null;
            });

        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            AvailableDocuments.find({where:{ doc_type_id:'1', html_id:'1'}})
                .then(function(found){
                found.doc_title.should.equal('Birth Certificate');
                done();
                    return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            AvailableDocuments.update({doc_title:'Doctors Note'},{where:{ doc_type_id:'1', html_id:'1'}})
                .then(function(){
                AvailableDocuments.find({where:{ doc_type_id:'1', html_id:'1'}})
                    .then(function(found){
                        found.doc_title.should.equal('Doctors Note');
                        done();
                    return null;
                });
                    return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            AvailableDocuments.destroy({where:{ doc_type_id:'1', html_id:'1'}}).then(function(){
                AvailableDocuments.find({where:{ doc_type_id:'1', html_id:'1'}})
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