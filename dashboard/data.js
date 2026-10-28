/* Panel SAM · datos de ejemplo. Cliente: Tapetes y Pisos del Pacífico (Cali).
   La marca, los productos, los servicios y el perfil de Instagram salen de su sitio y su cuenta públicos.
   Las publicaciones nuevas y todas las cifras de resultados son ejemplos inventados para esta vista previa.
   Las fechas son relativas a hoy para que el panel siempre se vea al día. */

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
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10z"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  up: '<path d="m6 14 6-6 6 6"/>',
  down: '<path d="m6 10 6 6 6-6"/>',
  left: '<path d="m14 6-6 6 6 6"/>',
  right: '<path d="m10 6 6 6-6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  undo: '<path d="M9 7 4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>',
  dots: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  trend: '<path d="m4 16 5-5 4 4 7-8"/><path d="M15 7h5v5"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l9-11h-6.5z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  rug: '<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M6 9.5h12M6 14.5h12M3 10v4M21 10v4"/>',
  blinds: '<path d="M4 4h16M5 8h14M6 12h12M7 16h10"/><path d="M12 16v4"/>',
  ruler: '<path d="m3 17 14-14 4 4L7 21z"/><path d="m8 12 2 2M11 9l2 2M14 6l2 2"/>',
  leaf: '<path d="M5 20c0-9 5-14 14-15 0 9-5 14-14 15z"/><path d="M5 20 13 12"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a2 2 0 0 0 2 4M16 6h3a2 2 0 0 1-2 4M12 13v4M9 20h6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  drag: '<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>'
};

/* ---------- Fechas relativas a hoy ---------- */
const TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const isoOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const isoOff = n => { const d = new Date(TODAY); d.setDate(d.getDate() + n); return isoOf(d); };

const CLIENT = {
  name: 'Tapetes y Pisos del Pacífico', short: 'Tapetes y Pisos', city: 'Cali', initials: 'TP', handle: 'tapetes_y_pisos', site: 'tapetesypisos.com.co',
  user: { name: 'Equipo Tapetes y Pisos', first: 'equipo', initials: 'TP' },
  agent: { name: 'Sami', role: 'Tu agente de SAM Digital' },
  plan: { name: 'Crecimiento' }
};

const CHANNELS = {
  instagram: { label: 'Instagram', color: '#D6336C', icon: 'image' },
  facebook: { label: 'Facebook', color: '#3B6FD4', icon: 'users' },
  email: { label: 'Correo', color: '#25A8B3', icon: 'mail' },
  web: { label: 'Sitio web', color: '#7A5AF8', icon: 'globe' },
  leads: { label: 'Prospectos', color: '#F27424', icon: 'target' }
};

/* Temas que ya publica el cliente (coinciden con las historias destacadas de su Instagram) */
const PILLARS = [
  { id: 'vinilo', label: 'Pisos de vinilo', icon: 'layers', last: 3 },
  { id: 'alfombras', label: 'Alfombras', icon: 'rug', last: 1 },
  { id: 'persianas', label: 'Persianas', icon: 'blinds', last: 5 },
  { id: 'terminados', label: 'Terminados', icon: 'ruler', last: 21 },
  { id: 'grama', label: 'Grama sintética', icon: 'leaf', last: 16 },
  { id: 'casos', label: 'Casos de éxito', icon: 'trophy', last: 9 },
  { id: 'blog', label: 'Blog', icon: 'book', last: 30 }
];
const IG = { handle: 'tapetes_y_pisos', followers: 415, formats: [['layers', 'Carruseles', 9], ['play', 'Reels', 2], ['image', 'Fotos', 1]], cadence: 'cada 2 días' };

