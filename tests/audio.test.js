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
 n.speak('gate',{onEnd:()=>done++});assert.equal(utterance.text,'gate');utterance.onend();
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
