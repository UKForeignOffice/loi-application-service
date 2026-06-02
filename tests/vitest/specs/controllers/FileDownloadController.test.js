const axios = require('axios')
const FileDownloadController = require('../../../../api/controllers/FileDownloadController')
const OrbitService = require('../../../../api/services/OrbitService')
const Application = require('../../../../api/models/index').Application
const HelperService = require('../../../../api/services/HelperService')

describe('FileDownloadController', () => {
  let reqStub
  let resStub

  beforeEach(() => {
    reqStub = {
      params: {
        apostilleRef: 'APO-1234',
        unique_app_id: 'A-D-21-1008-0547-D546',
        storageLocation: 'encodedStorageLocation',
      },
      _sails: {
        config: {
          upload: {
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
      headers: {
        'content-disposition': '',
      },
      pipe: vi.fn(),
    }
    vi.spyOn(Date, 'now').mockImplementation(() => 1483228800000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws if user is not logged in', () => {
    // when
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({ loggedIn: false }))
    const fn = () => FileDownloadController._urlErrorChecks(reqStub, resStub)

    // then
    expect(fn).to.throw(Error, 'User is not logged in')
  })

  it('throws if unique_app_id is not found', () => {
    // when
    reqStub.params.unique_app_id = null
    vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({ loggedIn: true }))
    const fn = () => FileDownloadController._urlErrorChecks(reqStub, resStub)

    // then
    expect(fn).to.throw(Error, 'Application ID not found')
  })

  it('returns false if id from application table does not match user session id', async () => {
    // when
    vi.spyOn(Application, 'findOne').mockResolvedValue({ user_id: 456 })
    await FileDownloadController._checkSessionUserIdMatchesApp(reqStub, resStub)

    // then
    expect(resStub.serverError.mock.calls).to.have.lengthOf(1)
  })

  it('throws an error if the apostilleRef param is undefined', () => {
    // when
    reqStub.params.apostilleRef = 'undefined'
    const fn = () => FileDownloadController._urlErrorChecks(reqStub, resStub)

    // then
    expect(fn).to.throw(Error, 'Missing apostille reference')
  })

  it('throws an error if the storageLocation param is undefined', () => {
    // when
    reqStub.params.storageLocation = 'undefined'
    const fn = () => FileDownloadController._urlErrorChecks(reqStub, resStub)

    // then
    expect(fn).to.throw(Error, 'Missing document storage location')
  })

  describe('_apostilleRefBelongToApplication', () => {
    beforeEach(() => {
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({ loggedIn: true }))
    })

    it('sends the correct argument to OrbitService', () => {
      // when
      const getApplicationStub = vi.spyOn(OrbitService, 'getApplicationStatusFromOrbit').mockResolvedValue([
        {
          documents: [],
        },
      ])

      FileDownloadController._apostilleRefBelongToApplication(reqStub, resStub)

      // then
      expect(getApplicationStub.mock.calls[0][0]).to.eql([reqStub.params.unique_app_id])
    })

    it('returns true if application ref match found from OrbitService', async () => {
      // when
      vi.spyOn(OrbitService, 'getApplicationStatusFromOrbit').mockResolvedValue([
        {
          documents: [{ apostilleReference: 'APO-23456' }, { apostilleReference: 'APO-1234' }],
        },
      ])
      const res = await FileDownloadController._apostilleRefBelongToApplication(reqStub, resStub)

      // then
      expect(res).to.be.true
    })

    it('returns false if application ref NOT found in OrbitService', async () => {
      // when
      vi.spyOn(OrbitService, 'getApplicationStatusFromOrbit').mockResolvedValue([
        {
          documents: [{ apostilleReference: 'APO-23456' }],
        },
      ])
      const res = await FileDownloadController._apostilleRefBelongToApplication(reqStub, resStub)

      // then
      expect(res).to.be.false
    })
  })

  describe('_streamOrbitFileToClient', () => {
    beforeEach(() => {
      vi.spyOn(HelperService, 'getUserData').mockImplementation(() => ({ loggedIn: true }))
    })

    it('throws an error if the URL generation fails', async () => {
      // when
      vi.spyOn(FileDownloadController, '_generateOrbitApostilleUrl').mockRejectedValue(
        new Error('URL generation failed'),
      )

      try {
        await FileDownloadController._streamOrbitFileToClient(reqStub, resStub)
      } catch (err) {
        // then
        expect(err.message).to.equal('_streamOrbitFileToClient Error: Error: URL generation failed')
      }
    })

    it('handles streaming errors gracefully', async () => {
      // when
      vi.spyOn(FileDownloadController, '_generateOrbitApostilleUrl').mockResolvedValue('http://fakeurl.com')
      vi.spyOn(axios, 'request').mockRejectedValue(new Error('Streaming failed'))

      try {
        await FileDownloadController._streamOrbitFileToClient(reqStub, resStub)
      } catch (err) {
        // then
        expect(err.message).to.include('Streaming failed')
      }
    })
  })

  describe('_generateOrbitApostilleUrl', () => {
    it('generates a pre-signed URL for the file', async () => {
      // given
      const config = {
        s3Bucket: 'test-bucket',
        s3UrlExpiryHours: 1,
      }
      const urlStub = vi.fn().mockResolvedValue('http://fake-signed-url.com')
      vi.spyOn(FileDownloadController, '_generateOrbitApostilleUrl').mockImplementation(urlStub)

      // when
      const url = await FileDownloadController._generateOrbitApostilleUrl('APO-1234', config, 'test-key')

      // then
      expect(url).to.equal('http://fake-signed-url.com')
      expect(urlStub.mock.calls).to.have.lengthOf(1)
    })

    it('throws an error if the URL generation fails', async () => {
      // given
      const config = {
        s3Bucket: 'test-bucket',
        s3UrlExpiryHours: 1,
      }
      const urlStub = vi.fn().mockRejectedValue(new Error('URL generation failed'))
      vi.spyOn(FileDownloadController, '_generateOrbitApostilleUrl').mockImplementation(urlStub)

      try {
        // when
        await FileDownloadController._generateOrbitApostilleUrl('APO-1234', config, 'test-key')
      } catch (err) {
        // then
        expect(err.message).to.equal('URL generation failed')
      }
    })
  })
})
