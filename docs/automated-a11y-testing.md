# Automated accessibility tests

This is done using [cypress](https://github.com/cypress-io/cypress), [axe](https://github.com/dequelabs/axe-core), and [cypress-axe](https://github.com/component-driven/cypress-axe)

## Prerequisite

1 - Make sure you have these values populated in the `.env` file:
```
CYPRESS_EMAIL=<your login email>
CYPRESS_PASSWORD=<your login password>
```

2 - The tests will all fail if the Cognito Login screen is not bypassed. Please make sure you have your IP whitelisted to avoid this.

3 - Don't run tests on localhost! For some reaons testing on localhost takes a long time for the page to load. THe *cypress.json* file has the demo site at the baseUrl but feel free to change that if necessary.
```json5
{
  "baseUrl": "https://www.demo.legalisation.fcodev.org.uk",
  //...
}
```

## Running the tests

After installing all the dependencies run...

1 - For development
```sh
npm run cypress
```
This allows you to see what the browser is doing

2 - For CI/PROD
```sh
npm run a11y-tests
```
This runs headlessly and exports the report to the terminal as well as an xml file called **a11y-test-results.xml**
This is useful for AWS reporting but hasn't yet been configured because the tests take a while to run, even headlessly.


## Skipping the payment page

As the GOV.Pay stuf does not need to be accessibility tested, these pages have been skipped and jumps to the applicaiton success page.

To get to the applicaiton success page the application id is required which is stored on the redis session as `appId`.

This is added to the confirmaiton page as `data-testid="app-id" data-value="<%= req.session.appId %>"` and this is picked up by the a11y test.
