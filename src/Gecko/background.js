chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    detectYT(changeInfo);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        detectYT(tab);
    });
});

function detectYT(changeInfo) {
    openedUrl = changeInfo.url;
    if (openedUrl) {
        if (openedUrl.startsWith("https://www.youtube.com/watch?v=")) {
            chrome.action.setIcon({ path: "img/icns/normal/64.png" });
        } else {
            chrome.action.setIcon({ path: "img/icns/grey/64.png" });
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