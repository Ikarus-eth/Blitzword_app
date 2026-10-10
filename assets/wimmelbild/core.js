(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./data'):root.WimmelData);if(typeof module==='object'&&module.exports)module.exports=api;else root.WimmelCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(Data){
'use strict';
const KEY='blitzword.wimmelbild.v1',clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function fresh(){return {version:1,scene:0,solved:[],attempts:[],completed:false};}
function restore(value){
 if(!value||value.version!==1||!Number.isInteger(value.scene)||!Array.isArray(value.solved))throw new Error('Unrecognised saved journey.');
 const s=fresh();
 // Only a contiguous solved prefix can unlock later locations.
 for(const scene of Data.scenes){if(!value.solved.includes(scene.id))break;s.solved.push(scene.id);}
 s.scene=clamp(value.scene,0,Math.min(s.solved.length,Data.scenes.length-1));
 s.completed=s.solved.length===Data.scenes.length;
 s.attempts=Array.isArray(value.attempts)?value.attempts.slice(-100):[];return s;
}
function answer(state,id){
 const scene=Data.scenes[state.scene],option=scene.options.find(o=>o.id===id);
 if(!option)return {ok:false,message:'Choose a place in the picture or a written answer.'};
 const ok=id===scene.answer;
 state.attempts.push({scene:scene.id,choice:id,correct:ok,at:Date.now()});state.attempts=state.attempts.slice(-100);
 if(!ok)return {ok:false,message:option.feedback};
 if(!state.solved.includes(scene.id))state.solved.push(scene.id);
 state.completed=state.solved.length===Data.scenes.length;
 if(state.scene<Data.scenes.length-1)state.scene++;
 return {ok:true,message:scene.arrival,finished:scene.id===Data.scenes.at(-1).id};
}
function hit(scene,x,y){return scene.options.find(o=>{const [a,b,w,h]=o.box;return x>=a&&x<=a+w&&y>=b&&y<=b+h;})||null;}
function fit(w,h){const bw=Math.min(w,h*1.5),bh=bw/1.5;return {w,h,bw,bh,scale:1,x:(w-bw)/2,y:(h-bh)/2};}
function bound(v){const w=v.bw*v.scale,h=v.bh*v.scale;v.x=w<=v.w?(v.w-w)/2:clamp(v.x,v.w-w,0);v.y=h<=v.h?(v.h-h)/2:clamp(v.y,v.h-h,0);return v;}
function zoom(v,factor,px=v.w/2,py=v.h/2){const next=clamp(v.scale*factor,1,5),ratio=next/v.scale;v.x=px-(px-v.x)*ratio;v.y=py-(py-v.y)*ratio;v.scale=next;return bound(v);}
return {KEY,fresh,restore,answer,hit,fit,bound,zoom};
});
