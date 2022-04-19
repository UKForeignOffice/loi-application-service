const { expect } = require('chai');
const sinon = require('sinon');

const EAppEligibilityQuestionsController = require('../../../api/controllers/EAppEligibilityQuestionsController');

describe('EAppEligibilityQuestionsController', () => {
    let reqStub = {};
    let resStub = {};
    const sandbox = sinon.sandbox.create();

    const urlParams = [
        'apostille-accepted-in-destination',
        'documents-eligible-for-service',
        'pdfs-digitally-signed',
    ];

    const radioInpuitNames = [
        'eapostille-acceptable',
        'documents-eligible',
        'notarised-and-signed',
    ];

    beforeEach(() => {
        sandbox.spy(sails.log, 'error');
        resStub = {
            forbidden: sandbox.spy(),
            redirect: sandbox.spy(),
            view: sandbox.spy(),
        };

        reqStub = {
            _sails: {
                config: {
                    customURLs: {
                        userServiceURL: 'test.com'
                    }
                }
            }
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('renderPage functions', () => {
        it('should render the correct ejs pages based on the url param', () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));

            for (const urlParam of urlParams) {
                reqStub.param = (arg) => arg === 'question' && urlParam;
                EAppEligibilityQuestionsController.renderEligibilityQuestion(
                    reqStub,
                    resStub
                );
            }

            // then
            expect(resStub.view.callCount).to.equal(3);
            expect(resStub.view.getCall(0).args[0]).to.equal(
                'eApostilles/eligibilityQuestionOne.ejs'
            );
            expect(resStub.view.getCall(1).args[0]).to.equal(
                'eApostilles/eligibilityQuestionTwo.ejs'
            );
            expect(resStub.view.getCall(2).args[0]).to.equal(
                'eApostilles/eligibilityQuestionThree.ejs'
            );
        });
    });

    describe('handle answer functions', () => {
        beforeEach(() => {
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));
        });

        it('should redirect to the correct path whene user selects YES radio button', () => {
            // when
            for (let i = 0; i < urlParams.length; i++) {
                reqStub = {
                    body: {
                        [radioInpuitNames[i]]: 'yes',
                    },
                };
                reqStub.param = (arg) => arg === 'question' && urlParams[i];

                EAppEligibilityQuestionsController.handleEligibilityAnswers(
                    reqStub,
                    resStub
                );
            }

            // then
            expect(resStub.redirect.callCount).to.equal(3);
            expect(resStub.redirect.getCall(0).args[0]).to.equal(
                '/eligibility/documents-eligible-for-service'
            );
            expect(resStub.redirect.getCall(1).args[0]).to.equal(
                '/eligibility/pdfs-digitally-signed'
            );
            expect(resStub.redirect.getCall(2).args[0]).to.equal(
                '/eapp-start-page'
            );
        });

        it('should redirect to the correct path whene user selects NO radio button', () => {
            // when
            for (let i = 0; i < urlParams.length; i++) {
                reqStub = {
                    body: { [radioInpuitNames[i]]: 'no' },
                };
                reqStub.param = (arg) => arg === 'question' && urlParams[i];

                EAppEligibilityQuestionsController.handleEligibilityAnswers(
                    reqStub,
                    resStub
                );
            }

            // then
            expect(resStub.redirect.callCount).to.equal(3);
            expect(resStub.redirect.getCall(0).args[0]).to.equal(
                '/use-standard-service/apostille-acceptance'
            );
            expect(resStub.redirect.getCall(1).args[0]).to.equal(
                '/use-standard-service/apostille-eligible'
            );
            expect(resStub.redirect.getCall(2).args[0]).to.equal(
                '/use-standard-service/apostille-digitally-signed'
            );
        });

        it("should pass page_error TRUE to question page if user doesn't choose an answer", () => {
            // when
            for (let i = 0; i < urlParams.length; i++) {
                reqStub = {
                    body: { [radioInpuitNames[i]]: '' },
                };
                reqStub.param = (arg) => arg === 'question' && urlParams[i];

                EAppEligibilityQuestionsController.handleEligibilityAnswers(
                    reqStub,
                    resStub
                );
            }

            // then
            const expectedSecondArg = {
                user_data: {
                    loggedIn: true,
                },
                page_error: true,
            };
            expect(resStub.view.callCount).to.equal(3);
            expect(resStub.view.getCall(0).args[0]).to.equal(
                'eApostilles/eligibilityQuestionOne.ejs'
            );
            expect(resStub.view.getCall(0).args[1]).to.deep.equal(
                expectedSecondArg
            );
            expect(resStub.view.getCall(1).args[0]).to.equal(
                'eApostilles/eligibilityQuestionTwo.ejs'
            );
            expect(resStub.view.getCall(1).args[1]).to.deep.equal(
                expectedSecondArg
            );
            expect(resStub.view.getCall(2).args[0]).to.equal(
                'eApostilles/eligibilityQuestionThree.ejs'
            );
            expect(resStub.view.getCall(2).args[1]).to.deep.equal(
                expectedSecondArg
            );
        });
    });
});
