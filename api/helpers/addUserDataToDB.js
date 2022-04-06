const getUserModels = require('../userServiceModels/models.js');

async function addUserDataToDB(req, res) {
    try {
        const userModels = getUserModels(
            req._sails.config.userServiceSequelize
        );
        const userDataFromDB = await userModels.User.findOne({
            where: { email: req.session.email },
        });
        const accountDetailsFromDB = await userModels.AccountDetails.findOne({
            where: { user_id: userDataFromDB.id },
        });
        const userDetails = {
            application_id: req.session.appId,
            first_name: accountDetailsFromDB.first_name,
            last_name: accountDetailsFromDB.last_name,
            telephone: accountDetailsFromDB.telephone,
            mobileNo: accountDetailsFromDB.mobileNo,
            email: userDataFromDB.email,
            confirm_email: userDataFromDB.email,
            has_email: true,
        };

        await UsersBasicDetails.create(userDetails);
    } catch (error) {
        sails.log.error(error);
        res.serverError();
    }
}

module.exports = addUserDataToDB;
