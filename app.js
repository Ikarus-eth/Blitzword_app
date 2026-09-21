(() => {
'use strict';
// One approved source image; CSS viewports preserve the exact selected pixels.
const maleHeroSheet='assets/rowanfire-boys-2026-09-21.png';
const heroAssets=[maleHeroSheet,maleHeroSheet,maleHeroSheet,'assets/hero4.webp','assets/hero5.webp','assets/hero6.webp'];
const malePortraitCrops=[{x:183,y:145},{x:636,y:145},{x:1099,y:145}];
function paintHero(element,index){
  element.classList.add('heroPortrait');
  element.setAttribute('role','img');
  element.setAttribute('aria-label',classes[index%3]+' hero');
  element.dataset.heroIndex=String(index);
  element.style.backgroundImage=`url("${heroAssets[index]}")`;
  if(index<3){
    const crop=malePortraitCrops[index];
    element.style.backgroundSize='480% 320%';
    element.style.backgroundPosition=`${100*crop.x/(1536-320)}% ${100*crop.y/(1024-320)}%`;
  }else{
    element.style.backgroundSize='cover';
    element.style.backgroundPosition='center';
  }
}
const classes=['Mage','Knight','Archer'];
const KEY='blitzword_state_v1';
const defaultState={profile:{name:'',age:7,gender:'boy',heroClass:'Mage',heroIndex:0},assessment:{done:false,records:[],level:0,exposure:1800,lastAxis:'exposure'},learning:{supportedWords:[],teaching:[]},campaign:{wins:0,checkpointWins:0,enemyStrength:3,battleRecords:[]},screen:'setup'};
let state=load();
let currentBattle=null, currentAssessment=null, pendingAfterTeach=null;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s?merge(defaultState,s):structuredClone(defaultState)}catch(e){return structuredClone(defaultState)}}
function merge(a,b){const out=structuredClone(a);for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&out[k]) out[k]=merge(out[k],b[k]); else out[k]=b[k]}return out}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function show(id){$$('.screen').forEach(s=>s.classList.remove('active'));$('#'+id).classList.add('active');$('#resetBtn').style.display=['battle','assessment','teaching'].includes(id)?'none':'block';state.screen=id;save()}
function heroIndex(){return (state.profile.gender==='boy'?0:3)+classes.indexOf(state.profile.heroClass)}
function speech(text){if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.78;u.pitch=.78;const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>/Daniel|Arthur|Alex|Oliver|Aaron|Tom/i.test(v.name)&&/^en/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null;speechSynthesis.speak(u)}

$$('[data-hero-index]').forEach(el=>paintHero(el,Number(el.dataset.heroIndex)));
const ages=[5,6,7,8,9,'10+'];
ages.forEach(a=>{const b=document.createElement('button');b.className='chip'+(String(state.profile.age)===String(a)?' selected':'');b.textContent=a;b.onclick=()=>{$$('#ageChoices .chip').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.profile.age=a;save()};$('#ageChoices').appendChild(b)});
$$('.genderCard').forEach(b=>{if(b.dataset.gender===state.profile.gender)b.classList.add('selected');b.onclick=()=>{$$('.genderCard').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.profile.gender=b.dataset.gender;save()}});
$('#nameInput').value=state.profile.name;
$('#setupNext').onclick=()=>{state.profile.name=$('#nameInput').value.trim()||'Hero';renderHeroes();show('hero')};
function renderHeroes(){const g=$('#heroGrid');g.innerHTML='';const offset=state.profile.gender==='boy'?0:3;classes.forEach((c,i)=>{const b=document.createElement('button');b.className='heroCard'+(state.profile.heroClass===c?' selected':'');b.innerHTML=`<span class="heroPortrait"></span><div class="heroName">${c}</div>`;paintHero(b.firstElementChild,offset+i);b.onclick=()=>{state.profile.heroClass=c;save();renderHeroes()};g.appendChild(b)});}
$('#heroNext').onclick=()=>{state.profile.heroIndex=heroIndex();paintHero($('#routeHeroImg'),heroIndex());paintHero($('#battleHeroImg'),heroIndex());paintHero($('#teachHeroImg'),heroIndex());$('#routeName').textContent=state.profile.name+' the '+state.profile.heroClass;show('route')};
$('#tryBattle').onclick=()=>{pendingAfterTeach='demo';showTeaching(true)};
$('#checkFirst').onclick=()=>startAssessment();

