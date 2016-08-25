
module.exports = function(req, res, next) {
    if(req.session.appId && req.session.appId!==0 ){
        return next();
    }
    else{
        console.log(req.session.appId);
        res.clearCookie('LoggedIn');

        req.session.appId = false;
        return res.redirect('/session-expired');
    }


};
