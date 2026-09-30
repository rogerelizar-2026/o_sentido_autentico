#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_usb.py — gera a versão PORTÁTIL do "O Sentido Autêntico" para pendrive.

Motivação técnica (honesta):
  - O site original usa <script type="module">. Navegadores bloqueiam módulos ES
    carregados por file:// (erro de CORS do esquema file), então abrir
    index.html direto do pendrive daria tela sem JavaScript.
  - O catálogo e os gráficos fazem fetch() de ./data/*.json, também bloqueado
    em file://.
  Solução: neste build os módulos são empacotados em UM arquivo clássico
  (js/app.js, IIFE, gerado por esbuild) e os dados JSON são embutidos por um
  script clássico (js/data-portable.js), que define window.__OSA_DATA__.
  Os módulos originais (ESM) permanecem em js/fonte/ apenas como referência.

Saída: dist-usb/O-Sentido-Autentico/  (+ .zip pronto para cópia em pendrive)

Uso:
    python3 tools/build_usb.py [--out dist-usb] [--zip]
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOME = "O-Sentido-Autentico"

# Páginas HTML do sistema (raiz do repositório)
PAGINAS = [
    "index.html",
    "hebraico-aramaico.html",
    "grego-koine.html",
    "caixa-de-ferramentas.html",
    "offline.html",
    "404.html",
]

DIRS = ["css", "js", "icons", "fonts", "covers", "data", "docs", "downloads", "screenshots"]

# Arquivos de desenvolvimento que NÃO vão para o pendrive
EXCLUIR_JS = {"main.js"}  # substituído pelo bundle; originais copiados em js/fonte/

LEIA_ME = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Leia-me — O Sentido Autêntico (versão portátil para pendrive)</title>
<style>
  :root {{ color-scheme: light; }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; padding: 24px 18px 64px;
    font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #1d2320; background: #f7f5ef;
  }}
  main {{ max-width: 780px; margin: 0 auto; }}
  h1 {{ font-size: 1.6rem; line-height: 1.25; margin: 0 0 4px; color: #14452f; }}
  h2 {{ font-size: 1.15rem; margin: 28px 0 8px; color: #14452f; }}
  p, li {{ max-width: 68ch; }}
  .sub {{ color: #5a6459; margin-top: 0; }}
  .card {{ background: #fff; border: 1px solid #dcd8cc; border-radius: 14px; padding: 16px 18px; margin: 14px 0; }}
  .passo {{ font-weight: 700; }}
  code, kbd {{ background: #ecebe4; border-radius: 6px; padding: 1px 6px; font-size: 0.95em; }}
  ul {{ padding-left: 20px; }}
  .ok {{ color: #14452f; font-weight: 600; }}
  .aviso {{ border-left: 4px solid #b08d2b; background: #fffdf5; }}
  footer {{ margin-top: 36px; font-size: 0.9rem; color: #5a6459; border-top: 1px solid #dcd8cc; padding-top: 12px; }}
  a {{ color: #14452f; }}
</style>
</head>
<body>
<main>
  <h1>O Sentido Autêntico — versão portátil</h1>
  <p class="sub">Portal de estudos em hebraico bíblico, aramaico bíblico e grego koiné. Esta cópia roda direto do pendrive, sem internet e sem instalar nada.</p>

  <div class="card">
    <p class="passo">1. Como abrir</p>
    <ul>
      <li>Dê dois cliques em <code>index.html</code> (ou clique com o botão direito → “Abrir com” → seu navegador).</li>
      <li>Navegadores recomendados: Chrome, Edge ou Firefox atualizados.</li>
      <li>Se preferir endereço <code>http://</code>, use um dos atalhos da pasta: <code>iniciar-servidor-local.bat</code> (Windows), <code>iniciar-servidor-local.command</code> (macOS) ou <code>iniciar-servidor-local.sh</code> (Linux). Eles usam o Python já instalado; se o Python não existir, continue pelo <code>index.html</code> mesmo.</li>
    </ul>
  </div>

  <div class="card">
    <p class="passo">2. O que funciona igual ao site publicado</p>
    <ul>
      <li>As 4 páginas (Portal, Hebraico/Aramaico, Grego Koiné, Ferramentas) com sidebar, sumário, links profundos e busca interna.</li>
      <li>Catálogo com busca sem acento, filtros, favoritos, <strong>Minha coleção</strong>, adicionar/editar/excluir recursos.</li>
      <li>Importar e exportar JSON (limite 512 KB) e exportação em PDF pelo diálogo de impressão.</li>
      <li>Currículos em 5 níveis, 25 métodos com estimativas editoriais, gráficos e tabelas, prompts de IA, guias de Anki.</li>
      <li>Tema claro/escuro, botão de acessibilidade, leitura em voz alta (quando o navegador oferece vozes).</li>
      <li>Termos de uso, com o texto de licença <strong>CC BY-NC-SA 4.0</strong>.</li>
    </ul>
  </div>

  <div class="card aviso">
    <p class="passo">3. O que muda por não haver servidor</p>
    <ul>
      <li><strong>Sem instalação de PWA:</strong> o registro do service worker é recusado pelo navegador em endereços <code>file://</code>. A opção “Instalar aplicativo” e a barra “Nova versão disponível” não aparecem. A página <code>offline.html</code> continua no pacote, mas só é usada quando o site é servido por HTTP.</li>
      <li><strong>Favoritos, coleção e preferências</strong> ficam no <code>localStorage</code> do navegador, associado ao endereço <code>file://</code>. Isso funciona em Chrome/Edge e Firefox; alguns navegadores ou perfis com bloqueio de armazenamento local podem não guardar os dados entre sessões. Para não perder nada, use <em>Exportar JSON</em> de vez em quando e guarde o arquivo no próprio pendrive.</li>
      <li><strong>Links externos</strong> (sites de editoras, buscadores de recursos) precisam de internet; abrem em nova aba.</li>
      <li><strong>Leitura em voz alta</strong> depende das vozes instaladas no sistema operacional.</li>
      <li><strong>Tipografia:</strong> as fontes (Inter, Cinzel, Noto Serif Hebrew, Noto Serif — latim, grego básico e grego politônico — e OpenDyslexic) vão embutidas no CSS como <em>data URI</em>, porque navegadores recusam carregar arquivos de fonte por <code>file://</code>. Assim o hebraico com niqqud e o grego politônico aparecem corretos mesmo sem servidor.</li>
    </ul>
  </div>

  <div class="card">
    <p class="passo">4. Estrutura da pasta</p>
    <ul>
      <li><code>index.html</code> e demais páginas — o sistema.</li>
      <li><code>css/</code>, <code>fonts/</code>, <code>icons/</code>, <code>covers/</code> — estilos, tipografia, ícones e capas dos livros.</li>
      <li><code>js/app.js</code> — aplicação empacotada para funcionar em <code>file://</code>.</li>
      <li><code>js/data-portable.js</code> — catálogo e métodos embutidos (sem <code>fetch</code>).</li>
      <li><code>js/fonte/</code> — os módulos originais (ESM), apenas para leitura/auditoria; não são carregados.</li>
      <li><code>data/</code> — os mesmos dados em JSON puro, para reuso e backup.</li>
      <li><code>docs/</code> — documentação do projeto (design system, acessibilidade, desempenho, plano, limitações).</li>
      <li><code>screenshots/</code> — capturas rotuladas das telas principais.</li>
      <li><code>LEIA-ME.html</code> — esta página.</li>
    </ul>
  </div>

  <div class="card">
    <p class="passo">5. Cuidados com o pendrive</p>
    <ul>
      <li>Mantenha a estrutura de pastas como está: os links são relativos.</li>
      <li>Não renomeie <code>index.html</code>; é o arquivo de entrada.</li>
      <li>Copiar a pasta inteira para outro computador continua funcionando.</li>
    </ul>
  </div>

  <footer>
    <p><strong>Curadoria:</strong> Idealizador e Curador do Projeto: Rogério Ramão Lopes — rogerelizar@gmail.com</p>
    <p>Conteúdo sob licença <strong>Creative Commons Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional (CC BY-NC-SA 4.0)</strong>.</p>
    <p>Estimativas editoriais dos métodos: setembro de 2026. Versão portátil gerada em {data}.</p>
  </footer>
</main>
</body>
</html>
"""

BAT = """@echo off
rem Inicia um servidor local (opcional) e abre o portal no navegador padrao.
cd /d "%~dp0"
set PORT=4173
where py >nul 2>nul && (start "" http://127.0.0.1:%PORT%/index.html & py -m http.server %PORT% & goto :eof)
where python >nul 2>nul && (start "" http://127.0.0.1:%PORT%/index.html & python -m http.server %PORT% & goto :eof)
echo Python nao encontrado. Abrindo index.html diretamente...
start "" "index.html"
"""

SH = """#!/usr/bin/env sh
# Inicia um servidor local (opcional) e abre o portal no navegador padrao.
cd "$(dirname "$0")" || exit 1
PORT=4173
if command -v python3 >/dev/null 2>&1; then PY=python3
elif command -v python >/dev/null 2>&1; then PY=python
else
  echo "Python nao encontrado. Abra index.html diretamente no navegador."
  exit 0
fi
( sleep 1; command -v xdg-open >/dev/null 2>&1 && xdg-open "http://127.0.0.1:$PORT/index.html"; \\
  command -v open >/dev/null 2>&1 && open "http://127.0.0.1:$PORT/index.html" ) &
exec "$PY" -m http.server "$PORT" --bind 127.0.0.1
"""


def copiar_arvore(destino: Path) -> None:
    """Copia páginas, diretórios e ativos, ignorando arquivos de desenvolvimento."""
    for nome in PAGINAS:
        src = ROOT / nome
        if src.exists():
            shutil.copy2(src, destino / nome)

    for d in DIRS:
        src = ROOT / d
        if not src.is_dir():
            continue
        out = destino / d
        out.mkdir(parents=True, exist_ok=True)
        for item in src.iterdir():
            if item.is_file():
                shutil.copy2(item, out / item.name)
            elif item.is_dir():
                shutil.copytree(item, out / item.name, dirs_exist_ok=True)

    # módulos originais preservados para auditoria
    fonte = destino / "js" / "fonte"
    fonte.mkdir(parents=True, exist_ok=True)
    for item in (ROOT / "js").glob("*.js"):
        if item.name in EXCLUIR_JS or item.name == "app.js":
            continue
        shutil.copy2(item, fonte / item.name)

    # remove artefatos que dependem de servidor HTTP
    for alvo in ("sw.js", "manifest.webmanifest", "sitemap.xml"):
        p = destino / alvo
        if p.exists():
            p.unlink()


def gerar_dados_embutidos(destino: Path) -> None:
    recursos = json.loads((ROOT / "data" / "recursos.json").read_text(encoding="utf-8"))
    metodos = json.loads((ROOT / "data" / "metodos.json").read_text(encoding="utf-8"))
    payload = {"recursos": recursos, "metodos": metodos}
    js = (
        "/* Gerado por tools/build_usb.py — dados embutidos para uso em file:// (pendrive).\n"
        "   Fonte: data/recursos.json e data/metodos.json. Não editar à mão. */\n"
        "window.__OSA_DATA__ = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    (destino / "js" / "data-portable.js").write_text(js, encoding="utf-8")


