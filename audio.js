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
  // Only compose complete recorded clauses; an unknown saved choice uses local speech.
  function recordedParts(text,clips) {
    if(clips[text])return [text];
    const match=/^(Practice turn\. You keep your heart\. )?You chose ([a-z]+)\. The word is ([a-z]+)\.$/.exec(text);
    if(!match)return null;
    const parts=[...(match[1]?['Practice turn. You keep your heart.']:[]),'You chose '+match[2]+'.','The word is '+match[3]+'.'];
    return parts.every(part=>clips[part])?parts:null;
  }
  // Completion and word timing stay independent of the question/animation timer.
  function narrator({synth,Utterance,AudioContext,fetchAudio,clips={},schedule=setTimeout,unschedule=clearTimeout}) {
    let generation=0,watchdog=null,boundaryTimer=null,context=null,source=null,output=null,volume=1;
    const buffers=new Map();
    function unlock(){
      if(!AudioContext||!fetchAudio)return;
      try{context=context||new AudioContext();if(!output&&context.createGain){output=context.createGain();output.gain.value=volume;output.connect(context.destination);}context.resume()?.catch(()=>{});}catch{}
    }
    function stopRecording(){unschedule(boundaryTimer);boundaryTimer=null;if(source){source.onended=null;try{source.stop();}catch{}source.disconnect();source=null;}}
    function cancel(){generation++;unschedule(watchdog);watchdog=null;stopRecording();if(synth)synth.cancel();}
    function speak(text,{preferred='',onEnd=()=>{},onBoundary=()=>{}}={}) {
      cancel();const token=generation;let finished=false;
      // The pronunciation helper preserves character positions for local speech.
      const fallbackText=text.replace(/\bgate\b/gi,word=>word[0]==='G'?'Gait':'gait');
      const current=()=>!finished&&token===generation;
      const finish=()=>{if(!current())return;finished=true;unschedule(watchdog);watchdog=null;stopRecording();onEnd();};
      if(volume===0){finish();return;}
      let fallbackStarted=false;
      function fallback(){
        if(!current()||fallbackStarted)return;fallbackStarted=true;unschedule(watchdog);stopRecording();
        if(!synth||!Utterance){finish();return;}
        const utterance=new Utterance(fallbackText),voice=chooseVoice(synth.getVoices(),preferred);
        if(voice)utterance.voice=voice;
        utterance.volume=volume;utterance.lang=voice?.lang||'en-GB';utterance.rate=.92;utterance.pitch=1;
        utterance.onend=finish;utterance.onerror=finish;
        utterance.onboundary=e=>{if(current())onBoundary(e);};
        watchdog=schedule(()=>{if(current())synth.cancel();finish();},Math.max(2200,text.split(/\s+/).length*800+1400));
        try{synth.resume();synth.speak(utterance);}catch{finish();}
      }
      const parts=recordedParts(text,clips);
      if(!parts||!AudioContext||!fetchAudio){fallback();return;}
      unlock();if(!context){fallback();return;}
      // Download every clause before starting, so failure speaks the whole correction once.
      watchdog=schedule(fallback,4500);
      function load(clip){
        if(!buffers.has(clip.file)){
          const loading=Promise.resolve().then(()=>fetchAudio(clip.file)).then(response=>{
            if(!response.ok)throw new Error('Narration unavailable');return response.arrayBuffer();
          }).then(bytes=>context.decodeAudioData(bytes)).catch(error=>{if(buffers.get(clip.file)===loading)buffers.delete(clip.file);throw error;});
          buffers.set(clip.file,loading);
          // Batch MP3s decode to larger buffers; bound memory during long iPad sessions.
          while(buffers.size>16)buffers.delete(buffers.keys().next().value);
        }
        const loading=buffers.get(clip.file);buffers.delete(clip.file);buffers.set(clip.file,loading);
        return loading;
      }
      Promise.all(parts.map(part=>load(clips[part]))).then(decoded=>{
        if(!current()||fallbackStarted)return;
        if(context.state!=='running'){fallback();return;}
        unschedule(watchdog);
        let partIndex=0,charOffset=0;
        function playPart(){
          if(!current())return;
          if(partIndex===parts.length){finish();return;}
          const part=parts[partIndex],clip=clips[part],buffer=decoded[partIndex];
          const offset=clip.offset||0,duration=clip.offset===undefined?buffer.duration:clip.duration;
          if(!Number.isFinite(offset)||offset<0||!Number.isFinite(duration)||duration<=0||offset+duration>buffer.duration+.05){finish();return;}
          const startedAt=context.currentTime;let lastIndex=-1,ended=false;
          const elapsed=()=>Math.max(0,context.currentTime-startedAt);
          function boundary(){
            if(!current()||ended)return;
            const time=elapsed(),word=context.state==='running'?(clip.words||[]).find(w=>time>=w.start&&time<w.end):null;
            const index=word?word.charIndex+charOffset:-1;
            if(index!==lastIndex){lastIndex=index;onBoundary({name:'word',charIndex:index,charLength:word?.charLength||0,elapsedTime:time});}
            if(current()&&!ended)boundaryTimer=schedule(boundary,25);
          }
          function next(){
            if(!current()||ended)return;ended=true;unschedule(watchdog);stopRecording();
            if(lastIndex!==-1)onBoundary({name:'word',charIndex:-1,charLength:0});
            charOffset+=part.length+1;partIndex++;playPart();
          }
          function completionWatch(){
            if(!current()||ended)return;
            // A suspended audio clock must not advance the lesson or the highlight.
            if(context.state!=='running'||elapsed()<duration){watchdog=schedule(completionWatch,500);return;}
            next();
          }
          source=context.createBufferSource();source.buffer=buffer;source.connect(output||context.destination);source.onended=next;
          watchdog=schedule(completionWatch,Math.ceil(duration*1000)+1500);
          source.start(0,offset,duration);
          if(clip.words?.length)boundary();
        }
        playPart();
      }).catch(fallback);
    }
    return {speak,cancel,unlock,configure(options={}){if(typeof options.volume==='number'&&Number.isFinite(options.volume))volume=Math.max(0,Math.min(1,options.volume));if(output)output.gain.value=volume;}};
  }
  return {chooseVoice,rankVoice,narrator,recordedParts};
});