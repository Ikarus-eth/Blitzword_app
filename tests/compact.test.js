const test=require('node:test');
const assert=require('node:assert/strict');
const Core=require('../game-core.js');
const Content=require('../content.js');
const DAY=Core.DAY,START=new Date(2026,0,1,12).getTime();

// The calibration play loop with a realistic answer cycle (6 s per reading answer, 6 s per duel answer).
function play(days,minutes,{answerMs=6000,save=null}={}){
  let s=Core.migrate(Core.fresh()),attempt=0,mathAttempt=0,pendingMs=0,pendingId=null,seed=42;
  const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  s.assessment.done=true;s.profile.name='Size test';s.settings.speed='walk';
  const sizes=[];
  for(let day=1;day<=days;day++){
    let elapsed=0,now=START+(day-1)*DAY;
    while(elapsed<minutes*60000){
      if(s.activity==='mathIntro')Core.startMath(s,now);
      if(s.activity==='mathResult')Core.leaveMath(s,now);
      if(s.activity==='summary'||s.session?.completedAt)Core.beginSession(s,now);
      if(s.story.mapPending)s.story.mapPending=false;
      if(!s.battle||s.battle.resolved&&s.activity!=='mathChallenge')Core.startBattle(s,now,{strength:6});
      const math=s.activity==='mathChallenge',q=math?Core.prepareMath(s,random):Core.prepareBattle(s,now,random);
      if(!q)continue;
      if(q.id!==pendingId){pendingId=q.id;pendingMs=math?6000:answerMs;}
      const ms=Math.min(pendingMs,minutes*60000-elapsed);now+=ms;elapsed+=ms;pendingMs-=ms;
      Core.recordTime(s,ms,math?'math':'practice',now);
      if(math&&Core.tickMath(s,ms,now))continue;
      if(pendingMs>0)continue;
      if(math){mathAttempt++;Core.answerMath(s,mathAttempt%10?q.a*q.b:q.options.find(n=>n!==q.a*q.b),now);}
      else{
        attempt++;q.phase='choices';q.responseMs=1200+(attempt%9)*250;
        Core.answerBattle(s,attempt%10?q.target:q.options.find(x=>x!==q.target),now);
        if(!q.correct){Core.startTeaching(s,q.target,'battle',now);Core.leaveTeaching(s,now);}
        Core.prepareBattle(s,now,random);
      }
    }
    // Each day ends with a reload, as on the iPad.
    const text=JSON.stringify(s);sizes.push(text.length);if(save)save(text,day);
    s=Core.migrate(JSON.parse(text));
  }
  return {s,sizes,attempts:attempt,mathAttempts:mathAttempt};
}
function withLimits(limits,fn){
  const saved={...Core.HISTORY_LIMITS};Object.assign(Core.HISTORY_LIMITS,limits);
  try{return fn();}finally{Object.assign(Core.HISTORY_LIMITS,saved);}
}
const count=(list,fn)=>list.reduce((map,item)=>{const key=fn(item);if(key!==undefined)map[key]=(map[key]||0)+1;return map;},{});

test('90 days at 45 minutes a day stay under one million characters, with bounded raw history',()=>{
  const {s,sizes,attempts}=play(90,45);
  assert.ok(attempts>=20000,'the model must answer at a realistic rate: '+attempts);
  assert.ok(Math.max(...sizes)<1000000,'largest daily save: '+Math.max(...sizes));
  const L=Core.HISTORY_LIMITS;
  assert.ok(s.campaign.battleRecords.length<=L.answers);assert.ok(s.learning.teaching.length<=L.teaching);assert.ok(s.learning.supportExposures.length<=L.support);
  assert.ok(s.sessions.length<=L.sessions);assert.ok(s.math.records.length<=L.duels);
  assert.equal(Core.answerCount(s),attempts);
  assert.equal(Core.parentProgress(s).answers,attempts);
  assert.ok(Object.keys(s.archive.days).length>=85);
});

