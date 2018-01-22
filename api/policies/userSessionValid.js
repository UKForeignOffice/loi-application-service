
module.exports = function(req, res, next) {

    if(req.cookies.LoggedIn && !req.session.passport){

      //IF YOU HAVE GOT HERE VIA THE PAYMENT SERVICE
      //LET THE USER CONTINUE

      if (typeof req.query.merchantReturnData != 'undefined' && req.query.merchantReturnData !== null){
        console.log("----------- userSessionValid check no session for " + req.query.merchantReturnData + " -----------");
        return next();
      } else {
        res.clearCookie('LoggedIn');
        return res.redirect('/session-expired?LoggedIn=' + (req.cookies.LoggedIn !== null ? true : false));
      }


    } else {
        return next();
    }

};
