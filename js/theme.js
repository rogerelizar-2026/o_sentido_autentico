/* ==========================================================================
 * theme.js — implementação única do tema (id canônico: #theme-toggle)
 * Reutilizada em todas as páginas. O bootstrap antiflash vive no <head>.
 * ========================================================================== */

import { getJSON, setJSON, KEYS } from './storage.js';

const STORAGE_THEME = KEYS.THEME; // 'osa:theme' com fallback para 'theme' legado

export function getStoredTheme() {
  const t = getJSON(STORAGE_THEME, null);
  if (t === 'light' || t === 'dark' || t === 'system') return t;
  // aceita valor bruto (sem JSON) gravado por versões anteriores
  const raw = (() => {
    try { return window.localStorage.getItem(STORAGE_THEME); } catch { return null; }
  })();
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  const legacy = (() => {
    try { return window.localStorage.getItem('theme'); } catch { return null; }
  })();
  if (legacy === 'light' || legacy === 'dark' || legacy === 'system') {
    // migra para a chave nova sem apagar a legada
    try { window.localStorage.setItem(STORAGE_THEME, JSON.stringify(legacy)); } catch { /* ignore */ }
    return legacy;
  }
  // Padrão do site: tema claro (não segue o sistema na 1ª visita)
  return 'light';
}

export function resolveTheme(pref) {
  if (pref === 'light' || pref === 'dark') return pref;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(pref) {
  const resolved = resolveTheme(pref);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const next = resolved === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', `Alternar para tema ${next === 'dark' ? 'escuro' : 'claro'}`);
    btn.setAttribute('title', `Alternar para tema ${next === 'dark' ? 'escuro' : 'claro'}`);
    btn.dataset.themeCurrent = resolved;
    // alterna o traço do SVG (sol ↔ lua) sem depender de fontes emoji
    const icon = btn.querySelector('[data-theme-icon] svg');
    if (icon) {
      const path = icon.querySelector('path');
      if (path) {
        path.setAttribute('d', resolved === 'dark'
          ? 'M12 4v2m0 12v2M4 12H2m20 0h-2M6.3 6.3 4.9 4.9m12.8 12.8-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'
          : 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z');
        icon.setAttribute('stroke-linecap', resolved === 'dark' ? 'round' : 'round');
      }
    }
  }
}

export function setTheme(pref) {
  setJSON(STORAGE_THEME, pref);
  applyTheme(pref);
  // Mantém também a chave legada espelhada (sem apagar)
  try { window.localStorage.setItem('theme', pref); } catch { /* ignore */ }
}

/** Inicializa o tema. Seguro de chamar em qualquer página; só registra listener se existir o botão. */
export function initTheme() {
  const pref = getStoredTheme();
  applyTheme(pref);

  const btn = document.getElementById('theme-toggle');
  if (btn && !btn.dataset.osaBound) {
    btn.dataset.osaBound = '1';
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const nextPref = current === 'dark' ? 'light' : 'dark';
      setTheme(nextPref);
    });
  }

  // Respeita mudança do sistema quando o usuário está em "system"
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    if (getStoredTheme() === 'system') applyTheme('system');
  };
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
  else if (typeof mq.addListener === 'function') mq.addListener(onChange);
}
