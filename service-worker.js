const CACHE_NAME = 'dh2o-card-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/profile.json',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Bypass imágenes y favicons
  if (request.destination === 'image' || url.pathname.startsWith('/img/')) {
    return; // permitir que el navegador gestione
  }
  event.respondWith(
    fetch(request).then((resp) => {
      try {
        const isSameOrigin = new URL(resp.url).origin === self.location.origin;
        const isOk = resp.ok && resp.type === 'basic';
        if (isSameOrigin && isOk) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(() => {});
        }
      } catch (_) {}
      return resp;
    }).catch(() => caches.match(request))
  );
});