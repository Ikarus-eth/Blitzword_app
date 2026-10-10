const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../game-core'),A=C.Adventure,S=require('../storage'),NOW=Date.UTC(2026,9,10);
function ready(id='crab-ferry'){
 const s=C.migrate(C.fresh());s.assessment.done=true;
 for(const m of A.Data.missions)if(m.id!==id)A.stats(s,m.id).completedAt=new Date(NOW).toISOString();
 assert.ok(C.startMission(s,id,NOW));const c=s.expedition.current;c.step=3;c.phase='puzzle';c.puzzle={id:A.current(s).riddles[3].id,solved:true};assert.ok(A.next(s,NOW));return s;
}
function solve(s){const q=A.mapQuestion(s);assert.ok(A.chooseMap(s,q.answer,q.id));return C.checkMap(s,NOW,q.id);}
test('exactly five river quests add a ninth step with three questions and native composite maps',()=>{
 assert.deepEqual(Object.keys(A.Maps),['crab-ferry','stone-dam','mist-lamps','high-nest','river-heart']);
 for(const map of Object.values(A.Maps)){assert.equal(map.questions.length,3);assert.ok(fs.existsSync(map.image));assert.deepEqual([map.width,map.height],[3072,2048]);const s=ready(map.id);assert.deepEqual(A.progress(s),{done:8,left:1,total:9,next:'Map search'});for(let i=0;i<3;i++){assert.equal(s.expedition.current.search.index,i);assert.ok(solve(s).correct);}assert.equal(s.expedition.current.phase,'complete');assert.equal(A.progress(s).done,9);assert.ok(A.stats(s).completedAt);assert.equal(A.next(s,NOW),false);}
});
test('wrong submission costs exactly one life; duplicate and stale submissions are rejected',()=>{
 const s=ready(),q=A.mapQuestion(s);assert.equal(C.checkMap(s,NOW,q.id),false);assert.equal(A.chooseMap(s,'unknown',q.id),false);assert.ok(A.chooseMap(s,q.options.find(o=>o.id!==q.answer).id,q.id));assert.equal(C.checkMap(s,NOW,q.id).correct,false);assert.equal(s.expedition.current.hearts,3);assert.equal(C.checkMap(s,NOW,q.id),false);assert.equal(s.expedition.current.hearts,3);solve(s);assert.equal(A.chooseMap(s,q.answer,q.id),false);assert.equal(C.checkMap(s,NOW,q.id),false);assert.equal(s.expedition.current.search.index,1);
});
test('zero lives retreats two steps and preserves solved map questions through retry and backup',()=>{
 let s=ready();solve(s);const q=A.mapQuestion(s);s.expedition.current.hearts=1;A.chooseMap(s,q.options.find(o=>o.id!==q.answer).id,q.id);C.checkMap(s,NOW,q.id);assert.equal(s.activity,'result');assert.equal(s.expedition.current.retryTargetStep,6);s=S.readBackup(S.backupFile(s).text).state;assert.ok(A.retry(s));assert.equal(s.expedition.current.step,3);assert.equal(s.expedition.current.hearts,4);assert.equal(s.expedition.current.search.index,1);s.expedition.current.phase='puzzle';s.expedition.current.puzzle={solved:true};A.next(s,NOW);assert.equal(A.mapQuestion(s).id,q.id);solve(s);solve(s);assert.equal(A.progress(s).done,9);
});
test('reload, parked legacy play and old completed quests preserve learner evidence',()=>{
 let s=ready();solve(s);const q=A.mapQuestion(s);A.chooseMap(s,q.answer,q.id);A.switchTo(s,'legacy');s=C.migrate(JSON.parse(JSON.stringify(s)));C.startMission(s,'crab-ferry',NOW);assert.equal(s.expedition.current.search.index,1);assert.equal(s.expedition.current.search.selection,q.answer);solve(s);solve(s);delete s.expedition.current.ninthRequired;s=C.migrate(s);assert.equal(s.expedition.current.phase,'complete');assert.equal(A.progress(s).total,8);assert.ok(A.stats(s).completedAt);C.startMission(s,'crab-ferry',NOW);assert.equal(A.progress(s).total,9);
});
test('map first solves award riddle XP once and foreground thinking shares the per-question cap',()=>{
 const s=ready();const xp=s.dragon.xp;A.recordRiddleTime(s,240000,NOW);assert.equal(A.report(s).riddleMs,180000);solve(s);assert.equal(s.dragon.xp-xp,50);A.recordRiddleTime(s,1000,NOW);assert.equal(A.report(s).riddleMs,181000);solve(s);solve(s);const after=s.dragon.xp;s.expedition.current.phase='search';s.expedition.current.search={index:0,answers:[],selection:null};assert.equal(solve(s).firstSolve,false);assert.equal(s.dragon.xp,after);
});
