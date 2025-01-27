var popupBehavior = "showPopup";
var iframeButton = "iframeButtonNo";
var extensionIcon = "color";

function saveOptions(e) {
    setTimeout(() => {
        e.preventDefault();
        browser.storage.local.set({
            popupBehavior: document.getElementById("popupBehavior").value,
            iframeButton: document.getElementById("iframeButton").value,
            extensionIcon: document.querySelector('input[name="extensionIcon"]:checked').value
        });
        chrome.runtime.sendMessage({ message: "detectYT" });
    }, 1);

}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.getElementById("popupBehavior").value = result.popupBehavior || popupBehavior;
        document.getElementById("iframeButton").value = result.iframeButton || iframeButton;
        document.querySelector('input[name="extensionIcon"][value="' + (result.extensionIcon || extensionIcon) + '"]').checked = true;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get(["popupBehavior", "iframeButton", "extensionIcon"]);
    getting.then(setCurrentChoice, onError);
}

opinionButton.addEventListener('click', function() {
    chrome.tabs.create({ url: "https://addons.mozilla.org/firefox/addon/redirecttube/" });
});

suggestionButton.addEventListener('click', function() {
    chrome.tabs.create({ url: "https://github.com/MStankiewiczOfficial/RedirectTube/issues/new?assignees=MStankiewiczOfficial&labels=enhancement&projects=&template=feature-request.yml&title=%5BFR%5D%3A+" });
});

issueButton.addEventListener('click', function() {
    chrome.tabs.create({ url: "https://github.com/MStankiewiczOfficial/RedirectTube/issues/new?assignees=MStankiewiczOfficial&labels=bug&projects=&template=bug-report.yml&title=%5BBug%5D%3A+" });
});

setTimeout(() => {
    document.querySelector("#version").textContent = browser.runtime.getManifest().version;
}, 10);

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#popupBehavior").addEventListener("change", saveOptions);
document.querySelector("#iframeButton").addEventListener("change", saveOptions);
document.querySelector("#colorIcon").addEventListener("click", saveOptions);
document.querySelector("#monoIcon").addEventListener("click", saveOptions);