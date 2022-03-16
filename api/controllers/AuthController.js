/**
 * AuthController module.
 * @module Controller AuthController
 */
const sails = require('sails');
const getUserModels = require('../userServiceModels/models.js');

module.exports = {
    loadDashboard(req, res) {
        const UserModels = getUserModels(sails.config.userServiceSequelize);

        if (!req.session.passport.user) {
            sails.log.error('User not logged in');
            return res.forbidden();
        }
        res.cookie('LoggedIn', true, {
            maxAge: sails.config.session.cookie.maxAge,
        });
        UserModels.User.findOne({ where: { email: req.session.email } }).then(
            (user) => {
                UserModels.AccountDetails.findOne({
                    where: { user_id: user.id },
                }).then((account) => {
                    UserModels.SavedAddress.findAll({
                        where: { user_id: user.id },
                    }).then((addresses) => {
                        req.session.user = user;
                        req.session.account = account;
                        req.session.savedAddressCount = addresses.length;

                        if (req.query.message) {
                            req.flash('info', req.query.message);
                        }
                        if (!req.query.name) {
                            return res.redirect('/dashboard');
                        }

                        if (req.query.name === 'continueEApp') {
                            return res.redirect('/eapp-start-page');
                        }
                        /**
                         * Redirect user back to page from where they came,
                         * currently only the service selector page
                         */
                        if (
                            req.query.name !== 'premiumCheck' ||
                            user.premiumEnabled
                        ) {
                            return res.redirect('/start');
                        }
                        return res.view('upgrade.ejs', {
                            usersEmail: req.session.email,
                            user_data: HelperService.getUserData(req, res),
                        });
                    });
                });
            }
        );
    },

    logout(req, res) {
        req.session.destroy();
        return res.redirect(
            sails.config.customURLs.userServiceURL + '/sign-out'
        );
    },

    sessionExpired(req, res) {
        let logged_in = false;
        let special_case = false; //see FCOLOI-832
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