function showTeaching(guided=false){paintHero($('#teachHeroImg'),heroIndex());if(guided&&!state.learning.supportedWords.includes('sat'))state.learning.supportedWords.push('sat');state.learning.teaching.push({target:'sat',guided,at:new Date().toISOString()});save();show('teaching');setTimeout(()=>speech('The hero sat on the rock.'),250);pendingAfterTeach=guided?'demo':pendingAfterTeach}
$('#teachReplay').onclick=()=>speech('The hero sat on the rock.');
$('#teachContinue').onclick=()=>{if(pendingAfterTeach==='demo'){pendingAfterTeach=null;startBattle(true)}else{const next=pendingAfterTeach;pendingAfterTeach=null;if(next==='continueBattle') nextBattleTurn(); else startAssessment()}};

const demoItems=[
{w:'sat',d:['sat','set','sap','sad'],new:true},{w:'cat',d:['cat','can','cap','cet']},{w:'can',d:['can','cat','cap','cen']},{w:'fox',d:['fox','box','fix','fax']},{w:'rock',d:['rock','lock','rack','ruck']},{w:'green',d:['green','seen','greet','grain']}
];
const assessmentPools=[
[{w:'you',d:['you','your','yuo','yue']},{w:'cat',d:['cat','can','cap','cet']},{w:'car',d:['car','cat','can','cor']},{w:'can',d:['can','cat','cap','cen']},{w:'fox',d:['fox','box','fix','fax']},{w:'map',d:['map','man','mat','mop']}],
[{w:'rock',d:['rock','lock','rack','ruck']},{w:'tree',d:['tree','free','three','trie']},{w:'green',d:['green','seen','greet','grain']},{w:'ship',d:['ship','shop','shin','chip']},{w:'cave',d:['cave','save','came','cove']},{w:'star',d:['star','scar','stay','stir']}],
[{w:'night',d:['night','light','right','nigth']},{w:'shark',d:['shark','sharp','share','shork']},{w:'bright',d:['bright','right','bring','brigt']},{w:'stone',d:['stone','store','stove','ston']},{w:'storm',d:['storm','store','story','starm']}],
[{w:'dragon',d:['dragon','drigon','wagon','drayon']},{w:'forest',d:['forest','fortest','forst','forset']},{w:'castle',d:['castle','cattle','candle','castel']},{w:'shadow',d:['shadow','shallow','shade','shado']},{w:'silver',d:['silver','sliver','river','silvar']}],
[{w:'whisper',d:['whisper','whisker','whimper','wisper']},{w:'journey',d:['journey','jersey','joyous','jorney']},{w:'lantern',d:['lantern','pattern','later','lantren']},{w:'creature',d:['creature','feature','create','creatuer']}]
];
const campaignBank=[
{w:'sat',d:['sat','set','sap','sad'],new:true},{w:'rock',d:['rock','lock','rack','ruck']},{w:'green',d:['green','seen','greet','grain']},{w:'cave',d:['cave','save','came','cove']},{w:'tree',d:['tree','free','three','trie']},{w:'fox',d:['fox','box','fix','fax']},{w:'night',d:['night','light','right','nigth']},{w:'star',d:['star','scar','stay','stir']},{w:'dragon',d:['dragon','drigon','wagon','drayon']}
];
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function renderStage(scroll,answers,item,phase,onAnswer,allowUnsure=false){answers.innerHTML='';scroll.className='scroll parchment';if(phase==='fix'){scroll.classList.add('fix');scroll.textContent='•';return}if(phase==='word'){scroll.textContent=item.w;return}if(phase==='mask'){scroll.innerHTML='<div class="mask"></div>';return}scroll.innerHTML='<div class="mask"></div>';shuffle(item.d).forEach(opt=>{const b=document.createElement('button');b.className='answer';b.textContent=opt;b.onclick=()=>onAnswer(opt);answers.appendChild(b)});if(allowUnsure) $('#assessmentUnsure').style.display='block'}

