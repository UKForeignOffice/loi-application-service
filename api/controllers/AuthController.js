/**
 * AuthController module.
 * @module Controller AuthController
 */
// @ts-check
const sails = require('sails');
const UserModels = require('../userServiceModels/models.js');
const HelperService = require('../services/HelperService');

const AuthController = {
    async fromSignInPage(req, res) {
        try {
            const userLoggedIn = req.session.passport.user;

            if (!userLoggedIn) {
                sails.log.error('User not logged in');
                return res.forbidden();
            }

            res.cookie('LoggedIn', true, {
                maxAge: req._sails.config.session.cookie.maxAge,
            });

            const userData = await UserModels.User.findOne({
                where: { email: req.session.email },
            });

            await AuthController._addUserDataToSession(req, userData);

            const redirectTo = AuthController._chooseRedirectURL(req, userData);
            const oneTimeMessage = req.query.message;

            if (!redirectTo) return AuthController._fallbackPage(req, res);

            if (oneTimeMessage) req.flash('info', oneTimeMessage);

            return res.redirect(redirectTo);
        } catch (error) {
            sails.log.error(`fromSignInPage Error: ${error}`);
            return res.serverError();
        }
    },

    async _addUserDataToSession(req, userData) {
        const userAccount = await UserModels.AccountDetails.findOne({
            where: { user_id: userData.id },
        });
        const userAddresses = await UserModels.SavedAddress.findAll({
            where: { user_id: userData.id },
        });

        req.session.user = userData;
        req.session.account = userAccount;
        req.session.savedAddressCount = userAddresses.length;
    },

    _chooseRedirectURL(req, userData) {
        let redirectUrl;

        const midEAppFlow = req.session.continueEAppFlow;
        const redirectNameInQueryParam = req.query.name;
        const hasPremiumAccount =
            userData.premiumEnabled || req.query.name !== 'premiumCheck';

        if (midEAppFlow) redirectUrl = '/upload-files';
        else if (req.query.eappid) redirectUrl = `open-eapp/${req.query.eappid}`;
        else if (hasPremiumAccount) redirectUrl = '/start';
        else if (!redirectNameInQueryParam) redirectUrl = '/dashboard';

        return redirectUrl;
    },

    _fallbackPage(req, res) {
        return res.view('upgrade.ejs', {
            usersEmail: req.session.email,
            user_data: HelperService.getUserData(req, res),
        });
    },

    logout(req, res) {
        req.session.destroy();
        return res.redirect(
            sails.config.customURLs.userServiceURL + '/sign-out'
        );
    },

    sessionExpired(req, res) {
        let logged_in = false;
        let special_case = false;

        if (
            (req.query && req.query.loggedIn) ||
            (req.query && req.query.LoggedIn)
        ) {
            logged_in = JSON.parse(req.query.LoggedIn);
        } else {
            special_case = true;
        }

        res.clearCookie('LoggedIn');

        return res.view('session-expired.ejs', {
            LoggedIn: logged_in,
            special_case,
            userServiceURL: req._sails.config.customURLs.userServiceURL,
        });
    },
};

module.exports = AuthController;
