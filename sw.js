// Funciona sin internet: guarda la app la primera vez y luego sirve desde caché.
const VERSION = 'colorines-v22';
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
  'scenes/granja.webp', 'scenes/granja-mini.webp', 'scenes/playa.webp', 'scenes/playa-mini.webp', 'audio/de-y01.mp3', 'audio/de-y02.mp3', 'audio/de-y03.mp3', 'audio/de-y04.mp3', 'audio/de-y05.mp3', 'audio/de-y06.mp3', 'audio/de-y07.mp3', 'audio/de-y08.mp3', 'audio/de-y09.mp3', 'audio/de-y10.mp3', 'audio/de-y11.mp3', 'audio/de-y12.mp3', 'audio/en-y01.mp3', 'audio/en-y02.mp3', 'audio/en-y03.mp3', 'audio/en-y04.mp3', 'audio/en-y05.mp3', 'audio/en-y06.mp3', 'audio/en-y07.mp3', 'audio/en-y08.mp3', 'audio/en-y09.mp3', 'audio/en-y10.mp3', 'audio/en-y11.mp3', 'audio/en-y12.mp3', 'audio/es-y01.mp3', 'audio/es-y02.mp3', 'audio/es-y03.mp3', 'audio/es-y04.mp3', 'audio/es-y05.mp3', 'audio/es-y06.mp3', 'audio/es-y07.mp3', 'audio/es-y08.mp3', 'audio/es-y09.mp3', 'audio/es-y10.mp3', 'audio/es-y11.mp3', 'audio/es-y12.mp3',
  'js/howto.js', 'stories/agua-1.webp', 'stories/agua-2.webp', 'stories/agua-3-mini.webp', 'stories/agua-3.webp', 'stories/arbol-1.webp', 'stories/arbol-2.webp', 'stories/arbol-3.webp', 'stories/arbol-4.webp', 'stories/arbol-5.webp', 'stories/arbol-6-mini.webp', 'stories/arbol-6.webp', 'stories/arbol-7.webp', 'stories/arcoiris-1-mini.webp', 'stories/arcoiris-1.webp', 'stories/volcan-1.webp', 'stories/volcan-2.webp', 'stories/volcan-3.webp', 'stories/volcan-4-mini.webp', 'stories/volcan-4.webp', 'stories/volcan-5.webp', 'stories/volcan-6.webp', 'audio/de-h01.mp3', 'audio/de-h02.mp3', 'audio/de-h03.mp3', 'audio/de-h04.mp3', 'audio/de-h05.mp3', 'audio/de-h06.mp3', 'audio/de-h07.mp3', 'audio/de-h08.mp3', 'audio/de-h09.mp3', 'audio/de-h10.mp3', 'audio/de-h11.mp3', 'audio/en-h01.mp3', 'audio/en-h02.mp3', 'audio/en-h03.mp3', 'audio/en-h04.mp3', 'audio/en-h05.mp3', 'audio/en-h06.mp3', 'audio/en-h07.mp3', 'audio/en-h08.mp3', 'audio/en-h09.mp3', 'audio/en-h10.mp3', 'audio/es-h01.mp3', 'audio/es-h02.mp3', 'audio/es-h03.mp3', 'audio/es-h04.mp3', 'audio/es-h05.mp3', 'audio/es-h06.mp3', 'audio/es-h07.mp3', 'audio/es-h08.mp3', 'audio/es-h09.mp3', 'audio/es-h10.mp3',
  'stories/mariposa-1.webp', 'stories/mariposa-2.webp', 'stories/mariposa-3.webp', 'stories/mariposa-4.webp', 'stories/mariposa-5.webp', 'stories/mariposa-6-mini.webp', 'stories/mariposa-6.webp', 'stories/pan-1.webp', 'stories/pan-2.webp', 'stories/pan-3.webp', 'stories/pan-4.webp', 'stories/pan-5.webp', 'stories/pan-6.webp', 'stories/pan-7.webp', 'stories/pan-8-mini.webp', 'stories/pan-8.webp', 'stories/tierra-1.webp', 'stories/tierra-2.webp', 'stories/tierra-3.webp', 'stories/tierra-4-mini.webp', 'stories/tierra-4.webp', 'audio/de-k01.mp3', 'audio/de-k02.mp3', 'audio/de-k03.mp3', 'audio/de-k04.mp3', 'audio/de-k05.mp3', 'audio/de-k06.mp3', 'audio/de-k07.mp3', 'audio/de-k08.mp3', 'audio/de-k09.mp3', 'audio/de-k10.mp3', 'audio/de-k11.mp3', 'audio/de-k12.mp3', 'audio/de-k13.mp3', 'audio/en-k01.mp3', 'audio/en-k02.mp3', 'audio/en-k03.mp3', 'audio/en-k04.mp3', 'audio/en-k05.mp3', 'audio/en-k06.mp3', 'audio/en-k07.mp3', 'audio/en-k08.mp3', 'audio/en-k09.mp3', 'audio/en-k10.mp3', 'audio/en-k11.mp3', 'audio/es-k01.mp3', 'audio/es-k02.mp3', 'audio/es-k03.mp3', 'audio/es-k04.mp3', 'audio/es-k05.mp3', 'audio/es-k06.mp3', 'audio/es-k07.mp3', 'audio/es-k08.mp3', 'audio/es-k09.mp3', 'audio/es-k10.mp3', 'audio/es-k11.mp3',
  'js/phrases.js', 'js/practice.js', 'phrases/comer-1.webp', 'phrases/comer-2.webp', 'phrases/comer-3.webp', 'phrases/comer-4.webp', 'phrases/comer-5.webp', 'phrases/comer-6.webp', 'phrases/cuerpo-1.webp', 'phrases/cuerpo-2.webp', 'phrases/cuerpo-3.webp', 'phrases/cuerpo-4.webp', 'phrases/cuerpo-5.webp', 'phrases/cuerpo-6.webp', 'phrases/dormir-1.webp', 'phrases/dormir-2.webp', 'phrases/dormir-3.webp', 'phrases/dormir-4.webp', 'phrases/dormir-5.webp', 'phrases/dormir-6.webp', 'phrases/jugar-1.webp', 'phrases/jugar-2.webp', 'phrases/jugar-3.webp', 'phrases/jugar-4.webp', 'phrases/jugar-5.webp', 'phrases/jugar-6.webp', 'phrases/magia-1.webp', 'phrases/magia-2.webp', 'phrases/magia-3.webp', 'phrases/magia-4.webp', 'phrases/magia-5.webp', 'phrases/magia-6.webp', 'phrases/sentir-1.webp', 'phrases/sentir-2.webp', 'phrases/sentir-3.webp', 'phrases/sentir-4.webp', 'phrases/sentir-5.webp', 'phrases/sentir-6.webp', 'audio/de-f01.mp3', 'audio/de-f02.mp3', 'audio/de-f03.mp3', 'audio/de-f04.mp3', 'audio/de-f05.mp3', 'audio/de-f06.mp3', 'audio/de-f07.mp3', 'audio/de-f08.mp3', 'audio/de-f09.mp3', 'audio/de-f10.mp3', 'audio/de-f11.mp3', 'audio/en-f01.mp3', 'audio/en-f02.mp3', 'audio/en-f03.mp3', 'audio/en-f04.mp3', 'audio/en-f05.mp3', 'audio/en-f06.mp3', 'audio/en-f07.mp3', 'audio/en-f08.mp3', 'audio/en-f09.mp3', 'audio/en-f10.mp3', 'audio/en-f11.mp3', 'audio/es-f01.mp3', 'audio/es-f02.mp3', 'audio/es-f03.mp3', 'audio/es-f04.mp3', 'audio/es-f05.mp3', 'audio/es-f06.mp3', 'audio/es-f07.mp3', 'audio/es-f08.mp3', 'audio/es-f09.mp3', 'audio/es-f10.mp3', 'audio/es-f11.mp3',
  'phrases/cole-1.webp', 'phrases/cole-2.webp', 'phrases/cole-3.webp', 'phrases/cole-4.webp', 'phrases/cole-5.webp', 'phrases/cole-6.webp', 'phrases/medico-1.webp', 'phrases/medico-2.webp', 'phrases/medico-3.webp', 'phrases/medico-4.webp', 'phrases/medico-5.webp', 'phrases/medico-6.webp', 'phrases/parque-1.webp', 'phrases/parque-2.webp', 'phrases/parque-3.webp', 'phrases/parque-4.webp', 'phrases/parque-5.webp', 'phrases/parque-6.webp', 'audio/de-g01.mp3', 'audio/de-g02.mp3', 'audio/de-g03.mp3', 'audio/de-g04.mp3', 'audio/de-g05.mp3', 'audio/en-g01.mp3', 'audio/en-g02.mp3', 'audio/en-g03.mp3', 'audio/en-g04.mp3', 'audio/en-g05.mp3', 'audio/es-g01.mp3', 'audio/es-g02.mp3', 'audio/es-g03.mp3', 'audio/es-g04.mp3', 'audio/es-g05.mp3',
  'phrases/coche-1.webp', 'phrases/coche-2.webp', 'phrases/coche-3.webp', 'phrases/coche-4.webp', 'phrases/coche-5b.webp', 'phrases/coche-6.webp', 'phrases/tienda-1.webp', 'phrases/tienda-2.webp', 'phrases/tienda-3.webp', 'phrases/tienda-4.webp', 'phrases/tienda-5.webp', 'phrases/tienda-6.webp', 'audio/de-j01.mp3', 'audio/de-j02.mp3', 'audio/de-j03.mp3', 'audio/en-j01.mp3', 'audio/en-j02.mp3', 'audio/en-j03.mp3', 'audio/es-j01.mp3', 'audio/es-j02.mp3', 'audio/es-j03.mp3',
  'phrases/bano-1.webp', 'phrases/bano-2.webp', 'phrases/bano-3.webp', 'phrases/bano-4.webp', 'phrases/bano-5.webp', 'phrases/bano-6.webp', 'phrases/casa-1.webp', 'phrases/casa-2.webp', 'phrases/casa-3.webp', 'phrases/casa-4.webp', 'phrases/casa-5.webp', 'phrases/casa-6.webp', 'audio/de-p01.mp3', 'audio/de-p02.mp3', 'audio/de-p03.mp3', 'audio/en-p01.mp3', 'audio/en-p02.mp3', 'audio/en-p03.mp3', 'audio/es-p01.mp3', 'audio/es-p02.mp3', 'audio/es-p03.mp3',
];

