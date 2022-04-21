const {Sequelize, DataTypes} = require('sequelize');

// get environment specific config
const commonConfig = require('../../config/datastores');
const environmentConfig = commonConfig.datastores;

// database options
const opts = {
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true,
    logging: false
  }
};

module.exports = () => {

// initialise Sequelize
  let sequelize = new Sequelize(environmentConfig.userDb.url, opts);
  const AccountDetails = require('./AccountDetails')(sequelize, DataTypes)
  const SavedAddress = require('./SavedAddress')(sequelize, DataTypes)
  const User = require('./User')(sequelize, DataTypes)
  return {AccountDetails, SavedAddress, User, sequelize}
}

