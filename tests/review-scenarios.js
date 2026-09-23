// Test-only entry. Nothing here reads or writes the browser's learner storage.
window.makeReviewSave=function(scenario){
  const C=BlitzCore,s=C.migrate(C.fresh()),now=Date.now();
  if(scenario==='setup')return s;
  s.profile={name:'Éva',age:7,gender:scenario==='heroes'||scenario.includes('female')?'girl':'boy',heroClass:scenario.includes('mage')?'Mage':scenario.includes('knight')?'Knight':'Archer',heroIndex:2};
  s.screen=scenario==='heroes'?'hero':'route';
  if(['route','heroes'].includes(scenario))return s;
  if(scenario==='teaching'){C.startTeaching(s,'tree','demo',now);return s;}
  if(scenario.startsWith('lesson-')){C.startTeaching(s,scenario.slice(7),'demo',now);return s;}
  if(scenario==='handoff'){s.demoComplete=true;s.handoff={victory:true};s.activity='handoff';return s;}
  if(scenario==='assessment'){C.startAssessment(s,now);return s;}
  s.assessment.done=true;s.demoComplete=true;s.settings.selfPaced=true;
  if(scenario.startsWith('scenery-')){
    const [,mode,number]=scenario.split('-'),index=Number(number),area=BlitzContent.areas[index];
    s.story.clearedAreas=BlitzContent.areas.slice(0,index).map(a=>a.id);
    s.story.completedChapters=BlitzContent.chapters.slice(0,Math.floor(index/5)).map(c=>c.id);
    for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();}
    s.settings.soundscape=false;
    C.startBattle(s,now,{strength:4});
    if(mode==='story'){C.beginChapterStory(s,now);if(s.story.scene){s.story.scene.introHeard=true;C.advanceChapterStory(s,now);}}
    else {s.story.scenes[area.id]={completedAt:new Date(now).toISOString()};if(mode==='battle'){s.battle.introPending=false;C.prepareBattle(s,now);s.battle.question.phase='choices';}}
    return s;
  }
  if(scenario==='map-chapter-2'){
    s.story.chapterComplete=true;s.story.completedChapters=['chapter-1'];
    for(const item of BlitzContent.words.slice(0,30)){s.learning.words[item.w].introducedAt=new Date(now).toISOString();s.learning.words[item.w].practiceSuccesses=2;}
    s.campaign.wins=10;s.campaign.checkpointWins=10;s.dragon.xp=320;s.story.clearedAreas=BlitzContent.areas.slice(0,5).map(a=>a.id);
    Object.assign(s,C.migrate(s));
  }
  if(scenario.startsWith('story-')||scenario==='map-later-chapter'){
    const index=scenario==='story-fox'?1:scenario==='story-sky'?34:7;
    s.story.clearedAreas=BlitzContent.areas.slice(0,index).map(a=>a.id);
    s.story.completedChapters=BlitzContent.chapters.slice(0,Math.floor(index/5)).map(c=>c.id);
    s.dragon.xp=3000;s.dragon.name='Ember';s.dragon.named=true;s.dragon.namingPromptSeen=true;
    C.startBattle(s,now,{strength:4});
    if(scenario!=='map-later-chapter'){C.beginChapterStory(s,now);if(scenario!=='story-intro'){s.story.scene.introHeard=true;C.advanceChapterStory(s,now);}}
    return s;
  }
  C.startBattle(s,now,{strength:4});C.prepareBattle(s,now);
  if(['battle-bonus','map-bonus','math-bonus'].includes(scenario)){C.recordTime(s,25*60000,'practice',now);s.dragon.namingPromptSeen=true;}
  if(scenario==='name-dragon'){s.dragon.xp=3000;return C.migrate(s);}

  if(['battle-shield','map-shield'].includes(scenario))s.rewards.shield=true;
  if(scenario.startsWith('math-')){
    s.math.best=18;s.math.winStreak=2;s.rewards.readingWins=2;s.battle.enemyHealth=0;C.resolveBattle(s,now);
    if(scenario!=='math-intro')C.startMath(s,now);
    if(['math-result','math-loss'].includes(scenario)){for(let i=0;i<(scenario==='math-loss'?3:20);i++){const q=C.prepareMath(s);C.answerMath(s,q.a*q.b,now);}C.tickMath(s,60000,now);}
    return s;
  }
  if(scenario.startsWith('map')||scenario==='parents'){
    if(scenario!=='map'&&scenario!=='map-chapter-2'){
      for(const item of BlitzContent.words.slice(0,6)){s.learning.words[item.w].introducedAt=new Date(now).toISOString();s.learning.words[item.w].practiceSuccesses=2;}
      s.campaign.wins=2;s.campaign.checkpointWins=2;
      s.dragon.xp=scenario==='map-near-growth'?2999:3000;s.dragon.namingPromptSeen=true;
    }
    return C.migrate(s);
  }
  if(['battle','battle-bonus','battle-shield','pause'].includes(scenario)||scenario.startsWith('attack-'))s.battle.introPending=false;
  if(scenario.startsWith('attack-')){
    for(const item of BlitzContent.words){s.learning.words[item.w].introducedAt=new Date(now).toISOString();s.learning.words[item.w].familiar=true;}
    // One real, unassisted answer produces the preview. Never mutate learner storage.
    s.battle.question.supportReasons=[];s.battle.question.phase='choices';
    if(scenario.includes('final'))s.battle.enemyHealth=1;
    C.answerBattle(s,s.battle.question.target,now);
  }
  if(['victory','retry','retry-escape','summary'].includes(scenario)){
    // A real core transition supplies all result fields and avoids fake controller state.
    for(const item of BlitzContent.words){s.learning.words[item.w].introducedAt=new Date(now).toISOString();s.learning.words[item.w].familiar=true;}
    while(s.activity==='battle'){
      const q=C.prepareBattle(s,now);q.phase='choices';
      C.answerBattle(s,scenario.startsWith('retry')?q.options.find(w=>w!==q.target):q.target,now);
      if(!q.correct){C.startTeaching(s,q.target,'battle',now);C.leaveTeaching(s,now);}
      C.prepareBattle(s,now);
    }
    if(scenario==='summary'){s.session.elapsedMs=s.session.targetMs;}
  }
  return s;
};
