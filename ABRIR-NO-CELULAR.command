#!/bin/sh
cd "$(dirname "$0")" || exit 1
echo ""
echo "  Sentido Autentico - Servidor para Celular"
echo "  Procurando o Python..."
echo ""
for P in python3 python py; do
  if command -v "$P" >/dev/null 2>&1; then
    exec "$P" SERVIDOR-CELULAR.py
  fi
done
echo "  Python nao encontrado."
echo "  Mac: instale em https://python.org/downloads"
echo "  Linux: sudo apt install python3   (ou o gerenciador da sua distro)"
echo ""
echo "  Alternativa: envie abrir-sem-servidor.html para o celular e abra por la."
read -r _ 
