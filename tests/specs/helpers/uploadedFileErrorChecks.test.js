const { expect } = require("chai");
const sinon = require("sinon");
const {
  checkTypeSizeAndDuplication,
} = require("../../../api/helpers/uploadedFileErrorChecks");


describe("checkTypeSizeAndDuplication", () => {
  const sessionStub = (uploadedFiles) => ({
    eApp: {
      uploadedFileData: uploadedFiles,
      uploadMessages: {
        errors: [],
      },
    },
  });
  const requestStub = (uploadedFiles = []) => ({
      session: sessionStub(uploadedFiles),
      headers: {
          'content-length': 136542,
      },
  });

  const callbackSpy = sinon.spy();

  it("uploads file if it has no issues", () => {
    const newUploadedFile = {
      originalname: "file1.pdf",
      mimetype: "application/pdf",
    };
    checkTypeSizeAndDuplication(requestStub(), newUploadedFile, callbackSpy);
    expect(callbackSpy.calledWith(null, true)).to.be.true;
  });

  it("does not upload the file if it is too large", () => {
    const newUploadedFile = {
      originalname: "file2.pdf",
      mimetype: "application/pdf",
    };
    const reqStub = requestStub();
    reqStub.headers['content-length'] = 100000000000;
    checkTypeSizeAndDuplication(reqStub, newUploadedFile, callbackSpy);
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });

  it("does not upload the file if it is the wrong format", () => {
    const newUploadedFile = {
      originalname: "file3.pdf",
      mimetype: "image/png",
    };
    checkTypeSizeAndDuplication(requestStub(), newUploadedFile, callbackSpy);
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });

  it("does not upload the file if it has already been uploaded", () => {
    const previouslyUploadedFiles = [
      {
        filename: "file3.pdf",
        mimetype: "application/pdf",

      },
    ];
    const newUploadedFile = {
      originalname: "file3.pdf",
      mimetype: "application/pdf",
    };
    checkTypeSizeAndDuplication(
      requestStub(previouslyUploadedFiles),
      newUploadedFile,
      callbackSpy
    );
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });
});
