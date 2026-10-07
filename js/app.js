import { LANGS, FLAGS, LANG_NAME, COLORS, PRAISE, UI, TOOLS } from './i18n.js';
import { THEMES, DRAWINGS } from './drawings.js';
import { Board, drawingSvg } from './board.js';
import { sfx, say, sayQueue, initVoice, preloadVoice } from './sound.js';
import { confetti } from './confetti.js';
import { Tracer } from './trace.js';
import { NUMBER_NAMES, LETTER_NAMES, alphabet, glyphStrokes } from './glyphs.js';

// ---------- estado guardado ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem('colorines.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('colorines.' + k, JSON.stringify(v)); return true; } catch { return false; } },
};
const state = {
  lang: store.get('lang', 'es'),
  stars: store.get('stars', 0),
  done: store.get('done', []),
  traced: store.get('traced', []),
  mathLevel: store.get('mathLevel', 1),
  perfectRounds: store.get('perfectRounds', 0),
};
const t = obj => obj[state.lang] ?? obj.es;
const app = document.getElementById('app');
let board = null;
let idleTimer = null;
let tracer = null;

// ---------- utilidades ----------
const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
function go(screen, ...args) {
  clearTimeout(idleTimer);
  tracer?.destroy(); tracer = null;
  document.querySelectorAll('.modal, .counting').forEach(m => m.remove());
  app.innerHTML = '';
  SCREENS[screen](...args);
}
function onTap(el, fn) {
  el.addEventListener('click', e => { sfx.tap(); fn(e); });
}
function speakColor(c) { say(t(c), state.lang); }

