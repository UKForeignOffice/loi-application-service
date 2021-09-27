const sails = require('sails');

const EAppReferenceController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            sails.log.error('User not logged in');
            return res.forbidden();
        }

        return res.view('eApostilles/additionalReference.ejs', {
            user_data: userData,
            userRef: req.session.eApp.userRef
        });
    },

    addReferenceToSession(req, res) {
        const userRef = req.body['user-reference'];

        if (!userRef) {
            sails.log.error('No user reference found');
        }

        req.session.eApp.userRef = userRef;
        return res.redirect('/check-uploaded-documents');
    },
};

module.exports = EAppReferenceController;
