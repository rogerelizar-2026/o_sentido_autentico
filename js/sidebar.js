/* ==========================================================================
 * sidebar.js — API acessível do menu lateral — gaveta (mobile) e barra (desktop).
 * INVARIANTE 1: open/close/toggle são exportadas E expostas em window.OSASidebar.
 * Mobile: a gaveta começa FECHADA. Desktop: a barra abre ao carregar e passa a se
 * comportar como a gaveta — fecha ao clicar fora e auto-oculta após 4 s de
 * inatividade (curadoria 25/09/2026).
 * Nos dois casos: Escape fecha e o auto-ocultar pode ser desligado em
 * Acessibilidade (WCAG 2.2.1).
 * ========================================================================== */

import { getA11yPrefs, setA11yPref } from './storage.js';
import { announce } from './ui.js';

/** Tempo de inatividade antes de ocultar o menu (curatoria: 4 s). */
export const IDLE_HIDE_MS = 4000;

let els = null;
let idleTimer = null;
let lastArm = 0;

function ensureEls() {
  if (els) return els;
  const drawer = document.getElementById('osa-drawer');
  const backdrop = document.getElementById('osa-backdrop');
  const sidebar = document.getElementById('osa-sidebar');
  const shell = document.querySelector('.osa-shell');
  if (!drawer && !sidebar) return null;
  els = { drawer, backdrop, sidebar, shell };
  return els;
}

/** Recipiente aberto neste momento: gaveta no mobile, barra no desktop. */
function containerAtual() {
  const e = ensureEls();
  if (!e) return null;
  return isDesktop() ? e.sidebar : e.drawer;
}

/** Reflete o estado no botão do menu (aria-expanded/controls/label). */
function syncToggle(aberto) {
  const toggle = document.getElementById('menu-toggle');
  if (!toggle) return;
  toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  toggle.setAttribute('aria-controls', isDesktop() ? 'osa-sidebar' : 'osa-drawer');
  toggle.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
}

function isDesktop() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

/** Preferência: ocultar o menu sozinho após 4 s de inatividade (padrão: ligado). */
export function isAutoHideOn() {
  const prefs = getA11yPrefs() || {};
  return prefs.drawerAutoHide !== false;
}

