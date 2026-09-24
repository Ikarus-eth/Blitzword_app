const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'../'),Core=require(root+'game-core'),Content=require(root+'content'),Storage=require(root+'storage'),Audio=require(root+'audio');
function boot(saved,options={}){
 const {window,document}=parseHTML(fs.readFileSync(root+'index.html','utf8'));
 let now=Date.UTC(2026,8,22),uid=0;const jobs=new Map(),memory=new Map(saved?[[Storage.KEY,JSON.stringify(saved)]]:[]);
 let failWrites=options.failWrites||false,heartbeat=()=>{},reloads=0;
 const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>{if(failWrites===true||typeof failWrites==='function'&&failWrites(k,v))throw new Error('Storage full');memory.set(k,v)},removeItem:k=>memory.delete(k)};
 const schedule=(fn,ms)=>(jobs.set(++uid,{fn,time:now+ms}),uid);
 window.localStorage=storage;
 window.BlitzEnemyArt=require(root+'enemy-art');
 window.matchMedia=()=>({matches:!!options.reducedMotion,addEventListener(){},removeEventListener(){}});
 if(options.geometry)window.HTMLElement.prototype.getBoundingClientRect=function(){const r=this.id==='battleHeroImg'?[30,230,270,410]:this.id==='enemyFace'?[680,330,290,290]:this.classList.contains('battlePip')?[280,420,180,190]:[0,0,1024,768];return {left:r[0],top:r[1],width:r[2],height:r[3],right:r[0]+r[2],bottom:r[1]+r[3]};};
 Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get(){return this.querySelector('option[selected]')?.value||this.firstElementChild?.value||''},set(value){for(const option of this.querySelectorAll('option'))option.selected=option.value===value;}});
 Object.defineProperty(window.HTMLImageElement.prototype,'complete',{get:()=>!options.pendingImages,configurable:true});Object.defineProperty(window.HTMLImageElement.prototype,'naturalWidth',{get:()=>1536,configurable:true});
 let speechEnd=null;const speechTexts=[];
 const ctx={window,document,BlitzCore:Core,BlitzContent:Content,BlitzStorage:Storage,BlitzSound:require(root+'soundscape'),BlitzEngagement:require(root+'engagement'),BlitzAudio:{...Audio,narrator:opts=>options.heldNarration?{speak(text,callbacks){speechTexts.push(text);speechEnd=callbacks.onEnd;},cancel(){speechEnd=null;}}:Audio.narrator({...opts,schedule,unschedule:id=>jobs.delete(id)})},performance:{now:()=>now},Date:class extends Date{static now(){return now}},setTimeout:schedule,clearTimeout:id=>jobs.delete(id),setInterval(fn){heartbeat=fn;},location:{reload(){reloads++;}},confirm:options.confirm||(()=>false),navigator:options.navigator||window.navigator,localStorage:storage,Option:function(t,v){const el=document.createElement('option');el.textContent=t;el.value=v;return el;}};
 vm.runInNewContext(fs.readFileSync(root+'app.js','utf8'),ctx);
 const state=()=>JSON.parse(memory.get(Storage.KEY)),get=id=>document.getElementById(id);
 function click(el){assert.ok(el,'missing element');assert.ok(!el.disabled,'disabled control');assert.ok(!el.hidden,'hidden control');el.onclick?.({});}
 function elapse(ms,awake=false){if(awake){for(let elapsed=0;elapsed<ms;elapsed+=1000){elapse(Math.min(1000,ms-elapsed));heartbeat();}return;}const target=now+ms;while([...jobs.values()].some(job=>job.time<=target))tick();now=target;}
 function tick(){const next=[...jobs.entries()].sort((a,b)=>a[1].time-b[1].time)[0];assert.ok(next,'no scheduled progress');jobs.delete(next[0]);now=next[1].time;next[1].fn();}
 function until(predicate){for(let i=0;i<25&&!predicate();i++)tick();assert.ok(predicate(),'progress stalled');}
 function ready(){if(state().battle?.introPending)click(get('encounterStart'));until(()=>state().battle?.question?.phase==='choices'||state().assessment.progress?.question?.phase==='choices'||!get('wordReady').hidden);if(!get('wordReady').hidden){click(get('wordReady'));until(()=>state().battle?.question?.phase==='choices');}}
 function resume(){const map=get('campaignMap').classList.contains('active');assert.ok(map||get('route').classList.contains('active'));click(get(map?'mapContinue':'continueAdventure'));}
 function advance(ms,suspended=false){if(suspended){now+=ms;heartbeat();}else for(let elapsed=0;elapsed<ms;elapsed+=1000){now+=Math.min(1000,ms-elapsed);heartbeat();}}
 function visibility(hidden){Object.defineProperty(document,'hidden',{value:hidden,configurable:true});document.dispatchEvent(new window.Event('visibilitychange'));}
 return {state,get,click,tick,elapse,until,ready,resume,advance,visibility,document,window,memory,reloads:()=>reloads,speechTexts,pendingSpeech:()=>speechEnd,finishSpeech(){const callback=speechEnd;speechEnd=null;callback?.();},setFailWrites:value=>failWrites=value};
}
function impactSave(enemy='moss-golem'){
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile={name:'Reader',gender:'boy',heroClass:'Mage',age:7};s.assessment.done=true;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();}
 Core.startBattle(s,now,{strength:4,enemyId:enemy});s.battle.introPending=false;Core.prepareBattle(s,now);return s;
}
{
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;Core.chooseSpeed(s,'walk');
 for(const word of [...Content.areas[0].words,...Content.areas[1].words.slice(0,3)]){
  Object.assign(s.learning.words[word],{introducedAt:new Date(now-Core.DAY).toISOString(),practiceSuccesses:3,reviewStage:0,dueAt:now+Core.DAY});
  s.learning.dailyPractice[word]={day:Core.dayKey(now),correct:3};
 }
 Core.startBattle(s,now,{strength:6});s.battle.introPending=false;const pending=Core.copy(Core.prepareBattle(s,now));
 assert.equal(pending.practiceKind,'speed-refill');assert.equal(pending.exposureMs,1500);
 let ui=boot(s);ui.resume();ui.ready();assert.equal(ui.state().battle.question.exposureMs,1500);
 ui=boot(ui.state());ui.resume();ui.ready();const q=ui.state().battle.question;
 assert.equal(q.id,pending.id);assert.deepEqual(q.options,pending.options);assert.equal(q.exposureMs,1500);
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));
 assert.equal(ui.state().battle.enemyHealth,5);assert.equal(ui.state().learning.dailyPractice[q.target].correct,3);
 assert.equal(Core.practiceExposure(ui.state()),1800);assert.ok(ui.state().campaign.battleRecords.at(-1).correct);
 console.log('PASS daily cap and one-step faster refill survive UI save/reopen without changing Walk or saved choices');
}
for(const help of [false,true])for(const kind of ['known','new','repeated','review']){
 const s=impactSave(),q=s.battle.question,w=s.learning.words[q.target];
 w.independentCorrect=2;q.isNew=kind==='new';q.retentionDue=kind==='review';w.consecutiveMisses=kind==='repeated'?(help?2:1):0;
 let ui=boot(s,{heldNarration:true});ui.resume();ui.ready();
 if(help)ui.click(ui.get('battleUnsure'));else ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));
 assert.equal(ui.state().battle.question.needsTeaching,kind!=='known');
 assert.equal(ui.get('battleScroll').querySelector('.selectedWord')!==null,!help);
 assert.equal(ui.get('battleScroll').querySelector('.correctWord .correctionLetters').textContent,q.target);
 if(help){assert.equal(ui.state().battle.heroHealth,3);assert.equal(ui.get('battleScroll').querySelector('.differentLetter'),null);}
 const saved=ui.state();ui.click(ui.get('homeBtn'));ui.finishSpeech();assert.equal(ui.get('combatEffects').className,'combatEffects');
 ui=boot(saved,{heldNarration:true});ui.resume();
 assert.equal(ui.state().campaign.battleRecords.length,1);assert.equal(ui.get('combatEffects').className,'combatEffects');
 const next=ui.get('battleAnswers').querySelector('.correctionNext');assert.equal(next.getAttribute('aria-label'),kind==='known'?'Continue':'See the example');
 ui.click(next);next.onclick(); // A second queued tap cannot teach or advance again.
 if(kind==='known'){
  assert.equal(ui.state().activity,'battle');assert.equal(ui.state().learning.teaching.length,0);
  assert.notEqual(ui.state().battle.question.id,q.id);assert.notEqual(ui.state().battle.question.target,q.target);
 }else{
  assert.equal(ui.state().activity,'teaching');assert.equal(ui.state().learning.teaching.length,1);
  ui.click(ui.get('teachContinue'));assert.notEqual(ui.state().battle.question.target,q.target);
 }
 assert.equal(ui.state().battle.heroHealth,help?3:2);assert.equal(ui.state().campaign.battleRecords.length,1);
}
console.log('PASS adaptive correction and help: known/new/repeated/review, saved resume, safe Continue and two-item recheck');
{
 const s=impactSave(),q=s.battle.question;q.target='rock';q.options=['rock','rack','lock','ruck'];
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent==='rack'));
 const scroll=ui.get('battleScroll'),rows=scroll.children;
 assert.equal(rows[0].className,'selectedWord');assert.equal(rows[1].className,'correctWord');
 assert.deepEqual([...scroll.querySelectorAll('.differentLetter')].map(e=>e.textContent),['a','o']);
 assert.equal(rows[0].querySelector('.srOnly').textContent,'rack');assert.equal(rows[0].querySelector('.correctionLetters').getAttribute('aria-hidden'),'true');
 assert.equal(ui.speechTexts.at(-1),'You chose rack. The word is rock.');assert.equal(ui.get('combatEffects').className,'combatEffects');
 ui.finishSpeech();assert.ok(ui.get('combatEffects').classList.contains('enemyStrike'));
 const replay=ui.get('battleAnswers').querySelector('.replay');ui.click(replay);ui.finishSpeech();
 assert.equal(ui.speechTexts.at(-1),'You chose rack. The word is rock.');assert.equal(ui.get('combatEffects').className,'combatEffects');
 assert.equal(ui.state().battle.heroHealth,2);assert.equal(ui.state().campaign.battleRecords.length,1);
 ui.click(ui.get('battleAnswers').querySelector('.correctionNext'));const target=ui.state().battle.question.target;
 replay.onclick();assert.equal(ui.state().battle.question.target,target);assert.equal(ui.state().learning.supportExposures.filter(e=>e.kind==='correction-replay').length,1);
 console.log('PASS contrast highlights only differing letters, speaks both words before impact, and replays without another hit');
}
for(const action of ['continue','pause','home']){
 const s=impactSave();s.learning.words[s.battle.question.target].independentCorrect=2;
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==s.battle.question.target));
 const pending=ui.pendingSpeech(),button=ui.get('battleAnswers').querySelector('.correctionNext');
 ui.click(action==='continue'?button:ui.get(action==='pause'?'pauseBtn':'homeBtn'));pending();
 if(action!=='continue')button.onclick();assert.equal(ui.get('combatEffects').className,'combatEffects');
 assert.equal(ui.state().campaign.battleRecords.length,1);assert.equal(ui.state().learning.teaching.length,0);
}
console.log('PASS Continue/Pause/Home cancel pending correction narration and stale controls without a delayed attack');
{
 const s=impactSave();s.battle.heroHealth=1;s.learning.words[s.battle.question.target].independentCorrect=2;
 const ui=boot(s);ui.resume();ui.ready();ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==s.battle.question.target));
 assert.equal(ui.state().battle.heroHealth,0);ui.click(ui.get('battleAnswers').querySelector('.correctionNext'));
 assert.equal(ui.state().activity,'result');assert.equal(ui.state().result.victory,false);assert.equal(ui.state().learning.teaching.length,0);
 console.log('PASS brief correction still resolves a final-heart defeat before another question');
}
for(const mode of ['correct','wrong','shield','free','supported']){
 const s=impactSave();if(mode==='shield')s.rewards.shield=true;if(mode==='free')s.battle.firstMistakeFree=true;
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 if(mode==='supported')ui.click(ui.get('battleUnsure'));else ui.click([...ui.get('battleAnswers').children].find(b=>mode==='correct'?b.textContent===q.target:b.textContent!==q.target));
 assert.equal(ui.get('enemyCount').textContent,'4 / 4','enemy display before narration');
 assert.equal(ui.get('heroHearts').querySelectorAll('.heart:not(.off)').length,3,'hero display before narration');
 assert.equal(ui.state().battle.enemyHealth,mode==='correct'?3:4,'saved damage is immediate');
 assert.equal(ui.state().battle.heroHealth,mode==='wrong'?2:3);
 if(mode==='shield')assert.ok(ui.get('heroHearts').querySelector('.heldShield'),'shield remains until impact');
 ui.finishSpeech();
 if(mode==='shield'){
  assert.equal(ui.get('combatEffects').className,'combatEffects','shield prefix must finish before correction and impact');
  assert.ok(ui.get('heroHearts').querySelector('.heldShield'),'shield remains during correction narration');
  ui.finishSpeech();
 }
 ui.elapse(500);
 assert.equal(ui.get('enemyCount').textContent,'4 / 4');assert.equal(ui.get('heroHearts').querySelectorAll('.heart:not(.off)').length,3);
 ui.elapse(200);
 assert.equal(ui.get('enemyCount').textContent,(mode==='correct'?3:4)+' / 4');
 assert.equal(ui.get('heroHearts').querySelectorAll('.heart:not(.off)').length,mode==='wrong'?2:3);
 if(mode==='shield')assert.equal(ui.get('heroHearts').querySelector('.heldShield'),null);
 if(['free','supported'].includes(mode))assert.equal(ui.get('combatEffects').className,'combatEffects');
 assert.equal(ui.state().campaign.battleRecords.length,1);
}
console.log('PASS health and shield displays wait through narration and wind-up, then reveal one committed impact; supported/free answers stay safe');
for(const action of ['pauseBtn','homeBtn','reload','reduced']){
 const ui=boot(impactSave(),{heldNarration:true,reducedMotion:action==='reduced'});ui.resume();ui.ready();
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===ui.state().battle.question.target));
 if(action==='reload'){const reloaded=boot(ui.state(),{heldNarration:true});reloaded.resume();assert.equal(reloaded.get('enemyCount').textContent,'3 / 4');assert.equal(reloaded.state().campaign.battleRecords.length,1);continue;}
 ui.finishSpeech();
 if(action==='reduced'){assert.equal(ui.get('enemyCount').textContent,'3 / 4');continue;}
 ui.elapse(200);ui.click(ui.get(action));assert.equal(ui.get('enemyCount').textContent,'3 / 4');ui.elapse(1000);assert.equal(ui.get('combatEffects').className,'combatEffects');assert.equal(ui.state().battle.enemyHealth,3);
}
console.log('PASS cancelled impacts settle committed health on Pause/Home/reload; reduced motion reveals health without waiting for travel');
for(const enemy of Content.enemies){
 const ui=boot(impactSave(enemy.id),{heldNarration:true});ui.resume();ui.ready();
 assert.equal(ui.get('enemyFace').querySelector('.enemyRig').getAttribute('data-family'),enemy.id);
 assert.ok(ui.get('enemyFace').querySelectorAll('.bone').length>=3);
 assert.equal(ui.get('combatEffects').className,'combatEffects');
}
console.log('PASS all 20 painted enemies render as articulated, still characters during word selection');
// A scored hit waits for narration, adds no extra damage, and cancels on Home/pause.
for(const gender of ['boy','girl'])for(const heroClass of ['Mage','Knight','Archer']){
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile={name:'Reader',gender,heroClass,age:7};s.assessment.done=true;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();}
 Core.startBattle(s,now,{strength:4});s.battle.introPending=false;Core.prepareBattle(s,now);s.battle.enemyHealth=1;
 const ui=boot(s,{geometry:true,heldNarration:true});ui.resume();ui.ready();
 assert.equal(ui.get('combatEffects').className,'combatEffects');
 const q=ui.state().battle.question,choice=[...ui.get('battleAnswers').children].find(b=>b.textContent===q.target);
 ui.click(choice);assert.equal(ui.state().battle.enemyHealth,0);assert.equal(ui.get('combatEffects').className,'combatEffects');
 ui.click(choice);assert.equal(ui.state().campaign.battleRecords.length,1);ui.finishSpeech();
 assert.ok(ui.get('combatEffects').classList.contains('heroStrike'));assert.ok(ui.get('combatEffects').classList.contains('pipStrike'));assert.ok(ui.document.querySelector('.battlePip').classList.contains('pipFinisher'));
 assert.equal(!!ui.get('battleHeroImg').querySelector('.staffArm'),heroClass==='Mage');assert.equal(!!ui.get('combatEffects').querySelector('.castBeam'),heroClass==='Mage');
 assert.equal(ui.get('combatEffects').querySelectorAll('.damageNumber').length,1);assert.equal(ui.state().battle.enemyHealth,0);
 ui.click(ui.get('pauseBtn'));assert.equal(ui.get('combatEffects').className,'combatEffects');assert.equal(ui.get('combatEffects').querySelector('.castBeam'),null);assert.ok(!ui.get('battleHeroImg').classList.contains('mageCast'));
 ui.finishSpeech();assert.equal(ui.get('combatEffects').className,'combatEffects');ui.click(ui.get('pauseResume'));ui.finishSpeech();ui.click(ui.get('homeBtn'));assert.equal(ui.get('combatEffects').className,'combatEffects');
 assert.equal(ui.state().campaign.battleRecords.length,1);
}
console.log('PASS all six heroes: answer/narration lock, staff beam, Pip final blow, one damage, pause and Home cancellation');
{
 const context={window:{},BlitzCore:Core,BlitzContent:Content};vm.runInNewContext(fs.readFileSync(root+'tests/review-scenarios.js','utf8'),context);
 const html=fs.readFileSync(root+'tests/visual-review.html','utf8'),scenarios=[...html.matchAll(/<option value="([^"]+)"/g)].map(x=>x[1]);
 for(const scene of scenarios)assert.ok(context.window.makeReviewSave(scene),'Fixture '+scene);
 assert.equal(Core.currentChapter(context.window.makeReviewSave('map-chapter-2')).name,'River Path');
 console.log('PASS every isolated visual-review fixture, including River Path and class attack previews');
}
function mathSave(best=8){
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.math.best=best;
 for(let i=0;i<3;i++){Core.startBattle(s,Date.UTC(2026,8,22),{strength:3});s.battle.enemyHealth=0;Core.resolveBattle(s,Date.UTC(2026,8,22));}return s;
}
{
 let ui=boot(mathSave());ui.resume();assert.ok(ui.get('mathIntro').classList.contains('active'));assert.equal(ui.get('mathRevivedEnemy').dataset.enemy,ui.state().battle.enemyId);assert.equal(ui.get('mathIntroTarget').textContent,'6');assert.equal(ui.get('mathIntroGoal').getAttribute('aria-label'),'Goal: 6 points');
 ui.advance(60000);assert.equal(Core.parentProgress(ui.state()).activeMs,0);ui.click(ui.get('mathStart'));assert.equal(ui.get('mathTime').textContent,'60s');
 const choose=value=>ui.click(ui.get('mathAnswers').querySelector('[data-value="'+value+'"]'));assert.equal(ui.get('mathKeys'),null);assert.equal(ui.get('mathAnswers').children.length,4);
 ui.advance(4000);const choices=ui.state().math.round.question.options;const problem=ui.state().math.round.question.id;ui.click(ui.get('homeBtn'));const remaining=ui.state().math.round.elapsedMs;
 ui.advance(60000);ui=boot(ui.state());ui.resume();assert.equal(ui.state().math.round.question.id,problem);assert.equal(ui.get('mathInput').textContent,'?');assert.deepEqual(ui.state().math.round.question.options,choices);assert.equal(ui.state().math.round.elapsedMs,remaining);
 const q=ui.state().math.round.question;choose(q.a*q.b);assert.equal(ui.get('mathFeedback').textContent,'+1');assert.equal(ui.state().dragon.xp,1);ui.tick();
 ui.advance(3000);const credited=Core.parentProgress(ui.state()).activeMs;ui.visibility(true);assert.equal(ui.get('pausePanel').hidden,false);const elapsed=ui.state().math.round.elapsedMs;ui.advance(120000,true);ui.visibility(false);ui.click(ui.get('pauseResume'));assert.equal(ui.state().math.round.elapsedMs,elapsed);assert.equal(Core.parentProgress(ui.state()).activeMs,credited);
 ui.advance(30000);assert.equal(ui.get('pausePanel').hidden,false);assert.equal(Core.parentProgress(ui.state()).activeMs,credited);ui.click(ui.get('pauseResume'));
 for(let i=0;i<65&&ui.state().math.round.status==='playing';i++){ui.advance(1000);if(ui.state().math.round.status==='playing'){const q=ui.state().math.round.question;if(q.phase==='answer')choose(q.options.find(n=>n!==q.a*q.b));if(ui.state().math.round.status==='playing')ui.tick();}}
 assert.ok(ui.get('mathResult').classList.contains('active'));assert.equal(ui.state().math.round.elapsedMs,60000);assert.equal(ui.state().math.records.length,1);assert.equal(ui.state().math.best,8);assert.equal(ui.state().result.victory,true);assert.equal(ui.state().math.round.correct,1);
 const p=Core.parentProgress(ui.state());assert.equal(p.totals.practice,0);assert.equal(p.activeMs,p.totals.math);assert.ok(p.totals.math>4000&&p.totals.math<60000);ui=boot(ui.state());ui.resume();assert.ok(ui.get('mathResult').classList.contains('active'));assert.equal(ui.state().math.records.length,1);ui.click(ui.get('mathContinue'));assert.ok(ui.get('result').classList.contains('active'));assert.equal(ui.state().math.round,null);
 console.log('PASS multiplication choices, exact saved resume, idle/background pause, deadline, PR and separate parent time');
}
{
 const ui=boot(mathSave(null));ui.resume();ui.click(ui.get('mathSkip'));assert.equal(ui.state().math.round,null);assert.equal(ui.state().math.best,null);assert.equal(ui.state().campaign.wins,3);assert.ok(ui.get('result').classList.contains('active'));
 console.log('PASS first multiplication record invitation can be skipped without losing reading victory');
}
for(const mode of ['win','lose','help']){
 let ui=boot();ui.get('nameInput').value='Éva';ui.click(ui.get('setupNext'));ui.click(ui.get('heroNext'));ui.click(ui.get('tryBattle'));
 assert.equal(ui.state().activity,'teaching');assert.equal(ui.get('teachContinue').disabled,false);ui.click(ui.get('teachContinue'));
 for(let turns=0;turns<20&&ui.state().activity==='battle';turns++){
  ui.ready();const q=ui.state().battle.question;assert.equal(ui.get('battleAnswers').children.length,4);assert.equal(ui.get('battleUnsure').hidden,false);
  if(mode==='help'&&turns<8)ui.click(ui.get('battleUnsure'));else ui.click([...ui.get('battleAnswers').children].find(b=>mode==='win'||mode==='help'?b.textContent===q.target:b.textContent!==q.target));
  if(!ui.state().battle.question.correct){
   assert.equal(ui.state().activity,'battle');assert.equal(ui.state().battle.question.phase,'correction');
   assert.equal(ui.get('battleScroll').querySelector('.correctWord span').textContent,q.target);
   const chosen=ui.state().campaign.battleRecords.at(-1).firstResponse;
   if(chosen!=='?')assert.equal(ui.get('battleScroll').querySelector('.selectedWord span').textContent,chosen);
   ui.click(ui.get('battleAnswers').querySelector('.correctionNext'));assert.equal(ui.state().activity,'teaching');ui.click(ui.get('teachContinue'));
  }else ui.until(()=>ui.state().activity!=='battle'||ui.state().battle.question.id!==q.id);
 }
 assert.equal(ui.state().activity,'handoff',mode);
 ui=boot(ui.state());ui.resume();assert.equal(ui.get('handoff').classList.contains('active'),true);ui.click(ui.get('handoffNext'));
 assert.equal(ui.get('assessmentIntro').hidden,false);ui.click(ui.get('assessmentStart'));
 for(let i=0;i<8;i++){ui.until(()=>ui.state().assessment.progress?.question?.phase==='choices');ui.click(ui.get('assessmentUnsure'));ui.tick();}
 assert.equal(ui.state().assessment.done,true);assert.equal(ui.state().activity,'battle');assert.equal(ui.state().battle.demo,false);
 assert.ok(ui.get('campaignMap').classList.contains('active'));assert.equal(ui.get('mapAreaStatus').textContent,'Reading check complete · Your first chapter');assert.equal(ui.get('mapNodes').children.length,5);ui.resume();assert.equal(ui.state().battle.mapSeen,true);assert.ok(ui.get('battle').classList.contains('active'));
 ui.click(ui.get('pauseBtn'));assert.equal(ui.get('pausePanel').hidden,false);ui.click(ui.get('pauseResume'));assert.equal(ui.get('pausePanel').hidden,true);
 console.log('PASS complete DOM flow:',mode,'→ saved handoff → assessment → campaign → pause/resume');
}