const STATUS = {
  borrador: { label: 'Borrador', tone: 'idle', icon: 'edit' },
  revision: { label: 'Por decidir', tone: 'warn', icon: 'inbox' },
  cambios: { label: 'Cambios', tone: 'info', icon: 'edit' },
  aprobada: { label: 'Aprobada', tone: 'ok', icon: 'check' },
  programada: { label: 'Programada', tone: 'ok', icon: 'calendar' },
  publicada: { label: 'Publicada', tone: 'idle', icon: 'send' },
  descartada: { label: 'Descartada', tone: 'idle', icon: 'x' }
};

/* ---------- Piezas de trabajo ---------- */
const PIECES = [
  {
    id: 'p1', ch: 'instagram', pil: 'vinilo', kind: 'Carrusel · 5 láminas', title: 'Pisos de vinilo: 5 ventajas', st: 'revision', off: 1, time: '09:00', urgent: true,
    why: 'Publicas cada 2 días y mañana te toca. Los carruseles son tu formato más usado y los pisos de vinilo tienen historia destacada.',
    facts: [['clock', 'Toca publicar mañana'], ['layers', '9 de 12 son carruseles'], ['bookmark', 'Historia destacada: vinilo']],
    slides: [
      { t: 'Pisos de vinilo', s: 'Para tu hogar u oficina', tone: 'brown' },
      { t: 'Resisten el agua', s: 'Y se limpian fácil', tone: 'orange' },
      { t: 'Instalación rápida', s: 'Tu espacio listo en poco tiempo', tone: 'cream' },
      { t: '+30 años', s: 'De experiencia en Cali', tone: 'brown' },
      { t: 'Cotiza hoy', s: 'Escríbenos por WhatsApp', tone: 'orange' }
    ],
    caption: 'Pisos de vinilo para tu hogar u oficina: resistentes, fáciles de limpiar y de instalar. Más de 30 años transformando espacios en Cali. Escríbenos y cotiza.',
    tags: '#pisosdevinilo #cali #decoracion #tapetesypisos'
  },
  {
    id: 'p2', ch: 'instagram', pil: 'alfombras', kind: 'Reel · 30 segundos', title: 'Instalación de alfombra en 30 s', st: 'revision', off: 3, time: '12:30', urgent: false,
    why: 'Los videos de proceso muestran el trabajo real y llevan gente nueva a tu perfil. Este recorre una instalación completa.',
    facts: [['play', 'Reel de proceso'], ['users', 'Llega a gente nueva'], ['rug', 'Alfombras: el tema más pedido']],
    reel: { hook: 'Así se instala una alfombra', beats: ['Medición', 'Corte', 'Instalación', 'Resultado'], music: 'Pista sin derechos' },
    caption: 'De la medición al resultado final en 30 segundos. Instalamos alfombras en hogares y oficinas de Cali.',
    tags: '#alfombras #instalacion #cali'
  },
  {
    id: 'p3', ch: 'email', pil: 'blog', kind: 'Newsletter', title: 'Renueva tus espacios antes de diciembre', st: 'revision', off: 5, time: '08:00', urgent: false,
    why: 'Diciembre es temporada de renovar. El correo reúne alfombras, pisos y persianas, y lleva a cotizar.',
    facts: [['calendar', 'Temporada de renovación'], ['mail', 'Una sola llamada a la acción'], ['clock', 'Martes 8:00 a. m.']],
    email: {
      subject: 'Renueva tus espacios antes de diciembre', pre: 'Alfombras, pisos y persianas, con instalación', hero: 'Renueva tus espacios', heroSub: 'Calidad y diseño, con más de 30 años de experiencia',
      blocks: ['Tenemos alfombras, pisos de vinilo y persianas, y nos encargamos de la instalación.', 'Cuéntanos qué espacio quieres transformar y te ayudamos a elegir.'], cta: 'Cotizar ahora'
    }
  },
  {
    id: 'p4', ch: 'web', pil: 'terminados', kind: 'Página nueva', title: 'Lavado y cristalizado de pisos', st: 'revision', off: 2, time: '10:00', urgent: false,
    why: 'Es uno de tus servicios y hoy no tiene página propia. Ayuda a que te encuentren en Google.',
    facts: [['search', 'Sin página propia hoy'], ['ruler', 'Terminados: 3 semanas sin tema'], ['globe', 'Suma al sitio']],
    web: { url: 'tapetesypisos.com.co/servicios/pisos', before: ['Esta página no existe todavía.'], after: ['Lavado y cristalizado de pisos', 'Devuelve el brillo a tu mármol y granito.', 'Servicio en Cali', 'Cotiza por WhatsApp'] }
  },
  {
    id: 'p5', ch: 'leads', pil: 'casos', kind: 'Lista de prospectos', title: 'Arquitectos y constructoras en Cali', st: 'revision', off: null, time: '', urgent: false,
    why: 'Compran pisos y alfombras para sus proyectos y están en tu zona. Ordenados por cuánto encajan contigo.',
    facts: [['target', '10 prospectos cerca'], ['users', 'Compran por proyecto'], ['shield', 'Sami no les escribe sin ti']],
    leads: [
      { n: 'Estudio de arquitectura', k: 'Granada', fit: 92 }, { n: 'Constructora de vivienda', k: 'Ciudad Jardín', fit: 88 },
      { n: 'Clínica odontológica', k: 'San Fernando', fit: 81 }, { n: 'Oficinas corporativas', k: 'Versalles', fit: 77 }, { n: 'Hotel boutique', k: 'Centenario', fit: 70 }
    ]
  },
  { id: 'p6', ch: 'instagram', pil: 'persianas', kind: 'Historia', title: 'Mantenimiento de persianas', st: 'programada', off: 0, time: '16:00', slides: [{ t: 'Persianas como nuevas', s: 'Mantenimiento y reparación', tone: 'cream' }], caption: 'Mantenimiento y reparación de persianas.' },
  { id: 'p7', ch: 'facebook', pil: 'vinilo', kind: 'Publicación', title: 'Marcas con las que trabajamos', st: 'programada', off: 2, time: '11:00', slides: [{ t: 'Marcas aliadas', s: 'Tarkett, Mapei, LG y más', tone: 'brown' }], caption: 'Trabajamos con marcas reconocidas para cuidar la calidad de tus espacios.' },
  { id: 'p8', ch: 'instagram', pil: 'grama', kind: 'Post', title: 'Grama sintética para terrazas', st: 'programada', off: 4, time: '09:00', slides: [{ t: 'Grama sintética', s: 'Verde todo el año, sin mantenimiento', tone: 'orange' }], caption: 'Terrazas verdes todo el año.' },
  { id: 'p9', ch: 'email', pil: 'blog', kind: 'Correo automático', title: 'Confirmación de cotización', st: 'programada', off: 7, time: '08:00', email: { subject: 'Recibimos tu solicitud', pre: 'Te contactamos muy pronto', hero: 'Gracias por escribirnos', heroSub: 'Un asesor te contactará pronto.', blocks: ['Mientras tanto, mira nuestros trabajos en Instagram.'], cta: 'Ver portafolio' } },
  { id: 'p10', ch: 'instagram', pil: 'alfombras', kind: 'Carrusel · 5 láminas', title: 'Alfombras: cómo elegir', st: 'publicada', off: -1, time: '09:00', slides: [{ t: 'Cómo elegir tu alfombra', s: 'Tamaño, material y color', tone: 'orange' }], caption: '', metrics: { reach: 612, likes: 41, saves: 18 } },
  { id: 'p11', ch: 'instagram', pil: 'vinilo', kind: 'Reel', title: 'Pisos para cocinas', st: 'publicada', off: -3, time: '12:00', slides: [{ t: 'Pisos para cocinas', s: 'Resistentes y fáciles de limpiar', tone: 'brown' }], caption: '', metrics: { reach: 980, likes: 63, saves: 22 } },
  { id: 'p12', ch: 'instagram', pil: 'persianas', kind: 'Foto', title: 'Cortinas y puertas corredizas', st: 'publicada', off: -5, time: '10:00', slides: [{ t: 'Cortinas a medida', s: 'Para puertas y ventanas', tone: 'cream' }], caption: '', metrics: { reach: 455, likes: 37, saves: 9 } },
  { id: 'p13', ch: 'instagram', pil: 'vinilo', kind: 'Carrusel · 5 láminas', title: 'Cuidado de pisos de vinilo', st: 'publicada', off: -7, time: '09:00', slides: [{ t: 'Cuida tu piso', s: 'Cinco consejos', tone: 'orange' }], caption: '', metrics: { reach: 701, likes: 52, saves: 31 } },
  { id: 'p14', ch: 'instagram', pil: 'casos', kind: 'Reel', title: 'Caso de éxito: oficina nueva', st: 'publicada', off: -9, time: '12:00', slides: [{ t: 'Caso de éxito', s: 'Oficina transformada', tone: 'brown' }], caption: '', metrics: { reach: 1340, likes: 88, saves: 40 } },
  { id: 'p15', ch: 'facebook', pil: 'alfombras', kind: 'Publicación', title: 'Horario de la semana', st: 'publicada', off: -11, time: '10:00', slides: [{ t: 'Estamos abiertos', s: 'Lunes a viernes', tone: 'cream' }], caption: '', metrics: { reach: 320, likes: 14, saves: 3 } },
  { id: 'p16', ch: 'instagram', pil: 'grama', kind: 'Borrador', title: 'Ideas para el fin de semana', st: 'borrador', off: 6, time: '10:00', slides: [{ t: 'Sami está preparando ideas', s: 'Llegan pronto', tone: 'cream' }], caption: '' }
];

