// Textos, colores e idiomas. Cada entrada tiene es / en / de.

export const LANGS = ['es', 'en', 'de'];
export const FLAGS = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪' };
export const VOICE_LANG = { es: 'es-ES', en: 'en-GB', de: 'de-DE' };
export const LANG_NAME = { es: 'Español', en: 'English', de: 'Deutsch' };

export const COLORS = [
  { id: 'red',     hex: '#FF3B3B', es: 'rojo',     en: 'red',        de: 'rot' },
  { id: 'orange',  hex: '#FF9A1F', es: 'naranja',  en: 'orange',     de: 'orange' },
  { id: 'yellow',  hex: '#FFE03A', es: 'amarillo', en: 'yellow',     de: 'gelb' },
  { id: 'green',   hex: '#3DD45C', es: 'verde',    en: 'green',      de: 'grün' },
  { id: 'lblue',   hex: '#5AC8FA', es: 'celeste',  en: 'light blue', de: 'hellblau' },
  { id: 'blue',    hex: '#2F6BFF', es: 'azul',     en: 'blue',       de: 'blau' },
  { id: 'purple',  hex: '#A259FF', es: 'morado',   en: 'purple',     de: 'lila' },
  { id: 'pink',    hex: '#FF6FB5', es: 'rosa',     en: 'pink',       de: 'rosa' },
  { id: 'brown',   hex: '#A0642D', es: 'marrón',   en: 'brown',      de: 'braun' },
  { id: 'grey',    hex: '#9AA0A6', es: 'gris',     en: 'grey',       de: 'grau' },
  { id: 'black',   hex: '#2B2B2B', es: 'negro',    en: 'black',      de: 'schwarz' },
  { id: 'white',   hex: '#FFFFFF', es: 'blanco',   en: 'white',      de: 'weiß' },
  { id: 'rainbow', hex: 'rainbow', es: 'arcoíris', en: 'rainbow',    de: 'Regenbogen' },
];

export const PRAISE = {
  es: ['¡Muy bien!', '¡Qué bonito!', '¡Genial!', '¡Eres una artista!', '¡Precioso!'],
  en: ['Well done!', 'So pretty!', 'Great job!', 'You are an artist!', 'Beautiful!'],
  de: ['Super gemacht!', 'Wunderschön!', 'Toll!', 'Du bist eine Künstlerin!', 'Prima!'],
};

export const UI = {
  color:  { es: 'Colorear',     en: 'Colouring',  de: 'Ausmalen' },
  free:   { es: 'Pintar libre', en: 'Free paint', de: 'Frei malen' },
  album:  { es: 'Mi álbum',     en: 'My album',   de: 'Mein Album' },
  random: { es: '¡Sorpresa!',   en: 'Surprise!',  de: 'Überraschung!' },
  again:  { es: 'Otro',         en: 'Another',    de: 'Noch eins' },
  home:   { es: 'Casa',         en: 'Home',       de: 'Startseite' },
  empty:  { es: 'Aún no hay dibujos', en: 'No drawings yet', de: 'Noch keine Bilder' },
};

export const TOOLS = {
  fill:    { es: 'cubo',      en: 'bucket',  de: 'Eimer' },
  brush:   { es: 'pincel',    en: 'brush',   de: 'Pinsel' },
  glitter: { es: 'purpurina', en: 'glitter', de: 'Glitzer' },
  eraser:  { es: 'goma',      en: 'eraser',  de: 'Radiergummi' },
  stamp:   { es: 'pegatinas', en: 'stickers', de: 'Sticker' },
};
