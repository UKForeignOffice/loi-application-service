const { Sequelize, DataTypes } = require('sequelize');

const commonConfig = require('../../config/datastores');
const environmentConfig = commonConfig.datastores;

function exposedUserModels() {
    const databaseOptions = {
        define: {
            freezeTableName: true,
        },
        retry: {
          base: 1000,
          multiplier: 2,
          max: 5000,
        },
        logging: process.env.NODE_ENV !== 'development' ? false : console.log,
    };
    const sequelize = new Sequelize(
        environmentConfig.userDb.url,
        databaseOptions
    );

    return {
      AccountDetails: require('./AccountDetails')(sequelize, DataTypes),
      SavedAddress: require('./SavedAddress')(sequelize, DataTypes),
      User: require('./User')(sequelize, DataTypes),
      sequelize
  };
}
module.exports = exposedUserModels();
