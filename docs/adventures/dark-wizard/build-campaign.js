// Builds assets/adventures/dark-wizard/campaign.js (chapters 7 and 8) from the reviewed story, questions and glossary.
// Run: node docs/adventures/dark-wizard/build-campaign.js
const fs = require('fs');
const path = require('path');
const story = require('./story-source.js');
const Qs = require('./questions-source.js');
const glossary = require('./glossary-source.js');
const OUT = path.join(__dirname, '../../../assets/adventures/dark-wizard/campaign.js');
const dir = 'assets/adventures/dark-wizard/';

const meta = {
  'dw-storm': { name: 'The Black Smoke', place: 'Grandma’s House', families: ['frost-bison', 'storm-griffin'], goal: 'Find out what is on the roof.', item: 'A piece of black smoke', symbol: 'lamp',
    intro: 'Something is on the roof in the night! Learn the new words, then read part 1.', ending: 'You read part 1! A dark wizard took Jet.' },
  'dw-trail': { name: 'Oren’s Plan', place: 'Oren’s Tower', families: ['red-phoenix', 'snow-owl'], goal: 'Ask Oren for help.', item: 'The silver torch', symbol: 'lamp',
    intro: 'Oren knows about Grax. Learn the new words, then read part 2.', ending: 'You read part 2! The journey to rescue Jet begins.' },
  'dw-jungle': { name: 'The Wild Forest', place: 'The Wild Forest', families: ['sun-tiger', 'guard-okapi'], goal: 'Follow the black smoke.', item: 'Clean blue water', symbol: 'leaf',
    intro: 'The smoke goes into a wild forest. Learn the new words, then read part 3.', ending: 'You read part 3! Sun the tiger showed them the way.' },
  'dw-camp': { name: 'A Young Man at the Camp', place: 'The Sand', families: ['star-camel', 'digger-aardvark'], goal: 'Cross the hot sand.', item: 'A little black stone', symbol: 'star',
    intro: 'There is only sand, everywhere! Learn the new words, then read part 4.', ending: 'You read part 4! Can you believe Rook?' },
  'dw-tunnel': { name: 'The Fire Mountain', place: 'The Fire Mountain', families: ['lava-triceratops', 'crest-cassowary'], goal: 'Go through the secret tunnel.', item: 'A broken chain', symbol: 'stone',
    intro: 'Rook knows a secret tunnel. Learn the new words, then read part 5.', ending: 'You read part 5! The black island is in the sea.' },
  'dw-trap': { name: 'The Trap', place: 'The Black Island', families: ['wave-pelican', 'chest-mimic'], goal: 'Get into the castle.', item: 'The truth about Rook', symbol: 'chest', chapterFinale: true,
    intro: 'A long bridge goes to the castle. Learn the new words, then read the end of chapter 7.', ending: 'You finished chapter 7! But it is a trap…' },
  'wf-room': { name: 'Three Times', place: 'The Trap Room', families: ['cave-troll', 'moss-golem'], goal: 'Get out of the trap.', item: 'A secret door', symbol: 'map',
    intro: 'They are in Grax’s trap! Learn the new words, then read part 1 of chapter 8.', ending: 'You read part 1! The secret stairs go up to the tower.' },
  'wf-stairs': { name: 'Jet in the Tower', place: 'The Secret Stairs', families: ['wind-fish', 'briar-bat'], goal: 'Find Jet in the tower.', item: 'Jet, at last', symbol: 'key',
    intro: 'The stairs go up and up. Learn the new words, then read part 2.', ending: 'You read part 2! Rook wants to help.' },
  'wf-hall': { name: 'The Great Room', place: 'The Great Room', families: ['lantern-wisp', 'ink-raven'], goal: 'Get the black ring.', item: 'A map of the castle', symbol: 'map',
    intro: 'Rook has a plan. Learn the new words, then read part 3.', ending: 'You read part 3! Grax let Rook fall.' },
  'wf-ring': { name: 'The Black Ring', place: 'The Sea Rocks', families: ['reef-octopus', 'gale-falcon'], goal: 'Stop Grax’s big spell.', item: 'Grax’s black ring', symbol: 'water',
    intro: 'Grax is on the sea rocks. Learn the new words, then read part 4.', ending: 'You read part 4! Jet is free.' },
  'wf-home': { name: 'A Party for Jet', place: 'Grandma’s House', families: ['hazel-hare', 'brook-turtle'], goal: 'Take Jet home.', item: 'A gold star', symbol: 'star', finale: true,
    intro: 'It is time to go home! Learn the last words, then read the end of the story.', ending: 'You read the whole story by yourself! But is Grax gone for ever?' },
};
// ChatGPT pictures, kept few on purpose (parent, 21 November 2026): one picture for each story part.
const questions = (id, which) => Qs[id][which].map(([prompt, page, ...opts], i) => ({
  id: id + (which === 'mid' ? '-m' : '-q') + (i + 1), prompt,
  options: opts.map((label, j) => ({ id: String(j), label })), answer: '0', page,
}));
const chapters = { 7: { id: 'dark-wizard', name: 'Pip and the Dark Wizard', shortName: 'Dark Wizard', prize: 'Rescuer of the Dark Wizard’s Island',
  intro: 'A dark wizard took Jet! Win two fights to learn new words, then read a long story by yourself. Do it twice in every quest.',
  ending: 'You finished chapter 7! But Rook led you into a trap. Chapter 8 is coming soon.' },
  8: { id: 'wizard-fall', name: 'Pip and the Wizard’s Fall', shortName: 'Wizard’s Fall', prize: 'Reader of the Wizard’s Fall',
  intro: 'You are in Grax’s trap! Win two fights to learn new words, then read on. Can you rescue Jet?',
  ending: 'You read the whole story by yourself! Jet is home. But is Grax gone for ever?' } };

