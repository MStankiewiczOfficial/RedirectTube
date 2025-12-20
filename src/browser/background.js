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
            iframeBehavior: "iframeBehaviorReplace",
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
        ["iframeBehavior", "iframeButton", "autoRedirectLinks"],
        (result = {}) => {
            const iframeBehaviorSetting =
                normalizeIframeBehavior(result.iframeBehavior) ||
                normalizeIframeBehavior(result.iframeButton) ||
                "iframeBehaviorReplace";
            const autoRedirectSetting =
                result.autoRedirectLinks || "autoRedirectLinksNo";

            const buttonName =
                getMessageByKey("ui.iframeButton.redirect") || "Watch on";

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
                            redirecttubeIframeBehavior: iframeBehaviorSetting,
                            redirecttubeAutoRedirect: autoRedirectSetting,
                        },
                        () => extensionApi.runtime.lastError
                    );
                }
            );
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
    const lang = getBrowserLocale();
    if (lang === currentMenuLang) {
        return;
    }
    currentMenuLang = lang;
    const title =
        getMessageByKey("ui.contextMenu.redirect") || "Open in FreeTube";

    extensionApi.contextMenus.removeAll(() => {
        extensionApi.contextMenus.create({
            id: "openInFreeTube",
            title,
            contexts: ["link"],
            targetUrlPatterns: [
                "*://www.youtube.com/*",
                "*://youtube.com/*",
                "*://youtu.be/*",
            ],
        });
    });
}

function normalizeIframeBehavior(value) {
    if (!value) {
        return null;
    }
    if (value === "iframeBehaviorReplace" || value === "iframeBehaviorNone") {
        return value;
    }
    if (value === "iframeBehaviorButton" || value === "iframeButtonYes") {
        return "iframeBehaviorReplace";
    }
    if (value === "iframeButtonNo") {
        return "iframeBehaviorNone";
    }
    return null;
}

function getBrowserLocale() {
    const raw =
        (extensionApi.i18n &&
            typeof extensionApi.i18n.getUILanguage === "function"
            ? extensionApi.i18n.getUILanguage()
            : navigator.language || "en") || "en";
    return (raw.split("-")[0] || "en").toLowerCase();
}

function getMessageByKey(key) {
    if (
        !key ||
        !extensionApi.i18n ||
        typeof extensionApi.i18n.getMessage !== "function"
    ) {
        return "";
    }
    const messageName = toMessageName(key);
    if (!messageName) {
        return "";
    }
    return extensionApi.i18n.getMessage(messageName) || "";
}

function toMessageName(key) {
    return key
        .split(".")
        .map((segment) => segment.trim())
        .filter(Boolean)
        .join("_")
        .replace(/[^A-Za-z0-9_]/g, "_");
}
