const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),manifest=require('../narration'),corpus=require('../docs/NARRATION_CORPUS.json'),generation=require('../docs/NARRATION_GENERATION.json'),C=require('../content');
const fallbackOnly=new Set(corpus.runtimeFallbackOnly||[]);
test('every recovered narration clip has a verified local MP3 and runtime lookup matches approval state',()=>{
 // 990 recovered clips, four Pip evolution recordings, 34 stable story introductions and one shield prefix.
 assert.equal(corpus.clips.length,1029);assert.equal(manifest.recoveredClipCount,994);assert.equal(manifest.recordedClipCount,1029);
 assert.equal(Object.keys(manifest.clips).length,corpus.runtimeClipCount);assert.equal(manifest.runtimeClipCount,corpus.runtimeClipCount);
 assert.deepEqual(new Set(manifest.fallbackOnly||[]),fallbackOnly);
 const receipts=new Map(generation.clips.map(x=>[x.id,x]));
 for(const clip of corpus.clips){
  const receipt=receipts.get(clip.id);assert.ok(receipt,clip.id);assert.equal(receipt.text,clip.text);assert.equal(receipt.file,clip.file);
  const bytes=fs.readFileSync(path.join(root,clip.file));assert.ok(bytes.length>1000,clip.file);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),receipt.sha256,clip.file);assert.ok(receipt.duration>.2,clip.file);
  const entry=manifest.clips[clip.text];
  if(fallbackOnly.has(clip.text))assert.equal(entry,undefined,clip.text);
  else {assert.ok(entry,clip.text);assert.equal(entry.file,clip.file);assert.equal(entry.sha256,receipt.sha256);assert.ok(entry.duration>.2);}
 }
});
test('recovered runtime covers all current approved words, teaching and corrections',()=>{
 const presentOrFallback=text=>{
  if(fallbackOnly.has(text))assert.equal(manifest.clips[text],undefined,text);
  else assert.ok(manifest.clips[text],text);
 };
 for(const item of [...C.words,...C.legacyWords,...C.assessmentPools.flat()])presentOrFallback(item.w);
 for(const item of [...C.words,...C.legacyWords]){
  presentOrFallback(item.sentence);presentOrFallback('Practice turn. You keep your heart. '+item.sentence);
  presentOrFallback('The word was '+item.w+'.');presentOrFallback('Practice turn. You keep your heart. The word was '+item.w+'.');
 }
 for(const enemy of C.enemies){presentOrFallback('A '+enemy.name+' is on the path. Ready to battle?');presentOrFallback('Reading check complete. Now your first chapter begins. A '+enemy.name+' is on the path. Ready to battle?');}
 for(const [i,text] of [C.evolution.intro,...C.evolution.lines.slice(1).map(lines=>lines.join(' '))].entries())assert.equal(manifest.clips[text]?.file,'assets/narration/evolution-'+i+'.mp3',text);
 presentOrFallback('Pip is on the rock.');presentOrFallback('Let’s try a few words. Look at the word. When it hides, tap the same word. Tap the question mark if you are not sure.');
 assert.equal(fallbackOnly.size,0);for(const text of ['gate','The gate is by the castle.','Practice turn. You keep your heart. The gate is by the castle.','The word was gate.','Practice turn. You keep your heart. The word was gate.'])assert.ok(manifest.clips[text],text);
});
test('stable story introductions and reusable shield prefix are recorded; rewrite-pending story sentences stay local',()=>{
 const {narrator}=require('../audio');let downloads=0,spoken=[];
 const n=narrator({clips:manifest.clips,fetchAudio:()=>{downloads++;throw Error('Unexpected download');},AudioContext:function(){throw Error('Unexpected audio request');},synth:{cancel(){},resume(){},getVoices(){return[];},speak:u=>spoken.push(u.text)},Utterance:function(text){this.text=text;},schedule:()=>1,unschedule:()=>{}});
 const areas=C.areas.slice(1);
 for(const area of areas){const story=C.chapterStories[area.id];assert.ok(manifest.clips[story.narration],area.id+' intro');}
 assert.ok(manifest.clips['Your shield stopped the hit.']);
 const missingSentences=[...new Set(areas.map(area=>C.chapterStories[area.id].sentence))].filter(text=>!manifest.clips[text]);
 assert.ok(missingSentences.length>=25);
 for(const text of missingSentences){n.speak(text);assert.equal(spoken.at(-1),text.replace(/\bgate\b/gi,w=>w[0]==='G'?'Gait':'gait'));}
 assert.equal(downloads,0);assert.equal(spoken.length,missingSentences.length);
});
