var timeStarted = 0;
var totalFilesToUpload = 0;
var totalBytesToUpload = 0;
var totalBytesUploaded = 0;

var UploadProgressBar = {
    init: function () {
        var uploadBtn = document.querySelector('.js-trigger-progress-bar');
        var timeoutToTriggerLoaderInSafari = 1000;

        uploadBtn.setAttribute('type', 'button');

        uploadBtn.addEventListener('click', function (_event) {
            var hasSelectedFiles = UploadProgressBar.checkFilesSelected();

            if (hasSelectedFiles) {
                timeStarted = new Date();
                UploadProgressBar.hideUploadButtonAndShowProgressBar();
                UploadProgressBar.pretendToSendFormData();
            }

            setTimeout(function () {
                document.querySelector('.js-upload-form').submit();
            }, timeoutToTriggerLoaderInSafari);
        });
    },

    checkFilesSelected: function () {
        var fileInput = document.querySelector('.js-multi-file-input');

        return fileInput.files.length > 0;
    },

    hideUploadButtonAndShowProgressBar: function () {
        var uploadBtn = document.querySelector('.js-upload-btn');
        var progressBar = document.querySelector('.js-progress-bar');

        uploadBtn.classList.add('govuk-!-display-none');
        progressBar.classList.remove('govuk-!-display-none');
    },

    pretendToSendFormData: function () {
        var request = new XMLHttpRequest();
        var emptyPostRequest = '';
        var formData = UploadProgressBar.createDataForForm();

        request.upload.addEventListener('progress', function (event) {
            var progressPct = Math.round((event.loaded / event.total) * 100);
            var progressBar = document.querySelector('.js-upload-progress-bar');

            progressBar.ariaValueNow = progressPct;
            progressBar.style.width = progressPct + '%';
            totalBytesToUpload = event.total;
            totalBytesUploaded = event.loaded;

            if (event.loaded === event.total) {
                UploadProgressBar.showFileScanning();
            }
        });

        request.onerror = function (err) {
            console.error(err, 'PretendToSendFormData Error');
        };

        request.open('post', emptyPostRequest);
        request.send(formData);
    },

    createDataForForm: function () {
        var uploadInput = document.querySelector('.js-multi-file-input');
        var formData = new FormData();
        var fileListArr = Array.from(uploadInput.files);

        totalFilesToUpload = uploadInput.files.length;
        fileListArr.forEach(function (file, index) {
            formData.append('file' + index, file);
        });

        return formData;
    },

    showFileScanning: function () {
        var progressBar = document.querySelector('.js-upload-progress-bar');
        var progressBarText = document.querySelector(
            '.js-upload-progress-text'
        );

        progressBar.classList.add('upload-progress__bar--stripes');
        progressBarText.innerHTML =
            'Checking documents and scanning for viruses...';
    },
};

function browserIsIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    return msie > 0 || trident > 0;
}

if (!browserIsIE()) {
    UploadProgressBar.init();
}
