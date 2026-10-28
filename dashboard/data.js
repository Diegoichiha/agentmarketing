/* Panel SAM · datos de ejemplo. Cliente ficticio: Café Alba (tostadora de café de especialidad, Cali).
   Todo lo que se ve en la vista previa sale de este archivo. Las fechas son relativas a hoy para que el panel siempre se vea al día. */

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  inbox: '<path d="M4 13.5 6.5 5h11L20 13.5"/><path d="M4 13.5V19h16v-5.5h-5l-1 2h-4l-1-2z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="m7 15 4-5 3 3 5-7"/>',
  brand: '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="15.5" cy="10" r="1.3"/><path d="M12 21c-1.5 0-2-1.2-1.4-2.4.6-1.2 1.6-1.6 1.6-3.1"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6.5 6.5 2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  msg: '<path d="M4 5h16v11H9l-5 4z"/>',
  send: '<path d="M21 3 3 10.5l6.5 2.5L12 20z"/><path d="M9.5 13 21 3"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m3 17 5-4 4 3 3-2 6 4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M18 14.5c2.2.3 3.5 1.8 3.8 4.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  up: '<path d="m6 14 6-6 6 6"/>',
  down: '<path d="m6 10 6 6 6-6"/>',
  left: '<path d="m14 6-6 6 6 6"/>',
  right: '<path d="m10 6 6 6-6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  undo: '<path d="M9 7 4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  dots: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  telegram: '<path d="M21 3 3 10.5l6.5 2.5L12 20z"/><path d="M9.5 13 21 3"/>',
  trend: '<path d="m4 16 5-5 4 4 7-8"/><path d="M15 7h5v5"/>'
};

/* ---------- Fechas relativas a hoy ---------- */
const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const isoOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const isoOff = n => { const d = new Date(TODAY); d.setDate(d.getDate() + n); return isoOf(d); };

const CLIENT = {
  name: 'Café Alba', city: 'Cali', initials: 'CA',
  user: { name: 'Camila Rojas', first: 'Camila', role: 'Dueña' },
  agent: { name: 'Sami', role: 'Tu agente de SAM Digital' },
  plan: { name: 'Crecimiento' }
};

const CHANNELS = {
  instagram: { label: 'Instagram', color: '#D6336C', icon: 'image' },
  facebook: { label: 'Facebook', color: '#3B6FD4', icon: 'users' },
  email: { label: 'Correo', color: '#25A8B3', icon: 'mail' },
  web: { label: 'Sitio web', color: '#7A5AF8', icon: 'globe' },
  leads: { label: 'Prospectos', color: '#FEA027', icon: 'target' }
};

const STATUS = {
  borrador: { label: 'Borrador', tone: 'idle' },
  revision: { label: 'Por decidir', tone: 'warn' },
  cambios: { label: 'Cambios pedidos', tone: 'info' },
  aprobada: { label: 'Aprobada', tone: 'ok' },
  programada: { label: 'Programada', tone: 'ok' },
  publicada: { label: 'Publicada', tone: 'idle' },
  descartada: { label: 'Descartada', tone: 'idle' }
};

