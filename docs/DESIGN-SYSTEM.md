# Design system — O Sentido Autêntico

Sistema editorial de estudo: sóbrio, quente, calmo, contemporâneo.  
Tokens em [`css/tokens.css`](../css/tokens.css) · componentes em [`css/components.css`](../css/components.css).

## 1. Tokens

### Cores
| Token | Valor (claro) | Uso |
|---|---|---|
| `--osa-paper` | `#FBFAF7` | fundo da página |
| `--osa-soft` | `#F3EFE6` | superfície suave (filtros, TOC) |
| `--osa-surface` | `#FFFFFF` | cards, diálogos |
| `--osa-ink` | `#1A2530` | texto primário |
| `--osa-ink-secondary` | `#4A5568` | texto secundário |
| `--osa-gold` | `#C5A059` | acentos decorativos (nunca corpo de texto) |
| `--osa-gold-ink` | `#7A5C1E` | **variante acessível do ouro em texto/links** |
| `--osa-portal-green` | `#0F3731` | identidade do Portal / CTA primário |
| `--osa-hebrew-navy` | `#102A43` | identidade Hebraico+Aramaico |
| `--osa-greek-burgundy` | `#7B1D22` | identidade Grego |

Tema escuro e alto contraste sobrescrevem os mesmos tokens (`[data-theme="dark"]`, `[data-contrast="high"]`).

### Espaçamento (4/8)
`--osa-space-1…8` = 4, 8, 12, 16, 24, 32, 48, 64 px.

### Tipografia
| Token | Uso |
|---|---|
| `--osa-font-display` (Cinzel) | marca e títulos de marca (uso parcimonioso) |
| `--osa-font-body` (Inter) | corpo 16–18 px (padrão 17), line-height 1.7 |
| `--osa-font-serif` (Noto Serif + grego) | taglines, texto `lang="grc"` |
| `--osa-font-hebrew` (Noto Serif Hebrew) | texto `lang="he"`/`lang="arc"` |
| `--osa-font-dyslexic` (OpenDyslexic) | alternativa dislexia |

Medida editorial: `--osa-measure: 72ch`.

#### Cobertura das fontes de escrita original
| Faixa | Arquivo | Observação |
|---|---|---|
| Hebraico `U+0590-05FF` + niqqud/te'amim | `noto-serif-hebrew-400/700.woff2` | cantilação incluída |
| Grego básico `U+0370-03FF` | `noto-serif-greek-400.woff2` | alfabeto, acentos simples |
| **Grego politônico `U+1F00-1FFF`** | `noto-serif-greek-ext-400.woff2` (5,5 KB) | espíritos, iota subscrito, acentos — 233/256 do bloco, **todos os caracteres usados no site** |

As três faixas pertencem à família `"Noto Serif"` (o `unicode-range` decide quem desenha cada caractere), então `--osa-font-serif` cobre texto grego sem token extra. Verificação automatizada: o teste *"grego politônico: face declarada, arquivo embarcado e usado no rendering"* compara as larguras @100px com as métricas do arquivo (advance/unitsPerEm), quebrando se algum caractere passar a ser desenhado por fonte do sistema.

### Símbolo do peixe ΙΧΘΥΣ (`.osa-symbol`, `.osa-page-heading__icon--wide`)
O peixe cristão com a palavra ΙΧΘΥΣ desenhada dentro é o símbolo da página de grego: aparece no cabeçalho (classe `--wide`, `clamp(60px, 13vw, 96px)`, proporção 2,5:1 preservada) e em figura própria logo abaixo do banner de escritura, com a legenda do acróstico (`Ἰησοῦς Χριστὸς Θεοῦ Υἱὸς Σωτήρ`). O SVG usa `textLength` para o grego caber sempre dentro do corpo do peixe, em qualquer zoom.

