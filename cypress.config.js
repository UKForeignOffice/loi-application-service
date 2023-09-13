const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  video: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'a11y-test-results.xml',
    toConsole: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://www.demo.legalisation.fcodev.org.uk',
  },
})
