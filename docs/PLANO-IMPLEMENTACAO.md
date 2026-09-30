# O Sentido Autêntico — Plano de implementação (resumo do proprietário)

**Versão:** 1.0.0 · **Data:** 23/09/2026 · **Curadoria:** Rogério Ramão Lopes  
**Arquitetura:** site 100% estático (HTML/CSS/ES modules), publicado no GitHub Pages em `/o_sentido_autentico/`.

## 1. Objetivo

Portal pt-BR de estudo introdutório de **hebraico bíblico, aramaico bíblico e grego koiné**, com:

- quatro destinos fixos (Portal, Hebraico+Aramaico, Grego, Ferramentas);
- catálogo de **20 recursos canônicos** + recursos do usuário, busca/filtros/favoritos/coleção;
- import/export JSON versionado, impressão como fallback de PDF;
- onboarding de termos com consentimento explícito;
- PWA leve (precache mínimo, atualização só por ação do usuário);
- acessibilidade WCAG 2.2 AA como alvo verificável (axe zero critical/serious).

## 2. Estrutura

| Caminho | Papel |
|---|---|
| `index.html` | Portal do Estudante (`#port-*`) |
| `hebraico-aramaico.html` | Currículo/métodos hebraico+aramaico (`#heb-*`) |
| `grego-koine.html` | Currículo/métodos grego (`#grk-*`) |
| `caixa-de-ferramentas.html` | Catálogo + coleção (`#cat-*`) |
| `offline.html`, `404.html` | Reservas de navegação |
| `css/` | tokens · fonts · base · components (main.css importa) |
| `js/` | módulos: storage, theme, sidebar, onboarding, nav, ui, a11y, catalog, charts, pwa, export, main |
| `data/` | `recursos.json` (schema v1, 20 itens), `metodos.json` (25 métodos + estimativas editoriais) |
| `fonts/` | WOFF2 auto-hospedados OFL (Inter, Cinzel, Noto Serif Hebrew, Noto Serif, OpenDyslexic) |
| `icons/`, `downloads/` | SVG/PNG reais; guias + infográfico |
| `sw.js`, `manifest.webmanifest` | PWA |
| `tests/` | Playwright (E2E, axe, PWA) + script de screenshots |
| `screenshots/` | Capturas rotuladas |
| `docs/` | Esta documentação, matriz de cobertura, a11y, performance, limitações |
| `tools/` | Gerador estático do “chrome” das páginas (opcional; HTML é o artefato) |

## 3. Fluxos críticos

1. **Termos:** diálogo na 1ª visita · checkbox desmarcado · ação primária desabilitada · fechar ≠ aceitar · barra persistente · chaves separadas (`osa:terms:accepted` vs `osa:terms:presentationSeen`) · flag legada de dispensa nunca vira aceite.
2. **Tema:** bootstrap inline antiflash · uma única implementação (`#theme-toggle` + `js/theme.js`) · persistência `osa:theme` (aceita bruto/JSON) · `prefers-color-scheme` em “system”.
3. **Catálogo:** fetch de `data/recursos.json` · busca sem acento · chips/idioma/nível/favoritos · CRUD local com validação e allowlist `http/https` · undo de exclusão · import/export JSON schema `osa-colecao` v1, 512 KB, política `keep-existing`.
4. **PWA:** precache item a item (sem `addAll` atômico) · navegação network-first com timeout e `offline.html` · barra “Nova versão disponível” → `SKIP_WAITING` só no clique · caches `osa-*` apenas.
5. **Deep links:** `#port-*` na entrada; `#heb-*`/`#grk-*`/`#cat-*` carregados na entrada redirecionam com `location.replace` para a página dona.

## 4. Como executar

```bash
# desenvolvimento local
python3 -m http.server 4173 --bind 127.0.0.1
# abrir http://127.0.0.1:4173/index.html

# testes (instala Playwright/Chromium se necessário)
npm install
npx playwright install chromium
npm test

# screenshots
npm run screenshots
```

