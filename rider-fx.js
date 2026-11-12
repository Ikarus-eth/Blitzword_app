// Team attack while Artus rides Pip (12 November 2026): the staff charges, a forked lightning bolt hits the
// enemy, Pip breathes a stream of fire from his mouth, and the hit bursts into sparks and embers. Drawn on one
// canvas inside the combat-effects layer and removed when it ends. A blaze (three right in a row, or the hit
// that wins the fight) breathes a wider, longer flame with a bigger burst.
(function(root){
  'use strict';
  const DURATION=1600,SPEED=1.45;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=t=>1-Math.pow(1-t,3);
  // Window that rises over `inn` ms from `a`, holds, and falls over `out` ms before `b`.
  const envelope=(t,a,b,inn=80,out=160)=>t<a||t>b?0:Math.min(1,(t-a)/inn,(b-t)/out);
  function boltPath(a,b,rough,rand){
    let pts=[a,b];
    for(let depth=0;depth<6;depth++){
      const next=[pts[0]];
      for(let i=1;i<pts.length;i++){
        const p=pts[i-1],q=pts[i],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy)||1,off=(rand()-.5)*rough*len;
        next.push({x:(p.x+q.x)/2-dy/len*off,y:(p.y+q.y)/2+dx/len*off},q);
      }
      pts=next;rough*=.56;
    }
    return pts;
  }
  function strokePath(ctx,pts){ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.stroke();}
  function fireColour(f){
    // life fraction 0 → 1: white-hot, gold, orange, deep red
    const stops=[[0,[255,250,226]],[.18,[255,214,96]],[.45,[255,140,42]],[.75,[214,62,24]],[1,[120,30,20]]];
    for(let i=1;i<stops.length;i++)if(f<=stops[i][0]){const [a,ca]=stops[i-1],[b,cb]=stops[i],k=(f-a)/(b-a);return ca.map((c,j)=>Math.round(c+(cb[j]-c)*k));}
    return stops.at(-1)[1];
  }
  // Painted fire (fal.ai): frames are RGBA with the jet starting at the left edge, halfway down.
  const FIRE_DIR='assets/battle-fire/',FIRE={frames:[],burst:null};
  if(typeof Image!=='undefined'){
    FIRE.frames=['fire-a','fire-b','fire-c'].map(name=>{const im=new Image();im.decoding='async';im.src=FIRE_DIR+name+'.webp';return im;});
    FIRE.burst=new Image();FIRE.burst.decoding='async';FIRE.burst.src=FIRE_DIR+'fire-burst.webp';
  }
  const ready=im=>!!(im&&im.complete&&im.naturalWidth);
  function drawBreath(ctx,t,{mouth,target,angle,dist,blaze,unit,from=0}){
    const span=blaze?820:680,life=t-from;if(life<0||life>span+260)return;
    const frames=FIRE.frames.filter(ready);if(!frames.length)return;
    const reach=ease(clamp(life/230))*1.25,fade=life<span?1:1-clamp((life-span)/260);
    const L=dist*(blaze?1.1:1.04),grow=blaze?1.45:1.1,cap=(blaze?150:105)*unit,hOf=f=>Math.min(cap*(f.naturalHeight/f.naturalWidth)/(369/1200),L*(f.naturalHeight/f.naturalWidth)*grow),H=Math.max(...frames.map(hOf));
    const step=life/75,i=Math.floor(step)%frames.length,mix=step-Math.floor(step);
    // Drawn on a scratch canvas, then faded out past the front of the flame, so the flame grows with a soft tip.
    const pad=8*unit,W=Math.ceil(L+pad*2),Hc=Math.ceil(H*1.1+pad*2);
    const scratch=FIRE.scratch||=(typeof document!=='undefined'?document.createElement('canvas'):null);if(!scratch)return;
    if(scratch.width<W||scratch.height<Hc){scratch.width=Math.max(W,scratch.width);scratch.height=Math.max(Hc,scratch.height);}
    const sc=scratch.getContext('2d');sc.setTransform(1,0,0,1,0,0);sc.globalCompositeOperation='source-over';sc.globalAlpha=1;sc.clearRect(0,0,scratch.width,scratch.height);
    const wob=1+.04*Math.sin(life/45),mid=Hc/2;
    for(const [f,a] of [[frames[i],1-mix],[frames[(i+1)%frames.length],mix]]){const h=hOf(f)*wob;sc.globalAlpha=a;sc.drawImage(f,pad,mid-h/2,L,h);}
    const front=pad+L*reach,soft=Math.max(40*unit,L*.18);
    sc.globalAlpha=1;sc.globalCompositeOperation='destination-in';const g=sc.createLinearGradient(front-soft,0,front,0);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=g;sc.fillRect(0,0,W,Hc);
    ctx.save();ctx.translate(mouth.x,mouth.y);ctx.rotate(angle);ctx.globalAlpha=fade;ctx.drawImage(scratch,0,0,W,Hc,-pad,-mid,W,Hc);ctx.restore();
    const hit=life-160;
    if(ready(FIRE.burst)&&hit>0&&hit<span+200){
      const k=ease(clamp(hit/260)),size=(blaze?230:170)*unit*(.55+.6*k),a=hit<span-100?1:1-clamp((hit-(span-100))/300);
      ctx.save();ctx.globalAlpha=a;ctx.translate(target.x,target.y);ctx.rotate(.4*Math.sin(hit/300));ctx.drawImage(FIRE.burst,-size/2,-size/2,size,size);ctx.restore();
    }
  }
  // Pip's fire alone, for fights where Pip stands beside Artus (Big Pip and later, not riding).
  function breath(container,{mouth,target,blaze=false,reduced=false}={}){
    if(!container||!mouth||!target||reduced)return null;
    const box=container.getBoundingClientRect(),dpr=Math.min(2,root.devicePixelRatio||1);
    const canvas=document.createElement('canvas');canvas.className='riderFx pipBreath';canvas.setAttribute('aria-hidden','true');
    canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6';
    container.append(canvas);const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return null;}ctx.scale(dpr,dpr);
    const unit=clamp(Math.min(box.width,box.height)/700,.55,1.4),to={x:target.x-6*unit,y:target.y+12*unit},dx=to.x-mouth.x,dy=to.y-mouth.y,dist=Math.hypot(dx,dy)||1,angle=Math.atan2(dy,dx);
    let start=null,frame=0;const end=(blaze?820:680)+460;
    function draw(ts){start??=ts;const t=(ts-start)*SPEED;ctx.clearRect(0,0,box.width,box.height);drawBreath(ctx,t,{mouth,target:to,angle,dist,blaze,unit,from:0});if(t<end)frame=root.requestAnimationFrame(draw);else canvas.remove();}
    frame=root.requestAnimationFrame(draw);return {canvas,stop(){root.cancelAnimationFrame(frame);canvas.remove();}};
  }
  function play(container,{staff,mouth,target,blaze=false,reduced=false,random=Math.random}={}){
    if(!container||!staff||!mouth||!target)return null;
    const box=container.getBoundingClientRect(),dpr=Math.min(2,root.devicePixelRatio||1);
    const canvas=document.createElement('canvas');canvas.className='riderFx';canvas.setAttribute('aria-hidden','true');
    canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6';
    container.append(canvas);const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return null;}
    ctx.scale(dpr,dpr);
    const size=Math.min(box.width,box.height),unit=clamp(size/700,.55,1.4);
    const fireTo={x:target.x-6*unit,y:target.y+18*unit},dx=fireTo.x-mouth.x,dy=fireTo.y-mouth.y,dist=Math.hypot(dx,dy)||1,angle=Math.atan2(dy,dx);
    const flames=[],sparks=[],embers=[];let bolt=null,branches=[],boltAt=-1,emitted=0,burst=false,start=null,frame=0;
    const spread=blaze?.17:.1,rate=blaze?1.2:.8,emitEnd=blaze?1120:980,grow=blaze?46:34;
    function makeBurst(now){
      const n=blaze?34:22;
      for(let i=0;i<n;i++){const a=random()*6.28,v=(.18+random()*.45)*unit*(blaze?1.35:1);sparks.push({x:target.x,y:target.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.12*unit,born:now,life:380+random()*380});}
      for(let i=0;i<(blaze?18:10);i++){const a=-Math.PI/2+(random()-.5)*2.2,v=(.04+random()*.12)*unit;embers.push({x:target.x+(random()-.5)*30*unit,y:target.y+(random()-.2)*20*unit,vx:Math.cos(a)*v,vy:Math.sin(a)*v,born:now,life:600+random()*500,r:(1.5+random()*2.5)*unit});}
    }
    function draw(ts){
      // The script below is timed in a 1,600-unit timeline played 1.45× faster (about 1.1 s), so the whole
      // attack, burst included, finishes before the next word appears.
      if(start===null)start=ts;const t=(ts-start)*SPEED;
      ctx.clearRect(0,0,box.width,box.height);
      // 1. Staff charge
      const charge=envelope(t,0,560,120,220);
      if(charge>0){
        const r=(8+18*ease(clamp(t/260)))*unit*(1+.12*Math.sin(t/22));
        ctx.globalCompositeOperation='lighter';
        const g=ctx.createRadialGradient(staff.x,staff.y,0,staff.x,staff.y,r*2.4);g.addColorStop(0,`rgba(255,252,230,${.95*charge})`);g.addColorStop(.3,`rgba(255,214,110,${.7*charge})`);g.addColorStop(1,'rgba(255,160,60,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(staff.x,staff.y,r*2.4,0,7);ctx.fill();
      }
      // 2. Lightning: a forked bolt that flickers into a new shape every few frames
      const strike=envelope(t,200,640,30,180);
      if(strike>0&&!reduced){
        if(!bolt||t-boltAt>55){boltAt=t;bolt=boltPath(staff,target,.42,random);branches=[];
          for(let k=0;k<(blaze?4:3);k++){const i=Math.floor(bolt.length*(.25+random()*.5)),p=bolt[i],a=angle+(random()-.5)*1.6,l=(40+random()*70)*unit;branches.push(boltPath(p,{x:p.x+Math.cos(a)*l,y:p.y+Math.sin(a)*l},.5,random));}}
        ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
        for(const [w,c] of [[30,`rgba(255,180,70,${.18*strike})`],[13,`rgba(255,214,110,${.5*strike})`],[5,`rgba(255,255,245,${strike})`]]){ctx.lineWidth=w*unit;ctx.strokeStyle=c;strokePath(ctx,bolt);}
        for(const br of branches){ctx.lineWidth=5*unit;ctx.strokeStyle=`rgba(255,215,120,${.4*strike})`;strokePath(ctx,br);ctx.lineWidth=1.6*unit;ctx.strokeStyle=`rgba(255,255,240,${.85*strike})`;strokePath(ctx,br);}
        // contact flash
        const fg=ctx.createRadialGradient(target.x,target.y,0,target.x,target.y,46*unit);fg.addColorStop(0,`rgba(255,255,240,${.9*strike})`);fg.addColorStop(1,'rgba(255,200,90,0)');ctx.fillStyle=fg;ctx.beginPath();ctx.arc(target.x,target.y,46*unit,0,7);ctx.fill();
      }
      // 3. Pip's fire breath: painted fire frames from fal.ai (12 November 2026), flickering between three
      //    paintings, growing out of his mouth towards the enemy, with a painted burst where it hits.
      if(!reduced)drawBreath(ctx,t,{mouth,target:fireTo,angle,dist,blaze,unit,from:380});
      // 4. Impact burst
      if(!burst&&t>=560){burst=true;makeBurst(t);}
      const hit=envelope(t,560,1000,40,300);
      if(hit>0){
        const rr=(30+90*ease(clamp((t-560)/420)))*unit*(blaze?1.3:1);
        ctx.lineWidth=(6*(1-clamp((t-560)/440))+1)*unit;ctx.strokeStyle=`rgba(255,226,140,${.3*hit})`;ctx.beginPath();ctx.arc(target.x,target.y,rr,0,7);ctx.stroke();
        const hg=ctx.createRadialGradient(target.x,target.y,0,target.x,target.y,rr*.8);hg.addColorStop(0,`rgba(255,250,225,${.8*hit})`);hg.addColorStop(.5,`rgba(255,160,60,${.35*hit})`);hg.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=hg;ctx.beginPath();ctx.arc(target.x,target.y,rr*.8,0,7);ctx.fill();
      }
      for(let i=sparks.length-1;i>=0;i--){const p=sparks[i],age=t-p.born,f=age/p.life;if(f>=1){sparks.splice(i,1);continue;}
        const x=p.x+p.vx*age,y=p.y+p.vy*age+.0004*age*age*unit,tx=x-p.vx*28,ty=y-(p.vy+.0008*age*unit)*28;
        ctx.lineWidth=3.4*unit;ctx.strokeStyle=`rgba(255,${Math.round(240-120*f)},${Math.round(170-150*f)},${1-f})`;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke();}
      ctx.globalCompositeOperation='source-over';
      for(let i=embers.length-1;i>=0;i--){const p=embers[i],age=t-p.born,f=age/p.life;if(f>=1){embers.splice(i,1);continue;}
        const x=p.x+p.vx*age+Math.sin(age/90+i)*4*unit,y=p.y+p.vy*age;ctx.fillStyle=`rgba(255,${Math.round(200-110*f)},70,${(1-f)*.95})`;ctx.beginPath();ctx.arc(x,y,p.r*(1-f*.5),0,7);ctx.fill();}
      if(t<DURATION||sparks.length||embers.length)frame=root.requestAnimationFrame(draw);else canvas.remove();
    }
    frame=root.requestAnimationFrame(draw);
    return {canvas,stop(){root.cancelAnimationFrame(frame);canvas.remove();}};
  }
  root.BlitzRiderFx={play,breath,DURATION:DURATION/SPEED};
})(typeof window!=='undefined'?window:globalThis);