// ---------- pantallas ----------
const SCREENS = {
  home() {
    const title = 'Colorines'.split('').map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join('');
    const s = h(`
      <div class="screen home">
        <header class="bar">
          <div class="stars">⭐ <b>${state.stars}</b></div>
          <button class="flag" aria-label="idioma">${FLAGS[state.lang]}</button>
        </header>
        <h1 class="title">${title}</h1>
        <div class="cards">
          <button class="card c1" data-go="themes"><span class="emo">🖍️</span><span class="lbl">${t(UI.color)}</span></button>
          <button class="card c2" data-go="free"><span class="emo">🎨</span><span class="lbl">${t(UI.free)}</span></button>
          <button class="card c4" data-go="learn"><span class="emo">🔤</span><span class="lbl">${t(UI.learn)}</span></button>
          <button class="card c5" data-go="math"><span class="emo">➕</span><span class="lbl">${t(UI.math)}</span></button>
          <button class="card c3" data-go="album"><span class="emo">🖼️</span><span class="lbl">${t(UI.album)}</span></button>
        </div>
      </div>`);
    app.append(s);
    s.querySelectorAll('.card').forEach(b => onTap(b, () => {
      const k = b.dataset.go;
      say(t({ themes: UI.color, free: UI.free, album: UI.album, learn: UI.learn, math: UI.math }[k]), state.lang);
      go(k === 'free' ? 'paint' : k, null);
    }));
    onTap(s.querySelector('.flag'), () => {
      state.lang = LANGS[(LANGS.indexOf(state.lang) + 1) % LANGS.length];
      store.set('lang', state.lang);
      preloadVoice(state.lang);
      go('home');
      say(LANG_NAME[state.lang], state.lang);
    });
  },

  themes() {
    const s = h(`
      <div class="screen themes">
        <header class="bar"><button class="back">🏠</button></header>
        <div class="grid">
          ${THEMES.map(th => `<button class="tile" data-id="${th.id}" style="--bg:${th.bg}"><span class="emo">${th.emoji}</span><span class="lbl">${t(th)}</span></button>`).join('')}
          <button class="tile surprise" data-id="random" style="--bg:#fff"><span class="emo">🎁</span><span class="lbl">${t(UI.random)}</span></button>
        </div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('home'));
    s.querySelectorAll('.tile').forEach(b => onTap(b, () => {
      const id = b.dataset.id;
      if (id === 'random') {
        const d = DRAWINGS[Math.floor(Math.random() * DRAWINGS.length)];
        say(t(UI.random), state.lang);
        return go('paint', d.id);
      }
      const th = THEMES.find(x => x.id === id);
      say(t(th), state.lang);
      const list = DRAWINGS.filter(d => d.theme === id);
      if (list.length === 1) go('paint', list[0].id); else go('drawings', id);
    }));
  },

  drawings(themeId) {
    const th = THEMES.find(x => x.id === themeId);
    const list = DRAWINGS.filter(d => d.theme === themeId);
    const s = h(`
      <div class="screen drawings" style="--bg:${th.bg}">
        <header class="bar"><button class="back">⬅️</button><span class="heading">${th.emoji}</span></header>
        <div class="grid pics">
          ${list.map(d => `<button class="pic" data-id="${d.id}">${d.img ? `<img src="${d.img}" alt="" loading="lazy">` : drawingSvg(d.svg, '100%', '100%')}${state.done.includes(d.id) ? '<span class="badge">⭐</span>' : ''}</button>`).join('')}
        </div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('themes'));
    s.querySelectorAll('.pic').forEach(b => onTap(b, () => {
      const d = DRAWINGS.find(x => x.id === b.dataset.id);
      say(t(d), state.lang);
      go('paint', d.id);
    }));
  },

  async paint(drawingId) {
    const d = drawingId ? DRAWINGS.find(x => x.id === drawingId) : null;
    const tools = d ? ['fill', 'brush', 'glitter'] : ['brush', 'glitter', 'fill', 'stamp', 'eraser'];
    const icons = { fill: '🪣', brush: '🖌️', glitter: '✨', eraser: '🧽', stamp: '🦄' };
    const s = h(`
      <div class="screen paint">
        <aside class="tools">
          <button class="back">🏠</button>
          ${tools.map(k => `<button class="tool" data-tool="${k}">${icons[k]}</button>`).join('')}
          <button class="undo">↩️</button>
          <button class="finish">⭐</button>
        </aside>
        <main class="stage-wrap"><div class="stage"></div></main>
        <aside class="palette">
          ${COLORS.map((c, i) => `<button class="swatch${c.hex === 'rainbow' ? ' rainbow' : ''}" data-i="${i}" style="--c:${c.hex}"></button>`).join('')}
        </aside>
      </div>`);
    app.append(s);
    const stage = s.querySelector('.stage');
    board = new Board(stage);
    fitStage(stage);

    const setTool = k => {
      board.tool = k;
      s.querySelectorAll('.tool').forEach(b => b.classList.toggle('on', b.dataset.tool === k));
    };
    const setColor = i => {
      board.color = COLORS[i].hex;
      s.querySelectorAll('.swatch').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
    };
    setTool(tools[0]);
    setColor(d ? 7 : 5);

    s.querySelectorAll('.tool').forEach(b => onTap(b, () => { setTool(b.dataset.tool); say(t(TOOLS[b.dataset.tool]), state.lang); }));
    s.querySelectorAll('.swatch').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i;
      setColor(i);
      sfx.pop(i);
      speakColor(COLORS[i]);
      if (board.tool === 'eraser' || board.tool === 'stamp') setTool(d ? 'fill' : 'brush');
    }));
    onTap(s.querySelector('.back'), () => go(d ? 'themes' : 'home'));
    s.querySelector('.undo').addEventListener('click', () => board.undo());

    let celebrated = false;
    const finish = () => {
      if (board.isEmpty()) return;
      celebrated = true;
      celebrate(d);
    };
    onTap(s.querySelector('.finish'), finish);

    const palette = s.querySelector('.palette');
    const resetIdle = () => {
      palette.classList.remove('nudge');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => palette.classList.add('nudge'), 15000);
    };
    board.onAction = () => {
      resetIdle();
      if (d && !celebrated && board.coverage() > 0.88) { celebrated = true; setTimeout(() => celebrate(d), 400); }
    };
    resetIdle();
    await board.load(d);
  },

  learn() {
    const s = h(`
      <div class="screen learn">
        <header class="bar"><button class="back">🏠</button></header>
        <div class="cards">
          <button class="card k1" data-kind="num"><span class="big">123</span><span class="lbl">${t(UI.nums)}</span></button>
          <button class="card k2" data-kind="upper"><span class="big">ABC</span><span class="lbl">${t(UI.upper)}</span></button>
          <button class="card k3" data-kind="lower"><span class="big">abc</span><span class="lbl">${t(UI.lower)}</span></button>
        </div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('home'));
    s.querySelectorAll('.card').forEach(b => onTap(b, () => {
      const k = b.dataset.kind;
      say(t({ num: UI.nums, upper: UI.upper, lower: UI.lower }[k]), state.lang);
      go('chars', k);
    }));
  },

  chars(kind) {
    const list = kind === 'num' ? [...Array(11).keys()].map(String) : alphabet(state.lang, kind === 'lower');
    const s = h(`
      <div class="screen chars">
        <header class="bar"><button class="back">⬅️</button></header>
        <div class="grid letters ${kind}">
          ${list.map((c, i) => `<button class="tile ch" data-c="${c}" style="--bg:hsl(${(i * 37) % 360} 90% 88%)"><span>${c}</span>${state.traced.includes(kind + ':' + c) ? '<i class="badge">⭐</i>' : ''}</button>`).join('')}
        </div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('learn'));
    s.querySelectorAll('.ch').forEach(b => onTap(b, () => go('trace', kind, b.dataset.c)));
  },

  trace(kind, ch) {
    const list = kind === 'num' ? [...Array(11).keys()].map(String) : alphabet(state.lang, kind === 'lower');
    const s = h(`
      <div class="screen trace">
        <aside class="tools">
          <button class="back">⬅️</button>
          <button class="again">🔁</button>
          <button class="next">➡️</button>
        </aside>
        <main class="trace-wrap"><canvas class="trace-cv"></canvas></main>
      </div>`);
    app.append(s);
    const speakIt = () => say(nameOf(kind, ch), state.lang);
    speakIt();
    const next = () => go('trace', kind, list[(list.indexOf(ch) + 1) % list.length]);
    onTap(s.querySelector('.back'), () => go('chars', kind));
    onTap(s.querySelector('.again'), () => go('trace', kind, ch));
    onTap(s.querySelector('.next'), next);
    tracer = new Tracer(s.querySelector('.trace-cv'), glyphStrokes(kind, ch), {
      onDone: () => {
        const id = kind + ':' + ch;
        if (!state.traced.includes(id)) { state.traced.push(id); store.set('traced', state.traced); }
        state.stars++; store.set('stars', state.stars);
        s.querySelector('.next').classList.add('pulse');
        if (kind === 'num') countUp(+ch).then(() => cheer());
        else { speakIt(); setTimeout(cheer, 900); }
      },
    });
  },

  math() {
    const s = h(`
      <div class="screen learn mathmenu">
        <header class="bar"><button class="back">🏠</button></header>
        <div class="cards">
          <button class="card k1" data-mode="add"><span class="big">＋</span><span class="lbl">${t(UI.add)}</span></button>
          <button class="card k2" data-mode="sub"><span class="big">－</span><span class="lbl">${t(UI.sub)}</span></button>
          <button class="card k3" data-mode="mix"><span class="big">🎲</span><span class="lbl">${t(UI.random)}</span></button>
        </div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('home'));
    s.querySelectorAll('.card').forEach(b => onTap(b, () => {
      const m = b.dataset.mode;
      say(t({ add: UI.add, sub: UI.sub, mix: UI.random }[m]), state.lang);
      go('sums', m);
    }));
  },

  sums(mode) {
    const ROUND = 5;
    const s = h(`
      <div class="screen sums">
        <header class="bar"><button class="back">⬅️</button><div class="progress"></div><span class="lvl"></span></header>
        <div class="eq"></div>
        <div class="opts"></div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('math'));
    const progress = s.querySelector('.progress'), eq = s.querySelector('.eq'), opts = s.querySelector('.opts');
    let solved = 0, mistakes = 0, last = '';
    const drawProgress = () => {
      progress.innerHTML = Array.from({ length: ROUND }, (_, i) => `<span class="pstar ${i < solved ? 'on' : ''}">⭐</span>`).join('');
    };
    drawProgress();

    const next = () => {
      let p;
      do { p = makeProblem(mode, state.mathLevel); } while (p.key === last);
      last = p.key;
      show(p);
    };

    const show = (p) => {
      const N = n => NUMBER_NAMES[state.lang][n];
      const opWord = t(p.op === '+' ? UI.plus : UI.minus);
      const cols = n => n <= 3 ? Math.max(1, n) : n <= 6 ? 3 : n <= 8 ? 4 : 5;
      const items = n => Array.from({ length: n }, (_, i) => `<button class="it" data-i="${i}">${p.emoji}</button>`).join('');
      const g2 = p.op === '+'
        ? `<div class="grp" style="--cols:${cols(p.b)}">${items(p.b)}</div><b class="lbl-n">${p.b}</b>`
        : `<div class="grp num-only"><span class="bignum">${p.b}</span></div>`;
      eq.innerHTML = `
        <div class="col"><div class="grp g1" style="--cols:${cols(p.a)}">${items(p.a)}</div><b class="lbl-n">${p.a}</b></div>
        <div class="op">${p.op === '+' ? '+' : '−'}</div>
        <div class="col">${g2}</div>
        <div class="op">=</div>
        <div class="ans">?</div>`;
      opts.innerHTML = p.opts.map(n => `<button class="opt" data-n="${n}">${n}</button>`).join('');

      // En las restas, los últimos "b" dibujos se van.
      const all = [...eq.querySelectorAll('.it')];
      if (p.op === '-') setTimeout(() => {
        all.slice(p.a - p.b).forEach((el, k) => setTimeout(() => { el.classList.add('gone'); sfx.tap(); }, k * 250));
      }, 900);

      // Contar tocando.
      let count = 0;
      const bounce = el => { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); };
      all.forEach(el => el.addEventListener('click', () => {
        bounce(el);
        if (el.classList.contains('gone') || el.classList.contains('counted')) { sfx.tap(); return; }
        el.classList.add('counted');
        count++;
        sfx.pop(count);
        say(N(Math.min(count, 10)), state.lang);
      }));

      sayQueue([N(p.a), opWord, N(p.b)], state.lang);

      let busy = false;
      opts.querySelectorAll('.opt').forEach(b => b.addEventListener('click', async () => {
        if (busy || b.disabled) return;
        const n = +b.dataset.n;
        if (n !== p.c) {
          mistakes++;
          b.classList.add('wrong'); b.disabled = true;
          sfx.undo();
          say(t(UI.howmany), state.lang);
          all.filter(el => !el.classList.contains('gone')).forEach((el, k) => setTimeout(() => bounce(el), k * 120));
          return;
        }
        busy = true;
        b.classList.add('right');
        const ans = eq.querySelector('.ans');
        ans.textContent = p.c; ans.classList.add('done');
        sfx.fanfare(); confetti(50);
        solved++; drawProgress();
        await sayQueue([N(p.a), opWord, N(p.b), t(UI.makes), N(p.c)], state.lang);
        await wait(350);
        if (!document.body.contains(s)) return;
        if (solved < ROUND) next(); else roundDone();
      }));
    };

    const roundDone = () => {
      state.stars++; store.set('stars', state.stars);
      if (mistakes === 0) {
        state.perfectRounds++;
        if (state.perfectRounds >= 2 && state.mathLevel < 2) { state.mathLevel = 2; state.perfectRounds = 0; }
      }
      store.set('mathLevel', state.mathLevel); store.set('perfectRounds', state.perfectRounds);
      cheer();
      confetti(160);
      const m = h(`
        <div class="modal">
          <div class="win">
            <div class="bigstar">⭐</div>
            <div class="row5">${'⭐'.repeat(ROUND)}</div>
            <div class="row">
              <button class="again">🔁<span>${t(UI.again)}</span></button>
              <button class="home">🏠<span>${t(UI.home)}</span></button>
            </div>
          </div>
        </div>`);
      setTimeout(() => { if (document.body.contains(s)) document.body.append(m); }, 700);
      onTap(m.querySelector('.again'), () => { m.remove(); go('sums', mode); });
      onTap(m.querySelector('.home'), () => { m.remove(); go('home'); });
    };

    s.querySelector('.lvl').textContent = state.mathLevel === 1 ? '🐣' : '🦄';
    next();
  },

  album() {
    const items = store.get('album', []);
    const s = h(`
      <div class="screen album">
        <header class="bar"><button class="back">🏠</button><span class="heading">🖼️ ⭐ ${state.stars}</span></header>
        <div class="grid pics">
          ${items.length ? items.map((src, i) => `<button class="pic" data-i="${i}"><img src="${src}" alt=""></button>`).join('')
            : `<p class="empty">🖍️ ${t(UI.empty)}</p>`}
        </div>
      </div>`);
    app.append(s);
    onTap(s.querySelector('.back'), () => go('home'));
    s.querySelectorAll('.pic').forEach(b => onTap(b, () => {
      const v = h(`<div class="viewer"><img src="${items[+b.dataset.i]}" alt=""></div>`);
      v.addEventListener('click', () => v.remove());
      document.body.append(v);
    }));
  },
};

