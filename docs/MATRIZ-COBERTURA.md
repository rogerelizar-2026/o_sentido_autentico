# Matriz de cobertura — especificação → arquivos → testes

Legenda: ✅ implementado e coberto por teste automatizado · ✅* implementado (verificação manual/documentada) · ⚠️ limitação declarada.

## Apêndice A — Identidade, propósito, isenção, licença

| Requisito | Arquivo(s) | Teste/Evidência |
|---|---|---|
| Marca “O Sentido Autêntico”, curador, e-mail, tagline | `index.html`, chrome de todas as páginas, rodapé | axe + smoke “h1 único/lang” |
| Texto de abertura e “Bem-vindo(a)” | `index.html#port-intro` | visual/contido no HTML |
| “Propósito e Isenção de Responsabilidade” completo (NÃO/TEM) | `<dialog id="dialog-termos">` em todas as páginas + rodapé | teste onboarding |
| “Licença e Direitos Autorais” (Setembro 2026, CC…) | rodapé + diálogo | — |
| Ambiguidade direitos/CC **flagged, não resolvida** | `editorial-note` no rodapé e no diálogo | — |
| Checkbox label exato | `#terms-checkbox` | teste “checkbox desmarcado” |
| Instituições (4 linhas, URLs reais) | `index.html#port-institutions` | — |
| Pix `rogerelizar@gmail.com` | `index.html#port-coffee` | — |
| Banner Ἐν ἀρχῇ… / בְּרֵאשִׁית… | `.osa-scripture-banner` com `lang`/`dir` | — |
| Rodapé: atribuição, contato, CC link, disclaimer, IA | rodapé de todas as páginas | — |
| Sem acreditação/endosso | frases explícitas nas instituições | — |

## Apêndice B — Catálogo canônico (20)

| Requisito | Arquivo(s) | Teste |
|---|---|---|
| 20 itens exatos (id, campos, links) | `data/recursos.json` (`schemaVersion: 1`) | “carrega 20 recursos canônicos” |
| Categorias/idiomas/níveis | mesmos maps no JSON + selects/chips | “chip + selects + limpar” |

## Apêndice C — Seções

### C.1 Portal (`#port-*`)
| Seção | Âncora/arquivo | Notas |
|---|---|---|
| intro, rota 3 passos, sequência | `index.html#port-intro`, `#port-route`, `.osa-sequence` | botão “Começar meus estudos” |
| livros (4 obras, níveis, capas oficiais em `covers/` + FONTES.md) | `#port-books` + `img.osa-bookcover-img` com alt/caption pt-BR | tabela semântica |
| Mounce/Rega × Wallace + ciclo | `#port-mounce-wallace` | — |
| apps (Sofia/Ginoskos/GBT sem anúncios) | `#port-apps` | — |
| Metodologia Gemini (3 fluxos + regras IA) | `#port-gemini` | — |
| Infográficos SVG reais, um por idioma | `#port-infographic` e `#heb-infografico` → `downloads/mapa-aceleracao.svg`; `#grk-infografico` → `downloads/mapa-aceleracao-grego.svg` | arquivos existem; teste de referências internas + axe |
| ~~Downloads~~ (removido a pedido da curadoria, 25/09/2026) | — | seção “Central de downloads” retirada do Portal; a exportação PDF continua na Caixa de Ferramentas |
| Instituições / cafezinho | `#port-institutions`, `#port-coffee` | — |

### C.2 Hebraico e Aramaico (`#heb-*`)
| Seção | Implementação |
|---|---|
| declaração de cobertura de aramaico | callout no topo de `hebraico-aramaico.html` |
| Nota de abertura sobre análise léxico-sintática e hermenêutica (antes de “Começar meus estudos”) | `index.html` `.osa-callout--gold#port-nota-hermeneutica` | teste “Portal do Estudante: nota sobre análise léxico-sintática” (× 2 projetos) |
| 1 visão/estatísticas (fatos + est. rotulada) | `#heb-visao` |
| 2 25 métodos | `data/metodos.json` + `js/metodos.js` `#heb-methods-table` (explorador: busca, filtros, cartões, tabela) |
| 2 análise dos 25 métodos com busca, chips de grupo, ordenação, resumo derivado, cartões com barras e tabela ordenável | `js/metodos.js` (`.osa-metodos*`) | 8 testes × 2 projetos — “Análise dos 25 métodos (UI/UX)” |
| 3 análise didática (3 grupos) | `#heb-analise` accordions |
| 4 ranking com critério | `#heb-ranking` (critério do JSON) |
| 5 quatro gráficos + tabelas | `#heb-graficos` `#charts-host` (SVG + tabela) |
| 5.1 infográfico | `#heb-infografico` |
| 6 recursos free · 7 faixas pagas | `#heb-recursos`, `#heb-pagos` |
| 9 método vencedor (5 princípios) | `#heb-vencedor` |
| 10 currículo 5 níveis + checkpoints + notas PT/ES/EN | `#heb-curriculo` |
| 12 Anki | `#heb-anki` |
| 13 seis prompts copiáveis | `#heb-ia` |
| 14 checklist + troubleshooting | `#heb-checklist` |

