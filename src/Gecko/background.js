chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    detectYT(changeInfo);
    createContextMenu();
    updateContentScriptSettings();
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        detectYT(tab);
        createContextMenu();
        updateContentScriptSettings();
    });
});

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        detectYTInThisTab();
        createContextMenu();
        updateContentScriptSettings();
    });

browser.runtime.onInstalled.addListener(() => {
    detectYTInThisTab();
    createContextMenu();
    updateContentScriptSettings();
});

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.message === "detectYT") {
        detectYTInThisTab();
        updateContentScriptSettings();
    }

    if (request.message === "autoRedirectLink" && sender.tab && request.url) {
        if (!request.url.startsWith("freetube://")) {
            const newUrl = "freetube://" + request.url;
            chrome.tabs.update(sender.tab.id, { url: newUrl });
        }
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
        if (
            openedUrl.startsWith("https://www.youtube.com/watch?v=") ||
            openedUrl.startsWith("https://www.youtube.com/playlist?list=") ||
            openedUrl.startsWith("https://www.youtube.com/@") ||
            openedUrl.startsWith("https://www.youtube.com/channel/")
        ) {
            browser.storage.local.get("extensionIcon").then(function (result) {
                if (result.extensionIcon === "color") {
                    chrome.action.setIcon({
                        path: "img/icns/color/allow/64.png",
                    });
                }
                if (result.extensionIcon === "mono") {
                    if (
                        window.matchMedia &&
                        window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                    ) {
                        chrome.action.setIcon({
                            path: "img/icns/mono/white/allow/64.png",
                        });
                    } else {
                        chrome.action.setIcon({
                            path: "img/icns/mono/black/allow/64.png",
                        });
                    }
                }
            });
        } else {
            browser.storage.local.get("extensionIcon").then(function (result) {
                if (result.extensionIcon === "color") {
                    chrome.action.setIcon({
                        path: "img/icns/color/disallow/64.png",
                    });
                }
                if (result.extensionIcon === "mono") {
                    if (
                        window.matchMedia &&
                        window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                    ) {
                        chrome.action.setIcon({
                            path: "img/icns/mono/white/disallow/64.png",
                        });
                    } else {
                        chrome.action.setIcon({
                            path: "img/icns/mono/black/disallow/64.png",
                        });
                    }
                }
            });
        }
    }
}

function updateContentScriptSettings() {
    chrome.storage.local.get(
        ["lang", "iframeButton", "autoRedirectLinks"],
        function (result) {
            const selectedLang = result.lang || "en";
            const iframeButtonSetting =
                result.iframeButton || "iframeButtonYes";
            const autoRedirectSetting =
                result.autoRedirectLinks || "autoRedirectLinksNo";
            fetch(`i18n/locales/${selectedLang}.json`)
                .then((response) => response.json())
                .then((data) => {
                    const buttonName = data.ui.iframeButton.redirect;
                    browser.tabs.query(
                        { active: true, currentWindow: true },
                        (tabs) => {
                            if (!tabs || !tabs.length) {
                                return;
                            }
                            chrome.tabs.sendMessage(
                                tabs[0].id,
                                {
                                    redirecttubeButtonName: buttonName,
                                    redirecttubeIframeButton:
                                        iframeButtonSetting,
                                    redirecttubeAutoRedirect:
                                        autoRedirectSetting,
                                },
                                () => chrome.runtime.lastError
                            );
                        }
                    );
                })
                .catch(() => {});
        }
    );
}

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openInFreeTube" && info.linkUrl) {
        let newUrl = "freetube://" + info.linkUrl;
        chrome.tabs.update({ url: newUrl });
    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "introduction.html" });
        browser.storage.local.set({
            extensionIcon: "color",
            autoRedirectLinks: "autoRedirectLinksNo",
        });
    }
});

function createContextMenu() {
    chrome.storage.local.get("lang", function (result) {
        lang = result.lang;
        fetch(`i18n/locales/${lang}.json`)
            .then((response) => response.json())
            .then((data) => {
                menuTitleRedirect = data.ui.contextMenu.redirect;
                chrome.contextMenus.create({
                    id: "openInFreeTube",
                    title: menuTitleRedirect,
                    contexts: ["link"],
                    targetUrlPatterns: [
                        "*://www.youtube.com/*",
                        "*://youtube.com/*",
                        "*://youtu.be/*",
                    ],
                });
            });
    });
}
