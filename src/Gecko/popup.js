var errorText = document.getElementById("errorText");
var redirectButton = document.getElementById("redirectButton");
var settingsButton = document.getElementById("settingsButton");

document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        if (url.startsWith("https://www.youtube.com/watch?v=")) {
            loadOptions(url, tabs);
        } else {
            errorText.innerHTML = "Cannot open this page in FreeTube.";
            redirectButton.disabled = true;
        }
    });
});

function loadOptions(url, tabs) {
    browser.storage.local.get('popupBehavior').then(function(result) {
        if (result.popupBehavior === "redirect") {
            openInFreeTube(url, tabs);
        }
    });
}
function openInFreeTube(url, tabs) {
    var freeTubeUrl = "freetube://" + url;
    chrome.tabs.update(tabs[0].id, { url: freeTubeUrl });
    window.close();
}

redirectButton.addEventListener('click', function() {
    if (redirectButton.disabled === false) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var url = tabs[0].url;
            openInFreeTube(url, tabs);
        });
    }
});

settingsButton.addEventListener('click', function() {
    if (settingsButton.disabled === false) {
        chrome.runtime.openOptionsPage();
    }
});