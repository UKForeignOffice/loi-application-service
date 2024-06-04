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


const winston = require('winston');

const customLogger = winston.createLogger({
  transports: [
    /*Log info to console*/
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => {
          return `${info.level.toUpperCase()}: ${info.message}`;
        })
      ),
      name: 'info-console',
      level: 'info',
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    /*Log errors to console */
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => {
          return `${info.level.toUpperCase()}: ${info.message}`;
        })
      ),
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
