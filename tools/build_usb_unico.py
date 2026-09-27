#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_usb_unico.py — gera páginas HTML AUTOSSUFICIENTES (um arquivo por página).

Para quem não consegue usar o .zip: cada arquivo deste build contém, dentro dele,
CSS (com as fontes), JavaScript (aplicação + dados embutidos) e imagens (logo,
mapa de aceleração, capas dos livros) como data URI. Basta baixar os arquivos
para uma mesma pasta e abrir qualquer um deles.

Pré-requisito: rodar antes `tools/build_usb.py`, que produz a pasta portátil
(dist-usb/O-Sentido-Autentico) com fontes em data URI e js/app.js empacotado.

Uso:
    python3 tools/build_usb_unico.py [--de dist-usb/O-Sentido-Autentico] [--out O-Sentido-Autentico-arquivos-unicos]
"""

from __future__ import annotations

import argparse
import base64
import mimetypes
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAGINAS = [
    "index.html",
    "hebraico-aramaico.html",
    "grego-koine.html",
    "caixa-de-ferramentas.html",
    "offline.html",
    "404.html",
    "LEIA-ME.html",
]

MIME = {
    ".svg": "image/svg+xml",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}


def data_uri(base: Path, rel: str) -> str:
    arq = (base / rel).resolve()
    mime = MIME.get(arq.suffix.lower()) or mimetypes.guess_type(str(arq))[0] or "application/octet-stream"
    b64 = base64.b64encode(arq.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def css_concatenado(base: Path, css_rel: str, vistos: set[str] | None = None) -> str:
    """Resolve @import recursivamente e devolve um único bloco de CSS."""
    vistos = vistos or set()
    p = (base / css_rel).resolve()
    if p in vistos:
        return ""
    vistos.add(p)
    texto = p.read_text(encoding="utf-8")

    def troca_import(m: "re.Match[str]") -> str:
        alvo = m.group(1)
        destino = (p.parent / alvo).resolve()
        try:
            rel = destino.relative_to(base).as_posix()
        except ValueError:
            return ""
        return css_concatenado(base, rel, vistos)

    texto = re.sub(r'@import\s+url\(["\']?([^"\')]+)["\']?\)\s*;', troca_import, texto)
    return texto


def inline_ativos(base: Path, html: str) -> tuple[str, int]:
    """Troca referências locais (css/js/imagens) por conteúdo embutido."""
    trocas = 0

    # 1. CSS agregado → <style>
    m = re.search(r'<link rel="stylesheet" href="\./css/([^"]+)">', html)
    if m:
        css = css_concatenado(base, f"css/{m.group(1)}")
        html = html.replace(m.group(0), "<style>\n" + css + "\n</style>")
        trocas += 1

    # 2. Scripts (dados embutidos + aplicação) → <script> inline, na mesma ordem
    for nome in ("js/data-portable.js", "js/app.js"):
        tag = re.compile(r'<script[^>]*src="\./' + re.escape(nome) + r'"[^>]*></script>')
        m2 = tag.search(html)
        if m2:
            codigo = (base / nome).read_text(encoding="utf-8")
            seguro = codigo.replace("</script>", "<\\/script>")
            html = html[:m2.start()] + "<script>\n" + seguro + "\n</script>" + html[m2.end():]
            trocas += 1

    # 3. Imagens locais (img src, link de ícone, og:image, etc.) → data URI
    def sub_src(m3: "re.Match[str]") -> str:
        nonlocal trocas
        rel = m3.group(2)
        if rel.startswith(("http", "data:", "#", "mailto:")):
            return m3.group(0)
        caminho = rel[2:] if rel.startswith("./") else rel
        alvo = base / caminho
        if not alvo.exists():
            return m3.group(0)
        trocas += 1
        return f'{m3.group(1)}="{data_uri(base, caminho)}"'

    html = re.sub(r'(src|href|content)="(\./(?:icons|covers|downloads)/[^"]+)"', sub_src, html)

    return html, trocas


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--de", default="dist-usb/O-Sentido-Autentico")
    ap.add_argument("--out", default="O-Sentido-Autentico-arquivos-unicos")
    args = ap.parse_args()

    base = (ROOT / args.de).resolve()
    destino = (ROOT / args.out).resolve()
    if not base.is_dir():
        raise SystemExit(f"pasta de origem ausente: {base} (rode tools/build_usb.py primeiro)")
    if destino.exists():
        shutil.rmtree(destino)
    destino.mkdir(parents=True)

    total_mb = 0.0
    for nome in PAGINAS:
        origem = base / nome
        if not origem.exists():
            print(f"  (ignorado: {nome} não existe)")
            continue
        html = origem.read_text(encoding="utf-8")
        # atenção: o LEIA-ME cita "js/app.js" como texto; detectar pela tag, não pelo texto
        tem_app = re.search(r'<script[^>]*src="\./js/app\.js"', html) is not None
        tem_css = 'rel="stylesheet" href="./css/' in html   # páginas com folha de estilo externa
        html, trocas = inline_ativos(base, html)

        # nenhum ativo local pendente?
        pendentes = re.findall(r'(?:src|href)="\./(?:css|js|icons|covers|downloads)/[^"]+"', html)
        assert not pendentes, f"{nome}: ainda referencia ativos locais: {pendentes[:3]}"
        if tem_css:
            assert "data:font/woff2;base64," in html, f"{nome}: fontes não embutidas"
        if tem_app:
            assert "window.__OSA_DATA__" in html, f"{nome}: dados não embutidos"

        saida = destino / nome
        saida.write_text(html, encoding="utf-8")
        mb = saida.stat().st_size / (1024 * 1024)
        total_mb += mb
        print(f"  {nome}: {mb:.2f} MB ({trocas} ativos embutidos)")

    # guia curto de uso
    (destino / "COMO-USAR.txt").write_text(
        "O SENTIDO AUTENTICO - ARQUIVOS SOLTOS (sem compactacao)\n"
        "======================================================\n\n"
        "Cada arquivo .html e autossuficiente: traz dentro de si o CSS, as fontes,\n"
        "o JavaScript e as imagens. Nao ha pasta css/, js/ ou covers/ para acompanhar.\n\n"
        "COMO USAR\n"
        "1) Baixe os arquivos .html para UMA MESMA PASTA (pasta nova, no pendrive ou\n"
        "   na area de trabalho).\n"
        "2) De dois cliques em index.html.\n"
        "3) A navegacao entre as paginas funciona porque os links apontam para os\n"
        "   arquivos vizinhos (hebraico-aramaico.html, grego-koine.html,\n"
        "   caixa-de-ferramentas.html). Se faltar algum, a pagina abre mas o link\n"
        "   correspondente nao encontrara o destino.\n\n"
        "ARQUIVOS\n"
        "  index.html                  Portal do Estudante (pagina de entrada)\n"
        "  hebraico-aramaico.html      Hebraico biblico e aramaico biblico\n"
        "  grego-koine.html            Grego koine\n"
        "  caixa-de-ferramentas.html   Catalogo, colecao, importar/exportar\n"
        "  offline.html                Pagina de apoio (uso quando servido por HTTP)\n"
        "  404.html                    Pagina de apoio\n"
        "  LEIA-ME.html                Instrucoes desta versao portatil\n\n"
        "O QUE MUDA NESTA VERSAO\n"
        "- Nao ha instalacao de PWA nem barra de atualizacao (file:// nao aceita\n"
        "  service worker).\n"
        "- Favoritos, colecao e preferencias ficam no armazenamento local do navegador;\n"
        "  exporte em JSON para guardar uma copia.\n"
        "- Links externos e leitura em voz alta dependem de internet e do sistema.\n\n"
        "Curadoria: Rogerio Ramo Lopes - rogerelizar@gmail.com\n"
        "Licenca: CC BY-NC-SA 4.0\n",
        encoding="utf-8",
    )

    print(f"• pronto: {destino}  ({total_mb:.2f} MB em {len(PAGINAS)} arquivos)")


if __name__ == "__main__":
    main()
