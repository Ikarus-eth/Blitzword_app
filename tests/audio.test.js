const test=require('node:test'),assert=require('node:assert/strict');
const {narrator,chooseVoice}=require('../audio.js');
test('narrator selects English enhanced speech and honors a saved choice',()=>{
 const voices=[{name:'Deutsch Premium',lang:'de-DE',voiceURI:'de'},{name:'Daniel Compact',lang:'en-GB',voiceURI:'compact'},{name:'Daniel Enhanced',lang:'en-GB',voiceURI:'enhanced'},{name:'Samantha',lang:'en-US',voiceURI:'us'}];
 assert.equal(chooseVoice(voices).voiceURI,'enhanced');assert.equal(chooseVoice(voices,'us').voiceURI,'us');assert.equal(chooseVoice([voices[0]]),null);
});
test('missing speech completion advances once and cancellation cannot advance an old question',()=>{
 let utterance,callback,done=0;const synth={cancel(){},resume(){},getVoices(){return[]},speak(u){utterance=u}};
 const n=narrator({synth,Utterance:function(t){this.text=t},schedule:fn=>(callback=fn,1),unschedule(){}});
 n.speak('fox',{onEnd:()=>done++});assert.equal(utterance.pitch,1);assert.equal(utterance.rate,.92);
 callback();utterance.onend();assert.equal(done,1);
 n.speak('tree',{onEnd:()=>done++});n.cancel();callback();utterance.onend();assert.equal(done,1);
});
test('unavailable speech never blocks the child',()=>{
 let done=0;narrator({}).speak('sat',{onEnd:()=>done++});assert.equal(done,1);
});

test('approved gate recordings are mapped and the pronunciation helper is only for unmapped fallback text',()=>{
 let utterance,downloads=0,done=0;
 const clips=require('../narration').clips;
 for(const text of ['gate','The gate is by the castle.','The word was gate.','Practice turn. You keep your heart. The gate is by the castle.','Practice turn. You keep your heart. The word was gate.'])assert.ok(clips[text],text);
 const n=narrator({clips,fetchAudio(){downloads++;},synth:{cancel(){},resume(){},getVoices(){return[];},speak(u){utterance=u;}},Utterance:function(text){this.text=text;},schedule:()=>1,unschedule(){}});
 n.speak('gate',{onEnd:()=>done++});assert.equal(utterance.text,'gait');utterance.onend();
 n.speak('Open the gate now.',{onEnd:()=>done++});assert.equal(utterance.text,'Open the gait now.');utterance.onend();
 assert.equal(downloads,0);assert.equal(done,2);
});

test('an approved exact recording wins over fallback and personalized dragon text stays local',async()=>{
 let fetched='',started=0,synthCalls=0,done=0;
 class Context{
  constructor(){this.state='running';this.destination={};}
  resume(){return Promise.resolve();}
  createGain(){return {gain:{value:1},connect(){}};}
  decodeAudioData(){return Promise.resolve({duration:.5});}
  createBufferSource(){return {buffer:null,onended:null,connect(){},disconnect(){},stop(){},start(){started++;queueMicrotask(()=>this.onended&&this.onended());}};}
 }
 const n=narrator({clips:{gate:{file:'gate.mp3'}},AudioContext:Context,fetchAudio:async file=>{fetched=file;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(8)};},synth:{cancel(){},resume(){},getVoices(){return[];},speak(){synthCalls++;}},Utterance:function(text){this.text=text;},schedule:()=>1,unschedule(){}});
 n.unlock();n.speak('gate',{onEnd:()=>done++});await new Promise(resolve=>setImmediate(resolve));
 assert.equal(fetched,'gate.mp3');assert.equal(started,1);assert.equal(synthCalls,0);assert.equal(done,1);
 let utterance,downloads=0;
 const custom=narrator({clips:require('../narration').clips,fetchAudio(){downloads++;},synth:{cancel(){},resume(){},getVoices(){return[];},speak(u){utterance=u;}},Utterance:function(text){this.text=text;},schedule:()=>1,unschedule(){}});
 custom.speak('Ember is on the rock.');assert.equal(utterance.text,'Ember is on the rock.');assert.equal(downloads,0);
});

