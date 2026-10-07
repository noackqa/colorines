// Trazos de números y letras, en el orden y sentido en que se escriben.
// Caja de 100 de ancho: línea superior y=12, línea media y=55, línea base y=128, descendentes hasta y=160.
// Un trazo muy corto (p. ej. el punto de la i) se completa con un toque.

const O_BIG = 'M50 12 A38 58 0 1 0 50 128 A38 58 0 1 0 50 12';
const O_SMALL = 'M50 55 A32 36.5 0 1 0 50 128 A32 36.5 0 1 0 50 55';
const BOWL_A = 'M78 68 C65 48 18 55 18 92 C18 132 78 130 80 95'; // panza de a, d, g, q

export const NUMBERS = {
  0: [O_BIG],
  1: ['M28 38 L55 12 L55 128'],
  2: ['M18 40 C18 3 84 3 82 40 C80 66 40 90 15 128 L88 128'],
  3: ['M18 26 C30 3 82 5 80 38 C78 62 55 67 44 67 C62 67 86 76 85 99 C84 136 25 136 15 110'],
  4: ['M60 12 L14 92 L90 92', 'M68 40 L68 128'],
  5: ['M24 12 L20 64 C42 48 86 54 85 92 C84 134 28 136 15 110', 'M24 12 L80 12'],
  6: ['M78 20 C58 0 15 16 15 80 C15 132 85 134 85 92 C85 52 22 54 17 88'],
  7: ['M15 12 L85 12 L40 128'],
  8: ['M72 32 C72 4 28 4 28 32 C28 58 85 62 85 96 C85 136 15 136 15 96 C15 62 72 58 72 32'],
  9: ['M80 42 C80 6 20 6 20 42 C20 76 80 76 80 42 L76 128'],
  10: ['M18 38 L42 12 L42 128', 'M122 12 A35 58 0 1 0 122 128 A35 58 0 1 0 122 12'],
};

export const UPPER = {
  A: ['M50 12 L12 128', 'M50 12 L88 128', 'M27 88 L73 88'],
  B: ['M18 12 L18 128', 'M18 12 L55 12 C88 12 88 68 55 68 L18 68', 'M18 68 L60 68 C96 68 96 128 60 128 L18 128'],
  C: ['M85 30 C70 3 15 5 15 70 C15 136 70 136 85 110'],
  D: ['M18 12 L18 128', 'M18 12 L45 12 C100 12 100 128 45 128 L18 128'],
  E: ['M18 12 L18 128', 'M18 12 L82 12', 'M18 70 L72 70', 'M18 128 L82 128'],
  F: ['M18 12 L18 128', 'M18 12 L82 12', 'M18 68 L70 68'],
  G: ['M85 30 C70 3 15 5 15 70 C15 136 85 136 85 100 L85 76 L55 76'],
  H: ['M18 12 L18 128', 'M82 12 L82 128', 'M18 70 L82 70'],
  I: ['M50 12 L50 128'],
  J: ['M70 12 L70 95 C70 136 15 136 15 100'],
  K: ['M20 12 L20 128', 'M80 12 L20 80', 'M40 62 L82 128'],
  L: ['M20 12 L20 128 L82 128'],
  M: ['M12 128 L12 12 L50 86 L88 12 L88 128'],
  N: ['M18 128 L18 12 L82 128 L82 12'],
  Ñ: ['M18 128 L18 22 L82 128 L82 22', 'M28 2 C40 -10 58 12 72 0'],
  O: [O_BIG],
  P: ['M18 12 L18 128', 'M18 12 L55 12 C92 12 92 72 55 72 L18 72'],
  Q: [O_BIG, 'M60 96 L90 134'],
  R: ['M18 12 L18 128', 'M18 12 L55 12 C92 12 92 72 55 72 L18 72', 'M50 72 L86 128'],
  S: ['M82 28 C70 3 18 6 18 38 C18 68 82 62 82 98 C82 136 22 136 15 108'],
  T: ['M12 12 L88 12', 'M50 12 L50 128'],
  U: ['M18 12 L18 90 C18 136 82 136 82 90 L82 12'],
  V: ['M12 12 L50 128 L88 12'],
  W: ['M6 12 L28 128 L50 48 L72 128 L94 12'],
  X: ['M16 12 L84 128', 'M84 12 L16 128'],
  Y: ['M12 12 L50 68', 'M88 12 L50 68 L50 128'],
  Z: ['M15 12 L85 12 L15 128 L85 128'],
};

