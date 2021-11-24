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
            serverError: () => {},
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
                data: 'test data',
            });
        await ReceiptDownloadController.getReceipt(reqStub, resStub);

        // then
        expect(getReceipt.calledOnce).to.be.true;
    });

    it('throws an error if user is not logged in', () => {
        // pass
    });

    it('throws an error if application ref is undefined', () => {
        // pass
    });
});
