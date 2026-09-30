/* ==========================================================================
 * ui.js — toasts, região de status ao vivo, utilitários DOM seguros
 * (nunca injeta strings importadas em HTML executável)
 * ========================================================================== */

let toastRoot = null;

function ensureRoot() {
  if (toastRoot && document.body.contains(toastRoot)) return toastRoot;
  toastRoot = document.getElementById('osa-toasts');
  if (!toastRoot) {
    toastRoot = document.createElement('div');
    toastRoot.id = 'osa-toasts';
    toastRoot.className = 'osa-toasts';
    document.body.appendChild(toastRoot);
  }
  return toastRoot;
}

/**
 * Mostra toast com ação opcional (ex.: Desfazer).
 * @param {string} message
 * @param {{type?: 'info'|'success'|'error', actionLabel?: string, onAction?: Function, timeout?: number}} opts
 */
export function toast(message, opts = {}) {
  const root = ensureRoot();
  const el = document.createElement('div');
  el.className = `osa-toast osa-toast--${opts.type || 'info'}`;
  el.setAttribute('role', 'status');

  const text = document.createElement('span');
  text.textContent = message;
  el.appendChild(text);

  if (opts.actionLabel && typeof opts.onAction === 'function') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = opts.actionLabel;
    btn.addEventListener('click', () => {
      opts.onAction();
      el.remove();
    });
    el.appendChild(btn);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Fechar aviso');
  close.textContent = '✕';
  close.addEventListener('click', () => el.remove());
  el.appendChild(close);

  root.appendChild(el);
  const ttl = opts.timeout ?? (opts.actionLabel ? 9000 : 5000);
  window.setTimeout(() => el.remove(), ttl);
  return el;
}

/** Atualiza região aria-live existente (ou cria). */
export function announce(message, politeness = 'polite') {
  let region = document.getElementById('osa-live-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'osa-live-region';
    region.className = 'visually-hidden';
    region.setAttribute('aria-live', politeness);
    document.body.appendChild(region);
  }
  region.setAttribute('aria-live', politeness);
  region.textContent = '';
  // microtask para o screen reader registrar a mudança
  requestAnimationFrame(() => { region.textContent = message; });
}

/** Cria elemento com texto seguro (textContent, nunca innerHTML com dados do usuário). */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** Normaliza busca sem acentos (português). */
export function normalize(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