/* ---------- Resultados (cifras de ejemplo, a escala de una cuenta de 415 seguidores) ---------- */
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function series(days, seed, base, amp, trend) {
  const r = rng(seed);
  return Array.from({ length: days }, (_, i) => Math.max(1, Math.round(base * (1 + trend * i / days) * (1 + (r() - 0.5) * amp) * (1 + Math.sin(i / 2.4) * amp * 0.6))));
}
const labelsFor = n => Array.from({ length: n }, (_, i) => { const d = new Date(TODAY); d.setDate(d.getDate() - (n - 1 - i)); return d; });
const PERIODS = {
  7: { label: '7 días', reach: series(7, 11, 230, 0.22, 0.22), inter: series(7, 21, 19, 0.3, 0.3), kpi: { reach: 18, inter: 24, visits: 9, leads: 33 }, leads: 6 },
  30: { label: '30 días', reach: series(30, 12, 210, 0.25, 0.28), inter: series(30, 22, 17, 0.32, 0.34), kpi: { reach: 27, inter: 31, visits: 14, leads: 22 }, leads: 21 },
  90: { label: '90 días', reach: series(90, 13, 180, 0.28, 0.45), inter: series(90, 23, 14, 0.34, 0.5), kpi: { reach: 52, inter: 61, visits: 33, leads: 41 }, leads: 58 }
};
Object.values(PERIODS).forEach(p => { p.dates = labelsFor(p.reach.length); p.visits = p.reach.map(v => Math.round(v * 0.06)); });

