
const EmailService = require('../../../../api/services/EmailService')


describe('EmailService', () => {
  const testEmail = 'test@example.com'

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('submissionConfirmation', () => {
    it('calls the above function with the correct args', async () => {
      // when
      const notificationServiceStub = vi
        .spyOn(EmailService.emailRequest, 'post')
        .mockResolvedValue({ status: 200, data: 'test' })

      await EmailService.submissionConfirmation(
        testEmail,
        123,
        { test: 'test' },
        123,
        4,
        'fc7d2eac6961795e54c84221801eed767e7f065f',
      )

      // then
      const expectedPostData = {
        to: testEmail,
        application_reference: 123,
        send_information: { test: 'test' },
        user_ref: 123,
        service_type: 4,
        application_guid: 'fc7d2eac6961795e54c84221801eed767e7f065f',
      }
      expect(notificationServiceStub.mock.calls[0][1]).to.deep.equal(expectedPostData)
    })
  })
})
