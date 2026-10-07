// Dibujos para colorear. viewBox 0 0 800 600.
// Estilo por defecto (lo pone drawingSvg): relleno blanco, trazo negro grueso.
// Se dibujan en orden: lo que va después tapa a lo de antes.
// fill="none" = sólo línea · fill="#000" = detalle negro (ojos).

const star = (cx, cy, r, extra = '') => {
  let d = '';
  for (let k = 0; k < 10; k++) {
    const rad = k % 2 ? r * 0.45 : r, a = -Math.PI / 2 + k * Math.PI / 5;
    d += (k ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(1) + ' ' + (cy + Math.sin(a) * rad).toFixed(1);
  }
  return `<path d="${d}Z" ${extra}/>`;
};
const heart = (cx, cy, s) =>
  `<path d="M${cx} ${cy + s * 0.9} C${cx - s * 1.4} ${cy} ${cx - s * 0.9} ${cy - s} ${cx} ${cy - s * 0.35} C${cx + s * 0.9} ${cy - s} ${cx + s * 1.4} ${cy} ${cx} ${cy + s * 0.9}Z"/>`;
const eye = (x, y, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.32}" fill="#fff" stroke="none"/>`;
const cloud = (x, y, s = 1) =>
  `<path d="M${x - 60 * s} ${y + 20 * s} C${x - 95 * s} ${y + 20 * s} ${x - 95 * s} ${y - 30 * s} ${x - 55 * s} ${y - 25 * s} C${x - 50 * s} ${y - 60 * s} ${x + 5 * s} ${y - 65 * s} ${x + 15 * s} ${y - 35 * s} C${x + 40 * s} ${y - 60 * s} ${x + 90 * s} ${y - 40 * s} ${x + 70 * s} ${y - 5 * s} C${x + 100 * s} ${y} ${x + 95 * s} ${y + 25 * s} ${x + 60 * s} ${y + 20 * s}Z"/>`;
const sun = (x, y, r) => {
  let rays = '';
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
    rays += `M${(x + c * (r + 12)).toFixed(1)} ${(y + s * (r + 12)).toFixed(1)}L${(x + c * (r + 34)).toFixed(1)} ${(y + s * (r + 34)).toFixed(1)}`;
  }
  return `<path d="${rays}" fill="none"/><circle cx="${x}" cy="${y}" r="${r}"/>`;
};
const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r * 0.45}"/><circle cx="${x}" cy="${y}" r="${r * 0.12}" fill="#000"/>`;
const bubbles = (pts) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
const smile = (x, y, w) => `<path d="M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}" fill="none"/>`;
const seaweed = (x, h) => `<path d="M${x} 600 C${x - 30} ${600 - h * 0.3} ${x + 30} ${600 - h * 0.6} ${x} ${600 - h} C${x + 30} ${600 - h * 0.6} ${x + 5} ${600 - h * 0.3} ${x + 30} 600Z"/>`;
const ground = (y) => `<path d="M-10 ${y} C150 ${y - 25} 300 ${y + 20} 450 ${y - 5} C600 ${y - 25} 700 ${y + 10} 810 ${y - 10} L810 610 L-10 610Z"/>`;

