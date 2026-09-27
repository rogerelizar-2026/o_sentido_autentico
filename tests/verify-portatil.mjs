/* Verificação da versão portátil (file://) — roda fora do test runner padrão.
 * Uso: node tests/verify-portatil.mjs [caminho-da-pasta]
 */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const dir = path.resolve(process.argv[2] || 'dist-usb/O-Sentido-Autentico');
const url = (f) => pathToFileURL(path.join(dir, f)).href;

const aceitarTermos = async (pg) => {
  // o diálogo só existe na primeira visita; se já foi aceito, fica oculto
  if (!(await pg.locator('#terms-checkbox').isVisible().catch(() => false))) return;
  const cb = await pg.$('#terms-checkbox');
  if (!cb) return;
  await cb.click({ force: true });
  await pg.waitForTimeout(200);
  const btn = await pg.$('#terms-accept');
  if (btn) await btn.click();
  await pg.waitForTimeout(500);
};

const falhas = [];
const ok = [];
const check = (nome, cond, extra = '') => {
  (cond ? ok : falhas).push(nome + (extra ? ` — ${extra}` : ''));
  console.log(`${cond ? '  OK  ' : ' FALHA'} ${nome}${extra ? ' — ' + extra : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const erros = [];
page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') erros.push('console: ' + m.text()); });

// ---------- 1. Portal ----------
await page.goto(url('index.html'));
await page.waitForTimeout(600);
await aceitarTermos(page);

check('portal: marca visível', (await page.locator('.osa-brand__text').first().innerText()).includes('O Sentido Autêntico'));
// nota de abertura: análise léxico-sintática antes do botão de estudos
const nota = await page.locator('#port-nota-hermeneutica').count();
const posOk = await page.evaluate(() => {
  const b = document.querySelector('#port-intro .osa-callout');
  const btn = [...document.querySelectorAll('#port-intro a.osa-btn')].find((a) => a.textContent.includes('Começar meus estudos'));
  return !!(b && btn) && (b.compareDocumentPosition(btn) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
});
check('portal: nota sobre análise léxico-sintática antes do botão de estudos', nota === 1 && posOk, `nota=${nota}, antes=${posOk}`);

check('portal: título h1', (await page.locator('h1').first().innerText()).length > 5);

// Google Fonts local (WOFF2 via file://)
const fontes = await page.evaluate(async () => {
  await document.fonts.ready;
  return {
    total: document.fonts.size,
    inter: document.fonts.check('16px Inter'),
    carregadas: [...document.fonts].filter((f) => f.status === 'loaded').length,
  };
});
check('tipografia local carregada (data URI)', fontes.carregadas > 0, `loaded=${fontes.carregadas}/${fontes.total}`);
const familias = await page.evaluate(async () => {
  await document.fonts.ready;
  const alvo = [['Inter', '16px'], ['Cinzel', '600 16px'], ['Noto Serif Hebrew', '16px'], ['Noto Serif', '16px']];
  return Object.fromEntries(alvo.map(([f, sz]) => [f, document.fonts.check(`${sz} "${f}"`)]));
});
check('fontes-chave disponíveis', familias['Inter'] && familias['Noto Serif Hebrew'] && familias['Noto Serif'],
  JSON.stringify(familias));

// Grego politônico (correção da auditoria de 24/09/2026): os glifos precisam vir
// do arquivo embarcado, não de uma fonte do sistema. Como o navegador não expõe
// cobertura por glifo, comparamos as larguras @100px com as métricas do próprio
// arquivo (advance/unitsPerEm) de noto-serif-greek-ext-400.woff2.
// A entrega pode trazer o arquivo ao lado (pendrive) ou embutido nas páginas
// (arquivos únicos) — a checagem estática cobre os dois formatos.
const raizRepo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fontePolitonica = path.join(raizRepo, 'fonts', 'noto-serif-greek-ext-400.woff2');
const arquivoNaPasta = path.join(dir, 'fonts', 'noto-serif-greek-ext-400.woff2');
const politonicoPresente = existsSync(arquivoNaPasta)
  ? true
  : readFileSync(path.join(dir, 'grego-koine.html'), 'utf8')
      .includes(readFileSync(fontePolitonica).toString('base64').slice(0, 80));
check('fonte do grego politônico presente na entrega (arquivo na pasta ou embutida nas páginas)', politonicoPresente);
const politonico = await (async () => {
  await page.goto(url('grego-koine.html'));
  await page.waitForTimeout(1200);
  return page.evaluate(async () => {
    await document.fonts.ready;
    const c = document.createElement('canvas').getContext('2d');
    const medir = (t) => { c.font = '100px "Noto Serif"'; return +c.measureText(t).width.toFixed(2); };
    return { a: medir('ἀ'), iota: medir('ῇ'), basico: medir('λ') };
  });
})();
check('grego politônico renderiza com a fonte embarcada (ἀ, ῇ e λ batem com as métricas do arquivo)',
  Math.abs(politonico.a - 63.9) < 1.5 && Math.abs(politonico.iota - 61.4) < 1.5 && Math.abs(politonico.basico - 58.3) < 1.5,
  JSON.stringify(politonico));

// Catálogo (dados embutidos, sem fetch) — fica em caixa-de-ferramentas.html
await page.goto(url('caixa-de-ferramentas.html'));
await page.waitForTimeout(500);
await aceitarTermos(page);
await page.waitForSelector('#resource-results .osa-resource', { timeout: 10000 }).catch(() => {});
const cards = await page.locator('#resource-results .osa-resource').count();
check('catálogo renderizado sem fetch', cards >= 15, `${cards} cartões`);
const contagem = (await page.locator('#result-count').innerText().catch(() => '')).trim();
check('contador de resultados', /\d/.test(contagem), contagem);

// Busca sem acento
const busca = page.locator('#filter-q');
await busca.fill('gramatica');
await page.waitForTimeout(400);
const res = await page.locator('#resource-results .osa-resource').count();
check('busca sem acento responde', res >= 1 && res <= cards, `${res} resultados para "gramatica"`);
await busca.fill('');
await page.waitForTimeout(300);

// Busca externa ligada ao termo (funciona igual em file://)
await page.fill('#filter-q', 'léxico hebraico');
await page.waitForTimeout(350);
const hrefGoogle = await page.getAttribute('#cat-busca [data-external-search="google"]', 'href');
const hrefBing = await page.getAttribute('#cat-busca [data-external-search="bing"]', 'href');
const hrefDDG = await page.getAttribute('#cat-busca [data-external-search="duckduckgo"]', 'href');
const hrefScholar = await page.getAttribute('#cat-busca [data-external-search="scholar"]', 'href');
const hrefStep = await page.getAttribute('#cat-externa [data-external-search="stepbible"]', 'href');
const esperado = 'l%C3%A9xico%20hebraico';
check('busca externa: 5 provedores com o termo digitado',
  hrefGoogle === 'https://www.google.com/search?q=' + esperado &&
  hrefBing === 'https://www.bing.com/search?q=' + esperado &&
  hrefDDG === 'https://duckduckgo.com/?q=' + esperado &&
  hrefScholar === 'https://scholar.google.com/scholar?q=' + esperado &&
  hrefStep === 'https://stepbible.org/?q=' + esperado,
  `google=${hrefGoogle}`);
check('rótulo da busca externa mostra o termo', (await page.locator('#cat-busca [data-external-term]').first().innerText()).includes('léxico hebraico'));
await page.fill('#filter-q', '');
await page.waitForTimeout(300);
check('sem termo os botões ficam inertes',
  (await page.getAttribute('#cat-busca [data-external-search="google"]', 'aria-disabled')) === 'true');

// Filtros
const idioma = page.locator('#filter-idioma');
if (await idioma.count()) {
  await idioma.selectOption({ index: 1 }).catch(() => {});
  await page.waitForTimeout(300);
  const filtrados = await page.locator('#resource-results .osa-resource').count();
  check('filtro por idioma aplica', filtrados > 0 && filtrados <= cards, `${filtrados} após filtro`);
  await idioma.selectOption({ index: 0 }).catch(() => {});
  await page.waitForTimeout(200);
}

// Favoritar + persistência no localStorage (file://)
const primeiroTitulo = await page.locator('#resource-results .osa-resource h3').first().innerText().catch(() => '');
const fav = page.locator('#resource-results .osa-resource').first().locator('button[aria-pressed]').first();
let favoritou = false;
if (await fav.count()) {
  await fav.click();
  await page.waitForTimeout(400);
  favoritou = (await fav.innerText()).includes('Favoritado');
  check('favoritar recurso', favoritou, primeiroTitulo.slice(0, 40));
} else {
  check('favoritar recurso', false, 'botão de favorito não encontrado');
}
await page.reload();
await page.waitForTimeout(900);
await aceitarTermos(page);
const lsChaves = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('osa')));
check('armazenamento local funciona em file://', lsChaves.length > 0 && favoritou, lsChaves.join(','));
const favPersist = await page.evaluate(() => localStorage.getItem('osa:vault:favorites'));
check('favorito persistiu após recarregar', !!favPersist && favPersist !== '[]', String(favPersist).slice(0, 60));
const marcadoAposReload = await page.locator('#resource-results .osa-resource').first().locator('button[aria-pressed]').first().innerText().catch(() => '');
check('estado do favorito refletido na interface', marcadoAposReload.includes('Favoritado'), marcadoAposReload.slice(0, 40));

// Exportar JSON (download funciona sem servidor) e importar de volta
await page.waitForTimeout(300);
let exportou = false, tamanhoJson = 0;
try {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 8000 }),
    page.click('[data-export-json]'),
  ]);
  const p = await download.path();
  if (p) { tamanhoJson = (await import('node:fs')).readFileSync(p).length; exportou = true; }
} catch { /* abaixo */ }
check('exportação JSON gera arquivo', exportou, `${tamanhoJson} bytes`);

if (exportou) {
  // Importa de volta o próprio arquivo exportado, com um recurso extra —
  // exatamente o formato real (schema "osa-colecao" / recursosUsuario).
  const fs = await import('node:fs');
  const os = await import('node:os');
  const baixado = await (async () => {
    const [dl] = await Promise.all([
      page.waitForEvent('download', { timeout: 8000 }),
      page.click('[data-export-json]'),
    ]);
    return await dl.path();
  })();
  const payload = JSON.parse(fs.readFileSync(baixado, 'utf8'));
  payload.recursosUsuario = payload.recursosUsuario || [];
  payload.recursosUsuario.push({
    id: 'usb-teste', title: 'Recurso de teste (pendrive)', author: 'Verificação automática',
    description: 'Cartão criado apenas para testar a importação a partir de file://',
    category: 'gramatica', language: 'grego', level: 'iniciante', type: 'livro', free: true,
    link: 'https://example.org/', userAdded: true,
  });
  const alvo = path.join(os.tmpdir(), 'osa-portatil-teste.json');
  fs.writeFileSync(alvo, JSON.stringify(payload, null, 2));

  await page.setInputFiles('#import-file', alvo);
  await page.waitForTimeout(1200);
  const cartoes = await page.locator('#resource-results .osa-resource', { hasText: 'Recurso de teste (pendrive)' }).count();
  check('importação JSON funciona (round-trip)', cartoes >= 1, `${cartoes} cartão importado`);
  const guardado = await page.evaluate(() => {
    const v = JSON.parse(localStorage.getItem('osa:vault:userResources') || '[]');
    return v.some((r) => r.id === 'usb-teste');
  });
  check('recurso importado gravado no armazenamento local', guardado);

  // limpeza do dado de teste (sem apagar nada do usuário)
  await page.evaluate(() => {
    const k = 'osa:vault:userResources';
    const v = JSON.parse(localStorage.getItem(k) || '[]');
    localStorage.setItem(k, JSON.stringify(v.filter((r) => r.id !== 'usb-teste')));
  });
  await page.reload();
  await page.waitForTimeout(800);
  await aceitarTermos(page);
  const restou = await page.locator('#resource-results .osa-resource', { hasText: 'Recurso de teste (pendrive)' }).count();
  check('dados de teste removidos depois da verificação', restou === 0);
}

// Minha coleção + exportação JSON (sem servidor)
await page.waitForTimeout(400);
const abas = await page.locator('[data-catalog-tab]').count();
check('abas Catálogo/Minha coleção', abas === 2, `${abas} abas`);

// ---------- 2. Página de grego: gráficos + tabela ----------
await page.goto(url('grego-koine.html'));
await page.waitForTimeout(1500);
const svgGraf = await page.locator('#charts-host svg').count();
check('gráficos gerados (charts.js empacotado)', svgGraf >= 1, `${svgGraf} svg`);
const linhas = await page.locator('#grk-methods-table tbody tr').count();
check('tabela de 25 métodos preenchida', linhas >= 20, `${linhas} linhas`);
// explorador dos métodos: cartões + filtro + tabela comparativa
const cartoes = await page.locator('.osa-metodo').count();
check('métodos: 25 cartões com barras', cartoes === 25, `${cartoes} cartões`);
const vazando = await page.evaluate(() => [...document.querySelectorAll('.osa-metodo__metric-label')]
  .filter((l) => l.scrollWidth > l.clientWidth + 1).length);
check('métodos: nenhum rótulo de métrica vazando', vazando === 0, `${vazando} vazamentos`);
await page.fill('#grk-methods-table-busca', 'memoria');
await page.waitForTimeout(300);
const filtrados = await page.locator('.osa-metodo').count();
check('métodos: busca sem acento filtra', filtrados > 0 && filtrados < 25, `${filtrados} após "memoria"`);
await page.fill('#grk-methods-table-busca', '');
await page.waitForTimeout(250);
const li = await page.evaluate(() => [...document.querySelectorAll('.osa-metodos__stat')].map((s) => s.textContent.trim()));
check('métodos: resumo derivado com 4 indicadores', li.length === 4, li.join(' | ').slice(0, 70));

const ranking = await page.locator('#grk-ranking-list li').count();
check('ranking de métodos', ranking >= 10, `${ranking} itens`);
const anki = await page.locator('text=/Anki/i').count();
check('seção de Anki presente', anki > 0);

// ---------- 3. Hebraico: RTL / niqqud ----------
await page.goto(url('hebraico-aramaico.html'));
await page.waitForTimeout(1200);
const heNodes = await page.locator('[lang="he"]').count();
const rtl = await page.evaluate(() => {
  const n = document.querySelector('[lang="he"]');
  return n ? (n.getAttribute('dir') || getComputedStyle(n).direction) : null;
});
check('hebraico com lang/dir corretos', heNodes > 0 && (rtl === 'rtl' || rtl === 'auto'), `${heNodes} nós, dir=${rtl}`);

// ---------- 4. Ferramentas ----------
await page.goto(url('caixa-de-ferramentas.html'));
await page.waitForTimeout(1000);
check('ferramentas: h1 presente', (await page.locator('h1').count()) >= 1);
const tocLinks = await page.locator('.osa-toc a, nav[aria-label*="sumário" i] a').count();
check('sumário construído', tocLinks >= 3, `${tocLinks} links`);

// ---------- 5. Sem service worker em file:// ----------
const swCount = await page.evaluate(() => navigator.serviceWorker ? navigator.serviceWorker.controller ? 1 : 0 : 0);
check('nenhum service worker ativo (esperado em file://)', swCount === 0);

// Menu lateral na versão portátil: fecha ao tocar fora e auto-oculta em 4 s
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(url('index.html'));
await page.waitForTimeout(700);
await aceitarTermos(page);
await page.click('#menu-toggle');
await page.waitForTimeout(300);
const abriu = await page.getAttribute('#osa-drawer', 'data-open');
check('menu abre pelo botão', abriu === 'true', 'data-open=' + abriu);
await page.mouse.click(350, 480);
await page.waitForTimeout(400);
check('menu fecha ao clicar fora', (await page.getAttribute('#osa-drawer', 'data-open')) === 'false');

await page.click('#menu-toggle');
await page.waitForTimeout(300);
await page.waitForTimeout(4600);
check('menu auto-oculta após 4 s de inatividade', (await page.getAttribute('#osa-drawer', 'data-open')) === 'false');

await page.click('#a11y-fab');
await page.waitForTimeout(250);
check('controle de auto-ocultar presente no painel de acessibilidade',
  (await page.locator('[data-a11y="drawer-autohide"]').count()) === 1);
await page.click('#a11y-fab');
await page.waitForTimeout(200);

// ---------- console limpo ----------
const ruido = erros.filter((e) => !/favicon/i.test(e));
check('console sem erros de JS', ruido.length === 0, ruido.slice(0, 3).join(' | '));

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(url('index.html'));
await page.waitForTimeout(900);
await page.screenshot({ path: 'screenshots/portatil-file-index-mobile.png', fullPage: false });
await page.goto(url('caixa-de-ferramentas.html'));
await page.waitForTimeout(1200);
await aceitarTermos(page);
await page.screenshot({ path: 'screenshots/portatil-file-catalogo-mobile.png', fullPage: false });
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/portatil-file-catalogo-desktop.png', fullPage: false });
await page.goto(url('index.html'));
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/portatil-file-index-desktop.png', fullPage: false });

await browser.close();

console.log(`\n${ok.length} verificações OK, ${falhas.length} falhas`);
if (falhas.length) {
  console.log('FALHAS:');
  falhas.forEach((f) => console.log(' - ' + f));
  process.exit(1);
}
