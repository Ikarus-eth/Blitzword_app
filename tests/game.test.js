const test=require('node:test');
const assert=require('node:assert/strict');
const Core=require('../game-core.js');
const Content=require('../content.js');
const {AdventureStore,KEY}=require('../storage.js');
const START=Date.UTC(2026,8,21,10);
function fresh(){return Core.migrate(Core.fresh());}
function campaign(now=START){const s=fresh();s.profile.name='Test reader';s.assessment.done=true;Core.startBattle(s,now);return s;}
function present(s,now=START){const q=Core.prepareBattle(s,now,()=>.4);if(q){q.phase='choices';q.responseMs=950;q.wordViewedMs=q.exposureMs||2000;}return q;}
function answer(s,correct=true,now=START){const q=present(s,now);return Core.answerBattle(s,correct?q.target:q.options.find(w=>w!==q.target),now);}
function finishHelp(s,now=START){const q=s.battle.question;if(q.needsTeaching){Core.startTeaching(s,q.target,'battle',now);Core.leaveTeaching(s,now+2000);}Core.prepareBattle(s,now+3000,()=>.4);}
function roundtrip(s){return Core.migrate(JSON.parse(JSON.stringify(s)));}
class MemoryStorage {
  constructor(){this.data=new Map();this.fail=false;}
  getItem(k){return this.data.get(k)??null;}
  setItem(k,v){if(this.fail)throw new Error('quota');this.data.set(k,String(v));}
}
test('migration preserves the entire legacy profile, observations and checkpoint',()=>{
  const old={profile:{name:'Saved reader',age:8,gender:'girl',heroClass:'Archer',heroIndex:5},assessment:{done:true,level:3,exposure:1200,records:[{target:'tree',correct:true,supported:false}]},learning:{supportedWords:['sat'],teaching:[{target:'sat',at:new Date(START).toISOString()}]},campaign:{wins:5,checkpointWins:4,enemyStrength:7,battleRecords:[{target:'sat',correct:false,supported:false,firstResponse:'set'}]},screen:'battle'};
  const s=Core.migrate(old);assert.deepEqual(s.profile,old.profile);assert.deepEqual(s.assessment.records,old.assessment.records);assert.deepEqual(s.campaign,old.campaign);assert.equal(s.learning.words.tree.familiar,true);assert.equal(s.assessment.done,true);assert.equal(s.battle,null);
});
test('an answer and health survive reload before the fight ends; duplicate delivery is ignored',()=>{
  let s=campaign();const q=present(s),options=[...q.options],id=q.id;const rec=Core.answerBattle(s,q.target,START);
  s=roundtrip(s);assert.equal(s.campaign.battleRecords.length,1);assert.equal(s.battle.enemyHealth,2);assert.equal(s.battle.question.id,id);assert.deepEqual(rec.alternatives,options);
  assert.equal(Core.answerBattle(s,q.target,START+1000),null);assert.equal(s.battle.enemyHealth,2);assert.equal(s.campaign.battleRecords.length,1);
});
test('reload preserves a masked question and its actual shuffled option order',()=>{
  let s=campaign(),q=present(s);q.responseMs=1500;const before=Core.copy(q);s=roundtrip(s);Core.interruptQuestion(s);
  assert.deepEqual(s.battle.question,before);assert.equal(Core.prepareBattle(s,START+30000).id,before.id);
});
test('interrupted exposure stays supported and does not change either health bar',()=>{
  let s=campaign(),q=present(s);q.phase='word';Core.interruptQuestion(s);s=roundtrip(s);q=s.battle.question;q.phase='choices';
  const r=Core.answerBattle(s,q.options.find(x=>x!==q.target),START);assert.equal(r.supported,true);assert.equal(r.timingValid,false);assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.enemyHealth,3);
});
test('the guided demonstration is supported and the first independent mistake is free',()=>{
  const s=fresh();Core.startTeaching(s,'sat','demo',START);Core.leaveTeaching(s,START+1000);
  let r=answer(s,true,START+2000);assert.equal(r.supported,true);assert.equal(s.battle.enemyHealth,5);
  r=answer(s,false,START+5000);assert.equal(r.supported,false);assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.question.freeMistake,true);
  finishHelp(s,START+5000);answer(s,false,START+9000);assert.equal(s.battle.heroHealth,2);
});
test('teaching persists and its word waits for two different intervening answers',()=>{
  let s=campaign();const target=present(s).target;answer(s,false);Core.startTeaching(s,target,'battle',START+1000);s=roundtrip(s);
  assert.equal(s.activity,'teaching');assert.equal(s.teaching.target,target);Core.leaveTeaching(s,START+2000);
  const first=present(s,START+3000).target;assert.notEqual(first,target);answer(s,true,START+3000);
  const second=present(s,START+7000).target;assert.notEqual(second,target);assert.notEqual(second,first);answer(s,true,START+7000);
  const q=present(s,START+120000);assert.equal(q.target,target);const r=Core.answerBattle(s,q.target,START+120000);
  assert.equal(r.supported,false);assert.equal(r.sinceHelpMs,118000);assert.equal(r.lastTeachingAt,new Date(START+2000).toISOString());
});
test('word order continues across battles instead of restarting the same three targets',()=>{
  const s=campaign();const seen=[];for(let battle=0;battle<5;battle++){
    if(battle)Core.startBattle(s,START+battle*30000);
    for(let turn=0;turn<3;turn++){const r=answer(s,true,START+battle*30000+turn*5000);seen.push(r.target);}
    Core.prepareBattle(s,START+battle*30000+16000);
  }
  assert.ok(new Set(seen).size>=5,seen.join(','));assert.ok(s.session.newWords.length<=6);assert.notDeepEqual(seen.slice(0,3),seen.slice(3,6));
});
test('defeat rolls back only unsecured wins; resolving twice cannot award twice',()=>{
  const s=campaign();s.campaign.wins=3;s.campaign.checkpointWins=2;const times=[0,5000,10000];
  for(const delta of times){answer(s,false,START+delta);finishHelp(s,START+delta);}
  assert.equal(s.activity,'result');assert.equal(s.campaign.wins,2);assert.equal(s.campaign.battleRecords.length,3);assert.equal(s.learning.teaching.length,3);
  Core.resolveBattle(s,START+20000);assert.equal(s.campaign.battleRecords.length,3);assert.equal(s.campaign.wins,2);
});
test('two victories secure a checkpoint; revisiting the result does not count another win',()=>{
  const s=campaign();for(let battle=0;battle<2;battle++){if(battle)Core.startBattle(s,START+20000);for(let turn=0;turn<3;turn++)answer(s,true,START+battle*20000+turn*4000);Core.prepareBattle(s,START+battle*20000+13000);}
  assert.equal(s.campaign.checkpointWins,2);Core.resolveBattle(s,START+40000);assert.equal(s.campaign.wins,2);
});
test('seven minutes stops after feedback without discarding an unfinished fight',()=>{
  let s=campaign();const q=present(s);Core.addActiveTime(s,Core.TARGET_MS);assert.equal(s.activity,'battle');
  Core.answerBattle(s,q.target,START+Core.TARGET_MS);Core.prepareBattle(s,START+Core.TARGET_MS+1000);assert.equal(s.activity,'summary');assert.equal(s.battle.enemyHealth,2);assert.equal(s.sessions.length,1);
  s=roundtrip(s);Core.beginSession(s,START+Core.TARGET_MS+10000);s.activity='battle';Core.prepareBattle(s,START+Core.TARGET_MS+10000);
  assert.equal(s.battle.enemyHealth,2);assert.equal(s.session.elapsedMs,0);assert.equal(s.campaign.battleRecords.length,1);assert.notEqual(s.battle.question.id,q.id);
});
test('ending at a victory preserves the result and checkpoint before the summary',()=>{
  const s=campaign();answer(s,true);answer(s,true,START+4000);const q=present(s,START+8000);Core.addActiveTime(s,Core.TARGET_MS);Core.answerBattle(s,q.target,START+9000);Core.prepareBattle(s,START+10000);
  assert.equal(s.activity,'summary');assert.equal(s.result.victory,true);assert.equal(s.campaign.wins,1);assert.equal(s.session.victories,1);
});
test('only active campaign activities contribute to the challenge clock',()=>{
  const s=campaign();Core.addActiveTime(s,1000);s.activity='route';Core.addActiveTime(s,100000);s.activity='assessment';Core.addActiveTime(s,100000);assert.equal(s.session.elapsedMs,1000);
  s.activity='teaching';Core.addActiveTime(s,1000);assert.equal(s.session.elapsedMs,2000);Core.completeSession(s,START);Core.addActiveTime(s,100000);assert.equal(s.session.elapsedMs,2000);
});
test('same-day repeated success cannot advance long-gap retention stages',()=>{
  const s=campaign();const q=present(s),w=s.learning.words[q.target];w.practiceSuccesses=2;w.reviewStage=0;w.dueAt=START+Core.DAY;
  Core.answerBattle(s,q.target,START);assert.equal(w.reviewStage,0);assert.equal(w.dueAt,START+Core.DAY);
});
test('a due independent check advances the gap and a miss shortens it without losing wins',()=>{
  const s=campaign();let q=present(s),w=s.learning.words[q.target];w.practiceSuccesses=2;w.reviewStage=1;w.dueAt=START-1;s.campaign.wins=4;s.campaign.checkpointWins=4;
  Core.answerBattle(s,q.target,START);assert.equal(w.reviewStage,2);assert.equal(w.dueAt,START+7*Core.DAY);
  q=present(s,START+1000);w=s.learning.words[q.target];w.reviewStage=3;w.practiceSuccesses=3;Core.answerBattle(s,q.options.find(x=>x!==q.target),START+1000);
  assert.equal(w.reviewStage,2);assert.equal(w.practiceSuccesses,0);assert.equal(s.campaign.wins,4);
});
test('assessment saves partial answers and resumes the same level, exposure and next question',()=>{
  let s=fresh();Core.startAssessment(s,START);
  for(let i=0;i<5;i++){const q=Core.prepareAssessment(s,START+i*4000,()=>.2);q.phase='choices';q.responseMs=900;Core.answerAssessment(s,q.target,START+i*4000);}
  Core.prepareAssessment(s,START+21000,()=>.2);const before=Core.copy(s.assessment.progress);s=roundtrip(s);assert.deepEqual(s.assessment.progress,before);
  assert.equal(Core.startAssessment(s,START+100000),true);assert.equal(s.assessment.progress.records.length,5);
});
test('assessment stops at eight independent misses and never runs again once completed',()=>{
  const s=fresh();Core.startAssessment(s,START);
  for(let i=0;i<8;i++){const q=Core.prepareAssessment(s,START+i*4000,()=>.2);q.phase='choices';Core.answerAssessment(s,'?',START+i*4000);}
  Core.prepareAssessment(s,START+40000);assert.equal(s.assessment.done,true);assert.equal(s.assessment.records.length,8);assert.equal(s.activity,'battle');assert.equal(Core.startAssessment(s,START+100000),false);
});
test('strong assessment route preserves the original twenty-item finish',()=>{
  const s=fresh();Core.startAssessment(s,START);let count=0;
  while(!s.assessment.done&&count<26){const q=Core.prepareAssessment(s,START+count*4000,()=>.2);if(!q)break;q.phase='choices';q.responseMs=900;Core.answerAssessment(s,q.target,START+count*4000);count++;}
  assert.equal(s.assessment.done,true);assert.equal(count,20);assert.ok(s.assessment.level>=3);
});
test('storage retains a frozen v1 backup and persists every accepted observation',()=>{
  const mem=new MemoryStorage(),legacy=Core.fresh();delete legacy.schemaVersion;mem.setItem(KEY,JSON.stringify(legacy));
  const store=new AdventureStore(mem),s=store.load();Core.startBattle(s,START);answer(s,true);store.save(s);
  assert.equal(JSON.parse(mem.getItem(KEY)).campaign.battleRecords.length,1);assert.equal(JSON.parse(mem.getItem(KEY+'_legacy_backup')).schemaVersion,undefined);
  const frozen=mem.getItem(KEY+'_legacy_backup');answer(s,true,START+4000);store.save(s);assert.equal(mem.getItem(KEY+'_legacy_backup'),frozen);
});
test('a failed save does not destroy the last good save and can be retried without another answer',()=>{
  const mem=new MemoryStorage(),store=new AdventureStore(mem),s=store.load();Core.startBattle(s,START);store.save(s);const before=mem.getItem(KEY);
  answer(s,true);mem.fail=true;assert.throws(()=>store.save(s),e=>e.code==='storage');assert.equal(mem.getItem(KEY),before);mem.fail=false;store.save(s);
  assert.equal(new AdventureStore(mem).load().campaign.battleRecords.length,1);
});
test('unreadable saves are preserved; a good backup can recover the previous write',()=>{
  const mem=new MemoryStorage();mem.setItem(KEY,'broken');assert.throws(()=>new AdventureStore(mem).load(),e=>e.code==='corrupt');assert.equal(mem.getItem(KEY),'broken');
  const good=campaign();answer(good,true);mem.setItem(KEY+'_backup',JSON.stringify(good));const store=new AdventureStore(mem),s=store.load();assert.equal(s.battle.enemyHealth,2);store.save(s);assert.equal(mem.getItem(KEY+'_unreadable_backup'),'broken');
});
test('a stale tab cannot overwrite another tab’s saved answers',()=>{
  const mem=new MemoryStorage(),first=new AdventureStore(mem),second=new AdventureStore(mem),s1=first.load(),s2=second.load();first.save(s1);
  assert.throws(()=>second.save(s2),e=>e.code==='conflict');assert.equal(JSON.parse(mem.getItem(KEY)).revision,1);
});
test('every practice target has four distinct choices, a reviewed illustration and its sentence',()=>{
  const fs=require('node:fs'),path=require('node:path');
  for(const item of Content.words){assert.equal(new Set(item.d).size,4);assert.ok(item.d.includes(item.w));assert.match(item.sentence,new RegExp('\\b'+item.w+'\\b','i'));assert.ok(fs.statSync(path.join(__dirname,'../assets/teaching',item.image+(item.crop?'.png':'.webp'))).size>1000);}
});


