(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./content.js'));
  else root.BlitzCore = factory(root.BlitzContent);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(Content) {
  'use strict';
  const DAY = 86400000;
  const GAPS = [1,3,7,14,30];
  const TARGET_MS = 7 * 60 * 1000;
  const byWord = Object.fromEntries([...Content.words,...Content.legacyWords].map(item => [item.w,item]));
  const iso = now => new Date(now).toISOString();
  const copy = value => JSON.parse(JSON.stringify(value));
  function fresh() {
    return {schemaVersion:2, revision:0, nextId:1,
      profile:{name:'',age:7,gender:'boy',heroClass:'Mage',heroIndex:0},
      assessment:{done:false,records:[],level:0,exposure:1800,lastAxis:'exposure',progress:null},
      learning:{supportedWords:[],teaching:[],supportExposures:[],words:{},sequence:0,recent:[]},
      campaign:{wins:0,checkpointWins:0,enemyStrength:3,battleRecords:[]},
      dragon:{awards:{},stage:0,xp:null},story:{clearedAreas:[],chapterComplete:false,completedChapters:[],mapPending:false},
      timing:{version:1,days:{},firstPracticeAt:null},
      math:{best:null,winStreak:0,round:null,records:[]},
      settings:{selfPaced:false,speed:null,soundscape:true}, activity:'route', screen:'setup', battle:null,
      teaching:null, handoff:null, result:null, session:null, sessions:[], demoComplete:false};
  }
  function migrate(old) {
    if (!old || typeof old !== 'object' || Array.isArray(old)) throw new Error('Invalid saved adventure');
    const base = fresh();
    const s = {...base,...copy(old)};
    for (const key of ['profile','assessment','learning','campaign','settings','dragon','story','timing','math']) s[key] = {...base[key],...s[key]};
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
    syncProgress(s);
    return s;
  }
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
    s.sessions.push(copy(s.session));
    s.activity = 'summary';
  }
  function dayKey(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function recordTime(s,ms,category,now){
    if(!Number.isFinite(ms)||ms<=0||!['practice','math','assessment','demo','idle'].includes(category))return;
    let cursor=now-ms;
    while(cursor<now){
      const d=new Date(cursor),next=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime(),end=Math.min(now,next);
      const day=s.timing.days[dayKey(cursor)] ||= {practice:0,math:0,assessment:0,demo:0,idle:0};day[category]=(day[category]||0)+end-cursor;cursor=end;
    }
    if(category==='practice'||category==='math'){
      if(!s.timing.firstPracticeAt)s.timing.firstPracticeAt=iso(now-ms);
      if(s.session&&!s.session.completedAt)s.session.elapsedMs+=ms;
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
    const legacyMs=[...sessions.values()].reduce((sum,x)=>sum+(x.timingVersion?x.legacyElapsedMs||0:x.elapsedMs||0),0);
    const records=s.campaign.battleRecords.filter(r=>r.task==='battle'),independent=records.filter(r=>!r.supported);
    return {totals,activeMs:totals.practice+totals.math+totals.assessment+totals.demo,today:s.timing.days[dayKey(now)]||{practice:0,math:0,assessment:0,demo:0,idle:0},legacyMs,
      days:Object.entries(s.timing.days).sort((a,b)=>b[0].localeCompare(a[0])),answers:records.length,independent:independent.length,correct:independent.filter(r=>r.correct).length,
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
    const allowed=new Set(accessible.flatMap(a=>a.words)),pool=Content.words.filter(item=>allowed.has(item.w));
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
  function chapterProgress(s) {
    const chapter=currentChapter(s);
    return {found:chapter.words.filter(word=>s.learning.words[word]?.introducedAt).length,
      goal:chapter.words.length,checkpoint:s.campaign.checkpointWins/2,
      nextCheckpoint:s.campaign.wins-s.campaign.checkpointWins};
  }
  function areaProgress(s,area) {
    const total=area.words.length;
    return {introduced:area.words.filter(word=>s.learning.words[word]?.introducedAt).length,
      reliable:area.words.filter(word=>(s.learning.words[word]?.practiceSuccesses||0)>=2).length,
      required:Math.ceil(total*.8),total,
      wins:Math.max(0,Math.min(2,s.campaign.wins-(area.checkpoint-2))),
      secured:s.campaign.checkpointWins>=area.checkpoint};
  }
  function dragonProgress(s,now=Date.now()){
    const xp=s.dragon.xp||0,stage=s.dragon.stage,next=Content.dragonStages[stage+1]||null;
    const activeMs=Object.values(s.timing.days).reduce((sum,d)=>sum+(d.practice||0)+(d.math||0),0);
    const elapsedDays=s.timing.firstPracticeAt?Math.max(0,(now-Date.parse(s.timing.firstPracticeAt))/DAY):0;
    const remaining=next?Math.max(0,next.xp-xp):0,minutesRemaining=next?Math.max(0,Math.ceil((next.minMinutes*60000-activeMs)/60000)):0,daysRemaining=next?Math.max(0,Math.ceil(next.minDays-elapsedDays)):0;
    return {xp,stage,current:Content.dragonStages[stage],next,remaining,activeMs,elapsedDays,minutesRemaining,daysRemaining,
      fraction:next?Math.max(0,Math.min(1,(xp-Content.dragonStages[stage].xp)/(next.xp-Content.dragonStages[stage].xp))):1};
  }
  function syncProgress(s,now=Date.now()){
    for(let i=0;i<Content.areas.length;i++){
      const area=Content.areas[i],p=areaProgress(s,area),previous=i===0||s.story.clearedAreas.includes(Content.areas[i-1].id);
      const c=Content.chapters.findIndex(chapter=>chapter.id===area.chapterId),chapterOpen=c===0||s.story.completedChapters.includes(Content.chapters[c-1].id);
      if(area.available&&chapterOpen&&p.total>0&&previous&&p.introduced===p.total&&p.reliable>=p.required&&p.secured&&!s.story.clearedAreas.includes(area.id))s.story.clearedAreas.push(area.id);
    }
    const p=dragonProgress(s,now);
    for(let stage=s.dragon.stage+1;stage<Content.dragonStages.length;stage++){
      const next=Content.dragonStages[stage];
      if(p.xp>=next.xp&&p.activeMs>=next.minMinutes*60000&&p.elapsedDays>=next.minDays&&(!next.requiresChapter||s.story.chapterComplete))s.dragon.stage=stage;
      else break;
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
      firstMistakeFree:demo,turn:0,question:null,resolved:false};
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
      previouslyEncountered:!!word?.lastSeenAt || s.assessment.records.some(r=>r.target===q.target) || s.campaign.battleRecords.some(r=>r.target===q.target),
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
      else b.heroHealth--;
    }
    rec.healthChanged=!rec.supported && !q.freeMistake;
    s.campaign.battleRecords.push(rec);
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
        w.consecutiveMisses++; w.practiceSuccesses=0;
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
    if(!b.demo&&rec.correct&&!rec.supported){s.dragon.xp++;q.xpEarned=1;}
    const stageBefore=s.dragon.stage;syncProgress(s,now);q.grewTo=s.dragon.stage>stageBefore?s.dragon.stage:null;
    rec.xpEarned=q.xpEarned;
    if (!rec.correct) noteSupport(s,q.target,'correction',now);
    return rec;
  }
  function noteSupport(s,target,kind,now) {
    s.learning.supportExposures.push({id:id(s,'support'),target,kind,at:iso(now)});
    const w=s.learning.words[target];
    if(w){w.lastHelpAt=iso(now);w.eligibleAfter=s.learning.sequence+2;}
  }
  function startTeaching(s,target,returnTo,now,{replay=false}={}) {
    if (!byWord[target]) throw new Error('No reviewed teaching card');
    const event={id:id(s,'teaching'),target,at:iso(now),guided:returnTo==='demo',replay,task:'teaching',language:'en'};
    s.learning.teaching.push(event);
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
    if (victory) { s.campaign.wins++; s.session.victories++; if (s.campaign.wins%2===0) s.campaign.checkpointWins=s.campaign.wins; }
    else s.campaign.wins=s.campaign.checkpointWins;
    syncProgress(s);
    // The future final encounter must be explicitly designated and all areas ready.
    const chapter=Content.chapters.find(c=>c.id===(b.chapterId||'chapter-1'));
    const chapterReady=chapter.words.every(word=>s.learning.words[word]?.introducedAt)&&chapter.words.filter(word=>(s.learning.words[word]?.practiceSuccesses||0)>=2).length>=Math.ceil(chapter.words.length*.8);
    const chapterJustComplete=victory&&b.finalEncounter&&chapterReady&&Content.areas.filter(a=>a.chapterId===chapter.id).every(area=>s.story.clearedAreas.includes(area.id))&&!s.story.completedChapters.includes(chapter.id);
    if(chapterJustComplete){s.story.completedChapters.push(chapter.id);if(chapter.id==='chapter-1')s.story.chapterComplete=true;s.story.mapPending=true;syncProgress(s);}
    const xpEarned=s.campaign.battleRecords.filter(r=>r.battleId===b.id).reduce((sum,r)=>sum+(r.xpEarned||0),0);
    s.result={victory,strength:b.maxHealth,battleId:b.id,enemyId:b.enemyId||'thornling',chapterComplete:s.story.chapterComplete,chapterJustComplete,xpEarned}; s.activity='result';
    if(victory&&s.math.winStreak%3===0){
      s.math.round={id:id(s,'math'),battleId:b.id,enemyId:b.enemyId||'thornling',status:'intro',bestAtStart:s.math.best,target:Math.max(1,(s.math.best||0)-2),elapsedMs:0,correct:0,score:0,wrong:0,scoringVersion:2,answers:[],question:null,bag:[],recent:[]};
      s.activity='mathIntro';
    }else if (isSessionDue(s)) {completeSession(s,now);s.activity='result';}
  }
  function startMath(s,now){
    const r=s.math.round;if(!r||r.status!=='intro')return false;
    r.scoringVersion=2;r.score=0;r.wrong=0;
    beginSession(s,now);r.status='playing';r.startedAt=iso(now);s.activity='mathChallenge';prepareMath(s);return true;
  }
  function prepareMath(s,random=Math.random){
    const r=s.math.round;if(!r||r.status!=='playing'||r.elapsedMs>=60000)return null;
    if(r.question?.phase==='answer')return r.question;
    if(!r.bag.length)r.bag=shuffle(Array.from({length:100},(_,i)=>[Math.floor(i/10)+1,i%10+1]),random);
    let index=r.bag.findIndex(([a,b])=>!r.recent.includes([Math.min(a,b),Math.max(a,b)].join('x')));if(index<0)index=0;
    const [a,b]=r.bag.splice(index,1)[0];r.recent.push([Math.min(a,b),Math.max(a,b)].join('x'));r.recent=r.recent.slice(-2);
    r.question={id:id(s,'product'),a,b,input:'',phase:'answer',correct:null};return r.question;
  }
  function answerMath(s,value,now){
    const r=s.math.round,q=r?.question;
    if(!r||r.status!=='playing'||r.elapsedMs>=60000||!q||q.phase!=='answer'||!/^\d{1,3}$/.test(String(value)))return null;
    const rec={id:q.id,task:'multiplication',a:q.a,b:q.b,response:Number(value),correct:Number(value)===q.a*q.b,elapsedMs:r.elapsedMs,at:iso(now)};
    q.phase='feedback';q.correct=rec.correct;q.input=String(value);r.answers.push(rec);
    if(rec.correct){r.correct++;s.dragon.xp++;syncProgress(s,now);}
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
    s.math.records.push({id:r.id,battleId:r.battleId,enemyId:r.enemyId,target:r.target,score,correct:r.correct,wrong:r.wrong||0,scoringVersion:r.scoringVersion||1,bestBefore:r.bestAtStart,bestAfter:s.math.best,beaten:r.beaten,startedAt:r.startedAt,finishedAt:r.finishedAt,elapsedMs:r.elapsedMs,answers:copy(r.answers)});
    s.activity='mathResult';return true;
  }
  function leaveMath(s,now){
    const r=s.math.round;if(!r||!['intro','result'].includes(r.status))return false;
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
  return {fresh,migrate,copy,byWord,TARGET_MS,DAY,GAPS,beginSession,completeSession,addActiveTime,isSessionDue,
    getQuestion,startBattle,prepareBattle,answerBattle,startTeaching,leaveTeaching,noteSupport,resolveBattle,
    startAssessment,leaveHandoff,prepareAssessment,answerAssessment,interruptQuestion,shouldStopAssessment,
    enemyChoices,enemyScale,chapterProgress,areaProgress,dragonProgress,storyProgress,currentChapter,recordTime,parentProgress,dayKey,
    startMath,prepareMath,answerMath,tickMath,finishMath,leaveMath,mathScore,speedChoices,practiceExposure,chooseSpeed};
});
