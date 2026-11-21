# Installation

Use a development Joomla site for this scaffold. Joomla 5.4 and 6.x are the
development targets, with PHP 8.3 or later as this project's baseline. Joomla's
own database and server requirements also apply.

## Build the extension

From the repository root, run:

```sh
make check
make lint-php
make package
```

Packaging uses Python's standard library and doesn't require the documentation
dependencies. It creates `dist/plg_system_festiveoverlay-0.1.0-dev.zip` from the
files declared in `extension/festiveoverlay.xml`.

## Install in Joomla

1. Sign in to the Joomla administrator area.
2. Open **System → Install → Extensions**.
3. Upload the generated ZIP using **Upload Package File**.
4. Open **System → Manage → Plugins** and find **System - Festive Overlay**.
5. Enable the plugin. Its separate **Load overlay assets** setting starts at **No**.

Set **Load overlay assets** to **Yes** to exercise the starter asset loader.
There won't be a visible effect in this development version. See
[configuration](configuration.md) for verification steps.

## Update or uninstall

Build and upload a new ZIP to update the plugin. The manifest uses Joomla's
upgrade installation method. Check that your saved settings survive an update.

To remove it, open **System → Manage → Extensions**, select **System - Festive
Overlay**, then uninstall it. No database tables are created by this scaffold.

## Troubleshooting

If the plugin isn't listed, confirm that the ZIP contains `festiveoverlay.xml`
at its root, rather than an enclosing project directory.

If assets don't load, check both the plugin's status and its asset setting.
Confirm that you're viewing a public HTML page, then clear Joomla and browser
caches. Administrator pages, non-HTML responses and `tmpl=component` views are
deliberately excluded.
