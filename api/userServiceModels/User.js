/**
 * FCO LOI User Management
 * User Model
 *
 *
 */

var Sequelize = require('sequelize');

var attributes = {
    id: {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: 'email',
        allowNull: false,
        unique: {
            msg: {
                "errInfo": 'There was a problem creating your account',
                "errSoltn": 'Check or amend your details and try again',
                "questionId": 'email'
            }
        },
        validate: {
            isEmail: {
                msg: {
                    "errInfo": 'The email address you have entered is invalid',
                    "errSoltn": 'Please enter a valid email address',
                    "questionId": 'email'
                }
            }
        }
    },

    password: {
        type: 'string',
        allowNull: false,
        validate: {
            is: {
                args: /(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}/,
                msg: {
                    "errInfo": 'Password is invalid',
                    "errSoltn": 'Your password must be at least 8 characters long and must contain at least 1 lowercase letter, 1 capital letter and 1 number',
                    "questionId": 'password'
                }
            },
            notEmpty: {
                msg: {
                    "errInfo": 'You have not provided a password',
                    "errSoltn": 'Please enter a password',
                    "questionId": 'password'
                }
            },
            fn: function (val) {
                /*
                 Custom error builder for password field
                 */
                if (val !== this.confirm_password) {

                    var msg = [];

                    msg.push({
                        "errInfo": 'Password and password confirmation fields must match',
                        "errSoltn": 'Please re-enter the password ensuring it matches the password field',
                        "questionId": 'password'
                    });

                    throw new Error(JSON.stringify(msg));
                }
            }
        }
    },

    premiumEnabled: {type: 'boolean', default: false},

    dropOffEnabled: {type: 'boolean', default: false},

    electronicEnabled: {type: 'boolean', default: false},

    confirm_password: {
        type: Sequelize.VIRTUAL()
    },
    salt: {
        type: 'string'
    },
    resetPasswordToken: {
        type: 'string'
    },
    resetPasswordExpires: {
        type: 'date'
    },
    failedLoginAttemptCount: {
        type: 'integer'
    },
    accountLocked: {
        type: 'boolean'
    },
    passwordExpiry: {
        type: 'date'
    },
    payment_reference: {
        type: 'string'
    },
    activationToken: {
        type: 'string'
    },
    activated: {
        type: 'boolean'
    },
    activationTokenExpires: {
        type: 'date'
    }
};

var options = {
  freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;
