// Inventory only. No provider credentials or network calls.
const fs=require('node:fs'),crypto=require('node:crypto'),C=require('../content'),N=require('../narration');
const generated=new Map(),aligned=new Map();
function add(text,kind){if(!N.clips[text]&&!generated.has(text))generated.set(text,{text,kind});}
for(const area of C.areas.slice(1))add(C.chapterStories[area.id].sentence,'story-sentence');
for(const enemy of C.enemies)for(const prefix of ['', 'Reading check complete. Now your first chapter begins. '])add(prefix+(/^Acorn/.test(enemy.name)?'An ':'A ')+enemy.name+' is on the path. Ready to battle?','enemy-intro');
const items=[...C.words,...C.legacyWords,...C.assessmentPools.flat()];
for(const item of items){
 for(const word of new Set([...(item.pool||[]),...item.d.filter(w=>w!==item.w)]))add('You chose '+word+'.','chosen-correction');
 add('The word is '+item.w+'.','target-correction');
}
add('Practice turn. You keep your heart.','practice-prefix');
for(const item of [...C.words,...C.legacyWords])for(const text of [item.sentence,'Practice turn. You keep your heart. '+item.sentence]){
 const clip=N.clips[text];if(!clip)throw Error('Missing approved teaching recording: '+text);
 aligned.set(text,{text,file:clip.file,sha256:clip.sha256});
}
const entries=[...generated.values()],batches=[];
// Full clauses are spoken together, then mapped to timestamped segments in the same MP3.
for(let i=0;i<entries.length;i+=8){const clips=entries.slice(i,i+8),text=clips.map(x=>x.text).join('\n\n');batches.push({id:'batch-'+String(batches.length+1).padStart(3,'0'),text,clips});}
const plan={version:1,voiceId:'JBFqnCBsd6RMkjVDRZzb',model:'eleven_multilingual_v2',settings:{stability:.65,similarity_boost:.8,style:0,use_speaker_boost:true,speed:.9},characters:batches.reduce((s,b)=>s+b.text.length,0),clipCount:entries.length,batches,alignments:[...aligned.values()]};
if(plan.characters>40000||plan.batches.length>220||plan.alignments.length>402)throw Error('Review generation budget');
fs.writeFileSync('docs/NARRATION_COMPLETION_REQUEST.json',JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify({clips:entries.length,batches:batches.length,characters:plan.characters,alignments:aligned.size,kinds:entries.reduce((o,x)=>(o[x.kind]=(o[x.kind]||0)+1,o),{})}));
