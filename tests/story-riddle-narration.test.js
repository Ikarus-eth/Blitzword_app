const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const C=require('../content'),M=require('../missions'),N=require('../narration'),{recordedParts}=require('../audio');
const plan=require('../docs/NARRATION_STORY_RIDDLE_REQUEST.json'),reuse=require('../docs/NARRATION_STORY_RIDDLE_REUSE.json');
test('the final narration request stays below 6000 characters and reuses every paid chapter sentence',()=>{
 assert.equal(plan.characters,5348);assert.ok(plan.characters<6000);assert.equal(plan.segmentCount,49);
 assert.equal(plan.characters,plan.batches.reduce((n,b)=>n+b.text.length,0));
 assert.equal(Object.keys(reuse.clips).length,31);assert.equal(plan.voiceId,'JBFqnCBsd6RMkjVDRZzb');assert.equal(plan.model,'eleven_multilingual_v2');assert.equal(plan.settings.speed,.9);
 const segments=plan.batches.flatMap(b=>b.segments);assert.equal(segments.filter(s=>s.kind==='ordering-prompt').length,1);
});
test('previously recorded chapter and riddle text remains; new mapmaker and shark text uses speech fallback',()=>{
 for(const a of C.areas.slice(1))assert.ok(recordedParts(C.chapterStories[a.id].sentence,N.clips),a.id);
 assert.equal(Object.values(M.puzzles).length,88);
 for(const q of Object.values(M.puzzles)){
  const text=q.text.join(' ')+' '+q.prompt,parts=recordedParts(text,N.clips);if(/^(mapmaker|shark|sky)-/.test(q.id)){assert.equal(parts,null);continue;}assert.ok(parts,text);
  assert.equal(parts.join(' '),text);
  assert.equal(parts.length,q.type==='order'?2:1);
 }
});
test('personalized story and riddle text stays on local speech instead of saying Pip',()=>{
 const personalize=t=>t.replace(/\bPip\b/g,'SparkyPersonalName');
 for(const q of Object.values(M.puzzles)){const text=q.text.join(' ')+' '+q.prompt;if(/\bPip\b/.test(text))assert.equal(recordedParts(personalize(text),N.clips),null);}
 for(const a of C.areas.slice(1)){const text=C.chapterStories[a.id].sentence;if(/\bPip\b/.test(text))assert.equal(recordedParts(personalize(text),N.clips),null);}
});
test('every final narration segment has an intact MP3 and valid bounded metadata',()=>{
 const g=require('../docs/NARRATION_STORY_RIDDLE_GENERATION.json'),cache=new Map();assert.equal(g.status,'complete');assert.equal(Object.keys(g.clips).length,49);
 for(const [text,c] of Object.entries({...reuse.clips,...g.clips})){
  assert.deepEqual(N.clips[text],c,text);assert.ok(c.offset>=0&&c.duration>.15,text);
  if(!cache.has(c.file))cache.set(c.file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',c.file))).digest('hex'));
  assert.equal(cache.get(c.file),c.sha256,text);
 }
 for(const b of g.batches){const clips=Object.values(g.clips).filter(c=>c.file==='assets/narration/'+b.id+'.mp3').sort((a,b)=>a.offset-b.offset);
  assert.equal(clips.length,b.segments);assert.ok(clips.at(-1).offset+clips.at(-1).duration<=b.duration+.001);
  for(let i=1;i<clips.length;i++)assert.ok(Math.abs(clips[i-1].offset+clips[i-1].duration-clips[i].offset)<.001);
 }
});
