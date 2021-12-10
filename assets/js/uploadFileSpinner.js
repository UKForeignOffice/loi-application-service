var UploadFileSpinner = {
    init: function() {
        var buttonElem = document.querySelector(
            '.js-trigger-spinner'
        );

        buttonElem.addEventListener('click', function (_event) {
            var hasSelectedFiles = UploadFileSpinner.checkFilesSelected();

            if (hasSelectedFiles) {
                UploadFileSpinner.showSpinnerHideContent();
            }
        });
    },

    checkFilesSelected: function() {
        var fileInput = document.querySelector('.js-multi-file-input');
        return fileInput.files.length > 0;
    },

    showSpinnerHideContent: function() {
        var content = document.querySelector('.js-upload-content-wrapper');
        var spinner = document.querySelector('.js-upload-spinner-wrapper');

        content.classList.add('govuk-!-display-none');
        spinner.classList.remove('govuk-!-display-none');
    },
}

UploadFileSpinner.init();
