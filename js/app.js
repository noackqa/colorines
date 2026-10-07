import { LANGS, FLAGS, LANG_NAME, COLORS, PRAISE, UI, TOOLS } from './i18n.js';
import { THEMES, DRAWINGS } from './drawings.js';
import { Board, drawingSvg } from './board.js';
import { sfx, say, initVoice, preloadVoice } from './sound.js';
import { confetti } from './confetti.js';

// ---------- estado guardado ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem('colorines.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('colorines.' + k, JSON.stringify(v)); return true; } catch { return false; } },
};
const state = {
  lang: store.get('lang', 'es'),
  stars: store.get('stars', 0),
  done: store.get('done', []),
};
const t = obj => obj[state.lang] ?? obj.es;
const app = document.getElementById('app');
let board = null;
let idleTimer = null;

// ---------- utilidades ----------
const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
function go(screen, ...args) {
  clearTimeout(idleTimer);
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
          <button class="card c3" data-go="album"><span class="emo">🖼️</span><span class="lbl">${t(UI.album)}</span></button>
        </div>
      </div>`);
    app.append(s);
    s.querySelectorAll('.card').forEach(b => onTap(b, () => {
      const k = b.dataset.go;
      say(t({ themes: UI.color, free: UI.free, album: UI.album }[k]), state.lang);
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
          ${list.map(d => `<button class="pic" data-id="${d.id}">${drawingSvg(d.svg, '100%', '100%')}${state.done.includes(d.id) ? '<span class="badge">⭐</span>' : ''}</button>`).join('')}
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
    await board.load(d?.svg ?? null);
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
