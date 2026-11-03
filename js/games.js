// Juegos tranquilos para la percepción: sin tiempo, sin vidas, sin "has perdido".
// Cada juego: new X(root, opts) y destroy(). Avisan con callbacks y la app pone voz y estrellas.

import { sfx } from './sound.js';

const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wait = ms => new Promise(r => setTimeout(r, ms));

// ---------- Parejas ----------
const ANIMALS = ['🐶', '🐱', '🐰', '🦊', '🐸', '🐵', '🦁', '🐷', '🐼', '🐨', '🐮', '🐥'];

export class Memory {
  constructor(root, { pairs = 4, onPair = () => {}, onWin = () => {} }) {
    this.root = root; this.onPair = onPair; this.onWin = onWin;
    const faces = shuffle(ANIMALS.slice()).slice(0, pairs);
    this.cards = shuffle([...faces, ...faces]);
    const cols = 4, rows = this.cards.length / cols;
    root.innerHTML = `<div class="mem" style="--cols:${cols};--rows:${rows}">${this.cards.map((f, i) =>
      `<button class="mcard" data-i="${i}"><span class="mback"></span><span class="mfront">${f}</span></button>`).join('')}</div>`;
    this.open = []; this.found = 0; this.busy = false;
    root.querySelectorAll('.mcard').forEach(b => b.addEventListener('click', () => this.flip(b)));
  }

  async flip(b) {
    if (this.busy || b.classList.contains('up')) return;
    b.classList.add('up'); sfx.tap();
    this.open.push(b);
    if (this.open.length < 2) return;
    const [a, c] = this.open; this.open = [];
    if (this.cards[a.dataset.i] === this.cards[c.dataset.i]) {
      this.found++;
      await wait(250);
      a.classList.add('done'); c.classList.add('done'); sfx.pop(this.found);
      this.onPair(this.cards[a.dataset.i]);
      if (this.found * 2 === this.cards.length) { await wait(500); this.onWin(); }
    } else {
      this.busy = true;
      await wait(1000);
      a.classList.remove('up'); c.classList.remove('up');
      this.busy = false;
    }
  }

  destroy() {}
}

// ---------- Tres en fila ----------
// Se cambian dos frutas vecinas (tocando una y luego otra, o arrastrando). Si no hacen fila,
// vuelven a su sitio sin castigo. Cada fruta recogida llena el tarro; tarro lleno = fiesta.
const FRUITS = ['🍓', '🍋', '🍇', '🍏', '🍊'];

export class Match3 {
  constructor(root, { cols = 7, rows = 6, goal = 40, onProgress = () => {}, onFull = () => {} }) {
    this.root = root; this.C = cols; this.R = rows; this.goal = goal;
    this.onProgress = onProgress; this.onFull = onFull;
    this.got = 0; this.busy = false; this.sel = null; this.nextId = 0;
    root.innerHTML = `<div class="m3" style="--cols:${cols};--rows:${rows}"></div>`;
    this.board = root.querySelector('.m3');
    this.grid = [];
    for (let r = 0; r < rows; r++) {
      this.grid.push([]);
      for (let c = 0; c < cols; c++) {
        let t; do { t = rnd(FRUITS.length); } while ((c >= 2 && this.grid[r][c - 1].t === t && this.grid[r][c - 2].t === t) || (r >= 2 && this.grid[r - 1][c].t === t && this.grid[r - 2][c].t === t));
        this.grid[r].push(this.tile(t, r, c));
      }
    }
    if (!this.hasMove()) this.reshuffle();
    this.board.addEventListener('pointerdown', e => this.down(e));
  }

  tile(t, r, c, fromRow = r) {
    const el = document.createElement('div');
    el.className = 'm3t'; el.textContent = FRUITS[t];
    const o = { t, el };
    this.place(o, fromRow, c, false);
    this.board.append(el);
    return o;
  }

  place(o, r, c, anim = true) {
    o.el.style.transition = anim ? '' : 'none';
    o.el.style.transform = `translate(${c * 100}%, ${r * 100}%)`;
    o.r = r; o.c = c;
  }

