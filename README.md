# Festive Overlay

A Joomla system plugin project for seasonal overlays, with documentation built
using [Zensical](https://zensical.org/) and [Prodockit](https://prodockit.org/).

Read the [published documentation](https://buckwem.github.io/festive-extension/).

**Status: beta, version 0.1.0-beta4.** Ports Prodockit's Christmas snow, sleigh,
New Year fireworks and drone displays to Joomla. The sleigh carries walking
boots with red and gold bows. Visitor controls sit above **Our Next Walks**, with
a corner fallback on pages without that heading. Effects are opt-in and seasonal.

The site maintainer confirmed beta4 working on Alton Ramblers (Joomla 5.4.10).
Joomla 6 installation, updates and removal still need integration testing before
a production release.

The development targets are Joomla 5.4 and 6.x on PHP 8.3 or later. These are
targets, not a claim of completed Joomla integration testing.

## Download the beta installer

Download `plg_system_festiveoverlay-0.1.0-beta4.zip` from the release assets
and upload it through the extension installer on a development Joomla site.
[Festive Overlay beta4 release](https://github.com/buckwem/festive-extension/releases/tag/v0.1.0-beta4)

## Try the effects

Use the [hosted test page](https://buckwem.github.io/festive-extension/test-effects/)
or follow the [local ZIP testing guide](docs/documentation.md) to preview the
assets from your downloaded installer with Zensical. The same
[test URL parameters](docs/test-effects.md) work on a public Joomla page where
the plugin and festive effects are enabled.

To schedule the display, set **Fireworks start date** and **Fireworks duration
(hours)** in the plugin settings. The defaults cover all of 1 January in each
visitor's time zone. For example, `12-31` and `2` run the display from
midnight to 02:00 on 31 December. The default snow season ends on 30 December
UTC, and the sleigh flies from 10:00 UTC on 24 December to 11:00 UTC on
25 December. [Configuration guide](docs/configuration.md)

## Recommended prerequisite: RA Dark Theme

Install and configure [RA Dark Theme](https://github.com/buckwem/ra-dark-theme)
if you want visitors to choose light or dark appearance. The Gantry template
includes the Ramblers layout and theme switch. Follow the
[installation guide](docs/installation.md#recommended-prerequisite-ra-dark-theme)
for template installation, appearance settings and Joomla menu assignments.

RA Dark Theme is recommended, not required. Festive Overlay works in light mode
too, so the default appearance can remain **Light**. The two extensions have
separate installers and settings. Check the seasonal effects in both modes.

## Maintainers

Source builds, validation, documentation builds and publishing are described in
[Building and releasing](docs/maintaining.md). The
[development guide](docs/development.md) covers the plugin structure and local
website mirror.

## Repository layout

```text
extension/                  Joomla plugin files, manifest, language and media
docs/                       User and developer documentation
scripts/                    Validation and ZIP packaging
.github/workflows/ci.yml     GitHub checks and build artefacts
zensical.toml               Documentation configuration
requirements-docs.txt       Pinned documentation dependencies
.prodockit-shared-files.toml Managed Prodockit asset declarations
Makefile                    Local development commands
```

The source manifest owns the extension version. Only manifest-declared files
and the extension licence enter the ZIP; documentation and development tools
stay outside it. Build output and virtual environments are ignored by Git.

## Licence

Original project code and documentation are licensed under GPL-2.0-or-later;
see [LICENSE](LICENSE). Managed Prodockit assets retain their upstream MIT
licence and copyright notices; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
