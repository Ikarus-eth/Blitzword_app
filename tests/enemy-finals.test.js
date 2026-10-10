const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../assets/enemy-finals/selection.js');
const catalog = require('../assets/enemy-finals/catalog.json');
const round = (a, j = [null, null, null, null]) => ({ ratings: { Artus: a, Juna: j }, notes: { Artus: '', Juna: '' } });
test('Artus must rate every option before selection or exclusion', () => {
  for (const scores of [[5, 1, null, 1], [1, 2, 1, null], [null, null, null, null]]) {
    assert.equal(Core.decision(round(scores, [5, 5, 5, 5])).status, 'pending');
  }
});
test('Artus alone chooses a unique highest eligible score', () => {
  assert.equal(Core.decision(round([3, 1, 2, 1], [1, 5, 5, 5])).selected, 'a');
  assert.equal(Core.decision(round([1, 4, 2, 3])).selected, 'b');
});
test('all Artus scores below three excludes, regardless of Juna', () => {
  assert.equal(Core.decision(round([2, 1, 2, 1], [5, 5, 5, 5])).status, 'excluded');
  assert.equal(Core.decision(round([1, 1, 1, 1])).selected, null);
});
test('Juna decides only between Artus highest choices', () => {
  const result = Core.decision(round([4, 4, 2, 1], [2, 3, 5, 5]));
  assert.equal(result.selected, 'b');
  assert.deepEqual(result.candidates, ['a', 'b']);
});
test('missing Juna scores and remaining ties stay open', () => {
  assert.equal(Core.decision(round([4, 4, 2, 1], [5, null, 1, 1])).status, 'tie');
  assert.equal(Core.decision(round([4, 4, 2, 1], [5, 5, 1, 1])).status, 'tie');
  assert.equal(Core.decision(round([3, 3, 3, 3], [2, 4, 3, 1])).selected, 'b');
});
test('rating three is eligible, not excluded', () => {
  assert.equal(Core.decision(round([2, 3, 2, 2])).status, 'selected');
});
test('review export validation preserves ratings and isolates state', () => {
  const ids = catalog.entities.map(e => e.id), saved = Core.empty(ids);
  saved.rounds['01'] = round([4, 4, 2, 1], [2, 5, 3, 4]);
  saved.rounds['01'].notes.Artus = 'Keep the white feathers';
  const restored = Core.validate(JSON.parse(JSON.stringify(saved)), ids);
  assert.deepEqual(restored, saved);
  restored.rounds['01'].ratings.Artus[0] = 1;
  assert.equal(saved.rounds['01'].ratings.Artus[0], 4);
  saved.rounds['01'].ratings.Juna[2] = 0;
  assert.throws(() => Core.validate(saved, ids), /Invalid ratings/);
  assert.throws(() => Core.validate({ version: 2 }, ids));
});
test('46 accepted or unsure creatures, four distinct artwork slots each', () => {
  assert.equal(catalog.entities.length, 46);
  assert.deepEqual(catalog.names, ['Artus', 'Juna']);
  const seen = new Set();
  for (const entity of catalog.entities) {
    assert.ok(![5, 17, 47, 49].includes(entity.conceptId));
    assert.deepEqual(entity.options.map(o => o.id), ['a', 'b', 'c', 'd']);
    for (const option of entity.options) {
      const key = [option.src, option.column, option.row].join('|');
      assert.ok(!seen.has(key)); seen.add(key);
    }
  }
  assert.equal(seen.size, 184);
});
