#!/bin/sh
# Sentido Autentico — servidor local para macOS e Linux (duplo clique).
# Se o Mac bloquear: clique com o botao direito > "Abrir" > "Abrir".
cd "$(dirname "$0")" || exit 1

echo "=========================================================="
echo "   Sentido Autentico - by rogerelizar  (servidor local)"
echo "=========================================================="
echo "   Nao feche esta janela enquanto estiver usando o portal."
echo "   Procurando Python ou Node.js no seu computador..."
echo

if command -v python3 >/dev/null 2>&1; then
  exec python3 servidor.py
elif command -v python >/dev/null 2>&1; then
  exec python servidor.py
elif command -v node >/dev/null 2>&1; then
  exec node servidor.js
fi

echo "  Nao encontrei Python nem Node.js instalados nesta maquina."
echo
echo "  OPCAO 1 (recomendada, 100% gratis):"
echo "     Instale o Python 3 em  https://www.python.org/downloads/"
echo "     e clique 2x neste arquivo de novo."
echo
echo "  OPCAO 2 (sem instalar nada):"
echo "     Abrindo a versao simplificada abrir-sem-servidor.html ..."
echo
if command -v open >/dev/null 2>&1; then
  open abrir-sem-servidor.html
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open abrir-sem-servidor.html
else
  echo "  Abra o arquivo abrir-sem-servidor.html com dois cliques."
fi
