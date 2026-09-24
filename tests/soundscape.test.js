const test=require('node:test'),assert=require('node:assert/strict'),S=require('../soundscape');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function harness(fetch){
 const gains=[],sources=[],requests=[],timers=new Map();let id=0,context;
 const param=()=>({value:0,cancelScheduledValues(){},setValueAtTime(v){this.value=v},setTargetAtTime(v,at,seconds){this.value=v;this.at=at;this.seconds=seconds;}});
 const node=()=>({connect(){},disconnect(){this.disconnected=true;}});
 const buffer=(channels=2,length=8000,rate=1000)=>{const arrays=Array.from({length:channels},()=>new Float32Array(length));return {duration:length/rate,numberOfChannels:channels,sampleRate:rate,getChannelData:c=>arrays[c]};};
 class Context{
  constructor(){context=this;this.currentTime=0;this.sampleRate=1000;this.state='running';this.destination={};}
  resume(){this.state='running';return Promise.resolve();}close(){this.state='closed';}
  createGain(){const x={...node(),gain:param()};gains.push(x);return x;}
  createBuffer(c,n,r){return buffer(c,n,r);}
  decodeAudioData(){return Promise.resolve(buffer(2,80000));}
  createBufferSource(){const x={...node(),start(at){this.started=at;},stop(at){this.stopped=at??0;this.onended?.();}};sources.push(x);return x;}
 }
 const sound=S.create({AudioContext:Context,fetchAudio:(url,opts)=>{requests.push(url);return fetch?fetch(url,opts):Promise.resolve({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(1))});},schedule:fn=>{timers.set(++id,fn);return id;},unschedule:key=>timers.delete(key)});
 return {sound,gains,sources,requests,timers,context:()=>context};
}
test('soundscape is optional when browser audio is unavailable',()=>{const sound=S.create();sound.unlock();sound.configure({quiet:false});sound.cue('correct');sound.countdown(5);sound.dispose();});
test('no downloads before gesture; both stems start together and phase changes never restart them',async()=>{
 const h=harness();h.sound.configure({quiet:false,scene:'battle'});assert.equal(h.requests.length,0);
 h.sound.unlock();await flush();assert.equal(h.requests.length,2);
 const stems=h.sources.filter(x=>x.loopEnd);assert.equal(stems.length,2);assert.equal(stems[0].started,stems[1].started);assert.equal(stems[0].loopEnd,64);
 const level=h.gains[0].gain.value,air=h.gains[1].gain.value;
 assert.ok(level>0);assert.ok(level<S.DEFAULTS.music);assert.ok(h.gains[4].gain.value<h.gains[3].gain.value);
 h.sound.configure({reading:true});assert.equal(h.gains[0].gain.value,level);assert.equal(h.gains[1].gain.value,air);assert.equal(h.gains[2].gain.value,0);
 const count=h.sources.length;h.sound.cue('mage');assert.equal(h.sources.length,count);
 h.sound.configure({reading:false});await flush();assert.equal(h.requests.length,2);assert.equal(h.sources.length,count);assert.equal(h.gains[0].gain.value,level);h.sound.dispose();
});
test('repeated reading, spoken feedback and combat keep a continuous subdued battle mix',async()=>{
 const h=harness();h.sound.configure({quiet:false,scene:'battle',reading:true});h.sound.unlock();await flush();
 const level=h.gains[0].gain.value,air=h.gains[1].gain.value,accents=h.gains[4].gain.value;
 const stems=h.sources.filter(x=>x.loopEnd);
 for(let turn=0;turn<12;turn++){
  h.sound.configure({reading:true,narrating:false});assert.equal(h.gains[0].gain.value,level);assert.equal(h.gains[1].gain.value,air);
  const count=h.sources.length;h.sound.cue('mage');assert.equal(h.sources.length,count);
  h.sound.configure({reading:false,narrating:true});
  assert.ok(h.gains[0].gain.value>0&&h.gains[0].gain.value<level);assert.ok(h.gains[1].gain.value>0&&h.gains[1].gain.value<air);
  const duckTime=h.gains[0].gain.seconds;assert.equal(h.gains[2].gain.value,0);
  h.sound.configure({narrating:false});assert.equal(h.gains[0].gain.value,level);assert.ok(h.gains[0].gain.seconds>duckTime);
  h.sound.cue('mage',.2);const fx=h.sources.at(-1);assert.equal(h.sources.length,count+1);
  h.sound.configure({reading:true});assert.equal(fx.stopped,0);assert.equal(h.gains[0].gain.value,level);assert.equal(h.gains[4].gain.value,accents);
 }
 assert.deepEqual(h.sources.filter(x=>x.loopEnd),stems);assert.ok(stems.every(x=>x.stopped===undefined));assert.equal(h.requests.length,2);h.sound.dispose();
});
test('teaching, pause, background suspension, mute and Quiet play override continuous battle audio',async()=>{
 for(const off of [{quiet:true},{suspended:true},{enabled:false},{volumes:{quiet:true}}]){
  const h=harness();h.sound.configure({quiet:false,scene:'battle',reading:false});h.sound.unlock();await flush();h.sound.cue('pip',.45);
  const fx=h.sources.at(-1);h.sound.configure(off);assert.equal(fx.stopped,0);
  for(const gain of h.gains.slice(0,3))assert.equal(gain.gain.value,0);
  h.sound.configure({narrating:false});for(const gain of h.gains.slice(0,3))assert.equal(gain.gain.value,0);
  const count=h.sources.length;h.sound.cue('correct');assert.equal(h.sources.length,count);h.sound.dispose();
 }
});
test('home narration still suppresses music, and saved zero music leaves independent forest ambience',async()=>{
 const h=harness();h.sound.configure({quiet:false,scene:'home'});h.sound.unlock();await flush();
 h.sound.configure({narrating:true});assert.equal(h.gains[0].gain.value,0);assert.equal(h.gains[1].gain.value,0);
 h.sound.configure({scene:'battle',reading:true,narrating:false,volumes:{music:0,ambience:.5}});await flush();
 assert.equal(h.gains[0].gain.value,0);assert.ok(h.gains[1].gain.value>0);h.sound.dispose();
});
test('speech, pause and mute stop pending effects, and cues cannot leak into reading',async()=>{
 const h=harness();h.sound.configure({quiet:false});h.sound.unlock();await flush();h.sound.cue('mage',.2);const fx=h.sources.at(-1);
 h.sound.configure({narrating:true});assert.equal(fx.stopped,0);assert.equal(h.gains[2].gain.value,0);
 const count=h.sources.length;h.sound.cue('wrong');assert.equal(h.sources.length,count);
 h.sound.configure({narrating:false});h.sound.cue('pip');const pip=h.sources.at(-1);h.sound.configure({suspended:true});assert.equal(pip.stopped,0);
 h.sound.configure({suspended:false,enabled:false});assert.equal(h.gains[0].gain.value,0);h.sound.dispose();
});
test('late downloads after Home cannot start battle music; repeated configure creates only one pair',async()=>{
 const resolve=[];const h=harness(()=>new Promise(r=>resolve.push(r)));h.sound.configure({quiet:false,scene:'battle'});h.sound.unlock();
 for(let i=0;i<20;i++)h.sound.configure({scene:'battle'});
 assert.equal(h.requests.length,2);h.sound.configure({scene:'home'});
 resolve.splice(0).forEach(r=>r({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(1))}));await flush();
 assert.equal(h.sources.filter(x=>x.loopEnd).length,0);assert.equal(h.requests.length,4);
 resolve.splice(0).forEach(r=>r({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(1))}));await flush();
 assert.equal(h.sources.filter(x=>x.loopEnd).length,2);assert.ok(h.sources.filter(x=>x.loopEnd).every(x=>x.loopEnd===80));h.sound.dispose();
});
test('music failure is bounded and never automatically retried on every game heartbeat',async()=>{
 const h=harness(()=>Promise.resolve({ok:false}));h.sound.configure({quiet:false});h.sound.unlock();await flush();
 for(let i=0;i<20;i++)h.sound.configure({scene:'home'});await flush();assert.equal(h.requests.length,2);
 h.sound.cue('correct');assert.ok(h.sources.length>1);h.sound.dispose();
});
test('quiet preset preserves speech preference, volume clamps, and countdown is optional and deduplicated',async()=>{
 assert.deepEqual(S.settings({music:NaN,effects:7,speech:.7,quiet:true}),{...S.DEFAULTS,music:.65,effects:1,speech:.7,quiet:true});
 const h=harness();h.sound.configure({quiet:false});h.sound.unlock();await flush();let count=h.sources.length;
 h.sound.countdown(3);assert.equal(h.sources.length,count);
 h.sound.configure({volumes:{countdown:true}});h.sound.resetCountdown();h.sound.countdown(3);h.sound.countdown(3);assert.equal(h.sources.length,count+1);
 h.sound.configure({volumes:{quiet:true}});count=h.sources.length;h.sound.cue('victory');assert.equal(h.sources.length,count);assert.equal(h.gains[0].gain.value,0);h.sound.dispose();
});


test('a stalled response body times out without blocking later scene changes',async()=>{
 const h=harness(()=>Promise.resolve({ok:true,arrayBuffer:()=>new Promise(()=>{})}));
 h.sound.configure({quiet:false,scene:'battle'});h.sound.unlock();await flush();assert.equal(h.timers.size,2);
 for(const expire of [...h.timers.values()])expire();await flush();assert.equal(h.timers.size,0);
 h.sound.configure({scene:'home'});await flush();assert.equal(h.requests.length,4);h.sound.dispose();
});
