const { expect } = require('chai');
const sinon = require('sinon');

const EmailService = require('../../../api/services/EmailService');

const sandbox = sinon.createSandbox();

describe('EmailService', () => {
    const testEmail = 'test@example.com';

    afterEach(() => {
        sandbox.restore();
    });

    describe('submissionConfirmation', () => {
        it('calls the above function with the correct args', () => {
            // when
            const notificationServiceStub = sandbox
                .stub(EmailService.emailRequest, 'post')
                .resolves({status: 200, data: 'test'});

            EmailService.submissionConfirmation(
                testEmail,
                123,
                { test: 'test' },
                123,
                4
            );

            // then
            const expectedPostData = {
                to: testEmail,
                application_reference: 123,
                send_information: { test: 'test' },
                user_ref: 123,
                service_type: 4,
            };
            expect(notificationServiceStub.getCall(0).args[1]).to.deep.equal(
                expectedPostData
            );
        });
    });
});
