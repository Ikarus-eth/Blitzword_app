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

test('daily counts exclude support, demo and assessment and ignore duplicate answer delivery',()=>{
  const s=fresh();answer(s,NOW,{target:'on',supported:true});assert.equal(s.learning.dailyPractice.on,undefined);
  answer(s,NOW,{target:'on',correct:false});assert.equal(s.learning.dailyPractice.on,undefined);
  const q=answer(s,NOW,{target:'on'});assert.equal(s.learning.dailyPractice.on.correct,1);
  assert.equal(Core.answerBattle(s,q.target,NOW),null);assert.equal(s.learning.dailyPractice.on.correct,1);
  Core.startBattle(s,NOW,{demo:true});answer(s,NOW,{target:'on'});assert.equal(s.learning.dailyPractice.on.correct,1);
  s.assessment.done=false;Core.startAssessment(s,NOW);const check=Core.prepareAssessment(s,NOW);check.phase='choices';Core.answerAssessment(s,check.target,NOW);
  assert.equal(s.learning.dailyPractice.on.correct,1);
});

test('old saves seed the cap from retained answers before compaction, preserving progress and pending questions',()=>{
  const s=field();delete s.learning.dailyPractice;s.campaign.battleRecords=[];
  s.timing.firstPracticeAt=new Date(NOW-2*DAY).toISOString();
  for(const word of Content.areas[0].words)for(let i=0;i<3;i++)s.campaign.battleRecords.push({task:'battle',target:word,correct:true,supported:false,at:new Date(NOW).toISOString()});
  for(let i=0;i<600;i++)s.campaign.battleRecords.push({task:'battle',target:'rock',correct:true,supported:true,at:new Date(NOW).toISOString()});
  const migrated=reload(s);
  for(const key of ['profile','dragon','story','rewards','settings','timing','assessment','battle','session'])assert.deepEqual(migrated[key],s[key],key);
  assert.deepEqual(migrated.learning.words,s.learning.words);
  assert.equal(next(migrated).practiceKind,'new');
  const pending=Core.copy(migrated.battle.question),again=reload(migrated);
  assert.deepEqual(Core.prepareBattle(again,NOW),pending);assert.deepEqual(again.learning.dailyPractice,migrated.learning.dailyPractice);
});