  down(e) {
    if (this.busy) return;
    const rect = this.board.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / rect.width * this.C), r = Math.floor((e.clientY - rect.top) / rect.height * this.R);
    if (r < 0 || c < 0 || r >= this.R || c >= this.C) return;
    const x0 = e.clientX, y0 = e.clientY, cell = rect.width / this.C;
    const move = ev => {
      const dx = ev.clientX - x0, dy = ev.clientY - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < cell * 0.4) return;
      cleanup();
      const [r2, c2] = Math.abs(dx) > Math.abs(dy) ? [r, c + Math.sign(dx)] : [r + Math.sign(dy), c];
      this.select(null);
      this.trySwap(r, c, r2, c2);
    };
    const up = () => {
      cleanup();
      if (!this.sel) return this.select([r, c]);
      const [sr, sc] = this.sel;
      if (sr === r && sc === c) return this.select(null);
      if (Math.abs(sr - r) + Math.abs(sc - c) === 1) { this.select(null); this.trySwap(sr, sc, r, c); } else this.select([r, c]);
    };
    const cleanup = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
  }

  select(rc) {
    if (this.sel) this.grid[this.sel[0]][this.sel[1]].el.classList.remove('sel');
    this.sel = rc;
    if (rc) { this.grid[rc[0]][rc[1]].el.classList.add('sel'); sfx.tap(); }
  }

  swap(r1, c1, r2, c2) {
    const a = this.grid[r1][c1], b = this.grid[r2][c2];
    this.grid[r1][c1] = b; this.grid[r2][c2] = a;
    this.place(b, r1, c1); this.place(a, r2, c2);
  }

  async trySwap(r1, c1, r2, c2) {
    if (r2 < 0 || c2 < 0 || r2 >= this.R || c2 >= this.C || this.busy) return;
    this.busy = true;
    this.swap(r1, c1, r2, c2);
    await wait(230);
    if (!this.matches().size) {
      sfx.undo();
      this.swap(r1, c1, r2, c2);
      await wait(230);
    } else {
      await this.resolve();
      if (!this.hasMove()) { await wait(300); this.reshuffle(); }
    }
    this.busy = false;
  }

  // Celdas que forman fila o columna de 3 o más iguales.
  matches(g = this.grid) {
    const out = new Set();
    for (let r = 0; r < this.R; r++) for (let c = 0; c < this.C; c++) {
      const t = g[r][c].t;
      if (c + 2 < this.C && g[r][c + 1].t === t && g[r][c + 2].t === t) { let k = c; while (k < this.C && g[r][k].t === t) out.add(r * this.C + k++); }
      if (r + 2 < this.R && g[r + 1][c].t === t && g[r + 2][c].t === t) { let k = r; while (k < this.R && g[k][c].t === t) out.add(k++ * this.C + c); }
    }
    return out;
  }

  async resolve() {
    let combo = 0;
    for (let m = this.matches(); m.size; m = this.matches()) {
      combo++;
      sfx.pop(combo + 2);
      m.forEach(k => this.grid[Math.floor(k / this.C)][k % this.C].el.classList.add('pop'));
      await wait(260);
      // quita, deja caer y rellena desde arriba
      for (let c = 0; c < this.C; c++) {
        const keep = [];
        for (let r = this.R - 1; r >= 0; r--) {
          const o = this.grid[r][c];
          if (m.has(r * this.C + c)) o.el.remove(); else keep.push(o);
        }
        let missing = this.R - keep.length;
        for (let r = this.R - 1; r >= 0; r--) {
          const o = keep[this.R - 1 - r];
          if (o) { this.grid[r][c] = o; this.place(o, r, c); }
          else { const n = this.tile(rnd(FRUITS.length), r, c, -missing--); this.grid[r][c] = n; void n.el.offsetWidth; this.place(n, r, c); }
        }
      }
      this.got += m.size;
      this.onProgress(Math.min(1, this.got / this.goal));
      await wait(300);
    }
    if (this.got >= this.goal) { this.got = 0; this.onFull(); this.onProgress(0); }
  }

  hasMove() {
    const g = this.grid;
    const test = (r1, c1, r2, c2) => {
      [g[r1][c1], g[r2][c2]] = [g[r2][c2], g[r1][c1]];
      const ok = this.matches().size > 0;
      [g[r1][c1], g[r2][c2]] = [g[r2][c2], g[r1][c1]];
      return ok;
    };
    for (let r = 0; r < this.R; r++) for (let c = 0; c < this.C; c++) {
      if (c + 1 < this.C && test(r, c, r, c + 1)) return true;
      if (r + 1 < this.R && test(r, c, r + 1, c)) return true;
    }
    return false;
  }

  reshuffle() {
    const all = this.grid.flat();
    do { shuffle(all); for (let r = 0; r < this.R; r++) for (let c = 0; c < this.C; c++) this.grid[r][c] = all[r * this.C + c]; }
    while (this.matches().size || !this.hasMove());
    for (let r = 0; r < this.R; r++) for (let c = 0; c < this.C; c++) this.place(this.grid[r][c], r, c);
  }

  destroy() {}
}

