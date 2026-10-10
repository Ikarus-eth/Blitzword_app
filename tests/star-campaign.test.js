const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Content=require('../content'),C=require('../game-core'),A=C.Adventure,D=A.Data,S=require('../storage'),Stars=require('../assets/adventures/star-trail/campaign'),Maps=require('../assets/adventures/star-trail/search');
const NOW=Date.UTC(2026,9,10),families=['snow-owl','frost-lynx','snow-hare','cloud-yak','pinecone-marmot','gale-falcon','lichen-ibex','aurora-elk'];
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;return s;}
function previous(s){for(const m of D.missions.slice(0,12))A.stats(s,m.id).completedAt=new Date(NOW).toISOString();}
test('third campaign opens only after both earlier adventures; branch joins cannot be skipped',()=>{
 const s=fresh();assert.equal(C.startMission(s,'star-post',NOW),false);
 for(const m of D.campaigns[1].missions)A.stats(s,m).completedAt=new Date(NOW).toISOString();
 assert.equal(A.unlocked(s,'star-post'),false,'a river-only imported record cannot skip the forest');previous(s);
 assert.equal(A.unlocked(s,'star-post'),true);assert.equal(A.unlocked(s,'cloud-lift'),false);
 A.stats(s,'star-post').completedAt=new Date(NOW).toISOString();assert.equal(A.unlocked(s,'crystal-pass'),true);assert.equal(A.unlocked(s,'snow-garden'),true);
 A.stats(s,'crystal-pass').completedAt=new Date(NOW).toISOString();assert.equal(A.unlocked(s,'cloud-lift'),false);
 A.stats(s,'snow-garden').completedAt=new Date(NOW).toISOString();assert.equal(A.unlocked(s,'cloud-lift'),true);
});
test('eight complete ninth-task chapters use exactly eight approved new families and unique clue identities',()=>{
 assert.equal(D.campaigns.length,3);assert.equal(Stars.missions.length,8);assert.deepEqual(Stars.missions.map(m=>m.families[0]),families);
 assert.equal(new Set(D.missions.flatMap(m=>m.riddles.map(q=>q.id))).size,80);
 assert.equal(new Set(Object.values(A.Maps).flatMap(m=>m.questions.map(q=>q.id))).size,39);
 for(const m of Stars.missions){assert.equal(m.riddles.length,4);assert.ok(A.findMission(m.families[0]));assert.equal(Maps[m.id].questions.length,3);
  const bytes=fs.readFileSync(m.art);assert.equal(bytes.readUInt32BE(16),Maps[m.id].width);assert.equal(bytes.readUInt32BE(20),Maps[m.id].height);
  for(const q of [...m.riddles,...Maps[m.id].questions]){assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);for(const id of [q.answer].flat())assert.ok(q.options.some(o=>o.id===id));}
 }
});
test('play all 72 tasks through reloads and backup, earn eight friends, preserve earlier progress',()=>{
 let s=fresh(),now=NOW;previous(s);const original=C.copy(s.expedition.missions),story=C.copy(s.story);s.dragon.xp=1234;
 let tasks=0;
 for(const m of Stars.missions){
  assert.equal(C.startMission(s,m.id,now),true);assert.equal(A.progress(s).total,9);
  for(let step=0;step<4;step++){
   assert.equal(C.startMissionBattle(s,now),true);assert.equal(Content.enemyAt(s.battle.enemyId).family,m.encounters[step]);s.battle.introPending=false;
   while(s.battle.enemyHealth>0){const q=C.prepareBattle(s,now);q.phase='choices';assert.equal(C.answerBattle(s,q.target,now+=8000).correct,true);}
   C.prepareBattle(s,now);assert.equal(s.result.victory,true);tasks++;
   assert.equal(A.startPuzzle(s,()=>.4),true);const q=D.puzzles[s.expedition.current.puzzle.id];for(const id of [q.answer].flat())A.choose(s,id);
   s=S.readBackup(S.backupFile(s).text).state;assert.equal(C.checkRiddle(s,now+=45000).correct,true);assert.equal(A.next(s,now),true);tasks++;
  }
  assert.equal(A.progress(s).done,8);assert.equal(s.expedition.current.phase,'search');
  for(let i=0;i<3;i++){const q=A.mapQuestion(s);assert.ok(A.chooseMap(s,q.answer,q.id));s=C.migrate(JSON.parse(JSON.stringify(s)));assert.ok(C.checkMap(s,now+=30000,q.id).correct);}
  tasks++;assert.equal(A.progress(s).done,9);assert.equal(s.expedition.current.phase,'complete');
  assert.deepEqual([s.expedition.book[m.families[0]].seen,s.expedition.book[m.families[0]].studied,s.expedition.book[m.families[0]].champion],[true,true,true]);assert.ok(A.selectCompanion(s,m.families[0]));
 }
 assert.equal(tasks,72);assert.ok(A.campaignComplete(s,'star-trail'));assert.deepEqual(s.story.clearedAreas,story.clearedAreas);
 for(const [id,record] of Object.entries(original))assert.deepEqual(s.expedition.missions[id],record);
 assert.ok(s.dragon.xp>1234);assert.equal(A.companion(S.readBackup(S.backupFile(s).text).state),'aurora-elk');
 assert.equal(C.startMission(s,'star-post',now),true);assert.equal(A.progress(s).total,9);
});
test('unfinished old quest, answer choices and evidence survive with the third campaign present',()=>{
 let s=fresh();C.startMission(s,'first-spark',NOW);C.startMissionBattle(s,NOW);s.battle.introPending=false;C.prepareBattle(s,NOW);
 const question=C.copy(s.battle.question),quest=C.copy(s.expedition.current),xp=s.dragon.xp;
 s=S.readBackup(S.backupFile(s).text).state;assert.deepEqual(s.battle.question,question);assert.deepEqual(s.expedition.current,quest);assert.equal(s.dragon.xp,xp);assert.equal(C.startMission(s,'star-post',NOW),false);
});
