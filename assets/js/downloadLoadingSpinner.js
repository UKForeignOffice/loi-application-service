var DownloadLoadingSpinner = {
    init() {
        var buttonsWithSpinner = document.querySelectorAll(
            '.js-download-spinner'
        );

        buttonsWithSpinner.forEach((buttonElement) => {
            buttonElement.addEventListener('click', (event) => {
                event.preventDefault();
                DownloadLoadingSpinner.showSpinner(buttonElement);
                DownloadLoadingSpinner.downloadFile(buttonElement);
            });
        });
    },

    showSpinner(buttonElement) {
        buttonElement.classList.add('download-loading-spinner');
    },

    async downloadFile(buttonElement) {
        try {
            var response = await fetch(buttonElement.href);
            var repsoneBlob = await response.blob();
            var fileUrl = window.URL.createObjectURL(repsoneBlob);
            var fileName = response.headers.get('Content-Disposition').split(';')[1].split('=')[1];

            DownloadLoadingSpinner.createLinkForFileAndDownload(fileUrl, fileName);

            if (response.ok) {
                DownloadLoadingSpinner.removeSpinner(buttonElement);
            }
        } catch (error) {
            console.error(error);
        }
    },

    createLinkForFileAndDownload(fileUrl, fileName) {
        var tempAnchor = document.createElement('a');
        tempAnchor.href = fileUrl;
        tempAnchor.download = fileName;
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        tempAnchor.remove();
    },

    removeSpinner(buttonElement) {
        buttonElement.classList.remove('download-loading-spinner');
    },
};

DownloadLoadingSpinner.init();
