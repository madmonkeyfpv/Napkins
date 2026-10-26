/*
 * Napkin fold library. Every step has a title, instructions and an
 * illustration (shapes / fold lines / arrows, drawn by render.js).
 *
 * Each fold's steps were checked against the published guides in its
 * `sources` list (at least two per fold), which the guide page links to.
 *
 * To use a real photograph for any step or finished napkin, add
 *   photo: 'images/<fold>-<step>.jpg'
 * to that step (or to `final`) and it will be shown instead of the illustration.
 */
(function () {
  const r = (n) => Math.round(n * 100) / 100;

  // --- shape helpers -------------------------------------------------------
  const P = (p, s = 0, c) => ({ p, s, c });
  const D = (d, s = 0, c) => ({ d, s, c });
  const C = (cx, cy, rad, s = 0, c) => ({ circle: [cx, cy, rad], s, c });
  const E = (cx, cy, rx, ry, s = 0, c) => ({ ellipse: [cx, cy, rx, ry], s, c });
  const A = (fx, fy, tx, ty, c = 0.25) => ({ f: [fx, fy], t: [tx, ty], c });

  const SQUARE = '20,10 80,10 80,70 20,70';
  const HALF = '20,25 80,25 80,55 20,55';
  const TRI = '10,62 90,62 50,22';

  function pleats(x0, y0, x1, y1, n, c) {
    const w = (x1 - x0) / n;
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = r(x0 + i * w);
      const b = r(x0 + (i + 1) * w);
      out.push(P(`${a},${y0} ${b},${y0} ${b},${y1} ${a},${y1}`, i % 2 ? -1 : 1, c));
    }
    return out;
  }

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
      out.push(
        D(`M${cx} ${cy}L${r(p0[0])} ${r(p0[1])}Q${r(p1[0])} ${r(p1[1])} ${r(p2[0])} ${r(p2[1])}Z`, i % 2 ? -1 : 1, c)
      );
    }
    return out;
  }

  function petal(cx, cy, ang, len, w, s = 0, c) {
    const t = (ang * Math.PI) / 180;
    const ux = Math.cos(t);
    const uy = Math.sin(t);
    const px = -uy;
    const py = ux;
    const tip = [cx + ux * len, cy + uy * len];
    const m1 = [cx + ux * len * 0.55 + px * w, cy + uy * len * 0.55 + py * w];
    const m2 = [cx + ux * len * 0.55 - px * w, cy + uy * len * 0.55 - py * w];
    return D(
      `M${cx} ${cy}Q${r(m1[0])} ${r(m1[1])} ${r(tip[0])} ${r(tip[1])}Q${r(m2[0])} ${r(m2[1])} ${cx} ${cy}Z`,
      s,
      c
    );
  }

  function star(cx, cy, r1, r2, n = 5) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const rad = i % 2 ? r2 : r1;
      const t = -Math.PI / 2 + (i * Math.PI) / n;
      pts.push(`${r(cx + rad * Math.cos(t))},${r(cy + rad * Math.sin(t))}`);
    }
    return pts.join(' ');
  }

  // --- shared opening steps -----------------------------------------------
  const halfStep = (text) => ({
    title: 'Fold in half',
    text: text || 'Lay the napkin face-down and fold the bottom edge up to meet the top edge.',
    shapes: [P(SQUARE)],
    lines: [[20, 40, 80, 40]],
    arrows: [A(50, 66, 50, 15, 0.35)],
  });

  const triangleStep = (text) => ({
    title: 'Make a triangle',
    text: text || 'Lay the napkin face-down and fold it in half diagonally, bringing the bottom-right corner up to the top-left.',
    shapes: [P(SQUARE)],
    lines: [[80, 10, 20, 70]],
    arrows: [A(77, 67, 24, 14, 0.3)],
  });

  const quartersStep = (text) => ({
    title: 'Fold into quarters',
    text: text || 'Fold the napkin in half, then in half again, to make a smaller square with four layers.',
    shapes: [P(SQUARE)],
    lines: [
      [20, 40, 80, 40],
      [50, 10, 50, 70],
    ],
    arrows: [A(50, 66, 50, 44, 0.5), A(76, 26, 54, 26, -0.5)],
  });

  // --- sources the steps were checked against ------------------------------
  const SRC = {
    calinen: (page, name) => ({ name: `California Linen – ${name}`, url: `https://calinen.com/fld-${page}/` }),
    falvey: { name: 'Falvey Linen – Folding Directions', url: 'https://falveylinen.com/wp-content/uploads/2024/05/NapkinFolding.pdf' },
    werent: { name: 'We Rent Linens – Special Napkin Folding', url: 'https://werentlinens.com/wp-content/uploads/2019/03/Napkin_Folds.pdf' },
    toh: { name: 'Taste of Home – How to Fold a Napkin', url: 'https://www.tasteofhome.com/article/how-to-fold-a-napkin/' },
    homedepot: { name: 'The Home Depot – How to Fold a Napkin 11 Ways', url: 'https://www.homedepot.com/c/ai/how-to-fold-a-napkin-11-ways/9ba683603be9fa5395fab9012687ea13' },
  };

  // --- finished-napkin artwork -------------------------------------------
  // Top view of a rolled rose; the two "leaves" are the napkin's own corner layers.
  const roseTop = (full) => [
    ...(full ? [petal(50, 40, 25, 34, 7, -1), petal(50, 40, 155, 32, 7, -2)] : [petal(50, 40, 25, 22, 5, -1)]),
    C(50, 40, full ? 22 : 18, -1),
    C(51, 39, full ? 17 : 14, 0),
    C(49, 41, full ? 12 : 10, 1),
    C(50, 40, full ? 6.5 : 5.5, 0),
  ];
  const roseSpiral = 'M50 40m0-2.5a2.5 2.5 0 1 1-2.5 2.5a5 5 0 1 1 5 5a9 9 0 1 1-9-9a13 13 0 1 1 13 13';

  const lotusFlower = (full) => [
    ...(full ? [0, 90, 180, 270].map((a) => petal(50, 40, a, 33, 11, -1)) : []),
    ...[45, 135, 225, 315].map((a) => petal(50, 40, a, full ? 27 : 22, full ? 10 : 8, 0)),
    ...(full ? [0, 90, 180, 270].map((a) => petal(50, 40, a, 15, 6, 1)) : []),
    C(50, 40, full ? 5.5 : 6, 1),
  ];

  const bunny = [
    D('M44 47Q29 25 37 7Q50 21 50 45Z', -1),
    D('M56 47Q71 25 63 7Q50 21 50 45Z', 0),
    D('M44.5 43Q35 27 38.5 13Q46 25 48.5 43Z', 1),
    D('M55.5 43Q65 27 61.5 13Q54 25 51.5 43Z', 2),
    D('M33 66Q32 46 50 42Q68 46 67 66Z', 0),
    D('M33 66Q33 58 50 56Q67 58 67 66Z', 1),
  ];

  const tree = (withStar) => [
    P('50,30 78,60 22,60', -1),
    P('50,19 72,46 28,46', 0),
    P('50,9 65,32 35,32', 1),
    ...(withStar ? [P(star(50, 9, 6, 2.6), 0, 'gold')] : []),
  ];

  const candleBody = [P('43,17 57,17 57,64 43,64', 0), P('43,56 57,56 57,64 43,64', 1)];
  const candleWraps = [
    [43, 28, 57, 22],
    [43, 40, 57, 34],
    [43, 52, 57, 46],
  ];

  // Clown's Hat cone with its hem turned up into a cuff.
  const coneHat = (band) => [
    P('38,62 50,12 62,62', 0),
    P('37,62 63,62 61.4,53 38.6,53', 1),
    ...(band ? [P('38.6,53 61.4,53 61,50.5 39,50.5', 0, 'napkin2')] : []),
  ];

  const crown = [
    P('39,62 39,36 55,13 69,33 69,62', -1),
    P('31,64 31,37 46,16 61,37 61,64', 0),
    P('46,16 52,24 46,30 40,24', 1),
    P('31,54 61,54 61,64 31,64', 1),
  ];

  const pocket = (cutlery) => [
    P('38,14 62,14 62,66 38,66', 0),
    ...(cutlery
      ? [
          P('42,3 45.5,3 46,36 42.5,36', 0, 'silver'),
          P('48.5,2 52.5,2 52.5,36 48.5,36', 0, 'silver'),
          E(57.5, 6, 2.6, 3.8, 0, 'silver'),
          P('56.8,9 58.2,9 58.2,36 56.8,36', 0, 'silver'),
        ]
      : []),
    P('38,20 62,36 62,42 38,26', 1),
    P('38,31 62,47 62,54 38,38', 1),
  ];

  const pyramid = [P('50,18 74,62 82,57', -1), P('26,62 74,62 50,18', 0)];

  const heart = D('M50 66L25 41Q15 29 25 20Q37 12 50 27Q63 12 75 20Q85 29 75 41Z', 0);

  const envelope = [
    P('31,24 69,24 69,54 31,54', 0),
    P('31,54 31,40 69,40 69,54', 1),
    P('31,24 69,24 50,46', 1),
  ];

  // --- the folds ----------------------------------------------------------
  const FOLDS = [
    {
      id: 'fan',
      name: 'Standing Fan',
      emoji: '🪭',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A crisp pleated fan that stands up proudly on the plate.',
      tip: 'A well-starched cotton or linen napkin is a must: soft napkins will flop instead of standing.',
      sources: [SRC.toh, SRC.falvey, SRC.werent, SRC.homedepot],
      steps: [
        halfStep('Lay the napkin face-down and fold it in half, bottom edge up to the top edge, to make a rectangle.'),
        {
          title: 'Accordion pleat',
          text: 'Starting at one short end, fold the rectangle back and forth in accordion pleats about 2.5 cm (1 in) wide. Stop when roughly a third (about 10 cm / 4 in) is left flat.',
          shapes: [P(HALF)],
          lines: [26, 32, 38, 44, 50, 56, 62].map((x) => [x, 25, x, 55]),
          arrows: [A(22, 63, 64, 63, -0.18)],
        },
        {
          title: 'Fold in half lengthwise',
          text: 'Keeping the pleats pressed together, fold the strip in half lengthwise with the pleats on the outside. The flat section now sticks out at one end.',
          shapes: [...pleats(32, 25, 46, 55, 8), P('46,25 80,25 80,55 46,55')],
          lines: [[28, 40, 84, 40]],
          arrows: [A(88, 27, 88, 53, 0.5)],
        },
        {
          title: 'Make the stand',
          text: 'Fold the corner of the flat section diagonally toward the pleats to make a triangle, and tuck the end that sticks out under the last pleat. This triangle is the stand.',
          shapes: [...pleats(32, 40, 46, 55, 8), P('46,40 80,40 80,55 46,55')],
          lines: [[46, 55, 61, 40]],
          arrows: [A(78, 52, 56, 30, 0.3)],
        },
        {
          title: 'Stand & open',
          text: 'Stand the napkin on the plate with the triangle at the back, then let go: the pleats will spring open into a fan.',
          shapes: [...fan(50, 62, 28, 228, 312, 9), P('45,59 55,59 54,65 46,65', -1)],
          prop: 'plateSide',
        },
      ],
      final: {
        text: 'Ta-da! Adjust the pleats and the triangle at the back until the fan stands evenly.',
        shapes: [...fan(50, 62, 32, 192, 348, 15), P('44,58 56,58 54.5,65 45.5,65', -1)],
        prop: 'plateSide',
      },
    },
    {
      id: 'rose',
      name: 'Rolled Rose',
      emoji: '🌹',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A romantic rolled rose with two leaves made from the napkin itself.',
      tip: 'Freshly ironed napkins roll neatest. Narrow bands give a taller rose, wide bands a shorter one.',
      sources: [SRC.homedepot, { name: 'Instructables – Fancy Dinner Napkins', url: 'https://www.instructables.com/Fancy-Dinner-Napkins/' }],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a large triangle.'),
        {
          title: 'Fold up a band',
          text: 'Turn the triangle so the long edge is nearest you. Fold the long edge up about 4 cm (1½ in), then keep folding that band up until the unfolded point above it is about twice the band’s height.',
          shapes: [P(TRI)],
          lines: [[16, 56, 84, 56]],
          arrows: [A(50, 70, 50, 52, 0.7)],
        },
        {
          title: 'Flip & roll',
          text: 'Flip the napkin over from top to bottom so the point faces toward you. Starting at the left end, roll it up tightly toward the right.',
          flip: true,
          shapes: [P('22,36 78,36 50,64'), P('14,24 86,24 78,36 22,36', 1)],
          arrows: [A(14, 44, 82, 44, -0.15)],
        },
        {
          title: 'Tuck the end',
          text: 'When you reach the end, tuck the loose tail underneath the outer edge so the roll can’t unravel.',
          shapes: [P('40,22 60,22 60,58 40,58'), P('40,22 60,22 60,31 40,31', 1), P('60,40 70,54 60,58', -1)],
          arrows: [A(74, 50, 59, 56, 0.5)],
          prop: 'plateSide',
        },
        {
          title: 'Pull out the leaves',
          text: 'Turn the rose over. Underneath you’ll find a corner with two layers. Pull them gently in opposite directions and bring them up around the rose as two leaves.',
          shapes: roseTop(false),
          details: [roseSpiral],
          arrows: [A(66, 30, 82, 22, 0.3), A(34, 50, 18, 58, 0.3)],
          prop: 'plate',
        },
      ],
      final: {
        text: 'Set the rose on the plate with its leaves spread out on either side.',
        shapes: roseTop(true),
        details: [roseSpiral],
        prop: 'plate',
      },
    },
    {
      id: 'bunny',
      name: 'Bunny Ears',
      emoji: '🐰',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'A cheeky rabbit with perky ears that little guests love.',
      tip: 'Lightweight, ironed cotton napkins are easiest; very thick linen is hard to tuck closed.',
      sources: [
        { name: 'Wayfair – How to Make a Napkin Bunny', url: 'https://www.wayfair.com/sca/ideas-and-advice/diy/how-to-make-a-napkin-bunny-T1179' },
        { name: 'Stanley Rogers – How to Make Easter Napkins', url: 'https://www.stanleyrogers.com.au/blogs/tips/how-to-fold-easter-napkins' },
        { name: 'World Market – Bunny Ear Napkins', url: 'https://www.worldmarket.com/inspiration/ideas-and-tips/how-to/how-to-fold-bunny-ear-napkins-for-easter.html' },
      ],
      steps: [
        halfStep(),
        {
          title: 'Fold again',
          text: 'Fold it in half lengthwise once more to make a long, narrow strip.',
          shapes: [P(HALF)],
          lines: [[20, 40, 80, 40]],
          arrows: [A(86, 52, 86, 28, 0.5)],
        },
        {
          title: 'Make a point',
          text: 'Find the centre of the strip’s top edge. Fold the top-left and top-right corners down so they meet in the centre, making a point at the top.',
          shapes: [P('10,36 90,36 90,44 10,44')],
          lines: [
            [50, 36, 42, 44],
            [50, 36, 58, 44],
          ],
          arrows: [A(86, 48, 60, 72, -0.3), A(14, 48, 40, 72, 0.3)],
        },
        {
          title: 'Make a diamond',
          text: 'Fold the bottom-left and bottom-right corners up to the top point to make a diamond.',
          shapes: [P('50,14 78,66 22,66')],
          details: [
            [50, 14, 50, 66],
            [50, 24, 31, 66],
            [50, 24, 69, 66],
          ],
          lines: [
            [30, 37, 50, 47.5],
            [70, 37, 50, 47.5],
          ],
          arrows: [A(24, 64, 46, 18, 0.3), A(76, 64, 54, 18, -0.3)],
        },
        {
          title: 'Make a kite',
          text: 'Fold the left and right corners of the diamond in to meet at the centre. The two loose points at the bottom will become the ears.',
          shapes: [P('50,12 72,40 50,68 28,40')],
          details: [[50, 12, 50, 68]],
          lines: [
            [50, 12, 39, 54],
            [50, 12, 61, 54],
          ],
          arrows: [A(30, 40, 47, 42, 0.3), A(70, 40, 53, 42, -0.3)],
        },
        {
          title: 'Fold down the top',
          text: 'Fold the top point down so its tip sits just above the centre of the napkin.',
          shapes: [P('50,12 61,40 50,68 39,40')],
          details: [
            [50, 12, 50, 68],
            [50, 40, 50, 68],
          ],
          lines: [[42, 30, 58, 30]],
          arrows: [A(50, 14, 50, 40, 0.5)],
        },
        {
          title: 'Flip & tuck',
          text: 'Hold it in place and turn the napkin over. Roll the left corner slightly toward the centre, then tuck the right corner into the left fold to close it into a ring.',
          flip: true,
          shapes: [P('42,30 58,30 61,40 50,68 39,40'), P('42,30 58,30 50,40', 1)],
          arrows: [A(34, 44, 47, 50, 0.4), A(66, 44, 53, 50, -0.4)],
        },
      ],
      final: {
        text: 'Stand the bunny up on its base, ears at the top, and fluff the ears apart. Hop to it!',
        shapes: bunny,
        prop: 'plateSide',
      },
    },
    {
      id: 'tree',
      name: 'Festive Tree',
      emoji: '🎄',
      difficulty: 'Tricky',
      minutes: 7,
      blurb: 'Stacked, tucked layers make a little evergreen. Top it with a star.',
      tip: 'Use a square napkin of at least 40 cm (16 in); 50 cm (20 in) is ideal. Smooth every layer flat as you go.',
      sources: [
        { name: 'Instructables – Christmas Tree Napkin Fold', url: 'https://www.instructables.com/Christmas-Tree-Napkin-Fold/' },
        { name: 'ZWILLING – Fold a Christmas tree out of napkins', url: 'https://www.zwilling.com/ca/magazine/cook-and-create/fold-napkins.html' },
      ],
      steps: [
        quartersStep('Fold the napkin in half, then in half again, lining up the corners. Turn it so the loose (open) corners point toward you.'),
        {
          title: 'Stagger the layers',
          text: 'Fold the top layer’s loose corner up toward the far point. Fold each following layer up too, stopping each one a little below the last so the corners are evenly staggered.',
          shapes: [P('50,10 80,40 50,70 20,40')],
          details: [
            [46, 66, 54, 66],
            [43, 63, 57, 63],
            [40, 60, 60, 60],
          ],
          arrows: [A(50, 67, 50, 16, 0.35)],
        },
        {
          title: 'Flip & fold the sides',
          text: 'Slide your hand under the napkin and flip it over. Fold each side corner across to the opposite side’s edge, making a tall, narrow triangle.',
          flip: true,
          shapes: [P('50,10 80,40 50,70 20,40')],
          lines: [
            [50, 10, 38, 58],
            [50, 10, 62, 58],
          ],
          arrows: [A(22, 40, 58, 44, 0.3), A(78, 40, 42, 44, -0.3)],
        },
        {
          title: 'Fold up the tiers',
          text: 'Flip it back over with the narrow tip pointing away from you. Starting at the top, fold each loose flap up and tuck it under the layer above to make the branches.',
          flip: true,
          shapes: [P('50,8 64,58 50,70 36,58'), P('39,60 61,60 50,70', 1), P('41,50 59,50 50,60', 1), P('43,40 57,40 50,50', 1)],
          arrows: [A(50, 68, 50, 52, 0.7)],
        },
      ],
      final: {
        text: 'Place it on the plate and neaten each tier so the branches sit evenly.',
        shapes: tree(false),
        prop: 'plate',
      },
    },
    {
      id: 'lotus',
      name: 'Lotus Blossom',
      emoji: '🪷',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'A blooming water-lily (also called the Rose fold) with eight pointed petals.',
      tip: 'Press every fold firmly. A stiff, starched napkin keeps the petals standing.',
      sources: [SRC.calinen('therose', 'The Rose'), SRC.werent, SRC.falvey],
      steps: [
        {
          title: 'Corners to centre',
          text: 'Lay the napkin face-down. Fold all four corners into the exact centre.',
          shapes: [P(SQUARE)],
          lines: [
            [50, 10, 80, 40],
            [80, 40, 50, 70],
            [50, 70, 20, 40],
            [20, 40, 50, 10],
          ],
          arrows: [A(22, 12, 46, 36, 0.2), A(78, 12, 54, 36, -0.2), A(78, 68, 54, 44, 0.2), A(22, 68, 46, 44, -0.2)],
        },
        {
          title: 'And again!',
          text: 'Fold the four new corners into the centre once more.',
          shapes: [P('50,10 80,40 50,70 20,40')],
          details: [
            [35, 25, 65, 55],
            [65, 25, 35, 55],
          ],
          lines: [
            [35, 25, 65, 25],
            [65, 25, 65, 55],
            [65, 55, 35, 55],
            [35, 55, 35, 25],
          ],
          arrows: [A(50, 12, 50, 35, 0.3), A(78, 40, 55, 40, 0.3), A(50, 68, 50, 45, 0.3), A(22, 40, 45, 40, 0.3)],
        },
        {
          title: 'Flip & fold',
          text: 'Turn the napkin over and fold the four corners into the centre one more time, pressing all the folds tight.',
          flip: true,
          shapes: [P('35,25 65,25 65,55 35,55')],
          lines: [
            [50, 25, 65, 40],
            [65, 40, 50, 55],
            [50, 55, 35, 40],
            [35, 40, 50, 25],
          ],
          arrows: [A(36, 26, 47, 37, 0.3), A(64, 26, 53, 37, -0.3), A(64, 54, 53, 43, 0.3), A(36, 54, 47, 43, -0.3)],
        },
        {
          title: 'Pull up the petals',
          text: 'Hold the centre down firmly with one hand. With the other, reach under each corner, grab the flap and pull it up and out to make a petal.',
          shapes: [P('50,25 65,40 50,55 35,40')],
          details: [
            [50, 25, 50, 55],
            [35, 40, 65, 40],
          ],
          arrows: [A(40, 30, 28, 18, 0.3), A(60, 30, 72, 18, -0.3), A(60, 50, 72, 62, 0.3), A(40, 50, 28, 62, -0.3)],
        },
        {
          title: 'More petals',
          text: 'Still holding the centre, reach between the petals and pull out the flaps underneath for a fuller bloom.',
          shapes: lotusFlower(false),
          arrows: [A(50, 32, 50, 12, 0.3), A(58, 40, 80, 40, 0.3), A(50, 48, 50, 68, 0.3), A(42, 40, 20, 40, 0.3)],
          prop: 'plate',
        },
      ],
      final: {
        text: 'Your lotus is in bloom! Press the centre down gently so it sits flat on the plate.',
        shapes: lotusFlower(true),
        prop: 'plate',
      },
    },
    {
      id: 'candle',
      name: 'Candle',
      emoji: '🕯️',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A tall rolled candle that stands to attention, a nod to festivals of light.',
      tip: 'Roll as tightly as you can; a loose roll will lean.',
      sources: [SRC.calinen('candle', 'The Candle'), SRC.falvey, SRC.werent],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        {
          title: 'Fold up a cuff',
          text: 'Turn the triangle so the long edge faces you, and fold that edge up by about a quarter to a third of the triangle’s height to make a cuff.',
          shapes: [P(TRI)],
          lines: [[22, 50, 78, 50]],
          arrows: [A(50, 70, 50, 46, 0.7)],
        },
        {
          title: 'Flip & roll',
          text: 'Turn the napkin over. Starting at one end, roll it up tightly to the other end.',
          flip: true,
          shapes: [P('22,50 78,50 50,22'), P('10,62 90,62 78,50 22,50', -1)],
          arrows: [A(12, 66, 86, 66, -0.15), A(12, 58, 36, 40, 0.4)],
        },
        {
          title: 'Tuck & stand',
          text: 'Tuck the loose corner inside the cuff at the base to hold the roll, then stand the candle upright.',
          shapes: [...candleBody, P('43,17 57,17 50,8', 1), P('57,48 63,58 57,60', -1)],
          details: candleWraps,
          arrows: [A(70, 52, 58, 58, 0.5)],
          prop: 'plateSide',
        },
      ],
      final: {
        text: 'Fold one layer of the top point down so the other stands up like a flame.',
        shapes: [...candleBody, P('43,17 57,17 50,5', 0), P('43,17 50,17 46,24', -1)],
        details: candleWraps,
        prop: 'plateSide',
      },
    },
    {
      id: 'hat',
      name: "Witch's Hat",
      emoji: '🧙',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'The classic Clown’s Hat cone with a turned-up cuff. In black or orange, it’s an instant witch’s hat.',
      tip: 'Start with a large square napkin (45–50 cm / 18–20 in). Roll loosely at first, then tighten.',
      sources: [SRC.calinen('clownhat', 'The Clown’s Hat'), SRC.falvey],
      steps: [
        halfStep('Lay the napkin face-down and fold it in half, bringing the bottom edge up to the top edge.'),
        {
          title: 'Roll a cone',
          text: 'Hold the centre of the folded bottom edge with one finger. Take the lower-right corner and loosely roll it around that point, matching the corners as you go, until a cone forms.',
          shapes: [P(HALF), C(50, 55, 2.2, 0, 'white')],
          arrows: [A(78, 53, 54, 28, 0.35)],
        },
        {
          title: 'Turn up the hem',
          text: 'Turn the cone upside down so the point is at the top, then turn the bottom hem up all the way around to make a cuff.',
          shapes: [P('38,62 50,12 62,62')],
          lines: [[39, 56, 61, 56]],
          arrows: [A(36, 64, 36, 52, -0.6), A(64, 64, 64, 52, 0.6)],
          prop: 'plateSide',
        },
      ],
      final: {
        text: 'Stand the hat up on its cuff on the plate.',
        shapes: coneHat(false),
        prop: 'plateSide',
      },
    },
    {
      id: 'pocket',
      name: 'Cutlery Pocket',
      emoji: '🍴',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A smart striped pocket that holds the knife, fork and spoon.',
      tip: 'Press each diagonal band flat (an iron helps) for crisp, even stripes.',
      sources: [SRC.toh, SRC.werent, SRC.homedepot],
      steps: [
        quartersStep('Fold the napkin in half, then in half again, to make a square. Turn it so the loose corners are at the top right.'),
        {
          title: 'First band',
          text: 'Take the top layer at the loose corner and fold it over in 4 cm (1½ in) folds toward the centre until you have a neat diagonal band across the middle.',
          shapes: [P('30,20 70,20 70,60 30,60')],
          details: [
            [63, 20, 70, 27],
            [66, 20, 70, 24],
          ],
          lines: [[30, 20, 70, 60]],
          arrows: [A(68, 22, 40, 50, 0.3)],
        },
        {
          title: 'Second band',
          text: 'Fold the next layer the same way, stopping just above the first band so the two stripes are the same width.',
          shapes: [P('30,20 70,20 70,60 30,60'), P('34,20 30,24 66,60 70,56', 1)],
          lines: [[46, 20, 70, 44]],
          arrows: [A(68, 22, 54, 34, 0.3)],
        },
        {
          title: 'Fold the sides under',
          text: 'Fold the left and right sides under to the back so the napkin is a third of its width, keeping the bands on the front.',
          shapes: [P('30,20 70,20 70,60 30,60'), P('34,20 30,24 66,60 70,56', 1), P('46,20 52,20 70,38 70,44', 1)],
          lines: [
            [40, 20, 40, 60],
            [60, 20, 60, 60],
          ],
          arrows: [A(31, 40, 44, 40, 0.45), A(69, 40, 56, 40, -0.45)],
        },
        {
          title: 'Add the cutlery',
          text: 'Slide a knife, fork and spoon into the pockets behind the bands.',
          shapes: pocket(false),
          arrows: [A(50, 1, 50, 16, 0)],
        },
      ],
      final: {
        text: 'All set! The bands hold the knife, fork and spoon neatly in place.',
        shapes: pocket(true),
      },
    },
    {
      id: 'pyramid',
      name: 'Pyramid',
      emoji: '🔺',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'A crisp, self-standing pyramid: quick, elegant and ideal when you’re folding for a crowd.',
      tip: 'A medium-weight cotton or linen napkin gives the sharpest edges.',
      sources: [SRC.calinen('pyramid', 'Pyramid'), SRC.falvey],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        {
          title: 'Corners to the top',
          text: 'Turn the triangle so the long edge faces you. Fold the left and right corners up to meet the top point, making a diamond.',
          shapes: [P(TRI)],
          lines: [
            [30, 42, 50, 62],
            [70, 42, 50, 62],
          ],
          arrows: [A(13, 60, 47, 24, 0.3), A(87, 60, 53, 24, -0.3)],
        },
        {
          title: 'Flip & fold in half',
          text: 'Turn the napkin over and fold it in half, bringing the bottom point up to the top point to make a triangle.',
          flip: true,
          shapes: [P('50,22 70,42 50,62 30,42')],
          lines: [[30, 42, 70, 42]],
          arrows: [A(50, 60, 50, 26, 0.4)],
        },
      ],
      final: {
        text: 'Pick it up at the centre and stand it on the long base of the triangle, like a pyramid.',
        shapes: pyramid,
        prop: 'plateSide',
      },
    },
    {
      id: 'heart',
      name: 'Sweetheart',
      emoji: '💖',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A simple folded heart that says “I made this for you”.',
      tip: 'A square napkin about 45 cm (18 in) works best; press the centre folds firmly.',
      sources: [SRC.homedepot, { name: 'In My Own Style – Heart Shaped Napkin Fold', url: 'https://inmyownstyle.com/valentines-table-easy-heart-shaped-napkin-fold.html' }],
      steps: [
        halfStep('Lay the napkin face-down and fold it in half lengthwise.'),
        {
          title: 'Fold again',
          text: 'Fold it in half again in the same direction to make a long, skinny strip.',
          shapes: [P(HALF)],
          lines: [[20, 40, 80, 40]],
          arrows: [A(86, 52, 86, 28, 0.5)],
        },
        {
          title: 'Fold up both halves',
          text: 'Fold the left half straight up from the centre, like starting a paper football. Repeat with the right half so the two sides meet in the middle with a point at the bottom.',
          shapes: [P('10,58 90,58 90,66 10,66')],
          lines: [
            [50, 66, 42, 58],
            [50, 66, 58, 58],
          ],
          arrows: [A(14, 54, 44, 18, 0.3), A(86, 54, 56, 18, -0.3)],
        },
        {
          title: 'Round the top',
          text: 'Fold the two inner top corners down and underneath. Then do the same with the two pointed outer corners so the top looks like a rounded heart.',
          shapes: [P('34,12 66,12 66,52 50,68 34,52')],
          details: [[50, 12, 50, 52]],
          lines: [
            [34, 20, 42, 12],
            [58, 12, 66, 20],
            [46, 12, 50, 16],
            [50, 16, 54, 12],
          ],
          arrows: [A(30, 10, 38, 18, 0.4), A(70, 10, 62, 18, -0.4)],
        },
      ],
      final: {
        text: 'There’s your heart! Tuck a love note underneath.',
        shapes: [heart],
        details: [[50, 27, 50, 66]],
        prop: 'plate',
      },
    },
    {
      id: 'crown',
      name: 'Crown',
      emoji: '👑',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'The regal banquet-hall classic: tall, self-standing, with two peaks.',
      tip: 'Heavily starched linen is the secret to a crown that stays upright all evening.',
      sources: [SRC.calinen('crown', 'The Crown'), SRC.falvey, SRC.werent],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        {
          title: 'Corners to the top',
          text: 'Turn the triangle so the long edge faces you. Fold the left and right corners up to meet the top point, making a diamond.',
          shapes: [P('10,60 90,60 50,20')],
          lines: [
            [30, 40, 50, 60],
            [70, 40, 50, 60],
          ],
          arrows: [A(13, 58, 47, 22, 0.3), A(87, 58, 53, 22, -0.3)],
        },
        {
          title: 'Fold up the point',
          text: 'Fold the bottom point up about two-thirds of the way to the top point.',
          shapes: [P('50,20 70,40 50,60 30,40')],
          details: [[50, 20, 50, 60]],
          lines: [[36.5, 46.5, 63.5, 46.5]],
          arrows: [A(50, 58, 50, 34, 0.4)],
        },
        {
          title: 'Fold it back',
          text: 'Fold that same point back down to the bottom edge.',
          shapes: [P('50,20 70,40 63.5,46.5 36.5,46.5 30,40'), P('36.5,46.5 63.5,46.5 50,33', 1)],
          lines: [[43, 40, 57, 40]],
          arrows: [A(50, 35, 50, 45, 0.6)],
        },
        {
          title: 'Flip & tuck',
          text: 'Turn the napkin over. Bring the left and right corners round behind and tuck one into the other to make a round base.',
          flip: true,
          shapes: [P('50,20 70,40 63.5,46.5 36.5,46.5 30,40'), P('36.5,46.5 63.5,46.5 57,40 43,40', 1)],
          lines: [
            [40, 22, 40, 46],
            [60, 22, 60, 46],
          ],
          arrows: [A(30, 50, 46, 56, 0.4), A(70, 50, 54, 56, -0.4)],
        },
      ],
      final: {
        text: 'Stand it upright and peel the two top corners down and out to form the crown.',
        shapes: crown,
        prop: 'plateSide',
      },
    },
    {
      id: 'envelope',
      name: 'Envelope',
      emoji: '✉️',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A neat envelope fold with a real pocket and a pointed flap.',
      tip: 'Press each fold firmly so the flap stays closed.',
      sources: [{ name: 'Instructables – Envelope Napkin Fold', url: 'https://www.instructables.com/Envelope-Napkin-Fold/' }, SRC.toh],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally. Turn the triangle so its long side is nearest you.'),
        {
          title: 'Corners to the middle',
          text: 'Fold the left corner in so its tip sits just past the middle of the long edge. Repeat with the right corner so the tips overlap slightly.',
          shapes: [P(TRI)],
          lines: [
            [31, 41, 31, 62],
            [69, 41, 69, 62],
          ],
          arrows: [A(12, 60, 52, 56, 0.3), A(88, 60, 48, 56, -0.3)],
        },
        {
          title: 'Fold the edges in',
          text: 'Fold the lower-left corner in to the middle of the bottom edge, then the lower-right, making a “house” shape.',
          shapes: [P('31,41 50,22 69,41 69,62 31,62'), P('31,41 31,62 52,62', 1), P('69,41 69,62 48,62', 1)],
          lines: [
            [31, 53, 40, 62],
            [69, 53, 60, 62],
          ],
          arrows: [A(30, 60, 46, 60, -0.4), A(70, 60, 54, 60, 0.4)],
        },
        {
          title: 'Make the pocket',
          text: 'Fold the bottom edge up so it sits just below the top side corners. This is the pocket.',
          shapes: [P('40,62 31,53 31,41 50,22 69,41 69,53 60,62')],
          lines: [[31, 52, 69, 52]],
          arrows: [A(50, 61, 50, 43, 0.4)],
        },
        {
          title: 'Close the flap',
          text: 'Fold the top point down over the pocket to close the envelope.',
          shapes: [P('31,41 50,22 69,41 69,52 31,52'), P('31,41 69,41 69,52 31,52', 1)],
          lines: [[31, 41, 69, 41]],
          arrows: [A(50, 24, 50, 47, 0.4)],
        },
      ],
      final: {
        text: 'Sealed and delivered! Press the flap flat and set it on the plate.',
        shapes: envelope,
        prop: 'plate',
      },
    },
  ];

  window.NapkinFolds = FOLDS;
  // Shared drawing kit for folds-extra.js
  window.NapkinFoldKit = { P, D, C, E, A, r, SQUARE, HALF, TRI, SRC, pleats, fan, petal, star, halfStep, triangleStep, quartersStep };
})();
