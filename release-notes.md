# 1.11.0 (25121)

## Release Notes

- Added an unsigned build for Chromium-based browsers that can be loaded via Developer Mode.
- Introduced auto-redirect support so YouTube URLs open in FreeTube without manual interaction.
- Clarified Firefox manual and developer-mode installation steps in the README.
- Automated the release workflow to bundle both signed Firefox XPIs and unsigned Chromium ZIPs.

> [!WARNING]
> For Firefox, the `-unsigned.xpi` artifact will most likely not install. Use the signed version (`-signed.xpi`) or download from [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/redirecttube/). For Chromium-based browsers, download the `-chromium-unsigned.zip` and load it unpacked in Developer Mode.