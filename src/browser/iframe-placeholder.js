(function () {
    const extensionApi = typeof chrome !== "undefined" ? chrome : browser;
    const SUPPORTED_LANGS = ["en", "pl", "nl", "fi", "fr", "it", "lv"];

    const params = new URLSearchParams(window.location.search || "");
    const videoUrl = params.get("video") || "";
    const providedLabel = sanitizeLabel(params.get("label"));

    const buttons = document.querySelectorAll("[data-action]");
    const warning = document.getElementById("warning");
    const settingsLink = document.getElementById("settingsLink");

    init();

    function init() {
        const lang = resolveLanguage();
        document.documentElement.lang = lang;

        const defaultLabel =
            getMessageByKey("ui.iframeButton.redirect") || "Watch on";
        const resolvedLabel = providedLabel || defaultLabel;

        const translated = applyTranslations({ label: resolvedLabel });
        if (!translated) {
            applyLabelFallback(resolvedLabel);
        }

        setupSettingsLink();

        if (!videoUrl) {
            showWarning();
            return;
        }

        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                postAction(button.dataset.action);
            });
        });
    }

    function setupSettingsLink() {
        if (!settingsLink) {
            return;
        }

        const optionsUrl =
            extensionApi &&
            extensionApi.runtime &&
            typeof extensionApi.runtime.getURL === "function"
                ? extensionApi.runtime.getURL("options.html")
                : null;

        if (optionsUrl) {
            settingsLink.setAttribute("href", optionsUrl);
            settingsLink.setAttribute("target", "_blank");
            settingsLink.setAttribute("rel", "noreferrer noopener");
        }

        settingsLink.addEventListener("click", (event) => {
            event.preventDefault();
            openExtensionOptions();
        });
    }

    function openExtensionOptions() {
        if (!extensionApi || !extensionApi.runtime) {
            return;
        }

        if (typeof extensionApi.runtime.openOptionsPage === "function") {
            extensionApi.runtime.openOptionsPage();
            return;
        }

        if (typeof extensionApi.runtime.getURL === "function") {
            const url = extensionApi.runtime.getURL("options.html");
            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
        }
    }

    function showWarning() {
        if (warning) {
            warning.hidden = false;
        }
        buttons.forEach((button) => {
            button.disabled = true;
        });
    }

    function postAction(action) {
        if (!action) {
            return;
        }
        window.parent.postMessage(
            {
                type: "redirecttubeIframeAction",
                action,
                video: videoUrl,
            },
            "*"
        );
    }

    function resolveLanguage() {
        const fallback = detectNavigatorLanguage();
        const uiLanguage =
            (extensionApi.i18n &&
                typeof extensionApi.i18n.getUILanguage === "function"
                ? extensionApi.i18n.getUILanguage()
                : null) || fallback;
        const normalized = (uiLanguage.split("-")[0] || "en").toLowerCase();
        return SUPPORTED_LANGS.includes(normalized) ? normalized : fallback;
    }

    function detectNavigatorLanguage() {
        const browserLang = ((navigator.language || "en").split("-")[0] || "en").toLowerCase();
        return SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
    }

    function applyTranslations(replacements = {}) {
        let applied = false;
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            const template = getMessageByKey(key);
            if (typeof template === "string" && template.length) {
                element.innerHTML = interpolate(template, replacements);
                applied = true;
            }
        });
        return applied;
    }

    function applyLabelFallback(label) {
        const fallbackLabel = label || "Watch on";
        const headline = document.getElementById("headline");
        const message = document.getElementById("message");
        const freetubeLabel = document.getElementById("freetubeLabel");
        const youtubeLabel = document.getElementById("youtubeLabel");

        if (headline) {
            headline.textContent = `${fallbackLabel} FreeTube or YouTube`;
        }
        if (message) {
            message.textContent = "RedirectTube lets you decide how to open embedded videos.";
        }
        if (freetubeLabel) {
            freetubeLabel.textContent = `${fallbackLabel} FreeTube`;
        }
        if (youtubeLabel) {
            youtubeLabel.textContent = `${fallbackLabel} YouTube`;
        }
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

    function interpolate(template, replacements) {
        if (typeof template !== "string") {
            return template;
        }
        return template.replace(/{{\s*(\w+)\s*}}/g, (match, token) => {
            if (Object.prototype.hasOwnProperty.call(replacements, token)) {
                return replacements[token];
            }
            return match;
        });
    }

    function sanitizeLabel(raw) {
        if (!raw) {
            return "";
        }
        return raw.replace(/[<>]/g, "").trim();
    }
})();
