/**
* @module Model AdditionalApplication
*/

var Sequelize = require('sequelize');

module.exports = {
      attributes: {
          id: {
            type: 'number',
            autoIncrement: true
          },
          application_id:{
              type: 'number',
              allowNull: false,
              // foreignKey: true
          },
          user_ref: {
              type: 'string',
              allowNull: true,
              // validate: {
              //     len: {
              //         args: [0,30],
              //         msg: JSON.stringify([{
              //             "errInfo": 'Your reference must be maximum 30 characters long',
              //             "errSoltn": 'Enter a reference no longer than 30 characters',
              //             "questionId": 'customer_ref'
              //         }])
              //     }
              // }
          }
      },

      options: {
          tableName: 'AdditionalApplicationInfo',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }
};

