# Auditoria completa — O Sentido Autêntico

**Data:** 24 de setembro de 2026
**Escopo:** 6 páginas publicadas (`index.html`, `hebraico-aramaico.html`, `grego-koine.html`, `caixa-de-ferramentas.html`, `offline.html`, `404.html`), catálogo de 20 recursos, explorador dos 25 métodos, PWA/service worker, fontes, imagens, links externos e documentação de dono.
**Ambiente de medição:** Chromium headless (Playwright) contra servidor local `http://127.0.0.1:4173` + sondagens estáticas (Python/`curl`). Nada foi estimado "a olho": todo número abaixo saiu de medição automatizada.
**Dados brutos:** `tests/audit.mjs` → JSON preservado em **`docs/auditoria-dados-2026-09-24.json`** (11 KB) + script de cobertura de fontes (`fontTools`) + sondagem de 30 URLs externas.

**Regra desta auditoria:** só entra aqui o que foi medido. Onde a medição não permitiu concluir, o item aparece marcado como *inconclusivo* com o motivo — e há uma seção específica de **falsos alarmes** que a própria auditoria derrubou na segunda passada.

---

## 1. Resumo executivo

| Área | Veredito | Evidência principal |
|---|---|---|
| Acessibilidade (axe, claro + escuro) | **Conforme** | **zero violações** em 6 páginas × 2 temas — *após as correções de 24/09/2026* (antes: 3 avisos moderados) |
| Responsividade 320–1440 px | **Conforme** | 0 overflow horizontal em 7 larguras × 3 páginas; 160% de fonte sem quebra |
| Contraste | **Conforme** | Claro: 5,26–14,89:1 (todos ≥ AA). Escuro: 6,18–13,48:1 |
| Foco visível / teclado | **Conforme** | 8 primeiros tab stops com anel de 2 px `rgb(15,76,129)` |
| Impressão / PDF | **Conforme** | PDF real de 22 páginas contendo a tabela comparativa dos 25 métodos |
| PWA / offline | **Conforme** | 46 URLs no precache, `offline.html` válida, barra de atualização |
| Desempenho de peso | **Conforme** | fontes 412 KB, capas 388 KB (maior: 112 KB), JS 136 KB, CSS 68 KB; gzip 40,6→7,8 KB no CSS |
| Honestidade editorial | **Conforme** | nenhuma métrica inventada; rótulos "(est.)" e a frase "Estimativas editoriais de setembro de 2026…" visíveis |
| Licença | **Conforme** | CC BY-NC-SA 4.0 nas 6 páginas; **0** ocorrências de "Todos os direitos reservados." em HTML/JS/JSON/CSS |
| Hiperlinks externos | **Corrigido em parte** | ETCBC corrigido para `/bhsa/` (200); **resta decidir o substituto do Bible Atlas** (domínio sem DNS); 3 não verificáveis, 4 com bloqueio anti-robô |
| Âncoras internas | **Corrigido** | `#cat-colecao` → `#panel-colecao` (gerador + regeneração) e o painel abre em modo coleção; 6 páginas com **0 âncoras quebradas** e teste de regressão |
| SEO / dados estruturados | **Corrigido** | `og:url` absoluto nas 4 páginas de conteúdo — `https://rogerelizar-2026.github.io/o_sentido_autentico/` — sincronizado com `sitemap.xml` e `package.json`; páginas de apoio com `robots noindex` |
| Estrutura de títulos | **Corrigido** | títulos de nível e de gráfico em `h3`: nenhum salto em 4 páginas, com teste de regressão |
| Fontes de escrita original | **Corrigido** | Hebraico: niqqud + cantilação completos. Grego politônico: `noto-serif-greek-ext-400.woff2` com **233/256** do bloco — cobre **100% dos caracteres usados** |

**Placar de achados:** 3 defeitos confirmados que afetam o usuário (P0) · 1 lacuna de alto valor (P1) · 5 ajustes de média prioridade (P2) · 2 de baixa prioridade (P3) · 4 falsos alarmes derrubados na revisão.

