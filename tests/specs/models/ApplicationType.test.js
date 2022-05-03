/**
 * Created by preciousr on 11/11/2015.
 */
describe.skip('ApplicationTypeModel', function() {

    describe('#Create', function () {
        it('should check that create function works', function (done) {
            ApplicationType.create({id:0,applicationType:'Test', createdAt: null, updatedAt: null})
                .then(function(created){
                created.should.not.equal(null);
                done();
                return null;
            })
                .catch(function(error) {
                    done();
                });

        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            ApplicationType.findOne({where:{id:0}})
                .then(function(found){
                found.applicationType.should.equal('Test');
                done();
                return null;
            })
                .catch(function(error) {
                    done();
                });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            ApplicationType.update({applicationType:'UNIT TEST'},{where:{id:0}})
                .then(function(){
                ApplicationType.findOne({where:{id:0}})
                    .then(function(found){
                    found.applicationType.should.equal('UNIT TEST');
                    done();
                    return null;
                })
                .catch(function(error) {
                    done();
                });
                return null;
            })
                .catch(function(error) {
                    done();
                });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            ApplicationType.destroy({where:{id:0}}).then(function(){
                ApplicationType.findOne({where:{id:0}})
                    .then(function(err, found){
                        (typeof found).should.equal('undefined');
                        done();
                        return null;
                    });
                return null;
                })
                .catch(function(error) {
                    done();
                });
            });
        });


});
