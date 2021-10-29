const { expect } = require('chai');
const request = require('request');
const sinon = require('sinon');
const FileDownloadController = require('../../../api/controllers/FileDownloadController');

describe('FileDownloadController', () => {
    const sandbox = sinon.sandbox.create();
    let reqStub;
    let resStub;
    let defaultPrepareAPIOptionsArgs;

    beforeEach(() => {
        reqStub = {
            params: {
                apostilleRef: 'APO-1234',
                unique_app_id: 'A-D-21-1008-0547-D546',
            },
            _sails: {
                config: {
                    hmacKey: '123',
                    customURLs: {
                        apostilleDownloadAPIURL: 'https://test.url',
                    },
                    casebookCertificate: '123',
                    casebookKey: '456',
                },
            },
            session: {
                user: {
                    id: 123,
                },
            },
        };
        resStub = {
            serverError: sandbox.stub(),
            headers: {
                'content-disposition': '',
            },
        };
        defaultPrepareAPIOptionsArgs = {
            runErrorChecks: true,
            uri: 'https://test.url',
            reference: { apostilleReference: 'APO-1234' },
            json: true,
            req: reqStub,
            res: resStub,
        };
        sandbox.stub(Date, 'now').callsFake(() => 1483228800000);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('throws if user is not logged in', () => {
        // when
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => ({ loggedIn: false }));
        const fn = () =>
            FileDownloadController._prepareAPIOptions(
                defaultPrepareAPIOptionsArgs
            );

        // then
        expect(fn).to.throw(Error, 'User is not logged in');
    });

    it('throws if unique_app_id is not found', () => {
        // when
        reqStub.params.unique_app_id = null;
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => ({ loggedIn: true }));
        const fn = () =>
            FileDownloadController._prepareAPIOptions(
                defaultPrepareAPIOptionsArgs
            );

        // then
        expect(fn).to.throw(Error, 'Application ID not found');
    });

    it('returns false if id from application table does not match user session id', async () => {
        // when
        sandbox.stub(Application, 'find').resolves({ user_id: 456 });
        await FileDownloadController._checkSessionUserIdMatchesApp(
            reqStub,
            resStub
        );

        // then
        expect(resStub.serverError.calledOnce).to.be.true;
    });

    it('throws an error if the apostilleRef param is undefined', () => {
        // when
        reqStub.params.apostilleRef = 'undefined';
        const fn = () =>
            FileDownloadController._prepareAPIOptions(
                defaultPrepareAPIOptionsArgs
            );

        // then
        expect(fn).to.throw(Error, 'Missing apostille reference');
    });

    it('passes the correct parameters when preparing the request options', () => {
        const expectedResult = {
            uri: 'https://test.url',
            agentOptions: {
                cert: '123',
                key: '456',
            },
            headers: {
                hash: 'D5387482B71CDE06986CDD41C6C2AA1A95CC3819B920650F0C3EF1487491E3B9B957CE6AA9A7CFB5753B04DDA2E3279C27E0C2125BC6DFBED624C11EB3705F07',
            },
            json: true,
            qs: {
                timestamp: '1483228800000',
                apostilleReference: 'APO-1234',
            },
        };
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => ({ loggedIn: true }));
        const actualResult = FileDownloadController._prepareAPIOptions(
            defaultPrepareAPIOptionsArgs
        );

        // then
        expect(actualResult).to.deep.equal(expectedResult);
    });

    it('streams file from the Casebook API to the client', async () => {
        // when
        sandbox.stub(request, 'get').callsFake(() => ({
            on: () => ({
                pipe: () => ({
                    on: () => null,
                }),
            }),
        }));
        const streamFileToClient = sandbox.spy(
            FileDownloadController,
            '_streamFileToClient'
        );
        sandbox.stub(Application, 'find').resolves({ user_id: 123 });
        sandbox
            .stub(FileDownloadController, '_apostilleRefBelongToApplication')
            .resolves(true);
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => ({ loggedIn: true }));
        await FileDownloadController.downloadFileHandler(reqStub, resStub);

        // then
        expect(streamFileToClient.getCall(0).args[1]).to.deep.equal(resStub);
    });

    it('renames the file before streaming', () => {
        // when
        FileDownloadController._renamePDFFromHeader(reqStub, resStub);

        // then
        expect(resStub.headers['content-disposition']).to.equal(
            'attachment; filename=LegalisedDocument-APO-1234.pdf'
        );
    })
});
