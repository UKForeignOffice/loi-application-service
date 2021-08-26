const { expect } = require('chai');
const sinon = require('sinon');

const EAppEligibilityQuestionsController = require('../../../api/controllers/EAppEligibilityQuestionsController');

describe('EAppSubmittedController', () => {
    let reqStub = {};
    let resStub = {};
    const sandbox = sinon.sandbox.create();

    const renderPageFunctions = [
        'renderQuestionOne',
        'renderQuestionTwo',
        'renderQuestionThree',
    ];

    const handleAnswerFunctions = [
        'handleQuestionOneAnswer',
        'handleQuestionTwoAnswer',
        'handleQuestionThreeAnswer',
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
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('renderPage functions', () => {
        it('should render the correct ejs pages based on the render function called', () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: true,
            }));

            for (const renderPageFunction of renderPageFunctions) {
                EAppEligibilityQuestionsController[renderPageFunction](
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

        it('should prevent the user from seeing eligibility questions if they are not logged in', () => {
            // when
            sandbox.stub(HelperService, 'getUserData').callsFake(() => ({
                loggedIn: false,
            }));

            for (const renderPageFunction of renderPageFunctions) {
                EAppEligibilityQuestionsController[renderPageFunction](
                    reqStub,
                    resStub
                );
            }

            // then
            expect(resStub.forbidden.callCount).to.equal(3);
            expect(sails.log.error.callCount).to.equal(3);
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
            for (let i = 0; i < handleAnswerFunctions.length; i++) {
                reqStub = {
                    body: {
                        [radioInpuitNames[i]]: 'yes',
                    },
                };
                EAppEligibilityQuestionsController[handleAnswerFunctions[i]](
                    reqStub,
                    resStub
                );
            }

            // then
            expect(resStub.redirect.callCount).to.equal(3);
            expect(resStub.redirect.getCall(0).args[0]).to.equal(
                '/eligibility-question-two'
            );
            expect(resStub.redirect.getCall(1).args[0]).to.equal(
                '/eligibility-question-three'
            );
            expect(resStub.redirect.getCall(2).args[0]).to.equal(
                '/eapp-start-page'
            );
        });

        it('should redirect to the correct path whene user selects NO radio button', () => {
            // when
            for (let i = 0; i < handleAnswerFunctions.length; i++) {
                reqStub = {
                    body: { [radioInpuitNames[i]]: 'no' },
                };
                EAppEligibilityQuestionsController[handleAnswerFunctions[i]](
                    reqStub,
                    resStub
                );
            }

            // then
            expect(resStub.redirect.callCount).to.equal(3);
            expect(resStub.redirect.getCall(0).args[0]).to.equal(
                '/use-standard-service'
            );
            expect(resStub.redirect.getCall(1).args[0]).to.equal(
                '/use-standard-service'
            );
            expect(resStub.redirect.getCall(2).args[0]).to.equal(
                '/use-notarised-pdf'
            );
        });

        it("should pass page_error TRUE to question page if user doesn't choose an answer", () => {
            // when
            for (let i = 0; i < handleAnswerFunctions.length; i++) {
                reqStub = {
                    body: { [radioInpuitNames[i]]: '' },
                };
                EAppEligibilityQuestionsController[handleAnswerFunctions[i]](
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
            }
            expect(resStub.view.callCount).to.equal(3);
            expect(resStub.view.getCall(0).args[0]).to.equal(
                'eApostilles/eligibilityQuestionOne.ejs'
            );
            expect(resStub.view.getCall(0).args[1]).to.deep.equal(expectedSecondArg);
            expect(resStub.view.getCall(1).args[0]).to.equal(
                'eApostilles/eligibilityQuestionTwo.ejs'
            );
            expect(resStub.view.getCall(1).args[1]).to.deep.equal(expectedSecondArg);
            expect(resStub.view.getCall(2).args[0]).to.equal(
                'eApostilles/eligibilityQuestionThree.ejs'
            );
            expect(resStub.view.getCall(2).args[1]).to.deep.equal(expectedSecondArg);
        });
    });
});
