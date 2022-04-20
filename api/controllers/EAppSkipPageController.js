const EAppSkipPageController = {
    renderPage(req, res) {
        const error = req.flash('error').toString();

        return res.view('eApostilles/eAppSkipPage.ejs', {
            user_data: HelperService.getUserData(req, res),
            page_error: error,
        });
    },

    handleChoice(req, res) {
        const radioValueSelected = req.body['documents-suitable'];
        const { userServiceURL } = req._sails.config.customURLs;

        if (!radioValueSelected) {
            req.flash('error', 'You must answer this question');
            return EAppSkipPageController.renderPage(req, res);
        }

        const redirectUrl =
            radioValueSelected === 'yes'
                ? '/eligibility/apostille-accepted-in-destination'
                : `${userServiceURL}/sign-in?next=continueEApp&from=start`;

        return res.redirect(redirectUrl);
    },
};

module.exports = EAppSkipPageController;
