const { findByLabelText, findByRole, visit, get, setCookie } = cy;

describe('Check accessiblity', () => {
    const TOTAL_ELIBIGILITY_QUESTIONS = 3;

    function checkA11y(options = null) {
        cy.injectAxe();
        cy.checkA11y(options);
    }

    function acceptSiteCookies() {
        setCookie('cookies_preferences_set', 'true');
        setCookie(
            'cookies_policy',
            '{"essential":true,"settings":true,"usage":true,"campaigns":true}'
        );
    }

    beforeEach(() => {
        cy.clearCookies();
        acceptSiteCookies();
    });

    afterEach(() => {
        cy.on('fail', () => {
            cy.screenshot();
        });
    });

    context('Pre login pages', () => {
        beforeEach(() => {
            visit('/');
        });

        it('Get your document legalised', () => {
            checkA11y();
        });

        it('Choose a service', () => {
            findByRole('button', { name: 'Start now' }).click();
            checkA11y();
        });
    });

    describe('Post login', () => {
        function uploadTestFile() {
            findByLabelText('Upload files').attachFile('test.pdf');
            findByRole('button', { name: 'Upload' }).click();
        }

        function clickContinueBtn() {
            findByRole('button', { name: 'Continue' }).click();
        }

        function checkRadioAndClickContinue(radioLabelName) {
            findByLabelText(radioLabelName).check();
            clickContinueBtn();
        }

        function passEappStartScreen() {
            findByRole('link', {
                name: 'skip to the start of the service',
            }).click();
            clickContinueBtn();
        }

        beforeEach(() => {
            visit('/select-service');
            findByRole('link', { name: 'Sign in' }).click();

            get('#email').type(Cypress.env('EMAIL'));
            get('#password').type(Cypress.env('PASSWORD'));

            findByRole('button', { name: 'Sign in' }).click();
        });

        context('eApp eligibility questions', () => {
            it('Which service would you like?', () => {
                checkA11y();
            });

            it('[Error] Which service would you like?', () => {
                clickContinueBtn();
                checkA11y();
            });

            it('Select radio option and check a11y', () => {
                findByLabelText('e-Apostille service').check();
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
                for (var i = 1; i < TOTAL_ELIBIGILITY_QUESTIONS; ++i) {
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
                findByRole('link', {
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
                get('#dashboard-results tbody .govuk-link')
                    .first()
                    .click();
            }

            it('Your account', () => {
                findByRole('link', {
                    name: 'Applications',
                }).click();
                checkA11y();
            });

            it('View app', () => {
                findByRole('link', {
                    name: 'Applications',
                }).click();
                selectFirstApplication();
                checkA11y();
            });
        });

        context('eApp summary and success page', () => {
            function confirmTestPayDetails() {
                get('#card-no').type('4444333322221111');
                get('#expiry-month').type('12');
                get('#expiry-year').type('34');
                get('#cardholder-name').type("T'Challa Udaku");
                get('#cvc').type('161');
                get('#address-line-1').type('Stables Market');
                get('#address-line-2').type('Chalk Farm Rd');
                get('#address-city').type('London');
                get('#address-postcode').type('NW1 8AB');
                get('#submit-card-details').click();
                // - Confirm payment page
                get('#confirm').click();
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
                findByRole('button', { name: 'Pay' }).click();
                confirmTestPayDetails();
                checkA11y();
            });
        });
    });
});
