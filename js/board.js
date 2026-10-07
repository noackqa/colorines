// Lienzo de pintura: relleno por toque, pincel "mágico" que no se sale de la zona,
// purpurina, goma, pegatinas, deshacer y cálculo de cuánto está coloreado.

import { sfx } from './sound.js';

export const W = 1200, H = 900;           // resolución interna (4:3)
const VB_W = 800, VB_H = 600;              // viewBox de los dibujos
const LINE_RGB = [40, 32, 64];
const STAMPS = ['🦄', '🧜‍♀️', '🦈', '🐙', '🐠', '🐬', '🌋', '🦖', '🦕', '🚜', '🚓', '🚑', '🐱', '🦁', '🐶', '⭐', '❤️', '🌈', '🌸', '🦋', '🍓', '☀️'];
const MAX_UNDO = 8;

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

export function drawingSvg(inner, w = VB_W, h = VB_H) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${w}" height="${h}">` +
    `<g fill="#fff" stroke="#000" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
}

export class Board {
  constructor(stage) {
    this.stage = stage;
    this.paint = mk(W, H);
    this.lines = mk(W, H);
    this.paint.className = 'layer paint';
    this.lines.className = 'layer lines';
    stage.append(this.paint, this.lines);
    this.pctx = this.paint.getContext('2d', { willReadFrequently: true });
    this.lctx = this.lines.getContext('2d');
    this.seg = mk(W, H);
    this.sctx = this.seg.getContext('2d');

    this.mode = 'free';          // 'free' | 'color'
    this.tool = 'fill';
    this.color = '#FF3B3B';
    this.size = 36;
    this.hue = 0;
    this.wall = null;            // 1 = línea del dibujo
    this.samples = null;         // índices de píxeles a vigilar para el % coloreado
    this.undoStack = [];
    this.onAction = () => {};
    this.pointer = null;
    this.travel = 0;

    const el = this.paint;
    el.addEventListener('pointerdown', e => this.down(e));
    el.addEventListener('pointermove', e => this.move(e));
    el.addEventListener('pointerup', e => this.up(e));
    el.addEventListener('pointercancel', e => this.up(e));
  }

  async load(inner) {
    this.undoStack = [];
    this.pctx.clearRect(0, 0, W, H);
    this.lctx.clearRect(0, 0, W, H);
    if (!inner) { this.mode = 'free'; this.wall = null; this.samples = null; return; }
    this.mode = 'color';

    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(drawingSvg(inner, W, H));
    await img.decode();
    const m = mk(W, H).getContext('2d', { willReadFrequently: true });
    m.drawImage(img, 0, 0, W, H);
    const d = m.getImageData(0, 0, W, H).data;
    const L = this.lctx.createImageData(W, H);
    const ld = L.data;
    const wall = new Uint8Array(W * H);
    const samples = [];
    for (let i = 0, p = 0; i < W * H; i++, p += 4) {
      const a = d[p + 3];
      if (!a) continue;
      const lum = d[p];
      if (a > 100 && lum < 170) wall[i] = 1;
      const la = Math.round((255 - lum) * a / 255);
      if (la > 0) { ld[p] = LINE_RGB[0]; ld[p + 1] = LINE_RGB[1]; ld[p + 2] = LINE_RGB[2]; ld[p + 3] = Math.min(255, la * 1.2); }
      const x = i % W, y = (i / W) | 0;
      if (a > 200 && lum > 200 && x % 6 === 0 && y % 6 === 0) samples.push(i);
    }
    this.lctx.putImageData(L, 0, 0);
    this.wall = wall;
    this.samples = samples;
  }

  // ---------- coordenadas ----------
  local(e) {
    const r = this.paint.getBoundingClientRect();
    return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  }

  // ---------- eventos ----------
  down(e) {
    e.preventDefault();
    if (this.pointer !== null) return;           // ignora el segundo dedo / la palma
    this.pointer = e.pointerId;
    this.paint.setPointerCapture?.(e.pointerId);
    const p = this.local(e);
    if (this.tool === 'fill') { this.fillAt(p); return; }
    if (this.tool === 'stamp') { this.stampAt(p); return; }
    this.pushUndo();
    this.clip = this.mode === 'color' ? this.clipAt(p) : null;
    this.last = p;
    this.drawing = true;
    this.travel = 0;
    this.segment(p, p);
  }

  move(e) {
    if (!this.drawing || e.pointerId !== this.pointer) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs.length ? evs : [e]) {
      const q = this.local(ev);
      this.segment(this.last, q);
      this.last = q;
    }
  }

  up(e) {
    if (e.pointerId !== this.pointer) return;
    this.pointer = null;
    if (this.drawing) { this.drawing = false; this.clip = null; this.onAction(); }
  }

  // ---------- deshacer ----------
  pushUndo() {
    this.undoStack.push(this.pctx.getImageData(0, 0, W, H));
    if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
  }
  undo() {
    const s = this.undoStack.pop();
    if (!s) return false;
    this.pctx.putImageData(s, 0, 0);
    sfx.undo();
    this.onAction();
    return true;
  }
  isEmpty() {
    const d = this.pctx.getImageData(0, 0, W, H).data;
    for (let p = 3; p < d.length; p += 64) if (d[p]) return false;
    return true;
  }

  // ---------- regiones ----------
  // Relleno por líneas de barrido. `open(i)` dice si el píxel i pertenece a la zona.
  flood(sx, sy, open) {
    const reg = new Uint8Array(W * H);
    let x0 = sx, x1 = sx, y0 = sy, y1 = sy;
    const stack = [sx, sy];
    while (stack.length) {
      const y = stack.pop(), x = stack.pop();
      let l = x, row = y * W;
      if (reg[row + x] || !open(row + x)) continue;
      while (l > 0 && !reg[row + l - 1] && open(row + l - 1)) l--;
      let r = x;
      while (r < W - 1 && !reg[row + r + 1] && open(row + r + 1)) r++;
      for (let i = l; i <= r; i++) reg[row + i] = 1;
      if (l < x0) x0 = l; if (r > x1) x1 = r; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const ny of [y - 1, y + 1]) {
        if (ny < 0 || ny >= H) continue;
        const nrow = ny * W;
        let inRun = false;
        for (let i = l; i <= r; i++) {
          const ok = !reg[nrow + i] && open(nrow + i);
          if (ok && !inRun) { stack.push(i, ny); inRun = true; } else if (!ok) inRun = false;
        }
      }
    }
    return { mask: reg, x0, y0, x1, y1 };
  }

  // Crece la zona unos píxeles por debajo de la línea para que no queden huecos blancos.
  dilate(r, passes, canGrow) {
    for (let k = 0; k < passes; k++) {
      const x0 = Math.max(1, r.x0 - 1), x1 = Math.min(W - 2, r.x1 + 1);
      const y0 = Math.max(1, r.y0 - 1), y1 = Math.min(H - 2, r.y1 + 1);
      const add = [];
      const m = r.mask;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const i = y * W + x;
        if (!m[i] && canGrow(i) && (m[i - 1] || m[i + 1] || m[i - W] || m[i + W])) add.push(i);
      }
      for (const i of add) m[i] = 1;
      Object.assign(r, { x0, x1, y0, y1 });
    }
    return r;
  }

  startPoint(p) {
    let x = Math.max(0, Math.min(W - 1, p.x | 0)), y = Math.max(0, Math.min(H - 1, p.y | 0));
    if (!this.wall || !this.wall[y * W + x]) return { x, y };
    // Tocó justo la línea: busca el hueco más cercano.
    for (let rad = 2; rad <= 14; rad += 2) {
      for (let a = 0; a < 16; a++) {
        const nx = Math.round(x + Math.cos(a * Math.PI / 8) * rad), ny = Math.round(y + Math.sin(a * Math.PI / 8) * rad);
        if (nx >= 0 && ny >= 0 && nx < W && ny < H && !this.wall[ny * W + nx]) return { x: nx, y: ny };
      }
    }
    return null;
  }

  regionAt(p) {
    const s = this.startPoint(p);
    if (!s) return null;
    if (this.mode === 'color') {
      const wall = this.wall;
      const r = this.flood(s.x, s.y, i => !wall[i]);
      return this.dilate(r, 3, i => wall[i]);
    }
    // Modo libre: zona del mismo color en lo ya pintado.
    const d = this.pctx.getImageData(0, 0, W, H).data;
    const o = (s.y * W + s.x) * 4;
    const [R, G, B, A] = [d[o], d[o + 1], d[o + 2], d[o + 3]];
    const near = i => {
      const q = i * 4;
      if (A < 30) return d[q + 3] < 30;
      return Math.abs(d[q] - R) + Math.abs(d[q + 1] - G) + Math.abs(d[q + 2] - B) + Math.abs(d[q + 3] - A) < 90;
    };
    const r = this.flood(s.x, s.y, near);
    return this.dilate(r, 2, () => true);
  }

  // Canvas del tamaño de la zona, pintado con `style` sólo dentro de la zona.
  regionCanvas(r, style) {
    const w = r.x1 - r.x0 + 1, h = r.y1 - r.y0 + 1;
    const c = mk(w, h), cx = c.getContext('2d');
    if (style === 'rainbow') {
      const g = cx.createLinearGradient(0, 0, w, h);
      for (let k = 0; k <= 6; k++) g.addColorStop(k / 6, `hsl(${k * 55}, 95%, 60%)`);
      cx.fillStyle = g;
    } else cx.fillStyle = style;
    cx.fillRect(0, 0, w, h);
    const id = cx.getImageData(0, 0, w, h), dd = id.data;
    for (let y = 0; y < h; y++) {
      const row = (y + r.y0) * W + r.x0;
      for (let x = 0; x < w; x++) if (!r.mask[row + x]) dd[(y * w + x) * 4 + 3] = 0;
    }
    cx.putImageData(id, 0, 0);
    return c;
  }

  // ---------- herramientas ----------
  fillAt(p) {
    const r = this.regionAt(p);
    if (!r) return;
    this.pushUndo();
    const rc = this.regionCanvas(r, this.color);
    sfx.pop();
    const maxR = Math.hypot(Math.max(p.x - r.x0, r.x1 - p.x), Math.max(p.y - r.y0, r.y1 - p.y)) + 4;
    const dur = Math.min(520, 160 + maxR * 0.7);
    const t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 3;
      const c = this.pctx;
      c.save();
      c.beginPath(); c.arc(p.x, p.y, Math.max(2, e * maxR), 0, Math.PI * 2); c.clip();
      c.drawImage(rc, r.x0, r.y0);
      c.restore();
      if (k < 1) requestAnimationFrame(step); else this.onAction();
    };
    requestAnimationFrame(step);
    this.burst(p);
  }

  stampAt(p) {
    this.pushUndo();
    const c = this.pctx, s = STAMPS[Math.floor(Math.random() * STAMPS.length)];
    c.save();
    c.translate(p.x, p.y);
    c.rotate((Math.random() - 0.5) * 0.6);
    c.font = '150px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(s, 0, 0);
    c.restore();
    sfx.stamp();
    this.burst(p);
    this.onAction();
  }

  clipAt(p) {
    const r = this.regionAt(p);
    if (!r) return null;
    return { r, mask: this.regionCanvas(r, '#fff') };
  }

  segment(a, b) {
    const tool = this.tool;
    const size = tool === 'eraser' ? this.size * 1.4 : this.size;
    const pad = size / 2 + 24;
    let bx = Math.floor(Math.min(a.x, b.x) - pad), by = Math.floor(Math.min(a.y, b.y) - pad);
    let bw = Math.ceil(Math.abs(a.x - b.x) + pad * 2), bh = Math.ceil(Math.abs(a.y - b.y) + pad * 2);
    const clip = this.clip;
    if (this.mode === 'color' && !clip) return;            // tocó en la línea: no pinta
    const t = clip ? this.sctx : this.pctx;

    let style = this.color;
    if (style === 'rainbow') { this.hue = (this.hue + 3) % 360; style = `hsl(${this.hue}, 95%, 58%)`; }

    t.save();
    if (clip) { t.clearRect(bx, by, bw, bh); }
    t.globalCompositeOperation = (tool === 'eraser' && !clip) ? 'destination-out' : 'source-over';
    t.strokeStyle = tool === 'eraser' ? '#000' : style;
    t.fillStyle = t.strokeStyle;
    t.lineWidth = size; t.lineCap = 'round'; t.lineJoin = 'round';
    t.beginPath(); t.moveTo(a.x, a.y); t.lineTo(b.x + 0.01, b.y); t.stroke();

    if (tool === 'glitter') {
      const n = 3 + Math.floor(Math.hypot(b.x - a.x, b.y - a.y) / 8);
      for (let k = 0; k < n; k++) {
        const u = Math.random(), x = a.x + (b.x - a.x) * u + (Math.random() - 0.5) * size * 1.3;
        const y = a.y + (b.y - a.y) * u + (Math.random() - 0.5) * size * 1.3;
        t.fillStyle = ['#fff', '#FFF59D', '#FFD1EC', '#B3E5FC', '#FFD700'][k % 5];
        star(t, x, y, 3 + Math.random() * 6);
      }
    }
    t.restore();

    if (clip) {
      const { r, mask } = clip;
      const s = this.sctx;
      s.save();
      s.beginPath(); s.rect(bx, by, bw, bh); s.clip();
      s.globalCompositeOperation = 'destination-in';
      s.drawImage(mask, r.x0, r.y0);
      s.restore();
      const p = this.pctx;
      p.save();
      if (tool === 'eraser') p.globalCompositeOperation = 'destination-out';
      p.drawImage(this.seg, bx, by, bw, bh, bx, by, bw, bh);
      p.restore();
    }

    if (tool !== 'eraser') {
      this.travel += Math.hypot(b.x - a.x, b.y - a.y);
      if (this.travel > 90) { this.travel = 0; sfx.sparkle(); }
    }
  }

  // Chispitas DOM al tocar
  burst(p) {
    const r = this.paint.getBoundingClientRect();
    const cx = r.left + p.x * r.width / W, cy = r.top + p.y * r.height / H;
    for (let k = 0; k < 8; k++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.textContent = ['✨', '⭐', '💖', '🌟'][k % 4];
      const ang = (k / 8) * Math.PI * 2, dist = 50 + Math.random() * 40;
      s.style.left = cx + 'px'; s.style.top = cy + 'px';
      s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  }

  // ---------- progreso y exportación ----------
  coverage() {
    if (!this.samples?.length) return 0;
    const d = this.pctx.getImageData(0, 0, W, H).data;
    let n = 0;
    for (const i of this.samples) if (d[i * 4 + 3] > 40) n++;
    return n / this.samples.length;
  }

  snapshot(w = 480, h = 360) {
    const c = mk(w, h), x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, w, h);
    x.drawImage(this.paint, 0, 0, w, h);
    x.drawImage(this.lines, 0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.82);
  }
}

function star(c, x, y, r) {
  c.beginPath();
  for (let k = 0; k < 8; k++) {
    const rad = k % 2 ? r * 0.4 : r, a = k * Math.PI / 4;
    c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  c.closePath(); c.fill();
}
