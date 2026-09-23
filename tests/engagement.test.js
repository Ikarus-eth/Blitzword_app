const test=require('node:test'),assert=require('node:assert/strict');
const {Clock,IDLE_MS}=require('../engagement'),Core=require('../game-core'),Content=require('../content');
const START=Date.UTC(2026,8,22,10);
function clockRig(){const clock=new Clock(),s=Core.migrate(Core.fresh());let mono=0;clock.reset(0);return {clock,s,step(ms,category='practice',extra={}){mono+=ms;clock.sample({mono,wall:START+mono,category,...extra});const excluded=clock.takeExcluded();if(excluded)Core.recordTime(s,excluded,'idle',START+mono);},confirm(){for(const part of clock.confirm(mono))Core.recordTime(s,part.ms,part.category,part.end);},get mono(){return mono;}};}
test('only a meaningful action commits provisional time; 30 seconds idle discards the whole interval',()=>{
 const r=clockRig();for(let i=0;i<10;i++)r.step(1000);assert.equal(Core.parentProgress(r.s).activeMs,0);r.confirm();assert.equal(Core.parentProgress(r.s).activeMs,10000);
 for(let i=0;i<60;i++)r.step(1000);r.confirm();assert.equal(Core.parentProgress(r.s).activeMs,10000);assert.equal(Core.parentProgress(r.s).totals.idle,60000);
});
test('background, blur and suspended timers cannot turn elapsed wall time into play',()=>{
 for(const mode of ['hidden','blur','suspend']){
  const r=clockRig();r.step(2000);r.confirm();r.step(3000);
  if(mode==='suspend')r.step(20*60000);else r.step(1000,'practice',mode==='hidden'?{visible:false}:{focused:false});
  r.confirm();assert.equal(Core.parentProgress(r.s).activeMs,2000,mode);
 }
});
test('menu/result intervals are excluded; demo and assessment are separated from growth minutes',()=>{
 const r=clockRig();r.step(3000,'demo');r.confirm();r.step(4000,'assessment');r.confirm();r.step(5000,'practice');r.confirm();
 for(let i=0;i<100;i++)r.step(1000,null);r.confirm();
 const p=Core.parentProgress(r.s);assert.equal(p.activeMs,12000);assert.equal(p.totals.practice,5000);assert.equal(p.totals.demo,3000);assert.equal(p.totals.assessment,4000);assert.equal(Core.dragonProgress(r.s).activeMs,5000);
});
test('midnight attribution splits exact milliseconds between the device’s local dates',()=>{
 const s=Core.migrate(Core.fresh()),midnight=new Date(2026,8,23).getTime();Core.recordTime(s,10000,'practice',midnight+4000);
 assert.equal(s.timing.days['2026-09-22'].practice,6000);assert.equal(s.timing.days['2026-09-23'].practice,4000);
});
test('legacy foreground time remains separate across reload and session rollover',()=>{
 const old=Core.fresh();delete old.timing;old.session={id:'old',elapsedMs:900000,startedAt:new Date(START).toISOString(),completedAt:null};
 let s=Core.migrate(old);assert.equal(s.session.elapsedMs,0);assert.equal(Core.parentProgress(s).legacyMs,900000);assert.equal(Core.parentProgress(s).activeMs,0);
 Core.recordTime(s,10000,'practice',START);s=Core.migrate(JSON.parse(JSON.stringify(s)));assert.equal(Core.parentProgress(s).legacyMs,900000);assert.equal(Core.parentProgress(s).activeMs,10000);
 Core.completeSession(s,START);Core.beginSession(s,START+1000);assert.equal(Core.parentProgress(s).legacyMs,900000);assert.equal(Core.parentProgress(s).activeMs,10000);
});
test('five hours of mixed practice spans all 200 words, seven chapters, pauses and saved reloads',()=>{
 let s=Core.migrate(Core.fresh()),mono=0,turns=0;const clock=new Clock(),seen=new Set(),enemies=new Set();clock.reset(0);s.assessment.done=true;Core.startBattle(s,START);
 function practice(ms){for(let step=0;step<ms;step+=1000){mono+=1000;clock.sample({mono,wall:START+mono,category:'practice'});}for(const part of clock.confirm(mono))Core.recordTime(s,part.ms,part.category,part.end);}
 while(Core.parentProgress(s).totals.practice<300*60000&&turns<2400){
  if(s.activity==='mathIntro')Core.leaveMath(s,START+mono);
  if(s.activity==='summary'){Core.beginSession(s,START+mono);s.activity=s.result?'result':'battle';}
  if(s.activity==='result'){enemies.add(s.result.enemyId);Core.startBattle(s,START+mono,{strength:4,enemyId:Core.enemyChoices(s,4)[0].id});}
  const q=Core.prepareBattle(s,START+mono);if(!q)continue;
  seen.add(q.target);q.phase='choices';practice(10000);turns++;
  const choice=turns%29===0?'?':turns%11===0?q.options.find(x=>x!==q.target):q.target;
  Core.answerBattle(s,choice,START+mono);
  if(!q.correct){Core.startTeaching(s,q.target,'battle',START+mono);Core.leaveTeaching(s,START+mono);}
  Core.prepareBattle(s,START+mono);
  if(turns===100){
   // Five unattended minutes followed by another twenty minutes of device sleep.
   for(let i=0;i<300;i++){mono+=1000;clock.sample({mono,wall:START+mono,category:'practice'});}
   mono+=20*60000;clock.sample({mono,wall:START+mono,category:'practice',visible:false});
   Core.recordTime(s,clock.takeExcluded(),'idle',START+mono);clock.reset(mono);
   s=Core.migrate(JSON.parse(JSON.stringify(s)));
  }
 }
 const p=Core.parentProgress(s);assert.equal(p.totals.practice,18000000);assert.equal(p.activeMs,18000000);assert.ok(mono>=325*60000);assert.equal(seen.size,200);assert.ok(enemies.size>=5);assert.equal(s.story.completedChapters.length,7);assert.equal(s.story.clearedAreas.length,35);assert.equal(s.story.chapterComplete,true);assert.ok(s.dragon.xp>=300);assert.equal(s.dragon.stage,0);assert.ok(s.sessions.length>=40);assert.ok(s.sessions.every(x=>x.newWords.length<=6));
 // Continue after a full hour and chapter completion; XP and play remain available.
 Core.beginSession(s,START+mono);Core.startBattle(s,START+mono);const q=Core.prepareBattle(s,START+mono);q.phase='choices';const before=s.dragon.xp;Core.answerBattle(s,q.target,START+mono);assert.equal(s.dragon.xp,before+1);
 console.log('Five-hour simulation:',JSON.stringify({turns,words:seen.size,enemies:enemies.size,areas:s.story.clearedAreas.length,activeMinutes:p.activeMs/60000,wallMinutes:mono/60000,xp:s.dragon.xp,challenges:s.sessions.length}));
});
