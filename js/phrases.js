// "Mis frases": frases del día a día para pedir cosas y decir cómo se siente.
// Cada categoría tiene una hoja de 6 dibujos (phrases/<id>-<n>.webp, n = 1..6 en el
// orden de las frases). Se escuchan, se pueden oír despacio y se practican con el micro.

export const CATS = [
  {
    id: 'comer', emoji: '🍽️', bg: '#CDEBFF',
    es: 'Comer y beber', en: 'Food and drink', de: 'Essen und Trinken',
    items: [
      { es: 'Tengo sed. ¿Me das agua, por favor?', en: 'I’m thirsty. Can I have some water, please?', de: 'Ich habe Durst. Kann ich bitte Wasser haben?' },
      { es: 'Tengo hambre.', en: 'I’m hungry.', de: 'Ich habe Hunger.' },
      { es: '¡Está muy rico!', en: 'It’s yummy!', de: 'Das schmeckt lecker!' },
      { es: 'No me gusta.', en: 'I don’t like it.', de: 'Das mag ich nicht.' },
      { es: '¿Me das más, por favor?', en: 'Can I have some more, please?', de: 'Kann ich bitte noch mehr haben?' },
      { es: 'Ya no quiero más, gracias.', en: 'I’m full, thank you.', de: 'Ich bin satt, danke.' },
    ],
  },
  {
    id: 'sentir', emoji: '💛', bg: '#FFF1B8',
    es: 'Cómo me siento', en: 'How I feel', de: 'Wie ich mich fühle',
    items: [
      { es: 'Me siento feliz.', en: 'I feel happy.', de: 'Ich bin fröhlich.' },
      { es: 'Estoy triste.', en: 'I’m sad.', de: 'Ich bin traurig.' },
      { es: 'Tengo miedo.', en: 'I’m scared.', de: 'Ich habe Angst.' },
      { es: 'Me he enfadado.', en: 'I’m angry.', de: 'Ich bin wütend.' },
      { es: 'Necesito un abrazo.', en: 'I need a hug.', de: 'Ich brauche eine Umarmung.' },
      { es: 'Te quiero mucho.', en: 'I love you very much.', de: 'Ich hab dich ganz doll lieb.' },
    ],
  },
  {
    id: 'cuerpo', emoji: '🩹', bg: '#FFD9D9',
    es: 'Mi cuerpo y ayuda', en: 'My body and help', de: 'Mein Körper und Hilfe',
    items: [
      { es: 'Tengo que ir al baño.', en: 'I need to go to the toilet.', de: 'Ich muss aufs Klo.' },
      { es: 'Me duele aquí.', en: 'It hurts here.', de: 'Hier tut es weh.' },
      { es: 'Me he hecho daño.', en: 'I hurt myself.', de: 'Ich habe mir wehgetan.' },
      { es: 'Tengo frío.', en: 'I’m cold.', de: 'Mir ist kalt.' },
      { es: 'Tengo calor.', en: 'I’m hot.', de: 'Mir ist heiß.' },
      { es: '¿Me ayudas, por favor?', en: 'Can you help me, please?', de: 'Kannst du mir bitte helfen?' },
    ],
  },
  {
    id: 'dormir', emoji: '🌙', bg: '#DCD9FF',
    es: 'A dormir', en: 'Bedtime', de: 'Schlafenszeit',
    items: [
      { es: 'Tengo sueño.', en: 'I’m sleepy.', de: 'Ich bin müde.' },
      { es: 'Quiero ir a la cama.', en: 'I want to go to bed.', de: 'Ich will ins Bett.' },
      { es: '¿Me lees un cuento?', en: 'Will you read me a story?', de: 'Liest du mir eine Geschichte vor?' },
      { es: 'Quiero mi peluche.', en: 'I want my teddy.', de: 'Ich will mein Kuscheltier.' },
      { es: 'Deja la luz encendida, por favor.', en: 'Please leave the light on.', de: 'Lass bitte das Licht an.' },
      { es: 'Buenas noches.', en: 'Good night.', de: 'Gute Nacht.' },
    ],
  },
  {
    id: 'jugar', emoji: '🧸', bg: '#D3F5D0',
    es: 'Jugar', en: 'Playing', de: 'Spielen',
    items: [
      { es: '¿Jugamos juntos?', en: 'Shall we play together?', de: 'Spielen wir zusammen?' },
      { es: '¿Puedo jugar yo también?', en: 'Can I play too?', de: 'Darf ich mitspielen?' },
      { es: 'Me toca a mí.', en: 'It’s my turn.', de: 'Ich bin dran.' },
      { es: '¡Mira lo que he hecho!', en: 'Look what I made!', de: 'Schau mal, was ich gemacht habe!' },
      { es: 'Podemos compartir.', en: 'We can share.', de: 'Wir können teilen.' },
      { es: '¿Vamos al parque?', en: 'Can we go to the park?', de: 'Gehen wir auf den Spielplatz?' },
    ],
  },
  {
    id: 'magia', emoji: '✨', bg: '#FFE0F0',
    es: 'Palabras mágicas', en: 'Magic words', de: 'Zauberwörter',
    items: [
      { es: '¡Hola! ¿Cómo estás?', en: 'Hello! How are you?', de: 'Hallo! Wie geht es dir?' },
      { es: 'Por favor.', en: 'Please.', de: 'Bitte.' },
      { es: '¡Muchas gracias!', en: 'Thank you very much!', de: 'Vielen Dank!' },
      { es: 'Lo siento.', en: 'I’m sorry.', de: 'Es tut mir leid.' },
      { es: 'De nada.', en: 'You’re welcome.', de: 'Gern geschehen.' },
      { es: '¡Hasta luego!', en: 'See you later!', de: 'Bis später!' },
    ],
  },
  {
    id: 'cole', emoji: '🏫', bg: '#FFE6C7',
    es: 'En el cole', en: 'At school', de: 'Im Kindergarten',
    items: [
      { es: '¡Buenos días, profe!', en: 'Good morning, teacher!', de: 'Guten Morgen!' },
      { es: '¿Puedo ir al baño?', en: 'Can I go to the toilet?', de: 'Darf ich aufs Klo gehen?' },
      { es: 'No lo entiendo. ¿Me lo explicas otra vez?', en: 'I don’t understand. Can you explain it again?', de: 'Das verstehe ich nicht. Kannst du es nochmal erklären?' },
      { es: '¡Para, no me gusta!', en: 'Stop, I don’t like that!', de: 'Stopp, das mag ich nicht!' },
      { es: '¡He terminado!', en: 'I’ve finished!', de: 'Ich bin fertig!' },
      { es: '¿Cuándo vienen a buscarme?', en: 'When is someone coming to pick me up?', de: 'Wann werde ich abgeholt?' },
    ],
  },
  {
    id: 'medico', emoji: '🩺', bg: '#D4F1F4',
    es: 'En el médico', en: 'At the doctor', de: 'Beim Arzt',
    items: [
      { es: 'Me duele la tripa.', en: 'My tummy hurts.', de: 'Mein Bauch tut weh.' },
      { es: 'Me duele la garganta.', en: 'My throat hurts.', de: 'Mein Hals tut weh.' },
      { es: 'Me encuentro mal.', en: 'I don’t feel well.', de: 'Mir geht es nicht gut.' },
      { es: 'Tengo un poco de miedo.', en: 'I’m a little bit scared.', de: 'Ich habe ein bisschen Angst.' },
      { es: '¿Me va a doler?', en: 'Will it hurt?', de: 'Tut das weh?' },
      { es: '¡He sido muy valiente!', en: 'I was very brave!', de: 'Ich war ganz tapfer!' },
    ],
  },
  {
    id: 'parque', emoji: '🛝', bg: '#DFF7C8',
    es: 'En el parque', en: 'At the park', de: 'Auf dem Spielplatz',
    items: [
      { es: '¡Empújame, por favor!', en: 'Push me, please!', de: 'Schubs mich bitte an!' },
      { es: '¿Puedo tirarme por el tobogán?', en: 'Can I go down the slide?', de: 'Darf ich rutschen?' },
      { es: '¡Mírame!', en: 'Watch me!', de: 'Guck mal!' },
      { es: '¿Cómo te llamas?', en: 'What’s your name?', de: 'Wie heißt du?' },
      { es: 'Cinco minutos más, por favor.', en: 'Five more minutes, please.', de: 'Noch fünf Minuten, bitte.' },
      { es: 'Quiero ir a casa.', en: 'I want to go home.', de: 'Ich will nach Hause.' },
    ],
  },
  {
    id: 'coche', emoji: '🚗', bg: '#D6E4FF',
    es: 'En el coche', en: 'In the car', de: 'Im Auto',
    items: [
      { es: '¿Cuándo llegamos?', en: 'Are we there yet?', de: 'Sind wir bald da?' },
      { es: 'Me estoy mareando.', en: 'I feel car sick.', de: 'Mir ist schlecht.' },
      { es: 'Tengo que hacer pis.', en: 'I need a wee.', de: 'Ich muss Pipi.' },
      { es: '¿Me abrochas el cinturón?', en: 'Can you buckle my seatbelt?', de: 'Kannst du mich anschnallen?' },
      { es: '¿Ponemos música?', en: 'Can we put some music on?', de: 'Machen wir Musik an?' },
      { es: '¡Mira, un camión!', en: 'Look, a truck!', de: 'Guck mal, ein Lastwagen!' },
    ],
  },
  {
    id: 'tienda', emoji: '🛒', bg: '#FFE3D1',
    es: 'En la tienda', en: 'At the shop', de: 'Im Laden',
    items: [
      { es: '¿Puedo empujar el carro?', en: 'Can I push the trolley?', de: 'Darf ich den Wagen schieben?' },
      { es: '¿Me compras esto, por favor?', en: 'Can you buy me this, please?', de: 'Kaufst du mir das bitte?' },
      { es: 'Vale, hoy no.', en: 'Okay, not today.', de: 'Okay, heute nicht.' },
      { es: '¿Puedo pagar yo?', en: 'Can I pay?', de: 'Darf ich bezahlen?' },
      { es: 'Hola, quería pan, por favor.', en: 'Hello, I’d like some bread, please.', de: 'Hallo, ich hätte gern ein Brot, bitte.' },
      { es: '¡Gracias, adiós!', en: 'Thank you, bye-bye!', de: 'Danke, tschüss!' },
    ],
  },
];

export const phraseImg = (cat, i) => `phrases/${cat.id}-${i + 1}.webp`;
