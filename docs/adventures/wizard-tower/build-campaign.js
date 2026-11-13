// Builds assets/adventures/wizard-tower/campaign.js from the reviewed story, questions and glossary drafts.
// Run: node docs/adventures/wizard-tower/build-campaign.js
const fs = require('fs');
const path = require('path');
const story = require('./story-source.js');
const Qs = require('./questions-source.js');
const glossary = require('./glossary-source.js');
const OUT = path.join(__dirname, '../../../assets/adventures/wizard-tower/campaign.js');

const meta = {
  'wt-giant': { name: 'The Giant at the Door', place: 'Artus’s House', families: ['hazel-hare', 'bramble-badger'], goal: 'Find out who is at the door.', item: 'Oren’s letter', symbol: 'map',
    intro: 'Boom! Boom! Something very big is coming! Learn the new words, then read part 1 of the story.', ending: 'You read part 1! Now Artus and Pip ride in Gus’s pocket.' },
  'wt-farm': { name: 'The Giant Farm', place: 'Gus’s Farm', families: ['pine-marten', 'bramble-peacock'], goal: 'Find out why the farm is sick.', item: 'Honey for Oren', symbol: 'basket',
    intro: 'Gus has a giant farm. Learn the farm words, then read part 2.', ending: 'You read part 2! The farm is sick, so they must go to the tower.' },
  'wt-lake': { name: 'Across the Lake', place: 'The Dark Woods', families: ['rowan-stag', 'ripple-salamander'], goal: 'Get across the lake.', item: 'A path of white stones', symbol: 'water',
    intro: 'The road goes into the dark woods. Learn the new words, then read part 3.', ending: 'You read part 3! Now they are at the door of the tower.' },
  'wt-tower': { name: 'The Wizard’s Tower', place: 'The Tall Tower', families: ['flint-armadillo', 'copper-scorpion'], goal: 'Meet Oren the wizard.', item: 'The Star Stone', symbol: 'stone',
    intro: 'There are a hundred stairs in the tower! Learn the new words, then read part 4.', ending: 'You read part 4! Now they must find the spell book.' },
  'wt-books': { name: 'The Flying Books', place: 'The Book Room', families: ['chest-mimic', 'briar-bat'], goal: 'Find the spell book.', item: 'The big spell book', symbol: 'chest',
    intro: 'The books in the tower can fly! Learn the new words, then read part 5.', ending: 'You read part 5! Two pages are not in the book.' },
  'wt-pages': { name: 'The Lost Pages', place: 'The Snow and the Old Tree', families: ['snow-hare', 'moss-golem'], goal: 'Find the two pages.', item: 'A little brown seed', symbol: 'seed',
    intro: 'One page is in the snow, and one is by the old tree. Learn the new words, then read part 6.', ending: 'You read part 6! Now the spell book has all its pages.' },
  'wt-spell': { name: 'The Spell', place: 'The Top of the Tower', families: ['coal-salamander', 'lantern-wisp'], goal: 'Read the spell.', item: 'The light in the stone', symbol: 'lamp',
    intro: 'It is time to read the spell! Learn the new words, then read part 7.', ending: 'You read part 7! The Star Stone is as bright as the sun.' },
  'wt-light': { name: 'A Star for Artus', place: 'The Village', families: ['moon-moth', 'dusk-firefly'], goal: 'Bring the light back to the land.', item: 'A gold star', symbol: 'star', finale: true,
    intro: 'The light is coming back! Learn the last words, then read the end of the story.', ending: 'You read the whole story by yourself! Now you are a real wizard.' },
};
// fal.ai budget (at most $2): one picture for every two pages. Mid stories: pages 1–2 and 3–4.
// End stories: the second picture starts on the page given here.
const endSplit = { 'wt-giant': 3, 'wt-farm': 4, 'wt-lake': 4, 'wt-tower': 4, 'wt-books': 3, 'wt-pages': 3, 'wt-spell': 4, 'wt-light': 4 };
const dir = 'assets/adventures/wizard-tower/';

