<p align="center">
   <img src="/assets/banner.png" title="RedirectTube">
   <a href="https://addons.mozilla.org/pl/firefox/addon/redirecttube/"><img src="https://img.shields.io/amo/rating/redirecttube%40stankiewiczm.eu?style=for-the-badge&logo=firefox&logoColor=white&label=Mozilla%20Add-ons%20Rating"></a>
   <br>
   <img src="https://app.codacy.com/project/badge/Grade/f89d4aaf14da4e7e9d1b2f123925586b"/>
</p>

## Open YouTube links in FreeTube

RedirectTube is a browser extension that redirects YouTube links to FreeTube. It is available for Firefox.

## Installation

### Method 1: Firefox Add-ons (recommended)

You can install RedirectTube from the Firefox Add-ons.

[![Download](https://img.shields.io/badge/Download-%23000000.svg?style=for-the-badge&logo=firefox&logoColor=#FF7139)](https://addons.mozilla.org/pl/firefox/addon/redirecttube/)

### Method 2: Manual installation

This method works only for Firefox ESR and Firefox Developer Edition.

> [!CAUTION]
> This method disables signature verification for add-ons. This can make your browser less secure. Use this method at your own risk.

1. Go to `about:config` in your browser.
2. Set `xpinstall.signatures.required` to `false`.
3. Download the latest release of RedirectTube from the [releases page](https://github.com/MStankiewiczOfficial/RedirectTube/releases/). If you see an alert about installing add-ons from untrusted sources, click "Continue installation" and don't do next steps.
4. Open the downloaded file in Firefox.
5. Click "Add" to install the extension.
   And that's it! RedirectTube is now installed in your browser.

### Method 3: Developer mode

This method is for developers and advanced users.

> [!IMPORTANT]
> If you restart your browser, the extension will be disabled.

1. Clone the repository.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click "Load Temporary Add-on".
4. Select the `manifest.json` file from the cloned repository (it's in the `src` directory).
   The extension is now installed in your browser.

## Usage

> [!WARNING]
> FreeTube on macOS is currently experiencing a problem that manifests itself as an error when opening links when there is no FreeTube window open. This problem has been reported to the FreeTube developers and we are waiting for a solution.

### Via button

Click the RedirectTube button in the toolbar to open the current YouTube video in FreeTube.
![](/assets/toolbar.png)

### Via context menu

Right-click a YouTube link and select "Open in FreeTube" to open the video in FreeTube.
![](/assets/context-menu.png)

## Issues

If you encounter any issues, please report them on the [issues page](https://github.com/MStankiewiczOfficial/RedirectTube/issues/).

## License

RedirectTube is licensed under CC BY-NC-SA 4.0. For details, please refer to the [LICENSE](LICENSE.md).

> [!NOTE]
> **RedirectTube** is not affiliated with FreeTube or its creators. FreeTube is licensed under the [AGPL-3.0 license](https://github.com/FreeTubeApp/FreeTube/blob/master/LICENSE). The name *FreeTube* and FreeTube logo are the property of the [creators of FreeTube](https://docs.freetubeapp.io/credits/). Neither I nor the extension are associated with them.
