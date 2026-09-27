#!/usr/bin/env bash
# Prepare o repositório Git do "O Sentido Autêntico" e mostre os comandos de publicação.
# Uso: ./tools/publicar-github.sh [rogerelizar-2026] [AutenticSense-Free]
# (os padrões já apontam para o repositório real; passe argumentos só para outro destino)
# Nada é enviado sem a sua autenticação: este script apenas inicializa o Git,
# faz o primeiro commit e imprime os comandos de remote/push.
set -euo pipefail

USUARIO="${1:-rogerelizar-2026}"
REPO="${2:-AutenticSense-Free}"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"

cd "$RAIZ"

if [ ! -d .git ]; then
  echo "• git init -b main"
  git init -b main >/dev/null
fi

echo "• adicionando arquivos (respeitando .gitignore)"
git add -A

if git diff --cached --quiet; then
  echo "• nada novo para commitar"
else
  git -c user.name="$(git config user.name || echo 'Curadoria O Sentido Autêntico')" \
      -c user.email="$(git config user.email || echo 'rogerelizar@gmail.com')" \
      commit -m "Publica o portal O Sentido Autêntico — 1ª versão" >/dev/null
  echo "• commit criado"
fi

echo
echo "Arquivos que serão enviados: $(git ls-files | wc -l)"
echo "Ignorados corretamente:      $( [ -d node_modules ] && echo ok ) node_modules/, dist-usb/, *.zip"
echo
cat <<FIM
Próximos passos (execute você mesmo, com a sua conta):

  git remote add origin https://github.com/${USUARIO}/${REPO}.git
  git push -u origin main

Depois, no GitHub:
  1. Settings -> Pages -> Source: "GitHub Actions"
  2. Actions -> acompanhe o workflow "Publicar no GitHub Pages"
  3. O endereço final fica em https://${USUARIO}.github.io/${REPO}/

Detalhes e rotas alternativas (GitHub Desktop e envio pelo navegador):
  docs/PUBLICAR-GITHUB.md
FIM