// Returning results and new challenges must preserve the chosen hero and earned wins.
for(const victory of [true,false]){
 const s=Core.migrate(Core.fresh()),now=Date.now();s.profile.name='Éva';s.profile.gender='girl';s.profile.heroClass='Knight';s.assessment.done=true;
 Core.startBattle(s,now,{strength:4});s.battle.enemyHealth=victory?0:4;s.battle.heroHealth=victory?3:0;Core.prepareBattle(s,now);
 const ui=boot(s);ui.resume();assert.ok(ui.get('result').classList.contains('active'));assert.equal(ui.get('opponents').children.length,2);
 assert.equal(ui.get('resultHero').dataset.sprite,'4');const wins=ui.state().campaign.wins;
 ui.click(ui.get('resultNext'));assert.ok(ui.get('campaignMap').classList.contains('active'));ui.resume();assert.equal(ui.state().campaign.wins,wins);
 const cards=[...ui.get('opponents').children];assert.ok(cards.every(card=>card.querySelector('.creatureName').textContent===Content.enemyAt(card.dataset.enemy).name));assert.deepEqual(cards.map(card=>card.querySelector('.opponentName').textContent.trim()),victory?['= Same','↑ Stronger']:['↓ Easier','= Same']);const chosenCard=cards[victory?1:0];const chosen=chosenCard.dataset.enemy;ui.click(chosenCard);assert.equal(ui.state().battle.maxHealth,victory?5:3);assert.equal(ui.state().campaign.wins,wins);assert.equal(ui.state().battle.enemyId,chosen);ui.click(ui.get('encounterStart'));
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseFinish'));assert.ok(ui.get('summary').classList.contains('active'));assert.ok(ui.state().session.completedAt);
 const oldSession=ui.state().session.id;ui.click(ui.get('anotherChallenge'));assert.notEqual(ui.state().session.id,oldSession);assert.ok(ui.get('battle').classList.contains('active'));
 console.log('PASS returning',victory?'victory':'retry','→ chosen strength → finish → summary → new challenge');
}
{
 const ui=boot(null,{failWrites:true});assert.equal(ui.get('saveNotice').hidden,false);ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('saveNotice').hidden,true);assert.ok(ui.get('setup').classList.contains('active'));assert.equal(ui.get('pausePanel').hidden,true);
 ui.get('nameInput').value='Éva';ui.click(ui.get('setupNext'));ui.click(ui.get('backBtn'));assert.ok(ui.get('setup').classList.contains('active'));assert.equal(ui.get('nameInput').value,'Éva');
 ui.click(ui.get('setupNext'));ui.click(ui.get('heroNext'));ui.setFailWrites(true);ui.click(ui.get('tryBattle'));assert.equal(ui.get('saveNotice').hidden,false);ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('continueAdventure').hidden,false);ui.resume();assert.ok(ui.get('teaching').classList.contains('active'));
 ui.click(ui.get('teachContinue'));ui.ready();const question=ui.state().battle.question;ui.setFailWrites(true);ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===question.target));assert.equal(ui.get('saveNotice').hidden,false);ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('pausePanel').hidden,false);ui.click(ui.get('pauseResume'));ui.until(()=>ui.state().battle.question.id!==question.id);assert.equal(ui.state().campaign.battleRecords.filter(r=>r.id===question.id).length,1);
 console.log('PASS save recovery at setup, route and committed answer; no duplicate answer');
}