test('speech volume applies to fallback and a muted narrator still completes exactly once',()=>{
 let utterance,done=0;
 const n=narrator({synth:{cancel(){},resume(){},getVoices(){return[]},speak(u){utterance=u}},Utterance:function(t){this.text=t},schedule:()=>1,unschedule(){}});
 n.configure({volume:.35});n.speak('fox',{onEnd:()=>done++});assert.equal(utterance.volume,.35);utterance.onend();assert.equal(done,1);
 n.configure({volume:0});utterance=null;n.speak('tree',{onEnd:()=>done++});assert.equal(utterance,null);assert.equal(done,2);
});

function recordedHarness(clips,{fetcher}={}){
 let wall=0,id=0,context,spoken=[],fetches=[],sources=[],boundaries=[],done=0;
 const jobs=new Map();
 const schedule=(fn,delay)=>{const key=++id;jobs.set(key,{at:wall+delay,fn});return key;};
 class Context{
  constructor(){context=this;this.currentTime=0;this.state='running';this.destination={};}
  resume(){return Promise.resolve();}
  createGain(){return {gain:{value:1},connect(){}};}
  decodeAudioData(){return Promise.resolve({duration:30});}
  createBufferSource(){const source={connect(){},disconnect(){},stop(){this.stopped=true;},start(...args){this.args=args;}};sources.push(source);return source;}
 }
 const n=narrator({clips,AudioContext:Context,fetchAudio:async file=>{fetches.push(file);return fetcher?fetcher(file):{ok:true,arrayBuffer:async()=>new ArrayBuffer(8)};},synth:{cancel(){},resume(){},getVoices(){return[]},speak:u=>spoken.push(u)},Utterance:function(text){this.text=text;},schedule,unschedule:key=>jobs.delete(key)});
 function advance(ms){const until=wall+ms;while(true){const next=[...jobs].filter(([,j])=>j.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;const [key,job]=next;if(context?.state==='running')context.currentTime+=(job.at-wall)/1000;wall=job.at;jobs.delete(key);job.fn();}if(context?.state==='running')context.currentTime+=(until-wall)/1000;wall=until;}
 return {n,sources,spoken,fetches,boundaries,jobs,advance,get context(){return context},get done(){return done},speak:text=>n.speak(text,{onBoundary:e=>boundaries.push(e),onEnd:()=>done++})};
}
const flushAudio=()=>new Promise(resolve=>setImmediate(resolve));

test('recorded word highlights follow the audio clock, clear in gaps, and stop on cancellation',async()=>{
 const h=recordedHarness({'Pip is on the rock.':{file:'teaching.mp3',offset:2,duration:2,words:[{charIndex:7,charLength:2,start:.5,end:.8},{charIndex:14,charLength:4,start:1.1,end:1.5}]}});
 h.speak('Pip is on the rock.');await flushAudio();assert.deepEqual(h.sources[0].args,[0,2,2]);
 h.advance(600);assert.equal(h.boundaries.at(-1).charIndex,7);
 h.context.state='suspended';h.advance(4500);assert.equal(h.boundaries.at(-1).charIndex,-1);assert.equal(h.done,0);
 h.context.state='running';h.advance(25);assert.equal(h.boundaries.at(-1).charIndex,7);h.advance(300);assert.equal(h.boundaries.at(-1).charIndex,-1);
 h.advance(300);assert.equal(h.boundaries.at(-1).charIndex,14);
 const end=h.sources[0].onended,count=h.boundaries.length;h.n.cancel();h.advance(8000);end();assert.equal(h.done,0);assert.equal(h.boundaries.length,count);assert.equal(h.jobs.size,0);
});

test('correction clauses play in order from shared MP3 segments and finish once',async()=>{
 const {recordedParts}=require('../audio'),clips={
  'Practice turn. You keep your heart.':{file:'prefix.mp3',offset:0,duration:2},
  'You chose rack.':{file:'batch.mp3',offset:2,duration:1},
  'The word is rock.':{file:'batch.mp3',offset:5,duration:1,words:[{charIndex:12,charLength:4,start:0,end:.5}]}
 };
 const text='Practice turn. You keep your heart. You chose rack. The word is rock.';
 assert.deepEqual(recordedParts(text,clips),Object.keys(clips));assert.equal(recordedParts('You chose unknown. The word is rock.',clips),null);
 const h=recordedHarness(clips);h.speak(text);await flushAudio();assert.deepEqual(h.fetches,['prefix.mp3','batch.mp3']);assert.equal(h.spoken.length,0);
 h.sources[0].onended();assert.deepEqual(h.sources[1].args,[0,2,1]);h.sources[1].onended();assert.deepEqual(h.sources[2].args,[0,5,1]);assert.equal(h.boundaries.at(-1).charIndex,text.indexOf('rock'));
 const end=h.sources[2].onended;end();end();h.advance(10000);assert.equal(h.done,1);assert.equal(h.jobs.size,0);
});

test('stalled recordings fall back once; late downloads, old callbacks and replay cannot advance twice',async()=>{
 let release;const h=recordedHarness({fox:{file:'fox.mp3',offset:0,duration:1}},{fetcher:()=>new Promise(resolve=>release=resolve)});
 h.speak('fox');await flushAudio();h.advance(4500);assert.equal(h.spoken.length,1);release({ok:true,arrayBuffer:async()=>new ArrayBuffer(8)});await flushAudio();assert.equal(h.sources.length,0);
 const oldEnd=h.spoken[0].onend;h.speak('fox');await flushAudio();assert.equal(h.sources.length,1);oldEnd();assert.equal(h.done,0);
 h.sources[0].onended();h.advance(10000);assert.equal(h.done,1);
});

test('a failed correction segment uses the full local phrase without partially playing a recording',async()=>{
 const text='You chose rack. The word is rock.',clips={'You chose rack.':{file:'chosen.mp3'},'The word is rock.':{file:'target.mp3'}};
 const h=recordedHarness(clips,{fetcher:async file=>({ok:file!=='target.mp3',arrayBuffer:async()=>new ArrayBuffer(8)})});h.speak(text);await flushAudio();assert.equal(h.sources.length,0);assert.equal(h.spoken[0].text,text);h.spoken[0].onend();assert.equal(h.done,1);
});

test('cancelled and muted recorded sequences never launch the next clause',async()=>{
 const clips={'You chose rack.':{file:'a.mp3',offset:0,duration:1},'The word is rock.':{file:'b.mp3',offset:0,duration:1}},h=recordedHarness(clips);
 h.speak('You chose rack. The word is rock.');await flushAudio();const next=h.sources[0].onended;h.n.cancel();next();h.advance(10000);assert.equal(h.sources.length,1);assert.equal(h.done,0);
 h.n.configure({volume:0});h.speak('You chose rack. The word is rock.');await flushAudio();assert.equal(h.sources.length,1);assert.equal(h.done,1);
});


test('decoded batch audio uses a bounded recent cache during long sessions',async()=>{
 const clips=Object.fromEntries(Array.from({length:18},(_,i)=>['clip '+i,{file:i+'.mp3',offset:0,duration:1}])),h=recordedHarness(clips);
 for(let i=0;i<18;i++){h.speak('clip '+i);await flushAudio();h.sources.at(-1).onended();}
 h.speak('clip 17');await flushAudio();assert.equal(h.fetches.length,18);h.sources.at(-1).onended();
 h.speak('clip 0');await flushAudio();assert.equal(h.fetches.length,19);assert.equal(h.fetches.at(-1),'0.mp3');h.n.cancel();
});