/* ---------- Piezas de trabajo ---------- */
const PIECES = [
  {
    id: 'p1', ch: 'instagram', kind: 'Carrusel · 5 láminas', title: 'Lanzamiento Geisha Huila', st: 'revision', off: 2, time: '09:00', urgent: true,
    why: 'Las reservas abren mañana y el lanzamiento es el jueves. Este formato guardó 2,3 veces más que un post simple en septiembre.',
    evidence: ['Las reservas abren mañana a las 9:00 a. m.', 'Los carruseles guardan 2,3x más', 'Usa las fotos que aprobaste el 14 de octubre'],
    slides: [
      { t: 'Geisha Huila', s: 'Edición limitada · 120 bolsas', tone: 'navy' },
      { t: 'Notas de jazmín y durazno', s: 'Catada por nuestro barista', tone: 'teal' },
      { t: '1.900 msnm', s: 'Finca La Esperanza, Huila', tone: 'navy' },
      { t: 'Reserva la tuya', s: 'Desde el jueves, 9:00 a. m.', tone: 'orange' },
      { t: 'Link en la bio', s: 'cafealba.co/geisha', tone: 'teal' }
    ],
    caption: 'Llegó la Geisha Huila. Solo 120 bolsas, con notas de jazmín y durazno, cultivada a 1.900 metros. Las reservas abren el jueves a las 9:00 a. m.: guarda este post para no olvidarlo. Link en la bio.',
    tags: '#cafedeespecialidad #cali #geisha #cafealba'
  },
  {
    id: 'p2', ch: 'instagram', kind: 'Reel · 30 segundos', title: 'Del grano a la taza', st: 'revision', off: 4, time: '12:30', urgent: false,
    why: 'Tus reels de proceso llegaron a un público 40 % nuevo. Este muestra el tueste del lote de Nariño.',
    evidence: ['Los reels de proceso alcanzan 40 % de cuentas nuevas', 'Usa el video del tostador del 21 de octubre'],
    reel: { hook: 'Así nace tu café', beats: ['Grano verde', 'Primer crack', 'Enfriado', 'Tu taza'], music: 'Pista sin derechos · ritmo medio' },
    caption: 'De la finca a tu taza en 30 segundos. Lote Nariño, tueste medio, notas de panela y cacao.',
    tags: '#cafedeespecialidad #tueste #nariño'
  },
  {
    id: 'p3', ch: 'email', kind: 'Newsletter', title: 'Noviembre: nuevos orígenes', st: 'revision', off: 5, time: '08:00', urgent: false,
    why: 'Tu última newsletter tuvo 46 % de aperturas, el mejor dato del año. Esta anuncia la Geisha y la suscripción mensual.',
    evidence: ['Última newsletter: 46 % de aperturas', 'Lista: 1.240 personas', 'Mejor hora: martes 8:00 a. m.'],
    email: {
      subject: 'Llegó la Geisha Huila (y una forma de no quedarte sin café)',
      pre: 'Solo 120 bolsas. Reserva desde el jueves.',
      hero: 'Geisha Huila',
      heroSub: 'Jazmín, durazno y una taza que no se repite.',
      blocks: ['Tres cafés nuevos este mes: Geisha Huila, Nariño y un descafeinado que sí sabe a café.', 'Estrenamos la suscripción mensual: recibe tu café fresco en casa y ahorra 12 %.'],
      cta: 'Reservar mi bolsa'
    }
  },
  {
    id: 'p4', ch: 'web', kind: 'Página nueva', title: 'Suscripción mensual', st: 'revision', off: 3, time: '10:00', urgent: false,
    why: 'Tres clientes preguntaron esta semana si podían recibir café cada mes. La página explica el plan y recoge los datos.',
    evidence: ['3 preguntas por mensaje directo esta semana', 'La búsqueda "suscripción café cali" no tiene competencia local'],
    web: {
      url: 'cafealba.co/suscripcion',
      before: ['Esta página no existe todavía.'],
      after: ['Tu café, fresco cada mes', 'Elige tu tueste, tu molienda y cada cuánto lo recibes.', 'Plan 1 bolsa · $42.000', 'Plan 2 bolsas · $78.000', 'Envío gratis en Cali']
    }
  },
  {
    id: 'p5', ch: 'leads', kind: 'Lista de prospectos', title: '10 cafeterías y restaurantes en Cali', st: 'revision', off: null, time: '', urgent: false,
    why: 'Buscan proveedor de café de especialidad y están en tu zona de entrega. Ordenados por qué tan bien encajan contigo.',
    evidence: ['Ubicación: a menos de 5 km de tu tostadora', 'Venden café de especialidad o brunch', 'Aún no hay contacto: el agente solo propone, no escribe'],
    leads: [
      { n: 'Casa Tertulia', k: 'Cafetería · Granada', fit: 92 }, { n: 'Brunch del Parque', k: 'Restaurante · San Antonio', fit: 88 },
      { n: 'Panadería La Ceiba', k: 'Panadería · Ciudad Jardín', fit: 81 }, { n: 'Hotel Boutique Aurora', k: 'Hotel · Centenario', fit: 77 },
      { n: 'Estudio Cowork 51', k: 'Cowork · Versalles', fit: 70 }
    ]
  },
  { id: 'p6', ch: 'instagram', kind: 'Historia', title: 'Detrás de la barra', st: 'programada', off: 1, time: '09:00', slides: [{ t: 'Detrás de la barra', s: 'Hoy: Julián prepara el filtrado', tone: 'teal' }], caption: 'Un día en la barra de Café Alba.' },
  { id: 'p7', ch: 'facebook', kind: 'Publicación', title: 'Origen: Nariño', st: 'programada', off: 3, time: '11:00', slides: [{ t: 'Nariño', s: 'Panela, cacao y una acidez suave', tone: 'orange' }], caption: 'Nuestro lote de Nariño llegó a la tostadora esta semana.' },
  { id: 'p8', ch: 'instagram', kind: 'Post', title: 'Cómo moler en casa', st: 'programada', off: 6, time: '09:00', slides: [{ t: '3 claves de molienda', s: 'Gruesa, media o fina: ¿cuál es tu método?', tone: 'navy' }], caption: 'La molienda cambia todo. Guarda este post.' },
  { id: 'p9', ch: 'email', kind: 'Correo automático', title: 'Bienvenida a suscriptores', st: 'programada', off: 9, time: '08:00', email: { subject: 'Bienvenido a Café Alba', pre: 'Así preparamos tu primer pedido', hero: 'Bienvenido', heroSub: 'Tu primer café va en camino.', blocks: ['Gracias por suscribirte. Tu primera bolsa sale el lunes.'], cta: 'Ver mi pedido' } },
  { id: 'p10', ch: 'instagram', kind: 'Carrusel · 5 láminas', title: '5 métodos de preparación', st: 'publicada', off: -2, time: '09:00', slides: [{ t: '5 métodos', s: 'V60, prensa, moka, aeropress, espresso', tone: 'teal' }], caption: '', metrics: { reach: 3420, likes: 318, saves: 142 } },
  { id: 'p11', ch: 'facebook', kind: 'Publicación', title: 'Horario del puente festivo', st: 'publicada', off: -5, time: '10:00', slides: [{ t: 'Abrimos el puente', s: 'Lunes festivo, 8 a. m. a 4 p. m.', tone: 'navy' }], caption: '', metrics: { reach: 1180, likes: 64, saves: 9 } },
  { id: 'p12', ch: 'instagram', kind: 'Reel · 20 segundos', title: 'Latte art en cámara lenta', st: 'publicada', off: -9, time: '12:00', slides: [{ t: 'Latte art', s: 'Un corazón en 20 segundos', tone: 'orange' }], caption: '', metrics: { reach: 5870, likes: 604, saves: 233 } },
  { id: 'p13', ch: 'web', kind: 'Entrada de blog', title: 'Guía del café de especialidad', st: 'publicada', off: -12, time: '10:00', web: { url: 'cafealba.co/blog/guia', before: [], after: ['Guía del café de especialidad'] }, metrics: { reach: 910, likes: 0, saves: 0 } },
  { id: 'p14', ch: 'instagram', kind: 'Post', title: 'Domingo de cata', st: 'borrador', off: 8, time: '10:00', slides: [{ t: 'Domingo de cata', s: 'Sami está preparando las ideas', tone: 'teal' }], caption: '' }
];

