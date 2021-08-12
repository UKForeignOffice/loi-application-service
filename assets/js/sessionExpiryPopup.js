//Modal Popup Controller
function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'none') {
        e.style.display = 'block';
    } else if (e.style.display == 'block') {
        e.style.display = 'none';
    }
}

function startTimer(sessionTimeoutWarning, req) {
    const timeoutDurationInSeconds = sessionTimeoutWarning / 1000;
    const element = document.getElementById('sessionAlert');
    const queryParams = generateQueryParams(req);
    const display = document.querySelector('#displayTime');
    let timer = timeoutDurationInSeconds,
        minutes,
        seconds;

    element.innerText = 'Session will expire in 5 minutes';
    toggle_visibility('expiry-warning');
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent =
            minutes + ' minute(s) and ' + seconds + ' seconds';
        timer = timer - 1;

        if (timer < 0) {
            clearInterval(interval);
            toggle_visibility('expiry-warning');
            window.location.href = `/session-expired${queryParams}`;
        }
    }, 1000);

    function generateQueryParams(requestData) {
        const { loggedIn, appType, uploadedFiles } = requestData;
        const isEApp = appType === 4;
        if (isEApp && uploadedFiles.length > 0) {
            return `?LoggedIn=${loggedIn}&UploadedFiles=${generateFileList(
                uploadedFiles
            )}`;
        }
        return `?LoggedIn=${loggedIn}`;
    }

    function generateFileList(uploadedFiles) {
        const fileList = uploadedFiles.map(
            (uploadedFile) => uploadedFile.storageName
        );
        return fileList.join();
    }
}
