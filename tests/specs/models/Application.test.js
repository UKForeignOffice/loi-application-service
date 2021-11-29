/**
 * Created by preciousr on 11/11/2015.
 */
// Skipped because tests need postgres server to work
describe.skip('ApplicationModel', function() {
var applicationID;
    describe('#Create', function () {
        it('should check that create function works', function (done) {
            Application.create({
                serviceType: -1,
                all_info_correct: -1,
                feedback_consent: false
            })
                .then(function(created){
                created.should.not.equal(null);
                applicationID = created.application_id;
                done();
                return null;
            });

        });
    });

    describe('#Find', function () {
        it('should check that find function works', function (done) {
            Application.find({where:{application_id:applicationID}}).then(function(found){
                found.application_id.should.equal(applicationID);
                done();
                return null;
            });
        });
    });

    describe('#Update', function () {
        it('should check that update function works', function (done) {
            Application.update({submitted:true},{where:{application_id:applicationID}}).then(function(){
                Application.find({where:{application_id:applicationID}}).then(function(found){
                    found.submitted.should.equal('true');
                    done();
                    return null;
                });
                return null;
            });
        });
    });

    describe('#Destroy', function () {
        it('should check that destroy function works', function (done) {
            Application.destroy({where:{application_id:applicationID}}).then(function(){
                Application.find({where:{application_id:applicationID}})
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