const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'../'),Core=require(root+'game-core'),Content=require(root+'content'),Storage=require(root+'storage'),Audio=require(root+'audio');
function boot(saved,options={}){
 const {window,document}=parseHTML(fs.readFileSync(root+'index.html','utf8'));
 let now=Date.UTC(2026,8,21),uid=0;const jobs=new Map(),memory=new Map(saved?[[Storage.KEY,JSON.stringify(saved)]]:[]);
 let failWrites=!!options.failWrites;
 const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>{if(failWrites)throw new Error('Storage full');memory.set(k,v)},removeItem:k=>memory.delete(k)};
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
 return {state,get,click,tick,until,ready,document,setFailWrites:value=>failWrites=value};
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

// Returning results and new challenges must preserve the chosen hero and earned wins.
for(const victory of [true,false]){
 const s=Core.migrate(Core.fresh()),now=Date.now();s.profile.name='Éva';s.profile.gender='girl';s.profile.heroClass='Knight';s.assessment.done=true;
 Core.startBattle(s,now,{strength:4});s.battle.enemyHealth=victory?0:4;s.battle.heroHealth=victory?3:0;Core.prepareBattle(s,now);
 const ui=boot(s);ui.click(ui.get('continueAdventure'));assert.ok(ui.get('result').classList.contains('active'));assert.equal(ui.get('opponents').children.length,2);
 assert.equal(ui.get('resultHero').dataset.sprite,'4');const wins=ui.state().campaign.wins;
 ui.click(ui.get('resultNext'));assert.ok(ui.get('route').classList.contains('active'));ui.click(ui.get('continueAdventure'));assert.equal(ui.state().campaign.wins,wins);
 ui.click(ui.get('opponents').children[1]);assert.equal(ui.state().battle.maxHealth,victory?5:3);assert.equal(ui.state().campaign.wins,wins);
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseFinish'));assert.ok(ui.get('summary').classList.contains('active'));assert.ok(ui.state().session.completedAt);
 const oldSession=ui.state().session.id;ui.click(ui.get('anotherChallenge'));assert.notEqual(ui.state().session.id,oldSession);assert.ok(ui.get('battle').classList.contains('active'));
 console.log('PASS returning',victory?'victory':'retry','→ chosen strength → finish → summary → new challenge');
}
{
 const ui=boot(null,{failWrites:true});assert.equal(ui.get('saveNotice').hidden,false);ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('saveNotice').hidden,true);assert.ok(ui.get('setup').classList.contains('active'));assert.equal(ui.get('pausePanel').hidden,true);
 ui.get('nameInput').value='Éva';ui.click(ui.get('setupNext'));ui.click(ui.get('backBtn'));assert.ok(ui.get('setup').classList.contains('active'));assert.equal(ui.get('nameInput').value,'Éva');
 ui.click(ui.get('setupNext'));ui.click(ui.get('heroNext'));ui.setFailWrites(true);ui.click(ui.get('tryBattle'));assert.equal(ui.get('saveNotice').hidden,false);ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('continueAdventure').hidden,false);ui.click(ui.get('continueAdventure'));assert.ok(ui.get('teaching').classList.contains('active'));
 ui.click(ui.get('teachContinue'));ui.ready();const question=ui.state().battle.question;ui.setFailWrites(true);ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===question.target));assert.equal(ui.get('saveNotice').hidden,false);ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('pausePanel').hidden,false);ui.click(ui.get('pauseResume'));ui.until(()=>ui.state().battle.question.id!==question.id);assert.equal(ui.state().campaign.battleRecords.filter(r=>r.id===question.id).length,1);
 console.log('PASS save recovery at setup, route and committed answer; no duplicate answer');
}
