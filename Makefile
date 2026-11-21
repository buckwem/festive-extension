PYTHON ?= python3.13
VENV := .venv
DOC_PYTHON := $(VENV)/bin/python

.PHONY: help setup check lint-php package docs-assets docs docs-serve

help:
	@echo "setup        Create the documentation environment"
	@echo "check        Validate the Joomla manifest and package inputs"
	@echo "lint-php     Check PHP syntax (requires PHP 8.3+)"
	@echo "package      Build the installable Joomla ZIP"
	@echo "docs-assets  Restore managed assets from pinned Prodockit"
	@echo "docs         Build documentation with strict checks"
	@echo "docs-serve   Preview documentation on localhost:8000"

setup:
	$(PYTHON) -m venv $(VENV)
	$(DOC_PYTHON) -m pip install -r requirements-docs.txt

check:
	$(PYTHON) scripts/build_package.py --check

lint-php:
	@command -v php >/dev/null || { echo "Install PHP 8.3 or later to run this check."; exit 1; }
	php -r 'exit(PHP_VERSION_ID >= 80300 ? 0 : 1);'
	php -l extension/services/provider.php
	php -l extension/src/Extension/FestiveOverlay.php

package:
	$(PYTHON) scripts/build_package.py

docs-assets:
	$(VENV)/bin/prodockit shared-files --apply

docs:
	$(VENV)/bin/prodockit shared-files --check
	$(VENV)/bin/zensical build --clean --strict

docs-serve:
	$(VENV)/bin/zensical serve --dev-addr 127.0.0.1:8000
