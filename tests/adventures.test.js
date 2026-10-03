const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../game-core'),A=C.Adventure,D=A.Data,Content=require('../content'),Storage=require('../storage');
const NOW=Date.UTC(2026,9,3,10);
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;return s;}
function win(s,now=NOW){
  assert.equal(C.startMissionBattle(s,now),true);s.battle.introPending=false;
  while(s.battle.enemyHealth>0){const q=C.prepareBattle(s,now);q.phase='choices';assert.equal(C.answerBattle(s,q.target,now+=8000).correct,true);}
  C.prepareBattle(s,now);assert.equal(s.result.victory,true);return now;
}
function solve(s,now=NOW){assert.equal(A.startPuzzle(s,()=>0.4),true);const q=D.puzzles[s.expedition.current.puzzle.id];for(const id of [q.answer].flat())A.choose(s,id);assert.equal(A.check(s,now).correct,true);A.next(s,now);}
test('two acyclic campaigns contain 48 unique solvable puzzles and all 20 creatures',()=>{
  assert.equal(D.campaigns.length,2);assert.equal(D.missions.length,12);assert.equal(Object.keys(D.puzzles).length,48);
  assert.deepEqual([...new Set(D.missions.flatMap(m=>m.families))].sort(),Content.enemies.map(e=>e.id).sort());
  const seen=new Set();for(const m of D.missions){assert.equal(m.riddles.length,4);for(const id of m.requires)assert.ok(seen.has(id));seen.add(m.id);
    assert.ok(Content.chapterBackgrounds[m.area]);
    assert.ok(fs.existsSync(path.join(__dirname,'..',m.art)),m.art);
    for(const q of m.riddles){assert.ok(q.options.length>=3);assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);for(const id of [q.answer].flat())assert.ok(q.options.some(o=>o.id===id));assert.ok(q.hint&&q.explanation&&q.reward);}
  }
  assert.equal(D.missions.reduce((n,m)=>n+m.health.reduce((a,b)=>a+b,0),0),468);
});
test('full playthrough unlocks both campaigns, awards every stamp and preserves legacy curriculum progress',()=>{
  let s=fresh(),now=NOW;const story=C.copy(s.story),wins=s.campaign.wins;
  assert.equal(A.unlocked(s,'reed-message'),false);assert.equal(C.startMission(s,'owl-watch',now),false);
  for(const m of D.missions){assert.equal(C.startMission(s,m.id,now),true);
    for(let step=0;step<4;step++){
      now=win(s,now);assert.equal(A.stats(s).wins,step+1);assert.equal(s.activity,'result');
      assert.deepEqual(s.story.scenes,story.scenes);solve(s,now+=45000);
      s=C.migrate(JSON.parse(JSON.stringify(s)));assert.equal(s.expedition.current.phase,step===3?'complete':'intro');
    }
    assert.ok(A.stats(s).completedAt);assert.equal(C.startMissionBattle(s,now),false);
  }
  assert.equal(A.campaignComplete(s,'river-song'),true);const report=A.report(s);
  assert.deepEqual([report.completed,report.seen,report.studied,report.champions,report.firsts,report.correct],[12,20,20,20,48,48]);
  assert.equal(s.campaign.wins,wins);assert.deepEqual(s.story.clearedAreas,story.clearedAreas);assert.equal(s.campaign.battleRecords.filter(r=>r.correct).length,468);assert.ok(s.dragon.xp>0);
});
test('legacy pending choices and mission choices survive switching, reopening and shared learning gains',()=>{
  let s=fresh();C.startBattle(s,NOW);C.prepareBattle(s,NOW);const legacy=C.copy(s.battle),session=C.copy(s.session);
  C.startMission(s,'first-spark',NOW);win(s);A.startPuzzle(s,()=>0.2);A.choose(s,'red');const p=C.copy(s.expedition.current.puzzle),xp=s.dragon.xp;
  A.switchTo(s,'legacy');assert.deepEqual(s.battle,legacy);assert.deepEqual(s.session,session);assert.equal(s.dragon.xp,xp);
  s=C.migrate(JSON.parse(JSON.stringify(s)));C.startMission(s,'first-spark',NOW);assert.deepEqual(s.expedition.current.puzzle,p);assert.equal(s.activity,'mission');assert.equal(s.battle.enemyHealth,0);
  assert.equal(C.startMission(s,'moth-post',NOW),false);assert.deepEqual(s.expedition.current.puzzle,p);
});
test('wrong answers, hints and worked solutions preserve first evidence; replay never replaces it',()=>{
  let s=fresh();C.startMission(s,'first-spark',NOW);win(s);A.startPuzzle(s);const p=s.expedition.current.puzzle;
  assert.equal(A.check(s,NOW,{reveal:true}),false);A.choose(s,'red');assert.equal(A.check(s,NOW).correct,false);p.hint=true;
  s=C.migrate(JSON.parse(JSON.stringify(s)));A.check(s,NOW+1000,{reveal:true});const r=A.stats(s).riddles['spark-bag'];
  assert.equal(r.first.correct,false);assert.equal(r.first.hint,false);assert.equal(r.last.hint,true);assert.equal(r.last.assisted,true);assert.equal(s.expedition.book.thornling.studied,true);
  assert.equal(A.check(s,NOW+2000),false);assert.equal(r.visits,1);A.next(s,NOW);assert.equal(s.expedition.current.step,1);
});
test('losses do not erase mission steps, discoveries or earned clues; retry uses the same encounter',()=>{
  const s=fresh();C.startMission(s,'first-spark',NOW);win(s);solve(s);C.startMissionBattle(s,NOW);const family=s.battle.enemyId;s.battle.heroHealth=0;C.resolveBattle(s,NOW);
  assert.equal(s.expedition.current.phase,'retry');assert.equal(A.stats(s).wins,1);assert.equal(A.stats(s).riddles['spark-bag'].first.correct,true);
  assert.equal(C.startMissionBattle(s,NOW),true);assert.equal(s.battle.enemyId,family);assert.equal(s.expedition.current.step,1);
});
test('old sightings migrate conservatively and riddle time is bounded and separately recorded',()=>{
  const s=fresh();delete s.expedition;s.campaign.enemyHistory=[{enemyId:'thornling--3'}];A.init(s);assert.equal(s.expedition.book.thornling.seen,true);assert.equal(s.expedition.book.thornling.champion,false);
  const xp=s.dragon.xp;A.recordRiddleTime(s,45000,NOW);A.recordRiddleTime(s,120001,NOW);A.recordRiddleTime(s,NaN,NOW);assert.equal(A.report(s).riddleMs,45000);assert.equal(s.dragon.xp,xp);
});
