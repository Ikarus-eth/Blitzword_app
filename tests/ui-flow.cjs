const {parseHTML}=require('linkedom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'../'),Core=require(root+'game-core'),Content=require(root+'content'),Storage=require(root+'storage'),Audio=require(root+'audio');
function boot(saved,options={}){
 if(saved&&!options.adventures){saved=Core.copy(saved);Core.Adventure.of(saved).preferLegacy=true;}
 const {window,document}=parseHTML(fs.readFileSync(root+'index.html','utf8'));
 let now=options.now??Date.UTC(2026,8,22),uid=0;const jobs=new Map(),memory=new Map(saved?[[Storage.KEY,JSON.stringify(saved)]]:[]);
 let failWrites=options.failWrites||false,heartbeat=()=>{},reloads=0;const destinations=[];
 const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>{if(failWrites===true||typeof failWrites==='function'&&failWrites(k,v))throw new Error('Storage full');memory.set(k,v)},removeItem:k=>memory.delete(k)};
 const schedule=(fn,ms)=>(jobs.set(++uid,{fn,time:now+ms}),uid);
 window.localStorage=storage;
 window.BlitzEnemyArt=require(root+'enemy-art');
 window.BlitzApprovedEnemies=require(root+'assets/enemies/approved-20261010/roster');
 window.matchMedia=()=>({matches:!!options.reducedMotion,addEventListener(){},removeEventListener(){}});
 if(options.geometry)window.HTMLElement.prototype.getBoundingClientRect=function(){const r=this.id==='battleHeroImg'?[30,230,270,410]:this.id==='enemyFace'?[680,330,290,290]:this.classList.contains('battlePip')?[280,420,180,190]:[0,0,1024,768];return {left:r[0],top:r[1],width:r[2],height:r[3],right:r[0]+r[2],bottom:r[1]+r[3]};};
 Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get(){return this.querySelector('option[selected]')?.value||this.firstElementChild?.value||''},set(value){for(const option of this.querySelectorAll('option'))option.removeAttribute('selected');[...this.querySelectorAll('option')].find(option=>option.value===value)?.setAttribute('selected','');}});
 Object.defineProperty(window.HTMLImageElement.prototype,'complete',{get:()=>!options.pendingImages,configurable:true});Object.defineProperty(window.HTMLImageElement.prototype,'naturalWidth',{get:()=>1536,configurable:true});
 let speechEnd=null;const speechTexts=[];
 const ctx={Math:Object.assign(Object.create(Math),{random:options.random||Math.random}),window,document,BlitzCore:Core,BlitzContent:Content,BlitzStorage:Storage,BlitzSound:options.sound||require(root+'soundscape'),BlitzEngagement:require(root+'engagement'),BlitzAudio:{...Audio,narrator:opts=>options.heldNarration?{speak(text,callbacks){speechTexts.push(text);speechEnd=callbacks.onEnd;},cancel(){speechEnd=null;}}:Audio.narrator({...opts,schedule,unschedule:id=>jobs.delete(id)})},performance:{now:()=>now},Date:class extends Date{static now(){return now}},setTimeout:schedule,clearTimeout:id=>jobs.delete(id),setInterval(fn){heartbeat=fn;},location:{reload(){reloads++;},assign(url){destinations.push(url);}},confirm:options.confirm||(()=>false),navigator:options.navigator||window.navigator,localStorage:storage,Option:function(t,v){const el=document.createElement('option');el.textContent=t;el.value=v;return el;}};
 const motionDraws=[];
 if(options.motion){
   window.requestAnimationFrame=fn=>schedule(()=>fn(now),16);window.cancelAnimationFrame=id=>jobs.delete(id);
   const FakeImage=class{set src(url){this.url=url;if(options.failedMotion)this.onerror?.();else this.onload?.();}};
   const motionContext={...ctx,window:new Proxy(window,{get:(target,key)=>key==='Image'?FakeImage:key==='performance'?ctx.performance:Reflect.get(target,key)})};
   const create=document.createElement.bind(document);document.createElement=(tag,...args)=>{const el=create(tag,...args);if(tag==='canvas')el.getContext=()=>new Proxy({drawImage(image){el.url=image.url;motionDraws.push(image.url);},getImageData(){return {data:new Uint8ClampedArray(4)};},putImageData(){},createLinearGradient(){return {addColorStop(){}};}}, {get:(obj,key)=>obj[key]||(()=>{})});return el;};
   vm.runInNewContext(fs.readFileSync(root+'assets/battle-motion/manifest.js','utf8'),motionContext);
   vm.runInNewContext(fs.readFileSync(root+'assets/battle-motion/runtime.js','utf8'),motionContext);
 }
 vm.runInNewContext(fs.readFileSync(root+'assets/wimmelbild/viewer.js','utf8'),ctx);
 vm.runInNewContext(fs.readFileSync(root+'adventure-ui.js','utf8'),ctx);
 vm.runInNewContext(fs.readFileSync(root+'app.js','utf8'),ctx);
 const state=()=>Core.unpackSave(JSON.parse(memory.get(Storage.KEY))),get=id=>document.getElementById(id);
 function click(el){assert.ok(el,'missing element');assert.ok(!el.disabled,'disabled control');assert.ok(!el.hidden,'hidden control');el.onclick?.({});}
 function elapse(ms,awake=false){if(awake){for(let elapsed=0;elapsed<ms;elapsed+=1000){elapse(Math.min(1000,ms-elapsed));heartbeat();}return;}const target=now+ms;while([...jobs.values()].some(job=>job.time<=target))tick();now=target;}
 function tick(){const next=[...jobs.entries()].sort((a,b)=>a[1].time-b[1].time)[0];assert.ok(next,'no scheduled progress');jobs.delete(next[0]);now=next[1].time;next[1].fn();}
 function until(predicate){for(let i=0;i<25&&!predicate();i++)tick();assert.ok(predicate(),'progress stalled');}
 function ready(){if(state().battle?.introPending)click(get('encounterStart'));until(()=>state().battle?.question?.phase==='choices'||state().assessment.progress?.question?.phase==='choices'||!get('wordReady').hidden);if(!get('wordReady').hidden){click(get('wordReady'));until(()=>state().battle?.question?.phase==='choices');}}
 function resume(){const map=get('campaignMap').classList.contains('active');assert.ok(map||get('route').classList.contains('active'));click(get(map?'mapContinue':'continueAdventure'));}
 function advance(ms,suspended=false){if(suspended){now+=ms;heartbeat();}else for(let elapsed=0;elapsed<ms;elapsed+=1000){now+=Math.min(1000,ms-elapsed);heartbeat();}}
 function visibility(hidden){Object.defineProperty(document,'hidden',{value:hidden,configurable:true});document.dispatchEvent(new window.Event('visibilitychange'));}
 return {motionDraws,destinations,state,get,click,tick,elapse,until,ready,resume,advance,visibility,document,window,memory,reloads:()=>reloads,speechTexts,pendingSpeech:()=>speechEnd,finishSpeech(){const callback=speechEnd;speechEnd=null;callback?.();},setFailWrites:value=>failWrites=value};
}
// Independent reading of the written-number parent gate for dashboard flow tests.
function parentGateAnswer(ui){
 const units='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
 const tens={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
 const value=text=>text.trim().split(/[ -]+/).reduce((sum,word)=>word==='hundred'?sum*100:word==='and'?sum:sum+(tens[word]??units.indexOf(word)),0);
 const [first,second]=ui.get('parentQuestion').textContent.replace(/^What is /,'').replace(/\?$/,'').split(' minus ');
 return value(first)-value(second);
}
function impactSave(enemy='moss-golem'){
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile={name:'Reader',gender:'boy',heroClass:'Mage',age:7};s.assessment.done=true;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();}
 Core.startBattle(s,now,{strength:4,enemyId:enemy});s.battle.introPending=false;Core.prepareBattle(s,now);return s;
}

// Earned lightning uses the saved Quick rule, without replaying after resume.
for(const test of [
 {ms:1200,exposure:950,earned:true}, {ms:1500,exposure:950},
 {ms:1200,exposure:1200}, {ms:0,exposure:950},
 {ms:1200,exposure:950,support:'help-request'},
 {ms:1200,exposure:950,support:'interrupted-exposure'},
 {ms:1200,exposure:950,wrong:true},
 {ms:1200,exposure:950,earned:true,reducedMotion:true}
]){
 const s=impactSave();s.battle.question.exposureMs=test.exposure;
 if(test.support)s.battle.question.supportReasons.push(test.support);
 const ui=boot(s,{heldNarration:true,reducedMotion:test.reducedMotion});ui.resume();ui.ready();ui.elapse(test.ms);
 const q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>test.wrong?b.textContent!==q.target:b.textContent===q.target));
 const reward=ui.document.querySelector('.quickWordReward');assert.equal(!!reward,!!test.earned,JSON.stringify(test));
 if(reward){
  assert.equal(ui.get('battleScroll').textContent,q.target);
  reward.dispatchEvent(new ui.window.Event('animationend'));assert.equal(ui.document.querySelector('.quickWordReward'),null);
  const restored=boot(ui.state(),{heldNarration:true});restored.resume();assert.equal(restored.document.querySelector('.quickWordReward'),null);
 }
}

{
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;Core.chooseSpeed(s,'walk');
 for(const word of [...Content.areas[0].words,...Content.areas[1].words.slice(0,3)]){
  Object.assign(s.learning.words[word],{introducedAt:new Date(now-Core.DAY).toISOString(),practiceSuccesses:3,reviewStage:0,dueAt:now+Core.DAY});
  s.learning.dailyPractice[word]={day:Core.dayKey(now),correct:3};
 }
 Core.startBattle(s,now,{strength:6});s.battle.introPending=false;const pending=Core.copy(Core.prepareBattle(s,now));
 assert.equal(pending.practiceKind,'new');assert.equal(pending.exposureMs,1800);
 let ui=boot(s);ui.resume();ui.ready();assert.equal(ui.state().battle.question.exposureMs,1800);
 ui=boot(ui.state());ui.resume();ui.ready();const q=ui.state().battle.question;
 assert.equal(q.id,pending.id);assert.deepEqual(q.options,pending.options);assert.equal(q.exposureMs,1800);
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));
 assert.equal(ui.state().battle.enemyHealth,5);assert.equal(ui.state().learning.dailyPractice[q.target].correct,1);
 assert.equal(Core.practiceExposure(ui.state()),1800);assert.ok(ui.state().campaign.battleRecords.at(-1).correct);
 console.log('PASS automatic learning ahead survive UI save/reopen without changing Walk or saved choices');
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
 assert.equal(!!ui.get('battleHeroImg').querySelector('.staffArm'),true);assert.equal(!!ui.get('combatEffects').querySelector('.castBeam'),true);
 assert.equal(ui.get('combatEffects').querySelectorAll('.damageNumber').length,1);assert.equal(ui.state().battle.enemyHealth,0);
 ui.click(ui.get('pauseBtn'));assert.equal(ui.get('combatEffects').className,'combatEffects');assert.equal(ui.get('combatEffects').querySelector('.castBeam'),null);assert.ok(!ui.get('battleHeroImg').classList.contains('mageCast'));
 ui.finishSpeech();assert.equal(ui.get('combatEffects').className,'combatEffects');ui.click(ui.get('pauseResume'));ui.finishSpeech();ui.click(ui.get('homeBtn'));assert.equal(ui.get('combatEffects').className,'combatEffects');
 assert.equal(ui.state().campaign.battleRecords.length,1);
}
console.log('PASS all six saved hero preferences use mage: answer/narration lock, staff beam, Pip final blow, one damage, pause and Home cancellation');
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
 assert.ok(ui.get('campaignMap').classList.contains('active'));assert.equal(ui.get('mapContinue').dataset.area,'lantern-trail');assert.equal(ui.get('mapNodes').children.length,5);ui.resume();assert.equal(ui.state().battle.mapSeen,true);assert.ok(ui.get('battle').classList.contains('active'));
 ui.click(ui.get('pauseBtn'));assert.equal(ui.get('pausePanel').hidden,false);ui.click(ui.get('pauseResume'));assert.equal(ui.get('pausePanel').hidden,true);
 console.log('PASS complete DOM flow:',mode,'→ saved handoff → assessment → campaign → pause/resume');
}

