// Runner for the BlitzWord narration completion (4 Oct 2026). This stale, already merged branch
// is reused only because its existing workflow holds the ELEVENLABS_API_KEY secret; the files the
// workflow commits (story-intro-*.mp3 and docs/NARRATION_REMAINDER_GENERATION.json) carry the output.
// mode "check": read the allowance only (no credits). mode "generate": generate the requested
// batches in order while the reported allowance covers the next one; stop cleanly otherwise.
// Never prints or stores the secret.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const key=process.env.ELEVENLABS_API_KEY;if(!key)throw new Error('ELEVENLABS_API_KEY is missing');
const run=JSON.parse(fs.readFileSync(path.join(root,'docs/narration-completion/RUN-20261004.json'),'utf8'));
const redact=s=>String(s).split(key).join('[redacted]');
async function call(method,endpoint,body){
  const r=await fetch('https://api.elevenlabs.io/v1/'+endpoint,{method,headers:{'xi-api-key':key,'Content-Type':'application/json'},body});
  const text=await r.text();
  if(!r.ok)throw new Error('ElevenLabs HTTP '+r.status+' on '+endpoint.split('?')[0]+': '+redact(text).slice(0,1200));
  return {json:JSON.parse(text),requestId:r.headers.get('request-id')};
}
async function allowance(){
  try{
    const {json:s}=await call('GET','user/subscription');
    const pick={};for(const k of ['tier','status','character_count','character_limit','next_character_count_reset_unix','can_extend_character_limit','allowed_to_extend_character_limit','max_character_limit_extension'])pick[k]=s[k]??null;
    pick.remaining=(s.character_limit||0)-(s.character_count||0);
    if(s.next_character_count_reset_unix)pick.nextResetUtc=new Date(s.next_character_count_reset_unix*1000).toISOString();
    return pick;
  }catch(error){return {error:String(error.message)};}
}
(async()=>{
  const record={runner:'narration-completion-20261004',ranAt:new Date().toISOString(),mode:run.mode,allowanceBefore:await allowance(),generated:[],notGenerated:[],stopReason:null};
  // Diagnostics without credits: key shape only (never its value) and two read-only endpoints.
  record.keyShape={length:key.length,trimmedLength:key.trim().length,startsWithSk:key.startsWith('sk_')};
  record.endpoints={};
  for(const endpoint of ['user','models']){try{await call('GET',endpoint);record.endpoints[endpoint]='ok';}catch(error){record.endpoints[endpoint]=redact(error.message).slice(0,400);}}
  console.log('ALLOWANCE '+JSON.stringify(record.allowanceBefore));
  if(run.mode==='generate'){
    const plan=JSON.parse(fs.readFileSync(path.join(root,run.request),'utf8'));
    if(plan.voiceId!=='JBFqnCBsd6RMkjVDRZzb'||plan.characters>run.maxCharacters)throw new Error('Request exceeds approved scope');
    let remaining=Number.isFinite(record.allowanceBefore.remaining)?record.allowanceBefore.remaining:Infinity;
    for(const batch of plan.batches){
      if(record.stopReason){record.notGenerated.push(batch.id);continue;}
      if(batch.text.length+(run.margin||100)>remaining){record.notGenerated.push(batch.id);continue;}
      try{
        const {json,requestId}=await call('POST','text-to-speech/'+plan.voiceId+'/with-timestamps?output_format=mp3_44100_128',JSON.stringify({text:batch.text,model_id:plan.model,voice_settings:plan.settings}));
        const audio=Buffer.from(json.audio_base64,'base64');
        const file='assets/narration/story-intro-gen20261004-'+batch.id+'.mp3';fs.writeFileSync(path.join(root,file),audio);
        const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',path.join(root,file)],{encoding:'utf8'}));
        if(probe.streams?.[0]?.codec_name!=='mp3')throw new Error('Decoded stream is not MP3: '+batch.id);
        record.generated.push({id:batch.id,file,sha256:crypto.createHash('sha256').update(audio).digest('hex'),bytes:audio.length,duration:Number(probe.format.duration),requestId,text:batch.text,alignment:json.alignment});
        remaining-=batch.text.length;console.log('Generated '+batch.id);
      }catch(error){record.stopReason=redact(error.message);record.notGenerated.push(batch.id);console.log('STOP '+record.stopReason);}
    }
    record.allowanceAfter=await allowance();
  }
  fs.writeFileSync(path.join(root,'docs/NARRATION_REMAINDER_GENERATION.json'),JSON.stringify(record)+'\n');
  console.log('SUMMARY '+JSON.stringify({generated:record.generated.length,notGenerated:record.notGenerated.length,stopReason:record.stopReason,allowanceAfter:record.allowanceAfter}));
})().catch(error=>{console.error(redact(error.message));process.exit(1);});
