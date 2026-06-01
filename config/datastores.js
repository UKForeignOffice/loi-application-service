const applicationDatabase = require('./environment-variables').applicationDatabase
const userDatabase = require('./environment-variables').userserviceDatabase

module.exports.datastores = {
  default: {
    adapter: 'sails-postgresql',
    url: `postgresql://${applicationDatabase.user}:${applicationDatabase.password}@${applicationDatabase.host}:${applicationDatabase.port}/${applicationDatabase.database}?sslmode=${applicationDatabase.ssl}`,
  },
  userDb: {
    adapter: 'sails-postgresql',
    url: `postgresql://${userDatabase.user}:${userDatabase.password}@${userDatabase.host}:${userDatabase.port}/${userDatabase.database}?sslmode=${userDatabase.ssl}`,
  },
}
