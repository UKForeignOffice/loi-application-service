const Sails = require('sails')
const cp = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

if (typeof global.File === 'undefined') {
  global.File = class File {}
}

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    const config = require('../config/environment-variables')
    const dbConfig = config.applicationDatabase || {}
    const pgPassword = config.pgpassword || dbConfig.password
    const hasPgPassword = Boolean(pgPassword)
    const pgUser = dbConfig.user || 'postgres'
    const pgHost = dbConfig.host || 'localhost'
    const pgPort = String(dbConfig.port || 5432)
    const pgDatabase = dbConfig.database || 'postgres'
    let hasPsqlCli = false

    try {
      cp.execSync('command -v psql', { stdio: 'ignore' })
      hasPsqlCli = true
    } catch (_error) {
      hasPsqlCli = false
    }

    if (hasPgPassword && hasPsqlCli) {
      const psqlEnv = {
        ...process.env,
        PGPASSWORD: pgPassword,
      }

      let postgresReachable = true
      try {
        cp.execFileSync('psql', ['-U', pgUser, '-h', pgHost, '-p', pgPort, '-d', pgDatabase, '-c', 'SELECT 1'], {
          stdio: 'ignore',
          env: psqlEnv,
        })
      } catch (_error) {
        postgresReachable = false
        console.log('Skipping test DB restore: postgres is not reachable')
      }

      if (postgresReachable) {
        const restoreCandidates = [
          path.resolve(__dirname, 'files/FCO_LOI_Service_Test.sql'),
          path.resolve(__dirname, '../databases/FCO-LOI-Service.sql'),
        ]
        const restoreFile = restoreCandidates.find((candidate) => fs.existsSync(candidate))

        if (!restoreFile) {
          console.log('Skipping test DB restore: no SQL restore file found')
        } else {
          try {
            cp.execFileSync('psql', ['-U', pgUser, '-h', pgHost, '-p', pgPort, '-d', pgDatabase, '-f', restoreFile], {
              stdio: 'pipe',
              env: psqlEnv,
            })
          } catch (_error) {
            // Preserve old behavior where restore failures are logged but do not block suite startup.
            console.log('Skipping test DB restore: restore command failed')
          }
        }
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
      (err, app) => {
        if (err) {
          return reject(err)
        }

        // Preserve legacy Sails test globals used by existing controllers/specs.
        global.sails = app
        global.HelperService = require('../api/services/HelperService')

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
