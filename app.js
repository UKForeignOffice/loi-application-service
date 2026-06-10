/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */

const { logger } = require('./config/log.js')

process.on('uncaughtException', (error, origin) => {
  logger.error('----- Uncaught Exception -----', { error, origin })
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('----- Unhandled Rejection -----', { reason, promise })
})

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname)

// Ensure a "sails" can be located:
let sails
try {
  sails = require('sails')
} catch (_e) {
  logger.error(
    'To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.',
  )
  logger.error('To do that, run `npm install sails`')
  logger.error('')
  logger.error(
    'Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.',
  )
  logger.error(
    'When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,',
  )
  logger.error("but if it doesn't, the app will run with the global sails instead!")
}

// Try to get `rc` dependency
let rc
try {
  rc = require('rc')
} catch (_e0) {
  try {
    rc = require('sails/node_modules/rc')
  } catch (_e1) {
    logger.error('Could not find dependency: `rc`.')
    logger.error('Your `.sailsrc` file(s) will be ignored.')
    logger.error('To resolve this, run:')
    logger.error('npm install rc --save')
    rc = () => ({})
  }
}

// Start server
sails.lift(rc('sails'))
module.exports.sails = sails
