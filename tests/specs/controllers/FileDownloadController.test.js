const { expect } = require('chai');
const request = require('request');
const sinon = require('sinon');
const FileDownloadController = require('../../../api/controllers/FileDownloadController');

function assertWhenPromisesResolved(assertion) {
    setTimeout(assertion);
}

describe('FileDownloadController', () => {
    const sandbox = sinon.sandbox.create();

    let reqStub;
    let resStub;

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
            forbidden: sandbox.stub(),
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
            FileDownloadController._prepareAPIOptions(reqStub, resStub);

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
            FileDownloadController._prepareAPIOptions(reqStub, resStub);

        // then
        expect(fn).to.throw(Error, 'Application ID not found');
    });

    it.only('returns forbidden if id from application table does not match user session id', () => {
        // when
        sandbox
            .stub(HelperService, 'getUserData')
            .callsFake(() => ({ loggedIn: true }));
        sandbox.stub(Application, 'find').resolves({ user_id: 456 });
        FileDownloadController.downloadFileHandler(reqStub, resStub);

        // then
        expect(resStub.forbidden.calledOnce).to.be.true;
    });

    it('throws an error if the apostilleRef param is undefined', () => {
        // when
        reqStub.params.apostilleRef = 'undefined';
        FileDownloadController._prepareAPIOptions(reqStub);

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
            qs: {
                timestamp: '1483228800000',
                apostilleReference: 'APO-1234',
            },
        };
        const actualResult = FileDownloadController._prepareAPIOptions(reqStub);

        // then
        expect(actualResult).to.deep.equal(expectedResult);
    });

    it('streams file from the Casebook API to the client', () => {
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
        FileDownloadController.downloadFileHandler(reqStub, resStub);

        // then
        expect(streamFileToClient.getCall(0).args[1]).to.deep.equal(resStub);
    });
});