## 1.1 O que já foi corrigido (24/09/2026)

Executados os itens que **não** dependiam de decisão editorial:

| Achado | Situação | Verificação |
|---|---|---|
| **N1** âncora `#cat-colecao` | ✅ corrigido no gerador e nas páginas; o deep link passa a ativar a aba "Minha coleção" | teste *"Minha coleção leva ao painel existente"* + 0 âncoras quebradas em 6 páginas |
| **N2** ETCBC · 404 | ✅ `https://etcbc.github.io/bhsa/` (responde 200) no catálogo e na lista de recursos | `grep` + teste de referências internas |
| **N4** grego politônico | ✅ `noto-serif-greek-ext-400.woff2` (5,5 KB) declarado para `U+1F00-1FFF`; `unicode-range` da face grega corrigido para `U+0370-03FF`; precache 46 URLs | teste de proveniência por métricas (larguras @100px = advance/unitsPerEm) + `verify-portatil` |
| **N5** SEO | ✅ `og:url` nas 4 páginas de conteúdo; `offline.html` com `robots noindex, follow` | teste *"og:url presente e coerente"* |
| **N6** saltos h2→h4 | ✅ níveis e títulos de gráfico em `h3` (mesmo tamanho visual, via classe) | teste *"hierarquia de títulos sem saltos de nível"* |
| **A3** links de 23 px | ✅ `.osa-resource__title a` com alvo de 24 px | teste *"links de título do catálogo têm alvo de toque de 24px"* |
| **region** `#tts-note` | ✅ dentro de `<aside class="osa-tts-note">` | teste *"aviso da leitura em voz alta fica dentro de um landmark"* + axe |

Resultado medido depois da rodada: **axe sem violações em 6 páginas × 2 temas**, **153 testes** passando (eram 139) e **40 verificações** do teste de pendrive (eram 38), nas duas pastas portáteis. **Pendente de decisão da curadoria:** substituto do recurso *Bible Atlas*, os 3 links não verificáveis e a menção à frase de direitos autorais em `docs/LIMITACOES-PERGUNTAS.md`.

---

## 2. Pontos positivos

### 2.1 Acessibilidade — o item mais forte do projeto

- **axe-core: zero violações em 6 páginas × 2 temas (claro/escuro)** — no levantamento inicial eram 5 páginas com 0 *critical* / 0 *serious* e 3 avisos *moderate*; após as correções, 6 páginas (incluído o `404.html`) sem violação alguma. Isso é o critério de aceitação da spec e ele se sustenta na medição, não só na intenção.
- Os 3 avisos remanescentes são `moderate` e de baixo impacto real: `region` (conteúdo `#tts-note` fora de um *landmark*) e `heading-order` (salto h2→h4). Nenhum bloqueia uso.
- **Contraste no tema claro:** tinta 14,89:1 · texto secundário 7,21 · *muted* 5,63 · dourado sobre papel 5,26 · botão primário 13,03 · *badges* 5,37–12,27. Todos acima de AA, a maioria acima de AAA.
- **Contraste no tema escuro:** corpo 8,84:1 · rótulo de métrica 6,18 · *tag* 8,84 · *badge* 7,55 · *muted* 7,29 · nome do método 13,48 · contador 9,82.
- **Foco de teclado consistente:** os 8 primeiros tab stops apresentam `outline: solid 2px rgb(15,76,129)` — navegação por teclado tem retorno visual claro.
- **Alvos de toque majoritariamente corretos** em 390 px: na `index.html` os 12 elementos abaixo de 24 px são **todos** links dentro de frase (isenção explícita do critério 2.5.8); o *checkbox* de favoritos mede 22×22 px, mas seu `<label>` associado mede **172×44 px**, o que forma um alvo efetivo bem acima do mínimo.
- **Zoom/ampliação:** com fonte ampliada a 160%, nenhuma quebra de layout ou perda de conteúdo em `caixa-de-ferramentas.html`.

### 2.2 Conteúdo e honestidade editorial

