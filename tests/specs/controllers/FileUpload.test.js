const request = require('supertest');
const chai = require('chai');
const {expect} = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');
const { checkTypeSizeAndDuplication } = require("../../../api/helpers/uploadedFileErrorChecks");

// Tests are timing out
describe.skip('FileUploadController', function () {
  let sandbox;
  let userId = 100;
  let agent;

  beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    agent = request.agent(sails.hooks.http.app);
    // in the actual controller this helper returns user data from the session
    sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
      user: {
        id: userId
      },
    }));
    done();
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });

  it('should return a redirect to the /upload-files page', function (done) {
    agent
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

describe.only('validateUploadedFile', () => {
  const sessionStub = (uploadedFiles) => ({
    eApp: {
      uploadedFileData: uploadedFiles,
      uploadMessages: {
        errors: []
      },
    },
  });
  const requestStub = (uploadedFiles = []) => ({
    session: sessionStub(uploadedFiles),
  });

  const callbackSpy = sinon.spy();

  it('uploads file if it has no issues', () => {
    const newUploadedFile = {
      "originalname": "file1.pdf",
      "mimetype": "application/pdf",
      "size": 2021860
    };
    checkTypeSizeAndDuplication(
      requestStub(),
      newUploadedFile,
      callbackSpy
    );
    expect(callbackSpy.calledWith(null, true)).to.be.true;
  });

  it('does not upload the file if it is too large', () => {
    const newUploadedFile = {
      "originalname": "file2.pdf",
      "mimetype": "application/pdf",
      "size": 1000000000
    };
    checkTypeSizeAndDuplication(
      requestStub(),
      newUploadedFile,
      callbackSpy
    );
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });

  it('does not upload the file if it is the wrong format', () => {
    const newUploadedFile = {
      "originalname": "file3.pdf",
      "mimetype": "image/png",
      "size": 136542
    };
    checkTypeSizeAndDuplication(
      requestStub(),
      newUploadedFile,
      callbackSpy
    );
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });

  it('does not upload the file if it has already been uploaded', () => {
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
    checkTypeSizeAndDuplication(
      requestStub(previouslyUploadedFiles),
      newUploadedFile,
      callbackSpy
    );
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });
});
