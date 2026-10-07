// Repaso de números y letras con el dedo: el niño sigue cada trazo desde el punto verde.
// El progreso avanza sólo si el dedo va cerca del camino; salirse no penaliza, simplemente no avanza.

import { sfx } from './sound.js';

const STEP = 2;          // separación entre puntos muestreados (unidades del glifo)
const TOL = 17;          // distancia máxima del dedo al camino
const LOOKAHEAD = 34;    // cuánto puede adelantarse el dedo de golpe
const WIDTH = 24;        // grosor del camino
const NS = 'http://www.w3.org/2000/svg';

let sampler = null;
function samplePath(d) {
  if (!sampler) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    sampler = document.createElementNS(NS, 'path');
    svg.appendChild(sampler);
    document.body.appendChild(svg);
  }
  sampler.setAttribute('d', d);
  const len = sampler.getTotalLength();
  const n = Math.max(1, Math.round(len / STEP));
  const pts = [];
  for (let i = 0; i <= n; i++) { const p = sampler.getPointAtLength(len * i / n); pts.push({ x: p.x, y: p.y }); }
  return { d, len, pts, path: new Path2D(d), tap: len < 5 };
}

export class Tracer {
  constructor(canvas, strokes, { onStroke = () => {}, onDone = () => {} } = {}) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.strokes = strokes.map(samplePath);
    this.onStroke = onStroke; this.onDone = onDone;
    this.cur = 0; this.p = 0; this.done = false; this.active = null;
    this.hue = 0; this.t0 = performance.now();

    // Caja del glifo (con margen) para centrarlo en el lienzo.
    let x0 = Infinity, x1 = -Infinity, y0 = 0, y1 = 140;
    for (const s of this.strokes) for (const p of s.pts) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
    this.box = { x0: Math.min(x0, 0) - 18, x1: Math.max(x1, 100) + 18, y0: Math.min(y0, 0) - 18, y1: Math.max(y1, 160) + 14 };

    canvas.addEventListener('pointerdown', this.down = e => this.onDown(e));
    canvas.addEventListener('pointermove', this.move = e => this.onMove(e));
    canvas.addEventListener('pointerup', this.up = e => { if (e.pointerId === this.active) this.active = null; });
    canvas.addEventListener('pointercancel', this.up);
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() { cancelAnimationFrame(this.raf); this.ro.disconnect(); this.stopped = true; }

  resize() {
    const r = this.cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    this.cv.width = Math.round(r.width * dpr); this.cv.height = Math.round(r.height * dpr);
    const b = this.box, bw = b.x1 - b.x0, bh = b.y1 - b.y0;
    this.s = Math.min(this.cv.width / bw, this.cv.height / bh);
    this.ox = (this.cv.width - bw * this.s) / 2 - b.x0 * this.s;
    this.oy = (this.cv.height - bh * this.s) / 2 - b.y0 * this.s;
    this.dpr = dpr;
  }