// ---------- números y letras ----------
function nameOf(kind, ch) {
  if (kind === 'num') return NUMBER_NAMES[state.lang][+ch];
  return LETTER_NAMES[state.lang][ch.toUpperCase()] ?? ch;
}

const COUNT_EMOJI = ['🦄', '🐠', '🦖', '🚜', '🐱', '🌸', '🦈', '🚓', '🐙', '⭐', '🍓'];
const wait = ms => new Promise(r => setTimeout(r, ms));
async function countUp(n) {
  const row = h(`<div class="counting"></div>`);
  document.body.append(row);
  const e = COUNT_EMOJI[Math.floor(Math.random() * COUNT_EMOJI.length)];
  if (n === 0) { row.innerHTML = '<span class="cnt">🙈</span>'; say(NUMBER_NAMES[state.lang][0], state.lang); await wait(1200); }
  for (let i = 1; i <= n; i++) {
    const it = h(`<span class="cnt">${e}<b>${i}</b></span>`);
    row.append(it);
    sfx.pop(i);
    say(NUMBER_NAMES[state.lang][i], state.lang);
    await wait(950);
  }
  await wait(500);
  row.classList.add('bye');
  setTimeout(() => row.remove(), 600);
}

function cheer() {
  sfx.fanfare();
  confetti(120);
  say(PRAISE[state.lang][Math.floor(Math.random() * PRAISE[state.lang].length)], state.lang);
}

