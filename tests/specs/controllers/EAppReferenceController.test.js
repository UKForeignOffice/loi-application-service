const { expect } = require('chai');
const sinon = require('sinon');

const EAppReferenceController = require('../../../api/controllers/EAppReferenceController');

describe('EAppReferenceController', () => {
    let reqStub = {};
    let resStub = {};
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        reqStub = {
            body: {
                'user-reference': 136542,
            },
            session: {
                eApp: {
                    userRef: 136542,
                },
            },
        };
        resStub = {
            serverError: sandbox.spy(),
            response: sandbox.spy(),
            view: sandbox.spy(),
            redirect: sandbox.spy(),
        };

        sandbox.spy(sails.log, 'info');
        sandbox.spy(sails.log, 'error');
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
            expect(
                sails.log.error.getCall(0).args[0] ===
                    'User not logged in'
            ).to.be.true;
            expect(resStub.serverError.calledOnce).to.be.true;
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
            };
            expect(resStub.view.calledWith('eApostilles/additionalReference.ejs', expectedValue)).to.be.true;
        });
    });

    describe('addReferenceToSession', () => {
        it('updates session with new userRef and redirects', () => {
            // when
            reqStub.body['user-reference'] = 'TestRef';
            EAppReferenceController.addReferenceToSession(reqStub, resStub);

            // then
            expect(reqStub.session.eApp.userRef === 'TestRef').to.be.true;
            expect(resStub.redirect.calledWith('/check-uploaded-documents')).to
                .be.true;
        });

        it('logs error if no userRef found', () => {
            // when
            reqStub.body['user-reference'] = null;
            EAppReferenceController.addReferenceToSession(reqStub, resStub);

            // then
            expect(sails.log.error.calledWith('No user reference found')).to.be.true;
        });
    });
});
