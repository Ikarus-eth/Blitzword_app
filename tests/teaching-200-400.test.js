const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const C=require('../content'),V=require('../assets/teaching/200-400/visuals'),N=require('../narration'),A=require('../audio');
const root=path.resolve(__dirname,'..'),audit=require('../docs/adventures/ipad-support/TEACHING_200_400.json');
test('all 201 requested teaching moments retain their exact curriculum text and have real visual/audio files',()=>{
 const range=C.words.slice(199,400);assert.equal(range.length,201);assert.equal(Object.keys(V.words).length,200);
 for(let i=0;i<range.length;i++){
  const w=range[i],v=V.words[w.w],item={...w,...v};assert.equal(w.w,audit.words[i].word);assert.equal(w.sentence,audit.words[i].sentence);assert.equal(w.teaching?.tip||null,audit.words[i].tip);
  assert.ok(fs.existsSync(path.join(root,C.teachingSource(item))),w.w);assert.ok(item.alt,w.w);
  if(v?.crop){const [x,y,width,height]=v.crop;assert.ok(x>=0&&y>=0&&width>0&&height>0&&x+width<=v.atlasSize[0]&&y+height<=v.atlasSize[1],w.w);}
  for(const text of [w.spoken||w.w,w.sentence,w.teaching?.tip].filter(Boolean)){const parts=A.recordedParts(text,N.clips);assert.ok(parts,text);for(const part of parts)assert.ok(fs.existsSync(path.join(root,N.clips[part].file)),part);}
 }
 assert.equal(V.words.ninety,undefined,'later batches stay outside scope');
});
test('number lessons count exact quantities without asking image generation to count',()=>{
 const expected={zero:0,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80};
 for(const [word,n] of Object.entries(expected)){const q=V.words[word].quantity,svg=V.quantitySvg(q);assert.equal(q.value,n);assert.ok(svg.includes(`${n} ${q.unit}`));if(q.special==='zero')assert.match(svg,/No cakes left/);else if(q.special)assert.equal((svg.match(/<circle /g)||[]).length,n,word);else assert.equal((svg.match(/<image /g)||[]).length,n,word);}
});
test('397 new files match retained paid receipts and every pre-existing recording remains',()=>{
 const g=require('../docs/TEACHING_200_400_AUDIO_GENERATION.json');assert.equal(g.newFiles,397);assert.equal(g.characters,19201);assert.equal(g.retainedEntries,3092);
 for(const r of g.receipts){const c=N.clips[r.key];assert.equal(c.sha256,r.sha256);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,c.file))).digest('hex'),r.sha256);assert.ok(r.requestId);}
 // Compare the historical batch after restoring the explicitly superseded ate entry.
 const historical={...N.clips,ate:require('../docs/NARRATION_WORDS_FAL_GENERATION.json').clips.ate};
 assert.deepEqual(N.clips.ate,N.clips.eight);
 const old=Object.entries(historical).filter(([k,c])=>!c.file.includes('teach-200-400-')).sort(([a],[b])=>a.localeCompare(b));assert.equal(old.length,3092);assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),g.retainedManifestDigest);
});
test('Pages packages the new runtime and the review page never loads learner storage',()=>{
 assert.match(fs.readFileSync(path.join(root,'.github/workflows/pages.yml'),'utf8'),/cp -R assets _site\/assets/);
 const html=fs.readFileSync(path.join(root,'assets/teaching-review/index.html'),'utf8');assert.ok(!html.includes('storage.js'));assert.ok(!html.includes('game-core.js'));assert.ok(html.includes('assets/teaching/200-400/visuals.js'));
});