// Home is a pause, including midway through a correction; returning never re-scores it.
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.now());
 let ui=boot(s);ui.resume();assert.equal(ui.get('encounterIntro').hidden,false);
 ui.click(ui.get('homeBtn'));ui=boot(ui.state());ui.resume();assert.equal(ui.get('encounterIntro').hidden,false);
 ui.ready();const q=ui.state().battle.question;const order=[...q.options];
 ui.click(ui.get('homeBtn'));assert.ok(ui.get('campaignMap').classList.contains('active'));ui.resume();
 assert.equal(ui.state().battle.question.id,q.id);assert.deepEqual(ui.state().battle.question.options,order);assert.equal(ui.state().battle.question.phase,'choices');
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));const health=ui.state().battle.heroHealth;
 assert.equal(ui.get('combatEffects').classList.contains('enemyStrike'),true);
 ui.click(ui.get('homeBtn'));ui=boot(ui.state());ui.resume();
 assert.equal(ui.state().activity,'battle');assert.equal(ui.state().battle.heroHealth,health);assert.equal(ui.state().campaign.battleRecords.length,1);
 assert.equal(ui.get('battleScroll').querySelector('.correctWord span').textContent,q.target);
 assert.equal(ui.get('combatEffects').className,'combatEffects');
 ui.click(ui.get('battleAnswers').querySelector('.correctionNext'));assert.equal(ui.state().learning.teaching.length,1);
 ui.click(ui.get('homeBtn'));ui.resume();assert.equal(ui.state().learning.teaching.length,1);
 ui.click(ui.get('teachContinue'));ui.ready();assert.equal(ui.get('combatEffects').className,'combatEffects');assert.equal(ui.state().battle.heroHealth,health);
 console.log('PASS Home and reload at encounter, choices, correction and teaching; no duplicate damage or teaching');
}

