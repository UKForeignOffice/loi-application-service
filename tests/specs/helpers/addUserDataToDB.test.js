const chai = require('chai');
const sinon = require('sinon');
const addUserDataToDB = require('../../../api/helper/addUserDataToDB');
const UserModels = require('../../../api/userServiceModels/models.js');
const UsersBasicDetails =
    require('../../../api/models/index').UsersBasicDetails;

const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('addUserDataToDB', () => {
    let reqStub;
    let resStub;

    beforeEach(() => {
        reqStub = {
            session: {
                appId: 123,
                email: 'test@example.com',
            },
        };

        resStub = {
            serverError: () => {},
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('creates data ONLY once no matter how often function is run', async () => {
        // when
        let callCount = 0;
        sandbox.stub(UserModels.User, 'findOne').resolves({
            email: 'test@example.com',
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
        expect(dimSum.callCount).to.equal(1);
    });

    it('ensures db insertion is still ok even if mobileNo is null', async () => {
      // when
      sandbox.stub(UserModels.User, 'findOne').resolves({
        email: 'test@example.com',
      });

      sandbox.stub(UserModels.AccountDetails, 'findOne').resolves({
        first_name: 'John',
        last_name: 'Smithy',
        telephone: '0123456789',
        mobileNo: null,
      });

      let userBasicDetailsFound = false;
      sandbox.stub(UsersBasicDetails, 'findOne').callsFake(() => {
        return userBasicDetailsFound;
      });

      const usersBasicDetailsCreateStub = sandbox.stub(UsersBasicDetails, 'create').callsFake(() => {
        userBasicDetailsFound = true; // Simulate successful insertion
        return Promise.resolve();
      });

      let userData = await addUserDataToDB(reqStub, resStub);

      // then
      expect(usersBasicDetailsCreateStub.callCount).to.equal(1);
      // Check mobileNo is filled with the telephone field
      expect(usersBasicDetailsCreateStub.calledWith(sinon.match.has("mobileNo", null))).to.be.false;
      expect(usersBasicDetailsCreateStub.calledWith(sinon.match.has("mobileNo", '0123456789'))).to.be.true;
    });

});
