# Festive Overlay

A Joomla system plugin project for seasonal overlays, with documentation built
using [Zensical](https://zensical.org/) and [Prodockit](https://prodockit.org/).

**Status: beta, version 0.1.0-beta3.** Ports Prodockit's Christmas snow, sleigh,
New Year fireworks and drone displays to Joomla. The sleigh carries walking
boots with red and gold bows. Visitor controls sit above **Our Next Walks**, with
a corner fallback on pages without that heading. Effects are opt-in and seasonal.

The local Alton Ramblers front-end snapshot has been used for browser checks.
A real Joomla installation/update/uninstall test remains necessary before a production release.

The development targets are Joomla 5.4 and 6.x on PHP 8.3 or later. These are
targets, not a claim of completed Joomla integration testing.

## Build the beta installer

Run `make package` to build
`dist/plg_system_festiveoverlay-0.1.0-beta3.zip`, then upload it through the
extension installer on a development Joomla site. GitHub's checks also build a
ZIP and upload it as the `festive-overlay-development-package` artefact.

## Try the effects

Run `make docs-serve` and open the **Test festive effects** page. It offers
five links for snow, snow with Father Christmas, fireworks, drones, and
fireworks followed by drones. The same URL parameters work on a public Joomla
page where the plugin is enabled. [Test page and URL parameters](docs/test-effects.md)

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

## Getting started

Use Python 3.13 for the documentation environment and PHP 8.3 or later for
syntax checks. Python 3.11 or later can run the packaging utility on its own.

```sh
cd ~/repos/festive-extension
make setup
make check
make lint-php
make test
make package
make docs
make docs-serve
```

`make docs-serve` previews the documentation at <http://127.0.0.1:8000>.

See [installation](docs/installation.md), [configuration](docs/configuration.md)
and [development](docs/development.md) for the remaining steps.

## Local website preview

```sh
make preview-mirror
make preview-serve
```

Open [the Christmas preview](http://127.0.0.1:8765/?festive-overlay-test=1&festive-overlay-panel=0&festive-overlay-time=2026-12-24T10:00:00Z&festive-overlay-speed=0).
The mirror follows public menu and article links, currently copying 162 pages and their assets. It does not copy the
Joomla database or administrator access. Live API calls and form submissions
are blocked. The original WeatherWidget.io forecast remains live and needs an
internet connection. `.local-site/` and `.test-output/` are ignored by Git and excluded
from the installation ZIP. The mirror is for local visual testing only.

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
