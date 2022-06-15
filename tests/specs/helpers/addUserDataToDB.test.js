const { expect } = require('chai');
const sinon = require('sinon');
const addUserDataToDB = require('../../../api/helper/addUserDataToDB');
const UserModels = require('../../../api/userServiceModels/models.js');
const UsersBasicDetails = require('../../../api/models/index').UsersBasicDetails;

const sandbox = sinon.sandbox.create();

describe('addUserDataToDB', () => {
    let reqStub;
    let resStub;

    beforeEach(() => {
        reqStub = {
            session: {
                appId: 123,
                email: 'test@example.com'
            }
        }

        resStub = {
            serverError: () => {}
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('creates data ONLY once no matter how often function is run', async () => {
        // when
        sandbox.stub(UserModels.User, 'findOne').resolves({
            email: 'test@example.com'
        });

        sandbox.stub(UserModels.AccountDetails, 'findOne').resolves({
            first_name: 'Joe',
            last_name: 'Bloggs',
            telephone: '0123456789',
            mobileNo: '07123456789',
        });

        const createUserDetails = sandbox.spy(UsersBasicDetails, 'create');

        let data = await addUserDataToDB(reqStub, resStub);
        data = await addUserDataToDB(reqStub, resStub);
        data = await addUserDataToDB(reqStub, resStub);
        data = await addUserDataToDB(reqStub, resStub);

        // then
        expect(createUserDetails.calledOnce).to.be.true;
    })
})