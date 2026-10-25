/* Turtle Race: pure rules for three 60-second reading mini-games. No DOM, no learner-save access. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;else root.TurtleRaceCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const GAME_MS=60000;
  const STORAGE_KEY='blitzword_turtle_race_v1';
  const MODES=['dash','flash','duel'];
  // Five fixed turtles per race. Level 1 is meant to be won early; each win opens the next turtle.
  const NAMES=['Sleepy Turtle','Little Turtle','Brave Turtle','Speedy Turtle','Champion Turtle'];
  const LEVELS={
    dash:[
      {goal:4,backOnWrong:false,maxWords:5},
      {goal:6,backOnWrong:false,maxWords:5},
      {goal:8,backOnWrong:true,maxWords:6},
      {goal:10,backOnWrong:true,maxWords:7},
      {goal:12,backOnWrong:true,maxWords:7}
    ],
    flash:[
      {goal:5,flashMs:5000,boostMs:5000,backOnWrong:false,maxWords:5},
      {goal:7,flashMs:4000,boostMs:4000,backOnWrong:false,maxWords:5},
      {goal:9,flashMs:3000,boostMs:3000,backOnWrong:true,maxWords:6},
      {goal:11,flashMs:2500,boostMs:3000,backOnWrong:true,maxWords:7},
      {goal:13,flashMs:2000,boostMs:2500,backOnWrong:true,maxWords:7}
    ],
    duel:[
      {shell:3,timerMs:12000,hearts:5,maxWords:5},
      {shell:4,timerMs:10000,hearts:4,maxWords:5},
      {shell:5,timerMs:8000,hearts:3,maxWords:6},
      {shell:7,timerMs:6500,hearts:3,maxWords:7},
      {shell:9,timerMs:5000,hearts:3,maxWords:7}
    ]
  };
  const LEVEL_COUNT=NAMES.length;
  const BOOST_MS=3000;
  const level=(mode,n)=>({...LEVELS[mode][n-1],level:n,name:NAMES[n-1]});
  const words=s=>s.trim().split(/\s+/).length;
  function itemsForLevel(items,mode,n){return items.filter(i=>words(i.s)<=LEVELS[mode][n-1].maxWords);}
  function describeLevel(mode,n){
    const L=LEVELS[mode][n-1],secs=ms=>(ms/1000).toFixed(ms%1000?1:0)+' s';
    if(mode==='dash')return `${L.goal} steps to the finish`+(L.backOnWrong?'':' · no slipping back');
    if(mode==='flash')return `${L.goal} steps · sentence shows ${secs(L.flashMs)}`+(L.backOnWrong?'':' · no slipping back');
    return `${L.shell} shells · ${secs(L.timerMs)} per question · ${L.hearts} hearts`;
  }

  function emptyProgress(){return {unlocked:1,selected:1,wins:Array(LEVEL_COUNT).fill(0),plays:Array(LEVEL_COUNT).fill(0)};}
  function emptyStats(){return {started:0,finished:0,wins:0,answers:0,correct:0,answerMs:0,lastPlayed:null};}
  function defaultProfile(){
    const games={},progress={};for(const m of MODES){games[m]=emptyStats();progress[m]=emptyProgress();}
    return {version:2,games,progress,history:[]};
  }
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
      for(let i=0;i<LEVEL_COUNT;i++){q.wins[i]=count(r.wins?.[i]);q.plays[i]=count(r.plays?.[i]);}
      const won=q.wins.reduce((top,w,i)=>w>0?i+1:top,0);
      q.unlocked=Math.min(LEVEL_COUNT,Math.max(1,Number.isInteger(r.unlocked)?r.unlocked:1,won+1));
      q.selected=Number.isInteger(r.selected)&&r.selected>=1&&r.selected<=q.unlocked?r.selected:Math.min(q.unlocked,Math.max(1,won||1));
    }
    if(Array.isArray(raw.history))p.history=raw.history.filter(h=>h&&MODES.includes(h.mode)).slice(-60);
    return p;
  }
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
  function shuffle(list,rand){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  // Builds one question in the chosen format. Options never include artwork.
  function buildQuestion(mode,item,rand,lastYes){
    if(mode==='dash'){
      const options=shuffle([item.a,...item.w],rand);
      return {mode,sentence:item.s,prompt:item.q,options,answer:options.indexOf(item.a)};
    }
    if(mode==='flash'){
      const options=shuffle([item.s,...item.w.map(w=>wordSwap(item.s,item.a,w))],rand);
      return {mode,sentence:item.s,prompt:'Which one did you read?',options,answer:options.indexOf(item.s)};
    }
    // Yes/no: avoid three identical answers in a row.
    let yes=rand()<.5;
    if(Array.isArray(lastYes)&&lastYes.length>=2&&lastYes.slice(-2).every(v=>v===yes))yes=!yes;
    return {mode,sentence:item.s,prompt:yes?item.t:item.f,options:['Yes','No'],answer:yes?0:1,yes};
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
    const run={mode,level:chosen,levelName:L.name,elapsed:0,over:false,won:null,reason:null,answers:0,correct:0,answerMs:0,fastCorrect:0,streak:0,bestStreak:0,history:[],backOnWrong:L.backOnWrong!==false};
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

  return {GAME_MS,STORAGE_KEY,MODES,NAMES,LEVELS,LEVEL_COUNT,BOOST_MS,level,itemsForLevel,describeLevel,defaultProfile,normalizeProfile,selectLevel,validateItem,wordSwap,buildQuestion,createDeck,shuffle,newRun,tick,answer,turtleProgress,pipProgress,recordStart,recordFinish,summary};
});
