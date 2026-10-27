/* Contenido del Plan de Agentes. Para cambiar textos, costos o funcionalidades, edita este archivo y recarga la página. */

const ICONS = {
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  send: '<path d="M21 3 3 10.5l6.5 2.5L12 20z"/><path d="M9.5 13 21 3"/>',
  brand: '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="15.5" cy="10" r="1.3"/><path d="M12 21c-1.5 0-2-1.2-1.4-2.4.6-1.2 1.6-1.6 1.6-3.1"/>',
  db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m3 17 5-4 4 3 3-2 6 4"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M18 14.5c2.2.3 3.5 1.8 3.8 4.5"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  scale: '<path d="M12 3v18M6 21h12M5 7h14"/><path d="m5 7-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4M12 17v.1"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-1-1.5-1.5-2.7-1.5-1.6 0-2.7.9-2.7 2.1 0 3 5.7 1.5 5.7 4.4 0 1.3-1.2 2.2-2.9 2.2-1.3 0-2.4-.6-2.9-1.7M12 6v1.7M12 16.3V18"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"/><circle cx="12" cy="3.5" r="1"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10.5 3.8 3.8 0 0 1 17.5 18z"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>'
};

const DATA = {
  tabs: [
    { id: 'agente', n: '01', label: 'Agente inteligente', short: 'Agente', title: 'Todo lo que se necesita para el agente inteligente', lead: 'Un agente por marca, que se maneja desde Telegram, trabaja con el kit de marca, recuerda lo que aprende y solo actúa hacia afuera cuando tú lo apruebas.' },
    { id: 'plataforma', n: '02', label: 'Plataforma', short: 'Plataforma', title: 'Todo lo que se necesita para la plataforma', lead: 'El servidor, las cuentas, la seguridad, los cobros y la hoja de ruta que rodean al agente para poder operarlo, cobrarlo y hacerlo crecer.' },
    { id: 'paquetes', n: '03', label: 'Paquetes', short: 'Paquetes', title: 'Todo lo que se necesita para definir paquetes según funcionalidad', lead: 'Arma cada paquete encendiendo funcionalidades y mira al instante cuánto cuesta servirlo y qué precio sugerido deja tu margen.' }
  ],

  nav: {
    agente: [['a-flujo', 'Cómo trabaja'], ['a-cerebro', 'Cerebro'], ['a-telegram', 'Telegram'], ['a-marca', 'Marca'], ['a-memoria', 'Memoria'], ['a-habilidades', 'Habilidades'], ['a-reglas', 'Reglas'], ['a-pendientes', 'Pendientes']],
    plataforma: [['p-capas', 'Capas'], ['p-servidor', 'Servidor'], ['p-costos', 'Presupuesto'], ['p-escala', 'Muchos clientes'], ['p-cobros', 'Cobros y legal'], ['p-ruta', 'Hoja de ruta'], ['p-riesgos', 'Riesgos'], ['p-pendientes', 'Pendientes']],
    paquetes: [['k-funciones', 'Funcionalidades'], ['k-armador', 'Armador'], ['k-venta', 'Cómo se vende'], ['k-pendientes', 'Pendientes']]
  },

  stats: {
    agente: [['5', 'piezas del agente'], ['6', 'habilidades'], ['3', 'niveles de permiso']],
    plataforma: [['6', 'capas'], ['4', 'semanas de piloto'], ['5', 'riesgos vigilados']],
    paquetes: [['12', 'funcionalidades'], ['3', 'paquetes propuestos'], ['2', 'variables: costo y margen']]
  },

  flow: [
    { icon: 'send', t: 'Pides por Telegram', d: 'Escribes o envías un archivo al bot de la marca.' },
    { icon: 'db', t: 'Consulta marca y memoria', d: 'Lee el kit de marca y lo que aprendió de aprobaciones anteriores.' },
    { icon: 'sliders', t: 'Usa una habilidad', d: 'Investiga, redacta, crea la pieza o prepara el cambio en el sitio.' },
    { icon: 'shield', t: 'Te pide aprobación', d: 'Todo lo que sale al exterior espera tu botón Aprobar o Rechazar.', gate: true },
    { icon: 'check', t: 'Ejecuta y aprende', d: 'Publica o envía, y anota qué funcionó para la próxima vez.' }
  ],

  engines: [
    { name: 'Hermes Agent', by: 'Nous Research', badge: 'Primera opción para probar', pick: true, facts: ['Licencia MIT, gratis', 'Telegram, WhatsApp, Slack y correo', 'Memoria persistente y skills que se mejoran solas', 'Tareas programadas en lenguaje natural', 'Funciona con Claude'] },
    { name: 'Claude Code Channels', by: 'Anthropic', badge: 'Vista previa de investigación', facts: ['Conecta una sesión de Claude Code a Telegram por MCP', 'Exige iniciar sesión con claude.ai (no clave de API)', 'La sesión debe quedar abierta en el servidor', 'Una sola sesión, no multicliente'] },
    { name: 'OpenClaw', by: 'Código abierto', badge: 'Con cuidado', facts: ['Licencia MIT, gratis', 'Telegram y WhatsApp', 'Memoria en archivos de texto', 'No encontré auditorías de seguridad'] },
    { name: 'Agente propio', by: 'Agent SDK de Claude', badge: 'Para el portal', facts: ['Máximo control', 'Más trabajo de construcción', 'Tiene sentido cuando exista el portal del cliente'] }
  ],
  enginesNote: 'Ninguno está probado todavía: la decisión sale de una prueba de 2 días con una sola marca.',

  models: [
    { name: 'Sonnet 5.5', use: 'Redactar y razonar', input: 2, output: 10, cache: 'Tokens en caché: US$0.10 por millón' },
    { name: 'Haiku 5.5', use: 'Tareas simples y baratas', input: 0.10, output: 0.50, cache: 'Tokens en caché: US$0.01 por millón' }
  ],

  telegram: [
    { icon: 'bot', t: 'Un bot por marca', d: 'Se crea con BotFather, gratis. Mantiene la memoria y los accesos de cada cliente separados.' },
    { icon: 'lock', t: 'Usuarios permitidos', d: 'Solo los IDs de Telegram autorizados pueden dar órdenes. Los demás se ignoran.' },
    { icon: 'check', t: 'Aprobar o rechazar', d: 'Botones en cada acción que sale al exterior: publicar, enviar, gastar o subir a producción.' },
    { icon: 'sliders', t: 'Comandos de control', d: 'Propuesta: /estado, /pausar y /pendientes para tener el control desde el celular.' }
  ],

  brandTree: [
    { f: 'marcas/', d: 'Un repositorio privado con una carpeta por cliente.', lvl: 0 },
    { f: 'sam-digital/', d: 'La marca piloto propuesta.', lvl: 1 },
    { f: 'brand.md', d: 'Quiénes somos, a quién le hablamos y qué prometemos.', lvl: 2 },
    { f: 'voz.md', d: 'Tono de voz, palabras que sí y palabras que no.', lvl: 2 },
    { f: 'colores-y-tipos.md', d: 'Paleta, tipografías y reglas de uso.', lvl: 2 },
    { f: 'logos/', d: 'Variantes del logo en SVG o PNG.', lvl: 2 },
    { f: 'plantillas/', d: 'HTML de posts, stories y carruseles con la marca.', lvl: 2 },
    { f: 'ejemplos/', d: 'Piezas aprobadas y rechazadas, para imitar y evitar.', lvl: 2 },
    { f: 'memoria.md', d: 'Lo que el agente va aprendiendo de cada aprobación.', lvl: 2 }
  ],
  brandNotes: [
    { t: 'Cómo se carga el kit', d: 'Enviando el archivo por Telegram para que el agente lo guarde, o editando la carpeta directamente. Por decidir.' },
    { t: 'Marca piloto', d: 'SAM Digital, para probar con nosotros mismos antes de ofrecerlo. Por confirmar.' }
  ],

  memory: [
    { t: 'Propone', d: 'El agente entrega una pieza o un cambio usando la marca.', ex: 'Entrega 3 posts para el lanzamiento, con tono formal.' },
    { t: 'Tú decides', d: 'Apruebas o rechazas, con un comentario corto si hace falta.', ex: 'Rechazas: "Muy formal para Instagram, hablemos más cercano".' },
    { t: 'Anota lo aprendido', d: 'Guarda la lección en la memoria de esa marca.', ex: 'Escribe en memoria.md: "En Instagram usar tono cercano, sin usted".' },
    { t: 'Una persona revisa', d: 'Alguien del equipo confirma que la lección es correcta.', ex: 'Revisas el cambio y lo dejas, o lo corriges. Así no memoriza errores.' }
  ],

  skills: [
    {
      icon: 'globe', name: 'Administrar sitios web', week: 3, level: 'rojo', levelTxt: 'Subir a producción exige tu "sí, súbelo"',
      does: 'Edita el repositorio del sitio, muestra capturas del resultado y propone el cambio como rama o pull request.',
      needs: ['Repositorios de GitHub con un token por repo', 'API REST con contraseñas de aplicación para sitios WordPress', 'Servidor con Chromium para las capturas'],
      cost: 'Casi nulo: solo tokens de IA. Los sitios siguen alojados en Hostinger y se despliegan por Git, como hoy.'
    },
    {
      icon: 'image', name: 'Crear piezas de redes', week: 2, level: 'ambar', levelTxt: 'El borrador es libre; salir a publicar necesita aprobación',
      does: 'Convierte plantillas HTML de la marca en imágenes PNG (posts, carruseles, stories), redacta el texto y propone el calendario del mes.',
      needs: ['Plantillas HTML por marca', 'Playwright con Chromium en el servidor', 'Generador de imágenes solo para fotos o ilustraciones'],
      cost: 'Con plantillas no hay costo por pieza. Fotos con IA: Flux desde ~US$0.015, Gemini desde ~US$0.039 por imagen.'
    },
    {
      icon: 'share', name: 'Publicar en redes', week: 2, level: 'rojo', levelTxt: 'Siempre con aprobación',
      does: 'Publica y programa las piezas aprobadas en Instagram, Facebook y otras redes.',
      needs: ['Cuentas propias: Meta directo con acceso estándar, sin revisión (app tipo Business y cuentas profesionales ligadas a una página de Facebook)', 'Cuentas de clientes: Meta directo exige revisión de la app y verificación de negocio, que toma semanas', 'Alternativa: un intermediario como Late/Zernio que ya hizo ese trámite'],
      cost: 'Intermediario: US$13–49 al mes (las páginas oficiales no coinciden en el precio exacto). Meta directo no cobra por publicar.'
    },
    {
      icon: 'search', name: 'Investigar en Google', week: 1, level: 'verde', levelTxt: 'Solo lee: libre',
      does: 'Busca en la web, resume competencia, tendencias y palabras clave, y lee Search Console y GA4 de los sitios.',
      needs: ['Búsqueda web: la herramienta de la API de Claude, Brave Search, Tavily o Serper (confirmar precios)', 'Search Console y GA4, gratis', 'Opcional: DataForSEO, pago por uso con recarga mínima de ~US$50'],
      cost: 'Bajo. DataForSEO cobra desde US$0.0006 por consulta de resultados.'
    },
    {
      icon: 'video', name: 'Entrar a reuniones de Meet', week: 4, level: 'ambar', levelTxt: 'Resumir es libre; grabar exige avisar a los asistentes',
      does: 'Entra con el enlace, transcribe, resume y te manda acuerdos y tareas por Telegram.',
      needs: ['Recall.ai: bot que entra a Google Meet con el enlace', 'Google Calendar por OAuth para que entre solo', 'Aviso a los asistentes de que se está grabando'],
      cost: 'Recall.ai: ~US$0.50–0.70 por hora grabada, más ~US$0.15 por hora si usas su transcripción. Sin cuota mensual.'
    },
    {
      icon: 'mail', name: 'Enviar y administrar correo', week: 3, level: 'rojo', levelTxt: 'Solo borradores; el envío pasa por aprobación',
      does: 'Ordena el buzón del agente, redacta respuestas y prepara newsletters.',
      needs: ['Cuenta Google propia del agente (por ejemplo agente@tudominio) con API de Gmail y OAuth', 'Resend, Brevo o Mailchimp para envíos masivos', 'SPF, DKIM y DMARC configurados en el dominio'],
      cost: 'Resend: gratis hasta 3.000 correos al mes; US$20 por 50.000. El buzón cuesta según tu plan de Google Workspace.'
    }
  ],

  levels: [
    { key: 'verde', t: 'Libre', d: 'Lo hace solo, no cambia nada afuera.', items: ['Leer y resumir', 'Investigar en la web', 'Consultar Search Console y GA4'] },
    { key: 'ambar', t: 'Libre y reversible', d: 'Prepara cosas que se pueden deshacer.', items: ['Borradores de piezas y textos', 'Archivos en una rama del sitio', 'Propuesta de calendario'] },
    { key: 'rojo', t: 'Solo con tu aprobación', d: 'Todo lo que sale al exterior o cuesta dinero.', items: ['Publicar en redes', 'Enviar correos', 'Gastar dinero', 'Subir un sitio a producción'] }
  ],
  safety: [
    { icon: 'eye', t: 'El contenido externo es dato, no orden', d: 'Correos, páginas y comentarios nunca le dan instrucciones al agente. Es el ataque típico de inyección de instrucciones.' },
    { icon: 'users', t: 'Cuentas propias del agente', d: 'No usa tu usuario personal. Las claves van en variables de entorno, nunca en el repositorio.' },
    { icon: 'server', t: 'Servidor aparte y en contenedor', d: 'No se corre con permisos desactivados en tu computador principal.' },
    { icon: 'dollar', t: 'Tope de gasto diario', d: 'Un límite en la API de IA evita sorpresas en la factura.' },
    { icon: 'book', t: 'Registro de todo lo que hizo', d: 'Quién pidió qué, qué se aprobó y qué se ejecutó.' }
  ],

  layers: [
    { icon: 'server', name: 'Infraestructura', phase: 'piloto', sum: 'El servidor donde vive el agente.', has: ['VPS con Ubuntu 24.04 y Docker', 'Llave SSH, usuario sin root y firewall', 'Actualizaciones automáticas y copias'], status: 'Por contratar: VPS KVM 2 de Hostinger o Railway.' },
    { icon: 'lock', name: 'Cuentas y seguridad', phase: 'piloto', sum: 'Quién entra a qué, y con qué clave.', has: ['Cuentas propias del agente (Google, GitHub)', 'Tokens de GitHub limitados a cada repositorio', 'Claves en variables de entorno', 'OAuth de Google y Meta'], status: 'Por configurar en la semana 1.' },
    { icon: 'bot', name: 'Agentes por cliente', phase: 'piloto', sum: 'Un carril por marca.', has: ['Un bot de Telegram por cliente', 'Una carpeta de marca por cliente', 'Una memoria separada por cliente'], status: 'Se prueba primero con SAM Digital.' },
    { icon: 'eye', name: 'Consola de operador', phase: 'despues', sum: 'Revisar lo del agente antes de que lo vea el cliente.', has: ['Cola de aprobaciones internas', 'Registro de acciones', 'Pausa general y topes de gasto'], status: 'En el piloto se hace por Telegram. El panel propio llega después.' },
    { icon: 'users', name: 'Portal del cliente', phase: 'despues', sum: 'Donde el cliente ve y aprueba sin hablar con el bot.', has: ['Aprobaciones y calendario', 'Incorporación guiada', 'Informe mensual'], status: 'Se decide después del piloto, con sus resultados.' },
    { icon: 'card', name: 'Cobros y legal', phase: 'despues', sum: 'Suscripción, facturación y condiciones.', has: ['Pasarela de cobro recurrente', 'Facturación electrónica ante la DIAN', 'Términos, datos personales y autorizaciones'], status: 'Se prepara en paralelo, antes del primer cliente de pago.' }
  ],

  servers: [
    { n: 'KVM 1', cpu: 1, ram: 4, disk: 50, bw: 4, promo: 6.49, today: 155.76, renew: 11.99, note: 'Alcanza para un agente sin navegador. Queda justo con Chromium y Docker.' },
    { n: 'KVM 2', cpu: 2, ram: 8, disk: 100, bw: 8, promo: 8.79, today: 210.96, renew: 14.99, note: 'Agente, Chromium y Docker con margen. Es el recomendado.', pick: true },
    { n: 'KVM 4', cpu: 4, ram: 16, disk: 200, bw: 16, promo: 12.99, today: 311.76, renew: 28.99, note: 'Para varias marcas con mucha carga. Por medir en el piloto.' },
    { n: 'KVM 8', cpu: 8, ram: 32, disk: 400, bw: 32, promo: 25.99, today: 623.76, renew: 49.99, note: 'Solo si el negocio ya tiene muchos clientes.' }
  ],
  serverOthers: [
    { t: 'Hosting web actual (hPanel)', ok: false, d: 'No sirve para el agente: no admite procesos permanentes, no da acceso root y corta cada petición a los 120 segundos. Sí sigue sirviendo para los sitios.' },
    { t: 'Railway', ok: null, d: 'US$5–20 al mes con pago por uso y sin compromiso largo. Es la alternativa si no quieres atarte 24 meses.' }
  ],
  hardening: ['Ubuntu 24.04', 'Llave SSH', 'Usuario sin root', 'Firewall', 'Docker', 'Actualizaciones automáticas'],

  costs: [
    { id: 'srv', name: 'Servidor (VPS KVM 2)', min: 9, max: 15, phase: 'Piloto', note: 'US$8.79 al mes por 24 meses; renueva a US$14.99.' },
    { id: 'ia', name: 'API de Claude', min: 20, max: 80, phase: 'Piloto', note: 'Estimación según el uso. Sonnet para redactar, Haiku para tareas simples.' },
    { id: 'pub', name: 'Publicar en redes (Late/Zernio)', min: 13, max: 49, phase: 'Piloto', note: 'Las páginas oficiales no coinciden en el precio exacto.' },
    { id: 'mail', name: 'Correo masivo (Resend)', min: 0, max: 20, phase: 'Piloto', note: 'Gratis hasta 3.000 correos al mes; US$20 por 50.000.' },
    { id: 'meet', name: 'Reuniones (Recall.ai)', min: 0, max: 10, phase: 'Semana 4', note: 'US$0.50–0.70 por hora grabada. Supuesto: hasta ~10 horas al mes.' },
    { id: 'seo', name: 'SEO (DataForSEO)', min: 0, max: 25, phase: 'Opcional', note: 'Recarga mínima de ~US$50 que se consume por uso. Supuesto mensual.' },
    { id: 'sup', name: 'Base de datos y portal (Supabase Pro)', min: 25, max: 60, phase: 'Después', note: 'US$25 más cómputo. Solo cuando exista el portal.' }
  ],
  costsDefault: { srv: 1, ia: 1, pub: 1, mail: 1 },

  laneNote: 'Cuántos clientes aguanta un servidor es algo por medir en la semana 4 del piloto. Los límites por paquete protegen el margen.',

  pay: [
    { t: 'Wompi', s: 'Por decidir', d: 'Bajó el pago con QR a 1% + IVA en septiembre de 2026. La tarifa oficial de tarjeta y PSE no la encontré.' },
    { t: 'ePayco, Mercado Pago o PayU', s: 'Idea', d: 'Referencia: PayU cobra 2,99% + IVA + COP 700 por transacción con tarjeta (guía de terceros).' },
    { t: 'Stripe', s: 'Riesgo', d: 'Confirmar si hoy ofrece cuentas locales en Colombia antes de contar con él.' },
    { t: 'Factura electrónica (DIAN)', s: 'Por decidir', d: 'Revisar con el contador cómo se factura una suscripción recurrente.' }
  ],
  legal: [
    { t: 'Términos del servicio y alcance', s: 'Por decidir', d: 'Qué hace y qué no hace el agente, y qué pasa si se equivoca.' },
    { t: 'Protección de datos', s: 'Riesgo', d: 'Ley 1581 en Colombia; GDPR si hay clientes de la Unión Europea.' },
    { t: 'Autorización para publicar', s: 'Por decidir', d: 'Permiso del cliente para publicar en sus cuentas y definir de quién es lo creado.' },
    { t: 'Términos de Meta y LinkedIn', s: 'Riesgo', d: 'Usar las APIs oficiales; no se puede raspar con cuentas de usuarios.' },
    { t: 'Aviso de grabación', s: 'Decidido', d: 'Los asistentes a una reunión deben saber que se graba.' }
  ],

  roadmap: [
    { w: 'Fase 0', t: 'Planeación', pilot: true, st: 'En curso', d: 'Cerrar las decisiones abiertas, elegir el motor del agente y contratar el servidor.' },
    { w: 'Semana 1', t: 'Base', pilot: true, d: 'Servidor, bot de Telegram, kit de marca de SAM Digital, memoria e investigación en Google.' },
    { w: 'Semana 2', t: 'Piezas y publicación', pilot: true, d: 'Plantillas a PNG, calendario, aprobación por botones y publicación en cuentas de prueba.' },
    { w: 'Semana 3', t: 'Sitios y correo', pilot: true, d: 'Cambios en sitios por rama y pull request con capturas, y correo con borradores aprobados.' },
    { w: 'Semana 4', t: 'Reuniones y 2ª marca', pilot: true, d: 'Meet con Calendar, segunda marca y medición de horas ahorradas y costo real por cliente.' },
    { w: 'Después', t: 'Piloto con clientes', d: 'Dos o tres clientes de confianza usando el agente con su marca.' },
    { w: 'Después', t: 'Lanzar paquetes', d: 'Salir a vender las suscripciones con los costos ya medidos.' },
    { w: 'Decisión', t: '¿Construir el portal?', d: 'Se decide con los resultados del piloto: horas ahorradas, piezas aprobadas y costo por cliente.' }
  ],

  risks: [
    { t: 'El agente se equivoca frente al cliente', fix: 'Aprobación obligatoria y una persona que revise antes de que el cliente lo vea.' },
    { t: 'Instrucciones falsas dentro de correos o páginas', fix: 'El contenido externo se trata solo como dato y nunca como orden.' },
    { t: 'La revisión de apps de Meta tarda semanas', fix: 'Empezar con un intermediario y con cuentas propias.' },
    { t: 'El costo de IA sube con el uso', fix: 'Topes diarios de gasto y límites de uso por paquete.' },
    { t: 'Dependencia de proveedores', fix: 'Poder sustituir a Late, Recall.ai o Resend; guardar los datos en archivos propios.' }
  ],

  feats: [
    { id: 'base', icon: 'brand', name: 'Marca, memoria y aprobación por Telegram', ben: 'El agente conoce tu marca y mejora con cada aprobación.', week: 1, cost: [3, 6], hrs: 1.0 },
    { id: 'piezas', icon: 'image', name: 'Piezas de redes', ben: 'Posts, carruseles y stories listos para aprobar.', week: 2, cost: [5, 15], hrs: 1.5, scale: 'piezas' },
    { id: 'calendario', icon: 'calendar', name: 'Calendario de contenido', ben: 'Propuesta mensual de qué publicar y cuándo.', week: 2, cost: [1, 3], hrs: 0.5 },
    { id: 'publicacion', icon: 'share', name: 'Publicación directa en redes', ben: 'Las piezas aprobadas salen programadas, sin pasos manuales.', week: 2, cost: [3, 8], hrs: 0.5, scale: 'piezas' },
    { id: 'sitio', icon: 'globe', name: 'Sitio web: cambios y mantenimiento', ben: 'Textos, páginas y ajustes del sitio, con capturas antes de subir.', week: 3, cost: [2, 8], hrs: 1.0 },
    { id: 'invest', icon: 'search', name: 'Investigación en Google', ben: 'Competencia, tendencias y palabras clave resumidas.', week: 1, cost: [2, 8], hrs: 0.5 },
    { id: 'seo', icon: 'chart', name: 'SEO y analítica', ben: 'Lectura de Search Console y GA4, con recomendaciones.', week: 3, cost: [2, 10], hrs: 0.5 },
    { id: 'meet', icon: 'video', name: 'Reuniones de Meet con resumen', ben: 'Resumen, acuerdos y tareas de cada reunión por Telegram.', week: 4, cost: [2, 6], hrs: 0.5 },
    { id: 'correo', icon: 'mail', name: 'Correo del agente', ben: 'Bandeja ordenada y respuestas listas para aprobar.', week: 3, cost: [1, 5], hrs: 1.0 },
    { id: 'news', icon: 'send', name: 'Newsletters', ben: 'Boletines diseñados y listos para enviar.', week: 3, cost: [1, 6], hrs: 1.0 },
    { id: 'frio', icon: 'target', name: 'Prospección por correo en frío', ben: 'Listas de prospectos y correos personalizados. Exige cuidar la entregabilidad.', week: 4, cost: [5, 20], hrs: 1.5 },
    { id: 'informe', icon: 'flag', name: 'Informe mensual', ben: 'Qué se publicó, qué funcionó y qué sigue.', week: 3, cost: [0, 1], hrs: 0.5 }
  ],
  pkDefaults: {
    names: ['Esencial', 'Crecimiento', 'Agencia'],
    marcas: [1, 1, 3],
    piezas: [20, 24, 30],
    margen: 60,
    tarifa: 10,
    trm: '',
    m: {
      base: [1, 1, 1], piezas: [1, 1, 1], calendario: [1, 1, 1], informe: [1, 1, 1],
      publicacion: [2, 1, 1], sitio: [0, 1, 1], invest: [0, 1, 1], seo: [0, 2, 1],
      meet: [0, 0, 1], correo: [0, 1, 1], news: [0, 2, 1], frio: [0, 0, 2]
    }
  },

  sell: [
    { icon: 'target', t: 'Cliente ideal', items: ['Primero, los clientes actuales de SAM Digital', 'Agencias pequeñas', 'Negocios con marketing interno'] },
    { icon: 'dollar', t: 'Modelo de cobro', items: ['Mensual, con descuento por pago anual', 'Prueba gratis o piloto pagado: por decidir', 'Complementos con precio aparte'] },
    { icon: 'share', t: 'Canales', items: ['Clientes actuales y referidos', 'Casos de éxito con resultados del piloto', 'Alianzas con otras agencias', 'Correo en frío, más adelante'] },
    { icon: 'users', t: 'Incorporación', items: ['Formulario de marca y accesos', 'Crear el bot y la carpeta de marca', 'Primera semana acompañada por una persona'] }
  ],
  metrics: [['MRR', 'Ingreso recurrente mensual'], ['Churn', 'Cancelaciones'], ['CAC', 'Costo de conseguir un cliente'], ['Horas', 'Ahorradas por cliente']],

  todos: {
    agente: [
      'Elegir el motor del agente con la prueba de 2 días',
      'Confirmar la marca piloto (SAM Digital)',
      'Crear el bot en BotFather y la lista de usuarios permitidos',
      'Armar el kit de marca de SAM Digital',
      'Decidir cómo se carga el kit: Telegram o carpeta',
      'Definir el tope de gasto diario de IA',
      'Elegir cómo publicar: Meta directo en cuentas propias o intermediario',
      'Crear la cuenta Google propia del agente',
      'Configurar SPF, DKIM y DMARC del dominio'
    ],
    plataforma: [
      'Decidir VPS de Hostinger o Railway, y el plazo de pago',
      'Contratar el servidor y configurarlo con seguridad',
      'Aprobar el presupuesto mensual del piloto',
      'Confirmar si Stripe opera en Colombia o elegir Wompi',
      'Revisar con el contador la factura electrónica de suscripciones',
      'Definir quién supervisa a los agentes',
      'Redactar los términos del servicio con un abogado',
      'Decidir cuándo se construye el portal (después del piloto)'
    ],
    paquetes: [
      'Decidir a quién se le vende primero',
      'Definir nombres y alcance final de los paquetes',
      'Medir el costo real por cliente en el piloto y reemplazar los supuestos',
      'Fijar la tarifa por hora de supervisión y el margen objetivo',
      'Decidir cobro mensual o anual, y prueba gratis o piloto pagado',
      'Elegir la pasarela de cobro',
      'Preparar el formulario de incorporación del cliente',
      'Revisar términos y autorización de publicación con un abogado'
    ]
  }
};
