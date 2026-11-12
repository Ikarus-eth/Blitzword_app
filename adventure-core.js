(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./missions.js'),require('./content.js'),{...require('./assets/wimmelbild/river-search-data.js'),...require('./assets/adventures/star-trail/search.js')});
  else root.BlitzAdventure=factory(root.BlitzMissions,root.BlitzContent,{...root.BlitzMapQuests,...root.BlitzStarMaps});
})(typeof globalThis!=='undefined'?globalThis:this,function(Data,Content,Maps){
  'use strict';
  const copy=v=>v==null?null:JSON.parse(JSON.stringify(v)),date=now=>new Date(now).toISOString();
  const empty=()=>({version:1,context:'legacy',preferLegacy:false,selectedCampaign:'lost-lights',current:null,missions:{},book:{},favourite:null,riddleDays:{},legacy:null,runtime:null});
  const valid=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const QUEST_HEARTS=4;
  function init(s){
    const old=s.expedition;
    if(old&&(!valid(old)||old.version&&old.version!==1))throw new Error('Unsupported mission save');
    const e=s.expedition={...empty(),...old};
    for(const key of ['missions','book','riddleDays'])if(!valid(e[key]))throw new Error('Invalid mission records');
    if(e.current&&!Data.byId[e.current.missionId])throw new Error('Unknown saved mission');
    if(e.parked&&!Data.byId[e.parked.missionId])e.parked=null;
    if(s.rewards&&heldShields(s)>=2&&s.rewards.supportFamily&&!s.rewards.supportFamily2)s.rewards.supportFamily2=secondFriend(s);
    if(e.current){
      // Keep hearts already earned in an older in-progress quest, even when parked in Word trails.
      const b=e.context==='mission'?s.battle:e.runtime?.battle,c=e.current;
      const matching=b?.missionId===c.missionId;
      if(!Number.isFinite(c.maxHearts))c.maxHearts=matching?(b.heroMaxHealth||Math.max(QUEST_HEARTS,b.heroHealth)):QUEST_HEARTS;
      if(!Number.isFinite(c.hearts))c.hearts=matching?b.heroHealth:c.maxHearts;
      c.companionHelpUsed=!!c.companionHelpUsed;
      if(c.ninthRequired===undefined)c.ninthRequired=(!!Maps?.[c.missionId]||!!Data.byId[c.missionId].story)&&c.phase!=='complete';
      syncMapRevision(c);
      if(Data.byId[c.missionId].stories)migrateStoryQuest(s,c);
    }
    // The old record proves an encounter, not a win or a completed creature quest.
    if(!old){
      for(const id of new Set([...(s.campaign.enemyHistory||[]).map(r=>r.enemyId),...Object.keys(s.campaign.enemyVisits||{}),s.battle?.enemyId].filter(Boolean))){
        const family=Content.enemyAt(id).family;
        if(Data.lore[family])e.book[family]={seen:true,historical:true,studied:false,champion:false};
      }
    }
    return e;
  }
  function of(s){return s.expedition||init(s);}
  function current(s){return Data.byId[of(s).current?.missionId]||null;}
  function stats(s,id=of(s).current?.missionId){
    if(!Data.byId[id])return null;
    return of(s).missions[id] ||= {wins:0,attempts:0,correct:0,activeMs:0,duels:0,riddles:{},completedAt:null,plays:0};
  }
  function campaignComplete(s,id){return Data.campaigns.find(c=>c.id===id)?.missions.every(id=>of(s).missions[id]?.completedAt)||false;}
  // Pip Grows Up (12 November 2026). From 44,000 XP, until its story is read, Pip's XP is held and quests pause.
  const GROWTH=Content.growth||{holdXP:Infinity,stage:Infinity,campaign:null};
  function isGrowth(id){return !!GROWTH.campaign&&Data.byId[id]?.campaign===GROWTH.campaign;}
  function growthRead(s){return !!GROWTH.campaign&&campaignComplete(s,GROWTH.campaign);}
  function growthHeld(s){return (s.dragon?.stage||0)<GROWTH.stage&&!growthRead(s);}
  function growthDue(s){return growthHeld(s)&&(s.dragon?.xp||0)>=GROWTH.holdXP;}
  function growthOpen(s){return growthRead(s)||(s.dragon?.xp||0)>=GROWTH.holdXP;}
  function growthNext(s){return Data.campaigns.find(c=>c.id===GROWTH.campaign)?.missions.find(id=>!of(s).missions[id]?.completedAt)||null;}
  function unlocked(s,id){
    const m=Data.byId[id];if(!m)return false;
    if(isGrowth(id))return growthOpen(s)&&m.requires.every(id=>of(s).missions[id]?.completedAt);
    if(growthDue(s))return false;
    const index=Data.campaigns.findIndex(c=>c.id===m.campaign);
    return index>=0&&Data.campaigns.slice(0,index).every(c=>c.growth||campaignComplete(s,c.id))&&m.requires.every(id=>of(s).missions[id]?.completedAt);
  }
  function snapshot(s){return copy({battle:s.battle,result:s.result,teaching:s.teaching,handoff:s.handoff,round:s.math.round,scene:s.story.scene,mapPending:s.story.mapPending,activity:s.activity,session:s.session});}
  function restore(s,r){
    const data=r||{battle:null,result:null,teaching:null,handoff:null,round:null,scene:null,mapPending:false,activity:'route',session:null};
    for(const key of ['battle','result','teaching','handoff','activity','session'])s[key]=copy(data[key]??null);
    s.math.round=copy(data.round);s.story.scene=copy(data.scene);s.story.mapPending=!!data.mapPending;
  }
  function switchTo(s,context){
    const e=of(s);if(context===e.context)return;
    if(context==='mission'){e.legacy=snapshot(s);restore(s,e.runtime);e.runtime=null;}
    else {e.runtime=snapshot(s);restore(s,e.legacy);e.legacy=null;}
    e.context=context;
  }
  // Playing a finished quest again must never hold the trail hostage: outside a live fight,
  // the replay can be left for any open quest. Its treasure stays earned (1 November 2026).
  function leavableReplay(s){
    const c=of(s).current;
    return !!(c&&c.replay&&c.phase!=='complete'&&c.phase!=='battle'&&of(s).missions[c.missionId]?.completedAt);
  }
  // A quest waiting for Pip's story is parked; it is resumed before any other quest starts.
  function parkable(s){const c=of(s).current;return !!(c&&['intro','story','retry'].includes(c.phase)&&!isGrowth(c.missionId));}
  function blocking(s,id){
    const e=of(s),c=e.current;
    if(isGrowth(id)&&c&&!isGrowth(c.missionId)&&c.phase!=='complete')return !parkable(s)&&!leavableReplay(s);
    if(c&&c.phase!=='complete'&&c.missionId!==id&&!leavableReplay(s))return true;
    return !!(e.parked&&e.parked.missionId!==id&&!isGrowth(id));
  }
  function begin(s,id,now){
    const e=of(s),m=Data.byId[id];
    // The quest already under way can always be continued; a held growth only stops new quests from starting.
    const resuming=e.current?.missionId===id&&e.current.phase!=='complete';
    if(!m||!resuming&&!unlocked(s,id)||blocking(s,id))return false;
    switchTo(s,'mission');e.preferLegacy=false;e.selectedCampaign=m.campaign;
    if(e.current?.missionId===id&&e.current.phase!=='complete')return true;
    if(e.parked?.missionId===id){e.current=e.parked;e.parked=null;s.activity='mission';return true;}
    if(isGrowth(id)&&e.current&&e.current.phase!=='complete'&&!isGrowth(e.current.missionId)&&!leavableReplay(s)){if(e.current.phase==='retry')retry(s);e.parked=copy(e.current);s.battle=null;}
    e.current={missionId:id,step:0,phase:'intro',puzzle:null,startedAt:date(now),replay:!!stats(s,id).completedAt,ninthRequired:!!Maps?.[id]||!!m.story,hearts:QUEST_HEARTS,maxHearts:QUEST_HEARTS,companionHelpUsed:false};
    stats(s,id).plays++;s.battle=null;s.result=null;s.teaching=null;s.math.round=null;s.story.scene=null;s.story.mapPending=false;s.activity='mission';return true;
  }
  function reveal(s,family,now){
    if(!Data.lore[family])return;
    const b=of(s).book[family] ||= {seen:false,studied:false,champion:false};
    const first=!b.seen;b.seen=true;b.seenAt ||= date(now);return first;
  }
  function fight(s){
    const m=current(s),c=of(s).current;if(!m||!c)return null;
    return {family:m.encounters[c.step],health:m.health[c.step],missionId:m.id,step:c.step,champion:c.step>=2};
  }
  function companion(s){const e=of(s);return e.book[e.favourite]?.seen&&Data.lore[e.favourite]?e.favourite:null;}
  function selectCompanion(s,family){
    if(!Data.lore[family]||!of(s).book[family]?.seen)return false;
    const e=of(s),previous=e.favourite;e.favourite=family;
    if(s.rewards?.earnedSupport&&s.rewards.supportFamily===family&&previous&&previous!==family)selectSupport(s,previous);
    if(s.rewards?.supportFamily2===family)s.rewards.supportFamily2=secondFriend(s);
    return true;
  }
  function supportChoices(s){
    const e=of(s),friends=Content.creatures.filter(c=>e.book[c.id]?.seen).map(c=>c.id);
    // A second individual of the same kind is possible until more friends are met.
    return friends.length>1?friends.filter(id=>id!==companion(s)):friends;
  }
  function selectSupport(s,family){
    if(!supportChoices(s).includes(family))return false;
    of(s).supportFavourite=family;
    if(s.rewards.shield&&s.rewards.earnedSupport){s.rewards.supportFamily=family;s.rewards.supportPending=false;}
    return true;
  }
  // Answers in a row needed to call a shield friend. After a lost fight in this quest the bar is lower,
  // so a child who keeps losing can still earn help (28 October 2026).
  const SUPPORT_NEED={accurate:8,quick:6},COMEBACK_NEED={accurate:5,quick:4};
  function supportNeed(s){return of(s).current?.defeats>0?COMEBACK_NEED:SUPPORT_NEED;}
  // Up to two earned shields can be held at once (4 November 2026); before, only one.
  // `rewards.shield` stays true while any is held, so older code and saves keep working.
  const MAX_SHIELDS=2;
  function heldShields(s){const r=s.rewards||{};if(r.shield!==true)return 0;const n=Math.floor(Number(r.shields));return Number.isFinite(n)?Math.max(1,Math.min(MAX_SHIELDS,n)):1;}
  function setShields(s,n){
    const r=s.rewards,k=Math.max(0,Math.min(MAX_SHIELDS,Math.floor(n)||0));r.shields=k;r.shield=k>0;
    if(!k){r.earnedSupport=false;r.supportFamily=null;r.supportPending=false;}
    if(k<2)r.supportFamily2=null;
    return k;
  }
  // One guardian at a time (12 November 2026). Each held shield has its own friend: the second shield brings a
  // second friend, who replaces the first on screen and blocks the next hit; when that shield is used, the first
  // friend comes back. With no shield, the quest companion guards. The guardian shown is always the next to block.
  function secondFriend(s){
    // Not the kind of creature being fought right now, so friend and enemy are never the same picture.
    const foe=s.battle?.enemyId?Content.enemyAt(s.battle.enemyId)?.family||s.battle.enemyId:null;
    const first=s.rewards.supportFamily,choices=supportChoices(s),others=choices.filter(id=>id!==first&&id!==foe);
    // Last resorts: the kind being fought (still a different picture from the first friend), then the first kind again.
    const liked=of(s).supportFavourite2;return others.includes(liked)?liked:others[0]||choices.find(id=>id!==first)||first||choices[0]||null;
  }
  function guardian(s){
    const r=s.rewards||{},n=heldShields(s);
    // A second friend chosen outside a fight may be the kind being fought now; then another friend comes instead.
    const foe=s.battle?.enemyId?Content.enemyAt(s.battle.enemyId)?.family||s.battle.enemyId:null;
    if(n>=2&&(r.supportFamily2||r.supportFamily)){const other=secondFriend(s),family=r.supportFamily2&&r.supportFamily2===foe?(other&&other!==foe?other:r.supportFamily||r.supportFamily2):r.supportFamily2||r.supportFamily;return {family,kind:'shield',shield:2};}
    if(n>=1&&r.supportFamily)return {family:r.supportFamily,kind:'shield',shield:1};
    const friend=s.battle?.missionId?companion(s):null;
    return friend?{family:friend,kind:'companion',used:!!of(s).current?.companionHelpUsed}:null;
  }
  // Can this fight still grant a shield? One per fight, two per attempt at the quest, two held at a time.
  function supportOpen(s){const b=s.battle,c=of(s).current;return !!(b?.missionId&&c&&!b.supportMeter?.earned&&(c.supportEarned||0)<2&&heldShields(s)<MAX_SHIELDS);}
  function earnSupport(s,rec,quick){
    const b=s.battle,c=of(s).current;
    if(b?.demo||!b?.missionId||of(s).context!=='mission'||c?.missionId!==b.missionId)return false;
    const meter=b.supportMeter ||= {accurate:0,quick:0,earned:false},need=supportNeed(s);
    if(rec.supported)return false;
    if(!rec.correct){meter.accurate=0;meter.quick=0;return false;}
    meter.accurate=Math.min(SUPPORT_NEED.accurate,meter.accurate+1);meter.quick=quick?Math.min(SUPPORT_NEED.quick,meter.quick+1):0;
    if(meter.earned||(c.supportEarned||0)>=2||heldShields(s)>=MAX_SHIELDS||meter.accurate<need.accurate&&meter.quick<need.quick)return false;
    meter.earned=true;c.supportEarned=(c.supportEarned||0)+1;
    const preferred=of(s).supportFavourite,family=supportChoices(s).includes(preferred)?preferred:null;
    const second=heldShields(s)>0;setShields(s,heldShields(s)+1);s.rewards.earnedSupport=true;
    if(!s.rewards.supportFamily&&!s.rewards.supportPending){s.rewards.supportFamily=family;s.rewards.supportPending=!family;}
    // A second shield brings a second friend, who takes the first one's place (12 November 2026).
    if(second){s.rewards.supportFamily2=secondFriend(s);b.question.secondFriend=s.rewards.supportFamily2;}
    b.question.supportEarned=true;rec.supportEarned=true;if(second){b.question.secondShield=true;rec.secondShield=true;}return true;
  }
  function protect(s){
    const e=of(s),c=e.current,friend=companion(s);
    if(e.context!=='mission'||!c||c.phase!=='battle'||s.battle?.missionId!==c.missionId||c.companionHelpUsed||!friend)return null;
    c.companionHelpUsed=true;return friend;
  }
  function syncHearts(s){
    const e=of(s),c=e.current,b=s.battle;
    if(e.context==='mission'&&c&&b?.missionId===c.missionId)c.hearts=b.heroHealth;
  }
  // Story quests run fight, fight, story, fight, fight, story (4 November 2026).
  const STORY_STEPS=['Fight','Fight','Story','Fight','Fight','Story'];
  function storyIndex(c){
    if(c.phase==='complete')return 6;
    if(c.phase==='story')return c.read?.which===0?2:5;
    return c.step<2?c.step:c.step+1;
  }
  const READ_STEPS=['Read','Questions'];
  function progress(s){
    const c=of(s).current;if(!c)return null;
    if(current(s)?.storyOnly){const done=c.phase==='complete'?2:c.phase==='story'&&c.read?.stage!=='read'?1:0;return {done,left:2-done,total:2,labels:READ_STEPS,next:done===2?'Treasure':READ_STEPS[done]};}
    if(current(s)?.stories){const done=storyIndex(c);return {done,left:6-done,total:6,labels:STORY_STEPS,next:done===6?'Treasure':STORY_STEPS[done]};}
    const total=c.ninthRequired?9:8;
    const done=c.phase==='complete'?total:['search','story'].includes(c.phase)?8:c.phase==='retry'&&Number.isInteger(c.retryFromStep)?c.retryFromStep:c.step*2+(['spoils','puzzle'].includes(c.phase)?1:0)+(c.phase==='puzzle'&&c.puzzle?.solved?1:0);
    return {done,left:total-done,total,next:done===total?'Treasure':done===8?(current(s)?.story?'Story':'Map search'):done%2?'Clue':'Fight'};
  }
  function won(s,victory,now){
    const c=of(s).current,m=current(s);if(!c||!m||c.phase!=='battle')return false;
    if(victory){stats(s).wins++;c.phase='spoils';if(c.step>=2){const b=of(s).book[m.encounters[c.step]];b.champion=true;b.championAt ||=date(now);}
      // Story quests have no clues: after the second and fourth fight a story follows, otherwise the next fight.
      if(m.stories){if(c.step===1||c.step===3)beginStory(s,now,c.step===1?0:1);else{c.step++;c.phase='intro';}}}
    else retreat(s,false);
    return true;
  }
  function startPuzzle(s,random=Math.random){
    const c=of(s).current,m=current(s);if(!c||!m||c.phase!=='spoils')return false;
    const q=m.riddles[c.step];
    const options=q.options.map(o=>o.id);
    for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
    c.puzzle={id:q.id,order:options,selection:[],attempts:0,first:null,hint:false,listened:false,solved:false,assisted:false};c.phase='puzzle';s.activity='mission';return true;
  }
  function choose(s,value){
    const p=of(s).current?.puzzle,q=Data.puzzles[p?.id];if(!p||!q||p.solved||of(s).current.hearts<=0||!p.order.includes(value))return false;
    if(q.type==='order'){if(p.selection.includes(value))return false;p.selection.push(value);}
    else p.selection=[value];
    p.wrong=false;return true;
  }
  function check(s,now,{reveal=false}={}){
    const c=of(s).current,p=c?.puzzle,q=Data.puzzles[p?.id];
    if(!p||!q||p.solved||c.hearts<=0||c.phase!=='puzzle'||!reveal&&p.wrong||reveal&&!p.attempts)return false;
    const expected=Array.isArray(q.answer)?q.answer:[q.answer];
    if(!reveal&&p.selection.length!==expected.length)return false;
    const correct=reveal||expected.every((id,i)=>p.selection[i]===id);
    if(!reveal){p.attempts++;p.first ||= {selection:[...p.selection],correct,hint:p.hint,listened:p.listened,at:date(now)};stats(s).riddles[q.id] ||= {first:copy(p.first),visits:0};}
    if(!correct){c.hearts=Math.max(0,c.hearts-1);p.wrong=true;p.hint=true;if(c.hearts===0){retreat(s,true);s.result={victory:false,missionId:c.missionId,riddleDefeat:true,xpEarned:0,enemyId:q.family,strength:current(s).health[c.step]};s.activity='result';}return {correct:false,heartLost:true};}
    if(reveal){p.selection=[...expected];p.assisted=true;}
    p.solved=true;p.wrong=false;p.solvedAt=date(now);
    const record=stats(s).riddles[q.id] ||= {first:copy(p.first),visits:0};
    record.visits++;record.last={first:copy(p.first),attempts:p.attempts,hint:p.hint,listened:p.listened,assisted:p.assisted,solvedAt:p.solvedAt};
    const book=of(s).book[q.family] ||= {seen:true,studied:false,champion:false};book.studied=true;book.studiedAt ||=date(now);
    return {correct:true,assisted:p.assisted};
  }
  function retreat(s,fromRiddle){
    const c=of(s).current;if(!c||c.phase==='retry')return false;
    c.defeats=(c.defeats||0)+1;
    // A lost story fight is tried again from the same fight: no step back (4 November 2026).
    if(current(s)?.stories){c.retryFromStep=c.retryTargetStep=storyIndex(c);c.storyRetry=true;c.phase='retry';return true;}
    const from=c.phase==='search'?8:c.step*2+(fromRiddle?1:0);
    c.retryFromStep=from;c.retryTargetStep=Math.max(0,from-2);c.phase='retry';return true;
  }
  function retry(s){
    const c=of(s).current;if(!c||c.phase!=='retry')return false;
    if(current(s)?.stories){c.hearts=QUEST_HEARTS;c.maxHearts=QUEST_HEARTS;c.supportEarned=0;c.puzzle=null;delete c.retryFromStep;delete c.retryTargetStep;delete c.storyRetry;
      s.battle=null;s.result=null;s.teaching=null;s.activity='mission';c.phase='intro';return true;}
    const target=Number.isInteger(c.retryTargetStep)?c.retryTargetStep:Math.max(0,c.step*2-2);
    c.step=Math.floor(target/2);c.hearts=QUEST_HEARTS;c.maxHearts=QUEST_HEARTS;c.puzzle=null;
    // A new attempt after a defeat can earn shields again (earlier attempts no longer use up the allowance).
    c.supportEarned=0;
    if(c.search){c.search.selection=null;c.search.wrong=false;}
    delete c.retryFromStep;delete c.retryTargetStep;
    s.battle=null;s.result=null;s.teaching=null;s.activity='mission';
    if(target%2){c.phase='spoils';startPuzzle(s);}else c.phase='intro';
    return true;
  }
  function syncMapRevision(c){
    const revision=Maps?.[c.missionId]?.revision;
    if(c.search&&revision&&c.search.revision!==revision){
      // Retain solved slots, hearts and reward records; discard only the obsolete pending choice.
      c.search.selection=null;c.search.wrong=false;c.search.hint=false;c.search.listened=false;c.search.revision=revision;
    }
  }
  function next(s,now){
    const c=of(s).current,m=current(s);if(!c||!m||c.phase!=='puzzle'||!c.puzzle?.solved)return false;
    if(c.step===3){if(c.ninthRequired&&m.story)beginStory(s,now);else if(c.ninthRequired){c.search ||= {index:0,selection:null,wrong:false,answers:[]};syncMapRevision(c);c.phase='search';s.activity='mission';}else complete(s,now);}
    else {c.step++;c.phase='intro';c.puzzle=null;s.activity='mission';}
    return true;
  }
  function complete(s,now){const c=of(s).current;stats(s).completedAt ||=date(now);c.phase='complete';c.completedAt=date(now);s.activity='mission';}
  function mapQuestion(s){const c=of(s).current;return c?.phase==='search'?Maps?.[c.missionId]?.questions[c.search?.index||0]:null;}
  function chooseMap(s,id,expected){
    const c=of(s).current,q=mapQuestion(s);if(!q||c.hearts<=0||q.id!==expected||!q.options.some(o=>o.id===id))return false;
    c.search.selection=id;c.search.wrong=false;return true;
  }
  function checkMap(s,now,expected){
    const c=of(s).current,q=mapQuestion(s),p=c?.search;
    if(!q||q.id!==expected||c.hearts<=0||p.wrong||!q.options.some(o=>o.id===p.selection))return false;
    const correct=p.selection===q.answer,records=stats(s).mapQuestions ||= {},record=records[q.id] ||= {attempts:0,solves:0};
    record.attempts++;record.first ||= {selection:p.selection,correct,at:date(now),hint:!!p.hint,listened:!!p.listened};
    if(!correct){p.wrong=true;c.hearts=Math.max(0,c.hearts-1);if(c.hearts===0){retreat(s,true);s.result={victory:false,missionId:c.missionId,mapDefeat:true,xpEarned:0,enemyId:current(s).encounters[3],strength:current(s).health[3]};s.activity='result';}return {correct:false,heartLost:true};}
    record.solves++;record.solvedAt=date(now);p.answers[p.index]=q.answer;p.index++;p.selection=null;p.wrong=false;p.hint=false;p.listened=false;
    const firstSolve=record.solves===1;if(p.index===3)complete(s,now);
    return {correct:true,firstSolve,id:q.id};
  }

  // Story quests (Thunder Mountain, 2 November 2026; mid-chapter stories 4 November 2026). After two fights the
  // child reads a story page by page, taps any word for its sound or meaning, then answers its questions.
  // A wrong answer costs no heart: the child is sent back to the page that holds the answer.
  const STORY_PAGE_MS_PER_WORD=3000,STORY_QUESTION_CAP_MS=90000;
  function story(s){const c=of(s).current;return c?.phase==='story'?c.read:null;}
  function storyOf(m,r){return m?.stories?.[r?.which??1]||m?.story||null;}
  function currentStory(s){return storyOf(current(s),story(s));}
  function beginStory(s,now,which=1){
    const c=of(s).current,m=current(s);if(!c||!m?.story)return false;
    if(!c.read||c.read.which!==which)c.read={which,page:0,reached:0,stage:'read',index:0,selection:null,wrong:false,orders:null,answers:[],taps:{},meanings:{},startedAt:date(now)};
    c.phase='story';s.activity='mission';return true;
  }
  // Saves from the first release (four clues, one story) continue in the new order without losing a won fight.
  function migrateStoryQuest(s,c){
    const fresh=which=>({which,page:0,reached:0,stage:'read',index:0,selection:null,wrong:false,orders:null,answers:[],taps:{},meanings:{},startedAt:c.startedAt});
    if(['spoils','puzzle'].includes(c.phase)){const k=c.step;c.puzzle=null;if(k===1||k===3){c.read=fresh(k===1?0:1);c.phase='story';}else{c.step=k+1;c.phase='intro';}}
    if(c.phase==='retry'&&!c.storyRetry){c.storyRetry=true;c.retryFromStep=c.retryTargetStep=storyIndex(c);}
    if(c.phase==='story'&&c.read&&c.read.which===undefined)c.read.which=1;
  }
  function storyPageWords(st,page){return st.pages[page].join(' ').split(/\s+/).filter(w=>/[A-Za-z]/.test(w)).length;}
  function storyTimeId(s){const r=story(s),m=current(s);if(!r||!m)return null;return 'story:'+m.id+':'+(r.which===0?'mid:':'')+(r.stage==='quiz'?'q'+r.index:'p'+r.page);}
  function storyTimeCap(s){const r=story(s);return r?.stage==='quiz'?STORY_QUESTION_CAP_MS:Math.max(20000,storyPageWords(currentStory(s),r.page)*STORY_PAGE_MS_PER_WORD);}
  function turnStoryPage(s,page){
    const r=story(s),st=currentStory(s);if(!r||!Number.isInteger(page)||page<0||page>=st.pages.length)return false;
    if(r.stage==='quiz')return false;
    r.page=page;r.reached=Math.max(r.reached,page);return true;
  }
  function finishReading(s,now,random=Math.random){
    const r=story(s),st=currentStory(s);if(!r||r.stage!=='read'||r.reached<st.pages.length-1)return false;
    r.readAt ||= date(now);r.stage='quiz';
    r.orders ||= st.questions.map(q=>{const o=q.options.map(x=>x.id);for(let i=o.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[o[i],o[j]]=[o[j],o[i]];}return o;});
    // Reading XP once per story; quests finished before 4 November already earned it for the end story.
    const t=stats(s);t.storyReads=(t.storyReads||0)+1;const rewarded=t.storyReadXP ||= (t.completedAt?{end:true}:{});
    const first=!rewarded[st.id||'end'];rewarded[st.id||'end']=true;return {first};
  }
  function storyQuestion(s){const r=story(s);return r?.stage==='quiz'||r?.stage==='lookback'?currentStory(s).questions[r.index]:null;}
  function lookBack(s){const r=story(s),q=storyQuestion(s);if(!r||r.stage!=='quiz'||!q)return false;r.stage='lookback';r.page=q.page-1;return true;}
  function backToQuestion(s){const r=story(s);if(!r||r.stage!=='lookback')return false;r.stage='quiz';r.wrong=false;r.selection=null;return true;}
  function chooseStory(s,id,expected){
    const r=story(s),q=storyQuestion(s);if(!r||r.stage!=='quiz'||!q||q.id!==expected||!q.options.some(o=>o.id===id))return false;
    r.selection=id;r.wrong=false;return true;
  }
  function readSummary(r,st){return {words:st.words,taps:Object.values(r.taps).reduce((a,b)=>a+b,0),meanings:Object.keys(r.meanings).length,firstTry:r.answers.filter(a=>a.firstTry).length,questions:st.questions.length};}
  function checkStory(s,now,expected){
    const r=story(s),q=storyQuestion(s),st=currentStory(s),c=of(s).current;if(!r||r.stage!=='quiz'||!q||q.id!==expected||r.wrong||!q.options.some(o=>o.id===r.selection))return false;
    const correct=r.selection===q.answer,records=stats(s).storyQuestions ||= {},record=records[q.id] ||= {attempts:0,solves:0};
    record.attempts++;record.first ||= {selection:r.selection,correct,at:date(now),taps:Object.values(r.taps).reduce((a,b)=>a+b,0)};
    if(!correct){r.wrong=true;r.missedCurrent=true;r.misses=(r.misses||0)+1;return {correct:false,page:q.page};}
    record.solves++;record.solvedAt=date(now);r.answers[r.index]={id:q.id,firstTry:!r.missedCurrent};
    r.index++;r.selection=null;r.wrong=false;r.missedCurrent=false;
    const firstSolve=record.solves===1,finished=r.index===st.questions.length;
    if(finished&&r.which===0){c.midRead=readSummary(r,st);c.step=2;c.phase='intro';s.activity='mission';}
    else if(finished){
      const end=readSummary(r,st),mid=c.midRead,both=mid?Object.fromEntries(Object.keys(end).map(k=>[k,end[k]+mid[k]])):end;
      stats(s).storyLast={...both,stories:mid?2:1,at:date(now)};complete(s,now);
    }
    return {correct:true,firstSolve,id:q.id,done:finished,storyDone:finished?(r.which===0?'mid':'end'):null};
  }
  function noteStoryTap(s,word,kind='sound'){
    const r=story(s);if(!r||typeof word!=='string')return false;
    const key=word.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'');if(!key)return false;
    if(kind==='meaning')r.meanings[key]=(r.meanings[key]||0)+1;else r.taps[key]=(r.taps[key]||0)+1;
    const all=stats(s).storyTaps ||= {};all[key]=(all[key]||0)+1;return key;
  }
  // Words the current story fight should practise: this chapter's targets, then up to four words the
  // child tapped while reading earlier chapters of the same story.
  function focusWords(s){
    const e=of(s),b=s.battle,c=e.current;
    if(e.context!=='mission'||!b?.missionId||c?.missionId!==b.missionId)return [];
    const m=Data.byId[b.missionId];if(!m?.story)return [];
    const campaign=Data.campaigns.find(x=>x.id===m.campaign),earlier=campaign.missions.slice(0,campaign.missions.indexOf(m.id));
    const taps={};for(const id of earlier)for(const [w,n] of Object.entries(e.missions[id]?.storyTaps||{}))taps[w]=(taps[w]||0)+n;
    const extra=Object.keys(taps).filter(w=>!m.targets.includes(w)).sort((a,b)=>taps[b]-taps[a]).slice(0,4);
    return [...m.targets,...extra];
  }
  const RIDDLE_CAP_MS=180000,MAP_READING_CAP_MS=30000;
  function recordRiddleTime(s,ms,now){
    const c=of(s).current,p=c?.phase==='search'?{id:mapQuestion(s)?.id}:c?.phase==='story'?{id:storyTimeId(s)}:c?.puzzle;
    if(!Number.isFinite(ms)||ms<=0||!Number.isFinite(now)||of(s).context!=='mission'||!['puzzle','search','story'].includes(c?.phase)||!p?.id||p.solved)return [];
    const cap=c.phase==='search'?MAP_READING_CAP_MS:c.phase==='story'?storyTimeCap(s):RIDDLE_CAP_MS;
    const used=c.riddleTimeById ||= {},credit=Math.min(ms,Math.max(0,cap-(used[p.id]||0)));
    used[p.id]=(used[p.id]||0)+credit;
    const parts=[];let cursor=now-ms,finish=cursor+credit;
    while(cursor<finish){const d=new Date(cursor),end=Math.min(finish,new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime()),key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');of(s).riddleDays[key]=(of(s).riddleDays[key]||0)+end-cursor;parts.push({ms:end-cursor,end});cursor=end;}
    const days=Object.keys(of(s).riddleDays).sort();while(days.length>400)delete of(s).riddleDays[days.shift()];
    return parts;
  }
  function report(s){
    const e=of(s),firsts=Object.values(e.missions).flatMap(m=>Object.values(m.riddles).map(r=>r.first)).filter(Boolean);
    return {completed:Data.missions.filter(m=>e.missions[m.id]?.completedAt).length,seen:Object.values(e.book).filter(b=>b.seen).length,
      studied:Object.values(e.book).filter(b=>b.studied).length,champions:Object.values(e.book).filter(b=>b.champion).length,
      firsts:firsts.length,correct:firsts.filter(r=>r.correct).length,helped:firsts.filter(r=>r.hint||r.listened).length,
      riddleMs:Object.values(e.riddleDays).reduce((sum,n)=>sum+n,0),days:e.riddleDays};
  }
  function findMission(family){return Data.missions.find(m=>m.families.includes(family));}
  return {guardian,secondFriend,GROWTH,isGrowth,growthRead,growthHeld,growthDue,growthOpen,growthNext,parkable,story,currentStory,storyOf,beginStory,turnStoryPage,finishReading,storyQuestion,lookBack,backToQuestion,chooseStory,checkStory,noteStoryTap,focusWords,STORY_PAGE_MS_PER_WORD,leavableReplay,blocking,Data,Maps,mapQuestion,chooseMap,checkMap,RIDDLE_CAP_MS,MAP_READING_CAP_MS,QUEST_HEARTS,empty,init,of,current,stats,campaignComplete,unlocked,switchTo,begin,reveal,fight,won,startPuzzle,choose,check,retreat,retry,next,recordRiddleTime,report,findMission,companion,selectCompanion,protect,syncHearts,progress,supportChoices,selectSupport,earnSupport,supportNeed,supportOpen,MAX_SHIELDS,heldShields,setShields};
});
