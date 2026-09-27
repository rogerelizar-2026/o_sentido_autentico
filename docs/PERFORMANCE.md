# Performance — medições, orçamentos e o que NÃO foi medido

**Data:** 2026-09-23  
**Configuração idêntica para “antes/depois”:** este repositório é a **primeira versão** — não há baseline anterior neste ambiente (nenhum repositório original foi fornecido). Por isso **não há comparação antes/depois legítima**: apenas a medição absoluta da versão 1.0.0.

**Ambiente:** servidor local `python3 -m http.server`, Chromium headless via Playwright, **sem rede externa**, cache frio, uma aba.

## 1. Orçamentos de asset (gzip nível 9) — medido

| Recurso | Medido | Orçamento | Status |
|---|---:|---:|---|
| JS primeiro partido (11 módulos eager) | **22,6 KB** | ≈100 KB | ✅ |
| CSS crítico (tokens+fonts+base+components) | **9,9 KB** | ≈40 KB | ✅ |
| Fonts críticas (Inter 400+600 WOFF2, brutas) | 48,1 KB | preload só essas 2 | ✅ |
| Chunk lazy `js/charts.js` (gzip) | 5,2 KB | sob demanda | ✅ |
| JSON de dados (recursos+metódos, gzip) | 8,2 KB | — | ✅ |
| HTML 4 páginas (soma gzip) | 39,6 KB | — | ✅ |

Detalhe por arquivo: `docs/performance-assets.json`.

**Ausentes por decisão:** Chart.js e jsPDF **não são usados** (gráficos SVG nativos; PDF = impressão). Zero requisições a CDNs em runtime.

## 2. Métricas Core Web Vitals

| Métrica | Status |
|---|---|
| LCP ≤ 2,5 s (p75 de campo) | **não verificada em campo** — sem Chrome UX Report/Lighthouse neste ambiente |
| INP ≤ 200 ms | **não verificada em campo** |
| CLS ≤ 0,1 | **não verificado em campo**; mitigado por `width/height` em imagens, fontes `swap` com métricas fallback e ausência de banners dinâmicos |
| Lighthouse mobile (Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95) | **não executado** — Lighthouse não instalado; **não alegamos scores** |

### Smoke local (não substitui Lighthouse)

- 4 páginas carregam sem `pageerror` em visita dupla (teste “sem erros de console”).
- axe (a11y) verde nos 8 cenários → alvo A11y ≥95 é consistente com 0 critical/serious, mas **não é o score Lighthouse**.
- SPA-like: nenhum framework; JS em `type="module"` (não bloqueia parsing do corpo).

## 3. Estratégias aplicadas

- ES modules + import dinâmico de `charts.js` apenas em páginas de idioma.
- Imagens: SVG onde possível; PNG de ícone pequenos; `loading="lazy"` + `width/height` no infográfico (não é LCP).
- `IntersectionObserver` em vez de listeners globais de scroll para leitura/checklist.
- Service worker precache mínimo; nada de workbox pesado.
- Sem `transition:all`; `prefers-reduced-motion` desliga animações.

## 4. Como reproduzir as medições

```bash
python3 -m http.server 4173
# orçamentos:
python3 - <<'PY'
import gzip, pathlib
root = pathlib.Path('.')
files = ['js/main.js','js/theme.js','js/storage.js','js/sidebar.js','js/onboarding.js','js/nav.js','js/ui.js','js/a11y.js','js/catalog.js','js/pwa.js','js/export.js']
print(sum(len(gzip.compress((root/f).read_bytes(), 9)) for f in files), 'B js gzip')
PY
# testes:
npm test
```

Para Lighthouse real: instalar `chrome-lighthouse`/extensão em ambiente com Chrome e registrar os scores aqui (campo aberto para o curador preencher).

## 5. Limitações

1. Sem field data (CrUX) — percentis 75 não aplicáveis.
2. Sem baseline “antes” (versão legada não fornecida).
3. HTTP local não reproduz latência de CDN/GitHub Pages.
