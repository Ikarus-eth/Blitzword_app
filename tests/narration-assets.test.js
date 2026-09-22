const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),manifest=require('../narration'),corpus=require('../docs/NARRATION_CORPUS.json'),C=require('../content');
test('every prepared narration clip has a verified local MP3 and a unique exact-text lookup',()=>{
 assert.equal(Object.keys(manifest.clips).length,corpus.clips.length);
 for(const clip of corpus.clips){
  const entry=manifest.clips[clip.text];assert.ok(entry,clip.text);assert.equal(entry.file,clip.file);
  const bytes=fs.readFileSync(path.join(root,entry.file));assert.ok(bytes.length>1000);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,clip.file);assert.ok(entry.duration>.2);
 }
});
test('recordings cover all words, teaching, corrections, introductions and narrator preview',()=>{
 const present=text=>assert.ok(manifest.clips[text],text);
 for(const word of [...C.words,...C.legacyWords,...C.assessmentPools.flat()])present(word.w);
 for(const item of [...C.words,...C.legacyWords]){
  present(item.sentence);present('Practice turn. You keep your heart. '+item.sentence);
  present('The word was '+item.w+'.');present('Practice turn. You keep your heart. The word was '+item.w+'.');
 }
 for(const enemy of C.enemies){present('A '+enemy.name+' is on the path. Ready to battle?');present('Reading check complete. Now your first chapter begins. A '+enemy.name+' is on the path. Ready to battle?');}
 present('Pip is on the rock.');present('Let’s try a few words. Look at the word. When it hides, tap the same word. Tap the question mark if you are not sure.');
});
