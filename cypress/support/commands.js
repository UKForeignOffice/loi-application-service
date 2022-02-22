// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('loginByCSRF', (csrf) => {

    cy.request({
        method: 'POST',
        url: `${Cypress.config().baseUrl}/api/user/sign-in?_csrf=${csrf}`,
        failOnStatusCode: false, // dont fail so we can make assertions
        form: true, // we are submitting a regular form body
        body: {
            email: Cypress.env('EMAIL'),
            password: Cypress.env('PASSWORD'),
            _csrf: csrf, // insert this as part of form body
        },
    });
});
