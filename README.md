# Sentido Autêntico · by rogerelizar

Portal educacional **offline-first (PWA)** para o estudo das línguas bíblicas originais — **Hebraico**, **Aramaico** e **Grego Koiné** — com ferramentas interativas e exegese integrada. Todo o conteúdo em **português do Brasil (pt-BR)**.

## Destaques

- **Zero dependências de runtime**: HTML5 semântico, CSS3 modular (design tokens) e JavaScript ES6 puro com módulos `import/export`.
- **100% offline**: Service Worker dedicado com pré-cache completo (56 arquivos), estratégia *stale-while-revalidate* e fallback de navegação.
- **Acessibilidade WCAG 2.2**: FAB com central de acessibilidade — leitura em voz alta (TTS pt-BR), fonte para dislexia, alto contraste, tema escuro, escala tipográfica, redução de movimento —, focus trap em menus, anúncios `aria-live`, skip-link e navegação completa por teclado.
- **Escritas originais nativas**: Unicode com `dir="rtl"` e `lang="he"/"arc"` (Noto Serif Hebrew auto-hospedada) e `lang="grc"` (Noto Serif, incluindo subconjunto grego politônico).
- **Ferramentas que rodam no dispositivo**: analisador interlinear (Gn 1.1, Dn 5.25, Jo 1.1), e transliteradores de hebraico e grego. Nada é enviado a servidores.
- **SEO/GEO**: meta completos, Open Graph, `manifest.webmanifest`, JSON-LD (`WebApplication`), `robots.txt` e `sitemap.xml`.

## Estrutura

```
autenticsense/
├── index.html              # shell do app (semântico, meta/JSON-LD, skip-link, drawer, FAB)
├── manifest.webmanifest    # PWA: instalável, standalone, atalhos
├── sw.js                   # Service Worker (gerado — não editar à mão)
├── robots.txt / sitemap.xml
├── css/
│   ├── tokens.css          # design tokens (claro/escuro, módulos, vidro, sombras)
│   ├── fonts.css           # @font-face locais (gerado por fetch-fonts.py)
│   ├── base.css            # reset, tipografia, escritas bíblicas, modos a11y
│   ├── layout.css          # header glass, drawer, hero, grids, footer, FAB
│   └── components.css      # cards, tabelas, interlinear, abas, formulários, passos
├── js/
│   ├── app.js              # boot: nav, drawer, tema, PWA, delegates
│   ├── router.js           # SPA por hash (offline-friendly)
│   ├── a11y.js             # central de acessibilidade + live regions + focus trap
│   ├── tts.js              # síntese de voz pt-BR (Web Speech API)
│   ├── tools.js            # transliteração hebraica/grega
│   ├── icons.js            # ícones SVG inline
│   ├── components/interlinear.js
│   ├── data/               # alfabetos, niqud, interlineares anotados
│   └── views/              # home, hebraico, aramaico, grego, ferramentas,
│                           # exegese, sobre, 404, routes
└── assets/
    ├── fonts/              # 22 woff2 locais (offline)
    └── icons/              # ícones do app + og.png
```

## Executar localmente

Qualquer servidor estático serve (Service Worker exige `localhost` ou HTTPS):

```bash
cd autenticsense
python3 -m http.server 8000
# abra http://localhost:8000
```

## Build / manutenção

```bash
python3 fetch-fonts.py   # (re)baixa as fontes locais e regenera css/fonts.css
python3 build-sw.py      # regenera sw.js com o pré-cache e versão por hash
```

> Rode `build-sw.py` após **qualquer** alteração de arquivos, para versionar o cache.

## Deploy

Funciona em qualquer host estático (GitHub Pages, Netlify, Cloudflare Pages…). Antes de publicar, ajuste o domínio de exemplo `autenticsense.example.com` em:

- `index.html` (`canonical`, `og:url`),
- `robots.txt` e `sitemap.xml`.

## Fontes textuais e licença

- AT: tradição massorética (edições BHS/BHQ) · NT: texto crítico grego (NA28/UBS5). Glosas e notas pedagógicas são conteúdo educacional original.
- Conteúdo educacional: uso livre com atribuição. Código: MIT.

## Privacidade

Sem contas, cookies de terceiros, telemetria ou rastreamento. As ferramentas processam tudo localmente.