/* ---------- Resultados ---------- */
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function series(days, seed, base, amp, trend) {
  const r = rng(seed);
  return Array.from({ length: days }, (_, i) => Math.max(1, Math.round(base * (1 + trend * i / days) * (1 + (r() - 0.5) * amp) * (1 + Math.sin(i / 2.4) * amp * 0.6))));
}
const labelsFor = n => Array.from({ length: n }, (_, i) => { const d = new Date(TODAY); d.setDate(d.getDate() - (n - 1 - i)); return d; });
const PERIODS = {
  7: { label: '7 días', reach: series(7, 11, 640, 0.22, 0.22), inter: series(7, 21, 58, 0.3, 0.3), kpi: { reach: 18, inter: 24, visits: 9, leads: 33 }, leads: 11 },
  30: { label: '30 días', reach: series(30, 12, 600, 0.25, 0.28), inter: series(30, 22, 52, 0.32, 0.34), kpi: { reach: 27, inter: 31, visits: 14, leads: 22 }, leads: 38 },
  90: { label: '90 días', reach: series(90, 13, 520, 0.28, 0.45), inter: series(90, 23, 44, 0.34, 0.5), kpi: { reach: 52, inter: 61, visits: 33, leads: 41 }, leads: 96 }
};
Object.values(PERIODS).forEach(p => { p.dates = labelsFor(p.reach.length); p.visits = p.reach.map(v => Math.round(v * 0.07)); });

const CHANNEL_SPLIT = [['instagram', 58], ['facebook', 18], ['email', 14], ['web', 10]];

