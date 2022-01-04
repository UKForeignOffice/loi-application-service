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
                UploadProgressBar.hideButtonShowProgressBar();
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
            var progressPct = (event.loaded / event.total) * 100;

            progressBar.ariaValueNow = Math.round(progressPct);
            progressBar.style.width = Math.round(progressPct) + '%';
            totalBytesToUpload = event.total;
            totalBytesUploaded = event.loaded;
        });

        request.open('POST', emptyPostRequest);
        request.send(formData);
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

    hideButtonShowProgressBar: function () {
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
    }, 1000);
};

UploadProgressBar.init();
getTimeRemaining();
