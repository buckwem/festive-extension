#!/usr/bin/env python3
"""Make a private local front-end snapshot of public Alton Ramblers pages."""

from __future__ import annotations

from collections import deque
from hashlib import sha256
import json
from pathlib import Path
import re
import shutil
from urllib.parse import quote, unquote, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '.local-site'
ORIGIN = 'https://www.altonramblers.org.uk'
PAGES = ('/', '/news.html', '/walks-programme.html')
QUEUE: deque[str] = deque()
SEEN: set[str] = set()
FAILURES: list[dict[str, str]] = []


def local_path(url: str) -> str:
    parts = urlsplit(url)
    path = unquote(parts.path)
    if '..' in Path(path).parts:
        raise ValueError('Unsafe asset path')
    if parts.netloc == urlsplit(ORIGIN).netloc:
        return path if path != '/' else '/index.html'
    # Google Fonts stylesheets have extensionless /css URLs. Preserve the CSS
    # MIME type and follow their font URLs instead of treating them as binary.
    suffix = '.css' if parts.netloc == 'fonts.googleapis.com' and path in ('/css', '/css2') else Path(path).suffix or '.bin'
    return '/_external/' + sha256(url.encode()).hexdigest()[:20] + suffix


def asset(value: str, base: str) -> str:
    if not value or value.startswith(('data:', 'blob:', '#')):
        return value
    url = urljoin(base, value)
    parts = urlsplit(url)
    if parts.scheme not in ('http', 'https'):
        return value
    url = urlunsplit(parts._replace(fragment=''))
    if url not in SEEN:
        SEEN.add(url)
        QUEUE.append(url)
    return quote(local_path(url), safe='/') + ('#' + parts.fragment if parts.fragment else '')


def css_urls(text: str, base: str) -> str:
    return re.sub(r'url\(\s*[\'"]?([^\)\'"\s]+)[\'"]?\s*\)',
                  lambda match: 'url("' + asset(match[1], base) + '")', text)


def read(url: str) -> bytes:
    parts = urlsplit(url)
    encoded = urlunsplit(parts._replace(path=quote(unquote(parts.path), safe='/@:')))
    request = Request(encoded, headers={'User-Agent': 'FestiveOverlay-local-preview/0.1'})
    with urlopen(request, timeout=30) as response:
        return response.read()


def preview_policy(soup: BeautifulSoup) -> str:
    """Allow the requested live weather widget while keeping forms/APIs local."""
    weather = soup.select_one('.weatherwidget-io') is not None
    if weather:
        soup.head.append(soup.new_tag('script', id='weatherwidget-io-js',
                                     src='https://weatherwidget.io/js/widget.min.js', defer=True))
    scripts = "'self' 'unsafe-inline' 'unsafe-eval'" + (' https://weatherwidget.io' if weather else '')
    frames = 'https://weatherwidget.io' if weather else "'none'"
    return (f"default-src 'self' data: blob:; script-src {scripts}; "
            f"style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-src {frames}; "
            "form-action 'none'; base-uri 'self'")


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    for page in PAGES:
        url = ORIGIN + page
        soup = BeautifulSoup(read(url), 'html.parser')
        for tag in soup.select('base, iframe, link[rel=preconnect], link[rel=dns-prefetch]'):
            tag.decompose()
        for script in soup.select('script'):
            if 'googletagmanager' in script.get('src', '') or 'gtag(' in script.get_text() or 'weatherwidget' in script.get_text():
                script.decompose()
        for tag in soup.select('script[src], img[src], source[src]'):
            tag['src'] = asset(tag['src'], url)
            tag.attrs.pop('integrity', None)
            tag.attrs.pop('crossorigin', None)
        for tag in soup.select('link[href]'):
            if set(tag.get('rel', [])) & {'stylesheet', 'icon', 'shortcut', 'preload', 'modulepreload'}:
                tag['href'] = asset(tag['href'], url)
                tag.attrs.pop('integrity', None)
        for tag in soup.select('[srcset]'):
            values = []
            for candidate in tag['srcset'].split(','):
                pieces = candidate.strip().split()
                if pieces:
                    values.append(' '.join([asset(pieces[0], url), *pieces[1:]]))
            tag['srcset'] = ', '.join(values)
        for tag in soup.select('[style]'):
            tag['style'] = css_urls(tag['style'], url)
        for tag in soup.select('style'):
            tag.string = css_urls(tag.get_text(), url)
        for tag in soup.select('a[href]'):
            href = urlsplit(urljoin(url, tag['href']))
            if href.netloc == urlsplit(ORIGIN).netloc:
                tag['href'] = href.path + ('#' + href.fragment if href.fragment else '')
        # Keep forms and APIs local; the original weather widget is an explicit exception.
        csp = soup.new_tag('meta')
        csp['http-equiv'] = 'Content-Security-Policy'
        csp['content'] = preview_policy(soup)
        soup.head.insert(0, csp)
        options = soup.new_tag('script', attrs={'type': 'application/json', 'class': 'joomla-script-options new'})
        options.string = json.dumps({'plg_system_festiveoverlay': {
            'enabled': True, 'effect': 'auto', 'season_start': '12-01', 'season_end': '12-30',
            'sleigh': True, 'drone': True, 'sound': True, 'palette': 'auto', 'position': 'above-walks',
        }})
        soup.head.insert(1, options)
        css = soup.new_tag('link', rel='stylesheet', href='/media/plg_system_festiveoverlay/css/overlay.css')
        js = soup.new_tag('script', src='/media/plg_system_festiveoverlay/js/overlay.js', defer=True)
        soup.head.append(css)
        soup.head.append(js)
        dest = OUTPUT / local_path(url).lstrip('/')
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(str(soup))
        print('Copied page:', page, flush=True)

    downloaded = 0
    while QUEUE:
        url = QUEUE.popleft()
        dest = OUTPUT / local_path(url).lstrip('/')
        try:
            content = read(url)
            if dest.suffix == '.css':
                content = css_urls(content.decode('utf-8'), url).encode()
            # Joomla module scripts import neighbouring files.
            if dest.suffix == '.js':
                text = content.decode('utf-8')
                for match in re.finditer(r'(?:from\s*|import\s*\()([\'"])(\.{1,2}/[^\'"]+)\1', text):
                    dependency = match[2]
                    asset(dependency, url)
                content = text.encode()
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(content)
            downloaded += 1
            if downloaded % 25 == 0:
                print(f'Copied {downloaded} assets ({len(QUEUE)} queued)', flush=True)
        except Exception as error:
            FAILURES.append({'url': url, 'error': str(error)})

    media = OUTPUT / 'media/plg_system_festiveoverlay'
    shutil.copytree(ROOT / 'extension/media', media, dirs_exist_ok=True)
    report = {'source': ORIGIN, 'pages': list(PAGES), 'assets': downloaded, 'failures': FAILURES,
              'scope': 'Public front-end snapshot. No Joomla database, administrator session or live API services.'}
    (OUTPUT / 'mirror-report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
