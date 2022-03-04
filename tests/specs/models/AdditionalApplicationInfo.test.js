/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('AdditionalApplicationInfoModel', function() {

    describe('#Create', function () {
        it('should check that create function works', function (done) {
            AdditionalApplicationInfo.create({application_id:0, user_ref:'3',special_instructions:'TEST'})
                .then(function(created){
                created.should.not.equal(null);
                done();
                return null;
            });

        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            AdditionalApplicationInfo.findOne({where:{application_id:0}})
                .then(function(found){
                    found.user_ref.should.equal('3');
                    done();
                    return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            AdditionalApplicationInfo.update({user_ref:'4'},{where:{application_id:0}})
                .then(function(){
                    AdditionalApplicationInfo.findOne({where:{application_id:0}})
                        .then(function(found){
                        found.user_ref.should.equal('4');
                        done();
                            return null;
                    });

                    return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            AdditionalApplicationInfo.destroy({where:{application_id:0}}).then(function(){
                AdditionalApplicationInfo.findOne({where:{application_id:0}})
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
