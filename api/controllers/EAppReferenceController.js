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

        if (illegalCharacters.error) {
            return res.serverError(illegalCharacters.error);
        }

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
            illegalCharacter: {
                title: 'There is a problem with your reference',
                text: 'The reference cannot use the following characters:',
            },
            overCharLimit: {
                title: 'Your reference is too long',
                text: 'Your reference must be 30 characters or fewer',
            },
        };
        const charactersWithoutDuplicates = new Set(
            illegalCharacters.characters
        );
        const stringOfCharacters = Array.from(
            charactersWithoutDuplicates
        ).join(', ');

        if (illegalCharacters.exist) {
            const errorMsg = `${errorMessages.illegalCharacter.text} ${stringOfCharacters}`;

            sails.log.error('Illegal character used');
            req.flash('referenceErrors', [
                {
                    ...errorMessages.illegalCharacter,
                    text: errorMsg,
                },
            ]);
        }

        if (isOverCharLimit) {
            sails.log.error('User reference is over character limit');
            req.flash('referenceErrors', [errorMessages.overCharLimit]);
        }
    },
};

module.exports = EAppReferenceController;
