(() => {
    const extensionApi = typeof chrome !== "undefined" ? chrome : browser;
    const SUPPORTED_LANGS = ["en", "pl", "nl", "fi", "fr", "it", "lv"];

    const lang = resolveLanguage();
    document.documentElement.lang = lang;
    persistLanguage(lang);

    function translateDocument() {
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach((element) => {
            const key = element.getAttribute("data-i18n");
            const translation = getMessageByKey(key);
            if (translation) {
                element.innerHTML = translation;
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", translateDocument, {
            once: true,
        });
    } else {
        translateDocument();
    }

    function resolveLanguage() {
        const rawLang =
            (extensionApi.i18n &&
                typeof extensionApi.i18n.getUILanguage === "function"
                ? extensionApi.i18n.getUILanguage()
                : navigator.language || "en") || "en";
        const normalized = (rawLang.split("-")[0] || "en").toLowerCase();
        return SUPPORTED_LANGS.includes(normalized) ? normalized : "en";
    }

    function persistLanguage(value) {
        if (
            extensionApi.storage &&
            extensionApi.storage.local &&
            typeof extensionApi.storage.local.set === "function"
        ) {
            extensionApi.storage.local.set({ lang: value });
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
})();