def embutir_fontes(destino: Path) -> None:
    """Substitui as referências a ../fonts/*.woff2 por data URIs.

    Motivo: em file:// o Chromium recusa carregar fontes via CORS
    ("Access to font ... blocked by CORS policy", origem 'null'). Com data URI
    a tipografia — inclusive hebraico com niqqud e grego politônico — carrega.
    """
    import base64
    import re

    css = destino / "css" / "fonts.css"
    texto = css.read_text(encoding="utf-8")
    usados = set()

    def sub(m: "re.Match[str]") -> str:
        rel = m.group(1)
        arq = (destino / "css" / rel).resolve()
        if not arq.exists():
            return m.group(0)
        b64 = base64.b64encode(arq.read_bytes()).decode("ascii")
        usados.add(arq.name)
        return f'url("data:font/woff2;base64,{b64}")'

    novo = re.sub(r'url\("(\.\./fonts/[^"]+\.woff2)"\)', sub, texto)
    assert "data:font/woff2;base64," in novo, "nenhuma fonte embutida"
    css.write_text(novo, encoding="utf-8")
    kb = css.stat().st_size / 1024
    print(f"  css/fonts.css com fontes embutidas: {kb:.0f} KB ({len(usados)} arquivos)")


def empacotar_js(destino: Path) -> None:
    cmd = [
        "npx", "--yes", "esbuild@0.24.0",
        "js/main.js",
        "--bundle",
        "--format=iife",
        "--target=es2019",
        "--legal-comments=none",
        f"--outfile={destino / 'js' / 'app.js'}",
        "--banner:js=/* O Sentido Autêntico — pacote único gerado por tools/build_usb.py (esbuild) para execução a partir de file:// */",
    ]
    print("• esbuild:", " ".join(cmd[:6]), "…")
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout)
        print(r.stderr, file=sys.stderr)
        raise SystemExit("falha ao empacotar o JavaScript")
    kb = (destino / "js" / "app.js").stat().st_size / 1024
    print(f"  js/app.js: {kb:.0f} KB")


