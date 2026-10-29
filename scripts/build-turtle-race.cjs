// Builds assets/turtle-race/items.js. Optional argument: delivered provider output folder to install (no provider calls).
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const Core=require('../assets/turtle-race/race-core.js');
const narration=require('../narration.js');
const items=require('./turtle-race-items.json');
const paraphrase=require('./turtle-race-paraphrase.json');
const expertItems=require('./turtle-race-expert.json');
const expertItems2=require('./turtle-race-expert-2.json'); // expert race turtles 11-15 (29 October 2026)
const expertItems3=require('./turtle-race-expert-3.json'); // expert race turtles 21-25 (30 October 2026)
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Each paid voice set: its request plan and the generation record installed from provider output.
const voiceSets=[
  {plan:require('../docs/turtle-race/NARRATION_REQUEST.json'),file:path.join(root,'docs/turtle-race/NARRATION_GENERATION.json')},
  {plan:require('../docs/turtle-race/NARRATION_REQUEST_2.json'),file:path.join(root,'docs/turtle-race/NARRATION_GENERATION_2.json')},
  {plan:require('../docs/turtle-race/NARRATION_REQUEST_3.json'),file:path.join(root,'docs/turtle-race/NARRATION_GENERATION_3.json')}
];

if(process.argv[2]){
  const raw=path.resolve(process.argv[2]);
  const generated=JSON.parse(fs.readFileSync(path.join(raw,'generation.json'),'utf8'));
  const set=voiceSets.find(v=>v.plan.batches.every(b=>generated.batches.some(g=>g.id===b.id)));
  if(!set)throw Error('Provider output matches no voice request');
  const plan=set.plan;
  if(generated.status!=='complete'||Object.keys(generated.clips).length!==plan.segmentCount)throw Error('Incomplete provider output');
  fs.mkdirSync(path.join(root,'docs/narration-turtle-race/receipts'),{recursive:true});
  for(const batch of plan.batches){
    const bytes=fs.readFileSync(path.join(raw,batch.id,'audio.mp3'));
    const receipt=JSON.parse(fs.readFileSync(path.join(raw,batch.id,'receipt.json'),'utf8'));
    const meta=generated.batches.find(b=>b.id===batch.id);
    if(!meta||hash(bytes)!==receipt.sha256||receipt.sha256!==meta.sha256||receipt.text!==batch.text)throw Error('Receipt mismatch: '+batch.id);
    const dest=path.join(root,'assets/narration',batch.id+'.mp3');
    if(fs.existsSync(dest)&&hash(fs.readFileSync(dest))!==receipt.sha256)throw Error('Refusing to replace paid audio');
    fs.writeFileSync(dest,bytes);
    fs.writeFileSync(path.join(root,'docs/narration-turtle-race/receipts',batch.id+'.json'),JSON.stringify(receipt)+'\n');
  }
  generated.listeningReview='Decode, duration and alignment checks only; no human listening approval or physical iPad test is claimed.';
  fs.writeFileSync(set.file,JSON.stringify(generated,null,2)+'\n');
}

