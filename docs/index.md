# Festive Overlay

Festive Overlay is a Joomla system plugin project for seasonal decorations on
public pages. This documentation covers the initial development scaffold.

!!! info "Development status"
    Version **0.1.0-dev** includes the installer manifest, asset loader and an
    empty decorative layer. It doesn't display a festive effect yet.

Start with [installation](installation.md) to build and install the ZIP on a
development site. [Configuration](configuration.md) explains the available
setting. Contributors can follow the [development guide](development.md).

## Intended compatibility

| Software | Development target |
| --- | --- |
| Joomla | 5.4 and 6.x |
| PHP | 8.3 or later |
| Documentation Python | 3.13 |
| Zensical | 0.1.3 |
| Prodockit | 0.81.0 |

Joomla installation and behaviour must be tested before a release. The
packaging checks validate the archive structure; they don't replace that test.

## Design direction

The extension will provide decorative overlays without changing site content.
The scaffold loads assets only on public HTML pages when explicitly enabled.
Its layer doesn't intercept pointer events and is hidden from assistive
technology. Reduced motion prevents the layer from being created.

See the [roadmap](roadmap.md) for work that hasn't been implemented.
