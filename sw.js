// Funciona sin internet: guarda la app la primera vez y luego sirve desde caché.
const VERSION = 'colorines-v11';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/board.js', 'js/drawings.js', 'js/i18n.js', 'js/sound.js', 'js/confetti.js', 'js/trace.js', 'js/glyphs.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/index.json',
  'audio/de-a1.mp3', 'audio/de-a2.mp3', 'audio/de-b1.mp3', 'audio/de-b2.mp3', 'audio/de-b3.mp3', 'audio/de-c1.mp3', 'audio/de-c2.mp3', 'audio/de-c3.mp3', 'audio/en-a1.mp3', 'audio/en-a2.mp3', 'audio/en-b1.mp3', 'audio/en-b2.mp3', 'audio/en-b3.mp3', 'audio/en-c1.mp3', 'audio/en-c2.mp3', 'audio/en-c3.mp3', 'audio/es-a1.mp3', 'audio/es-a2.mp3', 'audio/es-b1.mp3', 'audio/es-b2.mp3', 'audio/es-b3.mp3', 'audio/es-c1.mp3', 'audio/es-c2.mp3', 'audio/es-c3.mp3', 'audio/es-m1.mp3', 'audio/en-m1.mp3', 'audio/de-m1.mp3',
  'audio/de-l1.mp3', 'audio/de-l2.mp3', 'audio/de-l3.mp3', 'audio/de-l4.mp3', 'audio/de-n1.mp3', 'audio/de-n2.mp3', 'audio/de-r.mp3', 'audio/en-l1.mp3', 'audio/en-l2.mp3', 'audio/en-l3.mp3', 'audio/en-l4.mp3', 'audio/en-n1.mp3', 'audio/en-n2.mp3', 'audio/es-l1.mp3', 'audio/es-l2.mp3', 'audio/es-l3.mp3', 'audio/es-l4.mp3', 'audio/es-n1.mp3', 'audio/es-n2.mp3',
  'audio/de-d1.mp3', 'audio/de-d2.mp3', 'audio/de-d3.mp3', 'audio/en-d1.mp3', 'audio/en-d2.mp3', 'audio/en-d3.mp3', 'audio/es-d1.mp3', 'audio/es-d2.mp3', 'audio/es-d3.mp3',
  'audio/es-e1.mp3', 'audio/es-e2.mp3', 'audio/es-e3.mp3', 'audio/en-e1.mp3', 'audio/en-e2.mp3', 'audio/en-e3.mp3', 'audio/de-e1.mp3', 'audio/de-e2.mp3', 'audio/de-e3.mp3',
  'img/arbol.png', 'img/aula.png', 'img/autobus.png', 'img/ballena.png', 'img/bosque.png', 'img/camino-colegio.png', 'img/camion-volquete.png', 'img/castillo.png', 'img/cerdo-y-gallina.png', 'img/colegio.png', 'img/delfin.png', 'img/dino-volcan.png', 'img/dragon.png', 'img/excavadora.png', 'img/flores.png', 'img/hada.png', 'img/pulpo.png', 'img/tiranosaurio.png', 'img/tortuga.png', 'img/tractor.png', 'img/triceratops.png', 'img/unicornio.png', 'img/vaca-granja.png', 'img/volcan.png', 'img/sirena-roca.png', 'img/sirena-pelo.png', 'img/tierra-luna.png', 'img/sistema-solar.png', 'img/astronauta.png', 'img/volcan-capas.png', 'img/ciclo-planta.png', 'img/ciclo-agua.png', 'img/estaciones.png', 'img/mariposa.png', 'img/rana.png', 'img/gallina.png', 'img/granja-productos.png', 'img/fosil.png', 'img/oceano-capas.png', 'img/unicornio-arcoiris.png', 'img/bomberos.png', 'img/medica.png', 'img/paso-cebra.png', 'img/trigo-pan.png', 'img/castillo-partes.png', 'img/hada-luna.png',
  'js/explore.js', 'js/scenes.js',
  'scenes/bano-mini.webp', 'scenes/bano.webp', 'scenes/calle-mini.webp', 'scenes/calle.webp', 'scenes/cocina-mini.webp', 'scenes/cocina.webp', 'scenes/cole-mini.webp', 'scenes/cole.webp', 'scenes/mercado-mini.webp', 'scenes/mercado.webp', 'scenes/parque-mini.webp', 'scenes/parque.webp', 'scenes/zoo-mini.webp', 'scenes/zoo.webp',
  'audio/de-x01.mp3', 'audio/de-x02.mp3', 'audio/de-x03.mp3', 'audio/de-x04.mp3', 'audio/de-x05.mp3', 'audio/de-x06.mp3', 'audio/de-x07.mp3', 'audio/de-x08.mp3', 'audio/de-x09.mp3', 'audio/de-x10.mp3', 'audio/de-x11.mp3', 'audio/de-x12.mp3', 'audio/de-x13.mp3', 'audio/de-x14.mp3', 'audio/de-x15.mp3', 'audio/de-x16.mp3', 'audio/de-x17.mp3', 'audio/de-x18.mp3', 'audio/de-x19.mp3', 'audio/de-x20.mp3', 'audio/de-x21.mp3', 'audio/de-x22.mp3', 'audio/de-x23.mp3', 'audio/de-x24.mp3', 'audio/de-x25.mp3', 'audio/de-x26.mp3', 'audio/de-x27.mp3', 'audio/de-x28.mp3', 'audio/de-x29.mp3', 'audio/de-x30.mp3', 'audio/de-x31.mp3', 'audio/de-x32.mp3', 'audio/de-x33.mp3', 'audio/de-x34.mp3', 'audio/de-x35.mp3', 'audio/de-x36.mp3', 'audio/en-x01.mp3', 'audio/en-x02.mp3', 'audio/en-x03.mp3', 'audio/en-x04.mp3', 'audio/en-x05.mp3', 'audio/en-x06.mp3', 'audio/en-x07.mp3', 'audio/en-x08.mp3', 'audio/en-x09.mp3', 'audio/en-x10.mp3', 'audio/en-x11.mp3', 'audio/en-x12.mp3', 'audio/en-x13.mp3', 'audio/en-x14.mp3', 'audio/en-x15.mp3', 'audio/en-x16.mp3', 'audio/en-x17.mp3', 'audio/en-x18.mp3', 'audio/en-x19.mp3', 'audio/en-x20.mp3', 'audio/en-x21.mp3', 'audio/en-x22.mp3', 'audio/en-x23.mp3', 'audio/en-x24.mp3', 'audio/en-x25.mp3', 'audio/en-x26.mp3', 'audio/en-x27.mp3', 'audio/en-x28.mp3', 'audio/en-x29.mp3', 'audio/en-x30.mp3', 'audio/en-x31.mp3', 'audio/en-x32.mp3', 'audio/en-x33.mp3', 'audio/en-x34.mp3', 'audio/en-x35.mp3', 'audio/es-x01.mp3', 'audio/es-x02.mp3', 'audio/es-x03.mp3', 'audio/es-x04.mp3', 'audio/es-x05.mp3', 'audio/es-x06.mp3', 'audio/es-x07.mp3', 'audio/es-x08.mp3', 'audio/es-x09.mp3', 'audio/es-x10.mp3', 'audio/es-x11.mp3', 'audio/es-x12.mp3', 'audio/es-x13.mp3', 'audio/es-x14.mp3', 'audio/es-x15.mp3', 'audio/es-x16.mp3', 'audio/es-x17.mp3', 'audio/es-x18.mp3', 'audio/es-x19.mp3', 'audio/es-x20.mp3', 'audio/es-x21.mp3', 'audio/es-x22.mp3', 'audio/es-x23.mp3', 'audio/es-x24.mp3', 'audio/es-x25.mp3', 'audio/es-x26.mp3', 'audio/es-x27.mp3', 'audio/es-x28.mp3', 'audio/es-x29.mp3', 'audio/es-x30.mp3', 'audio/es-x31.mp3', 'audio/es-x32.mp3', 'audio/es-x33.mp3', 'audio/es-x34.mp3', 'audio/es-x35.mp3',
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