export const LOWER = {
  a: [BOWL_A, 'M80 55 L80 128'],
  b: ['M20 12 L20 128', 'M20 92 C20 50 82 50 82 92 C82 134 20 134 20 96'],
  c: ['M80 68 C65 46 18 54 18 92 C18 132 66 136 80 114'],
  d: [BOWL_A, 'M80 12 L80 128'],
  e: ['M20 92 L80 92 C80 48 20 48 20 92 C20 134 66 136 80 114'],
  f: ['M76 22 C66 4 40 6 40 36 L40 128', 'M18 58 L68 58'],
  g: [BOWL_A, 'M80 55 L80 140 C80 170 26 168 20 148'],
  h: ['M20 12 L20 128', 'M20 90 C20 48 80 48 80 86 L80 128'],
  i: ['M50 55 L50 128', 'M50 28 L50 30'],
  j: ['M60 55 L60 140 C60 168 26 166 20 148', 'M60 28 L60 30'],
  k: ['M22 12 L22 128', 'M76 55 L22 102', 'M42 86 L78 128'],
  l: ['M50 12 L50 128'],
  m: ['M12 55 L12 128', 'M12 86 C12 48 50 48 50 80 L50 128', 'M50 80 C50 48 88 48 88 80 L88 128'],
  n: ['M20 55 L20 128', 'M20 88 C20 48 80 48 80 86 L80 128'],
  ñ: ['M20 55 L20 128', 'M20 88 C20 48 80 48 80 86 L80 128', 'M28 30 C40 18 58 40 72 28'],
  o: [O_SMALL],
  p: ['M20 55 L20 160', 'M20 92 C20 50 82 50 82 92 C82 134 20 134 20 96'],
  q: [BOWL_A, 'M80 55 L80 160'],
  r: ['M24 55 L24 128', 'M24 90 C24 60 56 48 80 62'],
  s: ['M76 66 C68 48 24 48 24 72 C24 94 76 86 76 108 C76 136 24 134 18 114'],
  t: ['M45 20 L45 112 C45 132 66 134 76 122', 'M20 55 L72 55'],
  u: ['M20 55 L20 100 C20 136 80 136 80 100', 'M80 55 L80 128'],
  v: ['M15 55 L50 128 L85 55'],
  w: ['M6 55 L28 128 L50 72 L72 128 L94 55'],
  x: ['M20 55 L80 128', 'M80 55 L20 128'],
  y: ['M15 55 L50 120', 'M85 55 L36 160'],
  z: ['M20 55 L80 55 L20 128 L80 128'],
};

// Nombre que dice la voz para cada letra (escrito para que la voz lo pronuncie bien).
export const LETTER_NAMES = {
  es: { A: 'A', B: 'Be', C: 'Ce', D: 'De', E: 'E', F: 'Efe', G: 'Ge', H: 'Hache', I: 'I', J: 'Jota', K: 'Ka', L: 'Ele', M: 'Eme', N: 'Ene', Ñ: 'Eñe', O: 'O', P: 'Pe', Q: 'Cu', R: 'Erre', S: 'Ese', T: 'Te', U: 'U', V: 'Uve', W: 'Uve doble', X: 'Equis', Y: 'I griega', Z: 'Zeta' },
  en: { A: 'Ay', B: 'Bee', C: 'See', D: 'Dee', E: 'Ee', F: 'Eff', G: 'Gee', H: 'Aitch', I: 'Eye', J: 'Jay', K: 'Kay', L: 'Ell', M: 'Em', N: 'En', O: 'Oh', P: 'Pee', Q: 'Queue', R: 'Ar', S: 'Ess', T: 'Tee', U: 'You', V: 'Vee', W: 'Double you', X: 'Ex', Y: 'Why', Z: 'Zed' },
  de: { A: 'A', B: 'Be', C: 'Zeh', D: 'De', E: 'E', F: 'Eff', G: 'Geh', H: 'Hah', I: 'I', J: 'Jott', K: 'Kah', L: 'Ell', M: 'Emm', N: 'Enn', O: 'O', P: 'Peh', Q: 'Kuh', R: 'Err', S: 'Ess', T: 'Teh', U: 'U', V: 'Vau', W: 'Weh', X: 'Iks', Y: 'Ypsilon', Z: 'Zett' },
};

export const NUMBER_NAMES = {
  es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  de: ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'],
};

// Letras del abecedario según idioma (la Ñ sólo en español).
export function alphabet(lang, lower = false) {
  const up = Object.keys(UPPER).filter(c => c !== 'Ñ' || lang === 'es');
  return lower ? up.map(c => c.toLowerCase()) : up;
}

export function glyphStrokes(kind, ch) {
  if (kind === 'num') return NUMBERS[ch];
  return kind === 'upper' ? UPPER[ch] : LOWER[ch];
}
