/* Turtle Race: pure rules for three 60-second reading mini-games. No DOM, no learner-save access. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;else root.TurtleRaceCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const GAME_MS=60000;
  const STORAGE_KEY='blitzword_turtle_race_v1';
  const MODES=['dash','flash','duel'];
  // Each mode adapts between runs so the race stays winnable but close.
  const LIMITS={
    dashGoal:{min:5,max:16,start:8},
    flashGoal:{min:6,max:22,start:11},
    flashMs:{min:1200,max:6000,start:3000},
    duelShell:{min:3,max:12,start:6},
    duelMs:{min:3500,max:10000,start:7000}
  };
  const BOOST_MS=3000;
  const clamp=(v,{min,max})=>Math.max(min,Math.min(max,Math.round(v)));

  function defaultLevels(){
    return {dash:{goal:LIMITS.dashGoal.start},flash:{goal:LIMITS.flashGoal.start,flashMs:LIMITS.flashMs.start},duel:{shell:LIMITS.duelShell.start,timerMs:LIMITS.duelMs.start}};
  }
  function emptyStats(){return {started:0,finished:0,wins:0,answers:0,correct:0,answerMs:0,lastPlayed:null};}
  function defaultProfile(){
    const games={};for(const m of MODES)games[m]=emptyStats();
    return {version:1,levels:defaultLevels(),games,history:[]};
  }
  // Accept any stored shape; keep valid numbers, repair the rest.
  function normalizeProfile(raw){
    const p=defaultProfile();
    if(!raw||typeof raw!=='object')return p;
    const L=raw.levels||{},num=(v,lim)=>Number.isFinite(v)?clamp(v,lim):lim.start;
    p.levels.dash.goal=num(L.dash?.goal,LIMITS.dashGoal);
    p.levels.flash.goal=num(L.flash?.goal,LIMITS.flashGoal);
    p.levels.flash.flashMs=num(L.flash?.flashMs,LIMITS.flashMs);
    p.levels.duel.shell=num(L.duel?.shell,LIMITS.duelShell);
    p.levels.duel.timerMs=num(L.duel?.timerMs,LIMITS.duelMs);
    for(const m of MODES){
      const g=raw.games?.[m]||{};
      for(const k of ['started','finished','wins','answers','correct','answerMs'])p.games[m][k]=Number.isFinite(g[k])&&g[k]>=0?g[k]:0;
      p.games[m].lastPlayed=typeof g.lastPlayed==='string'?g.lastPlayed:null;
    }
    if(Array.isArray(raw.history))p.history=raw.history.filter(h=>h&&MODES.includes(h.mode)).slice(-60);
    return p;
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

  function newRun(mode,profile){
    if(!MODES.includes(mode))throw Error('Unknown mode');
    const lv=profile.levels[mode];
    const run={mode,elapsed:0,over:false,won:null,reason:null,answers:0,correct:0,answerMs:0,fastCorrect:0,streak:0,bestStreak:0,history:[]};
    if(mode==='duel')Object.assign(run,{hearts:3,maxHearts:3,shell:lv.shell,maxShell:lv.shell,timerMs:lv.timerMs});
    else Object.assign(run,{steps:0,goal:lv.goal});
    if(mode==='flash')run.flashMs=lv.flashMs;
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
    if(run.mode==='dash'){
      outcome.delta=correct?1:(run.steps>0?-1:0);run.steps+=outcome.delta;
    }else if(run.mode==='flash'){
      if(correct){outcome.boost=ms<=BOOST_MS;outcome.delta=outcome.boost?2:1;if(outcome.boost)run.fastCorrect++;}
      else outcome.delta=run.steps>0?-1:0;
      run.steps=Math.min(run.goal,run.steps+outcome.delta);
      run.flashMs=clamp(run.flashMs+(correct?-150:400),LIMITS.flashMs);
    }else{
      if(correct){run.shell--;run.fastCorrect++;outcome.delta=-1;run.timerMs=clamp(run.timerMs-300,LIMITS.duelMs);}
      else{run.hearts--;run.timerMs=clamp(run.timerMs+(timedOut?1000:700),LIMITS.duelMs);}
    }
    run.history.push({correct:!!correct,timedOut,ms:ms|0});
    if(run.mode==='duel'){if(run.shell<=0)finish(run,true,'shell');else if(run.hearts<=0)finish(run,false,'hearts');}
    else if(run.steps>=run.goal&&turtleProgress(run)<1)finish(run,true,'line');
    return outcome;
  }

  // Next level after a finished run: one step harder after a win, easier after a loss.
  function adaptLevels(levels,run){
    const next=JSON.parse(JSON.stringify(levels));
    if(run.mode==='dash'){
      const far=run.steps/run.goal;
      next.dash.goal=clamp(run.goal+(run.won?1:(far<.5?-2:-1)),LIMITS.dashGoal);
    }else if(run.mode==='flash'){
      const far=run.steps/run.goal;
      next.flash.goal=clamp(run.goal+(run.won?1:(far<.5?-2:-1)),LIMITS.flashGoal);
      next.flash.flashMs=clamp(run.flashMs,LIMITS.flashMs);
    }else{
      next.duel.shell=clamp(run.maxShell+(run.won?1:-1),LIMITS.duelShell);
      next.duel.timerMs=clamp(run.timerMs,LIMITS.duelMs);
    }
    return next;
  }

  function recordStart(profile,mode,now){const g=profile.games[mode];g.started++;g.lastPlayed=now;return profile;}
  function recordFinish(profile,run,now){
    const g=profile.games[run.mode];
    g.finished++;if(run.won)g.wins++;g.answers+=run.answers;g.correct+=run.correct;g.answerMs+=run.answerMs;g.lastPlayed=now;
    profile.levels=adaptLevels(profile.levels,run);
    profile.history.push({mode:run.mode,at:now,won:!!run.won,reason:run.reason,answers:run.answers,correct:run.correct,avgMs:run.answers?Math.round(run.answerMs/run.answers):0,elapsed:Math.round(run.elapsed)});
    profile.history=profile.history.slice(-60);
    return profile;
  }
  function summary(profile){
    return MODES.map(mode=>{
      const g=profile.games[mode];
      return {mode,started:g.started,finished:g.finished,wins:g.wins,quit:Math.max(0,g.started-g.finished),accuracy:g.answers?Math.round(100*g.correct/g.answers):null,avgSeconds:g.answers?Math.round(g.answerMs/g.answers/100)/10:null,lastPlayed:g.lastPlayed};
    });
  }

  return {GAME_MS,STORAGE_KEY,MODES,LIMITS,BOOST_MS,defaultProfile,normalizeProfile,validateItem,wordSwap,buildQuestion,createDeck,shuffle,newRun,tick,answer,turtleProgress,pipProgress,adaptLevels,recordStart,recordFinish,summary};
});
