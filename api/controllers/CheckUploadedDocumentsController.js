const CheckUploadedDocumentsController = {
  renderPage(req, res) {
    const userData = HelperService.getUserData(req, res);
    return res.view("eApostilles/checkUploadedDocuments.ejs", {
      user_data: userData,
    });
  },

  async addDocsToDBHandler(req, res) {
    const documentData = {
      application_id: 12223,
      user_id: 189,
      uploaded_url: "https://some-test-url.com",
    };

    try {
      await UploadedDocumentUrls.create(documentData);
      sails.log.info("Document url added to db");
    } catch (err) {
      sails.log.error(err);
    }

    res.redirect("/check-uploaded-documents");
  },
};

module.exports = CheckUploadedDocumentsController;
