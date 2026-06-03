import { configDefaults, defineConfig } from 'vitest/config'

const coverageReportsDirectory = process.env.VITEST_COVERAGE_DIR || `coverage/vitest-${process.pid}`

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: ['tests/bootstrap.vitest.js'],
    testTimeout: 60000,
    hookTimeout: 60000,
    env: {
      NODE_ENV: 'test',
      PORT: '6009',
      PGPASSWORD: 'password',
    },
    exclude: [...configDefaults.exclude],
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reportsDirectory: coverageReportsDirectory,
      thresholds: {
        statements: 33,
        branches: 25,
        functions: 26,
        lines: 33,
      },
    },
  },
})