### C.3 Grego Koiné (`#grk-*`)
Espelho C.2 em `grego-koine.html`: visão, 25 métodos, análise, ranking, gráficos+infográfico, free/pagos por tier, “Integração Rega+Wallace” com fluxo 4 passos, currículo 5 níveis + cronograma, Anki, **dois** prompts, dores+checklist.

### C.4 Ferramentas
Busca/chips/selects/favoritos/contagens/limpar · Minha coleção + aviso local · CRUD com validação e confirmação/undo · JSON export/import · impressão PDF fallback · **busca externa ligada ao termo digitado** (Google, Bing, DuckDuckGo, Google Acadêmico, STEP Bible; botões inertes sem termo; espelho `#external-q` bidirecional; nenhuma API chamada pelo site) — `js/catalog.js` (`EXTERNAL_PROVIDERS`, `syncExternalSearch`), testes “Busca externa a partir do termo digitado” (6 × 2 projetos).

## Seções 1–10 do briefing

| Seção | Status | Onde / teste |
|---|---|---|
| 1 Identidade | ✅ | Apêndice A acima |
| 2 IA + deep links + “Nesta página” + back/forward | ✅ | `js/nav.js`; testes 1–9 |
| 3 Mobile-first, bottom nav, 44px, drawer fechado, API sidebar | ✅ | `css/*`, `js/sidebar.js`; testes sidebar, tap targets, 320px |
| 4 Onboarding | ✅ | `js/onboarding.js`; testes 10–15 |
| 5 Design system tokens/temas/fonts | ✅ | `css/tokens.css`, `css/fonts.css`; teste tema 16–17 |
| 6 Langs originais, tabelas semânticas, charts com tabela, capas oficiais | ✅ | `lang/dir/bdi`, `.osa-table-scroll`, `js/charts.js`, `img.osa-bookcover-img` |
| 7 Catálogo + coleção + import/export + storage versionado | ✅ | `js/catalog.js`, `js/storage.js`; testes 18–29 |
| 8 Invariantes 1–5 | ✅ | testes 30–33 + PWA 45–47 + “overflow” |
| 9 Static-first, performance, budgets | ✅* | `docs/PERFORMANCE.md` (medições locais; Lighthouse de campo **não executado** — ver limitações) |
| 10 A11y WCAG 2.2 AA, PWA, SEO | ✅/⚠️ | axe 6 páginas × 2 temas → **zero violações** (24/09/2026; antes, 3 avisos moderados) · `og:url` nas 4 páginas de conteúdo · apoio com `noindex` · Firefox/WebKit **indisponíveis** |
| 10b Correções da auditoria (24/09/2026) | ✅ | âncora `#panel-colecao` navegável · ETCBC com URL viva · grego politônico na fonte embarcada (métricas conferidas) · títulos sem saltos · `#tts-note` em landmark · alvos de toque ≥ 24 px — testes “Regressões da auditoria (24/09/2026)” (7 × 2 projetos) |
| 11 Entrega completa | ✅ | repositório + `docs/*` + `screenshots/*` |

7. **Links externos:** 2 recursos precisam de ação da curadoria — *Bible Atlas* (`bibleatlas.org`, domínio sem registro DNS) e 3 URLs não verificáveis deste ambiente (`biblicallanguagecenter.com`, `sofiaapp.com`). Registrado em `docs/AUDITORIA-2026-09-24.md`.

## Lacunas conhecidas (honestidade)

1. **Lighthouse/field metrics:** não há Lighthouse instalado neste ambiente → orçamentos de asset medidos (gzip) e smoke de carga; scores Lighthouse **não alegados**.
2. **Firefox/WebKit:** binários não disponíveis (só Chromium) — documentado em `docs/LIMITACOES-PERGUNTAS.md`.
3. **PDF nativo com shaping HE/GR:** fallback de impressão declarado na UI (seção 7 e cláusula de hosting estático).
4. ~~Direitos CC × reservados~~ — **RESOLVIDO (curador, 23/09/2026): CC BY-NC-SA 4.0 vigente**; aplicado na UI (ver `docs/LIMITACOES-PERGUNTAS.md`).
5. Capas oficiais aplicadas (`covers/` + `FONTES.md`); Ross em inglês com legenda (arte Vida pendente de fornecimento).
6. Estimativas com carimbo “setembro de 2026”.
