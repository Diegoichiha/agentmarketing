/* Panel SAM · gestión, segunda parte: marca (archivos, perfil y memoria), reuniones y conexiones.
   Igual que la primera parte: son espacios para administrar. Lo que se cambia queda en el navegador (estado S.g)
   y casi todo se puede deshacer. En archivos solo se guardan los nombres: no se sube nada. */
window.GESTION2 = function (A, H) {
  'use strict';
  const { VIEW, HOOK, EXT, U, $, esc, ico, isoOff, save, render, toast, rel, t12 } = A;
  const { DATA, FORMS, gs, sub, F, Q, patch, addEnt, ents, ent, tag, sw, ib, pill, pl, search, chips, head, empty, dshort, comps, openSheet } = H;
  DATA.meet = MEETS; DATA.file = BRAND_FILES;
  const refocus = sel => { const n = $(sel); if (n) n.focus(); };

  /* ---------- Marca · archivos ---------- */
  const kbTxt = kb => (kb >= 1024 ? (kb / 1024).toFixed(1).replace('.', ',') + ' MB' : kb + ' KB');
  const fIcon = n => (/\.(jpe?g|png|webp|gif|svg|avif)$/i.test(n) ? 'image' : 'file');
  const nFiles = c => ents('file').filter(f => f.cat === c).length;
  function libTab() {
    const q = Q('marca').toLowerCase(), f = F('lib:f', 'todas'), all = ents('file');
    const steps = BRAND_MIN.map(([c, l, n]) => ({ l, have: nFiles(c), need: n || 1 })).map(s => Object.assign(s, { ok: s.have >= s.need }));
    const done = steps.filter(s => s.ok).length, ready = steps[0].ok && steps[1].ok;
    const cats = BRAND_CATS.filter(c => (f === 'todas' || (f === 'con' ? nFiles(c.id) > 0 : nFiles(c.id) === 0)) && (!q || c.t.toLowerCase().includes(q) || all.some(x => x.cat === c.id && x.n.toLowerCase().includes(q))));
    const card = c => {
      const fs = all.filter(x => x.cat === c.id), open = !!sub('libOpen')[c.id] || (q && fs.some(x => x.n.toLowerCase().includes(q)));
      return `<article class="card gcard glib ${fs.length ? 'has' : ''}" data-cat="${c.id}">
        <div class="ch"><span class="ci">${ico(c.icon)}</span><div class="gct"><b>${c.t}</b><small>${esc(c.hint)}</small></div>${tag('', fs.length, fs.length ? 'ok' : '')}</div>
        <div class="cf"><button class="btn sm" data-act="g-lib-add" data-cat="${c.id}">${ico('plus', 'sm')} Agregar</button><span class="sp"></span>${fs.length ? ib(open ? 'up' : 'down', 'g-lib-open', `data-cat="${c.id}" aria-expanded="${open}"`, 'Ver archivos') : `<span class="dim lbdrop" title="También puedes soltar archivos aquí">${ico('drag', 'sm')}</span>`}</div>
        ${open ? `<div class="cl">${fs.map(x => `<div class="it fil"><span class="fic">${ico(fIcon(x.n))}</span><div class="tx"><b>${esc(x.n)}</b><small>${kbTxt(x.kb)} · ${dshort(x.off)}</small></div>${ib('x', 'g-file-del', `data-id="${x.id}"`, 'Quitar archivo')}</div>`).join('')}</div>` : ''}</article>`;
    };
    return `<div class="solo">${ico('shield', 'sm')}<span>Vista previa: solo se guardan los nombres de los archivos, no se sube nada.</span><span class="chip">Ejemplo</span></div>
      <section class="card pad lbs ${ready ? 'ready' : ''}"><div class="lbs-h"><span class="ci">${ico(ready ? 'check' : 'spark')}</span><div class="gct"><b>${ready ? 'Sami ya tiene lo mínimo' : 'Falta lo mínimo para que Sami use tu marca'}</b><small>${ready ? 'Con más referencias lo hace mejor' : 'Con un logo y la guía de marca puede empezar'}</small></div></div>
        <div class="lbs-steps">${steps.map(s => `<span class="lbp ${s.ok ? 'ok' : ''}">${ico(s.ok ? 'check' : 'plus', 'sm')}${esc(s.l)}${s.need > 1 ? ` <em>${Math.min(s.have, s.need)}/${s.need}</em>` : ''}</span>`).join('')}</div>
        <div class="pr"><div class="tr"><i style="width:${done / steps.length * 100}%"></i></div><span>${done}/${steps.length}</span></div></section>
      <div class="mgbar">${search('marca')}${chips('lib:f', [['todas', 'grid', 'Todas'], ['con', 'check', 'Con archivos', BRAND_CATS.filter(c => nFiles(c.id)).length], ['vacia', 'plus', 'Vacías', BRAND_CATS.filter(c => !nFiles(c.id)).length]], 'todas')}</div>
      ${cats.length ? `<div class="gcards">${cats.map(card).join('')}</div>` : empty('layers', 'Nada coincide')}
      <input type="file" id="gfile" multiple hidden>`;
  }
  function addFiles(cat, list) {
    if (!cat || !list.length) return;
    list.forEach(f => addEnt('file', { cat, n: f.name, kb: Math.max(1, Math.round(f.size / 1024)), off: isoOff(0) }));
    sub('libOpen')[cat] = true; save(); render(true); toast(list.length === 1 ? 'Archivo agregado' : `${list.length} archivos agregados`);
  }
  EXT['g-lib-add'] = el => { gs().libCat = el.dataset.cat; const i = $('#gfile'); if (i) i.click(); };
  EXT['g-lib-open'] = el => { const o = sub('libOpen'); o[el.dataset.cat] = !o[el.dataset.cat]; save(); render(true); };
  EXT['g-file-del'] = el => patch('file', el.dataset.id, { del: true }, 'Archivo quitado');
  document.addEventListener('change', e => { const i = e.target; if (i && i.id === 'gfile' && i.files) { addFiles(gs().libCat, [...i.files]); i.value = ''; } });
  const isFiles = e => e.dataTransfer && [...(e.dataTransfer.types || [])].includes('Files');
  document.addEventListener('dragover', e => { const c = e.target.closest && e.target.closest('.glib'); if (c && isFiles(e)) { e.preventDefault(); c.classList.add('over'); } });
  document.addEventListener('dragleave', e => { const c = e.target.closest && e.target.closest('.glib'); if (c && !c.contains(e.relatedTarget)) c.classList.remove('over'); });
  document.addEventListener('drop', e => { const c = e.target.closest && e.target.closest('.glib'); if (!c || !isFiles(e)) return; e.preventDefault(); c.classList.remove('over'); addFiles(c.dataset.cat, [...e.dataTransfer.files]); });

  /* ---------- Marca · perfil ---------- */
  const prof = () => gs().profile || {};
  const pv = (k, d = '') => (k in prof() ? prof()[k] : d);
  const setP = (k, v) => { gs().profile = Object.assign({}, prof(), { [k]: v }); save(); };
  function perfilTab() {
    const chipsOf = (arr, act) => `<div class="bl">${arr.map((x, i) => `<span class="chip">${esc(x)}<button class="x" data-act="${act}" data-i="${i}" aria-label="Quitar ${esc(x)}">${ico('x', 'sm')}</button></span>`).join('') || '<span class="dim">—</span>'}</div>`;
    const add = (k, ph) => `<form class="mini add" data-gform="${k}"><input name="v" placeholder="${esc(ph)}" aria-label="${esc(ph)}" autocomplete="off"><button class="icon-btn sm" type="submit" aria-label="Agregar">${ico('plus', 'sm')}</button></form>`;
    return `<div class="two"><section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('globe')} Sitio y redes</h2></div>
        <label class="fld"><span>${ico('link', 'sm')} Sitio web</span><input data-gprof="site" value="${esc(pv('site', CLIENT.site))}" autocomplete="off"></label>
        ${NETS.slice(0, 6).map(n => `<label class="fld"><span>${ico(n[2], 'sm')} ${n[1]}</span><input data-gprof="soc:${n[0]}" placeholder="@usuario o enlace" value="${esc(pv('soc:' + n[0], n[0] === 'instagram' ? '@' + CLIENT.handle : ''))}" autocomplete="off"></label>`).join('')}</section>
      <div class="grid"><section class="card pad"><div class="sec-t" style="margin:0 0 6px"><h2>${ico('users')} Competidores</h2></div><p class="hint2">Sami los compara en Google.</p>${chipsOf(comps(), 'g-comp-del')}${add('comp', 'sitio-competidor.co')}</section>
        <section class="card pad"><div class="sec-t" style="margin:0 0 6px"><h2>${ico('x')} No queremos vernos como</h2></div><p class="hint2">Marcas o estilos que Sami debe evitar.</p>${chipsOf(pv('anti', []), 'g-anti-del')}${add('panti', 'Ej.: fotos oscuras y desordenadas')}</section></div></div>`;
  }
  EXT['g-anti-del'] = el => { setP('anti', pv('anti', []).filter((_, i) => i !== +el.dataset.i)); render(true); };
  document.addEventListener('change', e => { const i = e.target.closest && e.target.closest('[data-gprof]'); if (i) { setP(i.dataset.gprof, i.value.trim()); toast('Guardado'); } });
  HOOK.marca = tab => (tab === 'lib' ? libTab() : perfilTab());

  /* ---------- Marca · memoria (resumen de arriba) ---------- */
  HOOK.memHead = () => {
    const s = A.S(), st = m => (s.memo || {})[m.id] || m.st, extras = ((s.mtk || {}).extra || []).length;
    const conf = MEMORY.filter(m => st(m) === 'confirmada').length + extras, rev = MEMORY.filter(m => st(m) === 'por-revisar').length;
    const dec = PIECES.filter(p => !['revision', 'borrador'].includes(A.stOf(p))).length, tot = IG.formats.reduce((a, f) => a + f[2], 0);
    const tiles = [['calendar', 'Meses con Sami', 3], ['check', 'Reglas confirmadas', conf], ['inbox', 'Por revisar', rev], ['trophy', 'Decisiones tomadas', dec]];
    return `<div class="stiles four">${tiles.map(([i, l, n]) => `<div class="stile static">${ico(i)}<b>${n}</b><span>${l}</span></div>`).join('')}</div>
      <section class="card pad" style="margin-bottom:14px"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('chart')} Lo que más publicas</h2><span class="chip">Instagram</span></div><div class="bars">${IG.formats.map(([i, l, n]) => { const p = Math.round(n / tot * 100); return `<div class="brow"><span class="bl-l">${ico(i, 'sm')} ${l}</span><div class="tr"><i style="width:${p}%;--c:var(--blue)"></i></div><span>${p} %</span></div>`; }).join('')}</div></section>`;
  };

  /* ---------- Reuniones ---------- */
  FORMS.meet = { icon: 'video', t: 'reunión', req: 't', f: [['t', 'text', 'edit', 'Nombre'], ['link', 'text', 'link', 'Enlace de Meet'], ['off', 'date', 'calendar', 'Día'], ['time', 'time', 'clock', 'Hora']],
    def: () => ({ t: '', link: '', off: isoOff(1), time: '10:00', sami: true, tasks: [], sum: [] }), ex: e => [['spark', 'Que Sami la resuma', null, `Resume la reunión «${e.t}»`]] };
  const mo = m => m.off || isoOff(0);
  const diff = iso => Math.round((new Date(iso + 'T12:00:00') - new Date(isoOff(0) + 'T12:00:00')) / 864e5);
  const tasksOf = m => (m.tasks || []).map(x => (typeof x === 'string' ? { t: x, done: false } : x));
  const setTasks = (id, fn) => patch('meet', id, { tasks: fn(tasksOf(ent('meet', id))) });
  VIEW.reuniones = () => {
    const all = ents('meet'), f = F('meet:f', 'todas'), q = Q('reuniones').toLowerCase(), today = isoOff(0);
    const next = m => mo(m) >= today, open = m => tasksOf(m).filter(t => !t.done).length;
    const list = all.filter(m => (f === 'todas' || (f === 'proximas' ? next(m) : f === 'tareas' ? open(m) > 0 : !next(m))) && (!q || (m.t + ' ' + (m.sum || []).map(s => s[1]).join(' ')).toLowerCase().includes(q)));
    const up = list.filter(next).sort((a, b) => (mo(a) + (a.time || '')).localeCompare(mo(b) + (b.time || ''))), past = list.filter(m => !next(m)).sort((a, b) => mo(b).localeCompare(mo(a)));
    const au = (A.S().au || {}).meet || 'avisar', auL = AUTONOMY_LEVELS.find(l => l[0] === au)[1];
    const card = m => {
      const nx = next(m), tk = tasksOf(m), d = diff(mo(m));
      return `<article class="card gcard gmt ${nx ? 'next' : ''}"><div class="ch"><span class="ci">${ico('video')}</span><div class="gct"><b>${esc(m.t)}</b><small>${ico('calendar', 'sm')}<span>${esc(rel(d).replace(/^./, c => c.toUpperCase()))}, ${dshort(mo(m))}${m.time ? ' · ' + t12(m.time) : ''}${m.min ? ` · ${m.min} min` : ''}</span></small></div>${ib('edit', 'g-edit', `data-t="meet" data-id="${m.id}"`, 'Editar')}</div>
        ${nx ? `<div class="cf"><label class="swl2">${sw(!!m.sami, 'g-meet-sami', `data-id="${m.id}"`, m.sami ? 'Que Sami no entre' : 'Que Sami entre')}<span>${m.sami ? 'Sami entra' : 'Sami no entra'}</span></label><span class="sp"></span>${m.link ? `<button class="btn sm" data-act="copy" data-v="${esc(m.link)}">${ico('link', 'sm')} Copiar enlace</button>` : `<span class="dim">${ico('link', 'sm')} Sin enlace</span>`}</div>`
          : `<div class="cm">${(m.sum || []).map(([i, s]) => tag(i, s)).join('') || tag('clock', 'Resumen pendiente')}</div>`}
        <div class="gmtk">${tk.map((t, i) => `<div class="tkr"><button class="tk" role="checkbox" aria-checked="${t.done}" data-act="g-mt-tg" data-id="${m.id}" data-i="${i}"><span class="chbox" style="pointer-events:none;${t.done ? 'background:var(--blue);border-color:var(--blue)' : ''}">${ico('check')}</span><span>${esc(t.t)}</span></button>${ib('x', 'g-mt-del', `data-id="${m.id}" data-i="${i}"`, 'Quitar tarea')}</div>`).join('')}
          <form class="mini add" data-gform="mtask" data-id="${m.id}"><input name="v" placeholder="Agregar tarea" aria-label="Agregar tarea" autocomplete="off"><button class="icon-btn sm" type="submit" aria-label="Agregar">${ico('plus', 'sm')}</button></form></div>
        ${nx ? '' : `<div class="cf"><button class="btn sm" data-act="ask" data-q="Dame la transcripción de «${esc(m.t)}»">${ico('file', 'sm')} Transcripción</button></div>`}</article>`;
    };
    const sec = (i, t, arr) => (arr.length ? `<div class="sec-t" style="margin-top:6px"><h2>${ico(i)} ${t}</h2></div><div class="gcards">${arr.map(card).join('')}</div>` : '');
    return head('Reuniones', 'Lo que se habló, <em>y lo que falta</em>', `${pill('calendar', pl(all.filter(next).length, 'próxima', 'próximas'), 'strong')}${pill('check', pl(all.reduce((n, m) => n + open(m), 0), 'tarea pendiente', 'tareas pendientes'))}<a class="pill" href="#/ajustes">${ico('shield', 'sm')} Entrar a reuniones: ${auL}</a>`)
      + `<div class="mgbar">${search('reuniones')}${chips('meet:f', [['todas', 'grid', 'Todas'], ['proximas', 'calendar', 'Próximas'], ['pasadas', 'clock', 'Anteriores'], ['tareas', 'check', 'Con tareas', all.filter(m => open(m)).length]], 'todas')}<span class="sp"></span>${H.newBtn('meet', 'Nueva reunión')}</div>`
      + (list.length ? sec('calendar', 'Próximas', up) + sec('clock', 'Anteriores', past) : empty('video', 'Ninguna reunión coincide', H.newBtn('meet', 'Nueva reunión')));
  };
  EXT['g-meet-sami'] = el => { const m = ent('meet', el.dataset.id); patch('meet', m.id, { sami: !m.sami }, !m.sami ? 'Sami entrará a la reunión' : 'Sami no entrará'); };
  EXT['g-mt-tg'] = el => setTasks(el.dataset.id, t => { t[+el.dataset.i].done = !t[+el.dataset.i].done; return t; });
  EXT['g-mt-del'] = el => setTasks(el.dataset.id, t => t.filter((_, i) => i !== +el.dataset.i));

  /* ---------- Conexiones ---------- */
  const DEF = Object.fromEntries(NETS.concat(APPS).map(x => [x[0], x[4]]));
  const isOn = id => (id in sub('conn') ? sub('conn')[id] : id in DEF ? DEF[id] : GCONN_DEFAULT[id]);
  const site = () => Object.assign({ on: false, repo: '', branch: 'dev', host: 'Hostinger' }, gs().site || {});
  const allIds = () => NETS.map(n => n[0]).concat(APPS.map(a => a[0]), ['gread', 'gsend']);
  const onCount = () => allIds().filter(isOn).length + (site().on ? 1 : 0), total = () => allIds().length + 1;
  const avisos = () => (isOn('gsend') ? 0 : 1) + (DNS.some(d => !isOn(d[0])) ? 1 : 0);
  function setOn(id, v, msg) {
    const m = sub('conn'), had = id in m, prev = m[id]; m[id] = v; save(); render(true);
    toast(msg, { undo: () => { const t = sub('conn'); if (had) t[id] = prev; else delete t[id]; save(); render(true); } });
  }
  VIEW.conexiones = () => {
    const q = Q('conexiones').toLowerCase(), f = F('cx:f', 'todas'), vis = x => (!q || x[1].toLowerCase().includes(q)) && (f === 'todas' || (f === 'on') === isOn(x[0]));
    const tile = x => { const on = isOn(x[0]); return `<button class="cn2 ${on ? 'on' : 'off'}" data-act="g-conn" data-id="${x[0]}" data-name="${esc(x[1])}" aria-pressed="${on}" title="${esc(x[1])}: ${on ? 'conectada, toca para desconectar' : 'toca para conectar'}">${ico(x[2])}<b>${esc(x[1])}</b><small class="cns">${on ? esc(x[3] || 'Conectada') : 'Conectar'}</small><i class="st"></i></button>`; };
    const perm = items => `<ul class="perm">${items.map(([i, t]) => `<li>${ico(i, 'sm')}<span>${t}</span></li>`).join('')}</ul>`;
    const gcard = (id, icon, title, items, extra = '') => { const on = isOn(id); return `<div class="gcx ${on ? 'on' : ''}"><div class="gcx-h"><span class="ci">${ico(icon)}</span><div class="gct"><b>${title}</b><small>${on ? 'Conectado' : 'No conectado'}</small></div>${sw(on, 'g-gconn', `data-id="${id}"`, on ? 'Desconectar' : 'Conectar')}</div>${perm(items)}${extra}</div>`; };
    const miss = DNS.filter(d => !isOn(d[0])).length, s = site();
    const google = `<section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('mail')} Google: correo, agenda y documentos</h2></div>
      <div class="gx2">${gcard('gread', 'eye', 'Leer', [['mail', 'Ver la bandeja'], ['calendar', 'Ver y crear eventos'], ['file', 'Abrir Drive y Docs']])}${gcard('gsend', 'send', 'Enviar', [['send', 'Enviar correos por ti'], ['shield', 'Con tope diario y lista de bloqueo'], ['clock', 'Cada envío queda en un registro']], `<a class="lnk" href="#/correo">${ico('gear', 'sm')} Ajustar los límites</a>`)}</div>
      <div class="dns ${miss ? 'warn' : ''}"><div class="dns-h">${ico(miss ? 'info' : 'check')}<b>${miss ? 'Antes de enviar muchos correos' : 'Tu dominio está listo para enviar'}</b><span class="dim">Para que no lleguen a spam</span></div><div class="dns-r">${DNS.map(([id, t, h]) => `<button class="dnsb ${isOn(id) ? 'ok' : ''}" role="switch" aria-checked="${isOn(id)}" data-act="g-dns" data-id="${id}" title="${esc(h)}">${ico(isOn(id) ? 'check' : 'info', 'sm')}<b>${t}</b><small>${esc(h)}</small></button>`).join('')}</div></div></section>`;
    const siteHTML = `<section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('globe')} Sitio web</h2>${tag(s.on ? 'check' : 'info', s.on ? 'Conectado' : 'No conectado', s.on ? 'ok' : 'warn')}</div>
      ${s.on ? `<div class="cxsite"><div class="rowkv">${ico('file', 'sm')}<span>${esc(s.repo)}</span></div><div class="rowkv">${ico('layers', 'sm')}<span>Rama de pruebas: ${esc(s.branch)}</span></div><div class="rowkv">${ico('globe', 'sm')}<span>${esc(s.host)}</span></div></div>${perm([['eye', 'Lee tu sitio'], ['edit', 'Propone cambios'], ['layers', 'Los prueba en una copia'], ['shield', 'No publica sin tu revisión']])}<button class="btn sm" data-act="g-site-off">${ico('x', 'sm')} Desconectar</button>`
        : `<form class="sitef" data-gform="site"><label class="fld"><span>${ico('file', 'sm')} Repositorio</span><input name="repo" placeholder="usuario/repositorio" value="${esc(s.repo)}" autocomplete="off"></label><label class="fld"><span>${ico('layers', 'sm')} Rama de pruebas</span><input name="branch" value="${esc(s.branch)}" autocomplete="off"></label><label class="fld"><span>${ico('globe', 'sm')} Dónde está alojado</span><select name="host">${HOSTS.map(h => `<option ${h === s.host ? 'selected' : ''}>${h}</option>`).join('')}</select></label><button class="btn pri" type="submit">${ico('link', 'sm')} Conectar</button><p class="hint2">La clave de acceso la configura SAM Digital y nunca se muestra.</p></form>`}</section>`;
    const nets = NETS.filter(vis), apps = APPS.filter(vis);
    return head('Conexiones', 'Lo que Sami <em>puede usar</em>', `${pill('link', pl(onCount(), 'conexión activa', 'conexiones activas'), 'strong')}${avisos() ? pill('info', pl(avisos(), 'aviso', 'avisos')) : pill('check', 'Todo en orden')}<span class="chip">Ejemplo</span>`)
      + `<div class="mgbar">${search('conexiones')}${chips('cx:f', [['todas', 'grid', 'Todas'], ['on', 'check', 'Conectadas'], ['off', 'plus', 'Por conectar']], 'todas')}</div>`
      + `<div class="cx-stack">${google}${nets.length ? `<section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('users')} Redes sociales</h2></div><div class="cgrid">${nets.map(tile).join('')}</div></section>` : ''}${siteHTML}${apps.length ? `<section class="card pad"><div class="sec-t" style="margin:0 0 12px"><h2>${ico('chart')} Apps para medir y trabajar</h2></div><div class="cgrid">${apps.map(tile).join('')}</div></section>` : ''}</div>`
      + `<div class="solo">${ico('lock', 'sm')}<span>Las claves nunca se muestran. Puedes quitar el acceso cuando quieras.</span></div>`;
  };
  EXT['g-conn'] = el => { const id = el.dataset.id, on = isOn(id); setOn(id, !on, `${el.dataset.name} ${on ? 'desconectado' : 'conectado'}`); };
  EXT['g-gconn'] = el => { const id = el.dataset.id, on = isOn(id); setOn(id, !on, `${id === 'gread' ? 'Lectura' : 'Envío'} de Google ${on ? 'desconectado' : 'conectado'}`); };
  EXT['g-dns'] = el => { const id = el.dataset.id, on = isOn(id); setOn(id, !on, `${id.toUpperCase()} ${on ? 'pendiente' : 'listo'}`); };
  EXT['g-site-off'] = () => { const prev = gs().site; gs().site = Object.assign({}, site(), { on: false }); save(); render(true); toast('Sitio desconectado', { undo: () => { gs().site = prev; save(); render(true); } }); };

  /* Resumen que se ve en Ajustes */
  HOOK.connSummary = () => {
    const av = avisos(), dots = NETS.concat(APPS).map(x => `<span class="cdot ${isOn(x[0]) ? 'on' : ''}" title="${esc(x[1])}">${ico(x[2], 'sm')}</span>`).join('');
    return `<section class="card pad cxsum"><div class="sec-t" style="margin:0 0 10px"><h2>${ico('link')} Conexiones</h2></div><div class="cxs"><b>${onCount()}<span> de ${total()}</span></b><small>conectadas</small></div><div class="cdots">${dots}</div>${av ? `<div class="cx-av">${tag('info', `${av} ${av === 1 ? 'aviso' : 'avisos'}`, 'warn')}</div>` : ''}<a class="btn pri" href="#/conexiones" style="margin-top:12px">${ico('arrow', 'sm')} Gestionar</a></section>`;
  };

  /* Formularios propios (tareas de reunión, lista de evitar y conexión del sitio) */
  document.addEventListener('submit', e => {
    const f = e.target.closest && e.target.closest('[data-gform]'); if (!f) return;
    const k = f.dataset.gform; if (!['panti', 'mtask', 'site'].includes(k)) return;
    e.preventDefault();
    if (k === 'site') {
      const fd = new FormData(f), repo = String(fd.get('repo') || '').trim();
      if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) { toast('Escribe usuario/repositorio'); return; }
      gs().site = { on: true, repo, branch: String(fd.get('branch') || '').trim() || 'dev', host: String(fd.get('host') || 'Hostinger') }; save(); render(true); toast('Sitio conectado'); return;
    }
    const inp = f.querySelector('input[name="v"]'), v = inp ? inp.value.trim() : ''; if (!v) return;
    if (k === 'panti') { setP('anti', pv('anti', []).concat(v)); render(true); refocus('[data-gform="panti"] input'); }
    else { setTasks(f.dataset.id, t => t.concat({ t: v, done: false })); refocus(`[data-gform="mtask"][data-id="${f.dataset.id}"] input`); }
  });

  /* Avisos del menú y atajos del buscador */
  const b0 = HOOK.badges, p0 = HOOK.pal;
  HOOK.badges = () => Object.assign(b0 ? b0() : {}, { reuniones: ents('meet').reduce((n, m) => n + tasksOf(m).filter(t => !t.done).length, 0), conexiones: avisos() });
  HOOK.pal = () => (p0 ? p0() : []).concat([{ icon: 'video', t: 'Nueva reunión', run: () => openSheet('meet', null) }]);
};