- A frase **"Estimativas editoriais de setembro de 2026 (0–10 e semanas) — para comparar perfis, não são resultados de pesquisa"** está presente e visível; não há métrica fabricada, percentual de conclusão, sequência de dias ou conquista artificial em lugar nenhum.
- Rótulos "(est.)" acompanhados do texto completo em `title` e em texto para leitores de tela — a abreviação visual não esconde a ressalva.
- **Licença coerente:** CC BY-NC-SA 4.0 referenciada nas 6 páginas; **nenhuma** ocorrência da frase proibida no que é servido ao usuário.
- Nota de abertura do Portal do Estudante no lugar contratado (antes do botão "Começar meus estudos"), com o título que entra no sumário "Nesta página" e permite link direto.

### 2.3 Robustez técnica e offline

- **PWA completo:** 46 URLs no precache, `offline.html` própria (0 violações axe), barra de atualização só quando há versão nova, caches com nome próprio e remoção apenas do que é do próprio app.
- **Sem CDN em tempo de execução:** fontes, bibliotecas de gráficos e biblioteca de PDF são locais e fixadas por versão.
- **Integridade de entrega:** 3 zips reconstruídos com `unzip -t` limpo; hashes e tamanhos em `CONFERIR-INTEGRIDADE.txt`.
- **Suíte automatizada:** 153 testes passando / 1 ignorado (`npx playwright test`), incluindo 7 testes de regressão criados a partir desta auditoria, e **40/40 verificações** do teste de pendrive nas duas pastas portáteis.
- **Impressão:** o PDF gerado a partir da página real tem 22 páginas e **contém a tabela comparativa dos 25 métodos** aberta (39.071 caracteres extraíveis) — a expansão automática para impressão funciona de fato.
- **Higiene de marcação:** nenhum `id` duplicado; todas as imagens com `alt` (vazio apenas quando decorativas); **todos** os recursos referenciados existem no disco.

### 2.4 Desempenho e peso

| Ativo | Tamanho | Observação |
|---|---|---|
| Fontes | 412 KB | 10 `@font-face` (Inter, Cinzel, Noto Serif Hebrew, Noto Serif, OpenDyslexic) |
| Capas de livros | 388 KB | maior arquivo 112 KB (`rega-nocoes-grego.jpg`) |
| JavaScript | 136 KB | inclui o pacote portátil |
| CSS | 68 KB | `components.css` 40,6 KB → **7,8 KB gzip** |
| Páginas HTML | 33–42 KB | → 8–12 KB gzip |
| Repositório (zip) | 5,24 MB | `sha256 204f6c1e…` |

Resultado: primeira visita leve, sem requisições externas, com compressão muito eficaz no que é texto.

### 2.5 Cobertura tipográfica do hebraico

- `noto-serif-hebrew-400/700` cobre **niqqud completo e os te'amim (cantilação)** — o diferencial técnico mais difícil do projeto está resolvido.
- **OpenDyslexic** com cobertura verificada para o modo de leitura acessível.

---

## 3. Pontos de atenção

Itens que **não são defeito confirmado**, mas exigem decisão, verificação manual ou têm risco de degradar em outro ambiente.

