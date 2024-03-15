module.exports = function(sequelize, DataTypes) {

  return sequelize.define('AccountDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: JSON.stringify([{
            "errInfo": 'You have not provided your first name',
            "errSoltn": 'Please enter your first name',
            "questionId": 'first_name'
          }])
        }

      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: JSON.stringify([{
            "errInfo": 'You have not provided your last name',
            "errSoltn": 'Please enter your last name',
            "questionId": 'last_name'
          }])
        }
      }
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: JSON.stringify([{
            "errInfo": 'You have not provided a valid phone number',
            "errSoltn": 'Please enter a valid phone number',
            "questionId": 'telephone'
          }])
        },
        len: {
          args: [0, 12],
          msg: JSON.stringify([{
            "errInfo": 'The telephone you have provided is too short',
            "errSoltn": 'Please enter a valid phone number',
            "questionId": 'telephone'
          }])
        }
      }
    },
    mobileNo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: JSON.stringify([{
            "errInfo": 'You have not provided a valid mobile number',
            "errSoltn": 'Please enter a valid mobile number',
            "questionId": 'mobileNo'
          }])
        },
        len: {
          args: [0, 12],
          msg: JSON.stringify([{
            "errInfo": 'The mobile number you have provided is too short',
            "errSoltn": 'Please enter a valid mobile number',
            "questionId": 'mobileNo'
          }])
        }
      }
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true


    },
    company_number: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: JSON.stringify([{
            "errInfo": 'You have not provided a valid company number',
            "errSoltn": 'Please enter a valid company number',
            "questionId": 'company number'
          }])
        },
        len: {
          args: [0, 12],
          msg: JSON.stringify([{
            "errInfo": 'The telephone you have provided is too short',
            "errSoltn": 'Please enter a valid company number',
            "questionId": 'company'
          }])
        }
      }
    },
    feedback_consent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: JSON.stringify([{
            "errInfo": 'You have not provided an answer to the feedback question.',
            "errSoltn": 'Answer the feedback question.',
            "questionId": 'feedback_consent'
          }])
        }
      }
    },
    complete: {type: DataTypes.BOOLEAN, default: false},
    user_id: {type: DataTypes.INTEGER, allowNull: false}


  });
}
