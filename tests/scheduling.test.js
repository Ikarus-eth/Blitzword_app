const test=require('node:test'),assert=require('node:assert/strict');
const Core=require('../game-core'),Content=require('../content');
const NOW=new Date(2026,8,24,12).getTime(),DAY=Core.DAY;
const fresh=()=>{const s=Core.migrate(Core.fresh());s.assessment.done=true;return s;};
const reload=s=>Core.migrate(Core.copy(s));
function answer(s,now,{target,correct=true,supported=false}={}){
  if(!s.battle||s.battle.resolved)Core.startBattle(s,now,{strength:30});
  const q=Core.prepareBattle(s,now,()=>.4);
  if(target){q.target=target;q.options=Core.byWord[target].d;}
  q.phase='choices';q.supportReasons=supported?['interrupted-exposure']:[];
  Core.answerBattle(s,correct?q.target:q.options.find(x=>x!==q.target),now);
  return q;
}

test('a correct recheck after a missed established review waits until 24 hours after help',()=>{
  let s=fresh();Core.startBattle(s,NOW,{strength:30});
  const q=Core.prepareBattle(s,NOW),target=q.target,w=s.learning.words[target];
  Object.assign(w,{reviewStage:2,practiceSuccesses:4,dueAt:NOW-1});
  answer(s,NOW,{correct:false});
  Core.startTeaching(s,target,'battle',NOW);Core.leaveTeaching(s,NOW+5000);
  assert.equal(w.reviewStage,1);
  answer(s,NOW+20000);answer(s,NOW+40000);
  assert.equal(Core.prepareBattle(s,NOW+61000).target,target,'due recheck follows two intervening answers');
  answer(s,NOW+61000);
  assert.equal(w.reviewStage,1,'recent help must not advance retention');
  assert.equal(w.dueAt,NOW+5000+DAY,'the old overdue timestamp must be replaced');
  s=reload(s);
  answer(s,NOW+120000,{target});
  assert.equal(s.learning.words[target].dueAt,NOW+5000+DAY,'same-day repetitions do not push it further out');
  answer(s,NOW+5000+DAY,{target});
  assert.equal(s.learning.words[target].reviewStage,2);
  assert.equal(s.learning.words[target].dueAt,NOW+5000+DAY+7*DAY);
});

function field(index=0,{accuracy=1}={}){
  const s=fresh(),area=Content.areas[index];
  s.story.clearedAreas=Content.areas.slice(0,index).map(a=>a.id);
  s.story.completedChapters=Content.chapters.slice(0,Content.chapters.findIndex(c=>c.id===area.chapterId)).map(c=>c.id);
  s.learning.sequence=300;
  for(const [i,item] of Content.areas.slice(0,index+1).flatMap(a=>a.words).entries()){
    Object.assign(s.learning.words[item],{introducedAt:new Date(NOW-2*DAY).toISOString(),lastSeenAt:new Date(NOW-60000).toISOString(),
      independentCorrect:3,practiceSuccesses:3,reviewStage:0,dueAt:NOW+DAY,lastSequence:i});
    s.learning.dailyPractice[item]={day:Core.dayKey(NOW),correct:3};
  }
  for(let i=0;i<5;i++)s.campaign.battleRecords.push({id:'prior-'+i,task:'battle',target:area.words[0],correct:i<accuracy*5,supported:false,at:new Date(NOW-60000).toISOString()});
  Core.startBattle(s,NOW,{strength:300});return s;
}
const next=s=>Core.prepareBattle(s,NOW,()=>.4);

test('three independent successes cap each current word, then at most three preview words, then faster refill',()=>{
  const s=fresh();Core.startBattle(s,NOW,{strength:300});
  const current=new Set(Content.areas[0].words),preview=new Set(Content.areas[1].words),ordinary={},previews=new Set();
  let fast=0;
  for(let i=0;i<45;i++){
    const q=answer(s,NOW+i*8000);
    if(q.practiceKind==='current'){ordinary[q.target]=(ordinary[q.target]||0)+1;assert.ok(ordinary[q.target]<=3);}
    if(q.practiceKind==='preview'){assert.ok(preview.has(q.target));previews.add(q.target);assert.ok(previews.size<=3);}
    if(q.practiceKind==='speed-refill'){fast++;assert.ok(current.has(q.target));assert.equal(q.exposureMs,1500);}
  }
  assert.equal(Object.keys(ordinary).length,6);assert.ok(Object.values(ordinary).every(n=>n===3));
  assert.equal(previews.size,3);assert.ok(fast>0);
  assert.equal(s.session.newWords.length,9,'six chapter targets plus three approved previews');
  for(const word of previews)assert.ok(s.learning.words[word].introducedAt);
  assert.equal(Core.practiceExposure(s),1800,'faster refill does not change the selected speed');
});

