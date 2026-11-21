# Installation

Use a development Joomla site for this beta. Joomla 5.4 and 6.x are the
development targets, with PHP 8.3 or later as this project's baseline. Joomla's
own database and server requirements also apply.

## Recommended prerequisite: RA Dark Theme

For Ramblers websites using Gantry 5 Hydrogen, install and configure
[RA Dark Theme](https://github.com/buckwem/ra-dark-theme/releases/tag/v0.1.0-beta1)
before Festive Overlay. Dark backgrounds make snow, fireworks and drone displays
easier to see, while the theme switch lets visitors choose their preferred appearance.

RA Dark Theme is recommended, not a required dependency. Festive Overlay also
works on light pages and adapts its controls to the page background. Each plugin
has its own settings and installer; neither bundles the other.

On a staging site, install RA Dark Theme's plugin ZIP, enable **System - RA Dark
Theme**, select the default theme and check its template setting (`g5_hydrogen`
by default). Remove the earlier standalone dark-mode prototype assets first.
Then install Festive Overlay and check the effects in both themes. Both extensions
are betas awaiting real Joomla installation, update and removal testing.

## Download the beta

Download `plg_system_festiveoverlay-0.1.0-beta1.zip` from the
[GitHub beta release](https://github.com/buckwem/festive-extension/releases/tag/v0.1.0-beta1).
Use this plugin ZIP for Joomla installation. The automatic source archives are
for development. Alternatively, build the installer using the following commands.

## Build the extension

From the repository root, run:

```sh
make check
make lint-php
make package
```

Packaging uses Python's standard library and doesn't require the documentation
dependencies. It creates `dist/plg_system_festiveoverlay-0.1.0-beta1.zip` from the
files declared in `extension/festiveoverlay.xml`.

## Install in Joomla

1. Sign in to the Joomla administrator area.
2. Open **System → Install → Extensions**.
3. Upload the downloaded or locally built plugin ZIP using **Upload Package File**.
4. Open **System → Manage → Plugins** and find **System - Festive Overlay**.
5. Enable the plugin. Its separate **Enable festive effects** setting starts at **No**.

Set **Enable festive effects** to **Yes** and choose the effect and control
position. The default puts the icons above **Our Next Walks**. Effects follow
their seasonal dates; use the [local preview](configuration.md#local-previews)
to test outside those dates. No live website changes are made by building the ZIP.

## Update or uninstall

Build and upload a new ZIP to update the plugin. The manifest uses Joomla's
upgrade installation method. Check that your saved settings survive an update.

To remove it, open **System → Manage → Extensions**, select **System - Festive
Overlay**, then uninstall it. No database tables are created by this beta.

## Troubleshooting

If the plugin isn't listed, confirm that the ZIP contains `festiveoverlay.xml`
at its root, rather than an enclosing project directory.

If assets don't load, check both the plugin's status and its effects setting.
Confirm that you're viewing a public HTML page, then clear Joomla and browser
caches. Administrator pages, non-HTML responses and `tmpl=component` views are
deliberately excluded.
