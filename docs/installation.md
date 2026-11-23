# Installation

Use a development Joomla site for this beta. Joomla 5.4 and 6.x are the
development targets, with PHP 8.3 or later as this project's baseline. Joomla's
own database and server requirements also apply.

## Recommended prerequisite: RA Dark Theme

[RA Dark Theme](https://github.com/buckwem/ra-dark-theme) provides a light/dark
switch through a standalone **Gantry template**. Review its supplied layout
and adapt it to your site before activation. Install and check it before adding
Festive Overlay if you want visitors to be able to choose either appearance.

Dark mode is optional: Festive Overlay works in light mode too. You can leave
the default appearance set to **Light** and let visitors choose dark mode.
The two extensions have separate installers and settings.

### Install the Gantry template

1. Back up the site and keep your existing template installed for rollback. Preview the beta
   on a staging copy before applying it to a public site.
2. Download `tpl_ra_darktheme-0.2.0-beta4.zip` from the
   [RA Dark Theme release](https://github.com/buckwem/ra-dark-theme/releases/tag/v0.2.0-beta4).
3. Open **System → Install → Extensions → Upload Package File** and upload the
   template ZIP. Use Joomla's installer, rather than Gantry's Import control.
4. Open **Components → Gantry 5 Themes → Available Themes**, then open
   **RA Dark Theme**. Confirm that the version shown is **0.2.0-beta4** or later.
5. Review the supplied layout and preview the template. A template preview does
   not activate it on the normal public URLs.

Review template layouts, module positions, branding and navigation on staging
before applying the template to a public site.

### Choose the default appearance

1. In **RA Dark Theme**, select **Base Outline** from the outline dropdown.
2. Open **Page Settings** and find the **RA Dark Theme** section.
3. Set **Default theme** to **Light**, **Dark** or **Device preference**.
4. Click **Save Page Settings**.

For an outline-specific choice, select that outline, enable the field's override
checkbox and save its Page Settings. A saved visitor choice takes precedence
over the configured default. Test the default in a fresh private window;
clearing Joomla's cache does not clear browser preferences.

### Activate the template across the site

1. Open **System → Templates → Site Template Styles**.
2. Make **RA Dark Theme – Default** the default using its star or the **Default**
   toolbar button.
3. Review the existing menu items under **Menus**. Open each item
   that explicitly selects another template, and under **Details** change
   **Template Style** to **Use Default**, then **Save & Close**.
4. Check a representative selection of public pages, including navigation,
   forms and any interactive modules on desktop and mobile.

Existing menu assignments override the site-wide default. Review each menu
item that should follow the new default and set its **Template Style** to
**Use Default**. Keep explicit assignments where a different template is intended.

In Gantry's **Assignments** screen, the default-template dropdown must remain
**All Languages** for a general site default. A named language creates a language-specific
default; it is separate from both the page-assignment checkboxes and the
light/dark appearance setting.

Keep your previous template available to restore the previous template style and menu
assignments if testing exposes a problem. Then install Festive Overlay below
and check its effects in both appearances. These are beta packages; update and
removal behaviour still require staging checks.

## Download and install Festive Overlay

Download the attached `plg_system_festiveoverlay-0.1.0-beta4.zip` installer
from the release assets. [Festive Overlay beta4 release](https://github.com/buckwem/festive-extension/releases/tag/v0.1.0-beta4)

### Install in Joomla

1. Sign in to the Joomla administrator area.
2. Open **System → Install → Extensions**.
3. Upload the downloaded plugin ZIP using **Upload Package File**.
4. Open **System → Manage → Plugins** and find **System - Festive Overlay**.
5. Enable the plugin. Its separate **Enable festive effects** setting starts at **No**.

Set **Enable festive effects** to **Yes**. For controls that work with any
page layout, choose **Bottom left** or **Bottom right** under **Visitor controls
position**, then click **Save & Close**. Leave **Access** set to **Public** if
all visitors should receive the effects.

The default **Above Our Next Walks** option looks for a heading with that exact
text and uses the bottom-right corner if it is absent. See the
[configuration guide](configuration.md#visitor-controls) for the available controls.

Effects follow their seasonal dates; use the
[public effect tests](test-effects.md#test-a-joomla-page) to test your installed
plugin outside those dates.

### Update or uninstall

Download the newer installer ZIP from the release assets and upload it to update
the plugin. The manifest uses Joomla's
upgrade installation method. Check that your saved settings survive an update.

To remove it, open **System → Manage → Extensions**, select **System - Festive
Overlay**, then uninstall it. No database tables are created by this beta.

### Troubleshooting

If the plugin isn't listed, confirm that the ZIP contains `festiveoverlay.xml`
at its root, rather than an enclosing project directory.

If assets don't load, check both the plugin's status and its effects setting.
Confirm that you're viewing a public HTML page, then clear Joomla and browser
caches. Administrator pages, non-HTML responses and `tmpl=component` views are
deliberately excluded.

If both enable settings are on but even a public test URL shows no controls,
inspect the page source for `//media/plg_system_festiveoverlay/`. This is a known
asset URL defect in earlier packages, fixed in beta4. It is not
resolved by changing the seasonal dates or clearing browser preferences.
