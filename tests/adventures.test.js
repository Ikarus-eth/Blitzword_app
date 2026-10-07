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
  assert.equal(D.campaigns.length,2);assert.equal(D.missions.length,12);assert.equal(D.missions.flatMap(m=>m.riddles).length,48);assert.equal(D.legacyPuzzles.length,4);
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
test('losses rewind one encounter pair without erasing discoveries or earned clue evidence',()=>{
  const s=fresh();C.startMission(s,'first-spark',NOW);win(s);solve(s);C.startMissionBattle(s,NOW);const family=s.battle.enemyId;s.battle.heroHealth=0;C.resolveBattle(s,NOW);
  assert.equal(s.expedition.current.phase,'retry');assert.equal(A.stats(s).wins,1);assert.equal(A.stats(s).riddles['spark-bag'].first.correct,true);
  assert.equal(C.startMissionBattle(s,NOW),true);assert.equal(s.battle.enemyId,'thornling');assert.equal(s.expedition.current.step,0);
});
test('old sightings migrate conservatively and riddle time is bounded and separately recorded',()=>{
  const s=fresh();delete s.expedition;s.campaign.enemyHistory=[{enemyId:'thornling--3'}];A.init(s);assert.equal(s.expedition.book.thornling.seen,true);assert.equal(s.expedition.book.thornling.champion,false);
  C.startMission(s,'first-spark',NOW);win(s);A.startPuzzle(s);const xp=s.dragon.xp;A.recordRiddleTime(s,45000,NOW);A.recordRiddleTime(s,240000,NOW+240000);A.recordRiddleTime(s,NaN,NOW);assert.equal(A.report(s).riddleMs,180000);assert.equal(s.dragon.xp,xp);
});
function answer(s,{wrong=false,help=false}={}){
  const q=C.prepareBattle(s,NOW);q.phase='choices';q.supportReasons=[];
  return C.answerBattle(s,help?'?':wrong?q.options.find(w=>w!==q.target):q.target,NOW+1000);
}
test('quest hearts carry through clues, reload, backup, parked legacy play and the next fight',()=>{
  let s=fresh();C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);
  assert.equal(s.battle.heroHealth,4);answer(s,{wrong:true});assert.equal(s.battle.heroHealth,3);assert.equal(s.expedition.current.hearts,3);
  s.battle.enemyHealth=0;C.resolveBattle(s,NOW);solve(s);assert.equal(A.progress(s).done,2);
  A.switchTo(s,'legacy');s=Storage.readBackup(Storage.backupFile(s).text).state;
  C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.heroMaxHealth,4);
  s=C.migrate(JSON.parse(JSON.stringify(s)));assert.equal(s.expedition.current.hearts,3);
});
test('older active and parked mission saves keep existing hearts and selected friends',()=>{
  for(const parked of [false,true]){
    let s=fresh();C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);s.battle.heroHealth=5;s.battle.heroMaxHealth=6;
    delete s.expedition.current.hearts;delete s.expedition.current.maxHearts;delete s.expedition.current.companionHelpUsed;
    A.selectCompanion(s,'thornling');if(parked)A.switchTo(s,'legacy');s=C.migrate(JSON.parse(JSON.stringify(s)));
    assert.equal(s.expedition.current.hearts,5);assert.equal(s.expedition.current.maxHearts,6);assert.equal(A.companion(s),'thornling');
  }
});
test('a collected teammate blocks one unaided miss per quest without changing reading evidence or spending a shield',()=>{
  let s=fresh();C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);
  assert.equal(A.selectCompanion(s,'moon-moth'),false);assert.equal(A.selectCompanion(s,'fake'),false);assert.equal(A.selectCompanion(s,'thornling'),true);
  const xp=s.dragon.xp,enemy=s.battle.enemyHealth;s.rewards.shield=true;
  const helped=answer(s,{help:true});assert.equal(helped.supported,true);assert.equal(s.expedition.current.companionHelpUsed,false);
  const miss=answer(s,{wrong:true});assert.equal(miss.companionSaved,'thornling');assert.equal(miss.correct,false);assert.equal(miss.supported,false);assert.equal(miss.healthChanged,false);
  assert.equal(s.battle.heroHealth,4);assert.equal(s.battle.enemyHealth,enemy);assert.equal(s.dragon.xp,xp);assert.equal(s.rewards.shield,true);assert.equal(s.expedition.current.companionHelpUsed,true);
  const recordCount=s.campaign.battleRecords.length;assert.equal(C.answerBattle(s,s.battle.question.target,NOW),null);assert.equal(s.campaign.battleRecords.length,recordCount);
  s=Storage.readBackup(Storage.backupFile(s).text).state;assert.equal(s.expedition.current.companionHelpUsed,true);A.reveal(s,'moon-moth',NOW);A.selectCompanion(s,'moon-moth');
  const shield=answer(s,{wrong:true});assert.equal(shield.shieldUsed,true);assert.equal(shield.companionSaved,undefined);assert.equal(s.rewards.shield,false);
  answer(s,{wrong:true});assert.equal(s.battle.heroHealth,3);assert.equal(s.expedition.current.hearts,3);
  s.battle.heroHealth=0;C.resolveBattle(s,NOW);const family=s.battle.enemyId;C.startMissionBattle(s,NOW);
  assert.equal(s.battle.heroHealth,4);assert.equal(s.battle.enemyId,family);assert.equal(s.expedition.current.companionHelpUsed,true);
  answer(s,{wrong:true});assert.equal(s.battle.heroHealth,3);
  s.expedition.current.phase='complete';C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);
  assert.equal(answer(s,{wrong:true}).companionSaved,'moon-moth');assert.equal(s.battle.heroHealth,4);
});
test('collected teammate does not change Word trails health or consume quest protection there',()=>{
  const s=fresh();A.reveal(s,'moon-moth',NOW);A.selectCompanion(s,'moon-moth');C.startMission(s,'first-spark',NOW);A.switchTo(s,'legacy');C.startBattle(s,NOW,{strength:4});
  const health=s.battle.heroHealth;answer(s,{wrong:true});assert.equal(s.battle.heroHealth,health-1);assert.equal(s.expedition.current.companionHelpUsed,false);
});
test('progress counts each fight and clue exactly once, including retries and the final treasure',()=>{
  const s=fresh();C.startMission(s,'first-spark',NOW);
  for(let step=0;step<4;step++){
    assert.deepEqual(A.progress(s),{done:step*2,left:8-step*2,total:8,next:'Fight'});
    win(s);assert.equal(A.progress(s).done,step*2+1);assert.equal(A.progress(s).next,'Clue');A.startPuzzle(s);
    const q=D.puzzles[s.expedition.current.puzzle.id];for(const id of [q.answer].flat())A.choose(s,id);A.check(s,NOW);
    assert.equal(A.progress(s).done,step*2+2);A.next(s,NOW);assert.equal(A.progress(s).done,step*2+2);
  }
  assert.deepEqual(A.progress(s),{done:8,left:0,total:8,next:'Treasure'});
});
test('riddle defeat saves first evidence and restarts no earlier than the chapter start',()=>{
 let s=fresh();C.startMission(s,'first-spark',NOW);win(s);A.startPuzzle(s);let c=s.expedition.current;
 c.hearts=2;c.companionHelpUsed=true;
 A.choose(s,'red');assert.equal(A.check(s,NOW).heartLost,true);assert.equal(c.hearts,1);
 assert.equal(A.check(s,NOW+1),false);assert.equal(c.hearts,1);
 A.choose(s,'red');A.check(s,NOW+2);assert.equal(c.hearts,0);assert.equal(s.activity,'result');assert.equal(c.retryTargetStep,0);
 const first=JSON.stringify(A.stats(s).riddles['spark-bag'].first);s=Storage.readBackup(Storage.backupFile(s).text).state;c=s.expedition.current;
 assert.equal(c.hearts,0);assert.equal(A.choose(s,'blue'),false);assert.equal(A.check(s,NOW,{reveal:true}),false);
 assert.equal(C.startMissionBattle(s,NOW),true);assert.equal(c.hearts,4);assert.equal(c.companionHelpUsed,true);assert.equal(JSON.stringify(A.stats(s).riddles['spark-bag'].first),first);assert.equal(c.step,0);assert.equal(s.activity,'battle');
 assert.equal(A.retry(s),false);
});
test('fight and riddle defeats rewind exactly two tracker steps once, including reload and backup',()=>{
 for(const fromRiddle of [false,true])for(const step of [1,2,3]){
  let s=fresh();C.startMission(s,'first-spark',NOW);s.expedition.current.step=step;C.startMissionBattle(s,NOW);
  if(fromRiddle){s.battle.enemyHealth=0;C.resolveBattle(s,NOW);A.startPuzzle(s);s.expedition.current.hearts=1;const q=A.Data.puzzles[s.expedition.current.puzzle.id];s.expedition.current.puzzle.selection=q.type==='order'?[...q.answer].reverse():[q.options.find(o=>o.id!==q.answer).id];A.check(s,NOW);}
  else{s.battle.heroHealth=0;C.resolveBattle(s,NOW);}
  const from=step*2+(fromRiddle?1:0);assert.equal(s.expedition.current.retryTargetStep,from-2);
  s=Storage.readBackup(Storage.backupFile(s).text).state;C.startMissionBattle(s,NOW);
  assert.equal(A.progress(s).done,from-2);assert.equal(s.expedition.current.hearts,4);assert.equal(s.expedition.current.step,step-1);assert.equal(s.activity,fromRiddle?'mission':'battle');assert.equal(A.retry(s),false);
 }
});
test('mapmaker replacement keeps mission unlocks, old pending vault answers and earned progress',()=>{
 let s=fresh();for(const id of ['first-spark','moth-post','root-workshop'])A.stats(s,id).completedAt=new Date(NOW).toISOString();
 C.startMission(s,'mimic-vault',NOW);const m=A.current(s);assert.equal(m.name,'The Boy and the Map');assert.equal(m.scenes.length,4);
 win(s);A.startPuzzle(s);assert.equal(s.expedition.current.puzzle.id,'mapmaker-pen');
 const p=s.expedition.current.puzzle;p.id='vault-tool';p.order=['saw','brush','comb'];p.selection=['brush'];
 s=Storage.readBackup(Storage.backupFile(s).text).state;assert.equal(A.check(s,NOW).correct,true);assert.equal(A.stats(s).riddles['vault-tool'].first.selection[0],'brush');
 A.next(s,NOW);win(s);A.startPuzzle(s);assert.equal(s.expedition.current.puzzle.id,'mapmaker-path');
 assert.ok(A.stats(s,'moth-post').completedAt);assert.equal(A.unlocked(s,'oak-heart'),false);
});
