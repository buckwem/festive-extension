# Configuration

Open **System → Manage → Plugins → System - Festive Overlay**.

| Setting | Default | Behaviour |
| --- | --- | --- |
| Joomla plugin status | Disabled on a fresh installation | Enable it for Joomla to call the plugin. |
| Enable festive effects | No | Opt in to loading the effects on public HTML pages. |
| Seasonal effect | Automatic | Christmas snow during the snow season and fireworks on the configured start date. |
| Snow season starts / ends | `12-01` / `12-30` | Inclusive UTC dates in `MM-DD` format. The range can cross New Year. |
| Fireworks start date | `01-01` | Annual date in `MM-DD` format. The display starts at midnight in the visitor's time zone. |
| Fireworks duration (hours) | 24 | Number of whole hours (1–24) from midnight on the start date. Also applies to the drone display. |
| Show Father Christmas's sleigh | Yes | Fly the sleigh during its Christmas route window. |
| Include drone displays | Yes | Alternate fireworks and drone displays. |
| Allow visitor-controlled sound | Yes | Offer fireworks sound, initially muted. |
| Snow palette | Detect the page background | Dark particles on light pages, white particles on dark pages. |
| Visitor controls position | Above Our Next Walks | Insert icons immediately before that heading; use bottom right if absent. Fixed bottom-left and bottom-right positions are also available. |

## Christmas

Snow falls and accumulates along the bottom of the viewport, with bounded
particles and banks. The sleigh carries walking boots with red and gold bows.
It travels from **10:00 UTC on 24 December until 11:00 UTC on 25 December**.
The window follows [Google Santa Tracker's published start time](https://blog.google/innovation-and-ai/technology/families/when-will-santa-be-here/)
and [25-hour journey](https://github.com/google/santa-tracker-web/blob/main/_messages/en.json#L872-L874).
During that window the overlay's plaque follows midnight around the world,
including fractional time zones.
Snow can continue outside the sleigh window within the configured season.
By default the last day of snow is **30 December (UTC)**.

## New Year

Both Automatic and Fireworks mode use the configured start date and duration.
For example, set **Fireworks start date** to `12-31` and **Fireworks duration
(hours)** to **2** to run it from **00:00 to 02:00 on 31 December** in each
visitor's time zone. The defaults cover all of 1 January. With drones enabled,
two-minute fireworks and drone sequences alternate within the same window.
The public URL tests start on demand regardless of the seasonal schedule.

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

## Public effect tests

Use the [festive effects test page](test-effects.md) to try each effect at any
time of year. The same URL parameters work on public Joomla pages with
Festive Overlay enabled.

## Local previews

On `localhost`, `127.0.0.1` or `[::1]`, append these query parameters:

```text
?festive-overlay-test=1&festive-overlay-time=2026-12-24T10:00:00Z&festive-overlay-speed=0
```

The preview panel can step the simulation, change time and exercise presets.
Use `festive-overlay-panel=0` to hide that panel and see the normal visitor
controls. `festive-overlay-effect=fireworks` previews New Year; use a time such
as `2027-01-01T00:30:00Z` and `festive-overlay-zone=Europe/London`.
These developer preview parameters and the preview panel are available only
on loopback addresses. The public effect tests use the ordinary visitor controls.