// Map previews cannot start unavailable content; growth updates and resumes the saved battle.
{
 let s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 s.dragon.xp=2997;s.timing.firstPracticeAt='2000-01-01T00:00:00.000Z';s.timing.days={};s=Core.migrate(s);Core.startBattle(s,Date.now());
 let ui=boot(s);assert.ok(ui.get('campaignMap').classList.contains('active'));assert.equal(ui.get('dragonXP').textContent,'2997 XP');assert.equal(ui.get('dragonNext').textContent,'Growing together');assert.equal(ui.get('dragonStages').children.length,4);
 const id=ui.state().battle.id;ui.click(ui.get('mapNodes').querySelector('[data-area="hidden-nest"]'));
 assert.equal(ui.get('mapAreaTitle').textContent,'Home');assert.equal(ui.get('mapContinue').disabled,true);assert.equal(ui.state().battle.id,id);assert.equal(ui.get('mapAreaStatus').textContent,'Further along the trail');
 ui.click(ui.get('mapNodes').querySelector('[data-area="lantern-trail"]'));ui.resume();ui.ready();assert.equal(ui.state().battle.question.target,'on');
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent==='on'));assert.equal(ui.get('xpReward').textContent,'Pip is glowing!');assert.equal(ui.document.querySelector('.battlePip').dataset.growth,'0');
 ui.click(ui.get('homeBtn'));ui=boot(ui.state());assert.equal(ui.get('dragonXP').textContent,'3000 XP');assert.equal(ui.get('dragonStage').textContent,'Big Pip');assert.equal(ui.get('dragonNext').textContent,'Growing together');assert.equal(ui.get('mapPip').dataset.growth,'0');
 const answers=ui.state().campaign.battleRecords.length;ui.resume();ui.until(()=>ui.state().battle.question.target!=='on');assert.equal(ui.state().campaign.battleRecords.length,answers);
 ui.click(ui.get('homeBtn'));ui.click(ui.get('mapSettings'));ui.click(ui.get('heroGrid').children[1]);ui.click(ui.get('heroNext'));assert.ok(ui.get('campaignMap').classList.contains('active'));assert.equal(ui.state().profile.heroClass,'Knight');assert.equal(ui.get('dragonXP').textContent,'3000 XP');
 console.log('PASS map future previews, XP stage unlock, reload, exact resume and hero change');
}

// Idle, suspension and parent reporting use the actual controller and timer callbacks.
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=98;Core.startBattle(s,Date.now());
 const ui=boot(s);assert.ok(Math.abs(parseFloat(ui.get('dragonProgress').querySelector('span').style.width)-100*98/3000)<.001);
 ui.click(ui.get('dragonPanel'));assert.equal(ui.get('growthPanel').hidden,false);assert.match(ui.get('growthMeters').textContent,/98 \/ 3000/);assert.doesNotMatch(ui.get('growthMeters').textContent,/Days|Minutes/);ui.click(ui.get('growthClose'));
 assert.equal(ui.get('growthPanel').hidden,true);
 console.log('PASS Pip tap shows XP-only growth without day or minute gates');
}
{
 let s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 for(const word of Content.chapters[0].words){s.learning.words[word].introducedAt=new Date().toISOString();s.learning.words[word].practiceSuccesses=2;}
 s.campaign.wins=10;s.campaign.checkpointWins=10;for(const a of Content.areas.slice(0,5))Object.assign(Core.chapterState(s,a.id),{wins:3,duels:1,activeMs:600000});s=Core.migrate(s);Core.startBattle(s,Date.now());s.battle.enemyHealth=0;Core.resolveBattle(s,Date.now());
 const ui=boot(s);assert.equal(ui.get('campaignMap').classList.contains('active'),true);assert.equal(ui.get('chapterCelebration').hidden,false);assert.equal(ui.get('mapTitle').textContent,'River Path');assert.equal(ui.get('chapterScenery').hidden,false);
 ui.resume();assert.equal(ui.state().story.mapPending,false);assert.equal(ui.get('result').classList.contains('active'),true);assert.ok(ui.get('resultGrowthBar'));
 ui.click(ui.get('opponents').children[0]);assert.equal(ui.state().battle.chapterId,'chapter-2');assert.equal(ui.state().story.chapterComplete,true);
 console.log('PASS chapter finale opens the next map, then rewards and the next chapter without resetting progress');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.now());
 let ui=boot(s);ui.resume();ui.ready();const qid=ui.state().battle.question.id;
 ui.advance(30000);assert.equal(ui.get('pausePanel').hidden,false);assert.match(ui.get('pauseReason').textContent,/30 seconds/);assert.equal(Core.parentProgress(ui.state()).activeMs,0);
 ui.click(ui.get('pauseResume'));assert.equal(ui.state().battle.question.id,qid);ui.advance(2000);let q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));assert.equal(Core.parentProgress(ui.state()).activeMs,2000);
 ui.click(ui.get('homeBtn'));ui.advance(60000);assert.equal(Core.parentProgress(ui.state()).activeMs,2000);
 ui.click(ui.get('mapParents'));assert.equal(ui.get('parentGate').hidden,false);ui.get('parentAnswer').value='0';ui.click(ui.get('parentUnlock'));assert.equal(ui.get('parentGate').hidden,false);
 ui.get('parentAnswer').value=String(ui.get('parentQuestion').textContent.match(/\d+/g).map(Number).reduce((a,b)=>a+b,0));ui.click(ui.get('parentUnlock'));
 assert.ok(ui.get('parentDashboard').classList.contains('active'));assert.equal(ui.get('parentTotal').textContent,'0 min 02 sec');assert.equal(ui.get('parentPractice').textContent,'0 min 02 sec');assert.equal(ui.get('parentDays').children.length,1);
 ui.click(ui.get('parentHome'));ui.resume();ui.until(()=>ui.state().battle.question.id!==qid);ui.ready();const before=Core.parentProgress(ui.state()).activeMs;
 ui.advance(3000);ui.visibility(true);assert.equal(ui.get('pausePanel').hidden,false);assert.equal(Core.parentProgress(ui.state()).activeMs,before);
 ui.advance(120000,true);ui.visibility(false);ui.click(ui.get('pauseResume'));ui.ready();ui.advance(120000,true);assert.equal(ui.get('pausePanel').hidden,false);assert.equal(Core.parentProgress(ui.state()).activeMs,before);
 ui=boot(ui.state());assert.equal(Core.parentProgress(ui.state()).activeMs,before);
 console.log('PASS idle auto-pause, background/sleep exclusion, gated parent totals and reload');
}
{
 for(const word of ['water','bird','small','night','magic']){
  const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.now());Core.startTeaching(s,word,'battle',Date.now());
  const ui=boot(s);ui.resume();assert.equal(ui.get('teachAtlas').hasAttribute('hidden'),false);assert.equal(ui.get('teachIllustration').hidden,true);assert.equal(ui.get('teachContinue').disabled,false);assert.equal(ui.get('teachAtlas').getAttribute('aria-label'),Core.byWord[word].alt);assert.equal(ui.get('teachAtlas').getAttribute('viewBox'),Core.byWord[word].crop.join(' '));assert.equal(ui.get('teachAtlas').parentElement.className,'teachArt');ui.click(ui.get('teachContinue'));assert.equal(ui.state().activity,'battle');
 }
 console.log('PASS all four new teaching scenes and return to battle');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.now());
 let ui=boot(s);ui.click(ui.get('mapSpeed'));assert.equal(ui.get('speedPanel').hidden,false);
 assert.equal(ui.get('speedChoices').querySelector('[data-speed="ride"]').disabled,true);const icons=[...ui.get('speedChoices').querySelectorAll('.pacePicture')];assert.equal(icons.length,5);assert.equal(new Set(icons.map(icon=>icon.innerHTML)).size,5);
 ui.click(ui.get('speedChoices').querySelector('[data-speed="run"]'));assert.equal(ui.get('speedPanel').hidden,true);ui=boot(ui.state());ui.resume();ui.ready();
 assert.equal(ui.state().battle.question.exposureMs,950);const question=Core.copy(ui.state().battle.question);
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseSpeed'));ui.click(ui.get('speedChoices').querySelector('[data-speed="crawl"]'));assert.equal(ui.get('speedPanel').hidden,true);
 assert.deepEqual(ui.state().battle.question,question);ui.click(ui.get('pauseResume'));assert.equal(ui.state().battle.question.exposureMs,950);
 ui.click([...ui.get('battleAnswers').children].find(x=>x.textContent===question.target));ui.until(()=>ui.state().battle.question.id!==question.id);
 assert.equal(ui.state().battle.question.exposureMs,null);assert.equal(ui.get('feedback').textContent,'');
 console.log('PASS child speed choices, locked modes, saved exposure and next-word application');
}
{
 const ui=boot(mathSave());ui.resume();ui.click(ui.get('mathStart'));ui.advance(10000);
 assert.equal(ui.get('mathTime').textContent,'50s');assert.ok(Number(ui.get('mathTimeRing').style.strokeDashoffset)>16);
 const q=ui.state().math.round.question;ui.click(ui.get('mathAnswers').querySelector('[data-value="'+q.options.find(n=>n!==q.a*q.b)+'"]'));
 assert.equal(ui.get('mathScore').textContent,'-1');assert.match(ui.get('mathFeedback').textContent,/−1/);assert.equal(ui.state().dragon.xp,0);
 const saved=ui.state();ui.click(ui.get('homeBtn'));const next=boot(saved);next.resume();assert.equal(next.get('mathScore').textContent,'-1');assert.equal(next.get('mathTime').textContent,'50s');
 console.log('PASS visual countdown and negative score survive Home and reload');
}

// Results distinguish loss from a new record and keep the three-heart floor honest.
{
 const s=mathSave(null);Core.startMath(s,Date.now());Core.tickMath(s,60000,Date.now());
 const ui=boot(s);ui.resume();assert.equal(ui.get('mathResultTitle').textContent,'Try again');assert.equal(ui.get('mathResult').dataset.outcome,'lost');assert.equal(ui.get('mathResultScore').textContent,'0');assert.equal(ui.get('mathResultGoal').textContent,'1');assert.match(ui.get('mathResultMessage').textContent,/reading victory and earned XP are safe/);
 const lowest=Core.migrate(Core.fresh());lowest.profile.name='Reader';lowest.assessment.done=true;Core.startBattle(lowest,Date.now(),{strength:3});lowest.battle.heroHealth=0;Core.resolveBattle(lowest,Date.now());
 const retry=boot(lowest);retry.resume();assert.equal(retry.get('opponents').children.length,2);assert.ok([...retry.get('opponents').children].every(card=>card.querySelector('.opponentName').textContent.trim()==='= Same'));
 console.log('PASS compact duel loss feedback, score/goal and minimum-strength retry');
}

