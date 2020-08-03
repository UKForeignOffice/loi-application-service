/**
* Model PostagesAvailable.js
* @module Model PostagesAvailable
*/

var Sequelize = require('sequelize');

module.exports = {
      attributes: {
          id: {
              type: 'number',
            required: true
          },
          title: {
              type: 'string',
              allowNull: false
          },
          price: {
              type: 'number',
              columnType: 'float',
              allowNull: false
          },
          type: {
              type: 'string',
              allowNull: false
          },
          send_country:{
              type: 'string',
              allowNull: true
          }
      },

      options: {
          tableName: 'PostagesAvailable',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