const INSIGHTS = [
  { icon: 'trend', t: 'Los carruseles guardan 2,3 veces más que un post simple', d: 'En los últimos 30 días, 4 de tus 5 piezas más guardadas fueron carruseles.', cta: 'Preparar 2 carruseles más', ask: 'Prepara dos carruseles más sobre orígenes de café' },
  { icon: 'clock', t: 'Publicar a las 9:00 a. m. rinde mejor que a las 6:00 p. m.', d: 'El alcance medio de las publicaciones de la mañana fue 31 % mayor.', cta: 'Mover mis horarios a la mañana', ask: 'Programa mis próximas publicaciones a las 9:00 a. m.' },
  { icon: 'search', t: 'Subiste del puesto 14 al 8 en "café de especialidad cali"', d: 'La guía del blog está trayendo visitas nuevas todas las semanas.', cta: 'Escribir otra guía', ask: 'Escribe una guía sobre métodos de preparación para el blog' }
];
const KEYWORDS = [
  { k: 'café de especialidad cali', pos: 8, was: 14, vol: 720 },
  { k: 'tostadora de café en cali', pos: 5, was: 6, vol: 390 },
  { k: 'comprar café en grano cali', pos: 11, was: 19, vol: 260 },
  { k: 'suscripción de café colombia', pos: 23, was: 31, vol: 880 },
  { k: 'geisha huila café', pos: 12, was: 12, vol: 140 }
];
const FUNNEL = [['Nuevos', 38], ['Contactados', 21], ['Reunión', 9], ['Ganados', 4]];

/* ---------- Marca y memoria ---------- */
const BRAND = {
  colors: [['Café', '#3B2A20'], ['Miel', '#D9A441'], ['Crema', '#F4EDE4'], ['Verde hoja', '#1F6F5C']],
  fonts: [['Títulos', 'Fraunces', 'Con carácter, para frases cortas'], ['Texto', 'Inter', 'Limpia, para leer en el celular']],
  voice: ['Cercano, curioso, sin tecnicismos', 'Tutea siempre al cliente', 'Cuenta de dónde viene el café'],
  dos: ['Hablar de origen, finca y proceso', 'Frases cortas con una sola idea', 'Invitar a guardar o reservar'],
  donts: ['Usar "usted" o tono formal', 'Prometer descuentos que no existen', 'Palabras como "barato" o "oferta"']
};
const MEMORY = [
  { id: 'm1', t: 'En Instagram hablar de tú, sin "usted"', src: 'Rechazaste un post el 12 de octubre', st: 'confirmada', when: 'hace 16 días' },
  { id: 'm2', t: 'Los carruseles de origen funcionan mejor con 5 láminas', src: 'Resultados de septiembre', st: 'por-revisar', when: 'hace 3 días' },
  { id: 'm3', t: 'No publicar los domingos después de las 6:00 p. m.', src: 'Lo indicaste tú', st: 'confirmada', when: 'hace 1 mes' },
  { id: 'm4', t: 'Escribir "cafealba.co" sin https', src: 'Corregiste un correo el 3 de octubre', st: 'confirmada', when: 'hace 25 días' },
  { id: 'm5', t: 'Evitar la palabra "oferta": prefieres "edición limitada"', src: 'Aprobaste el post de la Geisha con ese cambio', st: 'por-revisar', when: 'ayer' },
  { id: 'm6', t: 'Las historias con la cara de Julián tienen más respuestas', src: 'Resultados de octubre', st: 'por-revisar', when: 'hace 5 días' }
];

/* ---------- Agente ---------- */
const ACTIVITY = [
  { when: 'ahora', t: 'Preparando 3 ideas para el domingo de cata', live: true },
  { when: 'hace 12 min', t: 'Redactó el carrusel "Lanzamiento Geisha Huila" y lo dejó en Aprobaciones', icon: 'image' },
  { when: 'hace 1 h', t: 'Revisó Search Console: subiste 6 puestos en "café de especialidad cali"', icon: 'search' },
  { when: 'hace 2 h', t: 'Ordenó el buzón: 3 respuestas listas como borrador, ninguna enviada', icon: 'mail' },
  { when: 'ayer', t: 'Resumió tu reunión con el proveedor de Huila y creó 3 tareas', icon: 'video' },
  { when: 'ayer', t: 'Guardó una lección nueva en la memoria: evitar la palabra "oferta"', icon: 'book' }
];
const LIVE_STATES = ['Preparando 3 ideas para el domingo de cata', 'Leyendo los comentarios de tus últimas publicaciones', 'Armando el calendario de la próxima semana', 'Revisando qué palabras buscan tus clientes en Google'];
const MEETINGS = [
  { id: 'r1', t: 'Proveedor de Huila', d: 'Hace 1 día · 34 min', sum: ['Confirmaron 120 bolsas de Geisha para el 30.', 'El envío llega el miércoles en la tarde.', 'Acordaron una cata conjunta en diciembre.'], tasks: ['Confirmar la dirección de entrega', 'Enviar las fotos del empaque', 'Fijar la fecha de la cata'] },
  { id: 'r2', t: 'Revisión de la carta de temporada', d: 'Hace 6 días · 22 min', sum: ['Entra un descafeinado en la carta de noviembre.', 'Se retira el lote de Cauca.'], tasks: ['Actualizar la carta del sitio web'] },
  { id: 'r3', t: 'Llamada con Casa Tertulia', d: 'Hace 11 días · 18 min', sum: ['Quieren probar 5 kg al mes.', 'Piden factura electrónica.'], tasks: ['Enviar propuesta de precios', 'Pedir datos de facturación'] }
];
const SUGGESTED = ['¿Qué publicamos esta semana?', 'Resume mis resultados', 'Prepara el newsletter de diciembre'];

