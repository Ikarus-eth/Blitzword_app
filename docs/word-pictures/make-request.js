// Lists the words that need a teaching picture first: every expansion word Artus has met (progress of
// 8 November 2026), all Thunder Mountain and Moon Key targets, and the next 60 new words. Usage:
// node docs/word-pictures/make-request.js <decrypted-report.json>  (the report is never committed)
const fs = require('fs'), path = require('path');
const C = require('../../content.js'), M = require('../../assets/adventures/moon-key/campaign'), T = require('../../assets/adventures/thunder-mountain/campaign');
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const st = {}; for (const w of r.reports.words) st[w.word.toLowerCase()] = w.status;
const visual = C.teachingVisuals.words;
const need = C.words.filter(x => !x.image && !visual[x.w]?.quantity && !visual[x.w]?.source && !visual[x.w]?.image);
const pick = new Set([...need.filter(x => st[x.w] && st[x.w] !== 'new').map(x => x.w), ...M.missions.flatMap(m => m.targets), ...T.missions.flatMap(m => m.targets),
  ...need.filter(x => !st[x.w] || st[x.w] === 'new').slice(0, 60).map(x => x.w)].filter(w => need.some(x => x.w === w)));
const B = 'https://ikarus-eth.github.io/Blitzword_app/';
const STYLE = B + 'assets/story-pilot/scenes/fox-call.webp', PIP = B + 'assets/evolution/pip-stage-0.webp', ARTUS = B + 'assets/family-review/images/knight-boy-d.webp';
const words = C.words.filter(x => pick.has(x.w)).map(x => {
  const refs = [STYLE], lines = [];
  if (/\bPip\b/.test(x.sentence)) { refs.push(PIP); lines.push(`Image ${refs.length} is Pip, a small friendly orange-gold dragon; keep his look exactly.`); }
  if (/\bArtus\b/.test(x.sentence)) { refs.push(ARTUS); lines.push(`Image ${refs.length} is Artus, a young boy with golden-ginger hair in green tunic and silver armour.`); }
  const prompt = [`Use case: a picture card that teaches a seven-year-old the English word “${x.w}”.`,
    `Paint one clear, simple scene showing this sentence: “${x.sentence}”. The meaning of “${x.w}” must be obvious at a glance: make it big and central, with a calm, uncluttered background.`,
    'Painted children’s picture-book style like image 1, warm light, friendly faces. Image 1 is a style reference only; do not copy its fox, tunnel or layout.', ...lines,
    'Landscape 3:2, full scene edge to edge. No text, no letters, no numbers, no labels, no speech bubbles, no borders, no panels. Child-friendly.'].join(' ');
  return { word: x.w, file: x.w.replace(/[^a-z]/gi, '-').toLowerCase(), alt: x.sentence, references: refs, prompt };
});
const out = { model: 'fal-ai/nano-banana/edit', output: 'assets/teaching/words', count: words.length, words };
fs.writeFileSync(path.join(__dirname, 'request-1.json'), JSON.stringify(out, null, 1));
console.log(words.length, 'words; with Pip', words.filter(w => w.references.length > 1).length);
