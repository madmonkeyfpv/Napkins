/*
 * More folds for the library. Same format as folds.js: each step has a title,
 * instructions taken from the published guides in `sources`, and a drawing.
 */
(function () {
  const { P, D, C, E, A, SQUARE, HALF, TRI, SRC, pleats, fan, petal, halfStep, triangleStep, quartersStep } = window.NapkinFoldKit;

  const DIAMOND = '50,20 70,40 50,60 30,40';
  const GUTENBERG = { name: 'How to Fold Napkins (Jessup Whitehead, 1888) – Project Gutenberg', url: 'https://www.gutenberg.org/ebooks/62208' };
  const southernLady = (path, name) => ({ name: `Southern Lady Magazine – ${name}`, url: `https://southernladymagazine.com/${path}/2` });

  // --- shared steps ----------------------------------------------------------
  const cornersUp = (text) => ({
    title: 'Corners to the top',
    text: text || 'Turn the triangle so the long edge faces you. Fold the left and right corners up to meet the top point, making a diamond.',
    shapes: [P('10,60 90,60 50,20')],
    lines: [
      [30, 40, 50, 60],
      [70, 40, 50, 60],
    ],
    arrows: [A(13, 58, 47, 22, 0.3), A(87, 58, 53, 22, -0.3)],
  });

  // fold the bottom point of the diamond up so its tip lands at `tip`
  const pointUp = (title, text, tip, flip) => {
    const y = (60 + tip) / 2;
    const hw = 20 - Math.abs(y - 40);
    return {
      title,
      text,
      flip,
      shapes: [P(DIAMOND)],
      details: [[50, 20, 50, 60]],
      lines: [[50 - hw, y, 50 + hw, y]],
      arrows: [A(50, 58, 50, tip + 2, 0.4)],
    };
  };

  const foldBack = (text) => ({
    title: 'Fold it back',
    text,
    shapes: [P('50,20 70,40 63.5,46.5 36.5,46.5 30,40'), P('36.5,46.5 63.5,46.5 50,33', 1)],
    lines: [[43, 40, 57, 40]],
    arrows: [A(50, 35, 50, 45, 0.6)],
  });

  const tuckRing = (title, text, flip) => ({
    title,
    text,
    flip,
    shapes: [P('50,20 70,40 63.5,46.5 36.5,46.5 30,40'), P('36.5,46.5 63.5,46.5 57,40 43,40', 1)],
    lines: [
      [40, 22, 40, 46],
      [60, 22, 60, 46],
    ],
    arrows: [A(30, 50, 46, 56, 0.4), A(70, 50, 54, 56, -0.4)],
  });

  const cutlery = (x, y, len) => [
    P(`${x},${y} ${x + 3},${y} ${x + 3.4},${y + len} ${x + 0.4},${y + len}`, 0, 'silver'),
    P(`${x + 6},${y} ${x + 9.5},${y} ${x + 9.5},${y + len} ${x + 6},${y + len}`, 0, 'silver'),
    E(x + 14.2, y + 3.5, 2.4, 3.5, 0, 'silver'),
    P(`${x + 13.6},${y + 6} ${x + 14.8},${y + 6} ${x + 14.8},${y + len} ${x + 13.6},${y + len}`, 0, 'silver'),
  ];

  const EXTRA = [
    {
      id: 'mitre',
      name: "Bishop's Mitre",
      emoji: '⛪',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'The tall, two-peaked banquet classic, shaped like a bishop’s mitre and traditional for St Nicholas.',
      tip: 'Starch and iron the napkin first; a crisp napkin is what makes the mitre stand tall.',
      sources: [SRC.calinen('bishopmiter', 'Bishop’s Mitre'), SRC.falvey],
      steps: [
        {
          title: 'Fold in half',
          text: 'Lay the napkin face-down and fold it in half, bringing the top edge down to the bottom edge.',
          shapes: [P(SQUARE)],
          lines: [[20, 40, 80, 40]],
          arrows: [A(50, 14, 50, 66, -0.35)],
        },
        {
          title: 'Corners to the centre line',
          text: 'Fold the top-right corner down to the centre of the bottom edge, and the bottom-left corner up to the centre of the top edge.',
          shapes: [P(HALF)],
          lines: [
            [50, 25, 80, 55],
            [20, 25, 50, 55],
          ],
          arrows: [A(78, 27, 53, 52, 0.3), A(22, 53, 47, 28, 0.3)],
        },
        {
          title: 'Flip & turn',
          text: 'Turn the napkin over and rotate it a quarter turn.',
          flip: true,
          shapes: [P('20,25 50,25 80,55 50,55'), P('50,25 50,55 80,55', 1), P('20,25 50,25 50,55', 1)],
          arrows: [A(86, 30, 86, 52, 0.6)],
        },
        {
          title: 'Fold up & flip out',
          text: 'Fold the bottom edge up to the top edge, then flip the hidden point out from under the top fold.',
          shapes: [P('35,12 65,42 65,68 35,38')],
          lines: [[35, 40, 65, 40]],
          arrows: [A(50, 64, 50, 22, 0.4)],
        },
        {
          title: 'Tuck the ends',
          text: 'Turn the left end into the pleat on the left to form a point. Turn the napkin over and tuck the right end into the pleat on the right.',
          shapes: [P('42,60 42,36 56,16 70,36 70,60', -1), P('30,60 30,36 44,14 58,36 58,60')],
          lines: [
            [36, 36, 36, 60],
            [64, 36, 64, 60],
          ],
          arrows: [A(24, 50, 34, 54, 0.4), A(76, 50, 66, 54, -0.4)],
        },
      ],
      final: {
        text: 'Open the base and stand the mitre upright on the plate.',
        shapes: [P('38,62 38,34 52,12 66,34 66,62', -1), P('32,64 32,36 47,14 62,36 62,64'), P('32,56 62,56 62,64 32,64', 1)],
        prop: 'plateSide',
      },
    },
    {
      id: 'cardinal',
      name: "Cardinal's Hat",
      emoji: '🎩',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'A tall, single-peaked hat that stands on its own: elegant and quick once you know it.',
      tip: 'A medium-weight, starched napkin gives the crispest point.',
      sources: [SRC.calinen('cardinelhat', 'The Cardinal’s Hat'), SRC.falvey, SRC.werent],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        cornersUp(),
        pointUp('Flip & fold up', 'Turn the napkin over with the points at the top. Fold the bottom corner two-thirds of the way up.', 33, true),
        foldBack('Fold that point back down onto itself.'),
        tuckRing('Tuck into a ring', 'Bring the left and right corners round and tuck one into the other.'),
      ],
      final: {
        text: 'Open the base and stand it upright. Flare the side points out slightly.',
        shapes: [P('33,64 33,40 50,12 67,40 67,64'), P('33,54 67,54 67,64 33,64', 1), P('38,40 50,20 62,40', 1)],
        prop: 'plateSide',
      },
    },
    {
      id: 'rosebud',
      name: 'Rosebud',
      emoji: '🌷',
      difficulty: 'Easy',
      minutes: 3,
      blurb: 'A neat standing bud with two pointed petals: dainty and quick.',
      tip: 'Smaller napkins (40 cm / 16 in) make the neatest buds.',
      sources: [SRC.calinen('rosebud', 'Rosebud'), SRC.falvey],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        cornersUp(),
        pointUp('Flip & fold up', 'Turn the napkin over and fold the bottom point two-thirds of the way up.', 33, true),
        tuckRing('Tuck into a ring', 'Turn the napkin around, bring the left and right corners together behind and tuck one into the other.'),
      ],
      final: {
        text: 'Turn it around and stand it on its base. The loose points open like a bud.',
        shapes: [P('37,64 37,38 63,38 63,64'), P('37,40 44,14 53,38', 1), P('47,38 56,14 63,40', 0), P('37,56 63,56 63,64 37,64', 1)],
        prop: 'plateSide',
      },
    },
    {
      id: 'paradise',
      name: 'Bird of Paradise',
      emoji: '🦜',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'Four pointed plumes rise from a narrow base, like the tropical flower.',
      tip: 'Use a heavily starched napkin so the plumes hold their points.',
      sources: [SRC.calinen('paradise', 'Bird of Paradise'), SRC.falvey, SRC.werent],
      steps: [
        quartersStep('Fold the napkin in half, then in half again, to make a square.'),
        {
          title: 'Fold into a triangle',
          text: 'Turn the square into a diamond with the loose points at the top. Fold the bottom corner up to the top to make a triangle.',
          shapes: [P('50,12 78,40 50,68 22,40')],
          details: [
            [46, 16, 54, 16],
            [43, 19, 57, 19],
          ],
          lines: [[22, 40, 78, 40]],
          arrows: [A(50, 66, 50, 16, 0.35)],
        },
        {
          title: 'Fold the sides in',
          text: 'Fold the left and right sides down along the centre line so their edges meet, tucking the points that stick out at the bottom underneath.',
          shapes: [P('20,58 80,58 50,22')],
          lines: [
            [50, 22, 44, 58],
            [50, 22, 56, 58],
          ],
          arrows: [A(22, 56, 46, 44, 0.3), A(78, 56, 54, 44, -0.3)],
        },
        {
          title: 'Fold in half',
          text: 'Fold it in half along its length, with the folded edges facing out.',
          shapes: [P('50,14 61,52 50,66 39,52')],
          lines: [[50, 14, 50, 66]],
          arrows: [A(38, 42, 62, 42, 0.5)],
        },
      ],
      final: {
        text: 'Hold the base and pull up the four loose points to make the plumes. Arrange it on the plate.',
        shapes: [P('34,48 30,20 43,46', 1), P('42,47 43,14 51,46'), P('50,46 56,13 59,46', 1), P('58,47 68,18 67,48'), P('22,60 78,60 72,46 30,46')],
        prop: 'plate',
      },
    },
    {
      id: 'fleurdelis',
      name: 'Fleur-de-Lis',
      emoji: '⚜️',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'A standing lily with a tall centre peak and two curling side petals.',
      tip: 'Starch helps the side peaks curl and hold.',
      sources: [SRC.falvey],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        cornersUp(),
        pointUp('Fold up the point', 'Fold the bottom point up to within 2.5 cm (1 in) of the top point.', 23),
        {
          ...foldBack('Fold the same point back down to the bottom edge.'),
          shapes: [P('50,20 70,40 61.5,48.5 38.5,48.5 30,40'), P('38.5,48.5 61.5,48.5 50,26', 1)],
          lines: [[44, 37, 56, 37]],
          arrows: [A(50, 28, 50, 46, 0.6)],
        },
        tuckRing('Tuck & stand', 'Fold the sides back and tuck them together behind, then stand the napkin up.'),
      ],
      final: {
        text: 'Pull the left and right peaks down and out to form the fleur-de-lis.',
        shapes: [
          D('M40 46Q26 30 20 42Q30 39 38 52Z', -1),
          D('M60 46Q74 30 80 42Q70 39 62 52Z', -1),
          P('38,64 38,42 62,42 62,64'),
          P('42,44 50,12 58,44', 1),
          P('38,56 62,56 62,64 38,64', 1),
        ],
        prop: 'plateSide',
      },
    },
    {
      id: 'arum',
      name: 'Arum Lily',
      emoji: '🌺',
      difficulty: 'Tricky',
      minutes: 6,
      blurb: 'A graceful standing lily, the trumpet-shaped flower long linked with Easter.',
      tip: 'Crisp white or cream napkins look most like real arum lilies.',
      sources: [SRC.calinen('arum', 'The Arum Lily'), SRC.falvey],
      steps: [
        triangleStep('Lay the napkin face-down as a diamond and fold the bottom corner up to the top to make a triangle.'),
        cornersUp('Fold the left and right corners up to the top point, making a diamond.'),
        pointUp('Fold up the point', 'Fold the bottom point up to 2.5 cm (1 in) below the top.', 23),
        {
          ...foldBack('Fold that point back down onto itself.'),
          shapes: [P('50,20 70,40 61.5,48.5 38.5,48.5 30,40'), P('38.5,48.5 61.5,48.5 50,26', 1)],
          lines: [[44, 37, 56, 37]],
          arrows: [A(50, 28, 50, 46, 0.6)],
        },
        {
          title: 'Tuck the points',
          text: 'Fold each of the two points at the top down and tuck them under the edge of the folded-up bottom. Fold one layer of the top point down and tuck it under the base fold too.',
          shapes: [P('50,20 70,40 61.5,48.5 38.5,48.5 30,40'), P('38.5,48.5 61.5,48.5 57,44 43,44', 1)],
          arrows: [A(36, 34, 42, 44, 0.4), A(64, 34, 58, 44, -0.4), A(50, 22, 50, 40, 0.4)],
        },
        tuckRing('Flip & tuck', 'Turn the napkin over and tuck the left and right sides into each other.', true),
      ],
      final: {
        text: 'Open the base and stand it up: a lily ready for the table.',
        shapes: [P('37,64 37,40 63,40 63,64'), D('M37 42Q34 20 50 12Q66 20 63 42Z', 1), D('M42 42Q46 28 50 24Q54 28 58 42Z'), P('37,56 63,56 63,64 37,64', 1)],
        prop: 'plateSide',
      },
    },
    {
      id: 'handkerchief',
      name: 'Handkerchief',
      emoji: '🤵',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'Fanned, layered points like a pocket square: smart and very quick.',
      tip: 'Fold in quarters first so there are several layers of points to fan out.',
      sources: [SRC.falvey],
      steps: [
        triangleStep('Fold the napkin into quarters, then fold it in half diagonally to make a triangle with the loose points together at the top.'),
        {
          title: 'Fan the first point',
          text: 'Hold one finger on the centre of the bottom edge and lift the top point of the top layer over to the left.',
          shapes: [P('14,62 86,62 50,24')],
          details: [
            [50, 24, 47, 27],
            [50, 24, 53, 27],
          ],
          arrows: [A(50, 26, 30, 32, -0.3)],
        },
        {
          title: 'Fan the others',
          text: 'Lift the next point to the left, then the next one again, so the points fan out evenly.',
          shapes: [P('14,62 86,62 50,24'), P('14,62 70,62 36,26', 1), P('14,62 62,62 28,30', 1)],
          arrows: [A(50, 26, 42, 26, -0.4)],
        },
        {
          title: 'Fold the side under',
          text: 'Fold the right side under to finish it off.',
          shapes: [P('14,62 86,62 50,24'), P('14,62 70,62 36,26', 1), P('14,62 62,62 28,30', 1), P('14,62 54,62 20,34', 1)],
          lines: [[66, 62, 64, 40]],
          arrows: [A(84, 58, 70, 54, -0.5)],
        },
      ],
      final: {
        text: 'Lay it on the plate with the fanned points at the top.',
        shapes: [P('22,60 66,60 54,26'), P('22,60 62,60 44,22', 1), P('22,60 58,60 34,22', 0), P('22,60 54,60 26,26', 1)],
        prop: 'plate',
      },
    },
    {
      id: 'butterfly',
      name: 'Fanciful Butterfly',
      emoji: '🦋',
      difficulty: 'Medium',
      minutes: 5,
      blurb: 'Two petal-wings fold down from a standing base: a butterfly settling on the plate.',
      tip: 'Medium-weight napkins in bright colours make the happiest butterflies.',
      sources: [SRC.falvey],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a triangle.'),
        cornersUp('Fold the left corner up to the top point, then the right corner, making a diamond.'),
        pointUp('Flip & fold up', 'Turn the napkin over, keeping the loose points at the top. Fold the bottom point upward, leaving a margin at the top, to make a triangle.', 27, true),
        tuckRing('Tuck into a ring', 'Tuck the left corner into the right to close it into a ring.'),
      ],
      final: {
        text: 'Stand it up and turn it around, then turn the two petals down. It’s a fanciful butterfly!',
        shapes: [
          D('M48 40Q30 18 18 30Q20 46 46 48Z', 1),
          D('M52 40Q70 18 82 30Q80 46 54 48Z', 1),
          D('M46 48Q30 52 28 62Q42 62 48 54Z'),
          D('M54 48Q70 52 72 62Q58 62 52 54Z'),
          P('46,30 54,30 54,64 46,64', -1),
        ],
        prop: 'plate',
      },
    },
    {
      id: 'obi',
      name: 'Obi Basket',
      emoji: '🍞',
      difficulty: 'Medium',
      minutes: 4,
      blurb: 'A square tray with four folded pockets.',
      tip: 'Press each fold flat as you go so the pockets open neatly.',
      sources: [SRC.falvey],
      steps: [
        {
          title: 'Corners to centre',
          text: 'Lay the napkin face-down and fold all four corners into the centre.',
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
          title: 'Flip & fold again',
          text: 'Turn the napkin over and again fold the four corners into the centre.',
          flip: true,
          shapes: [P('50,10 80,40 50,70 20,40')],
          lines: [
            [35, 25, 65, 25],
            [65, 25, 65, 55],
            [65, 55, 35, 55],
            [35, 55, 35, 25],
          ],
          arrows: [A(50, 12, 50, 35, 0.3), A(78, 40, 55, 40, 0.3), A(50, 68, 50, 45, 0.3), A(22, 40, 45, 40, 0.3)],
        },
        {
          title: 'Lift & flatten',
          text: 'Lift one corner out from the centre and flatten it into a pocket. Repeat for all four corners.',
          shapes: [P('35,25 65,25 65,55 35,55')],
          details: [
            [35, 25, 65, 55],
            [65, 25, 35, 55],
          ],
          arrows: [A(46, 36, 38, 28, 0.4), A(54, 36, 62, 28, -0.4), A(54, 44, 62, 52, 0.4), A(46, 44, 38, 52, -0.4)],
        },
      ],
      final: {
        text: 'Your basket is ready: four neat pockets around a square centre.',
        shapes: [
          P('40,15 60,15 60,30 75,30 75,50 60,50 60,65 40,65 40,50 25,50 25,30 40,30', -1),
          D('M41 17Q50 24 59 17L59 28Q50 33 41 28Z', 1),
          D('M41 63Q50 56 59 63L59 52Q50 47 41 52Z', 1),
          D('M27 31Q34 40 27 49L38 49Q43 40 38 31Z', 1),
          D('M73 31Q66 40 73 49L62 49Q57 40 62 31Z', 1),
        ],
        prop: 'plate',
      },
    },
    {
      id: 'knot',
      name: 'What Knot',
      emoji: '🪢',
      difficulty: 'Easy',
      minutes: 1,
      blurb: 'Roll it, tie it, done: a relaxed fold for picnics and casual suppers.',
      tip: 'Thin cotton or linen ties the neatest knot.',
      sources: [SRC.falvey],
      steps: [
        {
          title: 'Make a triangle',
          text: 'Fold the napkin in half diagonally into a triangle with the point at the bottom.',
          shapes: [P(SQUARE)],
          lines: [[20, 10, 80, 70]],
          arrows: [A(22, 68, 76, 14, -0.3)],
        },
        {
          title: 'Roll it up',
          text: 'Starting at the bottom point, roll the napkin up into a long rope.',
          shapes: [P('10,22 90,22 50,62')],
          arrows: [A(50, 58, 50, 28, 0.4)],
        },
        {
          title: 'Tie a knot',
          text: 'Tie a loose knot in the centre of the roll.',
          shapes: [P('6,38 94,38 94,45 6,45')],
          details: [
            [20, 38, 23, 45],
            [40, 38, 43, 45],
            [60, 38, 63, 45],
            [80, 38, 83, 45],
          ],
          arrows: [A(30, 30, 50, 34, -0.6), A(70, 30, 50, 34, 0.6)],
        },
      ],
      final: {
        text: 'Lay it across the plate with the knot in the middle.',
        shapes: [P('10,38 42,36 42,44 10,46'), P('58,36 90,38 90,46 58,44'), C(50, 40, 9, 1), D('M42 36Q50 30 58 36Q54 42 50 41Q46 42 42 36Z', -1)],
        prop: 'plate',
      },
    },
    {
      id: 'swan',
      name: 'Swan',
      emoji: '🦢',
      difficulty: 'Tricky',
      minutes: 7,
      blurb: 'A graceful swan with a curved neck and feathered tail, made for weddings and romantic dinners.',
      tip: 'A freshly starched napkin is essential, or the neck will flop. A thick paper napkin also works.',
      sources: [SRC.homedepot],
      steps: [
        quartersStep('Fold the napkin in half and then in half again to make a square.'),
        {
          title: 'Make a kite',
          text: 'Arrange it like a diamond with the folded edge on the left and the corner with no folds at the top. Fold the left and right sides in so their edges line up with the centre, making a kite.',
          shapes: [P('50,10 80,40 50,70 20,40')],
          lines: [
            [50, 10, 38, 62],
            [50, 10, 62, 62],
          ],
          arrows: [A(22, 40, 46, 42, 0.3), A(78, 40, 54, 42, -0.3)],
        },
        {
          title: 'Flip & narrow',
          text: 'Flip the napkin over. Fold the left and right edges into the middle again to make a narrow kite.',
          flip: true,
          shapes: [P('50,10 62,58 50,70 38,58')],
          lines: [
            [50, 10, 45, 64],
            [50, 10, 55, 64],
          ],
          arrows: [A(36, 50, 48, 50, 0.4), A(64, 50, 52, 50, -0.4)],
        },
        {
          title: 'Neck & head',
          text: 'Fold the bottom point up to meet the top point, then fold the narrow tip down about 2.5 cm (1 in) to make the head.',
          shapes: [P('50,10 56,60 50,70 44,60')],
          lines: [
            [44, 40, 56, 40],
            [47, 18, 53, 18],
          ],
          arrows: [A(50, 68, 50, 14, 0.35), A(54, 10, 54, 22, -0.5)],
        },
        {
          title: 'Fold in half',
          text: 'Fold the whole napkin in half lengthwise so the back edges of the neck meet and the head pops forward. Pull the neck forward a little.',
          shapes: [P('46,14 54,14 58,64 42,64')],
          lines: [[50, 14, 50, 64]],
          arrows: [A(38, 50, 62, 50, 0.5)],
        },
      ],
      final: {
        text: 'Pull up the loose corners near the tail to look like feathers, then set the swan on the plate.',
        shapes: [
          D('M62 48Q78 34 74 22Q70 34 58 42Z', 1),
          D('M66 50Q82 42 82 32Q74 42 62 46Z'),
          D('M26 56Q24 42 40 40L64 40Q76 44 74 56Z', -1),
          D('M34 50L33 24Q33 14 25 14L18 18L27 21L28 50Z'),
          D('M24 58Q50 48 76 58Z', 1),
        ],
        prop: 'plate',
      },
    },
    {
      id: 'wrap',
      name: 'Cutlery Wrap',
      emoji: '🍽️',
      difficulty: 'Easy',
      minutes: 2,
      blurb: 'Knife, fork and spoon rolled up neatly in the napkin: ideal for buffets, picnics and garden parties.',
      tip: 'Roll tightly from the long edge so the bundle holds without anything to tie it.',
      sources: [SRC.homedepot, SRC.toh],
      steps: [
        triangleStep('Lay the napkin face-down and fold it in half diagonally to make a large triangle.'),
        {
          title: 'Add the cutlery',
          text: 'Place the cutlery on the napkin along the centre of the triangle’s long side.',
          shapes: [P('10,24 90,24 50,64'), ...cutlery(42, 26, 22)],
        },
        {
          title: 'Fold in the sides',
          text: 'Fold the left and right points over the cutlery, so it looks a bit like an envelope flap.',
          shapes: [P('10,24 90,24 50,64'), ...cutlery(42, 26, 22)],
          lines: [
            [34, 24, 34, 48],
            [66, 24, 66, 48],
          ],
          arrows: [A(12, 26, 44, 36, 0.3), A(88, 26, 56, 36, -0.3)],
        },
        {
          title: 'Roll it up',
          text: 'Roll it up tightly from the long edge into a neat bundle.',
          shapes: [P('34,24 66,24 66,48 50,64 34,48'), P('34,24 46,24 46,48 34,48', 1), P('54,24 66,24 66,48 54,48', 1)],
          arrows: [A(50, 18, 50, 50, -0.4)],
        },
      ],
      final: {
        text: 'Roll it up snugly so the cutlery is held tight inside, and lay it beside the plate.',
        shapes: [...cutlery(42, 6, 14), P('40,16 60,16 60,70 40,70'), P('40,16 60,16 60,22 40,22', 1)],
      },
    },
    {
      id: 'bat',
      name: 'Bat',
      emoji: '🦇',
      difficulty: 'Easy',
      minutes: 1,
      blurb: 'Two swooping wings and a pointy-eared head from one napkin, folded in under a minute.',
      tip: 'Start with a freshly ironed square cloth napkin. Black is best for bats.',
      sources: [{ name: 'Instructables – Bat Napkin Folding', url: 'https://www.instructables.com/Bat-Napkin-Folding/' }],
      steps: [
        {
          title: 'Make a triangle',
          text: 'Lay the napkin wrong side up with a corner pointing up. Fold it in half by bringing the bottom corner up to the top corner.',
          shapes: [P('50,8 82,40 50,72 18,40')],
          lines: [[18, 40, 82, 40]],
          arrows: [A(50, 68, 50, 12, 0.35)],
        },
        {
          title: 'Fold in half again',
          text: 'Fold it in half again by bringing the right point over to meet the left point. Keep the folds even.',
          shapes: [P('18,40 82,40 50,8')],
          lines: [[50, 8, 50, 40]],
          arrows: [A(80, 37, 22, 37, 0.3)],
        },
        {
          title: 'Fold up the head',
          text: 'Turn the napkin so the 90° corner points down. Fold that bottom corner up and over the top edge so about 5 cm (2 in) overlaps, leaving a small point sticking up at the top. This will be the bat’s head.',
          shapes: [P('16,30 84,30 50,64')],
          lines: [[29.6, 43.6, 70.4, 43.6]],
          arrows: [A(50, 62, 50, 25, 0.4)],
        },
        {
          title: 'Fold up the wings',
          text: 'Hold your index finger on the centre of the bottom edge and fold the right side up at a 45° angle to make one wing. Repeat on the left side.',
          shapes: [P('16,30 84,30 70.4,43.6 29.6,43.6'), P('29.6,43.6 70.4,43.6 50,23.2', 1), C(50, 43.6, 1.8, 0, 'white')],
          lines: [
            [50, 43.6, 69.4, 30],
            [50, 43.6, 30.6, 30],
          ],
          arrows: [A(82, 34, 72, 14, -0.4), A(18, 34, 28, 14, 0.4)],
        },
        {
          title: 'Make the ears',
          text: 'Fold the top middle point (the head) down about 2.5 cm (1 in). Its two new corners become the ears.',
          shapes: [
            P('23.8,34 76.2,34 50,52.4', -1),
            P('50,52.4 33.8,41 50,24.8 66.2,41'),
            P('50,52.4 40.5,26.4 17.1,15.5 23.8,34', 1),
            P('50,52.4 59.5,26.4 82.9,15.5 76.2,34', 1),
          ],
          lines: [[45.4, 28.7, 54.6, 28.7]],
          arrows: [A(55, 20, 52, 33, -0.6)],
        },
      ],
      final: {
        text: 'Press the folds flat and lay your bat on the plate, wings up.',
        shapes: [
          P('21.9,40 78.1,40 50,59.7', -1),
          P('50,59.7 32.6,47.5 45.1,35.1 54.9,35.1 67.4,47.5'),
          P('45.1,35.1 54.9,35.1 50,40', 1),
          P('50,59.7 39.9,31.9 14.6,20.1 21.9,40', 1),
          P('50,59.7 60.1,31.9 85.4,20.1 78.1,40', 1),
        ],
        prop: 'plate',
      },
    },
    {
      id: 'basket',
      name: 'Easter Basket',
      emoji: '🧺',
      difficulty: 'Medium',
      minutes: 3,
      blurb: 'A soft, round basket rolled from a single napkin.',
      tip: 'A large, soft napkin rolls into the roundest basket.',
      sources: [southernLady('basket-of-goodies-napkin-video-fold-tutorial', 'Basket of Goodies Napkin Fold')],
      steps: [
        triangleStep('Fold a square napkin diagonally into a triangle.'),
        {
          title: 'Fold up the bottom',
          text: 'Fold the bottom edge up about halfway to the top point.',
          shapes: [P(TRI)],
          lines: [[30, 42, 70, 42]],
          arrows: [A(50, 66, 50, 40, 0.6)],
        },
        {
          title: 'Wrap the corners',
          text: 'Fold one corner across the centre, then the opposite corner, letting the excess wrap all the way around.',
          shapes: [P('10,62 90,62 70,42 30,42'), P('30,42 70,42 50,22', 1)],
          arrows: [A(12, 60, 70, 52, 0.25), A(88, 60, 30, 52, -0.25)],
        },
      ],
      final: {
        text: 'Roll the pointed part down to make an open basket, tucking any loose fabric beneath the rim.',
        shapes: [
          E(50, 40, 22, 8, -1),
          D('M28 40Q30 62 50 64Q70 62 72 40Z'),
          D('M28 40Q50 50 72 40Q50 44 28 40Z', 1),
        ],
        prop: 'plateSide',
      },
    },
  ];

  window.NapkinFolds.push(...EXTRA);
})();