// ---------- Bloques ----------
// Piezas pequeñas que bajan despacio. Fila completa = brillo y sonido. Si se llena hasta
// arriba no hay "fin": los bloques se van en cascada y se vuelve a empezar.
const SHAPES = [
  [[0, 0]],
  [[0, 0], [1, 0]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
];
const COLORS = ['#FF6B6B', '#FFB347', '#FFD93D', '#6BCB77', '#4D96FF', '#B983FF'];

export class Blocks {
  constructor(root, { cols = 7, rows = 10, onRow = () => {}, onFull = () => {} }) {
    this.root = root; this.C = cols; this.R = rows; this.onRow = onRow; this.onFull = onFull;
    root.innerHTML = `
      <div class="bk">
        <canvas class="bk-cv"></canvas>
        <div class="bk-pad">
          <button class="bk-b" data-a="left">◀</button>
          <button class="bk-b" data-a="turn">🔄</button>
          <button class="bk-b" data-a="right">▶</button>
          <button class="bk-b" data-a="drop">⏬</button>
        </div>
      </div>`;
    this.cv = root.querySelector('.bk-cv'); this.ctx = this.cv.getContext('2d');
    this.board = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.flash = []; this.sweep = 0;
    root.querySelectorAll('.bk-b').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); this.act(b.dataset.a); }));
    this.swipe();
    this.ro = new ResizeObserver(() => this.size()); this.ro.observe(root.querySelector('.bk'));
    this.spawn();
    this.tick = setInterval(() => { if (this.p && !this.sweep) this.step(); }, 850);
    this.loop = this.loop.bind(this); this.raf = requestAnimationFrame(this.loop);
  }

  size() {
    const box = this.root.querySelector('.bk').getBoundingClientRect(), pad = this.root.querySelector('.bk-pad').getBoundingClientRect();
    const landscape = box.width > box.height;
    const availW = landscape ? box.width - pad.width - 30 : box.width, availH = landscape ? box.height : box.height - pad.height - 20;
    this.cell = Math.floor(Math.min(availW / this.C, availH / this.R));
    const d = Math.min(2, devicePixelRatio || 1);
    this.cv.style.width = this.cell * this.C + 'px'; this.cv.style.height = this.cell * this.R + 'px';
    this.cv.width = this.cell * this.C * d; this.cv.height = this.cell * this.R * d;
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  swipe() {
    let x0, y0, done;
    this.cv.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; done = false; });
    this.cv.addEventListener('pointermove', e => {
      if (x0 == null || done) return;
      const dx = e.clientX - x0, dy = e.clientY - y0, s = this.cell * 0.8;
      if (Math.abs(dx) > s) { this.act(dx > 0 ? 'right' : 'left'); x0 = e.clientX; }
      else if (dy > s * 2) { this.act('drop'); done = true; }
    });
    this.cv.addEventListener('pointerup', e => {
      if (x0 != null && !done && Math.hypot(e.clientX - x0, e.clientY - y0) < 10) this.act('turn');
      x0 = null;
    });
  }

  cells(p = this.p) { return p.s.map(([x, y]) => [p.x + x, p.y + y]); }
  fits(p) { return this.cells(p).every(([x, y]) => x >= 0 && x < this.C && y < this.R && (y < 0 || !this.board[y][x])); }

  spawn() {
    const s = SHAPES[rnd(SHAPES.length)];
    this.p = { s, x: Math.floor((this.C - 2) / 2), y: -1, color: COLORS[rnd(COLORS.length)] };
    if (!this.fits(this.p)) this.full();
  }

  act(a) {
    if (this.sweep || !this.p) return;
    const p = { ...this.p };
    if (a === 'left') p.x--;
    if (a === 'right') p.x++;
    if (a === 'turn') {
      p.s = this.p.s.map(([x, y]) => [-y, x]);
      const mx = Math.min(...p.s.map(c => c[0])), my = Math.min(...p.s.map(c => c[1]));
      p.s = p.s.map(([x, y]) => [x - mx, y - my]);
      if (!this.fits(p)) p.x--; // si choca con la pared, prueba un paso a la izquierda
    }
    if (a === 'drop') { while (this.fits({ ...p, y: p.y + 1 })) p.y++; }
    if (this.fits(p)) { this.p = p; sfx.tap(); if (a === 'drop') this.step(); }
  }

  step() {
    const p = { ...this.p, y: this.p.y + 1 };
    if (this.fits(p)) { this.p = p; return; }
    // se queda quieta
    for (const [x, y] of this.cells()) if (y >= 0) this.board[y][x] = this.p.color;
    sfx.stamp();
    const fullRows = this.board.map((row, y) => row.every(Boolean) ? y : -1).filter(y => y >= 0);
    if (fullRows.length) {
      this.flash = fullRows; this.flashT = performance.now(); this.p = null;
      sfx.fanfare();
      setTimeout(() => {
        if (this.dead) return;
        for (const y of fullRows) { this.board.splice(y, 1); this.board.unshift(Array(this.C).fill(null)); }
        this.flash = []; this.onRow(fullRows.length); this.spawn();
      }, 450);
    } else this.spawn();
  }

  // Tablero lleno: los bloques caen fuera poco a poco y se vuelve a empezar.
  full() {
    this.p = null; this.sweep = performance.now();
    this.onFull();
    setTimeout(() => {
      if (this.dead) return;
      this.board = Array.from({ length: this.R }, () => Array(this.C).fill(null));
      this.sweep = 0; this.spawn();
    }, 1600);
  }

  loop(now) {
    if (this.dead) return;
    this.draw(now);
    this.raf = requestAnimationFrame(this.loop);
  }

  draw(now) {
    const c = this.ctx, s = this.cell, W = s * this.C, H = s * this.R;
    if (!s) return;
    c.clearRect(0, 0, W, H);
    c.fillStyle = '#F3EEFF'; c.beginPath(); c.roundRect(0, 0, W, H, s * 0.4); c.fill();
    c.strokeStyle = 'rgba(58,46,92,.06)'; c.lineWidth = 1;
    for (let x = 1; x < this.C; x++) { c.beginPath(); c.moveTo(x * s, 0); c.lineTo(x * s, H); c.stroke(); }
    const block = (x, y, col, a = 1, dy = 0) => {
      c.globalAlpha = a; c.fillStyle = col;
      c.beginPath(); c.roundRect(x * s + 2, y * s + 2 + dy, s - 4, s - 4, s * 0.22); c.fill();
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.roundRect(x * s + s * 0.18, y * s + s * 0.14 + dy, s * 0.4, s * 0.16, s * 0.08); c.fill();
      c.globalAlpha = 1;
    };
    const fall = this.sweep ? (now - this.sweep) / 1000 : 0;
    this.board.forEach((row, y) => row.forEach((col, x) => {
      if (!col) return;
      if (this.flash.includes(y)) { const k = (now - this.flashT) / 450; block(x, y, '#fff', 1 - k * 0.3); block(x, y, col, 1 - k); return; }
      block(x, y, col, 1, fall ? Math.max(0, fall - (this.R - y) * 0.03 - x * 0.02) ** 2 * H * 1.5 : 0);
    }));
    if (this.p) {
      // sombra de dónde caerá (ayuda a calcular)
      let g = { ...this.p }; while (this.fits({ ...g, y: g.y + 1 })) g.y++;
      for (const [x, y] of this.cells(g)) if (y >= 0) block(x, y, this.p.color, 0.22);
      for (const [x, y] of this.cells()) if (y >= 0) block(x, y, this.p.color);
    }
  }

  destroy() { this.dead = true; clearInterval(this.tick); cancelAnimationFrame(this.raf); this.ro.disconnect(); }
}