test('freed turns prefer due review, then older unseen words least recently seen, then next-chapter previews',()=>{
  const s=field(1),old=Content.areas[0].words;
  s.learning.words[old[0]].dueAt=NOW-1;
  s.learning.words[old[1]].lastSeenAt=new Date(NOW-2*DAY).toISOString();
  s.learning.words[old[2]].lastSeenAt=new Date(NOW-3*DAY).toISOString();
  assert.equal(next(s).target,old[0]);assert.equal(next(s).practiceKind,'review');answer(s,NOW);
  assert.equal(next(s).target,old[2]);assert.equal(next(s).practiceKind,'older');answer(s,NOW);
  assert.equal(next(s).target,old[1]);answer(s,NOW);
  assert.equal(next(s).practiceKind,'preview');assert.ok(Content.areas[2].words.includes(next(s).target));
});

test('a capped current word is skipped even when due, while an older due review remains eligible',()=>{
  const s=field(1);s.learning.words.water.dueAt=NOW-1;s.learning.words.on.dueAt=NOW-1;
  assert.equal(next(s).target,'on');assert.equal(next(s).practiceKind,'review');
});

test('preview gate uses independent recent accuracy, accepts 80%, and stops below it',()=>{
  const allowed=field(0,{accuracy:.8});
  for(let i=0;i<20;i++)allowed.campaign.battleRecords.push({task:'battle',correct:false,supported:true});
  assert.equal(next(allowed).practiceKind,'preview');
  const blocked=field(0,{accuracy:.6});assert.equal(next(blocked).practiceKind,'speed-refill');
  assert.ok(Content.areas[1].words.every(word=>!blocked.learning.words[word].introducedAt));
  // The gate is checked again on every new question, including already introduced previews.
  answer(allowed,NOW,{correct:false});
  assert.equal(next(allowed).practiceKind,'speed-refill');
});

test('preview limit survives new sessions, a new day and save/reload; previews never unlock a chapter',()=>{
  let s=field();
  for(let i=0;i<12;i++)answer(s,NOW+i*8000);
  const introduced=()=>Content.areas[1].words.filter(word=>s.learning.words[word].introducedAt);
  assert.equal(introduced().length,3);
  const before=introduced();s=reload(s);Core.completeSession(s,NOW);Core.beginSession(s,NOW+DAY);
  for(const word of Content.areas[0].words)s.learning.dailyPractice[word]={day:Core.dayKey(NOW+DAY),correct:3};
  for(let i=0;i<12;i++)answer(s,NOW+DAY+i*8000);
  assert.deepEqual(introduced(),before);assert.deepEqual(s.story.clearedAreas,[]);
  assert.equal(Core.storyProgress(s).areas[1].status,'locked');
});

test('preview across a campaign boundary still means the next map field, without unlocking its campaign',()=>{
  const s=field(4),q=next(s);
  assert.ok(Content.areas[5].words.includes(q.target));assert.equal(q.practiceKind,'preview');
  assert.equal(Core.currentChapter(s).id,'chapter-1');assert.deepEqual(s.story.completedChapters,[]);
});

test('all refill paths preserve two distinct intervening answers after help',()=>{
  const s=field(),q=next(s),target=q.target;
  answer(s,NOW,{correct:false});Core.startTeaching(s,target,'battle',NOW);Core.leaveTeaching(s,NOW);
  const first=answer(s,NOW+20000).target,second=answer(s,NOW+40000).target;
  assert.notEqual(first,target);assert.notEqual(second,target);assert.notEqual(first,second);
  // Accuracy may disable previews; neither that nor faster refill can waive eligibility.
  for(let i=0;i<6;i++){
    const candidate=next(s);assert.ok(s.learning.sequence>=s.learning.words[candidate.target].eligibleAfter);
    answer(s,NOW+60000+i*8000);
  }
});

test('faster refill takes exactly one exposure step and never compounds or changes a saved question',()=>{
  for(const [base,expected] of [[2200,1800],[1800,1500],[1500,1200],[1200,950],[950,950]]){
    let s=field(0,{accuracy:0});s.assessment.exposure=base;
    const settings=Core.copy(s.settings),q=next(s);
    assert.equal(q.exposureMs,expected);const saved=Core.copy(q);s=reload(s);
    assert.deepEqual(Core.prepareBattle(s,NOW+DAY),saved);
    for(let i=0;i<5;i++){answer(s,NOW,{supported:true});assert.equal(next(s).exposureMs,expected);}
    assert.deepEqual(s.settings,settings);assert.equal(s.assessment.exposure,base);
  }
});

test('Crawl stays self-paced and speed refill cannot unlock Ride or Fly',()=>{
  const s=field(0,{accuracy:0});Core.chooseSpeed(s,'crawl');assert.equal(next(s).exposureMs,null);
  answer(s,NOW,{supported:true});Core.chooseSpeed(s,'run');assert.equal(next(s).exposureMs,950);
  assert.equal(Core.chooseSpeed(s,'ride'),false);assert.equal(Core.chooseSpeed(s,'fly'),false);
  assert.deepEqual(Core.speedChoices(s).filter(x=>x.locked).map(x=>x.id),['ride','fly']);
  // Existing, legitimately unlocked speeds are preserved as well.
  answer(s,NOW,{supported:true});s.entitlements={expansion:true};s.story.chapterComplete=true;s.dragon.stage=3;
  Core.chooseSpeed(s,'ride');assert.equal(next(s).exposureMs,600);
});

