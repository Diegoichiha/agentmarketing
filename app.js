/* Plan de Agentes: pestañas, secciones interactivas y armador de paquetes. El contenido está en data.js */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const clone = o => JSON.parse(JSON.stringify(o));
  const LS = 'plan-agentes-infografia-v1';
  const FEATS = DATA.feats;
  const TAB_IDS = DATA.tabs.map(t => t.id);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Estado (se guarda en este navegador) ---------- */
  const fresh = () => ({
    tab: 'agente', skill: 0, layer: 2, step: 1, mem: 0, chat: 0, srv: 1, tree: 2, clients: 3,
    costOn: clone(DATA.costsDefault), risk: {}, checks: { agente: [], plataforma: [], paquetes: [] }, pk: clone(DATA.pkDefaults)
  });
  let S = fresh();
  try {
    const raw = JSON.parse(localStorage.getItem(LS) || 'null');
    if (raw && typeof raw === 'object') {
      Object.assign(S, raw);
      S.pk = Object.assign(clone(DATA.pkDefaults), raw.pk || {});
      S.pk.m = Object.assign(clone(DATA.pkDefaults.m), (raw.pk && raw.pk.m) || {});
    }
  } catch (e) { /* sin almacenamiento local */ }
  if (!TAB_IDS.includes(S.tab)) S.tab = 'agente';
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { /* ignorar */ } };

  /* ---------- Utilidades de formato ---------- */
  const r0 = x => Math.round(x);
  const num = x => r0(x).toLocaleString('es-CO');
  const usd = x => 'US$' + num(x);
  const rng = (a, b) => (r0(a) === r0(b) ? usd(a) : usd(a) + '–' + num(b));
  const cop = x => 'COP ' + (Math.round(x / 1000) * 1000).toLocaleString('es-CO');
  const todoDone = t => DATA.todos[t].filter((_, i) => S.checks[t][i]).length;
  const ringSvg = (frac, cls = 'ring') => {
    const r = 10, c = 2 * Math.PI * r;
    return `<svg class="${cls}" viewBox="0 0 26 26" aria-hidden="true"><circle class="ring-bg" cx="13" cy="13" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="3"/><circle class="ring-fg" cx="13" cy="13" r="${r}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - frac)}" transform="rotate(-90 13 13)"/></svg>`;
  };

  /* ---------- Piezas reutilizables ---------- */
  const hero = id => {
    const t = DATA.tabs.find(x => x.id === id);
    return `<section class="hero"><div class="big" aria-hidden="true">${t.n}</div><span class="kick">${t.n} · ${esc(t.label)}</span><h1>${esc(t.title)}</h1><p>${esc(t.lead)}</p><div class="stats">${DATA.stats[id].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div></section>`;
  };
  const sec = (id, kick, title, body, sub) => `<section class="sec" id="${id}"><header class="sec-h"><span class="kick">${esc(kick)}</span><h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</header>${body}</section>`;
  const comp = (name, cls = '') => `<div id="c-${name}" class="${cls}">${COMP[name]()}</div>`;
  const lvChip = k => `<span class="chip lv-${k}">${{ verde: 'Libre', ambar: 'Mixto', rojo: 'Con aprobación' }[k]}</span>`;

  /* ---------- Componentes ---------- */
  const COMP = {
    flow: () => `<div class="flow">${DATA.flow.map((s, i) => `<div class="step${s.gate ? ' gate' : ''}">${s.gate ? '<span class="chip lv-rojo tag">Compuerta</span>' : ''}<div class="n">${i + 1}</div><div class="ib">${ico(s.icon)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div>
      <div class="legend"><span><i style="background:var(--verde)"></i>Lo que hace solo: leer, investigar, preparar borradores</span><span><i style="background:var(--rojo)"></i>Lo que espera tu aprobación: publicar, enviar, gastar</span></div>`,

    engines: () => `<div class="grid g2">${DATA.engines.map(e => `<article class="card engine${e.pick ? ' pick' : ''}"><div><span class="chip ${e.pick ? 'accent' : ''}">${esc(e.badge)}</span></div><div><h3>${esc(e.name)}</h3><span class="by">${esc(e.by)}</span></div><ul>${e.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul></article>`).join('')}</div>
      <div class="note">${ico('flag')}<span>${esc(DATA.enginesNote)}</span></div>`,

    models: () => `<div class="card bars"><div><h3 style="font-family:var(--f-display);font-size:20px">Modelos de IA y lo que cuestan</h3><p class="sub" style="font-size:13.5px;color:var(--ink-2);margin-top:4px">Dólares por millón de tokens. Es lo que cuesta que el agente lea (entrada) y escriba (salida).</p></div>
      ${DATA.models.map(m => `<div class="mbar"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>${esc(m.name)}</b><span style="color:var(--ink-2);font-size:13px">${esc(m.use)}</span></div>
        <div class="row"><span>Entrada</span><div class="track"><i style="width:${Math.max(m.input / 10 * 100, 1.5)}%"></i></div><b>US$${m.input}</b></div>
        <div class="row"><span>Salida</span><div class="track"><i style="width:${Math.max(m.output / 10 * 100, 1.5)}%"></i></div><b>US$${m.output}</b></div>
        <div style="font-size:12.5px;color:var(--ink-3);margin-top:6px">${esc(m.cache)}</div></div>`).join('')}</div>`,

    telegramList: () => `<div class="card grid" style="gap:18px">${DATA.telegram.map(t => `<div class="mini"><div class="ib">${ico(t.icon)}</div><div><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p></div></div>`).join('')}</div>`,

    chat: () => {
      const ask = '<div class="msg me"><span class="tt">Tú</span>Prepara 3 posts para el lanzamiento del lunes.</div><div class="msg ag"><span class="tt">Agente</span>Listo: 3 piezas en borrador con el tono de la marca. ¿Las publico en Instagram?</div>';
      const body = S.chat === 0 ? ask + '<div class="btns"><button class="ok" data-act="chat" data-v="1">Aprobar</button><button class="no" data-act="chat" data-v="2">Rechazar</button></div>'
        : S.chat === 1 ? ask + '<div class="msg me"><span class="tt">Tú</span>Aprobado.</div><div class="msg ag"><span class="tt">Agente</span>Hecho: quedan programadas para el lunes. Anoté que este tono funcionó.</div><button class="again" data-act="chat" data-v="0">Repetir ejemplo</button>'
        : ask + '<div class="msg me"><span class="tt">Tú</span>Rechazado: muy formal.</div><div class="msg ag"><span class="tt">Agente</span>Entendido, no publico nada. Guardo en memoria: tono cercano en Instagram. Te mando otra versión.</div><button class="again" data-act="chat" data-v="0">Repetir ejemplo</button>';
      return `<div class="phone"><div class="phone-top"><div class="av">${ico('bot')}</div><div><b>Agente SAM Digital</b><span>bot de la marca</span></div></div><div class="chat">${body}</div><div class="ex">Ejemplo ilustrativo</div></div>`;
    },

    tree: () => {
      const cur = DATA.brandTree[S.tree] || DATA.brandTree[0];
      return `<div class="tree">${DATA.brandTree.map((n, i) => `<button class="${i === S.tree ? 'on' : ''}" data-act="tree" data-i="${i}" style="padding-left:${n.lvl * 22}px"><span class="fn ${n.f.endsWith('/') ? 'dir' : 'fl'}">${n.f.endsWith('/') ? '▸ ' : ''}${esc(n.f)}</span></button>`).join('')}<div class="tree-d" aria-live="polite"><b>${esc(cur.f)}</b> ${esc(cur.d)}</div></div>`;
    },

    memory: () => {
      const pts = [[50, 11], [89, 50], [50, 89], [11, 50]];
      const arrows = [-45, 45, 135, 225].map(a => { const x = 50 + 39 * Math.cos(a * Math.PI / 180), y = 50 + 39 * Math.sin(a * Math.PI / 180); return `<path d="M-3.2 -3 L2.2 0 L-3.2 3" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${a + 90})" fill="none" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`; }).join('');
      const cur = DATA.memory[S.mem];
      return `<div class="cycle"><div class="ring-box"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="39" fill="none" stroke="var(--line)" stroke-width="1.6" stroke-dasharray="3 3"/>${arrows}</svg>
        ${DATA.memory.map((m, i) => `<button class="cn${i === S.mem ? ' on' : ''}" data-act="mem" data-i="${i}" style="left:${pts[i][0]}%;top:${pts[i][1]}%"><small>${i + 1}</small>${esc(m.t)}</button>`).join('')}</div>
        <div class="cdet"><span class="chip accent">Paso ${S.mem + 1} de 4</span><h3 style="margin-top:8px">${esc(cur.t)}</h3><p>${esc(cur.d)}</p><div class="ex"><em>Ejemplo</em>${esc(cur.ex)}</div></div></div>`;
    },

    skills: () => {
      const k = DATA.skills[S.skill];
      return `<div class="sk"><div class="sk-list">${DATA.skills.map((s, i) => `<button class="sk-card" data-act="skill" data-i="${i}" aria-pressed="${i === S.skill}"><div class="ib">${ico(s.icon)}</div><b>${esc(s.name)}</b><div class="row">${lvChip(s.level)}<span class="chip">Semana ${s.week}</span></div></button>`).join('')}</div>
        <article class="card sk-det sticky-panel"><div class="ib">${ico(k.icon)}</div><h3>${esc(k.name)}</h3>
          <h4>Qué hace</h4><p>${esc(k.does)}</p>
          <h4>Qué necesita</h4><ul class="plain">${k.needs.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
          <h4>Costo</h4><p>${esc(k.cost)}</p>
          <div class="lvbox lv-${k.level}">${ico(k.level === 'verde' ? 'check' : 'shield')}<span>${esc(k.levelTxt)}</span></div></article></div>`;
    },

    levels: () => `<div class="ladder">${DATA.levels.map(l => `<article class="lad ${l.key}"><h3><span class="dot"></span>${esc(l.t)}</h3><p>${esc(l.d)}</p><ul class="plain">${l.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}</div>
      <div class="grid g3" style="margin-top:16px">${DATA.safety.map(s => `<div class="card mini"><div class="ib">${ico(s.icon)}</div><div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></div>`).join('')}</div>`,

    layers: () => {
      const order = DATA.layers.map((l, i) => i).reverse();
      const cur = DATA.layers[S.layer];
      return `<div class="pl"><div><div class="stack">${order.map(i => { const l = DATA.layers[i]; return `<button class="lay ${l.phase}" data-act="layer" data-i="${i}" aria-pressed="${i === S.layer}"><div class="ib">${ico(l.icon)}</div><div><b>${esc(l.name)}</b><small>${esc(l.sum)}</small></div><span class="chip ${l.phase === 'piloto' ? 'accent' : ''}">${l.phase === 'piloto' ? 'Piloto' : 'Después'}</span></button>`; }).join('')}</div>
        <div class="stack-axis"><span>↑ Lo que ve y paga el cliente</span><span>↓ Lo que sostiene todo</span></div></div>
        <article class="card sk-det sticky-panel"><div class="ib">${ico(cur.icon)}</div><span class="chip ${cur.phase === 'piloto' ? 'accent' : ''}" style="margin-left:8px">${cur.phase === 'piloto' ? 'Parte del piloto' : 'Después del piloto'}</span><h3>${esc(cur.name)}</h3><p style="margin-top:6px">${esc(cur.sum)}</p><h4>Qué incluye</h4><ul class="plain">${cur.has.map(h => `<li>${esc(h)}</li>`).join('')}</ul><h4>Estado</h4><p>${esc(cur.status)}</p></article></div>`;
    },

    servers: () => {
      const cur = DATA.servers[S.srv];
      return `<div class="srv-pick">${DATA.servers.map((s, i) => `<button class="srv-card" data-act="srv" data-i="${i}" aria-pressed="${i === S.srv}"><h3>${s.n}${s.pick ? '<span class="chip accent">Recomendado</span>' : ''}</h3><div class="price">US$${s.promo}<small>/mes*</small></div><div class="bar-ram"><i style="width:${s.ram / 32 * 100}%"></i></div><div class="sp">${s.cpu} vCPU · ${s.ram} GB · ${s.disk} GB</div></button>`).join('')}</div>
        <div class="srv-det"><div class="k"><b>US$${cur.today.toFixed(2)}</b><span>se paga hoy por 24 meses</span></div><div class="k"><b>US$${cur.renew}/mes</b><span>renovación</span></div><div class="k"><b>${cur.bw} TB</b><span>de transferencia</span></div><p>${esc(cur.note)}</p></div>
        <p style="font-size:12px;color:var(--ink-3);margin-top:8px">* Precio promocional con contrato de 24 meses, tomado de la página de planes de Hostinger. Hay garantía de devolución de 30 días.</p>
        <div class="grid g2 others">${DATA.serverOthers.map(o => `<div class="card other"><div class="ib" style="${o.ok === false ? 'background:var(--rojo-bg);color:var(--rojo)' : ''}">${ico(o.ok === false ? 'alert' : 'cloud')}</div><div><h3>${esc(o.t)} ${o.ok === false ? '<span class="chip lv-rojo">No sirve para el agente</span>' : '<span class="chip">Alternativa</span>'}</h3><p>${esc(o.d)}</p></div></div>`).join('')}</div>
        <div class="hard"><span>Al contratarlo se configura:</span>${DATA.hardening.map(h => `<span class="chip">${esc(h)}</span>`).join('')}</div>`;
    },

    costs: () => {
      let mn = 0, mx = 0;
      const rows = DATA.costs.map(c => {
        const on = !!S.costOn[c.id]; if (on) { mn += c.min; mx += c.max; }
        return `<div class="cost-row${on ? '' : ' off'}"><label><input type="checkbox" data-act="cost" data-id="${c.id}" ${on ? 'checked' : ''} aria-label="Incluir ${esc(c.name)}"></label><div class="nm"><b>${esc(c.name)}</b><small>${esc(c.phase)} · ${esc(c.note)}</small></div><div class="rng-w"><div class="rng${on ? '' : ' off'}"><i style="left:${c.min}%;width:${Math.max(c.max - c.min, 2)}%"></i></div></div><div class="v">${c.min === c.max ? usd(c.min) : `US$${c.min}–${c.max}`}</div></div>`;
      }).join('');
      return `<div class="card"><div class="axis"><div></div><div>Rubro</div><div><span>US$0</span><span>50</span><span>100 al mes</span></div><div></div></div>${rows}</div>
        <div class="total"><div><span>Total mensual estimado con lo que enciendes</span><b>${mx ? rng(mn, mx) : 'US$0'}</b></div><div style="max-width:320px;font-size:13px;opacity:.75">Enciende o apaga cada rubro con su casilla. Son rangos estimados: el costo real sale de medir el piloto.</div></div>`;
    },

    lanesOut: () => {
      const n = S.clients;
      return `<div class="lane-out"><div class="k"><b>${n}</b><span>carriles (bot + marca + memoria)</span></div><div class="k"><b>US$${15 * n}–${60 * n}</b><span>costo variable aproximado al mes</span></div></div>
        <div class="server-box"><div class="lab">${ico('server', '')} 1 servidor</div><div class="lanes">${Array.from({ length: n }, (_, i) => `<div class="ln"><b>Cliente ${i + 1}</b>Bot de Telegram<span>carpeta de marca</span><span>memoria propia</span></div>`).join('')}</div></div>`;
    },

    pay: () => `<div class="grid g2"><article class="card"><div class="panel-t"><div class="ib">${ico('card')}</div>Cobros</div><div class="list-s">${DATA.pay.map(p => `<div class="li-s"><h3>${esc(p.t)} <span class="chip s-${p.s.split(' ')[0]}">${esc(p.s)}</span></h3><p>${esc(p.d)}</p></div>`).join('')}</div></article>
      <article class="card"><div class="panel-t"><div class="ib">${ico('scale')}</div>Legal y cumplimiento</div><div class="list-s">${DATA.legal.map(p => `<div class="li-s"><h3>${esc(p.t)} <span class="chip s-${p.s.split(' ')[0]}">${esc(p.s)}</span></h3><p>${esc(p.d)}</p></div>`).join('')}</div></article></div>`,

    road: () => {
      const dots = ['F0', 'S1', 'S2', 'S3', 'S4', 'P', 'L', '?'];
      const cur = DATA.roadmap[S.step];
      return `<div class="pilot-band" style="width:62.5%">Piloto interno</div>
        <div class="road" style="margin-top:12px">${DATA.roadmap.map((r, i) => `<button class="rd${r.pilot ? ' pilot' : ''}" data-act="step" data-i="${i}" aria-pressed="${i === S.step}"><span class="dt">${dots[i]}</span><span class="tx"><b>${esc(r.t)}</b><small>${esc(r.w)}</small></span></button>`).join('')}</div>
        <article class="card rd-det"><div class="ib">${ico('route')}</div><div><span class="chip ${cur.pilot ? 'accent' : ''}">${esc(cur.w)}${cur.st ? ' · ' + esc(cur.st) : ''}</span><h3 style="margin-top:6px">${esc(cur.t)}</h3><p>${esc(cur.d)}</p></div></article>`;
    },

    risks: () => `<div class="grid g3" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">${DATA.risks.map((r, i) => { const open = !!S.risk[i]; return `<button class="risk" data-act="risk" data-i="${i}" aria-expanded="${open}"><div class="ib">${ico('alert')}</div><b>${esc(r.t)}</b>${open ? `<div class="fx"><em>Cómo se reduce</em>${esc(r.fix)}</div>` : '<span class="hint">Toca para ver cómo se reduce</span>'}</button>`; }).join('')}</div>`,

    feats: () => `<div class="grid g3" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${FEATS.map(f => `<article class="card feat"><div class="ib">${ico(f.icon)}</div><h3>${esc(f.name)}</h3><p>${esc(f.ben)}</p><div class="meta"><span class="chip">Desde la semana ${f.week}</span><span class="chip">Servir: US$${f.cost[0]}–${f.cost[1]}/mes</span><span class="chip">${String(f.hrs).replace('.', ',')} h de supervisión</span></div></article>`).join('')}</div>
      <p style="margin-top:12px;font-size:12.5px;color:var(--ink-3)">Costos y horas son supuestos iniciales por marca y por mes, calculados sobre 20 piezas. Se reemplazan con lo que mida el piloto.</p>`,

    sell: () => `<div class="grid g4">${DATA.sell.map(s => `<article class="card sell"><div class="ib">${ico(s.icon)}</div><h3>${esc(s.t)}</h3><ul class="plain">${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}</div>
      <div class="metrics">${DATA.metrics.map(([a, b]) => `<div class="metric"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>`
  };

  /* ---------- Lista de pendientes (con anillo de avance) ---------- */
  const todoHTML = t => {
    const items = DATA.todos[t], d = todoDone(t), tot = items.length, c = 2 * Math.PI * 52;
    return `<div class="card todo-wrap"><div class="big-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="10"/><circle id="tr-${t}" cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - d / tot)}"/></svg><div><b id="tn-${t}">${d}/${tot}</b><span>resueltos</span></div></div>
      <ul class="todo">${items.map((x, i) => `<li><label><input type="checkbox" data-act="chk" data-t="${t}" data-i="${i}" ${S.checks[t][i] ? 'checked' : ''}><span class="bx">${ico('check')}</span><span>${esc(x)}</span></label></li>`).join('')}</ul></div>`;
  };
  function updateTodo(t) {
    const d = todoDone(t), tot = DATA.todos[t].length, c = 2 * Math.PI * 52;
    const tr = $('#tr-' + t), tn = $('#tn-' + t);
    if (tr) tr.setAttribute('stroke-dashoffset', c * (1 - d / tot));
    if (tn) tn.textContent = d + '/' + tot;
    renderTabs();
  }

  /* ---------- Armador de paquetes ---------- */
  function calcPk(p) {
    const m = Math.max(1, +S.pk.marcas[p] || 1), pz = Math.max(0, +S.pk.piezas[p] || 0) / 20, tarifa = +S.pk.tarifa || 0;
    const mg = Math.min(0.9, Math.max(0, (+S.pk.margen || 0) / 100));
    let cmin = 0, cmax = 0, h = 0; const addons = [];
    for (const f of FEATS) {
      const st = S.pk.m[f.id][p], k = m * (f.scale === 'piezas' ? pz : 1);
      if (st === 1) { cmin += f.cost[0] * k; cmax += f.cost[1] * k; h += f.hrs * k; }
      else if (st === 2) addons.push({ f, min: (f.cost[0] + f.hrs * tarifa) * k, max: (f.cost[1] + f.hrs * tarifa) * k });
    }
    const human = h * tarifa, tmin = cmin + human, tmax = cmax + human;
    return { m, pz: S.pk.piezas[p], cmin, cmax, h, human, tmin, tmax, pmin: tmin / (1 - mg), pmax: tmax / (1 - mg), mg, addons };
  }
  const cellHTML = (f, p) => {
    const v = S.pk.m[f.id][p];
    const lab = ['No incluido', 'Incluido', 'Complemento'][v];
    return `<div class="mx-c"><button class="cell s${v}" data-act="cell" data-f="${f.id}" data-p="${p}" aria-label="${esc(f.name)}, paquete ${esc(S.pk.names[p])}: ${lab}. Toca para cambiar." title="${lab}">${v === 1 ? ico('check') : v === 2 ? '+' : '—'}<span class="t">${v === 0 ? '' : lab}</span></button></div>`;
  };
  function matrixHTML() {
    const head = `<div class="mx-head"><div class="mx-corner">Funcionalidad</div>${[0, 1, 2].map(p => `<div class="mx-pk"><input class="pk-name" data-pkname="${p}" value="${esc(S.pk.names[p])}" maxlength="24" aria-label="Nombre del paquete ${p + 1}"><div class="pk-price" id="pk-price-${p}"></div><div class="pk-sub" id="pk-sub-${p}"></div></div>`).join('')}</div>`;
    const rows = FEATS.map(f => `<div class="mx-row" id="row-${f.id}"><div class="mx-f"><div class="ib">${ico(f.icon)}</div><div><b>${esc(f.name)}</b><small>${esc(f.ben)}</small></div></div>${[0, 1, 2].map(p => cellHTML(f, p)).join('')}</div>`).join('');
    const lim = (lab, key, min) => `<div class="mx-row mx-lim"><div class="mx-f"><div><b>${lab}</b></div></div>${[0, 1, 2].map(p => `<div class="mx-c"><input type="number" min="${min}" max="999" inputmode="numeric" data-pk="${key}:${p}" value="${S.pk[key][p]}" aria-label="${lab} del paquete ${esc(S.pk.names[p])}"></div>`).join('')}</div>`;
    return `<div class="matrix">${head}${rows}${lim('Marcas incluidas', 'marcas', 1)}${lim('Piezas de redes al mes por marca', 'piezas', 0)}</div>`;
  }
  function pkCards() {
    return [0, 1, 2].map(p => {
      const r = calcPk(p), trm = parseFloat(S.pk.trm) || 0, inc = FEATS.filter(f => S.pk.m[f.id][p] === 1).length;
      return `<article class="card pkc"><h3>${esc(S.pk.names[p])}</h3><div class="pr">${rng(r.pmin, r.pmax)}<small style="font-size:14px;color:var(--ink-3);font-family:var(--f-body)"> /mes</small></div>${trm ? `<div class="cop">≈ ${cop(r.pmin * trm)} – ${num(Math.round(r.pmax * trm / 1000) * 1000)}</div>` : ''}
        <dl><dt>Funcionalidades incluidas</dt><dd>${inc} de ${FEATS.length}</dd><dt>Marcas · piezas al mes</dt><dd>${r.m} · ${r.pz}</dd><dt>Servicios (IA, envíos)</dt><dd>${rng(r.cmin, r.cmax)}</dd><dt>Supervisión humana</dt><dd>${r.h.toFixed(1).replace('.', ',')} h = ${usd(r.human)}</dd><dt>Costo total</dt><dd>${rng(r.tmin, r.tmax)}</dd><dt>Margen objetivo</dt><dd>${S.pk.margen}%</dd></dl>
        ${r.addons.length ? `<h4>Complementos disponibles</h4>${r.addons.map(a => `<div class="ad"><span>${esc(a.f.name)}</span><span>+${rng(a.min / (1 - r.mg), a.max / (1 - r.mg))}</span></div>`).join('')}` : ''}</article>`;
    }).join('');
  }
  function updatePk() {
    for (let p = 0; p < 3; p++) {
      const r = calcPk(p), pr = $('#pk-price-' + p), sb = $('#pk-sub-' + p);
      if (pr) pr.innerHTML = `<span class="cur">US$</span>${num(r.pmin)}–${num(r.pmax)}`;
      if (sb) sb.textContent = `costo ${rng(r.tmin, r.tmax)} · ${r.h.toFixed(1).replace('.', ',')} h`;
    }
    const cards = $('#pk-cards'); if (cards) cards.innerHTML = pkCards();
  }
  const armador = () => `<div class="banner">${ico('alert')}<span><b>Supuestos para jugar, no cifras medidas.</b> Los costos por funcionalidad, las horas y la tarifa son un punto de partida. Cámbialos y, tras el piloto, reemplázalos con los reales. Todo lo que cambies se guarda en este navegador.</span></div>
    <div class="ctrls"><label>Tarifa por hora de supervisión (US$)<input type="number" min="0" step="1" data-pkg="tarifa" value="${S.pk.tarifa}"></label><label>Margen objetivo (%)<input type="number" min="0" max="90" step="1" data-pkg="margen" value="${S.pk.margen}"></label><label>TRM en COP por US$ (opcional)<input type="number" min="0" step="10" data-pkg="trm" value="${S.pk.trm}" placeholder="Ej. el dólar de hoy"></label><button class="btn" data-act="pkreset">Restablecer supuestos</button></div>
    ${matrixHTML()}
    <div class="mx-legend"><span class="chip accent">${ico('check')} Incluido</span><span class="chip" style="border-style:dashed;color:var(--accent);border-color:var(--accent)">+ Complemento</span><span class="chip">— No incluido</span><span>Toca cada casilla para cambiarla. Precio sugerido = costo total ÷ (1 − margen).</span></div>
    <div class="pk-cards" id="pk-cards"></div>`;

  /* ---------- Contenido de cada pestaña ---------- */
  const VIEW = {
    agente: () => hero('agente')
      + sec('a-flujo', 'Visión general', 'Una orden entra por Telegram y sale como trabajo aprobado', comp('flow'))
      + sec('a-cerebro', 'Pieza 1 · Cerebro', 'El cerebro: qué programa corre al agente', comp('engines') + '<div style="margin-top:14px">' + COMP.models() + '</div>', 'Es la decisión más importante del agente y la única que se resuelve probando.')
      + sec('a-telegram', 'Pieza 2 · Interfaz', 'Telegram: la puerta de entrada', `<div class="tg">${COMP.telegramList()}<div id="c-chat">${COMP.chat()}</div></div>`)
      + sec('a-marca', 'Pieza 3 · Marca', 'La marca: el agente trabaja siempre con base en ella', `<div class="two"><div id="c-tree">${COMP.tree()}</div><div class="grid">${DATA.brandNotes.map(n => `<div class="card mini"><div class="ib">${ico('folder')}</div><div><h3>${esc(n.t)}</h3><p>${esc(n.d)}</p></div></div>`).join('')}<div class="note" style="margin:0">${ico('book')}<span>El agente lee esta carpeta antes de cada tarea. Si algo cambia en la marca, se cambia aquí y el agente lo usa desde la siguiente vez.</span></div></div></div>`, 'Una carpeta por cliente. Toca un archivo para ver para qué sirve.')
      + sec('a-memoria', 'Pieza 4 · Memoria', 'La memoria: aprende de lo que apruebas', comp('memory'), 'Cada decisión tuya mejora al agente, siempre con una persona que revisa lo aprendido.')
      + sec('a-habilidades', 'Habilidades', 'Las seis cosas que sabe hacer', comp('skills'), 'Toca una habilidad para ver qué hace, qué necesita y cuánto cuesta.')
      + sec('a-reglas', 'Pieza 5 · Reglas', 'Qué puede hacer solo y qué no', comp('levels'))
      + sec('a-pendientes', 'Pendientes', 'Qué falta para encender el agente', todoHTML('agente')),

    plataforma: () => hero('plataforma')
      + sec('p-capas', 'Arquitectura', 'La plataforma en seis capas', comp('layers'), 'Las capas de abajo sostienen el piloto. Las de arriba se construyen después, con los resultados en la mano.')
      + sec('p-servidor', 'Infraestructura', 'Dónde corre el agente', comp('servers'), 'Planes VPS de Hostinger tomados de su página de precios.')
      + sec('p-costos', 'Presupuesto', 'Cuánto cuesta mantenerlo al mes', comp('costs'))
      + sec('p-escala', 'Escalar', 'Un servidor, muchos clientes', `<div class="card"><div class="lanes-top"><div class="slider"><label for="clients">Clientes atendidos <b id="clients-n">${S.clients}</b></label><input id="clients" type="range" min="1" max="12" value="${S.clients}" data-act="clients"></div></div><div id="lanes-out">${COMP.lanesOut()}</div></div><p style="margin-top:12px;font-size:13px;color:var(--ink-2)">${esc(DATA.laneNote)}</p>`, 'Cada cliente tiene su propio carril: así la memoria y los accesos no se mezclan.')
      + sec('p-cobros', 'Negocio', 'Cobrar y cumplir', COMP.pay())
      + sec('p-ruta', 'Hoja de ruta', 'De la planeación al lanzamiento', comp('road'))
      + sec('p-riesgos', 'Riesgos', 'Qué puede salir mal y cómo se reduce', comp('risks'))
      + sec('p-pendientes', 'Pendientes', 'Qué falta para tener la plataforma lista', todoHTML('plataforma')),

    paquetes: () => hero('paquetes')
      + sec('k-funciones', 'Catálogo', 'Todo lo que puedes darle al cliente', COMP.feats(), 'Cada funcionalidad viene de una habilidad del agente. Esto es lo que se reparte entre los paquetes.')
      + sec('k-armador', 'Armador', 'Define los paquetes y mira su precio', armador(), 'Cambia el nombre de cada paquete, enciende funcionalidades y ajusta marcas y piezas.')
      + sec('k-venta', 'Venta', 'Cómo se vende', COMP.sell())
      + sec('k-pendientes', 'Pendientes', 'Qué falta para poder vender', todoHTML('paquetes'))
  };

  /* ---------- Render y navegación ---------- */
  function renderTabs() {
    $('#tabs').innerHTML = DATA.tabs.map(t => {
      const tot = DATA.todos[t.id].length, d = todoDone(t.id);
      return `<button class="tab" role="tab" id="tab-${t.id}" data-id="${t.id}" aria-selected="${t.id === S.tab}" tabindex="${t.id === S.tab ? 0 : -1}" aria-controls="view" title="${d} de ${tot} pendientes resueltos"><span class="num">${t.n}</span><span class="lab"><span class="l-long">${esc(t.label)}</span><span class="l-short">${esc(t.short)}</span></span><span class="cnt">${d}/${tot}</span></button>`;
    }).join('');
  }
  function renderSubnav() {
    $('#subnav').innerHTML = '<div class="sn-h">En esta pestaña</div>' + DATA.nav[S.tab].map(([id, lab]) => `<a href="#${id}" data-id="${id}">${esc(lab)}</a>`).join('');
  }
  function measure() {
    const root = document.documentElement;
    root.style.setProperty('--bar-h', $('#bar').offsetHeight + 'px');
    root.style.setProperty('--sub-h', matchMedia('(max-width: 920px)').matches ? $('#subnav').offsetHeight + 'px' : '0px');
  }
  let io = null;
  function spy() {
    if (io) io.disconnect();
    const links = $$('.subnav a');
    if (!links.length) return;
    io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('on', a.dataset.id === e.target.id));
        const on = links.find(a => a.dataset.id === e.target.id), sn = $('#subnav');
        if (on && sn.scrollWidth > sn.clientWidth) sn.scrollTo({ left: on.offsetLeft - sn.clientWidth / 2 + on.clientWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }, { rootMargin: `-${$('#bar').offsetHeight + 40}px 0px -62% 0px` });
    $$('.sec', $('#view')).forEach(s => io.observe(s));
  }
  function setTab(id, anchor) {
    S.tab = id; document.body.dataset.tab = id; save();
    renderTabs(); renderSubnav();
    const view = $('#view');
    view.innerHTML = VIEW[id]();
    view.style.animation = 'none'; void view.offsetHeight; view.style.animation = '';
    if (id === 'paquetes') updatePk();
    measure(); spy();
    try { history.replaceState(null, '', '#' + (anchor || id)); } catch (e) { /* ignorar */ }
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
    onScroll();
  }
  function refresh(name, id) {
    const box = $('#' + (id || 'c-' + name)); if (!box) return;
    const a = document.activeElement; let key = null;
    if (a && a.dataset && a.dataset.act && box.contains(a)) key = `[data-act="${a.dataset.act}"]` + (a.dataset.i != null ? `[data-i="${a.dataset.i}"]` : '') + (a.dataset.id ? `[data-id="${a.dataset.id}"]` : '');
    box.innerHTML = COMP[name]();
    if (key) { const el = $(key, box); if (el) el.focus({ preventScroll: true }); }
  }

  /* ---------- Eventos ---------- */
  const view = $('#view');
  view.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, i = +el.dataset.i;
    if (a === 'skill') { S.skill = i; save(); refresh('skills'); }
    else if (a === 'layer') { S.layer = i; save(); refresh('layers'); }
    else if (a === 'step') { S.step = i; save(); refresh('road'); }
    else if (a === 'mem') { S.mem = i; save(); refresh('memory'); }
    else if (a === 'tree') { S.tree = i; save(); refresh('tree', 'c-tree'); }
    else if (a === 'srv') { S.srv = i; save(); refresh('servers'); }
    else if (a === 'chat') { S.chat = +el.dataset.v; save(); refresh('chat', 'c-chat'); }
    else if (a === 'risk') { S.risk[i] = !S.risk[i]; save(); refresh('risks'); }
    else if (a === 'cell') {
      const f = el.dataset.f, p = +el.dataset.p;
      S.pk.m[f][p] = (S.pk.m[f][p] + 1) % 3; save();
      const c = el.closest('.mx-c'); c.outerHTML = cellHTML(FEATS.find(x => x.id === f), p);
      const nb = $(`[data-act="cell"][data-f="${f}"][data-p="${p}"]`); if (nb) nb.focus({ preventScroll: true });
      updatePk();
    }
    else if (a === 'pkreset') {
      S.pk = clone(DATA.pkDefaults); save();
      $('#k-armador').outerHTML = sec('k-armador', 'Armador', 'Define los paquetes y mira su precio', armador(), 'Cambia el nombre de cada paquete, enciende funcionalidades y ajusta marcas y piezas.');
      updatePk(); spy();
    }
  });
  view.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.act === 'cost') { S.costOn[el.dataset.id] = el.checked ? 1 : 0; save(); refresh('costs'); }
    else if (el.dataset.act === 'chk') { const t = el.dataset.t; S.checks[t][+el.dataset.i] = el.checked; save(); updateTodo(t); }
  });
  view.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.act === 'clients') { S.clients = +el.value; save(); $('#clients-n').textContent = S.clients; $('#lanes-out').innerHTML = COMP.lanesOut(); }
    else if (el.dataset.pkname != null) { S.pk.names[+el.dataset.pkname] = el.value; save(); updatePk(); }
    else if (el.dataset.pk) { const [k, p] = el.dataset.pk.split(':'); S.pk[k][+p] = el.value === '' ? 0 : +el.value; save(); updatePk(); }
    else if (el.dataset.pkg) { S.pk[el.dataset.pkg] = el.value; save(); updatePk(); }
  });

  $('#tabs').addEventListener('click', e => { const t = e.target.closest('.tab'); if (t && t.dataset.id !== S.tab) setTab(t.dataset.id); });
  $('#tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = TAB_IDS.indexOf(S.tab), n = TAB_IDS[(i + (e.key === 'ArrowRight' ? 1 : TAB_IDS.length - 1)) % TAB_IDS.length];
    setTab(n); $('#tab-' + n).focus();
  });
  $('#subnav').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault();
    const t = document.getElementById(a.dataset.id);
    if (t) { t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); try { history.replaceState(null, '', '#' + a.dataset.id); } catch (er) { /* ignorar */ } }
  });
  $('#reset').addEventListener('click', () => {
    if (!confirm('¿Restablecer los pendientes, el armador de paquetes y las selecciones de esta página?')) return;
    try { localStorage.removeItem(LS); } catch (e) { /* ignorar */ }
    S = fresh(); setTab('agente');
  });
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      $('#prog i').style.width = (max > 0 ? Math.min(100, h.scrollTop / max * 100) : 0) + '%';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); spy(); });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe($('#bar'));
  window.addEventListener('hashchange', () => routeHash(false));

  function routeHash(initial) {
    const h = decodeURIComponent(location.hash.slice(1));
    if (TAB_IDS.includes(h)) { if (h !== S.tab || initial) setTab(h); return; }
    const prefix = { a: 'agente', p: 'plataforma', k: 'paquetes' }[h.slice(0, 1)];
    if (prefix && /^[apk]-/.test(h) && document.getElementById(h) === null && prefix !== S.tab) { setTab(prefix, h); return; }
    if (initial) setTab(S.tab);
    else { const t = document.getElementById(h); if (t) t.scrollIntoView({ block: 'start' }); }
  }
  routeHash(true);
})();
