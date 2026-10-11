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
test('two grants per quest survive defeat, retry and reload; legacy shields occupy the same slot',()=>{
 let s=fresh();s.rewards.shield=true;for(let i=0;i<8;i++)answer(s);assert.equal(s.expedition.current.supportEarned,undefined);s.rewards.shield=false;answer(s);A.selectSupport(s,'moss-golem');
 for(let cycle=0;cycle<2;cycle++){s.rewards.shield=false;s.rewards.supportFamily=null;s.battle.heroHealth=0;C.resolveBattle(s,NOW);s=C.migrate(C.copy(s));C.startMissionBattle(s,NOW);s.battle.introPending=false;s.battle.enemyHealth=100;for(let i=0;i<8;i++)answer(s);assert.equal(s.expedition.current.supportEarned,2);assert.equal(s.rewards.shield,cycle===0);}
});
test('changing the regular companion swaps an active support animal without consuming protection',()=>{const s=fresh();for(let i=0;i<8;i++)answer(s);A.selectSupport(s,'moss-golem');A.selectCompanion(s,'moss-golem');assert.equal(A.companion(s),'moss-golem');assert.equal(s.rewards.supportFamily,'moon-moth');assert.equal(s.rewards.shield,true);});
test('demo and legacy Word trails never grant quest support',()=>{for(const demo of [true,false]){const s=C.migrate(C.fresh());s.assessment.done=true;C.startBattle(s,NOW,{demo});s.battle.introPending=false;s.battle.enemyHealth=100;for(let i=0;i<8;i++)answer(s);assert.equal(s.rewards.shield,false);}});
