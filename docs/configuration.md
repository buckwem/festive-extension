# Configuration

Open **System → Manage → Plugins → System - Festive Overlay**.

| Setting | Default | Behaviour |
| --- | --- | --- |
| Joomla plugin status | Disabled after a new installation | Joomla calls the plugin only when enabled. |
| Load overlay assets | No | Registers the starter CSS and JavaScript on public HTML pages. |

## Current behaviour

When the plugin and asset setting are enabled, the script creates an empty
`#festive-overlay` element. This is a mounting point for future decorations.
It is marked `aria-hidden="true"` and doesn't intercept pointer events.

The script omits the layer when the browser reports
`prefers-reduced-motion: reduce`, and removes it if that preference changes.
The stylesheet also hides the layer in print output.

## Verify the scaffold

On a development site, check the browser's network panel for
`media/plg_system_festiveoverlay/css/overlay.css` and
`media/plg_system_festiveoverlay/js/overlay.js`. With reduced motion off, inspect
the document body for `#festive-overlay`.

Turn the setting off and reload: neither asset should be loaded. Check an
administrator page and a `tmpl=component` view as well. A non-HTML response
must remain untouched.

There are no effect, colour, date, density or visitor-control settings yet.
