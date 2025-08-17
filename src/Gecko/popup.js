var errorText = document.getElementById("errorText");
var redirectButton = document.getElementById("redirectButton");
var optionsButton = document.getElementById("optionsButton");
var opinionButton = document.getElementById("opinionButton");
var suggestionButton = document.getElementById("suggestionButton");
var issueButton = document.getElementById("issueButton");

document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        if (
            url.startsWith("https://www.youtube.com/watch?v=") ||
            url.startsWith("https://www.youtube.com/playlist?list=") ||
            url.startsWith("https://www.youtube.com/@") ||
            url.startsWith("https://www.youtube.com/channel/")
        ) {
            loadOptions(url, tabs);
        } else {
            fetch(`i18n/locales/${lang}.json`)
                .then((response) => response.json())
                .then((data) => {
                    errorText.innerHTML = data.ui.error.e404;
                    redirectButton.disabled = true;
                });
        }
    });
});

function loadOptions(url, tabs) {
    browser.storage.local.get("popupBehavior").then(function (result) {
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

redirectButton.addEventListener("click", function () {
    if (redirectButton.disabled === false) {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                var url = tabs[0].url;
                openInFreeTube(url, tabs);
            }
        );
    }
});

optionsButton.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
});

opinionButton.addEventListener("click", function () {
    chrome.tabs.create({
        url: "https://addons.mozilla.org/firefox/addon/redirecttube/",
    });
});

suggestionButton.addEventListener("click", function () {
    chrome.tabs.create({
        url: "https://github.com/MStankiewiczOfficial/RedirectTube/issues/new?assignees=MStankiewiczOfficial&labels=enhancement&projects=&template=feature-request.yml&title=%5BFR%5D%3A+",
    });
});

issueButton.addEventListener("click", function () {
    chrome.tabs.create({
        url: "https://github.com/MStankiewiczOfficial/RedirectTube/issues/new?assignees=MStankiewiczOfficial&labels=bug&projects=&template=bug-report.yml&title=%5BBug%5D%3A+",
    });
});