// Lo pesado (voces y dibujos, ~70 MB) va en una caché aparte que no se borra al cambiar de
// versión y se llena poco a poco en segundo plano: así el service worker se instala en un
// momento (Chrome lo necesita para dejar instalar la app) y un fallo de red no lo tumba.
const MEDIA = 'colorines-media';
const isMedia = p => /\/(audio|img|scenes|stories|phrases)\/.+\.(mp3|png|webp)$/.test(p);
const CORE = SHELL.filter(p => !isMedia('/' + p));
const FILES = SHELL.filter(p => isMedia('/' + p));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

let filling = null;
function fillMedia() {
  filling ??= (async () => {
    const cache = await caches.open(MEDIA);
    for (const p of FILES) {
      if (await cache.match(p)) continue;
      try { await cache.add(p); } catch { /* sin red: ya se intentará la próxima vez */ }
    }
  })().finally(() => { filling = null; });
  return filling;
}

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== MEDIA).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
  fillMedia();
});

// La página lo pide al abrirse, por si el llenado se quedó a medias.
self.addEventListener('message', e => { if (e.data === 'fill') e.waitUntil(fillMedia()); });

// Red primero para la app (así se actualiza), caché si no hay conexión.
// Voces, dibujos y fuentes: caché primero.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const media = isMedia(url.pathname) || url.host.includes('fonts.');
  e.respondWith((async () => {
    const cache = await caches.open(media ? MEDIA : VERSION);
    if (media) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
    }
    try {
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    } catch {
      return (await caches.match(req, { ignoreSearch: true })) || Response.error();
    }
  })());
});
