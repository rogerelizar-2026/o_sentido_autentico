#!/usr/bin/env python3
"""Gera sw.js (Service Worker) com a lista exata de arquivos do projeto
e uma versão derivada do hash do conteúdo — cache offline infalível."""
import os, json, hashlib

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {'.git', '__pycache__', 'node_modules'}
SKIP_FILES = {'sw.js', 'build-sw.py', 'fetch-fonts.py', 'icon-src.png',
              'servidor.js', 'LEIA-ME.txt'}
SKIP_EXT = ('.py', '.bat', '.command', '.zip')

def collect():
    files = []
    for dp, dn, fn in os.walk(ROOT):
        dn[:] = [d for d in dn if d not in SKIP_DIRS and not d.startswith('.')]
        for f in sorted(fn):
            if f in SKIP_FILES or f.endswith(SKIP_EXT):
                continue
            rel = os.path.relpath(os.path.join(dp, f), ROOT).replace(os.sep, '/')
            files.append(rel)
    return sorted(set(files))

def digest(files):
    h = hashlib.sha256()
    for rel in files:
        with open(os.path.join(ROOT, rel), 'rb') as fh:
            h.update(rel.encode('utf-8'))
            h.update(fh.read())
    return h.hexdigest()[:12]

def main():
    files = collect()
    ver = digest(files)
    precache = ['./'] + ['./' + f for f in files if f != 'index.html']

    lines = []
    lines.append('/* AutenticSense — Service Worker (gerado por build-sw.py) */')
    lines.append(f"const VERSION = 'osa-v{ver}';")
    lines.append('const PRECACHE = ' + json.dumps(precache, ensure_ascii=False, indent=2) + ';')
    lines.append('')
    lines.append("self.addEventListener('install', (event) => {")
    lines.append('  event.waitUntil(')
    lines.append('    caches.open(VERSION)')
    lines.append('      .then((cache) => cache.addAll(PRECACHE))')
    lines.append('      .then(() => self.skipWaiting())')
    lines.append('  );')
    lines.append('});')
    lines.append('')
    lines.append("self.addEventListener('activate', (event) => {")
    lines.append('  event.waitUntil((async () => {')
    lines.append('    const keys = await caches.keys();')
    lines.append('    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));')
    lines.append('    await self.clients.claim();')
    lines.append('  })());')
    lines.append('});')
    lines.append('')
    lines.append("self.addEventListener('fetch', (event) => {")
    lines.append('  const { request } = event;')
    lines.append("  if (request.method !== 'GET') return;")
    lines.append('  const url = new URL(request.url);')
    lines.append('  if (url.origin !== self.location.origin) return;')
    lines.append('')
    lines.append('  /* Navegações: rede primeiro, com fallback offline para o app */')
    lines.append("  if (request.mode === 'navigate') {")
    lines.append('    event.respondWith((async () => {')
    lines.append('      try {')
    lines.append('        const fresh = await fetch(request);')
    lines.append('        const cache = await caches.open(VERSION);')
    lines.append("        cache.put('./index.html', fresh.clone());")
    lines.append('        return fresh;')
    lines.append('      } catch {')
    lines.append("        const cached = await caches.match(request) || await caches.match('./index.html');")
    lines.append("        return cached || Response.error();")
    lines.append('      }')
    lines.append('    })());')
    lines.append('    return;')
    lines.append('  }')
    lines.append('')
    lines.append('  /* Estáticos: stale-while-revalidate (offline instantâneo, atualiza ao fundo) */')
    lines.append('  event.respondWith((async () => {')
    lines.append('    const cached = await caches.match(request, { ignoreSearch: true });')
    lines.append('    const updating = fetch(request).then(async (resp) => {')
    lines.append('      if (resp && resp.ok) {')
    lines.append('        const cache = await caches.open(VERSION);')
    lines.append('        cache.put(request, resp.clone());')
    lines.append('      }')
    lines.append('      return resp;')
    lines.append('    }).catch(() => undefined);')
    lines.append('    if (cached) {')
    lines.append('      event.waitUntil(updating);')
    lines.append('      return cached;')
    lines.append('    }')
    lines.append('    const resp = await updating;')
    lines.append("    return resp || Response.error();")
    lines.append('  })());')
    lines.append('});')
    lines.append('')

    out = os.path.join(ROOT, 'sw.js')
    with open(out, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))
    print(f'[sw] gerado: {len(precache)} arquivos em pré-cache · versão osa-v{ver}')

if __name__ == '__main__':
    main()