### Rodapé (`.osa-footer`)
Centralizado (`text-align: center`), com esta ordem fixa: aviso de leitura em voz alta (`#tts-note`) → identidade do curador → botão do PWA → isenção de responsabilidade. O botão “PWA instalável — como usar offline” (`[data-pwa-help]`) abre o `#dialog-pwa`; o texto de instalação vive no diálogo, não solto no rodapé. A seção “Licença e Direitos Autorais” não fica mais no rodapé — a licença segue declarada no diálogo de termos.

### Menu lateral: gaveta (mobile) e barra (desktop)
Um só mecanismo em `js/sidebar.js` para os dois formatos:

| | Mobile (<1024 px) | Desktop (≥1024 px) |
|---|---|---|
| Recipiente | `#osa-drawer` + `#osa-backdrop` | `#osa-sidebar` (coluna do grid em `.osa-shell`) |
| Estado inicial | **fechada** | **aberta** ao carregar |
| Abrir/fechar | `#menu-toggle` (☰ no cabeçalho) | mesmo botão |
| Fechar ao clicar fora | sim (backdrop + `pointerdown` em captura) | sim (clique no conteúdo) |
| Escape | sim | sim |
| Auto-ocultar | 4 s (`IDLE_HIDE_MS`) | 4 s, mesma preferência |
| Fechado fica inerte | `inert` no drawer | `inert` na sidebar (links fora da tabulação) |

No desktop a barra **não sobrepõe** o conteúdo: ela ocupa a primeira coluna do grid (`grid-template-columns: var(--osa-sidebar-w) minmax(0, 1fr)` quando aberta, `0 …` quando fechada), com transição. Assim nada do texto fica escondido atrás dela e o clique no conteúdo fecha o menu chegando ao alvo. Fechando manualmente ou pelos 4 s, o conteúdo usa a largura inteira.

### Hierarquia de títulos
Os títulos de nível (`.osa-level__titulo`) e os títulos de gráfico (`.osa-chart__titulo`) são `h3` dentro de `section` de nível `h2` — a hierarquia não salta de nível (WCAG 1.3.1 / axe `heading-order`). A classe mantém o tamanho visual (`--osa-text-lg`) anterior à troca.

O aviso de leitura em voz alta (`#tts-note`) vive dentro de `<aside class="osa-tts-note" aria-label="Observação sobre a leitura em voz alta">`: é um landmark, portanto não deixa conteúdo solto fora de regiões (axe `region`). A classe zera a margem padrão do `aside` para não deslocar o rodapé.

### Raios / elevação / interação
- Raios: 8 (sm), 12 (md), **16 (cards)**, pill.
- Sombras: `--osa-shadow-1…3` (modestas).
- Tap min 44 px / preferido 48 px · transições 120–180 ms · foco: `--osa-focus-ring`.

## 2. Inventário de componentes

