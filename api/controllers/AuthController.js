/**
 * AuthController module.
 * @module Controller AuthController
 */
const UserModels = require('../userServiceModels/models.js');
const deleteFileFromStorage = require('../helpers/deleteFileFromStorage');

module.exports = {
    loadDashboard(req, res) {
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

        if (req.query.UploadedFiles) {
            const filesArr = req.query.UploadedFiles.split(',');
            filesArr.forEach(file => {
                const [, ...rest] = file.split('_');
                const filename = rest.join('_');
                const fileObj = { filename, storageName: file};
                const { s3_bucket: s3BucketName } =
                    req._sails.config.eAppS3Vals;
                deleteFileFromStorage(fileObj, s3BucketName);
            });
        }

        res.clearCookie('LoggedIn');
        return res.view('session-expired.ejs', {
            LoggedIn: logged_in,
            special_case,
            userServiceURL: req._sails.config.customURLs.userServiceURL,
        });
    },
};
