# O Sentido Autêntico

Portal educacional em **pt-BR** para iniciar o estudo do **hebraico bíblico**, do **aramaico bíblico** e do **grego koiné**: estratégias, currículos em 5 níveis, 25 métodos analisados e catálogo de recursos com busca, favoritos e coleção local.

> **Curadoria:** Idealizador e Curador do Projeto: Rogério Ramão Lopes — rogerelizar@gmail.com  
> **Tagline:** *Tecnologia e profundidade histórica para conectar você ao sopro original de Deus.*

## Executar localmente

```bash
python3 -m http.server 4173 --bind 127.0.0.1
# http://127.0.0.1:4173/index.html
```

## Testes

```bash
npm install
npx playwright install chromium   # requer Chromium; Firefox/WebKit indisponíveis neste ambiente
npm test                          # E2E + axe + PWA (77 testes × 2 projetos)
npm run test:a11y
npm run screenshots               # capturas rotuladas em screenshots/
```

## Versão portátil (pendrive, sem servidor)

```bash
python3 tools/build_usb.py --out dist-usb --zip     # gera dist-usb/O-Sentido-Autentico-pendrive.zip
python3 tools/build_usb_unico.py                      # opção sem .zip: páginas autossuficientes
node tests/verify-portatil.mjs dist-usb/O-Sentido-Autentico
```

Detalhes em [`docs/VERSAO-PORTATIL.md`](docs/VERSAO-PORTATIL.md).

## Publicar no GitHub (e no GitHub Pages)

Guia completo: [`docs/PUBLICAR-GITHUB.md`](docs/PUBLICAR-GITHUB.md) — três caminhos (GitHub Desktop, terminal, envio pelo navegador).

```bash
./tools/publicar-github.sh                    # git init + primeiro commit + comandos de push
```

O repositório já traz `LICENSE` (CC BY-NC-SA 4.0, texto oficial), `.gitignore`, `.nojekyll` e o workflow `.github/workflows/pages.yml`, que publica o site a cada push na `main` (Settings → Pages → Source: *GitHub Actions*).

## Deploy (GitHub Pages, subdiretório `/o_sentido_autentico/`)

1. Publique a **raiz** do repositório no GitHub.
2. Pages → branch `main` (root).
3. As URLs absolutas (`og:url`, `sitemap.xml`, `homepage`) já apontam para `https://rogerelizar-2026.github.io/o_sentido_autentico/`.
4. Todos os caminhos são relativos — funciona sob `/o_sentido_autentico/` sem `<base>`.

## Estrutura

Consulte [`docs/PLANO-IMPLEMENTACAO.md`](docs/PLANO-IMPLEMENTACAO.md) e a matriz completa [`docs/MATRIZ-COBERTURA.md`](docs/MATRIZ-COBERTURA.md).

| Documento | Conteúdo |
|---|---|
| `docs/PLANO-IMPLEMENTACAO.md` | arquitetura, fluxos, comandos, decisões |
| `docs/MATRIZ-COBERTURA.md` | especificação → arquivos → testes |
| `docs/DESIGN-SYSTEM.md` | tokens e inventário de componentes |
| `docs/VERSAO-PORTATIL.md` | build para pendrive: como gerar, o que muda em `file://`, verificação |
| `docs/ACESSIBILIDADE.md` | axe + checklists manuais + engines |
| `docs/PERFORMANCE.md` | orçamentos medidos; o que **não** foi medido |
| `docs/LIMITACOES-PERGUNTAS.md` | limitações de ambiente e pendências do curador |

## Privacidade

Sem contas e sem nuvem: favoritos, recursos criados por você, preferências e posição de leitura ficam no `localStorage` do dispositivo. Exporte em JSON quando quiser backup.

## Licença

Texto completo no rodapé do site e no diálogo de termos. **Decisão do curador (23/09/2026):** Creative Commons **BY-NC-SA 4.0** é a licença vigente; a frase “Todos os direitos reservados.” não aparece mais na seção de licença.


## Guia Integrado de Exegese

O portal inclui `guia-exegese.html`, um percurso do estabelecimento do texto à aplicação responsável. A página integra crítica textual, contexto, línguas bíblicas, sintaxe, diagramação, argumento, discurso e aplicação. Ela utiliza o mesmo manifesto e Service Worker do portal e fica disponível offline após a primeira visita/atualização do PWA.
