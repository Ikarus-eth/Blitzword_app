// Package previously generated recordings; this command never calls a speech service.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),corpus=require('../docs/NARRATION_CORPUS.json'),generation=require('../docs/NARRATION_GENERATION.json');
const clips={},fallbackOnly=new Set(corpus.runtimeFallbackOnly||[]);let bytes=0,seconds=0;
for(const clip of corpus.clips){
 const receipt=generation.clips.find(x=>x.id===clip.id);if(!receipt||receipt.text!==clip.text||(!receipt.taskId&&!(receipt.provider==='ElevenLabs'&&receipt.voiceId)))throw new Error('Missing generation receipt: '+clip.id);
 const file=path.join(root,clip.file),data=fs.readFileSync(file);
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',file],{encoding:'utf8'}));
 const duration=Number(probe.format.duration);
 if(!Number.isFinite(duration)||duration<.2||duration>60||probe.streams[0]?.codec_name!=='mp3')throw new Error('Invalid recording: '+clip.id);
 const sha256=crypto.createHash('sha256').update(data).digest('hex');
 Object.assign(receipt,{status:'downloaded',duration,bytes:data.length,sha256});
 if(!fallbackOnly.has(clip.text))clips[clip.text]={file:clip.file,duration,sha256};bytes+=data.length;seconds+=duration;
}
const manifest={version:'recorded-voice-20260924-r5',voice:generation.voice,voices:generation.voices||undefined,language:'en-GB',recoveredClipCount:994,recordedClipCount:corpus.clips.length,runtimeClipCount:Object.keys(clips).length,fallbackOnly:[...fallbackOnly],clips};
fs.writeFileSync(path.join(root,'narration.js'),'(function(root){\nconst narration='+JSON.stringify(manifest,null,2)+';\nif(typeof module===\'object\'&&module.exports)module.exports=narration;else root.BlitzNarration=narration;\n})(typeof globalThis!==\'undefined\'?globalThis:this);\n');
generation.listeningReview=generation.listeningReview||'Audible listening and physical iPad playback review remain outstanding.';
generation.clipCount=corpus.clips.length;generation.runtimeClipCount=Object.keys(clips).length;generation.runtimeFallbackOnly=[...fallbackOnly];generation.bytes=bytes;generation.durationSeconds=Number(seconds.toFixed(3));
fs.writeFileSync(path.join(root,'docs/NARRATION_GENERATION.json'),JSON.stringify(generation,null,2)+'\n');
console.log(JSON.stringify({recoveredClips:corpus.clips.length,runtimeClips:Object.keys(clips).length,bytes,seconds:Math.round(seconds)}));
