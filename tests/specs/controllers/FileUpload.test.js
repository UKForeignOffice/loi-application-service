const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');
const { validateUploadedFile } = require('../../../api/controllers/FileUploadController');

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
            const errorMessage = $('[data-testid="errored-file-0-error-0"]').text().trim();
            chai.expect(errorMessage).to.eql('The file is in the wrong format. Only .pdf files are allowed.')
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

describe('validateUploadedFile', () => {
  it('returns file data for a valid file', () => {
    const previouslyUploadedFiles = [];
    const newUploadedFile = {
      "originalname": "file1.pdf",
      "mimetype": "application/pdf",
      "size": 2021860
    };
    const fileData = validateUploadedFile(newUploadedFile, previouslyUploadedFiles);
    chai.expect(fileData).to.eql({ filename: 'file1.pdf' })
  });

  it('returns error data for a file that\'s too big', () => {
    const previouslyUploadedFiles = [];
    const newUploadedFile = {
      "originalname": "file2.pdf",
      "mimetype": "application/pdf",
      "size": 1000000000
    };
    const fileData = validateUploadedFile(newUploadedFile, previouslyUploadedFiles);
    chai.expect(fileData.errors).to.eql(['The file is too large (1000.0Mb). The maximum size allowed is 100Mb'])
  });

  it('returns error data for a file that\'s the wrong format', () => {
    const previouslyUploadedFiles = [];
    const newUploadedFile = {
      "originalname": "file3.pdf",
      "mimetype": "image/png",
      "size": 136542
    };
    const fileData = validateUploadedFile(newUploadedFile, previouslyUploadedFiles);
    chai.expect(fileData.errors).to.eql(['The file is in the wrong format. Only .pdf files are allowed.'])
  });

  it('returns error data for a filename that had already been uploaded', () => {
    const previouslyUploadedFiles = [{
      "filename": "file3.pdf",
      "mimetype": "application/pdf",
      "size": 136542
    }];
    const newUploadedFile = {
      "originalname": "file3.pdf",
      "mimetype": "application/pdf",
      "size": 136542
    };
    const fileData = validateUploadedFile(newUploadedFile, previouslyUploadedFiles);
    chai.expect(fileData.errors).to.eql(['You\'ve already uploaded a file named file3.pdf. Each file in an application must have a unique name'])
  });

  it('returns all errors that apply to the uploaded file', () => {
    const previouslyUploadedFiles = [];
    const newUploadedFile = {
      "originalname": "file3.pdf",
      "mimetype": "image/png",
      "size": 2000500000
    };
    const fileData = validateUploadedFile(newUploadedFile, previouslyUploadedFiles);
    chai.expect(fileData.errors).to.eql([
      'The file is in the wrong format. Only .pdf files are allowed.',
      'The file is too large (2000.5Mb). The maximum size allowed is 100Mb'
    ])
  });
});