// Returning results and new challenges must preserve the chosen hero and earned wins.
for(const victory of [true,false]){
 const s=Core.migrate(Core.fresh()),now=Date.now();s.profile.name='Éva';s.profile.gender='girl';s.profile.heroClass='Knight';s.assessment.done=true;
 Core.startBattle(s,now,{strength:4});s.battle.enemyHealth=victory?0:4;s.battle.heroHealth=victory?3:0;Core.prepareBattle(s,now);
 const ui=boot(s);ui.resume();assert.ok(ui.get('result').classList.contains('active'));assert.equal(ui.get('opponents').children.length,2);
 assert.equal(ui.get('resultHero').dataset.sprite,'0');assert.equal(ui.state().profile.heroClass,'Knight');assert.equal(ui.state().profile.gender,'girl');const wins=ui.state().campaign.wins;
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
 s.dragon.xp=14997;s.timing.firstPracticeAt='2000-01-01T00:00:00.000Z';s.timing.days={};s=Core.migrate(s);Core.startBattle(s,Date.now());
 let ui=boot(s);assert.ok(ui.get('campaignMap').classList.contains('active'));assert.equal(ui.get('dragonXP').textContent,'14997 XP');assert.equal(ui.get('dragonNext').textContent,'9 / 10 growth steps');assert.equal(ui.get('dragonStages').children.length,4);
 assert.ok(ui.get('app').classList.contains('mapHome'));assert.equal(ui.document.querySelector('.mapTerrain').style.backgroundSize,'cover');
 const id=ui.state().battle.id;ui.click(ui.get('mapNodes').querySelector('[data-area="hidden-nest"]'));
 assert.equal(ui.get('mapNodes').querySelector('[data-area="hidden-nest"] .mapNodeName').textContent,'Hidden Nest');assert.equal(ui.get('mapContinue').dataset.area,'lantern-trail');assert.equal(ui.state().battle.id,id);assert.equal(ui.get('mapNodes').querySelector('[data-area="hidden-nest"] small').textContent,'Locked');
 ui.resume();ui.ready();assert.equal(ui.state().battle.question.target,'on');
 assert.equal(ui.get('app').classList.contains('mapHome'),false);
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent==='on'));assert.equal(ui.get('xpReward').textContent,'Pip is glowing!');assert.equal(ui.document.querySelector('.battlePip').dataset.growth,'0');
 ui.click(ui.get('homeBtn'));ui=boot(ui.state());assert.equal(ui.get('dragonXP').textContent,'15000 XP');assert.equal(ui.get('dragonStage').textContent,'Big Pip');assert.equal(ui.get('dragonNext').textContent,'0 / 10 growth steps');assert.equal(ui.get('mapPip').dataset.growth,'0');
 const answers=ui.state().campaign.battleRecords.length;ui.resume();ui.until(()=>ui.state().battle.question.target!=='on');assert.equal(ui.state().campaign.battleRecords.length,answers);
 ui.click(ui.get('homeBtn'));ui.click(ui.get('mapTraveller'));assert.equal(ui.get('heroGrid').children.length,1);ui.click(ui.get('heroGrid').children[0]);ui.click(ui.get('heroNext'));assert.ok(ui.get('campaignMap').classList.contains('active'));assert.equal(ui.state().profile.heroClass,'Mage');assert.equal(ui.get('dragonXP').textContent,'15000 XP');
 console.log('PASS map future previews, XP stage unlock, reload, exact resume and hero change');
}

