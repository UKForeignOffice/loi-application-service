const {Sequelize, DataTypes} = require('sequelize');

// get environment specific config
const commonConfig = require('../../config/datastores');
const environmentConfig = commonConfig.datastores;

// database options
const opts = {
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true
  },
  retry: {
    base: 1000,
    multiplier: 2,
    max: 5000,
  },
  logging: process.env.NODE_ENV !== 'development' ? false : console.log
};

// initialise Sequelize
const sequelize = new Sequelize(environmentConfig.default.url, opts);

module.exports.sequelize = sequelize;
module.exports.AdditionalApplicationInfo = require('./AdditionalApplicationInfo')(sequelize, DataTypes)
module.exports.AddressDetails = require('./AddressDetails')(sequelize, DataTypes)
module.exports.Application = require('./Application')(sequelize, DataTypes)
module.exports.ApplicationPaymentDetails = require('./ApplicationPaymentDetails')(sequelize, DataTypes)
module.exports.ApplicationReference = require('./ApplicationReference')(sequelize, DataTypes)
module.exports.ApplicationType = require('./ApplicationType')(sequelize, DataTypes)
module.exports.AvailableDocuments = require('./AvailableDocuments')(sequelize, DataTypes)
module.exports.DocumentTypes = require('./DocumentTypes')(sequelize, DataTypes)
module.exports.ExportedApplicationData = require('./ExportedApplicationData')(sequelize, DataTypes)
module.exports.ExportedEAppData = require('./ExportedEAppData')(sequelize, DataTypes)
module.exports.PostagesAvailable = require('./PostagesAvailable')(sequelize, DataTypes)
module.exports.UploadedDocumentUrls = require('./UploadedDocumentUrls')(sequelize, DataTypes)
module.exports.UserDocumentCount = require('./UserDocumentCount')(sequelize, DataTypes)
module.exports.UserDocuments = require('./UserDocuments')(sequelize, DataTypes)
module.exports.UserPostageDetails = require('./UserPostageDetails')(sequelize, DataTypes)
module.exports.UsersBasicDetails = require('./UsersBasicDetails')(sequelize, DataTypes)
