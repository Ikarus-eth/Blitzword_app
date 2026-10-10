// Validate and install the authorized fal.ai words-only output, retaining every
// existing recording. This script never calls a paid service.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir=path.resolve(process.argv[2]||'narration-words-fal-output');
const plan=require('../docs/NARRATION_WORDS_FAL_REQUEST.json'),N=require('../narration');
const generated=JSON.parse(fs.readFileSync(path.join(dir,'generation.json'),'utf8'));
const receipts=JSON.parse(fs.readFileSync(path.join(dir,'requests.json'),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(generated.status!=='complete'||Object.keys(generated.clips).length!==plan.items.length||generated.characters!==plan.characters)throw Error('Incomplete generation');
const old={...N.clips},validated=[];
// Validate the complete batch before writing any runtime asset or manifest.
for(const item of plan.items){
 const c=generated.clips[item.key],r=receipts.requests[item.id],file=item.id+'.mp3',bytes=fs.readFileSync(path.join(dir,file));
 if(!c||!r||r.key!==item.key||r.text!==item.text||r.state!=='validated'||!r.request_id||c.file!=='assets/narration/'+file||hash(bytes)!==c.sha256||c.sha256!==r.sha256)throw Error('Receipt mismatch: '+item.key);
 const response=JSON.parse(fs.readFileSync(path.join(dir,item.id+'.json'),'utf8'));
 const returnedText=(response.timestamps||[]).map(t=>t.characters.join('')).join('').trim();
 if(returnedText!==item.text)throw Error('Returned text mismatch: '+item.key);
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_name','-of','json',path.join(dir,file)],{encoding:'utf8'}));
 const duration=Number(probe.format.duration);
 if(probe.streams[0]?.codec_name!=='mp3'||!Number.isFinite(duration)||duration<=.2||duration>=20||Math.abs(duration-c.duration)>.001)throw Error('Invalid audio: '+item.key);
 execFileSync('ffmpeg',['-v','error','-i',path.join(dir,file),'-f','null','-']);
 if(N.clips[item.key]&&JSON.stringify(N.clips[item.key])!==JSON.stringify(c))throw Error('Would overwrite approved clip: '+item.key);
 const target=path.join(root,c.file);if(fs.existsSync(target)&&hash(fs.readFileSync(target))!==c.sha256)throw Error('Would replace existing audio: '+target);
 validated.push({item,clip:c,bytes,receipt:{id:item.id,key:item.key,text:item.text,requestId:r.request_id,sha256:r.sha256,duration,bytes:bytes.length}});
}
for(const {item,clip,bytes} of validated){fs.writeFileSync(path.join(root,clip.file),bytes);N.clips[item.key]=clip;}
for(const [alias,target] of Object.entries(plan.aliases)){
 if(!N.clips[target]||N.clips[alias])throw Error('Invalid reuse alias');N.clips[alias]={...N.clips[target]};
}
for(const [key,value] of Object.entries(old))if(JSON.stringify(value)!==JSON.stringify(N.clips[key]))throw Error('Approved clip changed');
N.version='target-words-fal-20261010-r1';N.recordedClipCount=N.runtimeClipCount=Object.keys(N.clips).length;
fs.writeFileSync(path.join(root,'narration.js'),'(function(root){\nconst narration='+JSON.stringify(N,null,2)+";\nif(typeof module==='object'&&module.exports)module.exports=narration;else root.BlitzNarration=narration;\n})(typeof globalThis!=='undefined'?globalThis:this);\n");
const result={...generated,aliases:plan.aliases,retainedEntries:Object.keys(old).length,retainedManifestDigest:hash(JSON.stringify(Object.entries(old).sort(([a],[b])=>a.localeCompare(b)))),newFiles:validated.length,runtimeEntries:N.runtimeClipCount,receipts:validated.map(v=>v.receipt),validation:'All MP3s decoded; returned text, SHA-256 and durations verified. Human pronunciation review is not implied.'};
fs.writeFileSync(path.join(root,'docs/NARRATION_WORDS_FAL_GENERATION.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({generated:validated.length,retained:Object.keys(old).length,runtimeEntries:N.runtimeClipCount}));