// Idle, suspension and parent reporting use the actual controller and timer callbacks.
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=98;Core.startBattle(s,Date.now());
 const ui=boot(s);assert.ok(Math.abs(parseFloat(ui.get('dragonProgress').querySelector('span').style.width)-100*98/15000)<.001);
 ui.click(ui.get('dragonPanel'));assert.equal(ui.get('growthPanel').hidden,false);assert.match(ui.get('growthMeters').textContent,/98 \/ 15000/);assert.doesNotMatch(ui.get('growthMeters').textContent,/Days|Minutes/);ui.click(ui.get('growthClose'));
 assert.equal(ui.get('growthPanel').hidden,true);
 console.log('PASS Pip tap shows XP-only growth without day or minute gates');
}
{
 let s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 for(const word of Content.chapters[0].words){s.learning.words[word].introducedAt=new Date().toISOString();s.learning.words[word].practiceSuccesses=2;}
 s.campaign.wins=10;s.campaign.checkpointWins=10;for(const a of Content.areas.slice(0,5))Object.assign(Core.chapterState(s,a.id),{wins:3,duels:1,activeMs:600000});s=Core.migrate(s);Core.startBattle(s,Date.now());s.battle.enemyHealth=0;Core.resolveBattle(s,Date.now());
 const ui=boot(s);assert.equal(ui.get('campaignMap').classList.contains('active'),true);assert.equal(ui.get('chapterCelebration').hidden,false);assert.equal(ui.get('mapTitle').textContent,'River Path');assert.equal(ui.get('chapterScenery').hidden,true);assert.ok(ui.document.querySelector('.mapTerrain').style.backgroundImage.includes(Content.campaignBackgrounds['chapter-2'].src));
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
 ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
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
 assert.equal(ui.get('speedChoices').querySelector('[data-speed="ride"]').disabled,true);const icons=[...ui.get('speedChoices').querySelectorAll('.pacePicture')];assert.equal(icons.length,7);assert.equal(new Set(icons.map(icon=>icon.innerHTML)).size,7);
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
 let ui=boot(s);ui.resume();assert.equal(ui.get('resultRetreat').hidden,false);assert.equal(ui.get('resultTitle').textContent,'You lost this round');assert.equal(ui.state().result.defeatShown,true);ui.click(ui.get('pauseBtn'));assert.equal(ui.get('defeatScene').hidden,true);ui.click(ui.get('pauseResume'));assert.equal(ui.get('defeatScene').hidden,true);
 ui=boot(ui.state());ui.resume();assert.equal(ui.get('defeatScene').hidden,true);assert.equal(ui.get('opponents').children.length,2);
 console.log('PASS defeat reaction cancels on pause and cannot replay after reload');
}
// The bonus becomes visible only after confirmed play, persists through reload and stays static.
{
 const now=Date.UTC(2026,8,22),s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.settings.selfPaced=true;
 s.timing.days[Core.dayKey(now)]={practice:590000,math:0,assessment:0,demo:0,idle:0};Core.startBattle(s,now);s.battle.introPending=false;Core.prepareBattle(s,now);
 let ui=boot(s);assert.equal(ui.get('mapBonus').hidden,true);ui.resume();ui.ready();ui.advance(11000);
 const target=ui.state().battle.question.target;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===target));
 assert.equal(ui.get('xpBonusBadge').hidden,false);assert.equal(ui.get('xpBonusBadge').textContent,'XP boost');assert.equal(ui.state().dragon.xp,25);
 ui.click(ui.get('homeBtn'));const xp=ui.state().dragon.xp;ui=boot(ui.state());assert.equal(ui.get('mapBonus').textContent,'XP boost');assert.equal(ui.get('mapBonus').hidden,false);assert.equal(ui.state().dragon.xp,xp);
 console.log('PASS confirmed ten-minute bonus, subtle visible multiplier, whole XP and reload idempotence');
}
{
 let s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 let ui=boot(s);ui.click(ui.get('dragonPanel'));assert.equal(ui.get('renameDragon').hidden,true);
 s.dragon.xp=15000;ui=boot(s);assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().screen,'evolution');ui.click(ui.get('evolutionNext'));ui.until(()=>ui.state().dragon.evolution.phase==='read');ui.click(ui.get('evolutionNext'));assert.equal(ui.get('dragonNamePanel').hidden,false);ui.get('dragonNameInput').value=' ';ui.click(ui.get('dragonNameSave'));assert.match(ui.get('dragonNameMessage').textContent,/Choose/);
 ui.get('dragonNameInput').value='Ember';ui.click(ui.get('dragonNameSave'));assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().dragon.name,'Ember');assert.equal(ui.get('dragonStage').textContent,'Big Ember');assert.equal(ui.get('dragonTapHint').textContent,'XP · Tap Ember');assert.equal(ui.get('dragonPanel').getAttribute('aria-label'),'See Ember’s growth');assert.equal(ui.get('growthClose').getAttribute('aria-label'),'Close Ember’s growth');
 ui=boot(ui.state());assert.equal(ui.get('dragonNamePanel').hidden,true);assert.equal(ui.state().dragon.xp,15000);ui.click(ui.get('dragonPanel'));assert.equal(ui.get('renameDragon').hidden,false);ui.click(ui.get('renameDragon'));ui.click(ui.get('dragonNameLater'));assert.equal(ui.state().dragon.name,'Ember');
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
 const s=storySave(9);s.dragon.xp=15000;s.dragon.named=true;s.dragon.name='Ember';s.dragon.namingPromptSeen=true;
 const ui=boot(s,{heldNarration:true});assert.match(ui.document.querySelector('.mapTerrain').getAttribute('aria-label'),/Campaign 2, River Path map. Chapter 5, River Gate/);
 assert.match(ui.get('mapNodes').children[4].getAttribute('aria-label'),/Continue to chapter 5, River Gate/);
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
 ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
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
 const again=boot(ui.state());openParents(again);assert.match(again.get('parentLearning').textContent,/^40 \/ 1000 words introduced/);assert.match(again.get('parentGrowth').textContent,/2400 XP/);
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
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=15000;
 Core.startBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);
 const ui=boot(s);assert.equal(ui.state().screen,'evolution');ui.click(ui.get('evolutionNext'));ui.click(ui.get('evolutionSkip'));
 const img=ui.get('evolutionAfter').querySelector('img');img.onerror();assert.equal(img.hidden,true);assert.equal(ui.get('evolutionAfter').querySelector('.evolutionFallback').hidden,false);
 ui.click(ui.get('evolutionNext'));ui.click(ui.get('dragonNameLater'));assert.equal(ui.state().dragon.evolution,null);
 ui.resume();assert.equal(ui.state().screen,'result');assert.equal(ui.state().campaign.wins,1);
 console.log('PASS evolution returns to saved battle result and missing image does not block reading');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=15000;
 const ui=boot(s,{reducedMotion:true});ui.click(ui.get('evolutionNext'));ui.tick();
 assert.equal(ui.state().dragon.evolution.phase,'read');assert.ok(ui.get('evolution').classList.contains('still'));
 ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseFinish'));assert.equal(ui.state().screen,'campaignMap');
 assert.equal(ui.state().dragon.evolution.phase,'read');ui.resume();assert.equal(ui.state().dragon.evolution.phase,'read');
 console.log('PASS reduced motion skips transformation movement; Rest preserves the reading scene');
}
{
 const s=Core.migrate(Core.fresh()),now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=14999;
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

// Point 7: the calibrated pace, optional battle-boundary suggestions and parent quick evidence.
for(const [ms,id] of [[1800,'walk'],[1500,'stride'],[1200,'jog'],[950,'run'],[2200,null]]){
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.assessment.exposure=ms;
 const ui=boot(s);ui.click(ui.get('mapSpeed'));
 const chosen=[...ui.get('speedChoices').querySelectorAll('[aria-pressed="true"]')];
 assert.equal(chosen.length,id?1:0);if(id)assert.equal(chosen[0].dataset.speed,id);else {assert.equal(ui.get('speedNote').hidden,false);assert.match(ui.get('speedNote').textContent,/2.2 seconds/);}
 assert.equal(ui.state().assessment.exposure,ms);assert.equal(ui.state().settings.speed,null);
}
console.log('PASS speed panel highlights calibrated Walk/Stride/Jog/Run and explicitly displays the 2200 ms reading-check pace');
for(const id of ['stride','jog']){
 const ui=boot(impactSave());ui.click(ui.get('mapSpeed'));ui.click(ui.get('speedChoices').querySelector('[data-speed="'+id+'"]'));
 const again=boot(ui.state());again.click(again.get('mapSpeed'));assert.equal(again.get('speedChoices').querySelector('[aria-pressed="true"]').dataset.speed,id);
 assert.equal(again.state().battle.question.exposureMs,1800); // a pending word keeps its saved exposure
}
console.log('PASS both new steps persist while an already saved word keeps its exposure');
function speedResultSave(misses=0){
 const s=impactSave();Core.chooseSpeed(s,'stride');s.learning.speedPractice={exposureMs:1500,sinceOffer:20,recent:Content.words.slice(0,20).map((word,i)=>({target:word.w,correct:i>=misses}))};
 s.battle.enemyHealth=0;Core.resolveBattle(s,Date.UTC(2026,8,22));return s;
}
for(const accept of [true,false])for(const misses of [0,5]){
 let ui=boot(speedResultSave(misses));ui.resume();assert.equal(ui.get('speedSuggestion').hidden,false);const offer=ui.state().result.speedSuggestion;
 assert.match(ui.get('speedSuggestionText').textContent,new RegExp(offer.name));assert.equal(ui.state().settings.speed,'stride');
 ui=boot(ui.state());ui.resume();assert.equal(ui.get('speedSuggestion').hidden,false);
 const button=ui.get(accept?'speedSuggestionYes':'speedSuggestionNo');ui.click(button);button.onclick();
 assert.equal(ui.get('speedSuggestion').hidden,true);assert.equal(ui.state().settings.speed,accept?offer.to:'stride');assert.equal(ui.state().result.speedSuggestion.status,accept?'accepted':'declined');
 const saved=ui.state();ui=boot(saved);ui.resume();assert.equal(ui.get('speedSuggestion').hidden,true);
 ui.click(ui.get('opponents').firstElementChild);assert.equal(ui.state().activity,'battle');assert.equal(ui.state().settings.speed,accept?offer.to:'stride');
}
console.log('PASS faster/slower offers can be accepted or declined, survive reopening and never block the next battle');
{
 const ui=boot(speedResultSave());ui.resume();const stale=ui.get('speedSuggestionYes');ui.click(ui.get('opponents').firstElementChild);stale.onclick();assert.equal(ui.state().settings.speed,'stride');assert.equal(ui.state().result,null);
}
console.log('PASS ignoring an offer preserves the chosen pace and stale offer taps cannot change a new battle');
{
 const ui=boot(speedResultSave());ui.resume();ui.setFailWrites(true);ui.click(ui.get('speedSuggestionYes'));assert.equal(ui.get('saveNotice').hidden,false);assert.equal(ui.state().settings.speed,'stride');
}
console.log('PASS accepting a suggestion uses the existing save-failure protection');
{
 const s=impactSave(),q=s.battle.question;q.exposureMs=950;q.phase='choices';q.responseMs=1200;Core.answerBattle(s,q.target,Date.UTC(2026,8,22));
 const ui=boot(s);openParents(ui);const words=[...ui.get('parentWordMap').querySelectorAll('.parentWord')];
 const quick=words.find(button=>button.dataset.word===q.target);assert.equal(quick.dataset.quick,'true');assert.match(quick.getAttribute('aria-label'),/quick answer recorded/);ui.click(quick);assert.match(ui.get('parentWordSummary').textContent,/1 quick answer\b/);
 assert.match(ui.get('parentQuickSummary').textContent,/^1 \/ 1000/);assert.ok(words.some(button=>button.dataset.quick==='false'));
 const reopened=boot(ui.state());openParents(reopened);assert.equal(reopened.get('parentQuickSummary').textContent,ui.get('parentQuickSummary').textContent);
}
console.log('PASS Parents shows per-word quick evidence separately from words still in review and preserves it on reopen');
{
 const s=impactSave(),pending=Core.copy(s.battle.question),ui=boot(s);ui.get('selfPacedSetting').checked=true;ui.get('selfPacedSetting').onchange();
 assert.equal(ui.state().settings.selfPaced,true);assert.deepEqual(ui.state().battle.question,pending);
 ui.get('selfPacedSetting').checked=false;ui.get('selfPacedSetting').onchange();assert.equal(Core.practiceExposure(ui.state()),1800);assert.deepEqual(ui.state().battle.question,pending);
}
console.log('PASS the older self-paced checkbox preserves a pending ready word and uses the shared speed-setting path');
{
 const ui=boot(speedResultSave());assert.equal(ui.get('mapSpeed').dataset.speed,'stride');ui.resume();ui.click(ui.get('speedSuggestionYes'));ui.click(ui.get('resultNext'));assert.equal(ui.get('mapSpeed').dataset.speed,'jog');
}
console.log('PASS the map speed label follows the reading-check default and accepted suggestions');
function parentLearningSave(){
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;const now=Date.UTC(2026,8,22);
 s.learning.words.rock.securedAt=new Date(now-Core.DAY).toISOString();s.learning.words.tree.introducedAt=new Date(now-Core.DAY).toISOString();
 const record=(target,correct,extra={})=>({task:'battle',target,correct,supported:false,timingValid:true,firstResponse:correct?target:Core.byWord[target].d.find(x=>x!==target),at:new Date(now).toISOString(),lastHelpAt:null,responseMs:1200,exposureMs:950,retentionGapMs:Core.DAY,...extra});
 s.campaign.battleRecords.push(record('on',false,{firstResponse:'own',responseMs:3000}),record('on',true),record('fox',true,{retentionGapMs:7*Core.DAY}),record('cave',true,{retentionGapMs:30*Core.DAY}));return s;
}
{
 const ui=boot(parentLearningSave());assert.equal(ui.get('parentGate').hidden,true);ui.click(ui.get('mapParents'));assert.equal(ui.get('parentGate').hidden,false);
 ui.get('parentAnswer').value='0';ui.click(ui.get('parentUnlock'));assert.equal(ui.get('parentDashboard').classList.contains('active'),false);
 ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
 const words=[...ui.get('parentWordMap').querySelectorAll('.parentWord')];assert.equal(words.length,1000);assert.equal(new Set(words.map(w=>w.dataset.word)).size,1000);
 for(const [word,status] of [['on','learning'],['rock','secured'],['fox','kept7'],['cave','kept30'],['water','new']])assert.equal(words.find(b=>b.dataset.word===word).dataset.status,status);
 const articles=[...ui.get('parentDashboard').children];assert.equal(articles[1].id,'parentLearningOverview');assert.ok(articles.indexOf(ui.get('parentRetention'))<articles.findIndex(el=>el.querySelector('.soundSettings')));assert.equal(articles.at(-2).querySelector('.soundSettings')!==null,true);
 assert.equal(ui.get('parentWeeks').children[0].children[1].textContent,'2 / 3');assert.equal(ui.get('parentWeeks').children[0].children[2].textContent,'67%');assert.match(ui.get('parentMixups').textContent,/on → own/);assert.match(ui.get('parentSlow').textContent,/1.2 s|2.1 s/);
}
console.log('PASS gated Parents shows the 1000-word map, five evidence states, retention and tricky words before sound settings');
{
 const ui=boot(parentLearningSave());openParents(ui);ui.get('parentWordSearch').value='  FOX ';ui.get('parentWordSearch').oninput();assert.equal(ui.get('parentWordMap').querySelectorAll('.parentWord').length,1);assert.match(ui.get('parentWordCount').textContent,/^1 \/ 1000/);
 ui.get('parentWordSearch').value='';ui.get('parentWordFilter').value='kept30';ui.get('parentWordFilter').onchange();assert.equal(ui.get('parentWordMap').querySelector('.parentWord').dataset.word,'cave');
 ui.get('parentWordFilter').value='quick';ui.get('parentWordFilter').onchange();assert.equal(ui.get('parentWordMap').querySelectorAll('.parentWord').length,3);
 ui.get('parentWordSearch').value='<script>';ui.get('parentWordSearch').oninput();assert.match(ui.get('parentWordCount').textContent,/^0 \/ 1000/);assert.equal(ui.get('parentWordMap').children.length,0);
}
console.log('PASS word search and status/quick filters show exact matches, with a clear empty state');
{
 let ui=boot(parentLearningSave());openParents(ui);const before=ui.state();ui.click(ui.get('parentWordMap').querySelector('[data-word="on"]'));
 assert.equal(ui.get('parentWordDetail').hidden,false);assert.match(ui.get('parentWordTitle').textContent,/on · Learning/);assert.match(ui.get('parentWordSummary').textContent,/1 \/ 2 unaided/);assert.equal(ui.get('parentWordEvents').children.length,2);assert.match(ui.get('parentWordEvents').textContent,/own · Incorrect/);assert.match(ui.get('parentWordDifficulties').textContent,/own \(1\)/);assert.deepEqual(ui.state(),before);
 ui.click(ui.get('parentWordClose'));assert.equal(ui.get('parentWordDetail').hidden,true);ui.click(ui.get('parentHome'));ui=boot(ui.state());openParents(ui);assert.equal(ui.get('parentWordMap').querySelector('[data-word="cave"]').dataset.status,'kept30');assert.equal(ui.get('parentWeeks').children[0].children[2].textContent,'67%');
}
console.log('PASS tapping a word opens saved first-response history without changing learner data; reopen preserves the evidence');
{
 const s=parentLearningSave();const limit=Core.HISTORY_LIMITS.answers;Core.HISTORY_LIMITS.answers=0;Core.compactHistory(s);Core.HISTORY_LIMITS.answers=limit;
 delete s.archive.parentEvidence;delete s.archive.words.cave.kept30At;delete s.archive.words.cave.kept7At;s.archive.days[Core.dayKey(Date.UTC(2026,8,22))].gapChecks=1;
 const ui=boot(s);openParents(ui);assert.equal(ui.get('parentWeeks').children[0].children[1].textContent,'Unavailable');assert.equal(ui.get('parentWeeks').children[0].children[2].textContent,'—');
 ui.click(ui.get('parentWordMap').querySelector('[data-word="on"]'));assert.match(ui.get('parentWordArchive').textContent,/2 older practice answers/);assert.equal(ui.get('parentWordEvents').children.length,0);assert.match(ui.get('parentWordSummary').textContent,/1 \/ 2 unaided/);
}
console.log('PASS older compacted saves retain totals while unavailable weekly detail and missing individual events are explicit');
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;const ui=boot(s);openParents(ui);
 assert.equal(ui.get('parentWordMap').querySelectorAll('[data-status="new"]').length,1000);assert.match(ui.get('parentMixupsEmpty').textContent,/No unaided/);assert.match(ui.get('parentSlowEmpty').textContent,/No valid/);
 assert.ok([...ui.get('parentWeeks').children].every(row=>row.children[1].textContent==='No checks'&&row.children[2].textContent==='—'));
 ui.click(ui.get('parentWordMap').querySelector('[data-word="on"]'));assert.match(ui.get('parentWordHistoryEmpty').textContent,/No individual/);
}
console.log('PASS a new learner sees New words and no-data explanations instead of fabricated scores');


