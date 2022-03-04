module.exports = function(sequelize, DataTypes) {

  return sequelize.define('UserDocuments', {
    application_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    certified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    this_doc_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultsTo: 1
    }
  });
};

