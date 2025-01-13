chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    detectYT(changeInfo);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        detectYT(tab);
    });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    detectYTInThisTab();
});

browser.runtime.onInstalled.addListener(() => {
    detectYTInThisTab();
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.message === "detectYT") {
        detectYTInThisTab();
    }
});

function detectYTInThisTab() {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.get(tabs[0].id, function (tab) {
            detectYT(tab);
        });
    });
}

function detectYT(changeInfo) {
    openedUrl = changeInfo.url;
    if (openedUrl) {
        if (openedUrl.startsWith("https://www.youtube.com/watch?v=")) {
            browser.storage.local.get("extensionIcon").then(function(result) {
                if (result.extensionIcon === "color") {
                    chrome.action.setIcon({ path: "img/icns/color/allow/64.png" });
                }
                if (result.extensionIcon === "mono") {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        chrome.action.setIcon({ path: "img/icns/mono/white/allow/64.png" });
                    } else {
                        chrome.action.setIcon({ path: "img/icns/mono/black/allow/64.png" });
                    }
                }
            });
        } else {
            browser.storage.local.get("extensionIcon").then(function(result) {
                if (result.extensionIcon === "color") {
                    chrome.action.setIcon({ path: "img/icns/color/disallow/64.png" });
                }
                if (result.extensionIcon === "mono") {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        chrome.action.setIcon({ path: "img/icns/mono/white/disallow/64.png" });
                    } else {
                        chrome.action.setIcon({ path: "img/icns/mono/black/disallow/64.png" });
                    }
                }
            });
        }
    }
}

chrome.contextMenus.create({
    id: "openInFreeTube",
    title: "Open in FreeTube",
    contexts: ["link"],
    targetUrlPatterns: [
        "*://www.youtube.com/*",
        "*://youtube.com/*",
        "*://youtu.be/*"
    ]
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openInFreeTube" && info.linkUrl) {
        let newUrl = "freetube://" + info.linkUrl;
        chrome.tabs.update({ url: newUrl });
        console.log(newUrl);
    }
});

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "introduction.html" });
    }
});