// Reading suppresses one-shot effects, while battle music keeps its steady mix.
function observeSound(){
 const module=require(root+'soundscape'),config={},calls=[];
 return {config,calls,module:{...module,create(options){const sound=module.create(options);return {...sound,configure(value){Object.assign(config,value);calls.push({...config});sound.configure(value);}};}}};
}
for(const selfPaced of [false,true]){
 const audio=observeSound(),s=impactSave();s.settings.selfPaced=selfPaced;s.battle.question.exposureMs=selfPaced?null:1800;
 const ui=boot(s,{sound:audio.module,heldNarration:true});ui.resume();
 const check=phase=>{assert.equal(ui.state().battle.question.phase,phase);assert.equal(audio.config.scene,'battle');assert.equal(audio.config.quiet,false);assert.equal(audio.config.reading,true);assert.equal(audio.config.suspended,false);};
 check('fix');ui.tick();check('word');
 if(selfPaced){ui.elapse(5000,true);check('word');ui.click(ui.get('wordReady'));}else ui.tick();
 check('mask');ui.tick();check('choices');
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));
 assert.equal(audio.config.quiet,false);assert.equal(audio.config.reading,false);assert.equal(audio.config.narrating,true);
 ui.finishSpeech();assert.equal(audio.config.narrating,false);assert.equal(audio.config.quiet,false);
 ui.until(()=>ui.state().battle.question.id!==q.id);check('fix');
 ui.click(ui.get('pauseBtn'));assert.equal(audio.config.suspended,true);
 ui.click(ui.get('pauseResume'));assert.equal(audio.config.suspended,false);ui.click(ui.get('homeBtn'));assert.equal(audio.config.scene,'home');
 ui.resume();ui.ready();ui.visibility(true);assert.equal(audio.config.suspended,true);
 assert.ok(audio.calls.filter(c=>c.scene==='battle').every(c=>!c.quiet));
}
console.log('PASS timed and self-paced battle audio stays open through every question phase, speech and combat; pause/background stop it');
{
 const audio=observeSound(),s=impactSave(),q=s.battle.question;q.isNew=true;
 const ui=boot(s,{sound:audio.module,heldNarration:true});ui.resume();ui.ready();ui.click(ui.get('battleUnsure'));
 assert.equal(audio.config.scene,'battle');assert.equal(audio.config.quiet,false);
 ui.finishSpeech();ui.click(ui.get('battleAnswers').querySelector('.correctionNext'));
 assert.equal(audio.config.scene,'transition');assert.equal(audio.config.quiet,true);
 ui.click(ui.get('teachContinue'));assert.equal(audio.config.scene,'battle');assert.equal(audio.config.quiet,false);
 const story=observeSound(),storyUI=boot(storySave(7),{sound:story.module,heldNarration:true});storyUI.resume();assert.equal(story.config.quiet,true);
 const assessment=observeSound(),saved=Core.migrate(Core.fresh());saved.profile.name='Reader';Core.startAssessment(saved,Date.UTC(2026,8,22));
 const checkUI=boot(saved,{sound:assessment.module});checkUI.resume();assert.equal(assessment.config.quiet,true);
 console.log('PASS teaching, chapter story and reading check remain quiet; returning to battle restores continuous audio');
}

// Point 9: whole-number rewards, visible growth steps and a forgiving return bonus.
{
 const now=Date.UTC(2026,8,22),s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.dragon.xp=1499.75;
 let ui=boot(s);assert.equal(ui.get('dragonXP').textContent,'1499 XP');assert.equal(ui.get('dragonNext').textContent,'0 / 10 growth steps');
 ui.click(ui.get('dragonPanel'));assert.equal(ui.get('growthStepNote').textContent,'1 XP to step 1 of 10');assert.match(ui.get('growthMeters').textContent,/1499 \/ 15000/);assert.doesNotMatch(ui.get('growthMeters').textContent,/\.75/);
 ui.click(ui.get('growthClose'));assert.equal(ui.state().dragon.xp,1499.75);ui=boot(ui.state());assert.equal(ui.state().dragon.xp,1499.75);
 console.log('PASS growth uses ten steps and whole display values while preserving old saved fractions');
}
{
 const now=Date.UTC(2026,8,22),s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;s.settings.selfPaced=true;
 for(const ago of [1,3,5])s.timing.days[Core.dayKey(now-ago*Core.DAY)]={practice:600000};
 s.timing.days[Core.dayKey(now)]={practice:590000};Core.startBattle(s,now);s.battle.introPending=false;Core.prepareBattle(s,now);
 let ui=boot(s);assert.equal(ui.get('mapConsistency').hidden,true);ui.resume();ui.ready();ui.advance(11000);
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));
 assert.equal(ui.get('xpReward').textContent,'+5 XP');assert.equal(ui.state().dragon.xp,55);assert.equal(ui.get('xpBonusBadge').textContent,'XP boost');
 ui.click(ui.get('homeBtn'));assert.equal(ui.get('mapConsistency').textContent,'Returning bonus +30 XP');assert.equal(ui.get('mapConsistency').hidden,false);
 const xp=ui.state().dragon.xp;ui=boot(ui.state());assert.equal(ui.state().dragon.xp,xp);assert.equal(ui.get('mapConsistency').textContent,'Returning bonus +30 XP');
 openParents(ui);assert.match(ui.get('parentConsistency').textContent,/4 practice days/);assert.match(ui.get('parentConsistency').textContent,/\+30 XP/);
 console.log('PASS returning bonus tolerates skipped dates, is paid once, and remains visible after reopening');
}
{
 const s=Core.migrate(Core.fresh());delete s.growthRulesVersion;delete s.dragon.growthOrigin;s.profile.name='Reader';s.assessment.done=true;
 Object.assign(s.dragon,{stage:1,xp:4000.25,evolutionSeen:1,named:true,name:'Ember'});
 const ui=boot(s);assert.equal(ui.state().dragon.stage,1);assert.equal(ui.get('dragonStage').textContent,'Big Ember');ui.click(ui.get('dragonPanel'));
 assert.equal(ui.get('renameDragon').hidden,false);assert.equal(ui.get('growthStepNote').textContent,'3200 XP to step 1 of 10');assert.equal(ui.get('growthMeters').querySelector('[role=progressbar]').getAttribute('aria-valuemin'),'3000');
 console.log('PASS old earned forms retain naming, their step origin and existing XP under higher thresholds');
}

{
 const saved=impactSave(),ui=boot(saved);ui.resume();
 const notify=(key,newValue,area)=>{const event=new ui.window.Event('storage');Object.assign(event,{key,newValue,storageArea:area||ui.window.localStorage});ui.window.dispatchEvent(event);};
 const current=ui.memory.get(Storage.KEY);
 // Unload/pagehide notifications can arrive after the new page loaded and saved newer progress.
 notify(Storage.KEY,JSON.stringify(saved));assert.equal(ui.get('saveNotice').hidden,true);assert.equal(ui.memory.get(Storage.KEY),current);
 notify(Storage.KEY,null);assert.equal(ui.get('saveNotice').hidden,true);
 notify(Storage.KEY+'_backup','old backup');assert.equal(ui.get('saveNotice').hidden,true);
 const other={...ui.state(),revision:ui.state().revision+1};other.profile={...other.profile,name:'Other tab'};
 ui.memory.set(Storage.KEY,JSON.stringify(other));notify(Storage.KEY,JSON.stringify(other),{});
 assert.equal(ui.get('saveNotice').hidden,true,'another storage area is ignored');
 notify(Storage.KEY,JSON.stringify(other));assert.equal(ui.get('saveNotice').hidden,false);assert.match(ui.get('saveMessage').textContent,/Another tab/);
 assert.equal(ui.memory.get(Storage.KEY),JSON.stringify(other),'the external adventure is never overwritten');
 const cleared=boot(impactSave());cleared.memory.delete(Storage.KEY);const event=new cleared.window.Event('storage');Object.assign(event,{key:null,newValue:null,storageArea:cleared.window.localStorage});cleared.window.dispatchEvent(event);
 assert.equal(cleared.get('saveNotice').hidden,false);assert.equal(cleared.memory.has(Storage.KEY),false);
 console.log('PASS stale reload storage events are ignored; real external writes and clears still block without overwriting saves');
}
{
 for(const stage of [1,2,3]){
  const s=impactSave();Object.assign(s.dragon,{stage,xp:Content.dragonStages[stage].xp,evolutionSeen:stage,named:true,namingPromptSeen:true});
  const ui=boot(s);ui.click(ui.get('dragonPanel'));
  for(const id of ['growthPip','growthNextPip']){
   const svg=ui.get(id).querySelector('svg'),image=svg.querySelector('image'),rect=svg.querySelector('clipPath rect');
   assert.ok(rect,id+' needs an explicit atlas crop even when the viewport is letterboxed');
   assert.deepEqual(['x','y','width','height'].map(k=>Number(rect.getAttribute(k))),svg.getAttribute('viewBox').split(' ').map(Number));
   assert.equal(image.getAttribute('clip-path'),'url(#'+rect.parentElement.id+')');
  }
  const ids=[...ui.document.querySelectorAll('clipPath')].map(el=>el.id);assert.equal(new Set(ids).size,ids.length);
 }
 console.log('PASS every grown Pip crop excludes neighbouring atlas cells with a unique clip in narrow and wide containers');
}

