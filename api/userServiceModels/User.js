module.exports = function(sequelize, DataTypes) {

  return sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
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

    premiumEnabled: {type: DataTypes.BOOLEAN, default: false},

    dropOffEnabled: {type: DataTypes.BOOLEAN, default: false},

    premiumServiceEnabled: {type: DataTypes.BOOLEAN, default: false},

    noOfPremiumRequestAttempts: {type: DataTypes.INTEGER},

    premiumUpgradeToken:{
      type: DataTypes.STRING
    },

    confirm_password: {
        type: DataTypes.VIRTUAL
    },
    salt: {
        type: DataTypes.STRING
    },
    resetPasswordToken: {
        type: DataTypes.STRING
    },
    resetPasswordExpires: {
        type: DataTypes.DATE
    },
    failedLoginAttemptCount: {
        type: DataTypes.INTEGER
    },
    accountLocked: {
        type: DataTypes.BOOLEAN
    },
    passwordExpiry: {
        type: DataTypes.DATE
    },
    payment_reference: {
        type: DataTypes.STRING
    },
    activationToken: {
        type: DataTypes.STRING
    },
    activated: {
        type: DataTypes.BOOLEAN
    },
    activationTokenExpires: {
        type: DataTypes.DATE
    }
})
}
