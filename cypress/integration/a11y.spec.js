describe('Check accessiblity', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.injectAxe();
    });

    afterEach*(() => {
        cy.on('fail', () => {
            cy.screenshot();
        });
    });

    context('Pre login pages', () => {
        it('Get your document legalised', () => {
            cy.checkA11y({
                exclude: ['#global-cookie-message'],
            });
            cy.contains('Agree all Cookies').click();
            cy.contains('Hide').click();
        });
    });

    context('Choose a service before login', () => {
        it('should be accessible', () => {
            cy.get('.govuk-button--start').contains('Start now').click();
            cy.injectAxe();
            cy.checkA11y({
                exclude: ['#global-cookie-message'],
            });
        });
    });
});
