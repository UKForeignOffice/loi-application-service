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

const { createLogger, format, transports } = require('winston')

const { combine, timestamp, simple, logstash, colorize } = format

const nonProductionLogFormat = format.combine(colorize({ level: true }), format.splat(), simple())

const productionLogstashFormat = combine(timestamp(), logstash())

const customFormat = process.env.NODE_ENV === 'production' ? productionLogstashFormat : nonProductionLogFormat

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'loi-application-service' },
  transports: [new transports.Console({ level: 'info', handleExceptions: true, handleRejections: true })],
  exitOnError: false,
})

logger.info(process.env.NODE_ENV === 'production' ? 'Production logging enabled' : 'Development logging enabled')

module.exports.logger = logger

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

  colors: true, // To get clean logs without prefixes or color codings
  custom: logger,
}
