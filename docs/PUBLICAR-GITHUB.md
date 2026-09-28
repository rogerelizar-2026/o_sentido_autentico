# Publicar o projeto no GitHub (e no GitHub Pages)

Guia do dono do projeto, em pt-BR. Três caminhos — escolha o mais confortável.
Nenhum deles exige que você envie senha, token ou qualquer credencial para outra
pessoa: a autenticação acontece na sua máquina ou no próprio site do GitHub.

> **Por que não dá para fazer de dentro do Arena.AI:** o Arena não oferece
> conector de GitHub nesta conversa, e publicar exige a sua autenticação —
> credencial que não deve trafegar no chat. Por isso o repositório foi preparado
> aqui e a publicação é feita por você em poucos passos.

---

## O que já está pronto no repositório

| Arquivo | Para que serve |
|---|---|
| `LICENSE` | Texto oficial da **CC BY-NC-SA 4.0** (obtido de creativecommons.org), com o aviso de atribuição do curador |
| `.gitignore` | Evita subir `node_modules/`, `test-results/` e os pacotes gerados (`dist-usb/`, `.zip`) |
| `.nojekyll` | Impede o GitHub Pages de processar os arquivos com Jekyll (mantém `docs/`, `_*` e afins intactos) |
| `.github/workflows/pages.yml` | Publica o site automaticamente a cada `push` na `main` |
| `README.md` | Visão geral, comandos de teste e dados de curadoria |
| `docs/` | Design system, acessibilidade, desempenho, matriz de cobertura, limitações e este guia |

---

## Caminho A — GitHub Desktop (sem terminal, recomendado)

1. Instale o **GitHub Desktop** (desktop.github.com) e faça login na sua conta.
2. Menu **File → Add local repository…** e aponte para a pasta
   `O-Sentido-Autentico-repositorio` que você baixou.
   - Se ele avisar que não é um repositório Git, clique em **"create a repository"**.
   - O repositório já existe: **rogerelizar-2026/o_sentido_autentico**. Se for publicar por este caminho,
     configure o remote para `https://github.com/rogerelizar-2026/o_sentido_autentico.git`. Deixe a opção de `README`
     **desmarcada** — o projeto já tem um.
3. Confira a lista de arquivos na aba **Changes** (não deve aparecer
   `node_modules`, `dist-usb` nem `*.zip`) e escreva a mensagem do primeiro
   commit, por exemplo: `Publica o portal O Sentido Autêntico — 1ª versão`.
4. Clique em **Commit to main** e depois em **Publish repository**.
   - Marque **Private** se quiser o repositório fechado — o Pages funciona nos
     dois casos (em conta gratuita, Pages de repositório privado é permitido com
     o workflow de Actions).

## Caminho B — Terminal (Git já instalado)

```bash
cd O-Sentido-Autentico-repositorio
git init -b main
git add -A
git commit -m "Publica o portal O Sentido Autêntico — 1ª versão"

# crie o repositório vazio no GitHub (sem README/gitignore) e então:
git remote add origin https://github.com/rogerelizar-2026/o_sentido_autentico.git
git push -u origin main
```

Também existe `tools/publicar-github.sh`, que faz `git init`, o primeiro commit e
imprime os comandos do `remote`/`push` já com o seu usuário preenchido:

```bash
./tools/publicar-github.sh
```

## Caminho C — Enviar pelo navegador (sem instalar nada)

1. O repositório **o_sentido_autentico** já está criado e vazio — abra-o em github.com.
2. Na página do repositório, clique em **uploading an existing file**.
3. Arraste **o conteúdo** da pasta (não a pasta em si) e clique em **Commit changes**.
   - O envio aceita até 100 arquivos por vez; o repositório tem **123 arquivos**.
     Faça em duas levas: (1) páginas, `css/`, `js/`, `data/`, `icons/`,
     `fonts/`, `covers/`, `downloads/`, `manifest.webmanifest`, `sw.js`,
     `sitemap.xml`, `404.html`, `offline.html`; (2) `docs/`, `screenshots/`,
     `tests/`, `tools/`, `README.md`, `LICENSE`, `package.json`,
     `package-lock.json`, `playwright.config.mjs`.
   - Arquivos começando com ponto (`.gitignore`, `.nojekyll`, `.github/`) podem
     não aparecer no seletor do Windows; nesse caso use o Caminho A ou B.

---

## Ligar o GitHub Pages (depois do primeiro push)

1. No repositório: **Settings → Pages**.
2. Em **Source**, escolha **GitHub Actions** (não "Deploy from a branch").
3. Volte em **Actions** e acompanhe o workflow *Publicar no GitHub Pages*.
   Ao terminar, o endereço aparece em **Settings → Pages**:
   `https://rogerelizar-2026.github.io/o_sentido_autentico/`.

### Antes de divulgar o endereço

- **URLs absolutas já preenchidas** (24/09/2026) com o endereço real —
  `https://rogerelizar-2026.github.io/o_sentido_autentico/` — em `og:url` (quatro páginas de conteúdo), `sitemap.xml` e
  `package.json` (`homepage`). Os `<link rel="canonical">` são relativos
  (`./pagina.html`) e acompanham qualquer endereço automaticamente. Um teste
  automatizado falha se os três saírem de sincronia.
- **Se você renomear o repositório ou usar domínio próprio:** troque a base nesses
  três lugares (e, se for domínio próprio, no comentário de
  `.github/workflows/pages.yml`).
- **Manifesto PWA**: `manifest.webmanifest` já usa caminhos relativos e funciona
  no subdiretório; se mudar o nome do repositório, não é preciso alterar nada.
- **Service worker**: só é registrado em HTTPS ou `localhost` — no Pages ele
  passa a valer, com a barra "Nova versão disponível" nas atualizações.

## Alternativa: outra hospedagem estática

Como o site não tem etapa de build, qualquer hospedagem estática serve:
Netlify, Cloudflare Pages, Vercel ou um servidor próprio. Publique o conteúdo do
repositório e pronto — não há variáveis de ambiente, banco de dados nem API.

## Versionamento: o que faz sentido commitar

| Commitar | Não commitar |
|---|---|
| Páginas `.html`, `css/`, `js/`, `icons/`, `fonts/`, `covers/`, `data/` | `node_modules/` |
| `docs/`, `screenshots/`, `downloads/` | `dist-usb/` e `*.zip` (pacotes gerados) |
| `tests/`, `tools/`, `package.json`, `package-lock.json` | `test-results/`, `playwright-report/` |
| `README.md`, `LICENSE`, `.gitignore`, `.nojekyll`, `.github/` | arquivos de sistema (`.DS_Store`, `Thumbs.db`) |

Os pacotes para pendrive (`dist-usb/`) são **gerados** por
`python3 tools/build_usb.py --out dist-usb --zip`. Se você quiser publicá-los
como download do projeto, prefira anexá-los a uma *Release* em vez de subir o
`.zip` para o histórico do Git.

## Privacidade e licença

- O projeto **não** coleta dados: favoritos, coleção e preferências ficam no
  `localStorage` do navegador de quem visita.
- Conteúdo sob **CC BY-NC-SA 4.0** (uso não comercial, com atribuição e
  compartilhamento sob a mesma licença). O texto legal completo está em
  `LICENSE`.
- Capas de livros e demais marcas citadas pertencem às editoras e são usadas
  como referência bibliográfica (ver `docs/covers/FONTES.md`).
