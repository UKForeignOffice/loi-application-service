const SummaryController = require('./SummaryController');

const OpenPaperAppController = {
    /**
     * @function openCoverSheet
     * @description Open the cover sheet
     * @param req {Array} - request object
     * @param res {Array} - response object
     * @return summary
     */
    openCoverSheet(req, res) {
        if (HelperService.LoggedInStatus(req)) {
            Application.find({
                where: { unique_app_id: req.params.unique_app_id },
            }).then((result) => {
                if (result && result.user_id === req.session.user.id) {
                    req.session.appId = result.application_id;
                    return SummaryController.fetchAll(
                        req,
                        res,
                        true,
                        false,
                        true
                    );
                }
                res.view('404');
            });
        } else {
            res.view('404');
        }
    },
};

module.exports = OpenPaperAppController;