# 1.12.0 (25123)

## Release Notes

- Added support for localization with `default_locale` set to `en`.
- Introduced new `iframeBehavior` option for managing iframe behavior.
- Added iframe placeholder.
- Updated manifests to include new resources and support localization.
- Refactored `translate.js` for improved language handling.
- Enhanced error handling and translation in `popup.js`.
- Removed the deprecated iframe button functionality.

> [!WARNING]
> For Firefox, the `-unsigned.xpi` artifact will most likely not install. Use the signed version (`-signed.xpi`) or download from the [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/redirecttube/). For Chromium-based browsers, download the `-chromium-unsigned.crx`, unzip it and load it unpacked in Developer Mode or download from the [Chrome Web Store](https://chromewebstore.google.com/detail/jpbaggklodpddjcadlebabhiopjkjfjh/).