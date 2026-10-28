/* Panel SAM · vista previa interactiva. Datos de ejemplo en data.js, estilos en dash.css.
   Diseño con íconos y poco texto: cada pantalla se entiende de un vistazo. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ico = (n, c = '') => `<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const clone = o => JSON.parse(JSON.stringify(o));
  const LS = 'panel-sam-demo-v2';
  const isMobile = () => matchMedia('(max-width: 820px)').matches;

  const ROUTES = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'aprobaciones', label: 'Aprobar', icon: 'inbox' },
    { id: 'calendario', label: 'Calendario', icon: 'calendar' },
    { id: 'resultados', label: 'Resultados', icon: 'chart' },
    { id: 'marca', label: 'Marca', icon: 'brand' },
    { id: 'agente', label: 'Sami', icon: 'spark' }
  ];
  const FILTERS = [['todas', 'grid', 'Todas'], ['redes', 'image', 'Redes'], ['email', 'mail', 'Correo'], ['web', 'globe', 'Sitio'], ['leads', 'target', 'Prospectos']];

  /* ---------- Estado ---------- */
  const fresh = () => ({
    theme: null, collapsed: false, pc: {}, sel: null, filter: 'todas', checked: {}, stack: 0, calMonth: 0, calView: 'mes',
    calCh: { instagram: true, facebook: true, email: true, web: true, leads: true }, calPil: {}, period: '30', ser: { reach: true, inter: true },
    memo: {}, au: {}, conns: {}, notifs: {}, chat: [], agentTab: 'chat', marcaTab: 'kit', mtk: {}, slide: {}, webv: {}
  });
  let S = fresh();
  try { const raw = JSON.parse(localStorage.getItem(LS) || 'null'); if (raw && typeof raw === 'object') Object.assign(S, raw); } catch (e) { /* sin almacenamiento */ }
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* ignorar */ } };
  const U = { route: 'inicio', sheet: null, drawer: false, pal: false, palQ: '', palI: 0, typing: false, changesFor: null, detailOpen: false, live: 0 };

  /* ---------- Piezas ---------- */
  const P = id => PIECES.find(p => p.id === id);
  const stOf = p => (S.pc[p.id] && S.pc[p.id].st) || p.st;
  const offOf = p => (S.pc[p.id] && 'off' in S.pc[p.id] ? S.pc[p.id].off : p.off);
  const dateOf = p => (offOf(p) == null ? null : isoOff(offOf(p)));
  const notesOf = p => (S.pc[p.id] && S.pc[p.id].notes) || [];
  const urgentFirst = (a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || (offOf(a) ?? 99) - (offOf(b) ?? 99);
  const pending = () => PIECES.filter(p => stOf(p) === 'revision').sort(urgentFirst);
  const decided = () => PIECES.filter(p => S.pc[p.id] && ['aprobada', 'programada', 'cambios', 'descartada'].includes(S.pc[p.id].st));
  const matchF = (p, f) => f === 'todas' || (f === 'redes' ? ['instagram', 'facebook'].includes(p.ch) : p.ch === f);
  const pil = id => PILLARS.find(x => x.id === id);
  const kindIcon = p => (p.leads ? 'target' : p.email ? 'mail' : p.web ? 'globe' : p.reel || /^Reel/.test(p.kind) ? 'play' : p.kind.startsWith('Historia') ? 'clock' : p.slides && p.slides.length > 1 ? 'layers' : 'image');
  const kindShort = p => p.kind.split(' · ')[0];

  /* ---------- Formato ---------- */
  const dfmt = (iso, o) => new Intl.DateTimeFormat('es-CO', o).format(new Date(iso + 'T12:00:00'));
  const longDate = iso => dfmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });
  const nf = n => Math.round(n).toLocaleString('es-CO');
  const t12 = t => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? ' a. m.' : ' p. m.'); };
  const rel = off => (off === 0 ? 'hoy' : off === 1 ? 'mañana' : off === -1 ? 'ayer' : off > 1 ? 'en ' + off + ' días' : 'hace ' + (-off) + ' días');
  const when = p => (dateOf(p) ? `${rel(offOf(p)).replace(/^./, c => c.toUpperCase())} · ${t12(p.time)}` : 'Sin fecha');
  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };
  const chDot = (ch, cls = '') => `<span class="ch-dot ${cls}" style="--c:${CHANNELS[ch].color}" title="${CHANNELS[ch].label}">${ico(CHANNELS[ch].icon)}</span>`;
  const chChip = ch => `<span class="chip"><i class="d" style="--c:${CHANNELS[ch].color}"></i>${CHANNELS[ch].label}</span>`;
  const pilChip = p => { const x = pil(p.pil); return x ? `<span class="chip">${ico(x.icon, 'sm')}${x.label}</span>` : ''; };
  const facts = p => `<div class="facts">${(p.facts || []).map(([i, t]) => `<div class="fact"><span class="fi2">${ico(i)}</span><span>${esc(t)}</span></div>`).join('')}</div>`;
  const pill = (i, html, cls = '') => `<span class="pill ${cls}">${ico(i, 'sm')}${html}</span>`;

  function toast(msg, opt = {}) {
    const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.innerHTML = `${ico('check', 'sm')}<span>${esc(msg)}</span>${opt.undo ? `<button type="button" aria-label="Deshacer">${ico('undo', 'sm')} Deshacer</button>` : ''}`;
    $('#toasts').append(el);
    const kill = () => el.remove();
    if (opt.undo) el.querySelector('button').addEventListener('click', () => { opt.undo(); kill(); });
    setTimeout(kill, opt.ms || 5200);
  }

  /* ---------- Maquetas de publicaciones ---------- */
  function mockSocial(p) {
    const i = Math.min(S.slide[p.id] || 0, p.slides.length - 1), s = p.slides[i];
    return `<div class="mock"><div class="mock-h"><span class="av">${CLIENT.initials}</span><div><b>${CLIENT.handle}</b><small>${esc(CHANNELS[p.ch].label)} · ${esc(kindShort(p))}</small></div>${ico('dots')}</div>
      <div class="slide ${s.tone}"><b>${esc(s.t)}</b><span>${esc(s.s)}</span>${p.slides.length > 1 ? `<span class="n">${i + 1}/${p.slides.length}</span><button class="arr l" data-act="slide" data-id="${p.id}" data-d="-1" aria-label="Lámina anterior">${ico('left', 'sm')}</button><button class="arr r" data-act="slide" data-id="${p.id}" data-d="1" aria-label="Lámina siguiente">${ico('right', 'sm')}</button>` : ''}</div>
      ${p.slides.length > 1 ? `<div class="mock-dots">${p.slides.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>` : ''}
      <div class="mock-acts">${ico('heart')}${ico('msg')}${ico('send')}${ico('bookmark')}</div>
      <div class="mock-cap"><b>${CLIENT.handle}</b> ${esc(p.caption || '')}${p.tags ? `<span class="tags">${esc(p.tags)}</span>` : ''}</div></div>`;
  }
  function mockReel(p) {
    return `<div class="mock"><div class="mock-h"><span class="av">${CLIENT.initials}</span><div><b>${CLIENT.handle}</b><small>Instagram · Reel</small></div>${ico('dots')}</div>
      <div class="reel"><span class="pl">${ico('play')}</span><span class="hook">${esc(p.reel.hook)}</span><div class="beats">${p.reel.beats.map(b => `<span>${esc(b)}</span>`).join('')}</div></div>
      <div class="mock-cap"><b>${CLIENT.handle}</b> ${esc(p.caption)}<span class="tags">${esc(p.tags || '')}</span></div></div>`;
  }
  function mockEmail(p) {
    const e = p.email;
    return `<div class="mock"><div class="em"><div class="em-h"><b>${esc(e.subject)}</b><small>${esc(e.pre)}</small></div><div class="em-b"><div class="em-hero"><b>${esc(e.hero)}</b><span>${esc(e.heroSub)}</span></div>${e.blocks.map(b => `<div class="em-t">${esc(b)}</div>`).join('')}<span class="em-cta">${esc(e.cta)}</span></div></div></div>`;
  }
  function mockWeb(p) {
    const v = S.webv[p.id] || 'despues', w = p.web, lines = v === 'antes' ? w.before : w.after;
    const body = !lines.length ? '<div class="none">Todavía no existe</div>' : lines.map((l, i) => (i === 0 ? `<h4>${esc(l)}</h4>` : `<p class="${v === 'despues' && p.st !== 'publicada' ? 'new' : ''}">${esc(l)}</p>`)).join('');
    return `<div><div class="seg" style="margin-bottom:12px"><button data-act="webv" data-id="${p.id}" data-v="antes" aria-pressed="${v === 'antes'}">Antes</button><button data-act="webv" data-id="${p.id}" data-v="despues" aria-pressed="${v === 'despues'}">${ico('check', 'sm')} Nuevo</button></div>
      <div class="web"><div class="web-bar"><i></i><i></i><i></i><span>${esc(w.url)}</span></div><div class="web-b">${body}</div></div></div>`;
  }
  function mockLeads(p) {
    return `<div class="card pad" style="box-shadow:none"><table class="leadt"><tbody>${p.leads.map(l => `<tr><td><b>${esc(l.n)}</b><small>${esc(l.k)}</small></td><td><div class="fit"><i><b style="width:${l.fit}%"></b></i>${l.fit}</div></td></tr>`).join('')}</tbody></table></div>`;
  }
  const preview = p => (p.leads ? mockLeads(p) : p.email ? mockEmail(p) : p.web ? mockWeb(p) : p.reel ? mockReel(p) : mockSocial(p));

  /* ---------- Gráficos ---------- */
  function spark(v, color) {
    const w = 120, h = 40, mx = Math.max(...v), mn = Math.min(...v), n = v.length;
    const pts = v.map((y, i) => [i / (n - 1) * w, h - 4 - (y - mn) / (mx - mn || 1) * (h - 10)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d} L${w} ${h} L0 ${h}Z" fill="${color}" opacity="0.14"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
  }
  let CH = null;
  function chartSVG(per) {
    const W = 760, H = 250, pl = 46, pr = 46, pt = 14, pb = 28, n = per.reach.length;
    const iw = W - pl - pr, ih = H - pt - pb;
    const mxR = Math.max(...per.reach) * 1.12, mxI = Math.max(...per.inter) * 1.12;
    const x = i => pl + i / (n - 1) * iw, yR = v => pt + ih - v / mxR * ih, yI = v => pt + ih - v / mxI * ih;
    const line = (v, y) => v.map((a, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(a).toFixed(1)).join(' ');
    CH = { W, H, pl, pr, pt, pb, n, per, x, yR, yI };
    let g = '';
    for (let k = 0; k <= 4; k++) { const yy = pt + ih * k / 4; g += `<line class="gl" x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}"/>`; if (S.ser.reach) g += `<text x="${pl - 8}" y="${yy + 4}" text-anchor="end">${nf(mxR * (1 - k / 4))}</text>`; if (S.ser.inter) g += `<text x="${W - pr + 8}" y="${yy + 4}" text-anchor="start" style="fill:#B8680A">${nf(mxI * (1 - k / 4))}</text>`; }
    const dl = [0, Math.floor(n / 2), n - 1].map(i => `<text x="${x(i)}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(per.dates[i])}</text>`).join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Alcance e interacciones de los últimos ${per.label}">${g}${dl}
      ${S.ser.reach ? `<path d="${line(per.reach, yR)} L${x(n - 1)} ${pt + ih} L${x(0)} ${pt + ih}Z" fill="#0B79B0" opacity="0.12"/><path d="${line(per.reach, yR)}" fill="none" stroke="#0B79B0" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
      ${S.ser.inter ? `<path d="${line(per.inter, yI)}" fill="none" stroke="#F27424" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
      <g id="hover" style="display:none"><line id="hv" class="hv" y1="${pt}" y2="${pt + ih}" x1="0" x2="0"/><circle id="hd1" r="5" fill="#0B79B0" stroke="#FFF" stroke-width="2" cx="0" cy="0"/><circle id="hd2" r="5" fill="#F27424" stroke="#FFF" stroke-width="2" cx="0" cy="0"/></g></svg>`;
  }

  /* ---------- Vistas ---------- */
  const VIEW = {};

  function changesBox(id, dark) {
    return `<div class="changes" style="margin-top:16px"><textarea id="chg-${id}" placeholder="¿Qué cambiamos?" aria-label="Qué cambios quieres"></textarea><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri sm" data-act="send-changes" data-id="${id}">${ico('send', 'sm')} Enviar</button><button class="btn sm ${dark ? '' : 'ghost'}" data-act="close-changes" aria-label="Cancelar">${ico('x', 'sm')}</button></div></div>`;
  }

  VIEW.inicio = () => {
    const pend = pending(), cur = pend.length ? pend[S.stack % pend.length] : null;
    const prog = PIECES.filter(p => stOf(p) === 'programada' && offOf(p) >= 0 && offOf(p) <= 6).length;
    const per = PERIODS[7], dec = decided().length, total = pend.length + dec;
    const kp = [['Alcance', per.reach.reduce((a, b) => a + b, 0), per.kpi.reach, per.reach, '#0B79B0', 'users'], ['Interacciones', per.inter.reduce((a, b) => a + b, 0), per.kpi.inter, per.inter, '#D6336C', 'heart'], ['Visitas', per.visits.reduce((a, b) => a + b, 0), per.kpi.visits, per.visits, '#7A5AF8', 'globe'], ['Prospectos', per.leads, per.kpi.leads, per.reach.map((v, i) => 3 + (i * 5 % 4)), '#F27424', 'target']];
    const days = Array.from({ length: 7 }, (_, i) => {
      const iso = isoOff(i), items = PIECES.filter(p => dateOf(p) === iso && stOf(p) !== 'descartada');
      return `<div class="wd ${i === 0 ? 'today' : ''}"><small>${dfmt(iso, { weekday: 'short' })}</small><b>${new Date(iso + 'T12:00:00').getDate()}</b><div class="pcs">${items.map(p => `<button class="pc ${stOf(p) === 'revision' ? 'pend' : ''}" style="--c:${CHANNELS[p.ch].color}" data-act="cal-open" data-id="${p.id}" title="${esc(p.title)}" aria-label="${esc(p.title)}">${ico(kindIcon(p))}</button>`).join('') || `<span class="free">${ico('plus', 'sm')}</span>`}</div></div>`;
    }).join('');
    const focus = cur ? `
      <div class="focus-body"><div>${preview(cur)}</div>
        <div class="focus-info"><div class="chips">${chChip(cur.ch)}<span class="chip">${ico(kindIcon(cur), 'sm')}${esc(kindShort(cur))}</span>${pilChip(cur)}${cur.urgent ? `<span class="chip hot">${ico('flame', 'sm')} Urgente</span>` : ''}</div>
          <h3>${esc(cur.title)}</h3>${facts(cur)}
          <details class="whyd"><summary>${ico('info', 'sm')} ¿Por qué?</summary><p>${esc(cur.why)}</p></details>
          <div class="focus-actions"><button class="btn pri lg" data-act="approve" data-id="${cur.id}">${ico('check')} Aprobar</button><button class="btn lg" data-act="open-changes" data-id="${cur.id}">${ico('edit')} Cambios</button><button class="btn lg sq" data-act="discard" data-id="${cur.id}" aria-label="Descartar" title="Descartar">${ico('x')}</button>${pend.length > 1 ? `<button class="btn lg sq" data-act="focus-next" aria-label="Ver la siguiente" title="Siguiente">${ico('arrow')}</button>` : ''}</div>
          <div class="hint"><span>${ico('clock', 'sm')} ${when(cur)}</span><span class="keys"><kbd>A</kbd><kbd>E</kbd><kbd>D</kbd></span></div></div></div>`
      : `<div class="empty" style="color:#F1FEFF;padding:30px 10px"><div class="big-ico">${ico('check')}</div><b style="color:#FFF">Todo al día</b><div style="margin-top:16px"><a class="btn pri" href="#/calendario">${ico('calendar')} Calendario</a></div></div>`;
    return `
      <div class="page-h"><div><span class="kick">${esc(dfmt(isoOff(0), { weekday: 'long', day: 'numeric', month: 'long' }))}</span><h1 class="title">${greet()}, ${esc(CLIENT.user.first)}.</h1>
        <div class="pills">${pill('inbox', `<b>${pend.length}</b> por decidir`, 'strong')}${pill('calendar', `<b>${prog}</b> salen esta semana`)}${pill('shield', 'Nada sale sin tu OK')}</div></div></div>
      <div class="hello"><section class="focus" aria-label="Para decidir ahora"><div class="focus-h"><span class="focus-t">${ico('inbox')} Decidir ahora</span><div class="stackbar" aria-hidden="true">${Array.from({ length: Math.max(total, 1) }, (_, i) => `<i class="${i < dec ? 'done' : i === dec + (S.stack % Math.max(pend.length, 1)) && cur ? 'on' : ''}"></i>`).join('')}</div></div>${focus}
          ${U.changesFor && cur && U.changesFor === cur.id ? changesBox(cur.id, true) : ''}</section>
        <div class="side-col"><section class="card pad"><div class="sec-t" style="margin:0 0 6px"><h2>${ico('inbox')} En la cola</h2><a href="#/aprobaciones" aria-label="Ver todo">${ico('arrow', 'sm')}</a></div><div class="queue">${pend.filter(p => !cur || p.id !== cur.id).slice(0, 4).map(p => `<button class="q-row" data-act="goto-piece" data-id="${p.id}">${chDot(p.ch, 'sm')}<span><b>${esc(p.title)}</b><small>${ico(kindIcon(p), 'sm')} ${when(p)}</small></span></button>`).join('') || `<div style="color:var(--ink-3);padding:10px 4px">${ico('check')}</div>`}</div></section>
          <section class="card pad"><div class="sec-t" style="margin:0 0 10px"><h2>${ico('spark')} Ideas de Sami</h2></div><div class="sugg">${[['trophy', 'Mostrar un caso de éxito', 'Prepara un caso de éxito de una oficina para Instagram'], ['ruler', 'Tema flojo: terminados', 'Prepara una publicación sobre guardaescobas y terminados']].map(([i, a, q]) => `<button class="sg" data-act="ask" data-q="${esc(q)}">${ico(i)}<span><b>${esc(a)}</b></span>${ico('plus', 'sm')}</button>`).join('')}</div></section></div></div>
      <div class="sec-t"><h2>${ico('chart')} Esta semana</h2><a href="#/resultados" aria-label="Ver resultados">${ico('arrow', 'sm')}</a></div>
      <div class="kpis">${kp.map(([l, v, d, s, c, ic]) => `<div class="card kpi"><div class="lab">${ico(ic, 'sm')} ${l}</div><div class="val">${nf(v)}</div><span class="delta up">${ico('up', 'sm')} ${d} %</span>${spark(s, c)}</div>`).join('')}</div>
      <div class="sec-t"><h2>${ico('calendar')} Próximos 7 días</h2><a href="#/calendario" aria-label="Abrir calendario">${ico('arrow', 'sm')}</a></div><div class="week">${days}</div>
      <div class="sec-t"><h2>${ico('spark')} Sami ahora</h2></div><section class="card pad"><div class="feed" id="feed">${feedHTML()}</div></section>`;
  };
  const feedHTML = () => ACTIVITY.map(a => `<div class="f-row ${a.live ? 'now' : ''}"><span class="f-ico">${ico(a.live ? 'spark' : a.icon || 'check', 'sm')}</span><div><b>${esc(a.live ? LIVE_STATES[U.live % LIVE_STATES.length] : a.t)}</b><small>${a.live ? 'ahora' : a.when}</small></div></div>`).join('');

  VIEW.aprobaciones = () => {
    const list = pending().filter(p => matchF(p, S.filter)), done = decided().slice().reverse();
    if (!S.sel || ![...list, ...done].some(p => p.id === S.sel)) S.sel = list[0] ? list[0].id : done[0] ? done[0].id : null;
    const cur = S.sel ? P(S.sel) : null, nChecked = list.filter(p => S.checked[p.id]).length;
    const row = (p, isDone) => `<div class="it ${p.id === S.sel ? 'on' : ''}" data-act="sel" data-id="${p.id}" role="button" tabindex="0" aria-label="${esc(p.title)}">${isDone ? '' : `<button class="chbox" role="checkbox" aria-checked="${!!S.checked[p.id]}" data-act="chk" data-id="${p.id}" aria-label="Seleccionar ${esc(p.title)}">${ico('check')}</button>`}${chDot(p.ch)}<div class="tx"><b>${esc(p.title)}</b><small><span>${ico(kindIcon(p), 'sm')}</span>${isDone ? `<span class="chip ${STATUS[stOf(p)].tone}" style="height:20px">${ico(STATUS[stOf(p)].icon, 'sm')}${STATUS[stOf(p)].label}</span>` : `<span>${when(p)}</span>`}${p.urgent && !isDone ? `<span class="urg">${ico('flame', 'sm')}</span>` : ''}</small></div>${ico('right', 'sm')}</div>`;
    const detail = cur ? detailHTML(cur) : `<div class="empty"><div class="big-ico">${ico('check')}</div><b>Todo al día</b></div>`;
    return `<div class="page-h"><div><span class="kick">Aprobar</span><h1 class="title">Lo que Sami necesita <em>de ti</em></h1>
        <div class="pills"><span class="pill keys"><kbd>J</kbd><kbd>K</kbd> mover</span><span class="pill keys"><kbd>A</kbd> ${ico('check', 'sm')}</span><span class="pill keys"><kbd>E</kbd> ${ico('edit', 'sm')}</span><span class="pill keys"><kbd>D</kbd> ${ico('x', 'sm')}</span></div></div></div>
      <div class="tools">${FILTERS.map(([k, i, l]) => `<button class="chbtn" aria-pressed="${S.filter === k}" data-act="filter" data-f="${k}" title="${l}">${ico(i, 'sm')}<span class="tl">${l}</span>${k === 'todas' ? ` <b style="font-family:var(--f-num)">${pending().length}</b>` : ''}</button>`).join('')}</div>
      <div class="inbox ${U.detailOpen ? 'show-detail' : ''}"><div class="list-col"><div class="card list">${list.map(p => row(p, false)).join('') || `<div class="empty" style="padding:28px 16px"><div class="big-ico">${ico('check')}</div></div>`}</div>
          ${nChecked ? `<div class="bulk"><span>${ico('check', 'sm')} <b>${nChecked}</b></span><span style="display:flex;gap:8px"><button class="btn sm ghost" style="color:#FFF" data-act="clear-sel" aria-label="Limpiar">${ico('x', 'sm')}</button><button class="btn pri sm" data-act="bulk-approve">${ico('check', 'sm')} Aprobar ${nChecked}</button></span></div>` : ''}
          ${done.length ? `<div class="sec-t" style="margin:22px 0 8px"><h2 style="font-size:16px">${ico('undo', 'sm')} Decididas</h2></div><div class="card list">${done.map(p => row(p, true)).join('')}</div>` : ''}</div>
        <div class="detail-col"><div class="card detail" id="detail">${detail}</div></div></div>`;
  };
  function detailHTML(p) {
    const st = stOf(p), isP = st === 'revision', steps = ['borrador', 'revision', 'aprobada', 'programada', 'publicada'], idx = Math.max(steps.indexOf(st === 'cambios' ? 'borrador' : st), 0);
    const sic = ['edit', 'inbox', 'check', 'calendar', 'send'], slab = ['Borrador', 'Tu decisión', 'Aprobada', 'Programada', 'Publicada'];
    return `<button class="btn ghost sm back" data-act="back">${ico('left', 'sm')} Lista</button>
      <div class="detail-h"><div><div class="chips">${chChip(p.ch)}<span class="chip">${ico(kindIcon(p), 'sm')}${esc(kindShort(p))}</span>${pilChip(p)}<span class="chip ${STATUS[st].tone}">${ico(STATUS[st].icon, 'sm')}${STATUS[st].label}</span></div><h2>${esc(p.title)}</h2><div class="when">${ico('calendar', 'sm')} ${dateOf(p) ? `${longDate(dateOf(p))} · ${t12(p.time)}` : 'Sin fecha'}</div></div></div>
      <div class="detail-grid"><div class="prev">${preview(p)}</div>
        <div>${facts(p)}<details class="whyd"><summary>${ico('info', 'sm')} ¿Por qué?</summary><p>${esc(p.why)}</p></details>
          ${isP ? `<div class="acts"><button class="btn pri lg" data-act="approve" data-id="${p.id}">${ico('check')} Aprobar</button><button class="btn lg" data-act="open-changes" data-id="${p.id}">${ico('edit')} Cambios</button><button class="btn lg sq bad" data-act="discard" data-id="${p.id}" aria-label="Descartar" title="Descartar">${ico('x')}</button></div>` : `<div class="acts"><button class="btn" data-act="reopen" data-id="${p.id}">${ico('undo', 'sm')} Volver a decidir</button></div>`}
          ${U.changesFor === p.id ? changesBox(p.id) : ''}
          ${notesOf(p).length ? `<div class="thread">${notesOf(p).map(n => `<div class="cm"><small>${ico('users', 'sm')} Tú</small>${esc(n)}</div>`).join('')}<div class="cm ok"><small>${ico('spark', 'sm')} Sami</small>Recibido</div></div>` : ''}
          <div class="stepper" aria-label="Estado">${sic.map((ic, i) => `<span class="${i < idx ? 'done' : i === idx ? 'cur' : ''}" title="${slab[i]}">${ico(ic, 'sm')}${i === idx ? `<em>${slab[i]}</em>` : ''}</span>`).join('')}</div></div></div>`;
  }

  VIEW.calendario = () => {
    const base = new Date(TODAY.getFullYear(), TODAY.getMonth() + S.calMonth, 1), first = (base.getDay() + 6) % 7;
    const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate(), rows = Math.ceil((first + dim) / 7);
    const pilOn = id => S.calPil[id] !== false;
    const vis = p => S.calCh[p.ch] && pilOn(p.pil) && stOf(p) !== 'descartada';
    let cells = '';
    for (let i = 0; i < rows * 7; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), 1 - first + i), iso = isoOf(d), out = d.getMonth() !== base.getMonth();
      const items = PIECES.filter(p => dateOf(p) === iso && vis(p)), past = d < TODAY, show = items.slice(0, 3);
      cells += `<div class="day ${out ? 'out' : ''} ${iso === isoOff(0) ? 'today' : ''}" data-iso="${iso}"><span class="num">${d.getDate()}</span>${!past ? `<button class="add" data-act="cal-add" data-iso="${iso}" aria-label="Pedirle a Sami algo para el ${longDate(iso)}" title="Pedirle a Sami">${ico('plus')}</button>` : ''}
        ${show.map(p => `<button class="ev-chip ${stOf(p) === 'revision' ? 'pend' : ''} ${stOf(p) === 'publicada' ? 'pub' : ''}" style="--c:${CHANNELS[p.ch].color}" draggable="${stOf(p) !== 'publicada'}" data-act="cal-open" data-id="${p.id}" title="${esc(p.title)}">${ico(kindIcon(p), 'sm')}<span>${esc(p.title)}</span></button>`).join('')}${items.length > 3 ? `<button class="more" data-act="cal-open" data-id="${items[3].id}">+${items.length - 3}</button>` : ''}</div>`;
    }
    const upcoming = PIECES.filter(p => dateOf(p) && offOf(p) >= 0 && vis(p)).sort((a, b) => offOf(a) - offOf(b));
    const groups = {}; upcoming.forEach(p => { const k = offOf(p) < 7 ? 'Esta semana' : offOf(p) < 14 ? 'Próxima semana' : 'Más adelante'; (groups[k] = groups[k] || []).push(p); });
    const agenda = Object.keys(groups).map(k => `<div class="g"><h3>${k}</h3><div class="card list">${groups[k].map(p => `<button class="it" data-act="cal-open" data-id="${p.id}">${chDot(p.ch)}<div class="tx"><b>${esc(p.title)}</b><small><span>${ico(kindIcon(p), 'sm')}</span><span>${longDate(dateOf(p))} · ${t12(p.time)}</span></small></div><span class="chip ${STATUS[stOf(p)].tone}">${ico(STATUS[stOf(p)].icon, 'sm')}${STATUS[stOf(p)].label}</span></button>`).join('')}</div></div>`).join('') || `<div class="empty"><div class="big-ico">${ico('calendar')}</div></div>`;
    return `<div class="page-h"><div><span class="kick">Calendario</span><h1 class="title">Todo lo que sale, <em>en un lugar</em></h1>
        <div class="pills">${pill('drag', 'Arrastra para mover')}${pill('plus', 'Día libre: pídele a Sami')}</div></div>
        <div class="seg"><button data-act="cal-view" data-v="mes" aria-pressed="${S.calView === 'mes'}">${ico('grid', 'sm')} Mes</button><button data-act="cal-view" data-v="lista" aria-pressed="${S.calView === 'lista'}">${ico('list', 'sm')} Lista</button></div></div>
      <div class="tools">${Object.keys(CHANNELS).map(k => `<button class="chbtn" style="--c:${CHANNELS[k].color}" aria-pressed="${S.calCh[k]}" data-act="cal-ch" data-ch="${k}" title="${CHANNELS[k].label}"><i class="d"></i><span class="tl">${CHANNELS[k].label}</span></button>`).join('')}<span class="vsep"></span>${PILLARS.map(x => `<button class="chbtn ic" aria-pressed="${pilOn(x.id)}" data-act="cal-pil" data-p="${x.id}" title="${x.label}" aria-label="${x.label}">${ico(x.icon, 'sm')}</button>`).join('')}</div>
      ${S.calView === 'mes' ? `<div class="cal-h"><div class="cal-nav"><button class="icon-btn" data-act="cal-prev" aria-label="Mes anterior">${ico('left')}</button><h2>${(m => m.charAt(0).toUpperCase() + m.slice(1))(new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(base))}</h2><button class="icon-btn" data-act="cal-next" aria-label="Mes siguiente">${ico('right')}</button></div><button class="btn sm" data-act="cal-today">${ico('calendar', 'sm')} Hoy</button></div>
      <div class="card cal"><div class="dow">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => `<div>${d}</div>`).join('')}</div><div class="days">${cells}</div></div>` : `<div class="agenda">${agenda}</div>`}`;
  };

  VIEW.resultados = () => {
    const per = PERIODS[S.period], sum = a => a.reduce((x, y) => x + y, 0), k = per.kpi;
    const cards = [['Alcance', sum(per.reach), k.reach, per.reach, '#0B79B0', 'users'], ['Interacciones', sum(per.inter), k.inter, per.inter, '#D6336C', 'heart'], ['Visitas', sum(per.visits), k.visits, per.visits, '#7A5AF8', 'globe'], ['Prospectos', per.leads, k.leads, per.reach.map((v, i) => 4 + (i * 7 % 5)), '#F27424', 'target']];
    const maxF = Math.max(...IG.formats.map(f => f[2]));
    const tile = x => { const d = x.last, tone = d <= 7 ? 'ok' : d <= 14 ? 'warn' : 'bad'; return `<button class="pt ${tone}" data-act="ask" data-q="Prepara una publicación sobre ${esc(x.label.toLowerCase())}" title="Pedirle a Sami: ${esc(x.label)}">${ico(x.icon)}<b>${x.label}</b><span class="chip ${tone}">${ico('clock', 'sm')} ${d} d</span></button>`; };
    return `<div class="page-h"><div><span class="kick">Resultados</span><h1 class="title">Qué está <em>funcionando</em></h1></div>
        <div class="seg">${Object.keys(PERIODS).map(n => `<button data-act="period" data-n="${n}" aria-pressed="${S.period === n}">${PERIODS[n].label}</button>`).join('')}</div></div>
      <div class="kpis">${cards.map(([l, v, d, s, c, ic]) => `<div class="card kpi"><div class="lab">${ico(ic, 'sm')} ${l}</div><div class="val">${nf(v)}</div><span class="delta up">${ico('up', 'sm')} ${d} %</span>${spark(s, c)}</div>`).join('')}</div>
      <section class="card chart-card" style="margin-top:16px"><div class="chart-top"><b class="ct">${ico('chart')} Alcance e interacciones</b>
        <div class="legend"><button class="chbtn" style="--c:#0B79B0" aria-pressed="${S.ser.reach}" data-act="ser" data-k="reach"><i class="d"></i>Alcance</button><button class="chbtn" style="--c:#F27424" aria-pressed="${S.ser.inter}" data-act="ser" data-k="inter"><i class="d"></i>Interacciones</button></div></div><div class="chart-wrap" id="chartwrap" style="position:relative">${chartSVG(per)}<div class="tip" id="tip" hidden></div></div></section>
      <div class="sec-t"><h2>${ico('spark')} Lo que aprendió Sami</h2></div>
      <div class="three">${INSIGHTS.map(i => `<article class="card ins"><span class="ib">${ico(i.icon)}</span><div class="big-n">${esc(i.big)}</div><b>${esc(i.t)}</b><button class="btn sm" data-act="ask" data-q="${esc(i.ask)}">${ico('spark', 'sm')} Hazlo</button></article>`).join('')}</div>
      <div class="sec-t"><h2>${ico('image')} Tu Instagram <span class="chip">@${IG.handle}</span></h2></div>
      <section class="card pad ig"><div class="ig-top"><div class="ig-n">${ico('users')}<b>${nf(IG.followers)}</b><span>seguidores</span></div><div class="ig-f">${IG.formats.map(([i, l, n]) => `<div class="igb" title="${l}">${ico(i)}<div class="tr"><i style="width:${n / maxF * 100}%"></i></div><b>${n}</b></div>`).join('')}<small>Últimas 12 publicaciones</small></div><div class="ig-c">${pill('calendar', IG.cadence)}</div></div>
        <div class="pts">${PILLARS.map(tile).join('')}</div></section>
      <div class="two" style="margin-top:16px"><section class="card pad"><div class="sec-t" style="margin:0 0 14px"><h2>${ico('globe')} Dónde te encuentran</h2></div><div class="bars">${CHANNEL_SPLIT.map(([c, v]) => `<div class="brow">${chDot(c, 'sm')}<div class="tr"><i style="width:${v}%;--c:${CHANNELS[c].color}"></i></div><span>${v} %</span></div>`).join('')}</div></section>
        <section class="card pad"><div class="sec-t" style="margin:0 0 14px"><h2>${ico('target')} De seguidor a cliente</h2></div><div class="funnel">${FUNNEL.map(([ic, l, v], i) => `<div class="fn" style="--c:${['#0B79B0', '#0E8390', '#25A8B3', '#E67A1F'][i]};width:${100 - i * 14}%">${ico(ic, 'sm')}<span>${l}</span><b>${v}</b></div>`).join('')}</div></section></div>
      <section class="card pad" style="margin-top:16px"><div class="sec-t" style="margin:0 0 10px"><h2>${ico('search')} Google</h2><span class="chip">Ejemplo</span></div><div class="kws">${KEYWORDS.map(w => `<div class="kwr"><span class="kt">${esc(w.k)}</span><span class="pos">#${w.pos}</span><span class="mv ${w.was > w.pos ? 'up' : w.was === w.pos ? '' : 'dn'}">${w.was > w.pos ? ico('up') + (w.was - w.pos) : w.was === w.pos ? '=' : ico('down') + (w.pos - w.was)}</span></div>`).join('')}</div></section>`;
  };

  const memSt = m => S.memo[m.id] || m.st;
  VIEW.marca = () => {
    const porRev = MEMORY.filter(m => memSt(m) === 'por-revisar').length;
    const kit = `<div class="two"><section class="card pad"><div class="logo-box"><b>Tapetes y Pisos</b><small>del Pacífico</small></div>
        <div class="swatches" style="margin-top:16px">${BRAND.colors.map(([n, h]) => `<button class="sw" data-act="copy" data-v="${h}" style="--c:${h}" title="Copiar ${h}"><i></i><span>${n}</span><small>${h}</small></button>`).join('')}</div>
        <div class="fonts">${BRAND.fonts.map(([a, b], i) => `<div class="fnt" title="${a}"><b style="font-family:${i === 2 ? "'Playfair Display',serif" : i === 0 ? 'Poppins,sans-serif' : "'DM Sans',sans-serif"}">Aa</b><span>${b}</span></div>`).join('')}</div></section>
      <div class="grid"><section class="card pad"><div class="tags2">${BRAND.voice.map(([i, l]) => `<span class="tg2">${ico(i)}${l}</span>`).join('')}</div><p class="slogan">“${BRAND.tag}”</p>
        <div class="dd"><div class="yes">${BRAND.dos.map(([i, l]) => `<div class="dr">${ico(i)}<span>${l}</span>${ico('check', 'sm')}</div>`).join('')}</div><div class="no">${BRAND.donts.map(([i, l]) => `<div class="dr">${ico(i)}<span>${l}</span>${ico('x', 'sm')}</div>`).join('')}</div></div></section>
        <section class="card pad"><div class="tpls">${[['Producto', 'brown'], ['Servicio', 'orange'], ['Antes y después', 'cream']].map(([n, t]) => `<div class="tpl slide ${t}" style="aspect-ratio:1;padding:14px"><span style="font-size:12px;font-weight:700;opacity:.8">${ico('image', 'sm')}</span>${n}</div>`).join('')}</div></section></div></div>`;
    const items = MEMORY.concat((S.mtk.extra || []).map((t, i) => ({ id: 'x' + i, icon: 'edit', t, src: ['edit', 'Lo dijiste tú'], st: 'confirmada' })));
    const mem = `<section class="card pad"><div class="teach"><input id="teach" type="text" placeholder="Enséñale algo a Sami" aria-label="Enséñale algo a Sami"><button class="btn pri" data-act="teach" aria-label="Enseñar">${ico('plus')}</button></div>
      ${items.map(m => { const st = memSt(m); return st === 'olvidada' ? '' : `<div class="mem"><span class="mi ${st === 'confirmada' ? 'ok' : 'warn'}">${ico(m.icon)}</span><div class="tx"><b>${esc(m.t)}</b><small>${ico(m.src[0], 'sm')} ${esc(m.src[1])}</small></div><div class="mbt">${st === 'por-revisar' ? `<button class="icon-btn ok" data-act="memo" data-id="${m.id}" data-v="confirmada" aria-label="Confirmar" title="Confirmar">${ico('check')}</button>` : `<span class="chip ok">${ico('check', 'sm')}</span>`}<button class="icon-btn" data-act="memo" data-id="${m.id}" data-v="olvidada" aria-label="Olvidar" title="Olvidar">${ico('x')}</button></div></div>`; }).join('')}</section>`;
    return `<div class="page-h"><div><span class="kick">Marca</span><h1 class="title">Lo que Sami <em>sabe de tu marca</em></h1></div>
        <div class="seg"><button data-act="marca-tab" data-v="kit" aria-pressed="${S.marcaTab === 'kit'}">${ico('brand', 'sm')} Kit</button><button data-act="marca-tab" data-v="memoria" aria-pressed="${S.marcaTab === 'memoria'}">${ico('book', 'sm')} Memoria${porRev ? ` <span class="chip warn" style="height:20px;padding:0 7px">${porRev}</span>` : ''}</button></div></div>${S.marcaTab === 'kit' ? kit : mem}`;
  };

  VIEW.agente = () => {
    const tabs = [['chat', 'msg', 'Chat'], ['act', 'clock', 'Actividad'], ['meet', 'video', 'Reuniones']];
    let body = '';
    if (S.agentTab === 'chat') body = `<div class="agent-grid"><section class="card chatbox"><div class="msgs" id="msgs-page">${chatHTML()}</div>${sugsHTML()}<form class="chat-in" data-form="chat"><input name="q" type="text" placeholder="Pídele algo a Sami" autocomplete="off" aria-label="Mensaje para Sami"><button class="btn pri" type="submit" aria-label="Enviar">${ico('send')}</button></form></section>
      <section class="card pad"><div class="caps">${CAPS.map(([i, l]) => `<div class="cap">${ico(i)}<span>${l}</span></div>`).join('')}</div><a class="btn" style="margin-top:14px;width:100%" href="#/ajustes">${ico('shield', 'sm')} Autonomía</a></section></div>`;
    else if (S.agentTab === 'act') body = `<section class="card pad"><div class="feed" id="feed">${feedHTML()}</div></section>`;
    else body = `<div class="grid">${MEETINGS.map(m => `<article class="card meet"><h3>${ico('video')} ${esc(m.t)}</h3><small>${esc(m.d)}</small><div class="sums">${m.sum.map(([i, s]) => `<span class="chip">${ico(i, 'sm')} ${esc(s)}</span>`).join('')}</div><div style="margin-top:10px">${m.tasks.map((t, i) => { const k = m.id + i, on = !!S.mtk[k]; return `<button class="tk" role="checkbox" aria-checked="${on}" data-act="tk" data-k="${k}"><span class="chbox" style="pointer-events:none;${on ? 'background:var(--blue);border-color:var(--blue)' : ''}">${ico('check')}</span><span>${esc(t)}</span></button>`; }).join('')}</div></article>`).join('')}</div>`;
    return `<div class="page-h"><div><span class="kick">${esc(CLIENT.agent.role)}</span><h1 class="title">Habla con <em>${esc(CLIENT.agent.name)}</em></h1></div>
      <div class="seg">${tabs.map(([k, i, l]) => `<button data-act="agent-tab" data-v="${k}" aria-pressed="${S.agentTab === k}">${ico(i, 'sm')} ${l}</button>`).join('')}</div></div>${body}`;
  };

  VIEW.ajustes = () => {
    const au = a => S.au[a.id] || a.def;
    return `<div class="page-h"><div><span class="kick">Ajustes</span><h1 class="title">Cuánto hace Sami <em>solo</em></h1></div></div>
      <div class="set-grid"><div class="grid"><section class="card pad">${AUTONOMY.map(a => `<div class="au"><div class="au-h"><span class="au-i">${ico(a.icon)}</span><b>${a.t}</b>${a.locked ? `<span class="chip">${ico('lock', 'sm')}</span>` : ''}<span class="au-s">${AUTONOMY_TXT[au(a)]}</span></div><div class="lvls3" role="radiogroup" aria-label="${a.t}">${AUTONOMY_LEVELS.map(([k, l, ic]) => `<button class="lvl" role="radio" aria-checked="${au(a) === k}" data-act="au" data-id="${a.id}" data-v="${k}" title="${l}" ${a.locked && k !== 'aprobar' ? 'disabled' : ''}>${ico(ic)}<span>${l}</span></button>`).join('')}</div></div>`).join('')}</section>
        <section class="card pad"><div class="conns">${CONNECTIONS.map(c => { const on = c.id in S.conns ? S.conns[c.id] : c.on; return c.soon ? `<div class="cn2 off" title="${c.name}: pronto">${ico(c.icon)}<b>${c.name}</b><i class="st"></i></div>` : `<button class="cn2 ${on ? 'on' : 'off'}" data-act="conn" data-id="${c.id}" title="${c.name}: ${c.sub}" aria-pressed="${on}">${ico(c.icon)}<b>${c.name}</b><i class="st"></i></button>`; }).join('')}</div></section></div>
        <div class="grid"><section class="plan"><span class="kick">${ico('trophy', 'sm')} Plan</span><b>${CLIENT.plan.name}</b>${USAGE.map(([i, l, a, b]) => `<div class="meter"><div class="t"><span>${ico(i, 'sm')} ${l}</span><span>${a}/${b}</span></div><div class="tr"><i style="width:${a / b * 100}%"></i></div></div>`).join('')}<button class="btn pri" data-act="toast" data-m="Vista previa: aquí se compararían los planes.">${ico('arrow', 'sm')} Ver planes</button></section>
          <section class="card pad">${NOTIFS.map(([k, i, l, d]) => { const on = k in S.notifs ? S.notifs[k] : d; return `<div class="nrow"><span>${ico(i)} ${l}</span><button class="switch" role="switch" aria-checked="${on}" aria-label="${l}" data-act="notif" data-id="${k}"></button></div>`; }).join('')}</section>
          <button class="btn" data-act="reset">${ico('undo', 'sm')} Restablecer la demo</button></div></div>`;
  };

  VIEW.mas = () => `<div class="page-h"><div><span class="kick">Más</span><h1 class="title">Todo <em>el panel</em></h1></div></div><div class="more-grid">${[['marca', 'brand', 'Marca'], ['agente', 'spark', 'Sami'], ['ajustes', 'gear', 'Ajustes']].map(([r, i, t]) => `<a class="card mg" href="#/${r}">${ico(i, 'lg')}<b>${t}</b></a>`).join('')}</div>`;

  /* ---------- Chat de Sami ---------- */
  function ensureChat() { if (!S.chat.length) S.chat = [{ r: 'ag', t: `${greet()}. Soy ${CLIENT.agent.name}. Pídeme lo que necesites. Nada sale al público sin tu aprobación.` }]; }
  const chatHTML = () => { ensureChat(); return S.chat.map(m => `<div class="bub ${m.r === 'me' ? 'me' : 'ag'}">${esc(m.t)}${m.go ? `<br><a class="btn sm go" href="#/${m.go[0]}" data-act="close-layers">${m.go[1]} ${ico('arrow', 'sm')}</a>` : ''}</div>`).join('') + (U.typing ? '<div class="bub ag"><span class="typing"><i></i><i></i><i></i></span></div>' : ''); };
  const sugsHTML = () => (S.chat.length <= 1 ? `<div class="sugs">${SUGGESTED.map(([i, s]) => `<button class="chbtn" data-act="ask" data-q="${esc(s)}">${ico(i, 'sm')} ${esc(s)}</button>`).join('')}</div>` : '');
  function refreshChat() {
    ['#msgs-page', '#msgs-drawer'].forEach(sel => { const el = $(sel); if (el) { el.innerHTML = chatHTML(); el.scrollTop = el.scrollHeight; } });
    $$('.sugs').forEach(el => { if (S.chat.length > 1) el.remove(); });
  }
  function sendChat(text) {
    text = text.trim(); if (!text) return; ensureChat(); S.chat.push({ r: 'me', t: text }); U.typing = true; save(); refreshChat();
    const r = REPLIES.find(x => x.re.test(text));
    setTimeout(() => { U.typing = false; S.chat.push({ r: 'ag', t: r ? r.t : REPLY_DEFAULT, go: r ? r.go : null }); save(); refreshChat(); }, 1000);
  }
  function ask(q) { openDrawer(); sendChat(q); }

  /* ---------- Capas: hoja de detalle, chat flotante y buscador ---------- */
  function renderLayers() {
    let html = '';
    if (U.sheet) {
      const p = P(U.sheet), st = stOf(p), d = dateOf(p);
      html += `<div class="sheet-bg" data-act="close-layers"></div><aside class="sheet" role="dialog" aria-label="${esc(p.title)}"><button class="icon-btn sheet-x" data-act="close-layers" aria-label="Cerrar">${ico('x')}</button>
        <div class="chips" style="margin-bottom:8px">${chChip(p.ch)}<span class="chip">${ico(kindIcon(p), 'sm')}${esc(kindShort(p))}</span><span class="chip ${STATUS[st].tone}">${ico(STATUS[st].icon, 'sm')}${STATUS[st].label}</span></div><h2 style="font-family:var(--f-display);font-weight:900;font-size:24px;line-height:1.1;margin-bottom:14px;padding-right:44px">${esc(p.title)}</h2>
        <div class="prev">${preview(p)}</div>
        ${st !== 'publicada' && st !== 'descartada' ? `<div style="margin-top:16px"><label for="resch" style="font-weight:700;font-size:14px;display:flex;gap:6px;align-items:center;margin-bottom:6px">${ico('calendar', 'sm')} Día</label><input id="resch" type="date" value="${d || ''}" min="${isoOff(0)}" style="height:44px;border-radius:12px;border:1.5px solid var(--line);padding:0 12px;background:var(--surface);width:100%"></div>` : ''}
        ${p.metrics ? `<div class="evs" style="margin-top:16px"><span class="chip">${ico('users', 'sm')} ${nf(p.metrics.reach)}</span><span class="chip">${ico('heart', 'sm')} ${nf(p.metrics.likes)}</span><span class="chip">${ico('bookmark', 'sm')} ${nf(p.metrics.saves)}</span></div>` : ''}
        <div class="acts">${st === 'revision' ? `<button class="btn pri lg" data-act="approve" data-id="${p.id}">${ico('check')} Aprobar</button><button class="btn lg" data-act="goto-piece" data-id="${p.id}">${ico('edit')} Cambios</button>` : `<button class="btn" data-act="close-layers">${ico('x', 'sm')} Cerrar</button>`}</div></aside>`;
    }
    if (U.drawer) {
      html += `<div class="drawer-bg" data-act="close-layers"></div><aside class="drawer" role="dialog" aria-label="Chat con Sami"><div class="drawer-h"><span class="sami">${ico('spark')}</span><div><b>${esc(CLIENT.agent.name)}</b><small>En línea</small></div><button class="icon-btn" style="margin-left:auto" data-act="close-layers" aria-label="Cerrar">${ico('x')}</button></div>
        <div class="msgs" id="msgs-drawer" style="flex:1">${chatHTML()}</div>${sugsHTML()}<form class="chat-in" data-form="chat"><input id="drawer-in" name="q" type="text" placeholder="Pídele algo a Sami" autocomplete="off" aria-label="Mensaje para Sami"><button class="btn pri" type="submit" aria-label="Enviar">${ico('send')}</button></form></aside>`;
    }
    if (U.pal) {
      const items = palItems(U.palQ);
      html += `<div class="palette-bg" data-act="pal-bg"><div class="palette" role="dialog" aria-label="Buscar o pedir"><div class="pal-in">${ico('search')}<input id="pal-in" type="text" value="${esc(U.palQ)}" placeholder="Busca o pídele algo a Sami" autocomplete="off" aria-label="Buscar o pedir"></div>
        <div class="pal-list">${items.map((it, i) => (it.g ? `<div class="pal-g">${it.g}</div>` : `<button class="pal-i ${i === U.palI ? 'on' : ''}" data-act="pal-run" data-i="${i}">${ico(it.icon)}<span>${esc(it.t)}</span>${it.hint ? `<small>${esc(it.hint)}</small>` : ''}</button>`)).join('')}</div>
        <div class="pal-ft"><span><kbd>↑</kbd><kbd>↓</kbd></span><span><kbd>Enter</kbd></span><span><kbd>Esc</kbd></span></div></div></div>`;
    }
    $('#layer').innerHTML = html;
    const fab = $('.fab'); if (fab) fab.hidden = !!U.drawer;
  }
  function palItems(q) {
    const nav = ROUTES.concat([{ id: 'ajustes', label: 'Ajustes', icon: 'gear' }]).map(r => ({ icon: r.icon, t: r.label, run: () => go(r.id) }));
    const acts = [
      { icon: 'check', t: 'Aprobar lo urgente', run: () => { const u = pending().filter(p => p.urgent); u.forEach(p => decide(p.id, 'approve', null, true)); toast(u.length ? `Aprobaste ${u.length}` : 'No hay urgentes'); render(true); } },
      { icon: document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', t: 'Modo claro u oscuro', run: toggleTheme },
      { icon: 'undo', t: 'Restablecer la demo', run: resetDemo }
    ];
    const ql = q.trim().toLowerCase(), f = a => !ql || a.t.toLowerCase().includes(ql);
    const out = [];
    const askItem = ql ? [{ icon: 'spark', t: `Pedirle a Sami: «${q.trim()}»`, hint: 'Enter', run: () => ask_(q.trim()) }] : [];
    if (askItem.length) out.push({ g: 'Pedir' }, ...askItem);
    const pcs = PIECES.filter(p => ql && p.title.toLowerCase().includes(ql)).slice(0, 4).map(p => ({ icon: kindIcon(p), t: p.title, hint: STATUS[stOf(p)].label, run: () => { U.pal = false; U.sheet = p.id; renderLayers(); } }));
    if (pcs.length) out.push({ g: 'Piezas' }, ...pcs);
    const n = nav.filter(f), a = acts.filter(f);
    if (n.length) out.push({ g: 'Ir a' }, ...n);
    if (a.length) out.push({ g: 'Acciones' }, ...a);
    return out;
  }
  const ask_ = q => { closeLayers(); ask(q); };
  function openPalette(q = '') { U.pal = true; U.palQ = q; U.palI = firstSel(); renderLayers(); setTimeout(() => { const i = $('#pal-in'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 0); }
  const firstSel = () => { const it = palItems(U.palQ); const i = it.findIndex(x => !x.g); return i < 0 ? 0 : i; };
  function openDrawer(prefill) { const fd = $('.fab-dot'); if (fd) fd.remove(); U.drawer = true; U.sheet = null; U.pal = false; ensureChat(); renderLayers(); setTimeout(() => { const i = $('#drawer-in'); if (i) { if (prefill) i.value = prefill; i.focus(); } const m = $('#msgs-drawer'); if (m) m.scrollTop = m.scrollHeight; }, 0); }
  function closeLayers() { U.sheet = null; U.drawer = false; U.pal = false; renderLayers(); }
  const anyLayer = () => U.sheet || U.drawer || U.pal;

  /* ---------- Acciones ---------- */
  function decide(id, kind, note, silent) {
    const p = P(id), prev = S.pc[id] ? clone(S.pc[id]) : null;
    const st = kind === 'approve' ? (dateOf(p) ? 'programada' : 'aprobada') : kind === 'changes' ? 'cambios' : 'descartada';
    S.pc[id] = Object.assign({}, S.pc[id] || {}, { st }); if (note) S.pc[id].notes = (S.pc[id].notes || []).concat(note);
    delete S.checked[id]; if (U.changesFor === id) U.changesFor = null; save();
    if (!silent) {
      const msg = kind === 'approve' ? (st === 'programada' ? `Aprobado · sale ${rel(offOf(p))} ${t12(p.time)}` : 'Aprobado') : kind === 'changes' ? 'Sami recibió tus cambios' : 'Descartado';
      toast(msg, { undo: () => { if (prev) S.pc[id] = prev; else delete S.pc[id]; S.sel = id; save(); render(true); } });
      const nx = pending().filter(x => matchF(x, S.filter))[0]; S.sel = nx ? nx.id : id; if (isMobile()) U.detailOpen = false;
    }
  }
  function go(r) { location.hash = '#/' + r; }
  function toggleTheme() { const d = document.documentElement.dataset.theme === 'dark'; S.theme = d ? 'light' : 'dark'; applyTheme(); save(); render(true); }
  function applyTheme() { const t = S.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = t; }
  function resetDemo() { try { localStorage.removeItem(LS); } catch (e) { /* ignorar */ } const th = S.theme; S = fresh(); S.theme = th; closeLayers(); render(false); toast('Demo restablecida'); }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, id = el.dataset.id;
    if (a === 'close-layers') { if (el.tagName === 'A') { U.drawer = false; U.sheet = null; renderLayers(); } else closeLayers(); return; }
    if (a === 'pal-bg') { if (e.target === el) closeLayers(); return; }
    if (a === 'pal-run') { const it = palItems(U.palQ)[+el.dataset.i]; U.pal = false; renderLayers(); if (it) it.run(); return; }
    if (a === 'chk') { e.stopPropagation(); S.checked[id] = !S.checked[id]; save(); render(true); return; }
    if (a === 'sel') { S.sel = id; U.changesFor = null; U.detailOpen = true; render(true); if (isMobile()) window.scrollTo(0, 0); return; }
    const acts = {
      collapse: () => { S.collapsed = !S.collapsed; save(); $('#shell').classList.toggle('collapsed', S.collapsed); },
      theme: toggleTheme, cmdk: () => openPalette(), agent: () => openDrawer(),
      bell: () => go('aprobaciones'), reset: resetDemo,
      approve: () => { decide(id, 'approve'); render(true); if (U.sheet) { U.sheet = null; renderLayers(); } },
      discard: () => { decide(id, 'discard'); render(true); },
      reopen: () => { delete S.pc[id]; save(); S.sel = id; render(true); toast('Volvió a la cola'); },
      'open-changes': () => { U.changesFor = id; S.sel = id; render(true); setTimeout(() => { const t = $('#chg-' + id); if (t) t.focus(); }, 0); },
      'close-changes': () => { U.changesFor = null; render(true); },
      'send-changes': () => { const t = $('#chg-' + id), v = t ? t.value.trim() : ''; if (!v) { toast('Escribe qué cambiar'); return; } decide(id, 'changes', v); render(true); },
      'focus-next': () => { S.stack++; render(true); },
      'goto-piece': () => { S.sel = id; S.filter = 'todas'; U.sheet = null; U.changesFor = null; U.detailOpen = true; save(); if (location.hash !== '#/aprobaciones') go('aprobaciones'); else render(true); },
      'bulk-approve': () => { const ids = pending().filter(p => S.checked[p.id]).map(p => p.id), prevs = ids.map(i => [i, S.pc[i] ? clone(S.pc[i]) : null]); ids.forEach(i => decide(i, 'approve', null, true)); S.checked = {}; save(); const nx = pending()[0]; S.sel = nx ? nx.id : S.sel; render(true); toast(`Aprobaste ${ids.length}`, { undo: () => { prevs.forEach(([i, pv]) => { if (pv) S.pc[i] = pv; else delete S.pc[i]; }); save(); render(true); } }); },
      'clear-sel': () => { S.checked = {}; render(true); },
      filter: () => { S.filter = el.dataset.f; S.sel = null; save(); render(true); },
      slide: () => { const p = P(id), n = p.slides.length; S.slide[id] = ((S.slide[id] || 0) + (+el.dataset.d) + n) % n; render(true); if (U.sheet) renderLayers(); },
      webv: () => { S.webv[id] = el.dataset.v; render(true); if (U.sheet) renderLayers(); },
      back: () => { U.detailOpen = false; render(true); },
      'cal-prev': () => { S.calMonth--; render(true); }, 'cal-next': () => { S.calMonth++; render(true); }, 'cal-today': () => { S.calMonth = 0; render(true); },
      'cal-view': () => { S.calView = el.dataset.v; save(); render(true); },
      'cal-ch': () => { S.calCh[el.dataset.ch] = !S.calCh[el.dataset.ch]; save(); render(true); },
      'cal-pil': () => { const k = el.dataset.p; S.calPil[k] = S.calPil[k] === false; save(); render(true); },
      'cal-open': () => { U.sheet = id; U.drawer = false; U.pal = false; renderLayers(); },
      'cal-add': () => { openDrawer(`Prepara una publicación para el ${longDate(el.dataset.iso)}`); },
      period: () => { S.period = el.dataset.n; save(); render(true); },
      ser: () => { const k = el.dataset.k, o = k === 'reach' ? 'inter' : 'reach'; if (S.ser[k] && !S.ser[o]) { toast('Deja una línea visible'); return; } S.ser[k] = !S.ser[k]; save(); render(true); },
      ask: () => ask(el.dataset.q),
      'marca-tab': () => { S.marcaTab = el.dataset.v; save(); render(true); },
      copy: () => { const v = el.dataset.v; if (navigator.clipboard) navigator.clipboard.writeText(v).then(() => toast(`Copiado ${v}`), () => toast(v)); else toast(v); },
      memo: () => { S.memo[id] = el.dataset.v; save(); render(true); toast(el.dataset.v === 'confirmada' ? 'Sami lo recordará' : 'Sami lo olvidó', { undo: () => { delete S.memo[id]; save(); render(true); } }); },
      teach: () => { const i = $('#teach'), v = i ? i.value.trim() : ''; if (!v) { toast('Escribe algo para Sami'); return; } (S.mtk.extra = S.mtk.extra || []).push(v); save(); render(true); toast('Sami lo anotó'); },
      'agent-tab': () => { S.agentTab = el.dataset.v; save(); render(true); },
      tk: () => { const k = el.dataset.k; S.mtk[k] = !S.mtk[k]; save(); render(true); },
      au: () => { S.au[id] = el.dataset.v; save(); render(true); },
      conn: () => { const c = CONNECTIONS.find(x => x.id === id), on = id in S.conns ? S.conns[id] : c.on; S.conns[id] = !on; save(); render(true); toast(on ? `${c.name} desconectado` : `${c.name} conectado`); },
      notif: () => { const d = NOTIFS.find(n => n[0] === id)[3], on = id in S.notifs ? S.notifs[id] : d; S.notifs[id] = !on; save(); render(true); },
      toast: () => toast(el.dataset.m)
    };
    if (acts[a]) { if (el.tagName === 'A' && a !== 'close-layers') return; acts[a](); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (anyLayer()) { closeLayers(); } return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); U.pal ? closeLayers() : openPalette(); return; }
    if (U.pal) {
      const items = palItems(U.palQ), idxs = items.map((x, i) => (x.g ? -1 : i)).filter(i => i >= 0);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const pos = idxs.indexOf(U.palI), n = idxs[(pos + (e.key === 'ArrowDown' ? 1 : -1) + idxs.length) % idxs.length]; U.palI = n; renderLayers(); const i = $('#pal-in'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); const on = $('.pal-i.on'); if (on) on.scrollIntoView({ block: 'nearest' }); return; }
      if (e.key === 'Enter') { e.preventDefault(); const it = items[U.palI]; U.pal = false; renderLayers(); if (it && !it.g) it.run(); return; }
      return;
    }
    const tg = e.target && e.target.closest ? e.target : document.body;
    if (tg.closest('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey || anyLayer()) return;
    const k = e.key.toLowerCase();
    if (e.key === 'Enter' && tg.matches('.it[data-act="sel"]')) { tg.click(); return; }
    if (U.route === 'aprobaciones') {
      const list = pending().filter(p => matchF(p, S.filter)), i = list.findIndex(p => p.id === S.sel);
      if (k === 'j' || k === 'k') { const n = list[Math.max(0, Math.min(list.length - 1, i + (k === 'j' ? 1 : -1)))]; if (n) { S.sel = n.id; render(true); const el = $('.it.on'); if (el) el.scrollIntoView({ block: 'nearest' }); } }
      else if (i >= 0 && k === 'a') { decide(S.sel, 'approve'); render(true); }
      else if (i >= 0 && k === 'd') { decide(S.sel, 'discard'); render(true); }
      else if (i >= 0 && k === 'e') { e.preventDefault(); U.changesFor = S.sel; render(true); setTimeout(() => { const t = $('#chg-' + S.sel); if (t) t.focus(); }, 0); }
    } else if (U.route === 'inicio') {
      const pend = pending(), cur = pend.length ? pend[S.stack % pend.length] : null;
      if (cur && k === 'a') { decide(cur.id, 'approve'); render(true); } else if (cur && k === 'd') { decide(cur.id, 'discard'); render(true); }
      else if (cur && k === 'e') { e.preventDefault(); U.changesFor = cur.id; render(true); setTimeout(() => { const t = $('#chg-' + cur.id); if (t) t.focus(); }, 0); }
    }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'pal-in') { U.palQ = e.target.value; U.palI = firstSel(); const pos = e.target.selectionStart; renderLayers(); const i = $('#pal-in'); i.focus(); i.setSelectionRange(pos, pos); }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'resch' && U.sheet) { const iso = e.target.value, p = P(U.sheet); if (!iso) return; reschedule(p.id, iso); }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form="chat"]'); if (!f) return;
    e.preventDefault(); const i = f.querySelector('input'); const v = i.value; i.value = ''; sendChat(v);
  });
  function reschedule(id, iso) {
    const prev = S.pc[id] ? clone(S.pc[id]) : null; const diff = Math.round((new Date(iso + 'T12:00:00') - new Date(isoOff(0) + 'T12:00:00')) / 86400000);
    if (diff < 0) { toast('No se puede mover al pasado'); return; }
    S.pc[id] = Object.assign({}, S.pc[id] || {}, { off: diff }); save(); render(true); if (U.sheet) renderLayers();
    toast(`Movido al ${longDate(iso)}`, { undo: () => { if (prev) S.pc[id] = prev; else delete S.pc[id]; save(); render(true); if (U.sheet) renderLayers(); } });
  }
  document.addEventListener('dragstart', e => { const c = e.target.closest('.ev-chip'); if (!c) return; e.dataTransfer.setData('text/plain', c.dataset.id); e.dataTransfer.effectAllowed = 'move'; });
  document.addEventListener('dragover', e => { const d = e.target.closest('.day'); if (!d) return; e.preventDefault(); $$('.day.over').forEach(x => { if (x !== d) x.classList.remove('over'); }); d.classList.add('over'); });
  document.addEventListener('dragleave', e => { const d = e.target.closest('.day'); if (d && !d.contains(e.relatedTarget)) d.classList.remove('over'); });
  document.addEventListener('drop', e => { const d = e.target.closest('.day'); if (!d) return; e.preventDefault(); d.classList.remove('over'); const id = e.dataTransfer.getData('text/plain'); if (id && P(id)) reschedule(id, d.dataset.iso); });
  document.addEventListener('mousemove', e => {
    const w = e.target.closest('#chartwrap'); if (!w || !CH) return;
    const svg = $('svg.chart', w), r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * CH.W;
    const i = Math.max(0, Math.min(CH.n - 1, Math.round((x - CH.pl) / (CH.W - CH.pl - CH.pr) * (CH.n - 1))));
    const px = CH.x(i), hv = $('#hv'), d1 = $('#hd1'), d2 = $('#hd2'), tip = $('#tip');
    hv.setAttribute('x1', px); hv.setAttribute('x2', px);
    d1.setAttribute('cx', S.ser.reach ? px : -10); d1.setAttribute('cy', S.ser.reach ? CH.yR(CH.per.reach[i]) : -10);
    d2.setAttribute('cx', S.ser.inter ? px : -10); d2.setAttribute('cy', S.ser.inter ? CH.yI(CH.per.inter[i]) : -10);
    $('#hover').style.display = ''; tip.hidden = false; tip.style.left = Math.max(80, Math.min(r.width - 80, px / CH.W * r.width)) + 'px'; tip.style.top = Math.max(0, (S.ser.reach ? CH.yR(CH.per.reach[i]) : CH.yI(CH.per.inter[i])) / CH.H * r.height) + 'px';
    tip.innerHTML = `<b>${new Intl.DateTimeFormat('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }).format(CH.per.dates[i])}</b>${S.ser.reach ? `<div><span><i style="background:#0B79B0"></i>Alcance</span><b style="margin:0">${nf(CH.per.reach[i])}</b></div>` : ''}${S.ser.inter ? `<div><span><i style="background:#F27424"></i>Interacciones</span><b style="margin:0">${nf(CH.per.inter[i])}</b></div>` : ''}`;
  });
  document.addEventListener('mouseout', e => { if (e.target.closest && e.target.closest('#chartwrap') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#chartwrap'))) { const tip = $('#tip'); if (tip) tip.hidden = true; const hg = $('#hover'); if (hg) hg.style.display = 'none'; } });

  /* ---------- Estructura general ---------- */
  function badges() { return { aprobaciones: pending().length, marca: MEMORY.filter(m => memSt(m) === 'por-revisar').length }; }
  function renderShell() {
    const b = badges();
    $('#side').innerHTML = `<div class="side-top"><img src="../assets/logo-sam-blanco.png" alt="SAM Digital" width="88" height="34"><button class="collapse" data-act="collapse" aria-label="Contraer menú">${ico('left', 'sm')}</button></div>
      <div class="client"><span class="avatar">${CLIENT.initials}</span><div><b>${esc(CLIENT.short)}</b><small>${esc(CLIENT.city)} · ${esc(CLIENT.plan.name)}</small></div></div>
      <nav class="nav-list" aria-label="Principal">${ROUTES.map(r => `<a class="nav ${U.route === r.id ? 'on' : ''}" href="#/${r.id}" ${U.route === r.id ? 'aria-current="page"' : ''} title="${r.label}">${ico(r.icon)}<span class="lb">${r.label}</span>${b[r.id] ? `<span class="bd">${b[r.id]}</span>` : ''}</a>`).join('')}<div class="nav-sep"></div><a class="nav ${U.route === 'ajustes' ? 'on' : ''}" href="#/ajustes" title="Ajustes">${ico('gear')}<span class="lb">Ajustes</span></a></nav>
      <div class="side-foot"><div class="tg-card" title="También por Telegram">${ico('send')}<span>Telegram conectado</span></div></div>`;
    $('#top').innerHTML = `<button class="cmdk" data-act="cmdk" aria-label="Buscar o pedirle algo a Sami">${ico('search')}<span>Busca o pídele algo a Sami</span><kbd>Ctrl K</kbd></button>
      <div class="top-r"><span class="demo-tag">Vista previa</span><button class="live" data-act="agent" aria-label="Sami está trabajando"><i class="pulse"></i> ${ico('spark', 'sm')}</button><button class="icon-btn" data-act="bell" aria-label="${b.aprobaciones} cosas por decidir">${ico('bell')}${b.aprobaciones ? '<i class="dot"></i>' : ''}</button><button class="icon-btn" data-act="theme" aria-label="Cambiar modo claro u oscuro">${ico(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon')}</button><span class="avatar" style="width:40px;height:40px;font-size:13px" title="${esc(CLIENT.user.name)}">${CLIENT.user.initials}</span></div>`;
    const tb = [['inicio', 'home', 'Inicio'], ['aprobaciones', 'inbox', 'Aprobar'], ['calendario', 'calendar', 'Agenda'], ['resultados', 'chart', 'Números'], ['mas', 'grid', 'Más']];
    $('#tabbar').innerHTML = tb.map(([r, i, l]) => `<a href="#/${r}" class="${U.route === r || (r === 'mas' && ['marca', 'agente', 'ajustes'].includes(U.route)) ? 'on' : ''}">${ico(i)}<span>${l}</span>${b[r] ? `<span class="bd">${b[r]}</span>` : ''}</a>`).join('');
  }
  function render(keep) {
    const main = $('#main'), y = window.scrollY, det = $('#detail'), dy = det ? det.scrollTop : 0;
    if (!VIEW[U.route]) U.route = 'inicio';
    main.innerHTML = VIEW[U.route]();
    if (!keep) { main.style.animation = 'none'; void main.offsetHeight; main.style.animation = ''; }
    renderShell();
    if (keep) { window.scrollTo(0, y); const d2 = $('#detail'); if (d2) d2.scrollTop = dy; }
    document.title = ({ inicio: 'Inicio', aprobaciones: 'Aprobar', calendario: 'Calendario', resultados: 'Resultados', marca: 'Marca', agente: 'Sami', ajustes: 'Ajustes', mas: 'Más' }[U.route] || 'Panel') + ' · Panel SAM';
  }
  function route() {
    const r = (location.hash.replace(/^#\/?/, '') || 'inicio').split('?')[0];
    U.route = VIEW[r] ? r : 'inicio'; U.detailOpen = false; U.changesFor = null;
    render(false); window.scrollTo(0, 0); renderLayers();
    const m = $('#main'); if (m && !anyLayer()) m.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);
  setInterval(() => { U.live++; const f = $('#feed'); if (f && !anyLayer()) f.innerHTML = feedHTML(); }, 6000);

  applyTheme();
  $('#shell').classList.toggle('collapsed', !!S.collapsed);
  route();
  setTimeout(() => { const f = $('.fab'); if (f) f.classList.remove('intro'); }, 6500);
})();
