const test=require('node:test'),assert=require('node:assert/strict');
const {narrator}=require('../audio');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function harness(options={}){
 const timers=new Map(),sources=[],utterances=[];let id=0,downloads=0;
 class Context{
  constructor(){this.state='suspended';this.destination={};}
  resume(){if(!options.locked)this.state='running';return Promise.resolve();}
  decodeAudioData(){return Promise.resolve({duration:9});}
  createBufferSource(){const source={connect(){},disconnect(){},start(){this.started=true;},stop(){this.stopped=true;}};sources.push(source);return source;}
 }
 const synth={cancel(){},resume(){},getVoices(){return[];},speak(u){utterances.push(u);}};
 const n=narrator({synth,Utterance:function(text){this.text=text;},AudioContext:Context,
  fetchAudio:url=>{downloads++;return options.fetch?options.fetch(url):Promise.resolve({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(8))});},
  clips:{'Pip is on the rock.':{file:'assets/narration/example.mp3'}},
  schedule:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},unschedule:key=>timers.delete(key)});
 return{n,timers,sources,utterances,downloads:()=>downloads};
}
test('recorded speech waits for the real ending, completes once and reuses decoded audio',async()=>{
 const h=harness();let ended=0;h.n.unlock();h.n.speak('Pip is on the rock.',{onEnd:()=>ended++});
 await flush();assert.equal(h.sources[0].started,true);assert.equal(ended,0);assert.equal(h.utterances.length,0);
 assert.equal([...h.timers.values()][0].ms,10500);
 const finish=h.sources[0].onended;finish();finish();assert.equal(ended,1);
 h.n.speak('Pip is on the rock.');await flush();assert.equal(h.downloads(),1);assert.equal(h.sources.length,2);
});
test('pause cancellation stops current audio and prevents an old ending from advancing play',async()=>{
 const h=harness();let ended=0;h.n.speak('Pip is on the rock.',{onEnd:()=>ended++});await flush();
 const finish=h.sources[0].onended;h.n.cancel();finish();assert.equal(ended,0);assert.equal(h.sources[0].stopped,true);assert.equal(h.timers.size,0);
});
test('cancelling a download prevents delayed narration after Home or another screen',async()=>{
 let resolve;const h=harness({fetch:()=>new Promise(r=>resolve=r)});let ended=0;
 h.n.speak('Pip is on the rock.',{onEnd:()=>ended++});await flush();h.n.cancel();
 resolve({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(8))});await flush();
 assert.equal(h.sources.length,0);assert.equal(h.utterances.length,0);assert.equal(ended,0);
});
test('missing recordings use browser speech and preserve its completion and boundary callbacks',async()=>{
 const h=harness({fetch:()=>Promise.resolve({ok:false})});let ended=0,boundary=0;
 h.n.speak('Pip is on the rock.',{onEnd:()=>ended++,onBoundary:()=>boundary++});await flush();
 assert.equal(h.sources.length,0);assert.equal(h.utterances.length,1);assert.equal(ended,0);
 h.utterances[0].onboundary({charIndex:7});h.utterances[0].onend();assert.equal(boundary,1);assert.equal(ended,1);
});
test('a late recording never overlaps the fallback triggered by a stalled download',async()=>{
 let resolve;const h=harness({fetch:()=>new Promise(r=>resolve=r)});h.n.speak('Pip is on the rock.');await flush();
 [...h.timers.values()][0].fn();assert.equal(h.utterances.length,1);
 resolve({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(8))});await flush();assert.equal(h.sources.length,0);
});
test('a browser that refuses audio unlock still uses the speech fallback',async()=>{
 const h=harness({locked:true});h.n.speak('Pip is on the rock.');await flush();
 assert.equal(h.sources.length,0);assert.equal(h.utterances.length,1);
});
