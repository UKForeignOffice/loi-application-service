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

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const oneDay = 24 * 60 * 60 * 1000;
const cacheBust = crypto.randomBytes(4).toString('hex');
const govukFrontendStatic = express.static(
  path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk'),
  { maxAge: oneDay },
);

module.exports.http = {
  cache: oneDay, // 1 day in milliseconds
  trustProxy: true,
  middleware: {

    poweredBy: false,

    order: [
      'healthcheck',
      'cookieParser',
      'session',
      'flash',
      'fileMiddleware',
      'bodyParser',
      'compress',
      'govukFrontendAssets',
      'cacheBust',
      'updateLoggedInCookie',
      'poweredBy',
      'router',
      'www',
    ],

    healthcheck: function(req, res, next) {
      if (req.path === '/healthcheck') {
        return res.json({ message: 'Application Service is running' });
      }
      next();
    },

    flash: require('connect-flash')(),

    govukFrontendAssets: function(req, res, next) {
      if (!req.path.startsWith('/govuk-frontend')) {
        return next();
      }

      req.url = req.url.replace(/^\/govuk-frontend/, '') || '/';
      return govukFrontendStatic(req, res, next);
    },

    cacheBust: function(req, res, next) {
      res.locals.cacheBust = cacheBust;
      return next();
    },

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
