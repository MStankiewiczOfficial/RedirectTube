<p align="center">
   <img src="/assets/banner.png" title="RedirectTube">
   <a href="https://addons.mozilla.org/pl/firefox/addon/redirecttube/"><img src="https://img.shields.io/amo/rating/redirecttube%40stankiewiczm.eu?style=for-the-badge&logo=firefox&logoColor=white&label=Mozilla%20Add-ons%20Rating"></a>
   <br>
   <img src="https://app.codacy.com/project/badge/Grade/5fbd04d2b238474ca9c21fc62de6ecda"><a href="https://translate.codeberg.org/engage/redirecttube/"><img src="https://translate.codeberg.org/widget/redirecttube/ui/svg-badge.svg"></a>
</a>
</p>

## Open YouTube links in FreeTube

RedirectTube is a browser extension that redirects YouTube links to FreeTube. It is available for Firefox.

## Installation

### Method 1: Firefox Add-ons (recommended)

You can install RedirectTube from the Firefox Add-ons.

[![Get the Add-on](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)](https://addons.mozilla.org/pl/firefox/addon/redirecttube/)

### Method 2: Manual installation

1. Download the latest release of RedirectTube (file that ends with `-signed.xpi`) from the [releases page](https://github.com/MStankiewiczOfficial/RedirectTube/releases/). If you see an alert about installing add-ons from untrusted sources, click "Continue installation" and don’t proceed with the next steps.
2. Open the downloaded file in Firefox.
3. Click "Add" to install the extension.
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

### Via button

Click the RedirectTube button in the toolbar to open the current YouTube video in FreeTube.
![](/assets/toolbar.png)

### Via context menu

Right-click a YouTube link and select "Open in FreeTube" to open the video in FreeTube.
![](/assets/context-menu.png)

## Issues

If you encounter any issues, please report them on the [issues page](https://github.com/MStankiewiczOfficial/RedirectTube/issues/).

## Translation

If your language is not yet supported by RedirectTube, you can change that! Help develop the extension by translating it into your language.

[![](https://translate.codeberg.org/widget/redirecttube/ui/open-graph.png)](https://translate.codeberg.org/engage/redirecttube/)

## License

RedirectTube is licensed under CC BY-NC-SA 4.0. For details, please refer to the [LICENSE](LICENSE.md).

> [!NOTE]
> **RedirectTube** is not affiliated with FreeTube or its creators. FreeTube is licensed under the [AGPL-3.0 license](https://github.com/FreeTubeApp/FreeTube/blob/master/LICENSE). The name *FreeTube* and FreeTube logo are the property of the [creators of FreeTube](https://docs.freetubeapp.io/credits/). Neither I nor the extension are associated with them.
