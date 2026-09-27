/* ==========================================================================
 * a11y.js — controles de fonte (A−/A+/redefinir), dislexia, alto contraste
 * e leitura em voz alta (speechSynthesis) com avisos honestos em pt-BR.
 * ========================================================================== */

import { getA11yPrefs, setA11yPref } from './storage.js';
import { setAutoHide, isAutoHideOn } from './sidebar.js';

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.6;

function applyFontScale(scale) {
  const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(scale) || 1));
  document.documentElement.dataset.fontScale = String(s);
  // Aumenta o tamanho base sem quebrar layouts mobile (rem no :root via style)
  document.documentElement.style.fontSize = (16 * s) + 'px';
  return s;
}

function applyDyslexia(on) {
  document.documentElement.dataset.dyslexia = on ? 'on' : 'off';
  document.querySelectorAll('[data-a11y="dyslexia"]').forEach((b) => {
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function applyContrast(on) {
  document.documentElement.dataset.contrast = on ? 'high' : 'normal';
  document.querySelectorAll('[data-a11y="contrast"]').forEach((b) => {
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function applyAutoHide(on) {
  document.querySelectorAll('[data-a11y="drawer-autohide"]').forEach((b) => {
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('title', on ? 'Menu oculta sozinho após 4 s (clique para desligar)' : 'Menu não oculta sozinho (clique para ligar)');
  });
}

function setFabOpen(open) {
  const fab = document.getElementById('a11y-fab');
  const panel = document.getElementById('a11y-panel');
  if (!fab || !panel) return;
  fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
}

export function initA11yFab() {
  const fab = document.getElementById('a11y-fab');
  const panel = document.getElementById('a11y-panel');
  if (!fab || !panel) return;
  if (fab.dataset.osaBound) return;
  fab.dataset.osaBound = '1';
  fab.addEventListener('click', () => {
    const open = fab.getAttribute('aria-expanded') === 'true';
    setFabOpen(!open);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fab.getAttribute('aria-expanded') === 'true') {
      setFabOpen(false);
      fab.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (fab.getAttribute('aria-expanded') !== 'true') return;
    const wrap = fab.closest('.osa-a11y-fab-wrap');
    if (wrap && !wrap.contains(e.target)) setFabOpen(false);
  });
}

export function initA11yToolbar() {
  initA11yFab();
  const prefs = { fontScale: 1, dyslexia: false, highContrast: false, ...getA11yPrefs() };
  applyFontScale(prefs.fontScale);
  applyDyslexia(!!prefs.dyslexia);
  applyContrast(!!prefs.highContrast);

  const bind = (sel, handler) => {
    document.querySelectorAll(sel).forEach((btn) => {
      if (btn.dataset.osaBound) return;
      btn.dataset.osaBound = '1';
      btn.addEventListener('click', handler);
    });
  };

  bind('[data-a11y="font-decrease"]', () => {
    const s = applyFontScale((getA11yPrefs().fontScale || 1) - 0.1);
    setA11yPref({ fontScale: Math.round(s * 100) / 100 });
  });
  bind('[data-a11y="font-increase"]', () => {
    const s = applyFontScale((getA11yPrefs().fontScale || 1) + 0.1);
    setA11yPref({ fontScale: Math.round(s * 100) / 100 });
  });
  bind('[data-a11y="font-reset"]', () => {
    applyFontScale(1);
    setA11yPref({ fontScale: 1 });
  });
  bind('[data-a11y="dyslexia"]', () => {
    const on = !(getA11yPrefs().dyslexia);
    applyDyslexia(on);
    setA11yPref({ dyslexia: on });
  });
  bind('[data-a11y="contrast"]', () => {
    const on = !(getA11yPrefs().highContrast);
    applyContrast(on);
    setA11yPref({ highContrast: on });
  });
  // Auto-ocultar do menu (WCAG 2.2.1: limite de tempo pode ser desligado)
  applyAutoHide(isAutoHideOn());
  bind('[data-a11y="drawer-autohide"]', () => {
    const on = setAutoHide(!isAutoHideOn());
    applyAutoHide(on);
  });
}

/* ---------------- Leitura em voz alta ---------------- */

let speaking = false;

export function ttsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

function getRegion() {
  return document.getElementById('main-content');
}

export function startTTS() {
  if (!ttsSupported()) {
    const s = document.getElementById('tts-status');
    if (s) s.textContent = 'Seu navegador não oferece leitura em voz alta (speechSynthesis indisponível).';
    return false;
  }
  const region = getRegion();
  if (!region) return false;
  window.speechSynthesis.cancel();
  const text = region.innerText || '';
  if (!text.trim()) return false;
  const utter = new SpeechSynthesisUtterance(text.slice(0, 12000));
  utter.lang = 'pt-BR';
  utter.rate = 1;
  utter.onend = () => {
    speaking = false;
    updateTTSButtons();
    const s = document.getElementById('tts-status');
    if (s) s.textContent = 'Leitura encerrada.';
  };
  utter.onerror = () => {
    speaking = false;
    updateTTSButtons();
    const s = document.getElementById('tts-status');
    if (s) s.textContent = 'A leitura foi interrompida pelo navegador.';
  };
  speaking = true;
  window.speechSynthesis.speak(utter);
  updateTTSButtons();
  const s = document.getElementById('tts-status');
  if (s) {
    s.textContent = 'Lendo em voz alta. Observação: vozes em português não pronunciam hebraico e grego corretamente — os trechos nas línguas originais serão lidos de forma aproximada.';
  }
  return true;
}

export function stopTTS() {
  if (ttsSupported()) window.speechSynthesis.cancel();
  speaking = false;
  updateTTSButtons();
  const s = document.getElementById('tts-status');
  if (s) s.textContent = 'Leitura parada.';
}

function updateTTSButtons() {
  document.querySelectorAll('[data-tts="start"]').forEach((b) => {
    b.setAttribute('aria-pressed', speaking ? 'true' : 'false');
    b.disabled = speaking;
  });
  document.querySelectorAll('[data-tts="stop"]').forEach((b) => {
    b.disabled = !speaking;
  });
}

export function initTTS() {
  const supported = ttsSupported();
  document.querySelectorAll('[data-tts="start"]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    if (!supported) {
      b.disabled = true;
      b.title = 'Recurso não disponível neste navegador';
    }
    b.addEventListener('click', () => startTTS());
  });
  document.querySelectorAll('[data-tts="stop"]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    if (!supported) b.disabled = true;
    b.addEventListener('click', () => stopTTS());
  });
  const note = document.getElementById('tts-note');
  if (note && !supported) {
    note.textContent = 'Leitura em voz alta indisponível neste navegador.';
  }
  updateTTSButtons();
}
