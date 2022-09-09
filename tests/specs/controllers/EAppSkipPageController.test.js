const { expect } = require('chai');
const sinon = require('sinon');

const EAppSkipPageController = require('../../../api/controllers/EAppSkipPageController');

describe('EAppSkipPageController', () => {
    let reqStub = {};
    let resStub = {};
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        reqStub = {
            body: {
                'documents-suitable': '',
            },
            flash: () => [],
            _sails: {
                config: {
                    customURLs: {
                        userServiceURL: 'test.com',
                    },
                },
            },
            session: {
                eApp: {}
            },
        };

        resStub = {
            redirect: sandbox.spy(),
            view: sandbox.spy(),
        };

        sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
            some: 'data',
        }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('shows the page when renderPage() is called', () => {
        // when
        EAppSkipPageController.renderPage(reqStub, resStub);

        // then
        expect(resStub.view.getCall(0).args[0]).to.equal(
            'eApostilles/eAppSkipPage.ejs'
        );
        expect(resStub.view.getCall(0).args[1]).to.deep.equal({
            user_data: {
                some: 'data',
            },
            page_error: '',
        });
    });

    it('renders page with page_error true if no radio options selected', () => {
        // when
        reqStub.flash = () => 'You must answer this question';
        reqStub.body['documents-suitable'] = undefined;
        EAppSkipPageController.handleChoice(reqStub, resStub);

        // then
        expect(resStub.view.getCall(0).args[1]).to.deep.equal({
            user_data: {
                some: 'data',
            },
            page_error: 'You must answer this question',
        });
    });

    it('redirects to suitability questions if YES radio selected', () => {
        // when
        reqStub.body['documents-suitable'] = 'yes';
        EAppSkipPageController.handleChoice(reqStub, resStub);

        // then
        expect(resStub.redirect.getCall(0).args[0]).to.equal(
            '/eligibility/check-documents-are-eligible'
        );
    });

    it('redirects to sign in page if NO radio selected and user is NOT logged in', () => {
        // when
        reqStub.body['documents-suitable'] = 'no';
        sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => false);
        EAppSkipPageController.handleChoice(reqStub, resStub);

        // then
        expect(resStub.redirect.getCall(0).args[0]).to.equal(
            'test.com/sign-in?next=continueEApp&from=start'
        );
    });

    it('redirects to file upload page if NO radio selected and user is logged in', () => {
        // when
        reqStub.body['documents-suitable'] = 'no';
        sandbox.stub(HelperService, 'LoggedInStatus').callsFake(() => true);
        EAppSkipPageController.handleChoice(reqStub, resStub);

        // then
        expect(resStub.redirect.getCall(0).args[0]).to.equal('/upload-files');
    });
});
