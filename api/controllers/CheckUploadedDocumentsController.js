const CheckUploadedDocumentsController = {
  renderPage(req, res) {
    const userData = HelperService.getUserData(req, res);
    return res.view("eApostilles/checkUploadedDocuments.ejs", {
      user_data: userData,
    });
  },

  addDocsToDBHandler() {
    console.log("this does something");

    UploadedDocumentsModel.create({
      application_id: 123,
      created_at: Date.now(),
      s3_url: "https://some-test-url.com",
    });

    res.redirect("/check-uploaded-documents");
  }
};

module.exports = CheckUploadedDocumentsController;
