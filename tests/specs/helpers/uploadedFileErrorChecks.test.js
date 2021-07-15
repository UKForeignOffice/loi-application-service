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
  });

  const callbackSpy = sinon.spy();

  it("uploads file if it has no issues", () => {
    const newUploadedFile = {
      originalname: "file1.pdf",
      mimetype: "application/pdf",
      size: 2021860,
    };
    checkTypeSizeAndDuplication(requestStub(), newUploadedFile, callbackSpy);
    expect(callbackSpy.calledWith(null, true)).to.be.true;
  });

  it("does not upload the file if it is too large", () => {
    const newUploadedFile = {
      originalname: "file2.pdf",
      mimetype: "application/pdf",
      size: 1000000000,
    };
    checkTypeSizeAndDuplication(requestStub(), newUploadedFile, callbackSpy);
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });

  it("does not upload the file if it is the wrong format", () => {
    const newUploadedFile = {
      originalname: "file3.pdf",
      mimetype: "image/png",
      size: 136542,
    };
    checkTypeSizeAndDuplication(requestStub(), newUploadedFile, callbackSpy);
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });

  it("does not upload the file if it has already been uploaded", () => {
    const previouslyUploadedFiles = [
      {
        filename: "file3.pdf",
        mimetype: "application/pdf",
        size: 136542,
      },
    ];
    const newUploadedFile = {
      originalname: "file3.pdf",
      mimetype: "application/pdf",
      size: 136542,
    };
    checkTypeSizeAndDuplication(
      requestStub(previouslyUploadedFiles),
      newUploadedFile,
      callbackSpy
    );
    expect(callbackSpy.calledWith(null, false)).to.be.true;
  });
});
