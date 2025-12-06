let redirecttubeAutoRedirect = "autoRedirectLinksNo";
let isTopLevelDocument = false;

try {
    isTopLevelDocument = window.top === window;
} catch (error) {
    isTopLevelDocument = true;
}

if (isTopLevelDocument) {
    document.addEventListener("click", handleDocumentClick, true);
}

function addDivIframe(iframe, buttonName) {
    if (!iframe || iframe.dataset.buttonAdded === "true") return;
    iframe.dataset.buttonAdded = "true";

    const rect = iframe.getBoundingClientRect();
    const ftLogo = `<svg viewBox=\"0 0 1086 188\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><rect id=\"Artboard1\" x=\"0\" y=\"0\" width=\"1085.25\" height=\"187.5\" style=\"fill:none;\"/><clipPath id=\"_clip1\"><rect x=\"0\" y=\"0\" width=\"1085.25\" height=\"187.5\"/></clipPath><g clip-path=\"url(#_clip1)\"><path d=\"M36.77,0c7.031,0 12.73,5.699 12.73,12.73l0,174.77c0,0 -17.475,0 -17.475,0c-17.568,0 -32.025,-14.457 -32.025,-32.025c-0,-0 0,-0 0,-0.001l0,-142.744c0,-7.031 5.699,-12.73 12.73,-12.73l24.04,0Zm97.749,91.673c1.641,0.813 2.684,2.494 2.684,4.327c0,1.833 -1.043,3.514 -2.684,4.328l-69.549,34.469c-0.69,0.341 -1.45,0.519 -2.22,0.519c-2.742,0 -4.999,-2.256 -5,-4.999l0,-68.634c0.001,-2.743 2.258,-4.999 5,-4.999c0.77,-0 1.53,0.178 2.22,0.519l69.549,34.469Zm52.981,-91.672l0,15.163c0,18.837 -15.5,34.337 -34.337,34.337l-82.809,0c-6.961,0 -12.604,-5.643 -12.604,-12.604l0,-24.292c0,-6.961 5.643,-12.604 12.604,-12.604l117.146,0Z\" style=\"fill:#fff;\"/><path d=\"M219.327,175.449c-4.036,-0 -7.272,-1.253 -9.707,-3.757c-2.435,-2.505 -3.653,-5.776 -3.653,-9.81l0,-122.103c0,-4.036 1.148,-7.166 3.446,-9.392c2.296,-2.228 5.46,-3.341 9.496,-3.341l73.262,0c8.488,0 12.731,3.618 12.731,10.855c-0,7.096 -4.243,10.644 -12.731,10.644l-59.696,0l0,40.075l55.521,-0c8.488,-0 12.733,3.617 12.733,10.852c-0,7.098 -4.245,10.646 -12.733,10.646l-55.521,0l0,51.764c0,4.034 -1.182,7.305 -3.547,9.81c-2.366,2.504 -5.567,3.757 -9.601,3.757Zm146.481,-105.405c3.274,-0.279 5.855,0.485 7.743,2.295c1.891,1.81 2.834,4.522 2.834,8.139c-0,3.757 -0.819,6.541 -2.455,8.351c-1.638,1.807 -4.595,2.99 -8.877,3.548l-5.665,0.625c-7.429,0.836 -12.874,3.62 -16.337,8.35c-3.463,4.731 -5.195,10.644 -5.195,17.742l0,43.831c0,4.034 -1.132,7.131 -3.399,9.287c-2.265,2.159 -5.099,3.237 -8.499,3.237c-3.4,-0 -6.201,-1.078 -8.402,-3.237c-2.205,-2.156 -3.307,-5.253 -3.307,-9.287l0,-80.776c0,-3.896 1.102,-6.887 3.307,-8.975c2.201,-2.087 4.941,-3.13 8.215,-3.13c3.273,-0 5.917,1.008 7.932,3.025c2.015,2.019 3.021,4.905 3.021,8.662l-0,8.35c2.391,-6.122 5.95,-10.855 10.67,-14.194c4.631,-3.306 10.093,-5.258 15.77,-5.634l2.644,-0.209Zm111.116,76.183c2.474,-0 4.474,0.904 6.002,2.714c1.527,1.807 2.292,4.242 2.292,7.305c-0,4.314 -2.692,7.932 -8.076,10.852c-4.949,2.644 -10.55,4.768 -16.808,6.367c-6.257,1.6 -12.222,2.4 -17.898,2.4c-17.171,-0 -30.777,-4.731 -40.817,-14.192c-10.041,-9.463 -15.061,-22.403 -15.061,-38.822c-0,-10.437 2.182,-19.691 6.549,-27.761c4.365,-8.071 10.513,-14.333 18.443,-18.785c7.93,-4.454 16.916,-6.679 26.957,-6.679c9.605,-0 17.972,2.019 25.101,6.052c7.131,4.036 12.66,9.742 16.589,17.117c3.93,7.374 5.894,16.071 5.894,26.09c0,5.983 -2.764,8.975 -8.294,8.975l-64.391,0c0.873,9.601 3.711,16.662 8.513,21.185c4.801,4.522 11.785,6.782 20.955,6.782c4.656,0 8.766,-0.555 12.331,-1.668c3.566,-1.113 7.604,-2.644 12.114,-4.593c4.367,-2.226 7.566,-3.339 9.605,-3.339Zm-37.762,-58.235c-7.422,0 -13.351,2.228 -17.789,6.68c-4.439,4.454 -7.094,10.853 -7.967,19.203l49.331,0c-0.292,-8.487 -2.474,-14.923 -6.549,-19.307c-4.075,-4.382 -9.751,-6.576 -17.026,-6.576Zm156.152,58.235c2.474,-0 4.476,0.904 6.002,2.714c1.529,1.807 2.292,4.242 2.292,7.305c-0,4.314 -2.692,7.932 -8.076,10.852c-4.946,2.644 -10.55,4.768 -16.808,6.367c-6.255,1.6 -12.222,2.4 -17.898,2.4c-17.169,-0 -30.775,-4.731 -40.817,-14.192c-10.041,-9.463 -15.061,-22.403 -15.061,-38.822c-0,-10.437 2.184,-19.691 6.549,-27.761c4.365,-8.071 10.513,-14.333 18.443,-18.785c7.932,-4.454 16.916,-6.679 26.959,-6.679c9.603,-0 17.97,2.019 25.101,6.052c7.131,4.036 12.658,9.742 16.587,17.117c3.93,7.374 5.894,16.071 5.894,26.09c0,5.983 -2.764,8.975 -8.294,8.975l-64.391,0c0.873,9.601 3.711,16.662 8.513,21.185c4.803,4.522 11.788,6.782 20.955,6.782c4.656,0 8.766,-0.555 12.331,-1.668c3.566,-1.113 7.604,-2.644 12.114,-4.593c4.367,-2.226 7.569,-3.339 9.605,-3.339Zm-37.762,-58.235c-7.42,0 -13.351,2.228 -17.789,6.68c-4.437,4.454 -7.094,10.853 -7.967,19.203l49.331,0c-0.292,-8.487 -2.474,-14.923 -6.549,-19.307c-4.073,-4.382 -9.749,-6.576 -17.026,-6.576Zm119.673,87.457c-4.654,-0 -10.587,-1.464 -13.444,-4.391c-2.86,-2.925 -4.289,-6.828 -4.289,-11.704l0,-105.763l-30.128,0c-9.838,0 -14.755,-4.458 -14.755,-13.377c-0,-8.777 4.917,-13.168 14.755,-13.168l95.72,0c9.838,0 14.758,4.391 14.758,13.168c-0,8.919 -4.92,13.377 -14.758,13.377l-30.128,0l-0,105.763c-0,4.876 -1.394,8.779 -4.186,11.704c-2.792,2.927 -8.76,4.391 -13.545,4.391Zm137.393,-104.734c4.87,-0 8.731,1.322 11.585,3.966c2.853,2.644 4.277,6.261 4.277,10.852l0,76.602c0,4.314 -1.494,7.793 -4.487,10.437c-2.992,2.644 -6.854,3.966 -11.584,3.966c-4.452,-0 -8,-1.253 -10.644,-3.757c-2.644,-2.505 -3.966,-5.846 -3.966,-10.019l0,-2.089c-3.202,5.288 -7.409,9.324 -12.628,12.108c-5.218,2.781 -11.097,4.173 -17.637,4.173c-12.942,-0 -22.577,-3.583 -28.908,-10.749c-6.332,-7.165 -9.496,-17.985 -9.496,-32.456l-0,-48.216c-0,-4.591 1.426,-8.208 4.277,-10.852c2.854,-2.644 6.715,-3.966 11.585,-3.966c4.87,-0 8.697,1.322 11.48,3.966c2.784,2.644 4.175,6.261 4.175,10.852l0,48.841c0,6.123 1.287,10.646 3.86,13.569c2.574,2.921 6.505,4.382 11.793,4.382c6.123,0 11.097,-2.086 14.924,-6.261c3.826,-4.176 5.741,-9.671 5.741,-16.49l-0,-44.041c-0,-4.591 1.389,-8.208 4.173,-10.852c2.783,-2.644 6.61,-3.966 11.48,-3.966Zm104.797,-0.416c9.084,-0.003 17.104,2.156 24.058,6.468c6.954,4.315 12.384,10.472 16.287,18.474c3.903,7.999 5.854,17.288 5.854,27.862c0,10.577 -1.951,19.933 -5.854,28.074c-3.903,8.139 -9.368,14.471 -16.394,18.994c-7.026,4.522 -15.008,6.783 -23.951,6.783c-7.239,-0 -13.767,-1.494 -19.586,-4.487c-5.82,-2.992 -10.291,-7.131 -13.414,-12.419l-0,1.669c-0,4.454 -1.418,8.036 -4.258,10.75c-2.838,2.714 -6.671,4.071 -11.496,4.071c-4.826,-0 -8.694,-1.357 -11.604,-4.071c-2.91,-2.714 -4.364,-6.296 -4.364,-10.75l-0,-120.224c-0,-4.313 1.526,-7.791 4.578,-10.435c3.051,-2.644 7.061,-3.966 12.029,-3.966c4.682,0 8.443,1.252 11.284,3.757c2.837,2.505 4.257,5.844 4.257,10.019l0,45.709c3.122,-5.147 7.558,-9.148 13.306,-12.001c5.75,-2.853 12.17,-4.28 19.268,-4.28l0,0.003Zm-9.367,82.653c7.522,0 13.342,-2.607 17.458,-7.825c4.115,-5.218 6.173,-12.558 6.173,-22.021c-0,-9.322 -2.058,-16.455 -6.173,-21.395c-4.116,-4.939 -9.936,-7.409 -17.458,-7.409c-7.523,-0 -13.342,2.539 -17.459,7.619c-4.116,5.079 -6.174,12.279 -6.174,21.603c-0,9.461 2.058,16.733 6.174,21.812c4.117,5.079 9.936,7.619 17.459,7.619l-0,-0.003Zm164.34,-8.141c3.017,0 5.469,1.113 7.355,3.339c1.884,2.228 2.827,5.079 2.827,8.557c0,2.368 -0.753,4.559 -2.262,6.576c-1.508,2.019 -3.62,3.722 -6.336,5.113c-5.127,2.505 -11.086,4.559 -17.875,6.158c-6.788,1.6 -13.048,2.4 -18.78,2.4c-12.068,-0 -22.59,-2.157 -31.566,-6.471c-8.975,-4.312 -15.875,-10.47 -20.703,-18.471c-4.827,-8 -7.24,-17.429 -7.24,-28.281c0,-10.437 2.337,-19.689 7.015,-27.761c4.676,-8.071 11.162,-14.368 19.458,-18.889c8.296,-4.522 17.725,-6.785 28.283,-6.785c10.108,0 18.97,2.054 26.589,6.16c7.616,4.103 13.538,9.949 17.761,17.532c4.223,7.584 6.336,16.453 6.336,26.611c0,3.062 -0.793,5.392 -2.376,6.993c-1.584,1.599 -3.809,2.4 -6.676,2.4l-63.355,0c1.057,8.209 3.771,14.159 8.146,17.847c4.376,3.687 10.635,5.529 18.781,5.529c4.375,0 8.296,-0.485 11.765,-1.461c3.47,-0.974 7.316,-2.296 11.541,-3.966c2.011,-0.798 4.049,-1.529 6.109,-2.191c1.96,-0.625 3.696,-0.939 5.203,-0.939Zm-38.918,-52.807c-6.486,0 -11.691,1.915 -15.611,5.741c-3.923,3.827 -6.262,9.357 -7.016,16.592l43.671,0c-0.453,-7.375 -2.452,-12.939 -5.996,-16.696c-3.546,-3.757 -8.562,-5.637 -15.048,-5.637Z\" style=\"fill:#fff;fill-rule:nonzero;\"/></g></svg>`;
    const div = document.createElement("div");

    div.innerHTML =
        "<a class='redirecttube-redirection-open-button' href='freetube://" +
        iframe.src +
        "'>" +
        buttonName +
        " " +
        ftLogo +
        "</a><a class='redirecttube-redirection-hide-button' onclick='this.parentElement.remove()'><svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#FFFFFF'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg></a>";
    div.classList.add("redirecttube-redirection-div");
    div.style.top = `${window.scrollY + rect.bottom - 110}px`;
    div.style.left = `${window.scrollX + rect.left}px`;

    document.body.appendChild(div);
}