## 5. Deploy GitHub Pages (subdiretório `/o_sentido_autentico/`)

1. Publicar a raiz deste projeto no repositório `rogerelizar-2026/o_sentido_autentico` (já criado, vazio).
2. Settings → Pages → Branch `main` / root (ou workflow estático).
3. O site fica em `https://rogerelizar-2026.github.io/o_sentido_autentico/`.
4. Todos os recursos usam **caminhos relativos** (`./css/…`, `./js/…`) — não há necessidade de `<base href>`; `start_url`/`scope` do manifest são `./`.
5. `sitemap.xml`, `og:url` e `package.json` já usam a base real (`https://rogerelizar-2026.github.io/o_sentido_autentico/`); revisar se o repositório for renomeado.
6. HTTPS é obrigatório para service worker.

## 6. Decisões técnicas deliberadas

| Tema | Decisão | Motivo |
|---|---|---|
| Gráficos | SVG nativo a partir de `metodos.json` | sem Chart.js; zero CDN; acessível (tabela+resumo) |
| PDF | folha de impressão + “Salvar como PDF” | sem motor de shaping hebraico/grego confiável no cliente; fallback declarado na UI |
| Busca externa | links que **abrem** Google/DDG/STEP Bible | static hosting: sem API, sem chaves |
| Fonts | WOFF2 OFL auto-hospedados | `font-display:swap`, preload só Inter 400/600 |
| Contas/sync | não existem | dados só no `localStorage` (aviso na UI) |

## 7. Matriz de cobertura

Ver [`docs/MATRIZ-COBERTURA.md`](./MATRIZ-COBERTURA.md) — cada seção do briefing (1–10 e Apêndices A/B/C) mapeada ao arquivo implementador e ao teste.

## Busca externa ligada ao termo (2026-09-24)

O catálogo já tinha botões de descoberta externa. Agora eles são **vivos**: o `href` é recalculado a cada tecla digitada em “Buscar recursos”, com cinco destinos (Google, Bing, DuckDuckGo, Google Acadêmico e STEP Bible).

- `EXTERNAL_PROVIDERS` em `js/catalog.js` centraliza as URLs — acrescentar um provedor é adicionar uma entrada e um botão.
- Sem termo, os botões ficam visíveis porém inertes (`aria-disabled`, `tabindex="-1"`, classe `.is-disabled`) e uma dica explica o porquê; com termo, a dica é trocada pela confirmação de que **o site não executa a busca**.
- O campo `#external-q` (seção *Descoberta externa*) espelha `#filter-q` nos dois sentidos, para quem chega rolando direto até aquela seção.
- Verificação: 6 testes × 2 projetos (`tests/osa.spec.mjs`), incluindo a checagem de que nenhum href aponta para o próprio site, `file://` ou `127.0.0.1`.

## Menu lateral: saída rápida e auto-ocultação (2026-09-24)

Pedido de curadoria: o menu deve sair do caminho sozinho. Implementado em `js/sidebar.js`:

- **Fechar fora:** `pointerdown` em fase de captura no documento; alvo fora da gaveta (e diferente do botão do menu) → `closeSidebar()`. Funciona para toque e mouse, inclusive sobre elementos que ficam acima do backdrop (cabeçalho e FAB), que antes podiam "engolir" o clique.
- **Auto-ocultar em 4 s:** `IDLE_HIDE_MS = 4000`; qualquer atividade real reinicia a contagem; o timer só vive com a gaveta aberta.
- **Desligável (WCAG 2.2.1):** botão de cronômetro no painel de acessibilidade, preferência `drawerAutoHide` persistida; estado anunciado por `aria-pressed` e `title` que muda conforme o valor.
- **Aviso honesto:** ao auto-ocultar, a região viva explica o que houve e como desligar.
- Testes: 6 × 2 projetos, incluindo "interação reinicia a contagem" e "preferência persiste após recarregar".

