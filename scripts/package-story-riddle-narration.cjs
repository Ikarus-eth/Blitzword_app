// Install verified provider output and previously paid stories. No provider calls.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),raw=path.resolve(process.argv[2]);
const plan=require('../docs/NARRATION_STORY_RIDDLE_REQUEST.json'),reuse=require('../docs/NARRATION_STORY_RIDDLE_REUSE.json');
const generated=JSON.parse(fs.readFileSync(path.join(raw,'generation.json'),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(generated.status!=='complete'||Object.keys(generated.clips).length!==plan.segmentCount)throw Error('Incomplete provider output');
const expected=new Map(plan.batches.flatMap(b=>b.segments.map(s=>[s.key,b.id])));
for(const key of Object.keys(generated.clips))if(!expected.has(key))throw Error('Unexpected text');
for(const clip of Object.values(reuse.clips))if(hash(fs.readFileSync(path.join(root,clip.file)))!==clip.sha256)throw Error('Paid story file changed');
fs.mkdirSync(path.join(root,'docs/narration-story-riddle/receipts'),{recursive:true});
for(const batch of plan.batches){
 const bytes=fs.readFileSync(path.join(raw,batch.id,'audio.mp3')),r=JSON.parse(fs.readFileSync(path.join(raw,batch.id,'receipt.json'),'utf8'));
 const meta=generated.batches.find(b=>b.id===batch.id);
 if(!meta||hash(bytes)!==r.sha256||r.sha256!==meta.sha256||r.text!==batch.text)throw Error('Receipt mismatch: '+batch.id);
 const segments=batch.segments.map(s=>generated.clips[s.key]);
 for(let i=0;i<segments.length;i++){
  const c=segments[i];if(!c||c.file!=='assets/narration/'+batch.id+'.mp3'||c.sha256!==r.sha256||c.offset<0||c.duration<=.15||c.offset+c.duration>meta.duration+.001)throw Error('Invalid audio segment');
  if(i&&Math.abs(segments[i-1].offset+segments[i-1].duration-c.offset)>.001)throw Error('Non-contiguous audio segments');
 }
 const dest=path.join(root,'assets/narration',batch.id+'.mp3');
 if(fs.existsSync(dest)&&hash(fs.readFileSync(dest))!==r.sha256)throw Error('Refusing to replace paid audio');
 fs.writeFileSync(dest,bytes);fs.writeFileSync(path.join(root,'docs/narration-story-riddle/receipts',batch.id+'.json'),JSON.stringify(r)+'\n');
}
const manifest=require('../narration');
for(const [text,clip] of Object.entries({...reuse.clips,...generated.clips})){
 if(manifest.clips[text]&&JSON.stringify(manifest.clips[text])!==JSON.stringify(clip))throw Error('Existing narration changed');
 manifest.clips[text]=clip;
}
manifest.version='recorded-voice-complete-20261004-r1';manifest.recordedClipCount=manifest.runtimeClipCount=Object.keys(manifest.clips).length;
fs.writeFileSync(path.join(root,'narration.js'),'(function(root){\nconst narration='+JSON.stringify(manifest,null,2)+";\nif(typeof module==='object'&&module.exports)module.exports=narration;else root.BlitzNarration=narration;\n})(typeof globalThis!=='undefined'?globalThis:this);\n");
generated.reusedStories=Object.keys(reuse.clips).length;generated.totalTextCharacters=plan.characters;generated.listeningReview='Decode and playback checks are recorded separately; no claim of human pronunciation approval or physical iPad testing.';
fs.writeFileSync(path.join(root,'docs/NARRATION_STORY_RIDDLE_GENERATION.json'),JSON.stringify(generated,null,2)+'\n');
console.log(JSON.stringify({runtimeClips:manifest.runtimeClipCount,generatedSegments:plan.segmentCount,reusedStories:generated.reusedStories,characters:plan.characters}));
