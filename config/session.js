/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://links.sailsjs.org/docs/config/session
 */
require('dotenv').config()
const session = JSON.parse(process.env.THESESSION);

module.exports.session = {


  secret: session.secret,
  adapter: session.adapter,
  host: session.host,
  port: session.port,
  pass: session.password,
  db: 0,
  prefix: session.prefix,
  name: session.key,
  domain: session.domain,
  tls: process.env.NODE_ENV === 'development' ? undefined : {},
  rolling: true,
  cookie: {
    maxAge: session.cookie.cookieMaxAge,
    timeoutWarning: session.cookie.timeoutWarning
  }
};