export function setAutoHide(on) {
  setA11yPref({ drawerAutoHide: !!on });
  document.querySelectorAll('[data-a11y="drawer-autohide"]').forEach((b) => {
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (on && isSidebarOpen()) armIdleTimer();
  if (!on) clearIdleTimer();
  return !!on;
}

/** Reinicia a contagem de inatividade (chamado a cada interação real). */
export function armIdleTimer() {
  clearIdleTimer();
  if (!isAutoHideOn() || !isSidebarOpen()) return;
  lastArm = Date.now();
  idleTimer = window.setTimeout(() => {
    idleTimer = null;
    if (!isSidebarOpen()) return;
    closeSidebar();
    announce('Menu ocultado automaticamente após 4 segundos sem uso. Ele pode ser reaberto pelo botão do menu, e o auto-ocultar pode ser desligado em Acessibilidade.');
  }, IDLE_HIDE_MS);
}

export function clearIdleTimer() {
  if (idleTimer) {
    window.clearTimeout(idleTimer);
    idleTimer = null;
  }
}

/** Interações que contam como atividade dentro do menu. */
const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'touchmove', 'keydown', 'wheel', 'scroll', 'focusin', 'input'];

function onActivity() {
  // Evita re-armar o timer a cada pixel de movimento (throttle simples)
  if (idleTimer && Date.now() - lastArm < 200) return;
  armIdleTimer();
}

function bindActivity() {
  ACTIVITY_EVENTS.forEach((nome) => {
    document.addEventListener(nome, onActivity, { passive: true, capture: true });
  });
}

function unbindActivity() {
  ACTIVITY_EVENTS.forEach((nome) => {
    document.removeEventListener(nome, onActivity, { capture: true });
  });
}

export function isSidebarOpen() {
  const e = ensureEls();
  if (!e) return false;
  if (isDesktop()) return !!(e.shell && e.shell.dataset.sidebar === 'open');
  return e.drawer.dataset.open === 'true';
}

export function openSidebar({ focus = true } = {}) {
  const e = ensureEls();
  if (!e) return false;
  const desktop = isDesktop();
  const caixa = desktop ? e.sidebar : e.drawer;
  if (!caixa) return false;

  if (desktop) {
    if (e.shell) e.shell.dataset.sidebar = 'open';
    caixa.removeAttribute('inert');
  } else {
    e.drawer.dataset.open = 'true';
    e.drawer.setAttribute('aria-hidden', 'false');
    e.drawer.removeAttribute('inert');
    if (e.backdrop) e.backdrop.dataset.open = 'true';
  }
  syncToggle(true);
  if (focus) {
    const first = caixa.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (first) first.focus();
  }
  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('pointerdown', onPointerDownFora, true);
  bindActivity();
  armIdleTimer();
  return true;
}

export function closeSidebar({ restoreFocus = true } = {}) {
  const e = ensureEls();
  if (!e) return false;
  const wasOpen = isSidebarOpen();
  if (isDesktop()) {
    if (e.shell) e.shell.dataset.sidebar = 'closed';
    if (e.sidebar) e.sidebar.setAttribute('inert', '');
  } else {
    e.drawer.dataset.open = 'false';
    e.drawer.setAttribute('aria-hidden', 'true');
    e.drawer.setAttribute('inert', '');
    if (e.backdrop) e.backdrop.dataset.open = 'false';
  }
  syncToggle(false);
  document.removeEventListener('keydown', onKeydown, true);
  document.removeEventListener('pointerdown', onPointerDownFora, true);
  unbindActivity();
  clearIdleTimer();
  const toggle = document.getElementById('menu-toggle');
  if (wasOpen && restoreFocus && toggle) toggle.focus();
  return true;
}

export function toggleSidebar() {
  return isSidebarOpen() ? closeSidebar() : openSidebar();
}

function onKeydown(ev) {
  if (ev.key === 'Escape' && isSidebarOpen()) {
    ev.preventDefault();
    closeSidebar();
  }
}

/**
 * Clique/toque FORA da gaveta fecha o menu — inclusive quando o alvo é o
 * cabeçalho, o FAB ou qualquer elemento acima do backdrop.
 */
function onPointerDownFora(ev) {
  if (!isSidebarOpen()) return;
  const e = ensureEls();
  if (!e) return;
  const alvo = ev.target;
  const caixa = containerAtual();
  if (caixa && caixa.contains(alvo)) return;                 // dentro do menu: atividade
  const toggle = document.getElementById('menu-toggle');
  if (toggle && toggle.contains(alvo)) return;               // o próprio botão alterna
  if (ev.button !== undefined && ev.button > 0) return;      // botões secundários do mouse
  closeSidebar();
}

/** Inicialização: gaveta FECHADA, listeners só nos elementos existentes. */
export function initSidebar() {
  const e = ensureEls();
  if (!e) return;

  // Mobile: gaveta fechada e inerte (fechada por padrão).
  // Desktop: barra visível ao carregar, já sob as mesmas regras da gaveta.
  if (e.drawer) {
    e.drawer.dataset.open = 'false';
    e.drawer.setAttribute('aria-hidden', 'true');
    e.drawer.setAttribute('inert', '');
  }
  if (e.backdrop) e.backdrop.dataset.open = 'false';
  if (e.shell) e.shell.dataset.sidebar = isDesktop() ? 'open' : 'closed';
  if (isDesktop() && e.sidebar) e.sidebar.removeAttribute('inert');
  syncToggle(isDesktop());

  const toggle = document.getElementById('menu-toggle');
  if (toggle && !toggle.dataset.osaBound) {
    toggle.dataset.osaBound = '1';
    toggle.addEventListener('click', (ev) => {
      ev.preventDefault();
      toggleSidebar();
    });
  }

  if (e.backdrop && !e.backdrop.dataset.osaBound) {
    e.backdrop.dataset.osaBound = '1';
    e.backdrop.addEventListener('click', () => closeSidebar());
  }

  // Fecha ao clicar em link do menu (navegação deliberada concluída) — gaveta e barra
  [e.drawer, e.sidebar].forEach((caixa) => {
    if (!caixa) return;
    caixa.querySelectorAll('a').forEach((a) => {
      if (a.dataset.osaBound) return;
      a.dataset.osaBound = '1';
      a.addEventListener('click', () => closeSidebar({ restoreFocus: false }));
    });
  });

  // Ao trocar de largura, garanta estado consistente nos dois lados
  const mq = window.matchMedia('(min-width: 1024px)');
  const onChange = () => {
    if (mq.matches) {
      closeSidebar({ restoreFocus: false });     // limpa a gaveta
      openSidebar({ focus: false });             // barra do desktop, com auto-ocultar
    } else {
      if (e.shell) e.shell.dataset.sidebar = 'closed';
      if (e.sidebar) e.sidebar.setAttribute('inert', '');
      closeSidebar({ restoreFocus: false });
    }
  };
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);

  // Desktop: a barra abre ao carregar e passa a fechar sozinha após 4 s sem uso
  if (isDesktop() && isAutoHideOn() && isSidebarOpen()) {
    document.addEventListener('keydown', onKeydown, true);
    document.addEventListener('pointerdown', onPointerDownFora, true);
    bindActivity();
    armIdleTimer();
  }

  // API pública — nunca chamar funções que não estão expostas
  document.querySelectorAll('[data-a11y="drawer-autohide"]').forEach((b) => {
    b.setAttribute('aria-pressed', isAutoHideOn() ? 'true' : 'false');
  });

  window.OSASidebar = {
    open: openSidebar, close: closeSidebar, toggle: toggleSidebar, isOpen: isSidebarOpen,
    setAutoHide, isAutoHideOn, IDLE_HIDE_MS
  };
}

/** API legada idempotente para testes e páginas internas. */
export function ensureSidebarApi() {
  if (!window.OSASidebar) {
    window.OSASidebar = {
      open: openSidebar, close: closeSidebar, toggle: toggleSidebar, isOpen: isSidebarOpen,
      setAutoHide, isAutoHideOn, IDLE_HIDE_MS
    };
  }
}
