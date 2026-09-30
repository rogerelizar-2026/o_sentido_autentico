/* ==========================================================================
   AutenticSense — Central de Acessibilidade (js/a11y.js)
   • FAB + painel acessível (teclado, ESC, focus trap)
   • Escala tipográfica, alto contraste, fonte para dislexia, tema escuro,
     redução de movimento e leitura em voz alta (TTS)
   • Preferências persistidas em localStorage
   ========================================================================== */

import { tts } from './tts.js';
import { icon } from './icons.js';

const STORAGE_KEY = 'autenticsense:prefs:v1';
const SCALES = [0.875, 1, 1.125, 1.25, 1.375];

const DEFAULTS = () => ({
  theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  contrast: 'normal',
  font: 'padrao',
  motion: 'padrao',
  scaleIndex: 1
});

let prefs = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS(), ...JSON.parse(raw) } : DEFAULTS();
  } catch { return DEFAULTS(); }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* modo privado */ }
}

/* ---------- Anúncios para leitores de tela ---------- */
export function announce(message, assertive = false) {
  const region = document.getElementById(assertive ? 'liveAlert' : 'liveRegion');
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = message; });
}

/* ---------- Focus trap reutilizável ---------- */
export function trapFocus(container, onEscape) {
  const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, summary, [tabindex]:not([tabindex="-1"])';
  function onKeydown(e) {
    if (e.key === 'Escape') { e.preventDefault(); onEscape?.(); return; }
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', onKeydown);
  return () => document.removeEventListener('keydown', onKeydown);
}

/* ---------- Aplicação das preferências ---------- */
function apply() {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.dataset.contrast = prefs.contrast;
  root.dataset.font = prefs.font;
  root.dataset.motion = prefs.motion;
  root.style.setProperty('--osa-fs-scale', SCALES[prefs.scaleIndex] ?? 1);

  document.querySelectorAll('[data-a11y-pressed]').forEach((btn) => {
    const key = btn.dataset.a11yPressed;
    const val = btn.dataset.a11yValue;
    btn.setAttribute('aria-pressed', String(String(prefs[key]) === val));
  });
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(prefs.theme === 'dark'));
  save();
}

export const a11yStore = {
  get prefs() { return { ...prefs }; },
  set(key, value) { prefs[key] = value; apply(); },
  toggleTheme() {
    prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark';
    apply();
    announce(prefs.theme === 'dark' ? 'Tema escuro ativado.' : 'Tema claro ativado.');
  }
};

