const UploadedDocumentsModel = {
  attributes: {
    id: {
      type: Sequelize.INTEGER(),
      autoIncrement: true,
      primaryKey: true,
    },
    application_id: {
      type: Sequelize.INTEGER(),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    s3_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: "UploadedDocuments"
  },
};

module.exports = UploadedDocumentsModel;
