#!/usr/bin/env python3
"""Prepare the documentation demo from a Festive Overlay installer ZIP."""

from __future__ import annotations

import argparse
from pathlib import Path, PurePosixPath
import shutil
import tempfile
import xml.etree.ElementTree as ET
from zipfile import BadZipFile, ZipFile

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / 'docs' / 'festive-demo'
REQUIRED = {'media/css/overlay.css', 'media/js/overlay.js', 'media/images/sleigh.png'}


def prepare(package: Path) -> None:
    with ZipFile(package) as archive:
        manifest = ET.fromstring(archive.read('festiveoverlay.xml'))
        if (manifest.tag != 'extension' or manifest.get('type') != 'plugin'
                or manifest.get('group') != 'system'
                or manifest.find("files/folder[@plugin='festiveoverlay']") is None):
            raise ValueError('Expected a Festive Overlay system plugin installer')
        media = manifest.find('media')
        if media is None or media.get('folder') != 'media':
            raise ValueError('The installer must declare its media/ folder')
        members = [item for item in archive.infolist()
                   if item.filename.startswith('media/') and not item.is_dir()]
        names = [item.filename for item in members]
        if not REQUIRED.issubset(names):
            raise ValueError('The ZIP is missing required demonstration assets')
        if len(set(names)) != len(names):
            raise ValueError('The ZIP contains duplicate media filenames')
        # Extract only validated media paths, never PHP or other package files.
        with tempfile.TemporaryDirectory(prefix='festive-demo-') as directory:
            staging = Path(directory)
            for item in members:
                relative = PurePosixPath(item.filename).relative_to('media')
                if '..' in relative.parts or '\\' in item.filename:
                    raise ValueError('Unsafe media path in ZIP')
                target = staging.joinpath(*relative.parts)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(archive.read(item))
            if DESTINATION.exists():
                shutil.rmtree(DESTINATION)
            shutil.copytree(staging, DESTINATION)
    print(f'Prepared demo from {package.name} (version {manifest.findtext("version")})')


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('package', type=Path, help='Downloaded or built installer ZIP')
    args = parser.parse_args()
    try:
        prepare(args.package.expanduser())
    except (OSError, ValueError, KeyError, BadZipFile, ET.ParseError) as error:
        parser.exit(1, f'Demo preparation failed: {error}\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
