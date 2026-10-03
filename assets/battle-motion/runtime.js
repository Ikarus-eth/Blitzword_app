/* Whole-frame character animation. No face meshes, running idle loops or runtime APIs. */
(function(root,factory){const api=factory(root);if(typeof module==='object')module.exports=api;else root.BlitzMotion=api;})(typeof window==='object'?window:globalThis,function(root){
'use strict';
const DURATION=1200,IMPACT=660,active=new Set(),cache=new Map();
let filterSerial=0;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const data=()=>root.BlitzMotionAssets||{};
function asset(key){return data()[key];}
function enemyKey(enemy){const family=enemy.family||enemy.id,key=({'moss-golem':'golem','bark-beetle':'beetle'}[family]||family);return asset(key)?.clips?.attack?key:null;}
function stageScale(stage){return stage==='baby'?.72:stage==='young'?.86:1;}
function stageRect(rect,stage){const scale=stageScale(stage);return {x:rect.x+rect.w*(1-scale)/2,y:rect.y+rect.h*(1-scale),w:rect.w*scale,h:rect.h*scale};}
function attackMode(key){return asset(key)?.attackMode||(key==='golem'?'shock':'melee');}
// Blue-screen residue is absent from the mage's approved warm/green palette.
// Apply the same soft alpha key to stills and decoded animation sheets.
function blueMatte(r,g,b){return clamp(1+(r+g-2*b+16)/64);}
function cleanBluePixels(pixels){for(let i=0;i<pixels.length;i+=4)pixels[i+3]=Math.round(pixels[i+3]*blueMatte(pixels[i],pixels[i+1],pixels[i+2]));return pixels;}
function prepareImage(image,url){
  if(!/\/mage-[^/]+\.webp$/.test(url)||!root.document)return image;
  const canvas=root.document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return image;
  ctx.drawImage(image,0,0);const frame=ctx.getImageData(0,0,canvas.width,canvas.height);
  cleanBluePixels(frame.data);ctx.putImageData(frame,0,0);return canvas;
}
function render(key,{stage='adult'}={}){
  const a=asset(key);if(!a)return null;
  const scale=stageScale(stage),cx=a.view[0]+a.view[2]/2,bottom=a.view[1]+a.view[3],id='motion-matte-'+(++filterSerial);
  // sRGB matches the canvas key. Multiply the key by the existing alpha;
  // never replace transparency or let hidden blue RGB become visible.
  const filter=key==='mage'?`<defs><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 3.984375 3.984375 -7.96875 0 1.25"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>`:'';
  return `<svg class="motionStill" viewBox="${a.view.join(' ')}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${filter}<g transform="translate(${cx} ${bottom}) scale(${scale}) translate(${-cx} ${-bottom})"><image href="${a.still}" width="512" height="512"${key==='mage'?` filter="url(#${id})"`:''}/></g></svg>`;
}
function load(url){
  if(cache.has(url))return cache.get(url).promise;
  if(!root.Image)return Promise.resolve(null);
  const item={image:null,promise:null},image=new root.Image();
  item.promise=new Promise(resolve=>{image.onload=()=>{try{item.image=prepareImage(image,url);resolve(item.image);}catch{cache.delete(url);resolve(null);}};image.onerror=()=>{cache.delete(url);resolve(null);};});
  cache.set(url,item);image.src=url;return item.promise;
}
function warm(key){
  const a=asset(key);if(!a)return Promise.resolve([]);
  if(key!=='mage'&&key!=='pip'){
    const keep=new Set(['mage','pip',key].flatMap(k=>[asset(k)?.still,...Object.values(asset(k)?.clips||{}).flatMap(c=>c.sheets)]));
    for(const url of cache.keys())if(!keep.has(url))cache.delete(url);
  }
  return Promise.all([load(a.still),...Object.values(a.clips).flatMap(c=>c.sheets.map(load))]);
}
function ready(key,clip){return !!asset(key)?.clips[clip]?.sheets.every(url=>cache.get(url)?.image);}
function fit(view,rect){const scale=Math.min(rect.w/view[2],rect.h/view[3]);return {x:rect.x+(rect.w-view[2]*scale)/2-view[0]*scale,y:rect.y+rect.h-view[3]*scale-view[1]*scale,scale};}
function point(key,rect,xy){const a=asset(key);if(!a)return {x:rect.x+rect.w*.65,y:rect.y+rect.h*.45};const f=fit(a.view,rect);return{x:f.x+xy[0]*f.scale,y:f.y+xy[1]*f.scale};}
function castClip(assist=false){return assist?'assistCast':'cast';}
function spellPoint(rect,assist=false){const a=asset('mage');return point('mage',rect,a.clips[castClip(assist)].spell||a.spell);}
function frameIndex(clip,progress){return Math.min(clip.frames-1,Math.floor(clamp(progress)*clip.frames));}
function drawActor(ctx,images,key,clipName,progress,rect,dx=0,opacity=1,dy=0){
  const a=asset(key),c=a?.clips[clipName];if(!c)return;
  const frame=c.sequence?.[frameIndex(c,progress)]??frameIndex(c,progress),sheet=images[c.sheets[Math.floor(frame/c.perSheet)]],i=frame%c.perSheet;if(!sheet)return;
  const f=fit(a.view,rect),crop=c.crop;
  ctx.save();ctx.globalAlpha=opacity;ctx.drawImage(sheet,(i%c.cols)*c.tileW,Math.floor(i/c.cols)*c.tileH,c.tileW,c.tileH,f.x+crop[0]*f.scale+dx,f.y+crop[1]*f.scale+dy,crop[2]*f.scale,crop[3]*f.scale);ctx.restore();
}
// Pure timeline also drives exported review videos and deterministic tests.
function timeline(ms,{correct=true,enemy='thornling',defeated=false,heroDefeated=false,assist=false,shield=false,travel=0}={}){
  const t=clamp(ms,0,DURATION),after=clamp((t-IMPACT)/(DURATION-IMPACT)),before=clamp(t/IMPACT);
  const out={hero:{clip:'cast',p:0,x:0},enemy:{clip:'hit',p:0,x:0},pip:{clip:'fire',p:0,x:0},spell:0,flame:0,impact:0,shock:0,enemyShot:0,shotStyle:attackMode(enemy)};
  if(correct){
    out.hero.clip=castClip(assist);out.hero.p=clamp(t/DURATION);
    out.enemy={clip:defeated?'defeat':'hit',p:after,x:0};
    // Both casts hold the aimed staff before 400 ms; the spell leaves its crystal.
    out.spell=t>=400&&t<=IMPACT?(t-400)/(IMPACT-400):0;
    if(assist){out.pip.p=clamp(t/1050);out.flame=t>=460&&t<=730?clamp((t-460)/200):0;}
  }else{
    out.hero={clip:shield?'cast':heroDefeated?'defeat':'hit',p:shield?0:after,x:0};
    out.enemy={clip:'attack',p:clamp(t/1120),x:0};
    if(attackMode(enemy)==='shock')out.shock=t>=420&&t<=IMPACT?(t-420)/(IMPACT-420):0;
    else if(attackMode(enemy)!=='melee')out.enemyShot=t>=420&&t<=IMPACT?(t-420)/(IMPACT-420):0;
    else out.enemy.x=-travel*(t<IMPACT?smooth((t-140)/(IMPACT-140)):1-smooth(after));
  }
  if(t>=IMPACT&&t<IMPACT+210)out.impact=1-(t-IMPACT)/210;
  return out;
}
function drawEffects(ctx,s,{start,end,ground,assistStart,enemyStart,heroTarget,correct=true,shield=false}){
  ctx.save();ctx.lineCap='round';
  function bolt(a,b,p,color){if(p<=0)return;const x=a.x+(b.x-a.x)*p,y=a.y+(b.y-a.y)*p,tail=Math.max(0,p-.23);ctx.shadowColor=color;ctx.shadowBlur=15;ctx.strokeStyle=color;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(a.x+(b.x-a.x)*tail,a.y+(b.y-a.y)*tail);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#fff8d7';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();}
  if(correct){
    bolt(start,end,s.spell,'#ffca59');
    if(s.flame>0&&assistStart){
      const dx=end.x-assistStart.x,dy=end.y-assistStart.y,length=Math.hypot(dx,dy)*s.flame,width=9+13*s.flame;
      ctx.save();ctx.translate(assistStart.x,assistStart.y);ctx.rotate(Math.atan2(dy,dx));ctx.shadowColor='#ff8326';ctx.shadowBlur=12;
      const fire=ctx.createLinearGradient(0,0,length,0);fire.addColorStop(0,'#fff3aa');fire.addColorStop(.35,'#ffd44a');fire.addColorStop(1,'#fa6020');ctx.fillStyle=fire;
      ctx.beginPath();ctx.moveTo(0,-3);ctx.bezierCurveTo(length*.25,-width,length*.55,-width*.6,length*.78,-width);ctx.quadraticCurveTo(length*.91,-width*.7,length,0);ctx.quadraticCurveTo(length*.8,width,length*.66,width*.6);ctx.quadraticCurveTo(length*.2,width,0,3);ctx.fill();
      ctx.fillStyle='#fff8c9';ctx.beginPath();ctx.moveTo(0,-2);ctx.quadraticCurveTo(length*.45,-width*.4,length*.87,0);ctx.quadraticCurveTo(length*.35,width*.35,0,2);ctx.fill();ctx.restore();
    }
  }
  else if(s.shock>0){const x=end.x+(heroTarget.x-end.x)*s.shock,y=ground;ctx.strokeStyle='#ffc366';ctx.shadowColor='#ffb636';ctx.shadowBlur=10;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y,22,13,0,Math.PI,Math.PI*2);ctx.stroke();}
  if(!correct&&s.enemyShot>0&&enemyStart){
    bolt(enemyStart,heroTarget,s.enemyShot,s.shotStyle==='ember'?'#ffb449':'#bfeee6');
    if(s.shotStyle==='gust'){const x=enemyStart.x+(heroTarget.x-enemyStart.x)*s.enemyShot,y=enemyStart.y+(heroTarget.y-enemyStart.y)*s.enemyShot;ctx.strokeStyle='#e4fff4';ctx.lineWidth=2;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.ellipse(x+Math.abs(i)*8,y+i*11,18,6,-.12,Math.PI*.4,Math.PI*1.65);ctx.stroke();}}
  }
  if(s.impact>0){const p=correct?end:heroTarget;ctx.globalAlpha=s.impact;ctx.strokeStyle=shield?'#bcf5ed':'#fff0a0';ctx.lineWidth=3;ctx.shadowBlur=10;ctx.shadowColor='#ffe583';ctx.beginPath();ctx.arc(p.x,p.y,10+30*(1-s.impact),0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){const angle=i*Math.PI/4,r=14+32*(1-s.impact);ctx.beginPath();ctx.moveTo(p.x+Math.cos(angle)*r,p.y+Math.sin(angle)*r);ctx.lineTo(p.x+Math.cos(angle)*(r+9),p.y+Math.sin(angle)*(r+9));ctx.stroke();}}
  ctx.restore();
}
function rect(element,box){const r=element.getBoundingClientRect();return {x:r.left-box.left,y:r.top-box.top,w:r.width,h:r.height};}
function cancelAll(){for(const stop of [...active])stop();}
function run(container,actors,duration,draw,hold=false){
  if(!container||!root.requestAnimationFrame||root.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return false;
  const box=container.getBoundingClientRect();if(!box.width||!box.height)return false;
  const canvas=root.document.createElement('canvas');canvas.className='motionOverlay';canvas.setAttribute('aria-hidden','true');
  const dpr=Math.min(root.devicePixelRatio||1,2);canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);
  const ctx=canvas.getContext?.('2d');if(!ctx)return false;
  const images={};for(const a of actors){if(!ready(a.key,a.clip))return false;for(const url of asset(a.key).clips[a.clip].sheets)images[url]=cache.get(url).image;if(cache.get(asset(a.key).still)?.image)images[asset(a.key).still]=cache.get(asset(a.key).still).image;a.rect=rect(a.element,box);}
  container.append(canvas);ctx.scale(dpr,dpr);
  const old=actors.map(a=>[a.element,a.element.style.visibility]);for(const [el]of old)el.style.visibility='hidden';
  let id,start=root.performance?.now?.(),stopped=false;
  const stop=()=>{if(stopped)return;stopped=true;root.cancelAnimationFrame(id);canvas.remove();for(const [el,value]of old)el.style.visibility=value;active.delete(stop);};active.add(stop);
  function tick(now){if(stopped)return;if(!container.isConnected||root.document.hidden){stop();return;}start??=now;const ms=now-start;ctx.clearRect(0,0,box.width,box.height);draw(ctx,images,Math.min(ms,duration),actors,box);if(ms<duration)id=root.requestAnimationFrame(tick);else if(!hold)stop();}
  draw(ctx,images,0,actors,box);id=root.requestAnimationFrame(tick);return true;
}
function reaction({container,hero,enemy,pip,correct,defeated,heroDefeated,assist,shield}){
  const hk=hero?.dataset.motionActor,ek=enemy?.dataset.motionActor,pk=pip?.dataset.motionActor;
  if(hk!=='mage'||!ek)return false;
  const usePip=correct&&assist&&pk==='pip'&&ready('pip','fire')&&!!cache.get(asset('pip').still)?.image;
  const hc=correct?castClip(usePip):shield?'cast':heroDefeated?'defeat':'hit',ec=correct?(defeated?'defeat':'hit'):'attack';
  const actors=[{element:hero,key:hk,clip:hc},{element:enemy,key:ek,clip:ec}];
  if(usePip)actors.push({element:pip,key:pk,clip:'fire'});
  return run(container,actors,DURATION,(ctx,images,ms,a)=>drawBattle(ctx,images,{hero:a[0].rect,enemy:a[1].rect,pip:usePip?a[2].rect:null},{correct,enemy:ek,defeated,heroDefeated,assist:usePip,shield,stage:enemy.dataset.motionStage},ms),defeated||heroDefeated);
}
function pipAttackWeight(ms){return smooth(ms/120)*(1-smooth((ms-850)/200));}
function drawBattle(ctx,images,layout,options,ms){
  const {correct=true,enemy:ek='thornling',defeated=false,heroDefeated=false,assist=false,shield=false}=options;
  const hr=layout.hero,er=stageRect(layout.enemy,options.stage),start=spellPoint(hr,assist),end=point(ek,er,asset(ek).target),heroTarget=point('mage',hr,asset('mage').target);
  const enemyFront=point(ek,er,asset(ek).front),travel=Math.max(0,enemyFront.x-heroTarget.x-8);
  const landingShift=attackMode(ek)!=='melee'?0:Math.max(0,hr.y+hr.h-er.y-er.h);
  if(!correct&&attackMode(ek)==='shock')heroTarget.y=hr.y+hr.h-10;
  else if(!correct&&attackMode(ek)==='melee')heroTarget.y=clamp(enemyFront.y+landingShift,heroTarget.y,hr.y+hr.h-10);
  const s=timeline(ms,{...options,travel});
  const hc=correct?castClip(assist):shield?'cast':heroDefeated?'defeat':'hit',ec=correct?(defeated?'defeat':'hit'):'attack';
  drawActor(ctx,images,'mage',hc,s.hero.p,hr,!correct&&!shield?-10*Math.sin(Math.PI*s.hero.p):0);
  drawActor(ctx,images,ek,ec,s.enemy.p,er,s.enemy.x+(correct&&!defeated?8*Math.sin(Math.PI*s.enemy.p):0),defeated&&ms>1100?Math.max(0,1-(ms-1100)/100):1,!correct&&travel?landingShift*(-s.enemy.x/travel):0);
  if(assist&&layout.pip){
    const still=images[asset('pip').still],attack=pipAttackWeight(ms);
    if(still&&attack<1){const f=fit(asset('pip').view,layout.pip);ctx.save();ctx.globalAlpha=1-attack;ctx.drawImage(still,f.x,f.y,512*f.scale,512*f.scale);ctx.restore();}
    if(attack>0||!still)drawActor(ctx,images,'pip','fire',s.pip.p,layout.pip,0,still?attack:1);
  }
  drawEffects(ctx,s,{start,end,enemyStart:enemyFront,ground:hr.y+hr.h-5,heroTarget,correct,shield,assistStart:assist&&layout.pip?point('pip',layout.pip,asset('pip').mouth):null});
}

function celebrate(container,element,clip='victory'){
  const targets=element?.dataset.motionActor?[element]:[...(element?.querySelectorAll('[data-motion-actor]')||[])].filter(e=>!e.closest('.retired'));
  const actors=targets.map(element=>({element,key:element.dataset.motionActor,clip}));if(!actors.length)return false;
  return run(container,actors,1600,(ctx,images,ms,a)=>{for(const item of a)drawActor(ctx,images,item.key,clip,ms/1600,stageRect(item.rect,item.element.dataset.motionStage));});
}
return {blueMatte,cleanBluePixels,prepareImage,pipAttackWeight,DURATION,IMPACT,asset,enemyKey,stageScale,stageRect,attackMode,render,warm,ready,fit,point,castClip,spellPoint,frameIndex,drawActor,timeline,drawEffects,drawBattle,reaction,celebrate,cancelAll};
});
