// Validate and install generated outputs. No provider calls; never overwrite old audio.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),raw=path.resolve(process.argv[2]||'narration-budget-output');
const plan=require('../docs/NARRATION_BUDGET_REQUEST.json'),reuse=require('../docs/NARRATION_BUDGET_REUSE.json');
const result=JSON.parse(fs.readFileSync(path.join(raw,'generation.json'),'utf8'));
if(result.status!=='complete'||Object.keys(result.clips).length!==plan.segmentCount)throw Error('Incomplete generation');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const expected=new Map(plan.batches.flatMap(b=>b.segments.map(s=>[s.key,b])));
for(const [text,clip] of Object.entries(reuse.clips)){
 if(hash(fs.readFileSync(path.join(root,clip.file)))!==clip.sha256)throw Error('Reused file hash mismatch: '+text);
}
fs.mkdirSync(path.join(root,'docs/narration-budget/receipts'),{recursive:true});
for(const b of plan.batches){
 const audio=fs.readFileSync(path.join(raw,b.id,'audio.mp3'));
 const receipt=JSON.parse(fs.readFileSync(path.join(raw,b.id,'receipt.json'),'utf8'));
 const meta=result.batches.find(x=>x.id===b.id);
 if(!meta||receipt.text!==b.text||hash(audio)!==receipt.sha256||meta.sha256!==receipt.sha256)throw Error('Receipt mismatch: '+b.id);
 const clips=b.segments.map(s=>result.clips[s.key]);
 for(let i=0;i<clips.length;i++){
  const c=clips[i];
  if(!c||c.sha256!==receipt.sha256||c.file!=='assets/narration/'+b.id+'.mp3'||c.offset<0||c.duration<=.15||c.offset+c.duration>meta.duration+.001)throw Error('Invalid segment: '+b.id);
  if(i&&Math.abs(clips[i-1].offset+clips[i-1].duration-c.offset)>.001)throw Error('Segment overlap: '+b.id);
 }
 const dest=path.join(root,'assets/narration',b.id+'.mp3');
 if(fs.existsSync(dest)&&hash(fs.readFileSync(dest))!==receipt.sha256)throw Error('Refusing to replace paid audio: '+dest);
 fs.writeFileSync(dest,audio);fs.writeFileSync(path.join(root,'docs/narration-budget/receipts',b.id+'.json'),JSON.stringify(receipt)+'\n');
}
for(const text of Object.keys(result.clips))if(!expected.has(text))throw Error('Unexpected generated text: '+text);
const manifest=require('../narration');
for(const [text,clip] of Object.entries({...reuse.clips,...result.clips})){
 if(manifest.clips[text]&&JSON.stringify(manifest.clips[text])!==JSON.stringify(clip))throw Error('Refusing to replace existing narration: '+text);
 manifest.clips[text]=clip;
}
// Main's simpler mission wording arrived after the batch was paid. Reuse the
// exact creature-name spans from those receipts instead of recording 20 names.
const names={};
for(const enemy of require('../content').enemies){
 const text='A '+enemy.name+' is ready for your challenge.',batch=expected.get(text);
 if(!batch)throw Error('Missing paid source for creature name: '+enemy.name);
 const r=JSON.parse(fs.readFileSync(path.join(raw,batch.id,'receipt.json'),'utf8')),a=r.alignment;
 let cursor=0;for(const s of batch.segments){if(s.key===text)break;cursor+=s.text.length+2;}
 const start=cursor+2,end=start+enemy.name.length;
 if(a.characters.slice(start,end).join('')!==enemy.name)throw Error('Creature-name transcript mismatch');
 const offset=(a.character_end_times_seconds[start-1]+a.character_start_times_seconds[start])/2;
 const finish=(a.character_end_times_seconds[end-1]+a.character_start_times_seconds[end])/2;
 const source=result.clips[text];
 if(offset<source.offset||finish>source.offset+source.duration+.001||finish<=offset)throw Error('Creature-name range invalid');
 names[enemy.name]={file:source.file,offset:Math.round(offset*1e4)/1e4,duration:Math.round((finish-offset)*1e4)/1e4,sha256:source.sha256};
 if(manifest.clips[enemy.name]&&JSON.stringify(manifest.clips[enemy.name])!==JSON.stringify(names[enemy.name]))throw Error('Existing name recording changed');
 manifest.clips[enemy.name]=names[enemy.name];
}
manifest.version='recorded-voice-budget-20261004-r1';manifest.recordedClipCount=manifest.runtimeClipCount=Object.keys(manifest.clips).length;
fs.writeFileSync(path.join(root,'narration.js'),'(function(root){\nconst narration='+JSON.stringify(manifest,null,2)+";\nif(typeof module==='object'&&module.exports)module.exports=narration;else root.BlitzNarration=narration;\n})(typeof globalThis!=='undefined'?globalThis:this);\n");
result.totalBatchCharacters=plan.characters;result.reusedSegments=Object.keys(reuse.clips).length;
result.derivedNames=names;
result.listeningReview='Technical decode, segment and runtime checks only; no claim of physical iPad or human pronunciation review.';
fs.writeFileSync(path.join(root,'docs/NARRATION_BUDGET_GENERATION.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({runtimeClips:manifest.runtimeClipCount,newSegments:plan.segmentCount,reusedSegments:result.reusedSegments,characters:plan.characters}));
