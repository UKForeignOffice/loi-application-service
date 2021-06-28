require('dotenv').config();
var applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);

module.exports.datastores = {
  default: {
    adapter: 'sails-postgresql',
    url: `postgresql://${applicationDatabase.user}:${applicationDatabase.password}@${applicationDatabase.host}:${applicationDatabase.port}/${applicationDatabase.database}`
  }
};
