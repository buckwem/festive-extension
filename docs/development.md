# Development

For source validation, packaging, documentation builds and release steps, see
the [maintainer guide](maintaining.md). To try the released plugin, use the
[installation instructions](installation.md).

## Extension structure

| Path | Purpose |
| --- | --- |
| `extension/festiveoverlay.xml` | Installer manifest, version and settings |
| `extension/services/provider.php` | Joomla dependency injection registration |
| `extension/src/Extension/FestiveOverlay.php` | System event subscriber and asset loading |
| `extension/media/` | Browser CSS and JavaScript |
| `extension/language/en-GB/` | British English administration strings |
| `scripts/build_package.py` | Manifest validation and reproducible ZIP packaging |

The namespace is `FestiveOverlay\Plugin\System\FestiveOverlay`. The plugin's
Joomla element is `festiveoverlay`, in the `system` group. Keep these identifiers
aligned with the manifest filename and service provider.

The event subscriber handles `onAfterDispatch`. It checks the client, asset
setting and document before registering files with Joomla's Web Asset Manager.
Joomla installs the media directory at `media/plg_system_festiveoverlay/`.

The service provider passes a dispatcher to the plugin constructor for Joomla
5.4 compatibility. Joomla 6 still accepts that signature, although it deprecates
it ahead of Joomla 7. Revisit it when changing the supported Joomla versions.

## Port from Prodockit

The browser runtime was extracted from Prodockit 0.81.0 at commit
`5b2f762ea92689df0771be54cd558cbcd31457fb`. The Joomla version reads script
options rather than documentation metadata and does not use Material/Zensical
header, navigation or palette hooks. Its CSS is scoped to `festive-overlay-*`.
The image and runtime are shipped locally without a runtime CDN dependency.

Visitor pause/hide preferences use `festive-overlay:preferences` in local
storage, with storage failures tolerated. Sound is never persisted. Duplicate
script loading reuses one controller. Effect disposal removes listeners,
timers, canvas and controls. Controls are inserted above the Our Next Walks
heading where available, or placed in a fixed corner.

Palette detection observes theme attributes on the HTML and body elements, so
paused effects also update when a visitor changes themes. Test snow, fireworks,
navigation, pause/resume and theme switching on desktop and mobile with your
chosen template. The plugin does not provide a site-wide light/dark switch.

Keep the managed documentation assets unchanged. The ported runtime in
`extension/media/` is maintained separately; upstream changes need review and
behaviour checks before being applied. The installable ZIP includes the MIT
and CC0 attribution in `THIRD_PARTY_NOTICES.txt`.

## Joomla staging tests

Use a staging copy of the target Joomla site with its actual template, modules
and database. Check navigation, forms, interactive components and effect controls
on desktop and mobile, in both light and dark appearances where supported.
A static browser preview cannot exercise Joomla settings or server-side modules.

Keep credentials, database exports and site-specific snapshots outside the public
repository and the installer ZIP. Store local screenshots in ignored
`.test-output/`.

## Developer previews

For local browser testing of a release ZIP, see the
[maintainer instructions](maintaining.md#preview-a-released-installer).

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

## Upstream references

- [Joomla plugin tutorial](https://manual.joomla.org/docs/building-extensions/plugins/basic-content-plugin/)
- [Joomla extension manifests](https://manual.joomla.org/docs/building-extensions/install-update/installation/manifest/)
- [Joomla Web Asset Manager](https://manual.joomla.org/docs/general-concepts/web-asset-manager/)
