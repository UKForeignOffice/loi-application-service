module.exports = {
  file: './tests/bootstrap.test.js',
  spec: './tests/specs/**/*.test.js',
  ignore: ['./tests/vitest/**/*.test.js'],
  timeout: '10000',
  recursive: true,
  exit: true,
}
