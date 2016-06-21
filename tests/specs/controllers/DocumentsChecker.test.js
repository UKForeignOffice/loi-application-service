/**
 * Created by preciousr on 11/11/2015.
 *
 * ApplicationTypeController----------------------------------------------------
 *
 *
 */
var request = require('supertest');
var chai = require('chai');
var sinon = require('sinon');
var session = require('supertest-session');
var testSession = session('test');
var fs = require('fs');

describe('DocumentsCheckerController:', function() {

    describe.skip('[FUNCTION: docSelectorStart()]', function () {
       it('should find the document selector start page tempalte and render it. ', function (done) {
           // reset selectedDocs array
           testSession.selectedDocuments = {
               totalDocCount: 0,
               documents: []
           };

           var fs = require('fs');
           //TODO:: fix this so relative path can be used
           fs.stat('views/documentChecker/documentsCheckerStart.ejs', function(err, stat) {
               if (err === null) {
                   chai.assert.isOk(stat, 'Successfully found documentsCheckerStart template');
                   done();
               } else {
                   chai.assert.isNotOk(err, 'Failed to find documentsCheckerStart template');
                   done(err);
               }
           });

       });

    });


    describe.skip('[Function: docsSelector()]', function() {
       it('should successfully find the doc selector route', function (done) {
           request(sails.hooks.http.app)
               .post('/select-documents')
               .send({appId:1001})
               .expect(200)
               .end(function(err,res){
                   if (err){
                       console.log(err);
                   }

                   res.res.connection._httpMessage.path.should.equal('/select-documents');

                   done();
               });
       });

       it('should find the doc selector page template and render it. ', function (done) {


           //TODO:: fix this so relative path can be used
           fs.stat('views/documentChecker/documentsCheckerDocsSelector.ejs', function(err, stat) {
               if (err === null) {
                   chai.assert.isOk(stat, 'Successfully found documentsCheckerDocsSelector template');
                   done();
               } else {
                   chai.assert.isNotOk(err, 'Failed to find documentsCheckerDocsSelector template');
                   done();
               }
           });

       });
    });



    describe.skip('[Function: docsSearch()]', function() {
       it('should render the document search view template',function(done) {
           var fs = require('fs');
            //TODO:: fix this so relative path can be used
            fs.stat('views/documentChecker/documentsCheckerSearch.ejs', function(err, stat) {
                if (err === null) {
                    chai.assert.isOk(stat, 'Successfully found documentsCheckerSearch template');
                    done();
                } else {
                    chai.assert.isNotOk(err, 'Failed to find documentsCheckerSearch template');
                    done();
                }
            });
       });
    });



    describe.skip('[Function: addSelectedDoc()]', function() {
       it('should find the selected-documents route', function(done){
           request(sails.hooks.http.app)
           .send({application_id: 1001})
           .post('/select-documents')
           .expect(302)
           .end(function (err, res) {
               if (err) {
                   console.log(err);
               }
               var header = res.res.headers;
               res.res.connection._httpMessage.path.should.equal('/select-documents');
           });
       });

       it('should find the a-to-z-document-listing route', function(done) {
           request(sails.hooks.http.app)
           .post('/a-to-z-document-listing')
           .expect(302)
           .end(function (err, res) {
               if (err) {
                   console.log(err);
               }
               var header = res.res.headers;
               res.res.connection._httpMessage.path.should.equal('/a-to-z-document-listing');
           });
       });
    });


    describe.skip('[Function: addSelectedDoc()]', function() {
       it('should find the selected-documents route', function(done){
           request(sails.hooks.http.app)
           .post('/select-documents')
           .expect(302)
           .end(function (err, res) {
               if (err) {
                   console.log(err);
               }
               var header = res.res.headers;
               res.res.connection._httpMessage.path.should.equal('/select-documents');
           });
       });

       it('should find the a-to-z-document-listing route', function(done) {
           request(sails.hooks.http.app)
           .post('/a-to-z-document-listing')
           .expect(302)
           .end(function (err, res) {
               if (err) {
                   console.log(err);
               }
               var header = res.res.headers;
               res.res.connection._httpMessage.path.should.equal('/a-to-z-document-listing');
           });
       });
    });





});

