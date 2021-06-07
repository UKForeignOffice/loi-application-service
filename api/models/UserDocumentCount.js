/**
* Model UserDocumentCount.js
* @module Model UserDocumentCount
*/

module.exports = {
      attributes: {
          application_id:{
              type: Sequelize.INTEGER(),
              allowNull: false
          },
          doc_count:{
              type: Sequelize.INTEGER(),
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
                      args:20,
                      msg: JSON.stringify([{
                          "questionId" : 'document_count',  // ID of the question container, taken from your HTML
                          "errInfo": 'The maximum number of documents allowed per application is 20',  // Detail of hte error, i.e. what the error is
                          "errSoltn": ''  // Detail of how to solve error, i.e. how to fix and move to next page
                      }])
                  },
              }
          },
          price:{
              type: Sequelize.INTEGER(),
              allowNull: false
          }
      },

      options: {
          tableName: 'UserDocumentCount',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

