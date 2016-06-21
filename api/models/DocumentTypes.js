/**
* Model DocumentTypes.js
* @module Model DocumentTypes
*/
module.exports = {
      attributes: {
          doc_type_id: {
              type: Sequelize.INTEGER(),
              primaryKey: true
          },
          doc_type_title:{
              type: Sequelize.STRING,
              allowNull: false
          },
          doc_type: {
              type: Sequelize.STRING,
              allowNull: false
          }
      },

      options: {
          tableName: 'DocumentTypes',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

