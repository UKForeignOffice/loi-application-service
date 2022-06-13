var uploadBtn = document.querySelector('.js-trigger-progress-bar');

var UploadProgressBar = {
    init: function () {
        uploadBtn.setAttribute('type', 'button');

        uploadBtn.addEventListener('click', function (_event) {
            var hasSelectedFiles = UploadProgressBar.checkFilesSelected();

            if (hasSelectedFiles) {
                UploadProgressBar.hideUploadButtonShowProgressBar();
            }

            document.querySelector('.js-upload-form').submit();
        });
    },

    checkFilesSelected: function () {
        var fileInput = document.querySelector('.js-multi-file-input');

        return fileInput.files.length > 0;
    },

    hideUploadButtonShowProgressBar: function () {
        var uploadBtn = document.querySelector('.js-upload-btn');
        var progressBar = document.querySelector('.js-progress-bar');

        uploadBtn.classList.add('govuk-!-display-none');
        progressBar.classList.remove('govuk-!-display-none');
    },

};

function browserIsIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    return msie > 0 || trident > 0;
}

if (!browserIsIE() && uploadBtn) {
    UploadProgressBar.init();
}
