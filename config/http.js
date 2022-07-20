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

require('dotenv').config()

module.exports.http = {
  middleware: {

    order: [
      'csp',
      'cookieParser',
      'session',
      'flash',
      'fileMiddleware',
      'bodyParser',
      'compress',
      'updateLoggedInCookie',
      'clearHeaders',
      'poweredBy',
      'router',
      'www'
    ],

    flash: require('connect-flash')(),

    csp: require('lusca').csp({
      policy: {
        'default-src': "'none'",
        'connect-src': process.env.NODE_ENV === 'development' ?
          "'self' http://web-analytics.fco.gov.uk/piwik/piwik.php https://web-analytics.fco.gov.uk/piwik/piwik.php" :
          "'self' https://web-analytics.fco.gov.uk/piwik/piwik.php",
        'font-src': "'self' data:",
        'form-action': process.env.NODE_ENV === 'development' ? "'self' https://www.payments.service.gov.uk localhost:*" : "'self' https://www.payments.service.gov.uk",
        'img-src': "'self'",
        'script-src': process.env.NODE_ENV === 'development' ?
          "'self' 'unsafe-inline' http://web-analytics.fco.gov.uk/piwik/piwik.js https://web-analytics.fco.gov.uk/piwik/piwik.js localhost:*" :
          "'self' 'unsafe-inline' https://web-analytics.fco.gov.uk/piwik/piwik.js",
        'style-src': "'self' 'unsafe-inline'"
      }
    }),


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


    clearHeaders: (function (){
      return function (req,res,next) {
        res.removeHeader("X-Powered-By");
        res.removeHeader("Server");
        return next();
      };
    })(),


  }
};
