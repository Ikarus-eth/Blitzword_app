const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core');
const NOW=Date.UTC(2026,8,22);
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;return s;}
function battle(s,win=true,demo=false){C.startBattle(s,NOW,{strength:3,enemyId:'thornling',demo});s.battle.enemyHealth=win?0:3;s.battle.heroHealth=win?3:0;C.resolveBattle(s,NOW);}
function challenge(best=null){const s=fresh();s.math.best=best;for(let i=0;i<3;i++)battle(s);C.startMath(s,NOW);return s;}
test('every third consecutive campaign victory revives exactly the defeated enemy',()=>{
 const s=fresh();for(let win=1;win<=6;win++){
  battle(s);assert.equal(s.math.winStreak,win);assert.equal(s.activity,win%3===0?'mathIntro':'result');
  if(win%3===0){assert.equal(s.math.round.enemyId,s.battle.enemyId);const id=s.math.round.id;C.resolveBattle(s,NOW);assert.equal(s.math.round.id,id);assert.equal(s.math.winStreak,win);C.leaveMath(s,NOW);}
 }
});
test('loss resets streak and demo neither triggers nor counts towards it',()=>{
 const s=fresh();battle(s);battle(s);battle(s,false);assert.equal(s.math.winStreak,0);assert.equal(s.math.round,null);
 battle(s,true,true);assert.equal(s.math.winStreak,0);assert.equal(s.math.round,null);battle(s);battle(s);assert.equal(s.activity,'result');battle(s);assert.equal(s.activity,'mathIntro');
});
test('target is frozen at previous PR minus two, with a minimum of one',()=>{
 for(const [best,target] of [[null,1],[0,1],[2,1],[3,1],[19,17]]){const s=challenge(best);assert.equal(s.math.round.target,target);assert.equal(s.math.round.bestAtStart,best);s.math.best=99;assert.equal(s.math.round.target,target);}
});
test('all 100 multiplication facts are available, with no consecutive equivalent facts',()=>{
 const s=challenge(),seen=new Set();let recent=[];
 for(let i=0;i<100;i++){const q=C.prepareMath(s);assert.ok(q.a>=1&&q.a<=10&&q.b>=1&&q.b<=10);seen.add(q.a+'x'+q.b);const signature=[Math.min(q.a,q.b),Math.max(q.a,q.b)].join('x');if(i<95)assert.ok(!recent.includes(signature));recent=[...recent,signature].slice(-2);C.answerMath(s,q.a*q.b,NOW);}
 assert.equal(seen.size,100);
});
test('correct answers earn XP once; invalid answers are ignored and reading evidence is untouched',()=>{
 const s=challenge(),before=JSON.stringify(s.learning),wins=s.campaign.wins,q=s.math.round.question;
 assert.equal(C.answerMath(s,'bad',NOW),null);C.answerMath(s,q.a*q.b,NOW);assert.equal(C.answerMath(s,q.a*q.b,NOW),null);assert.equal(s.dragon.xp,1);
 C.prepareMath(s);C.answerMath(s,'0',NOW);assert.equal(s.math.round.correct,1);assert.equal(s.dragon.xp,1);assert.equal(JSON.stringify(s.learning),before);assert.equal(s.campaign.wins,wins);
});
test('60-second boundary finishes once, rejects late answers and updates PR only upwards',()=>{
 const s=challenge(5);for(let i=0;i<4;i++){const q=C.prepareMath(s);C.answerMath(s,q.a*q.b,NOW);}
 assert.equal(C.finishMath(s,NOW),false);assert.equal(C.tickMath(s,59999,NOW),false);assert.equal(C.tickMath(s,1,NOW+60000),true);assert.equal(s.activity,'mathResult');assert.equal(s.math.best,5);assert.equal(s.math.round.beaten,true);assert.equal(s.math.round.newBest,false);
 assert.equal(C.tickMath(s,1000,NOW),false);assert.equal(C.finishMath(s,NOW),false);assert.equal(C.answerMath(s,1,NOW),null);assert.equal(s.math.records.length,1);
 const first=challenge();C.tickMath(first,60000,NOW);assert.equal(first.math.best,0);assert.equal(first.math.round.beaten,false);assert.equal(first.math.records[0].elapsedMs,60000);
});
test('saved countdown, typed digits, problem, target and XP survive reload',()=>{
 let s=challenge(12);s.math.round.question.input='10';C.tickMath(s,12345,NOW);const before=JSON.stringify(s.math.round);s=C.migrate(JSON.parse(JSON.stringify(s)));assert.equal(JSON.stringify(s.math.round),before);assert.equal(C.startMath(s,NOW),false);assert.equal(C.leaveMath(s,NOW),false);
});
test('math timing has its own parent total and counts once towards growth and session',()=>{
 const s=challenge();C.recordTime(s,10000,'math',NOW);const p=C.parentProgress(s,NOW);assert.equal(p.totals.math,10000);assert.equal(p.totals.practice,0);assert.equal(p.activeMs,10000);assert.equal(C.dragonProgress(s,NOW).activeMs,10000);assert.equal(s.session.elapsedMs,10000);
});
test('pending multiplication ends on the XP result without losing the reading victory at the session boundary',()=>{
 const s=fresh();battle(s);battle(s);C.recordTime(s,C.TARGET_MS,'practice',NOW);battle(s);assert.equal(s.activity,'mathIntro');assert.equal(s.result.victory,true);const reward=C.copy(s.result);C.leaveMath(s,NOW);assert.equal(s.activity,'result');assert.deepEqual(s.result,reward);assert.ok(s.session.completedAt);assert.equal(s.math.round,null);
});
test('wrong answers remove one point, including below zero, exactly once; permanent XP survives',()=>{
 let s=challenge();const q=s.math.round.question;C.answerMath(s,0,NOW);
 assert.equal(C.mathScore(s.math.round),-1);assert.equal(s.math.round.wrong,1);assert.equal(s.math.round.answers.at(-1).points,-1);
 assert.equal(C.answerMath(s,0,NOW),null);assert.equal(C.mathScore(s.math.round),-1);
 s=C.migrate(C.copy(s));assert.equal(C.mathScore(s.math.round),-1);
 const next=C.prepareMath(s);C.answerMath(s,next.a*next.b,NOW);assert.equal(C.mathScore(s.math.round),0);assert.equal(s.math.round.correct,1);assert.equal(s.dragon.xp,1);
 C.prepareMath(s);C.answerMath(s,0,NOW);assert.equal(s.dragon.xp,1);C.tickMath(s,60000,NOW);assert.equal(s.math.best,-1);assert.equal(s.math.records[0].score,-1);assert.equal(s.math.round.beaten,false);
});
test('target and PR use net score; a saved legacy round keeps its scoring and records',()=>{
 const s=challenge(4);for(let i=0;i<5;i++){const q=C.prepareMath(s);C.answerMath(s,q.a*q.b,NOW);}for(let i=0;i<4;i++){C.prepareMath(s);C.answerMath(s,0,NOW);}
 C.tickMath(s,60000,NOW);assert.equal(s.math.round.correct,5);assert.equal(s.math.records[0].score,1);assert.equal(s.math.best,4);assert.equal(s.math.round.beaten,false);
 let legacy=challenge(12);delete legacy.math.round.scoringVersion;delete legacy.math.round.score;delete legacy.math.round.wrong;legacy.math.round.correct=3;
 legacy=C.migrate(C.copy(legacy));C.answerMath(legacy,0,NOW);assert.equal(C.mathScore(legacy.math.round),3);C.tickMath(legacy,60000,NOW);assert.equal(legacy.math.records[0].scoringVersion,1);assert.equal(legacy.math.best,12);
});
