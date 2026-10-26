/*
 * Celebrations across faiths, cultures and seasons — with how to find their
 * dates, which folds suit them, and the colour theme the site switches to.
 *
 * Lunar / lunisolar dates come from published calendars and can vary by a day
 * depending on country, community and moon sighting.
 */
(function () {
  const ymd = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const fixed = (m, d) => (y) => new Date(y, m - 1, d);
  const table = (dates) => {
    const map = {};
    dates.forEach((s) => (map[s.slice(0, 4)] = s));
    return (y) => (map[y] ? ymd(map[y]) : null);
  };

  // Western (Gregorian) Easter — anonymous Gregorian algorithm
  function easter(y) {
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }

  // Orthodox Easter — Meeus Julian algorithm, converted to Gregorian (+13 days, valid 1900–2099)
  function orthodoxEaster(y) {
    const a = y % 4;
    const b = y % 7;
    const c = y % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    return new Date(y, month - 1, day + 13);
  }

  // US Thanksgiving — fourth Thursday of November
  function thanksgiving(y) {
    const first = new Date(y, 10, 1).getDay();
    return new Date(y, 10, 1 + ((4 - first + 7) % 7) + 21);
  }

  const TRADITIONS = [
    'Christian',
    'Jewish',
    'Muslim',
    'Hindu',
    'Sikh',
    'Buddhist',
    'East Asian',
    'Persian',
    'Cultural & Seasonal',
  ];

  const EVENTS = [
    {
      id: 'halloween',
      name: 'Halloween',
      emoji: '🎃',
      tradition: 'Cultural & Seasonal',
      origin: 'Celtic & Western',
      date: fixed(10, 31),
      days: 1,
      blurb: 'Pumpkins, costumes and a deliciously spooky supper.',
      tip: 'Orange and black napkins plus a few mini pumpkins make an instant haunted table.',
      folds: ['bat', 'witchhat'],
      why: {
        bat: 'Bats are a classic Halloween creature – this one is folded flat with pointed wings and ears.',
        witchhat: 'A pointed witch’s hat with a turned-up brim, straight from a Halloween fold guide.',
      },
      theme: { bg: '#1c1330', bg2: '#2d1b4a', surface: '#2a1f44', ink: '#fff4e6', muted: '#c9b8e6', primary: '#ff7a1a', onPrimary: '#1c1330', accent: '#9be15d', napkin: '#ff7a1a', napkin2: '#2b2b2b', table: '#3b2a20', dark: true, particles: ['🎃', '🦇', '🕸️', '👻', '🍬'] },
    },
    {
      id: 'dayofthedead',
      name: 'Día de los Muertos',
      emoji: '🌼',
      tradition: 'Cultural & Seasonal',
      origin: 'Mexican',
      date: fixed(11, 1),
      days: 2,
      blurb: 'Day of the Dead: a joyful remembrance of loved ones who have passed.',
      tip: 'Marigold (cempasúchil) colours echo the flowers used on ofrendas to guide spirits home.',
      folds: ['butterfly', 'candle', 'rose', 'rosebud'],
      why: {
        butterfly: 'Monarch butterflies arrive in Mexico around the Day of the Dead and are said to carry the spirits of loved ones.',
        candle: 'Candles are lit on every ofrenda to guide the spirits home.',
        rose: 'Flowers cover the ofrenda; a napkin rose joins the marigolds.',
        rosebud: 'A small bud for each place, like the flowers left on the ofrenda.',
      },
      theme: { bg: '#fff3e2', bg2: '#ffe0ec', surface: '#ffffff', ink: '#3b1f2b', muted: '#7a5866', primary: '#d6336c', onPrimary: '#ffffff', accent: '#ffb000', napkin: '#ff9f1c', napkin2: '#d6336c', table: '#6b3e26', particles: ['🌼', '💀', '🕯️', '🦋', '🌺'] },
    },
    {
      id: 'diwali',
      name: 'Diwali',
      emoji: '🪔',
      tradition: 'Hindu',
      origin: 'Also celebrated by Sikhs & Jains',
      date: table(['2025-10-20', '2026-11-08', '2027-10-29', '2028-10-17', '2029-11-05']),
      days: 5,
      blurb: 'The festival of lights — diyas, rangoli, sweets and family feasts.',
      tip: 'Set a diya beside each lotus fold (never inside the fabric) for a glowing place setting.',
      folds: ['lotus', 'candle'],
      why: {
        lotus: 'The lotus is the flower of Lakshmi, the goddess honoured on Diwali night.',
        candle: 'Diwali is the festival of lights – a napkin candle sits beside the diyas.',
      },
      theme: { bg: '#2a0f3d', bg2: '#4a1557', surface: '#3a1650', ink: '#fff1d6', muted: '#e6c6e8', primary: '#ffb300', onPrimary: '#2a0f3d', accent: '#ff4f8b', napkin: '#f39c12', napkin2: '#c2185b', table: '#5b2c1a', dark: true, particles: ['🪔', '✨', '🌸', '🎆', '🍬'] },
    },
    {
      id: 'thanksgiving',
      name: 'Thanksgiving',
      emoji: '🦃',
      tradition: 'Cultural & Seasonal',
      origin: 'American',
      date: thanksgiving,
      days: 1,
      blurb: 'A harvest feast with family and friends — and plenty of pie.',
      tip: 'Warm oranges and browns echo autumn leaves; a striped cutlery pocket keeps every place neat.',
      folds: ['turkey', 'fan', 'envelope'],
      why: {
        turkey: 'A napkin turkey for the Thanksgiving table, from a Thanksgiving fold guide.',
        fan: 'The standing fan, the same pleats used for the tail of a Thanksgiving turkey napkin.',
        envelope: 'A pocket for a written thank-you or the menu – the guide’s author made it for Thanksgiving.',
      },
      theme: { bg: '#fdf1e3', bg2: '#f7dcc0', surface: '#ffffff', ink: '#3d2414', muted: '#7d5a41', primary: '#c0561d', onPrimary: '#ffffff', accent: '#7a8b2c', napkin: '#d97a2b', napkin2: '#7a8b2c', table: '#8b5a2b', particles: ['🍂', '🍁', '🥧', '🌽', '🦃'] },
    },
    {
      id: 'hanukkah',
      name: 'Hanukkah',
      emoji: '🕎',
      tradition: 'Jewish',
      origin: 'Begins at sundown',
      date: table(['2025-12-14', '2026-12-04', '2027-12-24', '2028-12-12', '2029-12-01']),
      days: 8,
      blurb: 'Eight nights of light, latkes, sufganiyot and spinning dreidels.',
      tip: 'Blue and white napkins echo the menorah’s glow — a candle fold nods to each night’s new light.',
      folds: ['candle'],
      why: {
        candle: 'Hanukkah is the festival of lights; a row of napkin candles echoes the menorah.',
      },
      theme: { bg: '#eef4ff', bg2: '#d9e6ff', surface: '#ffffff', ink: '#14244a', muted: '#4f6290', primary: '#1f4fbf', onPrimary: '#ffffff', accent: '#e2b33c', napkin: '#2e63d6', napkin2: '#ffffff', table: '#7d6a55', particles: ['🕎', '✨', '⭐', '🔵', '🍩'] },
    },
    {
      id: 'christmas',
      name: 'Christmas',
      emoji: '🎄',
      tradition: 'Christian',
      origin: 'Also widely celebrated culturally',
      date: fixed(12, 24),
      days: 2,
      blurb: 'Celebrating the birth of Jesus with carols, candles and a festive feast.',
      tip: 'Green napkins folded into little trees bring the forest to the table.',
      folds: ['tree', 'elfhat', 'elfshoe', 'mitre', 'crown', 'candle'],
      why: {
        tree: 'A tiered Christmas tree.',
        elfhat: 'A pointed elf hat for Santa’s helpers.',
        elfshoe: 'A curly-toed elf shoe.',
        mitre: 'The bishop’s mitre of St Nicholas, the saint behind Santa Claus.',
        crown: 'A crown for the Three Kings of the Nativity story.',
        candle: 'Candles for Advent and the Christmas Eve candlelight service.',
      },
      theme: { bg: '#fbf6ee', bg2: '#f3e3d3', surface: '#ffffff', ink: '#2b1d16', muted: '#6e5a4e', primary: '#c0392b', onPrimary: '#ffffff', accent: '#1e7a46', napkin: '#1e7a46', napkin2: '#c0392b', table: '#7a4a2a', particles: ['❄️', '🎄', '⭐', '🎁', '🔔'] },
    },
    {
      id: 'kwanzaa',
      name: 'Kwanzaa',
      emoji: '🕯️',
      tradition: 'Cultural & Seasonal',
      origin: 'African-American & Pan-African',
      date: fixed(12, 26),
      days: 7,
      blurb: 'Seven days honouring African heritage, family and community, ending with the Karamu feast.',
      tip: 'Red, black and green napkins mirror the seven candles (mishumaa saba) of the kinara.',
      folds: ['candle', 'basket'],
      why: {
        candle: 'Seven candles are lit in the kinara, one for each principle of Kwanzaa.',
        basket: 'Kwanzaa is rooted in harvest festivals; the mazao (crops) are shown in a basket.',
      },
      theme: { bg: '#fff6e8', bg2: '#f4e2c4', surface: '#ffffff', ink: '#1b1410', muted: '#5f4c3b', primary: '#b3261e', onPrimary: '#ffffff', accent: '#1f7a3d', napkin: '#b3261e', napkin2: '#1f7a3d', table: '#4a2e1d', particles: ['🕯️', '🌽', '🧺', '✨', '🎁'] },
    },
    {
      id: 'newyearseve',
      name: "New Year's Eve",
      emoji: '🥂',
      tradition: 'Cultural & Seasonal',
      origin: 'Worldwide',
      date: fixed(12, 31),
      days: 1,
      blurb: 'Count down to midnight in style.',
      tip: 'Gold napkins and a crisp handkerchief fold give every seat a black-tie feel.',
      folds: ['partyhat', 'crown'],
      why: {
        partyhat: 'A pointed party hat for the countdown.',
        crown: 'Crown the year – a festive centrepiece fold for the midnight dinner.',
      },
      theme: { bg: '#0d1030', bg2: '#1c1f4a', surface: '#181b40', ink: '#fdf6e3', muted: '#b7b9d9', primary: '#f5c542', onPrimary: '#0d1030', accent: '#ff5fa2', napkin: '#e0b84a', napkin2: '#1b1b3a', table: '#2a2236', dark: true, particles: ['🎉', '🥂', '✨', '🎆', '🎊'] },
    },
    {
      id: 'lunarnewyear',
      name: 'Lunar New Year',
      emoji: '🧧',
      tradition: 'East Asian',
      origin: 'Chinese New Year, Seollal, Tết & more',
      date: table(['2025-01-29', '2026-02-17', '2027-02-06', '2028-01-26', '2029-02-13']),
      days: 15,
      blurb: 'Reunion dinners, red envelopes and wishes for luck in the year ahead.',
      tip: 'Red and gold mean luck and prosperity, and an envelope fold echoes the red envelopes (hóngbāo) given as gifts.',
      folds: ['envelope', 'fan'],
      why: {
        envelope: 'Red envelopes (hóngbāo) of lucky money are given at Lunar New Year – fold it in red.',
        fan: 'Fans are a traditional good-luck decoration for the new year.',
      },
      theme: { bg: '#fff1ec', bg2: '#ffd9cc', surface: '#ffffff', ink: '#3a0d08', muted: '#7d3b30', primary: '#d7261e', onPrimary: '#ffffff', accent: '#f2b705', napkin: '#d7261e', napkin2: '#f2b705', table: '#5a1e14', particles: ['🧧', '🏮', '🐉', '✨', '🍊'] },
    },
    {
      id: 'eidalfitr',
      name: 'Eid al-Fitr',
      emoji: '🌙',
      tradition: 'Muslim',
      origin: 'Marks the end of Ramadan',
      date: table(['2025-03-30', '2026-03-20', '2027-03-10', '2028-02-27', '2029-02-14']),
      days: 3,
      blurb: 'The joyful “festival of breaking the fast” — new clothes, gifts and generous feasts.',
      tip: 'An envelope fold at each place is a nod to Eidi, the gifts given to children.',
      folds: ['envelope'],
      why: {
        envelope: 'Eidi – gifts of money for children – is given in envelopes on Eid.',
      },
      theme: { bg: '#f1faf6', bg2: '#d7f0e5', surface: '#ffffff', ink: '#0d2b22', muted: '#476b5f', primary: '#0f7b5f', onPrimary: '#ffffff', accent: '#d4a72c', napkin: '#0f7b5f', napkin2: '#d4a72c', table: '#7a5636', particles: ['🌙', '✨', '⭐', '🎁', '🍬'] },
    },
    {
      id: 'valentines',
      name: "Valentine's Day",
      emoji: '💘',
      tradition: 'Cultural & Seasonal',
      origin: 'Worldwide',
      date: fixed(2, 14),
      days: 1,
      blurb: 'Love, roses and a dinner for two (or for all your favourite people).',
      tip: 'A heart fold at every place is pure romance.',
      folds: ['heart', 'rose', 'rosebud', 'swan'],
      why: {
        heart: 'A heart, of course.',
        rose: 'Roses are the Valentine’s flower.',
        rosebud: 'A single rosebud for each place.',
        swan: 'Swans pair for life – a romantic symbol, best set as a facing pair.',
      },
      theme: { bg: '#fff0f4', bg2: '#ffd6e2', surface: '#ffffff', ink: '#4a0f24', muted: '#8a4a60', primary: '#e0245e', onPrimary: '#ffffff', accent: '#ff8fb1', napkin: '#e0245e', napkin2: '#ffffff', table: '#8a4b5a', particles: ['💖', '💌', '🌹', '💕', '✨'] },
    },
    {
      id: 'stpatricks',
      name: "St Patrick's Day",
      emoji: '☘️',
      tradition: 'Christian',
      origin: 'Irish',
      date: fixed(3, 17),
      days: 1,
      blurb: 'Honouring Ireland’s patron saint with music, dancing and plenty of green.',
      tip: 'Go green! Every shade of green napkin works.',
      folds: ['shamrock'],
      why: {
        shamrock: 'The shamrock St Patrick used to explain the Trinity.',
      },
      theme: { bg: '#effaf0', bg2: '#d4f0d8', surface: '#ffffff', ink: '#0f2a17', muted: '#466b51', primary: '#1f9d55', onPrimary: '#ffffff', accent: '#f2c94c', napkin: '#1f9d55', napkin2: '#f2c94c', table: '#6b4a2b', particles: ['☘️', '🍀', '🌈', '✨', '🪙'] },
    },
    {
      id: 'nowruz',
      name: 'Nowruz',
      emoji: '🌱',
      tradition: 'Persian',
      origin: 'Persian New Year at the spring equinox',
      date: table(['2025-03-20', '2026-03-20', '2027-03-21', '2028-03-20', '2029-03-20']),
      days: 13,
      blurb: 'A new day, a new year: spring cleaning, family visits and the Haft-sin table.',
      tip: 'Fresh greens and blossom pinks echo the sabzeh (sprouts) on the Haft-sin spread.',
      folds: ['rose', 'rosebud', 'butterfly'],
      why: {
        rose: 'Nowruz falls with the spring flowers; roses and rosewater are part of the Persian new year table.',
        rosebud: 'Spring buds for the new year.',
        butterfly: 'A butterfly for the first day of spring.',
      },
      theme: { bg: '#f4fbf2', bg2: '#dff2da', surface: '#ffffff', ink: '#1c3020', muted: '#557159', primary: '#3f8f4f', onPrimary: '#ffffff', accent: '#e85d8a', napkin: '#7cbf6b', napkin2: '#e85d8a', table: '#8a6a44', particles: ['🌱', '🌷', '🐟', '🍎', '✨'] },
    },
    {
      id: 'easter',
      name: 'Easter',
      emoji: '🐣',
      tradition: 'Christian',
      origin: 'Western churches',
      date: easter,
      days: 1,
      blurb: 'Celebrating the resurrection of Jesus — and spring, with eggs and family lunches.',
      tip: 'A bunny fold at each place is a sure-fire hit with children.',
      folds: ['bunny', 'basket', 'arum', 'butterfly'],
      why: {
        bunny: 'The Easter bunny.',
        basket: 'An Easter basket – a hollow pocket for a chocolate egg or treat.',
        arum: 'The Arum (calla) lily is the Easter lily, the flower of the Resurrection.',
        butterfly: 'The butterfly is a Christian symbol of the Resurrection.',
      },
      theme: { bg: '#fbf7ff', bg2: '#ece3ff', surface: '#ffffff', ink: '#2b2140', muted: '#6c5f87', primary: '#8e6bd6', onPrimary: '#ffffff', accent: '#f7b267', napkin: '#b9a3ec', napkin2: '#ffd6e8', table: '#b98a5b', particles: ['🐣', '🌷', '🥚', '🐰', '🌼'] },
    },
    {
      id: 'pascha',
      name: 'Orthodox Easter (Pascha)',
      emoji: '🥚',
      tradition: 'Christian',
      origin: 'Eastern Orthodox churches',
      date: orthodoxEaster,
      days: 1,
      blurb: 'Christ is Risen! A joyful feast after Lent, with red eggs and sweet breads.',
      tip: 'Red-dyed eggs are a Pascha tradition — deep red napkins tie the whole table together.',
      folds: ['candle', 'mitre', 'arum', 'basket'],
      why: {
        candle: 'The Paschal candle is lit at the Orthodox midnight service.',
        mitre: 'A bishop’s mitre for the Paschal liturgy.',
        arum: 'The lily, flower of the Resurrection.',
        basket: 'Easter baskets of food are blessed in church on Holy Saturday.',
      },
      theme: { bg: '#fff7f3', bg2: '#fde0d6', surface: '#ffffff', ink: '#3a1010', muted: '#7d4a44', primary: '#b22222', onPrimary: '#ffffff', accent: '#d4a017', napkin: '#c62828', napkin2: '#d4a017', table: '#6b4a2b', particles: ['🥚', '🕯️', '🌿', '✨', '🌸'] },
    },
    {
      id: 'passover',
      name: 'Passover (Pesach)',
      emoji: '🍷',
      tradition: 'Jewish',
      origin: 'First Seder at sundown',
      date: table(['2025-04-12', '2026-04-01', '2027-04-21', '2028-04-10', '2029-03-30']),
      days: 8,
      blurb: 'Retelling the Exodus at the Seder, with matzah, four cups and the questions of the youngest.',
      tip: 'Crisp white or blue napkins suit the Seder table; keep the three matzot in a proper matzah cover.',
      folds: ['pyramid'],
      why: {
        pyramid: 'The pyramids of Egypt, where the Passover story begins.',
      },
      theme: { bg: '#f6f3ea', bg2: '#e6e0cf', surface: '#ffffff', ink: '#1a2740', muted: '#56627a', primary: '#2d5f9a', onPrimary: '#ffffff', accent: '#b08d57', napkin: '#f4f1ea', napkin2: '#2d5f9a', table: '#7b5b3a', particles: ['🍷', '🌿', '🫓', '✨', '⭐'] },
    },
    {
      id: 'vesak',
      name: 'Vesak',
      emoji: '🪷',
      tradition: 'Buddhist',
      origin: 'Date follows the full moon & varies by country',
      date: table(['2025-05-12', '2026-05-31', '2027-05-20', '2028-05-09', '2029-05-27']),
      days: 1,
      blurb: 'Honouring the birth, enlightenment and passing of the Buddha with lanterns, offerings and kindness.',
      tip: 'The lotus — rising pure from muddy water — is a fitting fold for Vesak.',
      folds: ['lotus', 'candle'],
      why: {
        lotus: 'The lotus is the Buddhist symbol of enlightenment; legend says lotuses sprang up where the infant Buddha stepped.',
        candle: 'Lanterns and candles are lit on Vesak to honour the Buddha.',
      },
      theme: { bg: '#fffdf3', bg2: '#fff0c9', surface: '#ffffff', ink: '#2d2110', muted: '#6f6043', primary: '#c97a00', onPrimary: '#ffffff', accent: '#e85d9a', napkin: '#f2a7c3', napkin2: '#f6c35b', table: '#8a6a44', particles: ['🪷', '🏮', '✨', '🕯️', '🌸'] },
    },
    {
      id: 'midsummer',
      name: 'Summer Garden Party',
      emoji: '🌻',
      tradition: 'Cultural & Seasonal',
      origin: 'Around the summer solstice',
      date: fixed(6, 21),
      days: 1,
      blurb: 'Long days, picnic blankets and dinner outdoors.',
      tip: 'Sunny yellows and a fan or bow fold keep things bright and breezy.',
      folds: ['fan', 'butterfly', 'paradise', 'rose', 'wrap'],
      why: {
        fan: 'A standing fan for a summer table.',
        butterfly: 'Butterflies for a garden party.',
        paradise: 'The bird of paradise flower.',
        rose: 'A garden rose.',
        wrap: 'A cutlery roll that is easy to pick up at a picnic or buffet.',
      },
      theme: { bg: '#f2fbff', bg2: '#d9f2fb', surface: '#ffffff', ink: '#13303a', muted: '#4c6b75', primary: '#ff8a3d', onPrimary: '#ffffff', accent: '#2bb3a3', napkin: '#ffd166', napkin2: '#2bb3a3', table: '#b98a5b', particles: ['🌻', '☀️', '🍓', '🦋', '🍉'] },
    },
    {
      id: 'midautumn',
      name: 'Mid-Autumn Festival',
      emoji: '🥮',
      tradition: 'East Asian',
      origin: 'Also Chuseok (Korea) & Tết Trung Thu (Vietnam)',
      date: table(['2025-10-06', '2026-09-25', '2027-09-15', '2028-10-03', '2029-09-22']),
      days: 1,
      blurb: 'Moon-gazing, lanterns and mooncakes shared with family under the full moon.',
      tip: 'Legend says a Jade Rabbit lives on the moon — so a bunny fold is perfect here!',
      folds: ['bunny', 'lotus'],
      why: {
        bunny: 'The Jade Rabbit lives on the moon in the Mid-Autumn legend.',
        lotus: 'Lotus seed paste fills the traditional mooncakes.',
      },
      theme: { bg: '#1a2340', bg2: '#27335c', surface: '#222d52', ink: '#fff7e0', muted: '#c3c9e3', primary: '#f7c948', onPrimary: '#1a2340', accent: '#e8836b', napkin: '#f4b942', napkin2: '#e8836b', table: '#3b2a20', dark: true, particles: ['🥮', '🌕', '🏮', '🐇', '✨'] },
    },
    {
      id: 'roshhashanah',
      name: 'Rosh Hashanah',
      emoji: '🍎',
      tradition: 'Jewish',
      origin: 'Jewish New Year, begins at sundown',
      date: table(['2025-09-22', '2026-09-11', '2027-10-01', '2028-09-20', '2029-09-09']),
      days: 2,
      blurb: 'The Jewish New Year: apples dipped in honey and round challah for a sweet year ahead.',
      tip: 'Honey-gold napkins with a rose fold make the table feel sweet — Shanah Tovah!',
      folds: ['crown'],
      why: {
        crown: 'God is crowned King on Rosh Hashanah, and the round challah is shaped like a crown.',
      },
      theme: { bg: '#fffaf0', bg2: '#ffecc7', surface: '#ffffff', ink: '#3a1a10', muted: '#7a5a3e', primary: '#b8322a', onPrimary: '#ffffff', accent: '#d9a21b', napkin: '#e2a72e', napkin2: '#b8322a', table: '#7a5636', particles: ['🍎', '🍯', '🐝', '✨', '🍏'] },
    },
  ];

  const DAY = 86400000;
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY);

  // Next (or current) occurrence of an event relative to `today`.
  function occurrence(ev, today) {
    const t = startOfDay(today);
    for (let y = t.getFullYear() - 1; y <= t.getFullYear() + 2; y++) {
      const start = ev.date(y);
      if (!start) continue;
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + ev.days - 1);
      if (end >= t) {
        const until = daysBetween(t, start);
        return { start, end, until, ongoing: until <= 0 };
      }
    }
    return null;
  }

  // Every event with its next occurrence, soonest (or happening now) first.
  function upcoming(today) {
    return EVENTS.map((ev) => ({ ev, occ: occurrence(ev, today) }))
      .filter((x) => x.occ)
      .sort((a, b) => Math.max(0, a.occ.until) - Math.max(0, b.occ.until) || b.occ.until - a.occ.until);
  }

  // The celebration the site should open on.
  function mostRelevant(today) {
    const list = upcoming(today);
    return list.length ? list[0].ev : EVENTS[0];
  }

  window.NapkinEvents = { EVENTS, TRADITIONS, occurrence, upcoming, mostRelevant, easter, orthodoxEaster, thanksgiving };
})();
