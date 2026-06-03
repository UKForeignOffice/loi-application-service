const orbitGetMock = vi.fn()

let OrbitService
let HelperService
let axiosCreateSpy

describe('OrbitService', () => {
  beforeEach(() => {
    orbitGetMock.mockReset()
    delete require.cache[require.resolve('../../api/services/OrbitService')]

    const axios = require('axios')
    axiosCreateSpy = vi.spyOn(axios, 'create').mockReturnValue({
      get: orbitGetMock,
    })

    OrbitService = require('../../api/services/OrbitService')
    HelperService = require('../../api/services/HelperService')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('axios instance setup', () => {
    it('creates an axios instance with JSON headers and query serializer', () => {
      expect(axiosCreateSpy).toHaveBeenCalledTimes(1)

      const createArgs = axiosCreateSpy.mock.calls[0][0]

      expect(createArgs.headers).to.deep.equal({
        'Content-Type': 'application/json; charset=utf-8',
      })
      expect(createArgs.paramsSerializer).to.be.a('function')
    })
  })

  describe('getApplicationStatusFromOrbit', () => {
    it('requests Orbit application status using auth token and returns payload', async () => {
      vi.spyOn(HelperService, 'getEdmsAccessToken').mockResolvedValue('test-token')
      orbitGetMock.mockResolvedValue({
        data: { status: 'submitted' },
      })

      const consoleLogStub = vi.spyOn(console, 'log').mockImplementation(() => {})

      const result = await OrbitService.getApplicationStatusFromOrbit('APP-123')

      expect(result).to.deep.equal({ status: 'submitted' })
      expect(orbitGetMock).toHaveBeenCalledTimes(1)
      expect(orbitGetMock.mock.calls[0][0]).to.equal('/api/v1/getApplicationStatusUpdate')
      expect(orbitGetMock.mock.calls[0][1]).to.deep.equal({
        params: {
          applicationReference: 'APP-123',
        },
        timeout: 5000,
        headers: {
          Authorization: 'Bearer test-token',
        },
      })
      expect(consoleLogStub).toHaveBeenCalledTimes(2)
    })

    it('logs and rethrows Orbit request errors', async () => {
      const orbitError = new Error('Orbit unavailable')
      vi.spyOn(HelperService, 'getEdmsAccessToken').mockResolvedValue('test-token')
      orbitGetMock.mockRejectedValue(orbitError)

      const consoleErrorStub = vi.spyOn(console, 'error').mockImplementation(() => {})

      try {
        await OrbitService.getApplicationStatusFromOrbit('APP-456')
        throw new Error('Expected getApplicationStatusFromOrbit to throw')
      } catch (error) {
        expect(error).to.equal(orbitError)
      }

      expect(consoleErrorStub).toHaveBeenCalledTimes(1)
      expect(consoleErrorStub.mock.calls[0][0]).to.contain('getApplicationStatusFromOrbit:')
    })
  })

  describe('getApplicationsStatusesFromOrbit', () => {
    it('throws when results is not an array', () => {
      expect(() => OrbitService.getApplicationsStatusesFromOrbit('invalid')).to.throw(
        'results argument must be an array',
      )
    })

    it('maps unique_app_id values and requests statuses in one Orbit call', async () => {
      vi.spyOn(HelperService, 'getEdmsAccessToken').mockResolvedValue('batch-token')
      orbitGetMock.mockResolvedValue({
        data: [{ applicationReference: 'APP-1', status: 'complete' }],
      })

      const consoleLogStub = vi.spyOn(console, 'log').mockImplementation(() => {})

      const results = [{ unique_app_id: 'APP-1' }, { unique_app_id: 'APP-2' }]

      const response = await OrbitService.getApplicationsStatusesFromOrbit(results)

      expect(response).to.deep.equal([{ applicationReference: 'APP-1', status: 'complete' }])
      expect(orbitGetMock).toHaveBeenCalledTimes(1)
      expect(orbitGetMock.mock.calls[0][1].params).to.deep.equal({
        applicationReference: ['APP-1', 'APP-2'],
      })
      expect(consoleLogStub).toHaveBeenCalledTimes(2)
    })
  })
})
