import { configDefaults, defineConfig } from 'vitest/config'

const coverageReportsDirectory = process.env.VITEST_COVERAGE_DIR || `coverage/vitest-${process.pid}`

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: ['tests/vitest/bootstrap.vitest.js'],
    testTimeout: 60000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: 'test',
      PORT: '6009',
    },
    exclude: [...configDefaults.exclude],
    include: ['tests/vitest/specs/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reportsDirectory: coverageReportsDirectory,
      include: ['server/**/*.js', '!server/app.js', '!server/server.js'],
      thresholds: {
        lines: 33,
        functions: 25,
        branches: 24,
        statements: 33,
      },
    },
  },
})
