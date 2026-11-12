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
// 4 November 2026: up to two shields are held at once (the parent asked for a second shield).
// This replaces "a legacy shield occupies the slot": a held shield no longer stops the meter.
test('a held shield leaves room for one more; at most two held and two per attempt',()=>{
 let s=fresh();s.rewards.shield=true;assert.equal(A.heldShields(s),1);for(let i=0;i<8;i++)answer(s);
 assert.equal(s.expedition.current.supportEarned,1);assert.equal(A.heldShields(s),2);assert.equal(s.battle.question.secondShield,true);
 s=C.migrate(C.copy(s));assert.equal(A.heldShields(s),2,'two shields survive reload');assert.equal(s.rewards.shields,2);
 // Two held: another fight cannot grant a third.
 s.battle.supportMeter={accurate:0,quick:0,earned:false};for(let i=0;i<8;i++)answer(s);assert.equal(s.expedition.current.supportEarned,1);assert.equal(A.heldShields(s),2);
 // One used: the next fight may grant the second of this attempt, a further fight may not.
 A.setShields(s,1);s.battle.supportMeter={accurate:0,quick:0,earned:false};for(let i=0;i<8;i++)answer(s);assert.equal(s.expedition.current.supportEarned,2);assert.equal(A.heldShields(s),2);
 A.setShields(s,0);s.battle.supportMeter={accurate:0,quick:0,earned:false};for(let i=0;i<8;i++)answer(s);assert.equal(s.rewards.shield,false,'two per attempt');
});
test('two earned shields stop two hits one at a time and the friend leaves after the last',()=>{
 const s=fresh();s.expedition.current.companionHelpUsed=true;for(let i=0;i<8;i++)answer(s);A.selectSupport(s,'moss-golem');
 A.setShields(s,2);assert.equal(s.rewards.supportFamily,'moss-golem');const hp=s.battle.heroHealth;
 let r=answer(s,{correct:false});assert.equal(r.shieldUsed,true);assert.equal(r.supportSaved,'moss-golem');assert.equal(s.battle.question.shieldsLeft,1);
 assert.equal(A.heldShields(s),1);assert.equal(s.rewards.supportFamily,'moss-golem','friend stays while a shield is held');assert.equal(s.battle.heroHealth,hp);
 r=answer(s,{correct:false});assert.equal(r.shieldUsed,true);assert.equal(A.heldShields(s),0);assert.equal(s.rewards.supportFamily,null);assert.equal(s.rewards.earnedSupport,false);assert.equal(s.battle.heroHealth,hp);
 r=answer(s,{correct:false});assert.equal(r.shieldUsed,undefined);assert.equal(s.battle.heroHealth,hp-1);
});
test('older saves migrate: a held shield counts as one and bad counts are clamped',()=>{
 for(const [shield,shields,want] of [[true,undefined,1],[false,2,0],[true,7,2],[true,'x',1],[true,0,1]]){const s=C.fresh();s.rewards.shield=shield;if(shields===undefined)delete s.rewards.shields;else s.rewards.shields=shields;const m=C.migrate(s);assert.equal(C.heldShields(m),want);assert.equal(m.rewards.shields,want);assert.equal(m.rewards.shield,want>0);}
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
test('one guardian at a time: the second shield brings a second friend, who blocks first; then the first friend, then the companion',()=>{
 const s=fresh();A.reveal(s,'thornling',NOW);A.reveal(s,'bog-toad',NOW);
 A.setShields(s,1);Object.assign(s.rewards,{earnedSupport:true,supportFamily:'moss-golem',supportPending:false});
 assert.deepEqual(A.guardian(s),{family:'moss-golem',kind:'shield',shield:1});
 A.setShields(s,2);s.rewards.supportFamily2=A.secondFriend(s);const second=s.rewards.supportFamily2;
 assert.ok(second&&second!=='moss-golem'&&second!==A.companion(s),second);
 const foe=C.Content?.enemyAt?.(s.battle.enemyId)?.family;if(foe)assert.notEqual(second,foe);
 assert.equal(A.guardian(s).family,second);
 let r=answer(s,{correct:false});if(r.freeMistake)r=answer(s,{correct:false});assert.equal(r.supportSaved,second);assert.equal(A.heldShields(s),1);assert.equal(s.rewards.supportFamily2,null);assert.equal(A.guardian(s).family,'moss-golem');
 r=answer(s,{correct:false});assert.equal(r.supportSaved,'moss-golem');assert.equal(A.heldShields(s),0);
 const g=A.guardian(s);if(A.companion(s)&&!s.expedition.current.companionHelpUsed){assert.equal(g.kind,'companion');r=answer(s,{correct:false});assert.equal(r.companionSaved,A.companion(s));}
 // A save from before this change, holding two shields with one friend, gets a second friend.
 const old=C.migrate(C.fresh());old.assessment.done=true;for(const f of ['moon-moth','moss-golem','thornling'])A.reveal(old,f,NOW);A.selectCompanion(old,'moon-moth');A.setShields(old,2);Object.assign(old.rewards,{earnedSupport:true,supportFamily:'moss-golem'});delete old.rewards.supportFamily2;
 const loaded=C.migrate(C.copy(old));assert.equal(loaded.rewards.supportFamily2,'thornling');
});
test('creature art facing: right-facing paintings are listed so enemies look at the hero and guardians look at the enemy',()=>{
 const Content=require('../content');const ids=new Set(Content.creatures.map(c=>c.id));
 for(const id of ['ember-fox','shell-lobster','moss-bear','cloud-yak'])assert.equal(Content.artFacing(id),'right');
 for(const id of ['bog-toad','thornling','crystal-crab','ripple-salamander'])assert.equal(Content.artFacing(id),'left');
 for(const id of ['ember-fox','rowan-stag','moon-hare-knight'])assert.ok(ids.has(id));
});
