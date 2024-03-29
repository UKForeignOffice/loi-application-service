const {
    findByLabelText,
    findByRole,
    findByText,
    findAllByTestId,
    findByTestId,
    visit,
    get,
    setCookie,
    go,
    wait,
} = cy;

const eligibilityPages = [
    '1 - Is the e-Apostille accepted in the destination country?',
    '2 - Check if the documents are eligible for the e-Apostille service',
    '3 - Have the PDFs been notarised and digitally signed by a notary?',
];

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
            findByLabelText('Upload PDFs').attachFile('test.pdf');
        }

        function clickContinueBtn() {
            findByRole('button', { name: 'Continue' }).click();
        }

        function checkRadioAndClickContinue(radioLabelName) {
            findByLabelText(radioLabelName).check();
            clickContinueBtn();
        }

        function selectFirstViewableApplication() {
            findAllByTestId('eApp-ref-link').eq(0).click();
        }


        it('eApp flow', () => {
            visit('/select-service');

            clickContinueBtn();
            checkA11y('[Error] Which service would you like?');

            checkA11y('Select radio option and check a11y');

            checkRadioAndClickContinue('Electronic \'e-Apostille\' service');

            checkA11y('Before you apply');

            clickContinueBtn();
            checkA11y('Before you apply - Error');

            findByLabelText('Yes, help me check now').check();

            checkA11y('1 - Is the e-Apostille accepted in the destination country?');

            clickContinueBtn();
            checkA11y('1 - Is the e-Apostille accepted in the destination country? - Error');

            checkRadioAndClickContinue('No, my documents are excluded');
            checkA11y('1 - Is the e-Apostille accepted in the destination country? - Exit Page');
            findByRole('link', {
                name: 'Back',
            }).click();

            findByLabelText('Yes, I believe my documents are eligible').check();

            checkA11y('1 - Is the e-Apostille accepted in the destination country? - Radio Check');
            clickContinueBtn();

            checkA11y('2 - Check if the documents are eligible for the e-Apostille service');

            clickContinueBtn();
            checkA11y('2 - Check if the documents are eligible for the e-Apostille service - Error');

            checkRadioAndClickContinue('No, I have not checked');
            checkA11y('2 - Check if the documents are eligible for the e-Apostille service - Exit Page');
            findByRole('link', {
                name: 'Back',
            }).click();

            findByLabelText('Yes, they will accept e-Apostilles').check();

            checkA11y('2 - Check if the documents are eligible for the e-Apostille service - Radio Check');
            clickContinueBtn();

            checkA11y('3 - Have the PDFs been notarised and digitally signed by a notary?');

            clickContinueBtn();
            checkA11y('3 - Have the PDFs been notarised and digitally signed by a notary? - Error');

            checkRadioAndClickContinue('No');
            checkA11y('3 - Have the PDFs been notarised and digitally signed by a notary? - Exit Page');
            findByRole('link', {
                name: 'Back',
            }).click();

            findByLabelText('Yes').check();

            findByTestId('prepare-pdf').click();

            checkA11y('3 - Have the PDFs been notarised and digitally signed by a notary? - Radio Check');
            clickContinueBtn();

            checkA11y(
                'Get the documents legalised using the e-Apostille service'
            );
            clickContinueBtn();

            get('#email').type(Cypress.env('EMAIL'));
            get('#password').type(Cypress.env('PASSWORD'));

            findByRole('button', { name: 'Sign in' }).click();

            checkA11y('eApp file upload');

            uploadTestFile();
            findByText('1 file was uploaded', { exact: false });
            checkA11y('Add your PDFs - 1 file uploaded');

            clickContinueBtn();
            checkA11y('Would you like to give this application a reference?');

            clickContinueBtn();
            checkA11y('Summary page');

            findByTestId('app-id').then(($elem) => {
                const appId = $elem.data('value');
                visit(
                    `/submit-application?id=${appId}&appReference=A-D-11-2222-3333-4444`
                );
            });

            checkA11y('Submission success page');

            /**
             * Please make sure you have an opeable e-app as the first
             * row on the dashboard or the following tests will fail.
             */
            findByRole('link', {
                name: 'Applications',
            }).click();
            checkA11y('Applications list page');

            selectFirstViewableApplication();
            checkA11y('View applicaiton page');
        });
    });
});
