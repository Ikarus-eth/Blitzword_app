(async function () {
  'use strict';
  const Core = window.EnemySelection;
  const KEY = 'blitzword-enemy-finals-20261010-v1';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  let catalog, ids, state, index = 0, person = 'Artus', memoryOnly = false, serial = 0;
  const entity = () => catalog.entities[index];
  const round = () => state.rounds[entity().id];
  const button = (text, cls, action) => {
    const el = document.createElement('button');
    el.type = 'button'; el.textContent = text; el.className = cls;
    if (action) el.onclick = action;
    return el;
  };
  function status() {
    $('save-status').textContent = memoryOnly
      ? 'Not saved in this browser. Download your review before closing.'
      : 'Saved on this device · download to share or back up.';
    $('save-status').classList.toggle('error', memoryOnly);
  }
  function save(change) {
    let next = state;
    if (!memoryOnly) {
      try {
        const latest = localStorage.getItem(KEY);
        if (latest) next = Core.validate(JSON.parse(latest), ids);
      } catch { memoryOnly = true; }
    }
    change(next);
    state = next;
    if (!memoryOnly) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); }
      catch { memoryOnly = true; }
    }
    status();
  }
  function svgNode(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }
  function artwork(option) {
    const width = option.width || 1536, height = option.height || 1024;
    const cellWidth = width / option.columns, cellHeight = height / option.rows;
    const [x, y, w, h] = option.crop || [cellWidth * option.column, cellHeight * option.row, cellWidth, cellHeight];
    const clipId = 'art-' + (++serial);
    const svg = svgNode('svg', { viewBox: [x, y, w, h].join(' '), preserveAspectRatio: 'xMidYMid meet', role: 'img', 'aria-label': entity().name + ' · ' + option.title });
    const defs = svgNode('defs', {}), clip = svgNode('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' });
    clip.append(svgNode('rect', { x, y, width: w, height: h }));
    defs.append(clip);
    const image = svgNode('image', { href: option.src, width, height, 'clip-path': 'url(#' + clipId + ')' });
    image.addEventListener('error', () => {
      $('save-status').textContent = 'An artwork image did not load. Reload before rating that option.';
      $('save-status').classList.add('error');
    });
    svg.append(defs, image);
    return svg;
  }
  function renderPeople() {
    document.documentElement.style.setProperty('--person', person === 'Artus' ? '#92632b' : '#3c6c8d');
    $('people').replaceChildren();
    Core.PEOPLE.forEach(name => {
      const el = button(name, 'person', () => {
        person = name; renderPeople(); renderScores(); renderNotes();
      });
      el.setAttribute('aria-pressed', String(name === person));
      $('people').append(el);
    });
  }
  function renderNotes() {
    $('note-label').textContent = person + '’s notes';
    $('comment').value = round().notes[person];
    const other = person === 'Artus' ? 'Juna' : 'Artus';
    $('other-note').textContent = round().notes[other] ? other + '’s note: ' + round().notes[other] : '';
  }
  function renderSummary() {
    const summary = { selected: 0, excluded: 0, tie: 0, pending: 0 };
    const rows = document.createDocumentFragment();
    for (const [i, creature] of catalog.entities.entries()) {
      const result = Core.decision(state.rounds[creature.id]);
      summary[result.status]++;
      const row = document.createElement('div');
      row.className = 'result-row';
      const link = button(creature.name, '', () => go(i));
      const value = document.createElement('span');
      value.textContent = result.reason;
      row.append(link, value); rows.append(row);
    }
    $('results').replaceChildren(rows);
    $('summary-title').textContent = summary.selected + ' selected · ' + summary.excluded + ' excluded · ' + summary.tie + ' tied · ' + summary.pending + ' unrated';
  }
  function renderScores() {
    const result = Core.decision(round());
    for (const [i, option] of entity().options.entries()) {
      const card = document.querySelector('[data-option="' + option.id + '"]');
      const selected = round().ratings[person][i];
      card.classList.toggle('chosen', result.selected === option.id);
      card.querySelector('.score-name').textContent = person + (selected === null ? ' · your rating' : ' · ' + selected + '/5');
      card.querySelector('.clear').hidden = selected === null;
      for (const el of card.querySelectorAll('.rating')) {
        el.setAttribute('aria-pressed', String(Number(el.dataset.score) === selected));
        el.setAttribute('aria-label', person + ': option ' + option.id.toUpperCase() + ', ' + el.dataset.score + ' out of 5');
      }
      const others = card.querySelector('.others'); others.replaceChildren();
      Core.PEOPLE.forEach(name => {
        const el = document.createElement('span'), value = document.createElement('b');
        el.append(name + ' ');
        value.textContent = round().ratings[name][i] === null ? '—' : round().ratings[name][i] + '/5';
        el.append(value); others.append(el);
      });
    }
    const count = Object.values(state.rounds).reduce((sum, r) => sum + Core.PEOPLE.reduce((n, name) => n + r.ratings[name].filter(x => x !== null).length, 0), 0);
    $('total-count').textContent = count + ' / 368';
    $('progress').value = count;
    $('round-progress').textContent = person + ': ' + round().ratings[person].filter(x => x !== null).length + ' of 4 options rated';
    $('decision').textContent = result.reason;
    $('decision').dataset.status = result.status;
    renderSummary(); status();
  }
  function setScore(option, value) {
    const id = entity().id, who = person;
    save(s => { s.rounds[id].ratings[who][option] = value; });
    renderScores();
  }
  function renderRound() {
    $('round-number').textContent = 'ROUND ' + (index + 1) + ' OF 46 · CONCEPT ' + entity().conceptId;
    $('round-title').textContent = entity().name;
    $('round-description').textContent = 'A keeps the original concept. B, C and D explore three new looks.';
    $('jump').value = entity().id;
    $('previous').disabled = index === 0;
    $('next-top').disabled = index === catalog.entities.length - 1;
    $('next').textContent = index === catalog.entities.length - 1 ? 'Review all results ↑' : 'Next creature →';
    $('cards').replaceChildren();
    entity().options.forEach((option, i) => {
      const card = document.createElement('article');
      card.className = 'card'; card.dataset.option = option.id;
      const head = document.createElement('div'); head.className = 'card-head';
      const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = option.id.toUpperCase();
      const title = document.createElement('h3'); title.textContent = option.title;
      head.append(badge, title);
      const art = button('', 'art', () => {
        $('large-label').textContent = entity().name + ' · OPTION ' + option.id.toUpperCase();
        $('large-title').textContent = option.title;
        $('large-art').replaceChildren(artwork(option));
        $('image-dialog').showModal();
      });
      art.setAttribute('aria-label', 'Enlarge ' + entity().name + ' option ' + option.id.toUpperCase());
      const enlarge = document.createElement('span'); enlarge.className = 'enlarge'; enlarge.textContent = '↗ Enlarge';
      art.append(artwork(option), enlarge);
      const score = document.createElement('div'); score.className = 'score';
      const top = document.createElement('div'); top.className = 'score-top';
      const who = document.createElement('strong'); who.className = 'score-name';
      const clear = button('Clear', 'clear', () => setScore(i, null)); clear.setAttribute('aria-label', 'Clear rating for option ' + option.id.toUpperCase());
      top.append(who, clear);
      const ratings = document.createElement('div'); ratings.className = 'ratings'; ratings.setAttribute('role', 'group'); ratings.setAttribute('aria-label', 'Rate option ' + option.id.toUpperCase());
      for (let n = 1; n <= 5; n++) {
        const el = button(String(n), 'rating', () => setScore(i, n));
        el.dataset.score = n; ratings.append(el);
      }
      const others = document.createElement('div'); others.className = 'others';
      score.append(top, ratings, others); card.append(head, art, score); $('cards').append(card);
    });
    renderPeople(); renderNotes(); renderScores();
    history.replaceState(null, '', '#' + entity().id);
  }
  function go(to) {
    index = Math.max(0, Math.min(catalog.entities.length - 1, to));
    renderRound();
    document.querySelector('.round-heading').scrollIntoView({ block: 'start' });
  }
  function exportData() {
    return { ...state, exportedAt: new Date().toISOString(), names: [...Core.PEOPLE], results: catalog.entities.map(e => ({ id: e.id, name: e.name, ...Core.decision(state.rounds[e.id]) })), artwork: catalog.entities.map(e => ({ id: e.id, options: e.options })), gameIntegration: false };
  }
  try {
    const response = await fetch('catalog.json');
    if (!response.ok) throw Error('The creature catalog could not load.');
    catalog = await response.json();
    if (catalog.entities.length !== 46 || catalog.entities.some(e => e.options.length !== 4)) throw Error('The artwork catalog is incomplete.');
    ids = catalog.entities.map(e => e.id); state = Core.empty(ids);
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) state = Core.validate(JSON.parse(saved), ids);
    } catch { memoryOnly = true; }
    index = Math.max(0, ids.indexOf(location.hash.slice(1)));
    catalog.entities.forEach(e => {
      const option = document.createElement('option'); option.value = e.id; option.textContent = e.name; $('jump').append(option);
    });
    for (const id of ['download', 'restore', 'jump', 'comment', 'next']) $(id).disabled = false;
    $('jump').onchange = () => go(ids.indexOf($('jump').value));
    $('previous').onclick = () => go(index - 1);
    $('next-top').onclick = () => go(index + 1);
    $('next').onclick = () => {
      if (index < ids.length - 1) go(index + 1);
      else { document.querySelector('.summary').open = true; document.querySelector('.summary').scrollIntoView({ block: 'start' }); }
    };
    $('comment').oninput = () => {
      const id = entity().id, who = person, value = $('comment').value;
      save(s => { s.rounds[id].notes[who] = value; });
    };
    $('close-image').onclick = () => $('image-dialog').close();
    $('download').onclick = () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'blitzword-artus-juna-final-looks.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    };
    $('restore').onchange = async event => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        if (file.size > 2000000) throw Error('Please choose a review JSON file under 2 MB.');
        const restored = Core.validate(JSON.parse(await file.text()), ids);
        if (!confirm('Replace Artus and Juna’s ratings and notes on this review page with this file?')) return;
        state = restored;
        try { localStorage.setItem(KEY, JSON.stringify(state)); memoryOnly = false; }
        catch { memoryOnly = true; }
        renderRound();
      } catch (error) {
        $('save-status').textContent = 'Restore failed: ' + error.message;
        $('save-status').classList.add('error');
      } finally { event.target.value = ''; }
    };
    window.addEventListener('storage', event => {
      if (event.key !== KEY || memoryOnly) return;
      try {
        const latest = localStorage.getItem(KEY);
        state = latest ? Core.validate(JSON.parse(latest), ids) : Core.empty(ids);
        renderScores();
        if (document.activeElement !== $('comment')) renderNotes();
      } catch { memoryOnly = true; status(); }
    });
    renderRound();
  } catch (error) {
    $('round-title').textContent = 'The review could not open';
    $('save-status').textContent = error.message + ' Please reload.';
    $('save-status').classList.add('error');
  }
})();
