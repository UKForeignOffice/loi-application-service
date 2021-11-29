# How the expiry session works

Thhe session timeout values are stored in the .env file of the project, 'cookieMaxAge' and 'timeoutWarning'. By feault it should be 5 and 30 minutes.

There is a setTimeout in the header.ejs file which triggers a modal after 25 minutes (cookieMaxAge - timeoutWarning). Because this script is client side, on page refresh the 25 minutes is refreshed.

This allo applies for the session data in Redis, this has a ttl set by the cookieMaxAge of 25 minutes. This also gets refreshed when the page refreshes.
https://github.com/tj/connect-redis#readme

When the CTA on the modal is clicked the page refreshes, if the user is inactive on a page for more than 30 minutes their session is lost and they are logged out.

The setTimout triggers a function in sessionExpiryPopup.js called startTimer(). This file is loaded client side in script tags in the header.ejs file.

The only reason I can come up with as to why the modal is triggered in an ejs file and not a js one is because each markup/ejs file has sails gloal variables passed into them, req, res, and these cannot be accessed in a regular .js file.