/**
* Model ApplicationReference.js
* @module Model ApplicationReference
*/

var Sequelize = require('sequelize');

module.exports = {
      attributes: {
          id: {
            type: 'number',
            columnName: 'lastUsedID',
            autoIncrement: true
          }
      },

      options: {
          tableName: 'ApplicationReference',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

