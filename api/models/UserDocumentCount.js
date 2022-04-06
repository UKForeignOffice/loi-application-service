module.exports = function(sequelize, DataTypes) {

  return sequelize.define('UserDocumentCount', {
    application_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doc_count:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: JSON.stringify([{
            "questionId" : 'document_count',  // ID of the question container, taken from your HTML
            "errInfo": 'Enter the number of documents',  // Detail of hte error, i.e. what the error is
            "errSoltn": ''  // Detail of how to solve error, i.e. how to fix and move to next page
          }])
        },
        isInt: {
          msg: JSON.stringify([{
            "questionId" : 'document_count',  // ID of the question container, taken from your HTML
            "errInfo": 'Enter the number of documents',  // Detail of hte error, i.e. what the error is
            "errSoltn": ''  // Detail of how to solve error, i.e. how to fix and move to next page
          }])
        },
        min: {
          args:1,
          msg: JSON.stringify([{
            "questionId" : 'document_count',  // ID of the question container, taken from your HTML
            "errInfo": 'Enter the number of documents',  // Detail of hte error, i.e. what the error is
            "errSoltn": ''  // Detail of how to solve error, i.e. how to fix and move to next page
          }])
        },
        max: {
          args:999,
          msg: JSON.stringify([{
            "questionId" : 'document_count',  // ID of the question container, taken from your HTML
            "errInfo": 'Enter a number lower than 1,000',  // Detail of hte error, i.e. what the error is
            "errSoltn": ''  // Detail of how to solve error, i.e. how to fix and move to next page
          }])
        }
      }
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};

