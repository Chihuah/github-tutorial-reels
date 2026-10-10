// Shared engine for every episode.
//
// An episode page loads lib/reel.css and this file, then:
//   1. Reel.setup({...})      builds the frame (header, terminal, cards, captions)
//   2. fills its cards with episode-specific content
//   3. writes its timeline with Reel.step / typeCmd / out / cue / ev / wait
//   4. Reel.finish(renderExtra) seals the timeline and exposes the recorder API:
//      window.DURATION, window.render(t), window.soundEvents(), window.cues()
//
// The frame is a pure function of time t, so every recording is identical.
(function () {
  // ---------- helpers ----------
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
  const backOut = x => { x = clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { a = hex(a); b = hex(b); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(',')})`; };
  const rgba = (h, a) => `rgba(${hex(h).join(',')},${a})`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const $ = id => document.getElementById(id);

  const ICONS = {
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/></svg>',
    staging: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v10H14l-2 3-2-3H4z"/><path d="M8 9h8M8 12h5" stroke-linecap="round"/></svg>',
    repo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="16" height="5" rx="1"/><rect x="4" y="10" width="16" height="5" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.5 4.3 4.3 0 0 0 7 18z"/></svg>',
    test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 12.5 2 2 4-4.5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  };
  const COLORS = { wd: '#3b82f6', st: '#f59e0b', lo: '#22c55e', re: '#a78bfa' };

  // ---------- frame ----------
  let cfg, cardsEl, tops = [];
  function setup(c) {
    cfg = Object.assign({ gap: 14, maxRows: 10, prompt: '$ ' }, c);
    document.body.insertAdjacentHTML('afterbegin', `
<div class="brand">
  <div class="logo"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg></div>
  <span>github-tutorial.scholarverse.cc</span>
</div>
<div class="kicker">${cfg.kicker}</div>
<div class="title">${cfg.title}</div>
<div class="term">
  <div class="bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><b>calculator-app — zsh</b></div>
  <div class="body" id="tb"></div>
</div>
<div class="cards" id="cards"><div class="rail" id="rail"></div></div>
<div class="stepl" id="stepl"></div>
<div class="cap" id="cap"></div>
<div class="sub" id="sub"></div>
<div class="dots" id="dots"></div>
<div class="foot">完整講義與指令 → github-tutorial.scholarverse.cc</div>`);
    if (cfg.termFont) $('tb').style.fontSize = cfg.termFont + 'px';
    cardsEl = $('cards');
    let y = 0;
    cfg.stages.forEach((s, i) => {
      s.color = s.color || COLORS[s.key];
      s.h = s.h || 172;
      tops[i] = y;
      const d = document.createElement('div');
      d.className = 'card'; d.id = 'card-' + s.key;
      d.style.top = y + 'px'; d.style.height = s.h + 'px';
      const icTop = s.icTop !== undefined ? s.icTop : (s.h - 86) / 2;
      d.innerHTML = `<div class="glow"></div><div class="ic" style="color:#71717a;top:${icTop}px">${ICONS[s.icon]}</div>
        <div class="tx" style="top:${icTop - 13}px"><div class="zh">${s.zh}</div><div class="en">${s.en}</div><div class="cmd">${s.cmd}</div></div>`;
      cardsEl.appendChild(d);
      y += s.h + cfg.gap;
    });
    $('rail').style.height = (y - cfg.gap) + 'px';
    for (let i = 1; i <= cfg.steps; i++) $('dots').appendChild(document.createElement('i'));
  }
  const cardCenter = i => tops[i] + cfg.stages[i].h / 2;

  // ---------- timeline ----------
  const tl = []; let T = 0;
  const wait = s => { T += s; };
  // ev(kind, {...}) records an event now; pass {at: seconds} to place it at another time
  const ev = (k, o = {}) => tl.push({ k, at: T, ...o });
  const step = n => { ev('step', { n }); if (n > 0) ev('clear'); };
  function typeCmd(cmd, cps = 15) { ev('type', { cmd, cps }); T += cmd.length / cps; T += 0.18; ev('enter'); T += 0.3; }
  function out(lines, gap = 0.06) { ev('out', { lines, gap }); T += lines.length * gap + 0.1; }
  const cue = text => ev('cue', { text });
  // fly(from, to, label, dur): a token travels between cards and lands at the end
  function fly(from, to, label, dur = 0.9) { ev('fly', { from, to, label, dur }); }
  // pop(to): make card `to` pulse with the landing sound, without a flying token
  const pop = to => ev('pop', { to });

  // ---------- state at time t ----------
  // Generic events are interpreted here; any other event kind k is recorded as s.at[k]
  // (time it happened) so episodes can read their own markers.
  function stateAt(t) {
    const s = { t, step: 0, stepAt: 0, lines: [], typing: null, flies: [], land: {}, at: {} };
    for (const e of tl) {
      if (e.at > t) break;
      switch (e.k) {
        case 'step': s.step = e.n; s.stepAt = e.at; break;
        case 'clear': s.lines = []; break;
        case 'type': s.typing = { cmd: e.cmd, at: e.at, cps: e.cps }; break;
        case 'enter': s.lines.push({ prompt: true, text: s.typing.cmd }); s.typing = null; break;
        case 'out': {
          const n = Math.min(e.lines.length, Math.floor((t - e.at) / e.gap) + 1);
          for (let i = 0; i < n; i++) s.lines.push({ seg: e.lines[i] });
          break;
        }
        case 'fly':
          if (t < e.at + e.dur) s.flies.push({ ...e, p: (t - e.at) / e.dur });
          else s.land[e.to] = e.at + e.dur;
          break;
        case 'pop': s.land[e.to] = e.at; break;
        case 'cue': break;
        default: s.at[e.k] = e.at;
      }
    }
    return s;
  }

  // ---------- render ----------
  function segHTML(seg) {
    if (typeof seg[0] === 'string') return `<span class="${seg[1]}">${esc(seg[0])}</span>`;
    return seg.map(p => `<span class="${p[1]}">${esc(p[0])}</span>`).join('');
  }

  function renderTerminal(s, t) {
    const P = `<span class="ps">${cfg.prompt}</span>`;
    const rows = s.lines.map(l => l.prompt ? P + esc(l.text) : segHTML(l.seg));
    if (s.typing) {
      const n = Math.min(s.typing.cmd.length, Math.floor((t - s.typing.at) * s.typing.cps));
      rows.push(`${P}${esc(s.typing.cmd.slice(0, n))}<span class="cur"></span>`);
    } else {
      const blink = Math.floor(t * 2) % 2 === 0;
      rows.push(`${P}<span class="cur" style="opacity:${blink ? 1 : 0}"></span>`);
    }
    $('tb').innerHTML = rows.slice(-cfg.maxRows).map(r => `<div class="ln">${r}</div>`).join('');
  }

  // highlight a card: a = 0..1 activation, pulse = 0..1 landing pulse
  function paintCard(i, a, pulse) {
    const st = cfg.stages[i], card = $('card-' + st.key);
    card.style.borderColor = a > 0.01 ? rgba(st.color, 0.25 + 0.65 * a) : '#26262c';
    card.style.boxShadow = a > 0.01 ? `0 0 ${30 + 30 * pulse}px ${rgba(st.color, 0.25 * a + 0.25 * pulse)}, inset 0 0 0 1px ${rgba(st.color, 0.2 * a)}` : 'none';
    card.style.transform = `scale(${1 + 0.015 * pulse * 172 / st.h})`;
    const glow = card.querySelector('.glow');
    glow.style.background = `linear-gradient(100deg, ${rgba(st.color, 0.16)} 0%, ${rgba(st.color, 0.03)} 55%, transparent 100%)`;
    glow.style.opacity = a;
    const ic = card.querySelector('.ic');
    ic.style.color = a > 0.01 ? mix('#71717a', st.color, a) : '#71717a';
    ic.style.borderColor = a > 0.01 ? rgba(st.color, 0.3 + 0.5 * a) : '#2c2c33';
    ic.style.background = a > 0.01 ? rgba(st.color, 0.08 + 0.1 * a) : '#1a1a1f';
    card.querySelector('.zh').style.color = mix('#a1a1aa', '#fafafa', a);
    const cmd = card.querySelector('.cmd');
    cmd.style.color = a > 0.01 ? mix('#a1a1aa', st.color, a) : '#a1a1aa';
    cmd.style.borderColor = a > 0.01 ? rgba(st.color, 0.25 + 0.4 * a) : '#2c2c33';
  }

  function renderCards(s, t) {
    const act = cfg.stepStage[s.step];
    const actSet = Array.isArray(act) ? act : [act];
    cfg.stages.forEach((st, i) => {
      let a = 0;
      if (actSet.includes(i)) a = easeOut((t - s.stepAt) / 0.35);
      if (s.land[i] !== undefined && t - s.land[i] < 1.2 && !actSet.includes(i)) a = Math.max(a, 1 - (t - s.land[i]) / 1.2);
      if (s.at.allok !== undefined) a = Math.max(a, easeOut((t - s.at.allok - i * 0.15) / 0.4));
      let pulse = 0;
      if (s.land[i] !== undefined) { const d = t - s.land[i]; if (d >= 0 && d < 0.6) pulse = Math.sin(d / 0.6 * Math.PI); }
      paintCard(i, a, pulse);
    });
  }

  function renderFlies(s) {
    cardsEl.querySelectorAll('.fly').forEach(e => e.remove());
    for (const f of s.flies) {
      const el = document.createElement('div'); el.className = 'fly';
      const col = cfg.stages[f.to].color;
      el.textContent = f.label;
      el.style.background = col;
      el.style.boxShadow = `0 0 30px ${rgba(col, 0.7)}`;
      const p = ease(f.p);
      const y = lerp(cardCenter(f.from), cardCenter(f.to), p);
      el.style.opacity = clamp(f.p / 0.12) * clamp((1 - f.p) / 0.12);
      el.style.left = '70px';
      el.style.top = (y - 22) + 'px';
      el.style.transform = `scale(${0.9 + 0.15 * Math.sin(p * Math.PI)})`;
      cardsEl.appendChild(el);
    }
  }

  function renderCaption(s, t) {
    const stepl = $('stepl'), cap = $('cap'), sub = $('sub');
    let c, label, color, fadeT;
    if (s.at.outro !== undefined) {
      c = cfg.outro; label = 'DONE'; color = '#4ade80'; fadeT = easeOut((t - s.at.outro) / 0.4);
    } else {
      fadeT = easeOut((t - s.stepAt) / 0.4);
      if (s.step === 0) { c = cfg.intro; label = 'calculator-app'; color = '#60a5fa'; }
      else { c = cfg.caps[s.step]; label = `STEP ${s.step} / ${cfg.steps}`; color = cfg.stepColors[s.step]; }
    }
    stepl.textContent = label; stepl.style.color = color;
    cap.innerHTML = c.cap; sub.innerHTML = c.sub;
    for (const el of [stepl, cap, sub]) { el.style.opacity = fadeT; el.style.transform = `translateY(${(1 - fadeT) * 14}px)`; }
    [...$('dots').children].forEach((d, i) => {
      const on = (i + 1) === s.step && s.at.outro === undefined;
      const done = (i + 1) < s.step || s.at.outro !== undefined;
      d.style.width = on ? '44px' : '12px';
      d.style.background = on ? cfg.stepColors[s.step] : (done ? rgba(cfg.stepColors[i + 1], 0.55) : '#3f3f46');
    });
  }

  // a branch/commit tag pill
  function paintTag(el, text, color, x, y, op = 1) {
    el.textContent = text;
    el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.opacity = op;
    el.style.color = color; el.style.background = rgba(color, 0.12); el.style.border = `1.5px solid ${rgba(color, 0.6)}`;
  }

  function finish(renderExtra) {
    const DURATION = T;
    tl.sort((a, b) => a.at - b.at);
    function render(t) {
      const s = stateAt(t);
      renderTerminal(s, t);
      renderCards(s, t);
      if (renderExtra) renderExtra(s, t);
      renderFlies(s);
      renderCaption(s, t);
    }
    window.DURATION = DURATION;
    window.render = render;
    window.TIMELINE = tl;
    window.soundEvents = function () {
      const evs = [];
      for (const e of tl) {
        if (e.k === 'fly') { evs.push({ t: e.at, k: 'whoosh', dur: e.dur }); evs.push({ t: e.at + e.dur, k: 'land', to: e.to }); }
        if (e.k === 'pop') evs.push({ t: e.at, k: 'land', to: e.to });
        if (e.k === 'step' && e.n > 0) evs.push({ t: e.at, k: 'step' });
        if (e.k === 'allok') evs.push({ t: e.at, k: 'chime' });
      }
      return evs.sort((a, b) => a.t - b.t);
    };
    window.cues = function () {
      const c = tl.filter(e => e.k === 'cue');
      return c.map((e, i) => ({ start: e.at, end: i + 1 < c.length ? c[i + 1].at : DURATION, text: e.text }));
    };
    render(0);
  }

  window.Reel = {
    clamp, ease, easeOut, backOut, lerp, mix, rgba, esc, $,
    setup, finish, paintTag,
    wait, ev, step, typeCmd, out, cue, fly, pop,
    now: () => T,
  };
})();
