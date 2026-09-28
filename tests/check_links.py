from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import sys
ROOT=Path(__file__).resolve().parents[1]
class P(HTMLParser):
 def __init__(self): super().__init__(); self.refs=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  for k in ('href','src'):
   if k in d:self.refs.append((t,k,d[k]))
errors=[]
for f in ROOT.glob('*.html'):
 p=P(); p.feed(f.read_text())
 for t,k,r in p.refs:
  if not r or r.startswith(('#','mailto:','tel:','data:','http://','https://')): continue
  target=(f.parent/r.split('#')[0].split('?')[0]).resolve()
  if not target.exists(): errors.append(f'{f.name}: {r}')
if errors:
 print('Missing local links:\n'+'\n'.join(errors));sys.exit(1)
print('Local links: OK')