| # | Item | Situação medida | O que fazer |
|---|---|---|---|
| A1 | 3 links externos não verificáveis deste ambiente | `biblicallanguagecenter.com` (A 45.79.94.81) e `sofiaapp.com` (A 54.243.117.197) resolvem no DNS mas não responderam daqui; `bibleatlas.org` **não tem registro DNS** (ver N3) | Clicar uma vez em cada num navegador comum e confirmar |
| A2 | 4 links com bloqueio anti-robô | `bible.org` (403), `academic-bible.com` ×2 (403), `brill.com` (405) | **Não são defeitos** — são bloqueios a requisições automatizadas; abrem normalmente no navegador |
| A3 | 18 links do catálogo com 23 px de altura | Em `caixa-de-ferramentas.html`, fora de texto corrido (p. ex. "Sofia App" 91×23, "Step Bible" 93×23) | 1 px abaixo do mínimo de 24×24 do critério 2.5.8; aumentar `padding`/`line-height` resolve. A isenção por espaçamento não foi medida |
| A4 | 35 arquivos não referenciados (~4,3 MB) | Capturas de tela, `docs/performance-assets.json`, `screenshots/LEIA-ME.md` | São documentação útil; decidir se ficam no repo publicado ou só no pacote do curador |
| A5 | `.osa-bar` com contraste 1,13:1 | Elemento é `aria-hidden` e decorativo | Nenhuma ação; registrado para não virar alarme falso em auditoria futura |
| A6 | Amostra de contraste escuro | A varredura automática cobre os componentes principais, não cada um dos 25 cartões | Ampliar a amostragem numa próxima passada, se desejado |
| A7 | Frase proibida em documentos de dono | 6 ocorrências de "Todos os direitos reservados." **apenas** em `README.md:72` e `docs/LIMITACOES-PERGUNTAS.md:18` (e cópias), sempre **citando a decisão de removê-la** | Nada é servido ao usuário. Se o curador quiser a frase fora também da documentação, é uma troca de 2 minutos |

---

## 4. Pontos negativos (defeitos confirmados)

### N1 — Âncora quebrada `#cat-colecao` (navegação morta na "Minha Coleção")

- **Onde:** `caixa-de-ferramentas.html` linhas **63** e **357**, e o gerador `tools/build_pages.py:40` (que recria o defeito a cada regeneração).
- **Medido:** não existe nenhum elemento com `id="cat-colecao"`; o alvo real do painel é `#panel-colecao` (linha 170).
- **Efeito no usuário:** quem clica no item de menu "Minha Coleção" não é levado a lugar nenhum — a página fica parada. É o caminho de entrada de uma das funções centrais do produto.
- **Correção:** trocar `#cat-colecao` → `#panel-colecao` nas 3 ocorrências e regenerar as páginas. Baixo risco, verificável por teste.

### N2 — Link externo do ETCBC retorna 404

- **Onde:** catálogo (`data/recursos.json`, recurso `etcbc`) e `hebraico-aramaico.html:199`.
- **Medido:** `https://etcbc.github.io/` → **404**. A URL correta existe e responde **200**: `https://etcbc.github.io/bhsa/`.
- **Efeito:** recurso de nível avançado do catálogo inutilizável; contraria a promessa implícita de que o catálogo é confiável.

### N3 — Recurso "Bible Atlas" aponta para domínio inexistente

- **Onde:** catálogo (`data/recursos.json`, recurso `bible-atlas`).
- **Medido:** `bibleatlas.org` **não tem registro A nem AAAA** — o domínio não resolve para lugar nenhum.
- **Efeito:** link morto garantido em qualquer navegador, em qualquer rede.
- **Observação:** a substituição é decisão editorial do curador — a auditoria não inventa um site equivalente. Posso sugerir candidatos e verificar cada um, se o curador autorizar.

### N4 — Grego politônico sem cobertura na fonte embarcada

