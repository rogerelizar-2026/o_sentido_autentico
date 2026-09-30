# Acessibilidade — verificações e resultados

**Data das verificações:** 2026-09-23 · **Ambiente:** Chromium headless (Playwright) · **Alvo:** WCAG 2.2 AA.

## 1. Verificação automatizada (axe-core 4.10 via @axe-core/playwright)

Tags: `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`.

| Página | Tema claro | Tema escuro |
|---|---|---|
| `/index.html` | ✅ 0 critical/serious | ✅ 0 critical/serious |
| `/hebraico-aramaico.html` | ✅ 0 critical/serious | ✅ 0 critical/serious |
| `/grego-koine.html` | ✅ 0 critical/serious | ✅ 0 critical/serious |
| `/caixa-de-ferramentas.html` | ✅ 0 critical/serious | ✅ 0 critical/serious |

Reproduzir: `npm run test:a11y`.

Violações **moderate/minor** não auditadas neste gate (foco no critério de aceite critical/serious do briefing).

## 2. Verificações manuais (teclado, foco, zoom, toque)

| Verificação | Resultado | Evidência |
|---|---|---|
| Skip link no 1º Tab | ✅ “Pular para o conteúdo principal” foca | teste automatizado |
| Foco visível (`:focus-visible` + anel) | ✅ tokens `--osa-focus-ring` | inspeção CSS |
| Diálogo de termos: foco entra no título, volta ao gatilho ao fechar | ✅ `js/onboarding.js` | teste onboarding |
| Escape fecha gaveta e diálogo sem aceitar termos | ✅ | teste sidebar + cancel |
| Accordions com `<details>/<summary>` nativos (teclado OK) | ✅ | HTML |
| Tabelas largas em região com `role=region tabindex=0` + aria-label | ✅ | `.osa-table-scroll` |
| Bottom nav `aria-current="page"` + peso/barras (não só cor) | ✅ | teste aria-current |
| Favoritos `aria-pressed` + nome acessível | ✅ | `js/catalog.js` |
| Regiões `aria-live` para contagens, toasts e status | ✅ | `#result-count`, toasts |
| Zoom 200% / reflow em 320px | ✅ sem overflow horizontal de página | teste 320px |
| Tap targets ≥ 44×44 CSS px (header, bottom nav, botões) | ✅ | teste mobile |
| Nunca desabilitar zoom (`user-scalable` livre) | ✅ viewport padrão | HTML |
| Contraste (automático axe color-contrast) | ✅ nos 8 cenários | axe |
| Fonte A−/A+/reset, dislexia, alto contraste persistidos | ✅ `js/a11y.js` + bootstrap inline | manual/estado |
| TTS com detecção `speechSynthesis` + aviso honesto pt-BR (HE/GR não pronunciados corretamente) | ✅ `#tts-note` | manual |

## 3. Browsers / engines

| Engine | Status neste ambiente |
|---|---|
| Chromium (Playwright) | ✅ usado em todos os testes e screenshots |
| Firefox | ❌ **indisponível** (binário não instalável aqui) |
| WebKit / Safari | ❌ **indisponível** |
| iOS Safari real | ❌ não testado — guia “Adicionar à Tela de Início” documentado no rodapé |

## 4. Pendências humanas recomendadas

1. Rodar NVDA + Firefox/VoiceOver em máquina do curador.
2. Teste com leitor de tela em trechos `lang="he"`/`lang="grc"`.
3. Reavaliar toolbar flutuante de a11y em telas muito estreitas com fonte 200%.

## Menu lateral: fechar fora e auto-ocultar (WCAG 2.1.1 / 2.2.1)

- **Mesmo comportamento nos dois formatos (25/09/2026):** gaveta no mobile e barra no desktop; a barra abre ao carregar e passa a valer para ela tudo abaixo.
- **Fechar ao tocar/clicar fora:** além do backdrop e do Escape já existentes, um listener de `pointerdown` em fase de captura fecha a gaveta quando o alvo está fora dela — cobre toque e clique em qualquer elemento (cabeçalho, FAB, conteúdo). O próprio botão `#menu-toggle` é exceção, pois ele alterna o estado.
- **Auto-ocultar após 4 segundos de inatividade:** ao abrir, começa uma contagem de 4 s, reiniciada por qualquer interação real (`pointerdown`, `pointermove`, `touchstart`, `touchmove`, `keydown`, `wheel`, `scroll`, `focusin`, `input`). A contagem só roda com a gaveta aberta e é cancelada ao fechar.
- **Controle do usuário (exigência da 2.2.1, "Temporização Ajustável"):** o comportamento **pode ser desligado** no painel de acessibilidade (botão do cronômetro, `data-a11y="drawer-autohide"`), a escolha fica em `osa:a11y:prefs.drawerAutoHide` e persiste entre visitas. Não há limite de tempo que apague dados nem que interrompa leitura: fecha-se apenas o menu, que reabre pelo botão.
- **Anúncio para leitores de tela:** quando o auto-ocultar fecha a gaveta, a região viva anuncia em pt-BR que o menu foi ocultado por 4 s de inatividade e como desligar o comportamento. O foco volta ao botão do menu (restauração de foco preservada).
- Cobertura automatizada: 6 testes × 2 projetos em `tests/osa.spec.mjs` (“Menu lateral: fecha ao tocar fora e oculta-se por inatividade”), incluindo persistência da preferência e ausência de anúncio indevido.
