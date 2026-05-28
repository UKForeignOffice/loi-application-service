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

const express = require('express')
const path = require('node:path')
const crypto = require('crypto')
const oneDay = 24 * 60 * 60 * 1000
const cacheBust = crypto.randomBytes(4).toString('hex')
const govukFrontendStatic = express.static(path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk'), {
  maxAge: oneDay,
})

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
      'normaliseSessionTtl',
      'poweredBy',
      'router',
      'www',
    ],

    healthcheck: (req, res, next) => {
      if (req.path === '/healthcheck') {
        return res.json({ message: 'Application Service is running' })
      }
      next()
    },

    flash: require('connect-flash')(),

    govukFrontendAssets: (req, res, next) => {
      if (!req.path.startsWith('/govuk-frontend')) {
        return next()
      }

      req.url = req.url.replace(/^\/govuk-frontend/, '') || '/'
      return govukFrontendStatic(req, res, next)
    },

    cacheBust: (_req, res, next) => {
      res.locals.cacheBust = cacheBust
      return next()
    },

    normaliseSessionTtl: (() => (req, res, next) => {
      const configuredTtl = parseInt(req._sails.config.session.cookie.maxAge, 10)

      if (Number.isNaN(configuredTtl) || configuredTtl <= 0) {
        return next()
      }

      if (req.session?.cookie) {
        const currentTtl = parseInt(req.session.cookie.originalMaxAge, 10)

        if (currentTtl !== configuredTtl) {
          req.session.cookie.maxAge = configuredTtl
          req.session.cookie.originalMaxAge = configuredTtl
          req.session.cookie.expires = new Date(Date.now() + configuredTtl)

          return req.session.save((err) => {
            if (err) {
              return next(err)
            }

            if (req.cookies?.LoggedIn) {
              res.cookie('LoggedIn', true, {
                maxAge: configuredTtl,
                httpOnly: true,
              })
            }

            return next()
          })
        }
      }

      if (req.cookies?.LoggedIn) {
        res.cookie('LoggedIn', true, {
          maxAge: configuredTtl,
          httpOnly: true,
        })
      }

      return next()
    })(),

    fileMiddleware: (() => require('../api/controllers/FileUploadController').setupMulterMiddleware())(),
  },
}
