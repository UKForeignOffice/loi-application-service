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
          },
        updatedAt: {
          type: 'ref',
          columnType: 'timestamp'
        }
      },
      options: {
          tableName: 'ApplicationReference',
          autoUpdatedAt: true,
      }
};

