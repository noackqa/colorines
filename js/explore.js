// Escena para explorar: la imagen ocupa el alto de la pantalla y, si es más ancha,
// se arrastra con el dedo. Tocar algo lo hace "saltar", muestra la palabra y la dice.

import { sfx, say } from './sound.js';

const TAP_MOVE = 12;      // px: más movimiento que esto es arrastrar, no tocar
const HINT_AFTER = 14000; // ms sin tocar nada → una cosa sin descubrir se menea

export class SceneView {
  constructor(root, scene, { lang, onFind = () => {}, onAll = () => {} }) {
    this.root = root; this.scene = scene; this.lang = lang;
    this.onFind = onFind; this.onAll = onAll;
    this.found = new Set();
    this.total = new Set(scene.items.map(i => i.es)).size;
    this.x = 0;

    root.innerHTML = `<div class="sc-pan"><img class="sc-img" alt="" draggable="false"><div class="sc-fx"></div></div>`;
    this.pan = root.querySelector('.sc-pan');
    this.img = root.querySelector('.sc-img');
    this.fx = root.querySelector('.sc-fx');
    this.img.src = scene.img;
    this.img.onload = () => this.layout();
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(root);

    root.addEventListener('pointerdown', e => this.down(e));
    root.addEventListener('pointermove', e => this.move(e));
    root.addEventListener('pointerup', e => this.up(e));
    root.addEventListener('pointercancel', () => { this.drag = null; });
    this.resetHint();
  }

  destroy() { this.ro.disconnect(); clearTimeout(this.hintT); this.dead = true; }

  layout() {
    const r = this.root.getBoundingClientRect();
    if (!this.img.naturalWidth || !r.height) return;
    this.h = r.height;
    this.w = this.h * this.img.naturalWidth / this.img.naturalHeight;
    // Si la pantalla es más ancha que la imagen, ajusta al ancho.
    if (this.w < r.width) { this.w = r.width; this.h = this.w * this.img.naturalHeight / this.img.naturalWidth; }
    this.vw = r.width;
    this.pan.style.width = this.w + 'px';
    this.pan.style.height = this.h + 'px';
    if (this.first !== false) { this.first = false; this.x = (this.vw - this.w) / 2; }
    this.setX(this.x);
  }

  setX(x) {
    this.x = Math.min(0, Math.max(this.vw - this.w, x));
    this.pan.style.transform = `translateX(${this.x}px)`;
  }

  down(e) {
    if (this.drag) return;
    this.drag = { id: e.pointerId, sx: e.clientX, x0: this.x, moved: false };
    try { this.root.setPointerCapture(e.pointerId); } catch {}
  }

  move(e) {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    if (Math.abs(dx) > TAP_MOVE) d.moved = true;
    if (d.moved) this.setX(d.x0 + dx);
  }

  up(e) {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    this.drag = null;
    if (!d.moved) this.tap(e.clientX, e.clientY);
  }

  // Coordenadas de pantalla → % de la imagen.
  toPct(cx, cy) {
    const r = this.pan.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * 100, y: (cy - r.top) / r.height * 100 };
  }

  hit(p) {
    let best = null, area = Infinity;
    for (const it of this.scene.items) for (const [x, y, w, h] of it.b) {
      const pad = 0.6;
      if (p.x >= x - pad && p.x <= x + w + pad && p.y >= y - pad && p.y <= y + h + pad && w * h < area) {
        area = w * h; best = { it, box: [x, y, w, h] };
      }
    }
    return best;
  }

  tap(cx, cy) {
    this.resetHint();
    const p = this.toPct(cx, cy);
    const h = this.hit(p);
    if (!h) { this.ripple(p); sfx.tap(); return; }
    this.pop(h.box);
    this.bubble(h.box, h.it[this.lang] ?? h.it.es);
    say(h.it[this.lang] ?? h.it.es, this.lang);
    const isNew = !this.found.has(h.it.es);
    if (isNew) {
      this.found.add(h.it.es);
      sfx.pop(this.found.size);
      this.onFind(this.found.size, this.total);
      if (this.found.size === this.total) setTimeout(() => this.onAll(), 1600);
    } else sfx.sparkle();
  }

  // El trozo de imagen tocado salta por encima del dibujo.
  pop([x, y, w, h], soft = false) {
    const el = document.createElement('div');
    el.className = 'sc-pop' + (soft ? ' soft' : '');
    Object.assign(el.style, {
      left: x + '%', top: y + '%', width: w + '%', height: h + '%',
      backgroundImage: `url(${this.scene.img})`,
      backgroundSize: `${10000 / w}% ${10000 / h}%`,
      backgroundPosition: `${w >= 100 ? 0 : x / (100 - w) * 100}% ${h >= 100 ? 0 : y / (100 - h) * 100}%`,
    });
    this.fx.appendChild(el);
    if (!soft) for (let k = 0; k < 7; k++) {
      const s = document.createElement('span');
      s.className = 'sc-spark';
      s.textContent = ['✨', '⭐', '💫'][k % 3];
      s.style.left = (x + w / 2) + '%'; s.style.top = (y + h / 2) + '%';
      const a = k / 7 * Math.PI * 2;
      s.style.setProperty('--dx', Math.cos(a) * 70 + 'px');
      s.style.setProperty('--dy', Math.sin(a) * 70 + 'px');
      this.fx.appendChild(s);
      setTimeout(() => s.remove(), 800);
    }
    setTimeout(() => el.remove(), soft ? 1300 : 1500);
  }

  bubble([x, y, w, h], text) {
    this.root.querySelectorAll('.sc-bubble').forEach(b => b.remove());
    const b = document.createElement('div');
    b.className = 'sc-bubble';
    b.textContent = text;
    this.root.appendChild(b);
    // Encima de la cosa (o debajo si no cabe), sin salirse de la pantalla.
    const pr = this.pan.getBoundingClientRect(), rr = this.root.getBoundingClientRect();
    const cx = pr.left - rr.left + (x + w / 2) / 100 * pr.width;
    const top = pr.top - rr.top + y / 100 * pr.height;
    const bot = pr.top - rr.top + (y + h) / 100 * pr.height;
    const bw = b.offsetWidth, bh = b.offsetHeight;
    const left = Math.max(8, Math.min(rr.width - bw - 8, cx - bw / 2));
    const t = top - bh - 10 > 70 ? top - bh - 10 : Math.min(rr.height - bh - 8, bot + 10);
    b.style.left = left + 'px'; b.style.top = t + 'px';
    setTimeout(() => b.classList.add('bye'), 2400);
    setTimeout(() => b.remove(), 2900);
  }

  ripple(p) {
    const r = document.createElement('span');
    r.className = 'sc-ripple';
    r.style.left = p.x + '%'; r.style.top = p.y + '%';
    this.fx.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }

  // Tras un rato sin tocar, algo sin descubrir se menea un poquito (sin marcar nada).
  resetHint() {
    clearTimeout(this.hintT);
    this.hintT = setTimeout(() => {
      if (this.dead) return;
      const left = this.scene.items.filter(i => !this.found.has(i.es));
      if (left.length) {
        const it = left[Math.floor(Math.random() * left.length)];
        const visible = it.b.find(([x, , w]) => {
          const px = this.x + (x + w / 2) / 100 * this.w;
          return px > 0 && px < this.vw;
        }) || it.b[0];
        this.pop(visible, true);
      }
      this.resetHint();
    }, HINT_AFTER);
  }
}
