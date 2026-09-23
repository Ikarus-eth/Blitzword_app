const test=require('node:test'),assert=require('node:assert/strict'),C=require('../game-core');
const NOW=Date.UTC(2026,8,23);
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;return s;}
function battle(s,win=true,demo=false){C.startBattle(s,NOW,{strength:3,demo});s.battle.enemyHealth=win?0:3;s.battle.heroHealth=win?3:0;C.resolveBattle(s,NOW);}
function cycle(s){for(let i=0;i<3;i++)battle(s);C.startMath(s,NOW);}
function finish(s,win=true){if(win)for(let i=0;i<s.math.round.target;i++){const q=C.prepareMath(s);C.answerMath(s,q.a*q.b,NOW);}C.tickMath(s,60000,NOW);}
function question(s){const q=C.prepareBattle(s,NOW);q.phase='choices';return q;}
test('three reading victories and a won number duel earn exactly one persistent shield',()=>{
 let s=fresh();battle(s);battle(s);assert.equal(s.rewards.shield,false);battle(s);assert.equal(s.math.round.shieldEligible,true);C.startMath(s,NOW);finish(s);
 assert.equal(s.math.round.shieldEarned,true);assert.equal(s.rewards.shield,true);assert.equal(s.rewards.readingWins,0);assert.equal(s.math.records[0].shieldEarned,true);
 s=C.migrate(C.copy(s));assert.equal(s.rewards.shield,true);assert.equal(C.finishMath(s,NOW),false);C.leaveMath(s,NOW);assert.equal(s.rewards.shield,true);
 cycle(s);finish(s);assert.equal(s.rewards.shield,true);assert.equal(s.math.round.shieldEarned,false);assert.equal(s.math.records.filter(r=>r.shieldEarned).length,1);
});
test('a shield absorbs one damaging reading mistake, without changing its learning evidence',()=>{
 let s=fresh();s.rewards.shield=true;C.startBattle(s,NOW);let q=question(s);const wrong=q.options.find(w=>w!==q.target);
 const rec=C.answerBattle(s,wrong,NOW);assert.equal(rec.correct,false);assert.equal(rec.supported,false);assert.equal(rec.shieldUsed,true);assert.equal(rec.healthChanged,false);assert.equal(s.battle.heroHealth,3);assert.equal(s.rewards.shield,false);assert.equal(s.learning.words[q.target].consecutiveMisses,1);
 assert.equal(C.answerBattle(s,wrong,NOW),null);s=C.migrate(C.copy(s));q=question(s);C.answerBattle(s,q.options.find(w=>w!==q.target),NOW);assert.equal(s.battle.heroHealth,2);
});
test('help, free demo mistakes, correct answers and teaching never consume the shield',()=>{
 const s=fresh();s.rewards.shield=true;C.startBattle(s,NOW);let q=question(s);C.answerBattle(s,'?',NOW);assert.equal(s.rewards.shield,true);assert.equal(s.battle.heroHealth,3);C.startTeaching(s,q.target,'battle',NOW);C.leaveTeaching(s,NOW);assert.equal(s.rewards.shield,true);
 q=question(s);C.answerBattle(s,q.target,NOW);assert.equal(s.rewards.shield,true);
 C.startBattle(s,NOW,{demo:true});q=question(s);C.answerBattle(s,q.target,NOW);q=question(s);C.answerBattle(s,q.options.find(w=>w!==q.target),NOW);assert.equal(s.battle.heroHealth,3);assert.equal(s.rewards.shield,true);
});
test('reading loss, math loss and skipped duels reset reward progress without granting shields',()=>{
 const s=fresh();battle(s);battle(s);battle(s,false);assert.equal(s.rewards.readingWins,0);assert.equal(s.rewards.shield,false);
 cycle(s);finish(s,false);assert.equal(s.rewards.shield,false);assert.equal(s.rewards.readingWins,0);C.leaveMath(s,NOW);
 for(let i=0;i<3;i++)battle(s);C.leaveMath(s,NOW);assert.equal(s.rewards.readingWins,0);assert.equal(s.rewards.shield,false);
 cycle(s);finish(s);assert.equal(s.rewards.shield,true);
});
test('losing a number duel does not consume an already held reading shield',()=>{
 const s=fresh();s.rewards.shield=true;cycle(s);finish(s,false);assert.equal(s.rewards.shield,true);assert.equal(s.math.round.shieldEarned,false);
});
test('old saves retain records and XP without retroactively receiving a shield',()=>{
 const old=fresh();delete old.rewards;old.math.winStreak=99;old.dragon.xp=314;old.math.records=[{score:9}];const s=C.migrate(old);assert.equal(s.rewards.shield,false);assert.equal(s.rewards.readingWins,0);assert.equal(s.dragon.xp,314);assert.deepEqual(s.math.records,old.math.records);
});
