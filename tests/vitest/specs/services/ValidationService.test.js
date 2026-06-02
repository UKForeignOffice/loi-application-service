const ValidationService = require('../../../../api/services/ValidationService')
const LocationService = require('../../../../api/services/LocationService')

function makeReq(overrides = {}) {
  const body = {
    address_type: 'main',
    country: 'United Kingdom',
    manual: 'false',
    full_name: 'Test User',
    organisation: 'Org',
    postcode: 'SW1A 1AA',
    house_name: '10',
    street: 'Downing Street',
    town: 'London',
    county: 'Greater London',
    mobileNo: '+447700900123',
    telephone: '+442079250918',
    email: 'person@example.com',
    is_same: 'true',
  }

  Object.assign(body, overrides.body || {})

  const req = {
    body,
    session: {
      user_addresses: {
        main: {
          addresses: [],
          last_address_chosen: null,
        },
      },
      summary: {},
    },
    param(name) {
      return this.body[name]
    },
  }

  if (overrides.session) {
    req.session = overrides.session
  }

  if (overrides.param) {
    req.param = overrides.param
  }

  return req
}

describe('ValidationService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    delete global.HelperService
  })

  describe('buildAddressErrorArray', () => {
    it('renders UK manual address view when manual=true and country is UK', async () => {
      const req = makeReq({
        body: {
          manual: 'true',
          country: 'United Kingdom',
        },
      })

      const res = {
        view: vi.fn().mockReturnValue('rendered'),
      }

      global.HelperService = {
        getUserData: vi.fn().mockReturnValue({ loggedIn: true }),
      }

      vi.spyOn(LocationService, 'getCountries').mockResolvedValue([{ name: 'United Kingdom' }])

      const result = await ValidationService.buildAddressErrorArray({ errors: [] }, req, res)

      expect(result).to.equal('rendered')
      expect(res.view.mock.calls).to.have.lengthOf(1)
      expect(res.view.mock.calls[0][0]).to.equal('applicationForms/address/UKManualAddress.ejs')
    })

    it('renders international view and does not add postcode error for empty non-UK postcode', async () => {
      const req = makeReq({
        body: {
          country: 'France',
          postcode: '',
          manual: 'false',
        },
      })

      const res = {
        view: vi.fn().mockReturnValue('rendered'),
      }

      global.HelperService = {
        getUserData: vi.fn().mockReturnValue({ loggedIn: true }),
      }

      vi.spyOn(LocationService, 'getCountries').mockResolvedValue([{ name: 'France' }])

      await ValidationService.buildAddressErrorArray(
        {
          errors: [
            {
              message: JSON.stringify([
                {
                  questionId: 'seed_error',
                  errInfo: 'seed',
                  errSoltn: 'seed',
                },
              ]),
            },
          ],
        },
        req,
        res,
      )

      const options = res.view.mock.calls[0][1]
      const erroneousFields = options.error_report[1][0].erroneousFields

      expect(res.view.mock.calls[0][0]).to.equal('applicationForms/address/IntlAddress.ejs')
      expect(erroneousFields).to.not.include('postcode')
    })

    it('collects expected validation errors for missing and invalid fields', async () => {
      const req = makeReq({
        body: {
          full_name: '',
          postcode: '',
          house_name: '',
          street: '',
          town: '',
          country: '',
          telephone: '12',
          mobileNo: '',
          email: 'not-an-email',
          manual: 'false',
        },
      })

      const res = {
        view: vi.fn().mockReturnValue('rendered'),
      }

      global.HelperService = {
        getUserData: vi.fn().mockReturnValue({ loggedIn: true }),
      }

      vi.spyOn(LocationService, 'getCountries').mockResolvedValue([{ name: 'United Kingdom' }])

      await ValidationService.buildAddressErrorArray(
        {
          errors: [
            {
              message: JSON.stringify([
                {
                  questionId: 'seed_error',
                  errInfo: 'seed',
                  errSoltn: 'seed',
                },
              ]),
            },
          ],
        },
        req,
        res,
      )

      const erroneousFields = res.view.mock.calls[0][1].error_report[1][0].erroneousFields

      expect(erroneousFields).to.include('full_name')
      expect(erroneousFields).to.include('house_name')
      expect(erroneousFields).to.include('street')
      expect(erroneousFields).to.include('town')
      expect(erroneousFields).to.include('country')
      expect(erroneousFields).to.include('telephone')
      expect(erroneousFields).to.include('mobileNo')
      expect(erroneousFields).to.include('email')
    })

    it('preserves form validation errors passed in via model error payload', async () => {
      const req = makeReq()

      const res = {
        view: vi.fn().mockReturnValue('rendered'),
      }

      global.HelperService = {
        getUserData: vi.fn().mockReturnValue({ loggedIn: true }),
      }

      vi.spyOn(LocationService, 'getCountries').mockResolvedValue([{ name: 'United Kingdom' }])

      const error = {
        errors: [
          {
            message: JSON.stringify([
              {
                questionId: 'custom_field',
                errInfo: 'Some error',
                errSoltn: 'Fix it',
              },
            ]),
          },
        ],
      }

      await ValidationService.buildAddressErrorArray(error, req, res)

      const errMsgs = res.view.mock.calls[0][1].error_report[0][0].errMsgs
      const erroneousFields = res.view.mock.calls[0][1].error_report[1][0].erroneousFields

      expect(errMsgs[0].questionId).to.equal('custom_field')
      expect(erroneousFields).to.include('custom_field')
    })
  })
})
