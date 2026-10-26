/*
 * Fold library, part 2: classic table folds, Christmas elves, Easter and more.
 * Same rules as part 1: every step from the first source, simulated where flat,
 * drawn from the source's photos where the napkin stands up or is rolled.
 */
(function () {
  const { P, D, C, E, A, fan, petal, SRC } = window.NapkinKit;

  const triangleUp = { fold: [[-2, 0], [2, 0]], move: [0, -1] }; // diamond start: bottom corner up to the top
  const cornersToTop = [
    { fold: [[0, 0], [-0.707, 0.707]], move: [-1.2, 0.1] },
    { fold: [[0, 0], [0.707, 0.707]], move: [1.2, 0.1] },
  ];
  const cutlery = (x, y, len) => [
    P(`${x},${y} ${x + 3},${y} ${x + 3.4},${y + len} ${x + 0.4},${y + len}`, 0, 'silver'),
    P(`${x + 6},${y} ${x + 9.5},${y} ${x + 9.5},${y + len} ${x + 6},${y + len}`, 0, 'silver'),
    E(x + 14.2, y + 3.5, 2.4, 3.5, 0, 'silver'),
    P(`${x + 13.6},${y + 6} ${x + 14.8},${y + 6} ${x + 14.8},${y + len} ${x + 13.6},${y + len}`, 0, 'silver'),
  ];
  // accordion pleats: 1 in (0.1) wide, from the right end, stopping 4 in from the left
  const pleatOps = [];
  for (let k = 1; k <= 16; k++) {
    const x = 1 - 0.1 * k;
    pleatOps.push({ fold: [[x, -2], [x, 2]], move: [x + 0.05, -0.5], behind: k % 2 === 1 });
  }

  const roseTop = (full) => [
    ...(full ? [petal(50, 40, 25, 34, 7, -1.4), petal(50, 40, 155, 32, 7, 0)] : []),
    C(50, 40, full ? 22 : 18, -1.4),
    C(51, 39, full ? 17 : 14, 0),
    C(49, 41, full ? 12 : 10, -0.7),
    C(50, 40, full ? 6.5 : 5.5, 0),
  ];
  const roseSpiral = 'M50 40m0-2.5a2.5 2.5 0 1 1-2.5 2.5a5 5 0 1 1 5 5a9 9 0 1 1-9-9a13 13 0 1 1 13 13';

  const FOLDS = [
    // ------------------------------------------------------------------ Standing fan
    {
      id: 'fan',
      name: 'Standing Fan',
      emoji: '🪭',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'Accordion pleats that fan out into a half-circle, propped up by a folded triangle.',
      tip: 'Fold them ahead of time and keep them folded (not fanned out) until you set the table.',
      sources: [SRC.toh],
      steps: [
        { title: 'Fold in half', text: 'Fold a large square napkin in half to create a rectangle.', op: { fold: [[-2, 0], [2, 0]], move: [0, 0.5] } },
        {
          title: 'Accordion pleat',
          text: 'Starting at the short end, fold the napkin into 2.5 cm (1 in) accordion pleats, stopping about 10 cm (4 in) from the opposite end. Make sure the fold of the last pleat is at the bottom edge and all the pleats are underneath.',
          op: pleatOps,
          arrows: [A(82, 64, 36, 64, -0.15)],
        },
        { title: 'Fold in half lengthwise', text: 'Fold the napkin in half lengthwise so half of the pleats are now on top.', op: { fold: [[-2, -0.5], [2, -0.5]], move: [-0.8, -0.2] } },
        { title: 'Make the stand', text: 'Fold the upper left corner down and tuck it behind the centre pleat, forming a triangle.', op: { fold: [[-1, -0.9], [-0.6, -0.5]], move: [-0.95, -0.55], behind: true } },
        {
          title: 'Let it fan out',
          text: 'Release and let the pleats fan out. Adjust the folds and the back triangle as needed so the fan stands upright.',
          draw: { shapes: [...fan(50, 62, 28, 228, 312, 9), P('45,59 55,59 54,65 46,65', -1.4)], prop: 'plateSide' },
        },
      ],
      final: {
        text: 'The pleats open into a half-circle fan standing on the plate.',
        draw: { shapes: [...fan(50, 62, 32, 192, 348, 15), P('44,58 56,58 54.5,65 45.5,65', -1.4)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Rolled rose
    {
      id: 'rose',
      name: 'Rolled Rose',
      emoji: '🌹',
      difficulty: 'Tricky',
      minutes: 5,
      blurb: 'A rolled rose with two leaves pulled from the napkin’s own corner.',
      tip: 'Start with a freshly ironed napkin. Taller roses use thinner folds; shorter roses wider folds.',
      sources: [SRC.homedepot],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Fold the napkin in half to form a triangle.', op: triangleUp },
        { title: 'Fold up the bottom', text: 'Fold up the bottom of the triangle about 4 cm (1½ in), or whatever height you prefer. This sets the height of your rose.', op: { fold: [[-2, 0.15], [2, 0.15]], move: [0, 0.05] } },
        {
          title: 'Keep folding up',
          text: 'Continue folding up until you have about twice as much unfolded napkin as the height of your folded band.',
          op: [{ fold: [[-2, 0.3], [2, 0.3]], move: [0, 0.2] }, { fold: [[-2, 0.45], [2, 0.45]], move: [0, 0.35] }],
          arrows: [],
        },
        { title: 'Flip it over', text: 'Flip the napkin over from top to bottom, with the point facing down.', op: { flip: 'v' } },
        { title: 'Roll it up', text: 'Start rolling in from left to right until you reach the other end.', end: true, arrows: [A(16, 34, 84, 34, -0.2)] },
        {
          title: 'Tuck the end',
          text: 'Tuck the loose end underneath your outer edge.',
          draw: { shapes: [...roseTop(false)], details: [roseSpiral], arrows: [A(72, 30, 66, 42, 0.5)], prop: 'plate' },
        },
        {
          title: 'Find the leaves',
          text: 'The underside of the rose should have a corner with two layers of napkin. Pull them gently in opposite directions.',
          draw: { shapes: [...roseTop(false), petal(50, 40, 25, 26, 5, -1.4), petal(50, 40, 155, 24, 5, 0)], details: [roseSpiral], arrows: [A(70, 30, 82, 22, 0.3), A(30, 50, 18, 58, 0.3)], prop: 'plate' },
        },
        {
          title: 'Pull up the first leaf',
          text: 'Pull the outer layer up around the rose.',
          draw: { shapes: [petal(50, 40, 25, 34, 7, -1.4), ...roseTop(false)], details: [roseSpiral], arrows: [A(78, 28, 70, 18, -0.5)], prop: 'plate' },
        },
        {
          title: 'Pull up the second leaf',
          text: 'For a leaf on each side, twist the other leaf and pull it around the rose with the same motion. For two leaves on the same side, don’t twist; just pull it around the rose.',
          draw: { shapes: [...roseTop(true)], details: [roseSpiral], arrows: [A(22, 52, 30, 62, 0.5)], prop: 'plate' },
        },
      ],
      final: { text: 'Arrange the rose on a dinner plate.', draw: { shapes: roseTop(true), details: [roseSpiral], prop: 'plate' } },
    },

    // ------------------------------------------------------------------ Heart
    {
      id: 'heart',
      name: 'Heart',
      emoji: '💖',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A skinny strip folded up like a paper football, with the corners tucked into a heart.',
      tip: 'Square napkins work best. Red or pink for Valentine’s Day.',
      sources: [SRC.homedepot],
      steps: [
        {
          title: 'Make a skinny strip',
          text: 'Fold the napkin in half, then in half again in the same direction, so you have a very skinny rectangle.',
          op: [{ fold: [[-2, 0], [2, 0]], move: [0, -0.5] }, { fold: [[-2, 0.5], [2, 0.5]], move: [0, 0.8] }],
          arrows: [A(50, 66, 50, 18, 0.35)],
        },
        { title: 'Fold up the left half', text: 'Fold the left half up, similar to how you would start a paper football or fold a note in grade school.', op: { fold: [[0, 0], [-0.5, 0.5]], move: [-0.8, 0.25] } },
        { title: 'Fold up the right half', text: 'Repeat with the right half.', op: { fold: [[0, 0], [0.5, 0.5]], move: [0.8, 0.25] } },
        {
          title: 'Tuck the inner corners',
          text: 'Fold the inner corners at the top of the napkin down and underneath.',
          op: [
            { fold: [[-0.15, 1], [0, 0.85]], move: [-0.02, 0.99], behind: true, pick: [-1, -1, -0.01, 2] },
            { fold: [[0.15, 1], [0, 0.85]], move: [0.02, 0.99], behind: true, pick: [0.01, -1, 1, 2] },
          ],
          arrows: [],
        },
        {
          title: 'Round the top',
          text: 'Repeat with the pointy corners at the top left and right so it looks more like a rounded heart.',
          op: [
            { fold: [[-0.5, 0.82], [-0.32, 1]], move: [-0.49, 0.99], behind: true },
            { fold: [[0.5, 0.82], [0.32, 1]], move: [0.49, 0.99], behind: true },
          ],
          arrows: [],
        },
      ],
      final: { text: 'Turn it the right way up on the plate: a heart.', prop: 'plate' },
    },

    // ------------------------------------------------------------------ Candle
    {
      id: 'candle',
      name: 'Candle',
      emoji: '🕯️',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A tall rolled candle with one point turned down and the other shaped into a flame.',
      tip: 'Roll tightly and push any uneven ends back into the tube so it stands firmly.',
      sources: [SRC.kor, SRC.calCandle],
      steps: [
        { title: 'Point it up', text: 'Start with a square napkin, and turn it slightly so that one point is facing up.', op: { rotate: 45 } },
        { title: 'Make a triangle', text: 'Take the bottom tip and fold it up toward the top until the two corners match. This should form a rough triangle.', op: { fold: [[-2, 0], [2, 0]], move: [0, -1] } },
        { title: 'Fold up the base', text: 'Fold the base up just a couple of inches (about 5 cm) and press it down flat.', op: { fold: [[-2, 0.2], [2, 0.2]], move: [0, 0.1] } },
        { title: 'Flip & turn', text: 'Flip the whole thing over, so the triangle is pointing to the left.', op: [{ flip: 'h' }, { rotate: 90 }] },
        { title: 'Fold up the bottom point', text: 'Take the bottom point and fold it up so the tip is just past the centre.', op: { fold: [[-2, -0.55], [2, -0.55]], move: [-0.3, -1.2] } },
        { title: 'Roll it up', text: 'Start rolling the whole thing into a tube, from the bottom toward the top. Push any uneven ends back into the tube, then tuck the loose end neatly into the cuff so it stands up firmly.', end: true, arrows: [A(36, 66, 36, 18, 0.3)] },
        {
          title: 'Turn one tip down',
          text: 'Turn one layer of the tip down.',
          draw: {
            shapes: [P('43,17 57,17 57,64 43,64', 0), P('43,56 57,56 57,64 43,64', -1.4), P('43,17 57,17 50,6', -1.4), P('50,6 57,17 52,19', 0)],
            details: [[43, 28, 57, 22], [43, 40, 57, 34], [43, 52, 57, 46]],
            arrows: [A(58, 8, 60, 22, 0.5)],
            prop: 'plateSide',
          },
        },
      ],
      final: {
        text: 'Shape the other layer to look like a flame, and your candle looks like it’s burning.',
        draw: {
          shapes: [P('43,17 57,17 57,64 43,64', 0), P('43,56 57,56 57,64 43,64', -1.4), D('M50 4Q56 11 52 18L46 18Q44 11 50 4Z', 0), P('50,17 57,17 57,26', -1.4)],
          details: [[43, 28, 57, 22], [43, 40, 57, 34], [43, 52, 57, 46]],
          prop: 'plateSide',
        },
      },
    },

    // ------------------------------------------------------------------ Bunny
    {
      id: 'bunny',
      name: 'Bunny',
      emoji: '🐰',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'A standing bunny with two tall ears, folded from a long strip of napkin.',
      tip: 'Iron your napkins before folding. A lightweight napkin tucks closed most easily.',
      sources: [SRC.wayfair, SRC.lolBunny],
      steps: [
        { title: 'Fold in half', text: 'Fold your square napkin in half.', op: { fold: [[-2, 0], [2, 0]], move: [0, -0.5] } },
        { title: 'Fold in half again', text: 'Once more, fold the napkin in half. It should look like a long, narrow rectangle.', op: { fold: [[-2, 0.5], [2, 0.5]], move: [0, 0.8] } },
        {
          title: 'Make a point',
          text: 'Fold down the top left-hand corner and top right-hand corner so they meet in the centre of the napkin, forming a point at one end.',
          op: [{ fold: [[0, 0.5], [0.5, 0]], move: [0.8, 0.25] }, { fold: [[0, 0.5], [-0.5, 0]], move: [-0.8, 0.25] }],
          arrows: [],
        },
        {
          title: 'Fold up the bottom corners',
          text: 'Keep the napkin in the same position and fold up the bottom left-hand and bottom right-hand corners.',
          op: [{ fold: [[0, -0.5], [-0.5, 0]], move: [-0.45, -0.45] }, { fold: [[0, -0.5], [0.5, 0]], move: [0.45, -0.45] }],
          arrows: [],
        },
        {
          title: 'Fold in the sides',
          text: 'Fold the left- and right-hand corners of the diamond-shaped napkin inward so they meet in the centre. The two points facing down will become the bunny ears.',
          op: [{ fold: [[0, -0.5], [-0.25, 0.1035]], move: [-0.45, 0] }, { fold: [[0, -0.5], [0.25, 0.1035]], move: [0.45, 0] }],
          arrows: [],
        },
        { title: 'Fold down the top', text: 'Take the top point of the napkin and fold it down so that it’s just above the centre of the napkin.', op: { fold: [[-2, 0.275], [2, 0.275]], move: [0, 0.45] } },
        { title: 'Turn it over', text: 'Now hold it in place and carefully turn the napkin over one more time.', op: { flip: 'h' } },
        {
          title: 'Roll and tuck',
          text: 'Take the left-hand corner and slightly roll it to the centre of the napkin. Next, take the right-hand corner over and tuck it into the fold on the left corner to secure the napkin.',
          end: true,
          arrows: [A(26, 36, 44, 44, 0.4), A(74, 36, 56, 44, -0.4)],
        },
      ],
      final: {
        text: 'Turn the bunny upright and shape it so it has a secure base. Take some time to fluff the ears so they look fuller.',
        draw: {
          shapes: [
            D('M44 47Q29 25 37 7Q50 21 50 45Z', -1.4),
            D('M56 47Q71 25 63 7Q50 21 50 45Z', 0),
            D('M44.5 43Q35 27 38.5 13Q46 25 48.5 43Z', 0),
            D('M55.5 43Q65 27 61.5 13Q54 25 51.5 43Z', -1.4),
            D('M33 66Q32 46 50 42Q68 46 67 66Z', 0),
            D('M33 66Q33 58 50 56Q67 58 67 66Z', -1.4),
          ],
          prop: 'plateSide',
        },
      },
    },

    // ------------------------------------------------------------------ Envelope
    {
      id: 'envelope',
      name: 'Envelope',
      emoji: '✉️',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A flat envelope with a real pocket and a pointed flap.',
      tip: 'Cotton holds crisp folds better than linen, which stretches on the bias. Iron the folds as you go for a paper-like finish.',
      sources: [SRC.instrEnvelope],
      steps: [
        { title: 'Open and flat', text: 'Lay a square napkin down on a clean work surface so that it’s open all the way. Iron if needed.' },
        { title: 'Fold in diagonal half', text: 'Grab the right-hand corner nearest you and fold it over to meet the opposite upper-left corner. Straighten the edges so they all meet up.', op: { fold: [[-1, -1], [1, 1]], move: [0.5, -0.5] } },
        { title: 'Turn it', text: 'Turn the triangle so that the longest side is parallel to you and the table’s edge.', op: { rotate: -45 } },
        { title: 'Fold in', text: 'Fold the left corner in so that it sits just past the midway point of the long side of the triangle.', op: { fold: [[-0.657, -2], [-0.657, 2]], move: [-1.2, 0.05] } },
        { title: 'Fold in again', text: 'Now repeat for the right-hand corner.', op: { fold: [[0.657, -2], [0.657, 2]], move: [1.2, 0.05] } },
        { title: 'Fold over', text: 'Take the lower left corner and bring it in to the bottom midpoint of the now “house”-shaped napkin. Press the new left side fold down.', op: { fold: [[-0.3285, -2], [-0.3285, 2]], move: [-0.6, 0.05] } },
        { title: 'Fold over again', text: 'Repeat on the right side.', op: { fold: [[0.3285, -2], [0.3285, 2]], move: [0.6, 0.05] } },
        { title: 'Fold up', text: 'Take both bottom corners and bring them up to rest just below the top corners. Press down the new folds.', op: { fold: [[-2, 0.36], [2, 0.36]], move: [0, 0.1] } },
        { title: 'Close the envelope', text: 'Take the top point of the envelope flap and bring it down to close the envelope.', op: { fold: [[-2, 0.757], [2, 0.757]], move: [0, 1.2] } },
      ],
      final: { text: 'Your envelope is complete; the pocket can hold a menu or a handwritten note.', prop: 'plate' },
    },

    // ------------------------------------------------------------------ Crown
    {
      id: 'crown',
      name: 'Crown',
      emoji: '👑',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A standing crown with a tall centre point and two petals peeled down at the sides.',
      tip: 'A starched cloth napkin stands tallest, but paper napkins work too.',
      sources: [SRC.kor, SRC.calCrown],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Lay out a square napkin, and begin by folding it up diagonally to form a triangle.', op: triangleUp },
        { title: 'Corners to the top', text: 'Fold up each of the bottom corners to meet the point at the top. If your napkin isn’t perfectly square, just do the best you can.', op: cornersToTop, arrows: [] },
        { title: 'Fold up the point', text: 'Now fold the bottom point three-quarters of the way up.', op: { fold: [[-2, 0.53], [2, 0.53]], move: [0, 0.1] } },
        { title: 'Fold it back', text: 'Then fold it back on itself so the point is back at the bottom.', op: { fold: [[-2, 0.795], [2, 0.795]], move: [0, 1.0], top: 4 } },
        { title: 'Flip it over', text: 'Go ahead and flip it over.', op: { flip: 'h' } },
        { title: 'Fold in one side', text: 'Take one of the back edges, and fold it a third of the way in.', op: { fold: [[-0.236, -2], [-0.236, 2]], move: [-0.6, 0.75] } },
        {
          title: 'Tuck the other side',
          text: 'The other side folds over next and is secured by tucking the corner into the flap at the bottom.',
          end: true,
          arrows: [A(72, 50, 44, 58, -0.4)],
        },
        {
          title: 'Flip & peel',
          text: 'Flip it over one more time, and peel the two sides down like you’re peeling a banana.',
          draw: {
            shapes: [P('36,62 36,36 64,36 64,62', 0), P('42,38 50,10 58,38', -1.4), P('36,38 42,38 44,16', 0), P('64,38 58,38 56,16', 0), P('36,54 64,54 64,62 36,62', -1.4)],
            arrows: [A(40, 18, 26, 30, 0.4), A(60, 18, 74, 30, -0.4)],
            flip: true,
          },
        },
      ],
      final: {
        text: 'Open the base, stand it upright, and your cloth crown is finished.',
        draw: {
          shapes: [
            P('34,64 34,40 66,40 66,64', 0),
            D('M38 42Q26 34 20 44Q30 42 36 50Z', 0),
            D('M62 42Q74 34 80 44Q70 42 64 50Z', 0),
            P('41,42 50,10 59,42', -1.4),
            D('M38 64Q38 46 50 44Q62 46 62 64Z', -1.4),
          ],
          prop: 'plateSide',
        },
      },
    },

    // ------------------------------------------------------------------ Pyramid
    {
      id: 'pyramid',
      name: 'Pyramid',
      emoji: '🔺',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'A simple standing pyramid that folds in on itself from the centre.',
      tip: 'Works with cloth or paper napkins; quick to fold for a crowd.',
      sources: [SRC.kor, SRC.calPyramid],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Lay out a square napkin, and begin by folding it up diagonally to form a triangle.', op: triangleUp },
        { title: 'First corner up', text: 'Fold up one of the bottom corners to meet the point at the top.', op: cornersToTop[0] },
        { title: 'Second corner up', text: 'Do the same thing with the point on the other side.', op: cornersToTop[1] },
        { title: 'Flip it over', text: 'Flip the whole thing over.', op: { flip: 'h' } },
        { title: 'Fold in half', text: 'Now just fold it in half from the top to the bottom.', op: { fold: [[-2, 0.707], [2, 0.707]], move: [0, 1.2] } },
        {
          title: 'Lift from the centre',
          text: 'Lift it from the centre, so that it folds in on itself.',
          end: true,
          arrows: [A(50, 60, 50, 30, 0.2)],
        },
      ],
      final: {
        text: 'When you stand it upright, your pyramid is finished.',
        draw: { shapes: [P('28,62 50,16 50,62', 0), P('50,16 72,62 50,62', -1.4), P('50,16 50,62 58,58', -0.7)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Bishop's mitre
    {
      id: 'mitre',
      name: "Bishop's Mitre",
      emoji: '⛪',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'The two-peaked banquet classic, shaped like a bishop’s mitre. A traditional St Nicholas fold.',
      tip: 'A starched napkin keeps the peaks sharp. The St Nicholas Center suggests hiding a clementine underneath to help it keep its shape.',
      sources: [SRC.kor, SRC.calMitre, SRC.stNicholas],
      steps: [
        { title: 'Fold in half', text: 'Start by folding a square napkin in half from top to bottom, and crease it in the middle.', op: { fold: [[-2, 0], [2, 0]], move: [0, 0.5] } },
        { title: 'Bottom-left corner up', text: 'Fold the bottom left corner up to the middle of the top edge.', op: { fold: [[-1, 0], [0, -1]], move: [-0.9, -0.9] } },
        { title: 'Top-right corner down', text: 'Fold the top right corner to the middle of the bottom edge.', op: { fold: [[0, 0], [1, -1]], move: [0.9, -0.1] } },
        { title: 'Flip it over', text: 'Go ahead and flip it over.', op: { flip: 'h' } },
        { title: 'Fold up & pull out the point', text: 'Fold one of the long edges up to meet the other, then pull the point out from under the top fold.', op: { fold: [[-2, -0.5], [2, -0.5]], move: [0, -0.9] } },
        {
          title: 'Tuck the left side',
          text: 'Crease the left-side triangle in half, and tuck it into the fold of the other.',
          draw: { shapes: [P('42,60 42,36 56,16 70,36 70,60', -1.4), P('30,60 30,36 44,14 58,36 58,60', 0)], lines: [[36, 36, 36, 60]], arrows: [A(24, 50, 34, 54, 0.4)] },
        },
        { title: 'Flip it over again', text: 'Now flip it over again.', draw: { shapes: [P('30,60 30,36 44,16 58,36 58,60', -1.4), P('42,60 42,36 56,14 70,36 70,60', 0)], flip: true } },
        {
          title: 'Tuck the other side',
          text: 'Repeat the same thing on the other side, and when that’s tucked into place, gently pull the napkin open at the bottom.',
          draw: { shapes: [P('30,60 30,36 44,16 58,36 58,60', -1.4), P('42,60 42,36 56,14 70,36 70,60', 0)], lines: [[64, 36, 64, 60]], arrows: [A(76, 50, 66, 54, -0.4)] },
        },
      ],
      final: {
        text: 'Set it upright on the plate.',
        draw: { shapes: [P('38,62 38,34 52,12 66,34 66,62', -1.4), P('32,64 32,36 47,14 62,36 62,64', 0), P('32,56 62,56 62,64 32,64', -1.4)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Elf shoe
    {
      id: 'elfshoe',
      name: 'Elf Shoe',
      emoji: '🧝',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'A pointed elf’s shoe with a turned-down cuff: a kid-friendly Christmas fold.',
      tip: 'A thinner napkin makes the folding easier, or keep a hot iron close by.',
      sources: [SRC.kor, SRC.lolElfShoe],
      steps: [
        { title: 'Fold in half', text: 'Fold a square napkin in half, from the bottom to the top.', op: { fold: [[-2, 0], [2, 0]], move: [0, -0.5] } },
        { title: 'Fold in half again', text: 'Then fold it again from the top to the bottom.', op: { fold: [[-2, 0.5], [2, 0.5]], move: [0, 0.8] } },
        {
          title: 'Fold in the sides',
          text: 'Now find the centre, and fold the two sides in, the same way you’d fold a paper airplane.',
          op: [{ fold: [[0, 0.5], [0.5, 0]], move: [0.8, 0.25] }, { fold: [[0, 0.5], [-0.5, 0]], move: [-0.8, 0.25] }],
          arrows: [],
        },
        {
          title: 'Fold in again',
          text: 'Continue the idea by folding the sides in again, forming a sharp point at the tip.',
          op: [{ fold: [[0, 0.5], [-0.207, 0]], move: [-0.45, -0.2] }, { fold: [[0, 0.5], [0.207, 0]], move: [0.45, -0.2] }],
          arrows: [],
        },
        { title: 'Fold the halves together', text: 'The two halves now fold over on each other. When you flatten them out, check which side is open, and make sure it’s facing the bottom.', op: { fold: [[0, -2], [0, 2]], move: [-0.3, -0.2] } },
        {
          title: 'Lift the top layer',
          text: 'Now focus on the loose parts at the back, and fold the top layer up and out of the way.',
          draw: { shapes: [P('22,46 72,30 78,34 70,52 30,56', 0), P('62,30 72,30 78,18 70,16', -1.4), P('64,40 72,32 80,46 72,54', -1.4)], arrows: [A(76, 50, 76, 22, -0.4)] },
        },
        {
          title: 'Wrap and tuck',
          text: 'The bottom layer folds in half, then wraps over the top layer, tucking neatly into the little flap in the side of the shoe.',
          draw: { shapes: [P('22,46 72,30 78,34 70,52 30,56', 0), P('62,30 72,30 78,14 70,12', -1.4), P('64,36 76,32 76,52 64,54', 0)], arrows: [A(80, 48, 66, 44, 0.4)] },
        },
        {
          title: 'Make the cuff',
          text: 'All that’s left is to turn down the loose material sticking up at the top, to form a little cuff.',
          draw: { shapes: [P('22,46 66,32 76,34 74,54 30,56', 0), P('62,32 76,32 78,14 64,14', -1.4)], arrows: [A(70, 12, 72, 30, 0.5)] },
        },
      ],
      final: {
        text: 'Your little elf shoe is finished and ready to show off.',
        draw: {
          shapes: [
            D('M18 54Q16 46 26 46L60 38L60 58L26 60Q18 60 18 54Z', 0),
            D('M14 48Q16 42 24 46L22 52Z', 0),
            P('58,26 76,24 78,58 60,58', 0),
            P('56,24 78,22 80,32 58,34', -1.4),
          ],
          prop: 'plate',
        },
      },
    },

    // ------------------------------------------------------------------ Elf hat
    {
      id: 'elfhat',
      name: 'Elf Hat',
      emoji: '🎅',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A tall rolled cone with its pointed ends turned up into a brim, standing on the plate.',
      tip: 'A firmer, thicker napkin holds the hat’s shape best. Press out wrinkles first.',
      sources: [SRC.lolElfHat],
      steps: [
        { title: 'Fold in half', text: 'Fold the napkin in half.', op: { fold: [[-2, 0], [2, 0]], move: [0, -0.5] } },
        { title: 'Hold the top centre', text: 'Hold the top centre of the folded napkin with one finger.', end: true, add: [C(50, 25, 2.4, 0, 'white')], arrows: [] },
        {
          title: 'Start rolling',
          text: 'Grab the left corner and start rolling the napkin around that point.',
          draw: { shapes: [P('14,25 86,25 86,55 14,55', -1.4), C(50, 25, 2.4, 0, 'white')], arrows: [A(16, 52, 46, 30, -0.4)] },
        },
        {
          title: 'Roll it all up',
          text: 'Keep rolling until it’s all rolled into a cone.',
          draw: { shapes: [P('38,68 50,10 62,68', 0), P('38,68 62,68 56,58 44,58', -1.4)], details: [[44, 42, 58, 34], [41, 56, 60, 46]] },
        },
        {
          title: 'Make the brim',
          text: 'Fold up the pointed ends at the bottom to create the brim of the hat.',
          draw: { shapes: [P('38,64 50,10 62,64', 0), P('38,64 30,72 40,70', -1.4), P('62,64 70,72 60,70', -1.4)], arrows: [A(32, 72, 36, 58, 0.5), A(68, 72, 64, 58, -0.5)] },
        },
      ],
      final: {
        text: 'Set it upright on the plate. The tip can lean over a little, just like an elf’s hat.',
        draw: { shapes: [D('M38 62L46 24Q49 12 58 10Q53 18 54 28L62 62Z', 0), P('36,62 64,62 66,54 34,54', -1.4)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Easter basket
    {
      id: 'basket',
      name: 'Basket',
      emoji: '🧺',
      difficulty: 'Medium',
      minutes: 3,
      blurb: 'A soft round basket made by wrapping and rolling one napkin.',
      tip: 'A large, soft napkin rolls into the roundest basket.',
      sources: [SRC.southernLadyBasket],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Fold a square napkin diagonally into a triangle.', op: triangleUp },
        { title: 'Fold up the bottom', text: 'Fold the bottom edge up about halfway to the top point.', op: { fold: [[-2, 0.354], [2, 0.354]], move: [0, 0.1] } },
        {
          title: 'Wrap the corners',
          text: 'Fold one corner across the centre, and repeat with the opposite corner, letting the excess wrap all the way around.',
          end: true,
          arrows: [A(16, 56, 70, 50, 0.3), A(84, 56, 30, 50, -0.3)],
        },
        {
          title: 'Roll the rim',
          text: 'Carefully roll the pointed portion down to create an open basket, tucking any loose fabric beneath the rim.',
          draw: { shapes: [D('M30 44Q32 64 50 66Q68 64 70 44Z', 0), P('44,46 50,18 56,46', -1.4), E(50, 44, 20, 6, -1.4)], arrows: [A(56, 22, 66, 40, -0.5)], prop: 'plateSide' },
        },
      ],
      final: {
        text: 'Your soft napkin basket is ready.',
        draw: { shapes: [E(50, 40, 22, 8, -1.4), D('M28 40Q30 62 50 64Q70 62 72 40Z', 0), D('M28 40Q50 50 72 40Q50 44 28 40Z', -0.7)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Arum lily
    {
      id: 'arum',
      name: 'Arum Lily',
      emoji: '🌺',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'A standing lily with layered petals around a pointed centre.',
      tip: 'Crisp white or cream napkins look most like real arum lilies.',
      sources: [SRC.calArum, SRC.falvey],
      start: 'diamond',
      steps: [
        { title: 'Fold in half', text: 'Fold the napkin, bringing the bottom up to the top.', op: triangleUp },
        { title: 'Corners to the top', text: 'Fold the corners up to the top.', op: cornersToTop, arrows: [] },
        { title: 'Fold up the point', text: 'Fold the bottom point up to 2.5 cm (1 in) below the top.', op: { fold: [[-2, 0.657], [2, 0.657]], move: [0, 0.1] } },
        { title: 'Fold it back', text: 'Fold the point back onto itself.', op: { fold: [[-2, 0.9855], [2, 0.9855]], move: [0, 1.25], top: 4 } },
        {
          title: 'Tuck the top points',
          text: 'Fold down each of the points at the top and tuck them under the edge of the folded-up bottom. Fold down one layer of the top point and tuck it under the base fold.',
          end: true,
          arrows: [A(40, 20, 42, 44, 0.3), A(60, 20, 58, 44, -0.3)],
        },
        {
          title: 'Turn over and tuck the sides',
          text: 'Turn the napkin over and tuck the left and right sides into each other.',
          draw: { shapes: [P('36,64 36,30 64,30 64,64', 0), P('42,30 50,14 58,30', -1.4)], arrows: [A(30, 48, 44, 56, 0.4), A(70, 48, 56, 56, -0.4)], flip: true },
        },
      ],
      final: {
        text: 'Open the base and stand it up.',
        draw: { shapes: [P('36,64 36,38 64,38 64,64', 0), D('M36 40Q32 22 50 10Q68 22 64 40Z', -1.4), D('M40 40Q42 26 50 20Q58 26 60 40Z', 0), D('M38 64Q38 50 50 46Q62 50 62 64Z', -1.4)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Rosebud
    {
      id: 'rosebud',
      name: 'Rosebud',
      emoji: '🌷',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A neat standing bud with its loose points curling at the top.',
      tip: 'Smaller napkins (40 cm / 16 in) make the neatest buds.',
      sources: [SRC.calRosebud, SRC.falvey],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Fold the napkin in half diagonally.', op: triangleUp },
        { title: 'Corners to the top', text: 'Fold the corners to meet at the top point.', op: cornersToTop, arrows: [] },
        { title: 'Flip & fold up', text: 'Turn the napkin over and fold the bottom two-thirds of the way up.', op: [{ flip: 'h' }, { fold: [[-2, 0.471], [2, 0.471]], move: [0, 0.1] }] },
        {
          title: 'Tuck into a ring',
          text: 'Turn the napkin around and bring the corners together, tucking one into the other.',
          end: true,
          arrows: [A(26, 48, 44, 56, 0.4), A(74, 48, 56, 56, -0.4)],
        },
      ],
      final: {
        text: 'Turn the napkin around and stand it on its base.',
        draw: { shapes: [P('38,64 38,34 62,34 62,64', 0), D('M38 36Q40 16 50 10Q48 24 54 34Z', -1.4), D('M62 36Q60 18 52 12Q54 24 48 34Z', 0), D('M40 64Q40 48 50 44Q60 48 60 64Z', -1.4)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Fanciful butterfly
    {
      id: 'butterfly',
      name: 'Fanciful Butterfly',
      emoji: '🦋',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A standing fold whose two petals turn down like a butterfly’s wings.',
      tip: 'Medium-weight napkins in bright colours make the happiest butterflies.',
      sources: [SRC.falvey],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Fold the open napkin to form a triangle.', op: triangleUp },
        { title: 'Make a diamond', text: 'Take the left corner and fold it up to the centre. Take the right corner up to the centre, creating a diamond.', op: cornersToTop, arrows: [] },
        { title: 'Flip & fold up', text: 'Turn it over, keeping the loose points at the top, then fold it upward, leaving a margin at the top, to make a triangle.', op: [{ flip: 'h' }, { fold: [[-2, 0.6], [2, 0.6]], move: [0, 0.1] }] },
        { title: 'Tuck into a ring', text: 'Tuck the left corner into the right.', end: true, arrows: [A(26, 48, 44, 56, 0.4), A(74, 48, 56, 56, -0.4)] },
        {
          title: 'Stand and turn the petals down',
          text: 'Stand it up. Turn it around. Then turn the petals down.',
          draw: { shapes: [P('38,64 38,36 62,36 62,64', 0), P('40,36 46,12 52,36', -1.4), P('48,36 54,12 60,36', -1.4)], arrows: [A(44, 14, 28, 34, 0.4), A(56, 14, 72, 34, -0.4)], prop: 'plateSide' },
        },
      ],
      final: {
        text: 'It’s a fanciful butterfly.',
        draw: { shapes: [P('38,64 38,36 62,36 62,64', 0), D('M42 38Q24 20 16 34Q22 46 40 46Z', -1.4), D('M58 38Q76 20 84 34Q78 46 60 46Z', -1.4), P('44,38 50,26 56,38', 0)], prop: 'plateSide' },
      },
    },

    // ------------------------------------------------------------------ Bird of paradise
    {
      id: 'paradise',
      name: 'Bird of Paradise',
      emoji: '🦜',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'Four pointed layers peeled back into a crest, like the tropical flower.',
      tip: 'Cloth looks best, but paper works too; just be gentle when you pull the layers apart.',
      sources: [SRC.kor, SRC.calParadise],
      steps: [
        {
          title: 'Fold into quarters',
          text: 'Fold a square napkin into quarters, and turn it so the open ends are pointing away from you.',
          op: [{ fold: [[-2, 0], [2, 0]], move: [0, 0.5] }, { fold: [[0, -2], [0, 2]], move: [0.5, -0.5] }, { rotate: -135 }],
          arrows: [A(50, 18, 50, 60, 0.35)],
        },
        { title: 'Make a triangle', text: 'Fold the bottom end up to the top so it forms a triangle.', op: { fold: [[-2, 0.707], [2, 0.707]], move: [0, 0.1] } },
        { title: 'Flip it over', text: 'Flip the whole thing over.', op: { flip: 'h' } },
        {
          title: 'Fold the sides in',
          text: 'Fold the two sides in so they meet in the middle, like folding a paper airplane.',
          op: [{ fold: [[0, 1.414], [-0.354, 0.561]], move: [-0.5, 0.8] }, { fold: [[0, 1.414], [0.354, 0.561]], move: [0.5, 0.8] }],
          arrows: [],
        },
        { title: 'Flip it over again', text: 'When the two sides are flattened out, flip it over again.', op: { flip: 'h' } },
        { title: 'Fold in the tabs', text: 'Fold the two triangular tabs at the back in toward the centre.', op: { fold: [[-2, 0.707], [2, 0.707]], move: [0, 0.5], behind: true } },
        { title: 'Fold in half', text: 'Fold the triangle in half lengthwise, and cradle it in your hand so the open ends face into your palm.', op: { fold: [[0, -2], [0, 2]], move: [-0.1, 1.0], behind: true }, curve: 0.5 },
      ],
      final: {
        text: 'Peel back each of the 4 layers inside, and when they’re spaced the way you want them, it’s ready to dazzle.',
        draw: { shapes: [P('34,48 30,20 43,46', -1.4), P('42,47 43,14 51,46', 0), P('50,46 56,13 59,46', -1.4), P('58,47 68,18 67,48', 0), P('22,60 78,60 72,46 30,46', 0)], prop: 'plate' },
      },
    },

    // ------------------------------------------------------------------ Party hat (clown's hat)
    {
      id: 'partyhat',
      name: "Party Hat (Clown's Hat)",
      emoji: '🥳',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A tall cone with its hem turned up, standing on its base like a party hat.',
      tip: 'Roll loosely at first, matching the corners, then tighten.',
      sources: [SRC.calClown, SRC.falvey],
      steps: [
        { title: 'Fold in half', text: 'Fold the napkin in half, bringing the bottom to the top.', op: { fold: [[-2, 0], [2, 0]], move: [0, -0.5] } },
        {
          title: 'Roll a cone',
          text: 'Holding the centre of the bottom with a finger, take the lower right corner and loosely roll it around the centre, matching corners, until a cone is formed.',
          end: true,
          add: [C(50, 55, 2.4, 0, 'white')],
          arrows: [A(84, 52, 54, 28, 0.35)],
        },
        {
          title: 'Turn up the hem',
          text: 'Turn the napkin upside down, then turn the hem up all around.',
          draw: { shapes: [P('38,62 50,12 62,62', 0)], lines: [[39, 56, 61, 56]], arrows: [A(36, 64, 36, 52, -0.6), A(64, 64, 64, 52, 0.6)], prop: 'plateSide' },
        },
      ],
      final: { text: 'Turn it and stand it on its base.', draw: { shapes: [P('38,62 50,12 62,62', 0), P('37,62 63,62 61.4,53 38.6,53', -1.4)], prop: 'plateSide' } },
    },

    // ------------------------------------------------------------------ Swan
    {
      id: 'swan',
      name: 'Swan',
      emoji: '🦢',
      difficulty: 'Tricky',
      minutes: 7,
      blurb: 'A swan with a folded neck and head, and loose corners pulled up as tail feathers.',
      tip: 'Start with a freshly starched napkin or the neck will flop. A thick paper napkin also works.',
      sources: [SRC.homedepot],
      steps: [
        { title: 'Fold into a square', text: 'Fold the napkin in half and then in half again, to make a square.', op: [{ fold: [[-2, 0], [2, 0]], move: [0, 0.5] }, { fold: [[0, -2], [0, 2]], move: [0.5, -0.5] }], arrows: [A(50, 18, 50, 60, 0.35)] },
        { title: 'Make a diamond', text: 'Arrange the napkin like a diamond with the folded edge on the left-hand side, so the corner with no folds is at the top.', op: { rotate: -135 } },
        {
          title: 'Make a kite',
          text: 'Fold the left and right sides in so the edges line up down the middle from the top corner and the napkin looks like a kite.',
          op: [{ fold: [[0, 1.414], [-0.383, 0.49]], move: [-0.6, 0.7] }, { fold: [[0, 1.414], [0.383, 0.49]], move: [0.6, 0.7] }],
          arrows: [],
        },
        { title: 'Flip it over', text: 'Flip the napkin over so the folds are on the bottom side.', op: { flip: 'h' } },
        {
          title: 'Narrow the kite',
          text: 'Fold the left and right edges into the middle again. You should now have a narrow kite.',
          op: [{ fold: [[0, 1.414], [-0.195, 0.433]], move: [-0.3, 0.45] }, { fold: [[0, 1.414], [0.195, 0.433]], move: [0.3, 0.45] }],
          arrows: [],
        },
        { title: 'Fold up the bottom point', text: 'Fold the bottom point of the kite up so that it meets the other point at the top.', op: { fold: [[-2, 0.707], [2, 0.707]], move: [0, 0.1] } },
        { title: 'Make the head', text: 'Fold the narrow part of the point down about 2.5 cm (1 in) to form the swan’s head.', op: { fold: [[-2, 1.314], [2, 1.314]], move: [0, 1.39] }, curve: 0.6 },
        { title: 'Fold in half', text: 'Fold the entire napkin in half vertically, so the back edges of the neck meet and the head pops forward. Gently pull the neck forward a little more.', op: { fold: [[0, -2], [0, 2]], move: [-0.05, 0.9], behind: true }, curve: 0.5 },
      ],
      final: {
        text: 'Pull up the loose corners near the tail to look like feathers, then arrange the swan on a dinner plate.',
        draw: {
          shapes: [
            D('M62 48Q78 34 74 22Q70 34 58 42Z', -1.4),
            D('M66 50Q82 42 82 32Q74 42 62 46Z', 0),
            D('M26 56Q24 42 40 40L64 40Q76 44 74 56Z', -1.4),
            D('M34 50L33 24Q33 14 25 14L18 18L27 21L28 50Z', 0),
            D('M24 58Q50 48 76 58Z', -0.7),
          ],
          prop: 'plate',
        },
      },
    },

    // ------------------------------------------------------------------ Cutlery wrap
    {
      id: 'wrap',
      name: 'Cutlery Roll',
      emoji: '🍽️',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'Knife, fork and spoon rolled up neatly inside the napkin, ready for a buffet or picnic.',
      tip: 'Roll tightly so the bundle holds by itself.',
      sources: [SRC.homedepot],
      start: 'diamond',
      steps: [
        { title: 'Make a triangle', text: 'Fold the napkin in half diagonally, so you have a large triangle.', op: triangleUp },
        { title: 'Add the cutlery', text: 'Place the cutlery (fork and knife, or fork, knife and spoon) on top of the napkin, along the centre of the bottom of the triangle (its longest side).', add: cutlery(43, 31, 26) },
        {
          title: 'Fold in the points',
          text: 'Fold both the right and left triangle points over the cutlery. It should now look sort of like an envelope flap.',
          op: [{ fold: [[-0.4, -2], [-0.4, 2]], move: [-1.2, 0.05] }, { fold: [[0.4, -2], [0.4, 2]], move: [1.2, 0.05] }],
          arrows: [],
          add: cutlery(43, 31, 26),
        },
        { title: 'Roll it up', text: 'Roll tightly upwards until you have a cutlery roll.', end: true, arrows: [A(50, 66, 50, 30, 0.3)] },
      ],
      final: {
        text: 'Lay the roll beside or across the plate.',
        draw: { shapes: [...cutlery(42, 6, 14), P('40,16 60,16 60,70 40,70', 0), P('40,16 60,16 60,22 40,22', -1.4)], details: [[40, 34, 60, 30], [40, 50, 60, 46]] },
      },
    },

    // ------------------------------------------------------------------ Silverware pouch
    {
      id: 'pouch',
      name: 'Silverware Pouch',
      emoji: '🍴',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A flat pocket with a diagonal band, holding the knife, fork and spoon.',
      tip: 'Works just as well with paper napkins and plastic cutlery.',
      sources: [SRC.kor],
      steps: [
        { title: 'Fold in half', text: 'Start at the bottom of a square napkin, and fold the two corners up so the edges line up at the top.', op: { fold: [[-2, 0], [2, 0]], move: [0, -0.5] } },
        { title: 'Fold into a square', text: 'Now take the right side, and fold the napkin in half again to form a square.', op: { fold: [[0, -2], [0, 2]], move: [0.5, 0.5] } },
        { title: 'Fold the top layer down', text: 'Fold the top left corner of the top layer down to the opposite side.', op: { fold: [[-1, 0], [0, 1]], move: [-0.9, 0.9], top: 1 } },
        { title: 'Flip it over', text: 'Go ahead and flip the whole thing over.', op: { flip: 'h' } },
        { title: 'Fold in the right side', text: 'Fold the right side a third of the way in.', op: { fold: [[0.667, -2], [0.667, 2]], move: [0.9, 0.5] } },
        { title: 'Fold over and tuck', text: 'Then fold the left edge back over the top and tuck the bottom corner down inside the pocket on the other side.', op: { fold: [[0.333, -2], [0.333, 2]], move: [0.1, 0.5] } },
      ],
      final: { text: 'Flip it right side up, and the pouch is finished: just add the cutlery.', op: { flip: 'h' }, prop: 'plate' },
    },
  ];

  window.NapkinFolds.push(...FOLDS);
})();
