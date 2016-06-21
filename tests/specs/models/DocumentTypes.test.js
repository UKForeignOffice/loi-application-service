/**
 * Created by preciousr on 11/11/2015.
 */
describe('DocumentTypes', function() {

    describe('#Create', function () {
        it('should check that create function works', function (done) {
            DocumentTypes.create({doc_type_id:0,doc_type:'Test',doc_type_title:'TEST'})
                .then(function(created){
                created.should.not.equal(null);
                done();
                    return null;
            });

        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            DocumentTypes.find({where:{doc_type_id:0}})
                .then(function(found){
                found.doc_type_title.should.equal('TEST');
                done();
                    return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            DocumentTypes.update({doc_type_title:'UNIT TEST'},{where:{doc_type_id:0}})
                .then(function(){
                DocumentTypes.find({where:{doc_type_id:0}})
                    .then(function(found){
                    found.doc_type_title.should.equal('UNIT TEST');
                    done();
                        return null;
                });
                    return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            DocumentTypes.destroy({where:{doc_type_id:0}}).then(function(){
                DocumentTypes.find({where:{doc_type_id:0}})
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