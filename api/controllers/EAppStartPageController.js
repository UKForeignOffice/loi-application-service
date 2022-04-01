const EAppStartPageController = {
    startPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        const signInUrl = `${sails.config.customURLs.userServiceURL}/sign-in?from=start`;
        const nextUrl = userData.loggedIn ? '/upload-files': signInUrl;
        const backUrl = req.query.arrivedFrom === 'skipQuestionsLink'
            ? '/eligibility/apostille-accepted-in-destination'
            : '/eligibility/pdfs-digitally-signed';

        return res.view('eApostilles/startPage.ejs', {
            user_data: userData,
            next_url: nextUrl,
            back_url: backUrl,
        });
    },
}

module.exports = EAppStartPageController;