{
 const s=mathSave();const ui=boot(s);ui.resume();ui.click(ui.get('mathStart'));const q=ui.state().math.round.question;
 const oldButton=ui.get('mathAnswers').querySelector('[data-value="'+q.a*q.b+'"]');ui.click(oldButton);oldButton.onclick();assert.equal(ui.state().math.round.answers.length,1);ui.tick();oldButton.onclick();assert.equal(ui.state().math.round.answers.length,1);
 ui.click(ui.get('pauseBtn'));const next=ui.state().math.round.question;ui.get('mathAnswers').querySelector('[data-value="'+next.a*next.b+'"]').onclick();assert.equal(ui.state().math.round.answers.length,1);
 console.log('PASS queued old taps, repeated taps and paused multiple-choice answers are ignored');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.rewards.shield=true;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date().toISOString();}
 Core.startBattle(s,Date.now());s.battle.introPending=false;Core.prepareBattle(s,Date.now());
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();assert.equal(ui.get('heroHearts').querySelectorAll('.heldShield').length,1);
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));assert.equal(ui.state().battle.heroHealth,3);assert.equal(ui.state().rewards.shield,false);assert.equal(ui.get('combatEffects').className,'combatEffects');
 assert.equal(ui.speechTexts.at(-1),'Your shield stopped the hit.');ui.finishSpeech();assert.equal(ui.speechTexts.at(-1),'You chose '+ui.state().battle.question.firstResponse+'. The word is '+q.target+'.');assert.equal(ui.get('combatEffects').className,'combatEffects');
 ui.finishSpeech();assert.ok(ui.get('combatEffects').classList.contains('shieldBlock'));assert.equal(ui.get('battleHeroImg').classList.contains('heroHit'),false);ui.click(ui.get('pauseBtn'));assert.equal(ui.get('combatEffects').className,'combatEffects');
 console.log('PASS shield prefix and correction play in sequence before one blocked hit, then cancel on pause');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.now());s.battle.heroHealth=0;Core.resolveBattle(s,Date.now());
 let ui=boot(s);ui.resume();assert.equal(ui.get('defeatScene').hidden,false);assert.equal(ui.state().result.defeatShown,true);ui.click(ui.get('pauseBtn'));assert.equal(ui.get('defeatScene').hidden,true);ui.click(ui.get('pauseResume'));assert.equal(ui.get('defeatScene').hidden,true);
 ui=boot(ui.state());ui.resume();assert.equal(ui.get('defeatScene').hidden,true);assert.equal(ui.get('opponents').children.length,2);
 console.log('PASS defeat reaction cancels on pause and cannot replay after reload');
}
// The bonus becomes visible only after confirmed play, persists through reload and stays static.
{
 const now=Date.UTC(2026,8,22),s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.settings.selfPaced=true;
 s.timing.days[Core.dayKey(now)]={practice:590000,math:0,assessment:0,demo:0,idle:0};Core.startBattle(s,now);s.battle.introPending=false;Core.prepareBattle(s,now);
 let ui=boot(s);assert.equal(ui.get('mapBonus').hidden,true);ui.resume();ui.ready();ui.advance(11000);
 const target=ui.state().battle.question.target;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===target));
 assert.equal(ui.get('xpBonusBadge').hidden,false);assert.equal(ui.get('xpBonusBadge').textContent,'XP ×1.75');assert.equal(ui.state().dragon.xp,25.25);
 ui.click(ui.get('homeBtn'));const xp=ui.state().dragon.xp;ui=boot(ui.state());assert.equal(ui.get('mapBonus').textContent,'XP ×1.75');assert.equal(ui.get('mapBonus').hidden,false);assert.equal(ui.state().dragon.xp,xp);
 console.log('PASS confirmed ten-minute bonus, subtle visible multiplier, fractional XP and reload idempotence');
}
{
 let s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 let ui=boot(s);ui.click(ui.get('dragonPanel'));assert.equal(ui.get('renameDragon').hidden,true);
 s.dragon.xp=3000;ui=boot(s);assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().screen,'evolution');ui.click(ui.get('evolutionNext'));ui.until(()=>ui.state().dragon.evolution.phase==='read');ui.click(ui.get('evolutionNext'));assert.equal(ui.get('dragonNamePanel').hidden,false);ui.get('dragonNameInput').value=' ';ui.click(ui.get('dragonNameSave'));assert.match(ui.get('dragonNameMessage').textContent,/Choose/);
 ui.get('dragonNameInput').value='Ember';ui.click(ui.get('dragonNameSave'));assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().dragon.name,'Ember');assert.equal(ui.get('dragonStage').textContent,'Big Ember');assert.equal(ui.get('dragonTapHint').textContent,'XP · Tap Ember');assert.equal(ui.get('dragonPanel').getAttribute('aria-label'),'See Ember’s growth');assert.equal(ui.get('growthClose').getAttribute('aria-label'),'Close Ember’s growth');
 ui=boot(ui.state());assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().dragon.xp,3000);ui.click(ui.get('dragonPanel'));assert.equal(ui.get('renameDragon').hidden,false);ui.click(ui.get('renameDragon'));ui.click(ui.get('dragonNameLater'));assert.equal(ui.state().dragon.name,'Ember');
 s=ui.state();Core.startBattle(s,Date.UTC(2026,8,22));Core.prepareBattle(s,Date.UTC(2026,8,22));Core.startTeaching(s,'on','battle',Date.UTC(2026,8,22));ui=boot(s);ui.resume();assert.match(ui.get('teachSentence').textContent,/Ember is on the rock/);assert.equal(ui.get('teachSentence').querySelector('.targetWord').textContent,'on');
 console.log('PASS naming locked until evolution, validation, save/reload, later edits and personalized teaching');
}
{
 const now=Date.UTC(2026,8,22),s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);
 Object.assign(Core.chapterState(s,s.battle.areaId),{activeMs:480000,wins:3,duels:1});const ui=boot(s);ui.resume();assert.equal(ui.get('resultMessage').textContent,'One more battle!');ui.click(ui.get('opponents').children[0]);assert.equal(ui.state().battle.areaId,'lantern-trail');assert.equal(ui.state().story.clearedAreas.length,0);
 console.log('PASS eight-minute chapter continues with another enemy and preserves chapter minutes');
}

// Audio settings survive Home/reload without modifying XP, learning or speech defaults.
{
 const ui=boot(mathSave());ui.resume();ui.click(ui.get('mathStart'));ui.click(ui.get('pauseBtn'));
 const panel=ui.get('grownupSettings'),music=panel.querySelector('[data-audio-volume="music"]'),quiet=panel.querySelector('[data-audio-quiet]');
 const xp=ui.state().dragon.xp;music.value='25';music.oninput();music.onchange();quiet.checked=true;quiet.onchange();
 assert.equal(ui.state().settings.audio.music,.25);assert.equal(ui.state().settings.audio.speech,1);assert.equal(ui.state().settings.audio.quiet,true);assert.equal(ui.state().dragon.xp,xp);
 const reloaded=boot(ui.state());reloaded.resume();reloaded.click(reloaded.get('pauseBtn'));
 assert.equal(reloaded.get('grownupSettings').querySelector('[data-audio-volume="music"]').value,'25');assert.equal(reloaded.get('grownupSettings').querySelector('[data-audio-quiet]').checked,true);
 console.log('PASS separate audio controls and quiet preset persist without changing earned XP');
}

function storyChoose(ui,correct=true){const q=ui.state().story.scene.reading;ui.click([...ui.get('storyChoices').children].find(b=>correct?b.dataset.picture===q.match:b.dataset.picture!==q.match));}
function storySave(index=7){
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 s.story.clearedAreas=Content.areas.slice(0,index).map(a=>a.id);s.story.completedChapters=Content.chapters.slice(0,Math.floor(index/5)).map(c=>c.id);
 Core.startBattle(s,Date.UTC(2026,8,22));return s;
}
{
 let ui=boot(storySave(),{heldNarration:true});ui.resume();
 assert.equal(ui.state().activity,'chapterStory');assert.equal(ui.get('pauseBtn').hidden,false);assert.equal(ui.get('storyNext').disabled,true);
 assert.equal(ui.get('storySentence').hidden,true);assert.equal(ui.speechTexts.length,1);const stale=ui.pendingSpeech();
 ui.click(ui.get('pauseBtn'));stale();assert.equal(ui.state().story.scene.introHeard,false);
 ui.click(ui.get('pauseResume'));ui.finishSpeech();assert.equal(ui.get('storyNext').disabled,false);ui.click(ui.get('storyNext'));
 assert.equal(ui.state().story.scene.phase,'read');assert.equal(ui.get('storySentence').hidden,false);assert.equal(ui.speechTexts.length,2);
 const battle=Core.copy(ui.state().battle),xp=ui.state().dragon.xp;
 ui.click(ui.get('storyListen'));assert.equal(ui.state().story.scene.helped,true);assert.equal(ui.get('storyNext').disabled,true);
 ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{heldNarration:true});ui.resume();assert.equal(ui.state().story.scene.phase,'read');assert.equal(ui.speechTexts.length,0);
 assert.deepEqual(ui.state().battle,battle);assert.equal(ui.state().dragon.xp,xp);assert.equal(ui.state().campaign.battleRecords.length,0);
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseFinish'));assert.equal(ui.state().activity,'summary');ui.click(ui.get('anotherChallenge'));assert.equal(ui.state().story.scene.phase,'read');
 storyChoose(ui);ui.click(ui.get('storyNext'));assert.equal(ui.state().activity,'battle');assert.equal(ui.state().story.scene,null);assert.equal(ui.state().story.scenes[battle.areaId].helped,true);
 assert.equal(ui.state().battle.id,battle.id);ui=boot(ui.state());ui.resume();assert.equal(ui.get('chapterStory').classList.contains('active'),false);
 console.log('PASS chapter story narration lock, separate reading, Listen help, Pause, Home, reload and Rest resume without extra scoring');
}
{
 const s=storySave(1);let ui=boot(s,{heldNarration:true});ui.resume();ui.advance(30000);assert.equal(ui.get('pausePanel').hidden,false);assert.equal(ui.state().story.scene.phase,'intro');
 assert.equal(Core.parentProgress(ui.state()).activeMs,0);ui=boot(ui.state(),{heldNarration:true});ui.resume();ui.finishSpeech();ui.click(ui.get('storyNext'));
 ui.advance(30000);assert.equal(ui.get('pausePanel').hidden,false);assert.equal(ui.state().story.scene.phase,'read');assert.equal(Core.parentProgress(ui.state()).activeMs,0);
 ui.click(ui.get('pauseResume'));assert.equal(ui.state().story.scene.phase,'read');
 console.log('PASS story idle pause preserves each phase without time or daily XP credit');
}
{
 const s=storySave(9);s.dragon.xp=3000;s.dragon.named=true;s.dragon.name='Ember';s.dragon.namingPromptSeen=true;
 const ui=boot(s,{heldNarration:true});assert.match(ui.document.querySelector('.mapTerrain').getAttribute('aria-label'),/Campaign 2, River Path map. Chapter 5, River Gate/);
 assert.match(ui.get('mapNodes').children[4].getAttribute('aria-label'),/Chapter 5, River Gate, current/);
 ui.resume();assert.equal(ui.get('storyLocation').textContent,'Campaign 2 · Chapter 5');assert.equal(ui.speechTexts[0],Content.chapterStories[s.battle.areaId].narration);ui.finishSpeech();ui.click(ui.get('storyNext'));assert.equal(ui.get('storySentence').textContent,'Ember is at the gate.');ui.click(ui.get('storyListen'));assert.equal(ui.speechTexts.at(-1),'Ember is at the gate.');ui.finishSpeech();
 storyChoose(ui);ui.click(ui.get('storyNext'));assert.match(ui.get('encounterChapter').querySelector('[role="progressbar"]').getAttribute('aria-label'),/Campaign 2, River Path: 4 of 5 chapters completed. Chapter 5, River Gate/);
 console.log('PASS chosen dragon name in story speech and sentence, and actual campaign/chapter accessibility labels');
}

