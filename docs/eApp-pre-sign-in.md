# Pre-sign in flow for eApp

As you've probably noticed, it is possible to start the process for an eApp before signing in, but later you are required to create an account or sign in before continuing.

This is how this particular feature works.

User:
1. visits start page and presses green 'START NOW'
2. selects service from service select page
3. after this a nrw row is created in the Applications table with a few key bits of information:
```js
// ApplicationTyoeController.js
{
    serviceType: selectedServiceType,
    unique_app_id: uniqueApplicationId,
    all_info_correct: '-1',
    user_id: 0,
    submitted: 'draft',
    company_name: 'N/A',
    feedback_consent: 0,
    doc_reside_EU: 0,
    residency: 0,
}
```
4. the numerical id from this row (which is incremented on each new entry) is set as the **appId** and placed in the session
5. the **appType** is also set here and stored in the session.

These two bits of information (appId & appType) and necessary to complete any applicaiton in the service.

<br />

## user_id set AGAIN after login for eApp only

One key thing about the eApp flow is that since the user_id is set to 0 before the user signs, there is no way to identiy that the application belongs to that user which means it will never show up in their dashboard.

To solve this, the user_id is set again in the database after the user signs in.

This takes place on the upload pdf page `FileUploadController._addSignedInIdToApplication(req, res)`.

This way the current application can be assosiated with a user.
