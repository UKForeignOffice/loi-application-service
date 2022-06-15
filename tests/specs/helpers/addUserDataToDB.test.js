const chai = require('chai');
const sinon = require('sinon');
const addUserDataToDB = require('../../../api/helper/addUserDataToDB');
const UserModels = require('../../../api/userServiceModels/models.js');
const UsersBasicDetails = require('../../../api/models/index').UsersBasicDetails;

const expect = chai.expect;
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
        let callCount = 0;
        sandbox.stub(UserModels.User, 'findOne').resolves({
            email: 'test@example.com'
        });

        sandbox.stub(UserModels.AccountDetails, 'findOne').resolves({
            first_name: 'John',
            last_name: 'Smithy',
            telephone: '0123456789',
            mobileNo: '07123456789',
        });

        sandbox.stub(UsersBasicDetails, 'findOne').callsFake(() => {
            if (callCount > 0) return true;
            callCount++;
            return false;
        });

        const dimSum = sandbox.stub(UsersBasicDetails, 'create').resolves();

        let userData = await addUserDataToDB(reqStub, resStub);
        userData = await addUserDataToDB(reqStub, resStub);
        userData = await addUserDataToDB(reqStub, resStub);
        userData = await addUserDataToDB(reqStub, resStub);

        // then
        expect(dimSum.callCount).to.equal(1)
    })
})