# Festive Overlay

A Joomla system plugin project for seasonal overlays, with documentation built
using [Zensical](https://zensical.org/) and [Prodockit](https://prodockit.org/).

**Status: initial scaffold, version 0.1.0-dev.** The installable plugin provides
an opt-in asset loader and an empty decorative layer. Snow, other effects,
scheduling and visitor controls haven't been implemented yet.

The development targets are Joomla 5.4 and 6.x on PHP 8.3 or later. These are
targets, not a claim of completed Joomla integration testing.

## Getting started

Use Python 3.13 for the documentation environment and PHP 8.3 or later for
syntax checks. Python 3.11 or later can run the packaging utility on its own.

```sh
cd ~/repos/festive-extension
make setup
make check
make lint-php
make package
make docs
make docs-serve
```

`make docs-serve` previews the documentation at <http://127.0.0.1:8000>.
`make package` writes `dist/plg_system_festiveoverlay-0.1.0-dev.zip`. Upload that
ZIP through Joomla's extension installer on a development site.

See [installation](docs/installation.md), [configuration](docs/configuration.md)
and [development](docs/development.md) for the remaining steps.

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
