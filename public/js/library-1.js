/*
 * Fold library, part 1: Halloween, Thanksgiving, Christmas trees, St Patrick's
 * and the corners-to-centre flowers.
 *
 * Every step follows the first source in `sources`, one picture per step. Flat
 * steps are simulated by foldsim.js (`op`); standing or rolled shapes are drawn
 * by hand (`draw`) from the source's own photos.
 */
(function () {
  const { P, D, C, E, A, petal, SRC } = window.NapkinKit;

  // quarter-fold, open corners towards you, then stagger the layers (tree & turkey)
  const quarterOps = [{ fold: [[-2, 0], [2, 0]], move: [0, 0.5] }];
  const quarterAgain = [{ fold: [[0, -2], [0, 2]], move: [0.5, -0.5] }, { rotate: 45 }];
  const stagger = [0.1, 0.2, 0.3, 0.4].map((g) => ({ fold: [[-2, (-g - 1.414) / 2], [2, (-g - 1.414) / 2]], move: [0, -1.4], top: 1 }));
  const sideFolds = [
    { fold: [[0, -0.907], [-0.383, -0.907 + 0.924]], move: [-0.6, -0.72] },
    { fold: [[0, -0.907], [0.383, -0.907 + 0.924]], move: [0.6, -0.72] },
  ];

  const treeTiers = [
    P('50,9 63,30 37,30', 0),
    P('50,19 68,42 32,42', 0),
    P('50,30 73,55 27,55', 0),
    P('50,42 78,68 22,68', 0),
  ];
  const treeArt = [...treeTiers].reverse().map((t, i) => ({ ...t, s: i % 2 ? 0 : -0.6 }));

  const FOLDS = [
    // ------------------------------------------------------------------ Bat
    {
      id: 'bat',
      name: 'Bat',
      emoji: '🦇',
      difficulty: 'Easy',
      minutes: 1,
      blurb: 'Two swooping wings and a pointy-eared head from one napkin, folded in under a minute.',
      tip: 'Start with a freshly ironed square cloth napkin. Black or orange looks best.',
      sources: [SRC.instrBat],
      steps: [
        { title: 'Lay it out', text: 'Lay out the napkin (wrong side up) on a flat work surface so the top corner is pointing up.', op: { rotate: 45 } },
        { title: 'Fold in half', text: 'Fold the napkin in half by bringing the bottom corner up to the top corner.', op: { fold: [[-2, 0], [2, 0]], move: [0, -1] } },
        { title: 'Fold in half again', text: 'Fold the napkin in half again by bringing the right point over to meet the left point. Try to keep the folds as even and symmetrical as possible.', op: { fold: [[0, -2], [0, 2]], move: [1, 0.1] } },
        { title: 'Turn it', text: 'Turn the napkin so the 90° corner is pointing down.', op: { rotate: -45 } },
        { title: 'Fold up the head', text: 'Fold the bottom 90° corner up and over the top edge of the napkin so about 5 cm (2 in) overlaps, leaving a small triangle or point at the top. This will be the bat’s head.', op: { fold: [[-2, 0.6], [2, 0.6]], move: [0, 0.1] } },
        { title: 'First wing', text: 'Hold your index finger at the centre point on the bottom edge of the napkin and fold the right side up at a 45° angle to make one bat wing.', op: { fold: [[0, 0.6], [0.571, 1]], move: [0.9, 0.95] } },
        { title: 'Second wing', text: 'Repeat on the other side. Smooth the napkin with pressure as necessary to keep the folds in place.', op: { fold: [[0, 0.6], [-0.571, 1]], move: [-0.9, 0.95] } },
        { title: 'Make the ears', text: 'Fold the top middle point down about 2.5 cm (1 in).', op: { fold: [[-0.3, 1.1], [0.3, 1.1]], move: [0, 1.15], pick: [-0.35, 0.6, 0.35, 1.3] }, curve: 0.6 },
      ],
      final: { text: 'Your bat is ready to fly onto the plate.', prop: 'plate' },
    },

    // ------------------------------------------------------------------ Witch's hat
    {
      id: 'witchhat',
      name: "Witch's Hat",
      emoji: '🧙',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A tall pointed crown with a wide brim, lying flat on the plate.',
      tip: 'A napkin with a little body holds the point best. Black, orange or purple all work.',
      sources: [SRC.lolWitch],
      steps: [
        { title: 'Start with a square', text: 'Lay your cloth napkin completely flat and smooth out any large wrinkles. If your napkin has a right and wrong side, place the side you want showing face down.' },
        { title: 'Fold in half', text: 'Fold the square napkin diagonally so that two opposite corners meet. You should now have a large triangle. Line up the edges evenly and smooth the fold.', op: [{ fold: [[-1, 1], [1, -1]], move: [0.5, 0.5] }, { rotate: -135 }] },
        { title: 'Begin the long point', text: 'Take one side of the triangle and fold it inward toward the centre. This begins forming the long, narrow point that will become the top of the witch’s hat. Press the fold flat.', op: { fold: [[0, 1.414], [-0.45, 0]], move: [-1.2, 0.1] } },
        { title: 'Fold the other side across', text: 'Bring the opposite side inward and across the first fold. You should now see a much narrower triangular shape. Don’t worry if it isn’t perfectly symmetrical!', op: { fold: [[0, 1.414], [0.45, 0]], move: [1.2, 0.1] } },
        {
          title: 'Shape the point',
          text: 'Continue adjusting the long folded section so that the top forms a nice pointed triangle. Run your hand along the folded edges to keep everything in place.',
          end: true,
        },
        {
          title: 'Fold one corner outward',
          text: 'Take one of the lower corners and fold it outward, away from the centre point. This gives one side of the witch’s hat its exaggerated brim.',
          draw: {
            shapes: [P('44,58 50,12 56,58', -1.4), P('50,12 56,58 41,68', 0), P('50,12 44,58 59,68', -1.4), P('44,58 30,60 22,58 44,56', 0)],
            arrows: [A(44, 66, 24, 58, -0.4)],
          },
        },
        {
          title: 'Fold the opposite corner outward',
          text: 'Repeat with the other bottom corner. Fold it outward so you have a wide brim extending on both sides of the pointed centre. Adjust the shape until you’re happy.',
          draw: {
            shapes: [P('44,58 50,12 56,58', -1.4), P('50,12 56,58 47,60', 0), P('50,12 44,58 53,60', -1.4), P('47,57 20,57 24,62 47,63', 0), P('53,57 59,68 53,63', -1.4)],
            arrows: [A(57, 66, 77, 58, 0.4)],
          },
        },
        {
          title: 'Shape the hat',
          text: 'Gently pinch and adjust the folds around the centre. Pull the brim outward, straighten the pointed crown and fluff the folds until it looks like a witch’s hat.',
          draw: { shapes: [P('44,58 50,12 56,58', -1.4), P('50,12 56,58 44,58', 0), P('47,56 18,57 22,63 47,63', 0), P('53,56 82,57 78,63 53,63', 0)] },
        },
      ],
      final: {
        text: 'Place your finished witch hat napkin in the centre of your dinner plate and make any final adjustments once it’s in position.',
        draw: { shapes: [P('44,60 50,10 56,60', -1.4), P('50,10 56,60 44,60', 0), P('47,58 17,59 21,66 47,66', 0), P('53,58 83,59 79,66 53,66', 0)], prop: 'plate' },
      },
    },

    // ------------------------------------------------------------------ Christmas tree
    {
      id: 'tree',
      name: 'Christmas Tree',
      emoji: '🎄',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'Staggered layers tucked into tiers make a modern little evergreen.',
      tip: 'Use a square napkin of at least 40 cm (16 in); 50 cm (20 in) is ideal. Ironing first gives a crisper tree.',
      sources: [SRC.instrTree, SRC.lolTree],
      steps: [
        { title: 'Fold in half', text: 'Fold the napkin in half. Make sure the corners line up and smooth out any wrinkles.', op: quarterOps },
        { title: 'Fold in half again', text: 'Fold it in half again, making sure the corners all line up. Smooth it out and spin it around so that all the outside (loose) corners are facing you.', op: quarterAgain },
        { title: 'Fold the corners up', text: 'Fold the corners up one at a time, staggering each one a little below the last. Smooth them flat.', op: stagger, arrows: [] },
        { title: 'Flip it over', text: 'Gently slide your hand under the napkin, sandwich it between your hands, and flip it over.', op: { flip: 'h' } },
        {
          title: 'Fold the outer corners across',
          text: 'One at a time, fold each upper outside corner over to the opposite side’s edge, so that the tops are parallel with you and you’ve formed a tidy, downward-pointing triangle-ish shape.',
          op: sideFolds,
        },
        { title: 'Flip it again', text: 'Flip the folded napkin over again.', op: { flip: 'h' } },
        {
          title: 'Fold ’em up',
          text: 'Starting at the top, fold each flap up. Tuck the second through to the fifth flap up under the one above it, hiding the pointed corner.',
          end: true,
          arrows: [A(50, 62, 50, 44, 0.5)],
        },
      ],
      final: {
        text: 'Place the napkins on the empty plates and make sure all their folds are still in place.',
        draw: { shapes: treeArt, prop: 'plate' },
      },
    },

    // ------------------------------------------------------------------ Turkey
    {
      id: 'turkey',
      name: 'Thanksgiving Turkey',
      emoji: '🦃',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'The Christmas-tree fold turned on its side, with the tiers standing up as tail feathers.',
      tip: 'Any napkin works. Orange, rust and brown make the most convincing turkeys.',
      sources: [SRC.lolTurkey],
      steps: [
        { title: 'Fold in half', text: 'Fold the napkin in half.', op: quarterOps },
        { title: 'Fold into a quarter', text: 'Fold it over again into a quarter, with the loose corners together.', op: quarterAgain },
        { title: 'Fold up the layers', text: 'Take the bottom fold and fold it up in a triangle. Keep repeating with each layer, each a little lower than the last.', op: stagger, arrows: [] },
        { title: 'Turn it over', text: 'Turn the napkin over.', op: { flip: 'h' } },
        { title: 'Fold the corners over', text: 'Fold the bottom right corner over, then repeat with the left corner, creating a triangle shape.', op: sideFolds },
        { title: 'Turn it over', text: 'Turn the napkin over again.', op: { flip: 'h' } },
        {
          title: 'Stand up the tail',
          text: 'Take the bottom flap and fold it up so it stands up. Take the next layer, fold it up and tuck it under the top point. Keep repeating until you reach the tail: fold that one up but do not tuck it.',
          end: true,
          arrows: [A(50, 62, 50, 44, 0.5)],
        },
      ],
      final: {
        text: 'Place it on the plate on its side so the standing layers become the turkey’s tail feathers.',
        draw: {
          shapes: [
            D('M22 44Q30 22 50 18L70 40Z', -0.6),
            D('M30 46Q36 28 54 24L72 42Z', 0),
            D('M38 48Q44 32 60 30L74 44Z', -0.6),
            D('M46 50Q52 38 66 36L76 46Z', 0),
            P('20,46 80,46 74,58 26,58', -1.4),
            P('74,46 86,38 80,50', -1.4),
          ],
          prop: 'plate',
        },
      },
    },

    // ------------------------------------------------------------------ Lotus (KoR "Rose")
    {
      id: 'lotus',
      name: 'Lotus',
      emoji: '🪷',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'Corners folded to the centre three times, then pulled out into a blooming flower. Linen companies call it “The Rose”.',
      tip: 'Most napkins aren’t perfectly square; just do the best you can. A crisp napkin holds the petals best.',
      sources: [SRC.kor, SRC.calRose],
      steps: [
        {
          title: 'Corners to the centre',
          text: 'Start with a square napkin and fold each of the 4 corners into the centre as best you can.',
          op: [
            { fold: [[0, 1], [1, 0]], move: [0.9, 0.9] },
            { fold: [[0, 1], [-1, 0]], move: [-0.9, 0.9] },
            { fold: [[0, -1], [-1, 0]], move: [-0.9, -0.9] },
            { fold: [[0, -1], [1, 0]], move: [0.9, -0.9] },
          ],
          arrows: [],
        },
        {
          title: 'And again',
          text: 'Take the 4 new corners and fold them into the centre as well.',
          op: [
            { fold: [[0.5, -2], [0.5, 2]], move: [0.9, 0] },
            { fold: [[-2, 0.5], [2, 0.5]], move: [0, 0.9] },
            { fold: [[-0.5, -2], [-0.5, 2]], move: [-0.9, 0] },
            { fold: [[-2, -0.5], [2, -0.5]], move: [0, -0.9] },
          ],
          arrows: [],
        },
        { title: 'Flip it over', text: 'Hold everything together at the middle, and flip the napkin over.', op: { flip: 'h' } },
        {
          title: 'Corners in once more',
          text: 'Repeat the process: fold these 4 corners into the middle, like you did the others.',
          op: [
            { fold: [[0, 0.5], [0.5, 0]], move: [0.45, 0.45] },
            { fold: [[0, 0.5], [-0.5, 0]], move: [-0.45, 0.45] },
            { fold: [[0, -0.5], [-0.5, 0]], move: [-0.45, -0.45] },
            { fold: [[0, -0.5], [0.5, 0]], move: [0.45, -0.45] },
          ],
          arrows: [],
        },
        {
          title: 'Pull out the petals',
          text: 'Hold the centre firmly with one hand, and gently pull the tips from underneath the corners until they look like flower petals.',
          end: true,
          arrows: [A(38, 30, 24, 18, 0.3), A(62, 30, 76, 18, -0.3), A(62, 50, 76, 62, 0.3), A(38, 50, 24, 62, -0.3)],
        },
        {
          title: 'Pull out the points between',
          text: 'When you’ve done this to each of the 4 corners, do the same to the undersides of the edges. This makes little points stick out between the petals.',
          draw: {
            shapes: [...[45, 135, 225, 315].map((a) => petal(50, 40, a, 26, 10, 0)), P('42,32 58,32 58,48 42,48', -1.4)],
            arrows: [A(50, 30, 50, 10, 0.3), A(60, 40, 82, 40, 0.3), A(50, 50, 50, 70, 0.3), A(40, 40, 18, 40, 0.3)],
            prop: 'plate',
          },
        },
      ],
      final: {
        text: 'Every petal is out and the little points sit evenly between them.',
        draw: {
          shapes: [...[0, 90, 180, 270].map((a) => petal(50, 40, a, 30, 9, -1.4)), ...[45, 135, 225, 315].map((a) => petal(50, 40, a, 28, 11, 0)), P('43,33 57,33 57,47 43,47', -1.4)],
          prop: 'plate',
        },
      },
    },

    // ------------------------------------------------------------------ Shamrock
    {
      id: 'shamrock',
      name: 'Shamrock',
      emoji: '☘️',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'Four rounded leaves pulled out around a square centre: a four-leaf clover for luck.',
      tip: 'Ironing the napkin first makes the folding easier. Any shade of green works.',
      sources: [SRC.lolShamrock],
      steps: [
        {
          title: 'Corners to the centre',
          text: 'Take a square napkin and fold each corner towards the centre; don’t worry about making it perfect.',
          op: [
            { fold: [[0, 1], [1, 0]], move: [0.9, 0.9] },
            { fold: [[0, 1], [-1, 0]], move: [-0.9, 0.9] },
            { fold: [[0, -1], [-1, 0]], move: [-0.9, -0.9] },
            { fold: [[0, -1], [1, 0]], move: [0.9, -0.9] },
          ],
          arrows: [],
        },
        {
          title: 'Fold the corners in again',
          text: 'Once the four corners have been folded towards the middle, fold the four corners in one more time. The key is keeping a square.',
          op: [
            { fold: [[0.5, -2], [0.5, 2]], move: [0.9, 0] },
            { fold: [[-2, 0.5], [2, 0.5]], move: [0, 0.9] },
            { fold: [[-0.5, -2], [-0.5, 2]], move: [-0.9, 0] },
            { fold: [[-2, -0.5], [2, -0.5]], move: [0, -0.9] },
          ],
          arrows: [],
        },
        { title: 'Turn it over', text: 'Once the square is made, turn the napkin over so you have a solid surface.', op: { flip: 'h' } },
        {
          title: 'Corners into the middle',
          text: 'Now fold each corner back into the middle. Lightly hold the four corners in the middle with your hand; keeping them there is the awkward part.',
          op: [
            { fold: [[0, 0.5], [0.5, 0]], move: [0.45, 0.45] },
            { fold: [[0, 0.5], [-0.5, 0]], move: [-0.45, 0.45] },
            { fold: [[0, -0.5], [-0.5, 0]], move: [-0.45, -0.45] },
            { fold: [[0, -0.5], [0.5, 0]], move: [0.45, -0.45] },
          ],
          arrows: [],
        },
        {
          title: 'Bring out the leaves',
          text: 'Reach under each corner and slowly bring out the folded corner, creating a leaf.',
          end: true,
          arrows: [A(38, 30, 24, 18, 0.3), A(62, 30, 76, 18, -0.3), A(62, 50, 76, 62, 0.3), A(38, 50, 24, 62, -0.3)],
        },
      ],
      final: {
        text: 'Once all four corners are brought back out, they form the four leaves of the shamrock.',
        draw: {
          shapes: [
            ...[-135, -45, 45, 135].map((a) => {
              const t = (a * Math.PI) / 180;
              const cx = 50 + Math.cos(t) * 15;
              const cy = 40 + Math.sin(t) * 15;
              return D(`M50 40L${(cx - 9 * Math.sin(t)).toFixed(1)} ${(cy + 9 * Math.cos(t)).toFixed(1)}A10 10 0 1 1 ${(cx + Math.cos(t) * 6).toFixed(1)} ${(cy + Math.sin(t) * 6).toFixed(1)}A10 10 0 1 1 ${(cx + 9 * Math.sin(t)).toFixed(1)} ${(cy - 9 * Math.cos(t)).toFixed(1)}Z`, 0);
            }),
            P('44,34 56,34 56,46 44,46', -1.4),
          ],
          prop: 'plate',
        },
      },
    },
  ];

  window.NapkinFolds.push(...FOLDS);
})();
