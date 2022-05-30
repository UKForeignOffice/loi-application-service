/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {
  middleware: {

    order: [
      'cookieParser',
      'session',
      'fileMiddleware',
      'bodyParser',
      'compress',
      'flash',
      'updateLoggedInCookie',
      'clearHeaders',
      'poweredBy',
      'router',
      'www'
    ],

    flash: require('connect-flash')(),


    fileMiddleware: (function (arg1, arg2, arg3) {
      console.log(arg1, 'arg1')
      console.log(arg2, 'arg2')
      console.log(arg3, 'arg3')
      return require('../api/controllers/FileUploadController').setupMulterMiddleware()
    })(),


    updateLoggedInCookie: (function (){
      return function (req,res,next) {
        if (req.cookies['LoggedIn']){
          res.cookie('LoggedIn', true, {
            maxAge: 1800000,
            httpOnly: true,
          });
        }
        return next();
      };
    })(),


    clearHeaders: (function (){
      return function (req,res,next) {
        res.removeHeader("X-Powered-By");
        res.removeHeader("Server");
        return next();
      };
    })(),


  }
};
