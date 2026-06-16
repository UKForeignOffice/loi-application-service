const request = require('supertest')
const sails = require('sails')
const PublicController = require('../../api/controllers/PublicController')

describe('PublicController unit tests', () => {
  let originalServicePublic
  let originalStartUrl

  beforeEach(() => {
    if (typeof originalServicePublic === 'undefined') {
      originalServicePublic = sails.config.views.locals.service_public
    }
    if (typeof originalStartUrl === 'undefined') {
      originalStartUrl = sails.config.views.locals.start_url
    }
  })

  afterEach(() => {
    sails.config.views.locals.service_public = originalServicePublic
    sails.config.views.locals.start_url = originalStartUrl
    vi.restoreAllMocks()
  })

  it('startPage redirects to configured start_url when service_public is true', () => {
    sails.config.views.locals.service_public = true
    sails.config.views.locals.start_url = '/maintenance'

    const res = {
      redirect: vi.fn(),
      view: vi.fn(),
    }

    PublicController.startPage({}, res)

    expect(res.redirect).toHaveBeenCalledWith('/maintenance')
    expect(res.view).not.toHaveBeenCalled()
  })

  it('startPage renders index when service_public is false', () => {
    sails.config.views.locals.service_public = false

    const res = {
      redirect: vi.fn(),
      view: vi.fn(),
    }

    PublicController.startPage({}, res)

    expect(res.view).toHaveBeenCalledWith('index')
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('getQRCode ends response for invalid app id', () => {
    const req = {
      params: {
        appId: 'invalid-id',
      },
    }
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    }

    const consoleLogStub = vi.spyOn(console, 'log').mockImplementation(() => {})

    PublicController.getQRCode(req, res)

    expect(consoleLogStub).toHaveBeenCalledTimes(1)
    expect(res.end).toHaveBeenCalledTimes(1)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('generateCoverSheetQRCode ends response for invalid qrText payload', () => {
    const req = {
      params: {
        qrText: Buffer.from('invalid payload', 'ascii').toString('base64'),
      },
    }
    const res = {
      setHeader: vi.fn(),
      end: vi.fn(),
    }

    const consoleLogStub = vi.spyOn(console, 'log').mockImplementation(() => {})

    PublicController.generateCoverSheetQRCode(req, res)

    expect(consoleLogStub).toHaveBeenCalledTimes(1)
    expect(res.end).toHaveBeenCalledTimes(1)
    expect(res.setHeader).not.toHaveBeenCalled()
  })

  it('maintenance renders maintenance view', () => {
    const res = {
      view: vi.fn(),
    }

    PublicController.maintenance({}, res)

    expect(res.view).toHaveBeenCalledWith('maintenance')
  })

  it('survey renders survey view', () => {
    const res = {
      view: vi.fn(),
    }

    PublicController.survey({}, res)

    expect(res.view).toHaveBeenCalledWith('survey')
  })
})

describe('PublicController integration tests', () => {
  let originalServicePublic
  let originalStartUrl

  beforeEach(() => {
    if (typeof originalServicePublic === 'undefined') {
      originalServicePublic = sails.config.views.locals.service_public
    }
    if (typeof originalStartUrl === 'undefined') {
      originalStartUrl = sails.config.views.locals.start_url
    }
  })

  afterEach(() => {
    sails.config.views.locals.service_public = originalServicePublic
    sails.config.views.locals.start_url = originalStartUrl
  })

  it('GET / redirects to start_url when service_public is true', async () => {
    sails.config.views.locals.service_public = true
    sails.config.views.locals.start_url = '/maintenance'

    await request(sails.hooks.http.app).get('/').expect(302).expect('Location', '/maintenance')
  })

  it('GET /qr-code-converter/:appId returns png for valid app id', async () => {
    const validAppId = 'A-A-12-1234-5678-ABCD'

    const response = await request(sails.hooks.http.app).get(`/qr-code-converter/${validAppId}`).expect(200)

    expect(response.headers['content-type']).to.contain('image/png')
    expect(response.body.length).to.be.greaterThan(0)
  })

  it('GET /qr-code-converter/:appId returns no png for invalid app id', async () => {
    const response = await request(sails.hooks.http.app).get('/qr-code-converter/not-a-valid-app-id').expect(200)

    expect(response.headers['content-type'] || '').to.not.contain('image/png')
  })

  it('GET /cover-sheet-qr-code-converter/:qrText returns png for valid payload', async () => {
    const qrText = 'coversheet,123,A-A-12-1234-5678-ABCD'
    const encoded = encodeURIComponent(Buffer.from(qrText, 'ascii').toString('base64'))

    const response = await request(sails.hooks.http.app).get(`/cover-sheet-qr-code-converter/${encoded}`).expect(200)

    expect(response.headers['content-type']).to.contain('image/png')
    expect(response.body.length).to.be.greaterThan(0)
  })

  it('GET /cover-sheet-qr-code-converter/:qrText ends response for invalid payload', async () => {
    const encoded = encodeURIComponent(Buffer.from('bad-value', 'ascii').toString('base64'))

    const response = await request(sails.hooks.http.app).get(`/cover-sheet-qr-code-converter/${encoded}`).expect(200)

    expect(response.headers['content-type'] || '').to.not.contain('image/png')
  })
})
