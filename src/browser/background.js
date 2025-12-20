const extensionApi = typeof chrome !== "undefined" ? chrome : browser;

let lastUrlAllowed = false;
let isDarkThemePreferred = false;
let currentMenuLang = null;

extensionApi.tabs.onUpdated.addListener((_tabId, changeInfo) => {
    if (changeInfo.url) {
        handleUrlChange(changeInfo.url);
    }
    createContextMenu();
    updateContentScriptSettings();
});

extensionApi.tabs.onActivated.addListener((activeInfo) => {
    extensionApi.tabs.get(activeInfo.tabId, (tab) => {
        if (tab && tab.url) {
            handleUrlChange(tab.url);
        }
        createContextMenu();
        updateContentScriptSettings();
    });
});

extensionApi.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        extensionApi.tabs.create({ url: "introduction.html" });
        extensionApi.storage.local.set({
            extensionIcon: "color",
            autoRedirectLinks: "autoRedirectLinksNo",
        });
    }
    detectYTInThisTab();
    createContextMenu();
    updateContentScriptSettings();
});

extensionApi.runtime.onStartup.addListener(() => {
    detectYTInThisTab();
    createContextMenu();
    updateContentScriptSettings();
});

extensionApi.runtime.onMessage.addListener((request, sender) => {
    if (request.message === "detectYT") {
        detectYTInThisTab();
        updateContentScriptSettings();
    }

    if (request.message === "autoRedirectLink" && sender.tab && request.url) {
        if (!request.url.startsWith("freetube://")) {
            const newUrl = "freetube://" + request.url;
            extensionApi.tabs.update(sender.tab.id, { url: newUrl });
        }
    }

    if (request.message === "redirecttubeTheme") {
        isDarkThemePreferred = Boolean(request.isDark);
        updateActionIcon();
    }
});

function detectYTInThisTab() {
    extensionApi.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs.length) {
            return;
        }
        const tab = tabs[0];
        if (tab.url) {
            handleUrlChange(tab.url);
        }
    });
}

function handleUrlChange(url) {
    if (!url) {
        return;
    }
    lastUrlAllowed = isYoutubeUrl(url);
    updateActionIcon();
}

function isYoutubeUrl(url) {
    return (
        url.startsWith("https://www.youtube.com/watch?v=") ||
        url.startsWith("https://www.youtube.com/playlist?list=") ||
        url.startsWith("https://www.youtube.com/@") ||
        url.startsWith("https://www.youtube.com/channel/")
    );
}

function updateActionIcon() {
    extensionApi.storage.local.get("extensionIcon", (result) => {
        const preference = (result && result.extensionIcon) || "color";
        const path = getIconPath(
            preference,
            lastUrlAllowed,
            isDarkThemePreferred
        );
        extensionApi.action.setIcon({ path });
    });
}

function getIconPath(preference, isAllowed, isDarkMode) {
    if (preference === "mono") {
        if (isDarkMode) {
            return isAllowed
                ? "img/icns/mono/white/allow/64.png"
                : "img/icns/mono/white/disallow/64.png";
        }
        return isAllowed
            ? "img/icns/mono/black/allow/64.png"
            : "img/icns/mono/black/disallow/64.png";
    }
    return isAllowed
        ? "img/icns/color/allow/64.png"
        : "img/icns/color/disallow/64.png";
}

function updateContentScriptSettings() {
    extensionApi.storage.local.get(
        ["lang", "iframeButton", "autoRedirectLinks"],
        (result) => {
            const selectedLang = result.lang || "en";
            const iframeButtonSetting =
                result.iframeButton || "iframeButtonYes";
            const autoRedirectSetting =
                result.autoRedirectLinks || "autoRedirectLinksNo";
            fetch(`i18n/locales/${selectedLang}.json`)
                .then((response) => response.json())
                .then((data) => {
                    const buttonName = data.ui.iframeButton.redirect;
                    extensionApi.tabs.query(
                        { active: true, currentWindow: true },
                        (tabs) => {
                            if (!tabs || !tabs.length) {
                                return;
                            }
                            extensionApi.tabs.sendMessage(
                                tabs[0].id,
                                {
                                    redirecttubeButtonName: buttonName,
                                    redirecttubeIframeButton:
                                        iframeButtonSetting,
                                    redirecttubeAutoRedirect:
                                        autoRedirectSetting,
                                },
                                () => extensionApi.runtime.lastError
                            );
                        }
                    );
                })
                .catch(() => {});
        }
    );
}

extensionApi.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openInFreeTube" && info.linkUrl) {
        const newUrl = "freetube://" + info.linkUrl;
        if (typeof info.tabId === "number") {
            extensionApi.tabs.update(info.tabId, { url: newUrl });
        } else {
            extensionApi.tabs.update({ url: newUrl });
        }
    }
});

function createContextMenu() {
    extensionApi.storage.local.get("lang", (result) => {
        const lang = result && result.lang ? result.lang : "en";
        if (lang === currentMenuLang) {
            return;
        }
        currentMenuLang = lang;
        extensionApi.contextMenus.removeAll(() => {
            fetch(`i18n/locales/${lang}.json`)
                .then((response) => response.json())
                .then((data) => {
                    extensionApi.contextMenus.create({
                        id: "openInFreeTube",
                        title: data.ui.contextMenu.redirect,
                        contexts: ["link"],
                        targetUrlPatterns: [
                            "*://www.youtube.com/*",
                            "*://youtube.com/*",
                            "*://youtu.be/*",
                        ],
                    });
                })
                .catch(() => {});
        });
    });
}
