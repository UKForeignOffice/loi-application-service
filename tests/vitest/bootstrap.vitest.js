const Sails = require('sails')
const cp = require('node:child_process')

if (typeof global.File === 'undefined') {
  global.File = class File {}
}

// Keep should-style assertions available for legacy model specs.
require('should')

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    const config = require('../../config/environment-variables')
    const hasPgPassword = Boolean(config.pgpassword)
    let hasPsqlCli = false

    try {
      cp.execSync('command -v psql', { stdio: 'ignore' })
      hasPsqlCli = true
    } catch (_error) {
      hasPsqlCli = false
    }

    if (hasPgPassword && hasPsqlCli) {
      const psqlRestore = `PGPASSWORD=${config.pgpassword} psql -U postgres -f tests/files/FCO_LOI_Service_Test.sql`

      try {
        cp.execSync(psqlRestore, { stdio: 'pipe' })
      } catch (error) {
        // Preserve old behavior where restore failures are logged but do not block suite startup.
        console.log(`Skipping test DB restore due psql restore error: ${error.message}`)
      }
    } else {
      console.log('Skipping test DB restore: missing pgpassword or psql CLI')
    }
  }

  await new Promise((resolve, reject) => {
    Sails.lift(
      {
        port: process.env.TEST_PORT || 3131,
        log: {
          level: 'silent',
        },
        hooks: {
          orm: false,
          pubsub: false,
          session: false,
          grunt: false,
        },
      },
      (err) => {
        if (err) {
          return reject(err)
        }

        return resolve()
      },
    )
  })
})

afterAll(async () => {
  await new Promise((resolve, reject) => {
    Sails.lower((err) => {
      if (err) {
        return reject(err)
      }

      return resolve()
    })
  })
})