/* ---------- Ajustes ---------- */
const CONNECTIONS = [
  { id: 'ig', name: 'Instagram', sub: '@cafealba.co', icon: 'image', on: true },
  { id: 'fb', name: 'Facebook', sub: 'Página Café Alba', icon: 'users', on: true },
  { id: 'web', name: 'Sitio web', sub: 'cafealba.co', icon: 'globe', on: true },
  { id: 'mail', name: 'Correo del agente', sub: 'sami@cafealba.co', icon: 'mail', on: true },
  { id: 'cal', name: 'Google Calendar', sub: 'Camila Rojas', icon: 'calendar', on: true },
  { id: 'gsc', name: 'Search Console', sub: 'cafealba.co', icon: 'search', on: true },
  { id: 'tg', name: 'Telegram', sub: '@CafeAlba_bot', icon: 'send', on: true },
  { id: 'meet', name: 'Reuniones de Meet', sub: 'Sin conectar', icon: 'video', on: false },
  { id: 'ads', name: 'Anuncios pagados', sub: 'Próximamente', icon: 'target', on: false, soon: true }
];
const AUTONOMY = [
  { id: 'post', t: 'Publicar en redes', d: 'Posts, reels e historias', def: 'aprobar' },
  { id: 'mail', t: 'Enviar correos', d: 'Respuestas y newsletters', def: 'aprobar' },
  { id: 'web', t: 'Cambios en el sitio web', d: 'Textos, páginas y blog', def: 'aprobar' },
  { id: 'meet', t: 'Entrar a reuniones', d: 'Con aviso a los asistentes', def: 'avisar' },
  { id: 'ads', t: 'Gastar en anuncios', d: 'Siempre pide aprobación', def: 'aprobar', locked: true }
];
const AUTONOMY_LEVELS = [['aprobar', 'Pedirme aprobación'], ['avisar', 'Hacerlo y avisarme'], ['libre', 'Hacerlo sin avisar']];
const USAGE = [['Piezas de redes', 18, 24], ['Publicaciones programadas', 7, 20], ['Horas de reuniones resumidas', 3, 6]];
const NOTIFS = [['tg', 'Avisarme por Telegram cuando haya algo por decidir', true], ['mail', 'Resumen diario por correo a las 8:00 a. m.', true], ['urgent', 'Avisos urgentes en el celular', false]];

/* ---------- Respuestas simuladas del agente ---------- */
const REPLIES = [
  { re: /(post|public|instagram|reel|carrusel|historia)/i, t: 'Listo. Preparo tres opciones con tu tono cercano y las fotos que ya aprobaste. Las dejo en Aprobaciones en unos minutos y te aviso también por Telegram.', go: ['aprobaciones', 'Ir a Aprobaciones'] },
  { re: /(newsletter|correo|email|boletin|boletín)/i, t: 'Perfecto. Reviso tu última newsletter, que tuvo 46 % de aperturas, y preparo un borrador con el mismo orden. No envío nada hasta que lo apruebes.', go: ['aprobaciones', 'Ver borradores'] },
  { re: /(resultado|alcance|métrica|metrica|cómo vamos|como vamos)/i, t: 'En los últimos 30 días tu alcance subió 27 % y las interacciones 31 %. Lo que mejor funcionó fueron los carruseles de origen. ¿Te muestro el detalle?', go: ['resultados', 'Ver resultados'] },
  { re: /(calendario|semana|agenda|programa)/i, t: 'Esta semana tienes 4 piezas programadas y 5 esperando tu decisión. El jueves queda libre: puedo llenarlo con la historia de la Geisha.', go: ['calendario', 'Ver calendario'] },
  { re: /(marca|memoria|aprend|tono)/i, t: 'Aprendí 6 cosas de tus decisiones. Tres están por revisar: confírmalas o pídeme que las olvide.', go: ['marca', 'Revisar memoria'] }
];
const REPLY_DEFAULT = 'Entendido. Lo anoto y te cuento en unos minutos qué propongo. Nada sale al público sin tu aprobación.';
