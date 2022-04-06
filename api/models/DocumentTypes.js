module.exports = function(sequelize, DataTypes) {

  return sequelize.define('DocumentTypes', {
    doc_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    doc_type_title:{
      type: DataTypes.STRING,
      allowNull: false
    },
    doc_type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