// The chapter itself is the entry point; inspecting other places cannot change it.
{
 const ui=boot(impactSave()),before=ui.state(),current=ui.get('mapContinue');
 assert.equal(ui.document.querySelector('.mapDestination'),null);assert.equal(ui.get('mapSettings'),null);
 assert.equal(current.dataset.area,'lantern-trail');assert.equal(current.querySelector('.mapNodeName').textContent,'Lantern Trail›');
 assert.equal(ui.get('mapDailyGoal').hidden,true);assert.equal(ui.get('mapDailySummary').hidden,true);
 assert.equal(ui.get('mapTraveller').tagName,'BUTTON');assert.match(ui.get('mapTraveller').getAttribute('aria-label'),/^Your hero:/);
 ui.click(ui.get('mapNodes').querySelector('[data-area="hidden-nest"]'));
 assert.equal(ui.state().screen,'campaignMap');assert.equal(ui.state().battle.id,before.battle.id);assert.equal(ui.get('mapContinue').dataset.area,'lantern-trail');
 const start=ui.get('mapContinue').onclick;start();const active=ui.state();start();
 assert.equal(ui.state().battle.id,active.battle.id);assert.deepEqual(ui.state().battle.question,active.battle.question);
 assert.equal(ui.state().screen,'battle');assert.equal(ui.get('speedPanel').hidden,true);
 console.log('PASS direct chapter entry replaces the footer; locked previews and repeated taps preserve the pending battle');
}
{
 const ui=boot(impactSave());assert.ok(ui.get('mapSpeed').querySelector('.pacePicture'));assert.equal(ui.get('mapSpeed').textContent,'');
 ui.click(ui.get('mapSpeed'));assert.ok(ui.get('speedPanel').classList.contains('mapSpeedMenu'));assert.equal(ui.get('speedPanel').hasAttribute('aria-modal'),false);assert.equal(ui.get('mapSpeed').getAttribute('aria-expanded'),'true');
 ui.click(ui.get('mapSpeed'));assert.equal(ui.get('speedPanel').hidden,true);assert.equal(ui.get('mapSpeed').getAttribute('aria-expanded'),'false');
 ui.click(ui.get('mapSpeed'));const escape=new ui.window.Event('keydown');escape.key='Escape';ui.document.dispatchEvent(escape);assert.equal(ui.get('speedPanel').hidden,true);
 ui.click(ui.get('mapSpeed'));ui.get('mapTitle').dispatchEvent(new ui.window.Event('click',{bubbles:true}));assert.equal(ui.get('speedPanel').hidden,true);
 ui.click(ui.get('mapSpeed'));ui.click(ui.get('speedChoices').querySelector('[data-speed="jog"]'));assert.equal(ui.get('mapSpeed').dataset.speed,'jog');assert.match(ui.get('mapSpeed').getAttribute('aria-label'),/Jog/);
 const saved=ui.state();ui.click(ui.get('mapTraveller'));assert.equal(ui.state().screen,'hero');assert.equal(ui.get('speedPanel').hidden,true);ui.click(ui.get('heroNext'));assert.equal(ui.get('mapSpeed').dataset.speed,'jog');assert.equal(ui.state().battle.id,saved.battle.id);
 ui.resume();ui.click(ui.get('pauseBtn'));ui.click(ui.get('pauseSpeed'));assert.equal(ui.get('speedPanel').classList.contains('mapSpeedMenu'),false);assert.equal(ui.get('speedPanel').getAttribute('aria-modal'),'true');
 console.log('PASS icon speed dropdown toggles, closes on Escape/outside click, persists choices and leaves Pause as a dialog');
}
for(const [random,question,answer] of [
 [()=>0,'What is three hundred minus forty?',260],
 [()=>.999999,'What is nine hundred and ninety-nine minus two hundred and forty-nine?',750],
 [(()=>{const values=[226.01/700,108.01/210];let i=0;return ()=>values[i++%2];})(),'What is five hundred and twenty-six minus one hundred and forty-eight?',378]
]){
 const ui=boot(impactSave(),{random});ui.click(ui.get('mapParents'));assert.equal(ui.get('parentQuestion').textContent,question);assert.doesNotMatch(question,/\d/);assert.equal(parentGateAnswer(ui),answer);
 for(const invalid of ['', '0', '0x'+answer.toString(16), String(answer)+'.0',String(answer)+'e0','not a number']){ui.get('parentAnswer').value=invalid;ui.click(ui.get('parentUnlock'));assert.equal(ui.get('parentGate').hidden,false);assert.equal(ui.state().screen,'campaignMap');}
 ui.click(ui.get('parentCancel'));ui.get('parentAnswer').value=String(answer);ui.click(ui.get('parentUnlock'));assert.equal(ui.state().screen,'campaignMap');
 ui.click(ui.get('mapParents'));ui.get('parentAnswer').value=' '+answer+' ';ui.click(ui.get('parentUnlock'));assert.equal(ui.state().screen,'parentDashboard');assert.equal(ui.get('parentGate').hidden,true);
}
console.log('PASS written three-digit subtraction gate: boundaries, example, invalid input, cancel and correct answer');
for(const [enemyId,total] of [['acorn-imp--2',14],['moon-moth--3',15],['bark-beetle--3',25]]){
 const s=impactSave(),count=Content.enemyAt(enemyId).count;
 Object.assign(s.battle,{enemyId,maxHealth:total,enemyHealth:total-Content.enemyMembers(enemyId,total)[0].maxHealth+1});
 const ui=boot(s,{heldNarration:true,geometry:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 const alive=()=>ui.get('enemyFace').querySelectorAll('.enemyMember:not(.retired)').length;
 assert.equal(alive(),count);assert.equal(ui.get('enemyFace').querySelectorAll('.enemyRig').length,count);
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));
 assert.equal(alive(),count,'hold all members through narration');ui.finishSpeech();
 assert.equal(ui.get('enemyFace').querySelectorAll('.memberMotion.enemyHit').length,1);
 ui.elapse(659);assert.equal(alive(),count);ui.elapse(1);assert.equal(alive(),count-1);
 assert.equal(ui.get('enemyFace').querySelectorAll('.retiring').length,1);
 const saved=ui.state();ui.click(ui.get('pauseBtn'));assert.equal(alive(),count-1);assert.equal(ui.get('enemyFace').querySelectorAll('.retiring').length,0);
 const reopened=boot(saved,{heldNarration:true});reopened.resume();assert.equal(reopened.get('enemyFace').querySelectorAll('.enemyMember:not(.retired)').length,count-1);
}
console.log('PASS groups of 2/3/5: one target, impact retirement, pause and reload retain defeated members');
for(const reducedMotion of [false,true]){
 const s=impactSave();Object.assign(s.battle,{enemyId:'bark-beetle--3',maxHealth:25,enemyHealth:1});
 const ui=boot(s,{heldNarration:true,reducedMotion});ui.resume();ui.ready();const q=ui.state().battle.question;
 assert.equal(ui.get('enemyFace').querySelectorAll('.enemyMember:not(.retired)').length,1);
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));ui.finishSpeech();
 if(!reducedMotion)ui.elapse(660);
 assert.equal(ui.get('enemyFace').querySelectorAll('.enemyMember:not(.retired)').length,0);
 assert.equal(ui.get('enemyCount').textContent,'0 / 25');assert.equal(ui.state().battle.enemyHealth,0);
 ui.elapse(reducedMotion?1310:650);assert.ok(ui.state().result?.victory||ui.state().activity==='mathIntro');
}
console.log('PASS last group member resolves exactly once, including reduced motion');
{
 const s=impactSave();Object.assign(s.battle,{enemyId:'bark-beetle--3',maxHealth:25,enemyHealth:5,heroHealth:0});
 Core.resolveBattle(s,Date.UTC(2026,8,25));const ui=boot(s);ui.resume();
 assert.equal(ui.get('resultRetreat').hidden,false);assert.equal(ui.get('defeatScene').hidden,true);assert.equal(ui.state().battle.enemyHealth,5);
 console.log('PASS defeat escape shows surviving group members without reviving retired creatures');
}

{
 const ui=boot(impactSave()),before=ui.state();
 ui.click(ui.get('mapStoryPilot'));
 assert.deepEqual(ui.destinations,['assets/story-pilot/']);
 const after=ui.state();
 for(const key of ['battle','profile','dragon','chapters','learning','assessment'])assert.deepEqual(after[key],before[key],key+' preserved when opening stories');
 const blocked=boot(impactSave());blocked.setFailWrites(true);blocked.click(blocked.get('mapStoryPilot'));assert.deepEqual(blocked.destinations,[]);
 console.log('PASS story pilot map entry saves existing adventure and blocks on save failure');
}

// New whole-frame rendering still runs through the real answer and cancellation handlers.
function motionSave(enemy){const s=impactSave(enemy),hp={'thornling--3':18,'moss-golem--3':24,'bark-beetle--2':12}[enemy],now=Date.UTC(2026,8,22);Core.startBattle(s,now,{strength:hp,enemyId:enemy});s.battle.introPending=false;Core.prepareBattle(s,now);return s;}
for(const enemy of ['thornling--3','moss-golem--3','bark-beetle--2'])for(const correct of [true,false]){
 const s=motionSave(enemy),hp=s.battle.maxHealth,ui=boot(s,{motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();
 assert.equal(ui.get('battleHeroImg').dataset.motionActor,'mage');
 assert.equal(ui.document.querySelector('.motionOverlay'),null,'reading must be still');
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>correct?b.textContent===q.target:b.textContent!==q.target));ui.finishSpeech();
 assert.ok(ui.document.querySelector('.motionOverlay'),'whole-frame animation should start after narration');ui.elapse(500);
 assert.equal(ui.get('enemyCount').textContent,hp+' / '+hp);assert.ok(ui.motionDraws.length>0);
 ui.elapse(200);assert.equal(ui.get('enemyCount').textContent,(correct?hp-1:hp)+' / '+hp);
 if(enemy==='bark-beetle--2')assert.equal(ui.get('enemyFace').querySelectorAll('.memberMotion[style*="hidden"]').length,1,'only the active member is replaced by animated frames');
 ui.click(ui.get('pauseBtn'));assert.equal(ui.document.querySelector('.motionOverlay'),null);ui.elapse(1500);assert.equal(ui.document.querySelector('.motionOverlay'),null);
 assert.equal(ui.state().campaign.battleRecords.length,1);
}
console.log('PASS whole-frame mage and three enemies use the real one-hit timeline and stop on Pause');
for(const options of [{failedMotion:true},{reducedMotion:true}]){
 const ui=boot(motionSave('bark-beetle--2'),{...options,motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));ui.finishSpeech();assert.equal(ui.document.querySelector('.motionOverlay'),null);ui.elapse(700);assert.equal(ui.state().battle.enemyHealth,11);
}
console.log('PASS unavailable frame images and reduced motion preserve feedback, saved damage and progression');

{
 const s=motionSave('bark-beetle--2');s.battle.enemyHealth=9;const ui=boot(s,{motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));ui.finishSpeech();ui.elapse(500);assert.equal(ui.get('enemyFace').querySelectorAll('.retired').length,0);
 ui.elapse(200);assert.equal(ui.get('enemyFace').querySelectorAll('.retired').length,1);assert.equal(ui.get('enemyCount').textContent,'8 / 12');
 ui.click(ui.get('homeBtn'));assert.equal(ui.document.querySelector('.motionOverlay'),null);assert.equal(ui.state().battle.enemyHealth,8);
}
{
 const s=motionSave('moss-golem--3');s.battle.heroHealth=1;const ui=boot(s,{motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));ui.finishSpeech();ui.elapse(1450);
 assert.equal(ui.state().battle.heroHealth,0);assert.ok(ui.document.querySelector('.motionOverlay'),'kneeling defeat holds until the learner continues');
 assert.ok(ui.motionDraws.some(url=>url.includes('mage-defeat')));ui.click(ui.get('homeBtn'));assert.equal(ui.document.querySelector('.motionOverlay'),null);
}
console.log('PASS a single beetle retires at impact and a final-heart mage defeat holds until navigation');

