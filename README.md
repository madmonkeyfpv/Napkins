# Fold & Feast 🪭

A friendly napkin-folding web app for celebrations from many faiths, cultures and seasons.

- **Picks the right celebration on its own.** When the page opens it shows the celebration that's on now or coming up next (Halloween, Diwali, Hanukkah, Ramadan, Lunar New Year, Passover, Vesak and more: 24 in all).
- **Changes its look for each celebration.** Colours, floating emoji and the napkin colours in every picture all switch to match the celebration you pick.
- **Step-by-step guides.** 26 folds, from a Halloween Bat and Witch's Hat to a Christmas Tree, Thanksgiving Turkey and Easter Bunny. Each has an illustrated step-by-step guide and a picture of the finished napkin, plus keyboard and swipe controls, an "all steps" view and a print-friendly layout.
- **Published, sourced instructions.** Every fold follows a published guide step by step, with nothing summarised or left out, and the guide page links to it. Every fold needs only napkins: no ribbons, rings or other extras.
- **Accurate pictures.** Flat steps are drawn by a fold simulator that really folds the napkin along each crease, so every picture shows the shape that fold gives. Steps that stand up or roll the napkin are drawn from the source's photos.
- **Folds that fit.** Each celebration lists only folds that genuinely belong to it, with the reason shown on the card (the Jade Rabbit for Mid-Autumn, red envelopes for Lunar New Year). You can still browse every fold.

## Run it

It's a static site with no build step. Open `public/index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000 -d public   # then visit http://localhost:8000
```

## Deploy (Cloudflare Workers)

`wrangler.jsonc` deploys `public/` as static assets to the `napkins` Worker, with no Worker script needed:

```sh
npx wrangler deploy
```

Workers Builds is connected to this repo, so every merge to `main` deploys automatically. If deploys stop, check Workers & Pages → napkins → Settings → Builds: the project must show as connected to `madmonkeyfpv/Napkins`.

Handy URL options:

- `?date=2027-02-20`: preview the site as if it were another day (the site chooses its celebration from the date).
- `#event=diwali&fold=lotus&step=3`: link straight to a celebration, fold and step.

## Project layout

| File | What it does |
| --- | --- |
| `public/js/events.js` | Celebrations: dates (fixed, calculated like Easter and Thanksgiving, or looked up from a table for lunar calendars), blurbs, tips, recommended folds and colour themes |
| `public/js/kit.js` | Shared drawing helpers and the list of published sources |
| `public/js/foldsim.js` | Fold simulator: folds a napkin along each step's crease and draws the result |
| `public/js/library-1.js`, `library-2.js` | The fold library: every step's text, the fold it makes, and drawings for standing or rolled steps |
| `public/js/photos.js` | Which steps have a photo in `public/images/` |
| `public/js/render.js` | Draws each step as a photo-style SVG: a napkin on a wooden table with lighting, shadows and a linen texture |
| `public/js/app.js` | The page itself: picking the default celebration, theming, the step guide and links |
| `tests/dates.test.js` | `node tests/dates.test.js` checks the date maths, the default celebration and the data |

## Adding real photographs

The step pictures are drawn in the browser so that they take on each celebration's colours. To show a real photo for a step or a finished napkin instead, add its name to `public/js/photos.js` (`<fold>-<step>` or `<fold>-final`) (put the images in `public/images/`):

```js
window.NapkinPhotos = ['fan-1', 'fan-final'];  // images/fan-1.jpg, images/fan-final.jpg
```

## A note on dates

Lunar and lunisolar festivals (Eid, Diwali, Hanukkah, Passover, Vesak and others) use a table of dates for 2025–2029. These dates can differ by a day or so depending on the country, the community and moon sighting. Extend the tables in `public/js/events.js` to cover later years.
