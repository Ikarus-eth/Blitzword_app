const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const C=require('../content'),M=require('../missions'),N=require('../narration'),{recordedParts}=require('../audio');
const plan=require('../docs/NARRATION_BUDGET_REQUEST.json'),reuse=require('../docs/NARRATION_BUDGET_REUSE.json');
const root=path.join(__dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('bounded generation reuses paid clauses and keeps George model and voice settings',()=>{
 assert.equal(plan.voiceId,'JBFqnCBsd6RMkjVDRZzb');assert.equal(plan.model,'eleven_multilingual_v2');assert.equal(plan.settings.speed,.9);
 assert.equal(plan.characters,7333);assert.ok(plan.characters<=8000);
 assert.equal(plan.characters,plan.batches.reduce((n,b)=>n+b.text.length,0));
 assert.equal(plan.segmentCount,855);assert.equal(Object.keys(reuse.clips).length,289);
 assert.ok(plan.batches.flatMap(b=>b.segments).every(s=>['choice-word','prefix','trail-encounter','mission-encounter'].includes(s.kind)));
});
test('every current and legacy wrong-choice correction resolves to complete recordings, including contractions and practice turns',()=>{
 let count=0;
 for(const item of [...C.words,...C.legacyWords,...C.assessmentPools.flat()]){
  for(const word of new Set([...(item.pool||[]),...item.d.filter(w=>w!==item.w)])){
   for(const prefix of ['', 'Practice turn. You keep your heart. ']){
    const text=prefix+'You chose '+word+'. The word is '+item.w+'.';
    const parts=recordedParts(text,N.clips);assert.ok(parts,text);assert.ok(parts.every(p=>N.clips[p]),text);count++;
   }
  }
 }
 assert.ok(count>2000);
 assert.ok(recordedParts("You chose can't. The word is don't.",N.clips));
 assert.equal(recordedParts('You chose unknownoldsavedchoice. The word is rock.',N.clips),null);
 assert.ok(N.clips['Your shield stopped the hit.']);
});
test('all trail families, groups, first encounters and current mission introductions have recorded playback',()=>{
 for(const e of [...C.enemies,...C.enemyVariants]){
  const name=C.enemyAt(e.family).name;
  const text=(e.count||1)>1?e.name+' are on the path. Ready to battle?':(/^Acorn/.test(name)?'An ':'A ')+name+' is on the path. Ready to battle?';
  for(const prefix of ['', 'Reading check complete. Now your first chapter begins. '])assert.ok(recordedParts(prefix+text,N.clips),prefix+text);
 }
 for(const m of M.missions)for(const family of m.encounters){const text='A '+C.enemyAt(family).name+' is ready for your challenge.';assert.ok(recordedParts(text,N.clips),text);}
});
test('new and reused audio has verified bytes and finite segments with no overlap',()=>{
 const generated=require('../docs/NARRATION_BUDGET_GENERATION.json'),files=new Map();
 assert.equal(generated.status,'complete');assert.equal(Object.keys(generated.clips).length,plan.segmentCount);
 for(const [text,clip] of Object.entries({...reuse.clips,...generated.clips})){
  assert.deepEqual(N.clips[text],clip,text);
  if(!files.has(clip.file))files.set(clip.file,hash(fs.readFileSync(path.join(root,clip.file))));
  assert.equal(files.get(clip.file),clip.sha256,text);assert.ok(clip.offset>=0&&clip.duration>.15,text);
 }
 for(const batch of generated.batches){
  const segments=Object.values(generated.clips).filter(c=>c.file==='assets/narration/'+batch.id+'.mp3').sort((a,b)=>a.offset-b.offset);
  assert.equal(segments.length,batch.segments);assert.ok(segments.at(-1).offset+segments.at(-1).duration<=batch.duration+.001);
  for(let i=1;i<segments.length;i++)assert.ok(Math.abs(segments[i-1].offset+segments[i-1].duration-segments[i].offset)<.001);
 }
});
