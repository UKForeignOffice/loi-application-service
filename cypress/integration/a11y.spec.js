describe('Check accessiblity', () => {
    const TOTAL_ELIBIGILITY_QUESTIONS = 3;

    function checkA11y() {
        cy.injectAxe();
        cy.checkA11y();
    }

    function acceptSiteCookies() {
        cy.setCookie('cookies_preferences_set', 'true');
        cy.setCookie(
            'cookies_policy',
            '{"essential":true,"settings":true,"usage":true,"campaigns":true}'
        );
    }

    beforeEach(() => {
        acceptSiteCookies();
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
            cy.findByRole('button', { name: 'Start now' }).click();
            checkA11y();
        });
    });

    describe('Post login', () => {
        function uploadTestFile() {
            cy.findByLabelText('Upload files').attachFile('test.pdf');
            cy.findByRole('button', { name: 'Upload' }).click();
        }

        function clickContinueBtn() {
            cy.findByRole('button', { name: 'Continue' }).click();
        }

        function checkRadioAndClickContinue(radioLabelName) {
            cy.findByLabelText(radioLabelName).check();
            clickContinueBtn();
        }

        function passEappStartScreen() {
            cy.findByRole('link', {
                name: 'skip to the start of the service',
            }).click();
            clickContinueBtn();
        }

        beforeEach(() => {
            cy.visit('/select-service');
            cy.findByRole('link', { name: 'Sign in' }).click();

            cy.get('#email').type(Cypress.env('EMAIL'));
            cy.get('#password').type(Cypress.env('PASSWORD'));

            cy.findByRole('button', { name: 'Sign in' }).click();
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
                checkRadioAndClickContinue('e-Apostille service');
                checkA11y();
            });

            it('Check if the documents are eligible for the e-Apostille service', () => {
                checkRadioAndClickContinue('e-Apostille service');
                checkRadioAndClickContinue('Yes');
                checkA11y();
            });

            it('You cannot use this service', () => {
                checkRadioAndClickContinue('e-Apostille service');
                checkRadioAndClickContinue('No');
                checkA11y();
            });

            it('Have the PDFs been notarised and digitally signed by a notary?', () => {
                checkRadioAndClickContinue('e-Apostille service');
                for (var i = 0; i < TOTAL_ELIBIGILITY_QUESTIONS - 1; ++i) {
                    checkRadioAndClickContinue('Yes');
                }
                checkA11y();
            });
        });

        context('eApp file upload', () => {
            beforeEach(() => {
                checkRadioAndClickContinue('e-Apostille service');
            });

            it('Get the documents legalised using the e-Apostille service', () => {
                cy.findByRole('link', {
                    name: 'skip to the start of the service',
                }).click();
                checkA11y();
            });

            it('Add your PDFs', () => {
                passEappStartScreen();
                checkA11y();
            });

            it('Add your PDFs - 1 file uploaded', () => {
                passEappStartScreen();
                uploadTestFile();
                checkA11y();
            });

            it('Would you like to give this application a reference?', () => {
                passEappStartScreen();
                uploadTestFile();
                clickContinueBtn();
                checkA11y();
            });
        });

        context('eApp applications section', () => {
            function selectFirstApplication() {
                cy.get('#previousApplications .appRef .govuk-link')
                    .first()
                    .click();
            }

            it('Your account', () => {
                cy.findByRole('link', {
                    name: 'Applications',
                }).click();
                checkA11y();
            });

            it('View app', () => {
                cy.findByRole('link', {
                    name: 'Applications',
                }).click();
                selectFirstApplication();
                checkA11y();
            });
        });

        context('eApp summary and success page', () => {
            function confirmTestPayDetails() {
                cy.get('#card-no').type('4444333322221111');
                cy.get('#expiry-month').type('12');
                cy.get('#expiry-year').type('34');
                cy.get('#cardholder-name').type("T'Challa Udaku");
                cy.get('#cvc').type('161');
                cy.get('#address-line-1').type('Stables Market');
                cy.get('#address-line-2').type('Chalk Farm Rd');
                cy.get('#address-city').type('London');
                cy.get('#address-postcode').type('NW1 8AB');
                cy.get('#submit-card-details').click();
                // - Confirm payment page
                cy.get('#confirm').click();
            }

            beforeEach(() => {
                checkRadioAndClickContinue('e-Apostille service');
                passEappStartScreen();
                uploadTestFile();
                clickContinueBtn();
                clickContinueBtn();
            });

            it('Summary page', () => {
                checkA11y();
            });

            it('Submission successful', () => {
                clickContinueBtn();
                cy.findByRole('button', { name: 'Pay' }).click();
                confirmTestPayDetails();
                checkA11y();
            });
        });
    });
});
