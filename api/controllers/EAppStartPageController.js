const EAppStartPageController = {
    startPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        const signInUrl = `${sails.config.customURLs.userServiceURL}/sign-in?from=start&next=continueEApp`;
        const nextUrl = userData.loggedIn ? '/upload-files': signInUrl;
        const backUrl = req.query.arrivedFrom === 'skipQuestionsLink'
            ? '/eligibility/check-documents-are-eligible'
            : '/eligibility/check-documents-are-prepared';

        return res.view('eApostilles/startPage.ejs', {
            user_data: userData,
            next_url: nextUrl,
            back_url: backUrl,
        });
    },
}

module.exports = EAppStartPageController;
