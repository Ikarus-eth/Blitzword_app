const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),A=C.Adventure,NOW=Date.UTC(2026,9,11);
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;C.startMission(s,'first-spark',NOW);A.reveal(s,'moon-moth',NOW);A.reveal(s,'moss-golem',NOW);A.selectCompanion(s,'moon-moth');C.startMissionBattle(s,NOW);s.battle.introPending=false;s.battle.enemyHealth=100;s.battle.maxHealth=100;return s;}
function answer(s,{correct=true,quick=false,help=false}={}){C.prepareBattle(s,NOW);const q=s.battle.question;q.phase='choices';q.supportReasons=help?['replay']:[];q.exposureMs=quick?800:1500;q.wordViewedMs=q.exposureMs;q.responseMs=quick?900:2000;const result=C.answerBattle(s,correct?q.target:q.options.find(w=>w!==q.target),NOW);return result;}
test('eight accurate answers earn one saved shield and duplicate answer cannot grant twice',()=>{
 let s=fresh();for(let i=0;i<7;i++)answer(s);assert.equal(s.rewards.shield,false);s=C.migrate(C.copy(s));const r=answer(s);assert.equal(r.supportEarned,true);assert.equal(s.rewards.supportPending,true);assert.equal(s.expedition.current.supportEarned,1);assert.equal(C.answerBattle(s,s.battle.question.target,NOW),null);assert.equal(s.expedition.current.supportEarned,1);
 assert.equal(A.selectSupport(s,'moon-moth'),false);assert.equal(A.selectSupport(s,'moss-golem'),true);s=C.migrate(C.copy(s));assert.equal(s.rewards.supportFamily,'moss-golem');assert.equal(s.rewards.supportPending,false);
});
test('six quick accurate answers earn earlier; help pauses; wrong resets both streaks',()=>{
 let s=fresh();for(let i=0;i<3;i++)answer(s,{quick:true});answer(s,{help:true});assert.deepEqual(s.battle.supportMeter,{accurate:3,quick:3,earned:false});for(let i=0;i<3;i++)answer(s,{quick:true});assert.equal(s.rewards.shield,true);
 s=fresh();for(let i=0;i<5;i++)answer(s,{quick:true});answer(s,{correct:false});assert.equal(s.battle.supportMeter.accurate,0);assert.equal(s.battle.supportMeter.quick,0);for(let i=0;i<5;i++)answer(s,{quick:true});assert.equal(s.rewards.shield,false);answer(s,{quick:true});assert.equal(s.rewards.shield,true);
});
test('support leaves on a blocked hit, records a miss, and never repeats within the same fight',()=>{
 const s=fresh();s.expedition.current.companionHelpUsed=true;for(let i=0;i<8;i++)answer(s);A.selectSupport(s,'moss-golem');const hp=s.battle.heroHealth,xp=s.dragon.xp,r=answer(s,{correct:false});assert.equal(r.correct,false);assert.equal(r.supportSaved,'moss-golem');assert.equal(r.xpEarned,0);assert.equal(s.dragon.xp,xp);assert.equal(s.battle.heroHealth,hp);assert.equal(s.rewards.shield,false);assert.equal(s.rewards.supportFamily,null);for(let i=0;i<8;i++)answer(s);assert.equal(s.rewards.shield,false);
});
test('a legacy shield occupies the slot; within one attempt a quest grants at most two',()=>{
 let s=fresh();s.rewards.shield=true;for(let i=0;i<8;i++)answer(s);assert.equal(s.expedition.current.supportEarned,undefined);s.rewards.shield=false;answer(s);assert.equal(s.expedition.current.supportEarned,1);
 // A second fight in the same attempt may grant the second shield; a third grant in that attempt is refused.
 s.rewards.shield=false;s.battle.supportMeter={accurate:0,quick:0,earned:false};for(let i=0;i<8;i++)answer(s);assert.equal(s.expedition.current.supportEarned,2);
 s.rewards.shield=false;s.battle.supportMeter={accurate:0,quick:0,earned:false};for(let i=0;i<8;i++)answer(s);assert.equal(s.rewards.shield,false,'two per attempt');
});
test('after losing, every retry can earn shields again, and five accurate answers (or four quick) are enough',()=>{
 // He earned both shields in the first attempt and lost: before 28 October 2026 no retry could earn another.
 let s=fresh();s.expedition.current.supportEarned=2;
 for(let attempt=1;attempt<=3;attempt++){
  s.rewards.shield=false;s.rewards.supportFamily=null;s.battle.heroHealth=0;C.resolveBattle(s,NOW);assert.equal(s.expedition.current.defeats,attempt);
  s=C.migrate(C.copy(s));C.startMissionBattle(s,NOW);s.battle.introPending=false;s.battle.enemyHealth=100;
  assert.equal(s.expedition.current.supportEarned,0,'a new attempt restores the allowance');assert.deepEqual(C.Adventure.supportNeed(s),{accurate:5,quick:4});
  for(let i=0;i<4;i++)answer(s);assert.equal(s.rewards.shield,false);answer(s);assert.equal(s.rewards.shield,true,'attempt '+attempt);assert.equal(s.expedition.current.supportEarned,1);
 }
 s=fresh();s.battle.heroHealth=0;C.resolveBattle(s,NOW);C.startMissionBattle(s,NOW);s.battle.introPending=false;s.battle.enemyHealth=100;
 for(let i=0;i<3;i++)answer(s,{quick:true});assert.equal(s.rewards.shield,false);answer(s,{quick:true});assert.equal(s.rewards.shield,true,'four quick answers after a defeat');
 // Misses still reset the run, and a fresh quest uses the normal bar.
 s=fresh();assert.deepEqual(C.Adventure.supportNeed(s),{accurate:8,quick:6});s.battle.heroHealth=0;C.resolveBattle(s,NOW);C.startMissionBattle(s,NOW);s.battle.introPending=false;s.battle.enemyHealth=100;
 for(let i=0;i<4;i++)answer(s);answer(s,{correct:false});for(let i=0;i<4;i++)answer(s);assert.equal(s.rewards.shield,false);
});
test('changing the regular companion swaps an active support animal without consuming protection',()=>{const s=fresh();for(let i=0;i<8;i++)answer(s);A.selectSupport(s,'moss-golem');A.selectCompanion(s,'moss-golem');assert.equal(A.companion(s),'moss-golem');assert.equal(s.rewards.supportFamily,'moon-moth');assert.equal(s.rewards.shield,true);});
test('demo and legacy Word trails never grant quest support',()=>{for(const demo of [true,false]){const s=C.migrate(C.fresh());s.assessment.done=true;C.startBattle(s,NOW,{demo});s.battle.introPending=false;s.battle.enemyHealth=100;for(let i=0;i<8;i++)answer(s);assert.equal(s.rewards.shield,false);}});