def reescrever_paginas(destino: Path) -> None:
    """Troca o módulo ESM pelo par de scripts clássicos e remove o manifest."""
    trocado = 0
    for nome in PAGINAS:
        p = destino / nome
        if not p.exists():
            continue
        s = p.read_text(encoding="utf-8")
        orig = s
        s = s.replace(
            '<script type="module" src="./js/main.js"></script>',
            '<script src="./js/data-portable.js"></script>\n'
            '  <script defer src="./js/app.js"></script>',
        )
        # manifest/PWA não se aplica a file: — evita aviso de console
        s = "\n".join(l for l in s.splitlines() if 'rel="manifest"' not in l and 'href="./sw.js"' not in l)
        # preloads de fonte: as fontes agora vão embutidas no CSS como data URI,
        # e o preload de arquivo woff2 em file:// gera erro de CORS no console.
        s = "\n".join(l for l in s.splitlines() if 'rel="preload"' not in l or 'as="font"' not in l)
        if s != orig:
            p.write_text(s, encoding="utf-8")
            trocado += 1
    print(f"  páginas ajustadas: {trocado}")


def escrever_leitores(destino: Path) -> None:
    import datetime
    data = datetime.date.today().strftime("%d/%m/%Y")
    (destino / "LEIA-ME.html").write_text(LEIA_ME.format(data=data), encoding="utf-8")
    (destino / "iniciar-servidor-local.bat").write_text(BAT, encoding="utf-8", newline="\r\n")
    for nome in ("iniciar-servidor-local.sh", "iniciar-servidor-local.command"):
        f = destino / nome
        f.write_text(SH, encoding="utf-8")
        f.chmod(0o755)

    (destino / "LEIA-ME.txt").write_text(
        "O SENTIDO AUTENTICO - VERSAO PORTATIL PARA PENDRIVE\n"
        "====================================================\n\n"
        "COMO USAR\n"
        "1) De dois cliques em index.html (Chrome, Edge ou Firefox).\n"
        "2) Opcional: use iniciar-servidor-local.bat (Windows) ou .command (macOS)\n"
        "   para rodar em http://127.0.0.1:4173 via Python.\n\n"
        "RESUMO DO QUE MUDA SEM SERVIDOR\n"
        "- Instalacao de PWA e barra de atualizacao nao aparecem (file:// nao aceita\n"
        "  service worker).\n"
        "- Favoritos, colecao e preferencias ficam no armazenamento local do navegador.\n"
        "  Use \"Exportar JSON\" para guardar uma copia no pendrive.\n"
        "- Links externos precisam de internet.\n"
        "- As fontes vao embutidas no css/fonts.css (data URI) para funcionarem em file://.\n\n"
        "Detalhes completos em LEIA-ME.html.\n\n"
        "Curadoria: Rogerio Ramão Lopes - rogerelizar@gmail.com\n"
        "Licenca: CC BY-NC-SA 4.0\n",
        encoding="utf-8",
    )


