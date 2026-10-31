// "¿Cómo pasa?": procesos de la naturaleza contados por pasos.
// Cada paso = un dibujo de fondo (stories/<id>-<n>.webp) + efectos animados en un canvas
// encima (lluvia, vapor, lava…) + una frase con voz. Se avanza tocando la pantalla.
// Las coordenadas de los efectos van en % del dibujo (16:9). cap: 'top' sube el subtítulo
// cuando lo importante está abajo (el magma, la semilla).

import { sfx, say } from './sound.js';

const HAND_AFTER = 2500; // ms tras la frase → aparece la manita "toca para seguir"

export const STORIES = [
  {
    id: 'agua', emoji: '💧', bg: '#CFEFFF', thumb: 3,
    es: 'El ciclo del agua', en: 'The water cycle', de: 'Der Wasserkreislauf',
    steps: [
      { img: 1, fx: [['rays', { x: 14, y: 20, r: 7 }]],
        es: 'Este es el mar. El sol brilla y calienta el agua.', en: 'This is the sea. The sun shines and warms the water.', de: 'Das ist das Meer. Die Sonne scheint und wärmt das Wasser.' },
      { img: 1, fx: [['rays', { x: 14, y: 20, r: 7 }], ['vapor', { x: 2, y: 30, w: 26, h: 42 }]],
        es: 'El agua calentita sube al cielo muy despacito. Se llama vapor.', en: 'The warm water rises slowly into the sky. It is called vapour.', de: 'Das warme Wasser steigt ganz langsam in den Himmel. Das nennt man Wasserdampf.' },
      { img: 2, fx: [['vapor', { x: 2, y: 30, w: 26, h: 42, n: 10 }], ['sparkle', { x: 74, y: 12, r: 10 }]],
        es: 'Arriba hace frío. El vapor se junta y se forman las nubes.', en: 'It is cold up high. The vapour comes together and makes clouds.', de: 'Oben ist es kalt. Der Dampf sammelt sich und es entstehen Wolken.' },
      { img: 3, fx: [['colordrops', { x: 46, y: 8, w: 44, h: 16, n: 26, blue: true }]],
        es: 'Las nubes se llenan de gotitas y se ponen grises.', en: 'The clouds fill up with tiny drops and turn grey.', de: 'Die Wolken füllen sich mit kleinen Tropfen und werden grau.' },
      { img: 3, fx: [['rain', { x: 44, y: 24, w: 48, h: 30, n: 160 }]],
        es: '¡Plic, plic, plic! Llueve sobre la montaña.', en: 'Pitter, patter! It rains on the mountain.', de: 'Plitsch, platsch! Es regnet auf den Berg.' },
      { img: 1, fx: [['river', { pts: [[89.2, 34], [87, 45], [84.5, 51.5], [79, 55], [77.3, 58.3], [79.5, 62.3], [84.3, 66.3], [83.3, 69.7], [75, 72.3], [70, 74.3], [66.5, 78.3], [62.5, 81.5], [56, 83], [48, 82.3], [43.5, 83.7], [36.5, 85], [31.5, 83.5]] }]],
        es: 'El agua de la lluvia baja por el río hasta el mar.', en: 'The rainwater runs down the river to the sea.', de: 'Das Regenwasser fließt den Fluss hinunter bis ins Meer.' },
      { img: 1, fx: [['rays', { x: 14, y: 20, r: 7 }], ['vapor', { x: 2, y: 30, w: 26, h: 42, n: 14 }], ['river', { pts: [[89.2, 34], [87, 45], [84.5, 51.5], [79, 55], [77.3, 58.3], [79.5, 62.3], [84.3, 66.3], [83.3, 69.7], [75, 72.3], [70, 74.3], [66.5, 78.3], [62.5, 81.5], [56, 83], [48, 82.3], [43.5, 83.7], [36.5, 85], [31.5, 83.5]] }]],
        es: '¡Y vuelta a empezar! Esto es el ciclo del agua.', en: 'And it all starts again! This is the water cycle.', de: 'Und alles beginnt von vorn! Das ist der Wasserkreislauf.' },
    ],
  },
  {
    id: 'volcan', emoji: '🌋', bg: '#FFE0CC', thumb: 4, cap: 'top',
    es: 'Cómo nace un volcán', en: 'How a volcano is born', de: 'Wie ein Vulkan entsteht',
    steps: [
      { img: 1, fx: [['bubbles', { x: 32, y: 80, w: 36, h: 18 }], ['glow', { x: 50, y: 92, r: 14, color: '255,150,40' }]],
        es: 'Debajo del suelo, muy hondo, hay roca tan caliente que se derrite. Se llama magma.', en: 'Deep under the ground, rock is so hot that it melts. It is called magma.', de: 'Tief unter der Erde ist Gestein so heiß, dass es schmilzt. Das heißt Magma.' },
      { img: 2, fx: [['bubbles', { x: 46, y: 44, w: 8, h: 50, n: 16 }], ['glow', { x: 50, y: 92, r: 14, color: '255,150,40' }]],
        es: 'El magma empuja hacia arriba y el suelo se hincha.', en: 'The magma pushes up and the ground bulges.', de: 'Das Magma drückt nach oben und der Boden wölbt sich.' },
      { img: 3, fx: [['smoke', { x: 49, y: 17, n: 12, size: 3 }], ['bubbles', { x: 47, y: 25, w: 5, h: 60, n: 12 }]],
        es: 'Se forma una montaña con un agujero arriba. ¡Es un volcán!', en: 'A mountain with a hole on top grows. It is a volcano!', de: 'Ein Berg mit einem Loch oben entsteht. Das ist ein Vulkan!' },
      { img: 4, fx: [['lava', { x: 50, y: 20 }], ['smoke', { x: 48, y: 10, n: 22, size: 6 }]], shake: true,
        es: '¡Bum! El volcán entra en erupción y sale lava muy caliente.', en: 'Boom! The volcano erupts and very hot lava comes out.', de: 'Bumm! Der Vulkan bricht aus und heiße Lava kommt heraus.' },
      { img: 5, fx: [['smoke', { x: 49, y: 17, n: 6, size: 2.5, white: true }]],
        es: 'La lava se enfría y se convierte en roca dura.', en: 'The lava cools down and turns into hard rock.', de: 'Die Lava kühlt ab und wird zu hartem Stein.' },
      { img: 6, fx: [['sparkle', { x: 50, y: 32, r: 16, n: 14 }], ['fly', { e: '🦋', x: 30, y: 30, rx: 8, ry: 5, n: 2 }]],
        es: 'Con el tiempo crecen plantas y vuelven los animales.', en: 'In time, plants grow and the animals come back.', de: 'Mit der Zeit wachsen Pflanzen und die Tiere kommen zurück.' },
    ],
  },
  {
    id: 'arcoiris', emoji: '🌈', bg: '#E9DDFF', thumb: 1,
    es: 'Cómo sale el arcoíris', en: 'How a rainbow appears', de: 'Wie ein Regenbogen entsteht',
    steps: [
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }]],
        es: 'Está lloviendo un poquito.', en: 'It is raining a little.', de: 'Es regnet ein bisschen.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['rays', { x: 14, y: 25, r: 7 }]],
        es: 'Y a la vez, sale el sol.', en: 'And at the same time, the sun comes out.', de: 'Und gleichzeitig kommt die Sonne heraus.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['prism', { x: 50, y: 38 }]],
        es: 'La luz del sol parece blanca, pero lleva todos los colores escondidos.', en: 'Sunlight looks white, but all the colours are hiding inside it.', de: 'Sonnenlicht sieht weiß aus, aber alle Farben verstecken sich darin.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['colordrops', { x: 66, y: 30, w: 34, h: 40 }]],
        es: 'Las gotitas de lluvia separan los colores, como espejitos mágicos.', en: 'The raindrops split the colours, like little magic mirrors.', de: 'Die Regentropfen trennen die Farben, wie kleine Zauberspiegel.' },
      { img: 1, fx: [['rain', { x: 70, y: 30, w: 30, h: 38 }], ['rainbow', { x: 67, y: 88, r: 30 }]],
        es: '¡Y aparece el arcoíris!', en: 'And a rainbow appears!', de: 'Und ein Regenbogen erscheint!' },
      { img: 1, fx: [['rainbow', { x: 67, y: 88, r: 30, instant: true, bands: true }], ['sparkle', { x: 67, y: 40, r: 26, n: 12 }]],
        es: 'Rojo, naranja, amarillo, verde, azul y morado.', en: 'Red, orange, yellow, green, blue and purple.', de: 'Rot, Orange, Gelb, Grün, Blau und Lila.' },
    ],
  },
  {
    id: 'arbol', emoji: '🌳', bg: '#DDF5C8', thumb: 6,
    es: 'De semilla a árbol', en: 'From seed to tree', de: 'Vom Samen zum Baum',
    steps: [
      { img: 1, fx: [['glow', { x: 49, y: 77, r: 5, color: '255,230,120' }], ['sparkle', { x: 49, y: 77, r: 6, n: 6 }]],
        es: 'Esto es una semilla. Está dormida bajo la tierra.', en: 'This is a seed. It is sleeping under the ground.', de: 'Das ist ein Samen. Er schläft unter der Erde.' },
      { img: 1, fx: [['rain', { x: 30, y: 8, w: 40, h: 52, n: 110 }], ['rays', { x: 89, y: 16, r: 6 }], ['glow', { x: 49, y: 77, r: 5, color: '255,230,120' }]],
        es: 'Con la lluvia y la luz del sol, se despierta.', en: 'With rain and sunshine, it wakes up.', de: 'Mit Regen und Sonnenschein wacht er auf.' },
      { img: 2, fx: [['sparkle', { x: 49, y: 64, r: 8, n: 8 }]],
        es: 'Le sale una raíz hacia abajo y un brote verde hacia arriba.', en: 'A root grows down and a green shoot grows up.', de: 'Eine Wurzel wächst nach unten und ein grüner Spross nach oben.' },
      { img: 3, fx: [['sparkle', { x: 49, y: 45, r: 12, n: 10 }]],
        es: 'Crece y crece, y se convierte en un arbolito.', en: 'It grows and grows into a little tree.', de: 'Er wächst und wächst und wird ein kleiner Baum.' },
      { img: 4, fx: [['sparkle', { x: 50, y: 25, r: 20, n: 14 }], ['fly', { e: '🐦', x: 30, y: 18, rx: 10, ry: 4, n: 1 }]],
        es: 'Pasan los años y se hace un árbol grande y fuerte.', en: 'Years go by and it becomes a big, strong tree.', de: 'Die Jahre vergehen und er wird ein großer, starker Baum.' },
      { img: 5, fx: [['fly', { e: '🐝', x: 48, y: 24, rx: 20, ry: 14, n: 3 }], ['petals', { x: 28, y: 15, w: 44, h: 50 }]],
        es: 'En primavera le salen flores, y las abejas las visitan.', en: 'In spring it grows flowers, and the bees visit them.', de: 'Im Frühling bekommt er Blüten, und die Bienen besuchen sie.' },
      { img: 6, fx: [['sparkle', { x: 50, y: 24, r: 18, n: 14 }]],
        es: 'Las flores se convierten en manzanas.', en: 'The flowers turn into apples.', de: 'Aus den Blüten werden Äpfel.' },
      { img: 6, swap: [7, 1.15], cap: 'top', fx: [['fall', { e: '🍎', x: 62, y: 30, x1: 64.4, y1: 62.8, size: 4.4 }], ['glow', { x: 64.2, y: 83, r: 3.5, color: '255,230,120', delay: 1.4 }]],
        es: 'Una manzana cae al suelo. Dentro tiene semillas.', en: 'An apple falls to the ground. It has seeds inside.', de: 'Ein Apfel fällt auf den Boden. Darin sind Samen.' },
      { img: 1, fx: [['glow', { x: 49, y: 77, r: 5, color: '255,230,120' }], ['sparkle', { x: 49, y: 77, r: 7, n: 8 }]],
        es: 'La semilla se queda en la tierra… ¡y todo vuelve a empezar!', en: 'The seed stays in the ground… and it all starts again!', de: 'Der Samen bleibt in der Erde … und alles beginnt von vorn!' },
    ],
  },
  {
    id: 'mariposa', emoji: '🦋', bg: '#FFE3F1', thumb: 6,
    es: 'De oruga a mariposa', en: 'From caterpillar to butterfly', de: 'Von der Raupe zum Schmetterling',
    steps: [
      { img: 1, fx: [['glow', { x: 50.6, y: 49.3, r: 3, color: '255,240,150' }], ['sparkle', { x: 50.6, y: 49.3, r: 4, n: 6 }]],
        es: 'Mira esta hoja. Tiene un huevito muy pequeño.', en: 'Look at this leaf. It has a tiny little egg.', de: 'Schau dir dieses Blatt an. Darauf liegt ein winziges Ei.' },
      { img: 2, fx: [['sparkle', { x: 53, y: 47, r: 5, n: 8 }]],
        es: '¡Crac! Del huevo sale una oruga chiquitita.', en: 'Crack! A tiny caterpillar comes out of the egg.', de: 'Knack! Aus dem Ei schlüpft eine winzige Raupe.' },
      { img: 3, fx: [['bob', { e: '😋', x: 47, y: 25, size: 4 }]],
        es: 'Come hojas y más hojas. ¡Ñam, ñam! Y se pone gordita.', en: 'It eats leaves and more leaves. Yum, yum! And it gets nice and fat.', de: 'Sie frisst Blätter und noch mehr Blätter. Mampf, mampf! Und sie wird ganz dick.' },
      { img: 4, fx: [['glow', { x: 50, y: 73, r: 6, color: '200,255,160' }], ['sparkle', { x: 50, y: 73, r: 6, n: 8 }]],
        es: 'Luego se cuelga de la rama y se envuelve. Se llama crisálida.', en: 'Then it hangs from the branch and wraps itself up. It is called a chrysalis.', de: 'Dann hängt sie sich an den Ast und hüllt sich ein. Das ist eine Puppe.' },
      { img: 4, fx: [['zzz', { x: 56, y: 70 }], ['glow', { x: 50, y: 73, r: 6, color: '200,255,160' }]],
        es: 'Dentro, duerme y cambia muy despacito. ¡Shhh!', en: 'Inside, it sleeps and changes very slowly. Shhh!', de: 'Drinnen schläft sie und verwandelt sich ganz langsam. Pssst!' },
      { img: 5, fx: [['sparkle', { x: 54, y: 80, r: 9, n: 14 }]],
        es: 'Un día, la crisálida se abre… ¡y sale una mariposa!', en: 'One day the chrysalis opens… and out comes a butterfly!', de: 'Eines Tages geht die Puppe auf … und heraus kommt ein Schmetterling!' },
      { img: 6, fx: [['fly', { e: '🦋', x: 30, y: 25, rx: 12, ry: 8, n: 2 }], ['sparkle', { x: 82, y: 38, r: 13, n: 12 }]],
        es: 'Abre sus alas de colores y se va volando.', en: 'It opens its colourful wings and flies away.', de: 'Er öffnet seine bunten Flügel und fliegt davon.' },
      { img: 1, fx: [['fly', { e: '🦋', x: 54, y: 36, rx: 8, ry: 5, n: 1 }], ['glow', { x: 50.6, y: 49.3, r: 3, color: '255,240,150', delay: 1 }]],
        es: 'La mariposa pone un huevito en una hoja… ¡y vuelta a empezar!', en: 'The butterfly lays a tiny egg on a leaf… and it all starts again!', de: 'Der Schmetterling legt ein winziges Ei auf ein Blatt … und alles beginnt von vorn!' },
    ],
  },
  {
    id: 'pan', emoji: '🍞', bg: '#FFEFC4', thumb: 8,
    es: 'Cómo se hace el pan', en: 'How bread is made', de: 'Wie Brot gemacht wird',
    steps: [
      { img: 1, fx: [['rays', { x: 16, y: 19, r: 6 }], ['sparkle', { x: 50, y: 70, r: 30, n: 12 }]],
        es: 'El pan empieza en el campo, con el trigo dorado.', en: 'Bread starts in the field, with golden wheat.', de: 'Brot beginnt auf dem Feld, mit goldenem Weizen.' },
      { img: 2, fx: [['dust', { x: 84, y: 28, w: 15, h: 22, color: '235,200,110' }], ['dust', { x: 58, y: 52, w: 12, h: 10, color: '235,200,110', n: 14 }]],
        es: 'Una cosechadora grande recoge los granos de trigo.', en: 'A big combine harvester collects the wheat grains.', de: 'Ein großer Mähdrescher sammelt die Weizenkörner ein.' },
      { img: 3, fx: [['dust', { x: 54, y: 60, w: 14, h: 18 }], ['sparkle', { x: 61, y: 73, r: 6, n: 8 }]],
        es: 'En el molino, los granos se aplastan y se convierten en harina.', en: 'At the mill, the grains are crushed into flour.', de: 'In der Mühle werden die Körner zu Mehl gemahlen.' },
      { img: 4, fx: [['sparkle', { x: 66, y: 62, r: 13, n: 12 }]],
        es: 'En casa juntamos harina, agua, sal y levadura.', en: 'At home we mix flour, water, salt and yeast.', de: 'Zu Hause mischen wir Mehl, Wasser, Salz und Hefe.' },
      { img: 5, fx: [['dust', { x: 40, y: 60, w: 20, h: 16 }]], shake: true,
        es: 'Amasamos y amasamos, y sale una masa blandita.', en: 'We knead and knead, and we get a soft dough.', de: 'Wir kneten und kneten, und es wird ein weicher Teig.' },
      { img: 6, fx: [['sparkle', { x: 39, y: 46, r: 9, n: 10 }]],
        es: 'La masa descansa y se hincha como un globo.', en: 'The dough rests and puffs up like a balloon.', de: 'Der Teig ruht und geht auf wie ein Ballon.' },
      { img: 7, fx: [['glow', { x: 80, y: 40, r: 10, color: '255,150,40' }], ['bubbles', { x: 74, y: 30, w: 12, h: 16, n: 10 }]],
        es: 'La metemos en el horno bien caliente.', en: 'We put it in the hot oven.', de: 'Wir schieben ihn in den heißen Ofen.' },
      { img: 8, fx: [['vapor', { x: 37, y: 34, w: 14, h: 20, n: 12 }], ['sparkle', { x: 45, y: 60, r: 12, n: 10 }]],
        es: '¡Mmm, qué bien huele! Ya tenemos pan.', en: 'Mmm, it smells so good! Now we have bread.', de: 'Mmm, das riecht gut! Jetzt haben wir Brot.' },
    ],
  },
  {
    id: 'tierra', emoji: '🌍', bg: '#D9DEFF', thumb: 4,
    es: 'El sol, la Tierra y la luna', en: 'The sun, the Earth and the moon', de: 'Sonne, Erde und Mond',
    steps: [
      { img: 1, fx: [['rays', { x: 2, y: 52, r: 14 }]],
        es: 'Este es el sol. Es una estrella enorme que nos da luz y calor.', en: 'This is the sun. It is a huge star that gives us light and warmth.', de: 'Das ist die Sonne. Sie ist ein riesiger Stern und gibt uns Licht und Wärme.' },
      { img: 1, fx: [['earth', { x: 66, y: 50, r: 13, spin: 0.25, grow: true }]],
        es: 'Esta es la Tierra, donde vivimos. Es redonda como una pelota.', en: 'This is the Earth, where we live. It is round like a ball.', de: 'Das ist die Erde, auf der wir wohnen. Sie ist rund wie ein Ball.' },
      { img: 1, fx: [['earth', { x: 66, y: 50, r: 13, spin: 1.3, house: true }]],
        es: 'La Tierra gira y gira, como una peonza.', en: 'The Earth spins and spins, like a spinning top.', de: 'Die Erde dreht sich und dreht sich, wie ein Kreisel.' },
      { img: 2, fx: [['rays', { x: 86, y: 20, r: 5.5 }]],
        es: 'Cuando nuestra casa mira hacia el sol, es de día.', en: 'When our home faces the sun, it is daytime.', de: 'Wenn unser Haus zur Sonne schaut, ist es Tag.' },
      { img: 3, fx: [['glow', { x: 87, y: 22, r: 8, color: '255,240,170' }], ['sparkle', { x: 40, y: 20, r: 30, n: 14 }]],
        es: 'Cuando mira hacia el otro lado, es de noche.', en: 'When it faces the other way, it is night-time.', de: 'Wenn es auf die andere Seite schaut, ist es Nacht.' },
      { img: 1, fx: [['earth', { x: 66, y: 50, r: 11, spin: 0.4, moon: true }]],
        es: 'La luna da vueltas alrededor de la Tierra.', en: 'The moon goes round and round the Earth.', de: 'Der Mond kreist um die Erde.' },
      { img: 4, fx: [['rays', { x: 50, y: 50, r: 7.5 }], ['orbit', { x: 50, y: 49, rx: 42.3, ry: 31, r: 3.2 }]],
        es: 'Y la Tierra da una vuelta enorme alrededor del sol. ¡Cada vuelta es un año!', en: 'And the Earth travels all the way around the sun. Each trip is one year!', de: 'Und die Erde reist einmal ganz um die Sonne. Jede Runde ist ein Jahr!' },
      { img: 4, fx: [['rays', { x: 50, y: 50, r: 7.5 }], ['orbit', { x: 50, y: 49, rx: 42.3, ry: 31, r: 3.2, speed: 0.9, party: true }]],
        es: 'Por eso cumples años. ¡Feliz vuelta al sol!', en: 'That is why you have birthdays. Happy trip around the sun!', de: 'Darum hast du Geburtstag. Alles Gute zur Sonnenrunde!' },
    ],
  },
];

