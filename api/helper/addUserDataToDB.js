const UserModels = require('../userServiceModels/models.js');
const UsersBasicDetails = require('../models/index').UsersBasicDetails;

async function addUserDataToDB(req, res) {
    try {
        const userDataFromDB = await UserModels.User.findOne({
            where: { email: req.session.email },
        });
        const accountDetailsFromDB = await UserModels.AccountDetails.findOne({
            where: { user_id: userDataFromDB.id },
        });

        if (accountDetailsFromDB.first_name === null
          || accountDetailsFromDB.last_name === null
          || (accountDetailsFromDB.telephone === null && accountDetailsFromDB.mobileNo === null)) {
          return res.serverError(`Reject this application as some user account details are null`);
        }

        const userDetails = {
            application_id: req.session.appId,
            first_name: accountDetailsFromDB.first_name,
            last_name: accountDetailsFromDB.last_name,
            telephone: accountDetailsFromDB.telephone,
            mobileNo: accountDetailsFromDB.mobileNo || accountDetailsFromDB.telephone,
            email: userDataFromDB.email,
            confirm_email: userDataFromDB.email,
            has_email: true,
        };

        const dataForThisApplicationAlreadyExists =
            await UsersBasicDetails.findOne({
                where: { application_id: userDetails.application_id },
            });

        if (dataForThisApplicationAlreadyExists) return true;

        await UsersBasicDetails.create(userDetails);

        return true;
    } catch (error) {
        sails.log.error(error);
        res.serverError();
    }
}

module.exports = addUserDataToDB;
