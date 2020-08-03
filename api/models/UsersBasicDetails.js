/**
* Model UsersBasicDetails.js
* @module Model UsersBasicDetails
*/

var Sequelize = require('sequelize');

var usersBasicDetails = {
    schema: false,
    // types: {
    //     mycustomtype: function (confirm_email) {
    //         return confirm_email === this.email;
    //     }
    // },
      attributes: {
          id: {
            type: 'number',
            autoIncrement: true
          },
          application_id:{
              type: 'number',
              allowNull: false
          },
          first_name: {
              type: 'string',
              allowNull: false,
              // validate: {
              //     notEmpty: {
              //         msg: JSON.stringify([{
              //             "errInfo": 'You have not provided your first name',
              //             "errSoltn": 'Enter your first name',
              //             "questionId" : 'first_name'
              //         }])
              //     }
              // }
          },
          last_name: {
              type: 'string',
              allowNull: false,
              // validate: {
              //     notEmpty: {
              //         msg: JSON.stringify([{
              //             "errInfo": 'You have not provided your last name',
              //             "errSoltn": 'Enter your last name',
              //             "questionId" : 'last_name'
              //         }])
              //     }
              // }
          },
          telephone: {
              type: 'string',
              allowNull: false,
              // validate: {
              //     len:{
              //         args: [6,25], //
              //         msg: JSON.stringify([{
              //             "errInfo": 'You have not provided a valid phone number',
              //             "errSoltn": 'Enter a valid phone number',
              //             "questionId" : 'telephone'
              //         }])
              //     }
              // }
          },
        mobileNo: {
          type: 'string',
          allowNull: true,
          // validate: {
          //       len: {
          //         args: [7,17],
          //         msg: JSON.stringify([{
          //           "errInfo": 'You have not provided a valid mobile phone number',
          //           "errSoltn": 'Enter a valid mobile phone number',
          //           "questionId": 'mobileNo'
          //         }])
          //       }
          // }
        },
          has_email:{
              type: 'string',
              allowNull:false,
              // validate: {
              //     notEmpty: {
              //         msg: JSON.stringify([{
              //             "errInfo": '',
              //             "errSoltn": 'Tell us whether you have an email address',
              //             "questionId": 'has_email'
              //         }])
              //     }
              // }

          },
          email: {
              type: 'string',
              allowNull: true,
              // mycustomtype: true,
              validations: {
                custom: function (confirm_email) {
                  return confirm_email === this.email;
                }
              },
              // validate: {
              //     isEmail: {
              //         msg: JSON.stringify([{
              //             "errInfo": 'The email address you have entered is invalid',
              //             "errSoltn": 'Enter a valid email address',
              //             "questionId" : 'email'
              //         }])
              //     },
              //     notIn: {
              //         args: [['INVALID']],
              //         msg: JSON.stringify([{
              //             "errInfo": 'The email address you have entered is invalid',
              //             "errSoltn": 'Enter a valid email address',
              //             "questionId" : 'email'
              //         }])
              //     }
              // }
          },
           //CHECK THAT CONF EMAIL === EMAIL, LOOK INTO VIRTUAL COLUMN AND HOW TO VALIDATE
          confirm_email: {
              type: 'boolean',
              allowNull: true,
              // validate: {
              //     isEmail: {
              //         msg: JSON.stringify([{
              //             "errInfo": 'Confirm your email address',
              //             "errSoltn": 'Email addresses must match',
              //             "questionId" : 'confirm_email'
              //         }])
              //     }
              // }
          }

      },


      options: {
          tableName: 'UserDetails',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

module.exports = usersBasicDetails;

