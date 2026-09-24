// Generate the stable remaining narration with ElevenLabs.
// Requires ELEVENLABS_API_KEY. Never prints or stores the secret.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const Content=require('../content.js');
const root=path.join(__dirname,'..'),outDir=path.join(root,'assets/narration');
const key=process.env.ELEVENLABS_API_KEY;
if(!key)throw new Error('ELEVENLABS_API_KEY is missing');
const voice={name:'George - Warm, Captivating Storyteller',id:'JBFqnCBsd6RMkjVDRZzb'};
const model='eleven_multilingual_v2';
const settings={stability:.65,similarity_boost:.8,style:0,use_speaker_boost:true,speed:.9};
const areas=Content.areas;
const entries=areas.slice(1).map((area,i)=>({
  id:'story-intro-'+String(i+1).padStart(2,'0'),
  kind:'chapter-story-intro',
  areaId:area.id,
  text:Content.chapterStories[area.id].narration,
  file:'assets/narration/story-intro-'+area.id+'.mp3'
}));
entries.push({id:'shield-stopped',kind:'shield-prefix',text:'Your shield stopped the hit.',file:'assets/narration/shield-stopped.mp3'});
if(entries.length!==35)throw new Error('Expected 34 story introductions plus shield prefix');
if(new Set(entries.map(x=>x.text)).size!==entries.length)throw new Error('Duplicate generation text');
const required=entries.reduce((n,x)=>n+x.text.length,0);
async function api(url,options={}){
  for(let attempt=1;attempt<=3;attempt++){
    const r=await fetch(url,{...options,headers:{'xi-api-key':key,...(options.headers||{})}});
    if(r.ok)return r;
    const body=await r.text();
    if(attempt<3&&(r.status===429||r.status>=500)){await new Promise(resolve=>setTimeout(resolve,attempt*2500));continue;}
    throw new Error('ElevenLabs HTTP '+r.status+': '+body.slice(0,500));
  }
}
async function main(){
  const sub=await (await api('https://api.elevenlabs.io/v1/user/subscription')).json();
  const remaining=Math.max(0,(sub.character_limit||0)-(sub.character_count||0));
  console.log(JSON.stringify({clips:entries.length,requiredCharacters:required,remainingCharacters:remaining,voice:voice.name,model,speed:settings.speed}));
  if(remaining<required&&!sub.can_extend_character_limit&&!(sub.max_credit_limit_extension&&sub.max_credit_limit_extension!=='0'))throw new Error('Not enough ElevenLabs credits for planned generation');
  fs.mkdirSync(outDir,{recursive:true});
  const receipts=[];
  for(const entry of entries){
    const target=path.join(root,entry.file);
    const response=await api('https://api.elevenlabs.io/v1/text-to-speech/'+voice.id+'?output_format=mp3_44100_128',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'audio/mpeg'},
      body:JSON.stringify({text:entry.text,model_id:model,language_code:'en',voice_settings:settings})
    });
    const data=Buffer.from(await response.arrayBuffer());
    if(data.length<1000)throw new Error('Generated audio too small: '+entry.id);
    fs.writeFileSync(target,data);
    const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',target],{encoding:'utf8'}));
    const duration=Number(probe.format.duration);
    if(!Number.isFinite(duration)||duration<.2||duration>60||probe.streams[0]?.codec_name!=='mp3')throw new Error('Invalid MP3: '+entry.id);
    receipts.push({...entry,provider:'ElevenLabs',voice:voice.name,voiceId:voice.id,model,speed:settings.speed,settings,status:'downloaded',duration,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
    console.log('generated '+entry.id+' '+data.length+' bytes');
  }
  const receipt={generatedAt:new Date().toISOString(),purpose:'Stable remaining narration only: 34 chapter-story introductions plus one reusable shield prefix. Child-read story sentences are intentionally excluded pending approved rewrites.',voice,model,settings,clipCount:receipts.length,characters:required,clips:receipts};
  fs.writeFileSync(path.join(root,'docs/NARRATION_REMAINDER_GENERATION.json'),JSON.stringify(receipt,null,2)+'\n');
}
main().catch(error=>{console.error(error.message);process.exit(1);});
