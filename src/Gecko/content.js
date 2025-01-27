function addButtonIframe(iframe, buttonName) {
    if (!iframe || iframe.dataset.buttonAdded === "true") return;

    const rect = iframe.getBoundingClientRect();
    const button = document.createElement("button");

    button.textContent = buttonName;
    button.classList.add("redirecttube-redirection-button");
    button.style.top = `${window.scrollY + rect.bottom - 110}px`;
    button.style.left = `${window.scrollX + rect.left}px`;

    button.addEventListener("click", () => {
        redirecttubeOpenInFreeTube(iframe.src);
    });

    document.body.appendChild(button);
}

window.addEventListener("resize", updateButtons);

window.addEventListener("scroll", updateButtons);

function updateButtons() {
    const buttons = document.querySelectorAll(".redirecttube-redirection-button");
    buttons.forEach((button) => button.remove());
    processIframes(localStorage.getItem("redirecttubeButtonName"));
}

function processIframes(buttonName) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
        if (
            iframe.src.includes("youtube.com/embed") ||
            iframe.src.includes("youtube-nocookie.com/embed")
        ) {
            addButtonIframe(iframe, buttonName);
        }
    });
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.redirecttubeIframeButton === "iframeButtonYes") {
        processIframes(request.redirecttubeButtonName);
    }
    localStorage.setItem("redirecttubeButtonName", request.redirecttubeButtonName);
});

function redirecttubeOpenInFreeTube(src) {
    let newUrl = "freetube://" + src;
    window.open(newUrl, "_blank");
}