- **Medido (fontTools/`getBestCmap`):** `fonts/noto-serif-greek-400.woff2` tem **0 de 256** glifos do bloco *Greek Extended* (U+1F00–1FFF) e 121 de 144 dos gregos básicos. Dos 31 caracteres gregos usados no site, **7 não existem em nenhuma fonte embarcada**: `ἀ`, `Ἐ`, `ἦ`, `ἰ`, `ὁ`, `ὖ`, `ῇ`.
- **Diagnóstico correto (correção minha, na revisão da segunda passada):** a face **estava** declarada — `css/fonts.css` já registrava `"Noto Serif"` apontando para `noto-serif-greek-400.woff2` com `unicode-range: U+0370-03FF, U+1F00-1FFF`. O erro era a **declaração prometer cobertura que o arquivo não tem**: o `unicode-range` anunciava o bloco extendido e o arquivo vinha sem esses glifos. A regra `.grc` → `var(--osa-font-serif)` estava certa. (A primeira redação deste item afirmava que a fonte "não estava declarada" — isso era impreciso e está corrigido aqui.)
- **Efeito:** o navegador selecionava a face para `U+1F00–1FFF` e, ao não encontrar o glifo, caía no **fallback do sistema** — o politônico aparecia na maioria dos computadores, mas por sorte, e podia virar quadrado vazio em aparelhos com poucas fontes.
- **Volume:** 22 caracteres politônicos no conteúdo (12 em `grego-koine.html`, 5 em `hebraico-aramaico.html`, 5 em `index.html`) — pequeno, mas de alto valor simbólico num portal de grego.
- **Status: corrigido.** `fonts/noto-serif-greek-ext-400.woff2` (5,5 KB, família "Noto Serif", mesmos OFL) cobre **233/256** do bloco extendido e **todos** os caracteres usados; a face grega básica passou a declarar só `U+0370-03FF` (a faixa que o arquivo realmente cobre). Verificação: as larguras medidas no navegador @100px batem com `advance/unitsPerEm` do próprio arquivo (`ἀ` 63,9→64 · `ῇ` 61,4→61 · `λ` 58,3→58), o que prova que o glifo vem do arquivo embarcado — teste automatizado *"grego politônico: face declarada, arquivo embarcado e usado no rendering"*, nos dois projetos e também na verificação da versão portátil.

### N5 — Lacunas de SEO

- `og:url` **ausente nas 6 páginas** (as demais tags Open Graph existem) — compartilhamento social fica sem URL canônica declarada. **Status: corrigido** nas 4 páginas de conteúdo, agora com a URL real do projeto (`https://rogerelizar-2026.github.io/o_sentido_autentico/`); `offline.html` e `404.html` não têm Open Graph por serem páginas de apoio.
- `rel="canonical"` **presente em 4 de 6** páginas: falta em `offline.html` e `404.html`. **Decisão tomada:** em vez de canônico, essas duas receberam `robots noindex` (o `404` já tinha) — é o tratamento correto para páginas de apoio, e elas seguem fora do `sitemap.xml`.
- `sitemap.xml` com 4 URLs — coerente com o que deve ser indexado.
- **Atualização (24/09/2026):** o curador criou o repositório `rogerelizar-2026/o_sentido_autentico` e a base real `https://rogerelizar-2026.github.io/o_sentido_autentico/` foi preenchida em `og:url`, `sitemap.xml` e `package.json.homepage`; um teste automatizado falha se os três saírem de sincronia. Os `canonical` seguem relativos (`./pagina.html`) e acompanham qualquer base.

### N6 — Saltos de nível em títulos (h2 → h4)

- **Medido (axe `heading-order`):** 2 nós em `hebraico-aramaico.html` e 2 em `grego-koine.html` — `#chart-scatter > h4` ("Complexidade × tempo até retornos práticos") e `#heb-nivel-1 > h4` ("Fundação", e o equivalente grego).
- **Efeito:** quem navega por títulos com leitor de tela perde a hierarquia em dois pontos. Não bloqueia uso; é ajuste de marcação (h4 → h3, ou um h3 de seção acima).

---

## 5. Riscos e problemas por prioridade

### P0 — corrigir antes de divulgar

| # | Problema | Impacto no usuário | Custo |
|---|---|---|---|
| N1 | Âncora `#cat-colecao` quebrada (×2 + gerador) | Menu leva a lugar nenhum | 3 linhas + regeneração |
| N2 | ETCBC → 404 | Recurso do catálogo inutilizável | 2 linhas (URL correta já verificada) |
| N3 | `bibleatlas.org` sem DNS | Link morto garantido | 1 linha, **depende de escolha do curador** |

*Risco associado:* os três são falhas de *link*. Enquanto existirem, o catálogo deixa de poder ser descrito como "todos os links verificados" — e essa frase está na lógica de confiança do produto. Correção conjunta é barata e verificável por teste automatizado.

### P1 — alto valor, corrigir em seguida

| # | Problema | Impacto | Custo |
|---|---|---|---|
| N4 | Grego politônico fora da fonte embarcada + fonte grega não aplicada + arquivo baixado e não usado | Rendering de grego depende do sistema; risco de tofu em aparelhos pobres em fontes; quebra de credibilidade num portal de grego | Médio (obter subset OFL, declarar, apontar `.grc`, ajustar precache) |

