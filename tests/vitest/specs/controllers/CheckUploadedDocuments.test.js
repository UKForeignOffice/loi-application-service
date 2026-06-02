const CheckUploadedDocumentsController = require('../../../../api/controllers/CheckUploadedDocumentsController')
const UserDocumentCount = require('../../../../api/models/index').UserDocumentCount
const ApplicationPaymentDetails = require('../../../../api/models/index').ApplicationPaymentDetails
const AdditionalApplicationInfo = require('../../../../api/models/index').AdditionalApplicationInfo
const UploadedDocumentUrls = require('../../../../api/models/index').UploadedDocumentUrls
const UsersBasicDetails = require('../../../../api/models/index').UsersBasicDetails
const UserModels = require('../../../../api/userServiceModels/models.js')

describe('CheckUploadedDocumentsController', () => {
  let reqStub
  let resStub

  function assertWhenPromisesResolved(assertion) {
    setTimeout(assertion)
  }

  beforeEach(() => {
    reqStub = {
      session: {
        appId: 12345,
        appType: 4,
        email: 'test@test.com',
        payment_reference: 'FCO-LOI-REF-162',
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
      },
      _sails: {
        config: {
          payment: {
            paymentStartPageUrl: 'stub_payment_url',
          },
          upload: {
            cost_per_document: '30',
          },
        },
      },
    }

    resStub = {
      redirect: vi.fn(),
      serverError: vi.fn(),
      view: vi.fn(),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('renderPage', () => {
    it('should render the check your answers page and pass the correct values', async () => {
      // when
      vi.spyOn(UserModels.User, 'findOne').mockResolvedValue({
        id: 123,
        email: 'test@test.com',
      })
      vi.spyOn(UserModels.AccountDetails, 'findOne').mockResolvedValue({
        first_name: 'Jane',
        last_name: 'Doe',
        telephone: '07123456789',
        mobileNo: null,
      })
      vi.spyOn(UsersBasicDetails, 'findOne').mockResolvedValue(true)

      await CheckUploadedDocumentsController.renderPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/checkUploadedDocuments.ejs')
      expect(resStub.view.mock.calls[0][1]).to.deep.include({
        documentNames: ['test1.pdf', 'test2.pdf'],
        totalDocuments: 2,
        totalCost: '£60.00',
        userRef: undefined,
      })
    })
  })

  describe('_checkDocumentCountAndPaymentDetails', () => {
    it('should check document count', () => {
      // when
      vi.spyOn(UserDocumentCount, 'findAll').mockResolvedValue(true)
      vi.spyOn(UserDocumentCount, 'update').mockResolvedValue()
      vi.spyOn(ApplicationPaymentDetails, 'findAll').mockResolvedValue(true)
      vi.spyOn(ApplicationPaymentDetails, 'update').mockResolvedValue()
      vi.spyOn(AdditionalApplicationInfo, 'findAll').mockResolvedValue(true)
      vi.spyOn(AdditionalApplicationInfo, 'update').mockResolvedValue()

      const checkCountSpy = vi.spyOn(CheckUploadedDocumentsController, '_checkDocumentCountInDB')
      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)
      const params = {
        appId: 12345,
        totalPrice: 60,
        documentCount: 2,
        paymentRef: 'FCO-LOI-REF-162',
        redirectUrl: 'stub_payment_url',
      }

      // then
      expect(checkCountSpy.mock.calls[0]).to.deep.equal([reqStub, resStub, params])
    })
  })

  describe('_checkDocumentCountInDB', () => {
    beforeEach(() => {
      vi.spyOn(UserDocumentCount, 'update').mockResolvedValue()
      vi.spyOn(ApplicationPaymentDetails, 'findAll').mockResolvedValue(true)
      vi.spyOn(ApplicationPaymentDetails, 'update').mockResolvedValue()
      vi.spyOn(AdditionalApplicationInfo, 'findAll').mockResolvedValue(true)
      vi.spyOn(AdditionalApplicationInfo, 'update').mockResolvedValue()
    })

    it('should try to find an existing document count entry', () => {
      // when
      const findUserDocumentCount = vi.spyOn(UserDocumentCount, 'findOne').mockResolvedValue(true)

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      const expectedArg = {
        where: {
          application_id: 12345,
        },
      }
      expect(findUserDocumentCount.mock.calls[0][0]).to.deep.equal(expectedArg)
    })

    it.skip('should update the document count if an entry exists ', () => {
      // when
      vi.spyOn(UserDocumentCount, 'findAll').mockResolvedValue(true)

      const updateDocumentCountSpy = vi.spyOn(CheckUploadedDocumentsController, '_updateDocumentCountInDB')

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      assertWhenPromisesResolved(() => expect(updateDocumentCountSpy.mock.calls).to.have.lengthOf(1))
    })

    it('should create new document count if an entry does NOT exist', () => {
      // when
      vi.spyOn(UserDocumentCount, 'findAll').mockResolvedValue(false)

      const createDocumentCountSpy = vi.spyOn(CheckUploadedDocumentsController, '_createDocumentCountInDB')

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      assertWhenPromisesResolved(() => expect(createDocumentCountSpy.mock.calls).to.have.lengthOf(1))
    })
  })

  describe('_checkPaymentDetailsExistsInDB', () => {
    beforeEach(() => {
      vi.spyOn(UserDocumentCount, 'findAll').mockResolvedValue(true)
      vi.spyOn(UserDocumentCount, 'update').mockResolvedValue()
      vi.spyOn(AdditionalApplicationInfo, 'findAll').mockResolvedValue(true)
      vi.spyOn(AdditionalApplicationInfo, 'update').mockResolvedValue()
    })

    it('should try to find an existing payment details entry', () => {
      // when
      const findApplicationPaymentDetails = vi
        .spyOn(ApplicationPaymentDetails, 'findOne')
        .mockImplementation(() => undefined)

      findApplicationPaymentDetails.mockResolvedValue(true)
      vi.spyOn(ApplicationPaymentDetails, 'update').mockResolvedValue()

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      const expectedArg = {
        where: {
          application_id: 12345,
        },
      }
      assertWhenPromisesResolved(() =>
        expect(findApplicationPaymentDetails.mock.calls[0][0]).to.deep.equal(expectedArg),
      )
    })

    it('should update the payment details if an entry exists ', () => {
      // when
      vi.spyOn(ApplicationPaymentDetails, 'findAll').mockResolvedValue(true)
      vi.spyOn(ApplicationPaymentDetails, 'update').mockResolvedValue()

      const updatePaymentAmount = vi.spyOn(CheckUploadedDocumentsController, '_updatePaymentAmountInDB')

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      assertWhenPromisesResolved(() => expect(updatePaymentAmount.mock.calls).to.have.lengthOf(1))
    })

    it.skip('should create new payment details if an entry does NOT exists ', () => {
      // when
      vi.spyOn(ApplicationPaymentDetails, 'findAll').mockResolvedValue(false)
      vi.spyOn(ApplicationPaymentDetails, 'create').mockResolvedValue()

      const createPaymentDetails = vi.spyOn(CheckUploadedDocumentsController, '_createPaymentDetailsInDB')

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      assertWhenPromisesResolved(() => expect(createPaymentDetails.mock.calls).to.have.lengthOf(1))
    })
  })

  describe('_checkPaymentDetailsExistsInDB', () => {
    it('redirects to payment page after document count and payment details checks', () => {
      // when
      vi.spyOn(UploadedDocumentUrls, 'create').mockResolvedValue()
      vi.spyOn(UserDocumentCount, 'findAll').mockResolvedValue(true)
      vi.spyOn(UserDocumentCount, 'update').mockResolvedValue()
      vi.spyOn(ApplicationPaymentDetails, 'findAll').mockResolvedValue(true)
      vi.spyOn(ApplicationPaymentDetails, 'update').mockResolvedValue()

      CheckUploadedDocumentsController.addDocsToDBHandler(reqStub, resStub)

      // then
      assertWhenPromisesResolved(() => expect(resStub.redirect.mock.calls[0]).to.deep.equal([307, 'stub_payment_url']))
    })
  })
})
