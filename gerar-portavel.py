#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Monta abrir-sem-servidor.html — versão de ARQUIVO ÚNICO do Sentido Autêntico:
funciona com duplo clique, sem servidor (todo CSS/JS embutido).
Pré-requisito: executar o esbuild antes (gera .build/bundle.js)."""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
CSS_FILES = [
    'css/tokens.css', 'css/fonts.css', 'css/base.css',
    'css/layout.css', 'css/components.css', 'css/content.css'
]

def ler(p):
    with open(os.path.join(ROOT, p), encoding='utf-8') as fh:
        return fh.read()

def main():
    html = ler('index.html')

    # CSS inline; fontes: url('../assets/..') -> url('assets/..')
    # (os caminhos agora são relativos ao próprio documento, na raiz)
    estilos = []
    for f in CSS_FILES:
        css = ler(f).replace('../assets/', 'assets/')
        estilos.append(f'/* ===== {f} ===== */\n{css}')
    bloco_css = '<style>\n' + '\n\n'.join(estilos) + '\n</style>'

    html = re.sub(r'\s*<link rel="stylesheet" href="css/[^"]+">', '', html)
    html = html.replace('</head>', bloco_css + '\n</head>')

    # Remove o <script type="module"> e injeta o bundle IIFE no fim do body
    html = re.sub(r'\s*<script type="module" src="\./js/app\.js"></script>', '', html)
    bundle = ler(os.path.join('.build', 'bundle.js'))
    inj = ('\n<script>\n/* ===== Sentido Autêntico · bundle standalone (gerado automaticamente) ===== */\n'
           + bundle + '\n</script>\n</body>')
    html = html.replace('</body>', inj)

    destino = os.path.join(ROOT, 'abrir-sem-servidor.html')
    with open(destino, 'w', encoding='utf-8') as fh:
        fh.write(html)
    print(f'[portátil] abrir-sem-servidor.html gerado ({len(html)//1024} KB)')

if __name__ == '__main__':
    main()