const CHANNEL_SPLIT = [['instagram', 62], ['facebook', 16], ['email', 12], ['web', 10]];
const INSIGHTS = [
  { icon: 'layers', big: '2,3×', t: 'Los carruseles guardan más', ask: 'Prepara dos carruseles más sobre pisos de vinilo' },
  { icon: 'clock', big: '9:00', t: 'Tu mejor hora para publicar', ask: 'Programa mis próximas publicaciones a las 9:00 a. m.' },
  { icon: 'search', big: '#8', t: 'En Google: pisos de vinilo cali', ask: 'Escribe una guía para el blog sobre cómo elegir pisos de vinilo' }
];
const KEYWORDS = [
  { k: 'pisos de vinilo cali', pos: 8, was: 14, vol: 590 },
  { k: 'alfombras cali', pos: 6, was: 7, vol: 480 },
  { k: 'instalación de pisos cali', pos: 11, was: 19, vol: 210 },
  { k: 'persianas cali', pos: 15, was: 22, vol: 390 },
  { k: 'grama sintética cali', pos: 9, was: 9, vol: 320 }
];
const FUNNEL = [['users', 'Nuevos', 21], ['msg', 'Contactados', 12], ['video', 'Reunión', 5], ['trophy', 'Ganados', 2]];

/* ---------- Marca y memoria ---------- */
const BRAND = {
  colors: [['Naranja', '#F27424'], ['Marrón', '#1E1411'], ['Crema', '#FFF5EA'], ['Amarillo', '#FEC42D']],
  fonts: [['Títulos', 'Poppins'], ['Texto', 'DM Sans'], ['Acentos', 'Playfair Display']],
  voice: [['heart', 'Cálido'], ['shield', 'Profesional'], ['spark', 'Aspiracional']],
  dos: [['image', 'Antes y después'], ['trophy', '+30 años de experiencia'], ['msg', 'Invitar a cotizar']],
  donts: [['lock', 'Prometer precios sin cotizar'], ['x', 'Tono frío o genérico'], ['info', 'Jerga técnica sin explicar']],
  tag: 'Transformamos tus espacios con calidad y diseño'
};
const MEMORY = [
  { id: 'm1', icon: 'image', t: 'Mostrar el antes y después', src: ['check', 'Tu aprobación'], st: 'por-revisar' },
  { id: 'm2', icon: 'trophy', t: 'Decir "más de 30 años de experiencia"', src: ['edit', 'Lo dijiste tú'], st: 'confirmada' },
  { id: 'm3', icon: 'lock', t: 'No publicar precios: invitar a cotizar', src: ['edit', 'Lo dijiste tú'], st: 'confirmada' },
  { id: 'm4', icon: 'clock', t: 'Publicar a las 9:00 a. m.', src: ['chart', 'Resultados'], st: 'por-revisar' },
  { id: 'm5', icon: 'layers', t: 'Carruseles de 5 láminas', src: ['chart', 'Resultados'], st: 'por-revisar' },
  { id: 'm6', icon: 'msg', t: 'Cerrar con "Cotiza por WhatsApp"', src: ['check', 'Tu aprobación'], st: 'confirmada' }
];

