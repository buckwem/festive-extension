# Development

## Set up

Install Python 3.13 and PHP 8.3 or later, then run these commands from the
repository root:

```sh
make setup
make check
make lint-php
make package
make docs
```

`make setup` creates `.venv` and installs the pinned documentation dependencies.
It doesn't install Joomla or PHP. Run the extension inside a separate Joomla
development site and keep credentials outside this repository.

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

## Validation and release work

`make check` verifies the manifest and declared inputs. `make lint-php` checks
syntax. `make package` produces a ZIP with stable timestamps and file order.
`make docs` checks managed assets and builds the documentation in strict mode.
The GitHub Actions workflow runs these checks if the repository is hosted there.

Before claiming a supported release, install, update and uninstall the package
on each target Joomla version. Check public pages, administrator pages,
subdirectory installations and non-HTML responses. Verify keyboard interaction,
reduced motion and printing after adding any visual effects.

Update the manifest version, `CHANGELOG.md` and the documentation together.
Add focused behaviour tests as the extension gains functionality.

## Upstream references

- [Joomla plugin tutorial](https://manual.joomla.org/docs/building-extensions/plugins/basic-content-plugin/)
- [Joomla extension manifests](https://manual.joomla.org/docs/building-extensions/install-update/installation/manifest/)
- [Joomla Web Asset Manager](https://manual.joomla.org/docs/general-concepts/web-asset-manager/)
