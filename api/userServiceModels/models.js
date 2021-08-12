const UserMeta = require('./User.js');
const AccountDetailsMeta = require('./AccountDetails.js');
const SavedAddressMeta = require('./SavedAddress.js');

// you can define relationships here

module.exports = (usersDbConn) => {
    const User = usersDbConn.define(
        'Users',
        UserMeta.attributes,
        UserMeta.options
    );
    const AccountDetails = usersDbConn.define(
        'AccountDetails',
        AccountDetailsMeta.attributes,
        AccountDetailsMeta.options
    );
    const SavedAddress = usersDbConn.define(
        'SavedAddress',
        SavedAddressMeta.attributes,
        SavedAddressMeta.options
    );

    return {
        User,
        AccountDetails,
        SavedAddress,
    };
};
