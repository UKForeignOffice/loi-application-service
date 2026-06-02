const EAppReferenceController = require('../../api/controllers/EAppReferenceController')
const HelperService = require('../../api/services/HelperService')

describe('EAppReferenceController', () => {
  let reqStub = {}
  let resStub = {}

  beforeEach(() => {
    reqStub = {
      body: {
        'user-reference': 136542,
      },
      flash: vi.fn(),
      session: {
        eApp: {
          userRef: 136542,
        },
      },
    }
    resStub = {
      forbidden: vi.fn(),
      response: vi.fn(),
      view: vi.fn(),
      redirect: vi.fn(),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('renderPage', () => {
    it('prevents users from seeing the page if they are not logged in', () => {
      // when
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: false,
      }))
      EAppReferenceController.renderPage(reqStub, resStub)

      // then
      expect(resStub.forbidden.mock.calls).to.have.lengthOf(1)
    })

    it('returns reference view with correct data', () => {
      // when
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      EAppReferenceController.renderPage(reqStub, resStub)

      // then
      const expectedValue = {
        user_data: {
          loggedIn: true,
        },
        userRef: 136542,
        maxReferenceLength: 30,
        referenceErrors: [],
      }

      expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/additionalReference.ejs')
      expect(resStub.view.mock.calls[0][1]).to.deep.equal(expectedValue)
    })
  })

  describe('addReferenceToSession', () => {
    it('updates session with new userRef and redirects', () => {
      // when
      reqStub.body['user-reference'] = 'TestRef'
      EAppReferenceController.addReferenceToSession(reqStub, resStub)

      // then
      expect(reqStub.session.eApp.userRef).to.equal('TestRef')
      expect(resStub.redirect.mock.calls[0][0]).to.equal('/check-uploaded-documents')
    })

    it('returns error page if user ref is more than max characters', () => {
      // when
      reqStub.body['user-reference'] = 'sjdkfotjgnfmdksodjrtjskeorkslakri'
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      EAppReferenceController.addReferenceToSession(reqStub, resStub)

      // then
      const expectedErrorMsg = {
        title: 'Your reference is too long',
        text: 'Your reference must be 30 characters or fewer',
      }
      expect(reqStub.flash.mock.calls[0][1]).to.deep.equal([expectedErrorMsg])
    })

    it('shows error page if user ref contains illegal characters', () => {
      // when
      reqStub.body['user-reference'] = 'TestRef@@@@$$$$&()'
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
      EAppReferenceController.addReferenceToSession(reqStub, resStub)

      // then
      const expectedErrorMsg = {
        title: 'There is a problem with your reference',
        text: 'The reference cannot use the following characters: $, &',
      }
      expect(reqStub.flash.mock.calls[0][1]).to.deep.equal([expectedErrorMsg])
    })
  })
})
