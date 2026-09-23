(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.BlitzSound=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TRACKS={home:80,battle:64,duel:48,transition:20,victory:16};
  const DEFAULTS={music:.65,ambience:.45,effects:.65,speech:1,quiet:false,countdown:false};
  const clamp=(value,fallback)=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(1,value)):fallback;
  function settings(value={}){return {...DEFAULTS,...Object.fromEntries(['music','ambience','effects','speech'].map(k=>[k,clamp(value[k],DEFAULTS[k])])),quiet:value.quiet===true,countdown:value.countdown===true};}
  function create({AudioContext,fetchAudio,schedule=setTimeout,unschedule=clearTimeout}={}){
    let context,music,ambience,effects,wind,unlocked=false,disposed=false,pending=false;
    let enabled=true,quiet=true,suspended=false,narrating=false,scene='home',activeScene=null,revision=0,lastSecond=null;
    let volumes=settings(),variation=0,sceneNodes=[],retiring=[];
    const activeEffects=new Set(),cache=new Map(),failed=new Set(),controllers=new Set(),timers=new Set();
    const allowed=()=>enabled&&!quiet&&!suspended&&!narrating&&!volumes.quiet;
    function ramp(param,value,seconds=.18){
      if(!context)return;
      param.cancelScheduledValues(context.currentTime);param.setTargetAtTime(value,context.currentTime,seconds);
    }
    function cancelEffects(){for(const source of activeEffects){try{source.stop();}catch{}}activeEffects.clear();}
    function levels(){
      if(!context)return;
      ramp(music.gain,allowed()?volumes.music:0,narrating||quiet||suspended?.025:.32);
      ramp(ambience.gain,allowed()?volumes.ambience*.026:0,.12);
      ramp(effects.gain,allowed()?volumes.effects:0,.012);
    }
    function stopNodes(nodes,fade=.35){
      if(!context)return;
      for(const item of nodes){
        ramp(item.gain.gain,0,.08);
        try{item.source.stop(context.currentTime+fade);}catch{}
        retiring.push(item);
      }
    }
    function ensureContext(){
      if(context)return true;
      if(!AudioContext||disposed)return false;
      try{
        context=new AudioContext({sampleRate:32000});
        music=context.createGain();ambience=context.createGain();effects=context.createGain();
        for(const bus of [music,ambience,effects]){bus.gain.value=0;bus.connect(context.destination);}
        // Smooth periodic woodland air, without answer-associated animal calls.
        const buffer=context.createBuffer(2,context.sampleRate*8,context.sampleRate);
        let seed=731;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296*2-1;};
        for(let channel=0;channel<2;channel++){
          const samples=buffer.getChannelData(channel);let previous=0;
          for(let i=0;i<samples.length;i++){previous=.96*previous+.04*random();samples[i]=previous*(.65+.15*Math.sin(2*Math.PI*i/samples.length));}
          softenEdge(samples,context.sampleRate);
        }
        wind=context.createBufferSource();wind.buffer=buffer;wind.loop=true;wind.connect(ambience);wind.start();
        return true;
      }catch{try{context?.close();}catch{}context=null;return false;}
    }
    function softenEdge(samples,rate){
      // A brief endpoint repair also protects decoders with different MP3 padding.
      const count=Math.min(Math.round(rate*.008),Math.floor(samples.length/4));
      const mid=(samples[0]+samples[samples.length-1])/2;
      for(let i=0;i<count;i++){
        const blend=i/count;
        samples[i]=mid*(1-blend)+samples[i]*blend;
        const j=samples.length-1-i;samples[j]=mid*(1-blend)+samples[j]*blend;
      }
    }
    async function load(key,layer){
      const name=key+'-'+layer;
      if(failed.has(name))throw new Error('Unavailable soundscape');
      if(cache.has(name)){const saved=cache.get(name);cache.delete(name);cache.set(name,saved);return saved;}
      const task=(async()=>{
        const controller=typeof AbortController!=='undefined'?new AbortController():null;
        if(controller)controllers.add(controller);
        let timeout;
        try{
          const request=(async()=>{
            const response=await fetchAudio('assets/soundscape/'+name+'.mp3',controller?{signal:controller.signal}:{});
            if(!response.ok)throw new Error('Missing soundscape');
            const buffer=await context.decodeAudioData(await response.arrayBuffer());
            for(let c=0;c<buffer.numberOfChannels;c++)softenEdge(buffer.getChannelData(c),buffer.sampleRate);
            return buffer;
          })();
          return await Promise.race([request,new Promise((_,reject)=>{
            timeout=schedule(()=>{controller?.abort();reject(new Error('Soundscape timeout'));},12000);timers.add(timeout);
          })]);
        }finally{unschedule(timeout);timers.delete(timeout);controllers.delete(controller);}
      })().catch(error=>{failed.add(name);cache.delete(name);throw error;});
      cache.set(name,task);
      // Retain two scenes so teaching and battle can alternate without re-downloading.
      for(const key of cache.keys())if(cache.size>4&&!key.startsWith(scene+'-'))cache.delete(key);
      return task;
    }
    async function syncScene(){
      if(!unlocked||!context||context.state!=='running'||disposed||!enabled||suspended||volumes.quiet)return;
      if(activeScene===scene||pending||!fetchAudio)return;
      const key=scene,token=revision;
      activeScene=key;
      stopNodes(sceneNodes);sceneNodes=[];
      if(!TRACKS[key])return; // Defeat rests in forest ambience after its short cue.
      pending=true;
      try{
        const buffers=await Promise.all(['bed','accents'].map(layer=>load(key,layer)));
        if(token!==revision||disposed||!enabled||suspended||volumes.quiet||context.state!=='running')return;
        const start=context.currentTime+.025;
        sceneNodes=buffers.map((buffer,i)=>{
          const source=context.createBufferSource(),gain=context.createGain();
          source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=Math.min(TRACKS[key],buffer.duration);
          gain.gain.value=0;source.connect(gain);gain.connect(music);
          const item={source,gain};source.onended=()=>{source.disconnect();gain.disconnect();retiring=retiring.filter(x=>x!==item);};
          source.start(start);ramp(gain.gain,i===1&&key==='victory'?.45:1,.45);
          // The result screen keeps a subdued bed after one melodic phrase.
          if(i===1&&key==='victory')gain.gain.setTargetAtTime(0,start+TRACKS[key],.8);
          return item;
        });
      }catch{/* Missing music must never block a question or narration. */}
      finally{pending=false;if(token!==revision&&!disposed)syncScene();}
    }
    function unlock(){
      if(!enabled||disposed||suspended||!ensureContext())return;
      unlocked=true;
      try{
        const resumed=context.resume();
        Promise.resolve(resumed).then(()=>{if(!disposed){levels();syncScene();}}).catch(()=>{});
      }catch{}
      levels();syncScene();
    }
    function configure(options={}){
      const before=allowed(),oldScene=scene,oldSuspended=suspended,oldEnabled=enabled,oldPreset=volumes.quiet;
      if('enabled'in options)enabled=!!options.enabled;
      if('quiet'in options)quiet=!!options.quiet;
      if('suspended'in options)suspended=!!options.suspended;
      if('narrating'in options)narrating=!!options.narrating;
      if('scene'in options)scene=options.scene;
      if(options.volumes)volumes=settings(options.volumes);
      if(before&&!allowed())cancelEffects();
      if(scene!==oldScene||suspended!==oldSuspended||enabled!==oldEnabled||oldPreset!==volumes.quiet){
        revision++;activeScene=null;
        if(suspended||!enabled||volumes.quiet){stopNodes(sceneNodes,.08);sceneNodes=[];}
      }
      levels();syncScene();
    }
    function play(kind,delay=0){
      if(!context||context.state!=='running'||!allowed()||disposed)return;
      const variants=variation++%3,rate=context.sampleRate;
      const duration=kind==='victory'?2.6:kind==='defeat'?1.65:kind==='pip'?.62:kind==='shield'?.6:.38;
      const buffer=context.createBuffer(1,Math.ceil(rate*duration),rate),x=buffer.getChannelData(0);
      let seed=4501+variants*1123;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296*2-1;};
      function note(hz,at,length,volume){
        const first=Math.floor(at*rate),last=Math.min(x.length,first+Math.ceil(length*rate));
        for(let i=first;i<last;i++){
          const t=(i-first)/rate,envelope=(1-Math.exp(-t/.006))*Math.exp(-t/(length*.22))*Math.min(1,(length-t)/.025);
          x[i]+=volume*envelope*(Math.sin(2*Math.PI*hz*t)+.22*Math.sin(2*Math.PI*hz*2.003*t)+.06*Math.sin(2*Math.PI*hz*3*t));
        }
      }
      const tint=1+(variants-1)*.016;
      if(kind==='victory'){[[349,0],[440,.16],[523,.33],[698,.56]].forEach(([hz,at])=>note(hz,at,1.7,.08));}
      else if(kind==='defeat'){note(293,0,1.3,.07);note(261,.32,1.2,.065);note(196,.4,1.2,.045);}
      else if(kind==='correct'){note(440*tint,0,.25,.075);note(660*tint,.07,.25,.045);}
      else if(kind==='shield'){[392,587,784].forEach((hz,i)=>note(hz,i*.045,.45,.055));}
      else if(kind==='pip'){note(330*tint,0,.4,.055);note(494*tint,.13,.4,.05);}
      else if(kind==='tick'){note(392,0,.08,.024);}
      else if(kind==='select'||kind==='scroll'){note(350*tint,0,.11,.025);}
      else if(kind==='wrong'||kind==='hit'){note(130*tint,0,.3,.06);}
      else if(kind==='knight'){note(195*tint,.05,.25,.07);note(293*tint,.06,.24,.025);}
      else if(kind==='chuckle'){note(220,0,.12,.027);note(246,.13,.12,.024);}
      const noisy=['mage','archer','knight','scroll','pip','hit'].includes(kind);
      if(noisy){let low=0;for(let i=0;i<x.length;i++){const t=i/rate;low=.84*low+.16*random();x[i]+=low*.11*Math.sin(Math.PI*i/x.length)**2*Math.exp(-t*8);}}
      if(kind==='mage'){note(587*tint,.03,.32,.045);note(880*tint,.1,.24,.03);}
      const source=context.createBufferSource();source.buffer=buffer;source.connect(effects);activeEffects.add(source);
      source.onended=()=>{activeEffects.delete(source);source.disconnect();};source.start(context.currentTime+delay);
    }
    return {
      unlock,configure,cancelEffects,
      cue(kind,delay=0){play(kind==='finish'?'victory':kind,delay);},
      countdown(seconds){if(seconds===lastSecond)return;lastSecond=seconds;if(volumes.countdown&&seconds>0&&seconds<=3)play('tick');},
      resetCountdown(){lastSecond=null;},
      dispose(){disposed=true;revision++;cancelEffects();for(const c of controllers)c.abort();for(const t of timers)unschedule(t);stopNodes([...sceneNodes,...retiring],0);try{wind?.stop();context?.close();}catch{}cache.clear();}
    };
  }
  return {create,settings,DEFAULTS,TRACKS};
});