/* ---------- Agente ---------- */
const ACTIVITY = [
  { when: 'ahora', t: 'Preparando ideas', live: true },
  { when: 'hace 12 min', t: 'Carrusel de vinilo listo', icon: 'image' },
  { when: 'hace 1 h', t: 'Subiste 6 puestos en Google', icon: 'search' },
  { when: 'hace 2 h', t: '3 respuestas listas', icon: 'mail' },
  { when: 'ayer', t: 'Reunión resumida · 3 tareas', icon: 'video' },
  { when: 'ayer', t: 'Aprendió: mostrar el antes y después', icon: 'book' }
];
const LIVE_STATES = ['Preparando ideas', 'Leyendo comentarios', 'Armando el calendario', 'Revisando Google'];
const MEETINGS = [
  { id: 'r1', t: 'Constructora en Cali', d: 'Hace 1 día · 34 min', sum: [['ruler', 'Piden cotizar vinilo'], ['calendar', 'Entrega en noviembre']], tasks: ['Enviar la cotización', 'Agendar visita técnica'] },
  { id: 'r2', t: 'Catálogo de persianas', d: 'Hace 6 días · 22 min', sum: [['blinds', 'Entran 2 colecciones nuevas']], tasks: ['Actualizar el sitio'] },
  { id: 'r3', t: 'Proveedor de vinilo', d: 'Hace 11 días · 18 min', sum: [['layers', 'Colores nuevos en diciembre']], tasks: ['Pedir muestras'] }
];
const CAPS = [['image', 'Crea piezas'], ['calendar', 'Agenda'], ['search', 'Investiga'], ['mail', 'Ordena el correo'], ['video', 'Resume reuniones'], ['chart', 'Lee tus números']];
const SUGGESTED = [['calendar', '¿Qué publicamos esta semana?'], ['chart', 'Mis resultados'], ['mail', 'Newsletter de diciembre']];

