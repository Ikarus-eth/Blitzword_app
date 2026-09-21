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
