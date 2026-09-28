/* ==========================================================================
 * sw.js — Service Worker de O Sentido Autêntico
 * PROPÓSITO PWA: após a 1ª visita com rede, o site inteiro (shell, conteúdo,
 * dados, fontes, capas, guias) funciona OFFLINE como um app instalável —
 * sem conexão, sem servidor. Recursos externos (links de terceiros) NÃO
 * são prometidos offline.
 * INVARIANTE 3: precache APENAS arquivos que existem; cache individual por
 * item (sem addAll em lote). Cada URL é verificada por HTTP 200 em tests.
 * INVARIANTE 4: fallback offline válido; atualização só via mensagem do
 * usuário ("Nova versão disponível" → "Atualizar"); caches namespaced
 * (osa-core-… e osa-runtime-…); apaga apenas caches desta aplicação.
 * ========================================================================== */

const VERSION = 'v1.2.3';
const PREFIX = 'osa';
const CORE_CACHE = `${PREFIX}-core-${VERSION}`;
const RUNTIME_CACHE = `${PREFIX}-runtime-${VERSION}`;

/** Shell mínimo verificado (cada item testado com 200 em tests). */
const CORE_ASSETS = [
  './',
  './index.html',
  './hebraico-aramaico.html',
  './grego-koine.html',
  './caixa-de-ferramentas.html',
  './guia-exegese.html',
  './offline.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/fonts.css',
  './css/base.css',
  './css/components.css',
  './css/main.css',
  './css/guia-exegese.css',
  './js/main.js',
  './js/guia-exegese.js',
  './js/theme.js',
  './js/storage.js',
  './js/sidebar.js',
  './js/onboarding.js',
  './js/nav.js',
  './js/ui.js',
  './js/a11y.js',
  './js/catalog.js',
  './js/charts.js',
  './js/export.js',
  './js/pwa.js',
  './data/recursos.json',
  './data/metodos.json',
  './icons/osa-mark.svg',
  './social-guia.svg',
  './social-guia.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/inter-latin-400.woff2',
  './fonts/inter-latin-600.woff2',
  './fonts/cinzel-latin-600.woff2',
  './fonts/noto-serif-hebrew-400.woff2',
  './fonts/noto-serif-greek-400.woff2',
  './fonts/noto-serif-greek-ext-400.woff2',
  './covers/rega-nocoes-grego.jpg',
  './covers/mounce-fundamentos-grego.jpg',
  './covers/wallace-syntax.jpg',
  './covers/ross-introducing-hebrew.jpg',
  './covers/capa-pinto-dias.jpg',
  './downloads/mapa-aceleracao.svg',
  './downloads/mapa-aceleracao-grego.svg',
  './icons/favicon.svg',
  './icons/favicon-48.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHECORE());
    // Cache individual: falha em um item não derruba a instalação
    await Promise.allSettled(CORE_ASSETS.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (res && res.ok && res.type !== 'opaque') {
          await cache.put(url, res);
        }
      } catch { /* item ausente: segue sem ele */ }
    }));
    // NÃO skipWaiting automático — aguarda mensagem do usuário
  })());
});

function CACHECORE() { return CORE_CACHE; }

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Delete SOMENTE caches desta aplicação (prefixo osa-) e de versões antigas
    await Promise.all(keys.map((k) => {
      if (k.startsWith(`${PREFIX}-`) && k !== CORE_CACHE && k !== RUNTIME_CACHE) {
        return caches.delete(k);
      }
      return undefined;
    }));
    // sem clients.claim() forçado: a página permanece estável até atualizar
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Só gerencia a mesma origem (recursos externos não são prometidos offline)
  if (url.origin !== self.location.origin) return;

  // Navegações: network-first com timeout + fallback offline
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(req));
    return;
  }

  // Estáticos: cache-first com runtime fill
  event.respondWith(cacheFirst(req));
});

async function networkFirstNavigation(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(req, { signal: controller.signal });
    clearTimeout(timer);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    clearTimeout(timer);
    const cached = await cache.match(req);
    if (cached) return cached;
    // Também tenta o core cache (páginas precarregadas)
    const core = await caches.open(CORE_CACHE);
    const path = new URL(req.url).pathname.replace(/^.*\//, '') || 'index.html';
    const hit = await core.match('./' + path) || await core.match('./index.html');
    if (hit) return hit;
    // Fallback offline dedicado — sempre uma Response válida
    const offline = await core.match('./offline.html') || await cache.match('./offline.html');
    if (offline) return offline;
    return new Response(
      '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Sem conexão</title><p>Você está offline. Abra uma página visitada anteriormente.</p></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } finally {
    clearTimeout(timer);
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type !== 'opaque') {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    // Fallback: tenta offline.html para documentos; para o resto, 503 sintético
    const accept = req.headers.get('accept') || '';
    if (accept.includes('text/html')) {
      const offline = await caches.match('./offline.html');
      if (offline) return offline;
    }
    return new Response('Recurso indisponível offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-OSA-Offline': '1' }
    });
  }
}
