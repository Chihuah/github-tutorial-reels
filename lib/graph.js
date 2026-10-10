// SVG helpers for commit graphs, plus a mini calculator preview.
// Every function returns markup for time t, so frames stay a pure function of time.
(function () {
  const { clamp, backOut, easeOut } = Reel;
  const FONT = 'font-family="JetBrains Mono, DejaVu Sans Mono, monospace"';

  // 0..1 progress of an event that happened at `at` and lasts d seconds (0 before it happens)
  const since = (at, t, d) => at === undefined ? 0 : clamp((t - at) / d);

  // a commit circle; tips are filled. With `appear` it pops in with a fading ring.
  // opts.ghost draws it faded and dashed (a commit that was thrown away).
  function node(x, y, color, filled, appear, t, opts = {}) {
    if (appear !== undefined && t < appear) return '';
    const sc = appear === undefined ? 1 : backOut((t - appear) / 0.45);
    let g = '';
    if (appear !== undefined) {
      const r = 1 - clamp((t - appear) / 0.8);
      if (r > 0) g += `<circle cx="${x}" cy="${y}" r="${16 * sc + 10 * r}" fill="none" stroke="${color}" stroke-opacity="${0.6 * r}" stroke-width="3"/>`;
    }
    const op = opts.opacity ?? 1, dash = opts.ghost ? ' stroke-dasharray="4 4"' : '';
    const fill = opts.ghost ? '#0c0c0f' : filled ? color : '#0c0c0f', stroke = filled || opts.ghost ? color : '#71717a';
    return g + `<circle cx="${x}" cy="${y}" r="${Math.max(0, 14 * sc)}" fill="${fill}" stroke="${stroke}" stroke-width="4" opacity="${op}"${dash}/>`;
  }

  function label(x, y, text, color, op = 1, bold = false, size = 18) {
    return `<text x="${x}" y="${y}" text-anchor="middle" ${FONT} font-size="${size}" fill="${color}" opacity="${op}" font-weight="${bold ? 600 : 400}">${text}</text>`;
  }

  // a path revealed from start to end as p goes 0..1
  function grow(d, color, p, opts = {}) {
    if (p <= 0) return '';
    const w = opts.width ?? 4, op = opts.opacity ?? 1;
    const dash = p < 1 ? `pathLength="1" stroke-dasharray="${p} 1"` : opts.dash ? `stroke-dasharray="${opts.dash}"` : '';
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" opacity="${op}" ${dash}/>`;
  }

  // curve leaving node (xa, ya) for a branch lane at yb, ending left of node (xb, yb)
  const branchOff = (xa, ya, xb, yb) => {
    const s = Math.sign(yb - ya);
    return `M${xa},${ya + 14 * s} C${xa},${ya + 60 * s} ${xa + 40},${yb} ${xb - 14},${yb}`;
  };
  // curve leaving branch node (xa, ya) and joining node (xb, yb) from the upper/lower left
  const mergeIn = (xa, ya, xb, yb) => {
    const s = Math.sign(yb - ya);
    return `M${xa},${ya + 14 * s} C${xa},${yb - 24 * s} ${xb - 64},${yb - 12 * s} ${xb - 12},${yb - 7 * s}`;
  };
  const line = (xa, y, xb) => `M${xa + 14},${y} L${xb - 14},${y}`;

  // ---------- mini calculator ----------
  // state: { theme: 0 (purple, step 1) .. 1 (blue, step 2+), pct, mem, sci: 'buttons'|'dropdown',
  //          sciIn, pctIn, memIn (0..1 appear), eqBroken (0..1), hl: {key: 0..1}, display }
  const mixc = Reel.mix;
  function calc(el, st) {
    const blue = st.theme ?? 1;
    const keyC = mixc('#d9d9d9', '#bfdcfb', blue), eqC = mixc('#667eea', '#2196f3', blue);
    const keys = ['C', '/', '*', '←', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'];
    if (st.pct) keys.splice(1, 0, '%');
    const rows = (st.pct ? 6 : 5) + (st.mem ? 1 : 0) + (st.sci ? 1 : 0);
    const H = el.clientHeight - 14, disp = 18, gap = 3;
    const rh = Math.floor((H - disp - 4 - gap * (rows - 1)) / rows);
    let h = `<div class="disp" style="height:${disp}px;line-height:${disp}px;${st.dispStyle || ''}">${st.display ?? '0'}</div>`;
    const pop = v => `transform:scale(${backOut(v ?? 1)});`;
    if (st.mem) h += `<div class="g" style="grid-auto-rows:${rh}px;gap:${gap}px;margin-bottom:${gap}px">${['M+', 'M-', 'MR', 'MC'].map(() => `<div style="background:#ff9800;${pop(st.memIn)}"></div>`).join('')}</div>`;
    if (st.sci === 'buttons') h += `<div class="g" style="grid-template-columns:repeat(6,1fr);grid-auto-rows:${rh}px;gap:2px;margin-bottom:${gap}px">${[0, 1, 2, 3, 4, 5].map(() => `<div style="background:#4caf50;${pop(st.sciIn)}"></div>`).join('')}</div>`;
    if (st.sci === 'dropdown') h += `<div style="height:${rh}px;margin-bottom:${gap}px;background:#4caf50;border-radius:3px;position:relative;${pop(st.sciIn)}"><i style="position:absolute;right:5px;top:${rh / 2 - 2}px;border:4px solid transparent;border-top-color:#fff;border-bottom:0"></i></div>`;
    h += `<div class="g" style="grid-auto-rows:${rh}px;gap:${gap}px">`;
    for (const k of keys) {
      const cls = k === '=' ? 'eq' : k === '0' ? 'zr' : '';
      let bg = k === '=' ? eqC : k === '%' ? mixc('#f59e0b', keyC, st.pctSettle ?? 1) : keyC;
      const hl = st.hl && st.hl[k];
      let extra = k === '%' ? pop(st.pctIn) : '';
      if (hl) extra += `box-shadow:0 0 0 2px rgba(250,204,21,${hl});`;
      let mark = '';
      if (k === '=' && st.eqBroken) { bg = mixc(eqC, '#ef4444', st.eqBroken); mark = `<b style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;font:700 13px/1 Inter;opacity:${st.eqBroken}">✕</b>`; }
      h += `<div class="${cls}" style="background:${bg};position:relative;${extra}">${mark}</div>`;
    }
    el.innerHTML = h + '</div>';
  }

  window.G = { since, node, label, grow, branchOff, mergeIn, line, calc };
})();
