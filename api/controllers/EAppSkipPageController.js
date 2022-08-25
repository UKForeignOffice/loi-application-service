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
        const suitabilityQuestionsSkipped = radioValueSelected === 'no';

        EAppSkipPageController._addSkippedFlagToSession(req);

        if (!radioValueSelected) {
            req.flash('error', 'You must answer this question');
            return EAppSkipPageController.renderPage(req, res);
        }

        if (suitabilityQuestionsSkipped) {
            return res.redirect(
                EAppSkipPageController._skippedQuestionsUrl(req)
            );
        }

        return res.redirect('/eligibility/check-documents-are-eligible');
    },

    _addSkippedFlagToSession(req) {
        req.session.eApp = {
            ...req.session.eApp,
            suitabilityQuestionsSkipped: false,
        };
    },

    _skippedQuestionsUrl(req) {
        const { userServiceURL } = req._sails.config.customURLs;
        const userLoggedIn = HelperService.LoggedInStatus(req);

        req.session.eApp.suitabilityQuestionsSkipped = true;

        return userLoggedIn
            ? '/upload-files'
            : `${userServiceURL}/sign-in?next=continueEApp&from=start`;
    },
};

module.exports = EAppSkipPageController;
