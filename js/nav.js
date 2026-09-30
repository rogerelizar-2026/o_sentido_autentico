/* ==========================================================================
 * nav.js — navegação ativa, "Nesta página", âncoras profundas, leitura
 * ========================================================================== */

import { saveReadingPosition } from './storage.js';

/** Marca link ativo na navegação (bottom nav + sidebar) com aria-current. */
export function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const file = path === '' ? 'index.html' : path;
  document.querySelectorAll('[data-nav-file]').forEach((a) => {
    if (a.getAttribute('data-nav-file') === file) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

/**
 * Redireciona hashes legados carregados na página de entrada para a página dona.
 * #port-* → index.html#… ; #heb-* → hebraico-aramaico.html#… ; #grk-* → grego-koine.html#…
 * @returns {boolean} true se um redirecionamento foi disparado
 */
export function redirectLegacyHashIfAny() {
  const hash = window.location.hash;
  if (!hash) return false;
  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isEntry = file === '' || file === 'index.html';
  if (!isEntry) return false;

  if (hash.startsWith('#heb-')) {
    window.location.replace('./hebraico-aramaico.html' + hash);
    return true;
  }
  if (hash.startsWith('#grk-')) {
    window.location.replace('./grego-koine.html' + hash);
    return true;
  }
  if (hash.startsWith('#cat-') || hash.startsWith('#tools-')) {
    window.location.replace('./caixa-de-ferramentas.html' + hash);
    return true;
  }
  // #port-* permanece na página de entrada
  return false;
}

/** Foco acessível em alvo de âncora (hashchange e carga). */
export function focusAnchorTarget(hash, { flash = true } = {}) {
  if (!hash || hash === '#') return;
  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* keep */ }
  const target = document.getElementById(id);
  if (!target) return;
  // elementos focáveis precisam de tabindex para receber foco sem mudar ordem semântica
  if (!target.hasAttribute('tabindex') && !/^(a|button|input|select|textarea)$/i.test(target.tagName)) {
    target.setAttribute('tabindex', '-1');
  }
  try { target.focus({ preventScroll: true }); } catch { /* ignore */ }
  target.scrollIntoView({ block: 'start', behavior: 'auto' });
  if (flash) {
    target.classList.add('anchor-flash');
    window.setTimeout(() => target.classList.remove('anchor-flash'), 1600);
  }
}

/** Constrói índice "Nesta página" a partir dos h2 da área principal. */
export function buildToc() {
  const toc = document.getElementById('toc');
  const main = document.getElementById('main-content');
  if (!toc || !main) return;
  const headings = [...main.querySelectorAll('h2[id]')];
  const list = toc.querySelector('ol');
  if (!list) return;
  list.textContent = '';
  for (const h of headings) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    list.appendChild(li);
  }
  if (headings.length === 0) toc.hidden = true;
}

/** Grava posição de leitura (distinta de "lições concluídas"). */
export function initReadingPosition() {
  const pageId = document.body.dataset.page;
  if (!pageId) return;

  // Só grava APÓS o usuário realmente rolar — evita "posição" criada
  // automaticamente na primeira pintura sem interação.
  let armed = false;
  const arm = () => { armed = true; };
  window.addEventListener('scroll', arm, { once: true, passive: true });

  const capture = () => {
    if (!armed) return;
    const hs = [...document.querySelectorAll('main h2[id], main h3[id]')];
    if (!hs.length) return;
    const marker = window.scrollY + 120;
    let current = hs[0].id;
    for (const h of hs) {
      if (h.offsetTop <= marker) current = h.id;
      else break;
    }
    saveReadingPosition(pageId, current);
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; capture(); });
  };

  // IntersectionObserver para seções principais (evita handler global pesado)
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      if (!armed) return;
      for (const e of entries) {
        if (e.isIntersecting) {
          saveReadingPosition(pageId, e.target.id);
        }
      }
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    sections.forEach((s) => io.observe(s));
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/** Âncora de entrada + hashchange. */
export function initDeepLinks() {
  if (window.location.hash) {
    requestAnimationFrame(() => focusAnchorTarget(window.location.hash));
  }
  window.addEventListener('hashchange', () => focusAnchorTarget(window.location.hash));
}
