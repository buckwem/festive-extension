PYTHON ?= python3.13
PHP_BIN ?= php
NODE ?= node
VENV := .venv
DOC_PYTHON := $(VENV)/bin/python

.PHONY: help setup check lint-php test test-js test-php package docs-assets docs-demo-assets docs docs-serve preview-mirror preview-serve

help:
	@echo "setup        Create the documentation environment"
	@echo "check        Validate the Joomla manifest and package inputs"
	@echo "lint-php     Check PHP syntax (requires PHP 8.3+)"
	@echo "test         Run browser-runtime and PHP behaviour checks"
	@echo "package      Build the installable Joomla ZIP"
	@echo "docs-assets  Restore managed assets from pinned Prodockit"
	@echo "docs         Build documentation with strict checks"
	@echo "docs-serve   Preview documentation on localhost:8000"
	@echo "preview-mirror  Copy public Alton Ramblers pages locally"
	@echo "preview-serve   Serve the local website copy on localhost:8765"

setup:
	$(PYTHON) -m venv $(VENV)
	$(DOC_PYTHON) -m pip install -r requirements-docs.txt

check:
	$(PYTHON) scripts/build_package.py --check

lint-php:
	$(PHP_BIN) -r 'exit(PHP_VERSION_ID >= 80300 ? 0 : 1);'
	$(PHP_BIN) -l extension/services/provider.php
	$(PHP_BIN) -l extension/src/Extension/FestiveOverlay.php

test: test-js test-php

test-js:
	$(NODE) --test tests/overlay.test.cjs

test-php:
	$(PHP_BIN) tests/plugin.php

preview-mirror:
	$(DOC_PYTHON) scripts/expand_mirror.py

preview-serve:
	$(PYTHON) -m http.server 8765 --bind 127.0.0.1 --directory .local-site

package:
	$(PYTHON) scripts/build_package.py

docs-assets:
	$(VENV)/bin/prodockit shared-files --apply

docs-demo-assets: package
	$(PYTHON) scripts/prepare_demo.py dist/plg_system_festiveoverlay-$(shell $(PYTHON) -c "import xml.etree.ElementTree as E; print(E.parse('extension/festiveoverlay.xml').getroot().findtext('version'))").zip

docs: docs-demo-assets
	$(VENV)/bin/prodockit shared-files --check
	$(VENV)/bin/zensical build --clean --strict

docs-serve: docs-demo-assets
	$(VENV)/bin/zensical serve --dev-addr 127.0.0.1:8000
