module.exports = function(sequelize, DataTypes) {

  return sequelize.define('UserDetails', {
    application_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [7,17],
          msg: JSON.stringify([{
            "errInfo": 'You have not provided a valid mobile phone number',
            "errSoltn": 'Enter a valid mobile phone number',
            "questionId": 'mobileNo'
          }])
        }
      }
    },
    has_email:{
      type:DataTypes.STRING,
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
      type: DataTypes.STRING,
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
    //CHECK THAT CONF EMAIL === EMAIL, LOOK INTO VIRTUAL COLUMN AND HOW TO VALIDATE
    confirm_email: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      validate: {
        isEmail: {
          msg: JSON.stringify([{
            "errInfo": 'The email address you have entered is invalid',
            "errSoltn": 'Email addresses must match',
            "questionId" : 'confirm_email'
          }])
        }
      }
    }
  });
};
