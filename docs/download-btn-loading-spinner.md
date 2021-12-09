# Download loading spinner

Because the eApp allows up to 50 200MB files to be uploaded, once these are legalised by Casebook, depending on the user's connection speed, large files could take a while from when the 'Download' button is clicked to when the download starts.

The loading spinner is in place to temper user expectation.

## How it works

This is a client side only feature that works when Javascript is enabled on the user's browser. If JS isn't enabled the spinner will not be shown.

Once the 'Download' button is clicked, the spinner will be shown and a call is made to the api to download the file.