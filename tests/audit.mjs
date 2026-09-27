/* Auditoria automatizada — O Sentido Autêntico
 * Executar com servidor em http://127.0.0.1:4173
 *   node tests/audit.mjs
 * Saída: relatório em texto no stdout + JSON em /tmp/auditoria.json
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4173';
const PAGINAS = ['index.html', 'hebraico-aramaico.html', 'grego-koine.html', 'caixa-de-ferramentas.html', 'offline.html'];
const LARGURAS = [320, 360, 390, 430, 768, 1024, 1440];
const AXE_IMPACTOS = { critical: 4, serious: 3, moderate: 2, minor: 1 };

const rel = { axe: {}, overflow: {}, toques: {}, contraste: {}, estrutura: {}, print: {}, foco: {}, console: {} };
const log = (...a) => console.log(...a);

const browser = await chromium.launch({ args: ['--no-sandbox'] });

async function aceitar(page, tema = 'light') {
  await page.evaluate((t) => {
    localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() }));
    localStorage.setItem('osa:theme', JSON.stringify(t));
  }, tema);
  await page.reload();
  await page.waitForTimeout(600);
}

/* ---------------- 1. axe (todos os impactos, claro e escuro) ---------------- */
log('\n===== 1. AXE-CORE =====');
for (const arq of PAGINAS) {
  for (const tema of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${arq}`);
    await aceitar(page, tema);
    const res = await new AxeBuilder({ page }).analyze();
    const chave = `${arq} [${tema}]`;
    rel.axe[chave] = res.violations.map((v) => ({ id: v.id, impacto: v.impact, nos: v.nodes.length, ajuda: v.help }));
    if (res.violations.length === 0) log(`  ${chave}: 0 violações`);
    else {
      log(`  ${chave}: ${res.violations.length} violações`);
      res.violations.sort((a, b) => AXE_IMPACTOS[b.impact] - AXE_IMPACTOS[a.impact])
        .forEach((v) => log(`     - [${v.impact}] ${v.id} (${v.nodes.length} nós): ${v.help}`));
    }
    await ctx.close();
  }
}

/* ---------------- 2. overflow horizontal ---------------- */
log('\n===== 2. OVERFLOW HORIZONTAL (scrollWidth > clientWidth) =====');
for (const arq of ['index.html', 'hebraico-aramaico.html', 'caixa-de-ferramentas.html']) {
  const linha = {};
  for (const w of LARGURAS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${arq}`);
    await aceitar(page);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const culpados = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        document.querySelectorAll('body *').forEach((n) => {
          const b = n.getBoundingClientRect();
          if (b.right > de.clientWidth + 2 && n.offsetParent) {
            culpados.push(`${n.tagName.toLowerCase()}.${(n.className || '').toString().split(' ')[0]} right=${Math.round(b.right)}`);
          }
        });
      }
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, culpados: [...new Set(culpados)].slice(0, 4) };
    });
    linha[w] = r;
    log(`  ${arq} @${w}px: scrollWidth=${r.scrollW} clientWidth=${r.clientW} ${r.scrollW > r.clientW + 1 ? 'ESTOURA → ' + r.culpados.join(' | ') : 'ok'}`);
    await ctx.close();
  }
  rel.overflow[arq] = linha;
}

/* ---------------- 3. alvos de toque < 24px (WCAG 2.2 AA) --------------- */
log('\n===== 3. ALVOS DE TOQUE (mínimo WCAG 2.2 = 24×24 CSS px) =====');
for (const arq of ['index.html', 'caixa-de-ferramentas.html']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${arq}`);
  await aceitar(page);
  await page.waitForTimeout(500);
  const pequenos = await page.evaluate(() => {
    const fora = [];
    const sel = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
    document.querySelectorAll(sel).forEach((n) => {
      const b = n.getBoundingClientRect();
      const escondido = !n.offsetParent && getComputedStyle(n).position !== 'fixed';
      if (escondido || b.width === 0 || b.height === 0) return;
      const alvo = 24;
      if (b.width < alvo || b.height < alvo) {
        fora.push({
          el: n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className ? '.' + n.className.toString().split(' ')[0] : ''),
          w: Math.round(b.width), h: Math.round(b.height),
          texto: (n.textContent || '').trim().slice(0, 30)
        });
      }
    });
    return fora;
  });
  rel.toques[arq] = pequenos;
  if (!pequenos.length) log(`  ${arq}: nenhum alvo abaixo de 24×24`);
  else {
    log(`  ${arq}: ${pequenos.length} alvos abaixo de 24×24`);
    pequenos.slice(0, 14).forEach((p) => log(`     - ${p.el} ${p.w}×${p.h} “${p.texto}”`));
  }
  await ctx.close();
}

/* ---------------- 4. contraste real medido no tema escuro ---------------- */
log('\n===== 4. CONTRASTE MEDIDO NO TEMA ESCURO =====');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/hebraico-aramaico.html`);
  await aceitar(page, 'dark');
  await page.waitForSelector('.osa-metodo');
  const amostras = await page.evaluate(() => {
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((c) => { const x = c / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    const fundoDe = (n) => {
      let p = n;
      while (p) {
        const bg = getComputedStyle(p).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && !bg.startsWith('rgba(0, 0, 0, 0)')) return parse(bg);
        p = p.parentElement;
      }
      return [255, 255, 255];
    };
    const alvos = [
      ['corpo (p)', 'p'],
      ['métrica rótulo', '.osa-metodo__metric-label'],
      ['tag de foco', '.osa-tag'],
      ['badge híbrido', '.osa-badge--gold'],
      ['aplicação ao idioma', '.osa-metodo__aplicacao'],
      ['barra (fundo)', '.osa-bar'],
      ['rodapé pequeno', '.osa-metodos__stat-nota'],
      ['texto muted', '.muted'],
      ['nome do método', '.osa-metodo__nome'],
      ['contador', '.osa-metodos__count']
    ];
    return alvos.map(([rot, sel]) => {
      const n = document.querySelector(sel);
      if (!n) return { rot, erro: 'ausente' };
      const cs = getComputedStyle(n);
      const fg = parse(cs.color), bg = fundoDe(n);
      const l1 = lum(fg), l2 = lum(bg);
      const razao = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return { rot, fg: cs.color, bg: `rgb(${bg.join(',')})`, razao: Math.round(razao * 100) / 100, fonte: cs.fontSize };
    });
  });
  rel.contraste = amostras;
  amostras.forEach((a) => log(`  ${a.rot.padEnd(22)} ${a.razao ?? '—'}:1  ${a.fg || ''} sobre ${a.bg || ''} ${a.razao < 4.5 ? '← abaixo de 4.5' : ''}`));
  await ctx.close();
}

