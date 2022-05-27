const sails = require('sails');
const HelperService = require('../services/HelperService');

const MAX_CHAR_LENGTH = 30;

const EAppReferenceController = {
    renderPage(req, res) {
        const userData = HelperService.getUserData(req, res);

        if (!userData.loggedIn) {
            sails.log.error('User not logged in');
            return res.forbidden();
        }

        if (HelperService.maxFileLimitExceeded(req))
            return res.serverError('maxFileLimitExceeded');

        return res.view('eApostilles/additionalReference.ejs', {
            user_data: userData,
            userRef: req.session.eApp.userRef,
            maxReferenceLength: MAX_CHAR_LENGTH,
            referenceErrors: [],
        });
    },

    addReferenceToSession(req, res) {
        const userRef = req.body['user-reference'];
        const illegalCharacters =
            HelperService.checkForIllegalCharacters(userRef);
        const isOverCharLimit = userRef.length > MAX_CHAR_LENGTH;

        EAppReferenceController._checkReferenceForErrors({
            req,
            isOverCharLimit,
            illegalCharacters,
        });

        const referenceErrors = req.flash('referenceErrors');

        if (isOverCharLimit || illegalCharacters.exist) {
            return res.view('eApostilles/additionalReference.ejs', {
                user_data: HelperService.getUserData(req, res),
                userRef: '',
                maxReferenceLength: MAX_CHAR_LENGTH,
                referenceErrors,
            });
        }

        req.session.eApp.userRef = userRef;
        return res.redirect('/check-uploaded-documents');
    },

    _checkReferenceForErrors({ req, isOverCharLimit, illegalCharacters }) {
        const errorMessages = {
            illegalCharacter: 'The reference cannot use the following characters:',
            overCharLimit: 'Your reference must be 30 characters or fewer',
        };

        if (illegalCharacters.exist) {
            const errorMsg = `${
                errorMessages.illegalCharacter
            } ${illegalCharacters.characters.join(', ')}`;

            sails.log.error('Illegal character used');
            req.flash('referenceErrors', [errorMsg]);
        }

        if (isOverCharLimit) {
            sails.log.error('User reference is over character limit');
            req.flash('referenceErrors', [errorMessages.overCharLimit]);
        }
    },
};

module.exports = EAppReferenceController;
