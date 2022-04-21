module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ApplicationReference', {
    lastUsedID: {
      type: DataTypes.INTEGER
    }
  });
};