## Análise dos 25 métodos: nova interface (2026-09-24)

A tabela de 8 colunas foi substituída por um explorador (pedido de curadoria: melhor UI/UX). Arquitetura:

- `js/metodos.js` — `initMethodsExplorer(containerId)` (cartões, filtros, resumo, tabela) e `initPrintExpanders()` (abre as tabelas marcadas ao imprimir e restaura depois).
- `js/charts.js` — mantém os 4 gráficos e o ranking; a tabela antiga saiu daqui (`initMethodsTable` não existe mais).
- `js/main.js` — carrega os dois módulos sob demanda nas páginas de idioma.
- Busca usa `normalize()` de `js/ui.js` (sem acentos), inclusive no texto de aplicação ao idioma.
- Todo número vem de `data/metodos.json`; o resumo é média/mínimo calculados, nunca estimativa nova. O aviso de “estimativas editoriais de setembro de 2026” aparece no rótulo das métricas (“(est.)”), na legenda do campo e no rodapé do resumo.
- Cobertura: 8 testes × 2 projetos (“Análise dos 25 métodos (UI/UX)”), incluindo a conferência de que o resumo exibido bate com os valores dos cartões.

## Nota de abertura do Portal (2026-09-24)

A pedido da curadoria, o Portal do Estudante passa a abrir com a nota *“Antes de começar: o lugar da análise léxico-sintática”* (`#port-nota-hermeneutica`), imediatamente **antes** do botão “Começar meus estudos”. O texto é de autoria do curador, transcrito com uma única correção ortográfica (*decobrta* → *descoberta*) e o restante preservado literalmente, incluindo a frase final em negrito. Cobertura: teste “Portal do Estudante: nota sobre análise léxico-sintática” (posição no DOM e na tela, três parágrafos e frase de destaque).

## Correções da auditoria completa (2026-09-24)

Rodada executada sobre o relatório `docs/AUDITORIA-2026-09-24.md`, apenas nos itens que **não** dependiam de decisão editorial:

| # | Achado | Correção | Verificação |
|---|---|---|---|
| N1 | Âncora `#cat-colecao` quebrada (2× + gerador) | `#panel-colecao` em `tools/build_pages.py` e regeneração; o painel abre em modo coleção por deep link (`js/catalog.js`) | teste *'"Minha coleção" leva ao painel existente'* (painel visível, aba selecionada, alvo no visor) |
| N2 | `https://etcbc.github.io/` → 404 | `https://etcbc.github.io/bhsa/` (200) no catálogo e na lista de recursos | `grep` + teste de referências internas |
| N4 | Grego politônico sem glifos | `noto-serif-greek-ext-400.woff2` (233/256, cobre 100% do usado) declarado para `U+1F00-1FFF`; `unicode-range` da face grega corrigido para `U+0370-03FF` (o arquivo não tinha o bloco estendido); precache 45 → 46 URLs | teste de proveniência por métricas + `verify-portatil` |
| N5 | `og:url` ausente; páginas de apoio indexáveis | `og:url` absoluto nas 4 páginas de conteúdo (`https://rogerelizar-2026.github.io/o_sentido_autentico/`, sincronizado com `sitemap.xml` e `package.json`) e `robots noindex,follow` em `offline.html` (o `404.html` já tinha `noindex`) | teste *'og:url absoluto e coerente com sitemap e package.json'* |
| N6 | Saltos h2→h4 | títulos de nível e de gráfico passam a `h3` com classe visual equivalente | teste *'hierarquia de títulos sem saltos de nível'* |
| A3 | 17 links de título com 23 px | `.osa-resource__title a` com `min-height: 24px` | teste *'links de título do catálogo têm alvo de toque de 24px'* |
| region | `#tts-note` fora de landmark | `<aside class="osa-tts-note">`, margem zerada | teste *'aviso da leitura em voz alta fica dentro de um landmark'* + axe |

