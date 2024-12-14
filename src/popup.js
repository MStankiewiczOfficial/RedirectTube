var errorText = document.getElementById("errorText");

function openInFreeTube() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        if (url.startsWith("https://www.youtube.com/watch?v=")) {
            var freeTubeUrl = "freetube://" + url;
            chrome.tabs.update(tabs[0].id, {url: freeTubeUrl});
            window.close();
        } else {
            errorText.innerHTML = "Cannot open this page in FreeTube.";
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    openInFreeTube();
});