// Scenery follows saved chapter identity through every entry and return route.
for(let i=0;i<Content.areas.length;i++){
 let ui=boot(storySave(i),{heldNarration:true});ui.resume();const area=Content.areas[i],src=Content.chapterBackgrounds[area.id].src;
 const check=()=>{assert.equal(ui.get('chapterScenery').dataset.area,area.id);assert.ok(ui.get('chapterScenery').style.backgroundImage.includes(src));};
 check();if(i){assert.equal(ui.get('storyLandscape').getAttribute('src'),src);ui.finishSpeech();ui.click(ui.get('storyNext'));}
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseResume'));check();ui.click(ui.get('homeBtn'));
 ui=boot(ui.state(),{heldNarration:true});ui.resume();check();
 if(i){storyChoose(ui);ui.click(ui.get('storyNext'));}check();assert.equal(ui.get('encounterIntro').hidden,false);
 ui.click(ui.get('encounterStart'));check();ui.click(ui.get('homeBtn'));ui=boot(ui.state());ui.resume();check();
}
console.log('PASS all 35 chapter backgrounds at story, encounter, battle, Pause/Home/reload');
{
 // A resolved encounter can belong to the previous campaign after progress advances.
 const s=storySave(4);s.battle.introPending=false;s.story.completedChapters=['chapter-1'];s.story.clearedAreas=Content.areas.slice(0,5).map(a=>a.id);
 const ui=boot(s);ui.resume();assert.equal(ui.get('chapterScenery').dataset.area,'hidden-nest');
 assert.ok(ui.get('chapterScenery').style.backgroundImage.includes('hidden-nest.webp'));
 console.log('PASS saved encounter scenery remains in previous campaign across progress boundary');
}
{
 const s=storySave(30);s.battle.areaId='chapter-2-place-2';s.battle.chapterId='chapter-2';s.battle.introPending=false;
 let ui=boot(s);ui.resume();assert.equal(ui.get('chapterScenery').dataset.area,'chapter-2-place-2');
 ui.click(ui.get('homeBtn'));ui=boot(ui.state());ui.resume();assert.equal(ui.get('chapterScenery').dataset.area,'chapter-2-place-2');
 console.log('PASS resumed completed-chapter visit uses saved area, independent of current campaign');
}
{
 const area='chapter-2-place-3',original=Content.chapterBackgrounds[area];
 try{
  Content.chapterBackgrounds[area]={...original,src:'assets/scenery/missing-review-only.webp'};
  const ui=boot(storySave(7),{heldNarration:true});ui.resume();
  const img=ui.get('storyLandscape');img.onerror();assert.equal(img.src,'assets/forest-clearing.webp');assert.equal(img.onerror,null);
  assert.ok(ui.get('chapterScenery').style.backgroundImage.includes('assets/forest-clearing.webp'));
  ui.finishSpeech();ui.click(ui.get('storyNext'));storyChoose(ui);ui.click(ui.get('storyNext'));assert.equal(ui.get('encounterIntro').hidden,false);
  delete Content.chapterBackgrounds[area];ui.click(ui.get('encounterStart'));
  assert.ok(ui.get('chapterScenery').style.backgroundImage.includes('assets/forest-clearing.webp'));
 }finally{Content.chapterBackgrounds[area]=original;}
 console.log('PASS missing artwork and missing mapping fall back without blocking story or battle');
}
// Point 6 deliberately replaces story confirmation with a saved first picture choice.
for(const correct of [true,false]){
 let ui=boot(storySave(3),{heldNarration:true});ui.resume();const oldRead=ui.get('storyNext').onclick;ui.finishSpeech();ui.click(ui.get('storyNext'));
 const initial=ui.state(),order=initial.story.scene.reading.options,choices=[...ui.get('storyChoices').children];
 assert.equal(ui.get('storyNext').hidden,true);oldRead();assert.equal(ui.state().story.scene.phase,'read');
 assert.equal(ui.get('storyPicture').hidden,true);assert.equal(ui.get('storyPrompt').textContent,'Which picture shows what you read?');
 assert.equal(choices.length,2);assert.deepEqual(choices.map(b=>b.dataset.picture),order);assert.ok(choices.every(b=>!b.getAttribute('aria-label').includes('Matching')));
 assert.equal(ui.speechTexts.length,1,'sentence does not play automatically');
 for(const button of choices){const svg=button.querySelector('svg'),rect=svg.querySelector('clipPath rect');assert.equal(svg.getAttribute('viewBox'),['x','y','width','height'].map(k=>rect.getAttribute(k)).join(' '));}
 ui.click(ui.get('storyListen'));assert.equal(ui.state().story.scene.reading.listenedSentence,true);
 const oldChoice=choices.find(b=>correct?b.dataset.picture===initial.story.scene.reading.match:b.dataset.picture!==initial.story.scene.reading.match);
 oldChoice.onclick();assert.equal(ui.state().story.scene.phase,'read','choices stay locked during speech');ui.finishSpeech();ui.click(oldChoice);oldChoice.onclick();
 const result=ui.state().story.scenes[initial.battle.areaId];assert.equal(result.correct,correct);assert.equal(ui.state().story.scene.phase,'feedback');
 assert.equal(ui.get('storyChoices').querySelectorAll('.storyChoiceMatch').length,1);assert.equal(ui.get('storyChoices').querySelector('.storyChoiceMatch').dataset.picture,initial.story.scene.reading.match);
 assert.equal(ui.get('storyListen').hidden,true);assert.ok([...ui.get('storyChoices').children].every(b=>b.disabled));assert.equal(ui.state().campaign.battleRecords.length,0);
 assert.equal(ui.state().dragon.xp,initial.dragon.xp);assert.deepEqual(ui.state().battle,initial.battle);
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseResume'));assert.deepEqual(ui.state().story.scenes[initial.battle.areaId],result);
 ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{heldNarration:true});ui.resume();assert.equal(ui.state().story.scene.phase,'feedback');assert.deepEqual(ui.state().story.scene.reading.options,order);
 const next=ui.get('storyNext').onclick;ui.click(ui.get('storyNext'));next();assert.equal(ui.state().story.scene,null);assert.equal(ui.state().battle.id,initial.battle.id);assert.equal(ui.get('encounterIntro').hidden,false);
 ui.click(ui.get('homeBtn'));openParents(ui);assert.match(ui.get('parentStorySummary').textContent,new RegExp((correct?'1':'0')+' / 1 first choices matched'));
 assert.equal(ui.get('parentStories').children.length,1);assert.match(ui.get('parentStories').textContent,/Sentence/);assert.match(ui.get('parentStories').textContent,correct?/Matched/:/Other picture/);
 assert.equal(Core.parentProgress(ui.state()).activeMs,0);
 console.log('PASS story picture '+(correct?'match':'miss')+': saved first choice, reveal, stale taps, Pause/Home/reopen and parent record without credit');
}
for(const [index,word] of [[1,'jump'],[3,'the'],[4,'look']]){
 let ui=boot(storySave(index),{heldNarration:true});ui.resume();ui.finishSpeech();ui.click(ui.get('storyNext'));
 const hear=ui.get('storySentence').querySelector('.storyHearWord');assert.ok(hear);assert.equal(hear.textContent.toLowerCase(),word);
 ui.click(hear);assert.equal(ui.speechTexts.at(-1),word);assert.deepEqual(ui.state().story.scene.reading.listenedWords,[word]);assert.equal(ui.state().story.scene.reading.listenedSentence,false);
 ui.finishSpeech();ui.click(hear);const stale=ui.pendingSpeech();ui.click(ui.get('homeBtn'));stale();hear.onclick();
 ui=boot(ui.state(),{heldNarration:true});ui.resume();assert.equal(ui.speechTexts.length,0);assert.deepEqual(ui.state().story.scene.reading.listenedWords,[word]);
 storyChoose(ui);ui.click(ui.get('storyNext'));assert.deepEqual(ui.state().story.scenes[Content.areas[index].id].listenedWords,[word]);
 assert.equal(ui.state().learning.teaching.length,0);assert.equal(ui.state().campaign.battleRecords.length,0);
}
console.log('PASS all three untaught words speak only on tap, record bounded help, cancel safely and survive reopening');
{
 const ui=boot(storySave(1),{heldNarration:true,pendingImages:true});ui.resume();ui.finishSpeech();ui.click(ui.get('storyNext'));
 assert.ok([...ui.get('storyChoices').children].every(b=>b.disabled));const loaders=[...ui.get('storyChoices').querySelectorAll('img')];
 loaders[0].onerror();loaders[1].onload();assert.equal(ui.state().story.scene.phase,'feedback');assert.equal(ui.state().story.scene.reading.firstChoice,null);
 assert.match(ui.get('storyChoiceFeedback').textContent,/could not load/);assert.equal(ui.get('storyNext').disabled,false);ui.click(ui.get('storyNext'));
 assert.equal(ui.state().activity,'battle');assert.equal(ui.state().story.scenes['fox-crossing'].pictureUnavailable,true);assert.equal(ui.state().story.scenes['fox-crossing'].correct,null);
 console.log('PASS an unavailable picture skips the check without a fabricated wrong answer or blocked battle');
}
{
 const ui=boot(storySave(1),{heldNarration:true,pendingImages:true});ui.resume();ui.finishSpeech();ui.click(ui.get('storyNext'));ui.elapse(8000,true);
 assert.equal(ui.state().story.scene.phase,'feedback');assert.equal(ui.get('storyNext').disabled,false);ui.click(ui.get('storyNext'));
 assert.equal(ui.state().story.scene,null);assert.equal(ui.state().story.scenes['fox-crossing'].firstChoice,null);
 console.log('PASS a stalled picture request times out to Continue without recording an answer');
}

