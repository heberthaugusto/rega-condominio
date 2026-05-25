// Service Worker — Rega do Condomínio
const VERSION = '1.1.0';
const CACHE   = `rega-cache-${VERSION}`;

const ASSETS = [
  '/rega-condominio/',
  '/rega-condominio/index.html',
  '/rega-condominio/manifest.json',
  '/rega-condominio/icon-192.png',
  '/rega-condominio/icon-512.png',
  '/rega-condominio/apple-touch-icon.png',
];

// ── Install: pré-cache dos assets ────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

// ── Activate: limpa caches antigos ───────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first com fallback para cache ──────────────────────────────
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

// ── Push: recebe notificação Web Push nativa ──────────────────────────────────
self.addEventListener('push', e => {
  let data = { title: '🌿 Rega do Condomínio', body: 'Você tem um lembrete de rega!' };
  try {
    if (e.data) data = e.data.json();
  } catch (_) {
    if (e.data) data.body = e.data.text();
  }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/rega-condominio/icon-192.png',
      badge: '/rega-condominio/icon-192.png',
      tag: 'rega-lembrete',       // substitui notificação anterior se ainda estiver visível
      renotify: true,
      data: { url: '/rega-condominio/' },
    })
  );
});

// ── NotificationClick: abre ou foca o app ao clicar na notificação ────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = e.notification.data?.url || '/rega-condominio/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('/rega-condominio/') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});

// ── Message: força atualização do SW ─────────────────────────────────────────
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
