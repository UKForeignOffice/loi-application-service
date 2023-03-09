const { expect } = require('chai');
const sinon = require('sinon');

const EAppReferenceController = require('../../../api/controllers/EAppReferenceController');
const HelperService = require('../../../api/services/HelperService');

describe('EAppReferenceController', () => {
    let reqStub = {};
    let resStub = {};
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        reqStub = {
            body: {
                'user-reference': 136542,
            },
            flash: sandbox.spy(),
            session: {
                eApp: {
                    userRef: 136542,
                },
            },
        };
        resStub = {
            forbidden: sandbox.spy(),
            response: sandbox.spy(),
            view: sandbox.spy(),
            redirect: sandbox.spy(),
        };

    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('renderPage', () => {
        it('prevents users from seeing the page if they are not logged in', () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: false,
            }));
            EAppReferenceController.renderPage(reqStub, resStub);

            // then
            expect(resStub.forbidden.calledOnce).to.be.true;
        });

        it('returns reference view with correct data', () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            EAppReferenceController.renderPage(reqStub, resStub);

            // then
            const expectedValue = {
                user_data: {
                    loggedIn: true,
                },
                userRef: 136542,
                maxReferenceLength: 30,
                referenceErrors: [],
            };

            expect(resStub.view.firstCall.args[0]).to.equal('eApostilles/additionalReference.ejs');
            expect(resStub.view.firstCall.args[1]).to.deep.equal(expectedValue);
        });
    });

    describe('addReferenceToSession', () => {
        it('updates session with new userRef and redirects', () => {
            // when
            reqStub.body['user-reference'] = 'TestRef';
            EAppReferenceController.addReferenceToSession(reqStub, resStub);

            // then
            expect(reqStub.session.eApp.userRef).to.equal('TestRef');
            expect(resStub.redirect.calledWith('/check-uploaded-documents')).to
                .be.true;
        });

        it('returns error page if user ref is more than max characters', () => {
            // when
            reqStub.body['user-reference'] = 'sjdkfotjgnfmdksodjrtjskeorkslakri';
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            EAppReferenceController.addReferenceToSession(reqStub, resStub);

            // then
            const expectedErrorMsg = {
                title: 'Your reference is too long',
                text: 'Your reference must be 30 characters or fewer',
            };
            expect(reqStub.flash.firstCall.args[1]).to.deep.equal([expectedErrorMsg]);
        });

        it('shows error page if user ref contains illegal characters', () => {
            // when
            reqStub.body['user-reference'] = 'TestRef@@@@$$$$&()';
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
            EAppReferenceController.addReferenceToSession(reqStub, resStub);

            // then
            const expectedErrorMsg = {
                title: 'There is a problem with your reference',
                text: 'The reference cannot use the following characters: $, &',
            }
            expect(reqStub.flash.firstCall.args[1]).to.deep.equal([expectedErrorMsg]);
        });
    });
});