{
 const s=storySave(7);s.story.scenes[s.battle.areaId]={completedAt:new Date(Date.UTC(2026,8,21)).toISOString(),helped:true};
 const ui=boot(s);openParents(ui);assert.match(ui.get('parentStorySummary').textContent,/No picture choices/);assert.match(ui.get('parentStories').textContent,/Earlier confirmation; no picture check/);
 assert.equal(ui.state().story.scenes[s.battle.areaId].correct,undefined);
 console.log('PASS Parents distinguishes historical confirmations from measured picture choices');
}
// Parents can save the whole adventure as a dated file and restore it after checking and confirming.
function openParents(ui){
 ui.click(ui.get(ui.get('campaignMap').classList.contains('active')?'mapParents':'routeParents'));
 ui.get('parentAnswer').value=String(ui.get('parentQuestion').textContent.match(/\d+/g).map(Number).reduce((a,b)=>a+b,0));ui.click(ui.get('parentUnlock'));
 assert.ok(ui.get('parentDashboard').classList.contains('active'));
}
function backupProgress(name,xp,words){
 const s=Core.migrate(Core.fresh());s.profile.name=name;s.assessment.done=true;s.dragon.xp=xp;
 for(const item of Content.words.slice(0,words))s.learning.words[item.w].introducedAt=new Date(Date.UTC(2026,8,21)).toISOString();
 return s;
}
function fakeFiles(ui){
 const made={blobs:[],downloads:[],revoked:[]};
 ui.window.Blob=class{constructor(parts,options){this.text=parts.join('');this.type=options.type;made.blobs.push(this);}};
 ui.window.File=class{constructor(parts,name,options){this.text=parts.join('');this.name=name;this.type=options.type;}};
 ui.window.URL={createObjectURL:blob=>'blob:'+made.blobs.indexOf(blob),revokeObjectURL:url=>made.revoked.push(url)};
 ui.document.addEventListener('click',event=>{if(event.target.tagName==='A')made.downloads.push({name:event.target.getAttribute('download'),href:event.target.getAttribute('href')});});
 return made;
}
{
 const ui=boot(backupProgress('Éva',1234.5,12),{navigator:{maxTouchPoints:0,canShare:()=>true,share(){throw new Error('desktop must download');}}}),made=fakeFiles(ui);
 openParents(ui);assert.equal(ui.get('backupStatus').textContent,'');ui.click(ui.get('backupSave'));
 assert.equal(made.downloads.length,1);const {name,href}=made.downloads[0];
 assert.match(name,/^blitzword-backup-Eva-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);assert.equal(href,'blob:0');assert.equal(made.blobs[0].type,'application/json');
 const data=JSON.parse(made.blobs[0].text);
 assert.equal(data.format,'blitzword-backup');assert.equal(data.version,1);assert.equal(data.build,ui.document.querySelector('meta[name="blitzword-build"]').getAttribute('content'));
 assert.deepEqual(data.state,ui.state());assert.equal(data.state.dragon.xp,1234.5);
 assert.equal(ui.get('backupStatus').textContent,'Backup file downloaded: '+name+'. On iPad, find it in the Files app under Downloads.');
 assert.equal(ui.document.querySelectorAll('a[download]').length,0);ui.until(()=>made.revoked.length===1);assert.deepEqual(made.revoked,['blob:0']);
 console.log('PASS parent backup file downloads the whole save with a dated name when sharing is not used');
}
{
 const shared=[];let outcome='ok';
 const ui=boot(backupProgress('Reader',300,4),{navigator:{maxTouchPoints:5,canShare:data=>data.files?.[0]?.type==='application/json',share(data){if(outcome==='throw')throw new TypeError('unsupported');shared.push(data.files[0]);assert.deepEqual(Object.keys(data),['files']);return {then(ok,fail){if(outcome==='ok')ok();else fail({name:outcome});}};}}}),made=fakeFiles(ui);
 openParents(ui);ui.click(ui.get('backupSave'));
 assert.equal(shared.length,1);assert.equal(made.downloads.length,0);assert.match(shared[0].name,/^blitzword-backup-Reader-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
 assert.deepEqual(JSON.parse(shared[0].text).state,ui.state());
 assert.equal(ui.get('backupStatus').textContent,'Backup file ready: '+shared[0].name+'. Keep it somewhere safe, such as Files or iCloud Drive.');
 outcome='AbortError';ui.click(ui.get('backupSave'));assert.equal(ui.get('backupStatus').textContent,'No backup file was saved.');assert.equal(made.downloads.length,0);
 outcome='NotAllowedError';ui.click(ui.get('backupSave'));assert.equal(made.downloads.length,1);assert.match(ui.get('backupStatus').textContent,/^Backup file downloaded: blitzword-backup-Reader-/);
 outcome='throw';ui.click(ui.get('backupSave'));assert.equal(made.downloads.length,2);assert.match(ui.get('backupStatus').textContent,/^Backup file downloaded: blitzword-backup-Reader-/);
 console.log('PASS touch devices use the share sheet; cancel saves nothing and a share error falls back to download');
}
{
 const madeAt=Date.UTC(2026,8,23,18,5),backup=backupProgress('Éva',2400,40),file=Storage.backupFile(backup,{now:madeAt}).text;
 const asked=[];let answer=false;
 const ui=boot(backupProgress('Reader',300,4),{confirm:message=>{asked.push(message);return answer;}});
 ui.window.FileReader=class{readAsText(file){this.result=file.text;this.onload();}};
 openParents(ui);const before=new Map(ui.memory);
 const choose=(text,size=text.length)=>{ui.click(ui.get('backupRestore'));Object.defineProperty(ui.get('backupFile'),'files',{configurable:true,value:[{name:'backup.json',size,text}]});ui.get('backupFile').onchange();};
 for(const [text,message] of [['not json','This file is not a BlitzWord backup.'],['{}','This file is not a BlitzWord backup.'],[JSON.stringify({format:'blitzword-backup',version:2,state:backup}),'This backup was made by a newer version of BlitzWord.']]){
  choose(text);assert.equal(ui.get('backupStatus').textContent,message+' Nothing was changed.');
 }
 choose(file,Storage.BACKUP_LIMIT+1);assert.equal(ui.get('backupStatus').textContent,'This file is too large to be a BlitzWord backup. Nothing was changed.');
 assert.equal(asked.length,0);assert.deepEqual(ui.memory,before);
 const at=new Date(madeAt),pad=n=>String(n).padStart(2,'0'),stamp=at.getDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][at.getMonth()]+' '+at.getFullYear()+', '+pad(at.getHours())+':'+pad(at.getMinutes());
 choose(file);assert.equal(ui.get('backupStatus').textContent,'Restore cancelled. Nothing was changed.');
 assert.equal(asked[0],'Replace the progress on this device with this backup?\n\nBackup from '+stamp+': Éva · 2400 XP · 40 words introduced · 0 chapters cleared\nThis device now: Reader · 300 XP · 4 words introduced · 0 chapters cleared\n\nA copy of the current progress stays on this device.');
 choose(JSON.stringify(backupProgress('Older',100,2)));assert.equal(asked.length,2);
 assert.match(asked[1],/^Replace the progress on this device with this backup\?\n\nBackup: Older · 100 XP · 2 words introduced · 0 chapters cleared\n.*\n\nThis backup has less progress than this device\.\n\n/);
 assert.deepEqual(ui.memory,before);assert.equal(ui.reloads(),0);
 answer=true;ui.setFailWrites((key,value)=>key===Storage.KEY&&JSON.parse(value).profile.name==='Éva');
 choose(file);assert.equal(ui.get('backupStatus').textContent,'There is not enough space on this device to restore this backup. Nothing was changed.');
 assert.equal(ui.state().profile.name,'Reader');assert.equal(ui.memory.has(Storage.KEY+'_before_restore'),false);assert.equal(ui.get('saveNotice').hidden,true);assert.equal(ui.reloads(),0);
 ui.setFailWrites(false);choose(file);
 const restored=ui.state(),kept=JSON.parse(ui.memory.get(Storage.KEY+'_before_restore'));
 assert.equal(restored.profile.name,'Éva');assert.equal(restored.dragon.xp,2400);assert.equal(Core.parentProgress(restored).introduced,40);assert.deepEqual(restored.learning.words,Core.migrate(backup).learning.words);
 assert.equal(kept.profile.name,'Reader');assert.equal(kept.dragon.xp,300);assert.equal(restored.revision,kept.revision+1);
 assert.equal(ui.reloads(),1);assert.equal(ui.get('backupStatus').textContent,'Backup restored. Reloading…');
 // Nothing can write the replaced progress back before the reload finishes.
 ui.click(ui.get('parentHome'));assert.equal(ui.state().profile.name,'Éva');assert.equal(JSON.parse(ui.memory.get(Storage.KEY+'_before_restore')).profile.name,'Reader');
 const again=boot(ui.state());openParents(again);assert.match(again.get('parentLearning').textContent,/^40 \/ 200 words introduced/);assert.match(again.get('parentGrowth').textContent,/2400 XP/);
 console.log('PASS restore checks the file, asks the parent, keeps the current save, survives a full device and reloads into the backup');
}
{
 const ui=boot(backupProgress('Reader',300,4),{confirm:()=>true});ui.window.FileReader=class{readAsText(file){this.result=file.text;this.onload();}};openParents(ui);
 const other=ui.state();other.profile.name='Other tab';ui.memory.set(Storage.KEY,JSON.stringify(other));
 ui.click(ui.get('backupRestore'));Object.defineProperty(ui.get('backupFile'),'files',{configurable:true,value:[{name:'backup.json',size:1,text:Storage.backupFile(backupProgress('Éva',2400,40)).text}]});ui.get('backupFile').onchange();
 assert.equal(ui.get('saveNotice').hidden,false);assert.match(ui.get('saveMessage').textContent,/Another tab updated this adventure/);
 assert.equal(ui.state().profile.name,'Other tab');assert.equal(ui.memory.has(Storage.KEY+'_before_restore'),false);assert.equal(ui.reloads(),0);
 console.log('PASS restore never overwrites progress another tab saved');
}
{
 const ui=boot(backupProgress('Reader',10,1),{confirm:()=>true});
 for(const suffix of ['_backup','_legacy_backup','_unreadable_backup','_before_restore'])ui.memory.set(Storage.KEY+suffix,'{}');
 ui.click(ui.get('resetBtn'));
 for(const suffix of ['','_backup','_legacy_backup','_unreadable_backup','_before_restore'])assert.equal(ui.memory.has(Storage.KEY+suffix),false,suffix);
 assert.equal(ui.reloads(),1);
 console.log('PASS Reset this device also erases the copy kept by a restore');
}
{
 // A failed save keeps the newest progress in memory only; the grown-up dialog can still export it.
 const ui=boot(backupProgress('Reader',300,4),{navigator:{maxTouchPoints:0}}),made=fakeFiles(ui);
 assert.equal(ui.get('saveNoticeBackup').hidden,true);assert.equal(ui.state().settings.soundscape,true);
 ui.setFailWrites(true);ui.click(ui.get('soundBtn'));
 assert.equal(ui.get('saveNotice').hidden,false);assert.equal(ui.get('saveNoticeBackup').hidden,false);assert.equal(ui.get('saveNoticeStatus').textContent,'');
 ui.click(ui.get('saveNoticeBackup'));assert.equal(made.downloads.length,1);
 const data=JSON.parse(made.blobs[0].text);assert.equal(data.state.settings.soundscape,false);assert.equal(ui.state().settings.soundscape,true);assert.equal(data.state.profile.name,'Reader');
 assert.equal(ui.get('saveNoticeStatus').textContent,'Backup file downloaded: '+made.downloads[0].name+'. On iPad, find it in the Files app under Downloads.');
 ui.setFailWrites(false);ui.click(ui.get('retrySave'));assert.equal(ui.get('saveNotice').hidden,true);assert.equal(ui.state().settings.soundscape,false);
 // Another tab's newer save is a conflict, not a storage failure: this tab's older progress is not offered as a file.
 const other=boot(backupProgress('Reader',300,4)),changed=other.state();changed.profile.name='Other tab';other.memory.set(Storage.KEY,JSON.stringify(changed));
 other.click(other.get('soundBtn'));assert.equal(other.get('saveNotice').hidden,false);assert.match(other.get('saveMessage').textContent,/Another tab/);assert.equal(other.get('saveNoticeBackup').hidden,true);
 console.log('PASS save-problem dialog offers a backup file of unsaved progress, but not for another tab\'s conflict');
}
{
 // Selection may start on a text node. Parents text and inputs stay selectable; child screens do not; no handler throws.
 const ui=boot(backupProgress('Reader',300,4));openParents(ui);
 const select=node=>{const event=new ui.window.Event('selectstart',{bubbles:true,cancelable:true});node.dispatchEvent(event);return event.defaultPrevented;};
 const menu=node=>{const event=new ui.window.Event('contextmenu',{bubbles:true,cancelable:true});node.dispatchEvent(event);return event.defaultPrevented;};
 const parentText=ui.get('parentDashboard').querySelector('.parentInfo p').firstChild,childText=ui.get('saveTitle').firstChild;
 assert.equal(parentText.nodeType,3);assert.equal(childText.nodeType,3);
 assert.equal(select(parentText),false);assert.equal(select(childText),true);assert.equal(select(ui.get('parentAnswer')),false);assert.equal(select(ui.document),true);
 assert.equal(menu(ui.get('backupSave')),false);assert.equal(menu(ui.get('mapParents')),true);
 console.log('PASS text selection stays possible in Parents and inputs, is blocked on child screens, and text-node targets raise no error');
}
{
 // Point 1a: while playing, the tick saves the time ledger every ten seconds; answers and pauses save at once.
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.UTC(2026,8,22));s.battle.introPending=false;
 const ui=boot(s);ui.resume();ui.ready();
 const saves=[];let revision=ui.state().revision;
 for(let second=1;second<=21;second++){ui.advance(1000);const now=ui.state().revision;if(now!==revision)saves.push(second);revision=now;}
 assert.ok(saves.length>=2,'saves: '+saves);for(let i=1;i<saves.length;i++)assert.equal(saves[i]-saves[i-1],10,'saves: '+saves);
 assert.equal(ui.get('pausePanel').hidden,true);
 const q=ui.state().battle.question,before=ui.state().revision;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));
 assert.ok(ui.state().revision>before);assert.equal(ui.state().campaign.battleRecords.at(-1).id,q.id);
 const paused=ui.state().revision;ui.click(ui.get('pauseBtn'));assert.equal(ui.get('pausePanel').hidden,false);assert.ok(ui.state().revision>paused);
 console.log('PASS play ticks save at most every ten seconds; answers and pause save at once');
}
for(const archived of [0,1]){
 // Pip's alternating assist counts every answer, including those rolled into the archive.
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile={name:'Reader',gender:'girl',heroClass:'Mage',age:7};s.assessment.done=true;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();}
 s.archive.answers.records=archived;Core.startBattle(s,now,{strength:4});s.battle.introPending=false;Core.prepareBattle(s,now);s.battle.enemyHealth=4;
 const ui=boot(s,{geometry:true,heldNarration:true});ui.resume();ui.ready();
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));ui.finishSpeech();
 assert.equal(Core.answerCount(ui.state()),archived+1);assert.equal(ui.get('combatEffects').classList.contains('pipStrike'),archived===1);
 console.log('PASS Pip assist parity uses all answers with',archived,'archived');
}