export const THEMES = [
  { id: 'unicorn', emoji: '🦄', bg: '#FFD6F2', es: 'Unicornios', en: 'Unicorns', de: 'Einhörner' },
  { id: 'mermaid', emoji: '🧜‍♀️', bg: '#C9F2EE', es: 'Sirenas', en: 'Mermaids', de: 'Meerjungfrauen' },
  { id: 'sea', emoji: '🦈', bg: '#CFE6FF', es: 'El mar', en: 'The sea', de: 'Das Meer' },
  { id: 'volcano', emoji: '🌋', bg: '#FFD9C2', es: 'Volcanes', en: 'Volcanoes', de: 'Vulkane' },
  { id: 'dino', emoji: '🦖', bg: '#D9F5C5', es: 'Dinosaurios', en: 'Dinosaurs', de: 'Dinosaurier' },
  { id: 'works', emoji: '🚜', bg: '#FFF0B3', es: 'Tractores', en: 'Tractors', de: 'Traktoren' },
  { id: 'rescue', emoji: '🚓', bg: '#D6DCFF', es: 'Emergencias', en: 'Rescue', de: 'Rettung' },
  { id: 'animals', emoji: '🐱', bg: '#F5E3CC', es: 'Animales', en: 'Animals', de: 'Tiere' },
  { id: 'nature', emoji: '🌳', bg: '#DDF5D0', es: 'Naturaleza', en: 'Nature', de: 'Natur' },
  { id: 'school', emoji: '🏫', bg: '#FFE6C7', es: 'El cole', en: 'School', de: 'Schule' },
  { id: 'fairy', emoji: '🧚', bg: '#EBDDFF', es: 'Cuentos', en: 'Fairy tales', de: 'Märchen' },
];

