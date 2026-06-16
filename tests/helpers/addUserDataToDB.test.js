const addUserDataToDB = require('../../api/helper/addUserDataToDB')
const UserModels = require('../../api/userServiceModels/models.js')
const UsersBasicDetails = require('../../api/models/index').UsersBasicDetails

describe('addUserDataToDB', () => {
  let reqStub
  let resStub

  beforeEach(() => {
    reqStub = {
      session: {
        appId: 123,
        email: 'test@example.com',
      },
    }

    resStub = {
      serverError: () => {},
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates data ONLY once no matter how often function is run', async () => {
    // when
    let callCount = 0
    vi.spyOn(UserModels.User, 'findOne').mockResolvedValue({
      email: 'test@example.com',
    })

    vi.spyOn(UserModels.AccountDetails, 'findOne').mockResolvedValue({
      first_name: 'John',
      last_name: 'Smithy',
      telephone: '0123456789',
      mobileNo: '07123456789',
    })

    vi.spyOn(UsersBasicDetails, 'findOne').mockImplementation(() => {
      if (callCount > 0) return true
      callCount++
      return false
    })

    const dimSum = vi.spyOn(UsersBasicDetails, 'create').mockResolvedValue()

    let _userData = await addUserDataToDB(reqStub, resStub)
    _userData = await addUserDataToDB(reqStub, resStub)
    _userData = await addUserDataToDB(reqStub, resStub)
    _userData = await addUserDataToDB(reqStub, resStub)

    // then
    expect(dimSum.mock.calls.length).to.equal(1)
  })

  it('ensures db insertion is still ok even if mobileNo is null', async () => {
    // when
    vi.spyOn(UserModels.User, 'findOne').mockResolvedValue({
      email: 'test@example.com',
    })

    vi.spyOn(UserModels.AccountDetails, 'findOne').mockResolvedValue({
      first_name: 'John',
      last_name: 'Smithy',
      telephone: '0123456789',
      mobileNo: null,
    })

    let userBasicDetailsFound = false
    vi.spyOn(UsersBasicDetails, 'findOne').mockImplementation(() => {
      return userBasicDetailsFound
    })

    const usersBasicDetailsCreateStub = vi.spyOn(UsersBasicDetails, 'create').mockImplementation(() => {
      userBasicDetailsFound = true // Simulate successful insertion
      return Promise.resolve()
    })

    const _userData = await addUserDataToDB(reqStub, resStub)

    // then
    expect(usersBasicDetailsCreateStub.mock.calls.length).to.equal(1)
    // Check mobileNo is filled with the telephone field
    expect(usersBasicDetailsCreateStub.mock.calls.some(([arg]) => arg?.mobileNo === null)).to.be.false
    expect(usersBasicDetailsCreateStub.mock.calls.some(([arg]) => arg?.mobileNo === '0123456789')).to.be.true
  })
})
