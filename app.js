(() => {
'use strict';
const Core=BlitzCore, Content=BlitzContent, {AdventureStore,KEY}=BlitzStorage;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const classes=['Mage','Knight','Archer'];
const playClock=new BlitzEngagement.Clock();let windowFocused=true,parentAnswer=0;
const sound=BlitzSound.create({AudioContext:window.AudioContext||window.webkitAudioContext});
const maleHeroSheet='assets/rowanfire-boys-2026-09-21.png';
const heroAssets=[maleHeroSheet,maleHeroSheet,maleHeroSheet,'assets/hero4.webp','assets/hero5.webp','assets/hero6.webp'];
const malePortraitCrops=[{x:183,y:145},{x:636,y:145},{x:1099,y:145}];
const narrator=BlitzAudio.narrator({synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,AudioContext:window.AudioContext||window.webkitAudioContext,fetchAudio:window.fetch?.bind(window),clips:window.BlitzNarration?.clips||{}});
let store,state,paused=true,playing=false,blocked=false,lastTick=performance.now(),timer=null,epoch=0;
const spriteCrops=[{x:0,y:0,w:384,h:538},{x:384,y:0,w:426,h:538},{x:780,y:0,w:374,h:538},{x:1154,y:0,w:382,h:538},{x:0,y:538,w:384,h:486},{x:384,y:538,w:384,h:486},{x:768,y:630,w:384,h:370},{x:1152,y:650,w:384,h:350}];
let spriteSerial=0;
let selectedMapArea=null;
const COMBAT_MS=1200;
const shieldIcon='<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 3L35 9V23Q34 33 20 41Q6 33 5 23V9Z"/><path d="M20 10V32M12 20H28"/></svg>';
// Separate the original staff and gripping hand; retain the approved artwork.
const mageRig={
  0:{pivot:[112,234],tip:[107,102],path:'M24 25H175V193L139 209L132 263L159 538H129L110 273L87 253L78 218L93 195L25 190Z',repair:'M110 273L132 263L159 538H129Z'},
  3:{pivot:[1430,230],tip:[1453,100],path:'M1413 25H1520V179L1460 211L1450 248L1378 532H1361L1420 250L1410 239L1415 213L1433 183L1413 169Z',repair:'M1420 250L1450 248L1378 532H1361Z'}
};
function paintSprite(element,index) {
  const crop=spriteCrops[index],clip='sprite-crop-'+(++spriteSerial);
  const shape=index===1?'<polygon points="384,0 780,0 780,350 765,394 810,525 384,538"/>':index===2?'<polygon points="820,0 1154,0 1154,538 820,538 810,486 790,440 780,360"/>':`<rect x="${crop.x}" y="${crop.y}" width="${crop.w}" height="${crop.h}"/>`;
  element.dataset.sprite=String(index);element.style.backgroundImage='none';
  element.innerHTML=`<svg viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style="display:block;overflow:hidden"><defs><clipPath id="${clip}">${shape}</clipPath></defs><image href="assets/forest-characters.webp" width="1536" height="1024" clip-path="url(#${clip})"/></svg>`;
  if(element.id==='battleHeroImg'&&mageRig[index]){
    const rig=mageRig[index],[px,py]=rig.pivot;
    const body=`M${crop.x} ${crop.y}h${crop.w}v${crop.h}h-${crop.w}Z ${rig.path}`;
    const repair=rig.repair?`<defs><clipPath id="${clip}-repair"><path d="${rig.repair}"/></clipPath></defs><image href="assets/forest-characters.webp" x="24" width="1536" height="1024" clip-path="url(#${clip}-repair)"/>`:'';
    element.innerHTML=`<svg viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style="display:block;overflow:visible"><defs><clipPath id="${clip}-body"><path d="${body}" clip-rule="evenodd"/></clipPath><clipPath id="${clip}-arm"><path d="${rig.path}"/></clipPath></defs>${repair}<image href="assets/forest-characters.webp" width="1536" height="1024" clip-path="url(#${clip}-body)"/><g transform="translate(${px} ${py})"><g class="staffArm"><g transform="translate(${-px} ${-py})"><image href="assets/forest-characters.webp" width="1536" height="1024" clip-path="url(#${clip}-arm)"/></g></g></g></svg>`;
  }
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
  const enemy=Content.enemyAt(enemyId);
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
  element.setAttribute('role','img');element.setAttribute('aria-label',dragonText(design.name));
}
const xpText=n=>String(Math.floor(n||0));
const dragonText=text=>text.replace(/\bPip\b/g,()=>state.dragon.name||'Pip');
function updateDragonLabels(){
  $('.dragonHeading span').textContent=state.dragon.name||'Pip';
  for(const [id,label] of [['dragonPanel','See Pip’s growth'],['resultGrowth','See Pip’s growth'],['dragonProgress','Progress towards Pip’s next stage'],['resultGrowthBar','Pip XP towards next growth'],['dragonStages','Pip’s growth stages'],['growthClose','Close Pip’s growth']])$('#'+id).setAttribute('aria-label',dragonText(label));
}
function updateDailyXP(){
  if(!state)return;const p=Core.bonusProgress(state,Date.now()),label='XP ×'+p.multiplier;
  const badge=$('#xpBonusBadge');badge.textContent=label;badge.hidden=!p.active||!['battle','result','mathIntro','mathChallenge','mathResult','summary'].includes(state.screen);
  badge.setAttribute('aria-label',label+' on correct answers for the rest of today');
  $('#mapDailyGoal').textContent=p.chapters?'Today ✓':'Today · 0 / 1 chapters';
  $('#mapBonus').hidden=!p.active;$('#mapBonus').textContent=label;
}
function openNaming(){if(state.dragon.stage<1)return;$('#growthPanel').hidden=true;$('#dragonNameInput').value=state.dragon.name||'Pip';$('#dragonNameMessage').textContent='';$('#dragonNamePanel').hidden=false;$('#dragonNameInput').focus();}
function maybeOfferName(){if(state.dragon.stage>=1&&!state.dragon.named&&!state.dragon.namingPromptSeen){state.dragon.namingPromptSeen=true;if(save())openNaming();}}
function growthCaption(p){
  if(!p.next)return dragonText('Pip is ready to ride');
  return Math.ceil(p.remaining)+' XP to '+dragonText(p.next.name);
}
function renderChapter(element,compact=false){
  const p=Core.storyProgress(state);element.replaceChildren();
  const title=document.createElement('span');title.className='chapterLabel';title.textContent='Campaign '+p.chapterNumber;
  const count=document.createElement('span');count.className='chapterCount';count.textContent=p.cleared+' / '+p.total+(compact?'':' chapters');
  const track=document.createElement('span');track.className='chapterTrack';track.setAttribute('role','progressbar');track.setAttribute('aria-label','Campaign '+p.chapterNumber+' chapters completed');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(p.total));track.setAttribute('aria-valuenow',String(p.cleared));
  const fill=document.createElement('span');fill.style.width=(100*p.cleared/p.total)+'%';track.append(fill);element.append(title,count,track);
}
function renderMap(){
  show('campaignMap');$('#pausePanel').hidden=true;
  const progress=Core.storyProgress(state),growth=Core.dragonProgress(state);
  const terrain=$('.mapTerrain'),mapScene=progress.chapter.scene;
  terrain.style.backgroundImage=mapScene===null?'url("assets/campaign-forest.png")':'url("assets/chapter-scenes.webp")';
  terrain.style.backgroundSize=mapScene===null?'100% 100%':'300% 200%';terrain.style.backgroundPosition=mapScene===null?'center':(mapScene%3*50)+'% '+(mapScene<3?0:100)+'%';
  $('#mapTitle').textContent=dragonText(progress.chapter.name);terrain.setAttribute('aria-label','Campaign '+progress.chapterNumber+' map');
  $('#chapterSelect').replaceChildren();Content.chapters.forEach((chapter,i)=>{
    const chip=document.createElement('span');chip.className='chapterBead'+(chapter.id===progress.chapter.id?' current':'')+(state.story.completedChapters.includes(chapter.id)?' complete':'');chip.textContent=String(i+1);chip.setAttribute('aria-label','Campaign '+(i+1)+(state.story.completedChapters.includes(chapter.id)?' complete':chapter.id===progress.chapter.id?' current':' locked'));$('#chapterSelect').append(chip);
  });
  $('#chapterCelebration').hidden=!state.story.mapPending;$('#chapterCelebration').textContent=progress.complete?'All done!':'New path!';
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
    const label=document.createElement('span');label.className='mapNodeName';label.textContent=area.shortName||area.name;
    const status=document.createElement('small');status.textContent=area.status==='future'?'Soon':area.status==='cleared'?'Done':area.status==='current'?'Here':'Later';
    button.append(marker,label,status);button.onclick=()=>{selectedMapArea=area.id;renderMap();};nodes.append(button);
  });
  const hero=$('#mapTraveller');paintHero(hero,heroIndex());hero.style.left=`clamp(54px,${Math.max(9,current.x-9)}%,calc(100% - 54px))`;hero.style.top=`clamp(82px,${current.y-3}%,calc(100% - 100px))`;
  $('#mapStory').textContent=progress.cleared+' / '+progress.total+' chapters';
  $('#mapStory').setAttribute('aria-label',progress.cleared+' of '+progress.total+' chapters completed');
  $('#mapAreaTitle').textContent=selected.shortName||selected.name;
  $('#mapAreaStatus').textContent=selected.status==='future'?'Coming soon':selected.status==='cleared'?'Trail explored':selected.status==='locked'?'Further along the trail':state.battle?.fromAssessment&&!state.battle.mapSeen?'Reading check complete · Your first chapter':'Your next story step';
  $('#mapAreaGoal').textContent=selected.status==='cleared'?selected.discovery:selected.goal;
  const markers=$('#mapAreaProgress');markers.replaceChildren();
  if(selected.available){
    const wins=document.createElement('span');wins.className='mapGoal';wins.textContent='◆'.repeat(Math.min(3,selected.wins))+'◇'.repeat(Math.max(0,3-selected.wins));wins.setAttribute('aria-label',Math.min(3,selected.wins)+' of 3 reading victories');
    const time=document.createElement('span');time.className='mapGoal';time.textContent=Math.min(10,Math.floor(selected.activeMs/60000))+' / 10 min';
    const duel=document.createElement('span');duel.className='mapGoal';duel.textContent=selected.duels?'× ✓':'× ?';duel.setAttribute('aria-label',selected.duels?'Number duel completed':'Number duel still to play');
    markers.append(wins,time,duel);
  }
  const start=$('#mapContinue');start.disabled=selected.status==='future'||selected.status==='locked';
  start.textContent=start.disabled?'Locked':'Play';start.setAttribute('aria-label',start.disabled?'Explore the earlier place first':state.math.round?'Continue multiplication':state.teaching?'Continue the example':state.battle?.question?'Continue battle':'Explore '+selected.name);
  paintPip($('#mapPip'));$('#dragonStage').textContent=dragonText(growth.current.name);$('#dragonXP').textContent=xpText(growth.xp)+' XP';
  $('#dragonNext').textContent=growth.next?'Growing together':'Ready to ride';$('#mapGrowthSummary').textContent='';
  const fraction=growth.fraction;const bar=$('#dragonProgress');bar.querySelector('span').style.width=(100*fraction)+'%';bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow',String(Math.floor(100*fraction)));bar.setAttribute('aria-valuetext','XP towards growth. '+growthCaption(growth));
  $('#dragonTapHint').textContent=dragonText(growth.next?'XP · Tap Pip':'Tap Pip');
  $('#mapShield').hidden=!state.rewards.shield;$('#mapShield').innerHTML=shieldIcon;
  const stages=$('#dragonStages');stages.replaceChildren();Content.dragonStages.forEach((stage,i)=>{
    const item=document.createElement('li');item.className=i===growth.stage?'current':i<growth.stage?'earned':'future';
    const art=document.createElement('span');art.className='stagePortrait';paintPip(art,i);
    const label=document.createElement('span');label.textContent=stage.name.replace(' Pip','');const xp=document.createElement('small');xp.textContent=i<=growth.stage?'✓':stage.xp+' XP';
    item.append(art,label,xp);stages.append(item);
  });updateDailyXP();save();maybeOfferName();
}
function clearCombat(){
  $('#defeatScene').hidden=true;$('#defeatScene').classList.remove('escaping');sound.cancelEffects();
  $('#heroHearts').classList.remove('shieldBlocked');
  $('#combatEffects').className='combatEffects';$('#combatEffects .castBeam')?.remove();
  $('#battleHeroImg').classList.remove('attack','mageCast','heroHit','heroDefeated');
  $('#enemyFace').classList.remove('enemyHit','enemyAttack','enemyDefeated');
  $('#battle .battlePip').classList.remove('pipAssist','pipCelebrate','pipDodge','pipFinisher');
}
function cancelWork(){clearTimeout(timer);timer=null;epoch++;narrator.cancel();clearCombat();sound.configure({narrating:false});}
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
  syncSound();
  const now=performance.now();lastTick=now;if(!state)return;
  const category=activityCategory(),delta=playClock.sample({mono:now,wall:Date.now(),category,visible:!document.hidden,focused:windowFocused});
  drainExcluded();
  if(category==='math'){
    if(Core.tickMath(state,delta,Date.now())){playClock.discard();drainExcluded();cancelWork();if(state.math.round.beaten)sound.cue('finish');renderMath();}
    else updateMathHud();
  }
  const q=Core.getQuestion(state);
  if(category&&category!=='math'&&q&&!q.answeredAt){if(q.phase==='word')q.wordViewedMs+=delta;if(q.phase==='choices')q.responseMs+=delta;}
  if(category&&playClock.expired&&!document.hidden&&windowFocused)pause('idle');
}
function confirmActivity(){
  account();if(paused||blocked||playClock.expired)return false;
  for(const part of playClock.confirm(performance.now()))Core.recordTime(state,part.ms,part.category,part.end);
  drainExcluded();updateDailyXP();return true;
}
function formatTime(ms){const seconds=Math.floor(ms/1000);return Math.floor(seconds/60)+' min '+String(seconds%60).padStart(2,'0')+' sec';}
function openParentGate(){
  home();parentAnswer=17+Math.floor(Math.random()*9);$('#parentQuestion').textContent='What is 17 + '+(parentAnswer-17)+'?';$('#parentAnswer').value='';$('#parentGateMessage').textContent='';$('#parentGate').hidden=false;$('#parentAnswer').focus();
}
function renderParent(){
  const p=Core.parentProgress(state,Date.now()),g=Core.dragonProgress(state);show('parentDashboard');
  $('#parentToday').textContent=formatTime(p.today.practice+(p.today.math||0)+p.today.assessment+p.today.demo);
  $('#parentTotal').textContent=formatTime(p.activeMs);$('#parentPractice').textContent=formatTime(p.totals.practice+p.totals.math);
  $('#parentMath').textContent=formatTime(p.totals.math)+' multiplication · PR: '+(state.math.best===null?'not set':state.math.best+' points in 60 seconds')+'.';
  $('#parentIdle').textContent=formatTime(p.totals.idle);$('#parentLegacy').textContent=formatTime(p.legacyMs);
  $('#parentGrowth').textContent=dragonText(g.current.name)+' · '+xpText(g.xp)+' XP. '+growthCaption(g)+'.';
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
  state.screen=id;syncSound();updateDailyXP();updateDragonLabels();
  const chapter=['battle','teaching','result'].includes(id)&&state.battle?.chapterId?Content.chapters.find(c=>c.id===state.battle.chapterId):Core.currentChapter(state);
  const scene=chapter?.scene;$('#chapterScenery').hidden=scene===null||scene===undefined||['setup','hero','route','assessment','parentDashboard'].includes(id);
  if(scene!==null&&scene!==undefined)$('#chapterScenery').style.backgroundPosition=(scene%3*50)+'% '+(scene<3?0:100)+'%';
  $$('#'+id+' [data-sprite="6"]').forEach(element=>paintPip(element));
}
function speak(text,{onEnd=null,onBoundary=null}={}) {
  const token=epoch;syncSound();sound.configure({narrating:true});
  narrator.speak(dragonText(text),{preferred:state.settings.voiceURI||'',
    onEnd:()=>{if(token===epoch)sound.configure({narrating:false});if(token===epoch&&!paused&&!blocked&&onEnd)onEnd();},
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
  $('#routeTitle').textContent='Hi, '+state.profile.name+'!';
  $('#routeName').textContent=dragonText('Pip is coming with you.');
  $('#homeChapter').hidden=!state.assessment.done;if(state.assessment.done)renderChapter($('#homeChapter'));
  const resumable=state.assessment.done||state.battle||state.teaching||state.assessment.progress||state.demoComplete;
  $('#continueAdventure').hidden=!resumable;
  $('#continueAdventure').textContent='Play';
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
  $('#pauseSpeed').hidden=state.activity==='assessment'||state.activity==='mathChallenge'||!state.assessment.done;
  $('#pauseTime').textContent=state.session?`${Math.floor(state.session.elapsedMs/60000)} min practiced · chapters need at least 10 active minutes`:'';
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
  $('#battle .battlePip').classList.remove('pipAssist','pipCelebrate','pipDodge');
  $('#combatEffects').className='combatEffects';$('#battle').classList.remove('correcting');
  $('#encounterIntro').hidden=true;$('#assessmentIntro').hidden=true;
  if(state.activity.startsWith('math')){renderMath();return;}
  if(state.story.mapPending){selectedMapArea=null;home();return;}
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
  const seconds=Math.ceil((60000-r.elapsedMs)/1000),score=Core.mathScore(r);
  $('#mathTime').textContent=seconds+'s';
  $('#mathTimeRing').style.strokeDashoffset=String(100*r.elapsedMs/60000);
  $('#mathClock').classList.toggle('low',seconds<=10);
  if(r.status==='playing')sound.countdown(seconds);
  $('#mathTime').classList.toggle('low',r.elapsedMs>=50000);
  $('#mathScore').textContent=String(score);$('#mathTarget').textContent=String(r.target);
  $('#mathPR').textContent=r.bestAtStart===null?'—':String(r.bestAtStart);
  const bar=$('#mathTargetBar');bar.querySelector('span').style.width=(100*Math.max(0,Math.min(1,score/r.target)))+'%';
  bar.setAttribute('aria-valuenow',String(Math.max(0,Math.min(score,r.target))));bar.setAttribute('aria-valuemax',String(r.target));
}
function renderMath(){
  const r=state.math.round;if(!r){home();return;}
  const enemy=Content.enemyAt(r.enemyId);show(mathActivity());
  if(r.status==='intro'){
    paintEnemy($('#mathRevivedEnemy'),r.enemyId,state.battle?.maxHealth||3);
    $('#mathIntroTitle').textContent=enemy.name;
    $('#mathIntroPR').textContent=r.bestAtStart===null?'':'Best '+r.bestAtStart;
    $('#mathIntroPR').hidden=r.bestAtStart===null;
    $('#mathIntroTarget').textContent=String(r.target);
    $('#mathIntroGoal').setAttribute('aria-label','Goal: '+r.target+' points');return;
  }
  if(r.status==='result'){
    paintEnemy($('#mathResultEnemy'),r.enemyId,state.battle?.maxHealth||3);
    $('#mathResultTitle').textContent=r.beaten?'You won!':'Try again';
    $('#mathResult').dataset.outcome=r.beaten?'won':'lost';
    $('#mathResultScore').textContent=String(Core.mathScore(r));
    $('#mathResultGoal').textContent=String(r.target);
    $('#mathResultDetail').textContent='+'+xpText(r.xpEarned??r.correct)+' XP';
    $('#mathResultBest').textContent=r.newBest&&r.beaten?'New best!':'Best '+state.math.best;
    $('#mathShieldReward').hidden=!r.shieldEarned;$('#mathShieldReward').innerHTML=shieldIcon+'<span>+1 shield</span>';
    $('#mathResultMessage').textContent=Core.mathScore(r)+' points. Goal '+r.target+'. '+r.correct+' correct, '+(r.wrong||0)+' wrong. '+(r.beaten?'Number duel won.':'Number duel lost. Your reading victory and earned XP are safe.');
    if(!r.beaten)defeatReaction(r,r.enemyId,state.battle?.maxHealth||3);return;
  }
  paintEnemy($('#mathEnemy'),r.enemyId,state.battle?.maxHealth||3);updateMathHud();
  const q=r.question||Core.prepareMath(state);$('#mathEquation').textContent=q.a+' × '+q.b+' =';
  $('#mathInput').textContent=q.phase==='feedback'?q.input:'?';$('#mathFeedback').textContent='';
  const answers=$('#mathAnswers');answers.replaceChildren();
  for(const value of q.options){
    const button=document.createElement('button');button.type='button';button.textContent=String(value);button.dataset.value=String(value);button.disabled=q.phase!=='answer';
    if(q.phase==='feedback'&&String(value)===q.input)button.classList.add(q.correct?'mathCorrect':'mathWrong');
    button.onclick=()=>mathAnswer(value,q.id);answers.append(button);
  }
  if(q.phase==='feedback'){
    $('#mathFeedback').classList.toggle('wrong',!q.correct);
    $('#mathFeedback').textContent=q.correct?'+1':(r.scoringVersion===2?'−1  ·  ':'')+q.a+' × '+q.b+' = '+q.a*q.b;
    later(()=>{Core.prepareMath(state);if(save())renderMath();},q.correct?400:850);
  }
}
function mathAnswer(value,questionId){
  if(paused||blocked||state.activity!=='mathChallenge'||state.math.round?.question?.id!==questionId||!confirmActivity())return;
  const r=state.math.round,q=r?.question;if(r?.status!=='playing'||q?.phase!=='answer')return;
  const answer=Core.answerMath(state,value,Date.now());if(answer&&save()){sound.cue(answer.correct?'correct':'wrong');renderMath();}
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
  stageElements()[0].innerHTML=galaxyMask();
  later(()=>{if(setPhase(q,'choices'))drawChoices();},220);
}
function drawChoices() {
  const q=Core.getQuestion(state),[scroll,answers]=stageElements();
  scroll.innerHTML=galaxyMask();answers.replaceChildren();
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
  $('#feedback').textContent=supported?'Practice':'';$('#feedback').classList.toggle('show',supported);
  $('#battleScroll').classList.add('wordSuccess');
  if(q.xpEarned){$('#xpReward').hidden=false;$('#xpReward').textContent=q.grewTo!==null&&q.grewTo!==undefined?dragonText('Pip grew! '+Content.dragonStages[q.grewTo].name):'+'+xpText(q.xpEarned)+' XP';paintPip($('#battle .battlePip'));}
  speak(q.target,{onEnd:()=>{if(!supported)combatReaction(true);later(advanceBattle,COMBAT_MS+100);}});
}
function combatGeometry(effects){
  const box=effects.getBoundingClientRect?.();
  if(!box?.width||!box?.height)return null;
  const point=(element,x,y)=>{const r=element.getBoundingClientRect();return {x:r.left-box.left+r.width*x,y:r.top-box.top+r.height*y};};
  const hero=$('#battleHeroImg'),enemy=$('#enemyFace'),pip=$('#battle .battlePip');
  const end=point(enemy,.5,.45),start=point(hero,.65,.45),flame=point(pip,.86,.35);
  const rig=mageRig[heroIndex()];
  if(rig){
    const r=hero.getBoundingClientRect(),crop=spriteCrops[heroIndex()],scale=Math.min(r.width/crop.w,r.height/crop.h),angle=32*Math.PI/180;
    const [px,py]=rig.pivot,dx=rig.tip[0]-px,dy=rig.tip[1]-py;
    start.x=r.left-box.left+(r.width-crop.w*scale)/2+(px+dx*Math.cos(angle)-dy*Math.sin(angle)-crop.x)*scale;
    start.y=r.bottom-box.top-crop.h*scale+(py+dx*Math.sin(angle)+dy*Math.cos(angle)-crop.y)*scale;
  }
  effects.style.setProperty('--shot-start',start.x+'px');effects.style.setProperty('--shot-end',end.x+'px');effects.style.setProperty('--shot-y',end.y+'px');
  effects.style.setProperty('--pip-x',flame.x+'px');effects.style.setProperty('--pip-y',flame.y+'px');
  effects.style.setProperty('--pip-distance',Math.hypot(end.x-flame.x,end.y-flame.y)+'px');
  effects.style.setProperty('--pip-angle',Math.atan2(end.y-flame.y,end.x-flame.x)+'rad');
  return {box,start,end};
}
function combatReaction(correct){
  const q=state.battle?.question;
  if(paused||blocked||state.activity!=='battle'||!q?.answeredAt||q.correct!==correct||q.supportReasons.length)return;
  const effects=$('#combatEffects');effects.className='combatEffects '+(correct?'heroStrike ':'enemyStrike ')+state.profile.heroClass.toLowerCase();
  effects.removeAttribute('style');
  const geometry=correct?combatGeometry(effects):null;
  if(correct&&state.profile.heroClass==='Mage'&&geometry){
    const {box,start,end}=geometry,dx=end.x-start.x,dy=end.y-start.y;
    const points=[0,.18,.31,.43,.58,.72,.87,1].map((t,i)=>`${start.x+dx*t},${start.y+dy*t+(i===0||i===7?0:(i%2?12:-12))}`).join(' ');
    effects.insertAdjacentHTML('beforeend',`<svg class="castBeam" viewBox="0 0 ${box.width} ${box.height}" preserveAspectRatio="none"><polyline class="lightningGlow" points="${points}"/><polyline class="lightningCore" points="${points}"/><circle class="staffSpark" cx="${start.x}" cy="${start.y}" r="10"/></svg>`);
  }
  if(correct){$('#battleHeroImg').classList.add(state.profile.heroClass==='Mage'?'mageCast':'attack');$('#enemyFace').classList.add(state.battle.enemyHealth<=0?'enemyDefeated':'enemyHit');}
  else{$('#enemyFace').classList.add('enemyAttack');if(state.battle.question.shieldUsed){effects.classList.add('shieldBlock');$('#heroHearts').classList.add('shieldBlocked');}else $('#battleHeroImg').classList.add(state.battle.heroHealth<=0?'heroDefeated':'heroHit');}
  const pip=$('#battle .battlePip');
  if(correct&&(state.campaign.battleRecords.length%2===0||state.battle.enemyHealth<=0)){effects.classList.add('pipStrike');pip.classList.add('pipAssist');if(state.battle.enemyHealth<=0)pip.classList.add('pipFinisher');sound.cue('pip');}
  else if(!correct)pip.classList.add('pipDodge');
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
  const replay=document.createElement('button');replay.className='replay';replay.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zm13-2q6 5 0 10"/></svg>';replay.setAttribute('aria-label','Replay the correct word');
  replay.onclick=()=>{Core.noteSupport(state,q.target,'correction-replay',Date.now());if(save())speak('The word was '+q.target+'.');};
  $('#battleAnswers').append(replay,next);
  if(q.shieldUsed){$('#feedback').textContent='Shield saved a heart';$('#feedback').classList.add('show');}
  speak((q.freeMistake?'Practice turn. You keep your heart. ':q.shieldUsed?'Your shield stopped the hit. ':'')+'The word was '+q.target+'.',{onEnd:()=>{if(animate&&!q.freeMistake&&q.supportReasons.length===0)combatReaction(false);}});
}

function advanceBattle(){account();cancelWork();Core.prepareBattle(state,Date.now());if(save())renderActivity();}
function renderHud() {
  const b=state.battle;$('#heroHearts').replaceChildren();
  for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='heart'+(i<b.heroHealth?'':' off');heart.textContent='♥';$('#heroHearts').append(heart);}
  $('#heroHearts').setAttribute('aria-label',`${b.heroHealth} of 3 hearts`);
  if(state.rewards.shield&&!b.demo){const shield=document.createElement('span');shield.className='heldShield';shield.innerHTML=shieldIcon;$('#heroHearts').append(shield);$('#heroHearts').setAttribute('aria-label',`${b.heroHealth} of 3 hearts, one shield protects the next hit`);}
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
  const b=state.battle,enemy=Content.enemyAt(b.enemyId);
  $('#encounterLead').textContent=b.finalEncounter?'Last fight':b.fromAssessment?'Let’s play':'Ready?';
  $('#encounterTitle').textContent=Content.areas.find(area=>area.id===b.areaId)?.name||'Lantern Trail';renderChapter($('#encounterChapter'));
  paintEnemy($('#encounterEnemy'),b.enemyId,b.maxHealth);healthSymbols($('#encounterHearts'),b.maxHealth);
  speak((b.fromAssessment?'Reading check complete. Now your first chapter begins. ':'')+'A '+Content.enemyAt(enemy.family).name+' is on the path. Ready to battle?');save();
}
function renderTeaching() {
  show('teaching');$('#wordReady').hidden=true;
  const item={...Core.byWord[state.teaching.target]};item.sentence=dragonText(item.sentence);const sentence=$('#teachSentence');sentence.replaceChildren();
  const pattern=new RegExp('\\b'+item.w+'\\b','i'),match=pattern.exec(item.sentence),start=match.index;
  sentence.append(document.createTextNode(item.sentence.slice(0,start)));
  const target=document.createElement('span');target.className='targetWord';target.textContent=match[0];sentence.append(target,document.createTextNode(item.sentence.slice(start+match[0].length)));
  const illustration=$('#teachIllustration'),token=epoch;
  $('#lessonStatus').textContent='';$('#teachContinue').disabled=true;
  let ready=false;
  const pictureReady=()=>{if(ready||token!==epoch)return;ready=true;$('#teachContinue').disabled=false;if(!paused&&!blocked)narrateTeaching();};
  illustration.onload=pictureReady;
  illustration.onerror=()=>{if(token!==epoch)return;$('#lessonStatus').textContent='The picture could not load. You can listen or continue.';pictureReady();};
  illustration.hidden=!!item.crop;$('#teachAtlas').toggleAttribute('hidden',!item.crop);
  if(item.crop){const crop=item.crop;$('#teachAtlas').setAttribute('viewBox',crop.join(' '));$('#teachAtlas').setAttribute('aria-label',item.alt);const atlas=$('#teachAtlas image');atlas.setAttribute('href',Content.teachingSource(item));atlas.setAttribute('width','1536');atlas.setAttribute('height',item.image==='core-teaching'?'2048':'1024');$('#teachAtlas').querySelector('defs')?.remove();$('#teachAtlas').insertAdjacentHTML('afterbegin',`<defs><clipPath id="teachingCell" clipPathUnits="userSpaceOnUse"><rect x="${crop[0]}" y="${crop[1]}" width="${crop[2]}" height="${crop[3]}"/></clipPath></defs>`);atlas.setAttribute('clip-path','url(#teachingCell)');}
  illustration.src=Content.teachingSource(item);illustration.alt=item.alt;
  if(illustration.complete&&illustration.naturalWidth)pictureReady();
}
function narrateTeaching() {
  const item={...Core.byWord[state.teaching.target]};item.sentence=dragonText(item.sentence);const prefix=state.battle?.question?.freeMistake?'Practice turn. You keep your heart. ':'';
  const start=prefix.length+new RegExp('\\b'+item.w+'\\b','i').exec(item.sentence).index,end=start+item.w.length;
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
  const chapter=Core.activeChapterState(state);
  $('#resultMessage').textContent=result.chapterJustComplete?'New campaign!':result.fieldJustComplete||result.reviewJustComplete?'Chapter complete!':result.victory&&chapter?.duels&&chapter.activeMs<Core.TARGET_MS?'One more battle!':'';renderChapter($('#resultChapter'));
  const growth=Core.dragonProgress(state);
  $('#resultXP').textContent='+'+xpText(result.xpEarned??state.battle?.xpEarned??0)+' XP';
  $('#resultXPDetail').textContent=xpText(growth.xp)+' / '+xpText(growth.next?.xp||growth.xp)+' XP';
  $('#resultGrowthFill').style.width=(growth.fraction*100)+'%';$('#resultGrowthBar').setAttribute('aria-valuenow',String(Math.round(growth.fraction*100)));
  $('#resultGrowthNote').textContent=dragonText(growth.next?'Pip is growing · Tap to see':'Pip is ready to ride');
  $('#resultShield').hidden=!state.rewards.shield;$('#resultShield').innerHTML=shieldIcon+'<span>1 shield</span>';
  const progress=Core.chapterProgress(state);
  $('#checkpoint').textContent=progress.nextCheckpoint?'◆ ◇':progress.checkpoint?'◆ ◆':'◇ ◇';$('#checkpoint').setAttribute('aria-label',progress.nextCheckpoint?'One win to the next checkpoint':'Checkpoint progress');
  const enemies=Core.enemyChoices(state,result.strength);
  const choices=[{hp:result.strength,label:'Same',symbol:'=',enemy:enemies[0]}];
  if(result.victory)choices.push({hp:result.strength+1,label:'Stronger',symbol:'↑',enemy:Core.enemyChoices(state,result.strength+1).find(e=>e.id!==enemies[0].id)||Core.enemyChoices(state,result.strength+1)[0]});
  else if(result.strength>3)choices.unshift({hp:result.strength-1,label:'Easier',symbol:'↓',enemy:Core.enemyChoices(state,result.strength-1).find(e=>e.id!==enemies[0].id)||Core.enemyChoices(state,result.strength-1)[0]});
  else choices.push({hp:3,label:'Same',symbol:'=',enemy:enemies[1]});
  const box=$('#opponents');box.replaceChildren();
  choices.forEach(choice=>{
    const button=document.createElement('button');button.className='opponentCard';button.setAttribute('aria-label',`${choice.label}, ${choice.hp} hearts`);
    button.setAttribute('aria-label',`${choice.enemy.name}, ${choice.label.toLowerCase()} strength, ${choice.hp} hearts`);
    button.innerHTML=`<div class="opponentStage"><div class="opponentMonster sceneSprite"></div></div><div class="creatureName"></div><div class="opponentName"><span aria-hidden="true">${choice.symbol}</span> ${choice.label}</div><div class="miniHearts visualHearts"></div>`;
    button.querySelector('.creatureName').textContent=choice.enemy.name;
    button.dataset.enemy=choice.enemy.id;paintEnemy(button.querySelector('.opponentMonster'),choice.enemy.id,choice.hp);healthSymbols(button.querySelector('.miniHearts'),choice.hp);
    button.onclick=()=>{playClock.reset(performance.now());account();if(Core.isSessionDue(state))Core.completeSession(state,Date.now());
      state.campaign.enemyStrength=choice.hp;Core.startBattle(state,Date.now(),{strength:choice.hp,enemyId:choice.enemy.id});if(save())renderActivity();};box.append(button);
  });box.classList.toggle('single',choices.length===1);
  if(!result.victory)defeatReaction(result,result.enemyId,result.strength);else maybeOfferName();
}
function defeatReaction(result,enemyId,strength){
  if(result.defeatShown||paused||blocked)return;
  result.defeatShown=true;if(!save())return;
  const scene=$('#defeatScene');paintEnemy($('#defeatEnemy'),enemyId,strength);
  scene.hidden=false;scene.classList.add('escaping');sound.cue('chuckle');
  later(()=>{scene.hidden=true;scene.classList.remove('escaping');},2200);
}
function renderSummary() {
  show('summary');playing=false;paused=true;cancelWork();const session=state.session;
  $('#summaryTitle').textContent=state.battle&&!state.battle.resolved?'Saved':session.elapsedMs>=session.targetMs?'Well done!':'Saved';
  const records=state.campaign.battleRecords.filter(r=>r.sessionId===session.id),words=[...new Set(records.map(r=>r.target))];
  $('#summaryDetail').hidden=words.length===0;
  $('#summaryWords').replaceChildren();
  words.forEach(word=>{const chip=document.createElement('span');chip.textContent=word;$('#summaryWords').append(chip);});
  $('#summaryDetail').innerHTML=`<div><strong>${words.length}</strong><span>words practiced</span></div><div><strong>${session.victories}</strong><span>${session.victories===1?'battle':'battles'} won</span></div>`;
}

function galaxyMask(){
  return '<svg class="mask forestSpiral" viewBox="0 0 180 110" aria-hidden="true"><path class="spiralGlow" d="M92 53c-12-8-25 0-21 9 6 15 39 10 49-5 15-24-20-41-50-25-30 15-34 43-3 52 36 10 84-13 89-39 6-30-49-39-84-24-36 15-62 40-57 64"/><path class="spiralLine" d="M92 53c-12-8-25 0-21 9 6 15 39 10 49-5 15-24-20-41-50-25-30 15-34 43-3 52 36 10 84-13 89-39 6-30-49-39-84-24-36 15-62 40-57 64"/></svg>';
}
function syncSound(){
  if(!state)return;
  const q=Core.getQuestion(state),reading=['battle','assessment'].includes(state.screen)&&q&&!q.answeredAt;
  sound.configure({enabled:state.settings.soundscape!==false,quiet:blocked||document.hidden||!windowFocused||(playing&&paused)||reading||state.screen==='assessment'||state.screen==='parentDashboard'});
}
function paceIcon(id){
  const drawings={
    crawl:'<circle cx="43" cy="19" r="5"/><path d="M37 29L22 31L17 43H8M24 32L31 42H22M37 29L43 42H52M36 31L34 43H41"/>',
    walk:'<circle cx="34" cy="11" r="5"/><path d="M32 21L28 36L18 53M28 36L40 43L44 53M31 23L41 31L49 31M30 24L21 31L15 39"/>',
    run:'<circle cx="41" cy="10" r="5"/><path d="M37 20L27 34L16 30L9 37M27 34L39 40L32 52M35 21L44 28L53 21M34 23L24 19L17 25M7 48H19M5 17H16"/>',
    ride:'<path d="M7 41Q17 47 23 35L42 35L45 22L51 18L54 27L60 31L58 37L49 38L46 48H40L40 41H27L22 49H16L19 40M46 23L44 16M51 19L55 14"/><circle cx="32" cy="12" r="4"/><path d="M31 20L28 29L36 34L33 41M31 22L41 25L47 24"/><circle cx="52" cy="29" r="1"/>',
    fly:'<path d="M5 42L23 35L41 35L47 24L52 23L56 30L62 32L59 37L48 38L42 45L35 45M24 35L13 12L29 20L37 35M26 35L13 48L29 43M47 24L47 18"/><circle cx="39" cy="13" r="4"/><path d="M38 21L34 29L42 34L39 40M39 22L47 26"/><circle cx="54" cy="30" r="1"/>'
  };
  return '<svg class="pacePicture" viewBox="0 0 64 64" aria-hidden="true">'+drawings[id]+'</svg>';
}
function openSpeed(){
  const box=$('#speedChoices');box.replaceChildren();
  for(const mode of Core.speedChoices(state)){
    const button=document.createElement('button');button.className='speedChoice';button.dataset.speed=mode.id;button.disabled=mode.locked;
    button.setAttribute('aria-pressed',String((state.settings.selfPaced?'crawl':state.settings.speed||'walk')===mode.id));
    button.setAttribute('aria-label',mode.name+dragonText(mode.locked?', locked: rideable Pip and expansion required':''));
    button.innerHTML=paceIcon(mode.id)+'<span>'+mode.name+'</span>'+(mode.locked?'<svg class="paceLock" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>':'');
    button.onclick=()=>{if(Core.chooseSpeed(state,mode.id)&&save()){$('#speedPanel').hidden=true;$('#mapSpeed').textContent=mode.name;}};box.append(button);
  }
  $('#speedNote').textContent='';$('#speedPanel').hidden=false;
}
function openGrowth(){
  const g=Core.dragonProgress(state);paintPip($('#growthPip'));paintPip($('#growthNextPip'),Math.min(g.stage+1,3));
  $('#growthTitle').textContent=dragonText(g.next?'Pip is growing':'Pip can ride');
  $('#growthNextName').textContent=dragonText(g.next?.name||g.current.name);
  const rows=$('#growthMeters');rows.replaceChildren();
  const meters=[['XP',Math.floor(g.xp),g.next?.xp||Math.max(1,Math.floor(g.xp))]];
  meters.forEach(([label,value,max])=>{const row=document.createElement('div');row.className='growthMeter';const heading=document.createElement('span');heading.textContent=label;const valueEl=document.createElement('strong');valueEl.textContent=Math.min(value,max)+' / '+max;const track=document.createElement('div');track.className='growthTrack';track.setAttribute('role','progressbar');track.setAttribute('aria-label',label);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(max));track.setAttribute('aria-valuenow',String(Math.min(value,max)));const fill=document.createElement('span');fill.style.width=(Math.min(1,value/max)*100)+'%';track.append(fill);row.append(heading,valueEl,track);rows.append(row);});
  $('#growthChapterGate').hidden=true;$('#renameDragon').hidden=g.stage<1;$('#renameDragon').textContent=state.dragon.named?'Change name':'Choose a name';
  $('#growthPanel').hidden=false;
}
$('#dragonPanel').onclick=$('#resultGrowth').onclick=openGrowth;
$('#dragonPanel').onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openGrowth();}};
$('#growthClose').onclick=()=>{$('#growthPanel').hidden=true;};
$('#renameDragon').onclick=openNaming;
$('#dragonNameLater').onclick=()=>{$('#dragonNamePanel').hidden=true;save();};
$('#dragonNameSave').onclick=()=>{if(!Core.nameDragon(state,$('#dragonNameInput').value)){$('#dragonNameMessage').textContent='Choose a name first.';return;}if(save()){$('#dragonNamePanel').hidden=true;if(state.screen==='campaignMap')renderMap();else if(state.screen==='result')renderResult();}};
$('#dragonNameInput').addEventListener('keydown',event=>{if(event.key==='Enter')$('#dragonNameSave').click();});
document.addEventListener('contextmenu',event=>{if(!event.target.closest('input,textarea,#parentDashboard'))event.preventDefault();});
document.addEventListener('selectstart',event=>{if(!event.target.closest('input,textarea,#parentDashboard'))event.preventDefault();});
$('#mapSpeed').onclick=$('#pauseSpeed').onclick=openSpeed;
$('#speedClose').onclick=()=>{$('#speedPanel').hidden=true;};
$('#fullscreenBtn').onclick=async()=>{
  const app=document.documentElement,notice=$('#fullscreenNotice');notice.hidden=true;
  try{
    if(document.fullscreenElement||document.webkitFullscreenElement)await (document.exitFullscreen?.()||document.webkitExitFullscreen?.());
    else if(app.requestFullscreen)await app.requestFullscreen({navigationUI:'hide'});
    else if(app.webkitRequestFullscreen)await app.webkitRequestFullscreen();
    else throw new Error('Unavailable');
  }catch{notice.textContent='Full screen is unavailable in this browser.';notice.hidden=false;}
};
function fullscreenChanged(){const active=!!(document.fullscreenElement||document.webkitFullscreenElement);$('#fullscreenBtn').setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');$('#fullscreenBtn').setAttribute('aria-pressed',String(active));}
document.addEventListener('fullscreenchange',fullscreenChanged);document.addEventListener('webkitfullscreenchange',fullscreenChanged);
$('#soundBtn').onclick=()=>{state.settings.soundscape=state.settings.soundscape===false;syncSound();if(state.settings.soundscape)sound.unlock();$('#soundBtn').setAttribute('aria-pressed',String(state.settings.soundscape));$('#soundBtn').setAttribute('aria-label',state.settings.soundscape?'Mute soundscape':'Enable soundscape');save();};
function unlockAudio(){sound.unlock();narrator.unlock();}
document.addEventListener('pointerdown',unlockAudio,{passive:true});document.addEventListener('keydown',unlockAudio);

$('#reloadSaved').onclick=()=>location.reload();
$$('[data-sprite]').forEach(el=>paintSprite(el,Number(el.dataset.sprite)));
try{store=new AdventureStore(window.localStorage);state=store.load();}catch(e){storageProblem(e);return;}
$('#soundBtn').setAttribute('aria-pressed',String(state.settings.soundscape!==false));$('#soundBtn').setAttribute('aria-label',state.settings.soundscape===false?'Enable soundscape':'Mute soundscape');
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
  state.story.mapPending=false;
  if(state.battle?.fromAssessment&&!state.battle.mapSeen){state.battle.mapSeen=true;state.battle.introPending=false;}
  continueAdventure();
};
$('#mapSettings').onclick=()=>{renderHeroes();show('hero');save();};
$('#mapParents').onclick=openParentGate;$('#routeParents').onclick=openParentGate;
$('#parentCancel').onclick=()=>{$('#parentGate').hidden=true;};
$('#parentUnlock').onclick=()=>{if(Number($('#parentAnswer').value)!==parentAnswer){$('#parentGateMessage').textContent='Please try again.';return;}$('#parentGate').hidden=true;renderParent();};
$('#parentAnswer').addEventListener('keydown',e=>{if(e.key==='Enter')$('#parentUnlock').click();});
$('#parentHome').onclick=home;
$('#mathStart').onclick=()=>{if(Core.startMath(state,Date.now())){sound.resetCountdown();playClock.reset(performance.now());if(save())renderActivity();}};
$('#mathSkip').onclick=$('#mathContinue').onclick=()=>{if(Core.leaveMath(state,Date.now())&&save())renderActivity();};
$('#assessmentStart').onclick=()=>{playClock.reset(performance.now());state.assessment.instructionsSeen=true;if(save())renderActivity();};
$('#encounterStart').onclick=()=>{playClock.reset(performance.now());state.battle.introPending=false;if(save())renderActivity();};
$('#pauseBtn').onclick=()=>pause();$('#pauseResume').onclick=enter;$('#pauseFinish').onclick=finishForNow;
$('#selfPacedSetting').onchange=()=>{state.settings.selfPaced=$('#selfPacedSetting').checked;state.settings.speed=state.settings.selfPaced?'crawl':null;const q=state.battle?.question;
  if(q&&!q.answeredAt&&q.phase==='ready')q.exposureMs=Core.practiceExposure(state);save();};
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
document.addEventListener('visibilitychange',()=>{if(document.hidden){account();pause('away');narrator.cancel();}});
window.addEventListener('pagehide',()=>{narrator.cancel();if(!blocked){account();pause('away');if(!playing)save();}});
window.addEventListener('blur',()=>{windowFocused=false;account();pause('away');narrator.cancel();});
window.addEventListener('focus',()=>{windowFocused=true;});
window.addEventListener('storage',event=>{if(event.key===KEY&&event.newValue!==store.expected)storageProblem(Object.assign(new Error('Another tab updated this adventure. Reload to use its saved progress.'),{code:'conflict'}));});
setInterval(()=>{
  account();if(paused||blocked||!playing)return;
  if(state.activity==='result'&&Core.isSessionDue(state)){Core.completeSession(state,Date.now());state.activity='result';if(save())renderActivity();}else save();
},1000);
Core.interruptQuestion(state);
renderHeroes();paintHero($('#battleHeroImg'),heroIndex());
if(state.profile.name){if(state.screen==='hero'){show('hero');save();}else home();}else{show('setup');save();}
})();
