const sails = require('sails');

const EAppREferenceController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);
        if (!userData.loggedIn) {
            sails.log.error('Users not logged in');
            return res.serverError();
        }

        res.view('eApostilles/additionalReference.ejs', {
            user_data: userData,
            userRef: req.session.eApp.userRef
        });
    },

    addReference(req, res) {
        const userRef = req.body['user-reference'];

        if (!userRef) {
            sails.log.info('No user reference added');
        }

        req.session.eApp.userRef = userRef;
        return res.redirect('/check-uploaded-documents');
    },
};

module.exports = EAppREferenceController;
