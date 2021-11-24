const { expect } = require('chai');
const sinon = require('sinon');
const ReceiptDownloadController = require('../../../api/controllers/ReceiptDownloadController');
const CasebookService = require('../../../api/services/CasebookService');

describe.only('ReceiptDownloadController', () => {
    const sandbox = sinon.sandbox.create();
    let reqStub;
    let resStub;

    beforeEach(() => {
        reqStub = {
            params: {
                applicationRef: '123',
            },
        };
        resStub = {
            serverError: sandbox.spy(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('calls getApplicationReceipt method from CasebookService to stream file', async () => {
        // when
        const getReceipt = sandbox
            .stub(CasebookService, 'getApplicationReceipt')
            .resolves({
                data: {
                    pipe: () => {},
                },
            });

        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        await ReceiptDownloadController.getReceipt(reqStub, resStub);

        // then
        expect(getReceipt.calledOnce).to.be.true;
    });

    it('triggers serverError when user is not logged in', async () => {
        // when
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: false,
        }));
        await ReceiptDownloadController.getReceipt(reqStub, resStub);

        // then
        expect(resStub.serverError.calledOnce).to.be.true;
    });

    it('triggers serverError if application ref is undefined', async () => {
        // when
        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            loggedIn: true,
        }));
        reqStub.params.applicationRef = undefined;
        await ReceiptDownloadController.getReceipt(reqStub, resStub);

        // then
        expect(resStub.serverError.calledOnce).to.be.true;
    });
});