| Componente | Classe / seletor | Propósito | Exemplo de uso |
|---|---|---|---|
| Botão primário | `.osa-btn--primary` | ação principal | `<a class="osa-btn osa-btn--primary" href="…">Começar meus estudos</a>` |
| Botão contorno | `.osa-btn--outline` | ação secundária | `Limpar filtros` |
| Botão perigo | `.osa-btn--danger` | destrutivo | `Excluir` |
| Card | `.osa-card` (+ `--link`, acentos `--portal/--hebrew/--greek/--tools`) | blocos de conteúdo e cartões de destino | cartões da home |
| Badge | `.osa-badge` (+ `--free/--paid/--navy/--burgundy/--green/--gold`) | metadados compactos | `Gratuito`, níveis |
| Chip | `.osa-chip[aria-pressed]` | filtros de categoria | chips do catálogo |
| Campo de formulário | `.osa-field`, `.osa-input/.osa-select/.osa-textarea` | entradas com label acima | busca, formulário de recurso |
| Checkbox editorial | `.osa-check` | aceite e opções ≥44 px | termos |
| Diálogo | `dialog.osa-dialog` | modais acessíveis | termos, CRUD, confirmação |
| Header compacto | `.osa-header` | sticky, safe-area | todas as páginas |
| Bottom nav | `.osa-bottomnav` | 4 destinos, `aria-current` + barra/peso | mobile |
| Drawer | `.osa-drawer` + `.osa-backdrop` | menu fechado por padrão; Escape/backdrop | mobile |
| Sidebar | `.osa-sidebar` ≥1024 px | barra do desktop: abre ao carregar e tem o mesmo comportamento da gaveta (fecha fora, Escape, 4 s) | desktop |
| TOC | `.osa-toc` | “Nesta página” | todas as páginas |
| Tabela rolável | `.osa-table-scroll[role=region][tabindex=0]` | dados comparativos | métodos, livros |
| Accordion | `details.osa-accordion` | detalhe secundário | análise didática |
| Toast | `.osa-toast` | feedback + desfazer | CRUD/import |
| Barra de termos | `.osa-terms-bar` | exigência persistente | até aceitar |
| Barra de atualização | `.osa-update-bar` | “Nova versão disponível” | PWA |
| Toolbar a11y | `.osa-a11y-fab-wrap` | A−/A+/Ad/contraste/TTS | flutuante |
| Gráfico | `.osa-chart` (SVG + resumo + tabela) | análises | 4 gráficos/idioma |
| Capa oficial de livro | `img.osa-bookcover-img` | livros (capas oficiais em `covers/`; Ross com caption honesta de edição EN) | portal |
| Callout | `.osa-callout` (+ `--warn`, `--gold`) | avisos | aramaico, IA, privacidade |
| Prompt copiável | `.osa-prompt pre` + `[data-copy-target]` | prompts de IA | HE/GR |
| Checklist | `.osa-checklist` | rotina diária local | HE/GR |
| Nível do currículo | `.osa-level` + `.osa-level__badge` | 5 níveis | HE/GR |
| Sequência numerada | `.osa-sequence` | 3 passos da home | home |
| Banner de escritura | `.osa-scripture-banner` | HE+GR com lang/dir | home/HE/GR |
| Empty/loading/error | `.osa-empty` | estados do catálogo | catálogo |

## 3. Regras de uso

1. Nunca ouro (`--osa-gold`) em corpo de texto — usar `--osa-gold-ink`.
2. Estado ativo **nunca só por cor**: peso, `aria-current`, `✓`, barra inferior.
3. Sombras discretas; sem glassmorphism/parallax/heros fotográficos.
4. Cards `min-width: 0` em grid; overflow local apenas em `.osa-table-scroll`.
5. `transition` em propriedades específicas — proibido `transition: all`.

## Busca externa (`.osa-external-search`)

Bloco que fica **logo abaixo do campo “Buscar recursos”** (seção *Busca e filtros*) e também na seção *Descoberta externa*.

| Elemento | Regra |
|---|---|
| `.osa-external-search` | moldura tracejada (`--osa-border-strong`), fundo levemente diferente da página, cantos `--osa-radius-md` |
| `.osa-external-search__row` | `display:flex; flex-wrap:wrap; gap:--osa-space-2` — quebra sozinho em telas estreitas |
| Botões | `osa-btn--outline osa-btn--sm`, altura mínima 38 px, sempre `target="_blank"` + `rel="noopener noreferrer external"` |
| Estado sem termo | `.is-disabled` (opacidade .55) + `aria-disabled="true"` + `tabindex="-1"`: o clique não navega e o foco de teclado não para ali |
| Estado com termo | `href` recalculado a cada tecla, `data-external-term` mostra “termo” e `[data-external-ready]` confirma que nenhuma busca é feita pelo site |

Provedores: Google, Bing, DuckDuckGo, Google Acadêmico (junto ao campo) e STEP Bible (seção de descoberta). O termo vive em `#filter-q`; o campo `#external-q` é espelho bidirecional. Nenhuma API, chave ou requisição é feita pelo site — só a montagem da URL e a abertura em nova aba.

