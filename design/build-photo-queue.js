// Renders a clean reference image (no arrows/lines) of every finished napkin to
// design/refs/<fold>-final.jpg and writes design/photo-queue.json with a Canva
// prompt for each. Run: node design/build-photo-queue.js <git-sha-for-ref-urls>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const NAMED = {
  'saffron orange': '#f28c00', orange: '#ff7a1a', 'marigold orange': '#ff9f1c', 'burnt orange': '#d97a2b',
  'soft lavender': '#b9a3ec', 'forest green': '#1e7a46', 'emerald green': '#0f7b5f', 'sage green': '#7cbf6b',
  'royal blue': '#2e63d6', 'steel blue': '#2a6f97', teal: '#1f8a8a', 'ivory white': '#f4f1ea',
  'golden yellow': '#e0b84a', 'sunny yellow': '#ffd166', 'raspberry red': '#e0245e', red: '#d7261e',
  'deep red': '#b3261e', 'blush pink': '#f2a7c3', 'honey gold': '#e2a72e', 'charcoal black': '#2b2b2b',
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const colourName = (h) =>
  Object.entries(NAMED).sort((a, b) => {
    const d = (x) => hex(x).reduce((s, v, i) => s + (v - hex(h)[i]) ** 2, 0);
    return d(a[1]) - d(b[1]);
  })[0][0];

(async () => {
  const sha = process.argv[2] || 'main';
  const outDir = path.join(__dirname, 'refs');
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 640 } });
  await p.goto('file://' + path.join(__dirname, '..', 'public', 'index.html'));
  const folds = await p.evaluate(() => {
    const { EVENTS } = window.NapkinEvents;
    return window.NapkinFolds.map((f) => {
      const ev = EVENTS.find((e) => e.folds[0] === f.id) || EVENTS.find((e) => e.folds.includes(f.id));
      return { id: f.id, name: f.name, blurb: f.blurb, final: f.final.text, prop: f.final.prop, theme: ev.theme };
    });
  });
  const old = fs.existsSync(path.join(__dirname, 'photo-queue.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'photo-queue.json'))) : [];
  const queue = [];
  for (const f of folds) {
    await p.evaluate(([id, theme]) => {
      const fold = window.NapkinFolds.find((x) => x.id === id);
      document.body.style.margin = 0;
      document.body.innerHTML = `<div id=s style="width:800px;height:640px">${window.NapkinRender.scene({ ...fold.final, arrows: [], lines: [], flip: false }, theme)}</div>`;
    }, [f.id, f.theme]);
    await p.locator('#s').screenshot({ path: path.join(outDir, `${f.id}-final.jpg`), type: 'jpeg', quality: 85 });
    const view = f.prop === 'plate' ? 'Overhead top-down view' : 'Eye-level three-quarter view';
    const setting = f.prop === 'glass' ? 'tucked into a clear wine glass' : f.prop ? 'on a white ceramic dinner plate' : 'lying on the table';
    const prev = old.find((q) => q.name === `${f.id}-final`);
    queue.push({
      name: `${f.id}-final`,
      ref: `https://raw.githubusercontent.com/madmonkeyfpv/Napkins/${sha}/design/refs/${f.id}-final.jpg`,
      prompt:
        `Photorealistic photograph that recreates this reference image exactly: same composition, framing, napkin shape and colours. ` +
        `The finished "${f.name}" napkin fold (${f.blurb}) made from ${/^[aeiou]/.test(colourName(f.theme.napkin)) ? "an" : "a"} ${colourName(f.theme.napkin)} starched cotton-linen napkin, ${setting}, on a warm wooden dining table. ` +
        `Real woven fabric texture and crisp folds. ${view}, soft natural window light from the upper left, gentle realistic shadows, professional food-styling photography, sharp focus. No hands, no text.`,
      status: prev && prev.status === 'done' ? 'done' : 'todo',
    });
  }
  fs.writeFileSync(path.join(__dirname, 'photo-queue.json'), JSON.stringify(queue, null, 1) + '\n');
  console.log(queue.filter((q) => q.status === 'todo').length, 'to do of', queue.length);
  await b.close();
})();
