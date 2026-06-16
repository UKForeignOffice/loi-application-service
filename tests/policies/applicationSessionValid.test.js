const applicationSessionValid = require('../../api/policies/applicationSessionValid')

describe('applicationSessionValid policy', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls next when appId exists and is not zero', () => {
    const req = {
      session: {
        appId: 123,
      },
    }
    const res = {
      clearCookie: vi.fn(),
      redirect: vi.fn(),
    }
    const next = vi.fn()

    applicationSessionValid(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.clearCookie).not.toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('clears login cookie, resets appId, and redirects when appId is missing', () => {
    const req = {
      session: {},
    }
    const res = {
      clearCookie: vi.fn(),
      redirect: vi.fn(),
    }
    const next = vi.fn()

    applicationSessionValid(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.clearCookie).toHaveBeenCalledTimes(1)
    expect(res.clearCookie).toHaveBeenCalledWith('LoggedIn')
    expect(req.session.appId).to.equal(false)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('/session-expired')
  })

  it('clears login cookie, resets appId, and redirects when appId is zero', () => {
    const req = {
      session: {
        appId: 0,
      },
    }
    const res = {
      clearCookie: vi.fn(),
      redirect: vi.fn(),
    }
    const next = vi.fn()

    applicationSessionValid(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.clearCookie).toHaveBeenCalledWith('LoggedIn')
    expect(req.session.appId).to.equal(false)
    expect(res.redirect).toHaveBeenCalledWith('/session-expired')
  })
})
