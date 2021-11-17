const sails = require('sails');

const MAX_CHAR_LENGTH = 30;

const EAppReferenceController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);

        if (!userData.loggedIn) {
            sails.log.error('User not logged in');
            return res.forbidden();
        }

        return res.view('eApostilles/additionalReference.ejs', {
            user_data: userData,
            userRef: req.session.eApp.userRef,
            maxReferenceLength: MAX_CHAR_LENGTH,
            inputError: false,
        });
    },

    addReferenceToSession(req, res) {
        const userRef = req.body['user-reference'];

        if (userRef.length > MAX_CHAR_LENGTH) {
            return res.view('eApostilles/additionalReference.ejs', {
                user_data: HelperService.getUserData(req, res),
                userRef: '',
                maxReferenceLength: MAX_CHAR_LENGTH,
                inputError: true,
            });
        }

        req.session.eApp.userRef = userRef;
        return res.redirect('/check-uploaded-documents');
    },
};

module.exports = EAppReferenceController;
