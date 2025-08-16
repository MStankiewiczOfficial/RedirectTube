let langList = ["en", "pl", "nl", "fi", "fr", "it", "lv"]

let lang = navigator.language.split("-")[0]
if (!langList.includes(lang)) {
    lang = "en"
}

chrome.storage.local.set({ lang: lang })

document.documentElement.lang = lang

let menuTitleRedirect = ""

fetch(`i18n/locales/${lang}.json`)
    .then(response => response.json())
    .then(data => {
        let elements = document.querySelectorAll("[data-i18n]")
        elements.forEach(element => {
            let key = element.getAttribute("data-i18n").split(".")
            let value = data
            key.forEach(k => {
                value = value[k]
            })
            element.innerHTML = value
        })
        menuTitleRedirect = data.ui.contextMenu.redirect
    });