### P2 — médio

| # | Problema | Impacto | Custo |
|---|---|---|---|
| N5 | `og:url` ausente (6 páginas); `canonical` ausente em 2 | Compartilhamento e indexação piores | Baixo |
| A1 | 3 links externos não verificáveis deste ambiente | Risco de link morto passar despercebido | Baixo (clique manual) |
| N6 | 2 saltos h2→h4 em 2 páginas | Navegação por títulos degradada | Baixo |
| A3 | 18 links com 23 px de altura | Alvo 1 px abaixo do mínimo | Baixo |
| `region` | `#tts-note` fora de *landmark* (4 páginas) | Aviso axe *moderate*; atalhos de região mais confusos | Baixo |

### P3 — baixo

| # | Item | Situação |
|---|---|---|
| A4 | 35 arquivos não referenciados (~4,3 MB) | Decisão de curadoria, não defeito |
| A7 | Frase proibida em docs de dono (só citando a decisão) | Nada servido ao usuário |
| — | Nenhuma outra dívida técnica crítica encontrada nas varreduras (IDs, âncoras, recursos, PWA, suíte de testes) | — |

---

## 6. Sugestões de melhoria UX/UI

Sugestões — **não** são defeitos. Ordenadas por retorno sobre esforço.

### Curto prazo (baixo esforço, ganho visível)

1. **Faixa "Continua de onde você parou" na entrada.** Com o catálogo, os favoritos e o progresso já guardados localmente, o Portal pode destacar 3 recursos favoritos e o último método aberto. Sem gamificação, sem percentual falso — só retomada de contexto.
2. **Verificação de link no próprio produto.** Um botão discreto "Conferir links externos" no catálogo que testa os 20 recursos quando o usuário está online (e apenas informa; nunca corrige nada sozinho). Reduz a dependência de auditorias manuais.
3. **Estados vazios mais úteis nos filtros.** Quando um filtro devolve 0 métodos, dizer *por que* (que filtro excluiu quantos) e oferecer "limpar apenas este filtro". É o ponto onde o explorador dos 25 métodos mais pode frustrar.
4. **Rótulo explícito de tema e idioma no topo do conteúdo.** O portal já trata hebraico RTL e grego LTR corretamente; um selo "Texto em hebraico — lido da direita para a esquerda" logo acima do primeiro trecho evita a hesitação de quem chega pela primeira vez.
5. **Selo de tempo de leitura por seção.** Estimativas editoriais do próprio curador, rotuladas como tal, ajudam o estudante a decidir onde entrar em uma página de 6.000 px.

### Médio prazo

6. **Sumário lateral persistente nas páginas longas** (`hebraico-aramaico` e `grego-koine` são as maiores), com o item ativo marcado — hoje o "Nesta página" resolve, mas não acompanha a rolagem.
7. **Impressão como recurso de primeira classe.** O PDF já funciona; falta um botão rotulado "Imprimir/PDF desta seção" que abra o diálogo **com a seção escolhida expandida**, economizando as 22 páginas quando o estudante quer só os métodos.
8. **Comparador de dois métodos lado a lado.** O explorador mostra um perfil por vez; escolher A e B e ver as métricas confrontadas é o uso natural de quem está decidindo por onde estudar.
9. **Anotação local por recurso.** Uma nota de texto curta por item do catálogo, guardada no mesmo armazenamento versionado já existente, exportada no JSON do usuário. Zero servidor, ganho alto para quem estuda.
10. **Preferência de tipografia para o texto original** (tamanho dedicado para hebraico/grego, além do zoom geral). Quem lê niqqud em tela pequena agradece; a infraestrutura de tokens já existe.

### Longo prazo

11. **Modo "só conteúdo original"** — esconder a interface analítica e mostrar apenas o texto hebraico/grego com tradução e glosa, para quem quer ler, não comparar.
12. **Checklist de estudo exportável** em Markdown, gerado a partir das fichas dos métodos, para o estudante levar para fora do site — sem sincronização, sem conta, sem promessa de progresso.

