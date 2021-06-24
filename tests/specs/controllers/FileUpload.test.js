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

  it('should render the /upload-files page with uploaded file', function (done) {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 101;
    const agent = request.agent(sails.hooks.http.app);
    agent
      .post('/upload-file-handler')
      .attach('documents', process.cwd() + '/tests/specs/controllers/data/test.pdf')
      .expect(302)
      .then(() => {
        agent
          .get('/upload-files')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);
            const filename = $('[data-testid="uploaded-file-0"]').text().trim();
            chai.expect(filename).to.eql('test.pdf')
            done();
          });
      });
  });
});
