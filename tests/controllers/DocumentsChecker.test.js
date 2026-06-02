/**
 * Created by preciousr on 11/11/2015.
 *
 * ApplicationTypeController----------------------------------------------------
 *
 *
 */
var request = require('supertest')
var session = require('supertest-session')
var testSession = session('test')
var fs = require('node:fs')

describe('DocumentsCheckerController:', () => {
  describe.skip('[FUNCTION: docSelectorStart()]', () => {
    it('should find the document selector start page tempalte and render it. ', (done) => {
      // reset selectedDocs array
      testSession.selectedDocuments = {
        totalDocCount: 0,
        documents: [],
      }

      const fs = require('node:fs')
      //TODO:: fix this so relative path can be used
      fs.stat('views/documentChecker/documentsCheckerStart.ejs', (err, stat) => {
        if (err === null) {
          assert.isOk(stat, 'Successfully found documentsCheckerStart template')
          done()
        } else {
          assert.isNotOk(err, 'Failed to find documentsCheckerStart template')
          done(err)
        }
      })
    })
  })

  describe.skip('[Function: docsSelector()]', () => {
    it('should successfully find the doc selector route', (done) => {
      request(sails.hooks.http.app)
        .post('/select-documents')
        .send({ appId: 1001 })
        .expect(200)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }

          res.res.connection._httpMessage.path.should.equal('/select-documents')

          done()
        })
    })

    it('should find the doc selector page template and render it. ', (_done) => {
      //TODO:: fix this so relative path can be used
      fs.stat('views/documentChecker/documentsCheckerDocsSelector.ejs', (err, stat) => {
        if (err === null) {
          assert.isOk(stat, 'Successfully found documentsCheckerDocsSelector template')
          done()
        } else {
          assert.isNotOk(err, 'Failed to find documentsCheckerDocsSelector template')
          done()
        }
      })
    })
  })

  describe.skip('[Function: docsSearch()]', () => {
    it('should render the document search view template', (_done) => {
      var fs = require('node:fs')
      //TODO:: fix this so relative path can be used
      fs.stat('views/documentChecker/documentsCheckerSearch.ejs', (err, stat) => {
        if (err === null) {
          assert.isOk(stat, 'Successfully found documentsCheckerSearch template')
          done()
        } else {
          assert.isNotOk(err, 'Failed to find documentsCheckerSearch template')
          done()
        }
      })
    })
  })

  describe.skip('[Function: addSelectedDoc()]', () => {
    it('should find the selected-documents route', (_done) => {
      request(sails.hooks.http.app)
        .send({ application_id: 1001 })
        .post('/select-documents')
        .expect(302)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          var _header = res.res.headers
          res.res.connection._httpMessage.path.should.equal('/select-documents')
        })
    })

    it('should find the a-to-z-document-listing route', (_done) => {
      request(sails.hooks.http.app)
        .post('/a-to-z-document-listing')
        .expect(302)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          var _header = res.res.headers
          res.res.connection._httpMessage.path.should.equal('/a-to-z-document-listing')
        })
    })
  })

  describe.skip('[Function: addSelectedDoc()]', () => {
    it('should find the selected-documents route', (_done) => {
      request(sails.hooks.http.app)
        .post('/select-documents')
        .expect(302)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          var _header = res.res.headers
          res.res.connection._httpMessage.path.should.equal('/select-documents')
        })
    })

    it('should find the a-to-z-document-listing route', (_done) => {
      request(sails.hooks.http.app)
        .post('/a-to-z-document-listing')
        .expect(302)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          var _header = res.res.headers
          res.res.connection._httpMessage.path.should.equal('/a-to-z-document-listing')
        })
    })
  })
})
