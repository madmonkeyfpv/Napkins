/*
 * Scene renderer: turns a step description (shapes, fold lines, arrows, props)
 * into a photo-style SVG — napkin fabric on a wooden table with soft light,
 * shadows and a linen weave, tinted with the current celebration's colours.
 *
 * Coordinate space is 100 x 80 for every scene.
 */
(function () {
  let uid = 0;

  const FIXED = {
    gold: '#e8b730',
    silver: '#c3c9d2',
    leaf: '#4f8a3c',
    matzah: '#e2c48b',
    white: '#fbfaf6',
    flame: '#ffb627',
    ink: '#2a2433',
  };

  function hexToRgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // amt in -1..1 : negative darkens toward black, positive lightens toward white
  function mix(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    const target = amt < 0 ? 0 : 255;
    const p = Math.min(1, Math.abs(amt));
    const f = (c) => Math.round((target - c) * p + c);
    return '#' + [f(r), f(g), f(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
  }

  function luminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function resolve(c, theme) {
    if (!c || c === 'napkin') return theme.napkin;
    if (c === 'napkin2') return theme.napkin2 || mix(theme.napkin, -0.25);
    if (c === 'accent') return theme.accent;
    if (FIXED[c]) return FIXED[c];
    return c;
  }

  const FABRIC = new Set([undefined, 'napkin', 'napkin2', 'accent']);

  function geometry(sh) {
    if (sh.p) return ['polygon', `points="${sh.p}"`];
    if (sh.d) return ['path', `d="${sh.d}"`];
    if (sh.circle) {
      const [cx, cy, r] = sh.circle;
      return ['circle', `cx="${cx}" cy="${cy}" r="${r}"`];
    }
    if (sh.ellipse) {
      const [cx, cy, rx, ry] = sh.ellipse;
      return ['ellipse', `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"`];
    }
    return null;
  }

  function shapeEl(sh, theme, ids) {
    const geo = geometry(sh);
    if (!geo) return '';
    const [tag, attrs] = geo;
    const base = resolve(sh.c, theme);
    const fill = sh.s ? mix(base, sh.s * 0.14) : base;
    const stroke = mix(base, -0.4);
    let out = `<${tag} ${attrs} fill="${fill}" stroke="${stroke}" stroke-width="0.35" stroke-linejoin="round"/>`;
    if (FABRIC.has(sh.c)) out += `<${tag} ${attrs} fill="url(#${ids.linen})"/>`;
    // soft sheen across each panel so folds catch the light
    out += `<${tag} ${attrs} fill="url(#${ids.sheen})"/>`;
    return out;
  }

  function arrowEl(a) {
    const [fx, fy] = a.f;
    const [tx, ty] = a.t;
    const dx = tx - fx;
    const dy = ty - fy;
    const len = Math.hypot(dx, dy) || 1;
    const cx = (fx + tx) / 2 - dy * a.c;
    const cy = (fy + ty) / 2 + dx * a.c;
    let ex = tx - cx;
    let ey = ty - cy;
    const el = Math.hypot(ex, ey) || 1;
    ex /= el;
    ey /= el;
    const hl = Math.min(3.4, len * 0.45);
    const hw = hl * 0.6;
    const bx = tx - ex * hl;
    const by = ty - ey * hl;
    const r = (n) => Math.round(n * 100) / 100;
    const head = `${r(tx)},${r(ty)} ${r(bx - ey * hw)},${r(by + ex * hw)} ${r(bx + ey * hw)},${r(by - ex * hw)}`;
    const d = `M${r(fx)} ${r(fy)} Q${r(cx)} ${r(cy)} ${r(bx)} ${r(by)}`;
    return (
      `<path d="${d}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>` +
      `<polygon points="${head}" fill="#fff" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/>` +
      `<path d="${d}" fill="none" stroke="${FIXED.ink}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<polygon points="${head}" fill="${FIXED.ink}"/>`
    );
  }

  function propEl(prop, ids) {
    if (prop === 'plate') {
      return (
        `<circle cx="50" cy="40" r="37" fill="#f7f4ee" filter="url(#${ids.shadow})"/>` +
        `<circle cx="50" cy="40" r="37" fill="url(#${ids.plate})"/>` +
        `<circle cx="50" cy="40" r="27.5" fill="none" stroke="#e2dccf" stroke-width=".6"/>` +
        `<circle cx="50" cy="40" r="35.5" fill="none" stroke="#ffffff" stroke-width=".5" opacity=".8"/>`
      );
    }
    if (prop === 'plateSide') {
      return (
        `<ellipse cx="50" cy="66" rx="42" ry="9.5" fill="#f7f4ee" filter="url(#${ids.shadow})"/>` +
        `<ellipse cx="50" cy="66" rx="42" ry="9.5" fill="url(#${ids.plate})"/>` +
        `<ellipse cx="50" cy="65.5" rx="31" ry="6.2" fill="none" stroke="#e2dccf" stroke-width=".6"/>`
      );
    }
    return '';
  }

  /**
   * @param {object} step  { shapes, lines, arrows, details, prop, flip }
   * @param {object} theme { napkin, napkin2, table, accent }
   * @param {object} opts  { label }
   */
  function scene(step, theme, opts = {}) {
    const n = 'nk' + uid++;
    const ids = {
      wood: n + 'w',
      linen: n + 'l',
      sheen: n + 's',
      shadow: n + 'd',
      light: n + 'g',
      plate: n + 'p',
    };
    const table = theme.table || '#8a5a32';
    const crease = luminance(theme.napkin) < 0.25 ? mix(theme.napkin, 0.6) : mix(theme.napkin, -0.6);

    const defs = `
      <defs>
        <filter id="${ids.wood}" x="0" y="0" width="100" height="80" filterUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.32" numOctaves="3" seed="${(uid * 7) % 50}"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.7 0 0 0 -0.55"/>
        </filter>
        <pattern id="${ids.linen}" width="1.1" height="1.1" patternUnits="userSpaceOnUse">
          <path d="M0 .55H1.1M.55 0V1.1" stroke="#000" stroke-opacity=".07" stroke-width=".22"/>
          <path d="M0 0H1.1" stroke="#fff" stroke-opacity=".06" stroke-width=".2"/>
        </pattern>
        <linearGradient id="${ids.sheen}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".16"/>
          <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".1"/>
        </linearGradient>
        <filter id="${ids.shadow}" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx=".7" dy="1.4" stdDeviation="1.1" flood-color="#000" flood-opacity=".38"/>
        </filter>
        <radialGradient id="${ids.light}" cx="32%" cy="22%" r="85%">
          <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
          <stop offset=".5" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".38"/>
        </radialGradient>
        <radialGradient id="${ids.plate}" cx="40%" cy="35%" r="70%">
          <stop offset="0" stop-color="#fff" stop-opacity=".9"/>
          <stop offset="1" stop-color="#d9d3c6" stop-opacity=".55"/>
        </radialGradient>
      </defs>`;

    const parts = [];
    parts.push(`<rect width="100" height="80" fill="${table}"/>`);
    parts.push(`<rect width="100" height="80" filter="url(#${ids.wood})" opacity=".26"/>`);
    // plank seams
    parts.push(
      `<path d="M0 27.5H100M0 55H100" stroke="#000" stroke-opacity=".18" stroke-width=".35"/>`
    );
    if (step.prop) parts.push(propEl(step.prop, ids));

    const shapes = (step.shapes || []).map((s) => shapeEl(s, theme, ids)).join('');
    parts.push(`<g filter="url(#${ids.shadow})">${shapes}</g>`);

    // a wine glass sits in front of the napkin that's tucked into it
    if (step.prop === 'glass') {
      parts.push(
        `<path d="M34 36H66Q66 60 50 63Q34 60 34 36Z" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".75" stroke-width=".6"/>` +
          `<path d="M37.5 39Q37.5 55 45 59" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>` +
          `<rect x="49.2" y="63" width="1.6" height="9" fill="#fff" fill-opacity=".5"/>` +
          `<ellipse cx="50" cy="73" rx="9" ry="2.2" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>`
      );
    }
    if (step.details) {
      const dl = step.details
        .map((l) =>
          typeof l === 'string'
            ? `<path d="${l}" fill="none"/>`
            : `<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}"/>`
        )
        .join('');
      parts.push(
        `<g stroke="${mix(theme.napkin, -0.45)}" stroke-width=".4" stroke-linecap="round" opacity=".75">${dl}</g>`
      );
    }
    if (step.lines) {
      const ll = step.lines
        .map((l) => `<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}"/>`)
        .join('');
      parts.push(
        `<g stroke="${crease}" stroke-width=".6" stroke-dasharray="2.2 1.5" stroke-linecap="round">${ll}</g>`
      );
    }
    if (step.arrows) parts.push(step.arrows.map(arrowEl).join(''));

    parts.push(`<rect width="100" height="80" fill="url(#${ids.light})" pointer-events="none"/>`);

    if (step.flip) {
      parts.push(
        `<g><rect x="3" y="3" width="29" height="8.6" rx="4.3" fill="#fff" opacity=".94"/>` +
          `<text x="17.5" y="8.9" font-size="4.3" text-anchor="middle" font-weight="700" ` +
          `font-family="system-ui,-apple-system,Segoe UI,sans-serif" fill="${FIXED.ink}">↻ Turn over</text></g>`
      );
    }

    if (step.rotate) {
      const y = step.flip ? 13 : 3;
      parts.push(
        `<g><rect x="3" y="${y}" width="25" height="8.6" rx="4.3" fill="#fff" opacity=".94"/>` +
          `<text x="15.5" y="${y + 5.9}" font-size="4.3" text-anchor="middle" font-weight="700" ` +
          `font-family="system-ui,-apple-system,Segoe UI,sans-serif" fill="${FIXED.ink}">${step.rotate > 0 ? '↺' : '↻'} Turn</text></g>`
      );
    }

    const label = (opts.label || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${defs}${parts.join('')}</svg>`;
  }

  window.NapkinRender = { scene, mix, luminance };
})();
