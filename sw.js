// Funciona sin internet: guarda la app la primera vez y luego sirve desde caché.
const VERSION = 'colorines-v2';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/board.js', 'js/drawings.js', 'js/i18n.js', 'js/sound.js', 'js/confetti.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/index.json',
  'audio/de-a1.mp3', 'audio/de-a2.mp3', 'audio/de-b1.mp3', 'audio/de-b2.mp3', 'audio/de-b3.mp3', 'audio/de-c1.mp3', 'audio/de-c2.mp3', 'audio/de-c3.mp3', 'audio/en-a1.mp3', 'audio/en-a2.mp3', 'audio/en-b1.mp3', 'audio/en-b2.mp3', 'audio/en-b3.mp3', 'audio/en-c1.mp3', 'audio/en-c2.mp3', 'audio/en-c3.mp3', 'audio/es-a1.mp3', 'audio/es-a2.mp3', 'audio/es-b1.mp3', 'audio/es-b2.mp3', 'audio/es-b3.mp3', 'audio/es-c1.mp3', 'audio/es-c2.mp3', 'audio/es-c3.mp3',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Red primero para la app (así se actualiza), caché si no hay conexión.
// Audios y fuentes: caché primero.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cacheFirst = url.pathname.includes('/audio/') || url.host.includes('fonts.');
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    if (cacheFirst) {
      const hit = await cache.match(req);
      if (hit) return hit;
    }
    try {
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    } catch {
      return (await cache.match(req, { ignoreSearch: true })) || Response.error();
    }
  })());
});
