var popupBehavior = "showPopup";

function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        popupBehavior: document.getElementById("popupBehavior").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.getElementById("popupBehavior").value = result.popupBehavior || popupBehavior;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("popupBehavior");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);

document.querySelector("#popupBehavior").addEventListener("change", saveOptions);