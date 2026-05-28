const { expect } = require('chai')
const sinon = require('sinon')
const summaryController = require('../../../api/controllers/SummaryController')
const OpenPaperAppController = require('../../../api/controllers/OpenPaperAppController')
const Application = require('../../../api/models/index').Application

describe('openCoverSheet', () => {
  let reqStub
  let resStub
  let sandbox

  function makeRes() {
    const res = {}
    res.status = sandbox.spy(function () {
      return res
    })
    res.send = sandbox.spy()
    res.view = sandbox.spy()
    return res
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    reqStub = {
      params: {
        unique_app_id: 'A-D-21-0920-2180-EEE1',
      },
      session: {
        passport: {
          user: 123,
        },
      },
    }
    resStub = makeRes()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it("returns 500 when session and db user ids don't match", async () => {
    sandbox.stub(Application, 'findOne').resolves({
      user_id: 100,
      application_id: 124,
    })

    await OpenPaperAppController.openCoverSheet(reqStub, resStub)

    expect(resStub.status.calledWith(500)).to.be.true
    expect(resStub.send.calledWith({ message: 'Server error' })).to.be.true
  })

  it('returns 500 when user is not logged in', async () => {
    reqStub.session = {} // no passport.user
    resStub = makeRes()
    sandbox.stub(Application, 'findOne').resolves({
      user_id: 100,
      application_id: 124,
    })

    await OpenPaperAppController.openCoverSheet(reqStub, resStub)

    expect(resStub.status.calledWith(500)).to.be.true
    expect(resStub.send.calledWith({ message: 'Server error' })).to.be.true
  })

  it('runs fetchAll function if session and db user ids match', async () => {
    const fetchAllFn = sandbox.stub(summaryController, 'fetchAll').resolves()
    sandbox.stub(Application, 'findOne').resolves({
      user_id: 123,
      application_id: 124,
    })

    await OpenPaperAppController.openCoverSheet(reqStub, resStub)

    expect(fetchAllFn.called).to.be.true
  })
})
