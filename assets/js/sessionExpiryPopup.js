//Modal Popup Controller
function set_visible(id) {
    var e = document.getElementById(id);
    e.style.display = 'block';
}

function set_invisible(id) {
  var e = document.getElementById(id);
  e.style.display = 'none';
}

function startTimer(timerDuration, loggedIn) {
    var timeoutDurationInSeconds = timerDuration / 1000;
    var display = document.querySelector('#displayTime');
    var timer = timeoutDurationInSeconds,
        minutes,
        seconds;
    set_visible('expiry-warning');
    var interval = setInterval(function(){
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent =
            minutes + ' minute(s) and ' + seconds + ' seconds';
        timer = timer - 1;
        if (timer < 0) {
            clearInterval(interval);
            set_invisible('expiry-warning');
            window.location.href = '/session-expired?LoggedIn=' + loggedIn;
        }
    }, 1000);
}