test('compacting an old full-history save keeps progress, rewards, settings and every total',()=>{
  // Build a save the way the app did before compaction: nothing rolled up.
  const {s:full}=withLimits({answers:Infinity,teaching:Infinity,support:Infinity,sessions:Infinity,duels:Infinity},()=>play(14,45));
  const L=Core.HISTORY_LIMITS;
  assert.ok(full.campaign.battleRecords.length>4*L.answers&&full.math.records.length>2*L.duels&&full.sessions.length>L.sessions&&full.learning.teaching.length>L.teaching&&full.learning.supportExposures.length>L.support);
  const original=JSON.parse(JSON.stringify(full)),compact=Core.migrate(JSON.parse(JSON.stringify(full)));
  // Nothing the child earned or the parent set is touched.
  for(const key of ['profile','dragon','story','rewards','settings','timing','assessment','battle','session','result','teaching','handoff'])assert.deepEqual(compact[key],original[key],key);
  assert.deepEqual(compact.learning.words,original.learning.words);assert.equal(compact.learning.sequence,original.learning.sequence);
  assert.deepEqual({...compact.math,records:[]},{...original.math,records:[]});
  assert.equal(compact.dragon.xp,original.dragon.xp);assert.equal(compact.rewards.shield,original.rewards.shield);
  // Parent totals and the answer count are unchanged; raw lists keep the newest entries in order.
  assert.deepEqual(Core.parentProgress(compact,START),Core.parentProgress(original,START));
  assert.equal(Core.answerCount(compact),original.campaign.battleRecords.length);
  assert.deepEqual(compact.campaign.battleRecords,original.campaign.battleRecords.slice(-500));
  assert.deepEqual(compact.math.records,original.math.records.slice(-30));assert.deepEqual(compact.sessions,original.sessions.slice(-50));
  assert.deepEqual(compact.learning.teaching,original.learning.teaching.slice(-200));assert.deepEqual(compact.learning.supportExposures,original.learning.supportExposures.slice(-200));
  // Archived plus raw equals the original, per word, per day, per wrong choice.
  const rolled=original.campaign.battleRecords.slice(0,-500).filter(r=>r.task==='battle'),a=compact.archive;
  assert.deepEqual(Object.fromEntries(Object.entries(a.words).filter(([,w])=>w.answers).map(([word,w])=>[word,w.answers])),count(rolled,r=>r.target));
  assert.deepEqual(Object.fromEntries(Object.entries(a.days).filter(([,d])=>d.answers).map(([day,d])=>[day,d.answers])),count(rolled,r=>Core.dayKey(Date.parse(r.at))));
  for(const [word,w] of Object.entries(a.words))assert.deepEqual(w.wrong,count(rolled.filter(r=>r.target===word&&!r.supported&&!r.correct&&r.firstResponse!=='?'),r=>r.firstResponse),word);
  assert.equal(a.answers.correct,rolled.filter(r=>!r.supported&&r.correct).length);
  assert.equal(a.teaching.events,original.learning.teaching.length-200);assert.equal(a.support.events,original.learning.supportExposures.length-200);
  const oldDuels=original.math.records.slice(0,-30);
  assert.equal(a.duels.count,oldDuels.length);assert.deepEqual(a.duels.list.map(x=>x[1]),oldDuels.map(m=>m.score));
  assert.equal(Object.values(a.duels.facts).reduce((n,f)=>n+f[0],0),oldDuels.reduce((n,m)=>n+m.answers.length,0));
  assert.equal(a.sessions.count,original.sessions.length-50);
  // Loading again changes nothing.
  assert.deepEqual(Core.migrate(JSON.parse(JSON.stringify(compact))),compact);
  assert.ok(JSON.stringify(compact).length<JSON.stringify(original).length/3);
});

test('archived answers keep review results, retention gaps, letter positions and response times',()=>{
  const s=Core.migrate(Core.fresh()),at=(day,minutes=0)=>new Date(START+day*DAY+minutes*60000).toISOString();
  const rec=(target,day,chosen,extra={})=>({task:'battle',target,at:at(day,extra.minutes||0),firstResponse:chosen,correct:chosen===target,supported:false,timingValid:true,
    exposureMs:1800,responseMs:2000,retentionCheck:false,...extra});
  s.campaign.battleRecords.push(
    rec('tree',0,'tree',{responseMs:1400,exposureMs:950}),rec('tree',0,'free',{minutes:5}),   // same day: no gap; wrong at the start
    rec('tree',2,'tree',{retentionCheck:true}),rec('tree',10,'trea',{retentionCheck:true}),       // 2-day gap correct; 8-day gap wrong at the end
    rec('tree',45,'tree',{responseMs:3000}),                                                        // 35-day gap correct
    rec('rock',1,'rack'),rec('rock',1,'?',{supported:true,correct:false,minutes:1}),rec('night',1,'nigth'),
    {task:'demoBattle',target:'on',at:at(0),firstResponse:'on',correct:true,supported:true});
  withLimits({answers:0},()=>Core.compactHistory(s));
  const a=s.archive,tree=a.words.tree,rock=a.words.rock,night=a.words.night;
  assert.equal(s.campaign.battleRecords.length,0);assert.equal(a.answers.records,9);assert.equal(a.answers.battle,8);assert.equal(Core.answerCount(s),9);
  assert.deepEqual([tree.answers,tree.independent,tree.correct],[5,5,3]);assert.deepEqual(tree.reviews,[2,1]);
  assert.deepEqual(tree.gaps,{1:[1,1],7:[1,0],30:[1,1]});assert.equal(tree.firstAt,at(0));assert.equal(tree.lastAt,at(45));
  assert.deepEqual(tree.wrong,{free:1,trea:1});assert.deepEqual(tree.positions,{start:1,middle:0,end:1,vowel:1,consonant:1});
  assert.deepEqual([tree.timed,tree.responseMs,tree.minMs,tree.maxMs,tree.fast],[5,10400,1400,3000,1]);
  assert.deepEqual(rock.wrong,{rack:1});assert.deepEqual(rock.positions,{start:0,middle:1,end:0,vowel:1,consonant:0});assert.equal(rock.helped,1);
  assert.deepEqual(night.positions,{start:0,middle:1,end:1,vowel:0,consonant:2});
  const day0=a.days[Core.dayKey(Date.parse(at(0)))],day10=a.days[Core.dayKey(Date.parse(at(10)))];
  assert.deepEqual([day0.answers,day0.correct,day0.fast,day0.gapChecks],[2,1,1,0]);assert.deepEqual([day10.reviews,day10.reviewsCorrect,day10.gapChecks,day10.gapCorrect],[1,0,1,0]);
  // A word seen only in the archive still counts as previously encountered.
  assert.equal(s.learning.words.rock.lastSeenAt,null);
  s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,START+50*DAY);const q=Core.prepareBattle(s,START+50*DAY);
  Object.assign(q,{target:'rock',options:['rock','rack','ruck','lock'],phase:'choices'});
  assert.equal(Core.answerBattle(s,'rock',START+50*DAY).previouslyEncountered,true);
});