window.addEventListener("resize", updateButtons);

window.addEventListener("scroll", updateButtons);

function updateButtons() {
    const buttons = document.querySelectorAll(".redirecttube-redirection-div");
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
        if (iframe.dataset.buttonAdded === "true") {
            iframe.dataset.buttonAdded = "false";
        }
    });
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
            addDivIframe(iframe, buttonName);
        }
    });
}

chrome.runtime.onMessage.addListener((request) => {
    const iframePreference =
        request.redirecttubeIframeButton || "iframeButtonYes";
    const buttonName =
        request.redirecttubeButtonName ||
        localStorage.getItem("redirecttubeButtonName");

    if (iframePreference !== "iframeButtonNo" && buttonName) {
        processIframes(buttonName);
    }

    if (request.redirecttubeButtonName) {
        localStorage.setItem(
            "redirecttubeButtonName",
            request.redirecttubeButtonName
        );
    }

    redirecttubeAutoRedirect =
        request.redirecttubeAutoRedirect || "autoRedirectLinksNo";
});

function handleDocumentClick(event) {
    if (redirecttubeAutoRedirect !== "autoRedirectLinksYes") {
        return;
    }
    if (event.defaultPrevented || event.button !== 0) {
        return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    const anchor = event.target.closest("a[href]");
    if (!anchor) {
        return;
    }

    if (anchor.hasAttribute("download")) {
        return;
    }

    const targetAttribute =
        (anchor.getAttribute("target") || "").toLowerCase();
    if (targetAttribute &&
        targetAttribute !== "_self" &&
        targetAttribute !== "_top" &&
        targetAttribute !== "_parent") {
        return;
    }

    const resolvedUrl = resolveAbsoluteUrl(anchor.getAttribute("href"));
    if (!resolvedUrl || !shouldRedirectUrl(resolvedUrl)) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    chrome.runtime.sendMessage({
        message: "autoRedirectLink",
        url: resolvedUrl,
    });
}

function resolveAbsoluteUrl(href) {
    if (!href) {
        return null;
    }
    try {
        return new URL(href, window.location.href).toString();
    } catch (error) {
        return null;
    }
}

function shouldRedirectUrl(url) {
    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname.toLowerCase();

        if (host === "youtu.be") {
            return parsedUrl.pathname.length > 1;
        }

        if (host.endsWith("youtube.com")) {
            if (parsedUrl.pathname.startsWith("/watch") && parsedUrl.searchParams.has("v")) {
                return true;
            }
            if (parsedUrl.pathname.startsWith("/playlist") && parsedUrl.searchParams.has("list")) {
                return true;
            }
            if (parsedUrl.pathname.startsWith("/@")) {
                return true;
            }
            if (parsedUrl.pathname.startsWith("/channel/")) {
                return true;
            }
        }
    } catch (error) {
        return false;
    }

    return false;
}

function redirecttubeOpenInFreeTube(src) {
    let newUrl = "freetube://" + src;
    window.open(newUrl, "_blank");
}
