// Skipped because tests need postgres server to work
describe.skip('UsersBasicDetailsModel', function() {

    describe('#Create', function() {
        it('should check that create function works', function (done) {
            UsersBasicDetails.create({application_id: 1, first_name: 'John', last_name: 'Doe', telephone: '01904548245', has_email: true, email: 'myemail@email.com', confirm_email: 'myemail@email.com'})
                .then(function(results) {
                    results.first_name.should.equal('John');
                    done();
                    return null;
                });
            });
    });
    describe('#find()', function() {
        it('should check find function works', function (done) {
            UsersBasicDetails.find({where:{application_id: 1}})
                .then(function(found){
                    found.first_name.should.equal('John');
                    done();
                    return null;
                });
        });
    });

    describe('#update()', function() {
        it('should check update function works', function (done) {
            UsersBasicDetails.update({
                first_name: 'Jane',
                last_name: 'Doe',
                telephone: '078414721454',
                email: 'jane.doe@gmail.com'
            }, {
                where: {
                    application_id: 1
                }
            }).then(function(){
                UsersBasicDetails.find({where:{application_id: 1}})
                    .then(function(found){
                        found.first_name.should.equal('Jane');
                        done();
                        return null;
                    });
                return null;
            });
        });
    });
    describe('#Destroy',function(){
        it('should check that destroy function works', function(done){
            UsersBasicDetails.destroy({where:{application_id: 1}}).then(function (error){
                UsersBasicDetails.find({where:{application_id: 1}})
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