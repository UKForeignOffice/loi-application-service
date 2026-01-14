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
                4,
              "fc7d2eac6961795e54c84221801eed767e7f065f"
            );

            // then
            const expectedPostData = {
                to: testEmail,
                application_reference: 123,
                send_information: { test: 'test' },
                user_ref: 123,
                service_type: 4,
                application_guid: "fc7d2eac6961795e54c84221801eed767e7f065f"
            };
            expect(notificationServiceStub.getCall(0).args[1]).to.deep.equal(
                expectedPostData
            );
        });
    });
});
