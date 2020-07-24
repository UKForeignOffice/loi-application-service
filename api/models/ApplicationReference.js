/**
* Model ApplicationReference.js
* @module Model ApplicationReference
*/

var Sequelize = require('sequelize');

module.exports = {
      attributes: {
          lastUsedID: {
            type: Sequelize.INTEGER()
          }
      },

      options: {
          tableName: 'ApplicationReference',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

