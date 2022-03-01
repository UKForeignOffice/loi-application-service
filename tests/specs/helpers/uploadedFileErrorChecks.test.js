const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const {
    checkTypeSizeAndDuplication,
    removeFilesIfLarge,
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

    describe('large file uploads', () => {
        let deleteFileFromStorage;

        beforeEach(() => {
            deleteFileFromStorage = sandbox
                .stub(fs, 'unlink')
                .callsFake(() => null);
        });

        function createReqStub(files) {
            const { file1, file2 } = files;
            return {
                files: [
                    {
                        size: file1.size,
                        originalname: file1.name,
                    },
                    {
                        size: file2.size,
                        originalname: file2.name,
                    },
                ],
                session: {
                    eApp: {
                        uploadedFileData: [
                            {
                                filename: file1.name,
                                storageName: file1.name,
                            },
                            {
                                filename: file2.name,
                                storageName: file2.name,
                            },
                        ],
                        uploadMessages: {
                            errors: [],
                        },
                    },
                },
                _sails: {
                    config: {
                        upload: {
                            s3_bucket: 'upload',
                            file_upload_size_limit: '200',
                        },
                    },
                },
            };
        }

        it('deletes files and send error message if it is too large', () => {
            // when
            const reqStub = createReqStub({
                file1: {
                    name: 'file_1.pdf',
                    size: 210_000_000,
                },
                file2: {
                    name: 'file_2.pdf',
                    size: 210_000_000,
                },
            });
            removeFilesIfLarge(reqStub);

            // then
            expect(reqStub.session.eApp.uploadedFileData.length).to.equal(0);
            expect(reqStub.session.eApp.uploadMessages.errors.length).to.equal(
                2
            );
            expect(deleteFileFromStorage.callCount).to.equal(2);
        });

        it('deletes large files but keeps files below size limit', () => {
            // when
            const reqStub = createReqStub({
                file1: {
                    name: 'large.pdf',
                    size: 210_000_000,
                },
                file2: {
                    name: 'small.pdf',
                    size: 10_000_000,
                },
            });
            removeFilesIfLarge(reqStub);

            // then
            const expectedUploadedFileData = [
                {
                    filename: 'small.pdf',
                    storageName: 'small.pdf',
                },
            ];
            expect(reqStub.session.eApp.uploadedFileData).to.deep.equal(
                expectedUploadedFileData
            );
            expect(reqStub.session.eApp.uploadMessages.errors.length).to.equal(
                1
            );
            expect(deleteFileFromStorage.callCount).to.equal(1);
        });
    });
});
