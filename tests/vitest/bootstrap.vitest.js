const Sails = require('sails')
const cp = require('node:child_process')

if (typeof global.File === 'undefined') {
  global.File = class File {}
}

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') {
    const config = require('../../config/environment-variables')
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

      try {
        cp.execFileSync(
          'psql',
          ['-U', pgUser, '-h', pgHost, '-p', pgPort, '-d', pgDatabase, '-c', 'SELECT 1'],
          { stdio: 'ignore', env: psqlEnv },
        )
      } catch (_error) {
        console.log('Skipping test DB restore: postgres is not reachable')
        return
      }

      try {
        cp.execFileSync('psql', ['-U', pgUser, '-h', pgHost, '-p', pgPort, '-f', 'tests/files/FCO_LOI_Service_Test.sql'], {
          stdio: 'pipe',
          env: psqlEnv,
        })
      } catch (_error) {
        // Preserve old behavior where restore failures are logged but do not block suite startup.
        console.log('Skipping test DB restore: restore command failed')
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
