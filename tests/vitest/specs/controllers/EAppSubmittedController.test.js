const EAppSubmittedController = require('../../../../api/controllers/EAppSubmittedController')
const UploadedDocumentUrls = require('../../../../api/models/index').UploadedDocumentUrls
const HelperService = require('../../../../api/services/HelperService')
const EmailService = require('../../../../api/services/EmailService')

describe('EAppSubmittedController', () => {
  let reqStub
  let resStub

  beforeEach(() => {
    reqStub = {
      session: {
        appId: 12345,
        eApp: {
          uploadedFileData: [
            {
              filename: 'test1.pdf',
              storageName: '45678_test1.pdf',
              location: 'aws_url_45678_test1.pdf',
            },
            {
              filename: 'test2.pdf',
              storageName: '45678_test2.pdf',
              location: 'aws_url_45678_test2.pdf',
            },
          ],
        },
        account: {
          first_name: 'John',
          last_name: 'Doe',
        },
        email: 'test@test.com',
        appType: 4,
        user: {
          id: 123,
        },
      },
      protocol: 'https',
      allParams: () => ({ appReference: 'test-merchant-reference' }),
      _sails: {
        config: {
          upload: {
            s3_bucket: 'test-bucket',
            s3_url_expiry_hours: 100,
          },
          views: {
            locals: {
              service_public: true,
            },
          },
        },
      },
      query: {
        appReference: 'test-merchant-reference',
      },
      get: (arg) => (arg === 'host' ? 'testHost' : null),
    }

    resStub = {
      view: vi.fn(),
      serverError: vi.fn(),
    }

    vi.spyOn(sails.log, 'error')
    vi.spyOn(sails.log, 'info')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('addDocsAndRenderPage', () => {
    it('should call serverError if no files are found', async () => {
      // when
      reqStub.session.eApp.uploadedFileData = []
      await EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub)

      // then
      expect(resStub.serverError.mock.calls.length).to.equal(1)
      expect(sails.log.error.mock.calls[0][0]).to.equal('No uploaded file data found in session')
    })

    it('should upload files to the database if they exist', async () => {
      // when
      const createUploadedDocumentsUrls = vi.spyOn(UploadedDocumentUrls, 'create').mockImplementation(() => undefined)

      vi.spyOn(EmailService, 'submissionConfirmation').mockImplementation(() => null)
      createUploadedDocumentsUrls.mockResolvedValue()

      await EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub)

      // then
      const firstCallArgs = {
        application_id: 12345,
        filename: 'test1.pdf',
        uploaded_url: '45678_test1.pdf',
      }
      const secondCallArgs = {
        application_id: 12345,
        filename: 'test2.pdf',
        uploaded_url: '45678_test2.pdf',
      }

      expect(createUploadedDocumentsUrls.mock.calls.length).to.equal(2)
      expect(createUploadedDocumentsUrls.mock.calls[0][0]).to.deep.equal(firstCallArgs)
      expect(createUploadedDocumentsUrls.mock.calls[1][0]).to.deep.equal(secondCallArgs)
    })
  })

  describe('_dbColumnData', () => {
    it('should throw an error if there is no appId', () => {
      // when
      reqStub.session.appId = null

      // then
      expect(() => EAppSubmittedController._dbColumnData({ storageName: 'test_1234.pdf' }, reqStub)).to.throw(
        'Missing application id',
      )
    })
  })

  describe('_renderPageAndSendConfirmationEmail', () => {
    let emailSubmission
    const stubUserData = {
      account: {
        first_name: 'John',
        last_name: 'Doe',
      },
      url: '',
      loggedIn: true,
      user: {
        email: 'test@test.com',
      },
    }
    beforeEach(async () => {
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => stubUserData)
      vi.spyOn(UploadedDocumentUrls, 'create').mockResolvedValue()
      emailSubmission = vi.spyOn(EmailService, 'submissionConfirmation').mockImplementation(() => null)
      await EAppSubmittedController.addDocsAndRenderPage(reqStub, resStub)
    })

    it('should render submission page', () => {
      // when - before each
      // then
      const expectedArgs = {
        email: 'test@test.com',
        applicationId: 'test-merchant-reference',
        user_data: stubUserData,
      }

      expect(resStub.view.mock.calls[0]).to.deep.equal([
        'eApostilles/applicationSubmissionSuccessful.ejs',
        expectedArgs,
      ])

      expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/applicationSubmissionSuccessful.ejs')
      expect(resStub.view.mock.calls[0][1]).to.deep.equal(expectedArgs)
    })

    it('should send confirmation email', () => {
      // when - before each
      // then
      expect(emailSubmission.mock.calls[0]).to.deep.equal([
        'test@test.com',
        'test-merchant-reference',
        {
          first_name: 'John',
          last_name: 'Doe',
        },
        123,
        4,
      ])
    })
  })
})
