# Festive Overlay

A Joomla system plugin project for seasonal overlays, with documentation built
using [Zensical](https://zensical.org/) and [Prodockit](https://prodockit.org/).

**Status: beta, version 0.1.0-beta1.** Ports Prodockit's Christmas snow, sleigh,
New Year fireworks and drone displays to Joomla. The sleigh carries walking
boots with red and gold bows. Visitor controls sit above **Our Next Walks**, with
a corner fallback on pages without that heading. Effects are opt-in and seasonal.

The local Alton Ramblers front-end snapshot has been used for browser checks.
A real Joomla installation/update/uninstall test remains necessary before a production release.

The development targets are Joomla 5.4 and 6.x on PHP 8.3 or later. These are
targets, not a claim of completed Joomla integration testing.

## Download the beta

The [0.1.0-beta1 release](https://github.com/buckwem/festive-extension/releases/tag/v0.1.0-beta1)
includes the [installable Joomla ZIP](https://github.com/buckwem/festive-extension/releases/download/v0.1.0-beta1/plg_system_festiveoverlay-0.1.0-beta1.zip)
and a downloadable README. Upload the named plugin ZIP in Joomla; GitHub's
automatic source archives contain the development project.

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
`make package` writes `dist/plg_system_festiveoverlay-0.1.0-beta1.zip`. Upload that
ZIP through Joomla's extension installer on a development site.

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
.github/workflows/ci.yml     Checks and build artefacts if hosted on GitHub
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
