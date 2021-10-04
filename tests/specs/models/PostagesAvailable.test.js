/**
 * Created by preciousr on 11/11/2015.
 */
describe.skip('PostagesAvailable', function() {
    var id;
    describe.skip('#Create', function () {
        it('should check that create function works', function (done) {
            PostagesAvailable.create({id:0,title:'Hello',price:5.5,type:'TEST'})
                .then(function(created){
                created.should.not.equal(null);
                    id=created.id;
                done();
                    return null;
            });

        });
    });

    //describe('#Find', function () {
    //    it('should check that find function works', function (done) {
    //        PostagesAvailable.find({where:{id:id}})
    //            .then(function(found){
    //            found.price.should.equal(5.5);
    //            done();
    //                return null;
    //        })
    //    })
    //});
    //
    //describe('#Update', function () {
    //    it('should check that update function works', function (done) {
    //        PostagesAvailable.update({price:4},{where:{id:id}})
    //            .then(function(){
    //            PostagesAvailable.find({where:{id:id}})
    //                .then(function(found){
    //                found.price.should.equal(4);
    //                done();
    //                    return null;
    //            });
    //            return null;
    //        })
    //    })
    //});
    //
    //describe('#Destroy', function () {
    //    it('should check that destroy function works', function (done) {
    //        PostagesAvailable.destroy({where:{id:id}}).then(function(){
    //            PostagesAvailable.find({where:{id:id}})
    //                .then(function(err, found){
    //                    (typeof found).should.equal('undefined');
    //                    done();
    //                    return null;
    //                })
    //            return null;
    //            })
    //        })
    //    })


});