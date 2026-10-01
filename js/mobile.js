/* AutenticSense — Camada mobile / PWA
   Detecta iOS (que não dispara beforeinstallprompt) e oferece o passo a passo
   de "Adicionar à Tela de Início". Também sinaliza o modo instalado e
   mantém a barra de status coerente com o tema. */

import { announce } from './a11y.js';

const CHAVE_DISPENSADO = 'osa:ios-install-dispensado';

/* ---------------------------- Detecções ---------------------------------- */

export function ehStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}

export function ehIOS() {
  const ua = navigator.userAgent || '';
  const iphone = /iPad|iPhone|iPod/.test(ua);
  /* iPadOS 13+ se identifica como Macintosh, mas tem toque */
  const ipadDesktop = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return iphone || ipadDesktop;
}

/** Safari é o único navegador do iOS que instala PWA (Chrome/Firefox no iOS não). */
export function ehSafariIOS() {
  const ua = navigator.userAgent || '';
  return ehIOS() && !/CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(ua);
}

export function ehContextoSeguro() {
  return window.isSecureContext || location.protocol === 'https:' ||
         ['localhost', '127.0.0.1'].includes(location.hostname);
}

/* ------------------------ Assistente de instalação ----------------------- */

const SVG_COMPARTILHAR =
  '<svg class="ios-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M12 15V3"/><path d="m8 7 4-4 4 4"/>' +
  '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/></svg>';

const SVG_MAIS =
  '<svg class="ios-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.9" stroke-linecap="round" aria-hidden="true">' +
  '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

function montarFolhaIOS() {
  const el = document.createElement('aside');
  el.className = 'ios-sheet';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'iosSheetTitle');

  el.innerHTML = `
    <h2 id="iosSheetTitle">Instale o Sentido Autêntico no seu iPhone</h2>
    <p>Assim ele abre em tela cheia, com ícone próprio, e funciona <strong>sem internet</strong>.</p>
    <ol>
      <li>Toque em <strong>Compartilhar</strong> ${SVG_COMPARTILHAR} na barra do Safari.</li>
      <li>Role a lista e toque em <strong>Adicionar à Tela de Início</strong> ${SVG_MAIS}.</li>
      <li>Confirme em <strong>Adicionar</strong>, no canto superior direito.</li>
    </ol>
    <div class="ios-sheet-actions">
      <button type="button" data-acao="depois">Agora não</button>
      <button type="button" class="primary" data-acao="entendi">Entendi</button>
    </div>`;

  const fechar = (lembrarNunca) => {
    if (lembrarNunca) {
      try { localStorage.setItem(CHAVE_DISPENSADO, '1'); } catch { /* modo privado */ }
    }
    el.remove();
    announce('Instruções de instalação fechadas.');
  };

  el.querySelector('[data-acao="depois"]').addEventListener('click', () => fechar(false));
  el.querySelector('[data-acao="entendi"]').addEventListener('click', () => fechar(true));
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(false); });

  document.body.appendChild(el);
  el.querySelector('.primary').focus({ preventScroll: true });
  announce('O Sentido Autêntico pode ser instalado na tela de início. Instruções abertas.');
  return el;
}

/** Mostra a folha do iOS quando fizer sentido; devolve true se exibiu. */
export function oferecerInstalacaoIOS({ forcar = false } = {}) {
  if (!forcar) {
    if (!ehSafariIOS() || ehStandalone()) return false;
    try { if (localStorage.getItem(CHAVE_DISPENSADO)) return false; } catch { /* segue */ }
  }
  if (document.querySelector('.ios-sheet')) return false;
  montarFolhaIOS();
  return true;
}

/* ------------------------- Barra de status / tema ------------------------ */

function sincronizarThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const escuro = document.documentElement.dataset.theme === 'dark';
  meta.setAttribute('content', escuro ? '#0A2723' : '#0F3731');
}

/* -------------------------------- Init ----------------------------------- */

export function initMobile() {
  /* marca o modo instalado para CSS e para o restante do app */
  const marcar = () => {
    document.documentElement.dataset.standalone = ehStandalone() ? 'sim' : 'nao';
    document.documentElement.dataset.plataforma = ehIOS() ? 'ios' : 'outra';
  };
  marcar();
  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', marcar);

  sincronizarThemeColor();
  new MutationObserver(sincronizarThemeColor).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme']
  });

  /* o botão "Instalar" do cabeçalho também serve o iOS, que não tem prompt nativo */
  const btn = document.querySelector('#installBtn');
  if (btn && ehSafariIOS() && !ehStandalone()) {
    btn.hidden = false;
    btn.addEventListener('click', () => oferecerInstalacaoIOS({ forcar: true }));
  }

  /* convite espontâneo, só depois que a pessoa demonstrou interesse real */
  if (ehSafariIOS() && !ehStandalone()) {
    let visitas = 0;
    try { visitas = Number(sessionStorage.getItem('osa:visitas') || 0) + 1;
          sessionStorage.setItem('osa:visitas', String(visitas)); } catch { visitas = 2; }
    if (visitas >= 2) setTimeout(() => oferecerInstalacaoIOS(), 2500);
  }

  /* aviso honesto: sem HTTPS o Service Worker não roda e não há instalação */
  if (!ehContextoSeguro()) {
    console.warn('[osa] Sem HTTPS: o modo offline e a instalação ficam indisponíveis. ' +
                 'Use o servidor local (localhost) ou publique o site em HTTPS.');
  }
}

export default { initMobile, oferecerInstalacaoIOS, ehStandalone, ehIOS, ehSafariIOS };
