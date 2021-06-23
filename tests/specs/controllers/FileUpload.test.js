const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon')

describe('FileUploadController', function () {
  it('should return a redirect to the /upload-files page', function (done) {
    sinon.stub(HelperService, 'getUserData').callsFake(() => ({
      user: {
        id: 100
      },
    }))
    request
      .agent(sails.hooks.http.app)
      .post('/upload-file-handler')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/test.pdf')
      .expect(302)
      .then(response => {
        chai.expect(response.headers.location).to.eql('/upload-files');
        return done();
      });
  });
});
