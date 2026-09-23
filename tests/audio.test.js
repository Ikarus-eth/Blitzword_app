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

test('gate uses the English homophone without downloading the reported clip or changing boundaries',()=>{
 let utterance,downloads=0,done=0,boundary;
 const clips=require('../narration').clips;
 const n=narrator({clips,AudioContext:function(){throw Error('Unexpected audio context');},fetchAudio(){downloads++;},synth:{cancel(){},resume(){},getVoices(){return[];},speak(u){utterance=u;}},Utterance:function(text){this.text=text;},schedule:()=>1,unschedule(){}});
 for(const text of ['gate','The gate is by the castle.','The word was gate.','Practice turn. You keep your heart. The gate is by the castle.']){
  n.speak(text,{onEnd:()=>done++,onBoundary:e=>boundary=e.charIndex});assert.equal(utterance.text,text.replace(/gate/g,'gait'));assert.equal(utterance.text.length,text.length);assert.equal(utterance.lang,'en-GB');utterance.onboundary({charIndex:text.indexOf('gate')});assert.equal(boundary,text.indexOf('gate'));utterance.onend();
 }
 assert.equal(downloads,0);assert.equal(done,4);
 n.speak('gate',{onEnd:()=>done++});n.cancel();utterance.onend();assert.equal(done,4);
});


test('speech volume applies to fallback and a muted narrator still completes exactly once',()=>{
 let utterance,done=0;
 const n=narrator({synth:{cancel(){},resume(){},getVoices(){return[]},speak(u){utterance=u}},Utterance:function(t){this.text=t},schedule:()=>1,unschedule(){}});
 n.configure({volume:.35});n.speak('fox',{onEnd:()=>done++});assert.equal(utterance.volume,.35);utterance.onend();assert.equal(done,1);
 n.configure({volume:0});utterance=null;n.speak('tree',{onEnd:()=>done++});assert.equal(utterance,null);assert.equal(done,2);
});
