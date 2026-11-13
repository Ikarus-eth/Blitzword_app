// Lists every clip the Wizard's Tower reader can play: each spoken word form, each meaning and each question.
// Usage: node docs/adventures/wizard-tower/make-voice-request.js  (writes voice-request.json next to this file)
const fs = require('fs'), path = require('path');
const T = require('../../../assets/adventures/wizard-tower/campaign.js');
const D = require('../../../missions.js');
const FUNCTION_WORDS = new Set('a an and the to of in on at by is it was he she we you i they them him his her my me be am are were do did not no so but for from with this that there then too can will'.split(' '));
const storyKey = w => w.toLowerCase().replace(/[’']s$/, '').replace(/[^a-z]/g, '');
const spokenForm = token => token.replace(/[^A-Za-z’']/g, '').replace(/’/g, "'");
const names = ['artus', 'pip', 'oren', 'gus'];
const items = [], seen = new Set();
const add = (id, text) => { if (!seen.has(id)) { seen.add(id); items.push({ id, text }); } };
for (const m of T.missions) for (const w of m.targets) add('w:' + w.toLowerCase(), w);
for (const m of T.missions) for (const st of m.stories) {
  for (const text of [...st.pages.flat(), ...st.questions.map(q => q.prompt)]) for (const token of text.split(/\s+/)) {
    if (!/[A-Za-z]/.test(token)) continue;
    const spoken = spokenForm(token), key = storyKey(token);
    add('w:' + spoken.toLowerCase(), names.includes(key) ? spoken[0].toUpperCase() + spoken.slice(1).toLowerCase() : spoken.toLowerCase());
    const entry = D.glossary[key];
    if (entry && !FUNCTION_WORDS.has(key)) add('m:' + key, entry[0]);
  }
  for (const q of st.questions) add('q:' + q.id, q.prompt);
}
// Short words the Moon Key listening check found hard are read a little slower from the start.
const slow = ['w:artus', 'w:no', 'w:a', 'w:an', 'w:she', 'w:your', 'w:than', 'w:puts', 'w:too', 'w:be', 'w:her', 'w:took', 'w:egg', 'w:cup', 'w:bit', 'w:hit', 'w:ran', 'w:yet'];
const request = { version: 'wizard-tower-voice-20261114-r1', campaign: 'wizard-tower', voice: 'af_heart', output: 'assets/adventures/wizard-tower/voice',
  say: {}, slow: slow.filter(id => seen.has(id)), items };
fs.writeFileSync(path.join(__dirname, 'voice-request.json'), JSON.stringify(request, null, 1));
console.log(items.length, 'clips:', items.filter(i => i.id.startsWith('w:')).length, 'words,', items.filter(i => i.id.startsWith('m:')).length, 'meanings,', items.filter(i => i.id.startsWith('q:')).length, 'questions');