test('demo win, defeat and repeated help each finish once and survive handoff reload',()=>{
  for(const route of ['win','lose','help']){
    let s=fresh();Core.startBattle(s,START,{demo:true});let count=0;
    while(s.activity==='battle'&&count<10){
      const q=present(s,START+count*5000);if(!q)break;
      Core.answerBattle(s,route==='win'?q.target:route==='help'?'?':q.options.find(x=>x!==q.target),START+count*5000);
      if(!s.battle.question.correct){Core.startTeaching(s,q.target,'battle',START+count*5000+500);Core.leaveTeaching(s,START+count*5000+1000);}
      Core.prepareBattle(s,START+count*5000+2000);count++;
    }
    assert.equal(s.activity,'handoff',route);assert.ok(count<=7);assert.equal(s.demoComplete,true);
    assert.equal(s.campaign.wins,0);assert.equal(s.assessment.progress,null);
    const records=s.campaign.battleRecords.length;s=roundtrip(s);
    assert.equal(Core.leaveHandoff(s,START+60000),true);assert.equal(s.activity,'assessment');
    assert.equal(Core.leaveHandoff(s,START+61000),false);assert.equal(s.campaign.battleRecords.length,records);
    Core.prepareAssessment(s,START+62000);assert.ok(s.assessment.progress.question);
  }
});
test('battle question-mark help opens support without damage or independent credit',()=>{
  const s=campaign(),q=present(s),r=Core.answerBattle(s,'?',START);
  assert.equal(r.firstResponse,'?');assert.equal(r.supported,true);assert.equal(r.correct,false);
  assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.enemyHealth,3);assert.equal(s.session.independent,0);
  Core.startTeaching(s,q.target,'battle',START+1000);Core.leaveTeaching(s,START+2000);
  assert.notEqual(present(s,START+3000).target,q.target);
});