function startAssessment(){currentAssessment={asked:new Set(),level:0,exposure:1800,block:[],records:[],started:Date.now(),axis:'difficulty',question:null,choiceShown:0};$('#assessmentUnsure').style.display='none';show('assessment');nextAssessment()}
function pickAssessmentItem(){let level=currentAssessment.level;for(let guard=0;guard<6;guard++){const pool=assessmentPools[level];const available=pool.filter(x=>!currentAssessment.asked.has(x.w));if(available.length)return available[Math.floor(Math.random()*available.length)];level=Math.min(assessmentPools.length-1,level+1);currentAssessment.level=level}const all=assessmentPools.flat().filter(x=>!currentAssessment.asked.has(x.w));return all[0]||assessmentPools.at(-1)[0]}
function nextAssessment(){if(shouldStopAssessment()){finishAssessment();return}const item=pickAssessmentItem();currentAssessment.question=item;currentAssessment.asked.add(item.w);const sc=$('#assessmentScroll'),ans=$('#assessmentAnswers');$('#assessmentUnsure').style.display='none';renderStage(sc,ans,item,'fix',()=>{},false);setTimeout(()=>{renderStage(sc,ans,item,'word',()=>{},false);setTimeout(()=>{renderStage(sc,ans,item,'mask',()=>{},false);setTimeout(()=>{currentAssessment.choiceShown=performance.now();renderStage(sc,ans,item,'choices',answerAssessment,true)},220)},currentAssessment.exposure)},460)}
function answerAssessment(opt){const item=currentAssessment.question;const rt=Math.round(performance.now()-currentAssessment.choiceShown);const correct=opt===item.w;const rec={target:item.w,alternatives:item.d,firstResponse:opt,correct,exposureMs:currentAssessment.exposure,responseMs:rt,supported:false,at:new Date().toISOString(),task:'assessment'};currentAssessment.records.push(rec);currentAssessment.block.push(rec);$('#assessmentUnsure').style.display='none';$('#assessmentAnswers').innerHTML='';$('#assessmentScroll').textContent=correct?'✓':'•';setTimeout(()=>{if(currentAssessment.block.length>=4)adaptAssessment();nextAssessment()},430)}
$('#assessmentUnsure').onclick=()=>answerAssessment('?');
function adaptAssessment(){const b=currentAssessment.block.splice(0);const acc=b.filter(r=>r.correct).length/b.length;const avg=b.reduce((s,r)=>s+r.responseMs,0)/b.length;const exposureSteps=[2200,1800,1500,1200,950];let idx=exposureSteps.indexOf(currentAssessment.exposure);if(idx<0)idx=1;
  if(acc>=.75){if(currentAssessment.axis==='difficulty'&&currentAssessment.level<assessmentPools.length-1){currentAssessment.level++;currentAssessment.axis='exposure'}else if(acc===1&&avg<3400&&idx<exposureSteps.length-1){currentAssessment.exposure=exposureSteps[idx+1];currentAssessment.axis='difficulty'}}
  else if(acc<=.5){if(idx>0){currentAssessment.exposure=exposureSteps[idx-1];currentAssessment.axis='difficulty'}else if(currentAssessment.level>0){currentAssessment.level--;currentAssessment.axis='exposure'}}
}
function shouldStopAssessment(){const n=currentAssessment.records.length;if(n<8)return false;const errors=currentAssessment.records.filter(r=>!r.correct).length;const acc=(n-errors)/n;if(n>=25)return true;if(errors>=5)return true;if(n>=10&&acc<.6)return true;if(n>=12&&acc<.72)return true;if(n>=16&&acc<.88)return true;if(n>=20&&currentAssessment.level>=3&&acc>=.88)return true;return false}
function finishAssessment(){state.assessment.done=true;state.assessment.records=currentAssessment.records;state.assessment.level=currentAssessment.level;state.assessment.exposure=currentAssessment.exposure;state.assessment.completedAt=new Date().toISOString();save();startBattle(false)}

