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
        buttonElem.querySelector('.js-download-btn-text').innerHTML = 'Downloading...';
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
            )
        });

        response.fail(function (_jqXHR, _textStatus, errorThrown) {
            console.error(errorThrown);
            DownloadFileSpinner.handleUnsuccessfulDownload();
        });
    },

    handleSuccessfulDownload: function (repsoneBlob, buttonElem) {
        var fileUrl = window.URL.createObjectURL(repsoneBlob);
        var hrefURLMinusProtocol = buttonElem.href.split('//')[1];
        var apostilleRefFromHref = hrefURLMinusProtocol.split('/')[3];
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
        buttonElem.querySelector('.js-download-btn-text').innerHTML = 'Download';
    },

    handleUnsuccessfulDownload: function () {
        window.location.href = "/download-file-error";
    }
};

DownloadFileSpinner.init();