{
 const s=motionSave('thornling--3');s.battle.enemyHealth=1;const ui=boot(s,{motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));ui.finishSpeech();ui.elapse(550);
 assert.ok(ui.motionDraws.some(url=>url.includes('pip-fire')),'Pip uses aimed whole-frame fire pose');assert.ok(ui.motionDraws.some(url=>url.includes('mage-assistCast')),'mage uses his distinct braced staff cast when Pip joins');assert.equal(ui.get('enemyCount').textContent,'1 / 18');
 ui.elapse(150);assert.equal(ui.get('enemyCount').textContent,'0 / 18');assert.equal(ui.state().campaign.battleRecords.length,1);ui.click(ui.get('homeBtn'));assert.equal(ui.document.querySelector('.motionOverlay'),null);
}
console.log('PASS Pip finisher joins one saved hit and stops with the rest of the reaction');

for(const enemy of Content.enemyVariants){
 const s=impactSave(enemy.id),hp=enemy.minHealth;Core.startBattle(s,Date.UTC(2026,8,22),{strength:hp,enemyId:enemy.id});s.battle.introPending=false;Core.prepareBattle(s,Date.UTC(2026,8,22));s.profile.heroClass='Knight';s.profile.gender='girl';
 const ui=boot(s,{motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();
 assert.equal(ui.get('battleHeroImg').dataset.motionActor,'mage',enemy.id);assert.equal(ui.state().profile.heroClass,'Knight');assert.equal(ui.state().profile.gender,'girl');
 assert.ok(ui.document.querySelector('[data-motion-actor="'+({'moss-golem':'golem','bark-beetle':'beetle'}[enemy.family]||enemy.family)+'"]'),enemy.id);
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));ui.finishSpeech();assert.ok(ui.document.querySelector('.motionOverlay'),enemy.id);ui.elapse(680);
 assert.ok(ui.motionDraws.some(url=>url.includes('-attack')),enemy.id);assert.equal(ui.state().battle.heroHealth,s.battle.heroHealth-1);
 ui.click(ui.get('homeBtn'));assert.equal(ui.document.querySelector('.motionOverlay'),null);
}
console.log('PASS all 79 variants animate counterattacks as the male mage while preserving saved hero preferences');
{
 const s=impactSave();Core.startBattle(s,Date.UTC(2026,8,22),{strength:32});s.battle.introPending=false;Core.prepareBattle(s,Date.UTC(2026,8,22));
 let ui=boot(s,{heldNarration:true});ui.resume();ui.ready();const q=ui.state().battle.question;
 assert.equal(ui.get('heroHearts').getAttribute('aria-label'),'10 of 10 hearts');
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));
 assert.equal(ui.state().battle.heroHealth,9);assert.equal(ui.get('heroHearts').querySelector('.heartCount').textContent,'10 / 10');
 ui.finishSpeech();ui.elapse(700);assert.equal(ui.get('heroHearts').querySelector('.heartCount').textContent,'9 / 10');
 ui=boot(ui.state());ui.resume();assert.equal(ui.get('heroHearts').getAttribute('aria-label'),'9 of 10 hearts');
 ui.click(ui.get('homeBtn'));ui.click(ui.get('mapParents'));ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
 assert.match(ui.get('parentChallenge').textContent,/75–85%/);assert.match(ui.get('parentChallenge').textContent,/Familiar words flash at the chosen pace/);assert.match(ui.get('parentChallenge').textContent,/Help requests/);
 console.log('PASS adaptive battle hearts display only at impact and survive reload; Parents explains automatic challenge');
}
{
 // 2 October 2026: after a win at the 32-HP ceiling there is no Stronger card, so two families are offered.
 const s=impactSave();s.campaign.enemyHistory=[];Core.startBattle(s,Date.UTC(2026,8,22),{strength:32,enemyId:'storm-griffin--3'});
 s.battle.enemyHealth=0;s.battle.heroHealth=5;Core.prepareBattle(s,Date.UTC(2026,8,22));
 const ui=boot(s);ui.resume();assert.ok(ui.get('result').classList.contains('active'));
 const cards=[...ui.get('opponents').children];assert.equal(cards.length,2);
 assert.deepEqual(cards.map(card=>card.querySelector('.opponentName').textContent.trim()),['= Same','= Same']);
 const enemies=cards.map(card=>Content.enemyAt(card.dataset.enemy));assert.notEqual(enemies[0].family,enemies[1].family);
 assert.ok(enemies.every(e=>e.family!=='storm-griffin'&&32>=e.minHealth&&32<=e.maxHealth),enemies.map(e=>e.id).join());
 ui.click(cards[1]);assert.equal(ui.state().battle.maxHealth,32);assert.equal(ui.state().battle.enemyId,enemies[1].id);assert.equal(ui.state().battle.heroMaxHealth,10);
 console.log('PASS the 32-HP ceiling offers two different non-griffin families after a win');
}
{
 // Familiar words flash faster after sustained success; new words keep the chosen pace; Parents reports it.
 const s=impactSave();s.settings.speed='walk';s.learning.challengePace={steps:2,since:0};
 Core.startBattle(s,Date.UTC(2026,8,22),{strength:8});s.battle.introPending=false;
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();ui.click(ui.get('homeBtn'));ui.click(ui.get('mapParents'));ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
 assert.match(ui.get('parentChallenge').textContent,/Familiar words now flash for 1\.20 s \(2 steps faster than the chosen 1\.80 s\); new words keep the chosen pace\./);
 console.log('PASS Parents reports the automatic familiar-word pace');
}
{
 // Reading-riddle time from Story adventures appears as its own column and total; other totals exclude it.
 const s=impactSave(),today=Core.dayKey(Date.UTC(2026,8,22));s.timing.days={[today]:{practice:600000,math:60000,assessment:0,demo:0,idle:0}};
 const ui=boot(s,{heldNarration:true});
 ui.memory.set(Core.RIDDLE_KEY,JSON.stringify({version:2,revision:3,activeId:'x',stories:{},time:{days:{[today]:185000,'2026-09-20':61000,'bad':5,'2026-09-19':-4},idleMs:300000}}));
 const pilotBefore=ui.memory.get(Core.RIDDLE_KEY);
 ui.resume();ui.ready();ui.click(ui.get('homeBtn'));ui.click(ui.get('mapParents'));ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
 assert.equal(ui.get('parentRiddles').textContent,'4 min 06 sec');assert.equal(ui.get('parentRiddlesToday').textContent,'Today: 3 min 05 sec');
 assert.match(ui.get('parentToday').textContent,/^11 min 0\d sec$/,'riddle time (3 min 05 sec) stays out of active play');
 const head=[...ui.document.querySelectorAll('#parentDays')[0].closest('table').querySelectorAll('th')].map(th=>th.textContent);
 assert.deepEqual(head,['Date on this device','Reading practice','Reading riddles','Multiplication','Reading check + demo','Idle excluded']);
 const rows=[...ui.get('parentDays').children].map(row=>[...row.children].map(cell=>cell.textContent));
 rows[0][1]=rows[0][1].replace(/^10 min 0\d sec$/,'10 min 00 sec');assert.deepEqual(rows,[[today,'10 min 00 sec','3 min 05 sec','1 min 00 sec','0 min 00 sec','0 min 00 sec'],['2026-09-20','0 min 00 sec','1 min 01 sec','0 min 00 sec','0 min 00 sec','0 min 00 sec']]);
 assert.equal(ui.get('parentEmpty').hidden,true);assert.equal(ui.memory.get(Core.RIDDLE_KEY),pilotBefore,'Parents never writes the story save');
 ui.memory.set(Core.RIDDLE_KEY,'{broken');ui.click(ui.get('parentHome'));ui.click(ui.get('mapParents'));ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
 assert.equal(ui.get('parentRiddles').textContent,'Unreadable');assert.match(ui.get('parentRiddlesToday').textContent,/left unchanged/);assert.equal(ui.get('parentDays').children.length,1);assert.equal(ui.memory.get(Core.RIDDLE_KEY),'{broken');
 console.log('PASS Parents shows reading-riddle time separately without changing the story save');
}
// Mission flows use the new default hub; the earlier tests explicitly cover Word trails.
function missionButton(ui,label){return [...ui.get('mission').querySelectorAll('button')].find(b=>b.textContent===label);}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 let ui=boot(s,{adventures:true});assert.ok(ui.get('adventureHub').classList.contains('active'));
 ui.click(ui.get('adventureHub').querySelector('[data-mission="first-spark"]'));assert.equal(ui.state().expedition.current.phase,'intro');
 ui.click(missionButton(ui,'Let’s go'));assert.equal(ui.state().battle.maxHealth,8);assert.equal(ui.state().battle.missionId,'first-spark');
 ui.ready();const pending=ui.state().battle.question;ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true});ui.click(ui.get('missionResume'));ui.ready();assert.equal(ui.state().battle.question.id,pending.id);assert.deepEqual(ui.state().battle.question.options,pending.options);
 console.log('PASS new hub starts an eight-hit mission and resumes the same saved reading question');
}
{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;
 Core.startMission(s,'first-spark',now);Core.startMissionBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);A.startPuzzle(s,()=>.5);
 let ui=boot(s,{adventures:true,heldNarration:true});ui.click(ui.get('missionResume'));ui.elapse(45000,true);
 ui.click(ui.get('mission').querySelector('[data-choice="red"]'));assert.equal(A.report(ui.state()).riddleMs,45000);
 ui.click(missionButton(ui,'Try it'));assert.equal(ui.state().expedition.current.puzzle.first.correct,false);const order=ui.state().expedition.current.puzzle.order;
 ui.click(missionButton(ui,'Listen'));ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true});ui.click(ui.get('missionResume'));
 assert.deepEqual(ui.state().expedition.current.puzzle.order,order);assert.equal(ui.state().expedition.current.puzzle.listened,true);
 ui.click(missionButton(ui,'Show me how'));assert.equal(ui.state().expedition.current.puzzle.assisted,true);assert.equal(ui.get('mission').querySelector('.riddleSuccessTitle').textContent,'Answer revealed');assert.ok(ui.get('mission').querySelector('.riddleOption.correct .riddleAnswerMark'));assert.equal(ui.state().expedition.book.thornling.studied,true);
 ui.click(missionButton(ui,'Follow the trail'));assert.equal(ui.state().expedition.current.step,1);ui.click(ui.get('homeBtn'));
 ui.click(ui.get('adventureHub').querySelector('.bookLauncher'));ui.click(ui.get('creatureBook').querySelector('[data-family="thornling"]'));
 ui.click([...ui.get('creatureBook').querySelectorAll('button')].find(b=>b.textContent==='Choose for my team'));assert.equal(ui.state().expedition.favourite,'thornling');
 const backup=Storage.readBackup(Storage.backupFile(ui.state()).text).state;assert.equal(backup.expedition.favourite,'thornling');assert.equal(backup.expedition.missions['first-spark'].riddles['spark-bag'].first.correct,false);
 console.log('PASS riddle timing, wrong first evidence, help, collection and favourite survive reopen and backup');
}
{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,8,22);s.profile.name='Reader';s.assessment.done=true;
 Core.startMission(s,'first-spark',now);s.expedition.current.step=2;Core.startMissionBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);A.startPuzzle(s);
 let ui=boot(s,{adventures:true});ui.click(ui.get('missionResume'));const answer=A.Data.puzzles[ui.state().expedition.current.puzzle.id].answer;
 ui.click(ui.get('mission').querySelector('[data-choice="'+answer[0]+'"]'));ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true});ui.click(ui.get('missionResume'));assert.equal(ui.state().expedition.current.puzzle.selection.length,1);
 for(const id of answer.slice(1))ui.click(ui.get('mission').querySelector('[data-choice="'+id+'"]'));ui.click(missionButton(ui,'Try it'));assert.equal(ui.get('mission').querySelector('.riddleSuccessTitle').textContent,'Correct!');assert.equal(ui.get('mission').querySelectorAll('.riddleOption.correct').length,answer.length);assert.ok(ui.get('mission').querySelector('.riddleSequence.solved'));ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true});ui.click(ui.get('missionResume'));assert.equal(ui.get('mission').querySelector('.riddleSuccessTitle').textContent,'Correct!');ui.click(missionButton(ui,'Follow the trail'));
 const last=ui.state();Core.startMissionBattle(last,now);last.battle.enemyHealth=0;Core.resolveBattle(last,now);A.startPuzzle(last);ui=boot(last,{adventures:true});ui.click(ui.get('missionResume'));ui.click(ui.get('mission').querySelector('[data-choice="sun"]'));ui.click(missionButton(ui,'Try it'));ui.click(missionButton(ui,'Claim the treasure'));
 assert.equal(ui.state().expedition.current.phase,'complete');assert.ok(A.unlocked(ui.state(),'moth-post'));assert.ok(A.unlocked(ui.state(),'root-workshop'));
 ui.click(missionButton(ui,'Choose another mission'));assert.ok(ui.get('adventureHub').classList.contains('active'));
 console.log('PASS partial ordering resumes exactly and claiming treasure unlocks both branch choices');
}
{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;Core.startBattle(s,Date.UTC(2026,8,22));Core.prepareBattle(s,Date.UTC(2026,8,22));
 const ui=boot(s,{adventures:true}),old=ui.state().battle;ui.setFailWrites(true);ui.click(ui.get('adventureHub').querySelector('[data-mission="first-spark"]'));
 assert.equal(ui.state().expedition.current,null);assert.deepEqual(ui.state().battle,old);assert.equal(ui.get('saveNotice').hidden,false);
 console.log('PASS failed save blocks the mission switch and retains the original learner encounter');
}
{
 const now=Date.UTC(2026,9,4),s=Core.migrate(Core.fresh()),A=Core.Adventure;s.profile={name:'Reader',age:7,gender:'boy',heroClass:'Mage'};s.assessment.done=true;s.demoComplete=true;
 for(const word of Object.values(s.learning.words)){word.familiar=true;word.introducedAt=new Date(now).toISOString();word.independentCorrect=2;}
 Core.startMission(s,'first-spark',now);A.reveal(s,'moon-moth',now);A.selectCompanion(s,'moon-moth');
 let ui=boot(s,{adventures:true,heldNarration:true});ui.click(ui.get('missionResume'));
 assert.match(ui.get('mission').textContent,/0 of 8 steps done · 8 left/);assert.match(ui.get('mission').textContent,/4 \/ 4 hearts/);assert.match(ui.get('mission').textContent,/On your side: Moon Moth/);
 ui.click(missionButton(ui,'Change animal'));assert.match(ui.get('creatureBook').textContent,/◆ Met: meet this friend/);assert.match(ui.get('creatureBook').textContent,/✦ Clue: solve its clue/);assert.match(ui.get('creatureBook').textContent,/★ Star: win its big fight/);
 ui.click([...ui.get('creatureBook').querySelectorAll('button')].find(b=>b.textContent==='← Back to mission'));ui.click(missionButton(ui,'Let’s go'));ui.ready();
 assert.equal(ui.get('battleCompanion').hidden,false);assert.equal(ui.get('battleCompanionName'),null);assert.equal(ui.get('battleCompanion').getAttribute('aria-label'),'Moon Moth companion');assert.match(ui.get('battleChapter').textContent,/0 of 8/);
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent!==q.target));
 assert.equal(ui.get('feedback').textContent,'Moon Moth saved a heart!');assert.equal(ui.get('battleCompanionHelp'),null);assert.equal(ui.state().battle.heroHealth,4);
 assert.equal(ui.speechTexts.at(-1),'Moon Moth stopped the hit.');ui.finishSpeech();ui.finishSpeech();assert.ok(ui.get('battleCompanion').classList.contains('protecting'));
 ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true});ui.click(ui.get('missionResume'));assert.equal(ui.get('battleCompanionHelp'),null);assert.equal(ui.get('battleCompanion').classList.contains('protecting'),false);
 assert.equal(ui.state().campaign.battleRecords.length,1);
 const loss=ui.state();loss.battle.heroHealth=0;Core.resolveBattle(loss,now);ui=boot(loss,{adventures:true});ui.click(ui.get('missionResume'));
 assert.match(ui.get('resultMessage').textContent,/Try the first step again/);assert.match(ui.get('resultChapter').textContent,/8 left/);
 ui.click([...ui.get('opponents').children].find(b=>b.textContent==='Try again · 4 hearts'));assert.equal(ui.state().battle.heroHealth,4);assert.equal(ui.state().expedition.current.companionHelpUsed,true);
 console.log('PASS visible eight-step quest, heart pool, book legend, chosen battle ally, protection feedback and saved retry');
}
{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,9,6);s.profile.name='Reader';s.assessment.done=true;
 Core.startMission(s,'first-spark',now);Core.startMissionBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);A.startPuzzle(s);
 s.expedition.current.puzzle={...s.expedition.current.puzzle,id:'post-code',order:['4','6','7','8']};s.expedition.current.hearts=1;
 let ui=boot(s,{adventures:true});ui.click(ui.get('missionResume'));
 for(const b of ui.get('mission').querySelectorAll('.numberOption'))assert.equal(b.textContent,b.dataset.choice);
 ui.click(ui.get('mission').querySelector('[data-choice="4"]'));ui.click(missionButton(ui,'Try it'));
 assert.equal(ui.state().expedition.current.hearts,0);assert.match(ui.get('resultMessage').textContent,/No hearts left/);assert.equal(ui.get('resultRetreat').hidden,false);
 ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true});ui.click(ui.get('missionResume'));assert.equal(ui.state().expedition.current.hearts,0);
 ui.click([...ui.get('opponents').children].find(b=>b.textContent==='Try again · 4 hearts'));assert.equal(ui.state().expedition.current.hearts,4);assert.equal(ui.state().expedition.missions['first-spark'].riddles['post-code'].first.correct,false);assert.equal(ui.state().activity,'battle');
 console.log('PASS single number labels, saved zero-heart rest and Continue inside success feedback');
}
{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,9,6);s.profile.name='Reader';s.assessment.done=true;
 for(const id of ['first-spark','moth-post','root-workshop'])A.stats(s,id).completedAt=new Date(now).toISOString();
 Core.startMission(s,'mimic-vault',now);
 let ui=boot(s,{adventures:true});ui.click(ui.get('missionResume'));
 assert.match(ui.get('mission').textContent,/The Boy and the Map/);assert.match(ui.get('mission').querySelector('.missionScene img').src,/wizard-map-awakens/);
 const next=ui.state();next.expedition.current.step=1;ui=boot(next,{adventures:true});ui.click(ui.get('missionResume'));assert.match(ui.get('mission').querySelector('.missionScene img').src,/wizard-map-crossing/);assert.match(ui.get('mission').textContent,/takes his book to the stream/);
 const final=ui.state();final.expedition.current.phase='complete';final.expedition.missions['mimic-vault'].completedAt=new Date(now).toISOString();ui=boot(final,{adventures:true});ui.click(ui.get('adventureHub').querySelector('[data-mission="mimic-vault"]'));
 assert.match(ui.get('mission').querySelector('.missionScene img').src,/wizard-map-awakens/);
 console.log('PASS mapmaker cover and step-specific scene/text, completed mission replay keeps chapter identity');
}
for(const chosen of ['made','wade'])for(const options of [['made','wade','have','hide'],['hide','have','wade','made']]){
 const s=impactSave(),q=s.battle.question;q.target='have';q.options=options;q.isNew=false;q.supportReasons=[];q.phase='choices';s.learning.words.have.introducedAt=new Date().toISOString();s.learning.words.have.independentCorrect=3;
 const ui=boot(s,{heldNarration:true});ui.resume();ui.ready();const b=[...ui.get('battleAnswers').children].find(b=>b.textContent===chosen);ui.click(b);
 assert.equal(ui.state().battle.question.firstResponse,chosen);assert.equal(ui.state().campaign.battleRecords.at(-1).firstResponse,chosen);assert.equal(ui.get('battleScroll').querySelector('.selectedWord .correctionLetters').textContent,chosen);assert.ok(ui.speechTexts.some(t=>t.includes('You chose '+chosen+'.')));
 const count=ui.state().campaign.battleRecords.length;b.onclick();assert.equal(ui.state().campaign.battleRecords.length,count);
}
console.log('PASS made and wade preserve the displayed selection, saved evidence, spoken and written correction across positions');

