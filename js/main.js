/* ==========================================================================
 * main.js — bootstrap por página. Todos os listeners verificam a existência
 * dos alvos (INVARIANTE 2). Uma única implementação de tema (INVARIANTE 2).
 * ========================================================================== */

import { initTheme } from './theme.js';
import { initSidebar, ensureSidebarApi } from './sidebar.js';
import { initOnboarding } from './onboarding.js';
import {
  markActiveNav, redirectLegacyHashIfAny, buildToc, initDeepLinks,
  initReadingPosition
} from './nav.js';
import { initA11yToolbar, initTTS } from './a11y.js';
import { initCatalog } from './catalog.js';
import { initPWA } from './pwa.js';
import { migrateLegacyIfNeeded, getResumeTarget, getChecklist, setChecklistItem } from './storage.js';

/** Gráficos + explorador de métodos + ranking apenas nas páginas de idioma. */
async function initLanguageContent() {
  const lang = document.body.dataset.lang;
  const host = document.getElementById('charts-host');
  if (!lang || !host) return;
  const [{ initLanguageCharts, initRanking }, { initMethodsExplorer, initPrintExpanders }] = await Promise.all([
    import('./charts.js'),
    import('./metodos.js')
  ]);
  const tableId = lang === 'he' ? 'heb-methods-table' : 'grk-methods-table';
  const rankId = lang === 'he' ? 'heb-ranking-list' : 'grk-ranking-list';
  initPrintExpanders();
  await Promise.all([
    initMethodsExplorer(tableId),
    initRanking(rankId),
    initLanguageCharts(lang)
  ]);
}

/** Checklist local (marcadores de rotina — não é % de conclusão de lições). */
function initChecklists() {
  document.querySelectorAll('[data-checklist]').forEach((ul) => {
    const pageKey = ul.getAttribute('data-checklist');
    const saved = getChecklist(pageKey);
    ul.querySelectorAll('input[type="checkbox"][data-check]').forEach((cb) => {
      const key = cb.getAttribute('data-check');
      cb.checked = !!saved[key];
      if (cb.dataset.osaBound) return;
      cb.dataset.osaBound = '1';
      cb.addEventListener('change', () => setChecklistItem(pageKey, key, cb.checked));
    });
  });
}

function initResume() {
  const resume = document.getElementById('resume-link');
  if (!resume) return;
  const target = getResumeTarget();
  if (!target) {
    resume.hidden = true;
    return;
  }
  const hrefMap = {
    'portal': './index.html',
    'hebraico': './hebraico-aramaico.html',
    'grego': './grego-koine.html',
    'ferramentas': './caixa-de-ferramentas.html'
  };
  const base = hrefMap[target.pageId] || './index.html';
  resume.hidden = false;
  resume.href = base + '#' + target.anchor;
  const label = document.getElementById('resume-label');
  if (label) {
    label.textContent = `Continuar em “${target.anchor}” (posição de leitura salva neste dispositivo)`;
  }
}

/** Botão do rodapé "PWA instalável" → diálogo com as instruções de uso offline. */
function initPwaHelp() {
  const dlg = document.getElementById('dialog-pwa');
  const botoes = document.querySelectorAll('[data-pwa-help]');
  if (!dlg || !botoes.length) return;
  botoes.forEach((abrir) => {
    if (abrir.dataset.osaBound) return;
    abrir.dataset.osaBound = '1';
    abrir.addEventListener('click', () => {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    });
  });
  dlg.querySelectorAll('[data-pwa-close]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    b.addEventListener('click', () => dlg.close());
  });
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    if (btn.dataset.osaBound) return;
    btn.dataset.osaBound = '1';
    btn.addEventListener('click', async () => {
      const sel = btn.getAttribute('data-copy-target');
      const node = sel ? document.querySelector(sel) : null;
      if (!node) return;
      const text = node.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copiado ✓';
        setTimeout(() => { btn.textContent = 'Copiar prompt'; }, 2000);
      } catch {
        // fallback: seleção manual
        const range = document.createRange();
        range.selectNodeContents(node);
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(range);
      }
    });
  });
}

function boot() {
  migrateLegacyIfNeeded();
  initTheme();
  ensureSidebarApi();
  initSidebar();
  markActiveNav();

  // Redireciona hashes legados de outras páginas (#heb-*, #grk-*) —
  // deve rodar ANTES de tentar focar âncoras locais.
  if (redirectLegacyHashIfAny()) return;

  initOnboarding();
  buildToc();
  initDeepLinks();
  initReadingPosition();
  initA11yToolbar();
  initTTS();
  initResume();
  initCopyButtons();
  initPwaHelp();
  initChecklists();
  initCatalog(); // no-op se a página não tem o catálogo
  initLanguageContent(); // async, no-op fora das páginas de idioma
  initPWA();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