test('rolled duels keep every score and per-fact totals; old sessions keep parent time totals',()=>{
  const s=Core.migrate(Core.fresh());
  s.math.records.push({id:'m1',score:5,correct:6,wrong:1,target:4,beaten:true,xpEarned:6,finishedAt:'2026-01-02T10:00:00.000Z',
    answers:[{a:7,b:8,correct:true},{a:8,b:7,correct:false},{a:3,b:4,correct:true}]});
  s.sessions.push({id:'old',timingVersion:1,elapsedMs:600000,legacyElapsedMs:120000,answers:40,independent:38,correct:35,teaching:2,victories:3},{id:'older',elapsedMs:300000,answers:10});
  const before=Core.parentProgress(s,START);
  withLimits({duels:0,sessions:0},()=>Core.compactHistory(s));
  assert.deepEqual(s.archive.duels.list,[['2026-01-02T10:00:00.000Z',5,6,1,4,1]]);assert.deepEqual(s.archive.duels.facts,{'7x8':[2,1],'3x4':[1,1]});
  assert.deepEqual([s.archive.duels.count,s.archive.duels.correct,s.archive.duels.wrong,s.archive.duels.xpEarned],[1,6,1,6]);
  assert.equal(s.archive.sessions.legacyMs,420000);assert.equal(Core.parentProgress(s,START).legacyMs,before.legacyMs);
});

test('an existing full save compacts on first load; after two saves no full-size copy is left',()=>{
  const {AdventureStore,KEY}=require('../storage.js');
  const {s:full}=withLimits({answers:Infinity,teaching:Infinity,support:Infinity,sessions:Infinity,duels:Infinity},()=>play(5,45));
  const data=new Map([[KEY,JSON.stringify(full)],[KEY+'_backup',JSON.stringify(full)],[KEY+'_legacy_backup','{"legacy":true}']]);
  const mem={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
  const oldText=data.get(KEY),store=new AdventureStore(mem),s=store.load();
  assert.equal(s.campaign.battleRecords.length,Core.HISTORY_LIMITS.answers);assert.equal(Core.answerCount(s),full.campaign.battleRecords.length);
  store.save(s);assert.ok(data.get(KEY).length<oldText.length/2);assert.equal(data.get(KEY+'_backup'),oldText);
  store.save(s);assert.ok(data.get(KEY+'_backup').length<oldText.length/2);assert.equal(data.get(KEY+'_legacy_backup'),'{"legacy":true}');
  const again=new AdventureStore(mem).load();assert.equal(again.dragon.xp,full.dragon.xp);assert.deepEqual(Core.parentProgress(again,START),Core.parentProgress(full,START));
});

test('near the storage limit, the first compacted save still fits and frees space',()=>{
  const {AdventureStore,KEY}=require('../storage.js');
  const {s:full}=withLimits({answers:Infinity,teaching:Infinity,support:Infinity,sessions:Infinity,duels:Infinity},()=>play(5,45));
  const older=JSON.parse(JSON.stringify(full));older.campaign.battleRecords.splice(-40);older.revision=full.revision-1;
  const mainText=JSON.stringify(full),backupText=JSON.stringify(older),data=new Map([[KEY,mainText],[KEY+'_backup',backupText]]);
  const used=()=>[...data].reduce((n,[k,v])=>n+k.length+v.length,0),limit=used()+100;
  const mem={getItem:k=>data.get(k)??null,removeItem:k=>data.delete(k),setItem:(k,v)=>{
    const size=used()-(data.has(k)?k.length+data.get(k).length:0)+k.length+String(v).length;
    if(size>limit)throw new DOMException('The quota has been exceeded.','QuotaExceededError');data.set(k,String(v));}};
  // Copying the full save to _backup before writing the compact save cannot fit.
  assert.ok(used()-backupText.length+mainText.length>limit);
  const store=new AdventureStore(mem),s=store.load();store.save(s);
  assert.ok(data.get(KEY).length<mainText.length/2);assert.equal(data.get(KEY+'_backup'),mainText);
  store.save(s);assert.ok(used()<limit/2);assert.equal(new AdventureStore(mem).load().dragon.xp,full.dragon.xp);
});
