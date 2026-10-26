/*
 * Fold simulator. A napkin is a stack of flat polygon layers (bottom first) in
 * "napkin units": the open napkin is the square (-1,-1)..(1,1), y pointing up,
 * so 0.1 units is about 2.5 cm (1 in) on a 50 cm (20 in) napkin.
 *
 * Operations:
 *   { fold: [[x1,y1],[x2,y2]], move: [x,y], behind, top, pick }
 *       Fold along the crease line. Everything on the same side of the line as
 *       `move` is reflected across it and stacked in front (or `behind`).
 *       `top: n` folds only the n uppermost layers on that side.
 *       `pick: [x0,y0,x1,y1]` folds only layers whose centre lies in that box.
 *   { flip: 'h' | 'v' }   turn the napkin over (left-right or top-bottom)
 *   { rotate: degrees }   turn it on the table (anticlockwise)
 *
 * expand(fold) turns a fold definition into drawable steps: each step is drawn
 * as the napkin *before* its action, with dashed creases and an arrow showing
 * where the moving part goes, so the next picture always shows the result.
 * Steps that can't be simulated (rolling, standing up, shaping) carry their own
 * hand-drawn `draw` and end the simulation.
 */
(function () {
  const EPS = 1e-9;

  const side = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);

  function reflect(p, a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
    return [2 * (a[0] + t * dx) - p[0], 2 * (a[1] + t * dy) - p[1]];
  }

  function area(pts) {
    let s = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      s += p[0] * q[1] - q[0] * p[1];
    }
    return Math.abs(s) / 2;
  }

  // Sutherland–Hodgman clip of a polygon to the half-plane where sign*side >= 0
  function clip(pts, a, b, sign) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      const sp = sign * side(a, b, p);
      const sq = sign * side(a, b, q);
      if (sp >= -EPS) out.push(p);
      if ((sp > EPS && sq < -EPS) || (sp < -EPS && sq > EPS)) {
        const t = sp / (sp - sq);
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    return area(out) > 1e-6 ? out : null;
  }

  function centroid(polys) {
    let x = 0;
    let y = 0;
    let w = 0;
    for (const pts of polys) {
      const a = area(pts);
      const c = pts.reduce((s, p) => [s[0] + p[0], s[1] + p[1]], [0, 0]).map((v) => v / pts.length);
      x += c[0] * a;
      y += c[1] * a;
      w += a;
    }
    return w ? [x / w, y / w] : [0, 0];
  }

  const toggle = (f) => (f === 'a' ? 'b' : 'a');
  const startSquare = () => [{ pts: [[-1, -1], [1, -1], [1, 1], [-1, 1]], face: 'b' }];

  function applyFold(layers, op) {
    const [a, b] = op.fold;
    const sign = side(a, b, op.move) >= 0 ? 1 : -1;
    let chosen = layers.map((_, i) => i);
    if (op.pick) {
      const [x0, y0, x1, y1] = op.pick;
      chosen = chosen.filter((i) => {
        const [cx, cy] = centroid([layers[i].pts]);
        return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
      });
    }
    if (op.top) chosen = chosen.filter((i) => clip(layers[i].pts, a, b, sign)).slice(-op.top);
    const keep = [];
    const moved = [];
    layers.forEach((l, i) => {
      if (!chosen.includes(i)) return keep.push(l);
      const stay = clip(l.pts, a, b, -sign);
      const go = clip(l.pts, a, b, sign);
      if (stay) keep.push({ ...l, pts: stay });
      if (go) moved.push({ face: toggle(l.face), pts: go.map((p) => reflect(p, a, b)).reverse(), from: go });
    });
    moved.reverse(); // the layer that was on top lands nearest the fold
    const clean = (l) => ({ face: l.face, pts: l.pts });
    const next = op.behind ? [...moved.map(clean).reverse(), ...keep] : [...keep, ...moved.map(clean)];
    return { next, movedFrom: moved.map((m) => m.from), movedTo: moved.map((m) => m.pts), chosen: chosen.map((i) => layers[i].pts) };
  }

  function applyOp(layers, op) {
    if (op.fold) return applyFold(layers, op);
    if (op.flip) {
      const m = op.flip === 'v' ? ([x, y]) => [x, -y] : ([x, y]) => [-x, y];
      return { next: layers.map((l) => ({ face: toggle(l.face), pts: l.pts.map(m).reverse() })).reverse() };
    }
    if (op.rotate) {
      const t = (op.rotate * Math.PI) / 180;
      const c = Math.cos(t);
      const s = Math.sin(t);
      return { next: layers.map((l) => ({ ...l, pts: l.pts.map(([x, y]) => [x * c - y * s, x * s + y * c]) })) };
    }
    return { next: layers };
  }

  // ---- drawing --------------------------------------------------------------
  const BOX = { x0: 14, x1: 86, y0: 10, y1: 70 };
  const BASE_SCALE = 29; // the open napkin fills the frame height
  const MAX_ZOOM = 1.8;

  function bbox(polys) {
    const b = [Infinity, Infinity, -Infinity, -Infinity];
    polys.forEach((pts) =>
      pts.forEach(([x, y]) => {
        b[0] = Math.min(b[0], x);
        b[1] = Math.min(b[1], y);
        b[2] = Math.max(b[2], x);
        b[3] = Math.max(b[3], y);
      })
    );
    return b;
  }

  function view(polys) {
    const [x0, y0, x1, y1] = bbox(polys);
    const s = Math.min((BOX.x1 - BOX.x0) / (x1 - x0 || 1), (BOX.y1 - BOX.y0) / (y1 - y0 || 1), BASE_SCALE * MAX_ZOOM);
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    return ([x, y]) => [50 + (x - cx) * s, 40 - (y - cy) * s];
  }

  const r1 = (n) => Math.round(n * 10) / 10;
  const ptsStr = (pts, T) => pts.map((p) => T(p).map(r1).join(',')).join(' ');
  const shapesOf = (layers, T) => layers.map((l) => ({ p: ptsStr(l.pts, T), s: l.face === 'a' ? 0 : -1.4 }));

  // the part of the crease line that runs across the given polygons
  function creaseSegment(a, b, polys, T) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len2 = dx * dx + dy * dy;
    let lo = Infinity;
    let hi = -Infinity;
    for (const pts of polys) {
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const q = pts[(i + 1) % pts.length];
        const sp = side(a, b, p);
        const sq = side(a, b, q);
        const hits = [];
        if (Math.abs(sp) < 1e-7) hits.push(p);
        if ((sp > 1e-7 && sq < -1e-7) || (sp < -1e-7 && sq > 1e-7)) {
          const t = sp / (sp - sq);
          hits.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
        }
        for (const h of hits) {
          const t = ((h[0] - a[0]) * dx + (h[1] - a[1]) * dy) / len2;
          lo = Math.min(lo, t);
          hi = Math.max(hi, t);
        }
      }
    }
    if (!isFinite(lo) || hi - lo < 1e-6) return null;
    const pad = (hi - lo) * 0.04;
    const p = T([a[0] + (lo - pad) * dx, a[1] + (lo - pad) * dy]);
    const q = T([a[0] + (hi + pad) * dx, a[1] + (hi + pad) * dy]);
    return [r1(p[0]), r1(p[1]), r1(q[0]), r1(q[1])];
  }

  /**
   * Expand a fold definition into drawable steps.
   * step: { title, text, op?: op | op[], draw?, arrows?, curve? }
   * step.add: extra hand-drawn shapes on top of the napkin (e.g. cutlery)
   * step.end: show this step's shape (with its own arrows), then stop simulating
   * fold.start: 'diamond' to begin with the napkin turned like a diamond
   * fold.final: { text, op?, draw? }  (no draw = the simulated result, laid flat)
   */
  function expand(fold) {
    let layers = startSquare();
    if (fold.start === 'diamond') layers = applyOp(layers, { rotate: 45 }).next;
    let live = true;
    const steps = fold.steps.map((step) => {
      let ops = step.op ? (Array.isArray(step.op) ? step.op : [step.op]) : [];
      if (step.draw || !live) {
        live = false;
        return { ...step, ...(step.draw || {}) };
      }
      // a turn-over or turn-around that comes before the step's fold is shown done
      const lead = [];
      while (ops.length > 1 && (ops[0].flip || ops[0].rotate)) lead.push(ops.shift());
      for (const op of lead) layers = applyOp(layers, op).next;
      const before = layers;
      const polys = before.map((l) => l.pts);
      let state = before;
      const extra = [];
      const lines = [];
      const arrows = [];
      const flip = [...lead, ...ops].some((o) => o.flip);
      const rotate = [...lead, ...ops].find((o) => o.rotate);
      const results = [];
      for (const op of ops) {
        const res = applyOp(state, op);
        results.push({ op, res, on: state });
        if (res.movedTo) extra.push(...res.movedTo);
        state = res.next;
      }
      const firstFold = results.find((r) => r.op.fold);
      const T = view([...polys, ...(firstFold ? firstFold.res.movedTo : [])]);
      for (const { op, res, on } of results) {
        if (!op.fold) continue;
        // creases are drawn on the napkin as it lies before this step (or on the layers being folded)
        const limit = op.pick || op.top ? res.chosen : op === ops[0] ? on.map((l) => l.pts) : polys;
        const seg = creaseSegment(op.fold[0], op.fold[1], limit, T);
        if (seg && !op.hideLine) lines.push(seg);
      }
      const first = results.find((r) => r.op.fold);
      if (step.arrows) arrows.push(...step.arrows);
      else if (first && ops.filter((o) => o.fold).length === 1) {
        const from = T(centroid(first.res.movedFrom));
        const to = T(centroid(first.res.movedTo));
        arrows.push({ f: from.map(r1), t: to.map(r1), c: step.curve == null ? 0.25 : step.curve });
      }
      layers = state;
      if (step.end) live = false; // e.g. "roll it up": show this shape, then hand-drawn steps
      return {
        ...step,
        shapes: [...shapesOf(before, T), ...(step.add || [])],
        lines: step.lines || lines,
        arrows,
        flip,
        rotate: rotate ? rotate.rotate : 0,
      };
    });
    let final = fold.final;
    if (final.op && live) for (const op of [].concat(final.op)) layers = applyOp(layers, op).next;
    if (!final.draw) {
      const T = view(layers.map((l) => l.pts));
      final = { ...final, shapes: [...shapesOf(layers, T), ...(final.add || [])], prop: final.prop };
    } else {
      final = { ...final, ...final.draw };
    }
    return { steps, final, layers };
  }

  window.NapkinSim = { expand, applyOp, reflect, clip, area, centroid };
})();
