# Documentation

The documentation is authored in Markdown and built by [Zensical](https://zensical.org/docs/).
[Prodockit](https://prodockit.org/) supplies formatting extensions and managed
CSS and JavaScript assets. Use the commands below from the repository root.

## Prepare the environment

Create and activate a project environment, then install the pinned tools:

```sh
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-docs.txt
```

On Windows PowerShell, use `py -3.13 -m venv .venv` and activate it with
`.\.venv\Scripts\Activate.ps1` before running the remaining commands.

Confirm that the tools resolve from the active environment:

```sh
python -c "import sys; print(sys.executable)"
prodockit --version
zensical --version
```

This follows Prodockit's [manual installation guidance](https://prodockit.org/manual-install/).
The site configuration already exists in `zensical.toml`.

## Prepare the effects demonstration

Copy the shipped Joomla overlay assets into the documentation's generated
asset directory before building or serving the site:

```sh
python -c "from shutil import copytree; copytree('extension/media', 'docs/festive-demo', dirs_exist_ok=True)"
```

This project-specific step lets the [festive effects test page](test-effects.md)
run the same animation code as the Joomla package. Repeat it after changing
files in `extension/media/`. The generated directory is ignored by Git.

## Build the site

Check the managed Prodockit assets, then build with strict validation:

```sh
prodockit shared-files --check
zensical build --clean --strict
```

The static website is written to `site/`, which is ignored by Git. A successful
build produces the deployable files; it does not start a web server.

## Preview the site

With the environment active and demonstration assets prepared, run:

```sh
zensical serve --dev-addr 127.0.0.1:8000
```

Open <http://127.0.0.1:8000>. Source edits trigger a rebuild. Press **Ctrl+C**
to stop the server.

Edit pages in `docs/` and navigation in `zensical.toml`. Write prose in British
English and keep instructions consistent with the actual behaviour.

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

## Publishing

The source repository is
[buckwem/festive-extension](https://github.com/buckwem/festive-extension).
The published site is
[Festive Overlay documentation](https://buckwem.github.io/festive-extension/).

On pushes to `main`, GitHub Actions installs the pinned tools, prepares the
demonstration assets, runs `prodockit shared-files --check` and
`zensical build --clean --strict`, then deploys through the `github-pages`
environment after the build checks pass. Pull requests run checks
without deployment. The workflow can also be started manually from Actions.

`site_url` in `zensical.toml` sets the Pages project URL. Only the generated
`site/` directory is deployed; local website mirrors and recordings are excluded.
