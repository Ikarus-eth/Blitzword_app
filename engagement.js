(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BlitzEngagement=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const IDLE_MS=30000,MAX_TICK_MS=5000;
 // Time remains provisional until a meaningful game control confirms participation.
 // Abandoned intervals are discarded in full, rather than awarding an idle grace period.
 class Clock{
  constructor(){this.previous=null;this.lastInput=null;this.pending=[];this.excluded=0;this.expired=false;}
  reset(mono){this.discard();this.previous=mono;this.lastInput=mono;this.expired=false;}
  discard(){this.excluded+=this.pending.reduce((sum,x)=>sum+x.ms,0);this.pending=[];}
  sample({mono,wall,category,visible=true,focused=true}){
   const delta=this.previous===null?0:Math.max(0,mono-this.previous);this.previous=mono;
   if(!visible||!focused){this.discard();this.expired=true;return 0;}
   if(delta>MAX_TICK_MS){this.discard();if(category)this.excluded+=delta;this.expired=true;return 0;}
   if(this.lastInput===null)this.lastInput=mono;
   if(mono-this.lastInput>=IDLE_MS){this.discard();if(category)this.excluded+=delta;this.expired=true;return 0;}
   if(category&&!this.expired&&delta>0){
    const last=this.pending.at(-1);
    if(last&&last.category===category&&Math.abs(last.end-(wall-delta))<5){last.ms+=delta;last.end=wall;}
    else this.pending.push({category,ms:delta,end:wall});
    return delta;
   }
   return 0;
  }
  confirm(mono){const result=this.expired?[]:this.pending;this.pending=[];this.lastInput=mono;this.previous=mono;this.expired=false;return result;}
  takeExcluded(){const ms=this.excluded;this.excluded=0;return ms;}
 }
 return {Clock,IDLE_MS,MAX_TICK_MS};
});
