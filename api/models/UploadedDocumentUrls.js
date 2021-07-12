const UploadedDocumentUrls = {
  attributes: {
    application_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    uploaded_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: "UploadedDocumentUrls",
  },
};

module.exports = UploadedDocumentUrls;
