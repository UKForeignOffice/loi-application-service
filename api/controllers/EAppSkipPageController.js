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

        if (!radioValueSelected) {
            req.flash('error', 'You must answer this question');
            return EAppSkipPageController.renderPage(req, res);
        }

        const redirectUrl =
            radioValueSelected === 'yes'
                ? '/eligibility/apostille-accepted-in-destination'
                : EAppSkipPageController._handleSkipRedirect(req);

        return res.redirect(redirectUrl);
    },

    _handleSkipRedirect(req) {
        const { userServiceURL } = req._sails.config.customURLs;
        const userLoggedIn = HelperService.LoggedInStatus(req);

        return userLoggedIn
            ? '/upload-files'
            : `${userServiceURL}/sign-in?next=continueEApp&from=start`;
    },
};

module.exports = EAppSkipPageController;