  toGlyph(e) {
    const r = this.cv.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * this.dpr - this.ox) / this.s, y: ((e.clientY - r.top) * this.dpr - this.oy) / this.s };
  }

  // Busca el punto del trazo actual más cercano al dedo dentro de la ventana permitida.
  advance(q) {
    const st = this.strokes[this.cur];
    const end = Math.min(st.pts.length - 1, this.p + Math.round(LOOKAHEAD / STEP));
    let best = -1, bd = TOL;
    for (let i = this.p; i <= end; i++) {
      const d = Math.hypot(st.pts[i].x - q.x, st.pts[i].y - q.y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best > this.p) {
      if (Math.floor(best / 12) > Math.floor(this.p / 12)) sfx.sparkle();
      this.p = best;
    }
    if (this.p >= st.pts.length - 3) this.finishStroke();
    return best >= 0;
  }

  onDown(e) {
    e.preventDefault();
    if (this.done || this.active !== null) return;
    const q = this.toGlyph(e), st = this.strokes[this.cur];
    if (st.tap) {
      if (Math.hypot(st.pts[0].x - q.x, st.pts[0].y - q.y) < TOL * 1.5) this.finishStroke();
      return;
    }
    if (this.advance(q)) { this.active = e.pointerId; try { this.cv.setPointerCapture(e.pointerId); } catch {} }
  }

  onMove(e) {
    if (e.pointerId !== this.active || this.done) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs.length ? evs : [e]) { if (this.done || e.pointerId !== this.active) break; this.advance(this.toGlyph(ev)); }
  }

  finishStroke() {
    this.p = this.strokes[this.cur].pts.length - 1;
    sfx.pop(this.cur + 2);
    this.onStroke(this.cur);
    this.active = null;
    if (this.cur < this.strokes.length - 1) { this.cur++; this.p = 0; }
    else { this.done = true; this.onDone(); }
  }

  // ---------- dibujo ----------
  loop(t) {
    if (this.stopped) return;
    this.draw(t);
    this.raf = requestAnimationFrame(this.loop);
  }

  draw(t) {
    const c = this.ctx, s = this.s;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.cv.width, this.cv.height);
    c.setTransform(s, 0, 0, s, this.ox, this.oy);
    c.lineCap = 'round'; c.lineJoin = 'round';

    // Pauta: línea superior, media y base.
    const b = this.box;
    c.lineWidth = 1.2;
    for (const [y, dash] of [[12, []], [55, [4, 5]], [128, []]]) {
      c.strokeStyle = y === 128 ? '#C9BEE6' : '#E3DCF3';
      c.setLineDash(dash);
      c.beginPath(); c.moveTo(b.x0 + 4, y); c.lineTo(b.x1 - 4, y); c.stroke();
    }
    c.setLineDash([]);

    // Camino fantasma de todos los trazos.
    c.strokeStyle = '#ECE6F7'; c.lineWidth = WIDTH;
    for (const st of this.strokes) { if (st.tap) { this.dot(st.pts[0], WIDTH / 2, '#ECE6F7'); } else c.stroke(st.path); }

    // Trazo actual un poco más marcado, con línea guía de puntos.
    if (!this.done) {
      const st = this.strokes[this.cur];
      if (st.tap) this.dot(st.pts[0], WIDTH / 2, '#DCD2F2');
      else {
        c.strokeStyle = '#DCD2F2'; c.lineWidth = WIDTH; c.stroke(st.path);
        c.strokeStyle = '#A894DA'; c.lineWidth = 2.2; c.setLineDash([5, 6]); c.stroke(st.path); c.setLineDash([]);
      }
    }

    // Trazos terminados y progreso del actual, en arcoíris.
    let k = 0;
    for (let i = 0; i < this.strokes.length; i++) {
      const st = this.strokes[i];
      const upto = i < this.cur || this.done ? st.pts.length - 1 : i === this.cur ? this.p : -1;
      if (upto < 0) continue;
      if (st.tap) { this.dot(st.pts[0], WIDTH / 2 + 1, `hsl(${(k * 4) % 360},90%,58%)`); k += 3; continue; }
      c.lineWidth = WIDTH - 2;
      for (let j = 1; j <= upto; j++, k++) {
        c.strokeStyle = `hsl(${(k * 4) % 360},90%,58%)`;
        c.beginPath(); c.moveTo(st.pts[j - 1].x, st.pts[j - 1].y); c.lineTo(st.pts[j].x, st.pts[j].y); c.stroke();
      }
    }

    if (this.done) return;
    const st = this.strokes[this.cur];
    // Punto de inicio con número del trazo + flecha de dirección.
    if (this.p === 0) {
      const p0 = st.pts[0], pulse = 1 + 0.12 * Math.sin(t / 180);
      this.dot(p0, 11 * pulse, '#2FBF4E');
      c.fillStyle = '#fff'; c.font = 'bold 13px "Baloo 2", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(String(this.cur + 1), p0.x, p0.y + 1);
      if (!st.tap) this.arrow(st);
    }
    // Estrella guía en la punta del progreso.
    const g = st.pts[Math.min(st.pts.length - 1, this.p + (this.p ? 3 : 0))];
    const bob = Math.sin(t / 160) * 2.5;
    c.font = '20px "Noto Color Emoji", "Segoe UI Emoji", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    if (this.p > 0) c.fillText('⭐', g.x, g.y + bob);
  }

  dot(p, r, color) {
    const c = this.ctx;
    c.fillStyle = color; c.beginPath(); c.arc(p.x, p.y, r, 0, Math.PI * 2); c.fill();
  }

  arrow(st) {
    const c = this.ctx, i = Math.min(st.pts.length - 1, Math.round(22 / STEP));
    const a = st.pts[Math.max(0, i - 4)], b = st.pts[i];
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    c.save(); c.translate(b.x, b.y); c.rotate(ang);
    c.fillStyle = '#2FBF4E';
    c.beginPath(); c.moveTo(7, 0); c.lineTo(-5, -6); c.lineTo(-5, 6); c.closePath(); c.fill();
    c.restore();
  }
}
