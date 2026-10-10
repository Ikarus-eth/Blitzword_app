(() => {
'use strict';
const D=window.WimmelData,C=window.WimmelCore,$=id=>document.getElementById(id);
let state=C.fresh(),selected=null,raw=null,blocked=false,ready=false,view=C.fit(1,1),loadEpoch=0;
const points=new Map();let gesture=null,multi=false;
function warning(text){$('save-message').textContent=text;$('save-warning').hidden=false;}
try{raw=localStorage.getItem(C.KEY);if(raw)state=C.restore(JSON.parse(raw));}
catch(error){if(raw){blocked=true;warning('This saved journey could not be opened. Your other BlitzWord progress is safe.');const reset=document.createElement('button');reset.textContent='Start a new journey';reset.onclick=()=>{if(confirm('Replace only this mini-game’s unreadable save and start at the harbour?')){try{localStorage.removeItem(C.KEY);location.reload();}catch(e){warning('This browser is not allowing saves. Try reopening the page.');}}};$('save-warning').append(reset);}else warning('This browser is not allowing saves. You can play, but this journey may not be kept.');}
function freeze(){blocked=true;warning('This journey changed in another tab. Reload to keep the newest progress.');$('go').disabled=true;}
function persist(){
 if(blocked)return false;
 try{if(localStorage.getItem(C.KEY)!==raw){freeze();return false;}const next=JSON.stringify(state);localStorage.setItem(C.KEY,next);raw=next;$('save-warning').hidden=true;}
 catch(e){warning('Your progress could not be saved. You can keep playing here, but do not close this page.');}
 return true;
}
function stopSpeech(){window.speechSynthesis?.cancel();$('sound').textContent='Listen ♫';}
function speak(text){
 stopSpeech();if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){$('word-help').textContent='Listening is not available in this browser. The clue stays here to read.';$('word-help').hidden=false;return;}
 const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-GB';utterance.rate=.82;
 $('sound').textContent='Stop ■';utterance.onend=()=>{$('sound').textContent='Listen ♫';};utterance.onerror=()=>{$('sound').textContent='Listen ♫';};speechSynthesis.speak(utterance);
}
function wordLine(text){
 const p=document.createElement('p');
 text.split(/(\s+)/).forEach(token=>{if(/^\s+$/.test(token)){p.append(document.createTextNode(token));return;}const word=token.toLowerCase().replace(/[^a-z]/g,'');const b=document.createElement('button');b.type='button';b.className='word'+(D.words[word]?' new':'');b.textContent=token;b.setAttribute('aria-label','Hear '+word);b.onclick=()=>{$('word-help').hidden=false;$('word-help').textContent=D.words[word]?token+' — '+D.words[word]:token;speak(word);};p.append(b);});return p;
}
function paintView(){
 const s=$('surface');s.style.width=view.bw+'px';s.style.height=view.bh+'px';s.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;
 $('zoom').value=(Math.round(view.scale*10)/10)+'×';$('minus').disabled=view.scale<=1;$('plus').disabled=view.scale>=5;
 $('marker').style.width=(36/view.scale)+'px';$('marker').style.height=(36/view.scale)+'px';$('marker').style.borderWidth=(3/view.scale)+'px';
}
function fit(){const r=$('viewport').getBoundingClientRect();if(!r.width||!r.height)return;view=C.fit(r.width,r.height);paintView();}
function zoom(factor,x,y){C.zoom(view,factor,x,y);paintView();}
function point(e){const r=$('viewport').getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
function marker(option){if(!option){$('marker').hidden=true;return;}const [x,y,w,h]=option.box;$('marker').style.left=((x+w/2)*100)+'%';$('marker').style.top=((y+h/2)*100)+'%';$('marker').hidden=false;}
function select(id,fromCard=false){
 if(blocked||!ready)return;const scene=D.scenes[state.scene],option=scene.options.find(o=>o.id===id);if(!option)return;
 selected=id;for(const b of $('choices').children)b.setAttribute('aria-pressed',String(b.dataset.choice===id));
 $('feedback').textContent='Chosen: '+option.label+'. Read the clue once more, then '+scene.action.toLowerCase()+'.';$('go').disabled=false;$('go').textContent=scene.action;

}
function renderJourney(){
 $('journey').replaceChildren();D.scenes.forEach((scene,i)=>{const b=document.createElement('button');b.disabled=blocked||i>state.solved.length;b.innerHTML='<span class="dot"></span><span class="place-name"></span>';b.firstElementChild.textContent=state.solved.includes(scene.id)?'✓':String(i+1);b.lastElementChild.textContent=['Harbour','Tree village','Dragons','Castle'][i];if(i===state.scene)b.setAttribute('aria-current','step');b.onclick=()=>{stopSpeech();state.scene=i;if(persist())render();};$('journey').append(b);});
}
function render(message='',ending=false){
 stopSpeech();selected=null;ready=false;points.clear();gesture=null;multi=false;document.body.classList.remove('picture-expanded');$('expand').setAttribute('aria-pressed','false');$('expand').textContent='Big picture ⛶';
 $('game').hidden=ending;$('ending').hidden=!ending;renderJourney();if(ending){$('end-title').focus();return;}
 const scene=D.scenes[state.scene];
 $('place').textContent=scene.place;$('step').textContent='Stop '+(state.scene+1)+' of '+D.scenes.length;$('title').textContent=scene.title;$('intro').textContent=scene.intro;$('question').textContent=scene.question;
 $('clues').replaceChildren(...scene.lines.map(wordLine));$('word-help').hidden=true;$('hint-text').hidden=true;$('hint').setAttribute('aria-expanded','false');$('hint-text').textContent=scene.hint;$('feedback').textContent=message;$('go').disabled=true;$('go').textContent=scene.action;marker(null);
 $('choices').replaceChildren();scene.options.forEach(o=>{const b=document.createElement('button');b.dataset.choice=o.id;b.textContent=o.label;b.setAttribute('aria-pressed','false');b.onclick=()=>select(o.id,true);$('choices').append(b);});
 const epoch=++loadEpoch,img=$('scene');$('image-status').hidden=false;$('image-status').textContent='Opening the picture…';
 img.onload=()=>{if(epoch!==loadEpoch)return;ready=true;$('image-status').hidden=true;fit();};
 img.onerror=()=>{if(epoch!==loadEpoch)return;ready=false;$('image-status').replaceChildren(document.createTextNode('The picture did not load. '));const retry=document.createElement('button');retry.textContent='Try again';retry.onclick=()=>{img.src='scenes/'+scene.image+'?retry='+Date.now();};$('image-status').append(retry);};
 img.alt=scene.alt;img.src='scenes/'+scene.image;fit();if(img.complete&&img.naturalWidth)img.onload();
 $('reading').scrollTop=0;$('title').focus({preventScroll:true});if(window.innerWidth<=850)window.scrollTo({top:0,behavior:'instant'});
 // Warm only the next scene; images remain individually cacheable static assets.
 if(state.scene<D.scenes.length-1){const next=new Image();next.src='scenes/'+D.scenes[state.scene+1].image;}
}
$('go').onclick=()=>{
 if(blocked||!ready||!selected)return;
 const result=C.answer(state,selected);if(!persist())return;
 if(result.ok){render(result.message,result.finished);}
 else{$('feedback').textContent=result.message;selected=null;marker(null);$('go').disabled=true;for(const b of $('choices').children)b.setAttribute('aria-pressed','false');}
};
$('hint').onclick=()=>{const show=$('hint-text').hidden;$('hint-text').hidden=!show;$('hint').setAttribute('aria-expanded',String(show));};
$('sound').onclick=()=>{if(window.speechSynthesis?.speaking){stopSpeech();return;}const s=D.scenes[state.scene];speak(s.lines.join(' ')+' '+s.question);};
$('plus').onclick=()=>zoom(1.4);$('minus').onclick=()=>zoom(1/1.4);$('reset').onclick=fit;
$('reload').onclick=()=>location.reload();
$('expand').onclick=()=>{const on=document.body.classList.toggle('picture-expanded');$('expand').setAttribute('aria-pressed',String(on));$('expand').textContent=on?'Back to clue ↙':'Big picture ⛶';fit();};
$('explore').onclick=()=>{state.scene=D.scenes.length-1;if(persist())render('You found the treasure. You can keep exploring the picture.');};
$('again').onclick=()=>{if(blocked)return;if(confirm('Start this mini-game again at the harbour? Your other BlitzWord progress stays as it is.')){state=C.fresh();if(persist())render();}};
window.addEventListener('storage',e=>{if(e.key===C.KEY||e.key===null)freeze();});
window.addEventListener('pagehide',stopSpeech);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSpeech();points.clear();gesture=null;multi=false;}});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('picture-expanded')){$('expand').click();$('expand').focus();}});
const viewport=$('viewport');
viewport.addEventListener('keydown',e=>{if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='=')zoom(1.4);else if(e.key==='-')zoom(1/1.4);else if(e.key==='0')fit();else{view.x+=e.key==='ArrowLeft'?60:e.key==='ArrowRight'?-60:0;view.y+=e.key==='ArrowUp'?60:e.key==='ArrowDown'?-60:0;C.bound(view);paintView();}}});
viewport.addEventListener('wheel',e=>{e.preventDefault();const p=point(e);zoom(Math.exp(-e.deltaY*.002),p.x,p.y);},{passive:false});
viewport.addEventListener('pointerdown',e=>{
 if(!ready||e.button>0||e.target.closest('button'))return;e.preventDefault();viewport.setPointerCapture(e.pointerId);const p=point(e);points.set(e.pointerId,p);
 if(points.size===1){gesture={start:p,last:p,moved:false};multi=false;}else multi=true;
 viewport.classList.add('dragging');
});
viewport.addEventListener('pointermove',e=>{
 if(!points.has(e.pointerId))return;e.preventDefault();const before=[...points.values()],p=point(e);points.set(e.pointerId,p);const after=[...points.values()];
 if(points.size>=2){
  multi=true;const [a,b]=before,[c,d]=after,oldDist=Math.hypot(a.x-b.x,a.y-b.y),newDist=Math.hypot(c.x-d.x,c.y-d.y),oldMid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},mid={x:(c.x+d.x)/2,y:(c.y+d.y)/2};
  if(oldDist>2){C.zoom(view,newDist/oldDist,oldMid.x,oldMid.y);view.x+=mid.x-oldMid.x;view.y+=mid.y-oldMid.y;C.bound(view);paintView();}
 }else if(gesture){if(Math.hypot(p.x-gesture.start.x,p.y-gesture.start.y)>6)gesture.moved=true;view.x+=p.x-before[0].x;view.y+=p.y-before[0].y;C.bound(view);paintView();}
});
function release(e,cancelled=false){
 if(!points.has(e.pointerId))return;const p=point(e),tap=!cancelled&&!multi&&gesture&&!gesture.moved&&Math.hypot(p.x-gesture.start.x,p.y-gesture.start.y)<=6;
 points.delete(e.pointerId);if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);

 if(!points.size){gesture=null;multi=false;viewport.classList.remove('dragging');}else if(gesture)gesture.moved=true;
}
viewport.addEventListener('pointerup',e=>release(e));viewport.addEventListener('pointercancel',e=>release(e,true));viewport.addEventListener('lostpointercapture',e=>{if(points.has(e.pointerId))release(e,true);});
new ResizeObserver(()=>{points.clear();gesture=null;multi=false;fit();}).observe(viewport);
render('',state.completed);
})();
