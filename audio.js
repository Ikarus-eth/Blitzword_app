(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports=factory();
  else root.BlitzAudio=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function rankVoice(voice) {
    if(!/^en(?:-|_)/i.test(voice.lang))return -1000;
    let rank=/Enhanced|Premium|Natural|Neural/i.test(voice.name)?100:0;
    if(/Daniel|Oliver|Arthur|Alex|Aaron|Tom/i.test(voice.name))rank+=40;
    if(/Samantha|Karen|Moira|Serena/i.test(voice.name))rank+=25;
    if(/^en-GB/i.test(voice.lang))rank+=8;
    if(voice.localService)rank+=3;
    if(/compact|espeak/i.test(voice.name))rank-=20;
    return rank;
  }
  function chooseVoice(voices,preferred) {
    const english=voices.filter(v=>rankVoice(v)>-1000);
    return english.find(v=>v.voiceURI===preferred)||english.sort((a,b)=>rankVoice(b)-rankVoice(a))[0]||null;
  }
  // Completion fallback must be independent of the question/animation timer.
  function narrator({synth,Utterance,schedule=setTimeout,unschedule=clearTimeout}) {
    let generation=0,watchdog=null;
    function cancel(){generation++;unschedule(watchdog);watchdog=null;if(synth)synth.cancel();}
    function speak(text,{preferred='',onEnd=()=>{},onBoundary=()=>{}}={}) {
      cancel();const token=generation;let finished=false;
      const finish=()=>{if(finished||token!==generation)return;finished=true;unschedule(watchdog);watchdog=null;onEnd();};
      if(!synth||!Utterance){finish();return;}
      const utterance=new Utterance(text),voice=chooseVoice(synth.getVoices(),preferred);
      if(voice)utterance.voice=voice;
      utterance.lang=voice?.lang||'en-GB';utterance.rate=.92;utterance.pitch=1;
      utterance.onend=finish;utterance.onerror=finish;
      utterance.onboundary=e=>{if(token===generation&&!finished)onBoundary(e);};
      watchdog=schedule(finish,Math.max(2200,text.split(/\s+/).length*800+1400));
      try{synth.resume();synth.speak(utterance);}catch{finish();}
    }
    return {speak,cancel};
  }
  return {chooseVoice,rankVoice,narrator};
});
