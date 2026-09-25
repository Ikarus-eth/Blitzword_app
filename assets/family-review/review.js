(async()=>{
'use strict';
const KEY='blitzword-family-art-review-v2',OLD='blitzword-thornling-family-review-v1';
const NAMES=['Artus','Juna','Johanna','Ikarus'],COLORS=['#c88e3e','#668fac','#a376a5','#709551'];
const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
let catalog,state,index=0,active=0,serial=0,memoryOnly=false,imageLibrary;
const freshRound=()=>({ratings:Object.fromEntries(['current','a','b','c','d','e'].map(id=>[id,[null,null,null,null]])),comment:''});
const empty=()=>({version:2,names:[...NAMES],rounds:{},active:0,lastEntity:'thornling'});
const entity=()=>catalog.entities[index],round=()=>state.rounds[entity().id]||freshRound();
function validateRound(r){if(!r||typeof r.comment!=='string'||r.comment.length>10000)throw Error('Invalid notes');const out=freshRound();out.comment=r.comment;for(const id of Object.keys(out.ratings)){const a=r.ratings?.[id];if(!Array.isArray(a)||a.length!==4||a.some(n=>n!==null&&(!Number.isInteger(n)||n<1||n>5)))throw Error('Invalid scores');out.ratings[id]=a.slice();}return out;}
function validate(raw){if(raw?.version!==2||!Array.isArray(raw.names)||raw.names.length!==4||raw.names.some(n=>typeof n!=='string'||n.length>30))throw Error('Invalid review');const out=empty();out.names=raw.names.slice();out.active=Number.isInteger(raw.active)&&raw.active>=0&&raw.active<4?raw.active:0;out.lastEntity=catalog.entities.some(e=>e.id===raw.lastEntity)?raw.lastEntity:'thornling';for(const e of catalog.entities)if(raw.rounds?.[e.id])out.rounds[e.id]=validateRound(raw.rounds[e.id]);return out;}
function migrate(old){if(old?.version!==1||!Array.isArray(old.names)||old.names.length!==4||old.names.some(n=>typeof n!=='string'))throw Error('Invalid previous review');const r=validateRound(old),out=empty(),order=NAMES.map(name=>old.names.findIndex(n=>n.trim().toLowerCase()===name.toLowerCase())),used=new Set(order.filter(i=>i>=0));for(let i=0;i<4;i++)if(order[i]<0){order[i]=[0,1,2,3].find(x=>!used.has(x));used.add(order[i]);}for(const id of Object.keys(r.ratings))r.ratings[id]=order.map(i=>r.ratings[id][i]);out.rounds.thornling=r;out.active=Math.max(0,order.indexOf(old.active));return out;}
function status(){$('#save-status').textContent=memoryOnly?'Not saved — download your review':'Saved on this device';$('#save-status').classList.toggle('error',memoryOnly);}
function save(change){let next=state;if(!memoryOnly){try{const latest=localStorage.getItem(KEY);if(latest)next=validate(JSON.parse(latest));}catch{memoryOnly=true;}}change(next);state=next;if(!memoryOnly)try{localStorage.setItem(KEY,JSON.stringify(state));}catch{memoryOnly=true;}status();}
function ensure(s,id){return s.rounds[id]||(s.rounds[id]=freshRound());}
function button(text,cls,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;if(fn)b.onclick=fn;return b;}
function svgNode(tag,attrs){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;}
function artwork(option){
 const label='Whole-body '+entity().name+' — '+option.title;
 if(option.localImage||!option.crop){const img=document.createElement('img');img.src=option.src;img.alt=label;img.decoding='sync';return img;}
 const[x,y,w,h]=option.crop,id='review-art-clip-'+(++serial),svg=svgNode('svg',{viewBox:option.crop.join(' '),preserveAspectRatio:'xMidYMid meet',role:'img','aria-label':label});
 const defs=svgNode('defs',{}),clip=svgNode('clipPath',{id,clipPathUnits:'userSpaceOnUse'});clip.append(option.points?svgNode('polygon',{points:option.points}):svgNode('rect',{x,y,width:w,height:h}));defs.append(clip);svg.append(defs,svgNode('image',{href:option.src,width:option.width,height:option.height,'clip-path':'url(#'+id+')'}));return svg;
}
function renderPeople(){$('#people').replaceChildren();state.names.forEach((name,i)=>{const b=button(name,'person',()=>{active=i;save(s=>{s.active=i;});renderPeople();renderScores();});b.dataset.person=i;b.style.setProperty('--person',COLORS[i]);b.setAttribute('aria-pressed',String(i===active));$('#people').append(b);});}
function renderScores(){
 for(const option of entity().options){if(!option.src)continue;const card=$(`[data-design="${option.id}"]`),scores=round().ratings[option.id],selected=scores[active];card.querySelector('.score-name').textContent=state.names[active]+(selected===null?' · your score':` · ${selected}/5`);card.querySelector('.clear').hidden=selected===null;for(const b of card.querySelectorAll('.rating')){b.setAttribute('aria-pressed',String(Number(b.dataset.score)===selected));b.setAttribute('aria-label',`${state.names[active]}: ${option.id==='current'?'Current':option.id.toUpperCase()}, ${b.dataset.score} out of 5`);}const others=card.querySelector('.others');others.replaceChildren();state.names.forEach((name,i)=>{const el=document.createElement('div');el.className='other';el.style.setProperty('--person',COLORS[i]);const dot=document.createElement('i'),n=document.createElement('span'),value=document.createElement('b');n.textContent=name;value.textContent=scores[i]??'—';el.append(dot,n,value);others.append(el);});}
 let count=0,total=0;for(const e of catalog.entities)for(const o of e.options)if(o.src){total+=4;count+=(state.rounds[e.id]?.ratings[o.id]||[]).filter(x=>x!==null).length;}
 $('#count').replaceChildren(document.createTextNode(count+' '));const span=document.createElement('span');span.textContent='/ '+total;$('#count').append(span);$('#progress').max=total;$('#progress').value=count;
 const available=entity().options.filter(o=>o.src),mine=available.filter(o=>round().ratings[o.id][active]!==null).length;$('#round-progress').textContent=state.names[active]+': '+mine+' of '+available.length+' available designs rated';status();
}
function setScore(id,value){const eid=entity().id,who=active;save(s=>{ensure(s,eid).ratings[id][who]=value;});renderScores();}
function renderRound(){
 $('#round-number').textContent=`ROUND ${index+1} OF ${catalog.entities.length} · ${entity().kind==='enemy'?'ENEMY':'HERO'}`;$('#round-title').textContent=entity().name;$('#round-availability').textContent=entity().options.filter(o=>o.src).length+' of 6 images available';$('#jump').value=entity().id;$('#previous').disabled=index===0;$('#next-top').disabled=index===catalog.entities.length-1;$('#next').textContent=index===catalog.entities.length-1?'Back to Thornling ↑':'Next round →';$('#cards').replaceChildren();
 for(const option of entity().options){const id=option.id,title=option.title,card=document.createElement('article');card.className='card'+(id==='current'?' current':'')+(!option.src?' missing':'');card.dataset.design=id;
 const head=document.createElement('div');head.className='card-head';const badge=document.createElement('span');badge.className='badge';badge.textContent=id==='current'?'CURRENT':id.toUpperCase();const h=document.createElement('h2');h.textContent=title;head.append(badge,h);card.append(head);
 if(!option.src){const blank=document.createElement('div');blank.className='missing-art';const symbol=document.createElement('span');symbol.className='missing-symbol';symbol.setAttribute('aria-hidden','true');symbol.textContent='?';const strong=document.createElement('strong');strong.textContent='Image not recovered';const small=document.createElement('span');small.textContent='Add the original image from your device.';const add=button('Add image','',()=>imageLibrary?.choose(entity().id+'/'+id));add.setAttribute('aria-label','Add '+entity().name+' option '+id.toUpperCase());blank.append(symbol,strong,small,add);const note=document.createElement('p');note.className='missing-note';note.textContent='Available to rate when the image is added.';card.append(blank,note);$('#cards').append(card);continue;}
 const art=button('','art',()=>{$('#large-label').textContent=entity().name+' · '+(id==='current'?'CURRENT DESIGN':'OPTION '+id.toUpperCase());$('#large-title').textContent=title;$('#large-art').replaceChildren(artwork(option));$('#image-dialog').showModal();});art.setAttribute('aria-label','Enlarge '+entity().name+' '+title);const enlarge=document.createElement('span');enlarge.className='enlarge';enlarge.textContent='↗ Enlarge';art.append(artwork(option),enlarge);
 const score=document.createElement('div');score.className='score';const top=document.createElement('div');top.className='score-top';const who=document.createElement('strong');who.className='score-name';const clear=button('Clear','clear',()=>setScore(id,null));clear.setAttribute('aria-label','Clear your rating for '+title);top.append(who,clear);const ratings=document.createElement('div');ratings.className='ratings';ratings.setAttribute('role','group');ratings.setAttribute('aria-label','Rate '+title);for(let n=1;n<=5;n++){const b=button(String(n),'rating',()=>setScore(id,n));b.dataset.score=n;ratings.append(b);}const others=document.createElement('div');others.className='others';score.append(top,ratings,others);card.append(art,score);if(option.localImage){const note=document.createElement('p');note.className='local-image-note';note.textContent='Imported image · saved in this browser';card.append(note);}$('#cards').append(card);}
 $('#comment').value=round().comment;renderPeople();renderScores();history.replaceState(null,'','#'+entity().id);
}
function go(to){index=Math.max(0,Math.min(catalog.entities.length-1,to));save(s=>{s.lastEntity=entity().id;});renderRound();$('.round-heading').scrollIntoView({block:'start'});}
function missingImages(){return catalog.entities.flatMap(e=>e.options.filter(o=>!o.src).map(o=>({entity:e.id,option:o.id})));}
function reviewData(){return {...state,build:'family-review-imports-20260925-r3',missingImages:missingImages(),exportedAt:new Date().toISOString()};}
function downloadJSON(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function renderAvailability(){
 const missing=missingImages(),total=catalog.entities.reduce((n,e)=>n+e.options.length,0),local=catalog.entities.reduce((n,e)=>n+e.options.filter(o=>o.localImage).length,0);
 $('.availability').replaceChildren(document.createTextNode(`${total-missing.length} images available${local?' · '+local+' imported on this device':''}. `));
 const link=document.createElement('a');link.href='#missing';link.textContent=missing.length+' alternatives missing ↓';$('.availability').append(link);
 $('#missing-summary').textContent=missing.length?'What’s missing? · '+missing.length+' alternative images':'All alternative slots are filled';
 for(const e of catalog.entities){const n=e.options.filter(o=>!o.src).length;const item=[...$('#jump').options].find(o=>o.value===e.id);if(item)item.textContent=e.name+(n?' · '+n+' missing':' · complete');}
 const table=document.createElement('table'),caption=document.createElement('caption');caption.textContent='Missing alternatives by enemy and hero';table.append(caption);
 const thead=document.createElement('thead'),hr=document.createElement('tr');for(const text of ['Enemy / hero','Missing images']){const th=document.createElement('th');th.textContent=text;th.scope='col';hr.append(th);}thead.append(hr);table.append(thead);
 const tbody=document.createElement('tbody');catalog.entities.forEach((e,i)=>{const absent=e.options.filter(o=>!o.src);if(!absent.length)return;const tr=document.createElement('tr'),name=document.createElement('td'),cell=document.createElement('td');name.append(button(e.name,'',()=>go(i)));cell.textContent=absent.map(o=>o.id.toUpperCase()).join(', ');tr.append(name,cell);tbody.append(tr);});table.append(tbody);$('#missing-list').replaceChildren(table);
}

try{
 const response=await fetch('catalog.json?v=3');if(!response.ok)throw Error('Catalog unavailable');catalog=await response.json();state=empty();
 try{const saved=localStorage.getItem(KEY),old=localStorage.getItem(OLD);if(saved)state=validate(JSON.parse(saved));else if(old)state=migrate(JSON.parse(old));}catch{memoryOnly=true;}
 active=state.active;const initial=location.hash.slice(1)||state.lastEntity;index=Math.max(0,catalog.entities.findIndex(e=>e.id===initial));
 for(const kind of['enemy','hero']){const group=document.createElement('optgroup');group.label=kind==='enemy'?'20 enemies':'6 heroes';catalog.entities.filter(e=>e.kind===kind).forEach(e=>{const o=document.createElement('option');o.value=e.id;o.textContent=e.name;group.append(o);});$('#jump').append(group);}
 $('#jump').onchange=()=>go(catalog.entities.findIndex(e=>e.id===$('#jump').value));$('#previous').onclick=()=>go(index-1);$('#next-top').onclick=()=>go(index+1);$('#next').onclick=()=>go(index===catalog.entities.length-1?0:index+1);
 $('#comment').oninput=()=>{const id=entity().id,value=$('#comment').value;save(s=>{ensure(s,id).comment=value;});};
 $('#edit-names').onclick=()=>{$('#name-fields').replaceChildren();state.names.forEach((n,i)=>{const label=document.createElement('label');label.textContent='Person '+(i+1);const input=document.createElement('input');input.name='person'+i;input.value=n;input.maxLength=30;input.required=true;label.append(input);$('#name-fields').append(label);});$('#names-dialog').showModal();};
 $('#names-form').onsubmit=e=>{e.preventDefault();const names=[...document.querySelectorAll('#name-fields input')].map((x,i)=>x.value.trim()||NAMES[i]);save(s=>{s.names=names;});renderPeople();renderScores();$('#names-dialog').close();};$('#cancel-names').onclick=()=>$('#names-dialog').close();$('#image-dialog .close').onclick=()=>$('#image-dialog').close();
 $('#download').onclick=()=>downloadJSON(reviewData(),'blitzword-family-review.json');
 $('#download-missing').onclick=()=>downloadJSON({build:'family-review-imports-20260925-r3',missingImages:missingImages()},'blitzword-missing-images.json');
 window.addEventListener('storage',e=>{if(e.key!==KEY||memoryOnly)return;try{const latest=localStorage.getItem(KEY);if(latest){state=validate(JSON.parse(latest));renderPeople();renderScores();if(document.activeElement!==$('#comment'))$('#comment').value=round().comment;}}catch{}});
 renderRound();renderAvailability();
 imageLibrary=await window.BlitzImageLibrary.start({catalog,
   changed:()=>{renderRound();renderAvailability();},
   getReview:reviewData,validateReview:validate,
   restoreReview:review=>{save(s=>{Object.assign(s,validate(review));});active=state.active;renderRound();},
   clearRatings:slot=>{const [eid,oid]=slot.split('/');save(s=>{ensure(s,eid).ratings[oid]=[null,null,null,null];});}
 });
}catch(error){$('#round-title').textContent='The review could not open';$('#round-availability').textContent='Please reload to try again.';$('#save-status').textContent=error.message;}
})();
