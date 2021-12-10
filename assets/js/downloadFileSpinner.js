var LOADING_SPINNER_CSS_CLASS = 'download-spinner--anim';
var SPINNER_ELEM_CSS_CLASS = '.js-spinner-location';

var DownloadFileSpinner = {
    init: function () {
        var buttonsWithSpinnerClass = document.querySelectorAll(
            '.js-download-spinner'
        );

        buttonsWithSpinnerClass.forEach(function (buttonElem) {
            buttonElem.addEventListener('click', function (event){
                event.preventDefault();
                DownloadFileSpinner.showSpinner(buttonElem);
                DownloadFileSpinner.downloadFile(buttonElem);
            });
        });
    },

    showSpinner: function (buttonElem) {
        var spinnerElem = buttonElem.querySelector(SPINNER_ELEM_CSS_CLASS);
        spinnerElem.classList.add(LOADING_SPINNER_CSS_CLASS);
    },

    downloadFile: function (buttonElem) {
        var response = $.ajax({
            xhrFields: {
                responseType: 'blob',
            },
            type: 'GET',
            url: buttonElem.href,
        });

        response.done(function (repsoneBlob) {
            DownloadFileSpinner.handleSuccessfulDownload(
                repsoneBlob,
                buttonElem
            )}
        );

        response.fail(function() {
            console.error(error);
            DownloadFileSpinner.displayDownloadError(buttonElem);
        });
    },

    handleSuccessfulDownload: function (repsoneBlob, buttonElem) {
        var fileUrl = window.URL.createObjectURL(repsoneBlob);

        var hrefMinusProtocol = buttonElem.href.split('//')[1];
        var apostilleRefFromHref = hrefMinusProtocol.split('/')[3];
        var fileName = 'Apostille-' + apostilleRefFromHref + '.pdf';

        DownloadFileSpinner.createLinkForFileAndDownload(
            fileUrl,
            fileName
        );
        DownloadFileSpinner.removeSpinner(buttonElem);
    },

    createLinkForFileAndDownload: function (fileUrl, fileName) {
        var tempAnchor = document.createElement('a');
        tempAnchor.href = fileUrl;
        tempAnchor.download = fileName;
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        tempAnchor.remove();
    },

    removeSpinner: function (buttonElem) {
        var spinnerElem = buttonElem.querySelector(SPINNER_ELEM_CSS_CLASS);
        spinnerElem.classList.remove(LOADING_SPINNER_CSS_CLASS);
    },

    displayDownloadError: function (buttonElem) {
        var hrefMinusProtocol = buttonElem.href.split('//')[1];
        var apostilleRefFromHref = hrefMinusProtocol.split('/')[3];

        var errorElem = document.querySelector('#file-download-error-' + apostilleRefFromHref);
        errorElem.classList.remove('govuk-!-display-none');
    }
};

DownloadFileSpinner.init();
