# Versão portátil para pendrive (execução sem servidor)

Documento do dono do projeto. Explica como gerar, o que muda e como a versão portátil foi verificada.

## 1. O que é

Uma cópia do sistema que roda **direto do pendrive**: o usuário dá dois cliques em `index.html` e o portal funciona **sem internet e sem instalar nada**, com catálogo, currículos, gráficos, favoritos, coleção, importação/exportação JSON e impressão em PDF.

## 2. Por que é preciso um build separado

Abrir o repositório como está, por `file://`, **não** funciona. Dois bloqueios do próprio navegador:

| Bloqueio | Sintoma | Solução no build portátil |
|---|---|---|
| Módulos ES (`<script type="module">`) não carregam em `file://` | tela sem JavaScript, nenhuma interação | os módulos são empacotados em **um** script clássico `js/app.js` (esbuild, IIFE) |
| `fetch('./data/*.json')` é recusado em `file://` | catálogo vazio, gráficos ausentes | os JSON são embutidos em `js/data-portable.js`, que define `window.__OSA_DATA__` |
| `@font-face` de arquivo `.woff2` é bloqueado por CORS (origem `null`) | tipografia cai para a fonte do sistema (hebraico/grego perdem qualidade) | as 12 fontes são embutidas em `css/fonts.css` como **data URI** |
| Registro de service worker | erro no console, PWA indisponível | `js/pwa.js` sai imediatamente quando `location.protocol === 'file:'` |
| `<link rel="preload" as="font">` | erro de CORS no console | preloads removidos na cópia portátil |
| `manifest.webmanifest` / `sitemap.xml` | não se aplicam a `file://` | removidos da cópia portátil |

Nada disso altera o site publicado: as três primeiras linhas de código são guardas que só agem quando os dados embutidos existem ou quando o protocolo é `file:`. A suíte principal continua 98/98.

## 3. Como gerar

```bash
python3 tools/build_usb.py --out dist-usb --zip
```

Saída:

- `dist-usb/O-Sentido-Autentico/` — pasta pronta para copiar ao pendrive;
- `dist-usb/O-Sentido-Autentico-pendrive.zip` — o mesmo conteúdo compactado.

O script copia as 6 páginas, `css/`, `js/`, `icons/`, `fonts/`, `covers/`, `data/`, `docs/`, `downloads/` e `screenshots/`; gera `js/data-portable.js`; embute as fontes; empacota o JS; reescreve as tags de script; escreve `LEIA-ME.html`, `LEIA-ME.txt` e os atalhos de servidor local. Ao final, valida integridade (páginas presentes, bundle com tamanho plausível, nenhum `type="module"`, fontes e dados embutidos) e falha o build se algo estiver fora do lugar.

## 3b. Entrega em arquivos soltos (sem .zip)

Quando o destinatário não consegue usar arquivos compactados, gere a edição de **páginas autossuficientes**:

```bash
python3 tools/build_usb.py --out dist-usb          # base portátil (fontes em data URI + bundle)
python3 tools/build_usb_unico.py                   # gera O-Sentido-Autentico-arquivos-unicos/
```

Cada `.html` resultante traz, dentro de si, CSS (com as fontes), JavaScript (aplicação + dados) e imagens (logo, mapa de aceleração, capas) como data URI — nenhuma pasta ao lado é necessária. São 7 arquivos:

| Arquivo | Tamanho aprox. |
|---|---|
| `index.html` | 1,12 MB |
| `hebraico-aramaico.html` | 0,72 MB |
| `grego-koine.html` | 0,71 MB |
| `caixa-de-ferramentas.html` | 0,69 MB |
| `offline.html` | 0,57 MB |
| `404.html` | 0,56 MB |
| `LEIA-ME.html` | 6 KB |

Mais `COMO-USAR.txt`. Os arquivos devem ficar **na mesma pasta**, pois os links de navegação são relativos entre eles. O custo é o tamanho maior (as imagens e fontes se repetem em cada página) em troca de não haver dependência alguma.

Verificação: a mesma `tests/verify-portatil.mjs` roda contra essa pasta e devolveu **26 OK, 0 falhas**.

## 4. Conteúdo da pasta portátil

