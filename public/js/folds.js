/*
 * Napkin fold library. Every step has a title, instructions and an
 * illustration (shapes / fold lines / arrows, drawn by render.js).
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

  // --- finished-napkin artwork -------------------------------------------
  const roseTop = (full) => [
    ...(full ? [petal(50, 40, 20, 34, 6, 0, 'leaf'), petal(50, 40, 160, 32, 6, -1, 'leaf')] : []),
    C(50, 40, full ? 22 : 17, -1),
    C(51, 39, full ? 17 : 13, 0),
    C(49, 41, full ? 12 : 9, 1),
    C(50, 40, full ? 6.5 : 5, 0),
  ];
  const roseSpiral = 'M50 40m0-2.5a2.5 2.5 0 1 1-2.5 2.5a5 5 0 1 1 5 5a9 9 0 1 1-9-9a13 13 0 1 1 13 13';

  const lotusFlower = (full) => [
    ...(full ? [0, 90, 180, 270].map((a) => petal(50, 40, a, 33, 11, -1)) : []),
    ...[45, 135, 225, 315].map((a) => petal(50, 40, a, full ? 27 : 22, full ? 10 : 8, 0)),
    ...(full ? [0, 90, 180, 270].map((a) => petal(50, 40, a, 15, 6, 1)) : []),
    C(50, 40, full ? 5.5 : 6, 1),
    ...(full ? [C(50, 40, 3.6, 0, 'gold')] : []),
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
    P('46,58 54,58 54,68 46,68', -2),
    P('50,30 78,60 22,60', -1),
    P('50,19 72,46 28,46', 0),
    P('50,9 65,32 35,32', 1),
    ...(withStar ? [P(star(50, 9, 6, 2.6), 0, 'gold')] : []),
  ];

  const candleBody = [
    P('43,17 57,17 57,64 43,64', 0),
    P('43,17 57,17 50,9', 1),
    P('57,50 63,62 57,64', -1),
  ];
  const candleWraps = [
    [43, 28, 57, 22],
    [43, 40, 57, 34],
    [43, 52, 57, 46],
  ];

  const witchHat = (bent) => [
    E(50, 61, 27, 6.5, -1),
    bent ? D('M38 60L49 24Q51 14 61 11Q55 18 56 27L62 60Z', 0) : P('38,60 50,14 62,60', 0),
    P('38.4,60 61.6,60 60.3,54 39.7,54', 0, 'napkin2'),
    ...(bent ? [P('47,54.5 53,54.5 53,59.5 47,59.5', 0, 'gold')] : []),
  ];

  const crown = [
    P('39,62 39,36 55,13 69,33 69,62', -1),
    P('31,64 31,37 46,16 61,37 61,64', 0),
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

  const matzahStack = () => {
    const out = [];
    for (let i = 0; i < 4; i++) {
      const y = -i * 0.8;
      out.push(P(`33,${22 + y} 67,${22 + y} 67,${58 + y} 33,${58 + y}`, i - 2));
      if (i < 3) {
        const x = 72 - i * 1.6;
        out.push(P(`37,${24 + y} ${x},${24 + y} ${x},${56 + y} 37,${56 + y}`, 0, 'matzah'));
      }
    }
    return out;
  };

  const heart = D('M50 66L25 41Q15 29 25 20Q37 12 50 27Q63 12 75 20Q85 29 75 41Z', 0);

  const envelope = [
    P('32,22 68,22 68,56 32,56', 0),
    P('37,16 63,16 63,30 37,30', 0, 'white'),
    P('32,56 50,40 68,56', 1),
    P('32,22 68,22 50,43', 1),
    C(50, 41, 3.6, 0, 'gold'),
  ];

  // --- the folds ----------------------------------------------------------
  const FOLDS = [
    {
      id: 'fan',
      name: 'Classic Fan',
      emoji: '🪭',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A crisp pleated fan that stands up proudly on the plate.',
      tip: 'Starched cotton or linen holds the pleats best. Iron the napkin first for razor-sharp folds.',
      steps: [
        halfStep(),
        {
          title: 'Accordion pleat',
          text: 'Starting at the left short edge, accordion-pleat (fold back and forth) about three-quarters of the length in pleats roughly 2.5 cm (1 in) wide. Leave the last quarter flat.',
          shapes: [P(HALF)],
          lines: [26, 32, 38, 44, 50, 56, 62].map((x) => [x, 25, x, 55]),
          arrows: [A(22, 63, 64, 63, -0.18)],
        },
        {
          title: 'Fold lengthwise',
          text: 'Pinch the pleats together and fold the whole strip in half lengthwise, top edge down, so the pleats stay on the outside.',
          shapes: [...pleats(32, 25, 46, 55, 8), P('46,25 80,25 80,55 46,55')],
          lines: [[28, 40, 84, 40]],
          arrows: [A(88, 27, 88, 53, 0.5)],
        },
        {
          title: 'Make the stand',
          text: 'Fold the flat tail diagonally up and toward the pleats. This triangle becomes the kick-stand that props the fan up.',
          shapes: [...pleats(32, 40, 46, 55, 8), P('46,40 80,40 80,55 46,55')],
          lines: [[46, 55, 61, 40]],
          arrows: [A(78, 52, 56, 30, 0.3)],
        },
        {
          title: 'Stand & open',
          text: 'Stand the napkin on the plate with the stand tucked behind, then let go — the pleats will spring open.',
          shapes: [...fan(50, 62, 28, 228, 312, 9), P('45,59 55,59 54,65 46,65', -1)],
          prop: 'plateSide',
        },
      ],
      final: {
        text: 'Ta-da! Fluff the pleats evenly so the fan forms a smooth half-circle.',
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
      blurb: 'A romantic rolled rose — gorgeous nestled on a plate with a sprig of greenery.',
      tip: 'Thinner, softer napkins roll tighter and make prettier petals.',
      steps: [
        triangleStep(),
        {
          title: 'Cuff the long edge',
          text: 'Turn the triangle so the long edge is nearest you. Fold that edge up by about 3 cm (1¼ in).',
          shapes: [P(TRI)],
          lines: [[16, 56, 84, 56]],
          arrows: [A(50, 70, 50, 53, 0.7)],
        },
        {
          title: 'Roll it up',
          text: 'Starting at the left corner, roll the napkin tightly toward the right, keeping the cuff on the outside at the bottom.',
          shapes: [P('24,62 90,62 50,22 24,48'), P('24,56 84,56 90,62 24,62', 1), D('M15 40h10v25h-10z', -1)],
          details: [
            [15, 45, 25, 44],
            [15, 51, 25, 50],
            [15, 57, 25, 56],
          ],
          arrows: [A(28, 70, 72, 70, -0.15)],
        },
        {
          title: 'Tuck the tail',
          text: 'When you reach the end, tuck the loose tail into the cuff at the base so the roll holds together.',
          shapes: [
            D('M40 24Q43 13 47 22Q51 11 55 22Q59 15 60 24Z', 1),
            P('40,24 60,24 60,64 40,64'),
            P('60,50 70,61 60,64', -1),
            P('40,58 60,58 60,64 40,64', 1),
          ],
          arrows: [A(74, 54, 59, 61, 0.5)],
          prop: 'plateSide',
        },
        {
          title: 'Open the petals',
          text: 'Lay the rose on the plate and gently peel back the outer layers to open the petals.',
          shapes: roseTop(false),
          details: [roseSpiral],
          prop: 'plate',
        },
      ],
      final: {
        text: 'Add a sprig of rosemary or a real leaf beside your rose for the finishing touch.',
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
      blurb: 'A cheeky rabbit with perky ears — a guaranteed giggle from little guests.',
      tip: 'A square napkin of 45–50 cm (18–20 in) gives the tallest ears.',
      steps: [
        halfStep(),
        {
          title: 'Fold again',
          text: 'Fold the rectangle in half lengthwise once more to make a long, narrow strip.',
          shapes: [P(HALF)],
          lines: [[20, 40, 80, 40]],
          arrows: [A(86, 52, 86, 28, 0.5)],
        },
        {
          title: 'Make a point',
          text: 'Find the centre of the strip. Fold each half down from the centre so the strip forms a triangle with its point at the top.',
          shapes: [P('10,36 90,36 90,44 10,44')],
          lines: [
            [50, 36, 42, 44],
            [50, 36, 58, 44],
          ],
          arrows: [A(86, 48, 60, 72, -0.3), A(14, 48, 40, 72, 0.3)],
        },
        {
          title: 'Make a diamond',
          text: 'Fold the bottom corners of each side up to meet the top point, making a diamond.',
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
          title: 'Flip & fold up',
          text: 'Turn the diamond over. Fold the bottom point up to just below the top point.',
          flip: true,
          shapes: [P('50,12 72,40 50,68 28,40')],
          details: [[50, 12, 50, 68]],
          lines: [[31, 44, 69, 44]],
          arrows: [A(50, 66, 50, 20, 0.4)],
        },
        {
          title: 'Make a ring',
          text: 'Turn it over again. Fold the left and right sides behind and tuck one end into the other to form a ring.',
          flip: true,
          shapes: [P('50,12 72,40 66,48 34,48 28,40'), P('34,48 66,48 50,26', 1)],
          details: [[50, 12, 50, 26]],
          arrows: [A(26, 50, 46, 60, 0.4), A(74, 50, 54, 60, -0.4)],
        },
      ],
      final: {
        text: 'Stand the bunny up and gently pull the two points apart into ears. Hop to it!',
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
      blurb: 'Layered tiers make a little evergreen tree — top it with a star card.',
      tip: 'Use a large (50 cm / 20 in) napkin and press every layer flat with your palm.',
      steps: [
        quartersStep(),
        {
          title: 'Stagger the layers',
          text: 'Turn the square into a diamond with the open corners at the top. Fold the top layer down, stopping about 2 cm short of the bottom point. Repeat with each layer, stepping each one a little higher.',
          shapes: [P('50,10 80,40 50,70 20,40')],
          details: [
            [46, 14, 54, 14],
            [43, 17, 57, 17],
            [40, 20, 60, 20],
          ],
          lines: [[22, 42, 78, 42]],
          arrows: [A(50, 13, 50, 64, 0.35)],
        },
        {
          title: 'Flip & fold the sides',
          text: 'Turn the napkin over. Fold the left and right corners in so they meet down the centre, making a tall triangle.',
          flip: true,
          shapes: [P('50,10 80,40 50,70 20,40')],
          lines: [
            [50, 10, 38, 58],
            [50, 10, 62, 58],
          ],
          arrows: [A(22, 40, 46, 44, 0.3), A(78, 40, 54, 44, -0.3)],
        },
        {
          title: 'Make the tiers',
          text: 'Turn over again. Starting with the top layer, fold each loose corner up and tuck it under the layer above to create the branches.',
          flip: true,
          shapes: [P('50,8 64,58 50,70 36,58'), P('39,60 61,60 50,70', 1), P('41,50 59,50 50,60', 1), P('43,40 57,40 50,50', 1)],
          arrows: [A(50, 68, 50, 52, 0.7)],
        },
        {
          title: 'Shape the tree',
          text: 'Lay it on the plate and fold the bottom tip under to make a little trunk. Neaten each tier.',
          shapes: tree(false),
          prop: 'plate',
        },
      ],
      final: {
        text: 'Top your tree with a star — a cut-out card, a gold chocolate or a cinnamon stick works a treat.',
        shapes: tree(true),
        prop: 'plate',
      },
    },
    {
      id: 'lotus',
      name: 'Lotus Blossom',
      emoji: '🪷',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'A blooming water-lily that can cradle a tealight, a few dates or a sweet.',
      tip: 'A stiff, well-starched napkin keeps the petals standing tall.',
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
          text: 'Turn the napkin over and fold the four corners into the centre one more time.',
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
          title: 'Pull the petals',
          text: 'Hold the centre down firmly. Reach underneath each corner, grab the flap and pull it up and out to form a petal.',
          shapes: [P('50,25 65,40 50,55 35,40')],
          details: [
            [50, 25, 50, 55],
            [35, 40, 65, 40],
          ],
          arrows: [A(40, 30, 28, 18, 0.3), A(60, 30, 72, 18, -0.3), A(60, 50, 72, 62, 0.3), A(40, 50, 28, 62, -0.3)],
        },
        {
          title: 'Second layer',
          text: 'Now pull out the four flaps between the petals for a fuller bloom.',
          shapes: lotusFlower(false),
          arrows: [A(50, 32, 50, 12, 0.3), A(58, 40, 80, 40, 0.3), A(50, 48, 50, 68, 0.3), A(42, 40, 20, 40, 0.3)],
          prop: 'plate',
        },
      ],
      final: {
        text: 'Your lotus is in bloom! Place a tealight (in a holder), a few dates or a sweet in the centre.',
        shapes: lotusFlower(true),
        prop: 'plate',
      },
    },
    {
      id: 'candle',
      name: 'Glowing Candle',
      emoji: '🕯️',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A tall rolled candle that stands to attention — a lovely nod to festivals of light.',
      tip: 'Roll as tightly as you can; a loose roll will lean.',
      steps: [
        triangleStep(),
        {
          title: 'Cuff the long edge',
          text: 'Turn the triangle so the long edge faces you, and fold that edge up by about 2.5 cm (1 in).',
          shapes: [P(TRI)],
          lines: [[17, 55, 83, 55]],
          arrows: [A(50, 70, 50, 52, 0.7)],
        },
        {
          title: 'Flip & roll',
          text: 'Turn the napkin over. Starting from one corner, roll it up tightly toward the other corner.',
          flip: true,
          shapes: [P(TRI), P('17,55 83,55 90,62 10,62', -1)],
          arrows: [A(14, 66, 84, 66, -0.15), A(14, 58, 38, 44, 0.4)],
        },
        {
          title: 'Tuck & stand',
          text: 'Tuck the loose corner into the cuff at the base to secure it, then stand the candle upright.',
          shapes: candleBody,
          details: candleWraps,
          arrows: [A(70, 56, 58, 61, 0.5)],
          prop: 'plateSide',
        },
      ],
      final: {
        text: 'Let the top point be your flame — or wrap a gold ribbon around it for extra sparkle.',
        shapes: [...candleBody.slice(0, 1), D('M50 3Q57 11 50 16.5Q43 11 50 3Z', 0, 'flame'), P('43,17 57,17 50,10', 1)],
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
      blurb: 'A rolled cone with a floppy brim — spooky, silly and super quick.',
      tip: 'Black, orange or purple napkins look the part. Paper napkins work too for kids’ parties.',
      steps: [
        triangleStep(),
        {
          title: 'Roll a cone',
          text: 'Hold the centre of the long edge. Roll one corner around toward the other to form a tight cone, point at the top.',
          shapes: [P(TRI)],
          lines: [[50, 22, 50, 62]],
          arrows: [A(14, 59, 48, 44, 0.4)],
        },
        {
          title: 'Make the brim',
          text: 'Stand the cone up and fold the bottom edge outward and upward a couple of times to make a sturdy brim.',
          shapes: [P('38,62 50,14 62,62')],
          lines: [[39, 56, 61, 56]],
          arrows: [A(41, 63, 28, 58, 0.5), A(59, 63, 72, 58, -0.5)],
          prop: 'plateSide',
        },
        {
          title: 'Add a band',
          text: 'Wrap a ribbon or a strip of contrasting napkin around the base of the cone for the hat band.',
          shapes: witchHat(false),
          prop: 'plateSide',
        },
      ],
      final: {
        text: 'Give the tip a gentle bend to one side for a proper witchy slouch. Cackling optional.',
        shapes: witchHat(true),
        prop: 'plateSide',
      },
    },
    {
      id: 'pocket',
      name: 'Cutlery Pocket',
      emoji: '🍴',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A smart striped pocket that holds the cutlery — and a name card or sprig of herbs.',
      tip: 'Iron each diagonal band flat for crisp stripes.',
      steps: [
        quartersStep('Fold the napkin in half, then in half again, so all the loose corners are together. Turn it so the loose corners sit at the top right.'),
        {
          title: 'First band',
          text: 'Take the top layer at the loose corner and fold it diagonally toward the opposite corner, then fold it back on itself to make a neat band across the middle.',
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
          text: 'Fold the next layer diagonally the same way, tucking its edge just under the first band so the two stripes sit evenly.',
          shapes: [P('30,20 70,20 70,60 30,60'), P('34,20 30,24 66,60 70,56', 1)],
          lines: [[46, 20, 70, 44]],
          arrows: [A(68, 22, 54, 34, 0.3)],
        },
        {
          title: 'Fold the sides behind',
          text: 'Fold the left and right sides behind so the napkin is about a third narrower, keeping the bands on the front.',
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
        text: 'All set! Pop a name card or a sprig of herbs in the second pocket.',
        shapes: pocket(true),
      },
    },
    {
      id: 'matzah',
      name: 'Triple Pocket',
      emoji: '🫓',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'Four layers make three pockets — perfect as a simple matzah cover or for holding flatbreads.',
      tip: 'Use a large white or embroidered napkin; for Passover choose one kept for the Seder.',
      steps: [
        halfStep(),
        {
          title: 'Fold again',
          text: 'Fold it in half again, right side over to the left, to make a square with four layers.',
          shapes: [P(HALF)],
          lines: [[50, 25, 50, 55]],
          arrows: [A(76, 22, 24, 22, 0.35)],
        },
        {
          title: 'Find the pockets',
          text: 'Turn the square so the open edges face you. The gaps between the four layers make three pockets.',
          shapes: matzahStack().filter((s) => s.c !== 'matzah'),
          arrows: [A(84, 40, 70, 40, 0)],
        },
      ],
      final: {
        text: 'Slide one matzah (or flatbread) into each of the three pockets and place it at the head of the table.',
        shapes: matzahStack(),
        details: [
          [69, 30, 69, 31],
          [70, 36, 70, 37],
          [69, 44, 69, 45],
          [70, 50, 70, 51],
        ],
        prop: 'plate',
      },
    },
    {
      id: 'bow',
      name: 'Bow Tie',
      emoji: '🎀',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'Pleat, pinch and tie — a dapper bow in under two minutes.',
      tip: 'A contrasting ribbon, napkin ring or even a strip of washi tape makes the knot pop.',
      steps: [
        {
          title: 'Pleat it',
          text: 'Lay the napkin flat and accordion-pleat it from the bottom edge to the top, in pleats about 2.5 cm (1 in) wide.',
          shapes: [P(SQUARE)],
          lines: [16, 22, 28, 34, 40, 46, 52, 58, 64].map((y) => [20, y, 80, y]),
          arrows: [A(86, 66, 86, 14, 0.15)],
        },
        {
          title: 'Pinch the middle',
          text: 'Holding the pleats together, pinch the long strip firmly at its centre.',
          shapes: [P('12,35 88,35 88,45 12,45')],
          details: [
            [12, 37.5, 88, 37.5],
            [12, 40, 88, 40],
            [12, 42.5, 88, 42.5],
          ],
          arrows: [A(14, 30, 46, 30, 0.3), A(86, 30, 54, 30, -0.3)],
        },
        {
          title: 'Tie the knot',
          text: 'Wrap a napkin ring, ribbon or a thin strip of contrasting fabric around the pinched centre.',
          shapes: [P('50,40 18,31 18,49'), P('50,40 82,31 82,49', -1), P('46,33 54,33 54,47 46,47', 0, 'accent')],
          arrows: [A(40, 27, 60, 27, -0.5)],
          prop: 'plate',
        },
      ],
      final: {
        text: 'Gently spread the pleats on each side so they fan out into a full bow.',
        shapes: [...fan(48, 40, 30, 148, 212, 6), ...fan(52, 40, 30, -32, 32, 6), P('45,32 55,32 55,48 45,48', 0, 'accent')],
        prop: 'plate',
      },
    },
    {
      id: 'heart',
      name: 'Sweetheart',
      emoji: '💖',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A simple folded heart that says “I made this for you”.',
      tip: 'Square napkins work best; press the centre fold firmly so it lies flat.',
      steps: [
        halfStep(),
        {
          title: 'Fold again',
          text: 'Fold it in half lengthwise once more to make a long strip.',
          shapes: [P(HALF)],
          lines: [[20, 40, 80, 40]],
          arrows: [A(86, 52, 86, 28, 0.5)],
        },
        {
          title: 'Fold down the sides',
          text: 'Find the centre. Fold the right half straight down from the centre, then the left half, so the two ends sit side by side pointing toward you.',
          shapes: [P('10,36 90,36 90,44 10,44')],
          lines: [
            [50, 36, 42, 44],
            [50, 36, 58, 44],
          ],
          arrows: [A(86, 48, 56, 72, -0.3), A(14, 48, 44, 72, 0.3)],
        },
        {
          title: 'Flip & turn',
          text: 'Turn the napkin over and rotate it so the point is at the bottom.',
          flip: true,
          shapes: [P('34,12 66,12 66,52 50,68 34,52')],
          details: [[50, 12, 50, 52]],
          arrows: [A(74, 18, 74, 60, 0.6)],
        },
        {
          title: 'Round the top',
          text: 'Fold the outer top corners down at a small angle, then fold the inner top corners down a little too, making two rounded bumps.',
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
        text: 'Turn it back over — and there’s your heart. Tuck a love note underneath.',
        shapes: [heart],
        details: [[50, 27, 50, 66]],
        prop: 'plate',
      },
    },
    {
      id: 'crown',
      name: "Bishop's Crown",
      emoji: '👑',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'The grand, mitre-shaped classic of banquet halls — tall, regal and self-standing.',
      tip: 'Heavily starched linen is the secret to a crown that stays upright all evening.',
      steps: [
        {
          title: 'Make a triangle',
          text: 'Lay the napkin face-down and fold it in half diagonally, bringing the top-right corner down to the bottom-left.',
          shapes: [P(SQUARE)],
          lines: [[20, 10, 80, 70]],
          arrows: [A(77, 13, 24, 66, 0.3)],
        },
        {
          title: 'Make a diamond',
          text: 'Turn the triangle so the long edge is at the bottom. Fold the left and right corners up to meet the top point.',
          shapes: [P('10,60 90,60 50,20')],
          lines: [
            [30, 40, 50, 60],
            [70, 40, 50, 60],
          ],
          arrows: [A(13, 58, 47, 22, 0.3), A(87, 58, 53, 22, -0.3)],
        },
        {
          title: 'Fold up the point',
          text: 'Fold the bottom point up to about 2.5 cm (1 in) below the top.',
          shapes: [P('50,20 70,40 50,60 30,40')],
          details: [[50, 20, 50, 60]],
          lines: [[33, 43, 67, 43]],
          arrows: [A(50, 58, 50, 25, 0.4)],
        },
        {
          title: 'Fold it back',
          text: 'Fold that same point back down so its tip touches the bottom fold.',
          shapes: [P('50,20 70,40 67,43 33,43 30,40'), P('33,43 67,43 50,26', 1)],
          lines: [[41, 34.5, 59, 34.5]],
          arrows: [A(50, 28, 50, 41, 0.6)],
        },
        {
          title: 'Flip & curl',
          text: 'Turn it over. Curl the left and right sides behind and tuck one corner deep into the other to make a ring.',
          flip: true,
          shapes: [P('50,20 70,40 67,43 33,43 30,40'), P('33,43 67,43 61,35 39,35', 1)],
          lines: [
            [40, 22, 40, 43],
            [60, 22, 60, 43],
          ],
          arrows: [A(30, 48, 46, 54, 0.4), A(70, 48, 54, 54, -0.4)],
        },
      ],
      final: {
        text: 'Stand it up and round out the base. Long live the dinner party!',
        shapes: crown,
        prop: 'plateSide',
      },
    },
    {
      id: 'envelope',
      name: 'Gift Envelope',
      emoji: '✉️',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A neat envelope fold — slip in a name card, a blessing or a little gift.',
      tip: 'Lovely for menus, place cards, red envelopes or Eid gifts.',
      steps: [
        {
          title: 'Sides to centre',
          text: 'Lay the napkin face-down as a diamond. Fold the left and right corners into the centre.',
          shapes: [P('50,8 82,40 50,72 18,40')],
          lines: [
            [34, 24, 34, 56],
            [66, 24, 66, 56],
          ],
          arrows: [A(20, 40, 46, 40, 0.4), A(80, 40, 54, 40, -0.4)],
        },
        {
          title: 'Fold up the bottom',
          text: 'Fold the bottom point up so its tip sits just above the centre.',
          shapes: [P('50,8 66,24 66,56 50,72 34,56 34,24'), P('34,24 50,40 34,56', 1), P('66,24 50,40 66,56', 1)],
          lines: [[34, 54, 66, 54]],
          arrows: [A(50, 70, 50, 38, 0.4)],
        },
        {
          title: 'Fold down the flap',
          text: 'Fold the top point down to make the envelope flap.',
          shapes: [P('50,8 66,24 66,54 34,54 34,24'), P('34,24 50,40 34,54', 1), P('66,24 50,40 66,54', 1), P('34,54 66,54 50,36', 1)],
          lines: [[34, 25, 66, 25]],
          arrows: [A(50, 10, 50, 44, 0.4)],
        },
      ],
      final: {
        text: 'Tuck a name card, blessing or small gift inside and seal it with a sticker or sprig.',
        shapes: envelope,
        prop: 'plate',
      },
    },
  ];

  window.NapkinFolds = FOLDS;
})();
