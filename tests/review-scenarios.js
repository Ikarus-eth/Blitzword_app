// Test-only entry. Nothing here reads or writes the browser's learner storage.
window.makeReviewSave=function(scenario){
  const C=BlitzCore,s=C.migrate(C.fresh()),now=Date.now();
  if(scenario==='setup')return s;
  s.profile={name:'Éva',age:7,gender:scenario==='heroes'?'girl':'boy',heroClass:'Archer',heroIndex:2};
  s.screen=scenario==='heroes'?'hero':'route';
  if(['route','heroes'].includes(scenario))return s;
  if(scenario==='teaching'){C.startTeaching(s,'tree','demo',now);return s;}
  if(scenario.startsWith('lesson-')){C.startTeaching(s,scenario.slice(7),'demo',now);return s;}
  if(scenario==='handoff'){s.demoComplete=true;s.handoff={victory:true};s.activity='handoff';return s;}
  if(scenario==='assessment'){C.startAssessment(s,now);return s;}
  s.assessment.done=true;s.demoComplete=true;s.settings.selfPaced=true;C.startBattle(s,now,{strength:4});C.prepareBattle(s,now);
  if(scenario.startsWith('math-')){
    s.math.best=18;s.math.winStreak=2;s.battle.enemyHealth=0;C.resolveBattle(s,now);
    if(scenario!=='math-intro')C.startMath(s,now);
    if(scenario==='math-result'){for(let i=0;i<20;i++){const q=C.prepareMath(s);C.answerMath(s,q.a*q.b,now);}C.tickMath(s,60000,now);}
    return s;
  }
  if(scenario.startsWith('map')||scenario==='parents'){
    if(scenario!=='map'){
      for(const item of BlitzContent.words.slice(0,6)){s.learning.words[item.w].introducedAt=new Date(now).toISOString();s.learning.words[item.w].practiceSuccesses=2;}
      s.campaign.wins=2;s.campaign.checkpointWins=2;
      s.dragon.xp=scenario==='map-near-growth'?249:250;s.timing.firstPracticeAt=new Date(now-14*C.DAY).toISOString();C.recordTime(s,250*60000,'practice',now);
    }
    return C.migrate(s);
  }
  if(['battle','pause'].includes(scenario))s.battle.introPending=false;
  if(['victory','retry','summary'].includes(scenario)){
    // A real core transition supplies all result fields and avoids fake controller state.
    for(const item of BlitzContent.words){s.learning.words[item.w].introducedAt=new Date(now).toISOString();s.learning.words[item.w].familiar=true;}
    while(s.activity==='battle'){
      const q=C.prepareBattle(s,now);q.phase='choices';
      C.answerBattle(s,scenario==='retry'?q.options.find(w=>w!==q.target):q.target,now);
      if(!q.correct){C.startTeaching(s,q.target,'battle',now);C.leaveTeaching(s,now);}
      C.prepareBattle(s,now);
    }
    if(scenario==='summary'){s.session.elapsedMs=s.session.targetMs;}
  }
  return s;
};
