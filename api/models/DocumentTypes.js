/**
* Model DocumentTypes.js
* @module Model DocumentTypes
*/

var Sequelize = require('sequelize');

module.exports = {
      attributes: {
          id: {
            type: 'number',
            columnName: 'doc_type_id',
            autoIncrement: true
          },
          doc_type_title:{
              type: 'string',
              allowNull: false
          },
          doc_type: {
              type: 'string',
              allowNull: false
          }
      },

      options: {
          tableName: 'DocumentTypes',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

