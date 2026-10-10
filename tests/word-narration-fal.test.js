const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const C=require('../content'),N=require('../narration'),A=require('../audio'),P=require('../docs/NARRATION_WORDS_FAL_REQUEST.json');
const G=require('../docs/NARRATION_WORDS_FAL_GENERATION.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('all 1000 curriculum words and their six context-sensitive pronunciations have actual recordings',()=>{
 assert.equal(C.words.length,1000);assert.equal(C.words.filter(w=>w.spoken).length,6);
 for(const w of C.words)for(const text of new Set([w.w,w.spoken||w.w])){
  const parts=A.recordedParts(text,N.clips);assert.ok(parts,text);
  for(const part of parts)assert.ok(fs.existsSync(path.join(__dirname,'..',N.clips[part].file)),text);
 }
 assert.deepEqual(N.clips["I'll"],N.clips["i'll"]);
});
test('fal batch is restricted to missing target words and required contexts',()=>{
 assert.equal(P.items.length,675);assert.equal(P.items.filter(s=>s.kind==='target-word').length,669);assert.equal(P.items.filter(s=>s.kind==='pronunciation-context').length,6);
 const texts=new Set(C.words.flatMap(w=>[w.w,w.spoken].filter(Boolean)));
 for(const item of P.items)assert.ok(texts.has(item.key),item.key);
 assert.equal(P.characters,4471);assert.equal(P.items.reduce((n,s)=>n+s.text.length,0),4471);assert.equal(P.maxCharacters,4471);
 assert.equal(G.provider,'fal.ai');assert.equal(G.model,'fal-ai/elevenlabs/tts/multilingual-v2');assert.equal(G.status,'complete');
 assert.equal(G.voice,P.voice);assert.equal(G.newFiles,675);assert.equal(G.retainedEntries,2416);assert.equal(G.runtimeEntries,3092);
});
test('each newly recorded word has a matching receipt and intact MP3',()=>{
 for(const item of P.items){
  const clip=G.clips[item.key],r=G.receipts.find(r=>r.key===item.key);
  assert.deepEqual(N.clips[item.key],clip,item.key);assert.equal(r.text,item.text);assert.ok(r.requestId,item.key);
  assert.ok(Number.isFinite(clip.duration)&&clip.duration>.2&&clip.duration<20,item.key);
  const bytes=fs.readFileSync(path.join(__dirname,'..',clip.file));assert.equal(hash(bytes),clip.sha256,item.key);assert.equal(r.sha256,clip.sha256);
 }
 const added=new Set([...P.items.map(s=>s.key),...Object.keys(P.aliases)]);
 const retained=Object.entries(N.clips).filter(([key])=>!added.has(key)).sort(([a],[b])=>a.localeCompare(b));
 assert.equal(retained.length,2416);assert.equal(hash(JSON.stringify(retained)),G.retainedManifestDigest,'every pre-existing clip must remain unchanged');
});
test('unrecorded sentences, personal names and unknown saved choices keep device fallback',()=>{
 assert.equal(A.recordedParts('UnrecordedPersonalName is on the rock.',N.clips),null);
 assert.equal(A.recordedParts('You chose unknownoldsavedchoice. The word is been.',N.clips),null);
 const deferred=C.words.filter(w=>w.expansion&&!w.spoken&&!N.clips[w.sentence]);assert.ok(deferred.length>700);
 assert.ok(A.recordedParts('You chose us. The word is been.',N.clips));
 assert.ok(A.recordedParts("You chose I'll. The word is been.",N.clips));
 assert.deepEqual(A.recordedParts('Been.',N.clips),['been']);
});
