var LOADING_SPINNER_CSS_CLASS = 'download-loading-spinner';

var DownloadLoadingSpinner = {
    init: function () {
        var buttonsWithSpinner = document.querySelectorAll(
            '.js-download-spinner'
        );

        buttonsWithSpinner.forEach((buttonElem) => {
            buttonElem.addEventListener('click', (event) => {
                event.preventDefault();
                DownloadLoadingSpinner.showSpinner(buttonElem);
                DownloadLoadingSpinner.downloadFile(buttonElem);
            });
        });
    },

    showSpinner: function (buttonElem) {
        buttonElem.classList.add(LOADING_SPINNER_CSS_CLASS);
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
            DownloadLoadingSpinner.handleSuccessfulDownload(
                repsoneBlob,
                buttonElem
            )}
        );

        response.fail(function() {
            console.error(error);
        });
    },

    handleSuccessfulDownload: function (repsoneBlob, buttonElem) {
        var fileUrl = window.URL.createObjectURL(repsoneBlob);

        var hrefMinusProtocol = buttonElem.href.split('//')[1];
        var apostilleRefFromHref = hrefMinusProtocol.split('/')[3];
        var fileName = 'Apostille-' + apostilleRefFromHref + '.pdf';

        DownloadLoadingSpinner.createLinkForFileAndDownload(
            fileUrl,
            fileName
        );
        DownloadLoadingSpinner.removeSpinner(buttonElem);
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
        buttonElem.classList.remove(LOADING_SPINNER_CSS_CLASS);
    },
};

DownloadLoadingSpinner.init();
