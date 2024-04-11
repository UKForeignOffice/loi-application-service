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
  cache: 86400000,
  middleware: {

    poweredBy: false,

    order: [
      'cookieParser',
      'session',
      'flash',
      'fileMiddleware',
      'bodyParser',
      'compress',
      'updateLoggedInCookie',
      'poweredBy',
      'router',
      'www',
    ],

    flash: require('connect-flash')(),

    fileMiddleware: (function () {
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

  }
};
