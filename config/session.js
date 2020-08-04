/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */
require('dotenv').config()
var session = JSON.parse(process.env.THESESSION);

module.exports.session = {

  /***************************************************************************
   *                                                                          *
   * Session secret is automatically generated when your new app is created   *
   * Replace at your own risk in production-- you will invalidate the cookies *
   * of your users, forcing them to log in again.                             *
   *                                                                          *
   ***************************************************************************/
  secret: session.secret,

  // adapter: 'connect-mongo',
  // url: 'mongodb://localhost:27017/User_Service',
  // collection: 'sessions'
  // name: session.key,
  domain: session.domain,
  cookie: {
        maxAge: 1800000,
        rolling: true
  },
  url: `mongodb://${session.host}:${session.port}/${session.db}`,
  collection: session.collection,
  auto_reconnect: false,
  ssl: false,
  stringify: true
  /***************************************************************************
   *                                                                          *
   * Customize when built-in session support will be skipped.                 *
   *                                                                          *
   * (Useful for performance tuning; particularly to avoid wasting cycles on  *
   * session management when responding to simple requests for static assets, *
   * like images or stylesheets.)                                             *
   *                                                                          *
   * https://sailsjs.com/config/session                                       *
   *                                                                          *
   ***************************************************************************/
  // isSessionDisabled: function (req){
  //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  // },

};
