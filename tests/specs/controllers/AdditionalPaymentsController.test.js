const { expect } = require('chai')
const sinon = require('sinon')

const AdditionalPaymentsController = require('../../../api/controllers/AdditionalPaymentsController')

describe('AdditionalPaymentsController', () => {
  const sandbox = sinon.createSandbox()

  let reqStub
  let resStub

  beforeEach(() => {
    global.sails = global.sails || { config: {} }
    sails.config = sails.config || {}

    reqStub = {
      method: 'GET',
      query: {},
      body: {},
      session: {},
    }

    resStub = {
      view: sandbox.stub(),
      redirect: sandbox.stub(),
      serverError: sandbox.stub(),
    }
  })

  afterEach(() => {
    sandbox.restore()
    if (global?.sails?.config?.payment) {
      delete global.sails.config.payment
    }
  })

  describe('start', () => {
    it('renders start page with defaults when query params are missing', () => {
      AdditionalPaymentsController.start(reqStub, resStub)

      expect(resStub.view.calledOnce).to.equal(true)
      expect(resStub.view.firstCall.args[0]).to.equal('additionalPayments/start.ejs')
      expect(resStub.view.firstCall.args[1]).to.deep.equal({
        errors: [],
        costError: false,
        costErrorAmount: false,
        emailError: false,
        applicationRef: '',
        applicationEmail: '',
        applicationAmount: '',
      })
    })

    it('renders start page with query params when provided', () => {
      reqStub.query = {
        ref: 'ABC123',
        email: 'payer@example.com',
        amount: '15.5',
      }

      AdditionalPaymentsController.start(reqStub, resStub)

      expect(resStub.view.firstCall.args[1]).to.include({
        applicationRef: 'ABC123',
        applicationEmail: 'payer@example.com',
        applicationAmount: '15.5',
      })
    })
  })

  describe('confirm', () => {
    it('redirects to start route for non-POST requests', () => {
      reqStub.method = 'GET'

      AdditionalPaymentsController.confirm(reqStub, resStub)

      expect(resStub.redirect.calledOnce).to.equal(true)
      expect(resStub.redirect.firstCall.args[0]).to.equal('/additional-payments')
    })

    it('returns validation errors for empty cost and invalid email', () => {
      reqStub.method = 'POST'
      reqStub.body = {
        applicationRef: 'A-123',
        applicationAmount: '',
        applicationEmail: 'not-an-email',
      }

      AdditionalPaymentsController.confirm(reqStub, resStub)

      expect(resStub.view.calledOnce).to.equal(true)
      expect(resStub.view.firstCall.args[0]).to.equal('additionalPayments/start.ejs')

      const viewData = resStub.view.firstCall.args[1]
      expect(viewData.costError).to.equal(true)
      expect(viewData.emailError).to.equal(true)
      expect(viewData.errors.map((err) => err.questionId)).to.include('applicationAmount')
      expect(viewData.errors.map((err) => err.questionId)).to.include('applicationEmail')
    })

    it('returns cost boundary error when amount is outside allowed range', () => {
      reqStub.method = 'POST'
      reqStub.body = {
        applicationRef: 'A-123',
        applicationAmount: '2',
        applicationEmail: 'payer@example.com',
      }

      AdditionalPaymentsController.confirm(reqStub, resStub)

      const viewData = resStub.view.firstCall.args[1]
      expect(viewData.costErrorAmount).to.equal(true)
      expect(viewData.errors.some((err) => err.msg === 'Amount must be between £3 and £4000')).to.equal(true)
    })

    it('sets session values and redirects to payment provider for valid POST data', () => {
      reqStub.method = 'POST'
      reqStub.body = {
        applicationRef: 'A-123',
        applicationAmount: '3.5',
        applicationEmail: 'payer@example.com',
      }
      sails.config.payment = {
        additionalPaymentStartPageUrl: 'https://payment.example/start',
      }

      AdditionalPaymentsController.confirm(reqStub, resStub)

      expect(reqStub.session.additionalPayments).to.deep.equal({
        applicationRef: 'A-123',
        applicationAmount: '3.50',
        applicationEmail: 'payer@example.com',
      })
      expect(resStub.redirect.calledOnce).to.equal(true)
      expect(resStub.redirect.firstCall.args[0]).to.equal(307)
      expect(resStub.redirect.firstCall.args[1]).to.equal('https://payment.example/start')
    })

    it('calls serverError when an exception is thrown', () => {
      reqStub.method = 'POST'
      reqStub.session = null
      reqStub.body = {
        applicationRef: 'A-123',
        applicationAmount: '5',
        applicationEmail: 'payer@example.com',
      }
      sails.config.payment = {
        additionalPaymentStartPageUrl: 'https://payment.example/start',
      }

      AdditionalPaymentsController.confirm(reqStub, resStub)

      expect(resStub.serverError.calledOnce).to.equal(true)
    })
  })
})
