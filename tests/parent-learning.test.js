const test=require('node:test'),assert=require('node:assert/strict'),C=require('../game-core'),Content=require('../content');
const DAY=C.DAY,NOW=new Date(2026,8,24,12).getTime(),at=days=>new Date(NOW+days*DAY).toISOString();
const fresh=()=>C.migrate(C.fresh());
function rec(word,days,correct=true,extra={}){return {id:word+'-'+days,task:'battle',target:word,at:at(days),correct,supported:false,timingValid:true,firstResponse:correct?word:C.byWord[word].d.find(x=>x!==word),exposureMs:950,responseMs:1200,lastHelpAt:null,...extra};}
const metric=(s,word)=>C.parentLearning(s,NOW).words.find(w=>w.word===word);
function archiveAll(s){const limit=C.HISTORY_LIMITS.answers;C.HISTORY_LIMITS.answers=0;try{C.compactHistory(s);}finally{C.HISTORY_LIMITS.answers=limit;}}
test('all 200 curriculum words start New, with no fabricated retention or timing, and reporting is read-only',()=>{
 const s=fresh(),before=C.copy(s),p=C.parentLearning(s,NOW);assert.equal(p.words.length,200);assert.deepEqual(p.words.map(w=>w.word),Content.words.map(w=>w.w));
 assert.deepEqual(p.counts,{new:200,learning:0,secured:0,kept7:0,kept30:0});assert.equal(p.weeks.length,12);assert.ok(p.weeks.every(w=>w.rate===null&&w.words===0&&!w.unknown));assert.deepEqual(p.mixups,[]);assert.deepEqual(p.slowest,[]);assert.deepEqual(s,before);
});
test('map distinguishes introduction, assessment, teaching, secured milestone and actual 7/30-day evidence',()=>{
 const s=fresh();s.learning.words.on.introducedAt=at(-2);s.assessment.records.push(rec('rock',-2));s.learning.teaching.push({target:'tree',at:at(-1)});
 s.learning.words.green.securedAt=at(-10);s.campaign.battleRecords.push(rec('fox',0,true,{retentionGapMs:7*DAY}),rec('cave',0,true,{retentionGapMs:30*DAY}));
 for(const [word,status] of [['on','learning'],['rock','learning'],['tree','learning'],['green','secured'],['fox','kept7'],['cave','kept30'],['water','new']])assert.equal(metric(s,word).status,status);
 s.campaign.battleRecords.push(rec('cave',1,false,{retentionGapMs:DAY}));assert.equal(metric(s,'cave').status,'kept30','highest recorded evidence is retained after a later miss');
});
test('review stage, old age and many same-day successes cannot fabricate retention evidence',()=>{
 const s=fresh();Object.assign(s.learning.words.on,{introducedAt:at(-100),reviewStage:4,independentCorrect:50});
 s.campaign.battleRecords.push(...Array.from({length:10},(_,i)=>rec('on',0,true,{id:String(i),retentionGapMs:0})));
 assert.equal(metric(s,'on').status,'learning');assert.ok(C.parentLearning(s,NOW).weeks.every(w=>w.words===0));
});
test('retention uses at least 24 hours, 7 days and 30 days, with helped/interrupted answers excluded from successes',()=>{
 for(const [gap,status] of [[DAY-1,'learning'],[DAY,'learning'],[7*DAY-1,'learning'],[7*DAY,'kept7'],[30*DAY-1,'kept7'],[30*DAY,'kept30']]){
  const s=fresh();s.campaign.battleRecords.push(rec('on',0,true,{retentionGapMs:gap}));assert.equal(metric(s,'on').status,status);assert.equal(C.parentLearning(s,NOW).weeks[0].words,gap>=DAY?1:0);
 }
 for(const extra of [{supported:true},{correct:false},{timingValid:false},{supportReasons:['interrupted-exposure']}]){
  const s=fresh();s.campaign.battleRecords.push(rec('on',0,true,{retentionGapMs:30*DAY,...extra}));assert.equal(metric(s,'on').status,'learning');assert.equal(C.parentLearning(s,NOW).weeks[0].correct,0);
 }
});
test('weekly rates count each word first qualifying answer once; retries and extra successful days cannot repair it',()=>{
 const s=fresh();s.campaign.battleRecords.push(rec('on',-3,false,{retentionGapMs:DAY}),rec('on',-2,true,{retentionGapMs:DAY}),rec('on',-1,true,{retentionGapMs:DAY}),rec('rock',0,true,{retentionGapMs:DAY}),rec('tree',0,true,{retentionGapMs:DAY,supported:true}));
 const w=C.parentLearning(s,NOW).weeks[0];assert.equal(w.words,3);assert.equal(w.correct,1);assert.equal(w.rate,1/3);
 const before=C.parentLearning(s,NOW);archiveAll(s);const after=C.parentLearning(C.migrate(s),NOW);assert.deepEqual(after.weeks,before.weeks);assert.equal(metric(s,'on').answers,3);
});
test('local Monday boundaries work across a Sunday and across daylight-saving changes',()=>{
 const old=process.env.TZ;process.env.TZ='America/New_York';try{
  assert.equal(C.weekKey(new Date(2026,2,8,23).getTime()),'2026-03-02');assert.equal(C.weekKey(new Date(2026,2,9,0).getTime()),'2026-03-09');
  const s=fresh();s.campaign.battleRecords.push(rec('on',0,true,{at:new Date(2026,2,8,23).toISOString(),retentionGapMs:DAY}),rec('on',0,false,{at:new Date(2026,2,9,1).toISOString(),retentionGapMs:DAY}));
  const p=C.parentLearning(s,new Date(2026,2,10,12).getTime());assert.equal(p.weeks[0].week,'2026-03-09');assert.equal(p.weeks[0].rate,0);assert.equal(p.weeks[1].rate,1);
 }finally{if(old===undefined)delete process.env.TZ;else process.env.TZ=old;}
});
test('stored local week survives a later device time-zone change',()=>{
 const s=fresh();s.campaign.battleRecords.push(rec('on',0,true,{retentionGapMs:DAY,retentionWeek:'2026-09-14'}));assert.equal(C.parentLearning(s,NOW).weeks[1].correct,1);assert.equal(C.parentLearning(s,NOW).weeks[0].words,0);
});
test('legacy answer timestamps alone cannot establish a reliable gap or invent kept evidence',()=>{
 const s=fresh();s.campaign.battleRecords.push(rec('on',-30),rec('on',0));assert.equal(metric(s,'on').status,'learning');assert.equal(C.parentLearning(s,NOW).weeks[0].unknown,true);
 assert.equal(metric(s,'on').answers,2);assert.equal(metric(s,'on').correct,2);
});
test('old compacted gap totals remain intact but cannot invent each week\'s first word checks or retained milestones',()=>{
 let s=fresh();s.campaign.battleRecords.push(rec('on',-30),rec('on',0));archiveAll(s);
 delete s.archive.parentEvidence;delete s.archive.words.on.kept7At;delete s.archive.words.on.kept30At;const totals=C.copy(s.archive.words.on);
 s=C.migrate(s);assert.deepEqual(s.archive.words.on,totals);assert.equal(metric(s,'on').status,'learning');assert.equal(C.parentLearning(s,NOW).weeks[0].unknown,true);assert.equal(C.parentLearning(s,NOW).weeks[0].rate,null);
 s.campaign.battleRecords.push(rec('rock',0,true,{retentionGapMs:DAY}));assert.equal(C.parentLearning(s,NOW).weeks[0].rate,null,'missing old first checks cannot turn into 100%');
 const again=C.migrate(s);assert.deepEqual(C.parentLearning(again,NOW),C.parentLearning(s,NOW));
});
test('raw + archive totals, mix-ups, letter positions, average times and quick markers survive compaction exactly',()=>{
 let s=fresh();s.campaign.battleRecords.push(rec('rock',-3,false,{firstResponse:'rack',responseMs:2100}),rec('rock',-2,false,{firstResponse:'rack',responseMs:3100}),rec('rock',0,true,{responseMs:1100,retentionGapMs:DAY}),rec('tree',0,false,{firstResponse:'free',responseMs:4200}),rec('tree',0,false,{firstResponse:'?',supported:true,responseMs:5000}));
 s.learning.teaching.push({target:'rock',at:at(-2)});s.learning.supportExposures.push({target:'rock',kind:'correction',at:at(-2)});
 const p=C.parentLearning(s,NOW),rock=p.words.find(w=>w.word==='rock');assert.deepEqual(p.mixups[0],{word:'rock',chosen:'rack',count:2});assert.deepEqual(p.positions,{start:1,middle:2,end:0,vowel:2,consonant:1});
 assert.equal(rock.answers,3);assert.equal(rock.independent,3);assert.equal(rock.correct,1);assert.equal(rock.quick,true);assert.equal(rock.quickAnswers,1);assert.equal(rock.averageMs,2100);assert.equal(rock.teaching,1);assert.equal(rock.support,1);assert.equal(p.slowest[0].word,'tree');assert.equal(p.slowest[0].timed,1);
 archiveAll(s);s=C.migrate(s);const after=C.parentLearning(s,NOW);assert.deepEqual(after.mixups,p.mixups);assert.deepEqual(after.positions,p.positions);assert.deepEqual(after.slowest,p.slowest);assert.deepEqual(after.weeks,p.weeks);
 assert.deepEqual(after.words.map(({archivedAnswers,...w})=>w),p.words.map(({archivedAnswers,...w})=>w));
});
test('helped, interrupted, zero, negative and missing times do not enter the slow-word list',()=>{
 const s=fresh();for(const extra of [{supported:true},{timingValid:false},{responseMs:0},{responseMs:-2},{responseMs:null}])s.campaign.battleRecords.push(rec('rock',0,true,extra));
 assert.deepEqual(C.parentLearning(s,NOW).slowest,[]);assert.equal(metric(s,'rock').quickAnswers,0);
});
test('word history includes retained practice, assessment, demo, teaching and help, sorted newest first',()=>{
 const s=fresh();s.campaign.battleRecords.push(rec('on',-3),rec('on',-2,true,{task:'demoBattle'}),rec('rock',0));s.assessment.records.push(rec('on',-4,true,{task:'assessment'}));s.learning.teaching.push({target:'on',at:at(-1)});s.learning.supportExposures.push({target:'on',at:at(0),kind:'correction-replay'});
 const events=C.parentWordHistory(s,'on');assert.deepEqual(events.map(e=>e.kind),['Help','Teaching','Demo','Practice','Reading check']);assert.equal(metric(s,'on').answers,1);assert.deepEqual(C.parentWordHistory(s,'not-a-target'),[]);
 archiveAll(s);assert.equal(C.parentWordHistory(s,'on').some(e=>e.kind==='Practice'),false);assert.equal(metric(s,'on').archivedAnswers,1);
});
test('new questions snapshot time since the most recent answer/help, and reopening cannot extend that gap',()=>{
 const s=fresh();s.assessment.done=true;s.learning.words.on.familiar=true;s.learning.words.on.lastSeenAt=at(-30);s.learning.words.on.lastHelpAt=at(-2);
 C.startBattle(s,NOW);const q=C.prepareBattle(s,NOW,()=>0);assert.equal(q.target,'on');assert.equal(q.retentionGapMs,2*DAY);
 let saved=C.migrate(s);assert.equal(C.prepareBattle(saved,NOW+30*DAY).retentionGapMs,2*DAY);saved.battle.question.phase='choices';saved.battle.question.responseMs=1000;
 const r=C.answerBattle(saved,'on',NOW+30*DAY);assert.equal(r.retentionGapMs,2*DAY);assert.equal(metric(saved,'on').status,'learning');
});
test('an old pending question with no gap snapshot does not fabricate a long-gap check on resume',()=>{
 const s=fresh();s.assessment.done=true;C.startBattle(s,NOW);const q=C.prepareBattle(s,NOW);delete q.retentionGapMs;q.phase='choices';q.responseMs=1000;
 C.answerBattle(s,q.target,NOW+30*DAY);const r=s.campaign.battleRecords.at(-1);assert.equal(r.retentionGapMs,null);assert.equal(metric(s,q.target).status,'learning');
});
test('assessment exposure and a later help exposure both constrain a new question\'s gap',()=>{
 const s=fresh();s.assessment.done=true;s.assessment.records.push(rec('on',-2,true,{task:'assessment'}));s.learning.words.on.lastSeenAt=at(-30);C.startBattle(s,NOW);
 assert.equal(C.prepareBattle(s,NOW,()=>0).retentionGapMs,2*DAY);
});
test('reporting an existing archive and pending question is read-only and preserves rewards, settings and data',()=>{
 const s=fresh();s.assessment.done=true;s.campaign.battleRecords.push(rec('on',0,true,{retentionGapMs:30*DAY}));archiveAll(s);C.startBattle(s,NOW);C.prepareBattle(s,NOW);const before=C.copy(s);
 C.parentLearning(s,NOW);C.parentWordHistory(s,'on');assert.deepEqual(s,before);
});
test('a first retained answer date is not presented as a known introduction date',()=>{
 const s=fresh();s.campaign.battleRecords.push(rec('on',0));assert.equal(metric(s,'on').introducedAt,null);assert.equal(metric(s,'on').firstAt,at(0));
});
