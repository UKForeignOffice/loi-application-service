const { expect } = require('chai');
const sinon = require('sinon');
const FileDownloadController = require('../../../api/controllers/FileDownloadController');
const CasebookService = require('../../../api/services/CasebookService');
const Application = require('../../../api/models/index').Application
const HelperService = require('../../../api/services/HelperService');

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
            FileDownloadController._urlErrorChecks(
                reqStub, resStub
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
            FileDownloadController._urlErrorChecks(
                reqStub, resStub
            );

        // then
        expect(fn).to.throw(Error, 'Application ID not found');
    });

    it('returns false if id from application table does not match user session id', async () => {
        // when
        sandbox.stub(Application, 'findOne').resolves({ user_id: 456 });
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
            FileDownloadController._urlErrorChecks(
                reqStub, resStub
            );

        // then
        expect(fn).to.throw(Error, 'Missing apostille reference');
    });

    describe('_apostilleRefBelongToApplication', () => {
        beforeEach(() => {
            sandbox
                .stub(HelperService, 'getUserData')
                .callsFake(() => ({ loggedIn: true }));
        });

        it('sends the correct argument to CasebookService', () => {
            // when
            const getApplicationStub = sandbox
                .stub(CasebookService, 'getApplicationStatus')
                .resolves({
                    data: [
                        {
                            documents: [],
                        },
                    ],
                });

            FileDownloadController._apostilleRefBelongToApplication(
                reqStub,
                resStub
            );

            // then
            expect(getApplicationStub.getCall(0).args[0]).to.equal(
                reqStub.params.unique_app_id
            );
        });

        it('returns true if application ref match found from casebook', async () => {
            // when
            sandbox.stub(CasebookService, 'getApplicationStatus').resolves({
                data: [
                    {
                        documents: [
                            { apostilleReference: 'APO-23456' },
                            { apostilleReference: 'APO-1234' },
                        ],
                    },
                ],
            });
            const res = await FileDownloadController._apostilleRefBelongToApplication(
                reqStub,
                resStub
            );

            // then
            expect(res).to.be.true;
        });
        it('returns false if application ref NOT found in casebook', async () => {
            // when
            sandbox.stub(CasebookService, 'getApplicationStatus').resolves({
                data: [
                    {
                        documents: [
                            { apostilleReference: 'APO-23456' },
                        ],
                    },
                ],
            });
            const res = await FileDownloadController._apostilleRefBelongToApplication(
                reqStub,
                resStub
            );

            // then
            expect(res).to.be.false;
        });
    });
});
