/* Turtle Race: pure rules for three 60-second reading mini-games. No DOM, no learner-save access. */
// Two editions share these rules: the main BlitzWord race and the standalone expert race, each with its own save.
(function(root,factory){
  if(typeof module==='object'&&module.exports){const api=factory('main');api.edition=name=>factory(name);module.exports=api;}
  else root.TurtleRaceCore=factory(root.TURTLE_RACE_EDITION||'main');
})(typeof globalThis!=='undefined'?globalThis:this,function(editionName){
  'use strict';
  const GAME_MS=60000;
  const MODES=['dash','flash','duel'];
  // Level presets. "Easy" is the five-turtle ladder the child first mastered; it is reused with a second word set.
  const easy=(pool,maxWords)=>({
    dash:[{goal:4,backOnWrong:false},{goal:6,backOnWrong:false},{goal:8,backOnWrong:true},{goal:10,backOnWrong:true},{goal:12,backOnWrong:true}],
    flash:[{goal:5,flashMs:5000,boostMs:5000,backOnWrong:false},{goal:7,flashMs:4000,boostMs:4000,backOnWrong:false},{goal:9,flashMs:3000,boostMs:3000,backOnWrong:true},{goal:11,flashMs:2500,boostMs:3000,backOnWrong:true},{goal:13,flashMs:2000,boostMs:2500,backOnWrong:true}],
    duel:[{shell:3,timerMs:12000,hearts:5},{shell:4,timerMs:10000,hearts:4},{shell:5,timerMs:8000,hearts:3},{shell:7,timerMs:6500,hearts:3},{shell:9,timerMs:5000,hearts:3}]
  });
  const ladder=(preset,pool,maxWords,extra={})=>{const out={};for(const m of MODES)out[m]=preset[m].map((o,i)=>({pool,paraphrase:false,maxWords:maxWords[i],...o,...extra}));return out;};
  const hard={
    dash:[{goal:6},{goal:7},{goal:8},{goal:9},{goal:10}],
    flash:[{goal:7,flashMs:4000,boostMs:4000},{goal:8,flashMs:3500,boostMs:3500},{goal:9,flashMs:3000,boostMs:3000},{goal:10,flashMs:2500,boostMs:3000},{goal:11,flashMs:2200,boostMs:2500}],
    duel:[{shell:5,timerMs:9000,hearts:3},{shell:6,timerMs:8000,hearts:3},{shell:7,timerMs:7000,hearts:3},{shell:8,timerMs:6500,hearts:3},{shell:9,timerMs:6000,hearts:3}]
  };
  const expert={
    dash:[{goal:6},{goal:7},{goal:8},{goal:9},{goal:10}],
    flash:[{goal:7,flashMs:6000,boostMs:6000},{goal:8,flashMs:5000,boostMs:5000},{goal:9,flashMs:4500,boostMs:4500},{goal:10,flashMs:4000,boostMs:4000},{goal:11,flashMs:3500,boostMs:3500}],
    duel:[{shell:5,timerMs:12000,hearts:3},{shell:6,timerMs:11000,hearts:3},{shell:7,timerMs:10000,hearts:3},{shell:8,timerMs:9000,hearts:3},{shell:9,timerMs:8000,hearts:3}]
  };
  const join=(...parts)=>{const out={};for(const m of MODES)out[m]=parts.flatMap(p=>p[m]);return out;};
  const EDITIONS={
    // Main race in BlitzWord: the first five turtles, then the same five rules with a second set of words.
    main:{id:'main',storageKey:'blitzword_turtle_race_v1',version:3,dashboardTime:true,openAll:false,
      names:['Sleepy Turtle','Little Turtle','Brave Turtle','Speedy Turtle','Champion Turtle','River Turtle','Forest Turtle','Mountain Turtle','Storm Turtle','Thunder Turtle'],
      tiers:[{id:'easy',name:'First words',from:1,to:5},{id:'new',name:'New words',from:6,to:10}],
      levels:join(ladder(easy(),'core',[5,5,6,7,7]),ladder(easy(),'core2',[6,6,7,8,8])),
      note:'Each race has ten turtles: 1–5 with the first words, then 6–10 with the same rules and a new set of words.'},
    // Standalone expert race for an older reader: answers in other words, then long sentences.
    expert:{id:'expert',storageKey:'blitzword_turtle_race_expert_v1',version:3,dashboardTime:false,openAll:true,
      names:['River Turtle','Forest Turtle','Mountain Turtle','Storm Turtle','Thunder Turtle','Crystal Turtle','Shadow Turtle','Fire Turtle','Ancient Turtle','Legend Turtle'],
      tiers:[{id:'hard',name:'Other words',from:1,to:5},{id:'expert',name:'Expert',from:6,to:10}],
      levels:join(ladder(hard,'core',[7,7,7,7,7],{paraphrase:true,backOnWrong:true}),ladder(expert,'expert',[99,99,99,99,99],{paraphrase:true,backOnWrong:true})),
      note:'Each race has ten turtles: 1–5 answer short sentences in other words, 6–10 use long sentences with harder words, also answered in other words.'}
  };
  const E=EDITIONS[editionName]||EDITIONS.main;
  const STORAGE_KEY=E.storageKey,NAMES=E.names,TIERS=E.tiers,LEVELS=E.levels;
  const EDITION={id:E.id,dashboardTime:E.dashboardTime,openAll:E.openAll,note:E.note};
  const LEVEL_COUNT=NAMES.length;
  const BOOST_MS=3000;
  const level=(mode,n)=>({...LEVELS[mode][n-1],level:n,name:NAMES[n-1]});
  const tierOf=n=>TIERS.find(t=>n>=t.from&&n<=t.to);
  const words=s=>s.trim().split(/\s+/).length;
  function itemsForLevel(items,mode,n){
    const L=LEVELS[mode][n-1];
    return items.filter(i=>(i.tier||'core')===L.pool&&words(i.s)<=L.maxWords&&(!L.paraphrase||hasParaphrase(i)));
  }
  function describeLevel(mode,n){
    const L=LEVELS[mode][n-1],secs=ms=>(ms/1000).toFixed(ms%1000?1:0)+' s';
    const extra=(L.pool==='core2'?' · new words':'')+(L.pool==='expert'?' · long sentences':'')+(L.paraphrase?' · answers in other words':'')+(L.backOnWrong?'':' · no slipping back');
    if(mode==='dash')return `${L.goal} steps to the finish`+extra;
    if(mode==='flash')return `${L.goal} steps · sentence shows ${secs(L.flashMs)}`+extra;
    return `${L.shell} shells · ${secs(L.timerMs)} per question · ${L.hearts} hearts`+extra;
  }

  function emptyProgress(){return {unlocked:1,selected:1,wins:Array(LEVEL_COUNT).fill(0),plays:Array(LEVEL_COUNT).fill(0)};}
  function emptyStats(){return {started:0,finished:0,wins:0,answers:0,correct:0,answerMs:0,lastPlayed:null};}
  function defaultProfile(){
    const games={},progress={};for(const m of MODES){games[m]=emptyStats();progress[m]=emptyProgress();}
    return {version:E.version,games,progress,history:[],time:{days:{}}};
  }
  // Local calendar day, matching the main game's parent dashboard.
  function dayKey(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  const DAY_MS=86400000;
  // Active race time only: the clock runs while questions are on screen and pauses when the page is hidden.
  function addTime(profile,ms,now){
    const add=Math.round(ms);if(!(add>0))return profile;
    const key=dayKey(now);profile.time.days[key]=Math.min(DAY_MS,(profile.time.days[key]||0)+add);return profile;
  }
  function totalTime(profile){return Object.values(profile.time.days).reduce((a,b)=>a+b,0);}
  // Accept any stored shape; keep valid values, repair the rest. Old automatic difficulty is dropped.
  function normalizeProfile(raw){
    const p=defaultProfile();
    if(!raw||typeof raw!=='object')return p;
    const count=(v)=>Number.isInteger(v)&&v>=0?v:0;
    for(const m of MODES){
      const g=raw.games?.[m]||{};
      for(const k of ['started','finished','wins','answers','correct','answerMs'])p.games[m][k]=Number.isFinite(g[k])&&g[k]>=0?g[k]:0;
      p.games[m].lastPlayed=typeof g.lastPlayed==='string'?g.lastPlayed:null;
      const r=raw.progress?.[m]||{},q=p.progress[m];
      // Main saves from before 26 October 2026 held other-words levels 6-15; those moved to the expert race.
      const keep=E.id==='main'&&!(raw.version>=3)?5:LEVEL_COUNT;
      for(let i=0;i<LEVEL_COUNT;i++){q.wins[i]=i<keep?count(r.wins?.[i]):0;q.plays[i]=i<keep?count(r.plays?.[i]):0;}
      const won=q.wins.reduce((top,w,i)=>w>0?i+1:top,0);
      const saved=Number.isInteger(r.unlocked)?Math.min(r.unlocked,keep+1):1;
      q.unlocked=Math.min(LEVEL_COUNT,Math.max(1,saved,won+1));
      q.selected=Number.isInteger(r.selected)&&r.selected>=1&&r.selected<=q.unlocked?r.selected:Math.min(q.unlocked,Math.max(1,won||1));
    }
    if(Array.isArray(raw.history))p.history=raw.history.filter(h=>h&&MODES.includes(h.mode)).slice(-60);
    const days=raw.time?.days;
    if(days&&typeof days==='object'){
      for(const [k,ms] of Object.entries(days))if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&Number.isSafeInteger(ms)&&ms>0)p.time.days[k]=Math.min(DAY_MS,ms);
    }else{
      // Saves from before time tracking: credit finished races from their history.
      for(const h of p.history){const at=Date.parse(h.at);if(Number.isFinite(at)&&Number.isFinite(h.elapsed)&&h.elapsed>0)addTime(p,Math.min(GAME_MS,h.elapsed),at);}
    }
    return p;
  }
  // Parent option for an older player: open every turtle in every race.
  function unlockAll(profile){for(const m of MODES)profile.progress[m].unlocked=LEVEL_COUNT;return profile;}
  function selectLevel(profile,mode,n){
    const q=profile.progress[mode];
    if(!Number.isInteger(n)||n<1||n>q.unlocked)return false;
    q.selected=n;return true;
  }

  function wordSwap(sentence,from,to){
    const re=new RegExp('\\b'+from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');
    return sentence.replace(re,m=>m[0]===m[0].toUpperCase()&&m[0]!==m[0].toLowerCase()?to[0].toUpperCase()+to.slice(1):to);
  }
  function validateItem(item){
    if(!item||typeof item.s!=='string'||typeof item.q!=='string'||typeof item.a!=='string')return false;
    if(!Array.isArray(item.w)||item.w.length!==2||typeof item.t!=='string'||typeof item.f!=='string')return false;
    const re=new RegExp('\\b'+item.a+'\\b','gi');
    if((item.s.match(re)||[]).length!==1)return false;
    const options=[item.a,...item.w].map(x=>x.toLowerCase());
    return new Set(options).size===3;
  }
  const hasWord=(text,word)=>new RegExp('\\b'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(text);
  function hasParaphrase(item){
    return !!item&&Array.isArray(item.g)&&item.g.length===3&&new Set(item.g).size===3&&typeof item.ps==='string'&&Array.isArray(item.px)&&item.px.length===2&&new Set([item.ps,...item.px]).size===3&&typeof item.pt==='string'&&typeof item.pf==='string';
  }
  // "Other words": the right answer, matching sentence and yes-question never reuse the key word.
  function validateParaphrase(item){
    if(!hasParaphrase(item)||typeof item.a!=='string'||!hasWord(item.s,item.a))return false;
    return ![item.g[0],item.ps,item.pt].some(text=>hasWord(text,item.a));
  }
  function validateExpert(item){
    return !!item&&item.tier==='expert'&&typeof item.s==='string'&&typeof item.q==='string'&&validateParaphrase(item);
  }
  function shuffle(list,rand){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  // Builds one question in the chosen format. Options never include artwork.
  function buildQuestion(mode,item,rand,lastYes,paraphrase){
    const base={mode,sentence:item.s,key:item.a,meaning:paraphrase?item.g[0]:null};
    let yesFirst=null;
    if(mode==='duel'){
      yesFirst=rand()<.5;
      if(Array.isArray(lastYes)&&lastYes.length>=2&&lastYes.slice(-2).every(v=>v===yesFirst))yesFirst=!yesFirst;
    }
    if(paraphrase){
      if(mode==='dash'){const options=shuffle(item.g,rand);return {...base,prompt:item.q,options,answer:options.indexOf(item.g[0])};}
      if(mode==='flash'){const options=shuffle([item.ps,...item.px],rand);return {...base,prompt:'Which one means the same?',options,answer:options.indexOf(item.ps)};}
      return {...base,prompt:yesFirst?item.pt:item.pf,options:['Yes','No'],answer:yesFirst?0:1,yes:yesFirst};
    }
    if(mode==='dash'){
      const options=shuffle([item.a,...item.w],rand);
      return {...base,prompt:item.q,options,answer:options.indexOf(item.a)};
    }
    if(mode==='flash'){
      const options=shuffle([item.s,...item.w.map(w=>wordSwap(item.s,item.a,w))],rand);
      return {...base,prompt:'Which one did you read?',options,answer:options.indexOf(item.s)};
    }
    // Yes/no: avoid three identical answers in a row.
    return {...base,prompt:yesFirst?item.t:item.f,options:['Yes','No'],answer:yesFirst?0:1,yes:yesFirst};
  }

  function createDeck(items,rand){
    let pool=[];
    return {next(){if(!pool.length)pool=shuffle(items,rand);return pool.pop();}};
  }

  function newRun(mode,profile,n){
    if(!MODES.includes(mode))throw Error('Unknown mode');
    const chosen=Number.isInteger(n)?n:profile.progress[mode].selected;
    if(chosen<1||chosen>profile.progress[mode].unlocked)throw Error('Level locked');
    const L=level(mode,chosen);
    const run={mode,level:chosen,levelName:L.name,elapsed:0,over:false,won:null,reason:null,answers:0,correct:0,answerMs:0,fastCorrect:0,streak:0,bestStreak:0,history:[],backOnWrong:L.backOnWrong!==false,paraphrase:!!L.paraphrase,pool:L.pool};
    if(mode==='duel')Object.assign(run,{hearts:L.hearts,maxHearts:L.hearts,shell:L.shell,maxShell:L.shell,timerMs:L.timerMs});
    else Object.assign(run,{steps:0,goal:L.goal});
    if(mode==='flash')Object.assign(run,{flashMs:L.flashMs,boostMs:L.boostMs});
    return run;
  }
  // Turtle position for races, 0..1; it crosses the line exactly at 60 seconds.
  function turtleProgress(run){return Math.min(1,run.elapsed/GAME_MS);}
  function pipProgress(run){return run.mode==='duel'?0:Math.min(1,run.steps/run.goal);}

  function tick(run,elapsed){
    if(run.over)return run;
    run.elapsed=Math.min(GAME_MS,Math.max(run.elapsed,elapsed));
    if(run.elapsed>=GAME_MS)finish(run,false,'time');
    return run;
  }
  function finish(run,won,reason){run.over=true;run.won=won;run.reason=reason;return run;}

  // Applies one answer. ms = time from choices appearing; correct=null means the duel timer expired.
  function answer(run,correct,ms){
    if(run.over)return {delta:0};
    const timedOut=correct===null;
    run.answers++;run.answerMs+=Math.max(0,ms|0);
    const outcome={correct:!!correct,timedOut,delta:0,boost:false};
    if(correct){run.correct++;run.streak++;run.bestStreak=Math.max(run.bestStreak,run.streak);}else run.streak=0;
    const back=()=>run.backOnWrong&&run.steps>0?-1:0;
    if(run.mode==='dash'){
      outcome.delta=correct?1:back();run.steps+=outcome.delta;
    }else if(run.mode==='flash'){
      if(correct){outcome.boost=ms<=run.boostMs;outcome.delta=outcome.boost?2:1;if(outcome.boost)run.fastCorrect++;}
      else outcome.delta=back();
      run.steps=Math.min(run.goal,run.steps+outcome.delta);
    }else{
      if(correct){run.shell--;run.fastCorrect++;outcome.delta=-1;}
      else run.hearts--;
    }
    run.history.push({correct:!!correct,timedOut,ms:ms|0});
    if(run.mode==='duel'){if(run.shell<=0)finish(run,true,'shell');else if(run.hearts<=0)finish(run,false,'hearts');}
    else if(run.steps>=run.goal&&turtleProgress(run)<1)finish(run,true,'line');
    return outcome;
  }

  function recordStart(profile,mode,now){const g=profile.games[mode];g.started++;g.lastPlayed=now;return profile;}
  // Returns the newly opened level number, if this win opened one.
  function recordFinish(profile,run,now){
    const g=profile.games[run.mode],q=profile.progress[run.mode];
    g.finished++;if(run.won)g.wins++;g.answers+=run.answers;g.correct+=run.correct;g.answerMs+=run.answerMs;g.lastPlayed=now;
    q.plays[run.level-1]++;
    let unlockedNow=null;
    if(run.won){q.wins[run.level-1]++;if(run.level===q.unlocked&&q.unlocked<LEVEL_COUNT){q.unlocked++;unlockedNow=q.unlocked;}}
    profile.history.push({mode:run.mode,level:run.level,at:now,won:!!run.won,reason:run.reason,answers:run.answers,correct:run.correct,avgMs:run.answers?Math.round(run.answerMs/run.answers):0,elapsed:Math.round(run.elapsed)});
    profile.history=profile.history.slice(-60);
    return unlockedNow;
  }
  function summary(profile){
    return MODES.map(mode=>{
      const g=profile.games[mode],q=profile.progress[mode];
      return {mode,started:g.started,finished:g.finished,wins:g.wins,quit:Math.max(0,g.started-g.finished),accuracy:g.answers?Math.round(100*g.correct/g.answers):null,avgSeconds:g.answers?Math.round(g.answerMs/g.answers/100)/10:null,lastPlayed:g.lastPlayed,unlocked:q.unlocked,levelWins:q.wins.slice(),levelPlays:q.plays.slice()};
    });
  }

  return {EDITION,EDITION_NAMES:Object.keys(EDITIONS),dayKey,addTime,totalTime,GAME_MS,STORAGE_KEY,MODES,NAMES,TIERS,LEVELS,LEVEL_COUNT,BOOST_MS,level,tierOf,itemsForLevel,describeLevel,defaultProfile,normalizeProfile,unlockAll,selectLevel,validateItem,hasParaphrase,validateParaphrase,validateExpert,wordSwap,buildQuestion,createDeck,shuffle,newRun,tick,answer,turtleProgress,pipProgress,recordStart,recordFinish,summary};
});
