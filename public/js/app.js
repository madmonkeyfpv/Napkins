(function () {
  const { scene } = window.NapkinRender;
  const FOLDS = window.NapkinFolds;
  const { EVENTS, TRADITIONS, occurrence, upcoming, mostRelevant } = window.NapkinEvents;

  const $ = (sel) => document.querySelector(sel);
  const foldById = (id) => FOLDS.find((f) => f.id === id);
  const eventById = (id) => EVENTS.find((e) => e.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ?date=YYYY-MM-DD lets you preview the site as if it were another day
  function today() {
    const q = new URLSearchParams(location.search).get('date');
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) {
      const [y, m, d] = q.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }

  const TODAY = today();
  const DEFAULT_EVENT = mostRelevant(TODAY);

  const state = {
    event: DEFAULT_EVENT,
    fold: null,
    step: 0,
    filter: 'All',
    showAll: false,
    view: 'photo',
  };

  // ---------------------------------------------------------------- helpers
  const fmtDate = (d, opts) => d.toLocaleDateString(undefined, opts || { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  function whenLabel(occ) {
    if (!occ) return '';
    if (occ.ongoing && occ.until < 0) return 'Happening now 🎉';
    if (occ.until === 0) return 'Today! 🎉';
    if (occ.until === 1) return 'Tomorrow';
    if (occ.until < 60) return `In ${occ.until} days`;
    const months = Math.round(occ.until / 30.4);
    return `In ${months} month${months === 1 ? '' : 's'}`;
  }

  function dateRange(occ) {
    if (!occ) return '';
    if (+occ.start === +occ.end) return fmtDate(occ.start);
    const sameYear = occ.start.getFullYear() === occ.end.getFullYear();
    const a = fmtDate(occ.start, { day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) });
    const b = fmtDate(occ.end, { day: 'numeric', month: 'short', year: 'numeric' });
    return `${a} – ${b}`;
  }

  // Photos listed in photos.js (images/<fold>-<step>.jpg, images/<fold>-final.jpg)
  const PHOTOS = new Set(window.NapkinPhotos || []);
  const photoPath = (fold, i) => {
    const name = i >= fold.steps.length ? `${fold.id}-final` : `${fold.id}-${i + 1}`;
    return PHOTOS.has(name) ? `images/${name}.jpg` : null;
  };

  function photo(step, theme, label) {
    if (step.photo && state.view === 'photo') return `<img src="${esc(step.photo)}" alt="${esc(label)}" loading="lazy">`;
    return scene(step, theme, { label });
  }

  function foldSteps(fold) {
    const steps = [...fold.steps, { ...fold.final, title: 'Ta-da! The finished napkin', final: true }];
    return steps.map((s, i) => ({ ...s, photo: s.photo || photoPath(fold, i) }));
  }

  const finalOf = (fold) => foldSteps(fold)[fold.steps.length];

  // ---------------------------------------------------------------- theme
  function applyTheme(ev) {
    const t = ev.theme;
    const root = document.documentElement;
    const vars = {
      '--bg': t.bg,
      '--bg2': t.bg2,
      '--surface': t.surface,
      '--ink': t.ink,
      '--muted': t.muted,
      '--primary': t.primary,
      '--on-primary': t.onPrimary,
      '--accent': t.accent,
      '--napkin': t.napkin,
    };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.dataset.mode = t.dark ? 'dark' : 'light';
    root.dataset.event = ev.id;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', t.bg);
    document.title = `${ev.name} napkin folding — Fold & Feast`;
    renderParticles(t.particles);
  }

  function renderParticles(list) {
    const host = $('.particles');
    host.innerHTML = '';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.textContent = list[i % list.length];
      s.style.left = `${(i * 7.3 + Math.random() * 6) % 100}%`;
      s.style.fontSize = `${14 + Math.random() * 18}px`;
      s.style.animationDuration = `${18 + Math.random() * 18}s`;
      s.style.animationDelay = `${-Math.random() * 30}s`;
      s.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
      host.appendChild(s);
    }
  }

  // ---------------------------------------------------------------- hero
  function renderHero() {
    const ev = state.event;
    const occ = occurrence(ev, TODAY);
    const isDefault = ev === DEFAULT_EVENT;
    $('#hero-eyebrow').textContent = isDefault ? (occ && occ.until <= 0 ? 'Celebrating now' : 'Coming up next') : 'Your celebration';
    $('#hero-emoji').textContent = ev.emoji;
    $('#hero-name').textContent = ev.name;
    $('#hero-date').textContent = dateRange(occ) + (ev.origin ? ` · ${ev.origin}` : '');
    $('#hero-countdown').textContent = whenLabel(occ);
    $('#hero-blurb').textContent = ev.blurb;
    $('#hero-tip').textContent = ev.tip;
    const fold = foldById(ev.folds[0]);
    $('#hero-cta').textContent = `Fold a ${fold.name} ${fold.emoji}`;
    $('#hero-cta').onclick = (e) => {
      e.preventDefault();
      selectFold(fold.id, true);
    };
    $('#hero-photo').innerHTML =
      photo(finalOf(fold), ev.theme, `Finished ${fold.name} napkin for ${ev.name}`) +
      `<figcaption>${esc(fold.name)} for ${esc(ev.name)}</figcaption>`;
  }

  // ---------------------------------------------------------------- events
  function renderFilters() {
    const used = new Set(EVENTS.map((e) => e.tradition));
    const opts = ['All', ...TRADITIONS.filter((t) => used.has(t))];
    $('#filters').innerHTML = opts
      .map((t) => `<button type="button" class="chip" data-filter="${esc(t)}" aria-pressed="${t === state.filter}">${esc(t)}</button>`)
      .join('');
  }

  function renderEvents() {
    const list = upcoming(TODAY).filter(({ ev }) => state.filter === 'All' || ev.tradition === state.filter);
    $('#event-grid').innerHTML = list
      .map(({ ev, occ }) => {
        const t = ev.theme;
        const selected = ev === state.event;
        return `
        <button type="button" class="event-card${selected ? ' is-selected' : ''}" data-event="${ev.id}" aria-pressed="${selected}"
          style="--card-bg:${t.bg};--card-bg2:${t.bg2};--card-ink:${t.ink};--card-primary:${t.primary};--card-on:${t.onPrimary}">
          <span class="event-emoji" aria-hidden="true">${ev.emoji}</span>
          <span class="event-name">${esc(ev.name)}</span>
          <span class="event-trad">${esc(ev.tradition === 'Cultural & Seasonal' ? ev.origin : ev.tradition)}</span>
          <span class="event-date">${esc(fmtDate(occ.start, { day: 'numeric', month: 'short', year: 'numeric' }))}</span>
          <span class="event-when">${esc(whenLabel(occ))}</span>
        </button>`;
      })
      .join('');
  }

  // ---------------------------------------------------------------- folds
  function foldCard(fold, recommended) {
    const ev = state.event;
    const active = state.fold === fold;
    return `
      <button type="button" class="fold-card${active ? ' is-active' : ''}" data-fold="${fold.id}" aria-pressed="${active}">
        <span class="photo fold-photo">${photo(finalOf(fold), ev.theme, `Finished ${fold.name} napkin`)}</span>
        <span class="fold-info">
          <span class="fold-name">${fold.emoji} ${esc(fold.name)}</span>
          <span class="fold-blurb">${esc(fold.blurb)}</span>
          <span class="fold-tags">
            <span class="tag tag-${fold.difficulty.toLowerCase()}">${fold.difficulty}</span>
            <span class="tag">⏱ ${fold.minutes} min</span>
            <span class="tag">${fold.steps.length} steps</span>
            ${recommended ? '<span class="tag tag-star">★ Top pick</span>' : ''}
          </span>
        </span>
      </button>`;
  }

  function renderFolds() {
    const ev = state.event;
    const rec = ev.folds.map(foldById);
    const others = FOLDS.filter((f) => !ev.folds.includes(f.id));
    $('#folds-title').textContent = `Perfect folds for ${ev.name}`;
    $('#folds-sub').textContent = 'Hand-picked for the occasion — but every fold works for every table.';
    $('#fold-recommended').innerHTML = rec.map((f) => foldCard(f, true)).join('');
    $('#fold-others').innerHTML = others.map((f) => foldCard(f, false)).join('');
    $('#more-count').textContent = `(${others.length})`;
  }

  // ---------------------------------------------------------------- guide
  function renderGuide() {
    const fold = state.fold;
    const ev = state.event;
    const steps = foldSteps(fold);
    $('#guide-eyebrow').textContent = `${ev.emoji} ${ev.name} · step-by-step`;
    $('#guide-title').textContent = `${fold.emoji} ${fold.name}`;
    $('#guide-meta').innerHTML = `
      <li><span class="tag tag-${fold.difficulty.toLowerCase()}">${fold.difficulty}</span></li>
      <li>⏱ About ${fold.minutes} minutes</li>
      <li>📏 ${fold.steps.length} steps + finish</li>`;
    $('#toggle-view').hidden = !foldSteps(fold).some((s) => s.photo);
    $('#guide-tip').innerHTML =
      `<strong>Napkin tip:</strong> ${esc(fold.tip)}` +
      `<span class="sources">✅ Steps checked against: ${fold.sources
        .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`)
        .join(' · ')}</span>`;

    $('#thumbs').innerHTML = steps
      .map(
        (s, i) => `
        <li><button type="button" class="thumb${i === state.step ? ' is-current' : ''}" data-step="${i}" aria-label="${s.final ? 'Finished napkin' : `Step ${i + 1}: ${esc(s.title)}`}"${i === state.step ? ' aria-current="step"' : ''}>
          <span class="photo">${photo(s, ev.theme, '')}</span>
          <span class="thumb-label">${s.final ? '✨' : i + 1}</span>
        </button></li>`
      )
      .join('');

    $('#all-steps').innerHTML = steps
      .map(
        (s, i) => `
        <li class="all-step${s.final ? ' is-final' : ''}">
          <figure class="photo">${photo(s, ev.theme, s.final ? `Finished ${fold.name}` : `Step ${i + 1}: ${s.title}`)}</figure>
          <div><p class="step-count">${s.final ? 'Finished!' : `Step ${i + 1}`}</p><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
        </li>`
      )
      .join('');

    renderStep();
  }

  function renderStep() {
    const fold = state.fold;
    const ev = state.event;
    const steps = foldSteps(fold);
    const i = state.step;
    const s = steps[i];
    const label = s.final ? `Finished ${fold.name} napkin` : `Step ${i + 1}: ${s.title}`;

    const fig = $('#step-photo');
    fig.classList.toggle('is-final', !!s.final);
    fig.innerHTML = photo(s, ev.theme, label) + (s.final ? '<span class="ribbon">Ta-da!</span>' : `<span class="step-badge">${i + 1}</span>`);

    $('#step-count').textContent = s.final ? `Finished! · ${fold.name}` : `Step ${i + 1} of ${fold.steps.length}`;
    $('#step-title').textContent = s.title;
    $('#step-body').textContent = s.text;
    $('#progress-bar').style.width = `${((i + 1) / steps.length) * 100}%`;

    $('#prev').disabled = i === 0;
    const next = $('#next');
    if (s.final) next.textContent = '↺ Start again';
    else if (i === steps.length - 2) next.textContent = 'See the finished napkin ✨';
    else next.textContent = 'Next →';

    document.querySelectorAll('.thumb').forEach((b) => {
      const cur = +b.dataset.step === i;
      b.classList.toggle('is-current', cur);
      if (cur) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    const curThumb = document.querySelector('.thumb.is-current');
    if (curThumb && curThumb.scrollIntoView && $('#thumbs').scrollWidth > $('#thumbs').clientWidth) {
      const host = $('#thumbs');
      host.scrollTo({ left: curThumb.offsetLeft - host.clientWidth / 2 + curThumb.clientWidth / 2, behavior: 'smooth' });
    }

    if (s.final) celebrate();
    syncHash();
  }

  function go(delta) {
    const total = foldSteps(state.fold).length;
    if (delta > 0 && state.step === total - 1) state.step = 0;
    else state.step = Math.max(0, Math.min(total - 1, state.step + delta));
    renderStep();
  }

  // ---------------------------------------------------------------- confetti
  function celebrate() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = $('#confetti');
    const list = state.event.theme.particles;
    host.innerHTML = '';
    for (let i = 0; i < 28; i++) {
      const s = document.createElement('span');
      s.textContent = list[i % list.length];
      s.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
      s.style.setProperty('--x', `${(Math.random() - 0.5) * 90}vw`);
      s.style.setProperty('--y', `${-30 - Math.random() * 50}vh`);
      s.style.setProperty('--r', `${(Math.random() - 0.5) * 720}deg`);
      s.style.animationDelay = `${Math.random() * 0.25}s`;
      host.appendChild(s);
    }
    clearTimeout(celebrate.t);
    celebrate.t = setTimeout(() => (host.innerHTML = ''), 2600);
  }

  // ---------------------------------------------------------------- state changes
  function selectEvent(id, opts = {}) {
    const ev = eventById(id);
    if (!ev) return;
    state.event = ev;
    applyTheme(ev);
    renderHero();
    renderEvents();
    if (!opts.keepFold || !state.fold) {
      state.fold = foldById(ev.folds[0]);
      state.step = 0;
    }
    renderFolds();
    renderGuide();
  }

  function selectFold(id, scroll) {
    const fold = foldById(id);
    if (!fold) return;
    state.fold = fold;
    state.step = 0;
    renderFolds();
    renderGuide();
    if (scroll) $('#guide').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function syncHash() {
    const p = new URLSearchParams();
    p.set('event', state.event.id);
    p.set('fold', state.fold.id);
    if (state.step) p.set('step', state.step + 1);
    history.replaceState(null, '', `${location.pathname}${location.search}#${p}`);
  }

  function readHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    return { event: p.get('event'), fold: p.get('fold'), step: parseInt(p.get('step'), 10) };
  }

  // ---------------------------------------------------------------- events wiring
  function wire() {
    $('#filters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      state.filter = b.dataset.filter;
      renderFilters();
      renderEvents();
    });

    $('#event-grid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-event]');
      if (!b) return;
      selectEvent(b.dataset.event);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-fold]');
      if (b) selectFold(b.dataset.fold, true);
      const t = e.target.closest('[data-step]');
      if (t) {
        state.step = +t.dataset.step;
        renderStep();
      }
      if (e.target.closest('[data-home]')) {
        e.preventDefault();
        history.replaceState(null, '', location.pathname + location.search);
        selectEvent(DEFAULT_EVENT.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    $('#prev').addEventListener('click', () => go(-1));
    $('#next').addEventListener('click', () => go(1));

    $('#toggle-all').addEventListener('click', () => {
      state.showAll = !state.showAll;
      $('#toggle-all').setAttribute('aria-pressed', state.showAll);
      $('#toggle-all').textContent = state.showAll ? '👆 One at a time' : '📋 All steps';
      $('#stepper').hidden = state.showAll;
      $('#all-steps').hidden = !state.showAll;
    });

    $('#print').addEventListener('click', () => window.print());

    $('#toggle-view').addEventListener('click', () => {
      state.view = state.view === 'photo' ? 'diagram' : 'photo';
      $('#toggle-view').setAttribute('aria-pressed', state.view === 'diagram');
      $('#toggle-view').textContent = state.view === 'photo' ? '✏️ Diagram' : '📷 Photos';
      renderHero();
      renderFolds();
      renderGuide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select') || state.showAll) return;
      const r = $('#guide').getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });

    let sx = null;
    const photoEl = $('#step-photo');
    photoEl.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    photoEl.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
      sx = null;
    });
  }

  // ---------------------------------------------------------------- boot
  function boot() {
    renderFilters();
    wire();
    const h = readHash();
    const ev = (h.event && eventById(h.event)) || DEFAULT_EVENT;
    selectEvent(ev.id);
    if (h.fold && foldById(h.fold)) {
      state.fold = foldById(h.fold);
      const total = foldSteps(state.fold).length;
      state.step = h.step > 0 ? Math.min(total - 1, h.step - 1) : 0;
      renderFolds();
      renderGuide();
    }
  }

  boot();
})();
