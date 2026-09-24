const test=require('node:test'),assert=require('node:assert/strict'),C=require('../game-core'),Content=require('../content');
const NOW=Date.UTC(2026,8,24),WORDS=Content.words.slice(0,20).map(w=>w.w);
function learner(speed='walk'){
 const s=C.migrate(C.fresh());s.assessment.done=true;if(speed)C.chooseSpeed(s,speed);
 for(const w of Object.values(s.learning.words))Object.assign(w,{familiar:true,introducedAt:new Date(NOW-C.DAY).toISOString()});
 C.startBattle(s,NOW,{strength:100});s.battle.heroHealth=100;return s;
}
function answer(s,{word=WORDS[s.learning.sequence%20],correct=true,exposureMs=C.practiceExposure(s),responseMs=1100,support=[],familiar=true,task='battle'}={}){
 const q=C.prepareBattle(s,NOW+s.learning.sequence*10000);q.target=word;q.options=[...C.byWord[word].d];q.phase='choices';q.exposureMs=exposureMs;q.responseMs=responseMs;q.supportReasons=support;q.isNew=false;
 s.learning.words[word].familiar=familiar;s.battle.demo=task==='demo';
 const result=C.answerBattle(s,correct?word:q.options.find(x=>x!==word),NOW+s.learning.sequence*10000);s.battle.demo=false;return result;
}
function window(s,misses=0){for(let i=0;i<20;i++)answer(s,{word:WORDS[i],correct:i>=misses});}
function finish(s){s.battle.enemyHealth=0;C.resolveBattle(s,NOW+400000);return s.result?.speedSuggestion;}
test('seven movement steps include Stride/Jog and retain only Ride/Fly locks',()=>{
 const s=learner();assert.deepEqual(C.speedChoices(s).map(x=>[x.id,x.ms]),[['crawl',null],['walk',1800],['stride',1500],['jog',1200],['run',950],['ride',600],['fly',350]]);
 for(const [id,ms] of [['stride',1500],['jog',1200]]){const q=C.copy(s.battle.question);assert.ok(C.chooseSpeed(s,id));assert.equal(C.practiceExposure(C.migrate(s)),ms);assert.deepEqual(s.battle.question,q);}
 assert.deepEqual(C.speedChoices(s).filter(x=>x.locked).map(x=>x.id),['ride','fly']);
});
test('twenty familiar independent answers produce a saved, voluntary, one-step offer only at a battle boundary',()=>{
 let s=learner();for(let i=0;i<19;i++)answer(s);assert.equal(C.speedSuggestion(s),null);
 answer(s);assert.equal(s.result,null);assert.equal(s.settings.speed,'walk');assert.equal(C.respondSpeedSuggestion(s,true),false);
 const offer=finish(s);assert.equal(offer.to,'stride');assert.equal(offer.correct,20);assert.equal(offer.status,'pending');assert.equal(s.learning.speedPractice.sinceOffer,0);
 s=C.migrate(C.copy(s));assert.deepEqual(s.result.speedSuggestion,offer);const pending=C.copy(s.battle.question);
 assert.ok(C.respondSpeedSuggestion(s,true));assert.equal(C.practiceExposure(s),1500);assert.deepEqual(s.battle.question,pending);assert.equal(s.result.speedSuggestion.status,'accepted');assert.equal(C.respondSpeedSuggestion(s,true),false);
 C.startBattle(s,NOW);assert.equal(C.prepareBattle(s,NOW).exposureMs,1500);
});
test('decline survives reopening and twenty fresh answers are needed before another offer',()=>{
 let s=learner();window(s);finish(s);assert.ok(C.respondSpeedSuggestion(s,false));s=C.migrate(s);assert.equal(s.result.speedSuggestion.status,'declined');assert.equal(C.practiceExposure(s),1800);assert.equal(C.speedSuggestion(s),null);
 C.startBattle(s,NOW,{strength:100});for(let i=0;i<19;i++)answer(s);assert.equal(C.speedSuggestion(s),null);answer(s);assert.equal(finish(s).to,'stride');
});
for(const misses of [0,1,2,3,4,5,6])test('twenty-answer threshold: '+misses+' spread-out misses',()=>{
 const s=learner('jog');window(s,misses);const suggestion=C.speedSuggestion(s);
 assert.equal(suggestion?.direction??null,misses<2?'faster':misses>4?'slower':null);
 if(suggestion)assert.equal(suggestion.to,misses<2?'run':'stride');
});
test('errors concentrated on one or two words defer a slower offer to existing word support',()=>{
 for(const words of [[WORDS[0]],[WORDS[0],WORDS[1]]]){
  const s=learner('jog');for(let i=0;i<6;i++)answer(s,{word:words[i%words.length],correct:false});for(let i=0;i<14;i++)answer(s,{word:WORDS[i+2]});
  assert.equal(C.speedSuggestion(s),null);assert.ok(s.learning.supportExposures.some(r=>r.target===WORDS[0]&&r.kind==='correction'));assert.ok(s.learning.words[WORDS[0]].consecutiveMisses>=2);
 }
});
test('new, helped, interrupted, demo and faster-refill answers do not calibrate the selected pace',()=>{
 const s=learner();
 for(let i=0;i<20;i++)answer(s,{word:WORDS[i],familiar:false});assert.equal(s.learning.speedPractice.recent.length,0);
 for(const options of [{support:['help-request']},{support:['interrupted-exposure']},{task:'demo'},{exposureMs:1500}])for(let i=0;i<20;i++)answer(s,options);
 assert.equal(C.speedSuggestion(s),null);assert.equal(s.learning.speedPractice.recent.length,0);
 window(s);assert.equal(C.speedSuggestion(s).to,'stride');
});
test('a word becomes familiar for future answers after two unaided successes',()=>{
 const s=learner();const word=WORDS[0];answer(s,{word,familiar:false});answer(s,{word,familiar:false});assert.equal(s.learning.speedPractice.recent.length,0);
 const r=answer(s,{word,familiar:false});assert.equal(r.familiarBefore,true);assert.equal(s.learning.speedPractice.recent.length,1);
});
test('changing pace resets evidence and dismisses a pending offer; selecting the same pace does not discard evidence',()=>{
 const s=learner();window(s);C.chooseSpeed(s,'walk');assert.equal(s.learning.speedPractice.recent.length,20);finish(s);C.chooseSpeed(s,'jog');
 assert.equal(s.result.speedSuggestion.status,'dismissed');assert.equal(s.learning.speedPractice.recent.length,0);assert.equal(C.respondSpeedSuggestion(s,true),false);
});
test('nudges respect Crawl, the 2200 ms reading-check pace, and the paid locks',()=>{
 let s=learner('crawl');window(s);assert.equal(C.speedSuggestion(s).to,'walk');
 s=learner(null);s.assessment.exposure=2200;window(s);assert.equal(C.speedSuggestion(s).to,'walk');
 s=learner(null);s.assessment.exposure=2200;window(s,5);assert.equal(C.speedSuggestion(s).to,'crawl');
 s=learner('walk');window(s,5);assert.equal(C.speedSuggestion(s).to,'crawl');
 s=learner('run');window(s);assert.equal(C.speedSuggestion(s),null);s.dragon.stage=3;s.story.chapterComplete=true;s.entitlements={expansion:true};assert.equal(C.speedSuggestion(s).to,'ride');
 C.chooseSpeed(s,'fly');window(s);assert.equal(C.speedSuggestion(s),null);
});
test('new nudge evidence stays bounded through large histories and repeated migrations',()=>{
 let s=learner();for(let i=0;i<550;i++){if(s.battle.resolved||s.battle.enemyHealth<=0){C.startBattle(s,NOW,{strength:100});}answer(s);}
 assert.equal(s.learning.speedPractice.recent.length,20);assert.equal(s.learning.speedPractice.sinceOffer,20);assert.equal(s.campaign.battleRecords.length,500);
 const p=C.copy(s.learning.speedPractice);s=C.migrate(C.migrate(s));assert.deepEqual(s.learning.speedPractice,p);
 delete s.learning.speedPractice;for(const r of s.campaign.battleRecords)delete r.familiarBefore;s=C.migrate(s);assert.equal(C.speedSuggestion(s),null);
});
test('quick evidence requires a correct, unaided, valid positive response under 1500 ms at Run or faster',()=>{
 const base={task:'battle',correct:true,supported:false,timingValid:true,exposureMs:950,responseMs:1499};assert.equal(C.quickAnswer(base),true);
 for(const ms of [600,350])assert.ok(C.quickAnswer({...base,exposureMs:ms}));
 for(const change of [{task:'demoBattle'},{task:'assessment'},{correct:false},{supported:true},{timingValid:false},...[null,0,-1,NaN,Infinity,1500,1501].map(responseMs=>({responseMs})),...[null,0,-1,NaN,Infinity,1200,1800].map(exposureMs=>({exposureMs}))])assert.equal(C.quickAnswer({...base,...change}),false,JSON.stringify(change));
});
test('per-word quick markers and counts survive raw-history compaction and old-save migration without fabricated data',()=>{
 let s=learner('run');const quick=WORDS[0],slow=WORDS[1];answer(s,{word:quick});answer(s,{word:slow,responseMs:1500});
 assert.equal(C.wordSpeeds(s).find(w=>w.word===quick).quick,true);assert.equal(C.wordSpeeds(s).find(w=>w.word===slow).quick,false);
 const raw=C.copy(s.campaign.battleRecords);s.campaign.battleRecords.push(...Array.from({length:501},(_,i)=>({...raw[1],id:'older-'+i})));
 C.compactHistory(s);s=C.migrate(C.copy(s));assert.equal(s.archive.words[quick].fast,1);assert.equal(C.wordSpeeds(s).find(w=>w.word===quick).quickAnswers,1);assert.equal(C.wordSpeeds(s).find(w=>w.word===slow).quickAnswers,0);
 assert.deepEqual(C.parentProgress(s).wordSpeeds,C.wordSpeeds(s));assert.deepEqual(C.wordSpeeds(C.migrate(s)),C.wordSpeeds(s));
});
test('accurate slow words remain scheduled for review and a quick answer never removes that schedule',()=>{
 const s=learner('run'),word=WORDS[0];answer(s,{word,responseMs:2000});answer(s,{word,responseMs:2000});
 const w=s.learning.words[word];assert.equal(w.reviewStage,0);assert.ok(w.dueAt>NOW);assert.equal(C.wordSpeeds(s).find(r=>r.word===word).quick,false);
 const due=w.dueAt;answer(s,{word,responseMs:1000});assert.equal(C.wordSpeeds(s).find(r=>r.word===word).quick,true);assert.equal(w.dueAt,due);
 for(const other of Object.values(s.learning.words))other.eligibleAfter=0;s.learning.recent=[];
 const q=C.prepareBattle(s,due);assert.equal(q.target,word);assert.equal(q.retentionDue,true);
});
test('old raw slow answers appear in Parents even without per-word counters',()=>{
 const s=C.migrate(C.fresh());s.campaign.battleRecords.push({task:'battle',target:WORDS[0],correct:true,supported:false,exposureMs:1800,responseMs:2000});
 assert.deepEqual(C.wordSpeeds(C.migrate(s)),[{word:WORDS[0],quickAnswers:0,quick:false}]);
});
test('returning from Crawl to the reading-check default preserves the pending question and starts fresh evidence',()=>{
 const s=learner('crawl');s.assessment.exposure=1500;C.prepareBattle(s,NOW);const q=C.copy(s.battle.question);window(s);const pending=C.copy(s.battle.question);
 assert.ok(C.chooseSpeed(s,null));assert.equal(C.practiceExposure(s),1500);assert.equal(s.learning.speedPractice.recent.length,0);assert.deepEqual(s.battle.question,pending);assert.equal(q.exposureMs,null);
});
