/**
 * AuthController module.
 * @module Controller AuthController
 */
var   UserModels = require('../userServiceModels/models.js');
module.exports= {

    loadDashboard: function(req,res){
        if (req.session.passport && req.session.passport.user){
            res.cookie('LoggedIn',true,{ maxAge: 1800000 });
            UserModels.User.findOne({where: {email: req.session.email}}).then(function (user) {
                UserModels.AccountDetails.findOne({where: {user_id: user.id}}).then(function (account) {
                    UserModels.SavedAddress.findAll({where: {user_id: user.id}}).then(function (addresses) {

                        req.session.user = user;
                        req.session.account = account;
                        req.session.savedAddressCount = addresses.length;


                        if (req.query.message) {req.flash('info',req.query.message);}
                        if (req.query.name) {
                            /**
                             * Redirect user back to page from where they came,
                             * currently only the service selector page
                             */

                            if (req.query.name === "premiumCheck") {

                                if (user.premiumEnabled) {
                                    return res.redirect('/start');
                                }
                                else {
                                    return res.view('upgrade.ejs',{usersEmail: req.session.email, user_data: HelperService.getUserData(req,res)});
                                }

                            }  else {
                                return res.redirect(translateRedirect(req.query.name));
                            }
                        } else {
                            return res.redirect('/dashboard');
                        }
                    });
                });
            });
        }else{
            //req.session.authenticated = false;
            return res.forbidden();
        }
    },

    logout: function(req,res){
        req.session.destroy();
        return res.redirect(sails.config.customURLs.userServiceURL+'/sign-out');
    },
    sessionExpired:function(req,res){
        var logged_in = false;
        var special_case = false; //see FCOLOI-832
        if(req.query && req.query.loggedIn){
            logged_in = JSON.parse(req.query.LoggedIn);
        }
        else{
            special_case = true;
        }


        res.clearCookie('LoggedIn');
        return res.view('session-expired.ejs',{LoggedIn:logged_in, special_case:special_case});
    }

};

function translateRedirect(redirectKey) {
    /**
     * All potential places to redirect to can be
     * listed and translated here
     */
    if (redirectKey === "serviceSelector"){
        // Go to service selector page
        return '/start';
    } else return '/start';

}