export const DRAWINGS = [
  // ---------------- UNICORNIOS ----------------
  {
    id: 'unicorn', theme: 'unicorn', es: 'unicornio', en: 'unicorn', de: 'Einhorn',
    svg: `
      <path d="M60 235 A170 170 0 0 1 400 235 L370 235 A140 140 0 0 0 90 235Z"/>
      <path d="M90 235 A140 140 0 0 1 370 235 L340 235 A110 110 0 0 0 120 235Z"/>
      <path d="M120 235 A110 110 0 0 1 340 235 L310 235 A80 80 0 0 0 150 235Z"/>
      ${cloud(95, 240, 0.8)}${cloud(375, 240, 0.8)}
      <path d="M215 330 C130 300 95 390 120 470 C140 445 155 432 172 425 C160 462 178 498 210 510 C203 455 210 405 235 372Z"/>
      <rect x="240" y="400" width="50" height="135" rx="22"/>
      <rect x="310" y="415" width="50" height="125" rx="22"/>
      <rect x="425" y="415" width="50" height="125" rx="22"/>
      <rect x="495" y="400" width="50" height="135" rx="22"/>
      <path d="M242 502h46M312 507h46M427 507h46M497 502h46" fill="none"/>
      <path d="M475 335 C478 262 502 212 545 178 L622 222 C596 262 585 312 572 372Z"/>
      <path d="M560 150 Q500 115 485 180 Q430 180 450 240 Q395 255 435 300 Q395 330 455 350 L495 335 C498 262 518 222 570 190Z"/>
      <ellipse cx="390" cy="365" rx="190" ry="100"/>
      <path d="M588 150 L628 45 L638 162Z"/>
      <path d="M600 118 L632 125 M612 84 L631 89" fill="none"/>
      <path d="M566 162 L556 98 L606 140Z"/>
      <ellipse cx="612" cy="198" rx="82" ry="56" transform="rotate(30 612 198)"/>
      ${eye(622, 182, 10)}
            <circle cx="668" cy="232" r="4" fill="#000"/>
      <path d="M632 252 Q648 262 664 252" fill="none"/>
      ${heart(700, 90, 28)}${star(735, 330, 30)}${star(700, 470, 24)}
      ${ground(560)}`,
  },
  {
    id: 'unicorn-head', theme: 'unicorn', es: 'unicornio con flores', en: 'unicorn with flowers', de: 'Einhorn mit Blumen',
    svg: `
      <path d="M320 380 C300 460 290 520 280 600 L560 600 C540 520 520 450 500 380Z"/>
      <path d="M330 170 C250 190 230 300 270 360 C230 400 260 470 300 470 C300 420 310 380 330 350Z"/>
      <path d="M380 150 L420 20 L450 155Z"/>
      <path d="M393 108 L436 112 M405 68 L432 72" fill="none"/>
      <path d="M340 160 L330 90 L385 140Z"/>
      <path d="M460 145 L500 85 L500 165Z"/>
      <path d="M330 170 C340 130 420 120 480 150 C540 180 580 260 590 320 C600 380 560 420 500 410 C440 400 380 390 340 340 C310 300 310 210 330 170Z"/>
      <ellipse cx="560" cy="360" rx="55" ry="45"/>
      <circle cx="545" cy="355" r="5" fill="#000"/><circle cx="580" cy="358" r="5" fill="#000"/>
      <path d="M520 400 Q545 415 570 402" fill="none"/>
      <path d="M415 245 Q445 225 475 245" fill="none"/>
      <path d="M418 247 L410 233 M436 238 L432 222 M456 237 L458 221 M473 245 L482 232" fill="none"/>
      <circle cx="460" cy="300" r="22"/>
      ${[[130, 470], [180, 380], [650, 470], [700, 370], [120, 200], [690, 160]].map(([x, y]) =>
        `<circle cx="${x - 22}" cy="${y}" r="20"/><circle cx="${x + 22}" cy="${y}" r="20"/><circle cx="${x}" cy="${y - 22}" r="20"/><circle cx="${x}" cy="${y + 22}" r="20"/><circle cx="${x}" cy="${y}" r="15"/>`).join('')}
      ${star(220, 90, 28)}${star(610, 60, 24)}${heart(700, 270, 24)}`,
  },

  // ---------------- SIRENAS ----------------
  {
    id: 'mermaid', theme: 'mermaid', es: 'sirena', en: 'mermaid', de: 'Meerjungfrau',
    svg: `
      <ellipse cx="390" cy="560" rx="300" ry="75"/>
      <path d="M300 170 C290 70 360 35 400 35 C445 35 515 70 505 170 C515 245 530 300 495 340 L305 340 C268 300 290 245 300 170Z"/>
      <path d="M540 440 C560 380 620 350 680 360 C650 390 640 420 650 455 C690 450 715 470 720 500 C670 480 610 480 560 495Z"/>
      <path d="M345 330 L455 330 C465 390 490 420 560 425 C575 470 520 515 430 515 C340 512 305 430 345 330Z"/>
      <path d="M360 400 Q380 418 400 400 Q420 418 440 400 M375 450 Q395 468 415 450 Q435 468 455 450 Q475 468 495 450" fill="none"/>
      <path d="M342 225 C320 255 305 300 318 330 C328 330 336 322 340 312 C340 290 350 262 362 245Z"/>
      <path d="M458 225 C480 255 495 300 482 330 C472 330 464 322 460 312 C460 290 450 262 438 245Z"/>
      <rect x="348" y="210" width="104" height="135" rx="42"/>
      <path d="M352 262 C352 238 396 238 396 262 C380 270 368 270 352 262Z M404 262 C404 238 448 238 448 262 C432 270 420 270 404 262Z"/>
      <circle cx="400" cy="145" r="70"/>
      <path d="M332 128 C345 75 455 75 468 128 C446 108 425 112 410 125 C392 108 362 108 332 128Z"/>
      ${eye(375, 152, 9)}${eye(425, 152, 9)}
      ${smile(400, 180, 18)}
      <circle cx="358" cy="178" r="10"/><circle cx="442" cy="178" r="10"/>
      ${star(468, 92, 22)}
      ${star(150, 535, 38)}
      <path d="M600 520 C600 480 660 480 660 520Z"/><path d="M630 482 L630 520 M612 490 L620 520 M648 490 L640 520" fill="none"/>
      ${bubbles([[620, 120, 24], [660, 70, 16], [680, 180, 12], [150, 160, 20], [120, 250, 12], [190, 90, 14]])}`,
  },

  // ---------------- MAR ----------------
  {
    id: 'shark', theme: 'sea', es: 'tiburón', en: 'shark', de: 'Hai',
    svg: `
      ${seaweed(80, 200)}${seaweed(130, 150)}${seaweed(700, 220)}
      <path d="M330 232 L385 115 L450 228Z"/>
      <path d="M560 270 C600 240 650 190 700 165 C690 230 690 290 720 380 C670 360 620 335 570 330Z"/>
      <path d="M115 318 C190 215 420 195 580 262 C600 285 600 315 575 335 C450 420 230 420 115 318Z"/>
      <path d="M130 332 C240 392 430 398 568 336" fill="none"/>
      <path d="M300 368 L240 465 L370 385Z"/>
      ${eye(205, 285, 13)}
      <path d="M150 335 Q185 358 222 342" fill="none"/>
      <path d="M268 280 Q260 305 270 330 M290 278 Q282 305 292 330 M312 278 Q304 305 314 332" fill="none"/>
      ${bubbles([[110, 230, 16], [80, 180, 11], [100, 130, 7]])}
      ${star(420, 540, 35)}<ellipse cx="560" cy="560" rx="70" ry="30"/>`,
  },
  {
    id: 'octopus', theme: 'sea', es: 'pulpo', en: 'octopus', de: 'Krake',
    svg: `
      ${[[270, -1], [335, -1], [400, 1], [465, 1], [530, 1]].map(([x, d]) =>
        `<path d="M${x - 30} 280 L${x - 30} 430 C${x - 30} 490 ${x + d * 30} 520 ${x + d * 70} 505 C${x + d * 95} 495 ${x + d * 90} 465 ${x + d * 65} 465 C${x + d * 50} 465 ${x + 30} 460 ${x + 30} 420 L${x + 30} 280Z"/>`).join('')}
      <ellipse cx="400" cy="230" rx="175" ry="150"/>
      <ellipse cx="345" cy="240" rx="38" ry="44"/><ellipse cx="455" cy="240" rx="38" ry="44"/>
      ${eye(352, 248, 18)}${eye(448, 248, 18)}
      ${smile(400, 305, 30)}
      <circle cx="295" cy="300" r="18"/><circle cx="505" cy="300" r="18"/>
      <circle cx="360" cy="140" r="16"/><circle cx="440" cy="125" r="11"/><circle cx="475" cy="165" r="9"/>
      ${bubbles([[620, 90, 30], [680, 150, 18], [650, 220, 12], [140, 120, 22], [110, 190, 13]])}
      ${ground(570)}`,
  },
  {
    id: 'fish', theme: 'sea', es: 'pez', en: 'fish', de: 'Fisch',
    svg: `
      ${seaweed(90, 230)}${seaweed(720, 180)}${seaweed(670, 120)}
      <path d="M560 300 L700 190 C680 260 680 340 700 410Z"/>
      <path d="M330 175 C360 110 450 110 480 170Z"/>
      <path d="M350 425 C380 480 430 480 460 430Z"/>
      <ellipse cx="380" cy="300" rx="210" ry="140"/>
      <path d="M290 172 C330 230 330 370 290 428" fill="none"/>
      <path d="M390 162 C430 230 430 370 390 438" fill="none"/>
      <path d="M490 192 C520 250 520 350 490 408" fill="none"/>
      <circle cx="235" cy="270" r="34"/>${eye(240, 272, 16)}
      ${smile(215, 345, 22)}
      <path d="M340 300 C360 270 410 280 420 310 C400 320 360 325 340 300Z"/>
      ${bubbles([[130, 200, 20], [110, 140, 13], [140, 90, 8], [600, 110, 18]])}
      ${ground(565)}`,
  },

  // ---------------- VOLCANES ----------------
  {
    id: 'volcano', theme: 'volcano', es: 'volcán', en: 'volcano', de: 'Vulkan',
    svg: `
      ${sun(690, 90, 45)}
      <circle cx="340" cy="150" r="55"/><circle cx="410" cy="110" r="65"/><circle cx="480" cy="150" r="50"/><circle cx="400" cy="170" r="45"/>
      <path d="M90 540 L310 235 L490 235 L710 540Z"/>
      <ellipse cx="400" cy="235" rx="90" ry="22"/>
      <path d="M318 240 C330 300 352 300 356 340 C360 372 392 372 395 330 C398 300 418 300 422 355 C426 392 458 392 460 340 C462 300 474 290 482 240Z"/>
      <path d="M200 400 L240 395 M560 410 L600 420 M250 480 L300 470 M520 490 L570 495" fill="none"/>
      <circle cx="250" cy="200" r="16"/><circle cx="560" cy="210" r="20"/><circle cx="210" cy="270" r="11"/>
      ${ground(540)}
      <path d="M630 548 C635 500 640 460 650 420 L662 422 C655 460 650 500 648 548Z"/>
      <path d="M655 420 C620 395 590 405 575 425 C605 415 630 418 655 420Z M655 420 C690 395 720 405 735 425 C705 415 680 418 655 420Z M655 420 C640 385 615 375 595 380 C620 390 640 400 655 420Z M655 420 C670 385 695 375 715 380 C690 390 670 400 655 420Z"/>
      ${star(120, 120, 22)}`,
  },

  // ---------------- DINOSAURIOS ----------------
  {
    id: 'longneck', theme: 'dino', es: 'diplodocus', en: 'diplodocus', de: 'Diplodocus',
    svg: `
      ${sun(110, 90, 40)}
      <path d="M260 360 C180 380 110 420 40 400 C90 440 190 450 280 420Z"/>
      <rect x="270" y="400" width="55" height="130" rx="20"/>
      <rect x="350" y="410" width="55" height="125" rx="20"/>
      <rect x="470" y="410" width="55" height="125" rx="20"/>
      <rect x="545" y="400" width="55" height="130" rx="20"/>
      <path d="M520 330 C540 250 560 160 600 110 L650 130 C620 180 605 260 600 360Z"/>
      <ellipse cx="435" cy="360" rx="190" ry="105"/>
      <ellipse cx="650" cy="110" rx="70" ry="42" transform="rotate(10 650 110)"/>
      ${eye(660, 98, 9)}
      <path d="M680 128 Q698 132 712 122" fill="none"/>
      <circle cx="380" cy="320" r="26"/><circle cx="460" cy="300" r="18"/><circle cx="500" cy="370" r="24"/><circle cx="330" cy="390" r="16"/>
      ${ground(545)}
      <path d="M720 545 C715 470 720 420 740 360" fill="none"/>
      <path d="M740 360 C700 330 670 340 655 355 C690 350 715 360 740 360 C760 320 790 320 800 330 C780 345 760 355 740 360 C740 320 720 300 700 300 C720 320 735 340 740 360Z"/>`,
  },
  {
    id: 'stego', theme: 'dino', es: 'estegosaurio', en: 'stegosaurus', de: 'Stegosaurus',
    svg: `
      ${[[220, 280], [290, 235], [370, 215], [450, 222], [525, 250]].map(([x, y]) =>
        `<path d="M${x - 40} ${y + 50} L${x} ${y - 55} L${x + 40} ${y + 50}Z"/>`).join('')}
      <path d="M50 345 L30 290 L80 335Z"/><path d="M95 352 L85 300 L120 345Z"/>
      <path d="M200 330 C130 330 80 360 40 330 L60 380 C100 410 180 400 210 390Z"/>
      <rect x="230" y="390" width="55" height="130" rx="20"/>
      <rect x="300" y="400" width="55" height="125" rx="20"/>
      <rect x="440" y="400" width="55" height="125" rx="20"/>
      <rect x="510" y="390" width="55" height="130" rx="20"/>
      <ellipse cx="390" cy="345" rx="200" ry="100"/>
      <path d="M560 320 C600 290 650 290 690 310 C730 330 730 380 690 395 C650 405 600 395 570 380Z"/>
      ${eye(660, 330, 10)}
      <path d="M690 370 Q705 372 715 362" fill="none"/>
      <path d="M260 360 Q300 330 340 360 Q380 330 420 360 Q460 330 500 360" fill="none"/>
      ${ground(535)}
      ${cloud(650, 110, 1)}${cloud(150, 120, 0.8)}`,
  },

  // ---------------- TRACTORES / OBRAS ----------------
  {
    id: 'tractor', theme: 'works', es: 'tractor', en: 'tractor', de: 'Traktor',
    svg: `
      ${sun(690, 80, 40)}
      <rect x="455" y="160" width="22" height="120" rx="6"/>
      <circle cx="470" cy="135" r="18"/><circle cx="495" cy="100" r="24"/><circle cx="530" cy="60" r="30"/>
      <path d="M200 160 L350 160 L370 300 L190 300Z"/>
      <path d="M225 185 L330 185 L343 285 L215 285Z"/>
      <path d="M150 290 L560 290 L590 330 L590 420 L150 420Z"/>
      <rect x="500" y="320" width="60" height="70" rx="8"/>
      <path d="M512 335 h36 M512 355 h36 M512 375 h36" fill="none"/>
      <circle cx="560" cy="305" r="14"/>
      ${wheel(250, 430, 115)}
      ${wheel(520, 470, 70)}
      ${ground(545)}`,
  },
  {
    id: 'digger', theme: 'works', es: 'excavadora', en: 'digger', de: 'Bagger',
    svg: `
      ${cloud(140, 100, 0.9)}
      <path d="M380 260 L560 120 L600 160 L430 300Z"/>
      <path d="M560 120 L690 240 L655 270 L540 165Z"/>
      <path d="M640 250 L740 280 L720 380 L620 360 C650 330 650 290 640 250Z"/>
      <path d="M660 375 L655 395 M685 380 L682 400 M710 383 L708 403" fill="none"/>
      <circle cx="560" cy="140" r="16"/><circle cx="410" cy="280" r="16"/>
      <rect x="130" y="390" width="400" height="100" rx="50"/>
      ${[185, 255, 325, 395, 465].map(x => `<circle cx="${x}" cy="440" r="30"/>`).join('')}
      <rect x="150" y="330" width="360" height="70" rx="10"/>
      <path d="M170 170 L330 170 L360 330 L170 330Z"/>
      <path d="M195 195 L315 195 L335 305 L195 305Z"/>
      <rect x="380" y="210" width="20" height="120" rx="6"/>
      <path d="M560 500 C600 420 720 420 770 500Z"/>
      ${ground(510)}`,
  },

  // ---------------- EMERGENCIAS ----------------
  {
    id: 'police', theme: 'rescue', es: 'coche de policía', en: 'police car', de: 'Polizeiauto',
    svg: `
      <rect x="350" y="105" width="100" height="40" rx="14"/>
      <path d="M400 105 L400 145" fill="none"/>
      <path d="M250 145 L550 145 L630 270 L170 270Z"/>
      <path d="M275 165 L390 165 L390 260 L215 260Z M410 165 L525 165 L585 260 L410 260Z"/>
      <path d="M90 300 C90 275 130 268 170 268 L630 268 C680 268 720 280 720 310 L720 390 L80 390Z"/>
      <path d="M80 330 L720 330" fill="none"/>
      ${star(400, 300, 26)}
      <rect x="90" y="300" width="40" height="22" rx="8"/><rect x="670" y="300" width="40" height="22" rx="8"/>
      ${wheel(210, 395, 62)}${wheel(590, 395, 62)}
      <path d="M-10 470 L810 470" fill="none"/>
      <path d="M120 520 h120 M340 520 h120 M560 520 h120" fill="none"/>
      ${cloud(140, 80, 0.8)}${cloud(660, 70, 0.9)}`,
  },
  {
    id: 'ambulance', theme: 'rescue', es: 'ambulancia', en: 'ambulance', de: 'Krankenwagen',
    svg: `
      <rect x="230" y="110" width="80" height="34" rx="12"/>
      <path d="M90 140 L470 140 L470 400 L90 400Z"/>
      <path d="M470 190 L600 190 C640 190 700 270 710 300 L710 400 L470 400Z"/>
      <path d="M495 215 L590 215 C615 215 655 270 665 290 L495 290Z"/>
      <path d="M240 190 L300 190 L300 240 L350 240 L350 300 L300 300 L300 350 L240 350 L240 300 L190 300 L190 240 L240 240Z"/>
      <path d="M90 365 L710 365" fill="none"/>
      <rect x="680" y="320" width="34" height="22" rx="8"/>
      ${wheel(200, 405, 60)}${wheel(580, 405, 60)}
      <path d="M-10 475 L810 475" fill="none"/>
      ${sun(690, 80, 38)}${heart(110, 75, 30)}`,
  },

  // ---------------- ANIMALES ----------------
  {
    id: 'cat', theme: 'animals', es: 'gato', en: 'cat', de: 'Katze',
    svg: `
      <path d="M520 470 C620 470 680 400 660 320 C700 380 700 470 620 510 C580 530 540 520 520 510Z"/>
      <ellipse cx="420" cy="440" rx="140" ry="110"/>
      <ellipse cx="360" cy="535" rx="45" ry="28"/><ellipse cx="480" cy="535" rx="45" ry="28"/>
      <path d="M270 170 L285 60 L360 130Z"/><path d="M570 170 L555 60 L480 130Z"/>
      <path d="M287 148 L292 95 L333 135Z M553 148 L548 95 L507 135Z"/>
      <ellipse cx="420" cy="240" rx="170" ry="140"/>
      ${eye(360, 225, 16)}${eye(480, 225, 16)}
      <path d="M405 275 L435 275 L420 292Z" fill="#000"/>
      <path d="M420 292 Q400 315 385 300 M420 292 Q440 315 455 300" fill="none"/>
      <path d="M330 280 L250 268 M330 295 L252 305 M510 280 L590 268 M510 295 L588 305" fill="none"/>
      <path d="M340 160 Q350 140 360 160 M410 150 Q420 130 430 150 M480 160 Q490 140 500 160" fill="none"/>
      ${heart(150, 150, 30)}${star(680, 140, 30)}
      <path d="M170 500 C220 520 240 540 290 545" fill="none"/><circle cx="140" cy="480" r="42"/><path d="M108 460 Q140 470 160 445 M102 490 Q140 495 175 460 M115 515 Q150 505 180 485" fill="none"/>`,
  },
  {
    id: 'lion', theme: 'animals', es: 'león', en: 'lion', de: 'Löwe',
    svg: `
      ${sun(90, 80, 36)}
      ${Array.from({ length: 14 }, (_, k) => {
        const a = k * Math.PI * 2 / 14, x = 400 + Math.cos(a) * 165, y = 280 + Math.sin(a) * 165;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="62"/>`;
      }).join('')}
      <circle cx="400" cy="280" r="190" stroke="none"/>
      <circle cx="275" cy="160" r="40"/><circle cx="525" cy="160" r="40"/>
      <circle cx="275" cy="160" r="20"/><circle cx="525" cy="160" r="20"/>
      <circle cx="400" cy="285" r="150"/>
      ${eye(345, 255, 15)}${eye(455, 255, 15)}
      <ellipse cx="400" cy="345" rx="70" ry="50"/>
      <path d="M380 315 L420 315 L400 338Z" fill="#000"/>
      <path d="M400 338 L400 355 M400 355 Q380 375 365 360 M400 355 Q420 375 435 360" fill="none"/>
      <circle cx="372" cy="370" r="3" fill="#000"/><circle cx="428" cy="370" r="3" fill="#000"/>
      <circle cx="300" cy="320" r="20"/><circle cx="500" cy="320" r="20"/>
      ${ground(560)}`,
  },

  // ---------------- IMÁGENES (PNG líneas negras, 1200×900) ----------------
  { id: 'img-unicornio', theme: 'unicorn', img: 'img/unicornio.png', es: 'unicornio', en: 'unicorn', de: 'Einhorn' },
  { id: 'img-hada', theme: 'fairy', img: 'img/hada.png', es: 'hada', en: 'fairy', de: 'Fee' },
  { id: 'img-dragon', theme: 'fairy', img: 'img/dragon.png', es: 'dragón', en: 'dragon', de: 'Drache' },
  { id: 'img-castillo', theme: 'fairy', img: 'img/castillo.png', es: 'castillo', en: 'castle', de: 'Schloss' },
  { id: 'img-ballena', theme: 'sea', img: 'img/ballena.png', es: 'ballena', en: 'whale', de: 'Wal' },
  { id: 'img-pulpo', theme: 'sea', img: 'img/pulpo.png', es: 'pulpo', en: 'octopus', de: 'Krake' },
  { id: 'img-delfin', theme: 'sea', img: 'img/delfin.png', es: 'delfín', en: 'dolphin', de: 'Delfin' },
  { id: 'img-tortuga', theme: 'sea', img: 'img/tortuga.png', es: 'tortuga', en: 'turtle', de: 'Schildkröte' },
  { id: 'img-volcan', theme: 'volcano', img: 'img/volcan.png', es: 'volcán con palmeras', en: 'volcano with palm trees', de: 'Vulkan mit Palmen' },
  { id: 'img-dino-volcan', theme: 'volcano', img: 'img/dino-volcan.png', es: 'dinosaurio y volcán', en: 'dinosaur and volcano', de: 'Dino und Vulkan' },
  { id: 'img-tiranosaurio', theme: 'dino', img: 'img/tiranosaurio.png', es: 'tiranosaurio', en: 'T-rex', de: 'T-Rex' },
  { id: 'img-triceratops', theme: 'dino', img: 'img/triceratops.png', es: 'triceratops', en: 'triceratops', de: 'Triceratops' },
  { id: 'img-tractor', theme: 'works', img: 'img/tractor.png', es: 'tractor', en: 'tractor', de: 'Traktor' },
  { id: 'img-excavadora', theme: 'works', img: 'img/excavadora.png', es: 'excavadora', en: 'digger', de: 'Bagger' },
  { id: 'img-camion-volquete', theme: 'works', img: 'img/camion-volquete.png', es: 'camión', en: 'dump truck', de: 'Kipplaster' },
  { id: 'img-vaca-granja', theme: 'animals', img: 'img/vaca-granja.png', es: 'vaca', en: 'cow', de: 'Kuh' },
  { id: 'img-cerdo-y-gallina', theme: 'animals', img: 'img/cerdo-y-gallina.png', es: 'cerdo y gallina', en: 'pig and hen', de: 'Schwein und Huhn' },
  { id: 'img-arbol', theme: 'nature', img: 'img/arbol.png', es: 'árbol', en: 'tree', de: 'Baum' },
  { id: 'img-flores', theme: 'nature', img: 'img/flores.png', es: 'flores', en: 'flowers', de: 'Blumen' },
  { id: 'img-bosque', theme: 'nature', img: 'img/bosque.png', es: 'bosque', en: 'forest', de: 'Wald' },
  { id: 'img-colegio', theme: 'school', img: 'img/colegio.png', es: 'colegio', en: 'school', de: 'Schule' },
  { id: 'img-autobus', theme: 'school', img: 'img/autobus.png', es: 'autobús', en: 'school bus', de: 'Schulbus' },
  { id: 'img-aula', theme: 'school', img: 'img/aula.png', es: 'clase', en: 'classroom', de: 'Klassenzimmer' },
  { id: 'img-camino-colegio', theme: 'school', img: 'img/camino-colegio.png', es: 'camino al cole', en: 'walk to school', de: 'Schulweg' },
];
