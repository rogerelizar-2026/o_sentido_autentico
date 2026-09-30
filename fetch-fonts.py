#!/usr/bin/env python3
"""Baixa as fontes Noto Serif / Noto Serif Hebrew do Google Fonts e gera css/fonts.css
com @font-face apontando para arquivos locais (requisito offline-first do PWA)."""
import os, re, ssl, urllib.request

ROOT   = os.path.dirname(os.path.abspath(__file__))
FDIR   = os.path.join(ROOT, 'assets', 'fonts')
CSSOUT = os.path.join(ROOT, 'css', 'fonts.css')
os.makedirs(FDIR, exist_ok=True)

UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}
FAMILIES = [
    ('noto-serif-hebrew', 'family=Noto+Serif+Hebrew:wght@400;600;700', {'hebrew', 'latin'}),
    ('noto-serif',        'family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400', {'latin', 'latin-ext', 'greek', 'greek-ext'}),
]
BLOCK_RE = re.compile(r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*(\{[^}]*\})")
SRC_RE   = re.compile(r"src:\s*url\((https://[^)]+)\)\s*format\('woff2'\)")
WGT_RE   = re.compile(r"font-weight:\s*(\d+)")
STY_RE   = re.compile(r"font-style:\s*(\w+)")

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=25, context=ssl.create_default_context()).read()

def main():
    out_blocks, kept = [], 0
    for slug, query, wanted in FAMILIES:
        css = fetch(f'https://fonts.googleapis.com/css2?{query}&display=swap').decode('utf-8')
        for subset, block in BLOCK_RE.findall(css):
            if subset not in wanted:
                continue
            m = SRC_RE.search(block)
            if not m:
                continue
            weight = WGT_RE.search(block).group(1)
            style  = STY_RE.search(block).group(1)
            fname  = f"{slug}-{subset}-{style}-{weight}.woff2"
            data   = fetch(m.group(1))
            with open(os.path.join(FDIR, fname), 'wb') as fh:
                fh.write(data)
            nb = SRC_RE.sub(f"src: url('../assets/fonts/{fname}') format('woff2')", block)
            out_blocks.append(f"/* {slug} · {subset} · {style} {weight} ({len(data)//1024} KB) */\n@font-face {nb}")
            kept += 1

    header = (
        "/* ==========================================================================\n"
        "   AutenticSense — Fontes locais (gerado por fetch-fonts.py)\n"
        "   Auto-hospedado para garantir funcionamento 100% offline.\n"
        "   ========================================================================== */\n"
    )
    if kept:
        with open(CSSOUT, 'w', encoding='utf-8') as fh:
            fh.write(header + '\n' + '\n\n'.join(out_blocks) + '\n')
        print(f"[fonts] OK — {kept} arquivos woff2 em assets/fonts/")
    else:
        with open(CSSOUT, 'w', encoding='utf-8') as fh:
            fh.write(header + "/* Nenhuma fonte baixada; usando pilhas de fallback do sistema. */\n")
        print("[fonts] FALHOU — fonts.css com fallback do sistema")

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:  # sem rede: segue com fallbacks
        with open(CSSOUT, 'w', encoding='utf-8') as fh:
            fh.write("/* fontes locais indisponiveis: " + str(exc).replace('\n', ' ') + " */\n")
        print('[fonts] ERRO:', exc)