test('daily counts exclude support, demo and assessment and ignore duplicate answer delivery',()=>{
  const s=fresh();answer(s,NOW,{target:'on',supported:true});assert.equal(s.learning.dailyPractice.on,undefined);
  answer(s,NOW,{target:'on',correct:false});assert.equal(s.learning.dailyPractice.on,undefined);
  const q=answer(s,NOW,{target:'on'});assert.equal(s.learning.dailyPractice.on.correct,1);
  assert.equal(Core.answerBattle(s,q.target,NOW),null);assert.equal(s.learning.dailyPractice.on.correct,1);
  Core.startBattle(s,NOW,{demo:true});answer(s,NOW,{target:'on'});assert.equal(s.learning.dailyPractice.on.correct,1);
  s.assessment.done=false;Core.startAssessment(s,NOW);const check=Core.prepareAssessment(s,NOW);check.phase='choices';Core.answerAssessment(s,check.target,NOW);
  assert.equal(s.learning.dailyPractice.on.correct,1);
});

test('daily cap follows the local calendar date and resets at midnight without changing word progress',()=>{
  let s=field(0,{accuracy:0});const before=Core.copy(s.learning.words);
  const tomorrow=new Date(2026,8,25,0,0,0).getTime();
  s=reload(s);const q=Core.prepareBattle(s,tomorrow);
  assert.equal(q.practiceKind,'current');assert.equal(q.exposureMs,1800);
  assert.deepEqual(s.learning.words,before);
  answer(s,tomorrow);
  assert.deepEqual(s.learning.dailyPractice[q.target],{day:Core.dayKey(tomorrow),correct:1});
});

test('daily cap survives compaction and reload after its evidence leaves the 500 raw answers',()=>{
  let s=field();
  for(let i=0;i<600;i++)s.campaign.battleRecords.push({task:'battle',target:'rock',correct:false,supported:true,at:new Date(NOW).toISOString()});
  Core.compactHistory(s);s=reload(s);
  assert.equal(s.campaign.battleRecords.length,500);assert.equal(next(s).practiceKind,'preview');
  assert.equal(Object.keys(s.learning.dailyPractice).length,6);
});

test('old saves seed the cap from retained answers before compaction, preserving progress and pending questions',()=>{
  const s=field();delete s.learning.dailyPractice;s.campaign.battleRecords=[];
  s.timing.firstPracticeAt=new Date(NOW-2*DAY).toISOString();
  for(const word of Content.areas[0].words)for(let i=0;i<3;i++)s.campaign.battleRecords.push({task:'battle',target:word,correct:true,supported:false,at:new Date(NOW).toISOString()});
  for(let i=0;i<600;i++)s.campaign.battleRecords.push({task:'battle',target:'rock',correct:true,supported:true,at:new Date(NOW).toISOString()});
  const migrated=reload(s);
  for(const key of ['profile','dragon','story','rewards','settings','timing','assessment','battle','session'])assert.deepEqual(migrated[key],s[key],key);
  assert.deepEqual(migrated.learning.words,s.learning.words);
  assert.equal(next(migrated).practiceKind,'preview');
  const pending=Core.copy(migrated.battle.question),again=reload(migrated);
  assert.deepEqual(Core.prepareBattle(again,NOW),pending);assert.deepEqual(again.learning.dailyPractice,migrated.learning.dailyPractice);
});

test('cap and preview do not waive the ten-minute minimum, learning objectives or a living battle',()=>{
  const s=field();Object.assign(Core.chapterState(s,Content.areas[0].id),{wins:3,duels:1,activeMs:599999});
  next(s);assert.equal(Core.storyProgress(reload(s)).cleared,0);
  Core.chapterState(s,Content.areas[0].id).activeMs=600000;
  assert.equal(Core.storyProgress(reload(s)).cleared,0,'living battle still blocks completion');
  s.battle.enemyHealth=0;Core.resolveBattle(s,NOW);assert.equal(Core.storyProgress(s).cleared,1);
  const missing=field();Object.assign(Core.chapterState(missing,Content.areas[0].id),{wins:3,duels:1,activeMs:600000});
  missing.learning.words.on.practiceSuccesses=0;missing.learning.words.rock.practiceSuccesses=0;
  missing.battle.enemyHealth=0;Core.resolveBattle(missing,NOW);assert.equal(Core.storyProgress(missing).cleared,0);
});

test('post-story review remains available without previewing beyond the curriculum',()=>{
  const s=field(34);s.story.clearedAreas=Content.areas.map(a=>a.id);s.story.completedChapters=Content.chapters.map(c=>c.id);
  s.learning.words.on.dueAt=NOW-1;Core.startBattle(s,NOW,{strength:300});
  assert.equal(next(s).target,'on');assert.equal(next(s).practiceKind,'review');
});
