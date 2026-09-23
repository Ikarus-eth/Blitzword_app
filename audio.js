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
  function narrator({synth,Utterance,AudioContext,fetchAudio,clips={},schedule=setTimeout,unschedule=clearTimeout}) {
    let generation=0,watchdog=null,context=null,source=null,output=null,volume=1;
    const buffers=new Map();
    // Unlock within a real tap/key event. Reuse the context after async downloads.
    function unlock(){
      if(!AudioContext||!fetchAudio)return;
      try{context=context||new AudioContext();if(!output&&context.createGain){output=context.createGain();output.gain.value=volume;output.connect(context.destination);}context.resume()?.catch(()=>{});}catch{}
    }
    function stopRecording(){if(source){source.onended=null;try{source.stop();}catch{}source.disconnect();source=null;}}
    function cancel(){generation++;unschedule(watchdog);watchdog=null;stopRecording();if(synth)synth.cancel();}
    function speak(text,{preferred='',onEnd=()=>{},onBoundary=()=>{}}={}) {
      cancel();const token=generation;let finished=false;
      // The reported gate recording is ambiguous. Speak its exact homophone in
      // English until that clip is re-recorded; equal length preserves boundaries.
      const spokenText=text.replace(/\bgate\b/gi,word=>word[0]==='G'?'Gait':'gait');
      const current=()=>!finished&&token===generation;
      const finish=()=>{if(!current())return;finished=true;unschedule(watchdog);watchdog=null;stopRecording();onEnd();};
      if(volume===0){finish();return;}
      let fallbackStarted=false;
      function fallback(){
        if(!current()||fallbackStarted)return;fallbackStarted=true;unschedule(watchdog);stopRecording();
        if(!synth||!Utterance){finish();return;}
        const utterance=new Utterance(spokenText),voice=chooseVoice(synth.getVoices(),preferred);
        if(voice)utterance.voice=voice;
        utterance.volume=volume;utterance.lang=voice?.lang||'en-GB';utterance.rate=.92;utterance.pitch=1;
        utterance.onend=finish;utterance.onerror=finish;
        utterance.onboundary=e=>{if(current())onBoundary(e);};
        watchdog=schedule(()=>{if(current())synth.cancel();finish();},Math.max(2200,text.split(/\s+/).length*800+1400));
        try{synth.resume();synth.speak(utterance);}catch{finish();}
      }
      const clip=spokenText===text?clips[text]:null;
      if(!clip||!AudioContext||!fetchAudio){fallback();return;}
      unlock();if(!context){fallback();return;}
      // A stalled download must not block the lesson. A late response cannot interrupt fallback speech.
      watchdog=schedule(fallback,4500);
      if(!buffers.has(clip.file)){
        const loading=Promise.resolve().then(()=>fetchAudio(clip.file)).then(response=>{
          if(!response.ok)throw new Error('Narration unavailable');return response.arrayBuffer();
        }).then(bytes=>context.decodeAudioData(bytes)).catch(error=>{buffers.delete(clip.file);throw error;});
        buffers.set(clip.file,loading);
      }
      buffers.get(clip.file).then(buffer=>{
        if(!current()||fallbackStarted)return;
        if(context.state!=='running'){fallback();return;}
        unschedule(watchdog);
        source=context.createBufferSource();source.buffer=buffer;source.connect(output||context.destination);source.onended=finish;
        watchdog=schedule(finish,Math.ceil(buffer.duration*1000)+1500);
        source.start();
      }).catch(fallback);
    }
    return {speak,cancel,unlock,configure(options={}){if(typeof options.volume==='number'&&Number.isFinite(options.volume))volume=Math.max(0,Math.min(1,options.volume));if(output)output.gain.value=volume;}};
  }
  return {chooseVoice,rankVoice,narrator};
});
