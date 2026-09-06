const CACHE_NAME = 'o-sentido-autentico-cache-v21';
const ASSETS = [
    'index.html',
    'styles.css',
    'script.js',
    'manifest.json',
    'ferramentas-biblicas.html',
    'línguas_bíblicas_e_tecnologia.m4a',
    'imagens/infografico-hebraico.png',
    'imagens/infografico-grego.png',
    'imagens/infografico-gemini.png',
    'imagens/infografico-notebook.png',
    'imagens/capa-ross.png',
    'imagens/capa-rega.png',
    'imagens/capa-mounce.png',
    'imagens/capa-wallace.png'
];

// Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Caching static assets...');
            return cache.addAll(ASSETS).catch(err => {
                console.warn('SW: Non-critical caching error during install:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('SW: Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    if (!e.request.url.startsWith('http')) return;

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(e.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && e.request.url.startsWith(self.location.origin)) {
                    const cacheCopy = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, cacheCopy);
                    });
                }
                return networkResponse;
            }).catch((err) => {
                console.log('SW: Fetch failed, offline fallback.', err);
            });
        })
    );
});
