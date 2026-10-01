/* ==========================================================================
   AutenticSense — Ponto de entrada (js/app.js)
   Inicializa navegação, drawer, acessibilidade, router, PWA e indicadores.
   ========================================================================== */

import { initRouter } from './router.js';
import { initAccessibility, a11yStore, announce, trapFocus } from './a11y.js';
import { tts } from './tts.js';
import { icon } from './icons.js';
import { routes, navItems } from './views/routes.js';
import { initMobile } from './mobile.js';

const $ = (sel) => document.querySelector(sel);

/* ---------- Navegação superior + drawer ---------- */
function renderNav() {
  const top = $('#navTop');
  const drawer = $('#navDrawerList');
  if (top) {
    top.innerHTML = navItems
      .filter((n) => n.top !== false)
      .map((n) => `<a href="#${n.path}" data-route="${n.path}">${n.label}</a>`).join('');
  }
  if (drawer) {
    drawer.innerHTML = navItems.map((n) => `
      <li>
        <a href="#${n.path}" data-route="${n.path}">
          ${icon(n.icon)}
          <span>${n.label}<span class="nav-desc">${n.desc}</span></span>
        </a>
      </li>`).join('');
  }
}

function updateActiveNav(path) {
  document.querySelectorAll('[data-route]').forEach((a) => {
    if (a.dataset.route === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* ---------- Drawer acessível (auto-ocultável, focus trap, ESC) ---------- */
function initDrawer() {
  const drawer = $('#drawer');
  const toggle = $('#navToggle');
  const backdrop = $('#backdrop');
  const closeBtn = $('#drawerClose');
  if (!drawer || !toggle || !backdrop) return;
  let releaseTrap = null;

  function openDrawer() {
    drawer.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
    });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu de navegação');
    releaseTrap = trapFocus(drawer, closeDrawer);
    closeBtn?.focus();
    announce('Menu de navegação aberto.');
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
    releaseTrap?.(); releaseTrap = null;
    window.setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 280);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener('click', () => closeDrawer());
  backdrop.addEventListener('click', () => closeDrawer({ restoreFocus: false }));

  /* Auto-ocultação: escolher um link fecha o drawer imediatamente */
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a[data-route]')) closeDrawer({ restoreFocus: false });
  });
}

/* ---------- Tema claro/escuro (botão do cabeçalho) ---------- */
function initThemeToggle() {
  const btn = $('#themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => a11yStore.toggleTheme());
}

/* ---------- Indicador de conectividade ---------- */
function initNetBadge() {
  const badge = $('#netBadge');
  if (!badge) return;
  function update() {
    const online = navigator.onLine;
    badge.hidden = false;
    badge.textContent = online ? 'online' : 'offline';
    badge.classList.toggle('is-off', !online);
  }
  window.addEventListener('online', () => { update(); announce('Conexão restabelecida.'); });
  window.addEventListener('offline', () => { update(); announce('Você está offline. O conteúdo continua disponível.'); });
  update();
}

/* ---------- Botão de instalação (PWA) ---------- */
function initInstall() {
  const btn = $('#installBtn');
  if (!btn) return;

  /* Já rodando como app instalado? O botão não faz sentido algum. */
  const instalado = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://');

  let deferred = null;

  const esconder = () => {
    deferred = null;
    btn.hidden = true;
    btn.setAttribute('aria-hidden', 'true');
    btn.style.display = 'none';
  };

  const mostrar = () => {
    if (instalado()) return esconder();
    btn.hidden = false;
    btn.removeAttribute('aria-hidden');
    btn.style.removeProperty('display');
  };

  if (instalado()) {
    esconder();
    return; /* nem registra os ouvintes */
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    if (instalado()) return esconder();
    deferred = e;
    mostrar();
  });

  btn.addEventListener('click', async () => {
    if (!deferred) return esconder();
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') announce('Aplicativo instalado com sucesso.');
    esconder();
  });

  window.addEventListener('appinstalled', () => {
    announce('Aplicativo instalado com sucesso.');
    esconder();
  });

  /* O modo de exibição muda ao abrir pelo ícone: reavalia na hora. */
  ['standalone', 'fullscreen', 'minimal-ui'].forEach((modo) => {
    const mq = window.matchMedia(`(display-mode: ${modo})`);
    const onChange = (e) => { if (e.matches) esconder(); };
    mq.addEventListener ? mq.addEventListener('change', onChange)
                        : mq.addListener(onChange);
  });

  /* Chrome/Edge: confirma se o app já está instalado nesta origem. */
  if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps()
      .then((apps) => { if (apps && apps.length) esconder(); })
      .catch(() => { /* sem suporte, tudo bem */ });
  }

  /* Ao voltar o foco (ex.: instalou por outro caminho), revalida. */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && instalado()) esconder();
  });
}

/* ---------- Callback pós-navegação ---------- */
function afterRoute(route, path) {
  tts.stop();
  const title = route.view.title;
  document.title = `${title} · Sentido Autêntico`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && route.view.desc) meta.setAttribute('content', route.view.desc);

  updateActiveNav(path === '/' ? '/' : path);

  window.scrollTo({ top: 0, behavior: 'auto' });

  const h1 = document.querySelector('#app h1');
  if (h1) {
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
  }
  announce(`Página carregada: ${title}.`);
}

/* ---------- Service Worker ---------- */
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
      console.info('[osa] Service Worker registrado — modo offline ativo.');
    } catch (err) {
      console.warn('[osa] Falha ao registrar o Service Worker:', err);
    }
  });
}

/* ---------- Boot ---------- */
renderNav();
initDrawer();
initThemeToggle();
initNetBadge();
initInstall();
initAccessibility();
initMobile();

const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

initRouter({
  routes,
  root: document.getElementById('app'),
  onRoute: afterRoute
});

registerSW();
