(() => {
'use strict';
const Core=BlitzCore, Content=BlitzContent, {AdventureStore,KEY}=BlitzStorage;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const classes=['Mage','Knight','Archer'];
const maleHeroSheet='assets/rowanfire-boys-2026-09-21.png';
const heroAssets=[maleHeroSheet,maleHeroSheet,maleHeroSheet,'assets/hero4.webp','assets/hero5.webp','assets/hero6.webp'];
const malePortraitCrops=[{x:183,y:145},{x:636,y:145},{x:1099,y:145}];
let store,state,paused=true,playing=false,blocked=false,lastTick=performance.now(),timer=null,epoch=0;
function paintHero(element,index) {
  element.classList.add('heroPortrait');element.setAttribute('role','img');
  element.setAttribute('aria-label',classes[index%3]+' hero');element.dataset.heroIndex=String(index);
  element.style.backgroundImage=`url("${heroAssets[index]}")`;
  if(index<3){const crop=malePortraitCrops[index];element.style.backgroundSize='480% 320%';element.style.backgroundPosition=`${100*crop.x/(1536-320)}% ${100*crop.y/(1024-320)}%`;}
  else {element.style.backgroundSize='cover';element.style.backgroundPosition='center';}
}
function heroIndex(){return (state.profile.gender==='boy'?0:3)+classes.indexOf(state.profile.heroClass);}
function cancelWork(){clearTimeout(timer);timer=null;epoch++;if('speechSynthesis' in window)speechSynthesis.cancel();}
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
  $('#pauseBtn').hidden=!['battle','assessment','teaching','result'].includes(id);
  $('#resetBtn').hidden=!['setup','hero'].includes(id);
  state.screen=id;
}
function speak(text,{onEnd=null,onBoundary=null}={}) {
  const token=epoch;let ended=false;
  const finish=()=>{if(ended)return;ended=true;if(token===epoch&&!paused&&!blocked&&onEnd)onEnd();};
  if(!('speechSynthesis' in window)){finish();return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.78;u.pitch=.78;
  const voices=speechSynthesis.getVoices();
  u.voice=voices.find(v=>/Daniel|Arthur|Alex|Oliver|Aaron|Tom/i.test(v.name)&&/^en/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;
  u.onend=finish;u.onerror=finish;
  if(onBoundary)u.onboundary=event=>{if(token===epoch&&!paused)onBoundary(event);};
  // Some browser voices omit completion events. Never trap the child in feedback.
  if(onEnd)later(finish,Math.max(4000,text.length*100));
  speechSynthesis.speak(u);
}
function renderHeroes(){
  const grid=$('#heroGrid');grid.replaceChildren();
  classes.forEach((name,i)=>{
    const button=document.createElement('button');button.className='heroCard'+(state.profile.heroClass===name?' selected':'');
    const portrait=document.createElement('span'),label=document.createElement('div');label.className='heroName';label.textContent=name;
    paintHero(portrait,(state.profile.gender==='boy'?0:3)+i);button.append(portrait,label);
    button.onclick=()=>{state.profile.heroClass=name;state.profile.heroIndex=heroIndex();if(save())renderHeroes();};grid.append(button);
  });
}
function home() {
  account();cancelWork();paused=true;playing=false;
  $('#pausePanel').hidden=true;$('#correction').classList.remove('show');
  paintHero($('#routeHeroImg'),heroIndex());
  $('#routeName').textContent=state.profile.name+' the '+state.profile.heroClass;
  const resumable=state.assessment.done||state.battle||state.teaching||state.assessment.progress||state.demoComplete;
  $('#continueAdventure').hidden=!resumable;
  $('#continueAdventure').textContent=state.session?.completedAt?'New challenge':(state.assessment.progress?'Continue reading check':'Continue adventure');
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
    if(state.teaching)state.activity='teaching';
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
  $('#selfPacedSetting').checked=state.settings.selfPaced;
  $('#paceSetting').hidden=state.activity==='assessment'||!state.assessment.done;
  $('#pauseTime').textContent=state.session&&!state.session.completedAt?`${Math.floor(state.session.elapsedMs/60000)} min practiced · about 7 min per challenge`:'';
  $('#pausePanel').hidden=false;
}
function finishForNow() {
  if(blocked)return;
  if(state.session&&!state.session.completedAt&&!state.battle?.demo){Core.completeSession(state,Date.now());if(save())enter();}
  else home();
}
function renderActivity() {
  cancelWork();$('#feedback').classList.remove('show');$('#correction').classList.remove('show');
  $('#battleHeroImg').classList.remove('attack','heroHit');$('#enemyFace').classList.remove('enemyHit');
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
    show('assessment');const q=Core.getQuestion(state);
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
  answers.replaceChildren();$('#assessmentUnsure').style.display='none';$('#wordReady').hidden=true;
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
  $('#assessmentUnsure').style.display=state.activity==='assessment'?'block':'none';lastTick=performance.now();
}
function answer(option) {
  if(paused||blocked)return;
  account();const assessment=state.activity==='assessment';
  const rec=assessment?Core.answerAssessment(state,option,Date.now()):Core.answerBattle(state,option,Date.now());
  if(!rec)return;
  cancelWork();stageElements()[1].replaceChildren();$('#assessmentUnsure').style.display='none';
  if(!save())return;
  if(assessment)assessmentFeedback();else{renderHud();if(rec.correct)correctFeedback();else correction(true);}
}
function assessmentFeedback() {
  const q=Core.getQuestion(state);$('#assessmentAnswers').replaceChildren();$('#assessmentUnsure').style.display='none';
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
function correction(narrate=false) {
  const q=state.battle.question;$('#battleAnswers').replaceChildren();$('#battleScroll').innerHTML='<div class="mask"></div>';
  $('#correctWord').textContent=q.target;
  $('#correctionNote').textContent=q.supportReasons.length?'Practice turn — no heart lost':q.freeMistake?'First practice mistake — no heart lost':'';
  $('#correction').classList.add('show');
  if(narrate){if(!q.freeMistake&&!q.supportReasons.length)$('#battleHeroImg').classList.add('heroHit');
    speak(q.freeMistake?'Practice turn. You keep your heart. The word was '+q.target:q.target);}
}
function continueCorrection() {
  if(paused||blocked)return;
  const q=state.battle?.question;if(!q?.answeredAt||q.correct)return;
  cancelWork();$('#correction').classList.remove('show');
  if(q.needsTeaching){Core.startTeaching(state,q.target,'battle',Date.now());if(save())renderActivity();}else advanceBattle();
}
function advanceBattle(){account();cancelWork();Core.prepareBattle(state,Date.now());if(save())renderActivity();}
function renderHud() {
  const b=state.battle;$('#heroHearts').replaceChildren();
  for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='heart'+(i<b.heroHealth?'':' off');heart.textContent='♥';$('#heroHearts').append(heart);}
  $('#heroHearts').setAttribute('aria-label',`${b.heroHealth} of 3 hearts`);
  $('#enemyFill').style.width=(100*b.enemyHealth/b.maxHealth)+'%';
  $('#enemyHealth').setAttribute('aria-label',`Enemy health: ${b.enemyHealth} of ${b.maxHealth}`);
  $('#enemyFace').textContent=b.demo?'🌿':(b.maxHealth>=5?'👹':'🪨');
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
  const item=Core.byWord[state.teaching.target],start=item.sentence.toLowerCase().indexOf(item.w),end=start+item.w.length;
  const target=$('#teachSentence .targetWord');target.classList.remove('spoken');
  speak(item.sentence,{onBoundary:event=>target.classList.toggle('spoken',event.charIndex>=start&&event.charIndex<end),onEnd:()=>target.classList.remove('spoken')});
}
function renderResult() {
  show('result');const result=state.result;if(!result){home();return;}
  $('#resultIcon').textContent=result.victory?'✦':'☾';$('#resultTitle').textContent=result.victory?'Victory!':'Try again';
  $('#checkpoint').textContent=state.campaign.checkpointWins?`Checkpoint: ${state.campaign.checkpointWins} wins secured`:'Keep exploring';
  const choices=[{hp:result.strength,mark:'↔',label:'Same strength'}];
  if(result.victory)choices.push({hp:result.strength+1,mark:'↑',label:'Stronger'});
  else if(result.strength>3)choices.push({hp:result.strength-1,mark:'↓',label:'Weaker'});
  const box=$('#opponents');box.replaceChildren();
  choices.forEach(choice=>{
    const button=document.createElement('button');button.className='opponentCard';button.setAttribute('aria-label',`${choice.label}, ${choice.hp} hearts`);
    button.innerHTML=`<div class="opponentMonster">${choice.hp>=5?'👹':'🪨'}</div><div>${choice.mark}</div><div class="miniHearts">♥ × ${choice.hp}</div>`;
    button.onclick=()=>{account();if(Core.isSessionDue(state)){Core.completeSession(state,Date.now());if(save())renderActivity();return;}
      state.campaign.enemyStrength=choice.hp;Core.startBattle(state,Date.now(),{strength:choice.hp});if(save())renderActivity();};box.append(button);
  });box.classList.toggle('single',choices.length===1);
}
function renderSummary() {
  show('summary');playing=false;paused=true;cancelWork();const session=state.session;
  $('#summaryTitle').textContent=session.elapsedMs>=session.targetMs?'Challenge complete':'Practice saved';
  const records=state.campaign.battleRecords.filter(r=>r.sessionId===session.id),words=[...new Set(records.map(r=>r.target))];
  $('#summaryWords').textContent=words.join(' · ');
  $('#summaryDetail').textContent=`${words.length} words practiced · ${session.victories} ${session.victories===1?'battle':'battles'} won`;
}

$('#reloadSaved').onclick=()=>location.reload();
try{store=new AdventureStore(window.localStorage);state=store.load();}catch(e){storageProblem(e);return;}
$$('[data-hero-index]').forEach(el=>paintHero(el,Number(el.dataset.heroIndex)));
for(const age of [5,6,7,8,9,'10+']){
  const button=document.createElement('button');button.className='chip'+(String(state.profile.age)===String(age)?' selected':'');button.textContent=age;
  button.onclick=()=>{state.profile.age=age;$$('#ageChoices .chip').forEach(el=>el.classList.toggle('selected',el===button));save();};$('#ageChoices').append(button);
}
$$('.genderCard').forEach(button=>{button.classList.toggle('selected',button.dataset.gender===state.profile.gender);button.onclick=()=>{state.profile.gender=button.dataset.gender;$$('.genderCard').forEach(el=>el.classList.toggle('selected',el===button));save();};});
$('#nameInput').value=state.profile.name;
$('#setupNext').onclick=()=>{state.profile.name=$('#nameInput').value.trim()||'Hero';renderHeroes();show('hero');save();};
$('#heroNext').onclick=()=>{state.profile.heroIndex=heroIndex();home();};
$('#tryBattle').onclick=()=>{Core.startTeaching(state,'sat','demo',Date.now());if(save())enter();};
$('#checkFirst').onclick=()=>{Core.startAssessment(state,Date.now());if(save())enter();};
$('#continueAdventure').onclick=continueAdventure;
$('#pauseBtn').onclick=pause;$('#pauseResume').onclick=enter;$('#pauseFinish').onclick=finishForNow;
$('#selfPacedSetting').onchange=()=>{state.settings.selfPaced=$('#selfPacedSetting').checked;const q=state.battle?.question;
  if(q&&!q.answeredAt&&q.phase==='ready')q.exposureMs=state.settings.selfPaced?null:state.assessment.exposure;save();};
$('#wordReady').onclick=hideWord;
$('#assessmentUnsure').onclick=()=>answer('?');
$('#correctReplay').onclick=()=>{if(!paused&&!blocked){Core.noteSupport(state,state.battle.question.target,'correction-replay',Date.now());if(save())speak(state.battle.question.target);}};
$('#correctContinue').onclick=continueCorrection;
$('#teachReplay').onclick=()=>{if(paused||blocked)return;const teaching=state.teaching;Core.startTeaching(state,teaching.target,teaching.returnTo,Date.now(),{replay:true});if(save())narrateTeaching();};
$('#teachContinue').onclick=()=>{if(paused||blocked)return;Core.leaveTeaching(state,Date.now());if(save())advanceBattle();};
$('#resultNext').onclick=home;
$('#anotherChallenge').onclick=continueAdventure;$('#doneToday').onclick=home;
$('#retrySave').onclick=()=>{try{store.save(state);blocked=false;$('#saveNotice').hidden=true;$('#pausePanel').hidden=false;}catch(e){storageProblem(e);}};
$('#resetBtn').onclick=()=>{if(confirm('Reset BlitzWord on this device?')){
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
