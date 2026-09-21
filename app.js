(() => {
'use strict';
const Core=BlitzCore, Content=BlitzContent, {AdventureStore,KEY}=BlitzStorage;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const classes=['Mage','Knight','Archer'];
const maleHeroSheet='assets/rowanfire-boys-2026-09-21.png';
const heroAssets=[maleHeroSheet,maleHeroSheet,maleHeroSheet,'assets/hero4.webp','assets/hero5.webp','assets/hero6.webp'];
const malePortraitCrops=[{x:183,y:145},{x:636,y:145},{x:1099,y:145}];
const narrator=BlitzAudio.narrator({synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance});
let store,state,paused=true,playing=false,blocked=false,lastTick=performance.now(),timer=null,epoch=0;
const spriteCrops=[{x:0,y:0,w:384,h:538},{x:384,y:0,w:426,h:538},{x:780,y:0,w:374,h:538},{x:1154,y:0,w:382,h:538},{x:0,y:538,w:384,h:486},{x:384,y:538,w:384,h:486},{x:768,y:538,w:384,h:486},{x:1152,y:538,w:384,h:486}];
let spriteSerial=0;
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
function cancelWork(){clearTimeout(timer);timer=null;epoch++;narrator.cancel();}
function later(fn,ms){const token=epoch;clearTimeout(timer);timer=setTimeout(()=>{if(!paused&&!blocked&&token===epoch)fn();},ms);}
function account() {
  const now=performance.now(),delta=Math.max(0,now-lastTick);lastTick=now;
  if(!state||paused||blocked||!playing||document.hidden)return;
  Core.addActiveTime(state,delta);
  const q=Core.getQuestion(state);
  if(q&&!q.answeredAt&&['battle','assessment'].includes(state.activity)) {
    if(q.phase==='word')q.wordViewedMs+=delta;
    if(q.phase==='choices')q.responseMs+=delta;
  }
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
  $('#pauseBtn').hidden=!['battle','assessment','result'].includes(id);
  $('#backBtn').hidden=id!=='hero';
  if(!['battle','assessment'].includes(id))$('#wordReady').hidden=true;
  state.screen=id;
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
  account();cancelWork();paused=true;playing=false;
  $('#pausePanel').hidden=true;
  paintHero($('#routeHeroImg'),heroIndex());
  $('#routeTitle').textContent=state.profile.name+', ready to explore?';
  $('#routeName').textContent='Pip is coming with you.';
  const resumable=state.assessment.done||state.battle||state.teaching||state.assessment.progress||state.demoComplete;
  $('#continueAdventure').hidden=!resumable;
  $('#continueAdventure').textContent=state.session?.completedAt?'New adventure →':(state.assessment.progress?'Continue reading check →':'Keep exploring →');
  $('#tryBattle').hidden=!!resumable;$('#checkFirst').hidden=!!resumable;
  $('#sessionNote').textContent=store.recovered?'Your last saved copy was recovered.':resumable?'Your progress is saved on this device.':'';
  show('route');save();
}
function enter() {
  if(blocked)return;
  paused=false;playing=true;lastTick=performance.now();$('#pausePanel').hidden=true;renderActivity();
}
function continueAdventure() {
  if(state.session?.completedAt) {
    Core.beginSession(state,Date.now());
    state.activity=state.teaching?'teaching':state.result?'result':state.battle&&!state.battle.resolved?'battle':'route';
  }
  if(state.activity==='route') {
    if(state.handoff)state.activity='handoff';
    else if(state.teaching)state.activity='teaching';
    else if(state.assessment.progress)state.activity='assessment';
    else if(state.battle&&!state.battle.resolved)state.activity='battle';
    else if(state.result)state.activity='result';
    else if(state.assessment.done)Core.startBattle(state,Date.now());
    else Core.startAssessment(state,Date.now());
  }
  if(save())enter();
}
function pause() {
  if(paused||blocked||!playing)return;
  account();Core.interruptQuestion(state);paused=true;cancelWork();
  if(!save())return;
  showPausePanel();
}
function showPausePanel(){
  $('#selfPacedSetting').checked=state.settings.selfPaced;
  $('#paceSetting').hidden=state.activity==='assessment'||!state.assessment.done;
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
  $('#battleHeroImg').classList.remove('attack','heroHit');$('#enemyFace').classList.remove('enemyHit');
  if(state.activity==='handoff'){renderHandoff();return;}
  if(state.activity==='battle') {
    if(!state.battle)Core.startBattle(state,Date.now());
    if(!state.battle.question||state.battle.question.phase==='done')Core.prepareBattle(state,Date.now());
    if(!save())return;
    if(state.activity!=='battle'){renderActivity();return;}
    show('battle');paintHero($('#battleHeroImg'),heroIndex());renderHud();
    const q=state.battle.question;
    if(q.answeredAt){if(q.correct)correctFeedback();else correction();}else presentQuestion();
  } else if(state.activity==='assessment') {
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
  account();const assessment=state.activity==='assessment';
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
  speak(q.target,{onEnd:()=>{
    if(!supported){$('#battleHeroImg').classList.add('attack');$('#enemyFace').classList.add('enemyHit');}
    later(advanceBattle,720);
  }});
}
function correction() {
  // A wrong answer opens its reviewed scene directly. No extra correction modal.
  const q=state.battle.question;
  Core.startTeaching(state,q.target,'battle',Date.now());
  if(save())renderActivity();
}

function advanceBattle(){account();cancelWork();Core.prepareBattle(state,Date.now());if(save())renderActivity();}
function renderHud() {
  const b=state.battle;$('#heroHearts').replaceChildren();
  for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='heart'+(i<b.heroHealth?'':' off');heart.textContent='♥';$('#heroHearts').append(heart);}
  $('#heroHearts').setAttribute('aria-label',`${b.heroHealth} of 3 hearts`);
  $('#enemyFill').style.width=(100*b.enemyHealth/b.maxHealth)+'%';
  $('#enemyHealth').setAttribute('aria-label',`Enemy health: ${b.enemyHealth} of ${b.maxHealth}`);
  $('#battleMode').textContent=b.demo?'First adventure':'Adventure';
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
  illustration.src='assets/teaching/'+item.image+'.webp';illustration.alt=item.alt;
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
  $('#resultMessage').textContent=result.victory?'Which adventure is next?':'Pip is with you. Choose your next try.';
  $('#checkpoint').textContent=state.campaign.checkpointWins?`◆ ${state.campaign.checkpointWins} wins safely saved`:'Your practice is saved.';
  const choices=[{hp:result.strength,label:'Play again'}];
  if(result.victory)choices.push({hp:result.strength+1,label:'Bigger challenge'});
  else if(result.strength>3)choices.push({hp:result.strength-1,label:'Gentler challenge'});
  const box=$('#opponents');box.replaceChildren();
  choices.forEach(choice=>{
    const button=document.createElement('button');button.className='opponentCard';button.setAttribute('aria-label',`${choice.label}, ${choice.hp} hearts`);
    button.innerHTML=`<div class="opponentMonster sceneSprite"></div><div class="opponentName">${choice.label}</div><div class="miniHearts">${choice.hp} hearts</div>`;
    paintSprite(button.querySelector('.opponentMonster'),7);
    button.onclick=()=>{account();if(Core.isSessionDue(state)){Core.completeSession(state,Date.now());if(save())renderActivity();return;}
      state.campaign.enemyStrength=choice.hp;Core.startBattle(state,Date.now(),{strength:choice.hp});if(save())renderActivity();};box.append(button);
  });box.classList.toggle('single',choices.length===1);
}
function renderSummary() {
  show('summary');playing=false;paused=true;cancelWork();const session=state.session;
  $('#summaryTitle').textContent=session.elapsedMs>=session.targetMs?'Challenge complete':'Practice saved';
  const records=state.campaign.battleRecords.filter(r=>r.sessionId===session.id),words=[...new Set(records.map(r=>r.target))];
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
$('#tryBattle').onclick=()=>{Core.startTeaching(state,'sat','demo',Date.now());if(save())enter();};
$('#checkFirst').onclick=()=>{Core.startAssessment(state,Date.now());if(save())enter();};
$('#continueAdventure').onclick=continueAdventure;
$('#pauseBtn').onclick=pause;$('#pauseResume').onclick=enter;$('#pauseFinish').onclick=finishForNow;
$('#selfPacedSetting').onchange=()=>{state.settings.selfPaced=$('#selfPacedSetting').checked;const q=state.battle?.question;
  if(q&&!q.answeredAt&&q.phase==='ready')q.exposureMs=state.settings.selfPaced?null:state.assessment.exposure;save();};
$('#wordReady').onclick=hideWord;
$('#assessmentUnsure').onclick=()=>answer('?');
$('#battleUnsure').onclick=()=>answer('?');
$('#handoffNext').onclick=()=>{Core.leaveHandoff(state,Date.now());if(save())enter();};
$('#voiceChoice').onchange=()=>{state.settings.voiceURI=$('#voiceChoice').value;save();};
$('#previewVoice').onclick=()=>narrator.speak('Pip sat on the rock.',{preferred:state.settings.voiceURI||''});
window.speechSynthesis?.addEventListener('voiceschanged',()=>{if(!$('#pausePanel').hidden)populateVoices();});
$('#teachReplay').onclick=()=>{if(paused||blocked)return;const teaching=state.teaching;Core.startTeaching(state,teaching.target,teaching.returnTo,Date.now(),{replay:true});if(save())narrateTeaching();};
$('#teachContinue').onclick=()=>{if(paused||blocked)return;Core.leaveTeaching(state,Date.now());if(save())advanceBattle();};
$('#resultNext').onclick=home;
$('#anotherChallenge').onclick=continueAdventure;$('#doneToday').onclick=home;
$('#retrySave').onclick=()=>{try{store.save(state);blocked=false;$('#saveNotice').hidden=true;if(playing)showPausePanel();else if(state.screen==='route')home();else show(state.screen);}catch(e){storageProblem(e);}};
$('#resetBtn').onclick=()=>{if(confirm('Erase the profile and all saved reading progress on this device? This cannot be undone.')){
  // Explicit existing reset action only. Never reset during deployment or migration.
  for(const suffix of ['','_backup','_legacy_backup','_unreadable_backup'])localStorage.removeItem(KEY+suffix);location.reload();
}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('pagehide',()=>{if(!blocked){pause();if(!playing)save();}});
window.addEventListener('storage',event=>{if(event.key===KEY&&event.newValue!==store.expected)storageProblem(Object.assign(new Error('Another tab updated this adventure. Reload to use its saved progress.'),{code:'conflict'}));});
setInterval(()=>{
  if(paused||blocked||!playing)return;account();
  if(state.activity==='result'&&Core.isSessionDue(state)){Core.completeSession(state,Date.now());if(save())renderActivity();}else save();
},1000);
Core.interruptQuestion(state);
renderHeroes();paintHero($('#battleHeroImg'),heroIndex());
if(state.profile.name){if(state.screen==='hero'){show('hero');save();}else home();}else{show('setup');save();}
})();

