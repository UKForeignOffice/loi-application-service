/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */
require('dotenv').config()
var applicationDatabase = JSON.parse(process.env.APPLICATIONDATABASE);
var userservicesequelize = JSON.parse(process.env.USERSERVICESEQUELIZE);

module.exports.datastores = {
  default: {
    adapter: 'sails-postgresql',
    url: `postgresql://${applicationDatabase.user}:${applicationDatabase.password}@${applicationDatabase.host}:${applicationDatabase.port}/${applicationDatabase.database}`
  },
  userDatabase: {
    adapter: 'sails-postgresql',
    url: `postgresql://${userservicesequelize.user}:${userservicesequelize.pass}@${userservicesequelize.host}:${userservicesequelize.port}/${userservicesequelize.database}`
  }
};