for(const stage of [1,2,3]){
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 s.dragon.xp=Content.dragonStages[stage].xp;s.dragon.stage=stage;s.dragon.evolutionSeen=stage-1;
 s.dragon.name='Ember';s.dragon.named=stage>1;
 let ui=boot(s,{heldNarration:true});assert.equal(ui.state().screen,'evolution');assert.match(ui.get('evolutionTitle').textContent,/Ember/);
 assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.speechTexts.at(-1),Content.evolution.intro);
 const xp=ui.state().dragon.xp,learning=JSON.stringify(ui.state().learning);
 ui.click(ui.get('evolutionNext'));assert.equal(ui.state().dragon.evolution.phase,'charge');assert.equal(ui.pendingSpeech(),null);
 ui.visibility(true);assert.equal(ui.get('pausePanel').hidden,false);ui.advance(90000,true);assert.equal(ui.state().dragon.evolution.phase,'charge');
 ui.visibility(false);ui.click(ui.get('pauseResume'));ui.tick();assert.equal(ui.state().dragon.evolution.phase,'reveal');
 ui.click(ui.get('homeBtn'));assert.equal(ui.state().screen,'campaignMap');assert.equal(ui.state().dragon.evolution.phase,'reveal');
 ui=boot(ui.state(),{heldNarration:true});if(ui.state().screen!=='evolution')ui.resume();assert.equal(ui.state().screen,'evolution');ui.tick();assert.equal(ui.state().dragon.evolution.phase,'read');
 assert.equal(ui.get('evolutionLines').textContent,Content.evolution.lines[stage].join(''));assert.equal(ui.pendingSpeech(),null);
 ui.advance(120000);assert.equal(ui.state().screen,'evolution');assert.equal(ui.state().dragon.evolution.phase,'read');
 ui.click(ui.get('evolutionListen'));assert.equal(ui.speechTexts.at(-1),Content.evolution.lines[stage].join(' '));
 ui.click(ui.get('evolutionNext'));assert.equal(ui.pendingSpeech(),null);assert.equal(ui.state().dragon.evolution,null);assert.equal(ui.state().dragon.evolutionSeen,stage);
 assert.equal(ui.state().dragon.xp,xp);assert.equal(JSON.stringify(ui.state().learning),learning);assert.equal(Core.parentProgress(ui.state()).activeMs,0);
 if(stage===1){assert.equal(ui.get('dragonNamePanel').hidden,false);ui.click(ui.get('dragonNameLater'));}
 ui.click(ui.get('dragonPanel'));ui.click(ui.get('evolutionReplay'));assert.equal(ui.state().screen,'evolution');
 ui.click(ui.get('evolutionNext'));ui.click(ui.get('evolutionSkip'));assert.equal(ui.state().dragon.evolution.phase,'read');ui.click(ui.get('evolutionNext'));
 assert.equal(ui.state().dragon.xp,xp);assert.equal(ui.state().dragon.evolutionSeen,stage);
 console.log('PASS evolution '+stage+': narration, pause/background, Home/reload, untimed reading, naming and replay without rewards');
}
{
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=3000;
 Core.startBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);
 const ui=boot(s);assert.equal(ui.state().screen,'evolution');ui.click(ui.get('evolutionNext'));ui.click(ui.get('evolutionSkip'));
 const img=ui.get('evolutionAfter').querySelector('img');img.onerror();assert.equal(img.hidden,true);assert.equal(ui.get('evolutionAfter').querySelector('.evolutionFallback').hidden,false);
 ui.click(ui.get('evolutionNext'));ui.click(ui.get('dragonNameLater'));assert.equal(ui.state().dragon.evolution,null);
 ui.resume();assert.equal(ui.state().screen,'result');assert.equal(ui.state().campaign.wins,1);
 console.log('PASS evolution returns to saved battle result and missing image does not block reading');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=3000;
 const ui=boot(s,{reducedMotion:true});ui.click(ui.get('evolutionNext'));ui.tick();
 assert.equal(ui.state().dragon.evolution.phase,'read');assert.ok(ui.get('evolution').classList.contains('still'));
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseFinish'));assert.equal(ui.state().screen,'campaignMap');
 assert.equal(ui.state().dragon.evolution.phase,'read');ui.resume();assert.equal(ui.state().dragon.evolution.phase,'read');
 console.log('PASS reduced motion skips transformation movement; Rest preserves the reading scene');
}
{
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=2999;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();}
 Core.startBattle(s,now,{strength:4});s.battle.introPending=false;Core.prepareBattle(s,now);s.battle.enemyHealth=1;
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));assert.equal(ui.state().dragon.stage,1);
 assert.equal(ui.state().screen,'battle');assert.equal(ui.document.querySelector('.battlePip').dataset.growth,'0');
 ui.finishSpeech();ui.until(()=>ui.state().screen==='evolution');assert.equal(ui.state().battle.resolved,true);
 ui.click(ui.get('evolutionNext'));ui.click(ui.get('evolutionSkip'));ui.click(ui.get('evolutionNext'));
 assert.equal(ui.state().screen,'result');assert.equal(ui.state().campaign.wins,1);
 console.log('PASS XP-crossing final answer finishes narration and combat before evolution, then returns to its result');
}
