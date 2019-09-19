/**
* Model UsersBasicDetails.js
* @module Model UsersBasicDetails
*/
var usersBasicDetails = {
    schema: false,
    types: {
        mycustomtype: function (confirm_email) {
            return confirm_email === this.email;
        }
    },
      attributes: {
          application_id:{
              type: Sequelize.INTEGER(),
              allowNull: false
          },
          first_name: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                  notEmpty: {
                      msg: JSON.stringify([{
                          "errInfo": 'You have not provided your first name',
                          "errSoltn": 'Enter your first name',
                          "questionId" : 'first_name'
                      }])
                  }

              }
          },
          last_name: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                  notEmpty: {
                      msg: JSON.stringify([{
                          "errInfo": 'You have not provided your last name',
                          "errSoltn": 'Enter your last name',
                          "questionId" : 'last_name'
                      }])
                  }
              }
          },
          telephone: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                  len:{
                      args: [6,25], //
                      msg: JSON.stringify([{
                          "errInfo": 'You have not provided a valid phone number',
                          "errSoltn": 'Enter a valid phone number',
                          "questionId" : 'telephone'
                      }])
                  }
              }
          },
        mobileNo: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
                len: {
                  args: [6,25],
                  msg: JSON.stringify([{
                    "errInfo": 'You have not provided a valid mobile phone number',
                    "errSoltn": 'Enter a valid mobile phone number',
                    "questionId": 'mobileNo'
                  }])
                }
          }
        },
          has_email:{
              type:Sequelize.STRING,
              allowNull:false,
              validate: {
                  notEmpty: {
                      msg: JSON.stringify([{
                          "errInfo": '',
                          "errSoltn": 'Tell us whether you have an email address',
                          "questionId": 'has_email'
                      }])
                  }
              }

          },
          email: {
              type: Sequelize.STRING,
              allowNull: true,
              mycustomtype: true,
              validate: {
                  isEmail: {
                      msg: JSON.stringify([{
                          "errInfo": 'The email address you have entered is invalid',
                          "errSoltn": 'Enter a valid email address',
                          "questionId" : 'email'
                      }])
                  },
                  notIn: {
                      args: [['INVALID']],
                      msg: JSON.stringify([{
                          "errInfo": 'The email address you have entered is invalid',
                          "errSoltn": 'Enter a valid email address',
                          "questionId" : 'email'
                      }])
                  }
              }
          },
           //CHECK THAT CONF EMAIL === EMAIL, LOOK INTO VIRTUAL COLUMN AND HOW TO VALIDATE
          confirm_email: {
              type: Sequelize.VIRTUAL(),
              allowNull: true,
              validate: {
                  isEmail: {
                      msg: JSON.stringify([{
                          "errInfo": 'Confirm your email address',
                          "errSoltn": 'Email addresses must match',
                          "questionId" : 'confirm_email'
                      }])
                  }
              }
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

