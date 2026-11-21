# Festive Overlay

Write prose in natural British English. Preserve code identifiers and quotations.

This repository contains a Joomla system plugin and its Zensical/Prodockit
documentation. Keep extension source in `extension/`, documentation in `docs/`
and build utilities in `scripts/`.

- Target Joomla 5.4 and 6.x; verify both on a real Joomla installation before a release.
- Use Joomla's service provider, event subscriber and Web Asset Manager APIs.
- Load overlay assets only on public HTML pages. Keep decoration out of the
  accessibility tree, preserve page interaction and honour reduced motion.
- Keep the version in `extension/festiveoverlay.xml` as the package version source.
- Update relevant documentation with behaviour changes. Distinguish planned
  features from implemented behaviour.
- Run `make check`, `make lint-php`, `make package` and `make docs` when applicable.
- Prodockit owns `docs/stylesheets/pdk*.css` and `docs/javascripts/pdk.js`.
  Put custom styles in `docs/stylesheets/extra.css`. Refresh managed files with
  `make docs-assets` after changing the pinned Prodockit version.
- Don't use Playwright.
