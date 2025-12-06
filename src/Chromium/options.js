const extensionApi = typeof chrome !== "undefined" ? chrome : browser;

var popupBehavior = "showPopup";
var autoRedirectLinks = "autoRedirectLinksNo";
var iframeButton = "iframeButtonYes";
var extensionIcon = "color";

function saveOptions(e) {
    setTimeout(() => {
        e.preventDefault();
        extensionApi.storage.local.set({
            popupBehavior: document.getElementById("popupBehavior").value,
            autoRedirectLinks: document.getElementById("autoRedirectLinks").value,
            iframeButton: document.getElementById("iframeButton").value,
            extensionIcon: document.querySelector(
                'input[name="extensionIcon"]:checked'
            ).value,
        });
        extensionApi.runtime.sendMessage({ message: "detectYT" });
    }, 1);
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.getElementById("popupBehavior").value =
            result.popupBehavior || popupBehavior;
        document.getElementById("autoRedirectLinks").value =
            result.autoRedirectLinks || autoRedirectLinks;
        document.getElementById("iframeButton").value =
            result.iframeButton || iframeButton;
        document.querySelector(
            'input[name="extensionIcon"][value="' +
                (result.extensionIcon || extensionIcon) +
                '"]'
        ).checked = true;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    extensionApi.storage.local.get(
        [
            "popupBehavior",
            "autoRedirectLinks",
            "iframeButton",
            "extensionIcon",
        ],
        function (result) {
            if (extensionApi.runtime.lastError) {
                onError(extensionApi.runtime.lastError);
                return;
            }
            setCurrentChoice(result || {});
        }
    );
}

opinionButton.addEventListener("click", function () {
    extensionApi.tabs.create({
        url: "https://addons.mozilla.org/firefox/addon/redirecttube/",
    });
});

suggestionButton.addEventListener("click", function () {
    extensionApi.tabs.create({
        url: "https://github.com/MStankiewiczOfficial/RedirectTube/issues/new?assignees=MStankiewiczOfficial&labels=enhancement&projects=&template=feature-request.yml&title=%5BFR%5D%3A+",
    });
});

issueButton.addEventListener("click", function () {
    extensionApi.tabs.create({
        url: "https://github.com/MStankiewiczOfficial/RedirectTube/issues/new?assignees=MStankiewiczOfficial&labels=bug&projects=&template=bug-report.yml&title=%5BBug%5D%3A+",
    });
});

setTimeout(() => {
    document.querySelector("#version").textContent =
        extensionApi.runtime.getManifest().version;
}, 10);

document.addEventListener("DOMContentLoaded", restoreOptions);
document
    .querySelector("#popupBehavior")
    .addEventListener("change", saveOptions);
document
    .querySelector("#autoRedirectLinks")
    .addEventListener("change", saveOptions);
document.querySelector("#iframeButton").addEventListener("change", saveOptions);
document.querySelector("#colorIcon").addEventListener("click", saveOptions);
document.querySelector("#monoIcon").addEventListener("click", saveOptions);
