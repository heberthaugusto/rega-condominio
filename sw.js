// Service Worker — Rega do Condomínio
const VERSION = '1.0.1';
const CACHE   = `rega-cache-${VERSION}`;

const ASSETS = [
  '/rega-condominio/',
  '/rega-condominio/index.html',
  '/rega-condominio/manifest.json',
  '/rega-condominio/icon-192.png',
  '/rega-condominio/icon-512.png',
  '/rega-condominio/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
