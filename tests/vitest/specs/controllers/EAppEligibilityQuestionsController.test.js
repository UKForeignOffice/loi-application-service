const EAppEligibilityQuestionsController = require('../../../../api/controllers/EAppEligibilityQuestionsController')
const HelperService = require('../../../../api/services/HelperService')

describe('EAppEligibilityQuestionsController', () => {
  let reqStub = {}
  let resStub = {}

  const urlParams = [
    'check-documents-are-eligible',
    'check-recipient-accepts-eapostilles',
    'check-documents-are-prepared',
  ]

  const radioInpuitNames = ['eapostille-acceptable', 'documents-eligible', 'notarised-and-signed']

  beforeEach(() => {
    vi.spyOn(sails.log, 'error')
    resStub = {
      forbidden: vi.fn(),
      redirect: vi.fn(),
      view: vi.fn(),
    }

    reqStub = {
      _sails: {
        config: {
          customURLs: {
            userServiceURL: 'test.com',
          },
        },
      },
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('renderPage functions', () => {
    it('should render the correct ejs pages based on the url param', () => {
      // when
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))

      for (const urlParam of urlParams) {
        reqStub.param = (arg) => arg === 'question' && urlParam
        EAppEligibilityQuestionsController.renderEligibilityQuestion(reqStub, resStub)
      }

      // then
      expect(resStub.view.mock.calls.length).to.equal(3)
      expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/eligibilityQuestionOne.ejs')
      expect(resStub.view.mock.calls[1][0]).to.equal('eApostilles/eligibilityQuestionTwo.ejs')
      expect(resStub.view.mock.calls[2][0]).to.equal('eApostilles/eligibilityQuestionThree.ejs')
    })
  })

  describe('handle answer functions', () => {
    beforeEach(() => {
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
        loggedIn: true,
      }))
    })

    it('should redirect to the correct path whene user selects YES radio button', () => {
      // when
      for (let i = 0; i < urlParams.length; i++) {
        reqStub = {
          body: {
            [radioInpuitNames[i]]: 'yes',
          },
        }
        reqStub.param = (arg) => arg === 'question' && urlParams[i]

        EAppEligibilityQuestionsController.handleEligibilityAnswers(reqStub, resStub)
      }

      // then
      expect(resStub.redirect.mock.calls.length).to.equal(3)
      expect(resStub.redirect.mock.calls[0][0]).to.equal('/eligibility/check-recipient-accepts-eapostilles')
      expect(resStub.redirect.mock.calls[1][0]).to.equal('/eligibility/check-documents-are-prepared')
      expect(resStub.redirect.mock.calls[2][0]).to.equal('/completing-your-application')
    })

    it('should redirect to the correct path whene user selects NO radio button', () => {
      // when
      for (let i = 0; i < urlParams.length; i++) {
        reqStub = {
          body: { [radioInpuitNames[i]]: 'no' },
        }
        reqStub.param = (arg) => arg === 'question' && urlParams[i]

        EAppEligibilityQuestionsController.handleEligibilityAnswers(reqStub, resStub)
      }

      // then
      expect(resStub.redirect.mock.calls.length).to.equal(3)
      expect(resStub.redirect.mock.calls[0][0]).to.equal('/exit-pages/you-cannot-apply-yet')
      expect(resStub.redirect.mock.calls[1][0]).to.equal('/exit-pages/check-recipient-accepts-eapostilles-exit')
      expect(resStub.redirect.mock.calls[2][0]).to.equal('/exit-pages/use-paper-based-service')
    })

    it("should pass page_error TRUE to question page if user doesn't choose an answer", () => {
      // when
      for (let i = 0; i < urlParams.length; i++) {
        reqStub = {
          body: { [radioInpuitNames[i]]: '' },
        }
        reqStub.param = (arg) => arg === 'question' && urlParams[i]

        EAppEligibilityQuestionsController.handleEligibilityAnswers(reqStub, resStub)
      }

      // then
      const expectedSecondArg = {
        user_data: {
          loggedIn: true,
        },
        page_error: true,
      }
      expect(resStub.view.mock.calls.length).to.equal(3)
      expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/eligibilityQuestionOne.ejs')
      expect(resStub.view.mock.calls[0][1]).to.deep.equal(expectedSecondArg)
      expect(resStub.view.mock.calls[1][0]).to.equal('eApostilles/eligibilityQuestionTwo.ejs')
      expect(resStub.view.mock.calls[1][1]).to.deep.equal(expectedSecondArg)
      expect(resStub.view.mock.calls[2][0]).to.equal('eApostilles/eligibilityQuestionThree.ejs')
      expect(resStub.view.mock.calls[2][1]).to.deep.equal(expectedSecondArg)
    })
  })
})
