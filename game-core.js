(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./content.js'));
  else root.BlitzCore = factory(root.BlitzContent);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(Content) {
  'use strict';
  const DAY = 86400000;
  const GAPS = [1,3,7,14,30];
  const TARGET_MS = 10 * 60 * 1000;
  const XP_MULTIPLIER = 1.75, DAILY_XP = 20;
  // Raw history kept in the save. Older entries roll into s.archive totals so the save stays small.
  const HISTORY_LIMITS = {answers:500,teaching:200,support:200,sessions:50,duels:30};
  const GAP_DAYS = [1,3,7,14,30];
  const byWord = Object.fromEntries([...Content.words,...Content.legacyWords].map(item => [item.w,item]));
  const iso = now => new Date(now).toISOString();
  const copy = value => JSON.parse(JSON.stringify(value));
  function fresh() {
    return {schemaVersion:2, xpRulesVersion:1, chapterRulesVersion:1, revision:0, nextId:1,
      profile:{name:'',age:7,gender:'boy',heroClass:'Mage',heroIndex:0},
      assessment:{done:false,records:[],level:0,exposure:1800,lastAxis:'exposure',progress:null},
      learning:{supportedWords:[],teaching:[],supportExposures:[],words:{},sequence:0,recent:[]},
      campaign:{wins:0,checkpointWins:0,enemyStrength:3,battleRecords:[]},
      dragon:{awards:{},stage:0,xp:null,name:'Pip',named:false},story:{clearedAreas:[],chapterComplete:false,completedChapters:[],mapPending:false,chapters:{},dailyChapters:{},scenes:{},scene:null},
      timing:{version:1,days:{},firstPracticeAt:null},
      math:{best:null,winStreak:0,round:null,records:[]},
      rewards:{shield:false,readingWins:0,shieldEarnedAt:null,xpDays:{},speedHistory:{}},
      settings:{selfPaced:false,speed:null,soundscape:true}, activity:'route', screen:'setup', battle:null,
      teaching:null, handoff:null, result:null, session:null, sessions:[], demoComplete:false, archive:archiveBase()};
  }
  function migrate(old) {
    if (!old || typeof old !== 'object' || Array.isArray(old)) throw new Error('Invalid saved adventure');
    const base = fresh();
    const s = {...base,...copy(old)};
    for (const key of ['profile','assessment','learning','campaign','settings','dragon','story','timing','math','rewards']) s[key] = {...base[key],...s[key]};
    s.rewards.shield=s.rewards.shield===true;
    s.rewards.readingWins=Math.max(0,Math.min(3,Number(s.rewards.readingWins)||0));
    // Convert the pending UI only. Keep time, factors, accepted answers and old PRs.
    if(s.math.round){
      const r=s.math.round,q=r.question;
      r.areaId ||= s.battle?.areaId;
      if(!r.inputMode)r.previousInputMode='typed';
      r.inputMode='choice';
      if(q&&!q.options){q.options=mathChoices(q.a,q.b);if(q.phase==='answer'&&q.input){q.legacyInput=q.input;q.input='';}}
    }
    for (const [container,key] of [[s.assessment,'records'],[s.learning,'teaching'],[s.learning,'supportedWords'],[s.learning,'recent'],[s.campaign,'battleRecords'],[s,'sessions']]) {
      if (!Array.isArray(container[key])) throw new Error('Invalid saved records');
    }
    if (old.schemaVersion !== 2) {
      // Retain every v1 observation, checkpoint and profile. v1 never saved an active fight.
      s.learning.sequence = s.campaign.battleRecords.length;
      s.activity = 'route'; s.battle = null; s.result = null; s.teaching = null;
      s.schemaVersion = 2;
    }
    s.learning.words = s.learning.words || {};
    for (const item of Object.values(byWord)) {
      if (!s.learning.words[item.w]) {
        const evidence = s.assessment.records.filter(r => r.target === item.w);
        const oldHelp = s.learning.teaching.filter(r => r.target === item.w).at(-1);
        s.learning.words[item.w] = {familiar:evidence.some(r => r.correct && !r.supported),
          assessmentMiss:evidence.some(r => !r.correct), introducedAt:null, lastSeenAt:null,
          lastHelpAt:oldHelp ? oldHelp.at : null, lastSequence:-1, eligibleAfter:0,
          independentCorrect:0, practiceSuccesses:0, consecutiveMisses:0,
          reviewStage:-1, dueAt:0, observations:0};
      }
    }
    // Previous timing counted foreground waiting. Preserve it as legacy, never verified play.
    if(s.session&&!s.session.timingVersion){s.session.legacyElapsedMs=s.session.elapsedMs||0;s.session.elapsedMs=0;s.session.timingVersion=1;}
    if(!Number.isFinite(s.dragon.xp)){
      const historical={};
      for(const record of s.campaign.battleRecords){
        if(record.task==='battle'&&record.correct===true&&record.supported===false&&typeof record.target==='string')historical[record.target]=Math.min(2,(historical[record.target]||0)+1);
      }
      for(const [word,count] of Object.entries(historical))s.dragon.awards[word]=Math.max(s.dragon.awards[word]||0,count);
      s.dragon.xp=Object.values(s.dragon.awards).reduce((sum,count)=>sum+Math.min(2,count)*5,0);
    }
    if(!s.timing.firstPracticeAt){
      const dates=s.campaign.battleRecords.filter(r=>r.task==='battle'&&Number.isFinite(Date.parse(r.at))).map(r=>r.at).sort();
      if(dates.length)s.timing.firstPracticeAt=dates[0];
    }
    if(s.story.chapterComplete&&!s.story.completedChapters.includes('chapter-1'))s.story.completedChapters.push('chapter-1');
    s.story.chapters ||= {};s.story.dailyChapters ||= {};s.story.scenes ||= {};s.rewards.xpDays ||= {};s.rewards.speedHistory ||= {};
    if(s.battle&&s.battle.xpEarned===undefined){
      const reading=s.campaign.battleRecords.filter(r=>r.battleId===s.battle.id).reduce((n,r)=>n+(r.xpEarned||0),0);
      const math=s.math.round?.battleId===s.battle.id?s.math.round.correct:s.math.records.filter(r=>r.battleId===s.battle.id).reduce((n,r)=>n+(r.xpEarned??r.correct),0);
      s.battle.xpEarned=reading+math;if(s.result?.battleId===s.battle.id)s.result.xpEarned=s.battle.xpEarned;
    }
    s.dragon.name=cleanDragonName(s.dragon.name)||'Pip';s.dragon.named=s.dragon.named===true;
    if(old.xpRulesVersion!==1){
      // Preserve existing totals and already-earned forms; never reprice historical answers.
      for(const w of Object.values(s.learning.words))if(w.independentCorrect>=3){w.securedAt=w.lastSeenAt||iso(Date.now());w.wordXPClaimed=true;}
      s.xpRulesVersion=1;
    }
    if(old.chapterRulesVersion!==1){
      // Completed fields are grandfathered. Unattributable old minutes are not fabricated.
      s.chapterRulesVersion=1;
      for(const a of Content.areas){const wins=Math.max(0,Math.min(2,s.campaign.wins-(a.checkpoint-2)));if(wins&&!s.story.clearedAreas.includes(a.id))chapterState(s,a.id).wins=wins;}
    }
    archiveOf(s);compactHistory(s);
    syncProgress(s);
    return s;
  }
  // Totals for history rolled out of the raw lists: everything point 8 needs, per day and per word.
  function archiveBase(){
    return {version:1,answers:{records:0,battle:0,independent:0,correct:0,helped:0},days:{},words:{},teaching:{events:0},support:{events:0,kinds:{}},
      sessions:{count:0,answers:0,independent:0,correct:0,teaching:0,victories:0,elapsedMs:0,legacyMs:0},
      duels:{count:0,correct:0,wrong:0,xpEarned:0,columns:['at','score','correct','wrong','target','beaten'],list:[],facts:{}}};
  }
  function archiveOf(s){
    const base=archiveBase(),record=value=>value&&typeof value==='object'&&!Array.isArray(value),old=record(s.archive)?s.archive:{};
    const a={...base,...old};
    for(const key of ['answers','teaching','support','sessions','duels'])a[key]={...base[key],...(record(old[key])?old[key]:{})};
    for(const key of ['days','words'])if(!record(a[key]))a[key]={};
    if(!record(a.support.kinds))a.support.kinds={};if(!Array.isArray(a.duels.list))a.duels.list=[];if(!record(a.duels.facts))a.duels.facts={};
    return s.archive=a;
  }
  function archiveDay(a,at){
    const time=Date.parse(at),key=Number.isFinite(time)?dayKey(time):'unknown';
    return a.days[key] ||= {answers:0,independent:0,correct:0,helped:0,reviews:0,reviewsCorrect:0,gapChecks:0,gapCorrect:0,timed:0,responseMs:0,fast:0,teaching:0};
  }
  function archiveWord(a,word){
    return a.words[word] ||= {answers:0,independent:0,correct:0,helped:0,firstAt:null,lastAt:null,wrong:{},positions:{start:0,middle:0,end:0,vowel:0,consonant:0},
      timed:0,responseMs:0,minMs:null,maxMs:null,fast:0,reviews:[0,0],gaps:{},teaching:0,support:0};
  }
  function rollAnswer(a,r){
    a.answers.records++;
    if(r.task!=='battle'||typeof r.target!=='string')return;
    const independent=!r.supported,correct=independent&&r.correct===true,d=archiveDay(a,r.at),w=archiveWord(a,r.target),time=Date.parse(r.at),last=Date.parse(w.lastAt);
    a.answers.battle++;if(independent)a.answers.independent++;else a.answers.helped++;if(correct)a.answers.correct++;
    for(const t of [d,w]){t.answers++;if(independent)t.independent++;else t.helped++;if(correct)t.correct++;}
    if(r.retentionCheck){d.reviews++;w.reviews[0]++;if(correct){d.reviewsCorrect++;w.reviews[1]++;}}
    // First answer after at least a day away: retention by gap length (1, 3, 7, 14, 30+ days).
    if(Number.isFinite(time)&&Number.isFinite(last)&&time-last>=DAY){
      const bucket=w.gaps[GAP_DAYS.filter(n=>time-last>=n*DAY).at(-1)] ||= [0,0];bucket[0]++;d.gapChecks++;if(correct){bucket[1]++;d.gapCorrect++;}
    }
    w.firstAt ||= r.at;w.lastAt=r.at;
    if(independent&&r.timingValid!==false&&Number.isFinite(r.responseMs)&&r.responseMs>0){
      for(const t of [d,w]){t.timed++;t.responseMs+=r.responseMs;}
      w.minMs=w.minMs===null?r.responseMs:Math.min(w.minMs,r.responseMs);w.maxMs=Math.max(w.maxMs??0,r.responseMs);
    }
    if(correct&&r.timingValid!==false&&Number.isFinite(r.exposureMs)&&r.exposureMs<=950&&r.responseMs<1500){d.fast++;w.fast++;}
    if(independent&&r.correct===false&&typeof r.firstResponse==='string'&&r.firstResponse!=='?'){
      const target=r.target,chosen=r.firstResponse;w.wrong[chosen]=(w.wrong[chosen]||0)+1;
      for(let i=0;i<Math.max(target.length,chosen.length);i++)if(target[i]!==chosen[i]){
        w.positions[i===0?'start':i>=target.length-1?'end':'middle']++;w.positions[/[aeiou]/.test(target[i]??chosen[i])?'vowel':'consonant']++;
      }
    }
  }
  function rollTeaching(a,e){a.teaching.events++;archiveDay(a,e.at).teaching++;if(typeof e.target==='string')archiveWord(a,e.target).teaching++;}
  function rollSupport(a,x){a.support.events++;a.support.kinds[x.kind]=(a.support.kinds[x.kind]||0)+1;if(typeof x.target==='string')archiveWord(a,x.target).support++;}
  function rollSession(a,x){
    const t=a.sessions;t.count++;for(const key of ['answers','independent','correct','teaching','victories','elapsedMs'])t[key]+=Number(x[key])||0;
    t.legacyMs+=x.timingVersion?Number(x.legacyElapsedMs)||0:Number(x.elapsedMs)||0;
  }
  function rollDuel(a,m){
    const t=a.duels;t.count++;t.correct+=Number(m.correct)||0;t.wrong+=Number(m.wrong)||0;t.xpEarned+=Number(m.xpEarned??m.correct)||0;
    t.list.push([m.finishedAt||m.startedAt||null,m.score??null,Number(m.correct)||0,Number(m.wrong)||0,m.target??null,m.beaten?1:0]);
    for(const x of Array.isArray(m.answers)?m.answers:[])if(Number.isFinite(x.a)&&Number.isFinite(x.b)){
      const fact=t.facts[Math.min(x.a,x.b)+'x'+Math.max(x.a,x.b)] ||= [0,0];fact[0]++;if(x.correct)fact[1]++;
    }
  }
  // Keep the newest raw entries; roll the oldest into the archive in order. Lists keep their identity.
  function compactHistory(s){
    const roll=(list,limit,into)=>{if(!Array.isArray(list)||list.length<=limit)return;const a=archiveOf(s);for(const item of list.splice(0,list.length-limit))into(a,item);};
    roll(s.campaign.battleRecords,HISTORY_LIMITS.answers,rollAnswer);roll(s.learning.teaching,HISTORY_LIMITS.teaching,rollTeaching);
    roll(s.learning.supportExposures,HISTORY_LIMITS.support,rollSupport);roll(s.sessions,HISTORY_LIMITS.sessions,rollSession);roll(s.math.records,HISTORY_LIMITS.duels,rollDuel);
    return s;
  }
  // Every answer ever given, including those rolled into the archive.
  function answerCount(s){return (s.archive?.answers?.records||0)+s.campaign.battleRecords.length;}
  function id(s, prefix) { return prefix + '-' + s.nextId++; }
  function shuffle(options, random=Math.random) {
    const a = [...options];
    for (let i=a.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function beginSession(s, now) {
    if (s.session && !s.session.completedAt) return s.session;
    s.session = {id:id(s,'session'),startedAt:iso(now),elapsedMs:0,targetMs:TARGET_MS,timingVersion:1,
      newWords:[],answers:0,independent:0,correct:0,teaching:0,victories:0,completedAt:null};
    return s.session;
  }
  function completeSession(s, now) {
    if (!s.session || s.session.completedAt) return;
    s.session.completedAt = iso(now);
    s.sessions.push(copy(s.session));compactHistory(s);
    s.activity = 'summary';
  }
  function dayKey(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function bonusProgress(s,now=Date.now()){
    const d=s.timing.days[dayKey(now)]||{},activeMs=(d.practice||0)+(d.math||0);
    return {activeMs,active:activeMs>=TARGET_MS,multiplier:activeMs>=TARGET_MS?XP_MULTIPLIER:1,remainingMs:Math.max(0,TARGET_MS-activeMs),chapters:s.story.dailyChapters?.[dayKey(now)]||0};
  }
  function awardXP(s,base,kind,now,{boost=false}={}){
    const extra=boost&&bonusProgress(s,now).active?base*(XP_MULTIPLIER-1):0,amount=base+extra;
    s.dragon.xp+=amount;
    const day=s.rewards.xpDays[dayKey(now)] ||= {total:0,boost:0};day.total+=amount;day.boost+=extra;day[kind]=(day[kind]||0)+base;
    if(s.battle&&!s.battle.demo)s.battle.xpEarned=(s.battle.xpEarned||0)+amount;
    return amount;
  }
  function cleanDragonName(name){return typeof name==='string'?Array.from(name.replace(/[\u0000-\u001f\u007f<>]/g,'').replace(/\s+/g,' ').trim()).slice(0,18).join(''):'';}
  function nameDragon(s,name){if(s.dragon.stage<1)return false;const clean=cleanDragonName(name);if(!clean)return false;s.dragon.name=clean;s.dragon.named=true;return true;}
  function chapterState(s,areaId){return s.story.chapters[areaId] ||= {activeMs:0,wins:0,duels:0,attempts:0,correct:0};}
  function activeChapterState(s){return s.battle?.reviewId?s.story.review: s.battle?.areaId?chapterState(s,s.battle.areaId):null;}
  function completeReviewChapter(s,now){
    const p=s.story.review;if(!s.battle?.reviewId||!p||p.completedAt||!s.battle.resolved||p.activeMs<TARGET_MS||p.wins<3||p.duels<1||s.math.round&&s.math.round.status!=='result')return;
    p.completedAt=iso(now);s.story.dailyChapters[dayKey(now)]=(s.story.dailyChapters[dayKey(now)]||0)+1;
    const accuracy=p.attempts?p.correct/p.attempts:0;p.accuracyXP=p.attempts>=10?(accuracy>=.9?10:accuracy>=.8?5:0):0;
    if(p.accuracyXP)awardXP(s,p.accuracyXP,'accuracy',now);
    if(s.result){s.result.reviewJustComplete=true;s.result.xpEarned=s.battle.xpEarned||0;}
  }
  function readingXP(s,q,rec,w,now){
    const key=String(q.exposureMs),history=s.rewards.speedHistory[key] ||= [];
    if(!rec.supported){history.push(rec.correct);if(history.length>20)history.shift();}
    if(!rec.correct||rec.supported)return 0;
    const fast=!!w.securedAt&&q.exposureMs!==null&&q.exposureMs<=950&&rec.timingValid&&history.length===20&&history.filter(Boolean).length>=18;
    let xp=awardXP(s,3+(fast?1:0),'answers',now,{boost:true});rec.speedXP=fast?1:0;
    if(!w.wordXPClaimed){
      const trail=w.xpEvidence ||= [];
      if(!trail.length||s.learning.sequence-trail.at(-1).sequence>=3)trail.push({sequence:s.learning.sequence,battleId:s.battle.id});
      if(trail.length>3)trail.shift();
      if(trail.length===3&&new Set(trail.map(x=>x.battleId)).size>=2){w.wordXPClaimed=true;w.securedAt=iso(now);xp+=awardXP(s,8,'words',now);rec.newWordXP=8;}
    }else if(!w.retentionXPClaimed&&rec.retentionCheck&&now-Date.parse(w.securedAt)>=DAY&&(!w.lastHelpAt||now-Date.parse(w.lastHelpAt)>=DAY)){
      w.retentionXPClaimed=true;xp+=awardXP(s,4,'retention',now);rec.retentionXP=4;
    }
    return xp;
  }
  function recordTime(s,ms,category,now){
    if(!Number.isFinite(ms)||ms<=0||!['practice','math','assessment','demo','idle'].includes(category))return;
    let cursor=now-ms;
    while(cursor<now){
      const d=new Date(cursor),next=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime(),end=Math.min(now,next);
      const day=s.timing.days[dayKey(cursor)] ||= {practice:0,math:0,assessment:0,demo:0,idle:0};
      const before=(day.practice||0)+(day.math||0);day[category]=(day[category]||0)+end-cursor;
      if(['practice','math'].includes(category)&&before<TARGET_MS&&(day.practice||0)+(day.math||0)>=TARGET_MS)awardXP(s,DAILY_XP,'daily',end-1);
      cursor=end;
    }
    if(category==='practice'||category==='math'){
      if(!s.timing.firstPracticeAt)s.timing.firstPracticeAt=iso(now-ms);
      if(s.session&&!s.session.completedAt)s.session.elapsedMs+=ms;
      if(s.battle&&!s.battle.demo&&!s.battle.finalEncounter&&(s.battle.reviewId||!s.story.clearedAreas.includes(s.battle.areaId)))activeChapterState(s).activeMs+=ms;
    }
    syncProgress(s,now);
  }
  function addActiveTime(s,ms,now=Date.now()){
    if(s.session&&!s.session.completedAt&&['battle','teaching'].includes(s.activity)&&!s.battle?.demo)recordTime(s,ms,'practice',now);
  }
  function parentProgress(s,now=Date.now()){
    const totals={practice:0,math:0,assessment:0,demo:0,idle:0};
    for(const day of Object.values(s.timing.days))for(const key of Object.keys(totals))totals[key]+=day[key]||0;
    const sessions=new Map(s.sessions.map(x=>[x.id,x]));if(s.session)sessions.set(s.session.id,s.session);
    const past=s.archive?.answers||{},legacyMs=(s.archive?.sessions?.legacyMs||0)+[...sessions.values()].reduce((sum,x)=>sum+(x.timingVersion?x.legacyElapsedMs||0:x.elapsedMs||0),0);
    const records=s.campaign.battleRecords.filter(r=>r.task==='battle'),independent=records.filter(r=>!r.supported);
    return {totals,activeMs:totals.practice+totals.math+totals.assessment+totals.demo,today:s.timing.days[dayKey(now)]||{practice:0,math:0,assessment:0,demo:0,idle:0},legacyMs,
      days:Object.entries(s.timing.days).sort((a,b)=>b[0].localeCompare(a[0])),answers:(past.battle||0)+records.length,independent:(past.independent||0)+independent.length,correct:(past.correct||0)+independent.filter(r=>r.correct).length,
      introduced:Content.words.filter(x=>s.learning.words[x.w]?.introducedAt).length,practiced:Content.words.filter(x=>s.learning.words[x.w]?.practiceSuccesses>=2).length};
  }
  function isSessionDue(s) { return !!s.session && !s.session.completedAt && s.session.elapsedMs >= s.session.targetMs; }
  function getQuestion(s) { return s.activity === 'assessment' ? s.assessment.progress?.question : s.battle?.question; }
  function makeQuestion(s,item,now,random,extra={}) {
    return {id:id(s,'answer'),target:item.w,options:shuffle(item.d,random),phase:'ready',
      exposureMs:practiceExposure(s),wordViewedMs:0,responseMs:0,
      supportReasons:[],answeredAt:null,correct:null,needsTeaching:false,...extra};
  }
  const SPEEDS=[{id:'crawl',name:'Crawl',ms:null},{id:'walk',name:'Walk',ms:1800},{id:'run',name:'Run',ms:950},{id:'ride',name:'Ride',ms:600},{id:'fly',name:'Fly',ms:350}];
  function speedChoices(s){
    return SPEEDS.map((mode,i)=>({...mode,locked:i>=3&&(s.dragon.stage<3||!s.story.chapterComplete||s.entitlements?.expansion!==true)}));
  }
  function practiceExposure(s){
    if(s.settings.selfPaced)return null;
    const selected=speedChoices(s).find(mode=>mode.id===s.settings.speed&&!mode.locked);
    return selected?selected.ms:s.assessment.exposure;
  }
  function chooseSpeed(s,speed){
    const choice=speedChoices(s).find(mode=>mode.id===speed&&!mode.locked);
    if(!choice)return false;
    s.settings.speed=speed;s.settings.selfPaced=speed==='crawl';
    // The saved question keeps its original exposure. A choice applies to new questions only.
    return true;
  }
  function recentAccuracy(s) {
    const records = s.campaign.battleRecords.filter(r => r.task === 'battle' && !r.supported).slice(-8);
    return records.length ? records.filter(r => r.correct).length/records.length : 1;
  }
  function selectPracticeWord(s,now) {
    const L=s.learning, recent=L.recent.slice(-2);
    const accessible=Content.areas.filter(a=>s.story.clearedAreas.includes(a.id)||storyProgress(s).areas.some(p=>p.id===a.id&&p.status==='current'));
    const allowed=new Set(accessible.flatMap(a=>a.words));
    const current=storyProgress(s).areas.find(a=>a.status==='current');
    const oldDue=Content.words.filter(item=>allowed.has(item.w)&&!current?.words.includes(item.w)&&L.words[item.w].introducedAt&&L.words[item.w].dueAt<=now&&!recent.includes(item.w)&&L.sequence>=L.words[item.w].eligibleAfter).sort((a,b)=>L.words[a.w].lastSequence-L.words[b.w].lastSequence);
    // Reserve two of three turns for the current field so old reviews cannot block a new chapter indefinitely.
    if(current&&L.sequence%3===2&&oldDue.length)return oldDue[0];
    const pool=Content.words.filter(item=>current?current.words.includes(item.w):allowed.has(item.w));
    const eligible=item => !recent.includes(item.w) && L.sequence >= L.words[item.w].eligibleAfter;
    const introduced=pool.filter(item => L.words[item.w].introducedAt);
    const existing=introduced.filter(eligible).sort((a,b)=>L.words[a.w].lastSequence-L.words[b.w].lastSequence);
    const due=existing.filter(item => L.words[item.w].dueAt <= now);
    const urgent=due.find(item => L.words[item.w].reviewStage>=0 || L.words[item.w].consecutiveMisses>0);
    if (urgent) return urgent;
    const unfinished=introduced.filter(item => L.words[item.w].practiceSuccesses < 2).length;
    const canIntroduce=(s.session?.newWords.length||0)<6 && (introduced.length<3 || (unfinished<4 && recentAccuracy(s)>=.8));
    if (canIntroduce) {
      const unseen=pool.filter(item => !L.words[item.w].introducedAt && eligible(item));
      unseen.sort((a,b)=>Number(L.words[b.w].assessmentMiss)-Number(L.words[a.w].assessmentMiss));
      if (unseen.length) return unseen[0];
    }
    if (due.length) return due[0];
    if (existing.length) return existing[0];
    // A tiny starting pool needs distinct intervening material after help.
    const filler=pool.find(item=>eligible(item) && (L.words[item.w].introducedAt || (s.session?.newWords.length||0)<6));
    if (!filler) throw new Error('No eligible reviewed word');
    return filler;
  }
  function enemyChoices(s,health=s.campaign.enemyStrength||3) {
    const recent=(s.campaign.enemyHistory||[]).slice(-2).map(entry=>entry.enemyId);
    // Old saves had only Thornling. Avoid it immediately after their saved encounter too.
    if(s.battle)recent.push(s.battle.enemyId||'thornling');
    const roster=Content.enemiesForHealth(Math.max(3,health));
    const recentFamilies=recent.map(id=>Content.enemyAt(id).family);
    const choices=roster.filter(enemy=>!recent.includes(enemy.id)&&!recentFamilies.includes(enemy.family));
    const history=(s.campaign.enemyHistory||[]).map(entry=>entry.enemyId);
    return choices.sort((a,b)=>history.lastIndexOf(a.id)-history.lastIndexOf(b.id));
  }
  function enemyScale(health) { return .78 + .65*(1-Math.exp(-(Math.max(3,health)-3)/5)); }
  function currentChapter(s){return Content.chapters.find(chapter=>!s.story.completedChapters.includes(chapter.id))||Content.chapters.at(-1);}
  function chapterLocation(s,areaId=null){
    const campaign=areaId?Content.chapters.find(c=>c.id===Content.areas.find(a=>a.id===areaId)?.chapterId):currentChapter(s);
    const areas=Content.areas.filter(a=>a.chapterId===campaign.id);
    const area=areas.find(a=>a.id===areaId)||areas.find(a=>!s.story.clearedAreas.includes(a.id))||areas.at(-1);
    return {campaign,area,campaignNumber:Content.chapters.indexOf(campaign)+1,chapterNumber:areas.indexOf(area)+1,total:areas.length,cleared:areas.filter(a=>s.story.clearedAreas.includes(a.id)).length};
  }
  function beginChapterStory(s,now){
    if(s.story.scene){s.activity='chapterStory';return true;}
    const b=s.battle,area=Content.areas.find(a=>a.id===b?.areaId),index=Content.areas.indexOf(area);
    // The initial guided battle keeps its approved short introduction. Never interrupt a saved question.
    if(!b||b.demo||b.finalEncounter||b.reviewId||b.resolved||b.question||b.turn||index<=0||!s.story.clearedAreas.includes(Content.areas[index-1].id)||s.story.scenes[area.id]||s.story.clearedAreas.includes(area.id))return false;
    s.story.scene={areaId:area.id,battleId:b.id,phase:'intro',introHeard:false,helped:false,startedAt:iso(now)};
    s.activity='chapterStory';return true;
  }
  function advanceChapterStory(s,now){
    const scene=s.story.scene;if(!scene||s.activity!=='chapterStory')return false;
    if(scene.phase==='intro'){if(!scene.introHeard)return false;scene.phase='read';return true;}
    if(scene.phase!=='read')return false;
    s.story.scenes[scene.areaId]={completedAt:iso(now),helped:scene.helped};
    s.story.scene=null;s.activity='battle';return true;
  }
  function chapterProgress(s) {
    const chapter=currentChapter(s);
    return {found:chapter.words.filter(word=>s.learning.words[word]?.introducedAt).length,
      goal:chapter.words.length,checkpoint:s.campaign.checkpointWins/2,
      nextCheckpoint:s.campaign.wins-s.campaign.checkpointWins};
  }
  function areaProgress(s,area) {
    const total=area.words.length,p=chapterState(s,area.id),complete=s.story.clearedAreas.includes(area.id);
    return {introduced:area.words.filter(word=>s.learning.words[word]?.introducedAt).length,
      reliable:area.words.filter(word=>(s.learning.words[word]?.practiceSuccesses||0)>=2).length,
      required:Math.ceil(total*.8),total,wins:p.wins,secured:p.wins>=3,activeMs:p.activeMs,duels:p.duels,
      complete,remainingMs:Math.max(0,TARGET_MS-p.activeMs)};
  }
  function dragonProgress(s,now=Date.now()){
    const xp=s.dragon.xp||0,stage=s.dragon.stage,next=Content.dragonStages[stage+1]||null;
    const activeMs=Object.values(s.timing.days).reduce((sum,d)=>sum+(d.practice||0)+(d.math||0),0);
    return {xp,stage,current:Content.dragonStages[stage],next,remaining:next?Math.max(0,next.xp-xp):0,activeMs,
      minutesRemaining:0,daysRemaining:0,elapsedDays:0,
      fraction:next?Math.max(0,Math.min(1,(xp-Content.dragonStages[stage].xp)/(next.xp-Content.dragonStages[stage].xp))):1};
  }
  function syncProgress(s,now=Date.now()){
    for (let i=0;i<Content.areas.length;i++){
      const area=Content.areas[i],p=areaProgress(s,area),previous=i===0||s.story.clearedAreas.includes(Content.areas[i-1].id);
      const c=Content.chapters.findIndex(chapter=>chapter.id===area.chapterId),campaignOpen=c===0||s.story.completedChapters.includes(Content.chapters[c-1].id);
      const betweenBattles=!s.battle||s.battle.resolved||s.battle.areaId!==area.id;
      const duelPending=s.math.round?.areaId===area.id&&s.math.round.status!=='result';
      if(area.available&&campaignOpen&&previous&&p.total>0&&p.introduced===p.total&&p.reliable>=p.required&&p.secured&&p.activeMs>=TARGET_MS&&p.duels>=1&&betweenBattles&&!duelPending&&!p.complete){
        s.story.clearedAreas.push(area.id);const progress=chapterState(s,area.id);progress.completedAt=iso(now);
        s.story.dailyChapters[dayKey(now)]=(s.story.dailyChapters[dayKey(now)]||0)+1;
        const accuracy=progress.attempts?progress.correct/progress.attempts:0;
        progress.accuracyXP=progress.attempts>=10?(accuracy>=.9?10:accuracy>=.8?5:0):0;
        if(progress.accuracyXP)awardXP(s,progress.accuracyXP,'accuracy',now);
        if(s.result&&s.battle?.areaId===area.id){s.result.fieldJustComplete=area.id;s.result.xpEarned=s.battle.xpEarned||0;}
      }
    }
    completeReviewChapter(s,now);
    for(let stage=s.dragon.stage+1;stage<Content.dragonStages.length;stage++){
      if(s.dragon.xp>=Content.dragonStages[stage].xp)s.dragon.stage=stage;else break;
    }
  }
  function storyProgress(s){
    const chapter=currentChapter(s),areas=Content.areas.filter(area=>area.chapterId===chapter.id);
    const cleared=areas.filter(area=>s.story.clearedAreas.includes(area.id)).length;
    return {chapter,chapterNumber:Content.chapters.indexOf(chapter)+1,cleared,total:areas.length,complete:s.story.completedChapters.length===Content.chapters.length,
      areas:areas.map((area,i)=>({...area,...areaProgress(s,area),
        status:s.story.clearedAreas.includes(area.id)?'cleared':!area.available?'future':i===0||s.story.clearedAreas.includes(areas[i-1].id)?'current':'locked'}))};
  }
  function startBattle(s,now,{demo=false,strength=null,enemyId=null,fromAssessment=false}={}) {
    if (!demo) beginSession(s,now);
    const story=storyProgress(s),chapter=story.chapter;
    const finalEncounter=!demo&&!s.story.completedChapters.includes(chapter.id)&&story.areas.every(area=>area.status==='cleared');
    const health=demo?5:Math.max(finalEncounter?6:3,strength || s.campaign.enemyStrength || 3);
    const available=enemyChoices(s,health);
    const chosen=demo?'thornling':available.find(enemy=>enemy.id===enemyId)?.id||available[0].id;
    s.battle={id:id(s,'battle'),demo,heroHealth:3,enemyHealth:health,maxHealth:health,
      enemyId:chosen,introPending:!demo,fromAssessment,finalEncounter,chapterId:chapter.id,areaId:story.areas.find(a=>a.status==='current')?.id||story.areas.at(-1).id,xpStart:s.dragon.xp,
      firstMistakeFree:demo,turn:0,question:null,resolved:false,xpEarned:0};
    if(!demo&&story.complete){
      if(!s.story.review||s.story.review.completedAt)s.story.review={id:id(s,'reviewChapter'),activeMs:0,wins:0,duels:0,attempts:0,correct:0};
      s.battle.reviewId=s.story.review.id;
    }
    if(!s.campaign.enemyHistory)s.campaign.enemyHistory=[];
    s.campaign.enemyHistory.push({battleId:s.battle.id,enemyId:chosen});
    s.campaign.enemyHistory=s.campaign.enemyHistory.slice(-12);
    s.result=null; s.activity='battle';
  }
  function prepareBattle(s,now,random=Math.random) {
    const b=s.battle;
    if (!b || b.resolved) return;
    if (b.question && !b.question.answeredAt) return b.question;
    if (b.question) b.question.phase='done';
    if (b.heroHealth<=0 || b.enemyHealth<=0) { resolveBattle(s,now); return; }
    const item=b.demo ? byWord[Content.demoWords[b.turn % Content.demoWords.length]] : selectPracticeWord(s,now);
    const word=s.learning.words[item.w];
    const isNew=!word.introducedAt;
    if (!b.demo && isNew) {
      word.introducedAt=iso(now);
      if (!word.familiar && !s.session.newWords.includes(item.w)) s.session.newWords.push(item.w);
    }
    const guided=b.demo && b.turn===0;
    b.question=makeQuestion(s,item,now,random,{exposureMs:b.demo?null:practiceExposure(s),
      isNew,guided,supportReasons:guided?['guided-example']:[],retentionDue:word.reviewStage>=0 && word.dueAt<=now});
    b.turn++;
    return b.question;
  }
  function observation(s,q,opt,now,task) {
    const word=s.learning.words[q.target];
    return {id:q.id,task,language:'en',target:q.target,alternatives:[...q.options],firstResponse:opt,
      correct:opt===q.target,exposureMs:q.exposureMs,observedExposureMs:Math.round(q.wordViewedMs),
      responseMs:Math.round(q.responseMs),supported:q.supportReasons.length>0,
      supportReasons:[...q.supportReasons],timingValid:!q.supportReasons.includes('interrupted-exposure'),
      previouslyEncountered:!!word?.lastSeenAt || s.assessment.records.some(r=>r.target===q.target) || s.campaign.battleRecords.some(r=>r.target===q.target) || !!s.archive?.words?.[q.target],
      lastHelpAt:word?.lastHelpAt || null,
      sinceHelpMs:word?.lastHelpAt ? Math.max(0,now-Date.parse(word.lastHelpAt)) : null,
      lastTeachingAt:word?.lastTeachingAt || null,
      sinceTeachingMs:word?.lastTeachingAt ? Math.max(0,now-Date.parse(word.lastTeachingAt)) : null,
      retentionCheck:!!q.retentionDue,at:iso(now)};
  }
  function answerBattle(s,opt,now) {
    const b=s.battle,q=b?.question;
    if (!q || q.answeredAt || q.phase!=='choices' || (opt!=='?'&&!q.options.includes(opt))) return null;
    if(opt==='?'&&!q.supportReasons.includes('help-request'))q.supportReasons.push('help-request');
    const rec=observation(s,q,opt,now,b.demo?'demoBattle':'battle');
    rec.battleId=b.id; rec.sessionId=b.demo?null:s.session.id;
    rec.heroHealthBefore=b.heroHealth; rec.enemyHealthBefore=b.enemyHealth;
    q.correct=rec.correct; q.firstResponse=opt; q.answeredAt=rec.at; q.phase=rec.correct?'feedback':'correction';
    q.freeMistake=!rec.correct && !rec.supported && b.firstMistakeFree;
    if (!rec.supported) {
      if (rec.correct) b.enemyHealth--;
      else if (b.firstMistakeFree) b.firstMistakeFree=false;
      else if(!b.demo&&s.rewards.shield){s.rewards.shield=false;q.shieldUsed=true;rec.shieldUsed=true;}
      else b.heroHealth--;
    }
    rec.healthChanged=!rec.supported && !q.freeMistake && !q.shieldUsed;
    s.campaign.battleRecords.push(rec);compactHistory(s);
    const L=s.learning,w=L.words[q.target];
    L.sequence++; L.recent.push(q.target); L.recent=L.recent.slice(-6);
    w.observations++; w.lastSeenAt=rec.at; w.lastSequence=L.sequence;
    if (!rec.supported) {
      if (rec.correct) {
        w.independentCorrect++; w.practiceSuccesses++; w.consecutiveMisses=0;
        if (w.practiceSuccesses>=2 && w.reviewStage<0) { w.reviewStage=0; w.dueAt=now+DAY; }
        else if (w.reviewStage>=0 && now>=w.dueAt && (!w.lastHelpAt || now-Date.parse(w.lastHelpAt)>=DAY)) {
          w.reviewStage=Math.min(GAPS.length-1,w.reviewStage+1); w.dueAt=now+GAPS[w.reviewStage]*DAY;
        } else if (w.reviewStage<0) w.dueAt=now+15000;
      } else {
        w.consecutiveMisses++; w.practiceSuccesses=0;w.xpEvidence=[];
        w.reviewStage=Math.max(-1,w.reviewStage-1); w.dueAt=now+60000;
        w.eligibleAfter=L.sequence+2;
        q.needsTeaching=q.isNew || w.independentCorrect===0 || w.consecutiveMisses>=2 || q.retentionDue;
      }
    }
    if (!b.demo) {
      s.session.answers++;
      if (!rec.supported) { s.session.independent++; if (rec.correct) s.session.correct++; }
    }
    q.xpEarned=0;
    if(!b.demo){
      const p=activeChapterState(s);if(!rec.supported){p.attempts++;if(rec.correct)p.correct++;}
      q.xpEarned=readingXP(s,q,rec,w,now);
    }
    const stageBefore=s.dragon.stage;syncProgress(s,now);q.grewTo=s.dragon.stage>stageBefore?s.dragon.stage:null;
    rec.xpEarned=q.xpEarned;
    if (!rec.correct) noteSupport(s,q.target,'correction',now);
    return rec;
  }
  function noteSupport(s,target,kind,now) {
    s.learning.supportExposures.push({id:id(s,'support'),target,kind,at:iso(now)});compactHistory(s);
    const w=s.learning.words[target];
    if(w){w.lastHelpAt=iso(now);w.eligibleAfter=s.learning.sequence+2;}
  }
  function startTeaching(s,target,returnTo,now,{replay=false}={}) {
    if (!byWord[target]) throw new Error('No reviewed teaching card');
    const event={id:id(s,'teaching'),target,at:iso(now),guided:returnTo==='demo',replay,task:'teaching',language:'en'};
    s.learning.teaching.push(event);compactHistory(s);
    if (!s.learning.supportedWords.includes(target)) s.learning.supportedWords.push(target);
    const w=s.learning.words[target];
    w.lastHelpAt=event.at; w.lastTeachingAt=event.at; w.eligibleAfter=s.learning.sequence+2;
    if (s.session && !s.session.completedAt && returnTo!=='demo') s.session.teaching++;
    s.teaching={target,returnTo}; s.activity='teaching';
    if (s.battle?.question) s.battle.question.needsTeaching=false;
  }
  function leaveTeaching(s,now) {
    if (!s.teaching) return;
    const target=s.teaching.returnTo;
    s.learning.words[s.teaching.target].lastHelpAt=iso(now);
    s.learning.words[s.teaching.target].lastTeachingAt=iso(now);
    const event=s.learning.teaching.at(-1);if(event&&event.target===s.teaching.target)event.completedAt=iso(now);
    s.teaching=null;
    if (target==='demo') startBattle(s,now,{demo:true});
    else s.activity='battle';
  }
  function resolveBattle(s,now) {
    const b=s.battle;
    if (!b || b.resolved || (b.heroHealth>0&&b.enemyHealth>0)) return;
    b.resolved=true;
    if (b.demo) { s.demoComplete=true; s.handoff={victory:b.enemyHealth<=0};s.battle=null;s.activity='handoff';return; }
    const victory=b.enemyHealth<=0;
    s.math.winStreak=victory?s.math.winStreak+1:0;
    s.rewards.readingWins=victory?Math.min(3,s.rewards.readingWins+1):0;
    if (victory) { s.campaign.wins++; s.session.victories++; if (s.campaign.wins%2===0) s.campaign.checkpointWins=s.campaign.wins; }
    else s.campaign.wins=s.campaign.checkpointWins;
    if(victory&&!b.finalEncounter)activeChapterState(s).wins++;
    // The future final encounter must be explicitly designated and all areas ready.
    const chapter=Content.chapters.find(c=>c.id===(b.chapterId||'chapter-1'));
    const chapterReady=chapter.words.every(word=>s.learning.words[word]?.introducedAt)&&chapter.words.filter(word=>(s.learning.words[word]?.practiceSuccesses||0)>=2).length>=Math.ceil(chapter.words.length*.8);
    const chapterJustComplete=victory&&b.finalEncounter&&chapterReady&&Content.areas.filter(a=>a.chapterId===chapter.id).every(area=>s.story.clearedAreas.includes(area.id))&&!s.story.completedChapters.includes(chapter.id);
    if(chapterJustComplete){s.story.completedChapters.push(chapter.id);if(chapter.id==='chapter-1')s.story.chapterComplete=true;s.story.mapPending=true;syncProgress(s);}
    const xpEarned=b.xpEarned??s.campaign.battleRecords.filter(r=>r.battleId===b.id).reduce((sum,r)=>sum+(r.xpEarned||0),0);
    s.result={victory,strength:b.maxHealth,battleId:b.id,enemyId:b.enemyId||'thornling',chapterComplete:s.story.chapterComplete,chapterJustComplete,xpEarned}; s.activity='result';
    const field=activeChapterState(s);
    if(victory&&(s.math.winStreak%3===0||(!b.finalEncounter&&field.wins>=3&&field.wins%3===0&&field.duels===0))){
      s.math.round={id:id(s,'math'),battleId:b.id,areaId:b.areaId,enemyId:b.enemyId||'thornling',status:'intro',inputMode:'choice',shieldEligible:s.rewards.readingWins>=3,bestAtStart:s.math.best,target:Math.max(1,(s.math.best||0)-2),elapsedMs:0,correct:0,score:0,wrong:0,scoringVersion:2,answers:[],question:null,bag:[],recent:[]};
      s.activity='mathIntro';
    }else if (isSessionDue(s)) {completeSession(s,now);s.activity='result';}
    syncProgress(s,now);if(s.result)s.result.xpEarned=b.xpEarned??xpEarned;
  }
  function startMath(s,now){
    const r=s.math.round;if(!r||r.status!=='intro')return false;
    r.scoringVersion=2;r.score=0;r.wrong=0;
    beginSession(s,now);r.status='playing';r.startedAt=iso(now);r.xpStart=s.dragon.xp;s.activity='mathChallenge';prepareMath(s);return true;
  }
  function mathChoices(a,b,random=Math.random){
    const answer=a*b;
    const neighbours=[a*(b-1),a*(b+1),(a-1)*b,(a+1)*b,answer-1,answer+1,answer-10,answer+10,answer-2,answer+2];
    const wrong=[...new Set(neighbours)].filter(n=>n>=1&&n<=100&&n!==answer);
    return shuffle([answer,...shuffle(wrong,random).slice(0,3)],random);
  }
  function prepareMath(s,random=Math.random){
    const r=s.math.round;if(!r||r.status!=='playing'||r.elapsedMs>=60000)return null;
    if(r.question?.phase==='answer'){if(!r.question.options)r.question.options=mathChoices(r.question.a,r.question.b,random);return r.question;}
    if(!r.bag.length)r.bag=shuffle(Array.from({length:100},(_,i)=>[Math.floor(i/10)+1,i%10+1]),random);
    let index=r.bag.findIndex(([a,b])=>!r.recent.includes([Math.min(a,b),Math.max(a,b)].join('x')));if(index<0)index=0;
    const [a,b]=r.bag.splice(index,1)[0];r.recent.push([Math.min(a,b),Math.max(a,b)].join('x'));r.recent=r.recent.slice(-2);
    r.question={id:id(s,'product'),a,b,options:mathChoices(a,b,random),input:'',phase:'answer',correct:null};return r.question;
  }
  function answerMath(s,value,now){
    const r=s.math.round,q=r?.question;
    if(!r||r.status!=='playing'||r.elapsedMs>=60000||!q||q.phase!=='answer'||!/^\d{1,3}$/.test(String(value))||!q.options?.includes(Number(value)))return null;
    const rec={id:q.id,task:'multiplication',inputMode:'choice',alternatives:[...q.options],a:q.a,b:q.b,response:Number(value),correct:Number(value)===q.a*q.b,elapsedMs:r.elapsedMs,at:iso(now)};
    q.phase='feedback';q.correct=rec.correct;q.input=String(value);r.answers.push(rec);
    if(rec.correct){r.correct++;rec.xpEarned=awardXP(s,1,'math',now,{boost:true});syncProgress(s,now);}
    if(r.scoringVersion===2){rec.points=rec.correct?1:-1;r.score+=rec.points;if(!rec.correct)r.wrong++;}
    return rec;
  }
  function mathScore(r){return r.scoringVersion===2?r.score:r.correct;}
  function tickMath(s,ms,now){
    const r=s.math.round;if(!r||r.status!=='playing'||!Number.isFinite(ms)||ms<=0)return false;
    r.elapsedMs=Math.min(60000,r.elapsedMs+ms);
    if(r.elapsedMs>=60000){finishMath(s,now);return true;}return false;
  }
  function finishMath(s,now){
    const r=s.math.round;if(!r||r.status!=='playing'||r.elapsedMs<60000)return false;
    const score=mathScore(r);
    r.status='result';r.finishedAt=iso(now);r.beaten=score>=r.target;r.newBest=s.math.best===null||score>s.math.best;
    s.math.best=Math.max(s.math.best??score,score);
    r.shieldEarned=!!(r.beaten&&r.shieldEligible&&s.rewards.readingWins>=3&&!s.rewards.shield);
    if(r.shieldEarned){s.rewards.shield=true;s.rewards.shieldEarnedAt=iso(now);}
    s.rewards.readingWins=0;
    if(r.areaId)activeChapterState(s).duels++;
    syncProgress(s,now);r.xpEarned=s.dragon.xp-(r.xpStart??s.dragon.xp-r.correct);
    if(s.result&&s.battle)s.result.xpEarned=s.battle.xpEarned??s.result.xpEarned;
    s.math.records.push({id:r.id,battleId:r.battleId,enemyId:r.enemyId,target:r.target,score,correct:r.correct,wrong:r.wrong||0,inputMode:r.inputMode,scoringVersion:r.scoringVersion||1,bestBefore:r.bestAtStart,bestAfter:s.math.best,beaten:r.beaten,shieldEarned:r.shieldEarned,xpEarned:r.xpEarned,startedAt:r.startedAt,finishedAt:r.finishedAt,elapsedMs:r.elapsedMs,answers:copy(r.answers)});compactHistory(s);
    s.activity='mathResult';return true;
  }
  function leaveMath(s,now){
    const r=s.math.round;if(!r||!['intro','result'].includes(r.status))return false;
    if(r.status==='intro')s.rewards.readingWins=0;
    s.math.round=null;s.activity='result';if(isSessionDue(s)){completeSession(s,now);s.activity='result';}return true;
  }
  function leaveHandoff(s,now){
    if(!s.handoff)return false;
    s.handoff=null;
    if(s.assessment.done)startBattle(s,now);else startAssessment(s,now);
    return true;
  }
  function startAssessment(s,now) {
    if (s.assessment.done) return false;
    if (!s.assessment.progress) s.assessment.progress={asked:[],level:0,exposure:1800,block:[],records:[],started:now,axis:'difficulty',question:null};
    s.activity='assessment'; return true;
  }
  function shouldStopAssessment(a) {
    if(a.records.length>=25)return true;
    const records=a.records.filter(r=>!r.supported),n=records.length;if(n<8)return false;
    const errors=records.filter(r=>!r.correct).length,acc=(n-errors)/n;
    return errors>=5 || (n>=10&&acc<.6) || (n>=12&&acc<.72) || (n>=16&&acc<.88) || (n>=20&&a.level>=3&&acc>=.88);
  }
  function adaptAssessment(a) {
    const b=a.block.splice(0),acc=b.filter(r=>r.correct).length/b.length,avg=b.reduce((sum,r)=>sum+r.responseMs,0)/b.length;
    const steps=[2200,1800,1500,1200,950];let idx=steps.indexOf(a.exposure);if(idx<0)idx=1;
    if(acc>=.75){if(a.axis==='difficulty'&&a.level<Content.assessmentPools.length-1){a.level++;a.axis='exposure'}else if(acc===1&&avg<3400&&idx<steps.length-1){a.exposure=steps[idx+1];a.axis='difficulty'}}
    else if(acc<=.5){if(idx>0){a.exposure=steps[idx-1];a.axis='difficulty'}else if(a.level>0){a.level--;a.axis='exposure'}}
  }
  function prepareAssessment(s,now,random=Math.random) {
    const a=s.assessment.progress;
    if (!a) return;
    if (a.question && !a.question.answeredAt) return a.question;
    if (a.block.length>=4) adaptAssessment(a);
    if (shouldStopAssessment(a)) {
      s.assessment.done=true;s.assessment.records=copy(a.records);s.assessment.level=a.level;
      s.assessment.exposure=a.exposure;s.assessment.completedAt=iso(now);s.assessment.progress=null;
      for (const item of Content.words) {
        const seen=s.assessment.records.filter(r=>r.target===item.w);
        s.learning.words[item.w].familiar=seen.some(r=>r.correct&&!r.supported);
        s.learning.words[item.w].assessmentMiss=seen.some(r=>!r.correct);
      }
      startBattle(s,now,{fromAssessment:true}); return;
    }
    let level=a.level,item;
    for(let guard=0;guard<6;guard++){
      const available=Content.assessmentPools[level].filter(x=>!a.asked.includes(x.w));
      if(available.length){item=available[Math.floor(random()*available.length)];break;}
      level=Math.min(Content.assessmentPools.length-1,level+1);a.level=level;
    }
    item=item || Content.assessmentPools.flat().find(x=>!a.asked.includes(x.w)) || Content.assessmentPools.at(-1)[0];
    a.asked.push(item.w);
    a.question=makeQuestion(s,item,now,random,{exposureMs:a.exposure});
    return a.question;
  }
  function answerAssessment(s,opt,now) {
    const a=s.assessment.progress,q=a?.question;
    if (!q || q.answeredAt || q.phase!=='choices' || (opt!=='?'&&!q.options.includes(opt))) return null;
    const rec=observation(s,q,opt,now,'assessment');
    q.answeredAt=rec.at;q.correct=rec.correct;q.phase='feedback';
    a.records.push(rec);
    // Interrupted exposure is retained as an observation, not calibration evidence.
    if (!rec.supported) a.block.push(rec);
    return rec;
  }
  function interruptQuestion(s) {
    const q=getQuestion(s);
    if (q && !q.answeredAt && ['word','mask','fix'].includes(q.phase)) {
      if (q.phase!=='fix' && !q.supportReasons.includes('interrupted-exposure')) q.supportReasons.push('interrupted-exposure');
      q.phase='ready';
    }
  }
  return {fresh,migrate,copy,byWord,TARGET_MS,DAY,GAPS,XP_MULTIPLIER,DAILY_XP,bonusProgress,nameDragon,chapterState,activeChapterState,beginSession,completeSession,addActiveTime,isSessionDue,
    getQuestion,startBattle,prepareBattle,answerBattle,startTeaching,leaveTeaching,noteSupport,resolveBattle,
    startAssessment,leaveHandoff,prepareAssessment,answerAssessment,interruptQuestion,shouldStopAssessment,
    enemyChoices,enemyScale,chapterProgress,areaProgress,dragonProgress,storyProgress,currentChapter,chapterLocation,beginChapterStory,advanceChapterStory,recordTime,parentProgress,dayKey,
    startMath,prepareMath,answerMath,tickMath,finishMath,leaveMath,mathScore,speedChoices,practiceExposure,chooseSpeed,
    HISTORY_LIMITS,GAP_DAYS,compactHistory,answerCount};
});
