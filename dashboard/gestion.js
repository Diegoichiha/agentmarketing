/* Panel SAM · gestión: campañas, sitio web, correo, prospectos y Google.
   Son espacios para administrar (buscar, filtrar, crear, editar, pausar, mover), no bandejas de aprobación.
   Todo queda en el navegador (estado S.g) y casi todo se puede deshacer. Datos de ejemplo en data.js. */
window.GESTION = function (A) {
  'use strict';
  const { VIEW, HOOK, EXT, U, $, $$, esc, ico, clone, nf, dfmt, isoOff, save, render, renderLayers, toast, ask, P, stOf, chDot, spark, kindIcon, when, rel } = A;

  /* ---------- Estado y datos editables ---------- */
  const gs = () => { const s = A.S(); return s.g || (s.g = {}); };
  const sub = k => gs()[k] || (gs()[k] = {});
  const F = (k, d) => (k in sub('f') ? sub('f')[k] : d);
  const Q = v => sub('q')[v] || '';
  const setF = (k, v) => { sub('f')[k] = v; save(); render(true); };
  const DATA = { camp: CAMPAIGNS, page: WEB_PAGES, aud: AUDIENCES, mail: MAILS, rep: MAIL_REPLIES, lead: LEADS, kw: SEO_KW };
  const DK = ['from', 'to', 'off', 'next'];
  const ents = type => DATA[type].concat(sub('add')[type] || []).map(e => {
    const o = Object.assign({}, e, (sub('ov')[type] || {})[e.id]);
    DK.forEach(k => { if (typeof o[k] === 'number') o[k] = isoOff(o[k]); });
    return o;
  }).filter(e => !e.del);
  const ent = (type, id) => ents(type).find(e => e.id === id);
  const refresh = () => { render(true); if (U.mg) renderLayers(); };
  function patch(type, id, p, msg, quiet) {
    const ov = sub('ov'), o = ov[type] || (ov[type] = {}), prev = o[id] ? clone(o[id]) : null;
    o[id] = Object.assign({}, o[id] || {}, p); save();
    if (!quiet) refresh();
    if (msg) toast(msg, { undo: () => { const t = sub('ov')[type] || (sub('ov')[type] = {}); if (prev) t[id] = prev; else delete t[id]; save(); refresh(); } });
  }
  function addEnt(type, obj) { const a = sub('add'), id = type[0] + 'n' + Date.now().toString(36); (a[type] = a[type] || []).push(Object.assign({ id }, obj)); save(); return id; }

  /* ---------- Piezas pequeñas de interfaz ---------- */
  const dshort = iso => (iso ? dfmt(iso, { day: 'numeric', month: 'short' }) : '');
  const tag = (i, l, t = '') => `<span class="chip ${t}">${ico(i, 'sm')}${l == null || l === '' ? '' : esc(l)}</span>`;
  const sw = (on, act, attrs, label) => `<button class="switch" role="switch" aria-checked="${on}" aria-label="${esc(label)}" title="${esc(label)}" data-act="${act}" ${attrs}></button>`;
  const ib = (i, act, attrs, label, cls = '') => `<button class="icon-btn sm ${cls}" data-act="${act}" ${attrs} aria-label="${esc(label)}" title="${esc(label)}">${ico(i, 'sm')}</button>`;
  const pill = (i, html, c = '') => `<span class="pill ${c}">${ico(i, 'sm')}${html}</span>`;
  const pl = (n, one, many) => `<b>${n}</b> ${n === 1 ? one : many}`;
  const search = v => `<label class="srch">${ico('search', 'sm')}<input data-gq="${v}" type="search" placeholder="Buscar" value="${esc(Q(v))}" aria-label="Buscar" autocomplete="off"></label>`;
  const chips = (k, list, def) => `<div class="fchips" role="group">${list.map(([v, i, l, n]) => `<button class="chbtn" aria-pressed="${F(k, def) === v}" data-act="g-f" data-k="${k}" data-v="${v}" title="${esc(l)}">${i ? ico(i, 'sm') : ''}<span class="tl">${esc(l)}</span>${n != null ? `<b class="cnb">${n}</b>` : ''}</button>`).join('')}</div>`;
  const select = (k, label, opts, def, ic) => `<label class="sel" title="${esc(label)}">${ic ? ico(ic, 'sm') : ''}<select data-gs="${k}" aria-label="${esc(label)}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(F(k, def)) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
  const newBtn = (t, l) => `<button class="btn pri" data-act="g-new" data-t="${t}">${ico('plus')}<span class="nl">${l}</span></button>`;
  const head = (kick, title, pills, right) => `<div class="page-h"><div><span class="kick">${kick}</span><h1 class="title">${title}</h1>${pills ? `<div class="pills">${pills}</div>` : ''}</div>${right || ''}</div>`;
  const empty = (i, m, btn = '') => `<div class="card empty gempty"><div class="big-ico">${ico(i)}</div><b>${m}</b>${btn}</div>`;
  const stChip = p => { const s = STATUS[stOf(p)]; return `<span class="chip ${s.tone}">${ico(s.icon, 'sm')}${s.label}</span>`; };
  const sortBy = (list, key, dir = 1) => list.slice().sort((a, b) => (a[key] < b[key] ? -dir : a[key] > b[key] ? dir : 0));

  /* ---------- Campañas ---------- */
  VIEW.campanas = () => {
    const all = ents('camp'), cnt = s => all.filter(c => c.st === s).length, f = F('camp:st', 'todas'), srt = F('camp:sort', 'reciente'), q = Q('campanas').toLowerCase();
    const list = all.filter(c => (f === 'todas' ? c.st !== 'archivada' : c.st === f) && (!q || c.t.toLowerCase().includes(q)))
      .sort((a, b) => (srt === 'nombre' ? a.t.localeCompare(b.t, 'es') : srt === 'fin' ? String(a.to).localeCompare(String(b.to)) : String(b.from).localeCompare(String(a.from))));
    const solas = PIECES.filter(p => !all.some(c => (c.pcs || []).includes(p.id))).length;
    const card = c => {
      const pcs = (c.pcs || []).map(P).filter(Boolean), done = pcs.filter(p => stOf(p) === 'publicada').length, pend = pcs.filter(p => stOf(p) === 'revision').length, prog = pcs.filter(p => stOf(p) === 'programada').length;
      const chs = [...new Set(pcs.map(p => p.ch))], S_ = CAMP_ST[c.st] || CAMP_ST.activa, open = !!sub('open')[c.id], g = GOALS[c.goal] || GOALS[0];
      const ctl = c.st === 'activa' || c.st === 'pausada' ? sw(c.st === 'activa', 'g-camp-tg', `data-id="${c.id}"`, c.st === 'activa' ? 'Pausar campaña' : 'Reanudar campaña')
        : c.st === 'propuesta' ? `<button class="btn pri sm" data-act="g-camp-set" data-id="${c.id}" data-v="activa">${ico('play', 'sm')} Activar</button>${ib('x', 'g-camp-set', `data-id="${c.id}" data-v="archivada"`, 'Descartar')}`
          : `<button class="btn sm" data-act="g-camp-set" data-id="${c.id}" data-v="activa">${ico('undo', 'sm')} Reactivar</button>`;
      return `<article class="card gcard camp st-${c.st}">
        <div class="ch"><span class="ci">${ico(c.icon || 'flag')}</span><div class="gct"><b>${esc(c.t)}</b><small>${ico(g[0], 'sm')} ${esc(g[1])}</small></div>${tag(S_.icon, S_.label, S_.tone)}</div>
        <div class="gcm">${chs.map(ch => chDot(ch, 'sm')).join('')}${c.from ? tag('calendar', `${dshort(c.from)} → ${dshort(c.to)}`) : ''}${pend ? tag('inbox', pend, 'warn') : ''}${prog ? tag('clock', prog) : ''}</div>
        <div class="pr"><div class="tr"><i style="width:${pcs.length ? done / pcs.length * 100 : 0}%"></i></div><span>${done}/${pcs.length}</span></div>
        <div class="cf">${ctl}<span class="sp"></span>${ib(open ? 'up' : 'down', 'g-camp-open', `data-id="${c.id}" aria-expanded="${open}"`, 'Ver piezas')}${ib('plus', 'g-camp-add', `data-id="${c.id}"`, 'Pedirle una pieza a Sami')}${ib('edit', 'g-edit', `data-t="camp" data-id="${c.id}"`, 'Editar')}</div>
        ${open ? `<div class="cl">${pcs.map(p => `<button class="it" data-act="cal-open" data-id="${p.id}">${chDot(p.ch, 'sm')}<div class="tx"><b>${esc(p.title)}</b><small>${ico(kindIcon(p), 'sm')} ${when(p)}</small></div>${stChip(p)}</button>`).join('') || `<div class="lempty">${ico('plus', 'sm')}</div>`}</div>` : ''}
      </article>`;
    };
    return head('Campañas', 'Todo lo que mueves, <em>ordenado</em>', `${pill('play', pl(cnt('activa'), 'activa', 'activas'), 'strong')}${pill('pause', pl(cnt('pausada'), 'pausada', 'pausadas'))}${cnt('propuesta') ? pill('spark', pl(cnt('propuesta'), 'propuesta de Sami', 'propuestas de Sami')) : ''}${pill('layers', pl(solas, 'pieza suelta', 'piezas sueltas'))}`)
      + `<div class="mgbar">${search('campanas')}${chips('camp:st', [['todas', 'grid', 'Todas'], ['activa', 'play', 'Activas', cnt('activa')], ['pausada', 'pause', 'Pausadas', cnt('pausada')], ['propuesta', 'spark', 'Propuestas', cnt('propuesta')], ['archivada', 'archive', 'Archivadas', cnt('archivada')]], 'todas')}<span class="sp"></span>${select('camp:sort', 'Ordenar', [['reciente', 'Recientes'], ['nombre', 'Nombre'], ['fin', 'Termina antes']], 'reciente', 'list')}${newBtn('camp', 'Nueva')}</div>`
      + (list.length ? `<div class="gcards">${list.map(card).join('')}</div>` : empty('flag', 'Nada por aquí', newBtn('camp', 'Nueva campaña')));
  };
  EXT['g-camp-tg'] = el => { const c = ent('camp', el.dataset.id), to = c.st === 'activa' ? 'pausada' : 'activa'; patch('camp', c.id, { st: to }, to === 'pausada' ? 'Campaña pausada' : 'Campaña activa'); };
  EXT['g-camp-set'] = el => { const v = el.dataset.v; patch('camp', el.dataset.id, { st: v }, v === 'activa' ? 'Campaña activa' : 'Campaña archivada'); };
  EXT['g-camp-open'] = el => { const o = sub('open'); o[el.dataset.id] = !o[el.dataset.id]; save(); render(true); };
  EXT['g-camp-add'] = el => ask(`Agrega una pieza a la campaña «${ent('camp', el.dataset.id).t}»`);

  /* ---------- Sitio web ---------- */
  const updTxt = d => (d === 0 ? 'hoy' : d < 30 ? d + ' d' : Math.round(d / 30) + ' m');
  VIEW.web = () => {
    const all = ents('page'), f = F('web:st', 'todas'), q = Q('web').toLowerCase(), srt = F('web:sort', 'visitas');
    const sin = all.filter(p => p.st === 'viva' && !p.md), pend = all.filter(p => p.st === 'borrador' || p.st === 'revision');
    const match = p => (f === 'todas' ? true : f === 'seo' ? p.st === 'viva' && !p.md : f === 'pend' ? p.st === 'borrador' || p.st === 'revision' : p.st === f) && (!q || (p.t + p.path).toLowerCase().includes(q));
    const list = all.filter(match).sort(srt === 'nombre' ? (a, b) => a.t.localeCompare(b.t, 'es') : srt === 'reciente' ? (a, b) => a.upd - b.upd : (a, b) => b.visits - a.visits);
    const tile = (k, i, l, n, cls = '') => `<button class="stile ${cls}" aria-pressed="${f === k}" data-act="g-f" data-k="web:st" data-v="${k}" title="${l}">${ico(i)}<b>${n}</b><span>${l}</span></button>`;
    const row = p => {
      const ctl = p.st === 'viva' || p.st === 'oculta' ? `${sw(p.st === 'viva', 'g-web-tg', `data-id="${p.id}"`, p.st === 'viva' ? 'Ocultar página' : 'Poner en vivo')}<span class="swl">${WEB_ST[p.st].label}</span>`
        : p.st === 'borrador' ? `<button class="btn sm" data-act="g-web-pub" data-id="${p.id}">${ico('globe', 'sm')} Publicar</button>`
          : `<button class="btn sm" data-act="goto-piece" data-id="${p.piece}">${ico('eye', 'sm')} Ver cambios</button>`;
      return `<div class="mrow gweb ${p.st}"><div class="mc t"><span class="gmi">${ico(p.icon || 'file')}</span><div><b>${esc(p.t)}</b><small><span class="path">${esc(p.path)}</span></small></div></div>
        <div class="mc n" title="Visitas en 30 días">${p.visits ? `${ico('eye', 'sm')}<b>${nf(p.visits)}</b>` : '<span class="dim">—</span>'}</div>
        <div class="mc n" title="Posición en Google">${p.pos ? `<span class="rank">#${p.pos}</span>` : '<span class="dim">—</span>'}</div>
        <div class="mc n" title="Última edición">${ico('clock', 'sm')}<span>${updTxt(p.upd)}</span></div>
        <div class="mc n" title="Descripción para Google">${p.st === 'viva' ? (p.md ? `<span class="okc">${ico('check', 'sm')}</span>` : tag('info', 'Sin descripción', 'warn')) : '<span class="dim">—</span>'}</div>
        <div class="mc s">${ctl}</div>
        <div class="mc a">${ib('spark', 'ask', `data-q="Actualiza la página «${esc(p.t)}»"`, 'Pedirle un cambio a Sami')}${ib('edit', 'g-edit', `data-t="page" data-id="${p.id}"`, 'Editar')}</div></div>`;
    };
    return head('Sitio web', 'Tu sitio, <em>página por página</em>', `${pill('globe', esc(CLIENT.site), 'strong')}${pill('shield', 'Los cambios se revisan antes de salir')}<span class="chip">Ejemplo</span>`)
      + `<div class="stiles">${tile('todas', 'file', 'Páginas', all.length)}${tile('viva', 'globe', 'En vivo', all.filter(p => p.st === 'viva').length, 'ok')}${tile('pend', 'edit', 'Pendientes', pend.length)}${tile('oculta', 'lock', 'Ocultas', all.filter(p => p.st === 'oculta').length)}${tile('seo', 'info', 'Sin descripción', sin.length, sin.length ? 'warn' : '')}</div>`
      + `<div class="mgbar">${search('web')}${sin.length ? `<button class="btn" data-act="ask" title="Que Sami escriba las ${sin.length} descripciones que faltan" aria-label="Que Sami escriba las ${sin.length} descripciones que faltan" data-q="Escribe la descripción para Google de las ${sin.length} páginas que no la tienen">${ico('spark', 'sm')}<span class="nl">Descripciones (${sin.length})</span></button>` : ''}<span class="sp"></span>${select('web:sort', 'Ordenar', [['visitas', 'Más visitadas'], ['reciente', 'Editadas hace poco'], ['nombre', 'A–Z']], 'visitas', 'list')}${newBtn('page', 'Nueva página')}</div>`
      + (list.length ? `<div class="card mtable"><div class="mrow mhead gweb"><div class="mc t"></div><div class="mc n" title="Visitas">${ico('eye', 'sm')}</div><div class="mc n" title="Google">${ico('search', 'sm')}</div><div class="mc n" title="Edición">${ico('clock', 'sm')}</div><div class="mc n" title="SEO">${ico('shield', 'sm')}</div><div class="mc s" title="Estado">${ico('globe', 'sm')}</div><div class="mc a"></div></div>${list.map(row).join('')}</div>` : empty('globe', 'Ninguna página coincide'));
  };
  EXT['g-web-tg'] = el => { const p = ent('page', el.dataset.id), to = p.st === 'viva' ? 'oculta' : 'viva'; patch('page', p.id, { st: to }, to === 'oculta' ? 'Página oculta' : 'Página en vivo'); };
  EXT['g-web-pub'] = el => patch('page', el.dataset.id, { st: 'viva', upd: 0 }, 'Página en vivo');

  /* ---------- Correo ---------- */
  const cfg = () => Object.assign({ cap: 20, cool: 7, block: ['@competencia-ejemplo.co'] }, gs().mailcfg || {});
  const setCfg = p => { gs().mailcfg = Object.assign(cfg(), p); save(); render(true); };
  const mst = m => {
    if (m.paused) return 'pausado'; if (m.sent) return 'enviado';
    if (m.piece) { const p = P(m.piece); if (!p) return 'borrador'; const s = stOf(p); return s === 'revision' ? 'porDecidir' : s === 'programada' ? (m.auto ? 'auto' : 'programado') : s === 'publicada' ? 'enviado' : 'borrador'; }
    return m.st || 'borrador';
  };
  const mdate = m => (m.sent || !m.piece ? m.off : A.dateOf(P(m.piece)));
  const tabOf = () => gs().mailTab || 'aud';
  VIEW.correo = () => {
    const t = tabOf(), nr = ents('rep').filter(r => !r.done).length, na = ents('aud').filter(a => a.st === 'activa' && (a.step === 0 || a.step === 2)).length;
    const tabs = [['aud', 'users', 'Audiencias', na], ['news', 'mail', 'Boletines', 0], ['resp', 'msg', 'Respuestas', nr]];
    const seg = `<div class="seg">${tabs.map(([k, i, l, n]) => `<button data-act="g-mtab" data-v="${k}" aria-pressed="${t === k}">${ico(i, 'sm')} <span class="tl">${l}</span>${n ? ` <span class="chip warn" style="height:20px;padding:0 7px">${n}</span>` : ''}</button>`).join('')}</div>`;
    return head('Correo', 'Tus correos, <em>bajo control</em>', `${pill('users', pl(ents('aud').length, 'audiencia', 'audiencias'))}${pill('mail', pl(ents('mail').length, 'boletín', 'boletines'))}${pill('msg', pl(nr, 'respuesta nueva', 'respuestas nuevas'), nr ? 'strong' : '')}`, seg) + (t === 'aud' ? audTab() : t === 'news' ? newsTab() : respTab());
  };
  EXT['g-mtab'] = el => { gs().mailTab = el.dataset.v; save(); render(true); };

  function audTab() {
    const all = ents('aud'), f = F('aud:st', 'todas'), q = Q('correo:aud').toLowerCase(), cnt = s => all.filter(a => a.st === s).length;
    const list = all.filter(a => (f === 'todas' || a.st === f) && (!q || (a.t + a.who + a.where).toLowerCase().includes(q)));
    const card = a => {
      const turn = a.st === 'activa' && (a.step === 0 || a.step === 2), S_ = AUD_ST[a.st] || AUD_ST.borrador;
      const flow = MAIL_STEPS.map(([i, l], k) => `<span class="fs ${k < a.step ? 'done' : k === a.step ? 'cur' : ''}" title="${l}">${ico(k < a.step ? 'check' : i, 'sm')}<em>${l}</em></span>`).join('<i class="fl"></i>');
      return `<article class="card gcard aud st-${a.st}"><div class="ch"><span class="ci">${ico('users')}</span><div class="gct"><b>${esc(a.t)}</b></div>${tag('', S_.label, S_.tone)}</div>
        <div class="gcm">${tag('users', a.who)}${tag('pin', a.where)}</div>
        <div class="flow" aria-label="Pasos">${flow}</div>
        <div class="pr"><div class="tr"><i style="width:${a.goal ? Math.min(100, a.found / a.goal * 100) : 0}%"></i></div><span>${a.found}/${a.goal}</span>${a.replies ? tag('msg', a.replies, 'ok') : ''}</div>
        <div class="cf">${a.st === 'borrador' ? `<button class="btn pri sm" data-act="g-aud-set" data-id="${a.id}" data-v="activa">${ico('play', 'sm')} Activar</button>` : sw(a.st === 'activa', 'g-aud-tg', `data-id="${a.id}"`, a.st === 'activa' ? 'Pausar audiencia' : 'Reanudar audiencia')}${turn ? `<button class="btn sm" data-act="g-aud-adv" data-id="${a.id}">${ico('check', 'sm')} ${a.step === 0 ? 'Audiencia lista' : 'Textos listos'}</button>` : ''}<span class="sp"></span>${ib('edit', 'g-edit', `data-t="aud" data-id="${a.id}"`, 'Editar')}</div></article>`;
    };
    const c = cfg();
    const stp = (i, l, k, v, st) => `<div class="stp"><span class="sl">${ico(i)}<small>${l}</small></span><div class="num">${ib('minus', 'g-cfg', `data-k="${k}" data-d="${-st}"`, 'Menos')}<b>${v}</b>${ib('plus', 'g-cfg', `data-k="${k}" data-d="${st}"`, 'Más')}</div></div>`;
    return `<div class="mgbar">${search('correo:aud')}${chips('aud:st', [['todas', 'grid', 'Todas'], ['activa', 'play', 'Activas', cnt('activa')], ['pausada', 'pause', 'Pausadas', cnt('pausada')], ['borrador', 'edit', 'Borradores', cnt('borrador')]], 'todas')}<span class="sp"></span>${newBtn('aud', 'Nueva audiencia')}</div>`
      + (list.length ? `<div class="gcards">${list.map(card).join('')}</div>` : empty('users', 'Sin audiencias', newBtn('aud', 'Nueva audiencia')))
      + `<section class="card pad cfgc"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('shield')} Envío seguro</h2></div><div class="cfg">${stp('send', 'Máximo por día', 'cap', c.cap, 5)}${stp('clock', 'Pausa entre envíos (días)', 'cool', c.cool, 1)}
        <div class="blk"><span class="sl">${ico('lock')}<small>Bloqueados</small></span><div class="bl">${c.block.map((b, i) => `<span class="chip">${esc(b)}<button class="x" data-act="g-blk-del" data-i="${i}" aria-label="Quitar ${esc(b)}">${ico('x', 'sm')}</button></span>`).join('') || '<span class="dim">—</span>'}</div>
          <form class="mini" data-gform="blk"><input name="v" placeholder="@dominio.com" aria-label="Bloquear dominio o correo" autocomplete="off"><button class="icon-btn sm" type="submit" aria-label="Agregar">${ico('plus', 'sm')}</button></form></div></div></section>`;
  }
  EXT['g-aud-tg'] = el => { const a = ent('aud', el.dataset.id), to = a.st === 'activa' ? 'pausada' : 'activa'; patch('aud', a.id, { st: to }, to === 'pausada' ? 'Audiencia pausada' : 'Audiencia activa'); };
  EXT['g-aud-set'] = el => patch('aud', el.dataset.id, { st: el.dataset.v }, 'Audiencia activa');
  EXT['g-aud-adv'] = el => { const a = ent('aud', el.dataset.id); patch('aud', a.id, { step: a.step + 1 }, a.step === 0 ? 'Sami busca contactos verificados' : 'Textos listos, Sami prepara el lanzamiento'); };
  EXT['g-cfg'] = el => { const k = el.dataset.k, c = cfg(), lim = { cap: [5, 100], cool: [0, 30] }[k]; setCfg({ [k]: Math.max(lim[0], Math.min(lim[1], c[k] + +el.dataset.d)) }); };
  EXT['g-blk-del'] = el => { const c = cfg(); setCfg({ block: c.block.filter((_, i) => i !== +el.dataset.i) }); };

  function newsTab() {
    const all = ents('mail'), f = F('mail:st', 'todos'), q = Q('correo:news').toLowerCase();
    const list = all.filter(m => (f === 'todos' || mst(m) === f || (f === 'borrador' && mst(m) === 'porDecidir')) && (!q || m.t.toLowerCase().includes(q))).sort((a, b) => String(mdate(b) || '9').localeCompare(String(mdate(a) || '9')));
    const cnt = s => all.filter(m => mst(m) === s).length;
    const row = m => {
      const s = mst(m), M = MAIL_ST[s], d = mdate(m);
      return `<div class="mrow mail ${s}"><div class="mc t"><span class="gmi">${ico(m.auto ? 'bolt' : 'mail')}</span><div><b>${esc(m.t)}</b><small>${ico('users', 'sm')} ${esc(m.to)}${m.n ? ` · ${nf(m.n)}` : ''}</small></div></div>
        <div class="mc n" title="Fecha">${d ? `${ico('calendar', 'sm')}<span>${dshort(d)}</span>` : '<span class="dim">—</span>'}</div>
        <div class="mc n" title="Abiertos">${m.open != null ? `${ico('eye', 'sm')}<b>${m.open} %</b>` : '<span class="dim">—</span>'}</div>
        <div class="mc n" title="Clics">${m.click != null ? `${ico('link', 'sm')}<b>${m.click} %</b>` : '<span class="dim">—</span>'}</div>
        <div class="mc s">${tag(M[2], M[0], M[1])}${s === 'programado' || s === 'pausado' ? sw(s === 'programado', 'g-mail-tg', `data-id="${m.id}"`, s === 'programado' ? 'Pausar envío' : 'Reanudar envío') : ''}${s === 'porDecidir' ? ib('eye', 'goto-piece', `data-id="${m.piece}"`, 'Ver borrador') : ''}</div>
        <div class="mc a">${ib('spark', 'ask', `data-q="Mejora el asunto de «${esc(m.t)}»"`, 'Pedirle un cambio a Sami')}${ib('edit', 'g-edit', `data-t="mail" data-id="${m.id}"`, 'Editar')}</div></div>`;
    };
    return `<div class="mgbar">${search('correo:news')}${chips('mail:st', [['todos', 'grid', 'Todos'], ['borrador', 'edit', 'Borradores'], ['programado', 'calendar', 'Programados', cnt('programado')], ['enviado', 'send', 'Enviados', cnt('enviado')]], 'todos')}<span class="sp"></span>${newBtn('mail', 'Nuevo boletín')}</div>`
      + (list.length ? `<div class="card mtable"><div class="mrow mhead mail"><div class="mc t"></div><div class="mc n">${ico('calendar', 'sm')}</div><div class="mc n">${ico('eye', 'sm')}</div><div class="mc n">${ico('link', 'sm')}</div><div class="mc s"></div><div class="mc a"></div></div>${list.map(row).join('')}</div>` : empty('mail', 'Sin boletines', newBtn('mail', 'Nuevo boletín')));
  }
  EXT['g-mail-tg'] = el => { const m = ent('mail', el.dataset.id); patch('mail', m.id, { paused: !m.paused }, m.paused ? 'Envío reanudado' : 'Envío en pausa'); };

  function respTab() {
    const all = ents('rep'), f = F('rep:st', 'nuevas'), q = Q('correo:resp').toLowerCase(), cnt = t => all.filter(r => !r.done && r.tag === t).length;
    const list = all.filter(r => (f === 'hechas' ? r.done : f === 'nuevas' ? !r.done : !r.done && r.tag === f) && (!q || (r.from + r.snip).toLowerCase().includes(q)));
    const row = r => { const T = REP_TAGS[r.tag], l = r.lead ? ent('lead', r.lead) : null;
      return `<div class="mrow rep ${r.done ? 'done' : ''}"><div class="mc t"><span class="gmi ${T[1]}">${ico(T[2])}</span><div><b>${esc(r.from)}</b><small>${esc(r.snip)}</small></div></div>
        <div class="mc n">${tag(T[2], T[0], T[1])}</div><div class="mc n"><span class="dim">${rel(-r.ago).replace(/^./, c => c.toUpperCase())}</span></div>
        <div class="mc a wide">${l && r.tag === 'interesado' && l.stage !== 'reunion' ? `<button class="btn sm" data-act="g-rep-lead" data-id="${r.id}">${ico('target', 'sm')} A reunión</button>` : ''}${ib('spark', 'ask', `data-q="Prepara una respuesta para ${esc(r.from)}"`, 'Responder con Sami')}${ib(r.done ? 'undo' : 'check', 'g-rep-done', `data-id="${r.id}"`, r.done ? 'Volver a nuevas' : 'Marcar como atendida')}</div></div>`; };
    return `<div class="mgbar">${search('correo:resp')}${chips('rep:st', [['nuevas', 'inbox', 'Nuevas', all.filter(r => !r.done).length], ['interesado', 'heart', 'Interesados', cnt('interesado')], ['despues', 'clock', 'Más adelante', cnt('despues')], ['no', 'x', 'No', cnt('no')], ['hechas', 'check', 'Atendidas']], 'nuevas')}</div>`
      + (list.length ? `<div class="card mtable">${list.map(row).join('')}</div>` : empty('msg', 'Sin respuestas aquí'));
  }
  EXT['g-rep-done'] = el => { const r = ent('rep', el.dataset.id); patch('rep', r.id, { done: !r.done }, r.done ? 'Volvió a nuevas' : 'Atendida'); };
  EXT['g-rep-lead'] = el => { const r = ent('rep', el.dataset.id); patch('lead', r.lead, { stage: 'reunion' }, 'Prospecto movido a Reunión'); };

  /* ---------- Prospectos ---------- */
  const STAGE_OPTS = LEAD_STAGES.map(s => [s[0], s[1]]).concat([['perdido', 'Perdido']]);
  const leadsOpen = l => !['ganado', 'perdido'].includes(l.stage);
  HOOK.badges = () => ({
    campanas: ents('camp').filter(c => c.st === 'propuesta').length,
    web: ents('page').filter(p => p.st === 'revision').length,
    correo: ents('rep').filter(r => !r.done).length + ents('aud').filter(a => a.st === 'activa' && (a.step === 0 || a.step === 2)).length,
    prospectos: ents('lead').filter(l => leadsOpen(l) && l.next && l.next <= isoOff(0)).length
  });
  VIEW.prospectos = () => {
    const all = ents('lead'), q = Q('prospectos').toLowerCase(), src = F('lead:src', 'all'), dr = F('lead:dr', 'all'), stg = F('lead:stage', 'all'), view = gs().leadView || 'tablero';
    const match = l => (!q || (l.n + l.k + l.note).toLowerCase().includes(q)) && (src === 'all' || l.src === src) && (dr === 'all' || (dr === 'ready' ? l.draft : !l.draft));
    const base = all.filter(match), nmiss = all.filter(l => l.ct && !l.draft && leadsOpen(l)).length;
    const card = l => { const idx = LEAD_STAGES.findIndex(s => s[0] === l.stage), due = l.next && l.next <= isoOff(0);
      return `<article class="lcard" draggable="true" data-id="${l.id}" data-act="g-edit" data-t="lead" tabindex="0" role="button" aria-label="${esc(l.n)}">
        <div class="lt"><b>${esc(l.n)}</b><span class="fitn" title="Qué tanto encaja">${l.fit}</span></div><small>${ico('pin', 'sm')} ${esc(l.k)}</small>
        <div class="lm"><span title="${LEAD_SRC[l.src][1]}">${ico(LEAD_SRC[l.src][0], 'sm')}</span><span class="${l.ct ? '' : 'nodata'}" title="${l.ct ? 'Tiene contacto' : 'Sin contacto'}">${ico('phone', 'sm')}</span>${l.draft ? `<span class="ldr" title="Borrador listo">${ico('mail', 'sm')}</span>` : ''}${l.next ? `<span class="chip ${due ? 'warn' : ''}">${ico('calendar', 'sm')} ${dshort(l.next)}</span>` : ''}</div>
        <div class="lmv">${ib('left', 'g-lmv', `data-id="${l.id}" data-d="-1" ${idx <= 0 ? 'disabled' : ''}`, 'Etapa anterior')}${ib('right', 'g-lmv', `data-id="${l.id}" data-d="1" ${idx < 0 || idx >= LEAD_STAGES.length - 1 ? 'disabled' : ''}`, 'Etapa siguiente')}</div></article>`; };
    const board = `<div class="board">${LEAD_STAGES.map(([k, l, i]) => { const it = base.filter(x => x.stage === k); return `<section class="lcol" data-stage="${k}" aria-label="${l}"><header>${ico(i, 'sm')}<b>${l}</b><span class="cnt">${it.length}</span></header><div class="lbody">${it.map(card).join('') || `<div class="lempty">${ico('plus', 'sm')}</div>`}</div></section>`; }).join('')}</div>`
      + (base.some(l => l.stage === 'perdido') ? `<button class="btn ghost sm lostb" data-act="g-lost">${ico('archive', 'sm')} Perdidos (${base.filter(l => l.stage === 'perdido').length})</button>` : '');
    const lrows = base.filter(l => stg === 'all' || l.stage === stg).sort((a, b) => b.fit - a.fit);
    const rowL = l => `<div class="mrow glead"><div class="mc t"><span class="gmi">${ico('building')}</span><div><b>${esc(l.n)}</b><small>${ico('pin', 'sm')} ${esc(l.k)}</small></div></div>
      <div class="mc n" title="${LEAD_SRC[l.src][1]}">${ico(LEAD_SRC[l.src][0], 'sm')}</div><div class="mc n" title="Qué tanto encaja"><div class="fit"><i><b style="width:${l.fit}%"></b></i>${l.fit}</div></div>
      <div class="mc n" title="Contacto">${l.ct ? `<span class="okc">${ico('phone', 'sm')}</span>` : `<span class="dim">${ico('phone', 'sm')}</span>`}</div><div class="mc n" title="Borrador">${l.draft ? `<span class="okc">${ico('mail', 'sm')}</span>` : `<span class="dim">${ico('mail', 'sm')}</span>`}</div>
      <div class="mc s"><label class="sel sm"><select data-glead="${l.id}" aria-label="Etapa de ${esc(l.n)}">${STAGE_OPTS.map(([v, t]) => `<option value="${v}" ${l.stage === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>
      <div class="mc a">${ib('edit', 'g-edit', `data-t="lead" data-id="${l.id}"`, 'Editar')}</div></div>`;
    const lista = lrows.length ? `<div class="card mtable"><div class="mrow mhead glead"><div class="mc t"></div><div class="mc n">${ico('search', 'sm')}</div><div class="mc n">${ico('star', 'sm')}</div><div class="mc n">${ico('phone', 'sm')}</div><div class="mc n">${ico('mail', 'sm')}</div><div class="mc s"></div><div class="mc a"></div></div>${lrows.map(rowL).join('')}</div>` : empty('target', 'Ningún prospecto coincide');
    const seg = `<div class="seg"><button data-act="g-lview" data-v="tablero" aria-pressed="${view === 'tablero'}">${ico('kanban', 'sm')} <span class="tl">Tablero</span></button><button data-act="g-lview" data-v="lista" aria-pressed="${view === 'lista'}">${ico('list', 'sm')} <span class="tl">Lista</span></button></div>`;
    return head('Prospectos', 'Quién sigue, <em>y cuándo</em>', `${pill('users', pl(all.filter(l => l.ct).length, 'con contacto', 'con contacto'))}${pill('target', pl(all.filter(l => ['contactado', 'reunion', 'propuesta'].includes(l.stage)).length, 'oportunidad abierta', 'oportunidades abiertas'), 'strong')}${pill('mail', pl(all.filter(l => l.draft && leadsOpen(l)).length, 'borrador', 'borradores'))}${pill('trophy', pl(all.filter(l => l.stage === 'ganado').length, 'ganado', 'ganados'))}`, seg)
      + `<div class="mgbar">${search('prospectos')}${select('lead:src', 'Cómo lo encontró', [['all', 'Todas las fuentes']].concat(Object.keys(LEAD_SRC).map(k => [k, LEAD_SRC[k][1]])), 'all', 'search')}${select('lead:dr', 'Borrador', [['all', 'Con y sin borrador'], ['ready', 'Con borrador'], ['none', 'Sin borrador']], 'all', 'mail')}${view === 'lista' ? select('lead:stage', 'Etapa', [['all', 'Todas las etapas']].concat(STAGE_OPTS), 'all', 'kanban') : ''}<span class="sp"></span>${nmiss ? `<button class="btn" data-act="g-lead-drafts" title="Preparar los ${nmiss} borradores que faltan" aria-label="Preparar los ${nmiss} borradores que faltan">${ico('mail', 'sm')}<span class="nl">Preparar borradores (${nmiss})</span></button>` : ''}${newBtn('lead', 'Nuevo')}</div>`
      + `<div class="solo">${ico('shield', 'sm')}<span>Solo borradores: Sami no envía nada a un prospecto sin que tú lo mandes.</span></div>`
      + (view === 'tablero' ? board : lista);
  };
  EXT['g-lview'] = el => { gs().leadView = el.dataset.v; save(); render(true); };
  EXT['g-lost'] = () => { gs().leadView = 'lista'; sub('f')['lead:stage'] = 'perdido'; save(); render(true); };
  EXT['g-lmv'] = el => { const l = ent('lead', el.dataset.id), order = LEAD_STAGES.map(s => s[0]), i = order.indexOf(l.stage), n = order[Math.max(0, Math.min(order.length - 1, i + +el.dataset.d))]; if (n && n !== l.stage) patch('lead', l.id, { stage: n }, `${l.n}: ${LEAD_STAGES.find(s => s[0] === n)[1]}`); };
  EXT['g-lead-drafts'] = () => {
    const miss = ents('lead').filter(l => l.ct && !l.draft && leadsOpen(l)), ov = sub('ov'), o = ov.lead || (ov.lead = {}), prevs = miss.map(l => [l.id, o[l.id] ? clone(o[l.id]) : null]);
    miss.forEach(l => { o[l.id] = Object.assign({}, o[l.id] || {}, { draft: true }); }); save(); refresh();
    toast(`${miss.length} borradores listos`, { undo: () => { const t = sub('ov').lead || (sub('ov').lead = {}); prevs.forEach(([id, pv]) => { if (pv) t[id] = pv; else delete t[id]; }); save(); refresh(); } });
  };

  /* ---------- Google ---------- */
  const hash = s => s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const comps = () => gs().comp || ['competidor-ejemplo-1.co', 'competidor-ejemplo-2.co'];
  VIEW.google = () => {
    const mk = F('seo:mkt', 'co'), all = ents('kw'), f = F('kw:f', 'todas'), srt = F('kw:sort', 'pos'), q = Q('google').toLowerCase(), spin = !!U.spin;
    const mkLabel = (SEO_MARKETS.find(m => m[0] === mk) || SEO_MARKETS[0])[1];
    const rk = all.filter(w => w.pos != null), avg = a => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
    const both = rk.filter(w => w.was != null), gain = both.length ? avg(both.map(w => w.was)) - avg(both.map(w => w.pos)) : 0;
    const first = rk.filter(w => w.pos <= 10).length, chg = w => (w.was != null && w.pos != null ? w.was - w.pos : 0);
    const kpi = (i, l, v, d, dn) => `<div class="card kpi"><div class="lab">${ico(i, 'sm')} ${l}</div><div class="val">${v}</div>${d ? `<span class="delta ${dn ? 'dn' : 'up'}">${ico(dn ? 'down' : 'up', 'sm')} ${d}</span>` : ''}</div>`;
    const near = w => w.pos != null && w.pos > 10 && w.pos <= 20;
    const list = all.filter(w => (!q || w.k.toLowerCase().includes(q)) && (f === 'todas' || (f === 'cerca' ? near(w) : f === 'suben' ? chg(w) > 0 : chg(w) < 0)))
      .sort((a, b) => (srt === 'vol' ? (b.vol || 0) - (a.vol || 0) : srt === 'cambio' ? chg(b) - chg(a) : (a.pos == null) - (b.pos == null) || a.pos - b.pos));
    const row = w => { const c = chg(w);
      return `<div class="mrow gkw"><div class="mc t"><div><b>${esc(w.k)}</b><small>${w.page ? `<span class="path">${esc(w.page)}</span>` : `<button class="lnk" data-act="ask" data-q="Crea una página para «${esc(w.k)}»">${ico('plus', 'sm')} Sin página · Crear</button>`}</small></div></div>
        <div class="mc n" title="Búsquedas al mes">${w.vol ? `${ico('users', 'sm')}<span>${nf(w.vol)}</span>` : '<span class="dim">—</span>'}</div>
        <div class="mc n sp8" title="Últimas semanas">${w.hist && w.hist.length ? spark(w.hist.map(v => -v), c > 0 ? '#0B8F6C' : c < 0 ? '#C7372F' : '#6A8798') : ''}</div>
        <div class="mc n">${w.pos != null ? `<span class="rank big">#${w.pos}</span>` : tag('clock', 'Pendiente')}</div>
        <div class="mc n"><span class="mv ${c > 0 ? 'up' : c < 0 ? 'dn' : ''}">${c > 0 ? ico('up') + c : c < 0 ? ico('down') + (-c) : '='}</span></div>
        <div class="mc a wide">${near(w) ? `<button class="btn sm" data-act="ask" data-q="Mejora la página para subir en «${esc(w.k)}»">${ico('spark', 'sm')} Hazlo</button>` : ''}${ib('x', 'g-kw-del', `data-id="${w.id}"`, 'Dejar de seguir')}</div></div>`; };
    const refreshBtn = `<button class="btn ${spin ? 'spin' : ''}" data-act="g-seo-ref" title="Actualizar datos" aria-label="Actualizar datos" ${spin ? 'disabled' : ''}>${ico('refresh', 'sm')}<span class="nl">Actualizar</span></button><button class="btn" data-act="ask" title="Pedir el informe del mes" aria-label="Pedir el informe del mes" data-q="Arma el informe de Google del mes">${ico('file', 'sm')}<span class="nl">Informe</span></button>`;
    const body = mk !== 'co'
      ? empty('search', 'Aún no hay datos de este mercado', `<button class="btn pri" data-act="ask" data-q="Revisa cómo me ven en Google en ${esc(mkLabel)}">${ico('spark', 'sm')} Pedirle a Sami</button>`)
      : `<div class="kpis">${kpi('search', 'Posición media', '#' + avg(rk.map(w => w.pos)), gain ? Math.abs(gain) + ' puestos' : '', gain < 0)}${kpi('users', 'Clics', nf(SEO_STATS.clicks), SEO_STATS.clicksD + ' %')}${kpi('eye', 'Apariciones', nf(SEO_STATS.imps), SEO_STATS.impsD + ' %')}${kpi('trophy', 'En la primera página', `${first}<span class="of"> / ${all.length}</span>`)}</div>
        <div class="sec-t"><h2>${ico('target')} Palabras que sigues</h2></div>
        <div class="mgbar">${search('google')}${chips('kw:f', [['todas', 'grid', 'Todas'], ['cerca', 'target', 'Cerca de la 1.ª página', all.filter(near).length], ['suben', 'up', 'Suben'], ['bajan', 'down', 'Bajan']], 'todas')}<span class="sp"></span>${select('kw:sort', 'Ordenar', [['pos', 'Mejor posición'], ['vol', 'Más búsquedas'], ['cambio', 'Mayor cambio']], 'pos', 'list')}
          <form class="mini add" data-gform="kw"><input name="v" placeholder="Agregar palabra" aria-label="Agregar palabra que seguir" autocomplete="off"><button class="icon-btn sm" type="submit" aria-label="Agregar">${ico('plus', 'sm')}</button></form></div>
        ${list.length ? `<div class="card mtable"><div class="mrow mhead gkw"><div class="mc t"></div><div class="mc n">${ico('users', 'sm')}</div><div class="mc n">${ico('chart', 'sm')}</div><div class="mc n">${ico('search', 'sm')}</div><div class="mc n">${ico('up', 'sm')}</div><div class="mc a"></div></div>${list.map(row).join('')}</div>` : empty('search', 'Ninguna palabra coincide')}
        <div class="two" style="margin-top:16px"><section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('users')} Competidores</h2></div><div class="bl">${comps().map((c, i) => `<span class="chip">${esc(c)}<button class="x" data-act="g-comp-del" data-i="${i}" aria-label="Quitar ${esc(c)}">${ico('x', 'sm')}</button></span>`).join('') || '<span class="dim">—</span>'}</div><form class="mini add" data-gform="comp"><input name="v" placeholder="sitio-competidor.co" aria-label="Agregar competidor" autocomplete="off"><button class="icon-btn sm" type="submit" aria-label="Agregar">${ico('plus', 'sm')}</button></form></section>
          <section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('spark')} Pídele a Sami</h2></div><div class="asks">${SEO_ASKS.map(([i, l, qq]) => `<button class="sg" data-act="ask" data-q="${esc(qq)}">${ico(i)}<span><b>${esc(l)}</b></span>${ico('plus', 'sm')}</button>`).join('')}</div></section></div>`;
    return head('Google', 'Cómo te <em>encuentran</em>', `${pill('globe', esc(CLIENT.site), 'strong')}${pill('clock', gs().fresh ? 'Actualizado ahora' : 'Actualizado hace 1 día')}<span class="chip">Ejemplo</span>`, `<div class="gbtns">${select('seo:mkt', 'Mercado', SEO_MARKETS.map(m => [m[0], m[1]]), 'co', 'globe')}${refreshBtn}</div>`) + body;
  };
  EXT['g-seo-ref'] = () => {
    if (U.spin) return; U.spin = true; render(true);
    setTimeout(() => {
      U.spin = false;
      ents('kw').filter(w => w.pos == null).forEach(w => { const h = hash(w.k); patch('kw', w.id, { pos: 6 + h % 22, was: null, vol: 90 + (h * 7) % 420, hist: [] }, null, true); });
      gs().fresh = true; save(); render(true); toast('Datos de Google al día');
    }, 1100);
  };
  EXT['g-kw-del'] = el => { const w = ent('kw', el.dataset.id); patch('kw', w.id, { del: true }, 'Ya no sigues esa palabra'); };
  EXT['g-comp-del'] = el => { const c = comps().filter((_, i) => i !== +el.dataset.i); gs().comp = c; save(); render(true); };

  /* ---------- Hoja para crear y editar ---------- */
  const FORMS = {
    camp: { icon: 'flag', t: 'campaña', req: 't', f: [['t', 'text', 'edit', 'Nombre'], ['goal', 'seln', 'target', 'Meta', GOALS.map((g, i) => [i, g[1]])], ['from', 'date', 'calendar', 'Desde'], ['to', 'date', 'calendar', 'Hasta'], ['st', 'sel', 'play', 'Estado', Object.keys(CAMP_ST).map(k => [k, CAMP_ST[k].label])]],
      def: () => ({ t: '', icon: 'flag', goal: 0, st: 'activa', from: isoOff(0), to: isoOff(30), pcs: [] }), ex: () => [['archive', 'Archivar', { st: 'archivada' }]] },
    page: { icon: 'globe', t: 'página', req: 't', f: [['t', 'text', 'edit', 'Nombre'], ['path', 'text', 'link', 'Dirección'], ['mt', 'text', 'search', 'Título en Google'], ['md', 'area', 'file', 'Descripción en Google'], ['st', 'sel', 'globe', 'Estado', [['viva', 'En vivo'], ['oculta', 'Oculta'], ['borrador', 'Borrador']]]],
      def: () => ({ t: '', path: '/', icon: 'file', st: 'borrador', visits: 0, pos: null, upd: 0, mt: '', md: '' }), ex: e => [['spark', 'Que Sami la mejore', null, `Mejora el texto de la página «${e.t}»`]] },
    aud: { icon: 'users', t: 'audiencia', req: 't', f: [['t', 'text', 'edit', 'Nombre'], ['who', 'text', 'users', 'A quién'], ['where', 'text', 'pin', 'Dónde'], ['offer', 'area', 'star', 'Qué les ofreces']],
      def: () => ({ t: '', who: '', where: 'Cali', offer: '', step: 0, st: 'borrador', found: 0, goal: 40, replies: 0 }), ex: () => [] },
    mail: { icon: 'mail', t: 'boletín', req: 't', f: [['t', 'text', 'edit', 'Asunto'], ['to', 'sel', 'users', 'Lista', MAIL_LISTS.map(x => [x, x])], ['off', 'date', 'calendar', 'Fecha de envío']],
      def: () => ({ t: '', to: 'Clientes', n: 0, st: 'borrador', off: isoOff(7) }), ex: e => [['spark', 'Que Sami lo escriba', null, `Escribe el boletín «${e.t}»`]] },
    lead: { icon: 'target', t: 'prospecto', req: 'n', f: [['n', 'text', 'building', 'Negocio'], ['k', 'text', 'pin', 'Zona'], ['src', 'sel', 'search', 'Cómo lo encontraste', Object.keys(LEAD_SRC).map(k => [k, LEAD_SRC[k][1]])], ['stage', 'sel', 'kanban', 'Etapa', STAGE_OPTS], ['next', 'date', 'calendar', 'Próximo contacto'], ['ct', 'text', 'phone', 'Teléfono o correo'], ['note', 'area', 'edit', 'Nota']],
      def: () => ({ n: '', k: '', fit: 60, src: 'ref', stage: 'nuevo', ct: '', draft: false, next: null, note: '' }), ex: e => [['spark', 'Mensaje con Sami', null, `Escribe un primer mensaje para «${e.n}»`], ['x', 'Marcar perdido', { stage: 'perdido' }]] }
  };
  function openSheet(type, id) {
    U.mg = { type, id: id || null }; U.pal = false; U.drawer = false; U.sheet = null; renderLayers();
    setTimeout(() => { const i = $('#layer .gsheet [data-f]'); if (i) i.focus(); }, 30);
  }
  HOOK.layer = () => {
    const mg = U.mg, F_ = FORMS[mg.type], e = mg.id ? ent(mg.type, mg.id) : F_.def();
    if (!e) return '';
    const fld = ([k, kind, ic, label, opts]) => {
      const v = e[k] == null ? '' : e[k]; let inp;
      if (kind === 'area') inp = `<textarea data-f="${k}" rows="3">${esc(v)}</textarea>`;
      else if (kind === 'sel' || kind === 'seln') { const o = opts.slice(); if (!o.some(x => String(x[0]) === String(v))) o.push([v, (WEB_ST[v] || {}).label || v]); inp = `<select data-f="${k}" data-k="${kind}">${o.map(([a, b]) => `<option value="${esc(a)}" ${String(a) === String(v) ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select>`; }
      else inp = `<input data-f="${k}" type="${kind === 'date' ? 'date' : 'text'}" value="${esc(v)}" autocomplete="off">`;
      return `<label class="fld"><span>${ico(ic, 'sm')} ${label}</span>${inp}</label>`;
    };
    const extras = mg.id ? F_.ex(e).map(([i, l, p, q], n) => `<button class="btn lg" type="button" data-act="g-sheet-ex" data-n="${n}">${ico(i, 'sm')} ${l}</button>`).join('') : '';
    return `<div class="sheet-bg" data-act="close-layers"></div><aside class="sheet gsheet" role="dialog" aria-label="${mg.id ? 'Editar' : 'Nueva'} ${F_.t}"><button class="icon-btn sheet-x" data-act="close-layers" aria-label="Cerrar">${ico('x')}</button>
      <div class="gs-h"><span class="ci">${ico(F_.icon)}</span><h2>${mg.id ? 'Editar' : 'Nueva'} ${F_.t}</h2></div>
      <form class="gs-f" data-gform="sheet">${F_.f.map(fld).join('')}<div class="acts"><button class="btn pri lg" type="submit">${ico('check')} ${mg.id ? 'Guardar' : 'Crear'}</button>${extras}${mg.id ? `<button class="btn lg sq bad" type="button" data-act="g-del" aria-label="Eliminar" title="Eliminar">${ico('trash')}</button>` : ''}</div></form></aside>`;
  };
  function saveSheet() {
    const mg = U.mg, F_ = FORMS[mg.type], vals = {};
    $$('#layer .gsheet [data-f]').forEach(i => { const k = i.dataset.f; let v = i.value; if (i.dataset.k === 'seln') v = +v; else if (i.type === 'date') v = v || null; else v = v.trim(); vals[k] = v; });
    if (!String(vals[F_.req] || '').trim()) { toast('Escribe un nombre'); return; }
    if (mg.id) patch(mg.type, mg.id, vals, 'Guardado'); else { addEnt(mg.type, Object.assign(F_.def(), vals)); toast(`Nueva ${F_.t} creada`); }
    U.mg = null; renderLayers(); render(true);
  }
  EXT['g-edit'] = el => openSheet(el.dataset.t, el.dataset.id);
  EXT['g-new'] = el => openSheet(el.dataset.t, null);
  EXT['g-del'] = () => { const mg = U.mg, F_ = FORMS[mg.type]; U.mg = null; renderLayers(); patch(mg.type, mg.id, { del: true }, `${F_.t[0].toUpperCase() + F_.t.slice(1)} eliminada`); };
  EXT['g-sheet-ex'] = el => { const mg = U.mg, F_ = FORMS[mg.type], x = F_.ex(ent(mg.type, mg.id))[+el.dataset.n]; if (!x) return; if (x[2]) { U.mg = null; renderLayers(); patch(mg.type, mg.id, x[2], 'Listo'); } else ask(x[3]); };
  EXT['g-f'] = el => setF(el.dataset.k, el.dataset.v);
  HOOK.pal = () => [['users', 'Nueva audiencia', 'aud'], ['target', 'Nuevo prospecto', 'lead'], ['flag', 'Nueva campaña', 'camp'], ['globe', 'Nueva página', 'page'], ['mail', 'Nuevo boletín', 'mail']].map(([icon, t, ty]) => ({ icon, t, run: () => openSheet(ty, null) }));

  /* ---------- Escritura, listas y arrastre ---------- */
  document.addEventListener('input', e => {
    const q = e.target.closest && e.target.closest('[data-gq]'); if (!q) return;
    sub('q')[q.dataset.gq] = q.value; const pos = q.selectionStart; render(true);
    const n = $(`[data-gq="${q.dataset.gq}"]`); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (err) { /* sin selección */ } }
  });
  document.addEventListener('change', e => {
    const s = e.target.closest && e.target.closest('[data-gs]'); if (s) { setF(s.dataset.gs, s.value); return; }
    const l = e.target.closest && e.target.closest('[data-glead]'); if (l) { const lead = ent('lead', l.dataset.glead); patch('lead', lead.id, { stage: l.value }, `${lead.n}: ${(STAGE_OPTS.find(o => o[0] === l.value) || [])[1]}`); }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest && e.target.closest('[data-gform]'); if (!f) return;
    e.preventDefault(); const k = f.dataset.gform, inp = f.querySelector('input[name="v"]'), v = inp ? inp.value.trim() : '';
    if (k === 'sheet') { saveSheet(); return; }
    if (!v) return;
    if (k === 'blk') setCfg({ block: cfg().block.concat(v) });
    else if (k === 'comp') { gs().comp = comps().concat(v); save(); render(true); }
    else if (k === 'kw') { if (ents('kw').some(w => w.k.toLowerCase() === v.toLowerCase())) { toast('Ya la sigues'); return; } addEnt('kw', { k: v, page: '', pos: null, was: null, vol: null, hist: [] }); render(true); toast('Se mide en la próxima actualización'); }
    const n = $(`[data-gform="${k}"] input[name="v"]`); if (n) n.focus();
  });
  document.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.lcard'); if (c && e.target === c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); c.click(); } });
  document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.lcard'); if (!c) return; e.dataTransfer.setData('text/plain', 'lead:' + c.dataset.id); e.dataTransfer.effectAllowed = 'move'; c.classList.add('drag'); });
  document.addEventListener('dragend', e => { const c = e.target.closest && e.target.closest('.lcard'); if (c) c.classList.remove('drag'); $$('.lcol.over').forEach(x => x.classList.remove('over')); });
  document.addEventListener('dragover', e => { const c = e.target.closest && e.target.closest('.lcol'); if (!c) return; e.preventDefault(); $$('.lcol.over').forEach(x => { if (x !== c) x.classList.remove('over'); }); c.classList.add('over'); });
  document.addEventListener('drop', e => {
    const c = e.target.closest && e.target.closest('.lcol'); if (!c) return; const d = e.dataTransfer.getData('text/plain'); if (d.indexOf('lead:') !== 0) return;
    e.preventDefault(); c.classList.remove('over'); const l = ent('lead', d.slice(5)); if (l && l.stage !== c.dataset.stage) patch('lead', l.id, { stage: c.dataset.stage }, `${l.n}: ${LEAD_STAGES.find(s => s[0] === c.dataset.stage)[1]}`);
  });
};