test('learning ahead does not waive the ten-minute minimum, learning objectives or a living battle',()=>{
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

function history(s,correct,total=20){
  s.campaign.battleRecords=Array.from({length:total},(_,i)=>({id:'sample-'+i,task:'battle',target:'on',correct:i<correct,supported:false,timingValid:true,at:new Date(NOW-1000).toISOString()}));
}
// 2 October 2026: the family asked for more challenge; the band moved from 80–90% to 75–85%.
test('automatic challenge uses a 75–85% band, enough evidence, and early struggle recovery',()=>{
  assert.equal(Core.ADAPTIVE_RULES.low,.75);assert.equal(Core.ADAPTIVE_RULES.high,.85);
  for(const [correct,mode,limit] of [[18,'stretch',6],[17,'steady',4],[15,'steady',4],[14,'support',2]]){
    const s=fresh();history(s,correct);
    // Spread errors through the sample so this checks the full-window boundaries.
    s.campaign.battleRecords.sort((a,b)=>a.id.localeCompare(b.id));
    assert.equal(Core.adaptiveChallenge(s).mode,mode);assert.equal(Core.adaptiveChallenge(s).activeLimit,limit);
  }
  const s=fresh();history(s,9,9);assert.equal(Core.adaptiveChallenge(s).mode,'steady');
  history(s,2,5);assert.equal(Core.adaptiveChallenge(s).mode,'support');
  history(s,19);assert.equal(Core.adaptiveChallenge(s).mode,'stretch','one miss does not overreact');
});
test('help lowers challenge; interruptions, guided work and assessment do not distort it',()=>{
  const s=fresh();history(s,20);
  for(let i=0;i<5;i++)s.campaign.battleRecords.push({task:'battle',target:'on',correct:false,supported:true,timingValid:true,supportReasons:['help-request']});
  assert.equal(Core.adaptiveChallenge(s).mode,'support');assert.equal(Core.adaptiveChallenge(s).correct,15);
  const before=Core.adaptiveChallenge(s);
  for(const r of [{task:'assessment',correct:false},{task:'demoBattle',correct:false},
    {task:'battle',correct:false,supported:true,supportReasons:['guided-example']},
    {task:'battle',correct:false,supported:true,timingValid:false,supportReasons:['help-request','interrupted-exposure']}])s.campaign.battleRecords.push(r);
  assert.deepEqual(Core.adaptiveChallenge(s),before);
});
test('easy words leave routine practice after two separated successes; learning moves beyond the next field',()=>{
  const s=fresh();Core.startBattle(s,NOW,{strength:300});const seen={};
  for(let i=0;i<100;i++){
    const q=answer(s,NOW+i*8000);seen[q.target]=(seen[q.target]||0)+1;
    assert.ok(seen[q.target]<=2,'unnecessary repetition: '+q.target);
    assert.notEqual(q.practiceKind,'comfort');assert.notEqual(q.practiceKind,'speed-refill');
    assert.equal(q.exposureMs,1800);
    const unfinished=Content.words.filter(x=>s.learning.words[x.w].introducedAt&&s.learning.words[x.w].practiceSuccesses<2);
    assert.ok(unfinished.length<=6);
  }
  assert.ok(Object.keys(seen).length>=45);assert.ok(Content.areas[3].words.some(w=>seen[w]));
  assert.equal(s.story.clearedAreas.length,0,'learning ahead never bypasses chapter gates');
  assert.ok(Object.values(s.learning.words).every(w=>!w.securedAt),'two quick successes are not secured or retained mastery');
});
test('due reviews include future-field words and stop repeating after success',()=>{
  const s=field(1),old=Content.areas[0].words[0],ahead=Content.areas[8].words[0];
  Object.assign(s.learning.words[ahead],{introducedAt:new Date(NOW-4*DAY).toISOString(),practiceSuccesses:3,reviewStage:1,dueAt:NOW-1,lastSequence:-2});
  s.learning.words[old].dueAt=NOW-1;s.learning.sequence=302;
  assert.equal(next(s).target,ahead);answer(s,NOW);
  assert.equal(s.learning.words[ahead].dueAt,NOW+7*DAY);
  const nextWords=[];for(let i=0;i<20;i++)nextWords.push(answer(s,NOW+i*8000).target);
  assert.ok(nextWords.includes(old));assert.ok(!nextWords.includes(ahead));
});
test('known not-due words do not fill turns before new curriculum; low accuracy reduces the active set',()=>{
  const high=field();history(high,20);assert.equal(next(high).practiceKind,'new');
  const low=field();history(low,10);const words=Content.areas[1].words.slice(0,2);
  for(const word of words)Object.assign(low.learning.words[word],{introducedAt:new Date(NOW).toISOString(),practiceSuccesses:0});
  const q=next(low);assert.ok(words.includes(q.target));assert.equal(q.practiceKind,'practice');
  assert.equal(Core.adaptiveChallenge(low).activeLimit,2);
});
test('misses and help return easy words to practice without inventing mastery or spending help hearts',()=>{
  const s=field();Core.prepareBattle(s,NOW);const q=s.battle.question,w=s.learning.words[q.target];
  Object.assign(w,{practiceSuccesses:4,reviewStage:2,wordXPClaimed:true,securedAt:new Date(NOW-DAY).toISOString()});
  q.phase='choices';const health=s.battle.heroHealth;Core.answerBattle(s,'?',NOW);
  assert.equal(w.practiceSuccesses,0);assert.equal(w.reviewStage,2);assert.ok(w.securedAt);assert.equal(s.battle.heroHealth,health);
  const first=answer(s,NOW+20000).target,second=answer(s,NOW+40000).target;
  assert.notEqual(first,q.target);assert.notEqual(second,q.target);assert.notEqual(first,second);
  assert.equal(Core.prepareBattle(s,NOW+61000).target,q.target);
});
test('adaptation preserves pending questions, chosen speeds, locked modes and the learning state across reload',()=>{
  for(const speed of ['crawl','walk','stride','jog','run']){
    let s=field();history(s,20);Core.chooseSpeed(s,speed);const q=Core.copy(next(s)),settings=Core.copy(s.settings);
    history(s,0);s=reload(s);assert.deepEqual(Core.prepareBattle(s,NOW+DAY),q);assert.deepEqual(s.settings,settings);
    assert.equal(Core.chooseSpeed(s,'ride'),false);assert.equal(Core.chooseSpeed(s,'fly'),false);
    assert.equal(q.exposureMs,Core.practiceExposure(s));
  }
});
test('all-known curriculum offers bounded review without throwing or silently accelerating',()=>{
  const s=field(34);history(s,20);const before=Core.copy(s.settings);
  for(let i=0;i<20;i++){const q=answer(s,NOW+i*8000);assert.equal(q.practiceKind,'comfort');assert.ok(Content.words.some(w=>w.w===q.target));}
  assert.deepEqual(s.settings,before);
});
test('new long battles scale mistake allowance; old in-flight battles keep every saved value',()=>{
  for(const [strength,hearts] of [[3,3],[4,3],[8,4],[16,6],[32,10]]){
    const s=fresh();Core.startBattle(s,NOW,{strength});assert.equal(s.battle.heroHealth,hearts);assert.equal(s.battle.heroMaxHealth,hearts);
  }
  const s=field();s.battle.maxHealth=32;s.battle.enemyHealth=19;s.battle.heroHealth=1;delete s.battle.heroMaxHealth;
  const before=Core.copy(s.battle);assert.deepEqual(reload(s).battle,before);
  Core.startBattle(s,NOW,{demo:true});assert.equal(s.battle.heroHealth,3);
});

// 2 October 2026: exposure is the second automatic difficulty axis.
test('familiar words step faster after sustained success and slower after support; new words keep the chosen pace',()=>{
  const s=fresh();Core.chooseSpeed(s,'walk');history(s,20);
  for(let i=0;i<9;i++)answer(s,NOW+i*8000);
  assert.equal(s.learning.challengePace.steps,0,'no change before ten counted answers');
  answer(s,NOW+9*8000);assert.deepEqual(s.learning.challengePace,{steps:1,since:0});
  for(let i=10;i<20;i++)answer(s,NOW+i*8000);assert.equal(s.learning.challengePace.steps,2);
  // A known word now flashes two steps faster; an unseen word keeps Walk.
  const known=Content.words.find(x=>s.learning.words[x.w].independentCorrect>=2);
  assert.equal(Core.challengeExposure(1800,2),1200);
  s.battle.question=null;Object.assign(s.learning.words[known.w],{dueAt:NOW-1,reviewStage:0,eligibleAfter:0,lastSequence:-99});s.learning.sequence=s.learning.sequence-(s.learning.sequence%3)+2;
  const review=Core.prepareBattle(s,NOW+DAY);assert.equal(review.practiceKind,'review');assert.equal(review.exposureMs,1200);assert.equal(review.chosenExposureMs,1800);
  review.phase='choices';Core.answerBattle(s,review.target,NOW+DAY);
  const fresh2=Core.prepareBattle(s,NOW+DAY+8000);if(fresh2.isNew){assert.equal(fresh2.exposureMs,1800);assert.equal(fresh2.chosenExposureMs,undefined);}
  // Five struggling answers step back down; steps never go below zero.
  s.battle.question=null;for(let i=0;i<5;i++)answer(s,NOW+DAY+20000+i*8000,{correct:false});
  assert.equal(s.learning.challengePace.steps,1);
  for(let i=0;i<20;i++){s.battle&&(s.battle.heroHealth=10);answer(s,NOW+2*DAY+i*8000,{correct:false});}
  assert.equal(s.learning.challengePace.steps,0);
});
test('challenge pace survives reload, is sanitized, ignores Crawl/demo/interruptions and never slows below the chosen pace',()=>{
  const s=fresh();s.learning.challengePace={steps:3,since:4};assert.deepEqual(reload(s).learning.challengePace,{steps:3,since:4});
  for(const [bad,clean] of [[{steps:99,since:-3},{steps:6,since:0}],[{steps:'x'},{steps:0,since:0}],['nope',null],[null,null]]){
    s.learning.challengePace=bad;assert.deepEqual(reload(s).learning.challengePace,clean);
  }
  assert.equal(Core.challengeExposure(null,4),null,'Crawl stays untimed');assert.equal(Core.challengeExposure(350,6),350,'Fly is never slowed');
  assert.equal(Core.challengeExposure(950,1),800);assert.equal(Core.challengeExposure(950,6),500);assert.equal(Core.challengeExposure(2200,1),1800);
  const t=fresh();t.learning.challengePace={steps:0,since:0};
  answer(t,NOW,{supported:true});assert.equal(t.learning.challengePace.since,0,'interrupted displays do not count');
  answer(t,NOW+8000);assert.equal(t.learning.challengePace.since,1);
  const d=fresh();d.learning.challengePace={steps:2,since:0};Core.startBattle(d,NOW,{demo:true});
  const q=Core.prepareBattle(d,NOW);assert.equal(q.exposureMs,null);q.phase='choices';Core.answerBattle(d,q.target,NOW);assert.deepEqual(d.learning.challengePace,{steps:2,since:0});
});
test('speed XP follows the chosen pace, so automatic speed-ups do not change the XP calibration',()=>{
  const s=fresh();Core.chooseSpeed(s,'walk');s.learning.challengePace={steps:4,since:0};Core.startBattle(s,NOW,{strength:30});
  const q=Core.prepareBattle(s,NOW),w=s.learning.words[q.target];Object.assign(w,{independentCorrect:3,securedAt:new Date(NOW-DAY).toISOString()});
  q.exposureMs=800;q.chosenExposureMs=1800;q.phase='choices';s.rewards.speedHistory={'800':Array(20).fill(true),'1800':Array(20).fill(true)};
  Core.answerBattle(s,q.target,NOW);const rec=s.campaign.battleRecords.at(-1);
  assert.equal(rec.speedXP,0);assert.equal(rec.chosenExposureMs,1800);assert.equal(rec.exposureMs,800);
  assert.equal(s.rewards.speedHistory['800'].length,20,'challenge exposures do not start a separate speed history');
});