{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,8,22,12);s.profile.name='Reader';s.assessment.done=true;
 Core.startMission(s,'first-spark',now);Core.startMissionBattle(s,now);s.battle.enemyHealth=0;Core.resolveBattle(s,now);A.startPuzzle(s);
 Core.recordTime(s,480000,'practice',now);
 let ui=boot(s,{adventures:true,now});ui.click(ui.get('missionResume'));ui.advance(150000);ui.click(missionButton(ui,'A clue, please'));
 assert.equal(A.report(ui.state()).riddleMs,150000);assert.equal(Core.bonusProgress(ui.state(),now).active,true);
 ui.click(ui.get('pauseBtn'));ui.advance(300000);assert.equal(A.report(ui.state()).riddleMs,150000);
 ui.click(ui.get('pauseResume'));ui.advance(10000);ui.visibility(true);ui.advance(300000);ui.visibility(false);ui.click(ui.get('pauseResume'));
 ui.advance(120000,true);ui.click(missionButton(ui,'A clue, please'));assert.equal(A.report(ui.state()).riddleMs,160000,'sleep is excluded');
 ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true,now});ui.click(ui.get('missionResume'));ui.advance(60000);ui.click(missionButton(ui,'A clue, please'));
 assert.equal(A.report(ui.state()).riddleMs,180000);assert.equal(ui.get('pausePanel').hidden,true);
 ui.click(ui.get('mission').querySelector('[data-choice="blue"]'));ui.click(missionButton(ui,'Try it'));
 assert.equal(ui.state().expedition.current.puzzle.xpEarned,88);assert.match(ui.get('mission').textContent,/\+88 XP/);
 console.log('PASS long thinking, cap, pause, background, sleep, reload and boosted riddle reward');
}
{
 const ui=boot(impactSave());ui.click(ui.get('mapParents'));ui.get('parentAnswer').value=String(parentGateAnswer(ui));ui.click(ui.get('parentUnlock'));
 const before=ui.state();ui.click(ui.get('parentAddXP'));assert.equal(ui.state().dragon.xp,before.dragon.xp+1000);
 assert.deepEqual(ui.state().learning,before.learning);assert.match(ui.get('parentXPStatus').textContent,/Added 1,000 XP/);
 ui.click(ui.get('parentAddXP'));assert.equal(ui.state().dragon.xp,before.dragon.xp+2000);
 const reloaded=boot(ui.state());assert.equal(reloaded.state().dragon.xp,before.dragon.xp+2000);
 ui.setFailWrites(true);ui.click(ui.get('parentAddXP'));assert.equal(ui.state().dragon.xp,before.dragon.xp+2000);assert.equal(ui.get('saveNotice').hidden,false);
 console.log('PASS parent XP button saves exact repeatable awards and blocks on storage failure');
}
{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,9,7);s.profile.name='Reader';s.assessment.done=true;
 for(const id of A.Data.campaigns[0].missions.slice(0,5))A.stats(s,id).completedAt=new Date(now).toISOString();
 Core.startMission(s,'oak-heart',now);
 for(const [step,name] of ['departure','passage','treasure','homecoming'].entries()){
  s.expedition.current.step=step;s.expedition.current.phase='intro';
  let ui=boot(s,{adventures:true});ui.click(ui.get('missionResume'));
  assert.match(ui.get('mission').querySelector('.missionScene img').src,new RegExp('kind-shark-'+name));assert.match(ui.get('mission').textContent,/shark/i);
  const next=ui.state();Core.startMissionBattle(next,now);next.battle.enemyHealth=0;Core.resolveBattle(next,now);A.startPuzzle(next);
  ui=boot(next,{adventures:true});ui.click(ui.get('missionResume'));const q=A.Data.byId['oak-heart'].riddles[step];
  for(const id of [q.answer].flat())ui.click(ui.get('mission').querySelector('[data-choice="'+id+'"]'));
  ui.click(missionButton(ui,'Try it'));assert.equal(ui.state().expedition.current.puzzle.solved,true);
  ui.click(missionButton(ui,step===3?'Claim the treasure':'Follow the trail'));
  if(step===3){assert.match(ui.get('mission').textContent,/Thank you, kind shark/);assert.match(ui.get('mission').querySelector('.missionScene img').src,/kind-shark-homecoming/);assert.equal(A.campaignComplete(ui.state(),'lost-lights'),true);}
 }
 console.log('PASS kind shark chapter four scenes and riddles, saved reload and forest finale');
}
{
 const s=impactSave(),target=s.battle.question.target;
 s.battle.helpCounts={[target]:2};s.battle.requiredAnswers=[target];
 let ui=boot(s);ui.resume();ui.ready();assert.equal(ui.get('battleUnsure').hidden,true);
 ui.get('battleUnsure').onclick();assert.equal(ui.state().battle.question.answeredAt,null);
 ui=boot(ui.state());ui.resume();ui.ready();assert.equal(ui.get('battleUnsure').hidden,true);
 ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===target));
 assert.deepEqual(ui.state().battle.requiredAnswers,[]);
 console.log('PASS twice-skipped word requires a choice after reopen and rejects hidden help callbacks');
}

