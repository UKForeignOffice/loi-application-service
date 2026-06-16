module.exports = (sequelize, DataTypes) =>
  sequelize.define('ApplicationType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    applicationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
    },
  })