const voice={};
for(const set of voiceSets){
  const generated=JSON.parse(fs.readFileSync(set.file,'utf8'));
  for(const batch of set.plan.batches)for(const seg of batch.segments){
    const clip=generated.clips[seg.key];
    if(!clip)throw Error('Missing voice clip '+seg.key);
    if(hash(fs.readFileSync(path.join(root,clip.file)))!==clip.sha256)throw Error('Voice file changed: '+clip.file);
    voice[seg.key.replace('turtle-race:','')]={file:clip.file,offset:clip.offset,duration:clip.duration,text:seg.text};
  }
}
// New challengers reuse the approved BlitzWord enemy introductions (no new audio).
for(const opp of Object.values(Core.OPPONENTS)){
  if(opp.id==='turtle')continue;
  const text=`${/^[AEIOU]/.test(opp.creature)?'An':'A'} ${opp.creature} is on the path. Ready to battle?`;
  const clip=narration.clips[text];
  if(!clip)throw Error('Missing challenger intro '+text);
  voice['intro-'+opp.id]={file:clip.file,offset:clip.offset,duration:clip.duration,text};
}
const out=items.map(item=>{
  if(!Core.validateItem(item))throw Error('Invalid item: '+item.s);
  const clip=narration.clips[item.s];
  if(!clip)throw Error('No recorded sentence: '+item.s);
  if(!fs.existsSync(path.join(root,clip.file)))throw Error('Missing audio file '+clip.file);
  const audio={file:clip.file,duration:clip.duration};
  if(Number.isFinite(clip.offset))audio.offset=clip.offset;
  const extra=paraphrase[item.s];
  if(!extra)throw Error('No other-words answers for: '+item.s);
  const full={...item,...extra,tier:'core',audio};
  if(!Core.validateParaphrase(full))throw Error('Other-words answers reuse the key word or are incomplete: '+item.s);
  return full;
});
if(Object.keys(paraphrase).some(s=>!items.find(i=>i.s===s)))throw Error('Other-words entry without a sentence');
// Further word sets for the main race (turtles 6-20): same rules as 1-5, different words, existing recordings.
for(const [file,tier] of [['turtle-race-items-2.json','core2'],['turtle-race-items-3.json','core3'],['turtle-race-items-4.json','core4']])for(const item of require('./'+file)){
  if(!Core.validateItem(item))throw Error('Invalid item: '+item.s);
  const clip=narration.clips[item.s];
  if(!clip||!fs.existsSync(path.join(root,clip.file)))throw Error('No recorded sentence: '+item.s);
  if(out.some(o=>o.s===item.s))throw Error('Duplicate sentence: '+item.s);
  const audio={file:clip.file,duration:clip.duration};if(Number.isFinite(clip.offset))audio.offset=clip.offset;
  out.push({...item,tier,audio});
}
// Expert sentences are new and have no recording; the review screen shows them in writing.
for(const [list,tier,minWords] of [[expertItems,'expert',9],[expertItems2,'expert2',12],[expertItems3,'expert3',15]])for(const item of list){
  const full={...item,tier,audio:null};
  if(!Core.validateExpert(full))throw Error('Invalid expert item: '+item.s);
  if(full.s.split(/\s+/).length<minWords)throw Error('Expert sentence too short: '+item.s);
  if(out.some(o=>/^expert/.test(o.tier)&&o.a.toLowerCase()===full.a.toLowerCase()))throw Error('Expert key word used twice: '+item.a);
  if(out.some(o=>o.s===full.s))throw Error('Duplicate sentence: '+item.s);
  out.push(full);
}
// Turtle Dash other-words answers for the main race word sets: [simple, harder] per word, from one glossary.
// The right answer never reuses a content word of its sentence, so it cannot be found by scanning.
const glossary=require('./turtle-dash-glossary.json');
const STOP=new Set('a an the of to in on at by is are was it its and or for with my me i we you he she his her our your this that these those be can do does did not no all one two up out off from into over under as so very'.split(' '));
const content=t=>t.toLowerCase().replace(/[^a-z' ]/g,' ').split(/\s+/).filter(w=>w.length>=3&&!STOP.has(w));
// Other-words answers use only words he already reads: the BlitzWord 200 list plus every word of the
// main-race sentences, questions and choices he met in turtles 1-20 (plural and possessive forms count).
const mainItems=out.filter(i=>/^core[1-4]?$/.test(i.tier));
const tokens=t=>t.toLowerCase().replace(/'s\b/g,'').match(/[a-z]+(?:'[a-z]+)?/g)||[];
const known=new Set(require('./turtle-dash-known-words.json').core200);
for(const i of mainItems)for(const t of [i.s,i.q,i.t,i.f,i.a,...i.w])for(const w of tokens(t))known.add(w);
const isKnown=w=>known.has(w)||known.has(w+'s')||(w.endsWith('s')&&known.has(w.slice(0,-1)))||(w.endsWith('es')&&known.has(w.slice(0,-2)))||(w.endsWith('ies')&&known.has(w.slice(0,-3)+'y'));
for(const [word,pair] of Object.entries(glossary))for(const text of pair){
  const unknown=tokens(text).filter(w=>!isKnown(w));
  if(unknown.length)throw Error(`Other-words answer for "${word}" uses unknown words (${unknown}): ${text}`);
  if(tokens(text).includes(word))throw Error(`Other-words answer for "${word}" repeats the word: ${text}`);
}
for(const item of mainItems){
  const words=[item.a,...item.w].map(x=>x.toLowerCase());
  for(const w of words)if(!glossary[w])throw Error('Missing other-words entry: '+w);
  item.o1=words.map(w=>glossary[w][0]);item.o2=words.map(w=>glossary[w][1]);
  const sentence=new Set(content(item.s));
  for(const o of [item.o1,item.o2]){
    if(new Set(o).size!==3)throw Error('Duplicate other-words answers: '+item.s);
    const hit=content(o[0]).filter(w=>sentence.has(w));if(hit.length)throw Error('Other-words answer reuses "'+hit+'": '+item.s);
  }
}
const data={version:'turtle-race-expert-30-20261030-r1',items:out,voice};
fs.writeFileSync(path.join(root,'assets/turtle-race/items.js'),
  '/* Generated by scripts/build-turtle-race.cjs. Sentence audio reuses existing recordings. */\n(function(root){\nconst data='+JSON.stringify(data,null,1)+";\nif(typeof module==='object'&&module.exports)module.exports=data;else root.TurtleRaceData=data;\n})(typeof globalThis!=='undefined'?globalThis:this);\n");
console.log(JSON.stringify({items:out.length,core:out.filter(i=>i.tier==='core').length,core2:out.filter(i=>i.tier==='core2').length,core3:out.filter(i=>i.tier==='core3').length,core4:out.filter(i=>i.tier==='core4').length,expert:out.filter(i=>i.tier==='expert').length,expert2:out.filter(i=>i.tier==='expert2').length,expert3:out.filter(i=>i.tier==='expert3').length,voiceClips:Object.keys(voice).length}));
