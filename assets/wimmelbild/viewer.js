(function(root){
  'use strict';
  function mount(host,url,alt,prior){
    const view=document.createElement('div'),surface=document.createElement('img'),bar=document.createElement('div');
    view.className='mapZoomViewport';view.tabIndex=0;view.setAttribute('role','group');view.setAttribute('aria-label','Search map. Pinch or use zoom buttons; drag or use arrow keys. Picture taps never select answers.');
    surface.className='mapZoomImage';surface.alt=alt;surface.draggable=false;view.append(surface);bar.className='mapZoomBar';
    const message=document.createElement('span');message.textContent='Pinch to zoom · Drag to explore';bar.append(message);
    const controls=document.createElement('div');bar.append(controls);const out=document.createElement('output');
    let v={scale:1,x:0,y:0,w:1,h:1,bw:1,bh:1},points=new Map(),dead=false,loaded=false;
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    function bound(){const w=v.bw*v.scale,h=v.bh*v.scale;v.x=w<=v.w?(v.w-w)/2:clamp(v.x,v.w-w,0);v.y=h<=v.h?(v.h-h)/2:clamp(v.y,v.h-h,0);}
    function paint(){surface.style.width=v.bw+'px';surface.style.height=v.bh+'px';surface.style.transform=`translate(${v.x}px,${v.y}px) scale(${v.scale})`;out.value=(Math.round(v.scale*10)/10)+'×';minus.disabled=v.scale<=1;plus.disabled=v.scale>=8;}
    function snapshot(){return {scale:v.scale,cx:(v.w/2-v.x)/(v.bw*v.scale),cy:(v.h/2-v.y)/(v.bh*v.scale)};}
    function fit(saved){const r=view.getBoundingClientRect();if(!r.width||!r.height)return;v.w=r.width;v.h=r.height;v.bw=Math.min(r.width,r.height*1.5);v.bh=v.bw/1.5;v.scale=saved?.scale||1;v.x=r.width/2-(saved?.cx??.5)*v.bw*v.scale;v.y=r.height/2-(saved?.cy??.5)*v.bh*v.scale;bound();paint();}
    function zoom(f,x=v.w/2,y=v.h/2){const next=clamp(v.scale*f,1,8),r=next/v.scale;v.x=x-(x-v.x)*r;v.y=y-(y-v.y)*r;v.scale=next;bound();paint();}
    function button(label,aria,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',aria);b.onclick=fn;controls.append(b);return b;}
    const minus=button('−','Zoom out',()=>zoom(1/1.5));controls.append(out);const plus=button('+','Zoom in',()=>zoom(1.5));button('Whole map','Show the whole map',()=>fit());
    const expand=button('Big picture','Expand the map',()=>{host.classList.toggle('mapZoomExpanded');expand.textContent=host.classList.contains('mapZoomExpanded')?'Back to question':'Big picture';fit(snapshot());});
    const status=document.createElement('p');status.className='mapImageStatus';status.textContent='Opening the large map…';view.append(status);host.append(view,bar);
    surface.onload=()=>{if(dead)return;loaded=true;status.hidden=true;fit(prior);};surface.onerror=()=>{if(dead)return;status.textContent='The map did not load. ';const retry=document.createElement('button');retry.textContent='Try again';retry.onclick=()=>surface.src=url+'?retry='+Date.now();status.append(retry);};surface.src=url;if(surface.complete&&surface.naturalWidth)surface.onload();
    const pos=e=>{const r=view.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
    view.addEventListener('pointerdown',e=>{if(!loaded||e.button>0||e.target.closest('button'))return;e.preventDefault();points.set(e.pointerId,pos(e));view.setPointerCapture?.(e.pointerId);});
    view.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;const old=[...points.values()];points.set(e.pointerId,pos(e));const now=[...points.values()];if(now.length===1){v.x+=now[0].x-old[0].x;v.y+=now[0].y-old[0].y;}else{const [a,b]=old,[c,d]=now,dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist>2){zoom(Math.hypot(c.x-d.x,c.y-d.y)/dist,(a.x+b.x)/2,(a.y+b.y)/2);v.x+=(c.x+d.x-a.x-b.x)/2;v.y+=(c.y+d.y-a.y-b.y)/2;}}bound();paint();});
    const release=e=>points.delete(e.pointerId);for(const name of ['pointerup','pointercancel','lostpointercapture'])view.addEventListener(name,release);
    view.addEventListener('wheel',e=>{e.preventDefault();const p=pos(e);zoom(Math.exp(-e.deltaY*.002),p.x,p.y);},{passive:false});
    view.addEventListener('keydown',e=>{if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='=')zoom(1.5);else if(e.key==='-')zoom(1/1.5);else if(e.key==='0')fit();else{v.x+=e.key==='ArrowLeft'?70:e.key==='ArrowRight'?-70:0;v.y+=e.key==='ArrowUp'?70:e.key==='ArrowDown'?-70:0;bound();paint();}}});
    const esc=e=>{if(e.key==='Escape'&&host.classList.contains('mapZoomExpanded'))expand.click();};document.addEventListener('keydown',esc);
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(()=>{points.clear();fit(snapshot());}):null;observer?.observe(view);fit(prior);
    return {snapshot,destroy(){dead=true;observer?.disconnect();document.removeEventListener('keydown',esc);points.clear();host.classList.remove('mapZoomExpanded');},ready:()=>loaded};
  }
  root.BlitzMapViewer={mount};
})(typeof window==='object'?window:globalThis);
