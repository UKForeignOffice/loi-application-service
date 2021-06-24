const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');

describe('FileUploadController', function () {
  let sandbox;
  let userId = 100;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    // in the actual controller this helper returns user data from the session
    sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
      user: {
        id: userId
      },
    }))
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should return a redirect to the /upload-files page', function (done) {
    request
      .agent(sails.hooks.http.app)
      .post('/upload-file-handler')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/test.pdf')
      .expect(302)
      .then(response => {
        chai.expect(response.headers.location).to.eql('/upload-files');
        done();
      });
  });

  it('should show uploaded and errored files in the page', function (done) {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 101;
    const agent = request.agent(sails.hooks.http.app);
    agent
      .post('/upload-file-handler')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/test.pdf')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/fco-logo.png')
      .expect(302)
      .then(() => {
        agent
          .get('/upload-files')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            const uploadedFileName = $('[data-testid="uploaded-file-0"]').text().trim();
            chai.expect(uploadedFileName).to.eql('test.pdf')
            const erroredFileName = $('[data-testid="errored-file-0"]').text().trim();
            chai.expect(erroredFileName).to.eql('fco-logo.png')
            const error = $('[data-testid="errored-file-0-error-0"]').text().trim();
            chai.expect(error).to.eql('The file is in the wrong format. Only .pdf files are allowed.')
            done();
          });
      });
  });

  it('should delete a file', (done) => {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 102;
    const agent = request.agent(sails.hooks.http.app);
    agent
      .post('/upload-file-handler')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/test.pdf')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/fco-logo.png')
      .expect(302)
      .then(() => {
        agent
          .post('/delete-file-handler')
          .send({ delete: 'test.pdf' })
          .expect(302)
          .then(() => {
            agent
              .get('/upload-files')
              .expect(200)
              .then(response => {
                const $ = cheerio.load(response.text);
                const uploadedFiles = $('[data-testid="delete-form"]');
                chai.expect(uploadedFiles.length).to.eql(0);
                done();
              });
          })
      });
  })
});
