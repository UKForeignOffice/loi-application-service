/**
* Model PostagesAvailable.js
* @module Model PostagesAvailable
*/

module.exports = {
      attributes: {
          id: {
              type: Sequelize.INTEGER(),
              primaryKey: true
          },
          title: {
              type: Sequelize.STRING,
              allowNull: false
          },
          price: {
              type: Sequelize.DECIMAL,
              allowNull: false
          },
          type: {
              type: Sequelize.STRING,
              allowNull: false
          },
          send_country:{
              type: Sequelize.STRING,
              allowNull: true
          }
      },

      options: {
          tableName: 'PostagesAvailable',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