// ---------- sumas y restas ----------
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = rnd(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
function makeProblem(mode, level) {
  const max = level === 1 ? 5 : 10;
  const op = mode === 'mix' ? (Math.random() < 0.5 ? '+' : '-') : mode === 'add' ? '+' : '-';
  let a, b;
  if (op === '+') { const sum = rnd(2, max); a = rnd(1, sum - 1); b = sum - a; }
  else { a = rnd(2, max); b = rnd(1, level === 1 ? a - 1 : a); }
  const c = op === '+' ? a + b : a - b;
  const opts = new Set([c]);
  while (opts.size < 3) { const d = c + [-2, -1, 1, 2][rnd(0, 3)]; if (d >= 0 && d <= 10) opts.add(d); }
  return { a, b, op, c, opts: shuffle([...opts]), emoji: COUNT_EMOJI[rnd(0, COUNT_EMOJI.length - 1)], key: `${a}${op}${b}` };
}

// ---------- celebración ----------
function celebrate(d) {
  sfx.fanfare();
  confetti();
  say(PRAISE[state.lang][Math.floor(Math.random() * PRAISE[state.lang].length)], state.lang);
  const album = store.get('album', []);
  album.unshift(board.snapshot());
  while (album.length > 40 || (!store.set('album', album) && album.length > 1)) album.pop();
  state.stars++;
  store.set('stars', state.stars);
  if (d && !state.done.includes(d.id)) { state.done.push(d.id); store.set('done', state.done); }

  const m = h(`
    <div class="modal">
      <div class="win">
        <div class="bigstar">⭐</div>
        <img src="${album[0]}" alt="">
        <div class="row">
          <button class="again">${d ? '🖍️' : '🎨'}<span>${t(UI.again)}</span></button>
          <button class="home">🏠<span>${t(UI.home)}</span></button>
        </div>
      </div>
    </div>`);
  setTimeout(() => document.body.append(m), 900);
  onTap(m.querySelector('.again'), () => {
    m.remove();
    if (!d) return go('paint', null);
    const same = DRAWINGS.filter(x => x.theme === d.theme && x.id !== d.id);
    const pool = same.length ? same : DRAWINGS.filter(x => x.id !== d.id);
    const n = pool[Math.floor(Math.random() * pool.length)];
    say(t(n), state.lang);
    go('paint', n.id);
  });
  onTap(m.querySelector('.home'), () => { m.remove(); go('home'); });
}

// ---------- tamaño del lienzo (4:3 que quepa) ----------
function fitStage(stage) {
  const wrap = stage.parentElement;
  const fit = () => {
    const r = wrap.getBoundingClientRect();
    const w = Math.min(r.width, r.height * 4 / 3);
    stage.style.width = w + 'px';
    stage.style.height = w * 3 / 4 + 'px';
  };
  fit();
  new ResizeObserver(fit).observe(wrap);
}

// ---------- arranque ----------
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('pointerdown', () => {
  sfx.unlock();
  preloadVoice(state.lang);
  const standalone = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
  if (!standalone && !document.fullscreenElement && document.documentElement.requestFullscreen && matchMedia('(pointer: coarse)').matches) {
    document.documentElement.requestFullscreen().then(() => screen.orientation?.lock?.('landscape')).catch(() => {});
  }
}, { once: true });

initVoice();
go('home');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
