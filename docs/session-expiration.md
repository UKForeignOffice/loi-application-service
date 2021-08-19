# How the expiry session works

Thhe session timeout values are stored in the .env file of the project, 'cookieMaxAge' and 'timeoutWarning'. By feault it should be 5 and 30 minutes.

There is a setTimeout in the header.ejs file which triggers a modal after 25 minutes (cookieMaxAge - timeoutWarning). Because this script is client side, on page refresh the 25 minutes is refreshed.

This allo applies for the session data in Redis, this has a ttl set by the cookieMaxAge of 25 minutes. This also gets refreshed when the page refreshes.
https://github.com/tj/connect-redis#readme

When the CTA on the modal is clicked the page refreshes, if the user is inactive on a page for more than 30 minutes their session is lost and they are logged out.