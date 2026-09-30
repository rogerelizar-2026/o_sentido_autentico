/* ==========================================================================
 * onboarding.js — diálogo de termos da primeira visita.
 * - Checkbox começa DESMARCADO; ação primária desabilitada até marcar.
 * - Fechar sem aceitar NÃO contorna: barra persistente "Ler e aceitar os termos".
 * - Aceite real tem chave própria, separada de "apresentação dispensada".
 * - Foco: entra no diálogo e volta ao gatilho ao fechar.
 * ========================================================================== */

import {
  hasAcceptedTerms, acceptTerms, hasSeenPresentation, markPresentationSeen
} from './storage.js';

const DIALOG_ID = 'dialog-termos';

function qs(id) { return document.getElementById(id); }

function getDialog() { return qs(DIALOG_ID); }

function getBar() { return qs('terms-bar'); }

function updateBar() {
  const bar = getBar();
  if (!bar) return;
  const show = !hasAcceptedTerms();
  bar.dataset.visible = show ? 'true' : 'false';
  if (show) bar.removeAttribute('hidden');
  else bar.setAttribute('hidden', '');
}

let lastFocus = null;

export function openTermsDialog() {
  const dlg = getDialog();
  if (!dlg) return false;
  lastFocus = document.activeElement;
  const checkbox = dlg.querySelector('#terms-checkbox');
  const acceptBtn = dlg.querySelector('#terms-accept');
  if (checkbox) checkbox.checked = false; // sempre desmarcado ao abrir
  if (acceptBtn) acceptBtn.disabled = true;
  try {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  } catch { dlg.setAttribute('open', ''); }
  markPresentationSeen();
  // Foco no título do diálogo (início da leitura), sem exigir rolagem
  const title = dlg.querySelector('#terms-title');
  if (title) {
    title.setAttribute('tabindex', '-1');
    title.focus();
  }
  return true;
}

export function closeTermsDialog() {
  const dlg = getDialog();
  if (!dlg) return false;
  try {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else dlg.removeAttribute('open');
  } catch { dlg.removeAttribute('open'); }
  updateBar(); // se não aceitou, a barra aparece
  if (lastFocus && typeof lastFocus.focus === 'function') {
    try { lastFocus.focus(); } catch { /* ignore */ }
  }
  return true;
}

function onAccept() {
  const dlg = getDialog();
  const checkbox = dlg && dlg.querySelector('#terms-checkbox');
  if (!checkbox || !checkbox.checked) return; // nunca aceita sem marcação explícita
  acceptTerms();
  updateBar();
  closeTermsDialog();
  // Mensagem de status ao vivo
  const status = qs('terms-status');
  if (status) status.textContent = 'Termos aceitos. Bom estudo!';
}

function bindDialog() {
  const dlg = getDialog();
  if (!dlg || dlg.dataset.osaBound) return;
  dlg.dataset.osaBound = '1';

  const checkbox = dlg.querySelector('#terms-checkbox');
  const acceptBtn = dlg.querySelector('#terms-accept');
  const cancelBtn = dlg.querySelector('#terms-cancel');

  if (checkbox && acceptBtn) {
    checkbox.addEventListener('change', () => {
      acceptBtn.disabled = !checkbox.checked;
    });
  }
  if (acceptBtn) acceptBtn.addEventListener('click', onAccept);
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeTermsDialog());

  // Fechar pelo "X" ou Esc: mantém requisito (barra persistente)
  dlg.addEventListener('cancel', (ev) => {
    // Esc fecha a apresentação, mas NÃO aceita termos
    ev.preventDefault();
    closeTermsDialog();
  });
  dlg.addEventListener('close', () => {
    updateBar();
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch { /* ignore */ }
    }
  });
}

/**
 * Inicializa o fluxo de termos.
 * - Se já aceitou: não mostra nada.
 * - Se não aceitou: abre o diálogo na primeira visita e garante a barra.
 * - Nunca reabre a gaveta/sidebar por causa do onboarding.
 */
export function initOnboarding({ forceOpen = false } = {}) {
  bindDialog();
  updateBar();

  // Gatilhos múltiplos
  document.querySelectorAll('[data-open-terms]').forEach((el) => {
    if (el.dataset.osaBound) return;
    el.dataset.osaBound = '1';
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      openTermsDialog();
    });
  });

  const bar = getBar();
  if (bar && !bar.dataset.osaBound) {
    bar.dataset.osaBound = '1';
    const btn = bar.querySelector('[data-open-terms-bar]');
    if (btn) btn.addEventListener('click', () => openTermsDialog());
  }

  if (hasAcceptedTerms()) return;

  // Primeira visita sem aceite: apresenta os termos
  const everPresented = hasSeenPresentation();
  if (forceOpen || !everPresented) {
    // abre em microtask para garantir foco após o layout
    requestAnimationFrame(() => openTermsDialog());
  } else {
    // já viu a apresentação antes (ex.: legado "dispensado") — exige barra, não reabre sozinho
    updateBar();
  }
}
