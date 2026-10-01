#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sentido Autentico — Servidor para CELULAR (Android / iOS)
=====================================================
Publica o portal na sua rede Wi-Fi e mostra um QR Code na tela.
Aponte a câmera do celular para o QR e o Sentido Autentico abre no aparelho.

Requisitos: apenas Python 3 (nenhuma biblioteca precisa ser instalada).
Uso:        python3 SERVIDOR-CELULAR.py
Encerrar:   Ctrl + C
"""

import http.server
import io
import os
import socket
import socketserver
import sys
import threading

RAIZ = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(RAIZ, 'mobile', 'vendor'))

PORTA_INICIAL = 8080
PORTA_FINAL = 8095

V = '\033[92m'; A = '\033[93m'; C = '\033[96m'; N = '\033[0m'; B = '\033[1m'
if os.name == 'nt' and not os.environ.get('WT_SESSION'):
    try:
        import ctypes
        ctypes.windll.kernel32.SetConsoleMode(
            ctypes.windll.kernel32.GetStdHandle(-11), 7)
    except Exception:
        V = A = C = N = B = ''


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.json': 'application/json',
        '.webmanifest': 'application/manifest+json',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
        '.ttf': 'font/ttf',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.css': 'text/css',
        '.html': 'text/html',
        '.pdf': 'application/pdf',
    }

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=RAIZ, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Service-Worker-Allowed', '/')
        # permite que o celular carregue tudo sem bloqueio de origem
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, fmt, *args):
        if '404' in (fmt % args):
            sys.stderr.write(f'  {A}404{N} {args[0] if args else ""}\n')


def ip_da_rede():
    """Descobre o IP desta máquina na rede local (não conecta de fato)."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            ip = '127.0.0.1'
    finally:
        s.close()
    return ip


def porta_livre():
    for p in range(PORTA_INICIAL, PORTA_FINAL + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(('0.0.0.0', p))
                return p
            except OSError:
                continue
    return None


def mostrar_qr(url):
    try:
        import qrcode
        q = qrcode.QRCode(border=2, error_correction=qrcode.constants.ERROR_CORRECT_M)
        q.add_data(url)
        q.make(fit=True)
        buf = io.StringIO()
        q.print_ascii(out=buf, invert=True)
        print(buf.getvalue())
        return True
    except Exception as e:
        print(f'  {A}(QR Code indisponivel: {e}){N}')
        print(f'  Digite o endereco manualmente no navegador do celular.\n')
        return False


class Servidor(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    os.chdir(RAIZ)

    if not os.path.exists(os.path.join(RAIZ, 'index.html')):
        print(f'{A}ERRO:{N} index.html nao encontrado. '
              f'Rode este arquivo de dentro da pasta Sentido Autentico.')
        input('\nPressione ENTER para sair...')
        return 1

    porta = porta_livre()
    if porta is None:
        print(f'{A}ERRO:{N} nenhuma porta livre entre '
              f'{PORTA_INICIAL} e {PORTA_FINAL}.')
        input('\nPressione ENTER para sair...')
        return 1

    ip = ip_da_rede()
    url = f'http://{ip}:{porta}'

    print()
    print(f'{B}{V}  ╔════════════════════════════════════════════════════╗{N}')
    print(f'{B}{V}  ║   Sentido Autentico — O Sentido Autentico              ║{N}')
    print(f'{B}{V}  ║   Servidor para CELULAR                            ║{N}')
    print(f'{B}{V}  ╚════════════════════════════════════════════════════╝{N}')
    print()
    print(f'  {B}1.{N} Conecte o celular no {B}mesmo Wi-Fi{N} deste computador.')
    print(f'  {B}2.{N} Aponte a camera do celular para o QR Code abaixo.')
    print(f'  {B}3.{N} Toque no aviso que aparece para abrir no navegador.')
    print()

    mostrar_qr(url)

    print(f'  Endereco: {B}{C}{url}{N}')
    print(f'  (se o QR nao funcionar, digite esse endereco no navegador do celular)')
    print()
    print(f'  {B}Para INSTALAR como aplicativo:{N}')
    print(f'    Android (Chrome) . menu ⋮  >  "Instalar aplicativo"')
    print(f'    iPhone  (Safari) . Compartilhar  >  "Adicionar a Tela de Inicio"')
    print()
    print(f'  {A}Atencao:{N} por Wi-Fi (sem HTTPS) o iPhone adiciona o atalho, mas o')
    print(f'  modo 100% offline so funciona publicando o site em HTTPS')
    print(f'  (veja a pasta {B}mobile/{N} e o arquivo {B}COMO-PUBLICAR-HTTPS.txt{N}),')
    print(f'  ou use o arquivo {B}abrir-sem-servidor.html{N} enviado para o celular.')
    print()
    print(f'  {V}Servidor no ar.{N} Pressione {B}Ctrl + C{N} para encerrar.')
    print(f'  {"-" * 54}')

    try:
        with Servidor(('0.0.0.0', porta), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f'\n  {V}Servidor encerrado. Ate a proxima!{N}\n')
    except OSError as e:
        print(f'\n{A}ERRO ao iniciar o servidor:{N} {e}')
        input('\nPressione ENTER para sair...')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