/* ---------- Ajustes ---------- */
const CONNECTIONS = [
  { id: 'ig', name: 'Instagram', sub: '@tapetes_y_pisos', icon: 'image', on: true },
  { id: 'fb', name: 'Facebook', sub: 'Tu página', icon: 'users', on: true },
  { id: 'web', name: 'Sitio web', sub: 'tapetesypisos.com.co', icon: 'globe', on: true },
  { id: 'mail', name: 'Correo', sub: 'ventas@tapetesypisos.com.co', icon: 'mail', on: true },
  { id: 'cal', name: 'Calendar', sub: 'Google Calendar', icon: 'calendar', on: true },
  { id: 'gsc', name: 'Google', sub: 'Search Console', icon: 'search', on: true },
  { id: 'tg', name: 'Telegram', sub: 'Bot de la marca', icon: 'send', on: true },
  { id: 'meet', name: 'Meet', sub: 'Reuniones', icon: 'video', on: false },
  { id: 'ads', name: 'Anuncios', sub: 'Pronto', icon: 'target', on: false, soon: true }
];
const AUTONOMY = [
  { id: 'post', t: 'Publicar', icon: 'image', def: 'aprobar' },
  { id: 'mail', t: 'Enviar correos', icon: 'mail', def: 'aprobar' },
  { id: 'web', t: 'Cambiar el sitio', icon: 'globe', def: 'aprobar' },
  { id: 'meet', t: 'Entrar a reuniones', icon: 'video', def: 'avisar' },
  { id: 'ads', t: 'Gastar en anuncios', icon: 'target', def: 'aprobar', locked: true }
];
const AUTONOMY_LEVELS = [['aprobar', 'Aprobar', 'shield'], ['avisar', 'Avisar', 'bell'], ['libre', 'Libre', 'bolt']];
const AUTONOMY_TXT = { aprobar: 'Espera tu OK', avisar: 'Lo hace y te avisa', libre: 'Lo hace sin avisar' };
const USAGE = [['image', 'Piezas', 18, 24], ['calendar', 'Programadas', 7, 20], ['video', 'Reuniones (h)', 3, 6]];
const NOTIFS = [['tg', 'send', 'Telegram', true], ['mail', 'mail', 'Resumen diario', true], ['urgent', 'bell', 'Urgentes', false]];

/* ---------- Respuestas simuladas del agente ---------- */
const REPLIES = [
  { re: /(post|public|instagram|reel|carrusel|historia)/i, t: 'Listo. Preparo tres opciones con tu tono cálido y las dejo en Aprobaciones. Te aviso también por Telegram.', go: ['aprobaciones', 'Ir a Aprobaciones'] },
  { re: /(newsletter|correo|email|boletin|boletín)/i, t: 'Perfecto. Preparo un borrador y no envío nada hasta que lo apruebes.', go: ['aprobaciones', 'Ver borradores'] },
  { re: /(resultado|alcance|métrica|metrica|cómo vamos|como vamos)/i, t: 'En 30 días tu alcance subió 27 % y las interacciones 31 %. Lo que mejor funcionó: los carruseles.', go: ['resultados', 'Ver resultados'] },
  { re: /(calendario|semana|agenda|programa)/i, t: 'Esta semana tienes 4 piezas programadas y 5 por decidir. Mañana toca publicar.', go: ['calendario', 'Ver calendario'] },
  { re: /(marca|memoria|aprend|tono)/i, t: 'Aprendí 6 cosas de tus decisiones. 3 están por revisar.', go: ['marca', 'Revisar memoria'] }
];
const REPLY_DEFAULT = 'Entendido. Lo preparo y te cuento. Nada sale sin tu aprobación.';
