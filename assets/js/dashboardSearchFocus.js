// Get the URL of the current page
const url = window.location.href;

// Check if the URL contains 'dashboard'
if (url.includes('dashboard')) {
  // Set focus based on different conditions
  if (url.includes('sortOrder=1') || url.includes('sortOrder=-1')) {
    document.getElementById("sortSubmitted").focus();
  } else if (url.includes('sortOrder=2') || url.includes('sortOrder=-2')) {
    document.getElementById("sortAppRef").focus();
  } else if (url.includes('sortOrder=6') || url.includes('sortOrder=-6')) {
    document.getElementById("sortUserRef").focus();
  } else if (url.includes('sortOrder=5') || url.includes('sortOrder=-5')) {
    document.getElementById("sortCost").focus();
  } else if (url.includes('sortOrder=3') || url.includes('sortOrder=-3')) {
    document.getElementById("sortService").focus();
  } else if (url.includes('?clearSearchResults')) {
    document.getElementById("dashboard-search-filter").focus();
  } else if (document.getElementById("dashboard-clear-results")) {
    document.getElementById("dashboard-search-filter").focus();
  }
}
