module.exports = function(sequelize, DataTypes) {

  return sequelize.define('PostagesAvailable', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    send_country:{
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};

