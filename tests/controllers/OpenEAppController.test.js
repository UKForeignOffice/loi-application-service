const stream = require('node:stream')
const util = require('node:util')
const OpenEAppController = require('../../api/controllers/OpenEAppController')
const _OrbitService = require('../../api/services/OrbitService')
const Application = require('../../api/models/index').Application
const _ExportedEAppData = require('../../api/models/index').ExportedEAppData
const HelperService = require('../../api/services/HelperService')

let findApplicationData

describe('OpenEAppController', () => {
  let reqStub
  let resStub
  const resolvedAppData = {
    unique_app_id: 'id_from_apps_table',
    createdAt: '2021-08-19',
    user_id: 123,
  }
  const resolvedOrbitData = [
    {
      applicationReference: 'A-D-21-0809-2034-C968',
      status: 'In progress',
      completedDate: '2021-08-19 00:00',
      payment: {
        netAmount: 30.0,
        transactions: [
          {
            amount: 30.0,
            method: 'Credit/Debit Card',
            reference: '8516285240123586',
            transactionAmount: 30.0,
            transactionDate: '',
            type: 'Initial Incoming',
          },
        ],
      },
      documents: [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ],
    },
  ]

  const expectedPageData = {
    applicationId: 'id_from_apps_table',
    dateSubmitted: '19 August 2021',
    dateCompleted: '19 August 2021',
    documents: [
      {
        name: 'client_document_1.pdf',
        status: 'Submitted',
        apostilleReference: '',
        downloadExpired: false,
      },
    ],
    originalCost: '£30.00',
    paymentRef: '8516285240123586',
  }
  const TWO_DAYS_AFTER_COMPLETION = 1629417600000
  const TWELVE_DAYS_AFTER_COMPLETION = 1630281600000

  beforeEach(() => {
    reqStub = {
      params: {
        unique_app_id: 'test_unique_app_id',
        storageLocation: 'encodedStorageLocation',
        applicationRef: 'test_application_ref',
      },
      protocol: 'http',
      headers: {
        host: 'localhost',
      },
      _sails: {
        config: {
          customURLs: {
            userServiceURL: 'localhost/3000',
          },
          upload: {
            max_days_to_download: '21',
            orbit_bucket: 'test-bucket',
            orbit_url_expiry_hours: 1,
          },
        },
      },
      session: {
        user: {
          id: 123,
        },
      },
    }
    resStub = {
      serverError: vi.fn(),
      forbidden: vi.fn(),
      redirect: vi.fn(),
      view: vi.fn(),
    }
    vi.spyOn(sails.log, 'error')
    vi.spyOn(sails.log, 'warn')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should redirect to sign in page if user is not logged in', async () => {
    // when
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: false,
    }))
    await OpenEAppController.renderPage(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls[0][0]).to.equal('localhost/3000/sign-in?eappid=test_unique_app_id')
  })

  it('prevents viewing the page if application ref is undefined', async () => {
    // when
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: true,
    }))
    reqStub.params.unique_app_id = 'undefined'
    await OpenEAppController.renderPage(reqStub, resStub)

    // then
    expect(resStub.view.mock.calls.length).to.be.greaterThan(0)
  })

  it("prevents the user from viewing someone else's application", async () => {
    // when
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      loggedIn: true,
    }))
    vi.spyOn(Application, 'findOne').mockResolvedValue({ user_id: 456 })
    await OpenEAppController.renderPage(reqStub, resStub)

    // then
    expect(resStub.forbidden.mock.calls.length).to.be.greaterThan(0)
  })

  describe('happy path', () => {
    beforeEach(() => {
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      vi.spyOn(Date, 'now').mockImplementation(() => TWO_DAYS_AFTER_COMPLETION)
      findApplicationData = vi.spyOn(Application, 'findOne').mockResolvedValue(resolvedAppData)
      vi.spyOn(OpenEAppController, '_getApplicationDataFromOrbit').mockResolvedValue(resolvedOrbitData)
      vi.spyOn(OpenEAppController, '_getUserRef').mockResolvedValue('123456')
    })

    it('should get data from the Application table', async () => {
      // when - beforeEach runs
      await OpenEAppController.renderPage(reqStub, resStub)
      // then
      expect(findApplicationData.mock.calls[0][0]).to.deep.equal({
        where: { unique_app_id: 'test_unique_app_id' },
      })
    })

    it('should render openEApp.ejs page with correct data', async () => {
      // when - beforeEach runs
      await OpenEAppController.renderPage(reqStub, resStub)
      // then
      expect(resStub.view.mock.calls[0][1]).to.deep.equal({
        ...expectedPageData,
        userRef: '123456',
        user_data: { loggedIn: true },
        daysLeftToDownload: 0,
        applicationExpired: false,
        applicationStatus: resolvedOrbitData[0].status,
        allDocumentsRejected: false,
        someDocumentsRejected: false,
        caseManagementReceiptLocation: undefined,
        canDownloadReceipt: false,
      })
    })
  })

  describe('date countdown', () => {
    it('shows correct number of days for 11 day old application', async () => {
      // when
      vi.spyOn(Application, 'findOne').mockResolvedValue(resolvedAppData)
      resolvedOrbitData[0].status = 'Completed'
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      vi.spyOn(OpenEAppController, '_getApplicationDataFromOrbit').mockResolvedValue(resolvedOrbitData)
      vi.spyOn(OpenEAppController, '_getUserRef').mockResolvedValue('')
      vi.spyOn(Date, 'now').mockImplementation(() => TWELVE_DAYS_AFTER_COMPLETION)
      await OpenEAppController.renderPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][1].daysLeftToDownload).to.equal(9)
    })

    it('does not render a receipt download link when completed status has no receipt filename', async () => {
      // when
      vi.spyOn(Application, 'findOne').mockResolvedValue(resolvedAppData)
      const updatedOrbitData = [{ ...resolvedOrbitData[0], status: 'Completed', receiptFilename: null }]
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      vi.spyOn(OpenEAppController, '_getApplicationDataFromOrbit').mockResolvedValue(updatedOrbitData)
      vi.spyOn(OpenEAppController, '_getUserRef').mockResolvedValue('')
      vi.spyOn(Date, 'now').mockImplementation(() => TWELVE_DAYS_AFTER_COMPLETION)
      await OpenEAppController.renderPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][1].canDownloadReceipt).to.be.false
      expect(sails.log.warn.mock.calls[0][0]).to.equal(
        'Completed e-Apostille application missing receipt filename from Orbit',
      )
    })
  })

  describe('_calculateDaysLeftToDownload', () => {
    it('throws error if no date value found', () => {
      // when
      const fn = () =>
        OpenEAppController._calculateDaysLeftToDownload(
          {
            completedDate: null,
          },
          reqStub,
        )

      // then
      expect(fn).to.throw(Error, 'No date value found')
    })

    it('returns expected values', () => {
      // when
      const SEVEN_DAYS_AFTER_COMPLETION = 1629849600000
      const TWENTY_ONE_DAYS_AFTER_COMPLETION = 1631142000000

      const currentDates = [
        TWELVE_DAYS_AFTER_COMPLETION,
        SEVEN_DAYS_AFTER_COMPLETION,
        TWO_DAYS_AFTER_COMPLETION,
        TWENTY_ONE_DAYS_AFTER_COMPLETION,
      ]
      const expectedValues = [9, 14, 19, 0]
      const returnedValues = currentDates.map((currentDate) => {
        vi.spyOn(Date, 'now').mockImplementation(() => currentDate)
        const result = OpenEAppController._calculateDaysLeftToDownload(resolvedOrbitData[0], reqStub)
        Date.now.mockRestore()
        return result
      })

      // then
      expect(expectedValues).to.deep.equal(returnedValues)
    })
  })

  describe('downloadDocument', () => {
    it('throws if there are no documents found', () => {
      // when
      resolvedOrbitData[0].documents = null
      const fn = () => OpenEAppController._hasApplicationExpired(resolvedOrbitData[0], 21)

      // then
      expect(fn).to.throw()
    })

    it('returns true if total documents matches expired documents', () => {
      // when
      resolvedOrbitData[0].documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: true,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: true,
        },
      ]
      const result = OpenEAppController._hasApplicationExpired(resolvedOrbitData[0], 0)

      // then
      expect(result).to.be.true
    })

    it('returns true if only one document has downloadExpired as true', () => {
      // when
      resolvedOrbitData[0].documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: true,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ]
      const result = OpenEAppController._hasApplicationExpired(resolvedOrbitData[0], 21)

      // then
      expect(result).to.be.true
    })

    it('returns true if days left to download is below 0', () => {
      // when
      resolvedOrbitData[0].documents = [
        {
          name: 'client_document_2.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ]
      const result = OpenEAppController._hasApplicationExpired(resolvedOrbitData[0], -1)

      // then
      expect(result).to.be.true
    })
  })

  describe('downloadReceipt', () => {
    beforeEach(() => {
      vi.spyOn(stream, 'finished').mockReturnValue(null)
      vi.spyOn(util, 'promisify').mockImplementation(() => () => null)
    })

    it('triggers serverError when user is not logged in', async () => {
      // when
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: false,
      }))
      vi.spyOn(Application, 'findOne').mockResolvedValue({ user_id: 123 })
      await OpenEAppController.downloadReceipt(reqStub, resStub)

      // then
      expect(resStub.serverError.mock.calls).to.have.lengthOf(1)
    })

    it('triggers serverError if application ref is undefined', async () => {
      // when
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      reqStub.params.applicationRef = 'undefined'
      vi.spyOn(Application, 'findOne').mockResolvedValue({ user_id: 123 })
      await OpenEAppController.downloadReceipt(reqStub, resStub)

      // then
      expect(resStub.serverError.mock.calls).to.have.lengthOf(1)
    })

    it("prevents the user from downloading someone else's receipt", async () => {
      // when
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      vi.spyOn(Application, 'findOne').mockResolvedValue({ user_id: 456 })
      await OpenEAppController.downloadReceipt(reqStub, resStub)

      // then
      expect(resStub.serverError.mock.calls).to.have.lengthOf(1)
    })
  })

  describe('allDocumentsRejected', () => {
    beforeEach(() => {
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      vi.spyOn(Date, 'now').mockImplementation(() => TWELVE_DAYS_AFTER_COMPLETION)
      findApplicationData = vi.spyOn(Application, 'findOne').mockResolvedValue(resolvedAppData)
      vi.spyOn(OpenEAppController, '_getUserRef').mockResolvedValue('')
    })

    it('returns false if no documents rejected', async () => {
      // when
      const documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
      ]
      const updatedCasebookData = [{ ...resolvedOrbitData[0], documents }]
      vi.spyOn(OpenEAppController, '_getApplicationDataFromOrbit').mockResolvedValue(updatedCasebookData)
      await OpenEAppController.renderPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][1]).to.deep.equal({
        ...expectedPageData,
        userRef: '',
        user_data: { loggedIn: true },
        daysLeftToDownload: 9,
        applicationExpired: false,
        applicationStatus: 'Completed',
        someDocumentsRejected: false,
        allDocumentsRejected: false,
        caseManagementReceiptLocation: undefined,
        canDownloadReceipt: false,
        documents,
      })
    })

    it('returns false if some documents rejected', async () => {
      // when
      const documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Submitted',
          apostilleReference: '',
          downloadExpired: false,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Rejected',
          apostilleReference: '',
          downloadExpired: false,
        },
      ]
      const updatedCasebookData = [{ ...resolvedOrbitData[0], documents }]
      vi.spyOn(OpenEAppController, '_getApplicationDataFromOrbit').mockResolvedValue(updatedCasebookData)
      await OpenEAppController.renderPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][1]).to.deep.equal({
        ...expectedPageData,
        userRef: '',
        user_data: { loggedIn: true },
        daysLeftToDownload: 9,
        applicationExpired: false,
        applicationStatus: 'Completed',
        someDocumentsRejected: true,
        allDocumentsRejected: false,
        caseManagementReceiptLocation: undefined,
        canDownloadReceipt: false,
        documents,
      })
    })

    it('returns true if all documents rejected', async () => {
      // when
      const documents = [
        {
          name: 'client_document_1.pdf',
          status: 'Rejected',
          apostilleReference: '',
          downloadExpired: false,
        },
        {
          name: 'client_document_2.pdf',
          status: 'Rejected',
          apostilleReference: '',
          downloadExpired: false,
        },
      ]
      const updatedCasebookData = [{ ...resolvedOrbitData[0], documents }]
      vi.spyOn(OpenEAppController, '_getApplicationDataFromOrbit').mockResolvedValue(updatedCasebookData)
      await OpenEAppController.renderPage(reqStub, resStub)

      // then
      expect(resStub.view.mock.calls[0][1]).to.deep.equal({
        ...expectedPageData,
        userRef: '',
        user_data: { loggedIn: true },
        daysLeftToDownload: 9,
        applicationExpired: false,
        applicationStatus: 'Completed',
        someDocumentsRejected: true,
        allDocumentsRejected: true,
        caseManagementReceiptLocation: undefined,
        canDownloadReceipt: false,
        documents,
      })
    })
  })
})
