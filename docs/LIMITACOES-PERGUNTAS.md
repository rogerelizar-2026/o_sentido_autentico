# Limitações do ambiente e perguntas — COM RESPOSTAS DO CURADOR (2026-09-23)

## 1. Ambiente de geração

| Item | Status |
|---|---|
| Chromium (Playwright) | ✅ disponível e usado |
| Firefox | ❌ indisponível — testes E2E/axe não rodaram neste engine |
| WebKit/Safari | ❌ indisponível |
| Lighthouse CLI | ❌ não instalado — scores não alegados |
| Chrome DevTools field/CrUX | ❌ sem dados de campo |
| Servidor backend / contas | ❌ fora do escopo (site estático por requisito) |

## 2. Decisões do proprietário (aplicadas)

| # | Pergunta | Decisão | Aplicação |
|---|---|---|---|
| 1 | Direitos × CC | **Manter Creative Commons** | UI: CC **BY-NC-SA 4.0** é a licença vigente (23/09/2026). Frase “Todos os direitos reservados.” **removida** da seção “Licença e Direitos Autorais” (rodapés + diálogo de termos) por direção do curador. |
| 2 | URLs canônicas | **Placeholder até 23/09; preenchidas em 24/09** | O curador informou o repositório `rogerelizar-2026/o_sentido_autentico`; `og:url`, `sitemap.xml` e `package.json.homepage` passaram a usar `https://rogerelizar-2026.github.io/o_sentido_autentico/`. Os `canonical` seguem relativos e acompanham qualquer base. |
| 3 | Capas de livros | **Usar capas oficiais** | Substituídas por imagens reais em `covers/` (Rega=Vida Nova, Mounce=Editora Vida, Wallace=Open Library). Ross: capa oficial da edição em inglês (Open Library/Baker) + legenda honesta — arte da edição Vida não localizada online em 23/09/2026 (substituir se o curador enviar). Proveniência: `covers/FONTES.md`. |
| 4 | Links de compra/loja | **Manter como na especificação** | Sem alteração (Apêndice B). |
| 5 | Instituições | **Manter “Recomendadas” sem convênio** | Sem alteração; aviso de não-endosso já presente. |
| 6 | Estimativas editoriais | **Manter + nota mês/ano atual** | “setembro de 2026” em `data/metodos.json` (`dataEstimativas: 2026-09`), tabelas, ranking, gráficos e textos das páginas HE/GR. |
| 7 | Referências de aramaico | **Manter como *leitura*** | Sem alteração. |
| 8 | Mounce | **Manter ficha editorial** | Sem alteração (portal + capa oficial da Editora Vida). |

### PWA (esclarecimento do curador)

> PWA é para usar o site **offline** (com ou sem rede), como um app, sem necessidade de conexão.

**Implementação:** após a **primeira visita com rede**, o service worker baixa shell + 4 páginas + `data/*.json` + fontes + capas + guias SVG para caches `osa-core-*`/`osa-runtime-*`. Navegações usam network-first com fallback ao cache e a `offline.html`. Recursos **externos** (Google, STEP Bible, lojas) **não** funcionam offline — a UI declara isso. Atualização só sob “Nova versão disponível → Atualizar” (sem `skipWaiting` automático). Testes: suíte PWA (precache 200, offline de página visitada, preservação de dados).

## 3. Licenças de fonte

| Fonte | Licença | Origem |
|---|---|---|
| Inter | OFL 1.1 | fontsource (WOFF2) |
| Cinzel | OFL 1.1 | fontsource |
| Noto Serif Hebrew | OFL 1.1 | fontsource |
| Noto Serif (latim+grego) | OFL 1.1 | fontsource |
| OpenDyslexic | SIL OFL | fontsource |

Capas de livros: direitos das editoras/autores (uso de identificação editorial do título — decisão do curador).

## 4. PDF e gráficos (sem mudança)

- Impressão do navegador como fallback de PDF (shaping HE/GR) — declarado na UI.
- Gráficos SVG nativos; sem Chart.js/CDN.

## 5. PWA em HTTP local

Service worker exige contexto seguro: `https://` ou `localhost`/`127.0.0.1`. GitHub Pages (HTTPS) é o alvo de produção, em `/o_sentido_autentico/`.