// Chapters go live when their pictures exist (27 November 2026: chapter 7 first; chapter 8 waits for its 10 pictures).
const RELEASED = [7];
const missions = story.quests.filter(q => RELEASED.includes(q.chapter)).map((q, i) => {
  const m = meta[q.id];
  if (!m) throw new Error('No meta for ' + q.id);
  const c = chapters[q.chapter];
  return {
    id: q.id, campaign: c.id, voiceSet: 'dark-wizard', name: m.name, place: m.place, families: m.families, goal: m.goal, item: m.item, symbol: m.symbol,
    intro: m.intro, ending: m.ending, requires: i && story.quests[i - 1].chapter === q.chapter ? [story.quests[i - 1].id] : [],
    ...(m.finale ? { finale: true } : {}), ...(m.chapterFinale ? { finale: true } : {}),
    area: 'dark-ch' + (i + 1), health: q.chapter === 7 ? [10, 12, 13, 15] : [12, 13, 15, 16],
    mid: { title: q.mid.title, pages: q.mid.pages, stretch: q.mid.stretch, art: q.mid.pages.map(() => dir + q.id + '-a.webp'), questions: questions(q.id, 'mid') },
    story: { title: q.end.title, targets: q.targets, pages: q.end.pages, stretch: q.end.stretch, art: q.end.pages.map(() => dir + q.id + '-b.webp'), questions: questions(q.id, 'end') },
    riddles: [],
  };
});
// Covers reuse a quest picture (no extra ChatGPT pictures): chapter 7 the black smoke, chapter 8 the final fight.
const campaigns = RELEASED.map(n => ({ id: chapters[n].id, name: chapters[n].name, shortName: chapters[n].shortName, scene: dir + (n === 7 ? 'dw-storm-b' : 'wf-ring-b') + '.webp',
  coverAlt: n === 7 ? 'Grax the dark wizard at the window at midnight; black smoke takes Jet.' : 'Pip’s flame breaks Grax’s staff on a black rock in the storm.',
  story: true, intro: chapters[n].intro, ending: chapters[n].ending, prize: chapters[n].prize, missions: missions.filter(m => m.campaign === chapters[n].id).map(m => m.id) }));

const src = `(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BlitzDarkCampaign=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Story chapters 7 and 8, Pip and the Dark Wizard (21 November 2026), one story arc in two campaigns.
  // Generated by docs/adventures/dark-wizard/build-campaign.js from the reviewed text. Each quest runs fight, fight,
  // mid story, fight, fight, end story. Stretch words are marked with dots in the reader. One picture per story part.
  const glossary=${JSON.stringify(glossary, null, 0).replace(/\],"/g, '],\n  "')};
  const missions=${JSON.stringify(missions, null, 1)};
  const campaigns=${JSON.stringify(campaigns, null, 1)};
  const count=story=>story.pages.flat().join(' ').split(/\\s+/).filter(w=>/[A-Za-z]/.test(w)).length;
  for(const m of missions){m.targets=m.story.targets;
    m.mid={...m.mid,id:'mid',targets:m.targets};m.mid.words=count(m.mid);
    m.story.id='end';
    m.scenes=[m.mid.art[0],m.story.art[0]].map((art,i)=>({art,alt:'Story picture '+(i+1)+' for '+m.name+'.'}));
    m.art=m.mid.art[0];m.artAlt='Artus and Pip: '+m.place+'.';m.endingArt=m.story.art.at(-1);m.endingArtAlt='The end of '+m.name+'.';
    m.story.words=count(m.story);m.stories=[m.mid,m.story];}
  return {campaigns,missions,glossary};
});
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, src);
delete require.cache[OUT];
const data = require(OUT);
console.log('campaigns', data.campaigns.map(c => c.id + ':' + c.missions.length).join(' '), 'words', data.missions.reduce((n, m) => n + m.mid.words + m.story.words, 0),
  'targets', data.missions.reduce((n, m) => n + m.targets.length, 0), 'pictures', data.missions.length * 2);