function makeCampaignItems(){const missed=(state.assessment.records||[]).filter(r=>!r.correct).map(r=>r.target);const candidates=[...new Set([...missed,...campaignBank.map(x=>x.w)])];return candidates.map(w=>campaignBank.find(x=>x.w===w)||assessmentPools.flat().find(x=>x.w===w)).filter(Boolean)}
function startBattle(demo=false,strength=null){const maxHealth=demo?5:(strength||state.campaign.enemyStrength||3);currentBattle={demo,items:demo?[...demoItems]:makeCampaignItems(),idx:0,heroHealth:3,enemyHealth:maxHealth,maxHealth,firstMistakeFree:demo,records:[],question:null,choiceShown:0,phase:'',pendingTeaching:false,supported:new Set(state.learning.supportedWords||[])};paintHero($('#battleHeroImg'),heroIndex());show('battle');renderHud();nextBattleTurn()}
function renderHud(){const hh=$('#heroHearts');hh.innerHTML='';for(let i=0;i<3;i++){const s=document.createElement('span');s.className='heart'+(i<currentBattle.heroHealth?'':' off');s.textContent='♥';hh.appendChild(s)}$('#enemyFill').style.width=(100*currentBattle.enemyHealth/currentBattle.maxHealth)+'%';$('#enemyFace').textContent=currentBattle.demo?'🌿':(currentBattle.maxHealth>=5?'👹':'🪨')}
function nextBattleTurn(){if(currentBattle.enemyHealth<=0){finishBattle(true);return}if(currentBattle.heroHealth<=0){finishBattle(false);return}const item=currentBattle.items[currentBattle.idx%currentBattle.items.length];currentBattle.idx++;currentBattle.question=item;const sc=$('#battleScroll'),ans=$('#battleAnswers');ans.innerHTML='';renderStage(sc,ans,item,'fix',()=>{});setTimeout(()=>{renderStage(sc,ans,item,'word',()=>{});const exp=currentBattle.demo?2300:(state.assessment.exposure||1800);setTimeout(()=>{renderStage(sc,ans,item,'mask',()=>{});setTimeout(()=>{currentBattle.choiceShown=performance.now();renderStage(sc,ans,item,'choices',answerBattle)},220)},exp)},460)}
function answerBattle(opt){const item=currentBattle.question;const rt=Math.round(performance.now()-currentBattle.choiceShown);const correct=opt===item.w;$('#battleAnswers').innerHTML='';const rec={target:item.w,alternatives:item.d,firstResponse:opt,correct,exposureMs:currentBattle.demo?2300:(state.assessment.exposure||1800),responseMs:rt,supported:false,at:new Date().toISOString(),task:currentBattle.demo?'demoBattle':'battle'};currentBattle.records.push(rec);
 if(correct){speech(item.w);currentBattle.enemyHealth--;renderHud();$('#feedback').textContent='✓';$('#feedback').classList.add('show');$('#battleHeroImg').classList.add('attack');$('#enemyFace').classList.add('enemyHit');setTimeout(()=>{$('#feedback').classList.remove('show');$('#battleHeroImg').classList.remove('attack');$('#enemyFace').classList.remove('enemyHit');nextBattleTurn()},720)}
 else {speech(item.w);let free=false;if(currentBattle.firstMistakeFree){currentBattle.firstMistakeFree=false;free=true}else{currentBattle.heroHealth--;renderHud();$('#battleHeroImg').classList.add('heroHit');setTimeout(()=>$('#battleHeroImg').classList.remove('heroHit'),500)}showCorrection(item.w,free)} }
function showCorrection(word,free){$('#correctWord').textContent=word;$('#correction').classList.add('show');$('#correctContinue').dataset.free=free?'1':'0'}
$('#correctReplay').onclick=()=>speech($('#correctWord').textContent);
$('#correctContinue').onclick=()=>{const w=$('#correctWord').textContent;$('#correction').classList.remove('show');if(w==='sat'&&currentBattle.question&&currentBattle.question.new&&!currentBattle.supported.has(w)){currentBattle.supported.add(w);if(!state.learning.supportedWords.includes(w))state.learning.supportedWords.push(w);save();pendingAfterTeach='continueBattle';showTeaching(false)}else nextBattleTurn()};
function finishBattle(victory){state.campaign.battleRecords.push(...currentBattle.records);if(currentBattle.demo){save();currentBattle=null;startAssessment();return}if(victory){state.campaign.wins++;if(state.campaign.wins%2===0)state.campaign.checkpointWins=state.campaign.wins}else{state.campaign.wins=state.campaign.checkpointWins}save();showResult(victory)}
function showResult(victory){show('result');$('#resultIcon').textContent=victory?'✦':'☾';$('#resultTitle').textContent=victory?'Victory!':'Try again';$('#checkpoint').textContent=state.campaign.checkpointWins?`Checkpoint: ${state.campaign.checkpointWins} wins secured`:'Keep exploring';const same=currentBattle.maxHealth;const other=victory?same+1:Math.max(3,same-1);const opp=$('#opponents');opp.innerHTML='';[[same,'↔'],[other,victory?'↑':'↓']].forEach(([hp,mark])=>{const b=document.createElement('button');b.className='opponentCard';b.innerHTML=`<div class="opponentMonster">${hp>=5?'👹':'🪨'}</div><div>${mark}</div><div class="miniHearts">${'♥'.repeat(hp)}</div>`;b.onclick=()=>{state.campaign.enemyStrength=hp;save();startBattle(false,hp)};opp.appendChild(b)});$('#resultNext').textContent='Home';$('#resultNext').onclick=()=>{renderRoute();show('route')}}
function renderRoute(){paintHero($('#routeHeroImg'),heroIndex());$('#routeName').textContent=state.profile.name+' the '+state.profile.heroClass}

$('#resetBtn').onclick=()=>{if(confirm('Reset BlitzWord on this device?')){localStorage.removeItem(KEY);location.reload()}};
window.addEventListener('load',()=>{renderHeroes();renderRoute();paintHero($('#battleHeroImg'),heroIndex());if(state.profile.name){$('#nameInput').value=state.profile.name}if(state.screen&&state.screen!=='assessment'&&state.screen!=='battle'&&state.screen!=='teaching'&&state.screen!=='result')show(state.screen);else if(state.profile.name)show('route')});
})();