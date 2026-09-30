// Hypothetical answer streams, not observed learning or an accuracy guarantee.
// Optional private backup input is read only; neither its identity nor contents are emitted.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {fromCommit}=require('./simulate-scheduling.cjs');
const Core=require('../game-core'),Content=require('../content');
const baseline=process.argv[2],path=process.argv[3];
const oldCore=baseline?fromCommit(baseline).Core:null;
const backup=path?JSON.parse(fs.readFileSync(path,'utf8')):null;
function run(C,accuracy,source){
  let s=C.migrate(source?C.copy(source):C.fresh());s.assessment.done=true;
  const start=backup?Date.parse(backup.exportedAt):Date.UTC(2026,8,30,12);
  const initiallyKnown=new Set(Content.words.filter(x=>s.learning.words[x.w].introducedAt).map(x=>x.w));
  const counts={},kinds={},modes={};let unnecessary=0,defeats=0,checked=0,maxUnfinished=0;
  for(let i=0;i<100;i++){
    const now=start+i*8000;
    if(!s.battle||s.battle.resolved)C.startBattle(s,now,{strength:32});
    const q=C.prepareBattle(s,now);
    assert.ok(q);const w=s.learning.words[q.target];
    if(w.practiceSuccesses>=2&&w.dueAt>now)unnecessary++;
    counts[q.target]=(counts[q.target]||0)+1;kinds[q.practiceKind]=(kinds[q.practiceKind]||0)+1;
    if(C.adaptiveChallenge){const mode=C.adaptiveChallenge(s).mode;modes[mode]=(modes[mode]||0)+1;}
    q.phase='choices';q.responseMs=1800;q.wordViewedMs=q.exposureMs;
    const correct=Math.ceil((i+1)*accuracy)>Math.ceil(i*accuracy);
    C.answerBattle(s,correct?q.target:q.options.find(x=>x!==q.target),now);checked++;
    if(!correct&&q.needsTeaching){C.startTeaching(s,q.target,'battle',now);C.leaveTeaching(s,now+2000);}
    if(s.battle.heroHealth<=0||s.battle.enemyHealth<=0){C.resolveBattle(s,now);if(!s.result.victory)defeats++;}
    maxUnfinished=Math.max(maxUnfinished,Content.words.filter(x=>s.learning.words[x.w].introducedAt&&s.learning.words[x.w].practiceSuccesses<2).length);
    s=C.migrate(C.copy(s));
  }
  return {checked,distinct:Object.keys(counts).length,newDistinct:Object.keys(counts).filter(w=>!initiallyKnown.has(w)).length,
    alreadySuccessfulNotDue:unnecessary,maxRepetitions:Math.max(...Object.values(counts)),defeats,maxUnfinished,kinds,modes};
}
const preservation={};
if(backup){
  const migrated=Core.migrate(backup.state);
  for(const key of ['profile','dragon','assessment','settings','battle','learning']){
    assert.deepEqual(migrated[key],backup.state[key],key+' changed during migration');preservation[key]=true;
  }
}
const cases=[];
for(const source of [null,...(backup?[backup.state]:[])])for(const accuracy of [1,.85,.7])
  cases.push({start:source?'existing export':'fresh',assumedAccuracy:accuracy,
    ...(oldCore?{before:run(oldCore,accuracy,source)}:{}),after:run(Core,accuracy,source)});
console.log(JSON.stringify({baseline,assumptions:{answers:100,answerMs:8000,enemyHealth:32,automaticCorrectness:'fixed hypothetical outcomes, independent of selected word',limitations:'Not a model of human learning, retention or enjoyment.'},preservation,cases},null,2));
