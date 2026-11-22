from __future__ import annotations
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urljoin,urlsplit,urlunsplit,parse_qsl,urlencode
from urllib.request import Request,urlopen
import importlib.util,json,shutil
from bs4 import BeautifulSoup

root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('mirror',root/'scripts/mirror_site.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
origin=m.ORIGIN
output=m.OUTPUT
max_pages=500
page_queue=deque(['/','/news.html','/walks-programme.html'])
queued=set(page_queue)
pages={}
failed=[]

def page_url(href,base):
    u=urlsplit(urljoin(base,href))
    if u.netloc!=urlsplit(origin).netloc or u.scheme not in ('http','https'):return None
    if any(x in u.path.lower() for x in ['/administrator','/login','/logout','/component','/register']):return None
    if not(u.path.endswith('.html') or u.path=='/'):return None
    query=parse_qsl(u.query)
    if any(k not in ['start','limitstart'] or not v.isdigit() for k,v in query):return None
    return u.path+('?' + urlencode(query) if query else '')

def page_path(page):
    u=urlsplit(page)
    if u.query:
        return '/_pages/'+Path(u.path).stem+'-'+m.sha256(page.encode()).hexdigest()[:12]+'.html'
    return u.path if u.path!='/' else '/index.html'

def fetch(page):
    try:return page,m.read(origin+page),None
    except Exception as e:return page,None,str(e)

with ThreadPoolExecutor(max_workers=5) as pool:
    while page_queue and len(pages)+len(failed)<max_pages:
        batch=[page_queue.popleft() for _ in range(min(5,len(page_queue),max_pages-len(pages)-len(failed)))]
        for page,content,error in pool.map(fetch,batch):
            if error:failed.append({'page':page,'error':error});continue
            soup=BeautifulSoup(content,'html.parser');pages[page]=soup
            # Prioritise menu pages, then public articles and category pagination.
            links=[*soup.select('#g-navigation a[href]'),*soup.select('a[href]')]
            for a in links:
                link=page_url(a['href'],origin+page)
                if link is not None and link not in queued:
                    queued.add(link);page_queue.append(link)
        print(f'Fetched {len(pages)} public pages, {len(page_queue)} queued',flush=True)

for page,soup in pages.items():
    url=origin+page
    for tag in soup.select('base, iframe, link[rel=preconnect], link[rel=dns-prefetch]'):tag.decompose()
    for tag in soup.select('script'):
        if 'googletagmanager' in tag.get('src','') or 'gtag(' in tag.get_text() or 'weatherwidget' in tag.get_text():tag.decompose()
    for tag in soup.select('script[src], img[src], source[src]'):
        tag['src']=m.asset(tag['src'],url);tag.attrs.pop('integrity',None);tag.attrs.pop('crossorigin',None)
    for tag in soup.select('link[href]'):
        if set(tag.get('rel',[])) & {'stylesheet','icon','shortcut','preload','modulepreload'}:
            tag['href']=m.asset(tag['href'],url);tag.attrs.pop('integrity',None)
            if 'stylesheet' in tag.get('rel',[]):tag['href']+='?local-fonts=3'
    for tag in soup.select('[srcset]'):
        candidates=[]
        for candidate in tag['srcset'].split(','):
            parts=candidate.strip().split()
            if parts:candidates.append(' '.join([m.asset(parts[0],url),*parts[1:]]))
        tag['srcset']=', '.join(candidates)
    for tag in soup.select('[style]'):tag['style']=m.css_urls(tag['style'],url)
    for tag in soup.select('style'):tag.string=m.css_urls(tag.get_text(),url)
    for tag in soup.select('a[href]'):
        href=tag['href']
        absolute=urljoin(url,href);parts=urlsplit(absolute)
        local=page_url(href,url)
        if local in pages:tag['href']=page_path(local)+('#'+parts.fragment if parts.fragment else '')
        elif parts.netloc==urlsplit(origin).netloc:
            if Path(parts.path).suffix.lower() in {'.pdf','.gpx','.doc','.docx','.xlsx','.zip'}:
                tag['href']=m.asset(absolute,url)
            elif not href.startswith('#'):
                tag['href']=absolute
                tag['title']='Opens the public website; this page is not in the local snapshot'
    csp=soup.new_tag('meta',attrs={'http-equiv':'Content-Security-Policy'})
    csp['content']=m.preview_policy(soup)
    soup.head.insert(0,csp)
    options=soup.new_tag('script',attrs={'type':'application/json','class':'joomla-script-options new'})
    options.string=json.dumps({'plg_system_festiveoverlay':{'enabled':True,'effect':'auto','season_start':'12-01','season_end':'12-30','sleigh':True,'drone':True,'sound':True,'palette':'auto','position':'above-walks'}})
    soup.head.insert(1,options)
    soup.head.append(soup.new_tag('link',rel='stylesheet',href='/media/plg_system_festiveoverlay/css/overlay.css'))
    soup.head.append(soup.new_tag('script',src='/media/plg_system_festiveoverlay/js/overlay.js',defer=True))
    path=output/page_path(page).lstrip('/');path.parent.mkdir(parents=True,exist_ok=True);path.write_text(str(soup))

cached=0;downloaded=0
with ThreadPoolExecutor(max_workers=8) as pool:
    while m.QUEUE:
        batch=[]
        for _ in range(min(16,len(m.QUEUE))):
            url=m.QUEUE.popleft();dest=output/m.local_path(url).lstrip('/')
            if dest.exists():cached+=1
            else:batch.append(url)
        def get_asset(url):
            try:return url,m.read(url),None
            except Exception as e:return url,None,str(e)
        for url,content,error in pool.map(get_asset,batch):
            if error:m.FAILURES.append({'url':url,'error':error});continue
            dest=output/m.local_path(url).lstrip('/')
            if dest.suffix=='.css':content=m.css_urls(content.decode('utf-8'),url).encode()
            if dest.suffix=='.js':
                text=content.decode('utf-8')
                for match in m.re.finditer(r'(?:from\s*|import\s*\()([\'"])(\.{1,2}/[^\'"]+)\1',text):m.asset(match[2],url)
            dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(content);downloaded+=1
        if batch:print(f'Copied {downloaded} new assets, {len(m.QUEUE)} queued',flush=True)

shutil.copytree(root/'extension/media', output/'media/plg_system_festiveoverlay', dirs_exist_ok=True)
report={'source':origin,'pages':list(pages),'page_count':len(pages),'pages_not_copied':list(page_queue),
'page_failures':failed,'new_assets':downloaded,'reused_assets':cached,'asset_failures':m.FAILURES,
'scope':'Public front-end snapshot only. Live APIs, maps, forms and embedded services are blocked except the original WeatherWidget.io forecast. Uncopied pages link to the public website.'}
(output/'mirror-report.json').write_text(json.dumps(report,indent=2)+'\n')
index=BeautifulSoup('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local Alton Ramblers pages</title></head><body><h1>Local Alton Ramblers pages</h1><p>Public page snapshots. Interactive maps, live feeds and forms may need the public website.</p><ul></ul></body></html>','html.parser')
for page,soup in pages.items():
    li=index.new_tag('li');a=index.new_tag('a',href=page_path(page));a.string=soup.title.get_text(strip=True) if soup.title else page;li.append(a);index.ul.append(li)
(output/'local-pages.html').write_text(str(index))
print(json.dumps({k:v for k,v in report.items() if k not in ('pages','pages_not_copied')},indent=2),flush=True)