/* ---------------- 5. estrutura de cabeçalhos ---------------- */
log('\n===== 5. ESTRUTURA DE CABEÇALHOS =====');
for (const arq of PAGINAS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${arq}`);
  await aceitar(page);
  const r = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({ n: Number(h.tagName[1]), t: h.textContent.trim().slice(0, 42) }));
    const saltos = [];
    for (let i = 1; i < hs.length; i++) if (hs[i].n - hs[i - 1].n > 1) saltos.push(`${hs[i - 1].n}→${hs[i].n}: “${hs[i].t}”`);
    return { h1: hs.filter((h) => h.n === 1).length, total: hs.length, saltos };
  });
  rel.estrutura[arq] = r;
  log(`  ${arq}: h1=${r.h1}, ${r.total} cabeçalhos, saltos de nível: ${r.saltos.length ? r.saltos.join('; ') : 'nenhum'}`);
  await ctx.close();
}

/* ---------------- 6. impressão / PDF ---------------- */
log('\n===== 6. IMPRESSÃO (fallback de PDF) =====');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/hebraico-aramaico.html`);
  await aceitar(page);
  await page.waitForSelector('.osa-metodo');
  await page.emulateMedia({ media: 'print' });
  const r = await page.evaluate(() => {
    const visivel = (sel) => { const n = document.querySelector(sel); return n ? !!n.offsetParent : false; };
    return {
      tabelaAberta: document.querySelector('.osa-metodos__tabela')?.open,
      drawer: visivel('.osa-drawer'), fab: visivel('.osa-a11y-fab-wrap'),
      bottomnav: visivel('.osa-bottomnav'), linksComHref: !!document.querySelector('.osa-metodo a[href^="http"]'),
      barras: document.querySelectorAll('.osa-bar').length
    };
  });
  rel.print = r;
  log(`  media=print → tabela aberta: ${r.tabelaAberta} | drawer: ${r.drawer} | FAB: ${r.fab} | bottomnav: ${r.bottomnav}`);
  await ctx.close();
}

/* ---------------- 7. foco visível e ordem ---------------- */
log('\n===== 7. FOCO VISÍVEL (primeiros 8 elementos) =====');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/index.html`);
  await aceitar(page);
  const passos = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const n = document.activeElement;
      if (!n) return null;
      const cs = getComputedStyle(n);
      return {
        el: n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className ? '.' + n.className.toString().split(' ')[0] : ''),
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
        boxShadow: cs.boxShadow.slice(0, 30)
      };
    });
    passos.push(r);
  }
  rel.foco = passos;
  passos.forEach((p, i) => log(`  ${i + 1}. ${p.el.padEnd(34)} outline: ${p.outline}`));
  await ctx.close();
}

/* ---------------- 8. zoom/tamanho de texto 200% ---------------- */
log('\n===== 8. TEXTO AMPLIADO (escala máxima interna 1,6 = 160%) =====');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/caixa-de-ferramentas.html`);
  await page.evaluate(() => localStorage.setItem('osa:a11y:prefs', JSON.stringify({ fontScale: 1.6 })));
  await aceitar(page);
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
    fonteRaiz: getComputedStyle(document.documentElement).fontSize,
    cartoes: document.querySelectorAll('.osa-resource').length
  }));
  rel.zoom = r;
  log(`  com fonte em 160%: scrollWidth=${r.scrollW} clientWidth=${r.clientW} ${r.scrollW > r.clientW + 1 ? 'ESTOURA' : 'ok'} (fonte raiz ${r.fonteRaiz}, ${r.cartoes} cartões)`);
  await ctx.close();
}

await browser.close();
writeFileSync('/tmp/auditoria.json', JSON.stringify(rel, null, 2));
log('\nJSON salvo em /tmp/auditoria.json');
