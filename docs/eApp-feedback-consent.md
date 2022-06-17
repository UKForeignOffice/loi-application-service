# How feedback consent works for eApp

Feedback consent is set when a user signed up for an account but is also set individually per applicaiton by the user submitting their preference after they submit an applicaiton. So it is possible for a user to opt out of feedback consent for an application when they have opted in for their account.

For eApp applications this works differently but it might change in the future. The feedback_consent is retrieved from the account and not set per applicaiton. If a user has opted out feedback consent, then for each application the feedback_consent in the database will be `false`. If the user turns it on, then this will change to `true`.

## How this works

Because user account information is retrieved and stored in the session whenever a user logs in. This is value is placed in the feedback_consent field when an applicaiton is submitted.