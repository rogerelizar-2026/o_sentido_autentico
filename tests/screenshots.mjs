/* Gera screenshots rotulados (mobile/desktop × claro/escuro × estados).
 * Executar: node tests/screenshots.mjs  (servidor em 127.0.0.1:4173)
 */
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://127.0.0.1:4173';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

async function acceptTerms(page) {
  const open = await page.evaluate(() => document.getElementById('dialog-termos')?.open);
  if (open) {
    await page.check('#terms-checkbox');
    await page.click('#terms-accept');
    await page.waitForTimeout(200);
  }
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    localStorage.setItem('osa:theme', JSON.stringify(t));
    localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() }));
  }, theme);
}

const browser = await chromium.launch({ args: ['--no-sandbox'] });

// --- Desktop ---
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  // entrada
  await page.goto(BASE + '/index.html');
  await setTheme(page, theme);
  await page.reload();
  await acceptTerms(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}desktop-entrada-${theme}.png`, fullPage: false });

  // onboarding (só light para não duplicar, mas faz nos dois)
  await page.evaluate(() => localStorage.removeItem('osa:terms:accepted'));
  await page.evaluate(() => localStorage.removeItem('osa:terms:presentationSeen'));
  await page.reload();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}desktop-onboarding-termos-${theme}.png`, fullPage: false });
  await setTheme(page, theme);
  await page.reload();
  await acceptTerms(page);

  // catálogo com filtros ativos
  await page.goto(BASE + '/caixa-de-ferramentas.html');
  await acceptTerms(page);
  await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
  await page.fill('#filter-q', 'grego');
  await page.selectOption('#filter-idioma', 'grego');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}desktop-catalogo-filtros-${theme}.png`, fullPage: false });

  // favoritos em Minha coleção
  await page.fill('#filter-q', '');
  await page.selectOption('#filter-idioma', '');
  await page.waitForTimeout(200);
  const favBtns = page.locator('#resource-results .osa-resource button[aria-pressed="false"]').first();
  await favBtns.click();
  await page.click('[data-catalog-tab="colecao"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}desktop-minha-colecao-${theme}.png`, fullPage: false });

  // painel de acessibilidade aberto (inclui o controle ⏱ de auto-ocultar o menu)
  await page.click('#a11y-fab');
  await page.waitForTimeout(300);
  const painel = page.locator('#a11y-panel');
  await painel.screenshot({ path: `${OUT}desktop-acessibilidade-painel-${theme}.png` });
  await page.click('#a11y-fab');
  await page.waitForTimeout(200);

  // busca externa com termo digitado (Google, Bing, DuckDuckGo, Acadêmico)
  await page.click('[data-catalog-tab="catalogo"]');
  await page.fill('#filter-q', 'léxico hebraico');
  await page.waitForTimeout(400);
  const blocoExterno = page.locator('#cat-busca .osa-external-search');
  await blocoExterno.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await blocoExterno.screenshot({ path: `${OUT}desktop-busca-externa-${theme}.png` });

  // análise dos 25 métodos: controles + cartões (topo da lista)
  await page.goto(BASE + '/hebraico-aramaico.html');
  await acceptTerms(page);
  await page.waitForSelector('.osa-metodo', { timeout: 10000 });
  await page.locator('#heb-metodos').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}desktop-metodos-cartoes-${theme}.png`, fullPage: false });

  // tabela comparativa aberta (com cabeçalhos ordenáveis)
  await page.locator('#heb-metodos .osa-metodos__tabela summary').click();
  await page.waitForTimeout(400);
  await page.locator('#heb-metodos .osa-metodos__tabela .osa-table-scroll').screenshot({ path: `${OUT}desktop-metodos-tabela-${theme}.png` });

  // página hebraico
  await page.goto(BASE + '/hebraico-aramaico.html');
  await acceptTerms(page);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}desktop-hebraico-${theme}.png`, fullPage: false });

  await ctx.close();
}

// --- Mobile (drawer) ---
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    ...devices['iPhone 12'],
    browserName: undefined,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/index.html');
  await setTheme(page, theme);
  await page.reload();
  await acceptTerms(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}mobile-entrada-${theme}.png` });

  // drawer aberto
  await page.click('#menu-toggle');
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}mobile-drawer-aberto-${theme}.png` });
  await page.keyboard.press('Escape');

  // onboarding mobile
  await page.evaluate(() => {
    localStorage.removeItem('osa:terms:accepted');
    localStorage.removeItem('osa:terms:presentationSeen');
  });
  await page.reload();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}mobile-onboarding-termos-${theme}.png` });
  await setTheme(page, theme);
  await page.reload();
  await acceptTerms(page);

  // análise dos 25 métodos no celular (cartões compactos, detalhe recolhido)
  await page.goto(BASE + '/hebraico-aramaico.html');
  await acceptTerms(page);
  await page.waitForSelector('.osa-metodo', { timeout: 10000 });
  await page.locator('#heb-metodos').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}mobile-metodos-cartoes-${theme}.png` });

  // busca externa no celular
  await page.goto(BASE + '/caixa-de-ferramentas.html');
  await acceptTerms(page);
  await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
  await page.fill('#filter-q', 'léxico');
  await page.waitForTimeout(400);
  const blocoMobile = page.locator('#cat-busca .osa-external-search');
  await blocoMobile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await blocoMobile.screenshot({ path: `${OUT}mobile-busca-externa-${theme}.png` });

  await ctx.close();
}

await browser.close();
console.log('Screenshots gravados em screenshots/');
