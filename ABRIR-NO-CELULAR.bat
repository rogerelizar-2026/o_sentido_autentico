@echo off
chcp 65001 >nul
title Sentido Autentico - Abrir no Celular
cd /d "%~dp0"
echo.
echo   Sentido Autentico - Servidor para Celular
echo   Procurando o Python...
echo.
py -3 SERVIDOR-CELULAR.py 2>nul && goto :fim
python3 SERVIDOR-CELULAR.py 2>nul && goto :fim
python SERVIDOR-CELULAR.py 2>nul && goto :fim
echo.
echo   Python nao encontrado neste computador.
echo.
echo   Opcao A - instale o Python (gratis) em https://python.org/downloads
echo             MARQUE a caixa "Add python.exe to PATH" durante a instalacao.
echo.
echo   Opcao B - envie o arquivo abrir-sem-servidor.html para o seu celular
echo             (WhatsApp, e-mail, cabo USB) e abra ele por la.
echo.
pause
:fim
