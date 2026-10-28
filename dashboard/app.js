/* Panel SAM · vista previa interactiva. Datos de ejemplo en data.js, estilos en dash.css. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ico = (n, c = '') => `<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const clone = o => JSON.parse(JSON.stringify(o));
  const LS = 'panel-sam-demo-v1';
  const isMobile = () => matchMedia('(max-width: 820px)').matches;

  const ROUTES = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'aprobaciones', label: 'Aprobaciones', icon: 'inbox' },
    { id: 'calendario', label: 'Calendario', icon: 'calendar' },
    { id: 'resultados', label: 'Resultados', icon: 'chart' },
    { id: 'marca', label: 'Marca y memoria', icon: 'brand' },
    { id: 'agente', label: 'Sami, tu agente', icon: 'spark' }
  ];
  const FILTERS = [['todas', 'Todas'], ['redes', 'Redes'], ['email', 'Correo'], ['web', 'Sitio web'], ['leads', 'Prospectos']];

  /* ---------- Estado ---------- */
  const fresh = () => ({
    theme: null, collapsed: false, pc: {}, sel: null, filter: 'todas', checked: {}, stack: 0, calMonth: 0, calView: 'mes',
    calCh: { instagram: true, facebook: true, email: true, web: true, leads: true }, period: '30', ser: { reach: true, inter: true },
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

  /* ---------- Formato ---------- */
  const dfmt = (iso, o) => new Intl.DateTimeFormat('es-CO', o).format(new Date(iso + 'T12:00:00'));
  const longDate = iso => dfmt(iso, { weekday: 'long', day: 'numeric', month: 'long' });
  const shortDate = iso => dfmt(iso, { day: 'numeric', month: 'short' });
  const nf = n => Math.round(n).toLocaleString('es-CO');
  const t12 = t => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h < 12 ? ' a. m.' : ' p. m.'); };
  const rel = off => (off === 0 ? 'hoy' : off === 1 ? 'mañana' : off === -1 ? 'ayer' : off > 1 ? 'en ' + off + ' días' : 'hace ' + (-off) + ' días');
  const when = p => { const d = dateOf(p); return d ? `${rel(offOf(p)).replace(/^./, c => c.toUpperCase())} · ${t12(p.time)}` : 'Sin fecha'; };
  const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };
  const chDot = (ch, cls = '') => `<span class="ch-dot ${cls}" style="--c:${CHANNELS[ch].color}">${ico(CHANNELS[ch].icon)}</span>`;
  const chChip = ch => `<span class="chip"><i class="d" style="--c:${CHANNELS[ch].color}"></i>${CHANNELS[ch].label}</span>`;

  /* ---------- Avisos ---------- */
  function toast(msg, opt = {}) {
    const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.innerHTML = `${ico('check', 'sm')}<span>${esc(msg)}</span>${opt.undo ? '<button type="button">Deshacer</button>' : ''}`;
    $('#toasts').append(el);
    const kill = () => el.remove();
    if (opt.undo) el.querySelector('button').addEventListener('click', () => { opt.undo(); kill(); });
    setTimeout(kill, opt.ms || 5200);
  }

  /* ---------- Vista previa de piezas ---------- */
  function mockSocial(p) {
    const i = Math.min(S.slide[p.id] || 0, p.slides.length - 1), s = p.slides[i];
    return `<div class="mock"><div class="mock-h"><span class="av">${CLIENT.initials}</span><div><b>cafealba.co</b><small>${esc(CHANNELS[p.ch].label)} · ${esc(p.kind.split(' · ')[0])}</small></div>${ico('dots')}</div>
      <div class="slide ${s.tone}"><b>${esc(s.t)}</b><span>${esc(s.s)}</span>${p.slides.length > 1 ? `<span class="n">${i + 1}/${p.slides.length}</span><button class="arr l" data-act="slide" data-id="${p.id}" data-d="-1" aria-label="Lámina anterior">${ico('left', 'sm')}</button><button class="arr r" data-act="slide" data-id="${p.id}" data-d="1" aria-label="Lámina siguiente">${ico('right', 'sm')}</button>` : ''}</div>
      ${p.slides.length > 1 ? `<div class="mock-dots">${p.slides.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>` : ''}
      <div class="mock-acts">${ico('heart')}${ico('msg')}${ico('send')}${ico('bookmark')}</div>
      <div class="mock-cap"><b>cafealba.co</b> ${esc(p.caption || '')}${p.tags ? `<span class="tags">${esc(p.tags)}</span>` : ''}</div></div>`;
  }
  function mockReel(p) {
    return `<div class="mock"><div class="mock-h"><span class="av">${CLIENT.initials}</span><div><b>cafealba.co</b><small>Instagram · ${esc(p.kind)}</small></div>${ico('dots')}</div>
      <div class="reel"><span class="pl">${ico('play')}</span><span class="hook">${esc(p.reel.hook)}</span><div class="beats">${p.reel.beats.map(b => `<span>${esc(b)}</span>`).join('')}</div></div>
      <div class="mock-cap"><b>cafealba.co</b> ${esc(p.caption)}<span class="tags">${esc(p.tags || '')}</span></div></div>`;
  }
  function mockEmail(p) {
    const e = p.email;
    return `<div class="mock"><div class="em"><div class="em-h"><b>${esc(e.subject)}</b><small>${esc(e.pre)}</small></div><div class="em-b"><div class="em-hero"><b>${esc(e.hero)}</b><span>${esc(e.heroSub)}</span></div>${e.blocks.map(b => `<div class="em-t">${esc(b)}</div>`).join('')}<span class="em-cta">${esc(e.cta)}</span></div></div></div>`;
  }
  function mockWeb(p) {
    const v = S.webv[p.id] || 'despues', w = p.web, lines = v === 'antes' ? w.before : w.after;
    const body = !lines.length ? '<div class="none">Todavía no existe</div>' : lines.map((l, i) => (i === 0 ? `<h4>${esc(l)}</h4>` : l.startsWith('Plan') ? `<span class="pl">${esc(l)}</span>` : `<p class="${v === 'despues' && p.st !== 'publicada' ? 'new' : ''}">${esc(l)}</p>`)).join('');
    return `<div><div class="seg" style="margin-bottom:12px"><button data-act="webv" data-id="${p.id}" data-v="antes" aria-pressed="${v === 'antes'}">Antes</button><button data-act="webv" data-id="${p.id}" data-v="despues" aria-pressed="${v === 'despues'}">Con el cambio</button></div>
      <div class="web"><div class="web-bar"><i></i><i></i><i></i><span>${esc(w.url)}</span></div><div class="web-b">${body}</div></div></div>`;
  }
  function mockLeads(p) {
    return `<div class="card pad" style="box-shadow:none"><table class="leadt"><tbody>${p.leads.map(l => `<tr><td><b>${esc(l.n)}</b><small>${esc(l.k)}</small></td><td><div class="fit"><i><b style="width:${l.fit}%"></b></i>${l.fit}</div></td></tr>`).join('')}</tbody></table><p style="font-size:12.5px;color:var(--ink-3);margin-top:8px">Mostrando 5 de 10.</p></div>`;
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
      ${S.ser.inter ? `<path d="${line(per.inter, yI)}" fill="none" stroke="#FEA027" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
      <g id="hover" style="display:none"><line id="hv" class="hv" y1="${pt}" y2="${pt + ih}" x1="0" x2="0"/><circle id="hd1" r="5" fill="#0B79B0" stroke="#FFF" stroke-width="2" cx="0" cy="0"/><circle id="hd2" r="5" fill="#FEA027" stroke="#FFF" stroke-width="2" cx="0" cy="0"/></g></svg>`;
  }

  /* ---------- Vistas ---------- */
  const VIEW = {};

  VIEW.inicio = () => {
    const pend = pending(), cur = pend.length ? pend[S.stack % pend.length] : null;
    const prog = PIECES.filter(p => stOf(p) === 'programada' && offOf(p) >= 0 && offOf(p) <= 6).length;
    const per = PERIODS[7], dec = decided().length, total = pend.length + dec;
    const kp = [['Alcance', per.reach.reduce((a, b) => a + b, 0), per.kpi.reach, per.reach, '#0B79B0', 'users'], ['Interacciones', per.inter.reduce((a, b) => a + b, 0), per.kpi.inter, per.inter, '#D6336C', 'heart'], ['Visitas al sitio', per.visits.reduce((a, b) => a + b, 0), per.kpi.visits, per.visits, '#7A5AF8', 'globe'], ['Prospectos nuevos', per.leads, per.kpi.leads, per.reach.map((v, i) => 3 + (i * 5 % 4)), '#E67A1F', 'target']];
    const days = Array.from({ length: 7 }, (_, i) => {
      const iso = isoOff(i), items = PIECES.filter(p => dateOf(p) === iso && stOf(p) !== 'descartada');
      return `<div class="wd ${i === 0 ? 'today' : ''}"><small>${dfmt(iso, { weekday: 'short' })}</small><b>${new Date(iso + 'T12:00:00').getDate()}</b><div class="pcs">${items.map(p => `<button class="pc ${stOf(p) === 'revision' ? 'pend' : ''}" style="--c:${CHANNELS[p.ch].color}" data-act="cal-open" data-id="${p.id}" title="${esc(p.title)}" aria-label="${esc(p.title)}">${ico(CHANNELS[p.ch].icon)}</button>`).join('') || '<span style="color:var(--ink-3);font-size:12px">libre</span>'}</div></div>`;
    }).join('');
    const focus = cur ? `
      <div class="focus-body"><div>${preview(cur)}</div>
        <div class="focus-info"><div style="display:flex;gap:6px;flex-wrap:wrap">${chChip(cur.ch).replace('class="chip"', 'class="chip"')}<span class="chip">${esc(cur.kind)}</span>${cur.urgent ? '<span class="chip" style="background:var(--orange);color:#06304C">Urgente</span>' : ''}</div>
          <h3>${esc(cur.title)}</h3><p class="why">${esc(cur.why)}</p>
          <ul class="ev">${cur.evidence.map(e => `<li>${ico('check')}<span>${esc(e)}</span></li>`).join('')}</ul>
          <div class="focus-actions"><button class="btn pri lg" data-act="approve" data-id="${cur.id}">${ico('check')} Aprobar</button><button class="btn lg" data-act="open-changes" data-id="${cur.id}">${ico('edit')} Pedir cambios</button><button class="btn ghost lg" data-act="discard" data-id="${cur.id}" style="color:#F1FEFF">Descartar</button></div>
          <div class="hint"><span>${when(cur)}</span><span><kbd>A</kbd> aprobar</span><span><kbd>E</kbd> cambios</span><span><kbd>D</kbd> descartar</span>${pend.length > 1 ? '<button class="link" data-act="focus-next" style="color:#F1FEFF">Ver siguiente</button>' : ''}</div></div></div>`
      : `<div class="empty" style="color:#F1FEFF;padding:30px 10px"><div class="big-ico">${ico('check')}</div><b style="color:#FFF">Todo al día</b>Sami está preparando 3 ideas nuevas para el domingo de cata.<div style="margin-top:16px"><a class="btn pri" href="#/calendario">Ver el calendario</a></div></div>`;
    return `
      <div class="page-h"><div><span class="kick">${esc(dfmt(isoOff(0), { weekday: 'long', day: 'numeric', month: 'long' }))}</span><h1 class="title">${greet()}, ${esc(CLIENT.user.first)}.<br>${pend.length ? `Tienes <em>${pend.length} ${pend.length === 1 ? 'cosa' : 'cosas'}</em> por decidir.` : 'Estás <em>al día</em>.'}</h1><p class="lead">${prog} publicaciones salen esta semana. Nada se publica sin tu aprobación.</p></div>
        <button class="btn dark" data-act="agent">${ico('spark')} Hablar con Sami</button></div>
      <div class="hello"><section class="focus" aria-label="Para decidir ahora"><div class="focus-h"><div><span class="kick">Para decidir ahora</span><h2>${cur ? esc(cur.title) : 'Sin pendientes'}</h2></div><div class="stackbar" aria-hidden="true">${Array.from({ length: Math.max(total, 1) }, (_, i) => `<i class="${i < dec ? 'done' : i === dec + (S.stack % Math.max(pend.length, 1)) && cur ? 'on' : ''}"></i>`).join('')}</div></div>${focus}
          ${U.changesFor && cur && U.changesFor === cur.id ? changesBox(cur.id, true) : ''}</section>
        <div class="side-col"><section class="card pad"><div class="sec-t" style="margin:0 0 6px"><h2>En la cola</h2><a href="#/aprobaciones">Ver todo</a></div><div class="queue">${pend.filter(p => !cur || p.id !== cur.id).slice(0, 4).map(p => `<button class="q-row" data-act="goto-piece" data-id="${p.id}">${chDot(p.ch, 'sm')}<span><b>${esc(p.title)}</b><small>${esc(p.kind)} · ${when(p)}</small></span></button>`).join('') || '<div style="color:var(--ink-3);padding:10px 4px">No hay nada más esperando.</div>'}</div></section>
          <section class="card pad"><div class="sec-t" style="margin:0 0 10px"><h2>Ideas de Sami</h2></div><div class="sugg">${[['Una historia con la cara de Julián', 'Las historias con él tienen más respuestas', 'Prepara una historia con Julián para el jueves'], ['Responder a 3 comentarios sin contestar', 'Sami deja los borradores listos', 'Prepara respuestas para mis comentarios sin contestar']].map(([a, b, q]) => `<button class="sg" data-act="ask" data-q="${esc(q)}">${ico('spark')}<span><b>${esc(a)}</b><small>${esc(b)}</small></span></button>`).join('')}</div></section></div></div>
      <div class="sec-t"><h2>Cómo vas esta semana</h2><a href="#/resultados">Ver resultados</a></div>
      <div class="kpis">${kp.map(([l, v, d, s, c, ic]) => `<div class="card kpi"><div class="lab">${ico(ic, 'sm')} ${l}</div><div class="val">${nf(v)}</div><span class="delta up">${ico('up', 'sm')} ${d} %</span>${spark(s, c)}</div>`).join('')}</div>
      <div class="sec-t"><h2>Los próximos 7 días</h2><a href="#/calendario">Abrir calendario</a></div><div class="week">${days}</div>
      <div class="sec-t"><h2>Sami está trabajando</h2></div><section class="card pad"><div class="feed" id="feed">${feedHTML()}</div></section>`;
  };
  const feedHTML = () => ACTIVITY.map((a, i) => `<div class="f-row ${a.live ? 'now' : ''}"><span class="f-ico">${ico(a.live ? 'spark' : a.icon || 'check', 'sm')}</span><div><b>${esc(a.live ? LIVE_STATES[U.live % LIVE_STATES.length] : a.t)}</b><small>${a.live ? 'ahora' : a.when}</small></div></div>`).join('');

  function changesBox(id, dark) {
    return `<div class="changes" style="margin-top:16px"><textarea id="chg-${id}" placeholder="Cuéntale a Sami qué cambiar. Ejemplo: más cercano, con la foto de la tostadora." aria-label="Qué cambios quieres"></textarea><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri sm" data-act="send-changes" data-id="${id}">${ico('send', 'sm')} Enviar a Sami</button><button class="btn sm ${dark ? '' : 'ghost'}" data-act="close-changes">Cancelar</button></div></div>`;
  }

  VIEW.aprobaciones = () => {
    const list = pending().filter(p => matchF(p, S.filter)), done = decided().slice().reverse();
    if (!S.sel || ![...list, ...done].some(p => p.id === S.sel)) S.sel = list[0] ? list[0].id : done[0] ? done[0].id : null;
    const cur = S.sel ? P(S.sel) : null, nChecked = list.filter(p => S.checked[p.id]).length;
    const row = (p, isDone) => `<div class="it ${p.id === S.sel ? 'on' : ''}" data-act="sel" data-id="${p.id}" role="button" tabindex="0" aria-label="${esc(p.title)}">${isDone ? '' : `<button class="chbox" role="checkbox" aria-checked="${!!S.checked[p.id]}" data-act="chk" data-id="${p.id}" aria-label="Seleccionar ${esc(p.title)}">${ico('check')}</button>`}${chDot(p.ch)}<div class="tx"><b>${esc(p.title)}</b><small>${esc(p.kind)}<span>${isDone ? '' : when(p)}</span>${p.urgent && !isDone ? '<span class="urg">Urgente</span>' : ''}${isDone ? `<span class="chip ${STATUS[stOf(p)].tone}" style="height:20px">${STATUS[stOf(p)].label}</span>` : ''}</small></div>${ico('right', 'sm')}</div>`;
    const detail = cur ? detailHTML(cur) : `<div class="empty"><div class="big-ico">${ico('check')}</div><b>Todo al día</b>No hay nada esperando tu decisión. Sami te avisa cuando haya algo nuevo.</div>`;
    return `<div class="page-h"><div><span class="kick">Aprobaciones</span><h1 class="title">Lo que Sami necesita <em>de ti</em></h1><p class="lead">Revisa, aprueba o pide cambios. Con el teclado: <kbd>J</kbd> <kbd>K</kbd> para moverte, <kbd>A</kbd> aprobar, <kbd>E</kbd> cambios, <kbd>D</kbd> descartar.</p></div></div>
      <div class="tools">${FILTERS.map(([k, l]) => `<button class="chbtn" aria-pressed="${S.filter === k}" data-act="filter" data-f="${k}">${l}${k === 'todas' ? ` <b style="font-family:var(--f-num)">${pending().length}</b>` : ''}</button>`).join('')}</div>
      <div class="inbox ${U.detailOpen ? 'show-detail' : ''}"><div class="list-col"><div class="card list">${list.map(p => row(p, false)).join('') || '<div class="empty" style="padding:28px 16px"><b>Nada en esta categoría</b>Prueba con otro filtro.</div>'}</div>
          ${nChecked ? `<div class="bulk"><span><b>${nChecked}</b> seleccionadas</span><span style="display:flex;gap:8px"><button class="btn sm ghost" style="color:#FFF" data-act="clear-sel">Limpiar</button><button class="btn pri sm" data-act="bulk-approve">${ico('check', 'sm')} Aprobar ${nChecked}</button></span></div>` : ''}
          ${done.length ? `<div class="sec-t" style="margin:22px 0 8px"><h2 style="font-size:16px">Ya decididas</h2></div><div class="card list">${done.map(p => row(p, true)).join('')}</div>` : ''}</div>
        <div class="detail-col"><div class="card detail" id="detail">${detail}</div></div></div>`;
  };
  function detailHTML(p) {
    const st = stOf(p), isP = st === 'revision', steps = ['borrador', 'revision', 'aprobada', 'programada', 'publicada'], idx = Math.max(steps.indexOf(st === 'cambios' ? 'borrador' : st), 0);
    const labs = ['Borrador', 'Tu decisión', 'Aprobada', 'Programada', 'Publicada'];
    return `<button class="btn ghost sm back" data-act="back">${ico('left', 'sm')} Volver a la lista</button>
      <div class="detail-h"><div><div style="display:flex;gap:6px;flex-wrap:wrap">${chChip(p.ch)}<span class="chip">${esc(p.kind)}</span><span class="chip ${STATUS[st].tone}">${STATUS[st].label}</span></div><h2>${esc(p.title)}</h2><div style="color:var(--ink-2);margin-top:4px">${dateOf(p) ? `${longDate(dateOf(p))} · ${t12(p.time)}` : 'Sin fecha: se agenda cuando hables con la lista'}</div></div></div>
      <div class="detail-grid"><div class="prev">${preview(p)}</div>
        <div><div class="why-box"><b>${ico('spark', 'sm')} Por qué lo propone Sami</b>${esc(p.why)}</div><div class="evs">${(p.evidence || []).map(e => `<span class="chip">${ico('check', 'sm')} ${esc(e)}</span>`).join('')}</div>
          ${isP ? `<div class="acts"><button class="btn pri lg" data-act="approve" data-id="${p.id}">${ico('check')} Aprobar</button><button class="btn lg" data-act="open-changes" data-id="${p.id}">${ico('edit')} Pedir cambios</button><button class="btn ghost bad lg" data-act="discard" data-id="${p.id}">Descartar</button></div>` : `<div class="acts"><button class="btn" data-act="reopen" data-id="${p.id}">${ico('undo', 'sm')} Volver a decidir</button></div>`}
          ${U.changesFor === p.id ? changesBox(p.id) : ''}
          ${notesOf(p).length ? `<div class="thread">${notesOf(p).map(n => `<div class="cm"><small>Tú · ahora</small>${esc(n)}</div>`).join('')}<div class="cm" style="background:var(--ok-bg)"><small>Sami</small>Recibido. Te aviso cuando la nueva versión esté lista.</div></div>` : ''}
          <div class="stepper" aria-label="Estado">${labs.map((l, i) => `<span class="${i < idx ? 'done' : i === idx ? 'cur' : ''}"><i class="dotc"></i>${l}</span>`).join('')}</div></div></div>`;
  }

  VIEW.calendario = () => {
    const base = new Date(TODAY.getFullYear(), TODAY.getMonth() + S.calMonth, 1), first = (base.getDay() + 6) % 7;
    const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate(), rows = Math.ceil((first + dim) / 7);
    const vis = p => S.calCh[p.ch] && stOf(p) !== 'descartada';
    let cells = '';
    for (let i = 0; i < rows * 7; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), 1 - first + i), iso = isoOf(d), out = d.getMonth() !== base.getMonth();
      const items = PIECES.filter(p => dateOf(p) === iso && vis(p)), past = d < TODAY, show = items.slice(0, 3);
      cells += `<div class="day ${out ? 'out' : ''} ${iso === isoOff(0) ? 'today' : ''}" data-iso="${iso}"><span class="num">${d.getDate()}</span>${!past ? `<button class="add" data-act="cal-add" data-iso="${iso}" aria-label="Pedirle a Sami algo para el ${longDate(iso)}">${ico('plus')}</button>` : ''}
        ${show.map(p => `<button class="ev-chip ${stOf(p) === 'revision' ? 'pend' : ''} ${stOf(p) === 'publicada' ? 'pub' : ''}" style="--c:${CHANNELS[p.ch].color}" draggable="${stOf(p) !== 'publicada'}" data-act="cal-open" data-id="${p.id}" title="${esc(p.title)}"><i class="d"></i><span>${esc(p.title)}</span></button>`).join('')}${items.length > 3 ? `<button class="more" data-act="cal-open" data-id="${items[3].id}">+${items.length - 3} más</button>` : ''}</div>`;
    }
    const upcoming = PIECES.filter(p => dateOf(p) && offOf(p) >= 0 && vis(p)).sort((a, b) => offOf(a) - offOf(b));
    const groups = {}; upcoming.forEach(p => { const k = offOf(p) < 7 ? 'Esta semana' : offOf(p) < 14 ? 'La próxima semana' : 'Más adelante'; (groups[k] = groups[k] || []).push(p); });
    const agenda = Object.keys(groups).map(k => `<div class="g"><h3>${k}</h3><div class="card list">${groups[k].map(p => `<button class="it" data-act="cal-open" data-id="${p.id}">${chDot(p.ch)}<div class="tx"><b>${esc(p.title)}</b><small>${esc(p.kind)}<span>${longDate(dateOf(p))} · ${t12(p.time)}</span></small></div><span class="chip ${STATUS[stOf(p)].tone}">${STATUS[stOf(p)].label}</span></button>`).join('')}</div></div>`).join('') || '<div class="empty"><b>Sin publicaciones próximas</b></div>';
    return `<div class="page-h"><div><span class="kick">Calendario</span><h1 class="title">Todo lo que sale, <em>en un solo lugar</em></h1><p class="lead">Arrastra una pieza para cambiarle el día. Pasa el mouse por un día libre y pídele algo a Sami.</p></div>
        <div class="seg"><button data-act="cal-view" data-v="mes" aria-pressed="${S.calView === 'mes'}">${ico('grid', 'sm')} Mes</button><button data-act="cal-view" data-v="lista" aria-pressed="${S.calView === 'lista'}">${ico('list', 'sm')} Lista</button></div></div>
      <div class="tools">${Object.keys(CHANNELS).map(k => `<button class="chbtn" style="--c:${CHANNELS[k].color}" aria-pressed="${S.calCh[k]}" data-act="cal-ch" data-ch="${k}"><i class="d"></i>${CHANNELS[k].label}</button>`).join('')}</div>
      ${S.calView === 'mes' ? `<div class="cal-h"><div class="cal-nav"><button class="icon-btn" data-act="cal-prev" aria-label="Mes anterior">${ico('left')}</button><h2>${(m => m.charAt(0).toUpperCase() + m.slice(1))(new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(base))}</h2><button class="icon-btn" data-act="cal-next" aria-label="Mes siguiente">${ico('right')}</button></div><button class="btn sm" data-act="cal-today">Hoy</button></div>
      <div class="card cal"><div class="dow">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => `<div>${d}</div>`).join('')}</div><div class="days">${cells}</div></div>` : `<div class="agenda">${agenda}</div>`}`;
  };

  VIEW.resultados = () => {
    const per = PERIODS[S.period], sum = a => a.reduce((x, y) => x + y, 0), k = per.kpi;
    const cards = [['Alcance', sum(per.reach), k.reach, per.reach, '#0B79B0', 'users'], ['Interacciones', sum(per.inter), k.inter, per.inter, '#D6336C', 'heart'], ['Visitas al sitio', sum(per.visits), k.visits, per.visits, '#7A5AF8', 'globe'], ['Prospectos nuevos', per.leads, k.leads, per.reach.map((v, i) => 4 + (i * 7 % 5)), '#E67A1F', 'target']];
    return `<div class="page-h"><div><span class="kick">Resultados</span><h1 class="title">Qué está <em>funcionando</em></h1><p class="lead">Sami lee tus números y te cuenta lo importante, sin tablas de más.</p></div>
        <div class="seg">${Object.keys(PERIODS).map(n => `<button data-act="period" data-n="${n}" aria-pressed="${S.period === n}">${PERIODS[n].label}</button>`).join('')}</div></div>
      <div class="kpis">${cards.map(([l, v, d, s, c, ic]) => `<div class="card kpi"><div class="lab">${ico(ic, 'sm')} ${l}</div><div class="val">${nf(v)}</div><span class="delta up">${ico('up', 'sm')} ${d} %</span>${spark(s, c)}</div>`).join('')}</div>
      <section class="card chart-card" style="margin-top:16px"><div class="chart-top"><div><b style="font-family:var(--f-display);font-weight:900;font-size:18px">Alcance e interacciones</b><div style="color:var(--ink-3);font-size:13px">Pasa el mouse sobre la gráfica para ver cada día.</div></div>
        <div class="legend"><button class="chbtn" style="--c:#0B79B0" aria-pressed="${S.ser.reach}" data-act="ser" data-k="reach"><i class="d"></i>Alcance</button><button class="chbtn" style="--c:#FEA027" aria-pressed="${S.ser.inter}" data-act="ser" data-k="inter"><i class="d"></i>Interacciones</button></div></div><div class="chart-wrap" id="chartwrap" style="position:relative">${chartSVG(per)}<div class="tip" id="tip" hidden></div></div></section>
      <div class="sec-t"><h2>Lo que Sami aprendió de tus números</h2></div>
      <div class="three">${INSIGHTS.map(i => `<article class="card ins"><span class="ib">${ico(i.icon)}</span><b>${esc(i.t)}</b><p>${esc(i.d)}</p><button class="btn sm" data-act="ask" data-q="${esc(i.ask)}">${ico('spark', 'sm')} ${esc(i.cta)}</button></article>`).join('')}</div>
      <div class="two" style="margin-top:16px"><section class="card pad"><div class="sec-t" style="margin:0 0 14px"><h2>Dónde te encuentran</h2></div><div class="bars">${CHANNEL_SPLIT.map(([c, v]) => `<div class="brow"><span>${CHANNELS[c].label}</span><div class="tr"><i style="width:${v}%;--c:${CHANNELS[c].color}"></i></div><span>${v} %</span></div>`).join('')}</div></section>
        <section class="card pad"><div class="sec-t" style="margin:0 0 14px"><h2>De seguidor a cliente</h2></div><div class="funnel">${FUNNEL.map(([l, v], i) => `<div class="fn" style="--c:${['#0B79B0', '#0E8390', '#25A8B3', '#E67A1F'][i]};width:${100 - i * 14}%">${l}<b>${v}</b></div>`).join('')}</div></section></div>
      <section class="card pad" style="margin-top:16px"><div class="sec-t" style="margin:0 0 10px"><h2>Cómo te busca la gente en Google</h2><span class="chip">Datos de ejemplo</span></div><table class="kw"><thead><tr><th>Búsqueda</th><th>Puesto</th><th>Cambio</th><th>Búsquedas al mes</th></tr></thead><tbody>${KEYWORDS.map(w => `<tr><td>${esc(w.k)}</td><td>${w.pos}</td><td><span class="mv ${w.was > w.pos ? 'up' : 'dn'}">${w.was > w.pos ? ico('up') + ' ' + (w.was - w.pos) : w.was === w.pos ? '=' : ico('down') + ' ' + (w.pos - w.was)}</span></td><td>${nf(w.vol)}</td></tr>`).join('')}</tbody></table></section>`;
  };

  VIEW.marca = () => {
    const porRev = MEMORY.filter(m => memSt(m) === 'por-revisar').length;
    const kit = `<div class="two"><section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>Identidad</h2></div><div class="logo-box"><b>Café Alba</b></div>
        <div class="sec-t" style="margin:18px 0 10px"><h3 style="font-family:var(--f-display);font-weight:900;font-size:16px">Colores</h3><span style="color:var(--ink-3);font-size:13px">Toca para copiar</span></div><div class="swatches">${BRAND.colors.map(([n, h]) => `<button class="sw" data-act="copy" data-v="${h}" style="--c:${h}"><i></i><span>${n}</span><small>${h}</small></button>`).join('')}</div>
        <div class="sec-t" style="margin:18px 0 10px"><h3 style="font-family:var(--f-display);font-weight:900;font-size:16px">Tipografías</h3></div>${BRAND.fonts.map(([a, b, c]) => `<div class="nrow"><span><b>${a}</b><br><small style="color:var(--ink-3);font-weight:600">${c}</small></span><span style="font-family:var(--f-display);font-weight:900;font-size:20px">${b}</span></div>`).join('')}</section>
      <div class="grid"><section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>Cómo habla tu marca</h2></div><ul style="margin:0 0 14px;padding-left:18px;color:var(--ink-2)">${BRAND.voice.map(v => `<li>${esc(v)}</li>`).join('')}</ul><div class="dd"><div><h4>${ico('check', 'sm')} Sí</h4><ul>${BRAND.dos.map(v => `<li>${esc(v)}</li>`).join('')}</ul></div><div class="no"><h4>${ico('x', 'sm')} No</h4><ul>${BRAND.donts.map(v => `<li>${esc(v)}</li>`).join('')}</ul></div></div></section>
        <section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>Plantillas</h2></div><div class="tpls">${[['Lanzamiento', 'navy'], ['Origen', 'teal'], ['Anuncio', 'orange']].map(([n, t]) => `<div class="tpl slide ${t}" style="aspect-ratio:1;padding:14px"><span style="font-size:12px;font-weight:600;opacity:.8">Plantilla</span>${n}</div>`).join('')}</div></section></div></div>`;
    const mem = `<section class="card pad"><div class="teach"><input id="teach" type="text" placeholder="Enséñale algo a Sami. Ejemplo: los viernes publicamos las cosechas nuevas" aria-label="Enséñale algo a Sami"><button class="btn pri" data-act="teach">${ico('plus', 'sm')} Enseñar</button></div>
      ${MEMORY.concat((S.mtk.extra || []).map((t, i) => ({ id: 'x' + i, t, src: 'Lo indicaste tú', st: 'confirmada', when: 'ahora' }))).map(m => { const st = memSt(m); return st === 'olvidada' ? '' : `<div class="mem"><span class="ib" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;flex:none;background:${st === 'confirmada' ? 'var(--ok-bg);color:var(--ok)' : 'var(--warn-bg);color:var(--warn)'}">${ico(st === 'confirmada' ? 'check' : 'book')}</span><div class="tx"><b>${esc(m.t)}</b><small>${esc(m.src)} · ${m.when}</small>${st === 'por-revisar' ? `<div class="btns"><button class="btn sm" data-act="memo" data-id="${m.id}" data-v="confirmada">${ico('check', 'sm')} Confirmar</button><button class="btn sm ghost bad" data-act="memo" data-id="${m.id}" data-v="olvidada">Olvidar</button></div>` : `<div class="btns"><button class="btn sm ghost" data-act="memo" data-id="${m.id}" data-v="olvidada">Olvidar</button></div>`}</div><span class="chip ${st === 'confirmada' ? 'ok' : 'warn'}">${st === 'confirmada' ? 'Confirmada' : 'Por revisar'}</span></div>`; }).join('')}</section>`;
    return `<div class="page-h"><div><span class="kick">Marca y memoria</span><h1 class="title">Lo que Sami <em>sabe de tu marca</em></h1><p class="lead">Todo lo que ves aquí lo usa Sami antes de escribir una sola palabra. Tú siempre tienes la última palabra.</p></div>
        <div class="seg"><button data-act="marca-tab" data-v="kit" aria-pressed="${S.marcaTab === 'kit'}">Kit de marca</button><button data-act="marca-tab" data-v="memoria" aria-pressed="${S.marcaTab === 'memoria'}">Lo que aprendió${porRev ? ` <span class="chip warn" style="height:20px;padding:0 7px">${porRev}</span>` : ''}</button></div></div>${S.marcaTab === 'kit' ? kit : mem}`;
  };
  const memSt = m => S.memo[m.id] || m.st;

  VIEW.agente = () => {
    const tabs = [['chat', 'Conversación'], ['act', 'Actividad'], ['meet', 'Reuniones']];
    let body = '';
    if (S.agentTab === 'chat') body = `<div class="agent-grid"><section class="card chatbox"><div class="msgs" id="msgs-page">${chatHTML()}</div>${sugsHTML()}<form class="chat-in" data-form="chat"><input name="q" type="text" placeholder="Pídele algo a Sami" autocomplete="off" aria-label="Mensaje para Sami"><button class="btn pri" type="submit" aria-label="Enviar">${ico('send')}</button></form></section>
      <section class="card pad"><div class="sec-t" style="margin:0 0 10px"><h2>Qué hace Sami por ti</h2></div><div class="feed">${[['image', 'Crea tus piezas con tu marca'], ['calendar', 'Agenda y publica cuando tú apruebas'], ['search', 'Investiga en Google y mira tus números'], ['mail', 'Ordena el correo y prepara respuestas'], ['video', 'Resume tus reuniones de Meet']].map(([i, t]) => `<div class="f-row"><span class="f-ico">${ico(i, 'sm')}</span><div><b>${t}</b></div></div>`).join('')}</div><a class="btn" style="margin-top:12px;width:100%" href="#/ajustes">${ico('shield', 'sm')} Qué puede hacer sin preguntarte</a></section></div>`;
    else if (S.agentTab === 'act') body = `<section class="card pad"><div class="feed" id="feed">${feedHTML()}</div></section>`;
    else body = `<div class="grid">${MEETINGS.map(m => `<article class="card meet"><h3>${esc(m.t)}</h3><small>${esc(m.d)} · Google Meet · grabada con aviso</small><ul>${m.sum.map(s => `<li>${esc(s)}</li>`).join('')}</ul><div style="margin-top:12px">${m.tasks.map((t, i) => { const k = m.id + i, on = !!S.mtk[k]; return `<button class="tk" role="checkbox" aria-checked="${on}" data-act="tk" data-k="${k}"><span class="chbox" style="pointer-events:none;${on ? 'background:var(--blue);border-color:var(--blue)' : ''}">${ico('check')}</span><span>${esc(t)}</span></button>`; }).join('')}</div></article>`).join('')}</div>`;
    return `<div class="page-h"><div><span class="kick">${esc(CLIENT.agent.role)}</span><h1 class="title">Habla con <em>${esc(CLIENT.agent.name)}</em></h1><p class="lead">Pídele algo con tus palabras. También lo puedes hacer por Telegram, en @CafeAlba_bot.</p></div></div>
      <div class="seg" style="margin-bottom:16px">${tabs.map(([k, l]) => `<button data-act="agent-tab" data-v="${k}" aria-pressed="${S.agentTab === k}">${l}</button>`).join('')}</div>${body}`;
  };

  VIEW.ajustes = () => {
    const au = a => S.au[a.id] || a.def;
    const cons = { aprobar: 'Sami prepara todo y espera tu botón Aprobar.', avisar: 'Sami lo hace y te avisa enseguida, con opción de deshacer.', libre: 'Sami lo hace sin avisarte. Lo verás en el registro de actividad.' };
    return `<div class="page-h"><div><span class="kick">Ajustes</span><h1 class="title">Tú decides <em>cuánto hace Sami solo</em></h1><p class="lead">Empieza pidiendo aprobación en todo. Cuando confíes, suelta el control poco a poco.</p></div></div>
      <div class="set-grid"><div class="grid"><section class="card pad"><div class="sec-t" style="margin:0 0 4px"><h2>Autonomía</h2></div>${AUTONOMY.map(a => `<div class="au"><div class="au-h"><span><b>${a.t}</b><small>${a.d}</small></span>${a.locked ? `<span class="chip">${ico('lock', 'sm')} Siempre con aprobación</span>` : ''}</div><div class="lvls" role="radiogroup" aria-label="${a.t}">${AUTONOMY_LEVELS.map(([k, l]) => `<button class="lvl" role="radio" aria-checked="${au(a) === k}" data-act="au" data-id="${a.id}" data-v="${k}" ${a.locked && k !== 'aprobar' ? 'disabled' : ''}>${l}</button>`).join('')}</div><p class="cons">${cons[au(a)]}</p></div>`).join('')}</section>
        <section class="card pad"><div class="sec-t" style="margin:0 0 10px"><h2>Conexiones</h2></div><div class="conns">${CONNECTIONS.map(c => { const on = c.id in S.conns ? S.conns[c.id] : c.on; return `<div class="cn ${on ? '' : 'off'}"><span class="ib">${ico(c.icon)}</span><div><b>${c.name}</b><small>${on ? c.sub : c.soon ? 'Próximamente' : 'Sin conectar'}</small></div>${c.soon ? '<span class="chip" style="margin-left:auto">Pronto</span>' : `<button class="btn sm ${on ? 'ghost' : ''}" data-act="conn" data-id="${c.id}">${on ? 'Conectada' : 'Conectar'}</button>`}</div>`; }).join('')}</div></section></div>
        <div class="grid"><section class="plan"><span class="kick">Tu plan</span><b>${CLIENT.plan.name}</b><p>Marca, piezas de redes, sitio web, correo e investigación. Reuniones y SEO como complementos.</p><button class="btn pri" data-act="toast" data-m="Esta es una vista previa: aquí se compararían los planes.">Ver planes</button></section>
          <section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>Uso de este mes</h2></div>${USAGE.map(([l, a, b]) => `<div class="meter"><div class="t"><span>${l}</span><span>${a} de ${b}</span></div><div class="tr"><i style="width:${a / b * 100}%"></i></div></div>`).join('')}</section>
          <section class="card pad"><div class="sec-t" style="margin:0 0 6px"><h2>Avisos</h2></div>${NOTIFS.map(([k, l, d]) => { const on = k in S.notifs ? S.notifs[k] : d; return `<div class="nrow"><span>${l}</span><button class="switch" role="switch" aria-checked="${on}" aria-label="${l}" data-act="notif" data-id="${k}"></button></div>`; }).join('')}</section>
          <button class="btn" data-act="reset">${ico('undo', 'sm')} Restablecer la demo</button></div></div>`;
  };

  VIEW.mas = () => `<div class="page-h"><div><span class="kick">Más</span><h1 class="title">Todo <em>el panel</em></h1></div></div><div class="grid">${[['marca', 'brand', 'Marca y memoria', 'Lo que Sami sabe de tu marca'], ['agente', 'spark', 'Sami, tu agente', 'Conversación, actividad y reuniones'], ['ajustes', 'gear', 'Ajustes', 'Autonomía, conexiones y plan']].map(([r, i, t, d]) => `<a class="card pad" href="#/${r}" style="display:flex;gap:14px;align-items:center;text-decoration:none"><span class="ib" style="width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--info-bg);color:var(--info)">${ico(i)}</span><span><b style="font-family:var(--f-display);font-weight:900;font-size:17px">${t}</b><br><small style="color:var(--ink-3);font-weight:600">${d}</small></span></a>`).join('')}</div>`;

  /* ---------- Chat de Sami ---------- */
  function ensureChat() { if (!S.chat.length) S.chat = [{ r: 'ag', t: `${greet()}, ${CLIENT.user.first}. Soy ${CLIENT.agent.name}. Pídeme lo que necesites: posts, correos, ideas o un resumen de tus números. Nada sale al público sin tu aprobación.` }]; }
  const chatHTML = () => { ensureChat(); return S.chat.map(m => `<div class="bub ${m.r === 'me' ? 'me' : 'ag'}">${esc(m.t)}${m.go ? `<br><a class="btn sm go" href="#/${m.go[0]}" data-act="close-layers">${m.go[1]} ${ico('arrow', 'sm')}</a>` : ''}</div>`).join('') + (U.typing ? '<div class="bub ag"><span class="typing"><i></i><i></i><i></i></span></div>' : ''); };
  const sugsHTML = () => (S.chat.length <= 1 ? `<div class="sugs">${SUGGESTED.map(s => `<button class="chbtn" data-act="ask" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>` : '');
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

  /* ---------- Capas: hoja de detalle, agente y buscador ---------- */
  function renderLayers() {
    let html = '';
    if (U.sheet) {
      const p = P(U.sheet), st = stOf(p), d = dateOf(p);
      html += `<div class="sheet-bg" data-act="close-layers"></div><aside class="sheet" role="dialog" aria-label="${esc(p.title)}"><button class="icon-btn sheet-x" data-act="close-layers" aria-label="Cerrar">${ico('x')}</button>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${chChip(p.ch)}<span class="chip ${STATUS[st].tone}">${STATUS[st].label}</span></div><h2 style="font-family:var(--f-display);font-weight:900;font-size:24px;line-height:1.1;margin-bottom:6px;padding-right:44px">${esc(p.title)}</h2><div style="color:var(--ink-2);margin-bottom:16px">${esc(p.kind)}</div>
        <div class="prev">${preview(p)}</div>
        ${st !== 'publicada' && st !== 'descartada' ? `<div style="margin-top:16px"><label for="resch" style="font-weight:700;font-size:14px;display:block;margin-bottom:6px">Cambiar el día</label><input id="resch" type="date" value="${d || ''}" min="${isoOff(0)}" style="height:44px;border-radius:12px;border:1.5px solid var(--line);padding:0 12px;background:var(--surface);width:100%"></div>` : ''}
        ${p.metrics ? `<div class="evs" style="margin-top:16px"><span class="chip">${nf(p.metrics.reach)} personas alcanzadas</span><span class="chip">${nf(p.metrics.likes)} me gusta</span><span class="chip">${nf(p.metrics.saves)} guardados</span></div>` : ''}
        <div class="acts">${st === 'revision' ? `<button class="btn pri lg" data-act="approve" data-id="${p.id}">${ico('check')} Aprobar</button><button class="btn lg" data-act="goto-piece" data-id="${p.id}">${ico('edit')} Pedir cambios</button>` : `<button class="btn" data-act="close-layers">Cerrar</button>`}</div></aside>`;
    }
    if (U.drawer) {
      html += `<div class="drawer-bg" data-act="close-layers"></div><aside class="drawer" role="dialog" aria-label="Conversación con Sami"><div class="drawer-h"><span class="sami">${ico('spark')}</span><div><b>${esc(CLIENT.agent.name)}</b><small>${esc(CLIENT.agent.role)} · en línea</small></div><button class="icon-btn" style="margin-left:auto" data-act="close-layers" aria-label="Cerrar">${ico('x')}</button></div>
        <div class="msgs" id="msgs-drawer" style="flex:1">${chatHTML()}</div>${sugsHTML()}<form class="chat-in" data-form="chat"><input id="drawer-in" name="q" type="text" placeholder="Pídele algo a Sami" autocomplete="off" aria-label="Mensaje para Sami"><button class="btn pri" type="submit" aria-label="Enviar">${ico('send')}</button></form></aside>`;
    }
    if (U.pal) {
      const items = palItems(U.palQ);
      html += `<div class="palette-bg" data-act="pal-bg"><div class="palette" role="dialog" aria-label="Buscar o pedir"><div class="pal-in">${ico('search')}<input id="pal-in" type="text" value="${esc(U.palQ)}" placeholder="Busca o pídele algo a Sami" autocomplete="off" aria-label="Buscar o pedir"></div>
        <div class="pal-list">${items.map((it, i) => (it.g ? `<div class="pal-g">${it.g}</div>` : `<button class="pal-i ${i === U.palI ? 'on' : ''}" data-act="pal-run" data-i="${i}">${ico(it.icon)}<span>${esc(it.t)}</span>${it.hint ? `<small>${esc(it.hint)}</small>` : ''}</button>`)).join('')}</div>
        <div class="pal-ft"><span><kbd>↑</kbd> <kbd>↓</kbd> moverte</span><span><kbd>Enter</kbd> elegir</span><span><kbd>Esc</kbd> cerrar</span></div></div></div>`;
    }
    $('#layer').innerHTML = html;
  }
  function palItems(q) {
    const nav = ROUTES.concat([{ id: 'ajustes', label: 'Ajustes', icon: 'gear' }]).map(r => ({ icon: r.icon, t: 'Ir a ' + r.label, run: () => go(r.id) }));
    const acts = [
      { icon: 'check', t: 'Aprobar todo lo urgente', run: () => { const u = pending().filter(p => p.urgent); u.forEach(p => decide(p.id, 'approve', null, true)); toast(u.length ? `Aprobaste ${u.length} urgente${u.length > 1 ? 's' : ''}` : 'No hay urgentes'); render(true); } },
      { icon: document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', t: 'Cambiar modo claro u oscuro', run: toggleTheme },
      { icon: 'undo', t: 'Restablecer la demo', run: resetDemo }
    ];
    const ql = q.trim().toLowerCase(), f = a => !ql || a.t.toLowerCase().includes(ql);
    const out = [];
    const ask = ql ? [{ icon: 'spark', t: `Pedirle a Sami: «${q.trim()}»`, hint: 'Enter', run: () => ask_(q.trim()) }] : [];
    if (ask.length) out.push({ g: 'Pedir' }, ...ask);
    const pcs = PIECES.filter(p => ql && p.title.toLowerCase().includes(ql)).slice(0, 4).map(p => ({ icon: CHANNELS[p.ch].icon, t: p.title, hint: STATUS[stOf(p)].label, run: () => { U.pal = false; U.sheet = p.id; renderLayers(); } }));
    if (pcs.length) out.push({ g: 'Piezas' }, ...pcs);
    const n = nav.filter(f), a = acts.filter(f);
    if (n.length) out.push({ g: 'Ir a' }, ...n);
    if (a.length) out.push({ g: 'Acciones' }, ...a);
    out.forEach(o => { o.__i = out.indexOf(o); });
    return out;
  }
  const ask_ = q => { closeLayers(); ask(q); };
  function openPalette(q = '') { U.pal = true; U.palQ = q; U.palI = firstSel(); renderLayers(); setTimeout(() => { const i = $('#pal-in'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 0); }
  const firstSel = () => { const it = palItems(U.palQ); const i = it.findIndex(x => !x.g); return i < 0 ? 0 : i; };
  function openDrawer(prefill) { U.drawer = true; U.sheet = null; U.pal = false; ensureChat(); renderLayers(); setTimeout(() => { const i = $('#drawer-in'); if (i) { if (prefill) i.value = prefill; i.focus(); } const m = $('#msgs-drawer'); if (m) m.scrollTop = m.scrollHeight; }, 0); }
  function closeLayers() { U.sheet = null; U.drawer = false; U.pal = false; renderLayers(); }
  const anyLayer = () => U.sheet || U.drawer || U.pal;

  /* ---------- Acciones ---------- */
  function decide(id, kind, note, silent) {
    const p = P(id), prev = S.pc[id] ? clone(S.pc[id]) : null;
    const st = kind === 'approve' ? (dateOf(p) ? 'programada' : 'aprobada') : kind === 'changes' ? 'cambios' : 'descartada';
    S.pc[id] = Object.assign({}, S.pc[id] || {}, { st }); if (note) S.pc[id].notes = (S.pc[id].notes || []).concat(note);
    delete S.checked[id]; if (U.changesFor === id) U.changesFor = null; save();
    if (!silent) {
      const msg = kind === 'approve' ? (st === 'programada' ? `Aprobado. Sale ${rel(offOf(p))} a las ${t12(p.time)}` : 'Aprobado') : kind === 'changes' ? 'Sami recibió tus cambios' : 'Descartado';
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
      reopen: () => { const prev = S.pc[id]; delete S.pc[id]; save(); S.sel = id; render(true); toast('Volvió a la cola'); },
      'open-changes': () => { U.changesFor = id; S.sel = id; render(true); setTimeout(() => { const t = $('#chg-' + id); if (t) t.focus(); }, 0); },
      'close-changes': () => { U.changesFor = null; render(true); },
      'send-changes': () => { const t = $('#chg-' + id), v = t ? t.value.trim() : ''; if (!v) { toast('Escribe qué quieres cambiar'); return; } decide(id, 'changes', v); render(true); },
      'focus-next': () => { S.stack++; render(true); },
      'goto-piece': () => { S.sel = id; S.filter = 'todas'; U.sheet = null; U.changesFor = null; U.detailOpen = true; save(); if (location.hash !== '#/aprobaciones') go('aprobaciones'); else render(true); },
      'bulk-approve': () => { const ids = pending().filter(p => S.checked[p.id]).map(p => p.id), prevs = ids.map(i => [i, S.pc[i] ? clone(S.pc[i]) : null]); ids.forEach(i => decide(i, 'approve', null, true)); S.checked = {}; save(); const nx = pending()[0]; S.sel = nx ? nx.id : S.sel; render(true); toast(`Aprobaste ${ids.length} piezas`, { undo: () => { prevs.forEach(([i, pv]) => { if (pv) S.pc[i] = pv; else delete S.pc[i]; }); save(); render(true); } }); },
      'clear-sel': () => { S.checked = {}; render(true); },
      filter: () => { S.filter = el.dataset.f; S.sel = null; save(); render(true); },
      slide: () => { const p = P(id), n = p.slides.length; S.slide[id] = ((S.slide[id] || 0) + (+el.dataset.d) + n) % n; render(true); if (U.sheet) renderLayers(); },
      webv: () => { S.webv[id] = el.dataset.v; render(true); if (U.sheet) renderLayers(); },
      back: () => { U.detailOpen = false; render(true); },
      'cal-prev': () => { S.calMonth--; render(true); }, 'cal-next': () => { S.calMonth++; render(true); }, 'cal-today': () => { S.calMonth = 0; render(true); },
      'cal-view': () => { S.calView = el.dataset.v; save(); render(true); },
      'cal-ch': () => { S.calCh[el.dataset.ch] = !S.calCh[el.dataset.ch]; save(); render(true); },
      'cal-open': () => { U.sheet = id; U.drawer = false; U.pal = false; renderLayers(); },
      'cal-add': () => { openDrawer(`Prepara una publicación para el ${longDate(el.dataset.iso)}`); },
      period: () => { S.period = el.dataset.n; save(); render(true); },
      ser: () => { const k = el.dataset.k, o = k === 'reach' ? 'inter' : 'reach'; if (S.ser[k] && !S.ser[o]) { toast('Deja al menos una línea visible'); return; } S.ser[k] = !S.ser[k]; save(); render(true); },
      ask: () => ask(el.dataset.q),
      'marca-tab': () => { S.marcaTab = el.dataset.v; save(); render(true); },
      copy: () => { const v = el.dataset.v; if (navigator.clipboard) navigator.clipboard.writeText(v).then(() => toast(`Copiaste ${v}`), () => toast(v)); else toast(v); },
      memo: () => { S.memo[id] = el.dataset.v; save(); render(true); toast(el.dataset.v === 'confirmada' ? 'Sami lo recordará' : 'Sami lo olvidó', { undo: () => { delete S.memo[id]; save(); render(true); } }); },
      teach: () => { const i = $('#teach'), v = i ? i.value.trim() : ''; if (!v) { toast('Escribe lo que quieres que Sami aprenda'); return; } (S.mtk.extra = S.mtk.extra || []).push(v); save(); render(true); toast('Sami lo anotó en su memoria'); },
      'agent-tab': () => { S.agentTab = el.dataset.v; save(); render(true); },
      tk: () => { const k = el.dataset.k; S.mtk[k] = !S.mtk[k]; save(); render(true); },
      au: () => { S.au[id] = el.dataset.v; save(); render(true); },
      conn: () => { const c = CONNECTIONS.find(x => x.id === id), on = id in S.conns ? S.conns[id] : c.on; S.conns[id] = !on; save(); render(true); toast(on ? `${c.name} desconectada` : `${c.name} conectada`); },
      notif: () => { const d = NOTIFS.find(n => n[0] === id)[2], on = id in S.notifs ? S.notifs[id] : d; S.notifs[id] = !on; save(); render(true); },
      toast: () => toast(el.dataset.m)
    };
    if (acts[a]) { if (el.tagName === 'A' && a !== 'close-layers') return; acts[a](); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (anyLayer()) { closeLayers(); } return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); U.pal ? closeLayers() : openPalette(); return; }
    if (U.pal) {
      const items = palItems(U.palQ), idxs = items.map((x, i) => (x.g ? -1 : i)).filter(i => i >= 0);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const pos = idxs.indexOf(U.palI), n = idxs[(pos + (e.key === 'ArrowDown' ? 1 : -1) + idxs.length) % idxs.length]; U.palI = n; const q = $('#pal-in'); renderLayers(); const i = $('#pal-in'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); const on = $('.pal-i.on'); if (on) on.scrollIntoView({ block: 'nearest' }); return; }
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
    const p = P(id), prev = S.pc[id] ? clone(S.pc[id]) : null; const diff = Math.round((new Date(iso + 'T12:00:00') - new Date(isoOff(0) + 'T12:00:00')) / 86400000);
    if (diff < 0) { toast('No puedes mover una pieza al pasado'); return; }
    S.pc[id] = Object.assign({}, S.pc[id] || {}, { off: diff }); save(); render(true); if (U.sheet) renderLayers();
    toast(`Reprogramado para el ${longDate(iso)}`, { undo: () => { if (prev) S.pc[id] = prev; else delete S.pc[id]; save(); render(true); if (U.sheet) renderLayers(); } });
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
    tip.innerHTML = `<b>${new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(CH.per.dates[i])}</b>${S.ser.reach ? `<div><span><i style="background:#0B79B0"></i>Alcance</span><b style="margin:0">${nf(CH.per.reach[i])}</b></div>` : ''}${S.ser.inter ? `<div><span><i style="background:#FEA027"></i>Interacciones</span><b style="margin:0">${nf(CH.per.inter[i])}</b></div>` : ''}`;
  });
  document.addEventListener('mouseout', e => { if (e.target.closest && e.target.closest('#chartwrap') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#chartwrap'))) { const tip = $('#tip'); if (tip) tip.hidden = true; const hg = $('#hover'); if (hg) hg.style.display = 'none'; } });

  /* ---------- Estructura general ---------- */
  function badges() { return { aprobaciones: pending().length, marca: MEMORY.filter(m => memSt(m) === 'por-revisar').length }; }
  function renderShell() {
    const b = badges();
    $('#side').innerHTML = `<div class="side-top"><img src="../assets/logo-sam-blanco.png" alt="SAM Digital" width="88" height="34"><button class="collapse" data-act="collapse" aria-label="Contraer menú">${ico('left', 'sm')}</button></div>
      <div class="client"><span class="avatar">${CLIENT.initials}</span><div><b>${esc(CLIENT.name)}</b><small>Plan ${esc(CLIENT.plan.name)}</small></div></div>
      <nav class="nav-list" aria-label="Principal">${ROUTES.map(r => `<a class="nav ${U.route === r.id ? 'on' : ''}" href="#/${r.id}" ${U.route === r.id ? 'aria-current="page"' : ''} title="${r.label}">${ico(r.icon)}<span class="lb">${r.label}</span>${b[r.id] ? `<span class="bd">${b[r.id]}</span>` : ''}</a>`).join('')}<div class="nav-sep"></div><a class="nav ${U.route === 'ajustes' ? 'on' : ''}" href="#/ajustes" title="Ajustes">${ico('gear')}<span class="lb">Ajustes</span></a></nav>
      <div class="side-foot"><div class="tg-card">${ico('send')}<span>También por Telegram: <b>@CafeAlba_bot</b></span></div></div>`;
    $('#top').innerHTML = `<button class="cmdk" data-act="cmdk" aria-label="Buscar o pedirle algo a Sami">${ico('search')}<span>Busca o pídele algo a Sami…</span><kbd>Ctrl K</kbd></button>
      <div class="top-r"><span class="demo-tag">Vista previa</span><button class="live" data-act="agent"><i class="pulse"></i> Sami está trabajando</button><button class="icon-btn" data-act="bell" aria-label="${b.aprobaciones} cosas por decidir">${ico('bell')}${b.aprobaciones ? '<i class="dot"></i>' : ''}</button><button class="icon-btn" data-act="theme" aria-label="Cambiar modo claro u oscuro">${ico(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon')}</button><span class="avatar" style="width:40px;height:40px;font-size:13px;background:linear-gradient(135deg,#25A8B3,#0B79B0)" title="${esc(CLIENT.user.name)}">CR</span></div>`;
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
    document.title = ({ inicio: 'Inicio', aprobaciones: 'Aprobaciones', calendario: 'Calendario', resultados: 'Resultados', marca: 'Marca y memoria', agente: 'Sami', ajustes: 'Ajustes', mas: 'Más' }[U.route] || 'Panel') + ' · Panel SAM';
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
})();
