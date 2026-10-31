// "¿Cómo pasa?": procesos de la naturaleza contados por pasos.
// Cada paso = un dibujo de fondo (stories/<id>-<n>.webp) + efectos animados en un canvas
// encima (lluvia, vapor, lava…) + una frase con voz. Se avanza tocando la pantalla.
// Las coordenadas de los efectos van en % del dibujo (16:9). cap: 'top' sube el subtítulo
// cuando lo importante está abajo (el magma, la semilla).

import { sfx, say } from './sound.js';

const HAND_AFTER = 2500; // ms tras la frase → aparece la manita "toca para seguir"

export const STORIES = [
  {
    id: 'agua', emoji: '💧', bg: '#CFEFFF', thumb: 3,
    es: 'El ciclo del agua', en: 'The water cycle', de: 'Der Wasserkreislauf',
    steps: [
      { img: 1, fx: [['rays', { x: 14, y: 20, r: 7 }]],
        es: 'Este es el mar. El sol brilla y calienta el agua.', en: 'This is the sea. The sun shines and warms the water.', de: 'Das ist das Meer. Die Sonne scheint und wärmt das Wasser.' },
      { img: 1, fx: [['rays', { x: 14, y: 20, r: 7 }], ['vapor', { x: 2, y: 30, w: 26, h: 42 }]],
        es: 'El agua calentita sube al cielo muy despacito. Se llama vapor.', en: 'The warm water rises slowly into the sky. It is called vapour.', de: 'Das warme Wasser steigt ganz langsam in den Himmel. Das nennt man Wasserdampf.' },
      { img: 2, fx: [['vapor', { x: 2, y: 30, w: 26, h: 42, n: 10 }], ['sparkle', { x: 74, y: 12, r: 10 }]],
        es: 'Arriba hace frío. El vapor se junta y se forman las nubes.', en: 'It is cold up high. The vapour comes together and makes clouds.', de: 'Oben ist es kalt. Der Dampf sammelt sich und es entstehen Wolken.' },
      { img: 3, fx: [['colordrops', { x: 46, y: 8, w: 44, h: 16, n: 26, blue: true }]],
        es: 'Las nubes se llenan de gotitas y se ponen grises.', en: 'The clouds fill up with tiny drops and turn grey.', de: 'Die Wolken füllen sich mit kleinen Tropfen und werden grau.' },
      { img: 3, fx: [['rain', { x: 44, y: 24, w: 48, h: 30, n: 160 }]],
        es: '¡Plic, plic, plic! Llueve sobre la montaña.', en: 'Pitter, patter! It rains on the mountain.', de: 'Plitsch, platsch! Es regnet auf den Berg.' },
      { img: 1, fx: [['river', { pts: [[89.2, 34], [87, 45], [84.5, 51.5], [79, 55], [77.3, 58.3], [79.5, 62.3], [84.3, 66.3], [83.3, 69.7], [75, 72.3], [70, 74.3], [66.5, 78.3], [62.5, 81.5], [56, 83], [48, 82.3], [43.5, 83.7], [36.5, 85], [31.5, 83.5]] }]],
        es: 'El agua de la lluvia baja por el río hasta el mar.', en: 'The rainwater runs down the river to the sea.', de: 'Das Regenwasser fließt den Fluss hinunter bis ins Meer.' },
      { img: 1, fx: [['rays', { x: 14, y: 20, r: 7 }], ['vapor', { x: 2, y: 30, w: 26, h: 42, n: 14 }], ['river', { pts: [[89.2, 34], [87, 45], [84.5, 51.5], [79, 55], [77.3, 58.3], [79.5, 62.3], [84.3, 66.3], [83.3, 69.7], [75, 72.3], [70, 74.3], [66.5, 78.3], [62.5, 81.5], [56, 83], [48, 82.3], [43.5, 83.7], [36.5, 85], [31.5, 83.5]] }]],
        es: '¡Y vuelta a empezar! Esto es el ciclo del agua.', en: 'And it all starts again! This is the water cycle.', de: 'Und alles beginnt von vorn! Das ist der Wasserkreislauf.' },
    ],
  },
  {
    id: 'volcan', emoji: '🌋', bg: '#FFE0CC', thumb: 4, cap: 'top',
    es: 'Cómo nace un volcán', en: 'How a volcano is born', de: 'Wie ein Vulkan entsteht',
    steps: [
      { img: 1, fx: [['bubbles', { x: 32, y: 80, w: 36, h: 18 }], ['glow', { x: 50, y: 92, r: 14, color: '255,150,40' }]],
        es: 'Debajo del suelo, muy hondo, hay roca tan caliente que se derrite. Se llama magma.', en: 'Deep under the ground, rock is so hot that it melts. It is called magma.', de: 'Tief unter der Erde ist Gestein so heiß, dass es schmilzt. Das heißt Magma.' },
      { img: 2, fx: [['bubbles', { x: 46, y: 44, w: 8, h: 50, n: 16 }], ['glow', { x: 50, y: 92, r: 14, color: '255,150,40' }]],
        es: 'El magma empuja hacia arriba y el suelo se hincha.', en: 'The magma pushes up and the ground bulges.', de: 'Das Magma drückt nach oben und der Boden wölbt sich.' },
      { img: 3, fx: [['smoke', { x: 49, y: 17, n: 12, size: 3 }], ['bubbles', { x: 47, y: 25, w: 5, h: 60, n: 12 }]],
        es: 'Se forma una montaña con un agujero arriba. ¡Es un volcán!', en: 'A mountain with a hole on top grows. It is a volcano!', de: 'Ein Berg mit einem Loch oben entsteht. Das ist ein Vulkan!' },
      { img: 4, fx: [['lava', { x: 50, y: 20 }], ['smoke', { x: 48, y: 10, n: 22, size: 6 }]], shake: true,
        es: '¡Bum! El volcán entra en erupción y sale lava muy caliente.', en: 'Boom! The volcano erupts and very hot lava comes out.', de: 'Bumm! Der Vulkan bricht aus und heiße Lava kommt heraus.' },
      { img: 5, fx: [['smoke', { x: 49, y: 17, n: 6, size: 2.5, white: true }]],
        es: 'La lava se enfría y se convierte en roca dura.', en: 'The lava cools down and turns into hard rock.', de: 'Die Lava kühlt ab und wird zu hartem Stein.' },
      { img: 6, fx: [['sparkle', { x: 50, y: 32, r: 16, n: 14 }], ['fly', { e: '🦋', x: 30, y: 30, rx: 8, ry: 5, n: 2 }]],
        es: 'Con el tiempo crecen plantas y vuelven los animales.', en: 'In time, plants grow and the animals come back.', de: 'Mit der Zeit wachsen Pflanzen und die Tiere kommen zurück.' },
    ],
  },
  {
    id: 'arcoiris', emoji: '🌈', bg: '#E9DDFF', thumb: 1,
    es: 'Cómo sale el arcoíris', en: 'How a rainbow appears', de: 'Wie ein Regenbogen entsteht',
    steps: [
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }]],
        es: 'Está lloviendo un poquito.', en: 'It is raining a little.', de: 'Es regnet ein bisschen.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['rays', { x: 14, y: 25, r: 7 }]],
        es: 'Y a la vez, sale el sol.', en: 'And at the same time, the sun comes out.', de: 'Und gleichzeitig kommt die Sonne heraus.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['prism', { x: 50, y: 38 }]],
        es: 'La luz del sol parece blanca, pero lleva todos los colores escondidos.', en: 'Sunlight looks white, but all the colours are hiding inside it.', de: 'Sonnenlicht sieht weiß aus, aber alle Farben verstecken sich darin.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['colordrops', { x: 66, y: 30, w: 34, h: 40 }]],
        es: 'Las gotitas de lluvia separan los colores, como espejitos mágicos.', en: 'The raindrops split the colours, like little magic mirrors.', de: 'Die Regentropfen trennen die Farben, wie kleine Zauberspiegel.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['rainbow', { x: 67, y: 88, r: 30 }]],
        es: '¡Y aparece el arcoíris!', en: 'And a rainbow appears!', de: 'Und ein Regenbogen erscheint!' },
      { img: 1, fx: [['rainbow', { x: 67, y: 88, r: 30, instant: true, bands: true }], ['sparkle', { x: 67, y: 40, r: 26, n: 12 }]],
        es: 'Rojo, naranja, amarillo, verde, azul y morado.', en: 'Red, orange, yellow, green, blue and purple.', de: 'Rot, Orange, Gelb, Grün, Blau und Lila.' },
    ],
  },
  {
    id: 'arbol', emoji: '🌳', bg: '#DDF5C8', thumb: 6,
    es: 'De semilla a árbol', en: 'From seed to tree', de: 'Vom Samen zum Baum',
    steps: [
      { img: 1, fx: [['glow', { x: 49, y: 77, r: 5, color: '255,230,120' }], ['sparkle', { x: 49, y: 77, r: 6, n: 6 }]],
        es: 'Esto es una semilla. Está dormida bajo la tierra.', en: 'This is a seed. It is sleeping under the ground.', de: 'Das ist ein Samen. Er schläft unter der Erde.' },
      { img: 1, fx: [['rain', { x: 30, y: 8, w: 40, h: 52, n: 110 }], ['rays', { x: 89, y: 16, r: 6 }], ['glow', { x: 49, y: 77, r: 5, color: '255,230,120' }]],
        es: 'Con la lluvia y la luz del sol, se despierta.', en: 'With rain and sunshine, it wakes up.', de: 'Mit Regen und Sonnenschein wacht er auf.' },
      { img: 2, fx: [['sparkle', { x: 49, y: 64, r: 8, n: 8 }]],
        es: 'Le sale una raíz hacia abajo y un brote verde hacia arriba.', en: 'A root grows down and a green shoot grows up.', de: 'Eine Wurzel wächst nach unten und ein grüner Spross nach oben.' },
      { img: 3, fx: [['sparkle', { x: 49, y: 45, r: 12, n: 10 }]],
        es: 'Crece y crece, y se convierte en un arbolito.', en: 'It grows and grows into a little tree.', de: 'Er wächst und wächst und wird ein kleiner Baum.' },
      { img: 4, fx: [['sparkle', { x: 50, y: 25, r: 20, n: 14 }], ['fly', { e: '🐦', x: 30, y: 18, rx: 10, ry: 4, n: 1 }]],
        es: 'Pasan los años y se hace un árbol grande y fuerte.', en: 'Years go by and it becomes a big, strong tree.', de: 'Die Jahre vergehen und er wird ein großer, starker Baum.' },
      { img: 5, fx: [['fly', { e: '🐝', x: 48, y: 24, rx: 20, ry: 14, n: 3 }], ['petals', { x: 28, y: 15, w: 44, h: 50 }]],
        es: 'En primavera le salen flores, y las abejas las visitan.', en: 'In spring it grows flowers, and the bees visit them.', de: 'Im Frühling bekommt er Blüten, und die Bienen besuchen sie.' },
      { img: 6, fx: [['sparkle', { x: 50, y: 24, r: 18, n: 14 }]],
        es: 'Las flores se convierten en manzanas.', en: 'The flowers turn into apples.', de: 'Aus den Blüten werden Äpfel.' },
      { img: 6, swap: [7, 1.15], cap: 'top', fx: [['fall', { e: '🍎', x: 62, y: 30, x1: 64.4, y1: 62.8, size: 4.4 }], ['glow', { x: 64.2, y: 83, r: 3.5, color: '255,230,120', delay: 1.4 }]],
        es: 'Una manzana cae al suelo. Dentro tiene semillas.', en: 'An apple falls to the ground. It has seeds inside.', de: 'Ein Apfel fällt auf den Boden. Darin sind Samen.' },
      { img: 1, fx: [['glow', { x: 49, y: 77, r: 5, color: '255,230,120' }], ['sparkle', { x: 49, y: 77, r: 7, n: 8 }]],
        es: 'La semilla se queda en la tierra… ¡y todo vuelve a empezar!', en: 'The seed stays in the ground… and it all starts again!', de: 'Der Samen bleibt in der Erde … und alles beginnt von vorn!' },
    ],
  },
];