```
O-Sentido-Autentico/
├── index.html                     portal (página de entrada)
├── hebraico-aramaico.html         hebraico e aramaico
├── grego-koine.html               grego koiné
├── caixa-de-ferramentas.html      catálogo + coleção + exportação
├── offline.html / 404.html        páginas de apoio (uso por HTTP)
├── LEIA-ME.html / LEIA-ME.txt     instruções para quem recebe o pendrive
├── iniciar-servidor-local.bat/.command/.sh   servidor local opcional (Python)
├── css/                           inclui fonts.css com as fontes em data URI
├── js/app.js                      aplicação empacotada (79 KB)
├── js/data-portable.js            catálogo e métodos embutidos
├── js/fonte/                      módulos ESM originais, para auditoria
├── data/                          os mesmos dados em JSON
├── covers/ fonts/ icons/          capas oficiais, tipografia, ícones
├── docs/                          esta documentação
└── screenshots/                   capturas rotuladas
```

## 5. Atalhos de servidor local (opcional)

`iniciar-servidor-local.bat` (Windows), `.command` (macOS) e `.sh` (Linux) sobem `python -m http.server 4173 --bind 127.0.0.1` e abrem o navegador no portal. Servindo por HTTP, o service worker volta a valer e o portal pode ser instalado como aplicativo — mas o conteúdo já funciona sem isso. Se o Python não existir na máquina, o atalho avisa e a orientação é abrir `index.html` mesmo.

## 6. Limitações declaradas (o que não é possível fingir)

- **PWA/offline page não instalam em `file://`** por decisão dos navegadores; a página `offline.html` acompanha o pacote, mas só é usada quando o site está publicado.
- **Favoritos, coleção e preferências** ficam no `localStorage` do navegador associado à origem `file://`. Funciona em Chrome/Edge e Firefox; perfis com bloqueio de armazenamento local podem não persistir. Por isso a orientação de **Exportar JSON** como backup está escrita no LEIA-ME e no próprio catálogo.
- **Leitura em voz alta** depende das vozes do sistema operacional.
- **Links externos e busca de recursos fora do catálogo** exigem internet (abrem em nova aba).
- **Exportação em PDF** usa o diálogo de impressão do navegador ("Imprimir / Salvar PDF"), sem motor de PDF no cliente — o mesmo comportamento da versão publicada.
- O `sitemap.xml`, as URLs canônicas e o `manifest` continuam sendo assunto da versão web, não da cópia portátil.

## 7. Verificação automatizada

`tests/verify-portatil.mjs` abre a pasta **por `file://`** em Chromium (Playwright, viewport 390×844) e checa 26 pontos. Resultado da última execução: **26 OK, 0 falhas**.

- identidade: marca e `<h1>` renderizados;
- tipografia: `document.fonts.check` confirmando Inter, Noto Serif Hebrew e Noto Serif ativos (fontes em data URI);
- catálogo: 20 fichas em `#resource-results`, contador "20 de 20", busca "gramatica" → 3 resultados (acentos ignorados), filtro de idioma → 8 resultados;
- persistência: favoritar → recarregar → `osa:vault:favorites` mantido e botão em "★ Favoritado";
- dados: exportação JSON dispara download real (199 bytes) e o arquivo reimportado cria o cartão no catálogo e grava em `osa:vault:userResources`;
- conteúdo: 4 gráficos SVG, tabela com 25 métodos, ranking com 10 itens, menções a Anki;
- idioma: nós `[lang="he"]` com `dir="rtl"`;
- infraestrutura: nenhum service worker ativo (esperado), **console sem erros de JS**.

Capturas dessa execução: `screenshots/portatil-file-index-desktop.png`, `portatil-file-index-mobile.png`, `portatil-file-catalogo-desktop.png`, `portatil-file-catalogo-mobile.png`.

Reproduzir:

```bash
python3 tools/build_usb.py --out dist-usb --zip
node tests/verify-portatil.mjs dist-usb/O-Sentido-Autentico
```

## 8. Manutenção

Sempre que o conteúdo das páginas mudar:

1. `python3 tools/gen_pages.py` (regenera as três subpáginas, se aplicável);
2. `python3 tools/build_usb.py --out dist-usb --zip`;
3. `node tests/verify-portatil.mjs dist-usb/O-Sentido-Autentico`;
4. `python3 tools/build_usb_unico.py` (edições de arquivos soltos, se fizer parte da entrega);
5. `npx playwright test` para garantir que a versão publicada segue verde (98 testes).

Licença do conteúdo: **CC BY-NC-SA 4.0**.
