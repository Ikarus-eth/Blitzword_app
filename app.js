(() => {
'use strict';
const Core=BlitzCore, Content=BlitzContent, {AdventureStore,KEY}=BlitzStorage;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const classes=['Mage','Knight','Archer'];
const playClock=new BlitzEngagement.Clock();let windowFocused=true,parentAnswer=0;
const maleHeroSheet='assets/rowanfire-boys-2026-09-21.png';
const heroAssets=[maleHeroSheet,maleHeroSheet,maleHeroSheet,'assets/hero4.webp','assets/hero5.webp','assets/hero6.webp'];
const malePortraitCrops=[{x:183,y:145},{x:636,y:145},{x:1099,y:145}];
const narrator=BlitzAudio.narrator({synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance});
let store,state,paused=true,playing=false,blocked=false,lastTick=performance.now(),timer=null,epoch=0;
const spriteCrops=[{x:0,y:0,w:384,h:538},{x:384,y:0,w:426,h:538},{x:780,y:0,w:374,h:538},{x:1154,y:0,w:382,h:538},{x:0,y:538,w:384,h:486},{x:384,y:538,w:384,h:486},{x:768,y:630,w:384,h:370},{x:1152,y:650,w:384,h:350}];
let spriteSerial=0;
let selectedMapArea=null;
function paintSprite(element,index) {
  const crop=spriteCrops[index],clip='sprite-crop-'+(++spriteSerial);
  const shape=index===1?'<polygon points="384,0 780,0 780,350 765,394 810,525 384,538"/>':index===2?'<polygon points="820,0 1154,0 1154,538 820,538 810,486 790,440 780,360"/>':`<rect x="${crop.x}" y="${crop.y}" width="${crop.w}" height="${crop.h}"/>`;
  element.dataset.sprite=String(index);element.style.backgroundImage='none';
  element.innerHTML=`<svg viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style="display:block;overflow:hidden"><defs><clipPath id="${clip}">${shape}</clipPath></defs><image href="assets/forest-characters.webp" width="1536" height="1024" clip-path="url(#${clip})"/></svg>`;
}
function paintHero(element,index) {
  if(element.classList.contains('sceneSprite')){paintSprite(element,index);element.setAttribute('aria-label',classes[index%3]+' hero');return;}

  element.classList.add('heroPortrait');element.setAttribute('role','img');
  element.setAttribute('aria-label',classes[index%3]+' hero');element.dataset.heroIndex=String(index);
  element.style.backgroundImage=`url("${heroAssets[index]}")`;
  if(index<3){const crop=malePortraitCrops[index];element.style.backgroundSize='480% 320%';element.style.backgroundPosition=`${100*crop.x/(1536-320)}% ${100*crop.y/(1024-320)}%`;}
  else {element.style.backgroundSize='cover';element.style.backgroundPosition='center';}
}
function heroIndex(){return (state.profile.gender==='boy'?0:3)+classes.indexOf(state.profile.heroClass);}
function paintEnemy(element,enemyId,health=3){
  const enemy=Content.enemies.find(item=>item.id===enemyId)||Content.enemies[0];
  element.dataset.enemy=enemy.id;element.style.setProperty('--enemy-scale',Core.enemyScale(health));
  element.style.setProperty('--enemy-aspect',enemy.crop?enemy.crop[2]/enemy.crop[3]:spriteCrops[enemy.sprite].w/spriteCrops[enemy.sprite].h);
  element.setAttribute('role','img');element.setAttribute('aria-label',enemy.name);
  if(enemy.sprite!==undefined)paintSprite(element,enemy.sprite);
  else {element.style.backgroundImage='none';element.innerHTML=`<svg viewBox="${enemy.crop.join(' ')}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style="display:block;overflow:hidden"><image href="assets/forest-opponents.png" width="1536" height="1024"/></svg>`;}
}
function healthSymbols(element,health){
  element.textContent=health<=8?'♥'.repeat(health):'♥ × '+health;
  element.setAttribute('aria-label',health+' hearts');
}
function paintPip(element,stage=state.dragon.stage){
  const design=Content.dragonStages[stage];element.style.setProperty('--pip-scale',design.scale);element.dataset.growth=String(stage);
  if(stage===0)paintSprite(element,6);
  else{element.style.backgroundImage='none';element.innerHTML=`<svg viewBox="${design.crop.join(' ')}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style="display:block;overflow:hidden"><image href="assets/pip-growth.png" width="1536" height="1024"/></svg>`;}
  element.setAttribute('role','img');element.setAttribute('aria-label',design.name);
}
function growthCaption(p){
  if(!p.next)return 'Pip is ready to ride';
  return p.remaining+' XP · '+p.minutesRemaining+' active min · '+p.daysRemaining+' days to '+p.next.name+(p.next.requiresChapter&&!state.story.chapterComplete?' · final win needed':'');
}
function renderChapter(element,compact=false){
  const p=Core.storyProgress(state);element.replaceChildren();
  const title=document.createElement('span');title.className='chapterLabel';title.textContent='Chapter 1';
  const count=document.createElement('span');count.className='chapterCount';count.textContent=p.cleared+' / '+p.total+(compact?'':' places explored');
  const track=document.createElement('span');track.className='chapterTrack';track.setAttribute('role','progressbar');track.setAttribute('aria-label','Chapter 1 places explored');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(p.total));track.setAttribute('aria-valuenow',String(p.cleared));
  const fill=document.createElement('span');fill.style.width=(100*p.cleared/p.total)+'%';track.append(fill);element.append(title,count,track);
}
function renderMap(){
  show('campaignMap');$('#pausePanel').hidden=true;
  const progress=Core.storyProgress(state),growth=Core.dragonProgress(state);
  const current=progress.areas.find(area=>area.status==='current')||progress.areas.filter(area=>area.available).at(-1);
  selectedMapArea=selectedMapArea||current.id;
  const selected=progress.areas.find(area=>area.id===selectedMapArea)||current;
  const nodes=$('#mapNodes');nodes.replaceChildren();
  progress.areas.forEach((area,i)=>{
    const button=document.createElement('button');button.className='mapNode '+area.status+(area.id===selected.id?' selected':'');
    button.style.left=`clamp(52px,${area.x}%,calc(100% - 52px))`;button.style.top=area.y+'%';button.dataset.area=area.id;
    button.setAttribute('aria-label',area.name+', '+(area.status==='future'?'coming soon':area.status==='cleared'?'explored':area.status==='current'?'current destination':'locked'));
    button.setAttribute('aria-pressed',String(area.id===selected.id));
    const marker=document.createElement('span');marker.className='mapMarker';marker.textContent=area.status==='cleared'?'✓':String(i+1);
    const label=document.createElement('span');label.className='mapNodeName';label.textContent=area.name;
    const status=document.createElement('small');status.textContent=area.status==='future'?'Coming soon':area.status==='cleared'?'Explored':area.status==='current'?'You are here':'Locked';
    button.append(marker,label,status);button.onclick=()=>{selectedMapArea=area.id;renderMap();};nodes.append(button);
  });
  const hero=$('#mapTraveller');paintHero(hero,heroIndex());hero.style.left=current.x+'%';hero.style.top=(current.y-9)+'%';
  $('#mapStory').textContent=progress.cleared+' / '+progress.total+' places explored';
  $('#mapStory').setAttribute('aria-label',progress.cleared+' of '+progress.total+' story areas explored');
  $('#mapAreaTitle').textContent=selected.name;
  $('#mapAreaStatus').textContent=selected.status==='future'?'Coming soon':selected.status==='cleared'?'Trail explored':selected.status==='locked'?'Further along the trail':state.battle?.fromAssessment&&!state.battle.mapSeen?'Reading check complete · Chapter 1 begins':'Your next story step';
  $('#mapAreaGoal').textContent=selected.status==='cleared'?selected.discovery:selected.goal;
  const markers=$('#mapAreaProgress');markers.replaceChildren();
  if(selected.available){
    const wins=document.createElement('span');wins.className='mapGoal';wins.textContent=(selected.secured?'◆ ◆':selected.wins===1?'◆ ◇':'◇ ◇')+'  Checkpoint';wins.setAttribute('aria-label',selected.wins+' of 2 victories towards this checkpoint');
    const words=document.createElement('span');words.className='mapGoal';words.textContent=selected.introduced+' / '+selected.total+' words found';
    const practice=document.createElement('span');practice.className='mapGoal';practice.textContent=Math.min(selected.reliable,selected.required)+' / '+selected.required+' words practiced';
    markers.append(wins,words,practice);
  }
  const start=$('#mapContinue');start.disabled=selected.status==='future'||selected.status==='locked';
  start.textContent=start.disabled?(selected.status==='future'?'Coming soon':'Explore the earlier place first'):state.math.round?'Continue multiplication →':state.teaching?'Continue the example →':state.result?'Choose an opponent →':state.battle?.question?'Continue battle →':selected.status==='cleared'?'Practice with Pip →':'Explore →';
  paintPip($('#mapPip'));$('#dragonStage').textContent=growth.current.name;$('#dragonXP').textContent=growth.xp+' XP';
  $('#dragonNext').textContent=growthCaption(growth);$('#mapGrowthSummary').textContent=growthCaption(growth);
  const bar=$('#dragonProgress');bar.querySelector('span').style.width=(100*growth.fraction)+'%';bar.setAttribute('aria-valuemin',String(growth.current.xp));bar.setAttribute('aria-valuemax',String(growth.next?.xp||growth.current.xp));bar.setAttribute('aria-valuenow',String(Math.min(growth.xp,growth.next?.xp||growth.current.xp)));bar.setAttribute('aria-valuetext',growthCaption(growth));
  const stages=$('#dragonStages');stages.replaceChildren();Content.dragonStages.forEach((stage,i)=>{
    const item=document.createElement('li');item.className=i===growth.stage?'current':i<growth.stage?'earned':'future';
    const art=document.createElement('span');art.className='stagePortrait';paintPip(art,i);
    const label=document.createElement('span');label.textContent=stage.name.replace(' Pip','');const xp=document.createElement('small');xp.textContent=i<=growth.stage?'✓':stage.xp+' XP · '+stage.minMinutes+' min'+(stage.requiresChapter?' + final win':'');
    item.append(art,label,xp);stages.append(item);
  });save();
}
function cancelWork(){clearTimeout(timer);timer=null;epoch++;narrator.cancel();}
function later(fn,ms){const token=epoch;clearTimeout(timer);timer=setTimeout(()=>{if(!paused&&!blocked&&token===epoch)fn();},ms);}
function activityCategory(){
  if(!state||paused||blocked||!playing)return null;
  if(state.activity==='mathChallenge'&&state.screen==='mathChallenge'&&state.math.round?.status==='playing')return 'math';
  if(state.activity==='battle'&&state.screen==='battle'&&!state.battle.introPending&&state.battle.question)return state.battle.demo?'demo':'practice';
  if(state.activity==='teaching'&&state.screen==='teaching')return state.teaching?.returnTo==='demo'||state.battle?.demo?'demo':'practice';
  if(state.activity==='assessment'&&state.screen==='assessment'&&state.assessment.instructionsSeen&&state.assessment.progress?.question)return 'assessment';
  return null;
}
function drainExcluded(){const ms=playClock.takeExcluded();if(state&&ms)Core.recordTime(state,ms,'idle',Date.now());}
function account(){
  const now=performance.now();lastTick=now;if(!state)return;
  const category=activityCategory(),delta=playClock.sample({mono:now,wall:Date.now(),category,visible:!document.hidden,focused:windowFocused});
  drainExcluded();
  if(category==='math'){
    if(Core.tickMath(state,delta,Date.now())){playClock.discard();drainExcluded();cancelWork();renderMath();}
    else updateMathHud();
  }
  const q=Core.getQuestion(state);
  if(category&&category!=='math'&&q&&!q.answeredAt){if(q.phase==='word')q.wordViewedMs+=delta;if(q.phase==='choices')q.responseMs+=delta;}
  if(category&&playClock.expired&&!document.hidden&&windowFocused)pause('idle');
}
function confirmActivity(){
  account();if(paused||blocked||playClock.expired)return false;
  for(const part of playClock.confirm(performance.now()))Core.recordTime(state,part.ms,part.category,part.end);
  drainExcluded();return true;
}
function formatTime(ms){const seconds=Math.floor(ms/1000);return Math.floor(seconds/60)+' min '+String(seconds%60).padStart(2,'0')+' sec';}
function openParentGate(){
  home();parentAnswer=17+Math.floor(Math.random()*9);$('#parentQuestion').textContent='What is 17 + '+(parentAnswer-17)+'?';$('#parentAnswer').value='';$('#parentGateMessage').textContent='';$('#parentGate').hidden=false;$('#parentAnswer').focus();
}
function renderParent(){
  const p=Core.parentProgress(state),g=Core.dragonProgress(state);show('parentDashboard');
  $('#parentToday').textContent=formatTime(p.today.practice+(p.today.math||0)+p.today.assessment+p.today.demo);
  $('#parentTotal').textContent=formatTime(p.activeMs);$('#parentPractice').textContent=formatTime(p.totals.practice+p.totals.math);
  $('#parentMath').textContent=formatTime(p.totals.math)+' multiplication · PR: '+(state.math.best===null?'not set':state.math.best+' correct in 60 seconds')+'.';
  $('#parentIdle').textContent=formatTime(p.totals.idle);$('#parentLegacy').textContent=formatTime(p.legacyMs);
  $('#parentGrowth').textContent=g.current.name+' · '+g.xp+' XP. '+growthCaption(g)+'.';
  $('#parentLearning').textContent=p.introduced+' / '+Content.words.length+' words introduced · '+p.practiced+' practiced twice · '+p.correct+' / '+p.independent+' unaided answers correct.';
  const body=$('#parentDays');body.replaceChildren();
  for(const [date,d] of p.days.slice(0,30)){
    const row=document.createElement('tr');for(const value of [date,formatTime(d.practice),formatTime(d.math||0),formatTime(d.assessment+d.demo),formatTime(d.idle)]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}body.append(row);
  }
  $('#parentEmpty').hidden=p.days.length>0;save();
}
function storageProblem(error) {
  blocked=true;paused=true;cancelWork();
  $('#saveMessage').textContent=error.message;
  $('#retrySave').hidden=error.code==='corrupt'||error.code==='conflict'||!state;
  $('#reloadSaved').hidden=!!state&&error.code==='storage';
  $('#saveNotice').hidden=false;
}
function save(){account();try{store.save(state);return true;}catch(e){storageProblem(e);return false;}}
function show(id) {
  $$('.screen').forEach(el=>el.classList.toggle('active',el.id===id));
  $('#pauseBtn').hidden=!['battle','assessment','result','mathChallenge'].includes(id);
  $('#homeBtn').hidden=['setup','route','campaignMap','parentDashboard'].includes(id);
  $('#backBtn').hidden=id!=='hero';
  if(!['battle','assessment'].includes(id))$('#wordReady').hidden=true;
  state.screen=id;
  $$('#'+id+' [data-sprite="6"]').forEach(element=>paintPip(element));
}
function speak(text,{onEnd=null,onBoundary=null}={}) {
  const token=epoch;
  narrator.speak(text,{preferred:state.settings.voiceURI||'',
    onEnd:()=>{if(token===epoch&&!paused&&!blocked&&onEnd)onEnd();},
    onBoundary:event=>{if(token===epoch&&!paused&&!blocked&&onBoundary)onBoundary(event);}});
}
function populateVoices(){
  const select=$('#voiceChoice'),voices=(window.speechSynthesis?.getVoices()||[]).filter(v=>/^en[-_]/i.test(v.lang)).sort((a,b)=>BlitzAudio.rankVoice(b)-BlitzAudio.rankVoice(a));
  select.replaceChildren(new Option('Automatic', ''));
  voices.forEach(v=>select.append(new Option(v.name+' ('+v.lang+')',v.voiceURI)));
  select.value=state.settings.voiceURI||'';
}

function renderHeroes(){
  const grid=$('#heroGrid');grid.replaceChildren();
  classes.forEach((name,i)=>{
    const button=document.createElement('button');button.className='heroCard'+(state.profile.heroClass===name?' selected':'');
    button.setAttribute('aria-pressed',String(state.profile.heroClass===name));
    const portrait=document.createElement('span');portrait.className='sceneSprite';portrait.setAttribute('role','img');const label=document.createElement('div');label.className='heroName';label.textContent=name;
    paintHero(portrait,(state.profile.gender==='boy'?0:3)+i);button.append(portrait,label);
    button.onclick=()=>{state.profile.heroClass=name;state.profile.heroIndex=heroIndex();if(save())renderHeroes();};grid.append(button);
  });
}
function home() {
  if(playing&&!paused)confirmActivity();account();Core.interruptQuestion(state);cancelWork();paused=true;playing=false;playClock.discard();drainExcluded();
  $('#pausePanel').hidden=true;
  selectedMapArea=null;
  if(state.assessment.done){renderMap();return;}
  paintHero($('#routeHeroImg'),heroIndex());
  $('#routeTitle').textContent=state.profile.name+', ready to explore?';
  $('#routeName').textContent='Pip is coming with you.';
  $('#homeChapter').hidden=!state.assessment.done;if(state.assessment.done)renderChapter($('#homeChapter'));
  const resumable=state.assessment.done||state.battle||state.teaching||state.assessment.progress||state.demoComplete;
  $('#continueAdventure').hidden=!resumable;
  $('#continueAdventure').textContent=state.session?.completedAt?'Keep exploring →':(state.assessment.progress?'Continue reading check →':'Keep exploring →');
  $('#tryBattle').hidden=!!resumable;$('#checkFirst').hidden=!!resumable;
  $('#sessionNote').textContent=store.recovered?'Your last saved copy was recovered.':resumable?'Your progress is saved on this device.':'';
  show('route');save();
}
function enter() {
  if(blocked)return;
  paused=false;playing=true;windowFocused=true;playClock.reset(performance.now());drainExcluded();lastTick=performance.now();$('#pausePanel').hidden=true;renderActivity();
}
function continueAdventure() {
  if(state.session?.completedAt) {
    Core.beginSession(state,Date.now());
    state.activity=state.math.round?mathActivity():state.teaching?'teaching':state.result?'result':state.battle&&!state.battle.resolved?'battle':'route';
  }
  if(state.activity==='route') {
    if(state.math.round)state.activity=mathActivity();
    else if(state.handoff)state.activity='handoff';
    else if(state.teaching)state.activity='teaching';
    else if(state.assessment.progress)state.activity='assessment';
    else if(state.battle&&!state.battle.resolved)state.activity='battle';
    else if(state.result)state.activity='result';
    else if(state.assessment.done)Core.startBattle(state,Date.now());
    else Core.startAssessment(state,Date.now());
  }
  if(save())enter();
}
function pause(reason='manual'){
  if(paused||blocked||!playing)return;
  if(reason==='manual'){confirmActivity();if(paused||blocked)return;}
  else{playClock.discard();drainExcluded();}
  Core.interruptQuestion(state);paused=true;cancelWork();
  if(!save())return;showPausePanel();$('#pauseReason').textContent=reason==='idle'?'Paused after 30 seconds without a game action. Waiting time was not added.':reason==='away'?'Paused while the game was out of view.':'Your progress is saved.';
}
function showPausePanel(){
  $('#selfPacedSetting').checked=state.settings.selfPaced;
  $('#paceSetting').hidden=state.activity==='assessment'||state.activity==='mathChallenge'||!state.assessment.done;
  $('#pauseTime').textContent=state.session?`${Math.floor(state.session.elapsedMs/60000)} min practiced · about 7 min per challenge`:'';
  populateVoices();$('#grownupSettings').open=false;$('#pausePanel').hidden=false;
}
function finishForNow() {
  if(blocked)return;
  if(state.session&&!state.session.completedAt&&!state.battle?.demo){Core.completeSession(state,Date.now());if(save())enter();}
  else home();
}
function renderActivity() {
  cancelWork();$('#feedback').classList.remove('show');
  $('#xpReward').hidden=true;
  $('#battleHeroImg').classList.remove('attack','heroHit','heroDefeated');$('#enemyFace').classList.remove('enemyHit','enemyAttack','enemyDefeated');
  $('#combatEffects').className='combatEffects';$('#battle').classList.remove('correcting');
  $('#encounterIntro').hidden=true;$('#assessmentIntro').hidden=true;
  if(state.activity.startsWith('math')){renderMath();return;}
  if(state.activity==='handoff'){renderHandoff();return;}
  if(state.activity==='battle') {
    if(!state.battle)Core.startBattle(state,Date.now());
    if(state.battle.fromAssessment&&!state.battle.mapSeen){home();return;}
    if(state.battle.introPending){renderEncounter();return;}
    if(!state.battle.question||state.battle.question.phase==='done')Core.prepareBattle(state,Date.now());
    if(!save())return;
    if(state.activity!=='battle'){renderActivity();return;}
    show('battle');paintHero($('#battleHeroImg'),heroIndex());renderHud();
    const q=state.battle.question;
    if(q.answeredAt){if(q.correct)correctFeedback();else correction();}else presentQuestion();
  } else if(state.activity==='assessment') {
    if(!state.assessment.instructionsSeen){show('assessment');$('#assessmentIntro').hidden=false;$('#assessmentAnswers').replaceChildren();$('#assessmentScroll').textContent='';$('#assessmentUnsure').hidden=true;
      speak('Let’s try a few words. Look at the word. When it hides, tap the same word. Tap the question mark if you are not sure.');return;}
    Core.prepareAssessment(state,Date.now());
    if(!save())return;
    if(state.activity!=='assessment'){renderActivity();return;}
    show('assessment');$('#assessmentProgress').textContent='Word '+String(state.assessment.progress.records.length+1);const q=Core.getQuestion(state);
    if(q.answeredAt)assessmentFeedback();else presentQuestion();
  } else if(state.activity==='teaching')renderTeaching();
  else if(state.activity==='result')renderResult();
  else if(state.activity==='summary')renderSummary();
  else home();
}
function mathActivity(){return {intro:'mathIntro',playing:'mathChallenge',result:'mathResult'}[state.math.round.status];}
function updateMathHud(){
  const r=state.math.round;if(!r)return;
  $('#mathTime').textContent=Math.ceil((60000-r.elapsedMs)/1000)+'s';
  $('#mathTime').classList.toggle('low',r.elapsedMs>=50000);
  $('#mathScore').textContent=String(r.correct);$('#mathTarget').textContent=String(r.target);
  $('#mathPR').textContent=r.bestAtStart===null?'—':String(r.bestAtStart);
  const bar=$('#mathTargetBar');bar.querySelector('span').style.width=(100*Math.min(1,r.correct/r.target))+'%';
  bar.setAttribute('aria-valuenow',String(Math.min(r.correct,r.target)));bar.setAttribute('aria-valuemax',String(r.target));
}
function renderMath(){
  const r=state.math.round;if(!r){home();return;}
  const enemy=Content.enemies.find(e=>e.id===r.enemyId)||Content.enemies[0];show(mathActivity());
  if(r.status==='intro'){
    paintEnemy($('#mathRevivedEnemy'),r.enemyId,state.battle?.maxHealth||3);
    $('#mathIntroTitle').textContent=enemy.name+' rises again!';
    $('#mathIntroPR').textContent=r.bestAtStart===null?'Set your first personal record': 'Your personal record: '+r.bestAtStart;
    $('#mathIntroTarget').textContent='Enemy target: '+r.target+' correct';return;
  }
  if(r.status==='result'){
    paintEnemy($('#mathResultEnemy'),r.enemyId,state.battle?.maxHealth||3);
    $('#mathResultTitle').textContent=r.newBest?'New personal record!':r.beaten?'Challenge won!':'Good practice!';
    $('#mathResultScore').textContent=r.correct+' correct';
    $('#mathResultDetail').textContent='PR '+state.math.best+' · Enemy target '+r.target+' · +'+r.correct+' XP';
    $('#mathResultMessage').textContent=r.beaten?enemy.name+' bows to your number power.': 'Your reading victory is safe. Try again after three more wins.';return;
  }
  paintEnemy($('#mathEnemy'),r.enemyId,state.battle?.maxHealth||3);updateMathHud();
  const q=r.question||Core.prepareMath(state);$('#mathEquation').textContent=q.a+' × '+q.b+' =';
  $('#mathInput').textContent=q.input||'?';$('#mathFeedback').textContent='';
  $$('#mathKeys button').forEach(button=>button.disabled=q.phase!=='answer');
  if(q.phase==='feedback'){
    $('#mathFeedback').textContent=q.correct?'✓ +1 XP':q.a+' × '+q.b+' = '+q.a*q.b;
    later(()=>{Core.prepareMath(state);if(save())renderMath();},q.correct?180:700);
  }
}
function mathKey(key){
  if(state.activity!=='mathChallenge'||!confirmActivity())return;
  const r=state.math.round,q=r?.question;if(r?.status!=='playing'||q?.phase!=='answer')return;
  if(key==='enter'){
    if(!q.input)return;
    if(Core.answerMath(state,q.input,Date.now())&&save())renderMath();return;
  }
  if(key==='back')q.input=q.input.slice(0,-1);else if(/^\d$/.test(key)&&q.input.length<3)q.input=(q.input==='0'?'':q.input)+key;
  $('#mathInput').textContent=q.input||'?';save();
}
function stageElements(){return state.activity==='assessment'?[$('#assessmentScroll'),$('#assessmentAnswers')]:[$('#battleScroll'),$('#battleAnswers')];}
function setPhase(q,phase){account();q.phase=phase;return save();}
function presentQuestion() {
  const q=Core.getQuestion(state),[scroll,answers]=stageElements();
  answers.replaceChildren();$('#assessmentUnsure').hidden=true;$('#battleUnsure').hidden=true;$('#wordReady').hidden=true;
  scroll.className='scroll parchment';
  if(q.phase==='choices'){drawChoices();return;}
  if(!setPhase(q,'fix'))return;
  scroll.classList.add('fix');scroll.textContent='•';
  later(()=>{
    if(!setPhase(q,'word'))return;scroll.classList.remove('fix');scroll.textContent=q.target;
    if(q.exposureMs===null)$('#wordReady').hidden=false;
    else later(hideWord,q.exposureMs);
  },460);
}
function hideWord() {
  const q=Core.getQuestion(state);if(!q||q.phase!=='word'||paused||blocked)return;
  $('#wordReady').hidden=true;if(!setPhase(q,'mask'))return;
  stageElements()[0].innerHTML='<div class="mask"></div>';
  later(()=>{if(setPhase(q,'choices'))drawChoices();},220);
}
function drawChoices() {
  const q=Core.getQuestion(state),[scroll,answers]=stageElements();
  scroll.innerHTML='<div class="mask"></div>';answers.replaceChildren();
  q.options.forEach(option=>{const button=document.createElement('button');button.className='answer';button.textContent=option;button.onclick=()=>answer(option);answers.append(button);});
  $('#assessmentUnsure').hidden=state.activity!=='assessment';$('#battleUnsure').hidden=state.activity!=='battle';lastTick=performance.now();
}
function answer(option) {
  if(paused||blocked)return;
  if(!confirmActivity())return;const assessment=state.activity==='assessment';
  const rec=assessment?Core.answerAssessment(state,option,Date.now()):Core.answerBattle(state,option,Date.now());
  if(!rec)return;
  cancelWork();stageElements()[1].replaceChildren();$('#assessmentUnsure').hidden=true;$('#battleUnsure').hidden=true;
  if(!save())return;
  if(assessment)assessmentFeedback();else{renderHud();if(rec.correct)correctFeedback();else correction(true);}
}
function assessmentFeedback() {
  const q=Core.getQuestion(state);$('#assessmentAnswers').replaceChildren();$('#assessmentUnsure').hidden=true;$('#battleUnsure').hidden=true;
  $('#assessmentScroll').textContent=q.correct?'✓':'•';
  later(()=>{Core.prepareAssessment(state,Date.now());if(save())renderActivity();},430);
}
function correctFeedback() {
  const q=state.battle.question;
  $('#battleScroll').textContent=q.target;$('#battleAnswers').replaceChildren();
  const supported=q.supportReasons.length>0;
  $('#feedback').textContent=supported?'Practice ✓':'✓';$('#feedback').classList.add('show');
  if(q.xpEarned){$('#xpReward').hidden=false;$('#xpReward').textContent=q.grewTo!==null&&q.grewTo!==undefined?'Pip grew! '+Content.dragonStages[q.grewTo].name:'+'+q.xpEarned+' XP';paintPip($('#battle .battlePip'));}
  speak(q.target,{onEnd:()=>{if(!supported)combatReaction(true);later(advanceBattle,1150);}});
}
function combatReaction(correct){
  const effects=$('#combatEffects');effects.className='combatEffects '+(correct?'heroStrike ':'enemyStrike ')+state.profile.heroClass.toLowerCase();
  if(correct){$('#battleHeroImg').classList.add('attack');$('#enemyFace').classList.add(state.battle.enemyHealth<=0?'enemyDefeated':'enemyHit');}
  else{$('#enemyFace').classList.add('enemyAttack');$('#battleHeroImg').classList.add(state.battle.heroHealth<=0?'heroDefeated':'heroHit');}
}
function correction(animate=false) {
  const q=state.battle.question;
  const chosen=q.firstResponse??state.campaign.battleRecords.find(r=>r.id===q.id)?.firstResponse;
  $('#battle').classList.add('correcting');$('#battleAnswers').replaceChildren();$('#battleUnsure').hidden=true;
  const scroll=$('#battleScroll');scroll.className='scroll parchment correctionScroll';scroll.replaceChildren();
  if(chosen&&chosen!=='?'){
    const selected=document.createElement('div');selected.className='selectedWord';
    const label=document.createElement('small');label.textContent='You chose';const word=document.createElement('span');word.textContent=chosen;selected.append(label,word);scroll.append(selected);
    const arrow=document.createElement('span');arrow.className='correctionArrow';arrow.textContent='→';scroll.append(arrow);
  }
  const correct=document.createElement('div');correct.className='correctWord';const label=document.createElement('small');label.textContent='Word shown';const target=document.createElement('span');target.textContent=q.target;correct.append(label,target);scroll.append(correct);
  const next=document.createElement('button');next.className='greenButton correctionNext';next.textContent='→';next.setAttribute('aria-label','See the example');
  next.onclick=()=>{if(!confirmActivity())return;Core.startTeaching(state,q.target,'battle',Date.now());if(save())renderActivity();};
  const replay=document.createElement('button');replay.className='replay';replay.textContent='🔊';replay.setAttribute('aria-label','Replay the correct word');
  replay.onclick=()=>{Core.noteSupport(state,q.target,'correction-replay',Date.now());if(save())speak('The word was '+q.target+'.');};
  $('#battleAnswers').append(replay,next);
  if(animate&&!q.freeMistake&&q.supportReasons.length===0)combatReaction(false);
  speak((q.freeMistake?'Practice turn. You keep your heart. ':'')+'The word was '+q.target+'.');
}

function advanceBattle(){account();cancelWork();Core.prepareBattle(state,Date.now());if(save())renderActivity();}
function renderHud() {
  const b=state.battle;$('#heroHearts').replaceChildren();
  for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='heart'+(i<b.heroHealth?'':' off');heart.textContent='♥';$('#heroHearts').append(heart);}
  $('#heroHearts').setAttribute('aria-label',`${b.heroHealth} of 3 hearts`);
  $('#enemyFill').style.width=(100*b.enemyHealth/b.maxHealth)+'%';
  $('#enemyHealth').setAttribute('aria-label',`Enemy health: ${b.enemyHealth} of ${b.maxHealth}`);
  $('#enemyCount').textContent=b.enemyHealth+' / '+b.maxHealth;
  paintEnemy($('#enemyFace'),b.enemyId,b.maxHealth);
  $('#battleChapter').hidden=b.demo;if(!b.demo)renderChapter($('#battleChapter'),true);
}
function renderEncounter(){
  show('battle');paintHero($('#battleHeroImg'),heroIndex());renderHud();
  $('#battleScroll').textContent='';$('#battleAnswers').replaceChildren();$('#battleUnsure').hidden=true;$('#wordReady').hidden=true;
  $('#encounterIntro').hidden=false;
  const b=state.battle,enemy=Content.enemies.find(item=>item.id===b.enemyId)||Content.enemies[0];
  $('#encounterLead').textContent=b.finalEncounter?'Final chapter battle':b.fromAssessment?'Reading check complete':'Next encounter';
  $('#encounterTitle').textContent=Content.areas.find(area=>area.id===b.areaId)?.name||'Lantern Trail';renderChapter($('#encounterChapter'));
  paintEnemy($('#encounterEnemy'),b.enemyId,b.maxHealth);healthSymbols($('#encounterHearts'),b.maxHealth);
  speak((b.fromAssessment?'Reading check complete. Now your first chapter begins. ':'')+'A '+enemy.name+' is on the path. Ready to battle?');save();
}
function renderTeaching() {
  show('teaching');$('#wordReady').hidden=true;
  const item=Core.byWord[state.teaching.target],sentence=$('#teachSentence');sentence.replaceChildren();
  const pattern=new RegExp('\\b'+item.w+'\\b','i'),match=pattern.exec(item.sentence),start=match.index;
  sentence.append(document.createTextNode(item.sentence.slice(0,start)));
  const target=document.createElement('span');target.className='targetWord';target.textContent=match[0];sentence.append(target,document.createTextNode(item.sentence.slice(start+match[0].length)));
  const illustration=$('#teachIllustration'),token=epoch;
  $('#lessonStatus').textContent='';$('#teachContinue').disabled=true;
  let ready=false;
  const pictureReady=()=>{if(ready||token!==epoch)return;ready=true;$('#teachContinue').disabled=false;if(!paused&&!blocked)narrateTeaching();};
  illustration.onload=pictureReady;
  illustration.onerror=()=>{if(token!==epoch)return;$('#lessonStatus').textContent='The picture could not load. You can listen or continue.';pictureReady();};
  illustration.hidden=!!item.crop;$('#teachAtlas').hidden=!item.crop;
  if(item.crop){const crop=item.crop.map((v,i)=>i<2?v+4:v-8);$('#teachAtlas').setAttribute('viewBox',crop.join(' '));$('#teachAtlas').setAttribute('aria-label',item.alt);}
  illustration.src='assets/teaching/'+item.image+(item.crop?'.png':'.webp');illustration.alt=item.alt;
  if(illustration.complete&&illustration.naturalWidth)pictureReady();
}
function narrateTeaching() {
  const item=Core.byWord[state.teaching.target],prefix=state.battle?.question?.freeMistake?'Practice turn. You keep your heart. ':'';
  const start=prefix.length+item.sentence.toLowerCase().indexOf(item.w),end=start+item.w.length;
  const target=$('#teachSentence .targetWord');target.classList.remove('spoken');
  speak(prefix+item.sentence,{onBoundary:event=>target.classList.toggle('spoken',event.charIndex>=start&&event.charIndex<end),onEnd:()=>target.classList.remove('spoken')});
}
function renderHandoff(){
  show('handoff');
  $('#handoffTitle').textContent=state.handoff?.victory?'The path is clear!':'Good practice!';
}
function renderResult() {
  show('result');const result=state.result;if(!result){home();return;}
  paintHero($('#resultHero'),heroIndex());
  $('#resultTitle').textContent=result.victory?'You did it!':'Let’s try again';
  $('#resultMessage').textContent=result.chapterComplete?'Pip found the hidden nest! Keep practicing together.':Core.storyProgress(state).areas.find(a=>a.id===state.battle?.areaId&&a.status==='cleared')?.discovery||'';renderChapter($('#resultChapter'));
  const growth=Core.dragonProgress(state);$('#resultGrowth').textContent='Pip · '+growth.xp+' XP · '+growthCaption(growth);
  const progress=Core.chapterProgress(state);
  $('#checkpoint').textContent=progress.nextCheckpoint?'◆ ◇  One win to the next checkpoint':progress.checkpoint?'◆ ◆  Checkpoint saved':'◇ ◇  Two wins to a checkpoint';
  const enemies=Core.enemyChoices(state);
  const choices=[{hp:result.strength,label:'Same',symbol:'=',enemy:enemies[0]}];
  if(result.victory)choices.push({hp:result.strength+1,label:'Stronger',symbol:'↑',enemy:enemies[1]});
  else if(result.strength>3)choices.push({hp:result.strength-1,label:'Easier',symbol:'↓',enemy:enemies[1]});
  else choices.push({hp:3,label:'Same',symbol:'=',enemy:enemies[1]});
  const box=$('#opponents');box.replaceChildren();
  choices.forEach(choice=>{
    const button=document.createElement('button');button.className='opponentCard';button.setAttribute('aria-label',`${choice.label}, ${choice.hp} hearts`);
    button.setAttribute('aria-label',`${choice.enemy.name}, ${choice.label.toLowerCase()} strength, ${choice.hp} hearts`);
    button.innerHTML=`<div class="opponentStage"><div class="opponentMonster sceneSprite"></div></div><div class="opponentName"><span aria-hidden="true">${choice.symbol}</span> ${choice.label}</div><div class="miniHearts visualHearts"></div>`;
    button.dataset.enemy=choice.enemy.id;paintEnemy(button.querySelector('.opponentMonster'),choice.enemy.id,choice.hp);healthSymbols(button.querySelector('.miniHearts'),choice.hp);
    button.onclick=()=>{playClock.reset(performance.now());account();if(Core.isSessionDue(state)){Core.completeSession(state,Date.now());if(save())renderActivity();return;}
      state.campaign.enemyStrength=choice.hp;Core.startBattle(state,Date.now(),{strength:choice.hp,enemyId:choice.enemy.id});if(save())renderActivity();};box.append(button);
  });box.classList.toggle('single',choices.length===1);
}
function renderSummary() {
  show('summary');playing=false;paused=true;cancelWork();const session=state.session;
  $('#summaryTitle').textContent=session.elapsedMs>=session.targetMs?'Challenge complete':'Practice saved';
  const records=state.campaign.battleRecords.filter(r=>r.sessionId===session.id),words=[...new Set(records.map(r=>r.target))];
  $('#summaryDetail').hidden=words.length===0;
  $('#summaryWords').replaceChildren();
  words.forEach(word=>{const chip=document.createElement('span');chip.textContent=word;$('#summaryWords').append(chip);});
  $('#summaryDetail').innerHTML=`<div><strong>${words.length}</strong><span>words practiced</span></div><div><strong>${session.victories}</strong><span>${session.victories===1?'battle':'battles'} won</span></div>`;
}

