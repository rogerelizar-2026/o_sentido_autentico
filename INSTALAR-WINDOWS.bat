@echo off
chcp 65001 >nul 2>&1
setlocal
title AutenticSense - Servidor Local
cd /d "%~dp0"

echo ==========================================================
echo   AutenticSense - O Sentido Autentico  (servidor local)
echo ==========================================================
echo   NAO feche esta janela enquanto estiver usando o portal.
echo   Procurando Python ou Node.js no seu computador...
echo.

where py >nul 2>nul && ( py -3 servidor.py & goto :fim )
where python3 >nul 2>nul && ( python3 servidor.py & goto :fim )
where python >nul 2>nul && ( python servidor.py & goto :fim )
where node >nul 2>nul && ( node servidor.js & goto :fim )

echo  NAO encontrei Python nem Node.js instalados neste computador.
echo.
echo  OPCAO 1 (recomendada, 100%% gratis):
echo     Instale o Python 3 em  https://www.python.org/downloads/
echo     (marque a caixa "Add python.exe to PATH") e clique 2x
echo     neste arquivo de novo.
echo.
echo  OPCAO 2 (sem instalar nada):
echo     Vou abrir a versao simplificada "abrir-sem-servidor.html",
echo     que funciona direto no navegador com dois cliques.
echo.
echo  Abrindo a versao simplificada em 5 segundos...
timeout /t 5 /nobreak >nul
start "" "abrir-sem-servidor.html"

:fim
pause
