/* AutenticSense — Service Worker (gerado por build-sw.py) */
const VERSION = 'osa-v92aa52dc5a61';
const PRECACHE = [
  "./",
  "./INSTALAR-NO-CELULAR.html",
  "./Manual-do-Usuario.pdf",
  "./README.md",
  "./abrir-sem-servidor.html",
  "./assets/fonts/noto-serif-greek-ext-italic-400.woff2",
  "./assets/fonts/noto-serif-greek-ext-normal-400.woff2",
  "./assets/fonts/noto-serif-greek-ext-normal-600.woff2",
  "./assets/fonts/noto-serif-greek-ext-normal-700.woff2",
  "./assets/fonts/noto-serif-greek-italic-400.woff2",
  "./assets/fonts/noto-serif-greek-normal-400.woff2",
  "./assets/fonts/noto-serif-greek-normal-600.woff2",
  "./assets/fonts/noto-serif-greek-normal-700.woff2",
  "./assets/fonts/noto-serif-hebrew-hebrew-normal-400.woff2",
  "./assets/fonts/noto-serif-hebrew-hebrew-normal-600.woff2",
  "./assets/fonts/noto-serif-hebrew-hebrew-normal-700.woff2",
  "./assets/fonts/noto-serif-hebrew-latin-normal-400.woff2",
  "./assets/fonts/noto-serif-hebrew-latin-normal-600.woff2",
  "./assets/fonts/noto-serif-hebrew-latin-normal-700.woff2",
  "./assets/fonts/noto-serif-latin-ext-italic-400.woff2",
  "./assets/fonts/noto-serif-latin-ext-normal-400.woff2",
  "./assets/fonts/noto-serif-latin-ext-normal-600.woff2",
  "./assets/fonts/noto-serif-latin-ext-normal-700.woff2",
  "./assets/fonts/noto-serif-latin-italic-400.woff2",
  "./assets/fonts/noto-serif-latin-normal-400.woff2",
  "./assets/fonts/noto-serif-latin-normal-600.woff2",
  "./assets/fonts/noto-serif-latin-normal-700.woff2",
  "./assets/icons/favicon-16.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/img/info/ecossist.jpg",
  "./assets/img/info/grego.jpg",
  "./assets/img/info/hebraico.jpg",
  "./assets/img/info/metodologia.jpg",
  "./assets/img/info/sofia.jpg",
  "./assets/img/livros/carson.jpg",
  "./assets/img/livros/lasor.jpg",
  "./assets/img/livros/mounce.jpg",
  "./assets/img/livros/pinto.jpg",
  "./assets/img/livros/rega.jpg",
  "./assets/img/livros/ross.jpg",
  "./assets/img/livros/wallace.jpg",
  "./assets/img/livros/zuck.jpg",
  "./css/base.css",
  "./css/components.css",
  "./css/content.css",
  "./css/fonts.css",
  "./css/layout.css",
  "./css/mobile.css",
  "./css/tokens.css",
  "./js/a11y.js",
  "./js/app.js",
  "./js/components/interlinear.js",
  "./js/data/alphabets.js",
  "./js/data/interlinear.js",
  "./js/icons.js",
  "./js/mobile.js",
  "./js/router.js",
  "./js/tools.js",
  "./js/tts.js",
  "./js/views/aramaico.js",
  "./js/views/biblioteca.js",
  "./js/views/exegese.js",
  "./js/views/ferramentas.js",
  "./js/views/grego.js",
  "./js/views/hebraico.js",
  "./js/views/home.js",
  "./js/views/notfound.js",
  "./js/views/rota.js",
  "./js/views/routes.js",
  "./js/views/sobre.js",
  "./manifest.webmanifest",
  "./manual.html",
  "./robots.txt",
  "./sitemap.xml"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* Navegações: rede primeiro, com fallback offline para o app */
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(VERSION);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(request) || await caches.match('./index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  /* Estáticos: stale-while-revalidate (offline instantâneo, atualiza ao fundo) */
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    const updating = fetch(request).then(async (resp) => {
      if (resp && resp.ok) {
        const cache = await caches.open(VERSION);
        cache.put(request, resp.clone());
      }
      return resp;
    }).catch(() => undefined);
    if (cached) {
      event.waitUntil(updating);
      return cached;
    }
    const resp = await updating;
    return resp || Response.error();
  })());
});
