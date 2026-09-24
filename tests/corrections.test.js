const test=require('node:test'),assert=require('node:assert/strict');
const Core=require('../game-core'),Content=require('../content');
const NOW=Date.UTC(2026,8,24,8);
function question({isNew=false,misses=0,review=false,corrects=2,supported=false}={}){
  const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
  Core.startBattle(s,NOW,{strength:6});const q=Core.prepareBattle(s,NOW,()=>.4);
  q.phase='choices';q.isNew=isNew;q.retentionDue=review;
  if(supported)q.supportReasons.push('interrupted-exposure');
  Object.assign(s.learning.words[q.target],{independentCorrect:corrects,consecutiveMisses:misses,
    introducedAt:new Date(NOW-Core.DAY).toISOString(),reviewStage:review?1:-1});
  return {s,q};
}
for(const [name,setup,expected] of [
  ['new word',{isNew:true},true],['single familiar miss',{},false],
  ['introduced word without an independent success',{corrects:0},false],
  ['second consecutive miss',{misses:1},true],['due review',{review:true},true]
])test('picture teaching after '+name,()=>{
  const {s,q}=question(setup),wrong=q.options.find(w=>w!==q.target);
  Core.answerBattle(s,wrong,NOW);
  assert.equal(q.needsTeaching,expected);assert.equal(s.battle.heroHealth,2);
  const resumed=Core.migrate(JSON.parse(JSON.stringify(s)));
  assert.equal(resumed.battle.question.needsTeaching,expected);
  assert.equal(resumed.battle.question.firstResponse,wrong);
});
for(const [name,setup,expected] of [
  ['new word',{isNew:true},true],['known word',{},false],
  ['one previous independent miss',{misses:1},false],
  ['two previous independent misses',{misses:2},true],['due review',{review:true},true]
])test('help uses the teaching rule for '+name+' without scoring a miss',()=>{
  const {s,q}=question(setup),w=s.learning.words[q.target],before=Core.copy(w);
  s.rewards.shield=true;const rec=Core.answerBattle(s,'?',NOW);
  assert.equal(q.needsTeaching,expected);assert.equal(rec.supported,true);
  assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.enemyHealth,6);assert.equal(s.rewards.shield,true);
  assert.equal(w.consecutiveMisses,before.consecutiveMisses);assert.equal(w.independentCorrect,before.independentCorrect);
  assert.equal(w.reviewStage,before.reviewStage);assert.equal(q.xpEarned,0);
  assert.equal(w.eligibleAfter,s.learning.sequence+2);assert.equal(w.lastHelpAt,new Date(NOW).toISOString());
});
test('supported wrong answers can teach, while supported successes cannot become mastery',()=>{
  for(const correct of [false,true]){
    const {s,q}=question({supported:true,isNew:true}),w=s.learning.words[q.target];
    Core.answerBattle(s,correct?q.target:q.options.find(w=>w!==q.target),NOW);
    assert.equal(q.needsTeaching,!correct);assert.equal(w.independentCorrect,2);
    assert.equal(w.consecutiveMisses,0);assert.equal(q.xpEarned,0);
    assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.enemyHealth,6);
  }
});
test('brief correction still inserts two other words before the recheck',()=>{
  const {s,q}=question();Core.answerBattle(s,q.options.find(w=>w!==q.target),NOW);
  assert.equal(q.needsTeaching,false);
  for(let i=1;i<=2;i++){
    const next=Core.prepareBattle(s,NOW+i*1000,()=>.4);assert.notEqual(next.target,q.target);
    next.phase='choices';Core.answerBattle(s,next.target,NOW+i*1000);
  }
  assert.equal(s.learning.sequence,s.learning.words[q.target].eligibleAfter);
  assert.equal(s.learning.teaching.length,0);
});
test('aligned corrections mark substitutions, insertions, deletions and adjacent swaps',()=>{
  for(const [chosen,target,expected] of [
    ['rack','rock',[['r','r'],['a','o'],['c','c'],['k','k']]],
    ['sow','snow',[['s','s'],['','n'],['o','o'],['w','w']]],
    ['read','red',[['r','r'],['e','e'],['a',''],['d','d']]],
    ['form','from',[['f','f'],['o','r'],['r','o'],['m','m']]],
    ['see','se',[['s','s'],['e','e'],['e','']]]
  ]){
    const cells=Core.correctionLetters(chosen,target);
    assert.deepEqual(cells.map(c=>[c.chosen,c.target]),expected);
    for(const cell of cells)assert.equal(cell.different,cell.chosen!==cell.target);
  }
});
test('alignment preserves every reviewed target and candidate without inventing letters',()=>{
  for(const item of Content.words)for(const chosen of item.pool||item.d){
    const cells=Core.correctionLetters(chosen,item.w);
    assert.equal(cells.map(c=>c.chosen).join(''),chosen);
    assert.equal(cells.map(c=>c.target).join(''),item.w);
    assert.ok(cells.every(c=>c.chosen||c.target));
  }
});
