const fs = require('fs');
const path = require('path');

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

/**
 * @ref docs/automated-a11y-testing.md#installing-an-older-version-of-chromium
 **/
function addChromiumBrowser(config) {
    if (!config) {
        console.error('config is undefined');
        return;
    }

    const fullChromiumPath = path.resolve('cypress/browsers/chrome-90-mac');

    fs.access(fullChromiumPath, (error) => {
        if (error) {
            console.error('Chromium 90 does not exist');
            return;
        }
    });

    const chromiumOptions = {
        name: 'chromium',
        channel: 'stable',
        family: 'chromium',
        displayName: 'Chromium',
        version: '90.0.4430.93',
        path: `${fullChromiumPath}/chrome-90-mac/Chromium.app/Contents/MacOS/Chromium`,
        majorVersion: 90,
    };

    config.browsers.push(chromiumOptions);
}

module.exports = (on, config) => {
    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chromium') {
            launchOptions.args.push(
                '--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure'
            );
            return launchOptions;
        }
    });
    config = require('cypress-dotenv')(config);
    addChromiumBrowser(config);
    return config;
};
