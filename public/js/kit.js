/*
 * Shared pieces for the fold library: shape helpers for hand-drawn (standing,
 * rolled) pictures, and the published guides the folds come from.
 * Hand-drawn pictures use the 100 x 80 scene space of render.js.
 */
(function () {
  const r = (n) => Math.round(n * 100) / 100;

  const P = (p, s = 0, c) => ({ p, s, c });
  const D = (d, s = 0, c) => ({ d, s, c });
  const C = (cx, cy, rad, s = 0, c) => ({ circle: [cx, cy, rad], s, c });
  const E = (cx, cy, rx, ry, s = 0, c) => ({ ellipse: [cx, cy, rx, ry], s, c });
  const A = (fx, fy, tx, ty, c = 0.25) => ({ f: [fx, fy], t: [tx, ty], c });

  // wedges radiating from (cx,cy) between angles a0..a1 (degrees, SVG coords)
  function fan(cx, cy, rad, a0, a1, n, c) {
    const out = [];
    const step = (a1 - a0) / n;
    for (let i = 0; i < n; i++) {
      const t0 = ((a0 + i * step) * Math.PI) / 180;
      const t1 = ((a0 + (i + 1) * step) * Math.PI) / 180;
      const tm = (t0 + t1) / 2;
      const p0 = [cx + rad * Math.cos(t0), cy + rad * Math.sin(t0)];
      const p1 = [cx + rad * 1.04 * Math.cos(tm), cy + rad * 1.04 * Math.sin(tm)];
      const p2 = [cx + rad * Math.cos(t1), cy + rad * Math.sin(t1)];
      out.push(D(`M${cx} ${cy}L${r(p0[0])} ${r(p0[1])}Q${r(p1[0])} ${r(p1[1])} ${r(p2[0])} ${r(p2[1])}Z`, i % 2 ? -1 : 1, c));
    }
    return out;
  }

  function petal(cx, cy, ang, len, w, s = 0, c) {
    const t = (ang * Math.PI) / 180;
    const ux = Math.cos(t);
    const uy = Math.sin(t);
    const tip = [cx + ux * len, cy + uy * len];
    const m1 = [cx + ux * len * 0.55 - uy * w, cy + uy * len * 0.55 + ux * w];
    const m2 = [cx + ux * len * 0.55 + uy * w, cy + uy * len * 0.55 - ux * w];
    return D(`M${cx} ${cy}Q${r(m1[0])} ${r(m1[1])} ${r(tip[0])} ${r(tip[1])}Q${r(m2[0])} ${r(m2[1])} ${cx} ${cy}Z`, s, c);
  }

  const calinen = (page, name) => ({ name: `California Linen – ${name}`, url: `https://calinen.com/fld-${page}/` });
  const lol = (path, name) => ({ name: `A Labour of Life – ${name}`, url: `https://www.alabouroflife.com/${path}/` });
  const ible = (path, name) => ({ name: `Instructables – ${name}`, url: `https://www.instructables.com/${path}/` });

  const SRC = {
    kor: ible('Top-9-Ways-To-Fold-Awesome-Holiday-Napkins', 'Top 9 Ways to Fold Awesome Holiday Napkins (The King of Random)'),
    instrTree: ible('Christmas-Tree-Napkin-Fold', 'Christmas Tree Napkin Fold'),
    instrEnvelope: ible('Envelope-Napkin-Fold', 'Envelope Napkin Fold'),
    instrBat: ible('Bat-Napkin-Folding', 'Bat Napkin Folding'),
    toh: { name: 'Taste of Home – How to Fold a Napkin 8 Easy Ways', url: 'https://www.tasteofhome.com/article/how-to-fold-a-napkin/' },
    homedepot: { name: 'The Home Depot – How to Fold a Napkin 11 Ways', url: 'https://www.homedepot.com/c/ai/how-to-fold-a-napkin-11-ways/9ba683603be9fa5395fab9012687ea13' },
    wayfair: { name: 'Wayfair – How to Make a Napkin Bunny', url: 'https://www.wayfair.com/sca/ideas-and-advice/diy/how-to-make-a-napkin-bunny-T1179' },
    southernLadyBasket: { name: 'Southern Lady Magazine – Basket of Goodies Napkin Fold', url: 'https://southernladymagazine.com/basket-of-goodies-napkin-video-fold-tutorial/2' },
    falvey: { name: 'Falvey Linen – Folding Directions', url: 'https://falveylinen.com/wp-content/uploads/2024/05/NapkinFolding.pdf' },
    stNicholas: { name: 'St Nicholas Center – Bishop’s Miter Napkin Fold', url: 'https://www.stnicholascenter.org/how-to-celebrate/resources/crafts/miters/miter-napkin-fold' },
    calRose: calinen('therose', 'The Rose'),
    calCandle: calinen('candle', 'The Candle'),
    calCrown: calinen('crown', 'The Crown'),
    calPyramid: calinen('pyramid', 'Pyramid'),
    calMitre: calinen('bishopmiter', 'Bishop’s Mitre'),
    calArum: calinen('arum', 'The Arum Lily'),
    calRosebud: calinen('rosebud', 'Rosebud'),
    calParadise: calinen('paradise', 'Bird of Paradise'),
    calClown: calinen('clownhat', 'The Clown’s Hat'),
    lolWitch: lol('how-to-fold-witch-hat-napkin', 'How to Fold a Witch Hat Napkin for Halloween'),
    lolTurkey: lol('thanksgiving-turkey-fold', 'Thanksgiving Turkey Fold'),
    lolTurkeyFan: lol('turkey-napkins-for-thanksgiving', 'Turkey Napkins for Thanksgiving'),
    lolShamrock: lol('shamrock-napkins', 'Shamrock Napkins for St Patrick’s Day'),
    lolElfHat: lol('elf-hat-napkin', 'Christmas Elf Hat Napkin'),
    lolElfShoe: lol('three-christmas-napkin-folds-christmas', 'Christmas Elf Shoe Napkin'),
    lolTree: lol('christmas-tree-napkin-fold', 'Christmas Tree Napkin'),
    lolBunny: lol('easter-bunny-napkins', 'Easter Bunny Napkins'),
    lolCandle: lol('candle-napkin-fold', 'Candle Napkin Fold'),
  };

  window.NapkinKit = { r, P, D, C, E, A, fan, petal, SRC };
  window.NapkinFolds = window.NapkinFolds || [];
})();
