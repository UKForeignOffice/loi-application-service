const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const {
    checkTypeSizeAndDuplication,
    displayErrorAndRemoveLargeFiles,
} = require('../../../api/helpers/uploadedFileErrorChecks');

const sandbox = sinon.sandbox.create();

describe('checkTypeSizeAndDuplication', () => {
    afterEach(() => {
        sandbox.restore();
    });

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

    it('uploads file if it has no issues', () => {
        const newUploadedFile = {
            originalname: 'file1.pdf',
            mimetype: 'application/pdf',
        };
        checkTypeSizeAndDuplication(
            requestStub(),
            newUploadedFile,
            callbackSpy
        );
        expect(callbackSpy.calledWith(null, true)).to.be.true;
    });

    it('does not upload the file if it is the wrong format', () => {
        const newUploadedFile = {
            originalname: 'file3.pdf',
            mimetype: 'image/png',
        };
        checkTypeSizeAndDuplication(
            requestStub(),
            newUploadedFile,
            callbackSpy
        );
        expect(callbackSpy.calledWith(null, false)).to.be.true;
    });

    it('does not upload the file if it has already been uploaded', () => {
        const previouslyUploadedFiles = [
            {
                filename: 'file3.pdf',
                mimetype: 'application/pdf',
            },
        ];
        const newUploadedFile = {
            originalname: 'file3.pdf',
            mimetype: 'application/pdf',
        };
        checkTypeSizeAndDuplication(
            requestStub(previouslyUploadedFiles),
            newUploadedFile,
            callbackSpy
        );
        expect(callbackSpy.calledWith(null, false)).to.be.true;
    });

    it('delete file and send error message if it is too large', () => {
        // when
        const unlinkFile = sandbox.stub(fs, 'unlink').callsFake(() => null);
        const reqStub = {
            files: [
                {
                    size: 210_000_000,
                    originalname: 'file_1.pdf',
                },
                {
                    size: 210_000_000,
                    originalname: 'file_2.pdf',
                },
            ],
            session: {
                eApp: {
                    uploadedFileData: [
                        {
                            filename: 'file_1.pdf',
                            storageName: 'file_1.pdf',
                        },
                        {
                            filename: 'file_2.pdf',
                            storageName: 'file_2.pdf',
                        },
                    ],
                    uploadMessages: {
                        errors: [],
                    },
                },
            },
            _sails: {
                config: {
                    eAppS3Vals: {
                        s3_bucket: 'leg-demo-upload-d4szp8',
                    },
                },
            },
        };
        displayErrorAndRemoveLargeFiles(reqStub);

        // then
        expect(reqStub.session.eApp.uploadedFileData.length).to.equal(0);
        expect(reqStub.session.eApp.uploadMessages.errors.length).to.equal(2);
        expect(unlinkFile.callCount).to.equal(2);
    });
});
