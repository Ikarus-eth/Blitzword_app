(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./content.js'));
  else root.BlitzCore = factory(root.BlitzContent);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(Content) {
  'use strict';
  const DAY = 86400000;
  const GAPS = [1,3,7,14,30];
  const TARGET_MS = 7 * 60 * 1000;
  const byWord = Object.fromEntries(Content.words.map(item => [item.w,item]));
  const iso = now => new Date(now).toISOString();
  const copy = value => JSON.parse(JSON.stringify(value));
  function fresh() {
    return {schemaVersion:2, revision:0, nextId:1,
      profile:{name:'',age:7,gender:'boy',heroClass:'Mage',heroIndex:0},
      assessment:{done:false,records:[],level:0,exposure:1800,lastAxis:'exposure',progress:null},
      learning:{supportedWords:[],teaching:[],supportExposures:[],words:{},sequence:0,recent:[]},
      campaign:{wins:0,checkpointWins:0,enemyStrength:3,battleRecords:[]},
      settings:{selfPaced:false}, activity:'route', screen:'setup', battle:null,
      teaching:null, result:null, session:null, sessions:[], demoComplete:false};
  }
  function migrate(old) {
    if (!old || typeof old !== 'object' || Array.isArray(old)) throw new Error('Invalid saved adventure');
    const base = fresh();
    const s = {...base,...copy(old)};
    for (const key of ['profile','assessment','learning','campaign','settings']) s[key] = {...base[key],...s[key]};
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
    for (const item of Content.words) {
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
    s.session = {id:id(s,'session'),startedAt:iso(now),elapsedMs:0,targetMs:TARGET_MS,
      newWords:[],answers:0,independent:0,correct:0,teaching:0,victories:0,completedAt:null};
    return s.session;
  }
  function completeSession(s, now) {
    if (!s.session || s.session.completedAt) return;
    s.session.completedAt = iso(now);
    s.sessions.push(copy(s.session));
    s.activity = 'summary';
  }
  function addActiveTime(s, ms) {
    if (s.session && !s.session.completedAt && ['battle','teaching','result'].includes(s.activity) && !s.battle?.demo)
      s.session.elapsedMs += Math.max(0,ms);
  }
  function isSessionDue(s) { return !!s.session && !s.session.completedAt && s.session.elapsedMs >= s.session.targetMs; }
  function getQuestion(s) { return s.activity === 'assessment' ? s.assessment.progress?.question : s.battle?.question; }
  function makeQuestion(s,item,now,random,extra={}) {
    return {id:id(s,'answer'),target:item.w,options:shuffle(item.d,random),phase:'ready',
      exposureMs:s.settings.selfPaced?null:s.assessment.exposure,wordViewedMs:0,responseMs:0,
      supportReasons:[],answeredAt:null,correct:null,needsTeaching:false,...extra};
  }
  function recentAccuracy(s) {
    const records = s.campaign.battleRecords.filter(r => r.task === 'battle' && !r.supported).slice(-8);
    return records.length ? records.filter(r => r.correct).length/records.length : 1;
  }
  function selectPracticeWord(s,now) {
    const L=s.learning, recent=L.recent.slice(-2);
    const eligible=item => !recent.includes(item.w) && L.sequence >= L.words[item.w].eligibleAfter;
    const introduced=Content.words.filter(item => L.words[item.w].introducedAt);
    const existing=introduced.filter(eligible).sort((a,b)=>L.words[a.w].lastSequence-L.words[b.w].lastSequence);
    const due=existing.filter(item => L.words[item.w].dueAt <= now);
    const urgent=due.find(item => L.words[item.w].reviewStage>=0 || L.words[item.w].consecutiveMisses>0);
    if (urgent) return urgent;
    const unfinished=introduced.filter(item => L.words[item.w].practiceSuccesses < 2).length;
    const canIntroduce=(s.session?.newWords.length||0)<6 && (introduced.length<3 || (unfinished<4 && recentAccuracy(s)>=.8));
    if (canIntroduce) {
      const unseen=Content.words.filter(item => !L.words[item.w].introducedAt && eligible(item));
      unseen.sort((a,b)=>Number(L.words[b.w].assessmentMiss)-Number(L.words[a.w].assessmentMiss));
      if (unseen.length) return unseen[0];
    }
    if (due.length) return due[0];
    if (existing.length) return existing[0];
    // A tiny starting pool needs distinct intervening material after help.
    const filler=Content.words.find(item=>eligible(item) && (L.words[item.w].introducedAt || (s.session?.newWords.length||0)<6));
    if (!filler) throw new Error('No eligible reviewed word');
    return filler;
  }
  function startBattle(s,now,{demo=false,strength=null}={}) {
    if (!demo) beginSession(s,now);
    const health=demo?5:Math.max(3,strength || s.campaign.enemyStrength || 3);
    s.battle={id:id(s,'battle'),demo,heroHealth:3,enemyHealth:health,maxHealth:health,
      firstMistakeFree:demo,turn:0,question:null,resolved:false};
    s.result=null; s.activity='battle';
  }
  function prepareBattle(s,now,random=Math.random) {
    const b=s.battle;
    if (!b || b.resolved) return;
    if (b.question && !b.question.answeredAt) return b.question;
    if (b.question) b.question.phase='done';
    if (b.heroHealth<=0 || b.enemyHealth<=0) { resolveBattle(s,now); return; }
    if (!b.demo && isSessionDue(s)) { completeSession(s,now); return; }
    const item=b.demo ? byWord[Content.demoWords[b.turn % Content.demoWords.length]] : selectPracticeWord(s,now);
    const word=s.learning.words[item.w];
    const isNew=!word.introducedAt;
    if (!b.demo && isNew) {
      word.introducedAt=iso(now);
      if (!word.familiar && !s.session.newWords.includes(item.w)) s.session.newWords.push(item.w);
    }
    const guided=b.demo && b.turn===0;
    b.question=makeQuestion(s,item,now,random,{exposureMs:b.demo?null:(s.settings.selfPaced?null:s.assessment.exposure),
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
    if (!q || q.answeredAt || q.phase!=='choices' || !q.options.includes(opt)) return null;
    const rec=observation(s,q,opt,now,b.demo?'demoBattle':'battle');
    rec.battleId=b.id; rec.sessionId=b.demo?null:s.session.id;
    rec.heroHealthBefore=b.heroHealth; rec.enemyHealthBefore=b.enemyHealth;
    q.correct=rec.correct; q.answeredAt=rec.at; q.phase=rec.correct?'feedback':'correction';
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
    if (!b || b.resolved) return;
    b.resolved=true;
    if (b.demo) { s.demoComplete=true; s.battle=null; startAssessment(s,now); return; }
    const victory=b.enemyHealth<=0;
    if (victory) { s.campaign.wins++; s.session.victories++; if (s.campaign.wins%2===0) s.campaign.checkpointWins=s.campaign.wins; }
    else s.campaign.wins=s.campaign.checkpointWins;
    s.result={victory,strength:b.maxHealth,battleId:b.id}; s.activity='result';
    if (isSessionDue(s)) completeSession(s,now);
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
      startBattle(s,now); return;
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
    startAssessment,prepareAssessment,answerAssessment,interruptQuestion,shouldStopAssessment};
});
