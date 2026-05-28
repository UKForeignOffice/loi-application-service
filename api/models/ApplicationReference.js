module.exports = (sequelize, DataTypes) =>
  sequelize.define('ApplicationReference', {
    lastUsedID: {
      type: DataTypes.INTEGER,
    },
  })
