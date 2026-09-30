/* ==========================================================================
 * pwa.js — registro do service worker, fluxo de atualização visível.
 * INVARIANTES 4: sem skipWaiting automático; ativação só com
 * "Nova versão disponível" → "Atualizar". Dados locais preservados.
 * ========================================================================== */

const UPDATE_KEY = 'osa:pwa:update';

export function initPWA() {
  if (!('serviceWorker' in navigator)) return;
  // Só registra em contexto seguro (https/localhost)
  if (!window.isSecureContext) return;
  // Portátil (pendrive): registro de service worker não é permitido em file://.
  if (location.protocol === 'file:') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((reg) => {
        // Já havia um worker ativo e chegou um novo
        const promptUpdate = (worker) => {
          const bar = document.getElementById('update-bar');
          if (!bar) {
            // barra ausente: cria uma mínima
            createUpdateBar(worker);
            return;
          }
          bar.dataset.visible = 'true';
          const btn = bar.querySelector('[data-pwa-update]');
          if (btn && !btn.dataset.osaBound) {
            btn.dataset.osaBound = '1';
            btn.addEventListener('click', () => {
              worker.postMessage({ type: 'SKIP_WAITING' });
            });
          }
          const dismiss = bar.querySelector('[data-pwa-dismiss]');
          if (dismiss && !dismiss.dataset.osaBound) {
            dismiss.dataset.osaBound = '1';
            dismiss.addEventListener('click', () => { bar.dataset.visible = 'false'; });
          }
        };

        if (reg.waiting) promptUpdate(reg.waiting);

        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              promptUpdate(nw);
            }
          });
        });

        // Ao aceitar a atualização, recarrega UMA vez quando controlar a página
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (sessionStorage.getItem(UPDATE_KEY) === '1') {
            sessionStorage.removeItem(UPDATE_KEY);
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          }
        });
        const wrapUpdate = () => sessionStorage.setItem(UPDATE_KEY, '1');
        document.querySelectorAll('[data-pwa-update]').forEach((b) => {
          if (!b.dataset.osaWrap) {
            b.dataset.osaWrap = '1';
            b.addEventListener('click', wrapUpdate, { capture: true });
          }
        });
      })
      .catch(() => {
        // Falha silenciosa e honesta: o site funciona como estático comum
        console.info('[OSA] Service worker não registrado; modo estático ativo.');
      });
  }); // fim window load
}

function createUpdateBar(worker) {
  const bar = document.createElement('div');
  bar.id = 'update-bar';
  bar.className = 'osa-update-bar';
  bar.setAttribute('role', 'status');
  bar.dataset.visible = 'true';
  bar.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = 'Nova versão disponível.';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'osa-btn osa-btn--primary osa-btn--sm';
  btn.textContent = 'Atualizar';
  btn.addEventListener('click', () => {
    sessionStorage.setItem(UPDATE_KEY, '1');
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  bar.appendChild(span);
  bar.appendChild(btn);
  document.body.appendChild(bar);
}
