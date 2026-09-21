const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'../'),Core=require(root+'game-core'),Content=require(root+'content'),Storage=require(root+'storage'),Audio=require(root+'audio');
function boot(saved){
 const {window,document}=parseHTML(fs.readFileSync(root+'index.html','utf8'));
 let now=Date.UTC(2026,8,21),uid=0;const jobs=new Map(),memory=new Map(saved?[[Storage.KEY,JSON.stringify(saved)]]:[]);
 const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
 const schedule=(fn,ms)=>(jobs.set(++uid,{fn,time:now+ms}),uid);
 window.localStorage=storage;
 Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get(){return this.querySelector('option[selected]')?.value||this.firstElementChild?.value||''},set(value){for(const option of this.querySelectorAll('option'))option.selected=option.value===value;}});
 Object.defineProperty(window.HTMLImageElement.prototype,'complete',{get:()=>true,configurable:true});Object.defineProperty(window.HTMLImageElement.prototype,'naturalWidth',{get:()=>1536,configurable:true});
 const ctx={window,document,BlitzCore:Core,BlitzContent:Content,BlitzStorage:Storage,BlitzAudio:{...Audio,narrator:opts=>Audio.narrator({...opts,schedule,unschedule:id=>jobs.delete(id)})},performance:{now:()=>now},Date:class extends Date{static now(){return now}},setTimeout:schedule,clearTimeout:id=>jobs.delete(id),setInterval(){},location:{reload(){}},confirm:()=>false,Option:function(t,v){const el=document.createElement('option');el.textContent=t;el.value=v;return el;}};
 vm.runInNewContext(fs.readFileSync(root+'app.js','utf8'),ctx);
 const state=()=>JSON.parse(memory.get(Storage.KEY)),get=id=>document.getElementById(id);
 function click(el){assert.ok(el,'missing element');assert.ok(!el.disabled,'disabled control');assert.ok(!el.hidden,'hidden control');el.onclick?.({});}
 function tick(){const next=[...jobs.entries()].sort((a,b)=>a[1].time-b[1].time)[0];assert.ok(next,'no scheduled progress');jobs.delete(next[0]);now=next[1].time;next[1].fn();}
 function until(predicate){for(let i=0;i<25&&!predicate();i++)tick();assert.ok(predicate(),'progress stalled');}
 function ready(){until(()=>state().battle?.question?.phase==='choices'||state().assessment.progress?.question?.phase==='choices'||!get('wordReady').hidden);if(!get('wordReady').hidden){click(get('wordReady'));until(()=>state().battle?.question?.phase==='choices');}}
 return {state,get,click,tick,until,ready,document};
}
for(const mode of ['win','lose','help']){
 let ui=boot();ui.get('nameInput').value='Éva';ui.click(ui.get('setupNext'));ui.click(ui.get('heroNext'));ui.click(ui.get('tryBattle'));
 assert.equal(ui.state().activity,'teaching');assert.equal(ui.get('teachContinue').disabled,false);ui.click(ui.get('teachContinue'));
 for(let turns=0;turns<8&&ui.state().activity==='battle';turns++){
  ui.ready();const q=ui.state().battle.question;assert.equal(ui.get('battleAnswers').children.length,4);assert.equal(ui.get('battleUnsure').hidden,false);
  if(mode==='help')ui.click(ui.get('battleUnsure'));else ui.click([...ui.get('battleAnswers').children].find(b=>mode==='win'?b.textContent===q.target:b.textContent!==q.target));
  if(ui.state().activity==='teaching')ui.click(ui.get('teachContinue'));else ui.until(()=>ui.state().activity!=='battle'||ui.state().battle.question.id!==q.id);
 }
 assert.equal(ui.state().activity,'handoff',mode);
 ui=boot(ui.state());ui.click(ui.get('continueAdventure'));assert.equal(ui.get('handoff').classList.contains('active'),true);ui.click(ui.get('handoffNext'));
 for(let i=0;i<8;i++){ui.until(()=>ui.state().assessment.progress?.question?.phase==='choices');ui.click(ui.get('assessmentUnsure'));ui.tick();}
 assert.equal(ui.state().assessment.done,true);assert.equal(ui.state().activity,'battle');assert.equal(ui.state().battle.demo,false);
 ui.click(ui.get('pauseBtn'));assert.equal(ui.get('pausePanel').hidden,false);ui.click(ui.get('pauseResume'));assert.equal(ui.get('pausePanel').hidden,true);
 console.log('PASS complete DOM flow:',mode,'→ saved handoff → assessment → campaign → pause/resume');
}
