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

            for (let i = 0; i < eligibilityPages.length; i++) {
                const page = eligibilityPages[i];

                checkA11y(page);

                clickContinueBtn();
                checkA11y(`${page}- Error`);

                checkRadioAndClickContinue('No');
                checkA11y(`${page}- Exit Page`);
                findByRole('link', {
                    name: 'Back',
                }).click();

                findByLabelText('Yes').check();

                if (i === 2) findByTestId('prepare-pdf').click();

                checkA11y(`${page}- Radio Check`);
                clickContinueBtn();
            }

            checkA11y(
                'Get the documents legalised using the e-Apostille service'
            );

            visit('/upload-files');
            checkA11y('eApp file upload');

            uploadTestFile();
            findByText('1 file was uploaded', { exact: false });
            checkA11y('Add your PDFs - 1 file uploaded');

            clickContinueBtn();
            checkA11y('Would you like to give this application a reference?');

            clickContinueBtn();
            checkA11y('Summary page');

            clickContinueBtn();
            checkA11y('Payment page');

            findByTestId('app-id').then(($elem) => {
                const appId = $elem.data('value');
                visit(
                    `/submit-application?id=${appId}&appReference=A-D-11-2222-3333-4444`
                );
            });

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
