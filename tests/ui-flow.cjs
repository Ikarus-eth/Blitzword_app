const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'../'),Core=require(root+'game-core'),Content=require(root+'content'),Storage=require(root+'storage'),Audio=require(root+'audio');
function boot(saved,options={}){
 const {window,document}=parseHTML(fs.readFileSync(root+'index.html','utf8'));
 let now=Date.UTC(2026,8,22),uid=0;const jobs=new Map(),memory=new Map(saved?[[Storage.KEY,JSON.stringify(saved)]]:[]);
 let failWrites=!!options.failWrites,heartbeat=()=>{};
 const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>{if(failWrites)throw new Error('Storage full');memory.set(k,v)},removeItem:k=>memory.delete(k)};
 const schedule=(fn,ms)=>(jobs.set(++uid,{fn,time:now+ms}),uid);
 window.localStorage=storage;
 if(options.geometry)window.HTMLElement.prototype.getBoundingClientRect=function(){const r=this.id==='battleHeroImg'?[30,230,270,410]:this.id==='enemyFace'?[680,330,290,290]:this.classList.contains('battlePip')?[280,420,180,190]:[0,0,1024,768];return {left:r[0],top:r[1],width:r[2],height:r[3],right:r[0]+r[2],bottom:r[1]+r[3]};};
 Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get(){return this.querySelector('option[selected]')?.value||this.firstElementChild?.value||''},set(value){for(const option of this.querySelectorAll('option'))option.selected=option.value===value;}});
 Object.defineProperty(window.HTMLImageElement.prototype,'complete',{get:()=>true,configurable:true});Object.defineProperty(window.HTMLImageElement.prototype,'naturalWidth',{get:()=>1536,configurable:true});
 let speechEnd=null;
 const ctx={window,document,BlitzCore:Core,BlitzContent:Content,BlitzStorage:Storage,BlitzSound:require(root+'soundscape'),BlitzEngagement:require(root+'engagement'),BlitzAudio:{...Audio,narrator:opts=>options.heldNarration?{speak(text,callbacks){speechEnd=callbacks.onEnd;},cancel(){speechEnd=null;}}:Audio.narrator({...opts,schedule,unschedule:id=>jobs.delete(id)})},performance:{now:()=>now},Date:class extends Date{static now(){return now}},setTimeout:schedule,clearTimeout:id=>jobs.delete(id),setInterval(fn){heartbeat=fn;},location:{reload(){}},confirm:()=>false,Option:function(t,v){const el=document.createElement('option');el.textContent=t;el.value=v;return el;}};
 vm.runInNewContext(fs.readFileSync(root+'app.js','utf8'),ctx);
 const state=()=>JSON.parse(memory.get(Storage.KEY)),get=id=>document.getElementById(id);
 function click(el){assert.ok(el,'missing element');assert.ok(!el.disabled,'disabled control');assert.ok(!el.hidden,'hidden control');el.onclick?.({});}
 function tick(){const next=[...jobs.entries()].sort((a,b)=>a[1].time-b[1].time)[0];assert.ok(next,'no scheduled progress');jobs.delete(next[0]);now=next[1].time;next[1].fn();}
 function until(predicate){for(let i=0;i<25&&!predicate();i++)tick();assert.ok(predicate(),'progress stalled');}
 function ready(){if(state().battle?.introPending)click(get('encounterStart'));until(()=>state().battle?.question?.phase==='choices'||state().assessment.progress?.question?.phase==='choices'||!get('wordReady').hidden);if(!get('wordReady').hidden){click(get('wordReady'));until(()=>state().battle?.question?.phase==='choices');}}
 function resume(){const map=get('campaignMap').classList.contains('active');assert.ok(map||get('route').classList.contains('active'));click(get(map?'mapContinue':'continueAdventure'));}
 function advance(ms,suspended=false){if(suspended){now+=ms;heartbeat();}else for(let elapsed=0;elapsed<ms;elapsed+=1000){now+=Math.min(1000,ms-elapsed);heartbeat();}}
 function visibility(hidden){Object.defineProperty(document,'hidden',{value:hidden,configurable:true});document.dispatchEvent(new window.Event('visibilitychange'));}
 return {state,get,click,tick,until,ready,resume,advance,visibility,document,finishSpeech(){const callback=speechEnd;speechEnd=null;callback?.();},setFailWrites:value=>failWrites=value};
}
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
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent==='on'));assert.equal(ui.get('xpReward').textContent,'Pip grew! Big Pip');assert.equal(ui.document.querySelector('.battlePip').dataset.growth,'1');
 ui.click(ui.get('homeBtn'));ui=boot(ui.state());assert.equal(ui.get('dragonXP').textContent,'3000 XP');assert.equal(ui.get('dragonStage').textContent,'Big Pip');assert.equal(ui.get('dragonNext').textContent,'Growing together');assert.equal(ui.get('mapPip').dataset.growth,'1');
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
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));assert.equal(ui.state().battle.heroHealth,3);assert.equal(ui.state().rewards.shield,false);assert.equal(ui.get('combatEffects').className,'combatEffects');ui.finishSpeech();assert.ok(ui.get('combatEffects').classList.contains('shieldBlock'));assert.equal(ui.get('battleHeroImg').classList.contains('heroHit'),false);ui.click(ui.get('pauseBtn'));assert.equal(ui.get('combatEffects').className,'combatEffects');
 console.log('PASS shield blocks one hit only after narration, then cancels on pause');
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
 s.dragon.xp=3000;ui=boot(s);assert.equal(ui.get('dragonNamePanel').hidden,false);ui.get('dragonNameInput').value=' ';ui.click(ui.get('dragonNameSave'));assert.match(ui.get('dragonNameMessage').textContent,/Choose/);
 ui.get('dragonNameInput').value='Ember';ui.click(ui.get('dragonNameSave'));assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().dragon.name,'Ember');assert.equal(ui.get('dragonStage').textContent,'Big Ember');
 ui=boot(ui.state());assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().dragon.xp,3000);ui.click(ui.get('dragonPanel'));assert.equal(ui.get('renameDragon').hidden,false);ui.click(ui.get('renameDragon'));ui.click(ui.get('dragonNameLater'));assert.equal(ui.state().dragon.name,'Ember');
 s=ui.state();Core.startBattle(s,Date.UTC(2026,8,22));Core.prepareBattle(s,Date.UTC(2026,8,22));Core.startTeaching(s,'on','battle',Date.UTC(2026,8,22));ui=boot(s);ui.resume();assert.match(ui.get('teachSentence').textContent,/Ember is on the rock/);assert.equal(ui.get('teachSentence').querySelector('.targetWord').textContent,'on');
 console.log('PASS naming locked until evolution, validation, save/reload, later edits and personalized teaching');
}
{
 const now=Date.UTC(2026,8,22),s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);
 Object.assign(Core.chapterState(s,s.battle.areaId),{activeMs:480000,wins:3,duels:1});const ui=boot(s);ui.resume();assert.equal(ui.get('resultMessage').textContent,'One more battle!');ui.click(ui.get('opponents').children[0]);assert.equal(ui.state().battle.areaId,'lantern-trail');assert.equal(ui.state().story.clearedAreas.length,0);
 console.log('PASS eight-minute chapter continues with another enemy and preserves chapter minutes');
}
