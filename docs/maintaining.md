# Building and releasing

These instructions are for maintainers changing the source or publishing a
release. To try the extension, use the [downloaded ZIP testing guide](documentation.md)
and [Joomla installation instructions](installation.md).

## Prepare the tools

Use Python 3.13, Node.js 22 or later and PHP 8.3 or later. From the repository root:

```sh
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-docs.txt
```

On Windows PowerShell, activate with `.\.venv\Scripts\Activate.ps1`.
Packaging itself uses Python's standard library and requires Python 3.11 or later.
Joomla and PHP are installed separately.

## Validate and build the installer ZIP

```sh
python scripts/build_package.py --check
php -r 'exit(PHP_VERSION_ID >= 80300 ? 0 : 1);'
php -l extension/services/provider.php
php -l extension/src/Extension/FestiveOverlay.php
php tests/plugin.php
node --test tests/overlay.test.cjs
python scripts/build_package.py
```

The version comes from `extension/festiveoverlay.xml`. The package contains only
manifest-declared files, with stable timestamps and file order. For the current
beta it is `dist/plg_system_festiveoverlay-0.1.0-beta4.zip`.

## Build and preview the documentation

[Zensical](https://zensical.org/docs/) builds the Markdown site, with formatting
and managed assets from [Prodockit](https://prodockit.org/). Prepare the demo from
the installer you just built, then validate and build the site:

```sh
python scripts/prepare_demo.py dist/plg_system_festiveoverlay-0.1.0-beta4.zip
prodockit shared-files --check
zensical build --clean --strict
```

The generated website is in `site/`. To preview it, run:

```sh
zensical serve --dev-addr 127.0.0.1:8000
```

Open <http://127.0.0.1:8000>. Press **Ctrl+C** to stop the server before a clean
build. Edit pages in `docs/` and navigation in `zensical.toml`.

## Publish a release

1. Update the version in `extension/festiveoverlay.xml`, `CHANGELOG.md`, README
   and documentation download links together.
2. Run the validation, packaging and strict documentation commands above with
   the new ZIP filename.
3. Install, update and uninstall that ZIP on real Joomla 5.4 and 6.x sites.
   Check saved settings, public and administrator pages, subdirectory sites,
   non-HTML responses, keyboard controls, reduced motion and printing.
4. Commit and push the reviewed changes. Wait for GitHub Actions to pass.
5. In GitHub's **Releases**, choose **Draft a new release**. Create a tag matching
   the manifest version, prefixed with `v`, from the tested commit.
6. Attach the installer ZIP from that commit and `README.md`. Describe the
   changes and outstanding limitations. Mark beta versions as a **pre-release**,
   then publish.
7. Download the attached ZIP and check that it matches the tested package.
   Verify the release links and installation instructions on the published site.

An Actions package artefact is a development build. Pushing a commit deploys
documentation but does not replace files attached to a GitHub release.

## Prodockit configuration and assets

The configuration enables `prodockit.headings`, `prodockit.tables` and
`prodockit.tree`. Heading and table-of-contents numbering are hidden using the
project's custom stylesheet. Managed web assets load before
`docs/stylesheets/extra.css`, where project-specific styling belongs.

`.prodockit-shared-files.toml` maps the managed files to the installed Prodockit
package. After a dependency update, refresh them using:

```sh
prodockit shared-files --apply
prodockit shared-files --check
zensical build --clean --strict
```

Review and commit the resulting asset changes with the dependency pins.
Don't edit managed files by hand. The Prodockit PDF stylesheet is retained
for future PDF configuration; PDF generation is not part of this site's workflow.

## Dependency updates

`requirements-docs.txt` pins the documentation environment. Test updates in a
fresh virtual environment, following Prodockit's
[version pinning guidance](https://prodockit.org/devcons/pinning-drift/).
Regenerate the requirements file from the tested environment with
`python -m pip freeze > requirements-docs.txt`, refresh managed assets and run
the strict build commands above. Keep documented tool versions aligned with
the pins.

## Deploy documentation to Pages

The source repository is
[buckwem/festive-extension](https://github.com/buckwem/festive-extension).
The published site is
[Festive Overlay documentation](https://buckwem.github.io/festive-extension/).

On pushes to `main`, GitHub Actions installs the pinned tools, extracts the
demonstration assets from the built ZIP, runs `prodockit shared-files --check` and
`zensical build --clean --strict`, then deploys through the `github-pages`
environment after the build checks pass. Pull requests run checks
without deployment. The workflow can also be started manually from Actions.

`site_url` in `zensical.toml` sets the Pages project URL. Only the generated
`site/` directory is deployed; local website mirrors and recordings are excluded.
