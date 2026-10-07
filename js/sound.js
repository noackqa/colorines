// Efectos de sonido sintetizados (sin archivos) + voz.
// Voz: si existe audio/<lang>/<key>.mp3 (listado en audio/index.json) se usa;
// si no, se usa la voz del sistema (Web Speech).

import { VOICE_LANG } from './i18n.js';

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Escala pentatónica: cualquier combinación suena bien.
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

function tone(freq, { dur = 0.15, type = 'sine', vol = 0.18, when = 0, slide = 0 } = {}) {
  if (muted) return;
  const c = ac();
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  setMuted(m) { muted = m; },
  unlock() { try { ac(); } catch {} },
  tap() { tone(660, { dur: 0.08, type: 'triangle', vol: 0.12, slide: 1.4 }); },
  pop(i = Math.floor(Math.random() * PENTA.length)) {
    const f = PENTA[i % PENTA.length];
    tone(f / 2, { dur: 0.18, type: 'sine', vol: 0.25, slide: 2 });
    tone(f, { dur: 0.25, type: 'triangle', vol: 0.08, when: 0.05 });
  },
  sparkle() {
    const f = PENTA[Math.floor(Math.random() * PENTA.length)] * 2;
    tone(f, { dur: 0.12, type: 'sine', vol: 0.05 });
  },
  stamp() { tone(300, { dur: 0.12, type: 'square', vol: 0.06, slide: 2.5 }); tone(900, { dur: 0.15, vol: 0.1, when: 0.06 }); },
  undo() { tone(700, { dur: 0.18, type: 'triangle', vol: 0.12, slide: 0.5 }); },
  fanfare() {
    [0, 2, 4, 5, 7].forEach((n, k) => tone(PENTA[n % 8] * (n > 4 ? 2 : 1), { dur: 0.3, type: 'triangle', vol: 0.16, when: k * 0.11 }));
    tone(PENTA[5] * 2, { dur: 0.7, type: 'sine', vol: 0.12, when: 0.6 });
  },
};

// ---------- Voz ----------
// audio/index.json: { lang: { clave: [archivo, inicio, fin] } } — varios trozos por archivo.
let audioIndex = {};
let current = null;
let voices = [];
const buffers = {};   // archivo -> Promise<AudioBuffer>

export async function initVoice() {
  try { audioIndex = await (await fetch('audio/index.json')).json(); } catch { audioIndex = {}; }
  if ('speechSynthesis' in window) {
    const load = () => { voices = speechSynthesis.getVoices(); };
    load();
    speechSynthesis.onvoiceschanged = load;
  }
}

function buffer(file) {
  buffers[file] ??= fetch('audio/' + file).then(r => r.arrayBuffer()).then(b => ac().decodeAudioData(b))
    .catch(e => { delete buffers[file]; throw e; });
  return buffers[file];
}

// Descarga por adelantado los audios de un idioma (tras el primer toque).
export function preloadVoice(lang) {
  const files = new Set(Object.values(audioIndex[lang] || {}).map(v => v[0]));
  files.forEach(f => buffer(f).catch(() => {}));
}

async function playClip([file, start, end]) {
  const buf = await buffer(file);
  // Margen para no cortar consonantes suaves (f, s, z) al principio o al final.
  start = Math.max(0, start - 0.08);
  end = Math.min(buf.duration, end + 0.12);
  const c = ac();
  const d = buf.getChannelData(0), a = Math.floor(start * buf.sampleRate), b = Math.min(d.length, Math.floor(end * buf.sampleRate));
  let peak = 0.01;
  for (let i = a; i < b; i += 4) peak = Math.max(peak, Math.abs(d[i]));
  const src = c.createBufferSource(), g = c.createGain();
  src.buffer = buf;
  g.gain.value = Math.min(6, 0.9 / peak);
  src.connect(g).connect(c.destination);
  src.start(0, start, end - start);
  current = src;
}

// Clave de archivo a partir del texto: "¡Muy bien!" -> "muy-bien"
export function keyOf(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function pickVoice(lang) {
  const code = VOICE_LANG[lang];
  const same = voices.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(code.slice(0, 2)));
  return same.find(v => v.lang.replace('_', '-') === code && /female|mujer|frau|google/i.test(v.name))
      || same.find(v => v.lang.replace('_', '-') === code)
      || same[0] || null;
}

export function say(text, lang) {
  if (muted || !text) return;
  const key = keyOf(text);
  try { current?.stop(); } catch {}
  current = null;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  const clip = audioIndex[lang]?.[key];
  if (clip) { playClip(clip).catch(() => speak(text, lang)); return; }
  speak(text, lang);
}

function speak(text, lang) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[lang];
  const v = pickVoice(lang);
  if (v) u.voice = v;
  u.rate = 0.9;
  u.pitch = 1.15;
  speechSynthesis.speak(u);
}
