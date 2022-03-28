const { expect } = require('chai');
const sinon = require('sinon');
const summaryController = require('../../../api/controllers/SummaryController');
const OpenPaperAppController = require('../../../api/controllers/OpenPaperAppController');

function assertWhenPromisesResolved(assertion) {
    setTimeout(assertion);
}

describe('openCoverSheet', () => {
    let reqStub;
    const sandbox = sinon.sandbox.create();

    const resStub = {
        view: sandbox.spy(),
    };
    beforeEach(() => {
        reqStub = {
            params: {
                unique_app_id: 'A-D-21-0920-2180-EEE1',
            },
            session: {
                appId: undefined,
                user: {
                    id: 123,
                },
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("redirects to 404 page if session and db user ids don't match", () => {
        // when
        sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
        sandbox.stub(Application, 'find').resolves({
            user_id: 100,
            application_id: 124,
        });
        OpenPaperAppController.openCoverSheet(reqStub, resStub);

        // then
        assertWhenPromisesResolved(
            () => expect(resStub.view.calledWith('404')).to.be.true
        );
    });

    it('redirect to 404 page if user is not logged in', () => {
        // when
        sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => false);
        OpenPaperAppController.openCoverSheet(reqStub, resStub);

        // then
        expect(resStub.view.calledWith('404')).to.be.true;
    });

    it('runs fetchAll function if session and db user ids match', () => {
        // when
        const fetchAllFn = sandbox.stub(summaryController, 'fetchAll');
        sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
        sandbox.stub(Application, 'find').resolves({
            user_id: 123,
            application_id: 124,
        });
        OpenPaperAppController.openCoverSheet(reqStub, resStub);

        // then
        assertWhenPromisesResolved(() => expect(fetchAllFn.called).to.be.true);
    });
});
