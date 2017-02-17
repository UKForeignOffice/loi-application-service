/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */


var winston = require('winston');
var moment = require('moment');

var customLogger = new winston.Logger({
    transports: [
        /*Log info to console*/
        new (winston.transports.Console)({
            timestamp: function() {
                var date = new Date();
                return date.toISOString();
            },
            formatter: function(options) {
                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            },
            name: 'info-console',
            level: 'info',
            handleExceptions: true,
            humanReadableUnhandledException: true
        }),
        /*Log info to file */
        new (winston.transports.File)({
            timestamp: function() {
                var date = new Date();
                return date.toISOString();
            },
            formatter: function(options) {
                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            },
            name: 'info-file',
            filename: process.env.INFOLOG || 'logs/fco-loi-app-service-info.log',
            level: 'info',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        }),
        /*Log errors to file */
        new (winston.transports.File)({
            timestamp: function() {
                var date = new Date();
                return date.toISOString();
            },
            formatter: function(options) {
                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            },
            name: 'error-file',
            filename: process.env.ERRORLOG || 'logs/fco-loi-app-service-error.log',
            level: 'error',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        }),
        /*Log errors to console */
        new (winston.transports.Console)({
            timestamp: function() {
                var date = new Date();
                return date.toISOString();
            },
            formatter: function(options) {
                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            },
            name: 'error-console',
            level: 'error',
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});




module.exports.log = {

    /***************************************************************************
     *                                                                          *
     * Valid `level` configs: i.e. the minimum log level to capture with        *
     * sails.log.*()                                                            *
     *                                                                          *
     * The order of precedence for log levels from lowest to highest is:        *
     * silly, verbose, info, debug, warn, error                                 *
     *                                                                          *
     * You may also set the level to "silent" to suppress all logs.             *
     *                                                                          *
     ***************************************************************************/

    // level: 'info'

    colors: true,  // To get clean logs without prefixes or color codings
    custom: customLogger
};
