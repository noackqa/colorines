// Lluvia de confeti a pantalla completa.
const COLORS = ['#FF3B3B', '#FF9A1F', '#FFE03A', '#3DD45C', '#5AC8FA', '#A259FF', '#FF6FB5'];
let parts = [], running = false, cv, cx;

export function confetti(n = 160) {
  cv ??= document.getElementById('confetti');
  cx ??= cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  for (let i = 0; i < n; i++) {
    parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.55,
      vx: (Math.random() - 0.5) * 22, vy: -12 - Math.random() * 16,
      r: 6 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      c: COLORS[i % COLORS.length], shape: i % 3, life: 0,
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  for (const p of parts) {
    p.vy += 0.45; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
    if (p.shape === 0) cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
    else if (p.shape === 1) { cx.beginPath(); cx.arc(0, 0, p.r * 0.7, 0, 7); cx.fill(); }
    else { cx.beginPath(); cx.moveTo(0, -p.r); cx.lineTo(p.r, p.r); cx.lineTo(-p.r, p.r); cx.fill(); }
    cx.restore();
  }
  parts = parts.filter(p => p.y < cv.height + 40 && p.life < 400);
  if (parts.length) requestAnimationFrame(tick);
  else { running = false; cx.clearRect(0, 0, cv.width, cv.height); }
}
