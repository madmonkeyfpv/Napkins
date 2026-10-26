// Run with: node tests/dates.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
for (const f of ['render.js', 'folds.js', 'folds-extra.js', 'events.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'public', 'js', f), 'utf8'), ctx);
}
const { EVENTS, easter, orthodoxEaster, thanksgiving, mostRelevant, occurrence } = ctx.window.NapkinEvents;
const FOLDS = ctx.window.NapkinFolds;
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const day = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

// Computed holidays
assert.strictEqual(iso(easter(2025)), '2025-04-20');
assert.strictEqual(iso(easter(2026)), '2026-04-05');
assert.strictEqual(iso(easter(2027)), '2027-03-28');
assert.strictEqual(iso(orthodoxEaster(2025)), '2025-04-20');
assert.strictEqual(iso(orthodoxEaster(2026)), '2026-04-12');
assert.strictEqual(iso(orthodoxEaster(2027)), '2027-05-02');
assert.strictEqual(iso(thanksgiving(2026)), '2026-11-26');
assert.strictEqual(iso(thanksgiving(2027)), '2027-11-25');

// Default celebration follows the calendar
const cases = {
  '2026-10-26': 'halloween',
  '2026-11-01': 'dayofthedead',
  '2026-11-03': 'diwali',
  '2026-12-06': 'hanukkah',
  '2026-12-20': 'christmas',
  '2027-01-02': 'lunarnewyear',
  '2027-02-20': 'ramadan',
  '2027-04-15': 'passover',
  '2027-08-01': 'midautumn',
};
for (const [d, id] of Object.entries(cases)) {
  assert.strictEqual(mostRelevant(day(d)).id, id, `default on ${d}`);
}

// Every event has a date in the coming years and only references real folds
const ids = new Set(FOLDS.map((f) => f.id));
for (const ev of EVENTS) {
  assert.ok(occurrence(ev, day('2026-10-26')), `${ev.id} has an upcoming date`);
  assert.ok(occurrence(ev, day('2028-06-01')), `${ev.id} has a 2028/29 date`);
  ev.folds.forEach((f) => assert.ok(ids.has(f), `${ev.id} -> ${f}`));
}
for (const f of FOLDS) {
  assert.ok(f.steps.length >= 2 && f.final, `${f.id} has steps + final`);
  assert.ok(f.sources && f.sources.length >= 1, `${f.id} cites a published source`);
  f.steps.forEach((s, i) => assert.ok(s.title && s.text && s.shapes.length, `${f.id} step ${i + 1}`));
}
// Folds must need nothing but napkins (two napkins together is fine)
const extras = /\b(ribbon|napkin ring|glass|goblet|twine|string|clip|tape|place card|cotton ball|egg)\b/i;
for (const f of FOLDS) {
  for (const s of [...f.steps, f.final]) assert.ok(!extras.test(s.text), `${f.id}: "${s.text}" needs an extra item`);
  assert.ok(!extras.test(f.tip), `${f.id} tip mentions an extra item`);
}
console.log(`ok — ${EVENTS.length} celebrations, ${FOLDS.length} folds`);
