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
                UploadProgressBar.hideUploadButtonAndShowProgressBar();
                timeStarted = new Date();
                var formData = UploadProgressBar.createDataForForm();
                UploadProgressBar.pretendToSendFormData(formData);
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
            var progressVal = (event.loaded / event.total) * 100;
            var progressPct = Math.round(progressVal);
            var progressBar = $('.js-upload-progress-bar');

            console.log(event.loaded, event.total, 'trigger?');
            progressBar.attr('aria-valuenow', progressPct).css('width', progressPct + '%');
            // progressBar.ariaValueNow = progressPct;
            // progressBar.style.width = progressPct + '%';
            totalBytesToUpload = event.total || 0;
            totalBytesUploaded = event.loaded || 0;

            if (event.loaded === event.total) {
                UploadProgressBar.showFileScanning();
            }
        });

        request.onerror = function (err) {
            console.log(err, 'PretendToSendFormData Error');
        };

        request.open('post', emptyPostRequest);
        request.timeout = 45000;
        request.send(formData);
    },

    showFileScanning: function () {
        var progressBar = document.querySelector('.js-upload-progress-bar');
        var progressBarText = document.querySelector(
            '.js-upload-progress-text'
        );
        var secondsRemaining = document.querySelector(
            '.js-upload-seconds-remaining'
        );

        progressBar.classList.add('upload-progress--bar__stripes');
        progressBarText.innerHTML =
            'Checking documents & scanning for viruses...';
        secondsRemaining.style.display = 'none';
    },

    hideUploadButtonAndShowProgressBar: function () {
        var uploadBtn = document.querySelector('.js-upload-btn');
        var progressBar = document.querySelector('.js-progress-bar');

        uploadBtn.classList.add('govuk-!-display-none');
        progressBar.classList.remove('govuk-!-display-none');
    },

    displayTimeRemaining: function (timeRemainingInSeconds) {
        var secondsRemainingElem = document.querySelector(
            '.js-upload-seconds-remaining'
        );
        var secondsStr = 'seconds';
        console.log(timeRemainingInSeconds, 'timeRemainingInSeconds')

        if (timeRemainingInSeconds === 1) {
            secondsStr = 'second';
        }

        if(isNaN(timeRemainingInSeconds)){
            timeRemainingInSeconds = 0;
        }

        secondsRemainingElem.innerHTML =
            timeRemainingInSeconds + ' ' + secondsStr + ' remaining';
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
}

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