// Expansion teaching is usable even when no image or recording is available.
for(const word of ['has','zero','eight','fifteen','thousand','second',"can't","I'll",'Wednesday','live','sat']){
 const s=impactSave(),item=Core.byWord[word];s.battle.question={...s.battle.question,target:word,options:item.d,phase:'feedback',answeredAt:new Date().toISOString(),correct:false,needsTeaching:true};
 Core.startTeaching(s,word,'battle',Date.UTC(2026,9,9));
 let ui=boot(s,{heldNarration:true,pendingImages:true});ui.resume();
 assert.equal(ui.get('teachWordLesson').hidden,false);assert.equal(ui.get('teachWordLabel').textContent,word);
 assert.equal(ui.get('teachContinue').disabled,false);assert.equal(ui.get('teachIllustration').hidden,true);
 assert.equal(ui.get('teachSentence').querySelector('.targetWord').textContent.toLowerCase(),word.toLowerCase());
 if(['zero','eight','fifteen'].includes(word))assert.equal(ui.get('teachCounters').querySelectorAll('.numberCounter').length,Number(item.teaching.symbol));
 ui.click(ui.get('teachWordListen'));assert.equal(ui.speechTexts.at(-1),item.spoken||item.w);
 ui.click(ui.get('teachHintListen'));assert.equal(ui.speechTexts.at(-1),item.teaching.tip);
 ui=boot(ui.state(),{heldNarration:true,pendingImages:true});ui.resume();assert.equal(ui.get('teachWordLabel').textContent,word);
 ui.click(ui.get('teachContinue'));assert.equal(ui.state().activity,'battle');
}
console.log('PASS 11 expansion lessons: speech, numbers, capitals, legacy sat and reload without images');

// Both chapter-selection homes launch the isolated mini-game after saving.
{
 const legacy=boot(impactSave());legacy.click(legacy.get('mapWimmelbild'));assert.equal(legacy.destinations.at(-1),'assets/wimmelbild/');
 const hub=boot(impactSave(),{adventures:true});const launch=[...hub.document.querySelectorAll('button')].find(b=>b.textContent==='⌕ Dragon path');hub.click(launch);assert.equal(hub.destinations.at(-1),'assets/wimmelbild/');
 const denied=boot(impactSave(),{failWrites:true});denied.get('mapWimmelbild').onclick();assert.equal(denied.destinations.length,0);
 console.log('PASS standalone Wimmelbild launch from both chapter homes and failed-save guard');
}
{
 const s=Core.migrate(Core.fresh()),A=Core.Adventure,now=Date.UTC(2026,9,10);s.profile.name='Reader';s.assessment.done=true;
 for(const m of A.Data.missions)if(m.id!=='crab-ferry')A.stats(s,m.id).completedAt=new Date(now).toISOString();
 Core.startMission(s,'crab-ferry',now);const c=s.expedition.current;c.step=3;c.phase='puzzle';c.puzzle={id:A.current(s).riddles[3].id,solved:true,selection:[],order:[]};
 let ui=boot(s,{adventures:true,geometry:true});ui.click(ui.get('missionResume'));ui.click(missionButton(ui,'Open the search map'));
 assert.equal(ui.get('mission').querySelector('[role="progressbar"]').getAttribute('aria-valuemax'),'9');
 const q=A.mapQuestion(ui.state());ui.click(ui.get('mission').querySelector('[data-map-choice="red"]'));ui.click(missionButton(ui,'Check my answer'));assert.equal(ui.state().expedition.current.hearts,3);assert.equal(missionButton(ui,'Check my answer').disabled,true);
 ui.click(ui.get('mission').querySelector('[data-map-choice="'+q.answer+'"]'));ui.click(missionButton(ui,'Check my answer'));assert.equal(ui.state().expedition.current.search.index,1);
 ui.click(ui.get('homeBtn'));ui=boot(ui.state(),{adventures:true,geometry:true});ui.click(ui.get('missionResume'));assert.match(ui.get('mission').querySelector('.searchHead').textContent,/question 2 of 3/);
 ui.setFailWrites(true);ui.click(ui.get('mission').querySelector('[data-map-choice="blue"]'));assert.equal(ui.state().expedition.current.search.selection,null);
 console.log('PASS ninth-task map UI, written choices, life loss, save/reload and failed-save guard');
}

{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 let ui=boot(s,{adventures:true});ui.click(ui.get('adventureHub').querySelector('.bookLauncher'));
 assert.equal(ui.get('creatureBook').querySelectorAll('.creatureTile').length,65);
 for(const e of Content.newEnemies.filter(e=>!Core.Adventure.findMission(e.id))){ui.click(ui.get('creatureBook').querySelector('[data-family="'+e.id+'"]'));assert.match(ui.get('creatureDetail').textContent,/A future chapter/);assert.ok(![...ui.get('creatureDetail').querySelectorAll('button')].some(b=>b.textContent==='Find this path'||b.textContent==='Choose for my team'));}
 Core.Adventure.reveal(s,'snow-owl',0);s.expedition.book['snow-owl'].studied=true;
 ui=boot(s,{adventures:true,heldNarration:true});ui.click(ui.get('adventureHub').querySelector('.bookLauncher'));ui.click(ui.get('creatureBook').querySelector('[data-family="snow-owl"]'));
 ui.click([...ui.get('creatureDetail').querySelectorAll('button')].find(b=>b.textContent==='Listen'));assert.equal(ui.speechTexts.at(-1),Core.Adventure.Data.lore['snow-owl'][1]);ui.finishSpeech();
 ui.click([...ui.get('creatureDetail').querySelectorAll('button')].find(b=>b.textContent==='Choose for my team'));assert.equal(ui.state().expedition.favourite,'snow-owl');
 console.log('PASS all 37 future Creature Book entries are safe and locked; revealed names, lore and companion selection work');
}
for(const e of Content.newEnemies){
 const ui=boot(impactSave(e.id),{motion:true,geometry:true,heldNarration:true});ui.resume();ui.ready();
 assert.equal(ui.get('enemyFace').dataset.motionActor,e.id);assert.equal(ui.document.querySelector('.motionOverlay'),null);
 const q=ui.state().battle.question;ui.click([...ui.get('battleAnswers').children].find(b=>b.textContent===q.target));ui.finishSpeech();ui.elapse(700);
 assert.ok(ui.motionDraws.includes(e.art.source),e.id);assert.equal(ui.state().battle.enemyHealth,3);
 ui.click(ui.get('homeBtn'));assert.equal(ui.document.querySelector('.motionOverlay'),null);assert.equal(ui.state().campaign.battleRecords.length,1);
}
console.log('PASS all 45 new enemies render through real battle feedback, score once and cancel on Home');

{
 const A=Core.Adventure,s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 let ui=boot(s,{adventures:true});const tabs=ui.get('adventureHub').querySelectorAll('.campaignTab');assert.equal(tabs.length,3);assert.ok(tabs[2].disabled);
 ui.click(ui.get('adventureHub').querySelector('.bookLauncher'));ui.click(ui.get('creatureBook').querySelector('[data-family="snow-owl"]'));
 assert.match(ui.get('creatureDetail').textContent,/The Letter from the Snow Owl/);ui.click([...ui.get('creatureDetail').querySelectorAll('button')].find(b=>b.textContent==='Find this path'));
 assert.equal(ui.get('adventureHub').querySelectorAll('.missionCard').length,8);assert.ok([...ui.get('adventureHub').querySelectorAll('.missionCard')].every(b=>b.disabled));
 for(const m of A.Data.missions.slice(0,12))A.stats(s,m.id).completedAt=new Date().toISOString();s.expedition.selectedCampaign='star-trail';
 ui=boot(s,{adventures:true});assert.match(ui.get('adventureHub').textContent,/0\/8 treasures/);assert.ok(!ui.get('adventureHub').querySelectorAll('.campaignTab')[2].disabled);
 ui.click(ui.get('adventureHub').querySelector('[data-mission="star-post"]'));assert.equal(ui.get('mission').querySelector('[role="progressbar"]').getAttribute('aria-valuemax'),'9');
 assert.match(ui.get('mission').textContent,/The Letter from the Snow Owl/);assert.equal(ui.state().expedition.current.missionId,'star-post');
 console.log('PASS third campaign lock, eight-card hub, new Creature Book path and nine-task introduction');
}
{
 const A=Core.Adventure,s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 for(const m of A.Data.missions)A.stats(s,m.id).completedAt=new Date().toISOString();s.expedition.selectedCampaign='star-trail';
 const ui=boot(s,{adventures:true});assert.match(ui.get('adventureHub').textContent,/8\/8 treasures/);assert.match(ui.get('adventureHub').textContent,/All eight pieces shine/);
 console.log('PASS eight-treasure campaign ending replaces the old six-treasure assumption');
}