/* ---------- Construção do FAB + painel ---------- */
function buildFab() {
  const host = document.getElementById('a11yRoot');
  if (!host) return;

  host.innerHTML = `
    <button class="fab" id="a11yFab" type="button" aria-expanded="false" aria-controls="a11yPanel"
            aria-label="Abrir barra de acessibilidade">
      ${icon('person', 'icon')}
    </button>
    <section class="fab-panel" id="a11yPanel" role="dialog" aria-modal="false"
             aria-label="Central de acessibilidade" hidden>
      <h2>Acessibilidade</h2>

      <div class="a11y-group">
        <span id="a11y-fs-label">Tamanho do texto</span>
        <div class="a11y-row" role="group" aria-labelledby="a11y-fs-label">
          <button class="btn btn-outline btn-sm" data-a11y-action="font-dec" type="button" aria-label="Diminuir tamanho do texto">A−</button>
          <button class="btn btn-outline btn-sm" data-a11y-action="font-inc" type="button" aria-label="Aumentar tamanho do texto">A+</button>
          <button class="btn btn-outline btn-sm" data-a11y-action="font-reset" type="button" aria-label="Restaurar tamanho padrão do texto">${icon('reset')}</button>
        </div>
      </div>

      <div class="a11y-group">
        <span id="a11y-visual-label">Aparência</span>
        <div class="a11y-row" role="group" aria-labelledby="a11y-visual-label">
          <button class="btn btn-outline btn-sm" data-a11y-action="toggle" data-a11y-key="theme"
                  data-a11y-value="dark" data-a11y-pressed="theme" aria-pressed="false" type="button">
            ${icon('contrast')} Tema escuro
          </button>
          <button class="btn btn-outline btn-sm" data-a11y-action="toggle" data-a11y-key="contrast"
                  data-a11y-value="high" data-a11y-pressed="contrast" aria-pressed="false" type="button">
            ${icon('eye')} Alto contraste
          </button>
          <button class="btn btn-outline btn-sm" data-a11y-action="toggle" data-a11y-key="font"
                  data-a11y-value="dyslexic" data-a11y-pressed="font" aria-pressed="false" type="button">
            ${icon('text')} Fonte para dislexia
          </button>
          <button class="btn btn-outline btn-sm" data-a11y-action="toggle" data-a11y-key="motion"
                  data-a11y-value="reduce" data-a11y-pressed="motion" aria-pressed="false" type="button">
            ${icon('stop')} Reduzir animações
          </button>
        </div>
      </div>

      <div class="a11y-group">
        <span id="a11y-tts-label">Leitura em voz alta</span>
        <div class="a11y-row" role="group" aria-labelledby="a11y-tts-label">
          <button class="btn btn-outline btn-sm" data-a11y-action="tts-play" type="button" id="a11yTtsPlay">
            ${icon('speaker')} Ouvir página
          </button>
          <button class="btn btn-outline btn-sm" data-a11y-action="tts-stop" type="button" id="a11yTtsStop" disabled>
            ${icon('stop')} Parar
          </button>
        </div>
      </div>

      <div class="a11y-group" style="margin-bottom:0">
        <div class="a11y-row">
          <button class="btn btn-ghost btn-sm" data-a11y-action="reset-all" type="button">
            ${icon('reset')} Restaurar tudo
          </button>
        </div>
      </div>
    </section>`;

  const fab = host.querySelector('#a11yFab');
  const panel = host.querySelector('#a11yPanel');
  let releaseTrap = null;

  function openPanel() {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Fechar barra de acessibilidade');
    releaseTrap = trapFocus(panel, closePanel);
    panel.querySelector('button')?.focus();
  }

  function closePanel({ restoreFocus = true } = {}) {
    panel.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Abrir barra de acessibilidade');
    releaseTrap?.(); releaseTrap = null;
    window.setTimeout(() => { panel.hidden = true; }, 200);
    if (restoreFocus) fab.focus();
  }

  fab.addEventListener('click', () => {
    const isOpen = fab.getAttribute('aria-expanded') === 'true';
    isOpen ? closePanel({ restoreFocus: false }) : openPanel();
  });

  document.addEventListener('click', (e) => {
    if (!host.contains(e.target) && fab.getAttribute('aria-expanded') === 'true') {
      closePanel({ restoreFocus: false });
    }
  });

  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a11y-action]');
    if (!btn) return;
    handleAction(btn.dataset.a11yAction, btn);
  });

  tts.onState((speaking) => {
    const play = panel.querySelector('#a11yTtsPlay');
    const stop = panel.querySelector('#a11yTtsStop');
    if (play) play.disabled = speaking;
    if (stop) stop.disabled = !speaking;
  });

  function handleAction(action, btn) {
    switch (action) {
      case 'font-inc':
        prefs.scaleIndex = Math.min(prefs.scaleIndex + 1, SCALES.length - 1);
        apply(); announce(`Tamanho do texto: ${Math.round(SCALES[prefs.scaleIndex] * 100)}%.`);
        break;
      case 'font-dec':
        prefs.scaleIndex = Math.max(prefs.scaleIndex - 1, 0);
        apply(); announce(`Tamanho do texto: ${Math.round(SCALES[prefs.scaleIndex] * 100)}%.`);
        break;
      case 'font-reset':
        prefs.scaleIndex = 1; apply(); announce('Tamanho do texto restaurado.');
        break;
      case 'toggle': {
        const key = btn.dataset.a11yKey;
        const on = btn.dataset.a11yValue;
        const off = key === 'contrast' ? 'normal' : 'padrao';
        prefs[key] = prefs[key] === on ? off : on;
        apply();
        const labels = {
          theme: `Tema escuro ${prefs.theme === 'dark' ? 'ativado' : 'desativado'}.`,
          contrast: `Alto contraste ${prefs.contrast === 'high' ? 'ativado' : 'desativado'}.`,
          font: `Fonte para dislexia ${prefs.font === 'dyslexic' ? 'ativada' : 'desativada'}.`,
          motion: `Redução de animações ${prefs.motion === 'reduce' ? 'ativada' : 'desativada'}.`
        };
        announce(labels[key] || 'Preferência atualizada.');
        break;
      }
      case 'tts-play':
        if (tts.supported) {
          tts.readMain();
          announce('Leitura da página iniciada.');
        } else {
          announce('Seu navegador não oferece suporte à leitura em voz alta.', true);
        }
        break;
      case 'tts-stop':
        tts.stop(); announce('Leitura interrompida.');
        break;
      case 'reset-all':
        prefs = DEFAULTS(); apply(); tts.stop();
        announce('Preferências de acessibilidade restauradas.');
        break;
    }
  }
}

export function initAccessibility() {
  buildFab();
  apply();
}