export const imgOf = (story, n) => `stories/${story.id}-${n}.webp`;

// ---------- efectos ----------
// Cada efecto recibe sus opciones (en % del dibujo) y devuelve draw(ctx, W, H, t, dt).
const rand = (a, b) => a + Math.random() * (b - a);
const RAINBOW = ['#FF4B4B', '#FF9A2E', '#FFE14D', '#5BD15B', '#3FA7FF', '#9B6BFF'];

function star(c, x, y, r) {
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4, rr = i % 2 ? r * 0.35 : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath(); c.fill();
}

const FX = {
  rays({ x, y, r = 7 }) {
    return (c, W, H, t) => {
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W;
      const g = c.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 2);
      g.addColorStop(0, `rgba(255,240,150,${0.45 + 0.15 * Math.sin(t * 2)})`);
      g.addColorStop(1, 'rgba(255,240,150,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * 2, 0, 7); c.fill();
      c.save(); c.translate(cx, cy); c.rotate(t * 0.25);
      c.strokeStyle = 'rgba(255,200,60,.8)'; c.lineCap = 'round'; c.lineWidth = R * 0.09;
      for (let i = 0; i < 12; i++) {
        c.rotate(Math.PI / 6);
        const p = 1 + 0.15 * Math.sin(t * 3 + i);
        c.beginPath(); c.moveTo(R * 1.15, 0); c.lineTo(R * 1.5 * p, 0); c.stroke();
      }
      c.restore();
    };
  },

  rain({ x, y, w, h, n = 120 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), y: rand(y, y + h), v: rand(55, 80) }));
    return (c, W, H, t, dt) => {
      c.strokeStyle = 'rgba(110,160,255,.85)'; c.lineCap = 'round'; c.lineWidth = Math.max(1.5, W * 0.0022);
      c.beginPath();
      for (const p of ps) {
        p.y += p.v * dt;
        if (p.y > y + h) { p.y = y + rand(-4, 0); p.x = rand(x, x + w); }
        const px = p.x / 100 * W, py = p.y / 100 * H;
        c.moveTo(px, py); c.lineTo(px - W * 0.003, py + H * 0.035);
      }
      c.stroke();
    };
  },

  // Vapor: hilitos ondulados blancos que suben desde abajo y se desvanecen.
  vapor({ x, y, w, h, n = 22 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), age: rand(0, 1), v: rand(0.18, 0.3), ph: rand(0, 6) }));
    return (c, W, H, t, dt) => {
      c.lineCap = 'round'; c.lineWidth = Math.max(2, W * 0.004);
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); }
        const py = (y + h - p.age * h) / 100 * H, px = p.x / 100 * W;
        const a = Math.sin(p.age * Math.PI);
        c.strokeStyle = `rgba(255,255,255,${0.85 * a})`;
        c.beginPath();
        for (let k = 0; k <= 10; k++) {
          const yy = py - k * H * 0.006;
          const xx = px + Math.sin(k * 0.8 + t * 3 + p.ph) * W * 0.006;
          k ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
        }
        c.stroke();
      }
    };
  },

  sparkle({ x, y, r = 8, n = 10 }) {
    const ps = Array.from({ length: n }, () => ({ a: rand(0, 6.3), d: rand(0.2, 1), ph: rand(0, 6), s: rand(0.6, 1.2) }));
    return (c, W, H, t) => {
      for (const p of ps) {
        const k = Math.max(0, Math.sin(t * 2.5 + p.ph));
        c.fillStyle = `rgba(255,236,120,${k})`;
        star(c, (x + Math.cos(p.a) * r * p.d) / 100 * W, y / 100 * H + Math.sin(p.a) * r * p.d / 100 * W, W * 0.012 * p.s * k);
      }
    };
  },

  glow({ x, y, r = 5, color = '255,230,120', delay = 0 }) {
    return (c, W, H, t) => {
      if (t < delay) return;
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W * (1 + 0.15 * Math.sin(t * 3));
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, `rgba(${color},${Math.min(1, (t - delay) * 2) * 0.75})`);
      g.addColorStop(1, `rgba(${color},0)`);
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
    };
  },

  smoke({ x, y, n = 14, size = 4, white = false }) {
    const ps = Array.from({ length: n }, () => ({ age: rand(0, 1), dx: rand(-1, 1), v: rand(0.18, 0.3) }));
    const col = white ? '245,245,245' : '120,120,125';
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.dx = rand(-1, 1); }
        const px = (x + p.dx * 3 * p.age + Math.sin(t + p.dx * 5) * 0.6) / 100 * W;
        const py = (y - p.age * 16) / 100 * H;
        const r = (size * (0.4 + p.age)) / 100 * W;
        c.fillStyle = `rgba(${col},${0.55 * (1 - p.age)})`;
        c.beginPath(); c.arc(px, py, r, 0, 7); c.fill();
      }
    };
  },

  lava({ x, y, n = 70 }) {
    const spawn = p => Object.assign(p, { x, y, vx: rand(-9, 9), vy: rand(-48, -28), life: rand(0.9, 1.6), age: 0 });
    const ps = Array.from({ length: n }, () => { const p = spawn({}); p.age = rand(0, p.life); return p; });
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += dt;
        if (p.age > p.life) spawn(p);
        const px = (p.x + p.vx * p.age) / 100 * W;
        const py = (p.y + p.vy * p.age + 40 * p.age * p.age) / 100 * H;
        const k = 1 - p.age / p.life;
        c.fillStyle = `rgba(255,${Math.round(120 + 110 * k)},40,${0.9 * k + 0.1})`;
        c.beginPath(); c.arc(px, py, W * 0.006 * (0.6 + k), 0, 7); c.fill();
      }
    };
  },

  bubbles({ x, y, w, h, n = 20 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), age: rand(0, 1), v: rand(0.25, 0.5), r: rand(0.5, 1.1) }));
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); }
        const px = p.x / 100 * W, py = (y + h - p.age * h) / 100 * H;
        const a = Math.sin(p.age * Math.PI);
        c.fillStyle = `rgba(255,220,90,${0.8 * a})`;
        c.beginPath(); c.arc(px, py, W * 0.006 * p.r, 0, 7); c.fill();
      }
    };
  },

  // Brillos que recorren el río hacia el mar.
  river({ pts }) {
    return (c, W, H, t) => {
      const P = pts.map(([px, py]) => [px / 100 * W, py / 100 * H]);
      const seg = []; let L = 0;
      for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); L += d; }
      const at = s => {
        for (let i = 0; i < seg.length; i++) {
          if (s <= seg[i]) { const k = s / seg[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * k, P[i][1] + (P[i + 1][1] - P[i][1]) * k]; }
          s -= seg[i];
        }
        return P[P.length - 1];
      };
      const gap = W * 0.05, len = W * 0.018, off = (t * W * 0.06) % gap;
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineCap = 'round'; c.lineWidth = Math.max(2.5, W * 0.0045);
      c.beginPath();
      for (let s = off; s < L - len; s += gap) {
        const a = at(s), b = at(s + len);
        c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]);
      }
      c.stroke();
    };
  },

  // Arco iris: se pinta de izquierda a derecha (o de golpe) y, con bands, cada color brilla por turnos.
  rainbow({ x, y, r, instant = false, bands = false }) {
    return (c, W, H, t) => {
      const p = instant ? 1 : Math.min(1, t / 2.6);
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W, bw = R * 0.065;
      c.lineWidth = bw * 1.05;
      RAINBOW.forEach((col, i) => {
        const lit = bands && Math.floor(t / 0.75) % RAINBOW.length === i;
        c.globalAlpha = lit ? 1 : 0.78;
        c.strokeStyle = col;
        c.beginPath(); c.arc(cx, cy, R - i * bw, Math.PI, Math.PI + Math.PI * p); c.stroke();
      });
      c.globalAlpha = 1;
    };
  },

  // Tarjeta: un rayo blanco entra en una gota y sale separado en colores.
  prism({ x, y }) {
    return (c, W, H, t) => {
      const cx = x / 100 * W, cy = y / 100 * H, cw = W * 0.36, ch = H * 0.42;
      const k = Math.min(1, t / 0.5);
      c.globalAlpha = k;
      c.fillStyle = 'rgba(255,255,255,.93)';
      c.beginPath(); c.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, W * 0.02); c.fill();
      const dx = cx - cw * 0.05, dy = cy + ch * 0.05, dr = ch * 0.2;
      // rayo blanco con borde gris para que se vea sobre blanco
      const grow = Math.min(1, t / 1.2);
      c.lineCap = 'round';
      c.strokeStyle = '#d8d8d8'; c.lineWidth = W * 0.012;
      c.beginPath(); c.moveTo(cx - cw * 0.45, cy - ch * 0.3); c.lineTo(cx - cw * 0.45 + (dx - dr * 0.7 - cx + cw * 0.45) * grow, cy - ch * 0.3 + (dy - dr * 0.3 - cy + ch * 0.3) * grow); c.stroke();
      c.strokeStyle = '#fffbe8'; c.lineWidth = W * 0.007; c.stroke();
      // gota
      c.fillStyle = 'rgba(120,190,255,.85)';
      c.beginPath(); c.moveTo(dx, dy - dr * 1.6);
      c.bezierCurveTo(dx + dr * 1.1, dy - dr * 0.3, dx + dr, dy + dr, dx, dy + dr);
      c.bezierCurveTo(dx - dr, dy + dr, dx - dr * 1.1, dy - dr * 0.3, dx, dy - dr * 1.6); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)';
      c.beginPath(); c.ellipse(dx - dr * 0.35, dy - dr * 0.1, dr * 0.15, dr * 0.3, -0.4, 0, 7); c.fill();
      // colores que salen
      const out = Math.max(0, Math.min(1, (t - 1.2) / 1.2));
      c.lineWidth = W * 0.008;
      RAINBOW.forEach((col, i) => {
        const a = -0.35 + i * 0.14;
        c.strokeStyle = col;
        c.beginPath(); c.moveTo(dx + dr * 0.6, dy);
        c.lineTo(dx + dr * 0.6 + Math.cos(a) * cw * 0.42 * out, dy + Math.sin(a) * cw * 0.42 * out); c.stroke();
      });
      c.globalAlpha = 1;
    };
  },

  // Gotitas que brillan (de colores, o azules si blue).
  colordrops({ x, y, w, h, n = 30, blue = false }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), y: rand(y, y + h), ph: rand(0, 6), c: Math.floor(rand(0, 6)) }));
    return (c, W, H, t) => {
      for (const p of ps) {
        const k = Math.max(0, Math.sin(t * 2 + p.ph));
        c.fillStyle = blue ? `rgba(150,200,255,${0.9 * k})` : RAINBOW[(p.c + Math.floor(t * 2)) % 6];
        c.globalAlpha = blue ? 1 : k;
        const px = p.x / 100 * W, py = p.y / 100 * H, r = W * 0.007 * (0.6 + k * 0.6);
        c.beginPath(); c.moveTo(px, py - r * 1.8);
        c.quadraticCurveTo(px + r * 1.2, py + r * 0.2, px, py + r);
        c.quadraticCurveTo(px - r * 1.2, py + r * 0.2, px, py - r * 1.8); c.fill();
      }
      c.globalAlpha = 1;
    };
  },

  // Emojis que revolotean alrededor de un punto (abejas, pájaros, mariposas).
  fly({ e, x, y, rx, ry, n = 2 }) {
    const ps = Array.from({ length: n }, (_, i) => ({ ph: i * 6.28 / n, sp: rand(0.6, 0.9) }));
    return (c, W, H, t) => {
      c.font = `${Math.round(W * 0.035)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      for (const p of ps) {
        const a = t * p.sp + p.ph;
        c.fillText(e, (x + Math.cos(a) * rx) / 100 * W, (y + Math.sin(a * 2) * ry) / 100 * H + Math.sin(t * 9 + p.ph) * W * 0.003);
      }
    };
  },

  petals({ x, y, w, h, n = 14 }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), age: rand(0, 1), v: rand(0.12, 0.22), ph: rand(0, 6) }));
    return (c, W, H, t, dt) => {
      c.font = `${Math.round(W * 0.018)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); }
        c.globalAlpha = Math.sin(p.age * Math.PI);
        c.fillText('🌸', (p.x + Math.sin(t * 2 + p.ph) * 2) / 100 * W, (y + p.age * h) / 100 * H);
      }
      c.globalAlpha = 1;
    };
  },

  // Algo que cae con un botecito y se queda (la manzana).
  fall({ e, x, y, x1, y1, size = 4 }) {
    return (c, W, H, t) => {
      const T = 1.1;
      let px, py;
      if (t < T) { const k = t / T; px = x + (x1 - x) * k; py = y + (y1 - y) * k * k; }
      else { const b = Math.max(0, Math.sin((t - T) * 9) * Math.exp(-(t - T) * 5)); px = x1; py = y1 - b * 4; }
      c.globalAlpha = t < 1.5 ? 1 : Math.max(0, 1 - (t - 1.5) * 1.5); // se funde con la manzana del dibujo
      c.font = `${Math.round(W * size / 100)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      c.fillText(e, px / 100 * W, py / 100 * H);
      c.globalAlpha = 1;
    };
  },

  // Un emoji que da botecitos en su sitio (la oruga comiendo).
  bob({ e, x, y, size = 4 }) {
    return (c, W, H, t) => {
      c.globalAlpha = Math.min(1, t * 2);
      c.font = `${Math.round(W * size / 100)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      c.fillText(e, x / 100 * W, y / 100 * H - Math.abs(Math.sin(t * 5)) * H * 0.02);
      c.globalAlpha = 1;
    };
  },

  // Zetas de dormir que suben y se desvanecen.
  zzz({ x, y }) {
    return (c, W, H, t) => {
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#5B6CC8';
      for (let i = 0; i < 3; i++) {
        const k = ((t * 0.45) + i / 3) % 1;
        c.globalAlpha = Math.sin(k * Math.PI);
        c.font = `800 ${Math.round(W * (0.026 + k * 0.03))}px sans-serif`;
        c.fillText('z', (x + k * 9 + Math.sin(k * 6) * 1.5) / 100 * W, (y - k * 22) / 100 * H);
      }
      c.globalAlpha = 1;
    };
  },

  // Polvillo (harina, trigo) que flota y se desvanece.
  dust({ x, y, w, h, n = 26, color = '255,255,255' }) {
    const ps = Array.from({ length: n }, () => ({ x: rand(x, x + w), y: rand(y, y + h), age: rand(0, 1), v: rand(0.3, 0.6), r: rand(0.4, 1) }));
    return (c, W, H, t, dt) => {
      for (const p of ps) {
        p.age += p.v * dt;
        if (p.age > 1) { p.age = 0; p.x = rand(x, x + w); p.y = rand(y, y + h); }
        c.fillStyle = `rgba(${color},${0.85 * Math.sin(p.age * Math.PI)})`;
        c.beginPath(); c.arc((p.x + Math.sin(t + p.r * 9) * 1.2) / 100 * W, (p.y - p.age * 5) / 100 * H, W * 0.005 * p.r, 0, 7); c.fill();
      }
    };
  },

  // La Tierra vista de lado, girando de verdad (los continentes pasan de izquierda a derecha).
  // El sol está a la izquierda: la mitad derecha es de noche. house marca "nuestra casa";
  // moon hace girar la luna alrededor (por detrás cuando va arriba).
  earth({ x, y, r, spin = 0.3, house = false, moon = false, grow = false }) {
    return (c, W, H, t) => {
      const k = grow ? Math.min(1, t / 0.7) : 1;
      const cx = x / 100 * W, cy = y / 100 * H, R = r / 100 * W * (1 - Math.pow(1 - k, 3));
      if (R < 1) return;
      const m = t * 0.7, mx = cx + Math.cos(m) * R * 2.3, my = cy + Math.sin(m) * R * 0.55, mR = R * 0.27;
      if (moon && Math.sin(m) < 0) drawMoon(c, mx, my, mR);
      drawGlobe(c, cx, cy, R, t * spin, house);
      if (moon && Math.sin(m) >= 0) drawMoon(c, mx, my, mR);
    };
  },

  // La Tierra pequeñita dando la vuelta al sol por el camino de puntos.
  orbit({ x, y, rx, ry, r, speed = 0.5, party = false }) {
    return (c, W, H, t) => {
      const a = Math.PI / 2 - t * speed; // empieza abajo y va en sentido contrario a las agujas
      const px = (x + Math.cos(a) * rx) / 100 * W, py = (y + Math.sin(a) * ry) / 100 * H;
      drawGlobe(c, px, py, r / 100 * W, t * 2, false);
      if (party) {
        c.font = `${Math.round(W * 0.03)}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
        c.fillText('🎂', px, py - r / 100 * W * 1.9);
      }
    };
  },
};

// Manchas de tierra firme: [longitud, latitud, tamaño] (radianes / fracción del radio).
const LAND = [
  // continente 1
  [0, 0.6, 0.26], [0.3, 0.45, 0.24], [-0.15, 0.3, 0.2], [0.2, 0.15, 0.17], [0.35, -0.15, 0.18], [0.3, -0.45, 0.16],
  // continente 2
  [1.9, 0.55, 0.22], [2.3, 0.5, 0.25], [2.6, 0.3, 0.2], [2.1, 0.2, 0.16],
  // continente 3
  [3.6, 0.25, 0.22], [3.8, 0, 0.26], [3.7, -0.3, 0.2], [3.9, -0.55, 0.15],
  // islas
  [5, 0.65, 0.16], [5.3, 0.5, 0.14], [5.2, -0.4, 0.18], [5.45, -0.3, 0.12],
];

function drawGlobe(c, cx, cy, R, rot, house) {
  c.save();
  c.beginPath(); c.arc(cx, cy, R, 0, 7); c.clip();
  const g = c.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
  g.addColorStop(0, '#6CC3FF'); g.addColorStop(1, '#2477D6');
  c.fillStyle = g; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  c.fillStyle = '#5DBB4A';
  for (const [lon, lat, s] of LAND) {
    const L = lon + rot, z = Math.cos(lat) * Math.cos(L);
    if (z <= 0) continue;
    const px = cx + Math.cos(lat) * Math.sin(L) * R, py = cy - Math.sin(lat) * R;
    c.beginPath(); c.ellipse(px, py, s * 1.4 * R * Math.max(0.15, z), s * 1.4 * R * 0.8 * Math.cos(lat), 0, 0, 7); c.fill();
  }
  if (house) {
    const L = 0.4 + rot, z = Math.cos(L);
    if (z > 0) {
      const hx = cx + Math.sin(L) * R * 0.9, hy = cy - R * 0.12;
      c.fillStyle = `rgba(255,240,150,${0.55 * z})`; c.beginPath(); c.arc(hx, hy, R * 0.26 * (0.5 + z * 0.5), 0, 7); c.fill();
      c.font = `${Math.round(R * 0.42 * (0.5 + z * 0.5))}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      c.fillText('🏠', hx, hy);
    }
  }
  // noche a la derecha (el sol está a la izquierda)
  const n = c.createLinearGradient(cx - R * 0.15, 0, cx + R * 0.35, 0);
  n.addColorStop(0, 'rgba(10,15,60,0)'); n.addColorStop(1, 'rgba(10,15,60,.62)');
  c.fillStyle = n; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  c.restore();
  c.strokeStyle = 'rgba(160,215,255,.6)'; c.lineWidth = R * 0.06;
  c.beginPath(); c.arc(cx, cy, R * 1.03, 0, 7); c.stroke();
}

function drawMoon(c, x, y, r) {
  c.save();
  c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();
  c.fillStyle = '#E4E4EA'; c.fillRect(x - r, y - r, r * 2, r * 2);
  c.fillStyle = '#C9C9D2';
  for (const [dx, dy, s] of [[-0.3, -0.3, 0.22], [0.25, 0.1, 0.18], [-0.1, 0.4, 0.14]]) { c.beginPath(); c.arc(x + dx * r, y + dy * r, s * r, 0, 7); c.fill(); }
  const n = c.createLinearGradient(x - r * 0.1, 0, x + r * 0.5, 0);
  n.addColorStop(0, 'rgba(10,15,60,0)'); n.addColorStop(1, 'rgba(10,15,60,.55)');
  c.fillStyle = n; c.fillRect(x - r, y - r, r * 2, r * 2);
  c.restore();
}

// ---------- reproductor ----------
export class StoryView {
  constructor(root, story, { lang, onEnd = () => {} }) {
    this.root = root; this.story = story; this.lang = lang; this.onEnd = onEnd;
    root.innerHTML = `
      <div class="st-stage">
        <img class="st-img" alt="" draggable="false"><img class="st-img" alt="" draggable="false">
        <canvas class="st-fx"></canvas>
      </div>
      <div class="st-cap"></div>
      <div class="st-dots">${story.steps.map(() => '<i></i>').join('')}</div>
      <div class="st-hand">👆</div>`;
    this.stage = root.querySelector('.st-stage');
    this.imgs = [...root.querySelectorAll('.st-img')];
    this.cv = root.querySelector('.st-fx');
    this.ctx = this.cv.getContext('2d');
    this.cap = root.querySelector('.st-cap');
    this.dots = [...root.querySelectorAll('.st-dots i')];
    this.hand = root.querySelector('.st-hand');
    this.front = 0;
    // precarga todos los dibujos
    this.pre = [...new Set(story.steps.flatMap(s => s.swap ? [s.img, s.swap[0]] : [s.img]))].map(n => { const i = new Image(); i.src = imgOf(story, n); return i; });
    this.ro = new ResizeObserver(() => this.size());
    this.ro.observe(this.stage);
    this.onTapBound = () => this.tap();
    root.addEventListener('click', this.onTapBound);
    this.last = performance.now();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
    this.goto(0);
  }

  destroy() {
    this.dead = true;
    cancelAnimationFrame(this.raf); this.ro.disconnect();
    clearTimeout(this.handT); clearTimeout(this.lockT); clearTimeout(this.swapT);
  }

  size() {
    const r = this.stage.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    this.cv.width = Math.round(r.width * d); this.cv.height = Math.round(r.height * d);
  }

  goto(i) {
    this.i = i;
    const st = this.story.steps[i];
    this.show(st.img);
    clearTimeout(this.swapT);
    // swap: [dibujo, segundos] → a mitad del paso pasa al siguiente dibujo (la manzana ya en el suelo)
    if (st.swap) this.swapT = setTimeout(() => this.show(st.swap[0]), st.swap[1] * 1000);
    this.stage.classList.toggle('shake', !!st.shake);
    this.fx = st.fx.map(([type, o]) => FX[type](o));
    this.t0 = performance.now();
    this.dots.forEach((d, k) => d.classList.toggle('on', k <= i));
    const text = st[this.lang] ?? st.es;
    this.cap.textContent = text;
    this.cap.classList.toggle('top', (st.cap ?? this.story.cap) === 'top');
    this.cap.classList.remove('in'); void this.cap.offsetWidth; this.cap.classList.add('in');
    this.hand.classList.remove('on');
    clearTimeout(this.handT);
    this.locked = true;
    clearTimeout(this.lockT);
    this.lockT = setTimeout(() => { this.locked = false; }, 900);
    say(text, this.lang).then(() => {
      if (this.dead || this.i !== i) return;
      this.handT = setTimeout(() => this.hand.classList.add('on'), HAND_AFTER);
    });
  }

  // Cambia el dibujo con un fundido (si es distinto).
  show(n) {
    const src = imgOf(this.story, n);
    if (this.imgs[this.front].src.endsWith(src)) return;
    const back = 1 - this.front;
    this.imgs[back].src = src;
    this.imgs[back].classList.add('on'); this.imgs[this.front].classList.remove('on');
    this.front = back;
  }

  tap() {
    if (this.locked || this.done) return;
    if (this.i < this.story.steps.length - 1) { sfx.pop(this.i + 2); this.goto(this.i + 1); }
    else { this.done = true; this.hand.classList.remove('on'); this.onEnd(); }
  }

  restart() { this.done = false; this.goto(0); }

  loop(now) {
    if (this.dead) return;
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    const t = (now - this.t0) / 1000;
    const c = this.ctx, d = Math.min(2, devicePixelRatio || 1);
    const W = this.cv.width / d, H = this.cv.height / d;
    c.setTransform(d, 0, 0, d, 0, 0);
    c.clearRect(0, 0, W, H);
    if (W > 0) for (const f of this.fx) f(c, W, H, t, dt);
    this.raf = requestAnimationFrame(this.loop);
  }
}
