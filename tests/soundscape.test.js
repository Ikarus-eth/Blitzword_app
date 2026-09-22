const test=require('node:test'),assert=require('node:assert/strict'),S=require('../soundscape');
test('soundscape is optional and safely unavailable without browser audio',()=>{const sound=S.create();sound.unlock();sound.configure({quiet:false});sound.cue('correct');sound.countdown(5);sound.configure({enabled:false});});
test('reading silence, narration ducking and mute also silence scheduled effects',()=>{
 const gains=[];let tones=0;
 const param=()=>({value:0,setValueAtTime(v){this.value=v},setTargetAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){this.value=v}});
 const node=()=>({connect(){},disconnect(){},start(){},stop(){}});
 class Context{constructor(){this.currentTime=0;this.sampleRate=10;this.state='running';this.destination={}}resume(){return Promise.resolve()}createGain(){const n={...node(),gain:param()};gains.push(n);return n}createBuffer(){return {getChannelData:()=>new Float32Array(40)}}createBufferSource(){return node()}createBiquadFilter(){return {...node(),frequency:param()}}createOscillator(){tones++;return {...node(),frequency:param()}}}
 const sound=S.create({AudioContext:Context});sound.unlock();assert.equal(gains[0].gain.value,0);assert.equal(gains[1].gain.value,0);
 sound.configure({quiet:false});assert.ok(gains[0].gain.value>0);sound.cue('correct');const activeTones=tones;assert.ok(activeTones>2);
 sound.configure({narrating:true});assert.equal(gains[0].gain.value,0);assert.equal(gains[1].gain.value,0);sound.cue('wrong');assert.equal(tones,activeTones);
 sound.configure({narrating:false,quiet:true});sound.countdown(4);assert.equal(tones,activeTones);
 sound.configure({quiet:false,enabled:false});sound.cue('finish');assert.equal(gains[1].gain.value,0);assert.equal(tones,activeTones);
});
