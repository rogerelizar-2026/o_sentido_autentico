#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AutenticSense — servidor local (zero dependências).
Basta ter o Python 3 instalado.  Uso:  python servidor.py
O site abre sozinho no navegador. Para encerrar, feche esta janela
ou pressione Ctrl+C.
"""
import functools
import http.server
import os
import socketserver
import sys
import threading
import webbrowser

PORTAS = range(8080, 8096)

MIME_EXTRA = {
    '.webmanifest': 'application/manifest+json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
}

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, **MIME_EXTRA}

    def log_message(self, fmt, *args):
        pass  # console limpo para o usuário leigo

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

class Servidor(socketserver.TCPServer):
    allow_reuse_address = True

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    for porta in PORTAS:
        try:
            httpd = Servidor(('', porta), Handler)
        except OSError:
            continue  # porta ocupada: tenta a próxima
        url = f'http://localhost:{porta}/index.html'
        print('=' * 56)
        print('   AutenticSense — O Sentido Autêntico')
        print('=' * 56)
        print(f'   Servidor local ATIVO em:  {url}')
        print('   O navegador vai abrir automaticamente.')
        print('   Para ENCERRAR: feche esta janela ou pressione Ctrl+C.')
        print('=' * 56)
        threading.Timer(1.2, lambda: webbrowser.open(url)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n   Servidor encerrado. Até a próxima leitura!')
        finally:
            httpd.server_close()
        return
    print(f'   ERRO: nenhuma porta livre entre {PORTAS.start} e {PORTAS.stop - 1}.')
    print('   Feche outros programas de servidor local e tente novamente.')
    sys.exit(1)

if __name__ == '__main__':
    main()
