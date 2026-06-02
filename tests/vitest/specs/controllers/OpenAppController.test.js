const summaryController = require('../../../../api/controllers/SummaryController')
const OpenPaperAppController = require('../../../../api/controllers/OpenPaperAppController')
const Application = require('../../../../api/models/index').Application

describe('openCoverSheet', () => {
  let reqStub
  let resStub
  function makeRes() {
    const res = {}
    res.status = vi.fn().mockImplementation(() => res)
    res.send = vi.fn()
    res.view = vi.fn()
    return res
  }

  beforeEach(() => {
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
    vi.restoreAllMocks()
  })

  it("returns 500 when session and db user ids don't match", async () => {
    vi.spyOn(Application, 'findOne').mockResolvedValue({
      user_id: 100,
      application_id: 124,
    })

    await OpenPaperAppController.openCoverSheet(reqStub, resStub)

    expect(resStub.status.mock.calls[0][0]).to.equal(500)
    expect(resStub.send.mock.calls[0][0]).to.deep.equal({ message: 'Server error' })
  })

  it('returns 500 when user is not logged in', async () => {
    reqStub.session = {} // no passport.user
    resStub = makeRes()
    vi.spyOn(Application, 'findOne').mockResolvedValue({
      user_id: 100,
      application_id: 124,
    })

    await OpenPaperAppController.openCoverSheet(reqStub, resStub)

    expect(resStub.status.mock.calls[0][0]).to.equal(500)
    expect(resStub.send.mock.calls[0][0]).to.deep.equal({ message: 'Server error' })
  })

  it('runs fetchAll function if session and db user ids match', async () => {
    const fetchAllFn = vi.spyOn(summaryController, 'fetchAll').mockResolvedValue()
    vi.spyOn(Application, 'findOne').mockResolvedValue({
      user_id: 123,
      application_id: 124,
    })

    await OpenPaperAppController.openCoverSheet(reqStub, resStub)

    expect(fetchAllFn.mock.calls).to.not.be.empty
  })
})