const questions = (id, which) => Qs[id][which].map(([prompt, page, ...opts], i) => ({
  id: id + (which === 'mid' ? '-m' : '-q') + (i + 1), prompt,
  options: opts.map((label, j) => ({ id: String(j), label })), answer: '0', page,
}));

const missions = story.quests.map((q, i) => {
  const m = meta[q.id];
  if (!m || !endSplit[q.id]) throw new Error('No meta for ' + q.id);
  const midArt = q.mid.pages.map((p, k) => dir + q.id + '-a' + (k < 2 ? 1 : 2) + '.webp');
  const endArt = q.end.pages.map((p, k) => dir + q.id + '-' + (k + 1 < endSplit[q.id] ? 1 : 2) + '.webp');
  return {
    id: q.id, name: m.name, place: m.place, families: m.families, goal: m.goal, item: m.item, symbol: m.symbol,
    intro: m.intro, ending: m.ending, requires: i ? [story.quests[i - 1].id] : [], ...(m.finale ? { finale: true } : {}),
    area: 'tower-ch' + (i + 1), health: [10, 11, 12, 14],
    mid: { title: q.mid.title, pages: q.mid.pages, art: midArt, questions: questions(q.id, 'mid') },
    story: { title: q.end.title, targets: q.targets, pages: q.end.pages, art: endArt, questions: questions(q.id, 'end') },
    riddles: [],
  };
});

const src = `(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzTowerCampaign=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Story campaign 6, Pip and the Wizard's Tower (14 November 2026). Generated by docs/adventures/wizard-tower/build-campaign.js
  // from the reviewed story text. Each quest runs fight, fight, mid story, fight, fight, end story, like the Moon Key.
  // Oren the old wizard and Gus the friendly giant are original characters. One picture covers two story pages.
  // Meanings for words that the earlier story glossaries do not already have: [simple meaning, syllables (a|b), tricky letters].
  const glossary=${JSON.stringify(glossary, null, 0).replace(/\],"/g, '],\n  "')};
  const missions=${JSON.stringify(missions, null, 1)};
  const dir='${dir}';
  const count=story=>story.pages.flat().join(' ').split(/\\s+/).filter(w=>/[A-Za-z]/.test(w)).length;
  for(const m of missions){m.campaign='wizard-tower';m.targets=m.story.targets;
    m.mid={...m.mid,id:'mid',targets:m.targets};m.mid.words=count(m.mid);
    m.story.id='end';
    m.scenes=m.story.art.map((art,i)=>({art,alt:'Story picture '+(i+1)+' for '+m.name+'.'}));
    m.art=m.mid.art[0];m.artAlt='Artus and Pip: '+m.place+'.';m.endingArt=m.story.art.at(-1);m.endingArtAlt='The end of '+m.name+'.';
    m.story.words=count(m.story);m.stories=[m.mid,m.story];}
  const campaign={id:'wizard-tower',name:'Pip and the Wizard’s Tower',shortName:'Wizard’s Tower',scene:dir+'cover.webp',coverAlt:'Gus the giant stands by Oren’s tall tower; Artus and Pip wave from his pocket.',story:true,
    intro:'A friendly giant comes to the door with a letter from an old wizard! In each quest, win two fights to learn new words, then read a long story by yourself. Do it twice!',
    ending:'You read the whole story by yourself! The Star Stone is bright, and you are a real wizard.',prize:'Reader of the Wizard’s Tower',missions:missions.map(m=>m.id)};
  return {campaign,missions,glossary};
});
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, src);
delete require.cache[OUT];
const data = require(OUT);
console.log('missions', data.missions.length, 'words', data.missions.reduce((n, m) => n + m.mid.words + m.story.words, 0),
  'pictures', new Set(data.missions.flatMap(m => [...m.mid.art, ...m.story.art])).size + 1);
