# Documentation

The documentation is authored in Markdown and built by Zensical. Prodockit
provides formatting extensions and the managed CSS and JavaScript assets.

## Preview and build

```sh
make setup
make docs
make docs-serve
```

Open <http://127.0.0.1:8000> for the local preview. Press **Ctrl+C** to stop it.
The static build is written to `site/`, which is ignored by Git.

Edit pages in `docs/` and add navigation entries in `zensical.toml`. Write prose
in British English and keep instructions consistent with the plugin's actual
behaviour.

## Prodockit configuration

The configuration enables `prodockit.headings`, `prodockit.tables` and
`prodockit.tree`. Headings are unnumbered by default. The managed web assets are
loaded before `docs/stylesheets/extra.css`, where project-specific styling belongs.
The Prodockit PDF stylesheet is also included for future PDF configuration;
PDF generation isn't part of this initial build workflow.

`.prodockit-shared-files.toml` maps the managed assets to files supplied by the
installed Prodockit package. To refresh them after a dependency update, run:

```sh
make docs-assets
make docs
```

Review and commit the resulting asset changes with the dependency pins.
Don't edit managed files by hand.

## Dependency updates

`requirements-docs.txt` pins the complete documentation environment. Test
dependency updates in a fresh virtual environment, regenerate that file with
`python -m pip freeze`, then run the asset and strict build checks. Keep the
Zensical and Prodockit versions aligned with the versions documented here.

## Publishing

The public source repository is
[buckwem/festive-extension](https://github.com/buckwem/festive-extension).
The GitHub Actions workflow uploads the built site as a downloadable artefact
but doesn't publish it. When documentation hosting is chosen, set `site_url`
in `zensical.toml` and add a deployment workflow for the selected service.

See the [Zensical documentation](https://zensical.org/docs/) and
[Prodockit documentation](https://prodockit.org/) for authoring features.
