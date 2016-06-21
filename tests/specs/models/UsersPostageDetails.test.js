/**
 * Created by preciousr on 11/11/2015.
 */
describe('UserPostageDetailsModel', function() {

    describe('#Create', function () {
        it('should check that create function works', function (done) {
            UserPostageDetails.create({application_id:1,postage_available_id: 0,id: 0})
                .then(function(created){
                    created.postage_available_id.should.equal(0);
                    done();
                    return null;
            });
        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            UserPostageDetails.find({where:{application_id:1}}).then(function(found){
                found.postage_available_id.should.equal(0);
                done();
                return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            UserPostageDetails.update({postage_available_id:1},{where:{application_id:1}}).then(function(){
                UserPostageDetails.find({where:{application_id:1}}).then(function(found){
                    found.postage_available_id.should.equal(1);
                    done();
                    return null;
                });
                return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            UserPostageDetails.destroy({where:{application_id:1}}).then(function(){
                UserPostageDetails.find({where:{application_id:1}})
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