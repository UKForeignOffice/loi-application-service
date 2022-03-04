
const FileUploadController = require('./FileUploadController');

const EAppStartController = {
    renderPage(req, res) {
        FileUploadController.clearExistingErrorMessages(req);

        return res.view('eApostilles/startPage.ejs', {
            user_data: HelperService.getUserData(req, res)
        });
    }
}

module.exports = EAppStartController;