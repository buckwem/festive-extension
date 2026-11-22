# Local ZIP testing

Use the released installer ZIP to test Festive Overlay. You don't need to build
the extension or publish a release.

## Test in Joomla

Download `plg_system_festiveoverlay-0.1.0-beta3.zip` from the
[beta3 release assets](https://github.com/buckwem/festive-extension/releases/tag/v0.1.0-beta3).
Choose the installer ZIP, rather than GitHub's **Source code** archives.

Follow the [installation instructions](installation.md#download-and-install-festive-overlay)
on a development Joomla site. Enable the plugin and **Enable festive effects**,
then use the [test parameters](test-effects.md#test-a-joomla-page) on public pages.
Check both light and dark appearances if your site supports them.

## Prepare a local browser preview

This preview runs the JavaScript, CSS and images extracted from your downloaded
ZIP. It lets you inspect the effects without installing Joomla. Plugin settings,
installation and Joomla integration still need testing on a Joomla site.

Download and extract the
[documentation source](https://github.com/buckwem/festive-extension/archive/refs/heads/main.zip),
or use an existing checkout. Open a terminal in its root directory, containing
`zensical.toml`. Install Python 3.13, then create and activate an environment:

```sh
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-docs.txt
```

On Windows PowerShell, use `py -3.13 -m venv .venv` and activate it with
`.\.venv\Scripts\Activate.ps1` before running the remaining commands.

Confirm the tools, following Prodockit's
[manual installation guidance](https://prodockit.org/manual-install/):

```sh
prodockit --version
zensical --version
```

## Prepare the effects demonstration

Pass the downloaded installer ZIP to the preparation command. For example, on
macOS or Linux:

```sh
python scripts/prepare_demo.py ~/Downloads/plg_system_festiveoverlay-0.1.0-beta3.zip
```

On Windows PowerShell:

```powershell
python scripts/prepare_demo.py "$HOME/Downloads/plg_system_festiveoverlay-0.1.0-beta3.zip"
```

Use the path where you saved the ZIP. The command validates its Festive Overlay
manifest and extracts only its `media/` files into `docs/festive-demo/`.
Run it again whenever you want to test a different installer ZIP.

## Start the preview

With the environment active, run:

```sh
zensical serve --dev-addr 127.0.0.1:8000
```

Open <http://127.0.0.1:8000/test-effects/> and select an effect. Test pause,
hide, reduced motion and the light/dark switch. Fireworks start muted; enable
sound using their sound control if wanted. Press **Ctrl+C** in the terminal
to stop the server.

The generated assets stay local and are ignored by Git. The hosted test page
uses the ZIP produced by its GitHub Actions build; it may contain changes newer
than the published beta. Use your downloaded release ZIP for release testing.

Source builds, documentation builds and publishing are covered separately in
the [maintainer guide](maintaining.md).