Resultado: **axe sem violações em 6 páginas × 2 temas** (antes: 3 avisos moderados), suíte 153 testes passando / 1 ignorado. Fica pendente apenas o que depende da curadoria: substituição do recurso *Bible Atlas* (domínio inexistente) e a decisão sobre `docs/LIMITACOES-PERGUNTAS.md` citar a frase de direitos autorais.

## Ajustes de conteúdo e rodapé (2026-09-25)

Pedidos da curadoria aplicados de uma vez:

| Pedido | O que mudou |
|---|---|
| Barra de menu não ocultava | **Causa medida:** o repositório aberto direto do disco (`file://`) tem o JavaScript bloqueado pelo navegador (módulos ES), então o menu não responde — comportamento de qualquer site estático, não defeito de código. Tanto em HTTP (GitHub Pages) quanto na versão portátil o auto-ocultar funciona. Confirmado por medição nos três cenários. |
| Peixe do grego igual à imagem enviada | Ícone do cabeçalho redesenhado: peixe de traço contínuo com **ΙΧΘΥΣ** dentro (antes era um contorno com “olho”). Novo componente `.osa-symbol` com a figura em destaque na página de grego e legenda do acróstico. |
| Infográfico do grego era o do hebraico | Criado `downloads/mapa-aceleracao-grego.svg` (5 níveis do grego, marcos reais do currículo da página, fluxo Rega/Mounce → parsing → Wallace, peixe ΙΧΘΥΣ no cabeçalho do infográfico). O hebraico mantém o seu. |
| Sem arquivos para download | Seção “Central de downloads” removida do Portal (e o item do menu). Os infográficos continuam sendo exibidos como imagem (não link de download). Os SVGs-guia permanecem na pasta `downloads/` sem link público. |
| Sem textos de licença/direitos no fim da página | “Licença e Direitos Autorais” removida do rodapé de todas as páginas. A licença CC BY-NC-SA 4.0 segue declarada no diálogo de termos. |
| Aviso do PWA virou botão | Texto movido para o diálogo `#dialog-pwa`, aberto pelo botão “PWA instalável — como usar offline” no rodapé (`js/main.js → initPwaHelp`). |
| Aviso de leitura antes da identidade, tudo centralizado | `#tts-note` agora é a primeira linha do rodapé, acima de “O Sentido Autêntico / Idealizador e Curador…”, e o rodapé inteiro ficou centralizado. |

Cobertura: suíte completa (153 testes) verde; `verify-portatil` (40 verificações) verde nas duas pastas portáteis.

## Menu no desktop e limpeza da figura do peixe (2026-09-25)

| Pedido | O que mudou |
|---|---|
| Menu deve fechar ao clicar fora e auto-ocultar em 4 s — *nos dois formatos* | `js/sidebar.js` passou a operar sobre dois recipientes: `#osa-drawer` (mobile) e `#osa-sidebar` (desktop). Um único `pointerdown` em captura fecha qualquer um dos dois; a contagem de 4 s (`IDLE_HIDE_MS`) vale para ambos e continua desligável em Acessibilidade. A barra do desktop abre ao carregar e, ao ser fechada, deixa o conteúdo em largura total. `#menu-toggle` ganhou `aria-controls` dinâmico (`osa-sidebar`/`osa-drawer`) e rótulo que alterna entre abrir/fechar. |
| Remover a figura do peixe com a legenda do acróstico | Bloco `.osa-symbol` removido da página de grego (HTML, CSS e o teste de referências). **O ícone do peixe no título da página permanece**, conforme o pedido anterior. |

Notas técnicas: a barra do desktop é uma **coluna do grid**, não um painel sobreposto — a primeira tentativa usava `position: fixed` e três testes reprovaram porque a barra cobria o conteúdo e interceptava cliques; a solução em grid elimina a sobreposição e mantém o conteúdo sempre clicável. Impressão: `.osa-shell { display: block }` e a barra oculta.
