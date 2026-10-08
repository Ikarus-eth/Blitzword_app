const test=require('node:test'),assert=require('node:assert/strict');
const Core=require('../game-core');
const NOW=Date.UTC(2026,9,9);
function setup(){const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,NOW,{strength:6});return s;}
function answer(s,opt){const q=Core.prepareBattle(s,NOW,()=>.4);q.phase='choices';return Core.answerBattle(s,opt||q.target,NOW);}
function skipTwice(s){
 const q=Core.prepareBattle(s,NOW,()=>.4),target=q.target;
 answer(s,'?');assert.equal(Core.canRequestBattleHelp(s),true);
 for(let turn=0;turn<20;turn++){
  const next=Core.prepareBattle(s,NOW,()=>.4);
  if(next.target===target){answer(s,'?');return target;}
  answer(s,'?');
 }
 throw new Error('word never returned');
}
test('second skip forces a spaced answer before victory, persists through reload, and rejects third skip',()=>{
 let s=setup();const target=skipTwice(s);s.battle.enemyHealth=1;
 s=Core.migrate(JSON.parse(JSON.stringify(s)));
 for(let i=0;i<2;i++){const q=Core.prepareBattle(s,NOW,()=>.4);assert.notEqual(q.target,target);answer(s);assert.equal(s.battle.enemyHealth,1);}
 const q=Core.prepareBattle(s,NOW,()=>.4);assert.equal(q.target,target);q.phase='choices';
 assert.equal(Core.canRequestBattleHelp(s),false);const before=JSON.stringify(s);
 assert.equal(Core.answerBattle(s,'?',NOW),null);assert.equal(JSON.stringify(s),before);
 answer(s);assert.equal(s.battle.enemyHealth,0);Core.prepareBattle(s,NOW);assert.equal(s.result.victory,true);
});
test('a wrong choice satisfies the required attempt with ordinary correction and damage',()=>{
 const s=setup(),target=skipTwice(s);answer(s);answer(s);
 const q=Core.prepareBattle(s,NOW,()=>.4);assert.equal(q.target,target);const health=s.battle.heroHealth;
 answer(s,q.options.find(w=>w!==target));assert.equal(s.battle.requiredAnswers.includes(target),false);
 assert.equal(s.battle.heroHealth,health-1);assert.equal(q.phase,'correction');assert.equal(Core.canRequestBattleHelp(s),false);
 Core.startBattle(s,NOW);assert.deepEqual(s.battle.helpCounts,{});assert.deepEqual(s.battle.requiredAnswers,[]);
});
test('older active saves recover obligations from retained battle answers',()=>{
 const s=setup(),target=skipTwice(s);delete s.battle.helpCounts;delete s.battle.requiredAnswers;
 assert.equal(Core.canRequestBattleHelp(s),false);assert.deepEqual(s.battle.requiredAnswers,[target]);
});
test('multiple required words cannot be bypassed by answering only one',()=>{
 const s=setup();Core.prepareBattle(s,NOW);const [a,b]=Object.keys(s.learning.words).slice(0,2);
 s.battle.helpCounts={[a]:2,[b]:2};s.battle.requiredAnswers=[a,b];s.battle.enemyHealth=1;
 s.battle.question.answeredAt=new Date(NOW).toISOString();s.learning.recent=[];
 assert.equal(Core.prepareBattle(s,NOW).target,a);answer(s);assert.equal(s.battle.enemyHealth,1);
 assert.equal(Core.prepareBattle(s,NOW).target,b);answer(s);assert.equal(s.battle.enemyHealth,0);
});
test('demo retains unlimited question-mark help',()=>{
 const s=setup();Core.startBattle(s,NOW,{demo:true});Core.prepareBattle(s,NOW);
 s.battle.helpCounts={[s.battle.question.target]:2};assert.equal(Core.canRequestBattleHelp(s),true);assert.ok(answer(s,'?'));
});
