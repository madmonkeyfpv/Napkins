# Fold & Feast 🪭

A friendly napkin-folding web app for celebrations from many faiths, cultures and seasons.

- **Picks the right celebration on its own.** When the page opens it shows the celebration that's on now or coming up next (Halloween, Diwali, Hanukkah, Ramadan, Lunar New Year, Passover, Vesak and more: 24 in all).
- **Changes its look for each celebration.** Colours, floating emoji and the napkin colours in every picture all switch to match the celebration you pick.
- **Step-by-step guides.** 13 folds, from the Classic Fan to the Bishop's Crown. Each has an illustrated step-by-step guide and a picture of the finished napkin, plus keyboard and swipe controls, an "all steps" view and a print-friendly layout.
- **Suggests folds.** Each celebration recommends three folds, but you can browse every fold.

## Run it

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

It also works as-is on GitHub Pages.

Handy URL options:

- `?date=2027-02-20`: preview the site as if it were another day (the site chooses its celebration from the date).
- `#event=diwali&fold=lotus&step=3`: link straight to a celebration, fold and step.

## Project layout

| File | What it does |
| --- | --- |
| `js/events.js` | Celebrations: dates (fixed, calculated like Easter and Thanksgiving, or looked up from a table for lunar calendars), blurbs, tips, recommended folds and colour themes |
| `js/folds.js` | Fold library: steps, instructions and the shapes for each picture |
| `js/render.js` | Draws each step as a photo-style SVG: a napkin on a wooden table with lighting, shadows and a linen texture |
| `js/app.js` | The page itself: picking the default celebration, theming, the step guide and links |
| `tests/dates.test.js` | `node tests/dates.test.js` checks the date maths, the default celebration and the data |

## Adding real photographs

The step pictures are drawn in the browser so that they take on each celebration's colours. To show a real photo for a step or a finished napkin instead, add `photo` to that step in `js/folds.js`:

```js
{ title: 'Fold in half', text: '…', photo: 'images/fan-1.jpg', shapes: [...] }
// or for the finished napkin
final: { text: '…', photo: 'images/fan-final.jpg', shapes: [...] }
```

## A note on dates

Lunar and lunisolar festivals (Eid, Ramadan, Diwali, Holi, Hanukkah, Passover, Vesak and others) use a table of dates for 2025–2029. These dates can differ by a day or so depending on the country, the community and moon sighting. Extend the tables in `js/events.js` to cover later years.
