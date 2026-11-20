const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Core = require('../assets/new-creatures-vote/selection.js');
const catalog = require('../assets/new-creatures-vote/catalog.json');
const Missions = require('../missions.js');
const round = (a, j = [null, null, null]) => ({ ratings: { Artus: a, Juna: j }, notes: { Artus: '', Juna: '' } });

test('new creature vote: Artus rates all three styles before a result', () => {
  assert.equal(Core.decision(round([5, null, 1], [5, 5, 5])).status, 'pending');
  assert.equal(Core.decision(round([1, 5, 2])).selected, 'b');
  assert.equal(Core.decision(round([2, 1, 2], [5, 5, 5])).status, 'excluded');
  assert.equal(Core.decision(round([2, 3, 2])).status, 'selected');
});

test('new creature vote: Juna only breaks Artus ties', () => {
  assert.equal(Core.decision(round([4, 4, 1], [2, 5, 5])).selected, 'b');
  assert.equal(Core.decision(round([4, 4, 1], [5, null, 1])).status, 'tie');
  assert.equal(Core.decision(round([4, 4, 4], [3, 3, 1])).status, 'tie');
});

test('new creature vote: restore validates and copies', () => {
  const ids = catalog.entities.map(e => e.id), saved = Core.empty(ids);
  saved.rounds['01'] = round([4, 4, 2], [2, 5, 3]);
  const restored = Core.validate(JSON.parse(JSON.stringify(saved)), ids);
  assert.deepEqual(restored, saved);
  restored.rounds['01'].ratings.Artus[0] = 1;
  assert.equal(saved.rounds['01'].ratings.Artus[0], 4);
  saved.rounds['01'].ratings.Artus = [4, 4, 2, 1];
  assert.throws(() => Core.validate(saved, ids), /Invalid ratings/);
  assert.throws(() => Core.validate({ version: 1, reviewId: 'enemy-finals-20261010', rounds: {} }, ids));
});

test('new creature vote: 13 ChatGPT-painted creatures, three pictures each, none already in the game', () => {
  assert.equal(catalog.entities.length, 13);
  assert.equal(catalog.reviewId, Core.REVIEW_ID);
  const existing = Object.keys(Missions.lore).map(id => id.split('-').pop());
  const files = new Set();
  for (const entity of catalog.entities) {
    const species = entity.name.toLowerCase().split(' ').pop();
    assert.ok(!existing.includes(species), entity.name + ' repeats an existing species');
    assert.deepEqual(entity.options.map(o => o.id), Core.OPTIONS);
    for (const option of entity.options) {
      const file = option.src.split('?')[0];
      assert.ok(!files.has(file)); files.add(file);
      assert.deepEqual(option.crop, [0, 0, option.width, option.height]);
      assert.ok(fs.existsSync(path.join(__dirname, '../assets/new-creatures-vote', file)));
    }
  }
  assert.equal(files.size, 39);
  const manifest = require('../assets/new-creatures-vote/artwork-manifest.json');
  assert.equal(manifest.pictures.length, 39);
});
