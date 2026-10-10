'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {parseHTML}=require('linkedom');
const D=require('../assets/wimmelbild/data'),C=require('../assets/wimmelbild/core');
test('journey rejects wrong/unknown answers and opens one scene at a time',()=>{
 const s=C.fresh();assert.equal(C.answer(s,'missing').ok,false);assert.deepEqual(s.solved,[]);
 for(let i=0;i<D.scenes.length;i++){
  const scene=D.scenes[i];assert.equal(s.scene,i);assert.equal(C.answer(s,scene.options.find(o=>o.id!==scene.answer).id).ok,false);assert.equal(s.scene,i);
  const r=C.answer(s,scene.answer);assert.equal(r.ok,true);assert.equal(r.finished,i===D.scenes.length-1);
  assert.deepEqual(C.restore(JSON.parse(JSON.stringify(s))),s);
 }
 assert.equal(s.completed,true);assert.equal(s.solved.length,4);
 // Replaying an earlier scene never deletes later discoveries.
 s.scene=0;C.answer(s,D.scenes[0].answer);assert.equal(s.solved.length,4);
});
test('only contiguous completed scenes unlock; corrupted saves are rejected',()=>{
 assert.throws(()=>C.restore({version:7}));assert.throws(()=>C.restore({version:1,scene:'3',solved:[]}));
 assert.equal(C.restore({version:1,scene:3,solved:['treasure']}).scene,0);
 assert.equal(C.restore({version:1,scene:3,solved:['harbour']}).scene,1);
});
test('all authored hit regions select their own option without overlap at centres',()=>{
 for(const s of D.scenes){assert.ok(fs.existsSync('assets/wimmelbild/scenes/'+s.image));assert.equal(s.options.filter(o=>o.id===s.answer).length,1);
  for(const o of s.options){const [x,y,w,h]=o.box;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1&&y+h<=1);assert.equal(C.hit(s,x+w/2,y+h/2).id,o.id);}
 }
});
test('zoom preserves the focal point and constrains pan and scale',()=>{
 const v=C.fit(900,600);C.zoom(v,2,450,300);assert.equal(v.scale,2);assert.equal(v.x,-450);assert.equal(v.y,-300);
 const point=[(300-v.x)/(v.bw*v.scale),(250-v.y)/(v.bh*v.scale)];C.zoom(v,1.2,300,250);assert.ok(Math.abs((300-v.x)/(v.bw*v.scale)-point[0])<1e-9);assert.ok(Math.abs((250-v.y)/(v.bh*v.scale)-point[1])<1e-9);
 C.zoom(v,100);assert.equal(v.scale,5);v.x=100000;v.y=-100000;C.bound(v);assert.equal(v.x,0);assert.equal(v.y,v.h-v.bh*5);C.zoom(v,.001);assert.equal(v.scale,1);assert.equal(v.x,0);assert.equal(v.y,0);
 const portrait=C.fit(360,600);assert.equal(portrait.bw,360);assert.equal(portrait.y,180);
});
function boot(saved,fail=false){
 const {window,document}=parseHTML(fs.readFileSync('assets/wimmelbild/index.html','utf8'));
 const memory=new Map([['blitzword-main-sentinel','untouched']]);if(saved!==undefined)memory.set(C.KEY,typeof saved==='string'?saved:JSON.stringify(saved));
 const localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('Quota');memory.set(k,v);},removeItem:k=>memory.delete(k)};
 window.WimmelCore=C;window.WimmelData=D;window.innerWidth=1180;window.scrollTo=()=>{};
 window.HTMLElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:750,height:500});
 Object.defineProperty(window.HTMLImageElement.prototype,'complete',{get:()=>true,configurable:true});Object.defineProperty(window.HTMLImageElement.prototype,'naturalWidth',{get:()=>1536,configurable:true});
 const context={window,document,localStorage,console,Image:class{},ResizeObserver:class{observe(){}},location:{reload(){}},confirm:()=>true};
 vm.runInNewContext(fs.readFileSync('assets/wimmelbild/app.js','utf8'),context);
 const get=id=>document.getElementById(id),choose=id=>{const b=document.querySelector('[data-choice="'+id+'"]');b.onclick();get('go').onclick();};
 return {get,choose,document,window,memory};
}
test('standalone UI saves, resumes, completes and leaves main saves untouched',()=>{
 let ui=boot();assert.equal(ui.get('go').disabled,true);ui.choose('cave');assert.equal(JSON.parse(ui.memory.get(C.KEY)).scene,0);ui.choose('tree');
 ui=boot(JSON.parse(ui.memory.get(C.KEY)));assert.equal(ui.get('title').textContent,'A door in the tree');ui.choose('high');ui.choose('arch');ui.choose('right');
 assert.equal(ui.get('ending').hidden,false);assert.equal(ui.get('game').hidden,true);assert.equal(ui.memory.get('blitzword-main-sentinel'),'untouched');
 ui=boot(JSON.parse(ui.memory.get(C.KEY)));assert.equal(ui.get('ending').hidden,false);ui.get('explore').onclick();assert.equal(ui.get('title').textContent,'The moon treasure');
});
test('failed saves are reported and corrupt or concurrent saves are never overwritten',()=>{
 const failed=boot(undefined,true);failed.choose('tree');assert.equal(failed.get('save-warning').hidden,false);assert.match(failed.get('save-message').textContent,/could not be saved/);
 const corrupt=boot('{bad');corrupt.choose('tree');assert.equal(corrupt.memory.get(C.KEY),'{bad');assert.equal(corrupt.get('go').disabled,true);
 const conflict=boot();conflict.memory.set(C.KEY,JSON.stringify({...C.fresh(),solved:['harbour'],scene:1}));const newest=conflict.memory.get(C.KEY);conflict.choose('tree');assert.equal(conflict.memory.get(C.KEY),newest);assert.match(conflict.get('save-message').textContent,/another tab/);
});
