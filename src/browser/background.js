const extensionApi = typeof chrome !== "undefined" ? chrome : browser;

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
            urlRulesConfig: getDefaultUrlRulesConfig(),
        });
    }
    loadUrlRulesConfig();
    detectYTInThisTab();
    createContextMenu();
    updateContentScriptSettings();
});

extensionApi.runtime.onStartup.addListener(() => {
    loadUrlRulesConfig();
    detectYTInThisTab();
    createContextMenu();
    updateContentScriptSettings();
});

extensionApi.runtime.onMessage.addListener((request, sender) => {
    if (request.message === "detectYT") {
        loadUrlRulesConfig();
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
    lastUrlAllowed = isRedirectableYoutubeUrl(url, urlRulesConfig);
    updateActionIcon();
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
        [
            "iframeBehavior",
            "iframeButton",
            "autoRedirectLinks",
            "urlRulesConfig",
        ],
        (result = {}) => {
            const iframeBehaviorSetting =
                normalizeIframeBehavior(result.iframeBehavior) ||
                normalizeIframeBehavior(result.iframeButton) ||
                "iframeBehaviorReplace";
            const autoRedirectSetting =
                result.autoRedirectLinks || "autoRedirectLinksNo";

            urlRulesConfig = normalizeUrlRulesConfig(
                result.urlRulesConfig
            );

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
                            redirecttubeUrlRulesConfig: urlRulesConfig,
                        },
                        () => extensionApi.runtime.lastError
                    );
                }
            );
        }
    );
}

const DEFAULT_ALLOW_PREFIXES = [
    "/watch",
    "/playlist",
    "/@",
    "/channel/",
    "/live/",
    "/shorts/",
    "/podcasts",
    "/gaming",
    "/feed/subscriptions",
    "/feed/library",
    "/feed/you",
    "/post/",
    "/hashtag/",
    "/results",
    "/",
];

const DEFAULT_DENY_PREFIXES = [
    "/signin",
    "/logout",
    "/login",
    "/oops",
    "/error",
    "/verify",
    "/consent",
    "/account",
    "/premium",
    "/paid_memberships",
    "/s/ads",
    "/pagead",
    "/embed/",
    "/iframe_api",
    "/api/",
    "/t/terms",
    "/about/",
    "/howyoutubeworks/",
];

function getDefaultUrlRulesConfig() {
    return {
        mode: "allowList",
        allow: [...DEFAULT_ALLOW_PREFIXES],
        deny: [...DEFAULT_DENY_PREFIXES],
    };
}

function normalizeUrlRulesConfig(rawConfig) {
    const base = getDefaultUrlRulesConfig();
    if (!rawConfig || typeof rawConfig !== "object") {
        return base;
    }
    const mode = rawConfig.mode === "allowAllExcept" ? "allowAllExcept" : "allowList";
    const allow = Array.isArray(rawConfig.allow)
        ? normalizePrefixList(rawConfig.allow)
        : base.allow;
    return {
        mode,
        allow,
        deny: base.deny,
    };
}

function normalizePrefixList(list) {
    return Array.from(
        new Set(
            list
                .map((item) => (typeof item === "string" ? item.trim() : ""))
                .filter((item) => item.startsWith("/"))
                .map((item) => item.toLowerCase())
                .filter(Boolean)
        )
    );
}

function loadUrlRulesConfig(callback) {
    extensionApi.storage.local.get("urlRulesConfig", (result = {}) => {
        urlRulesConfig = normalizeUrlRulesConfig(result.urlRulesConfig);
        if (typeof callback === "function") {
            callback(urlRulesConfig);
        }
    });
}

function pathMatchesPrefix(path, prefixes) {
    return prefixes.some((prefix) => path.startsWith(prefix));
}

function isRedirectableYoutubeUrl(url, config = urlRulesConfig) {
    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname.toLowerCase();

        if (host === "youtu.be") {
            return parsedUrl.pathname.length > 1;
        }

        if (!host.endsWith("youtube.com")) {
            return false;
        }

        const path = (parsedUrl.pathname || "/").toLowerCase();
        const normalizedConfig = normalizeUrlRulesConfig(config);

        if (pathMatchesPrefix(path, normalizedConfig.deny)) {
            return false;
        }

        if (normalizedConfig.mode === "allowAllExcept") {
            return true;
        }

        return pathMatchesPrefix(path, normalizedConfig.allow);
    } catch (error) {
        return false;
    }
}

let lastUrlAllowed = false;
let isDarkThemePreferred = false;
let currentMenuLang = null;
let urlRulesConfig = getDefaultUrlRulesConfig();

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