test('campaign offers different enemy types after wins and preserves the selected portrait on reload',()=>{
  let s=campaign(),previous=s.battle.enemyId;
  const encountered=new Set([previous]);
  for(let i=0;i<12;i++){
    s.battle.enemyHealth=0;Core.resolveBattle(s,START+i*10000);
    const options=Core.enemyChoices(s);assert.ok(options.length>=2);assert.ok(options.every(enemy=>enemy.id!==previous));
    const chosen=options[i%2].id;
    Core.startBattle(s,START+i*10000+1000,{enemyId:chosen,strength:3+i});
    assert.equal(s.battle.enemyId,chosen);assert.notEqual(s.battle.enemyId,previous);
    s=roundtrip(s);assert.equal(s.battle.enemyId,chosen);assert.equal(s.battle.maxHealth,3+i);previous=chosen;encountered.add(chosen);
  }
  assert.equal(encountered.size,5);
});
test('stronger choices visibly grow while health and reading exposure remain separate',()=>{
  const s=campaign();const exposure=s.assessment.exposure;
  for(let health=4;health<=20;health++)assert.ok(Core.enemyScale(health)>Core.enemyScale(health-1));
  Core.startBattle(s,START,{strength:12});assert.equal(s.battle.maxHealth,12);assert.equal(s.assessment.exposure,exposure);
});
test('new practice uses the reviewed Core 200 slice while legacy sat questions and evidence survive',()=>{
  const s=campaign();assert.ok(Content.words.some(item=>item.w==='on'));assert.ok(!Content.words.some(item=>item.w==='sat'));assert.ok(!Content.demoWords.includes('sat'));
  const q=present(s);q.target='sat';q.options=['sat','set','sap','sad'];s.learning.words.sat.independentCorrect=4;
  const saved=roundtrip(s);assert.equal(saved.battle.question.target,'sat');assert.equal(saved.learning.words.sat.independentCorrect,4);
  Core.answerBattle(saved,'set',START);Core.startTeaching(saved,'sat','battle',START);Core.leaveTeaching(saved,START+1000);
  assert.notEqual(Core.prepareBattle(saved,START+2000).target,'sat');assert.equal(saved.campaign.battleRecords.at(-1).target,'sat');
});
test('chapter words measure introduction, never mastery, and survive defeat',()=>{
  const s=campaign();present(s);const before=Core.chapterProgress(s);assert.equal(before.found,1);assert.equal(before.goal,30);
  s.battle.heroHealth=0;Core.resolveBattle(s,START);assert.equal(Core.chapterProgress(s).found,before.found);
  assert.equal(s.learning.words.on.independentCorrect,0);
});
