const uploadCache = {};

module.exports = {
  addDocumentsPage: function (req, res) {
    const userData = HelperService.getUserData(req, res);
    const uploadedFiles = userData.user && uploadCache[userData.user.id] || [];
    return res.view('eApostilles/uploadFiles.ejs', {
      user_data: userData,
      error_report: false,
      uploadedFiles
    });
  },

  uploadFileHandler: (req, res) => {
    const userData = HelperService.getUserData(req, res);
    let uploadedCache = userData.user && uploadCache[userData.user.id] || [];
    if (req.body.delete) {
      uploadCache[userData.user.id] = uploadedCache.filter(file => file.filename !== req.body.delete);
      if (req.xhr) {
        res.status(200);
        return res.send({});
      }
      return res.redirect('/upload-files');
    }
    req.file('documents').upload({
      maxBytes: 10000000
    }, (err, uploadedFiles) => {
      if (err) return res.serverError(err);
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      const fileData = uploadedFiles.map(file => ({
        messageHtml: `<a href="${file.path}" class="govuk-link"> ${file.filename}</a> has been uploaded`,
        messageText: `${file.filename} has been uploaded`,
        filename: file.filename
      }));
      uploadCache[userData.user.id] = [...uploadedCache, ...fileData];
      if (req.xhr) {
        return res.json(fileData[0]);
      }
      res.redirect('/upload-files');
    })
  },
}
