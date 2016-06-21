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
            res.setHeader("Strict-Transport-Security", "max-age=31536000");
            res.setHeader("X-Frame-Options", "DENY");
            res.setHeader("X-XSS-Protection", "1; mode=block");
            res.setHeader("X-Content-Type-Options", "nosniff");
            res.removeHeader("X-Powered-By");
            res.removeHeader("Server");
            next();
        });
        
    }

};
