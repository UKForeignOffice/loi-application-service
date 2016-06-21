/**
* @module Model AdditionalApplication
*/

module.exports = {
      attributes: {
          id: {
            type: Sequelize.INTEGER(),
              autoIncrement: true,
              primaryKey: true
          },
          application_id:{
              type: Sequelize.INTEGER(),
              allowNull: false,
              foreignKey: true
          },
          user_ref: {
              type: Sequelize.STRING,
              allowNull: true,
              validate: {
                  len: {
                      args: [0,30],
                      msg: JSON.stringify([{
                          "errInfo": 'Your reference must be maximum 30 characters long',
                          "errSoltn": 'Enter a reference no longer than 30 characters',
                          "questionId": 'customer_ref'
                      }])
                  }
              }
          }
      },

      options: {
          tableName: 'AdditionalApplicationInfo',
          classMethods: {},
          instanceMethods: {},
          hooks: {}
      }

};

