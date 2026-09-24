const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),C=require('../content'),plan=require('../docs/NARRATION_COMPLETION_REQUEST.json'),staged=require('../docs/NARRATION_COMPLETION_GENERATION.json'),old=require('../narration');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
test('the bounded generation request covers every current story, enemy intro and current/legacy correction clause',()=>{
 const texts=new Set([...Object.keys(old.clips),...plan.batches.flatMap(b=>b.clips.map(c=>c.text))]);
 for(const area of C.areas.slice(1))assert.ok(texts.has(C.chapterStories[area.id].sentence));
 for(const e of C.enemies)for(const prefix of ['', 'Reading check complete. Now your first chapter begins. '])assert.ok(texts.has(prefix+(/^Acorn/.test(e.name)?'An ':'A ')+e.name+' is on the path. Ready to battle?'));
 for(const item of [...C.words,...C.legacyWords,...C.assessmentPools.flat()]){
  assert.ok(texts.has('The word is '+item.w+'.'));
  for(const chosen of new Set([...(item.pool||[]),...item.d.filter(w=>w!==item.w)]))assert.ok(texts.has('You chose '+chosen+'.'),chosen);
 }
 assert.ok(plan.characters<=40000);assert.equal(plan.characters,plan.batches.reduce((n,b)=>n+b.text.length,0));
 const teaching=new Set(plan.alignments.map(a=>a.text));for(const item of [...C.words,...C.legacyWords])for(const prefix of ['', 'Practice turn. You keep your heart. '])assert.ok(teaching.has(prefix+item.sentence));
});
test('staged narration has exact text, intact audio, ordered segments and validated word boundaries',()=>{
 const expected=new Map(plan.batches.flatMap(b=>b.clips.map(c=>[c.text,b.id]))),byFile=new Map();
 assert.equal(staged.stagedClips,Object.keys(staged.clips).length);assert.equal(staged.stagedAlignments,Object.keys(staged.alignments).length);
 assert.equal(staged.status,staged.missing.length?'incomplete':'complete');
 for(const b of staged.batches){const data=fs.readFileSync(path.join(root,b.file));assert.equal(hash(data),b.sha256);byFile.set(b.file,b);}
 for(const [text,clip] of Object.entries(staged.clips)){
  assert.ok(expected.has(text));const batch=byFile.get(clip.file);assert.ok(batch);assert.equal(clip.sha256,batch.sha256);assert.ok(clip.offset>=0&&clip.offset+clip.duration<=batch.duration+.001);
  for(const w of clip.words){assert.match(text.slice(w.charIndex,w.charIndex+w.charLength),/^[A-Za-z]+(?:['’][A-Za-z]+)*$/);assert.ok(w.start>=0&&w.end>w.start&&w.end<=clip.duration+.05);}
 }
 for(const b of staged.batches){const entries=Object.values(staged.clips).filter(c=>c.file===b.file).sort((a,c)=>a.offset-c.offset);assert.equal(entries.length,b.clipCount);for(let i=1;i<entries.length;i++)assert.ok(Math.abs(entries[i-1].offset+entries[i-1].duration-entries[i].offset)<.001);}
 for(const [text,words] of Object.entries(staged.alignments)){
  const request=plan.alignments.find(a=>a.text===text);assert.ok(request);assert.equal(hash(fs.readFileSync(path.join(root,request.file))),request.sha256);
  assert.deepEqual(words.map(w=>text.slice(w.charIndex,w.charIndex+w.charLength)),text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g));
 }
});
