module.exports = (sequelize, DataTypes) =>
  sequelize.define('UploadedDocumentUrls', {
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaded_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