## Painel de acessibilidade (FAB)

Canto direito da header. Um único `#a11y-fab` por página abre `#a11y-panel` (coluna, abaixo do botão). Cada controle tem `aria-pressed` quando é alternável e `title` descritivo:

| Controle | Rótulo acessível | Estado |
|---|---|---|
| `#theme-toggle` | Alternar para tema escuro | tema persistido em `osa:theme` |
| `A−` / `A+` / `A·` | tamanho da fonte | `osa:a11y:prefs.fontScale` (0,85–1,60) |
| `Ad` | fonte para dislexia | `dyslexia` |
| `◐` | alto contraste | `highContrast` |
| ⌚ (SVG de cronômetro) | ocultar o menu após 4 s | `drawerAutoHide` (padrão ligado) |
| `▶` / `■` | leitura em voz alta | `speechSynthesis` |

O painel fecha com Escape, com clique fora e ao escolher qualquer ação.

## Explorador dos 25 métodos (`.osa-metodos`)

Substitui a antiga tabela de 8 colunas na seção “Métodos de aprendizado” das páginas de hebraico/aramaico e grego koiné. Renderizado por `js/metodos.js` (`initMethodsExplorer`) a partir de `data/metodos.json`.

| Parte | Regra de interface |
|---|---|
| `.osa-metodos__toolbar` | grade 1 coluna no celular, 2 no desktop (≥900px); busca com rótulo, chips de grupo didático, ordenação, caixa “somente híbridos” e “Limpar filtros” |
| `.osa-metodos__count` | texto em `role="status"` + `aria-live="polite"`: “Mostrando X de 25 métodos” |
| `.osa-metodos__resumo` | 4 indicadores derivados (média de eficiência, média de complexidade, retorno mais rápido, menor complexidade) calculados **somente** sobre o conjunto filtrado, com a nota “Calculado apenas sobre os N métodos exibidos agora” |
| `.osa-metodo` | cartão com número, nome, selos (grupo didático + “Híbrido”), três métricas com barra, focos em `.osa-tag` e texto de aplicação ao idioma |
| `.osa-bar` | decorativa (`aria-hidden="true"`); o valor sempre aparece em texto ao lado — nunca só na barra |
| `.osa-metodo__detalhe` | no desktop vem com 4 linhas (`-webkit-line-clamp`) e o botão libera o texto; abaixo de 760px começa oculto e o botão abre — os cartões ficam escaneáveis com 25 itens |
| `.osa-metodos__tabela` | tabela comparativa completa em `<details>` fechado, com cabeçalhos ordenáveis (`<button>` + `th[aria-sort]`), cabeçalho fixo na rolagem e `data-abrir-impressao` (abre sozinha ao imprimir/gerar PDF) |

Grade no desktop: no máximo **2 colunas** (cartões de ~390px). Com 3 colunas a coluna de métrica cai para 71px e rótulos como “COMPLEXIDADE” vazam sobre o vizinho — teste de medição registrado no histórico da sessão.

### Callout com título e destaque (`.osa-callout__title`, `.osa-callout__destaque`)

Variação do `.osa-callout` usada na nota de abertura do Portal do Estudante (`#port-nota-hermeneutica`, `.osa-callout--gold`):

- `__title` — `h2` em `--osa-font-display`, no tamanho `--osa-text-lg`; entra automaticamente no índice “Nesta página” (o `buildToc` lê todo `h2[id]` do `main`).
- `__destaque` — parágrafo final em `--osa-font-serif`, separado por filete superior; em tema claro usa `--osa-gold-ink`, em tema escuro `--osa-gold`.
- Conteúdo: a nota sobre o lugar da análise léxico-sintática no processo hermenêutico (texto de curadoria, 24/09/2026), posicionada **antes** do botão “Começar meus estudos”.
