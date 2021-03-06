/**
 * @module Model AddressDetails
 */
var AddressDetailsModel = {

    attributes: {
        application_id:{
            type: Sequelize.INTEGER(),
            allowNull: false
        },
        full_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 250],
                    msg: JSON.stringify([{
                        "errInfo": 'You have not provided your full name',
                        "errSoltn": 'Enter your full name',
                        "questionId" : 'full_name'
                    }])
                }
            }
        },
        organisation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        house_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: JSON.stringify([{
                        "errInfo": 'You have not provided the house name or number of your address',
                        "errSoltn": 'Enter the house name or number of your address',
                        "questionId": 'house_name'
                    }])
                }
            }
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: JSON.stringify([{
                        "errInfo": 'You have not provided the street of your address',
                        "errSoltn": 'Enter your street',
                        "questionId": 'street'
                    }])
                }
            }

        },

        town: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: JSON.stringify([{
                        "errInfo": 'You have not provided a town',
                        "errSoltn": 'Enter the town',
                        "questionId": 'town'
                    }])
                }
            }
        },
        county: {
            type: Sequelize.STRING,
            allowNull: true

        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: JSON.stringify([{
                        "errInfo": 'You have not provided a country',
                        "errSoltn": 'Enter the country',
                        "questionId": 'country'
                    }])
                }
            }
        },
        postcode: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1,20],
                    msg: JSON.stringify([{
                        "errInfo": 'You have not provided a valid postcode',
                        "errSoltn": 'Enter a valid postcode',
                        "questionId": 'postcode'
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
          len:{
            args: [6,25], //
            msg: JSON.stringify([{
              "errInfo": 'You have not provided a valid mobile phone number',
              "errSoltn": 'Enter a valid mobile phone number',
              "questionId" : 'mobileNo'
            }])
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: {
            msg: JSON.stringify([{
              "errInfo": 'The email address you have entered is invalid',
              "errSoltn": 'Enter a valid email address',
              "questionId" : 'email'
            }])
          }
        }
      },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    options: {
        tableName: 'AddressDetails',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};

module.exports = AddressDetailsModel;
