// Lists every clip the Moon Key reader can play: each spoken word form, each meaning and each question.
// Usage: node docs/adventures/moon-key/make-voice-request.js  (writes voice-request.json next to this file)
const fs = require('fs'), path = require('path');
const M = require('../../../assets/adventures/moon-key/campaign.js');
const D = require('../../../missions.js');
const FUNCTION_WORDS = new Set('a an and the to of in on at by is it was he she we you i they them him his her my me be am are were do did not no so but for from with this that there then too can will'.split(' '));
const storyKey = w => w.toLowerCase().replace(/[’']s$/, '').replace(/[^a-z]/g, '');
// Same spoken form the reader uses: letters and apostrophes only, curly apostrophe made straight.
const spokenForm = token => token.replace(/[^A-Za-z’']/g, '').replace(/’/g, "'");
const items = [], seen = new Set();
const add = (id, text) => { if (!seen.has(id)) { seen.add(id); items.push({ id, text }); } };
for (const m of M.missions) {
  for (const w of m.targets) add('w:' + w.toLowerCase(), w);
  for (const st of m.stories) {
    for (const token of st.pages.flat().join(' ').split(/\s+/)) {
      if (!/[A-Za-z]/.test(token)) continue;
      const spoken = spokenForm(token), key = storyKey(token);
      const names = ['artus', 'pip', 'jet', 'grandma', 'sam', 'may'];
      add('w:' + spoken.toLowerCase(), names.includes(key) ? spoken[0].toUpperCase() + spoken.slice(1).toLowerCase() : spoken.toLowerCase());
      const entry = D.glossary[key];
      if (entry && !FUNCTION_WORDS.has(key)) add('m:' + key, entry[0]);
    }
    for (const q of st.questions) add('q:' + q.id, q.prompt);
  }
}
const request = { version: 'moon-key-voice-20261108-r1', campaign: 'moon-key', voice: 'af_heart', output: 'assets/adventures/moon-key/voice',
  say: {}, items };
fs.writeFileSync(path.join(__dirname, 'voice-request.json'), JSON.stringify(request, null, 1));
console.log(items.length, 'clips:', items.filter(i => i.id.startsWith('w:')).length, 'words,', items.filter(i => i.id.startsWith('m:')).length, 'meanings,', items.filter(i => i.id.startsWith('q:')).length, 'questions');
