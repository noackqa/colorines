// "¡Ahora tú!": graba a la niña repitiendo la frase y se la devuelve para que se oiga.
// La grabación se queda en la memoria de la tablet (no se guarda ni se envía a ningún sitio).
// Para sola: cuando ha hablado y luego se calla un momento, o al llegar al tope de tiempo.

let stream = null;

async function mic() {
  if (stream?.active) return stream;
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  return stream;
}

export const canRecord = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

// Devuelve { blob, spoke } o null si no hay micro. onLevel(0..1) para animar el botón.
export async function listen({ maxMs = 6000, quietMs = 1100, waitMs = 4500, onLevel = () => {} } = {}) {
  let s;
  try { s = await mic(); } catch { return null; }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const an = ctx.createAnalyser(); an.fftSize = 1024;
  ctx.createMediaStreamSource(s).connect(an);
  const data = new Float32Array(an.fftSize);
  const rec = new MediaRecorder(s);
  const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => { rec.onstop = r; });
  rec.start();
  const t0 = performance.now();
  let spoke = false, lastLoud = 0, floor = 0.01;
  await new Promise(resolve => {
    const tick = () => {
      an.getFloatTimeDomainData(data);
      let sum = 0; for (const v of data) sum += v * v;
      const rms = Math.sqrt(sum / data.length), now = performance.now() - t0;
      if (now < 300) floor = Math.max(floor, rms * 1.5); // ruido de fondo del primer instante
      const loud = rms > Math.max(0.02, floor * 2);
      if (loud) { spoke = true; lastLoud = now; }
      onLevel(Math.min(1, rms * 12));
      if (now > maxMs || (spoke && now - lastLoud > quietMs) || (!spoke && now > waitMs)) return resolve();
      requestAnimationFrame(tick);
    };
    tick();
  });
  rec.stop();
  await done;
  ctx.close();
  onLevel(0);
  return { blob: new Blob(chunks, { type: rec.mimeType || 'audio/webm' }), spoke };
}

// Reproduce la grabación; la promesa se cumple al terminar.
export function playBlob(blob) {
  return new Promise(res => {
    const a = new Audio(URL.createObjectURL(blob));
    a.onended = a.onerror = () => { URL.revokeObjectURL(a.src); res(); };
    a.play().catch(res);
  });
}

// Apaga el micro al salir de la pantalla (que no se quede el punto verde encendido).
export function releaseMic() {
  stream?.getTracks().forEach(t => t.stop());
  stream = null;
}
