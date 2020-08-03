/**
* Model UserPostageDetails.js
* @module Model UserPostageDetails
*/

var Sequelize = require('sequelize');

module.exports = {
      attributes: {
          id: {
            type: 'number',
            autoIncrement: true
          },
          postage_available_id:{
              type: 'number',
              allowNull: false,
              // validate: {
              //     notEmpty: {
              //         msg: JSON.stringify([{
              //             "questionId" : 'postage_available',  // ID of the question container, taken from your HTML
              //             "errInfo": 'You\'ve not selected a postage option',  // Detail of hte error, i.e. what the error is
              //             "errSoltn": 'Confirm how you\'ll send us your documents'  // Detail of how to solve error, i.e. how to fix and move to next page
              //         }])
              //     }
              // }
          },
          postage_type:{
              type: 'string',
              allowNull: true
          }

      },
      options: {
          tableName: 'UserPostageDetails',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

