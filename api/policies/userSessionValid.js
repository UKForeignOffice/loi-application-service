
module.exports = function(req, res, next) {

    if(req.cookies.LoggedIn && !req.session.passport){

      res.clearCookie('LoggedIn');
      return res.redirect('/session-expired?LoggedIn=' + (req.cookies.LoggedIn !== null));

    } else {
        return next();
    }

};
