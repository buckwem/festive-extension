# Configuration

Open **System → Manage → Plugins → System - Festive Overlay**.

| Setting | Default | Behaviour |
| --- | --- | --- |
| Joomla plugin status | Disabled on a fresh installation | Enable it for Joomla to call the plugin. |
| Enable festive effects | No | Opt in to loading the effects on public HTML pages. |
| Seasonal effect | Automatic | Christmas snow during the season; New Year effects on 1 January. |
| Snow season starts / ends | `12-01` / `01-06` | Inclusive UTC dates in `MM-DD` format. The range can cross New Year. |
| Show Father Christmas's sleigh | Yes | Fly the sleigh during its Christmas route window. |
| Include drone displays | Yes | Alternate fireworks and drone displays. |
| Allow visitor-controlled sound | Yes | Offer fireworks sound, initially muted. |
| Snow palette | Detect the page background | Dark particles on light pages, white particles on dark pages. |
| Visitor controls position | Above Our Next Walks | Insert icons immediately before that heading; use bottom right if absent. Fixed bottom-left and bottom-right positions are also available. |

## Christmas

Snow falls and accumulates along the bottom of the viewport, with bounded
particles and banks. The sleigh carries walking boots with red and gold bows.
It travels from **10:00 UTC on 24 December until 12:00 UTC on 26 December**.
Its plaque follows midnight around the world, including fractional time zones.
Snow can continue outside the sleigh window within the configured season.

## New Year

Automatic mode selects New Year on 1 January in the visitor's time zone.
Fireworks run for **all 24 hours of 1 January**, from midnight until midnight
at the start of 2 January in the visitor's time zone. With drones enabled,
two-minute fireworks and drone sequences alternate. Choosing the fireworks
effect explicitly still honours this time window.

## Visitor controls

The snowflake or firework icon turns the effect on or off. The pause/play icon
freezes or resumes animation. These preferences are saved in the browser when
storage is available; turning effects off leaves the controls available.
The speaker icon enables or mutes fireworks sound, with a volume slider.
Sound always starts muted and needs a visitor's explicit click.

The icons have accessible names, pressed states, visible keyboard focus and
18-pixel glyphs within 44-pixel minimum targets. The snowflake, firework and
speaker icons match Prodockit's controls. Their colours follow the detected or
configured palette, including theme changes while animation is paused.
Reduced motion starts the animation paused. Hidden
tabs and printing suspend animation. The decorative canvas ignores pointer
events and is hidden from assistive technology.

The controls appear only during the relevant effect's active dates. The
heading match is `Our Next Walks`, with surrounding and repeated whitespace
normalised. Changing the heading text makes the plugin use its corner fallback.

## Local previews

On `localhost`, `127.0.0.1` or `[::1]`, append these query parameters:

```text
?festive-overlay-test=1&festive-overlay-time=2026-12-24T10:00:00Z&festive-overlay-speed=0
```

The preview panel can step the simulation, change time and exercise presets.
Use `festive-overlay-panel=0` to hide that panel and see the normal visitor
controls. `festive-overlay-effect=fireworks` previews New Year; use a time such
as `2027-01-01T00:30:00Z` and `festive-overlay-zone=Europe/London`.
Preview date and effect overrides are ignored on public hostnames. The
production site does not expose a preview panel.
