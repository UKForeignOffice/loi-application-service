const {
    findByLabelText,
    findByRole,
    findAllByTestId,
    visit,
    get,
    setCookie,
    go,
    wait,
} = cy;

describe('Check accessiblity', () => {
    function checkA11y(logMsg) {
        if (logMsg) cy.log(logMsg);
        cy.injectAxe();
        cy.checkA11y();
    }

    function acceptSiteCookies() {
        setCookie('cookies_preferences_set', 'true');
        setCookie(
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

    describe('Pre login pages', () => {
        beforeEach(() => {
            visit('/');
        });

        it('Choose a service', () => {
            findByRole('button', { name: 'Start now' })
                .should('be.visible')
                .click();
        });
    });

    describe('Post login', () => {
        function uploadTestFile() {
            findByLabelText('Upload files').attachFile('test.pdf');
            findByRole('button', { name: 'Upload' })
                .should('be.visible')
                .click();
        }

        function clickContinueBtn() {
            findByRole('button', { name: 'Continue' }).click();
        }

        function checkRadioAndClickContinue(radioLabelName) {
            findByLabelText(radioLabelName).check();
            clickContinueBtn();
        }

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

        function selectViewableApplication() {
            findAllByTestId('eApp-ref-link').eq(1).click();
        }

        before(() => {
            visit('/select-service');

            findByRole('link', { name: 'Sign in' }).click();

            get('#email').type(Cypress.env('EMAIL'));
            get('#password').type(Cypress.env('PASSWORD'));

            findByRole('button', { name: 'Sign in' }).click();
        });

        it('eApp eligibility questions', () => {
            clickContinueBtn();
            checkA11y('[Error] Which service would you like?');

            findByLabelText('e-Apostille service').check();
            checkA11y('Select radio option and check a11y');

            checkRadioAndClickContinue('e-Apostille service');
            checkA11y(
                '1 - Is the e-Apostille accepted in the destination country?'
            );

            checkRadioAndClickContinue('Yes');
            checkA11y(
                '2 - Check if the documents are eligible for the e-Apostille service'
            );

            checkRadioAndClickContinue('Yes');
            checkA11y(
                '3 - Have the PDFs been notarised and digitally signed by a notary?'
            );

            checkRadioAndClickContinue('Yes');
            checkA11y(
                'Get the documents legalised using the e-Apostille service'
            );

            go('back');
            checkRadioAndClickContinue('No');
            checkA11y('You cannot use this service');

            go('back');
            checkRadioAndClickContinue('Yes');
            clickContinueBtn();

            visit('/upload-files');
            checkA11y('eApp file upload');

            uploadTestFile();
            wait(500);
            checkA11y('Add your PDFs - 1 file uploaded');

            clickContinueBtn();
            checkA11y('Would you like to give this application a reference?');

            clickContinueBtn();
            checkA11y('Summary page');

            clickContinueBtn();
            checkA11y('Payment page');

            findByRole('button', { name: 'Pay' }).click();
            confirmTestPayDetails();
            checkA11y('Submission success page');

            findByRole('link', {
                name: 'Applications',
            }).click();
            checkA11y('Applications list page');

            selectViewableApplication();
            checkA11y('View applicaiton page');
        });
    });
});
