(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./missions.js'),require('./content.js'),require('./assets/wimmelbild/river-search-data.js'));
  else root.BlitzAdventure=factory(root.BlitzMissions,root.BlitzContent,root.BlitzMapQuests);
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
    if(e.current){
      // Keep hearts already earned in an older in-progress quest, even when parked in Word trails.
      const b=e.context==='mission'?s.battle:e.runtime?.battle,c=e.current;
      const matching=b?.missionId===c.missionId;
      if(!Number.isFinite(c.maxHearts))c.maxHearts=matching?(b.heroMaxHealth||Math.max(QUEST_HEARTS,b.heroHealth)):QUEST_HEARTS;
      if(!Number.isFinite(c.hearts))c.hearts=matching?b.heroHealth:c.maxHearts;
      c.companionHelpUsed=!!c.companionHelpUsed;
      if(c.ninthRequired===undefined)c.ninthRequired=!!Maps?.[c.missionId]&&c.phase!=='complete';
      syncMapRevision(c);
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
  function unlocked(s,id){
    const m=Data.byId[id];if(!m)return false;
    return (m.campaign==='lost-lights'||campaignComplete(s,'lost-lights'))&&m.requires.every(id=>of(s).missions[id]?.completedAt);
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
  function begin(s,id,now){
    const e=of(s),m=Data.byId[id];
    if(!m||!unlocked(s,id)||e.current&&e.current.phase!=='complete'&&e.current.missionId!==id)return false;
    switchTo(s,'mission');e.preferLegacy=false;e.selectedCampaign=m.campaign;
    if(e.current?.missionId===id&&e.current.phase!=='complete')return true;
    e.current={missionId:id,step:0,phase:'intro',puzzle:null,startedAt:date(now),replay:!!stats(s,id).completedAt,ninthRequired:!!Maps?.[id],hearts:QUEST_HEARTS,maxHearts:QUEST_HEARTS,companionHelpUsed:false};
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
    of(s).favourite=family;return true;
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
  function progress(s){
    const c=of(s).current;if(!c)return null;
    const total=c.ninthRequired?9:8;
    const done=c.phase==='complete'?total:c.phase==='search'?8:c.phase==='retry'&&Number.isInteger(c.retryFromStep)?c.retryFromStep:c.step*2+(['spoils','puzzle'].includes(c.phase)?1:0)+(c.phase==='puzzle'&&c.puzzle?.solved?1:0);
    return {done,left:total-done,total,next:done===total?'Treasure':done===8?'Map search':done%2?'Clue':'Fight'};
  }
  function won(s,victory,now){
    const c=of(s).current,m=current(s);if(!c||!m||c.phase!=='battle')return false;
    if(victory){stats(s).wins++;c.phase='spoils';if(c.step>=2){const b=of(s).book[m.encounters[c.step]];b.champion=true;b.championAt ||=date(now);}}
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
    const from=c.phase==='search'?8:c.step*2+(fromRiddle?1:0);
    c.retryFromStep=from;c.retryTargetStep=Math.max(0,from-2);c.phase='retry';return true;
  }
  function retry(s){
    const c=of(s).current;if(!c||c.phase!=='retry')return false;
    const target=Number.isInteger(c.retryTargetStep)?c.retryTargetStep:Math.max(0,c.step*2-2);
    c.step=Math.floor(target/2);c.hearts=QUEST_HEARTS;c.maxHearts=QUEST_HEARTS;c.puzzle=null;
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
    if(c.step===3){if(c.ninthRequired){c.search ||= {index:0,selection:null,wrong:false,answers:[]};syncMapRevision(c);c.phase='search';s.activity='mission';}else complete(s,now);}
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
  const RIDDLE_CAP_MS=180000;
  function recordRiddleTime(s,ms,now){
    const c=of(s).current,p=c?.phase==='search'?{id:mapQuestion(s)?.id}:c?.puzzle;
    if(!Number.isFinite(ms)||ms<=0||!Number.isFinite(now)||of(s).context!=='mission'||!['puzzle','search'].includes(c?.phase)||!p?.id||p.solved)return [];
    const used=c.riddleTimeById ||= {},credit=Math.min(ms,Math.max(0,RIDDLE_CAP_MS-(used[p.id]||0)));
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
  return {Data,Maps,mapQuestion,chooseMap,checkMap,RIDDLE_CAP_MS,QUEST_HEARTS,empty,init,of,current,stats,campaignComplete,unlocked,switchTo,begin,reveal,fight,won,startPuzzle,choose,check,retreat,retry,next,recordRiddleTime,report,findMission,companion,selectCompanion,protect,syncHearts,progress};
});
