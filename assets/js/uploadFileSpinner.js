var timeStarted = 0;
var totalFilesToUpload = 0;
var totalBytesToUpload = 0;
var totalBytesUploaded = 0;

var UploadProgressBar = {
    init: function () {
        var uploadBtn = document.querySelector('.js-trigger-progress-bar');

        uploadBtn.addEventListener('click', function (_event) {
            var hasSelectedFiles = UploadProgressBar.checkFilesSelected();

            if (hasSelectedFiles) {
                timeStarted = new Date();
                var formData = UploadProgressBar.createDataForForm();
                UploadProgressBar.pretendToSendFormData(formData);
                UploadProgressBar.hideUploadButtonAndShowProgressBar();
            }
        });
    },

    checkFilesSelected: function () {
        var fileInput = document.querySelector('.js-multi-file-input');
        return fileInput.files.length > 0;
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

    pretendToSendFormData: function (formData) {
        var request = new XMLHttpRequest();
        var emptyPostRequest = '';

        request.upload.addEventListener('progress', function (event) {
            var progressBar = document.querySelector('.js-upload-progress-bar');
            var progressVal = (event.loaded / event.total) * 100;
            var progressPct = Math.round(progressVal);

            progressBar.ariaValueNow = progressPct;
            progressBar.style.width = progressPct + '%';
            totalBytesToUpload = event.total;
            totalBytesUploaded = event.loaded;

            if (progressPct === 100) {
                UploadProgressBar.showFileScanning();
            }
        });

        request.open('POST', emptyPostRequest);
        request.send(formData);
    },

    showFileScanning: function () {
        var progressBar = document.querySelector('.js-upload-progress-bar');
        var progressBarText = document.querySelector('.js-upload-progress-text');
        var secondsRemaining = document.querySelector('.js-upload-seconds-remaining');

        progressBar.classList.add('upload-progress--bar__stripes');
        progressBarText.innerHTML = 'Scanning uploaded files for viruses...';
        secondsRemaining.style.display = 'none';
    },

    displayTimeRemaining: function (timeRemainingInSeconds) {
        var secondsRemainingElem = document.querySelector(
            '.js-upload-seconds-remaining'
        );
        var secondsStr = 'seconds';
        if (timeRemainingInSeconds === 1) {
            secondsStr = 'second';
        }
        secondsRemainingElem.innerHTML =
            timeRemainingInSeconds + ' ' + secondsStr + ' remaining';
    },

    hideUploadButtonAndShowProgressBar: function () {
        var uploadBtn = document.querySelector('.js-upload-btn');
        var progressBar = document.querySelector('.js-progress-bar');

        uploadBtn.classList.add('govuk-!-display-none');
        progressBar.classList.remove('govuk-!-display-none');
    },
};

/**
 * @ref https://stackoverflow.com/a/21163574/2395062
 */
function getTimeRemaining() {
    setInterval(function () {
        if (timeStarted !== 0) {
            var timeElapsed = new Date() - timeStarted;
            var uploadSpeed = totalBytesUploaded / (timeElapsed / 1000);
            var timeRemainingInSeconds =
                (totalBytesToUpload - totalBytesUploaded) / uploadSpeed;
            UploadProgressBar.displayTimeRemaining(
                Math.round(timeRemainingInSeconds / 10)
            );
        }
    }, 500);
};

function browserIsIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0 || trident > 0) {
        return true;
    }

    return false;
}

if (!browserIsIE()) {
    UploadProgressBar.init();
    getTimeRemaining();
}
