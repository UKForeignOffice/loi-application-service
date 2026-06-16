const EAppSkipPageController = require('../../api/controllers/EAppSkipPageController')

describe('EAppSkipPageController', () => {
  let reqStub = {}
  let resStub = {}

  beforeEach(() => {
    reqStub = {
      body: {
        'documents-suitable': '',
      },
      flash: () => [],
      _sails: {
        config: {
          customURLs: {
            userServiceURL: 'test.com',
          },
        },
      },
      session: {
        eApp: {},
      },
    }

    resStub = {
      redirect: vi.fn(),
      view: vi.fn(),
    }

    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({
      some: 'data',
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the page when renderPage() is called', () => {
    // when
    EAppSkipPageController.renderPage(reqStub, resStub)

    // then
    expect(resStub.view.mock.calls[0][0]).to.equal('eApostilles/eAppSkipPage.ejs')
    expect(resStub.view.mock.calls[0][1]).to.deep.equal({
      user_data: {
        some: 'data',
      },
      page_error: '',
    })
  })

  it('renders page with page_error true if no radio options selected', () => {
    // when
    reqStub.flash = () => 'You must answer this question'
    reqStub.body['documents-suitable'] = undefined
    EAppSkipPageController.handleChoice(reqStub, resStub)

    // then
    expect(resStub.view.mock.calls[0][1]).to.deep.equal({
      user_data: {
        some: 'data',
      },
      page_error: 'You must answer this question',
    })
  })

  it('redirects to suitability questions if YES radio selected', () => {
    // when
    reqStub.body['documents-suitable'] = 'yes'
    EAppSkipPageController.handleChoice(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls[0][0]).to.equal('/eligibility/check-documents-are-eligible')
  })

  it('redirects to sign in page if NO radio selected and user is NOT logged in', () => {
    // when
    reqStub.body['documents-suitable'] = 'no'
    vi.spyOn(HelperService, 'LoggedInStatus').mockImplementation(() => false)
    EAppSkipPageController.handleChoice(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls[0][0]).to.equal('test.com/sign-in?next=continueEApp&from=start')
  })

  it('redirects to file upload page if NO radio selected and user is logged in', () => {
    // when
    reqStub.body['documents-suitable'] = 'no'
    vi.spyOn(HelperService, 'LoggedInStatus').mockImplementation(() => true)
    EAppSkipPageController.handleChoice(reqStub, resStub)

    // then
    expect(resStub.redirect.mock.calls[0][0]).to.equal('/upload-files')
  })
})
