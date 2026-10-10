(function (root) {
  'use strict';
  const OPTIONS = ['a', 'b', 'c', 'd'];
  const PEOPLE = ['Artus', 'Juna'];
  const emptyRound = () => ({
    ratings: { Artus: [null, null, null, null], Juna: [null, null, null, null] },
    notes: { Artus: '', Juna: '' }
  });
  function decision(round = emptyRound()) {
    const artus = round.ratings.Artus;
    if (artus.some(score => score === null)) {
      return { status: 'pending', candidates: [], selected: null, reason: 'Artus: rate all four options.' };
    }
    const best = Math.max(...artus);
    if (best < 3) {
      return { status: 'excluded', candidates: [], selected: null, reason: 'Not selected: Artus rated all four below 3/5.' };
    }
    const tied = OPTIONS.filter((_, i) => artus[i] === best);
    if (tied.length === 1) {
      return { status: 'selected', candidates: tied, selected: tied[0], reason: 'Artus chose ' + tied[0].toUpperCase() + ' · ' + best + '/5.' };
    }
    const juna = round.ratings.Juna;
    if (tied.some(id => juna[OPTIONS.indexOf(id)] === null)) {
      return { status: 'tie', candidates: tied, selected: null, reason: 'Artus is tied on ' + tied.map(x => x.toUpperCase()).join(' / ') + '. Juna rates these to decide.' };
    }
    const junaBest = Math.max(...tied.map(id => juna[OPTIONS.indexOf(id)]));
    const finalists = tied.filter(id => juna[OPTIONS.indexOf(id)] === junaBest);
    if (finalists.length !== 1) {
      return { status: 'tie', candidates: finalists, selected: null, reason: 'Still tied on ' + finalists.map(x => x.toUpperCase()).join(' / ') + '. Artus or Juna can revise a rating.' };
    }
    return { status: 'selected', candidates: tied, selected: finalists[0], reason: 'Juna breaks Artus’s tie: ' + finalists[0].toUpperCase() + '.' };
  }
  function empty(ids) {
    return { version: 1, reviewId: 'enemy-finals-20261010', rounds: Object.fromEntries(ids.map(id => [id, emptyRound()])) };
  }
  function validate(raw, ids) {
    if (!raw || raw.version !== 1 || raw.reviewId !== 'enemy-finals-20261010' || !raw.rounds || typeof raw.rounds !== 'object') throw Error('This is not a final-look review file.');
    const out = empty(ids);
    for (const id of ids) {
      const round = raw.rounds[id];
      if (!round) throw Error('The review is missing a creature.');
      for (const person of PEOPLE) {
        const scores = round.ratings?.[person], note = round.notes?.[person];
        if (!Array.isArray(scores) || scores.length !== 4 || scores.some(n => n !== null && (!Number.isInteger(n) || n < 1 || n > 5))) throw Error('Invalid ratings.');
        if (typeof note !== 'string' || note.length > 10000) throw Error('Invalid notes.');
        out.rounds[id].ratings[person] = [...scores];
        out.rounds[id].notes[person] = note;
      }
    }
    return out;
  }
  const api = { OPTIONS, PEOPLE, emptyRound, decision, empty, validate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.EnemySelection = api;
})(typeof window === 'undefined' ? globalThis : window);
