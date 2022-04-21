module.exports = function(sequelize, DataTypes) {

  return sequelize.define('AdditionalApplicationInfo', {
      id: {
            type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          application_id:{
              type: DataTypes.INTEGER,
              allowNull: false,
              foreignKey: true
          },
          user_ref: {
              type: DataTypes.STRING,
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
      });
};

