
module.exports = function(req, res, next) {
    if(req.session.appId && req.session.appId!==0 ){
        return next();
    }
    else{

      //IF YOU HAVE GOT HERE VIA THE PAYMENT SERVICE
      //LET THE USER CONTINUE

      if (typeof req.query.merchantReturnData != 'undefined' && req.query.merchantReturnData !== null){
        console.log("----------- applicationSessionValid check no session for " + req.query.merchantReturnData + " -----------");
        return next();
      }else{
        res.clearCookie('LoggedIn');
        req.session.appId = false;
        return res.redirect('/session-expired');
      }

    }

};
