(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.BlitzSound=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function create({AudioContext}={}){
    let context,ambient,effects,enabled=true,quiet=true,narrating=false,lastSecond=null;
    const activeEffects=new Set();
    function cancelEffects(){for(const osc of activeEffects){try{osc.stop();}catch{}}activeEffects.clear();}
    const audible=()=>enabled&&!quiet&&!narrating;
    function level(){if(context&&ambient){ambient.gain.setTargetAtTime(audible()?.055:0,context.currentTime,.14);effects.gain.setTargetAtTime(audible()?.10:0,context.currentTime,.04);}}
    function unlock(){
      if(!AudioContext||!enabled)return;
      try{
        if(!context){
          context=new AudioContext();ambient=context.createGain();ambient.gain.value=0;ambient.connect(context.destination);
          effects=context.createGain();effects.gain.value=.10;effects.connect(context.destination);
          // Locally synthesized forest wind and a soft, low open fifth. No network or microphone.
          const noise=context.createBuffer(1,context.sampleRate*4,context.sampleRate),samples=noise.getChannelData(0);
          let last=0;for(let i=0;i<samples.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;samples[i]=last*3.5;}
          const wind=context.createBufferSource();wind.buffer=noise;wind.loop=true;
          const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=380;wind.connect(filter);filter.connect(ambient);wind.start();
          for(const hz of [110,165]){const tone=context.createOscillator(),gain=context.createGain();tone.type='sine';tone.frequency.value=hz;gain.gain.value=.09;tone.connect(gain);gain.connect(ambient);tone.start();}
        }
        context.resume()?.catch(()=>{});level();
      }catch{context=null;}
    }
    function tone(hz,length=.15,volume=.22,delay=0){
      if(!context||!audible()||context.state!=='running')return;
      const start=context.currentTime+delay,osc=context.createOscillator(),gain=context.createGain();
      osc.type='sine';osc.frequency.setValueAtTime(hz,start);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+length);
      osc.connect(gain);gain.connect(effects);activeEffects.add(osc);osc.start(start);osc.stop(start+length+.02);osc.onended=()=>{activeEffects.delete(osc);osc.disconnect();gain.disconnect();};
    }
    return {
      unlock,cancelEffects,
      configure(options={}){if('enabled'in options)enabled=options.enabled;if('quiet'in options)quiet=options.quiet;if('narrating'in options)narrating=options.narrating;level();},
      cue(kind){if(kind==='correct'||kind==='pip'){tone(440,.2);tone(660,.24,.16,.09);}else if(kind==='wrong'){tone(165,.19,.22);tone(123,.24,.16,.08);}else if(kind==='finish'){tone(330,.3);tone(440,.3,.2,.13);tone(660,.4,.18,.26);}else if(kind==='chuckle'){tone(220,.09,.15);tone(260,.09,.12,.13);tone(200,.13,.10,.27);}},
      countdown(seconds){if(seconds===lastSecond)return;lastSecond=seconds;if(seconds>0&&seconds<=10)tone(seconds<=3?660:440,.065,.09);},
      resetCountdown(){lastSecond=null;}
    };
  }
  return {create};
});