def compactar(destino: Path, zip_path: Path) -> None:
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for f in sorted(destino.rglob("*")):
            if f.is_file():
                z.write(f, Path(NOME) / f.relative_to(destino))
    mb = zip_path.stat().st_size / (1024 * 1024)
    print(f"• ZIP: {zip_path}  ({mb:.2f} MB)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="dist-usb")
    ap.add_argument("--zip", action="store_true", help="gera também o .zip")
    args = ap.parse_args()

    destino = (ROOT / args.out / NOME).resolve()
    if destino.exists():
        shutil.rmtree(destino)
    destino.mkdir(parents=True)

    print("• copiando sistema…")
    copiar_arvore(destino)
    gerar_dados_embutidos(destino)
    embutir_fontes(destino)
    empacotar_js(destino)
    reescrever_paginas(destino)
    escrever_leitores(destino)

    # checagens de integridade mínimas
    faltando = [n for n in PAGINAS if not (destino / n).exists()]
    assert not faltando, f"páginas ausentes: {faltando}"
    assert (destino / "js" / "app.js").stat().st_size > 20000, "bundle suspeito (pequeno)"
    assert 'type="module"' not in (destino / "index.html").read_text(encoding="utf-8"), \
        "ainda há módulo ESM no index"
    assert 'data:font/woff2;base64,' in (destino / "css" / "fonts.css").read_text(encoding="utf-8"), \
        "fontes não embutidas no CSS"
    assert "window.__OSA_DATA__" in (destino / "js" / "data-portable.js").read_text(encoding="utf-8"), \
        "dados embutidos ausentes"
    print("• integridade OK")

    if args.zip:
        compactar(destino, (ROOT / args.out / f"{NOME}-pendrive.zip").resolve())
    print("• pronto:", destino)


if __name__ == "__main__":
    main()
