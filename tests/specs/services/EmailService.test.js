const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');

const EmailService = require('../../../api/services/EmailService');

const sandbox = sinon.sandbox.create();

describe('EmailService', () => {
    const testEmail = 'test@example.com';

    afterEach(() => {
        sandbox.restore();
    });

    describe('submissionConfirmation', () => {
        it('calls the above function with the correct args', () => {
            // when
            const notificationServiceStub = sandbox
                .stub(EmailService, '_sendRequestToNotificationService')
                .resolves(null);

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
            expect(notificationServiceStub.getCall(0).args[0]).to.deep.equal(
                expectedPostData
            );
        });
    });

    describe('_sendRequestToNotificationService', () => {
        it('adds arguments correctly to post request', async () => {
            // when
            const testdPostData = {
                to: testEmail,
                application_reference: 123,
                send_information: { test: 'test' },
                user_ref: 123,
                service_type: 4,
            };
            const axiosPostStub = sandbox
                .stub(EmailService.emailRequest, 'post')
                .resolves({
                    status: 200,
                    data: { data: 'is here' },
                });
            await EmailService._sendRequestToNotificationService(
                testdPostData,
                'test.url'
            );

            // then
            expect(axiosPostStub.getCall(0).args[0]).to.equal('test.url');
            expect(axiosPostStub.getCall(0).args[1]).to.deep.equal(
                testdPostData
            );
        });
    });
});