---

## 7. Falsos alarmes derrubados nesta auditoria (transparência)

Registro porque **auditoria que só acumula suspeitas não serve**. Estes quatro itens apareceram na primeira passada e foram derrubados na segunda, com o motivo técnico:

1. **Contraste escuro de `.osa-metodo__aplicacao` = 2,17:1** (parecia falha grave). Causa: o medidor pegou o **fundo translúcido do próprio elemento** (dourado com 10% de opacidade) e tratou como opaco. Recomposto com a superfície real do cartão, o contraste fica **≈11,4:1 contando o véu dourado** (13,5:1 se contado apenas sobre a superfície) — **AAA nos dois casos**. Não há defeito. *Melhoria correspondente proposta no auditor: compor camadas alfa antes de calcular contraste.*
2. **`input#filter-fav` com 22×22 px.** O alvo efetivo é o `<label>` associado, que mede **172×44 px**. Não é violação.
3. **"Tabela dos 25 métodos não abre para impressão".** O instrumento de medição (`emulateMedia('print')`) não dispara o evento de impressão. Gerando um **PDF real** de 22 páginas, a tabela aparece e o estado é restaurado depois. O produto está correto; a técnica de medição estava errada.
4. **403/405 em `bible.org`, `academic-bible.com`, `brill.com` e `scholar.google.com`.** Bloqueio a requisições automatizadas (e a URL-modelo com `q=` vazio), não links quebrados. Os botões de busca externa, aliás, ficam desabilitados com o campo vazio — comportamento verificado.

---

## 8. Metodologia, cobertura e limites

**Instrumentos:** `tests/audit.mjs` (axe-core claro + escuro em 5 páginas — ampliado para 6 na reverificação pós-correção; overflow em 320/360/390/430/768/1024/1440; alvos de toque em 390; contraste escuro; estrutura de títulos; emulação de impressão; foco; fonte a 160%) · varredura estática (IDs duplicados, âncoras, `alt`, existência de recursos, arquivos órfãos, gzip) · `fontTools`/`getBestCmap` por bloco Unicode · sondagem `curl` de 30 URLs externas com resolução DNS independente · geração de PDF real com extração de texto.

**Limites declarados:**
- Os 3 links não verificáveis desta rede continuam **não verificados** — listados em A1, não em "quebrados".
- Bloqueios anti-robô impedem verificação automatizada de 4 sites; verificação manual indicada.
- A varredura de contraste do tema escuro é por amostragem de componentes, não exaustiva.
- A isenção de espaçamento do critério 2.5.8 para os 18 links de 23 px **não** foi medida (só a altura).
- Nada aqui foi inferido de "como deveria ser": o que não foi medido está marcado como não medido.

---

## 9. Próximos passos propostos

1. ~~Fechar os 3 P0~~ → **N1 e N2 feitos**; falta apenas a escolha do substituto do **Bible Atlas** (domínio sem DNS), que é decisão editorial.
2. ~~Resolver o grego politônico~~ → **feito**, com verificação por métricas de fonte.
3. ~~Empacotar os P2~~ → **feito** (SEO, títulos, alvos de 24 px, `region`).
4. **Decidir sobre A4/A7** (manter as 35 capturas/documentos no repositório publicado; manter ou reescrever a menção à frase de direitos autorais em `docs/LIMITACOES-PERGUNTAS.md`).
5. **Verificar manualmente os 3 links externos** que não respondem a partir deste ambiente (`biblicallanguagecenter.com`, `sofiaapp.com` — e o *Bible Atlas* já confirmado morto) e escolher os substitutos.
6. **Escolher 2 ou 3 sugestões de UX** da lista da seção 6 para uma próxima entrega — as de curto prazo são as de melhor retorno.

*Depois desta rodada, o site foi reconstruído: 3 zips íntegros, pastas sem compactar atualizadas e hashes novos em `CONFERIR-INTEGRIDADE.txt`.*