$('#reloadSaved').onclick=()=>location.reload();
$$('[data-sprite]').forEach(el=>paintSprite(el,Number(el.dataset.sprite)));
try{store=new AdventureStore(window.localStorage);state=store.load();}catch(e){storageProblem(e);return;}
$$('[data-hero-index]').forEach(el=>paintHero(el,Number(el.dataset.heroIndex)));
for(const age of [5,6,7,8,9,'10+']){
  const button=document.createElement('button');button.className='chip'+(String(state.profile.age)===String(age)?' selected':'');button.textContent=age;button.setAttribute('aria-pressed',String(String(state.profile.age)===String(age)));
  button.onclick=()=>{state.profile.age=age;$$('#ageChoices .chip').forEach(el=>{el.classList.toggle('selected',el===button);el.setAttribute('aria-pressed',String(el===button));});save();};$('#ageChoices').append(button);
}
$$('.genderCard').forEach(button=>{button.classList.toggle('selected',button.dataset.gender===state.profile.gender);button.setAttribute('aria-pressed',String(button.dataset.gender===state.profile.gender));button.onclick=()=>{state.profile.gender=button.dataset.gender;$$('.genderCard').forEach(el=>{el.classList.toggle('selected',el===button);el.setAttribute('aria-pressed',String(el===button));});save();};});
$('#nameInput').value=state.profile.name;
$('#nameInput').addEventListener('keydown',event=>{if(event.key==='Enter')$('#setupNext').click();});
$('#setupNext').onclick=()=>{state.profile.name=$('#nameInput').value.trim()||'Hero';renderHeroes();show('hero');save();};
$('#backBtn').onclick=()=>{show('setup');save();};
$('#changeHero').onclick=()=>{renderHeroes();show('hero');save();};
$('#heroNext').onclick=()=>{state.profile.heroIndex=heroIndex();home();};
$('#tryBattle').onclick=()=>{Core.startTeaching(state,Content.demoWords[0],'demo',Date.now());if(save())enter();};
$('#checkFirst').onclick=()=>{Core.startAssessment(state,Date.now());if(save())enter();};
$('#continueAdventure').onclick=continueAdventure;
$('#homeBtn').onclick=()=>{if(!blocked)home();};
$('#mapContinue').onclick=()=>{
  if(blocked)return;
  const area=Core.storyProgress(state).areas.find(item=>item.id===selectedMapArea);
  if(!area||!['current','cleared'].includes(area.status))return;
  if(state.battle?.fromAssessment&&!state.battle.mapSeen){state.battle.mapSeen=true;state.battle.introPending=false;}
  continueAdventure();
};
$('#mapSettings').onclick=()=>{renderHeroes();show('hero');save();};
$('#mapParents').onclick=openParentGate;$('#routeParents').onclick=openParentGate;
$('#parentCancel').onclick=()=>{$('#parentGate').hidden=true;};
$('#parentUnlock').onclick=()=>{if(Number($('#parentAnswer').value)!==parentAnswer){$('#parentGateMessage').textContent='Please try again.';return;}$('#parentGate').hidden=true;renderParent();};
$('#parentAnswer').addEventListener('keydown',e=>{if(e.key==='Enter')$('#parentUnlock').click();});
$('#parentHome').onclick=home;
$('#mathStart').onclick=()=>{if(Core.startMath(state,Date.now())){playClock.reset(performance.now());if(save())renderActivity();}};
$('#mathSkip').onclick=$('#mathContinue').onclick=()=>{if(Core.leaveMath(state,Date.now())&&save())renderActivity();};
$$('#mathKeys button').forEach(button=>button.onclick=()=>mathKey(button.dataset.key));
document.addEventListener('keydown',event=>{
  if(state.activity!=='mathChallenge'||paused||blocked||event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
  const key=/^\d$/.test(event.key)?event.key:event.key==='Enter'?'enter':event.key==='Backspace'?'back':null;
  if(key){event.preventDefault();mathKey(key);}
});
$('#assessmentStart').onclick=()=>{playClock.reset(performance.now());state.assessment.instructionsSeen=true;if(save())renderActivity();};
$('#encounterStart').onclick=()=>{playClock.reset(performance.now());state.battle.introPending=false;if(save())renderActivity();};
$('#pauseBtn').onclick=()=>pause();$('#pauseResume').onclick=enter;$('#pauseFinish').onclick=finishForNow;
$('#selfPacedSetting').onchange=()=>{state.settings.selfPaced=$('#selfPacedSetting').checked;const q=state.battle?.question;
  if(q&&!q.answeredAt&&q.phase==='ready')q.exposureMs=state.settings.selfPaced?null:state.assessment.exposure;save();};
$('#wordReady').onclick=()=>{if(confirmActivity())hideWord();};
$('#assessmentUnsure').onclick=()=>answer('?');
$('#battleUnsure').onclick=()=>answer('?');
$('#handoffNext').onclick=()=>{Core.leaveHandoff(state,Date.now());if(save())enter();};
$('#voiceChoice').onchange=()=>{state.settings.voiceURI=$('#voiceChoice').value;save();};
$('#previewVoice').onclick=()=>narrator.speak('Pip is on the rock.',{preferred:state.settings.voiceURI||''});
window.speechSynthesis?.addEventListener('voiceschanged',()=>{if(!$('#pausePanel').hidden)populateVoices();});
$('#teachReplay').onclick=()=>{if(!confirmActivity())return;const teaching=state.teaching;Core.startTeaching(state,teaching.target,teaching.returnTo,Date.now(),{replay:true});if(save())narrateTeaching();};
$('#teachContinue').onclick=()=>{if(!confirmActivity())return;Core.leaveTeaching(state,Date.now());if(save())advanceBattle();};
$('#resultNext').onclick=home;
$('#anotherChallenge').onclick=continueAdventure;$('#doneToday').onclick=home;
$('#retrySave').onclick=()=>{try{store.save(state);blocked=false;$('#saveNotice').hidden=true;if(playing)showPausePanel();else if(state.screen==='route')home();else show(state.screen);}catch(e){storageProblem(e);}};
$('#resetBtn').onclick=()=>{if(confirm('Erase the profile and all saved reading progress on this device? This cannot be undone.')){
  // Explicit existing reset action only. Never reset during deployment or migration.
  for(const suffix of ['','_backup','_legacy_backup','_unreadable_backup'])localStorage.removeItem(KEY+suffix);location.reload();
}};
document.addEventListener('visibilitychange',()=>{if(document.hidden){account();pause('away');}});
window.addEventListener('pagehide',()=>{if(!blocked){account();pause('away');if(!playing)save();}});
window.addEventListener('blur',()=>{windowFocused=false;account();pause('away');});
window.addEventListener('focus',()=>{windowFocused=true;});
window.addEventListener('storage',event=>{if(event.key===KEY&&event.newValue!==store.expected)storageProblem(Object.assign(new Error('Another tab updated this adventure. Reload to use its saved progress.'),{code:'conflict'}));});
setInterval(()=>{
  account();if(paused||blocked||!playing)return;
  if(state.activity==='result'&&Core.isSessionDue(state)){Core.completeSession(state,Date.now());if(save())renderActivity();}else save();
},1000);
Core.interruptQuestion(state);
renderHeroes();paintHero($('#battleHeroImg'),heroIndex());
if(state.profile.name){if(state.screen==='hero'){show('hero');save();}else home();}else{show('setup');save();}
})();
