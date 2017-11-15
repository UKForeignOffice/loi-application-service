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
    customMiddleware: function (app) {

        app.use(function hsts(req, res, next) {
            res.removeHeader("X-Powered-By");
            res.removeHeader("Server");
            next();
        });

        app.use(function updateLoggedInCookie(req, res, next){
          if (req.cookies['LoggedIn']){
            res.cookie('LoggedIn',true,{ maxAge: 3600000, httpOnly: true });
          }
            next();
        });

    }

};
