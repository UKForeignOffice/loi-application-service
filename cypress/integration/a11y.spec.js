describe('Check accessiblity', () => {
    const TOTAL_ELIBIGILITY_QUESTIONS = 3;

    function checkA11y() {
        cy.injectAxe();
        cy.checkA11y();
    }

    beforeEach(() => {
        cy.setCookie('cookies_preferences_set', 'true');
        cy.setCookie(
            'cookies_policy',
            '{"essential":true,"settings":true,"usage":true,"campaigns":true}'
        );
    });

    afterEach(() => {
        cy.on('fail', () => {
            cy.screenshot();
        });
    });

    context('Pre login pages', () => {
        beforeEach(() => {
            cy.visit('/');
        });
        it('Get your document legalised', () => {
            checkA11y();
        });

        it('Choose a service', () => {
            cy.get('.govuk-button--start').contains('Start now').click();
            checkA11y();
        });
    });

    describe('Post login', () => {
        function checkFirstRadioAndClickContinue() {
            cy.get('[type="radio"].govuk-radios__input').first().check();
            cy.get('.column-two-thirds .govuk-button')
                .contains('Continue')
                .click();
        }

        function uploadTestFile() {
            cy.get('.multi-file-upload__input').attachFile('test.pdf');
            cy.get('.govuk-button--secondary').contains('Upload').click();
            cy.wait(500);
        }

        function clickContinueBtn() {
            cy.get('.column-two-thirds .govuk-button')
                .contains('Continue')
                .click();
        }

        function startEappService() {
            cy.get('.govuk-body')
                .contains('skip to the start of the service')
                .click();
            cy.get('.govuk-button--start').contains('Start now').click();
        }

        beforeEach(() => {
            cy.visit('/select-service');
            cy.get('#sign-in-link').contains('Sign in').click();

            cy.get('#email').type(Cypress.env('EMAIL'));
            cy.get('#password').type(Cypress.env('PASSWORD'));

            cy.get('#sign-in-button').contains('Sign in').click();
        });

        context('eApp eligibility questions', () => {
            it('Which service would you like?', () => {
                checkA11y();
            });

            it('[Error] Which service would you like?', () => {
                clickContinueBtn();
                checkA11y();
            });

            it('Is the e-Apostille accepted in the destination country?', () => {
                checkFirstRadioAndClickContinue();
                checkA11y();
            });

            it('Check if the documents are eligible for the e-Apostille service', () => {
                checkFirstRadioAndClickContinue();
                checkFirstRadioAndClickContinue();
                checkA11y();
            });

            it('Have the PDFs been notarised and digitally signed by a notary?', () => {
                for (var i = 0; i < TOTAL_ELIBIGILITY_QUESTIONS; ++i) {
                    checkFirstRadioAndClickContinue();
                }
                checkA11y();
            });
        });

        context('eApp file upload', () => {
            beforeEach(() => {
                checkFirstRadioAndClickContinue();
            });

            it('Get the documents legalised using the e-Apostille service', () => {
                cy.get('.govuk-body')
                    .contains('skip to the start of the service')
                    .click();
                checkA11y();
            });

            it('Add your PDFs', () => {
                startEappService();
                checkA11y();
            });

            it('Add your PDFs - 1 file uploaded', () => {
                startEappService();
                uploadTestFile();
                checkA11y();
            });

            it('Would you like to give this application a reference?', () => {
                startEappService();
                uploadTestFile();
                clickContinueBtn();
                checkA11y();
            });
        });

        context('eApp applications section', () => {
            it('Your account', () => {
                cy.get('#Applications-Link').contains('Applications').click();
                checkA11y();
            });

            it('View app', () => {
                cy.get('#Applications-Link').contains('Applications').click();
                cy.get('#previousApplications .appRef .govuk-link')
                    .first()
                    .click();
                checkA11y();
            });
        });

        context('eApp summary', () => {
            beforeEach(() => {
                checkFirstRadioAndClickContinue();
                startEappService();
                uploadTestFile();
                clickContinueBtn();
            });

            it('Summary page', () => {
                clickContinueBtn();
                checkA11y();
            });
        });
    });
});
