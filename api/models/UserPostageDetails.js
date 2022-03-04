module.exports = function(sequelize, DataTypes) {

  return sequelize.define('UserPostageDetails', {
    application_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postage_available_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: JSON.stringify([{
            "questionId" : 'postage_available',  // ID of the question container, taken from your HTML
            "errInfo": 'You\'ve not selected a postage option',  // Detail of hte error, i.e. what the error is
            "errSoltn": 'Confirm how you\'ll send us your documents'  // Detail of how to solve error, i.e. how to fix and move to next page
          }])
        }
      }
    },
    postage_type:{
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