export const imgOf = (story, n) => `stories/${story.id}-${n}.webp`;

// ---------- efectos ----------
// Cada efecto recibe sus opciones (en % del dibujo) y devuelve draw(ctx, W, H, t, dt).
const rand = (a, b) => a + Math.random() * (b - a);
const RAINBOW = ['#FF4B4B', '#FF9A2E', '#FFE14D', '#5BD15B', '#3FA7FF', '#9B6BFF'];

function star(c, x, y, r) {
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, rr = i % 2 ? r * 0.35 : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath(); c.fill();
}

const FX = {
  rays({ x, y, r = 7 }) {
    return (c, W, H, t) => {
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W;
      const g = c.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 2);
      g.addColorStop(0, `rgba(255,240,150,${0.45 + 0.15 * Math.sin(t * 2)})`);
      g.addColorStop(1, 'rgba(255,240,150,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * 2, 0, 7); c.fill();
      c.save(); c.translate(cx, cy); c.rotate(t * 0.25);
      c.strokeStyle = 'rgba(255,200,60,.8)'; c.lineCap = 'round'; c.lineWidth = R * 0.09;
      for (let i = 0; i < 12; i++) {
        c.rotate(Math.PI / 6);
        const p = 1 + 0.15 * Math.sin(t * 3 + i);
        c.beginPath(); c.moveTo(R * 1.15, 0); c.lineTo(R * 1.5 * p, 0); c.stroke();
      }
      c.restore();
    };
  },

  rain({ x, y, w, h, n = 120 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), y: rand(y, y + h), v: rand(55, 80) }));
    return (c, W, H, t, dt) => {
      c.strokeStyle = 'rgba(110,160,255,.85)'; c.lineCap = 'round'; c.lineWidth = Math.max(1.5, W * 0.0022);
      c.beginPath();
      for (const p of ps) {
        p.y += p.v * dt;
        if (p.y > y + h) { p.y = y + rand(-4, 0); p.x = rand(x, x + w); }
        const px = p.x / 100 * W, py = p.y / 100 * H;
        c.moveTo(px, py); c.lineTo(px - W * 0.003, py + H * 0.035);
      }
      c.stroke();
    };
  },

  // Vapor: hilitos ondulados blancos que suben desde abajo y se desvanecen.
  vapor({ x, y, w, h, n = 22 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), age: rand(0, 1), v: rand(0.18, 0.3), ph: rand(0, 6) }));
    return (c, W, H, t, dt) => {
      c.lineCap = 'round'; c.lineWidth = Math.max(2, W * 0.004);
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); }
        const py = (y + h - p.age * h) / 100 * H, px = p.x / 100 * W;
        const a = Math.sin(p.age * Math.PI);
        c.strokeStyle = `rgba(255,255,255,${0.85 * a})`;
        c.beginPath();
        for (let k = 0; k <= 10; k++) {
          const yy = py - k * H * 0.006;
          const xx = px + Math.sin(k * 0.8 + t * 3 + p.ph) * W * 0.006;
          k ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
        }
        c.stroke();
      }
    };
  },

  sparkle({ x, y, r = 8, n = 10 }) {
    const ps = Array.from({ length: n }, () => ({ a: rand(0, 6.3), d: rand(0.2, 1), ph: rand(0, 6), s: rand(0.6, 1.2) }));
    return (c, W, H, t) => {
      for (const p of ps) {
        const k = Math.max(0, Math.sin(t * 2.5 + p.ph));
        c.fillStyle = `rgba(255,236,120,${k})`;
        star(c, (x + Math.cos(p.a) * r * p.d) / 100 * W, y / 100 * H + Math.sin(p.a) * r * p.d / 100 * W, W * 0.012 * p.s * k);
      }
    };
  },

  glow({ x, y, r = 5, color = '255,230,120', delay = 0 }) {
    return (c, W, H, t) => {
      if (t < delay) return;
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W * (1 + 0.15 * Math.sin(t * 3));
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, `rgba(${color},${Math.min(1, (t - delay) * 2) * 0.75})`);
      g.addColorStop(1, `rgba(${color},0)`);
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
    };
  },

  smoke({ x, y, n = 14, size = 4, white = false }) {
    const ps = Array.from({ length: n }, () => ({ age: rand(0, 1), dx: rand(-1, 1), v: rand(0.18, 0.3) }));
    const col = white ? '245,245,245' : '120,120,125';
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.dx = rand(-1, 1); }
        const px = (x + p.dx * 3 * p.age + Math.sin(t + p.dx * 5) * 0.6) / 100 * W;
        const py = (y - p.age * 16) / 100 * H;
        const r = (size * (0.4 + p.age)) / 100 * W;
        c.fillStyle = `rgba(${col},${0.55 * (1 - p.age)})`;
        c.beginPath(); c.arc(px, py, r, 0, 7); c.fill();
      }
    };
  },

  lava({ x, y, n = 70 }) {
    const spawn = p => Object.assign(p, { x, y, vx: rand(-9, 9), vy: rand(-48, -28), life: rand(0.9, 1.6), age: 0 });
    const ps = Array.from({ length: n }, () => { const p = spawn({}); p.age = rand(0, p.life); return p; });
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += dt;
        if (p.age > p.life) spawn(p);
        const px = (p.x + p.vx * p.age) / 100 * W;
        const py = (p.y + p.vy * p.age + 40 * p.age * p.age) / 100 * H;
        const k = 1 - p.age / p.life;
        c.fillStyle = `rgba(255,${Math.round(120 + 110 * k)},40,${0.9 * k + 0.1})`;
        c.beginPath(); c.arc(px, py, W * 0.006 * (0.6 + k), 0, 7); c.fill();
      }
    };
  },

  bubbles({ x, y, w, h, n = 20 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), age: rand(0, 1), v: rand(0.25, 0.5), r: rand(0.5, 1.1) }));
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); }
        const px = p.x / 100 * W, py = (y + h - p.age * h) / 100 * H;
        const a = Math.sin(p.age * Math.PI);
        c.fillStyle = `rgba(255,220,90,${0.8 * a})`;
        c.beginPath(); c.arc(px, py, W * 0.006 * p.r, 0, 7); c.fill();
      }
    };
  },

  // Brillos que recorren el río hacia el mar.
  river({ pts }) {
    return (c, W, H, t) => {
      const P = pts.map(([px, py]) => [px / 100 * W, py / 100 * H]);
      const seg = []; let L = 0;
      for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); L += d; }
      const at = s => {
        for (let i = 0; i < seg.length; i++) {
          if (s <= seg[i]) { const k = s / seg[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * k, P[i][1] + (P[i + 1][1] - P[i][1]) * k]; }
          s -= seg[i];
        }
        return P[P.length - 1];
      };
      const gap = W * 0.05, len = W * 0.018, off = (t * W * 0.06) % gap;
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineCap = 'round'; c.lineWidth = Math.max(2.5, W * 0.0045);
      c.beginPath();
      for (let s = off; s < L - len; s += gap) {
        const a = at(s), b = at(s + len);
        c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]);
      }
      c.stroke();
    };
  },

  // Arco iris: se pinta de izquierda a derecha (o de golpe) y, con bands, cada color brilla por turnos.
  rainbow({ x, y, r, instant = false, bands = false }) {
    return (c, W, H, t) => {
      const p = instant ? 1 : Math.min(1, t / 2.6);
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W, bw = R * 0.065;
      c.lineWidth = bw * 1.05;
      RAINBOW.forEach((col, i) => {
        const lit = bands && Math.floor(t / 0.75) % RAINBOW.length === i;
        c.globalAlpha = lit ? 1 : 0.78;
        c.strokeStyle = col;
        c.beginPath(); c.arc(cx, cy, R - i * bw, Math.PI, Math.PI + Math.PI * p); c.stroke();
      });
      c.globalAlpha = 1;
    };
  },

  // Tarjeta: un rayo blanco entra en una gota y sale separado en colores.
  prism({ x, y }) {
    return (c, W, H, t) => {
      const cx = x / 100 * W, cy = y / 100 * H, cw = W * 0.36, ch = H * 0.42;
      const k = Math.min(1, t / 0.5);
      c.globalAlpha = k;
      c.fillStyle = 'rgba(255,255,255,.93)';
      c.beginPath(); c.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, W * 0.02); c.fill();
      const dx = cx - cw * 0.05, dy = cy + ch * 0.05, dr = ch * 0.2;
      // rayo blanco con borde gris para que se vea sobre blanco
      const grow = Math.min(1, t / 1.2);
      c.lineCap = 'round';
      c.strokeStyle = '#d8d8d8'; c.lineWidth = W * 0.012;
      c.beginPath(); c.moveTo(cx - cw * 0.45, cy - ch * 0.3); c.lineTo(cx - cw * 0.45 + (dx - dr * 0.7 - cx + cw * 0.45) * grow, cy - ch * 0.3 + (dy - dr * 0.3 - cy + ch * 0.3) * grow); c.stroke();
      c.strokeStyle = '#fffbe8'; c.lineWidth = W * 0.007; c.stroke();
      // gota
      c.fillStyle = 'rgba(120,190,255,.85)';
      c.beginPath(); c.moveTo(dx, dy - dr * 1.6);
      c.bezierCurveTo(dx + dr * 1.1, dy - dr * 0.3, dx + dr, dy + dr, dx, dy + dr);
      c.bezierCurveTo(dx - dr, dy + dr, dx - dr * 1.1, dy - dr * 0.3, dx, dy - dr * 1.6); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)';
      c.beginPath(); c.ellipse(dx - dr * 0.35, dy - dr * 0.1, dr * 0.15, dr * 0.3, -0.4, 0, 7); c.fill();
      // colores que salen
      const out = Math.max(0, Math.min(1, (t - 1.2) / 1.2));
      c.lineWidth = W * 0.008;
      RAINBOW.forEach((col, i) => {
        const a = -0.35 + i * 0.14;
        c.strokeStyle = col;
        c.beginPath(); c.moveTo(dx + dr * 0.6, dy);
        c.lineTo(dx + dr * 0.6 + Math.cos(a) * cw * 0.42 * out, dy + Math.sin(a) * cw * 0.42 * out); c.stroke();
      });
      c.globalAlpha = 1;
    };
  },

  // Gotitas que brillan (de colores, o azules si blue).
  colordrops({ x, y, w, h, n = 30, blue = false }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), y: rand(y, y + h), ph: rand(0, 6), c: Math.floor(rand(0, 6)) }));
    return (c, W, H, t) => {
      for (const p of ps) {
        const k = Math.max(0, Math.sin(t * 2 + p.ph));
        c.fillStyle = blue ? `rgba(150,200,255,${0.9 * k})` : RAINBOW[(p.c + Math.floor(t * 2)) % 6];
        c.globalAlpha = blue ? 1 : k;
        const px = p.x / 100 * W, py = p.y / 100 * H, r = W * 0.007 * (0.6 + k * 0.6);
        c.beginPath(); c.moveTo(px, py - r * 1.8);
        c.quadraticCurveTo(px + r * 1.2, py + r * 0.2, px, py + r);
        c.quadraticCurveTo(px - r * 1.2, py + r * 0.2, px, py - r * 1.8); c.fill();
      }
      c.globalAlpha = 1;
    };
  },

  // Emojis que revolotean alrededor de un punto (abejas, pájaros, mariposas).
  fly({ e, x, y, rx, ry, n = 2 }) {
    const ps = Array.from({ length: n }, (_, i) => ({ ph: i * 6.28 / n, sp: rand(0.6, 0.9) }));
    return (c, W, H, t) => {
      c.font = `${Math.round(W * 0.035)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
      for (const p of ps) {
        const a = t * p.sp + p.ph;
        c.fillText(e, (x + Math.cos(a) * rx) / 100 * W, (y + Math.sin(a * 2) * ry) / 100 * H + Math.sin(t * 9 + p.ph) * W * 0.003);
      }
    };
  },

  petals({ x, y, w, h, n = 14 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), age: rand(0, 1), v: rand(0.12, 0.22), ph: rand(0, 6) }));
    return (c, W, H, t, dt) => {
      c.font = `${Math.round(W * 0.018)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); }
        c.globalAlpha = Math.sin(p.age * Math.PI);
        c.fillText('🌸', (p.x + Math.sin(t * 2 + p.ph) * 2) / 100 * W, (y + p.age * h) / 100 * H);
      }
      c.globalAlpha = 1;
    };
  },

  // Algo que cae con un botecito y se queda (la manzana).
  fall({ e, x, y, x1, y1, size = 4 }) {
    return (c, W, H, t) => {
      const T = 1.1;
      let px, py;
      if (t < T) { const k = t / T; px = x + (x1 - x) * k; py = y + (y1 - y) * k * k; }
      else { const b = Math.max(0, Math.sin((t - T) * 9) * Math.exp(-(t - T) * 5)); px = x1; py = y1 - b * 4; }
      c.globalAlpha = t < 1.5 ? 1 : Math.max(0, 1 - (t - 1.5) * 1.5); // se funde con la manzana del dibujo
      c.font = `${Math.round(W * size / 100)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(e, px / 100 * W, py / 100 * H);
      c.globalAlpha = 1;
    };
  },
};

// ---------- reproductor ----------
export class StoryView {
  constructor(root, story, { lang, onEnd = () => {} }) {
    this.root = root; this.story = story; this.lang = lang; this.onEnd = onEnd;
    root.innerHTML = `
      <div class="st-stage">
        <img class="st-img" alt="" draggable="false"><img class="st-img" alt="" draggable="false">
        <canvas class="st-fx"></canvas>
      </div>
      <div class="st-cap"></div>
      <div class="st-dots">${story.steps.map(() => '<i></i>').join('')}</div>
      <div class="st-hand">👆</div>`;
    this.stage = root.querySelector('.st-stage');
    this.imgs = [...root.querySelectorAll('.st-img')];
    this.cv = root.querySelector('.st-fx');
    this.ctx = this.cv.getContext('2d');
    this.cap = root.querySelector('.st-cap');
    this.dots = [...root.querySelectorAll('.st-dots i')];
    this.hand = root.querySelector('.st-hand');
    this.front = 0;
    // precarga todos los dibujos
    this.pre = [...new Set(story.steps.flatMap(s => s.swap ? [s.img, s.swap[0]] : [s.img]))].map(n => { const i = new Image(); i.src = imgOf(story, n); return i; });
    this.ro = new ResizeObserver(() => this.size());
    this.ro.observe(this.stage);
    this.onTapBound = () => this.tap();
    root.addEventListener('click', this.onTapBound);
    this.last = performance.now();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
    this.goto(0);
  }

  destroy() {
    this.dead = true;
    cancelAnimationFrame(this.raf); this.ro.disconnect();
    clearTimeout(this.handT); clearTimeout(this.lockT); clearTimeout(this.swapT);
  }

  size() {
    const r = this.stage.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    this.cv.width = Math.round(r.width * d); this.cv.height = Math.round(r.height * d);
  }

  goto(i) {
    this.i = i;
    const st = this.story.steps[i];
    this.show(st.img);
    clearTimeout(this.swapT);
    // swap: [dibujo, segundos] → a mitad del paso pasa al siguiente dibujo (la manzana ya en el suelo)
    if (st.swap) this.swapT = setTimeout(() => this.show(st.swap[0]), st.swap[1] * 1000);
    this.stage.classList.toggle('shake', !!st.shake);
    this.fx = st.fx.map(([type, o]) => FX[type](o));
    this.t0 = performance.now();
    this.dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    const text = st[this.lang] ?? st.es;
    this.cap.textContent = text;
    this.cap.classList.toggle('top', (st.cap ?? this.story.cap) === 'top');
    this.cap.classList.remove('in'); void this.cap.offsetWidth; this.cap.classList.add('in');
    this.hand.classList.remove('on');
    clearTimeout(this.handT);
    this.locked = true;
    clearTimeout(this.lockT);
    this.lockT = setTimeout(() => { this.locked = false; }, 900);
    say(text, this.lang).then(() => {
      if (this.dead || this.i !== i) return;
      this.handT = setTimeout(() => this.hand.classList.add('on'), HAND_AFTER);
    });
  }

  // Cambia el dibujo con un fundido (si es distinto).
  show(n) {
    const src = imgOf(this.story, n);
    if (this.imgs[this.front].src.endsWith(src)) return;
    const back = 1 - this.front;
    this.imgs[back].src = src;
    this.imgs[back].classList.add('on'); this.imgs[this.front].classList.remove('on');
    this.front = back;
  }

  tap() {
    if (this.locked || this.done) return;
    if (this.i < this.story.steps.length - 1) { sfx.pop(this.i + 2); this.goto(this.i + 1); }
    else { this.done = true; this.hand.classList.remove('on'); this.onEnd(); }
  }

  restart() { this.done = false; this.goto(0); }

  loop(now) {
    if (this.dead) return;
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    const t = (now - this.t0) / 1000;
    const c = this.ctx, d = Math.min(2, devicePixelRatio || 1);
    const W = this.cv.width / d, H = this.cv.height / d;
    c.setTransform(d, 0, 0, d, 0, 0);
    c.clearRect(0, 0, W, H);
    if (W > 0) for (const f of this.fx) f(c, W, H, t, dt);
    this.raf = requestAnimationFrame(this.loop);
  }
}
