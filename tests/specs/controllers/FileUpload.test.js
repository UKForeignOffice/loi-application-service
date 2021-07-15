const request = require("supertest");
const chai = require("chai");
const { expect } = require("chai");
const sinon = require("sinon");
const cheerio = require("cheerio");
const FileUploadController = require("../../../api/controllers/FileUploadController");

// Tests are timing out
describe.skip("FileUploadController", function () {
  let sandbox;
  let userId = 100;
  let agent;

  beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    agent = request.agent(sails.hooks.http.app);
    // in the actual controller this helper returns user data from the session
    sandbox.stub(HelperService, "getUserData").callsFake(() => ({
      user: {
        id: userId,
      },
    }));
    done();
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });

  it("should return a redirect to the /upload-files page", function (done) {
    agent
      .post("/upload-file-handler")
      .attach(
        "documents",
        process.cwd() + "/tests/specs/controllers/data/test.pdf"
      )
      .expect(302)
      .then((response) => {
        chai.expect(response.headers.location).to.eql("/upload-files");
        done();
      });
  });

  it("should show uploaded and errored files in the page", function (done) {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 101;
    agent
      .post("/upload-file-handler")
      .attach(
        "documents",
        process.cwd() + "/tests/specs/controllers/data/test.pdf"
      )
      .attach(
        "documents",
        process.cwd() + "/tests/specs/controllers/data/fco-logo.png"
      )
      .expect(302)
      .then(() => {
        agent
          .get("/upload-files")
          .expect(200)
          .then((response) => {
            const $ = cheerio.load(response.text);
            const uploadedFileName = $('[data-testid="uploaded-file-0"]')
              .text()
              .trim();
            chai.expect(uploadedFileName).to.eql("test.pdf");
            const erroredFileName = $('[data-testid="errored-file-0"]')
              .text()
              .trim();
            chai.expect(erroredFileName).to.eql("fco-logo.png");
            const errorMessage = $('[data-testid="errored-file-0-error-0"]')
              .text()
              .trim();
            chai
              .expect(errorMessage)
              .to.eql(
                "The file is in the wrong format. Only .pdf files are allowed."
              );
            done();
          });
      });
  });

  it("should delete a file", (done) => {
    // use a unique user, so the documents cache on the server starts in a blank state
    userId = 102;
    agent
      .post("/upload-file-handler")
      .attach(
        "documents",
        process.cwd() + "/tests/specs/controllers/data/test.pdf"
      )
      .expect(302)
      .then(() => {
        agent
          .post("/delete-file-handler")
          .send({ delete: "test.pdf" })
          .expect(302)
          .then(() => {
            agent
              .get("/upload-files")
              .expect(200)
              .then((response) => {
                const $ = cheerio.load(response.text);
                const uploadedFiles = $('[data-testid="delete-form"]');
                chai.expect(uploadedFiles.length).to.eql(0);
                done();
              });
          });
      });
  });
});

describe("uploadFilesPage", () => {
  const reqStub = {};
  const resStub = {
    forbidden: sinon.spy(),
    view: sinon.spy(),
  };

  it("should forbid users that are not logged in", () => {
    // when
    sinon.stub(HelperService, "getUserData").callsFake(() => ({
      loggedIn: false,
    }));
    FileUploadController.uploadFilesPage(reqStub, resStub);

    // then
    expect(resStub.forbidden.calledOnce).to.be.true;
    HelperService.getUserData.restore();
  });

  it("should load uploadedFiles.ejs with user_data", () => {
    // when
    const testUserData = {
      loggedIn: true,
      user: "test_data"
    }
    sinon.stub(HelperService, "getUserData").callsFake(() => testUserData);
    FileUploadController.uploadFilesPage(reqStub, resStub);

    // then
    expect(
      resStub.view.calledWith("eApostilles/uploadFiles.ejs", {
        user_data: testUserData,
      })
    ).to.be.true;
    HelperService.getUserData.restore();
  });
});

describe.skip("uploadFileHandler", () => {
  it("should remove previous error messages before uploading file", () => {
    // pass
  });

  it("should redirect to upload-files page after uploading a file", () => {
    // when
    FileUploadController.uploadFileHandler(reqStub, resStub);

    // then
    expect(resStub.redirect.calledWith("/upload-files")).to.be.true;
  });
});

describe("deleteFileHandler", () => {
  let reqStub;

  const resStub = {
    redirect: sinon.spy(),
    badRequest: sinon.spy(),
    notFound: sinon.spy(),
  };

  beforeEach(() => {
    reqStub = {
      body: {
      delete: null,
      },
      session: {
        eApp: {
          uploadedFileData: [],
        },
      },
      _sails: {
        config: {
          eAppS3Vals: {
            s3_bucket: "test",
          },
        },
      },
    };
  });

  it("should return bad request if body.delete is empty", () => {
    // when
    FileUploadController.deleteFileHandler(reqStub, resStub);

    // then
    expect(resStub.badRequest.calledOnce).to.be.true;
  });

  it("should return not found if no files found in session", () => {
    // when
    FileUploadController.deleteFileHandler(reqStub, resStub);

    // then
    expect(resStub.notFound.calledOnce).to.be.true;
  });

  it("should redirect to upload-files page after deleting a file", () => {
    // when
    reqStub.body.delete = "test_file.pdf";
    reqStub.session.eApp.uploadedFileData = [
      {
        filename: "test_file.pdf",
      },
    ];
    FileUploadController.deleteFileHandler(reqStub, resStub);

    // then
    expect(resStub.redirect.calledWith("/upload-files")).to.be.true;
  });

  it("should remove deleted file from sesion", () => {
    // when
    reqStub.body.delete = "test_file.pdf";
    reqStub.session.eApp.uploadedFileData = [
      {
        filename: "test_file.pdf",
      },
      {
        filename: "test_file_2.pdf",
      },
    ];

    // then
    expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(2);
    FileUploadController.deleteFileHandler(reqStub, resStub);
    expect(reqStub.session.eApp.uploadedFileData).to.have.lengthOf(1);
    expect(reqStub.session.eApp.uploadedFileData[0].filename).to.equal(
      "test_file_2.pdf"
    );
  });

});
