// Deterministic pacing model, not a claim about human learning or enjoyment.
const DefaultCore=require('../game-core');
function simulate(minutes,days=70,{readingSeconds=8,accuracy=.9,speed='walk',core=DefaultCore}={}){
 const Core=core;
 if(!Number.isFinite(readingSeconds)||readingSeconds<=0||!Number.isFinite(accuracy)||accuracy<=0||accuracy>1)throw new Error('Invalid model assumptions');
 let s=Core.migrate(Core.fresh()),attempt=0,mathAttempt=0,pendingMs=0,pendingId=null,seed=42;
 const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 s.assessment.done=true;s.profile.name='Calibration';s.settings.speed=speed;
 const daily=[],growth=[],start=new Date(2026,0,1,12).getTime();
 for(let day=1;day<=days;day++){
  let elapsed=0,now=start+(day-1)*Core.DAY;const before=s.dragon.xp,oldStage=s.dragon.stage;
  while(elapsed<minutes*60000){
   if(s.activity==='mathIntro')Core.startMath(s,now);
   if(s.activity==='mathResult')Core.leaveMath(s,now);
   if(s.activity==='summary'||s.session?.completedAt)Core.beginSession(s,now);
   if(s.story.mapPending)s.story.mapPending=false;
   if(!s.battle||s.battle.resolved&&s.activity!=='mathChallenge')Core.startBattle(s,now,{strength:6});
   const math=s.activity==='mathChallenge';
   const q=math?Core.prepareMath(s,random):Core.prepareBattle(s,now,random);
   if(!q)continue;
   if(q.id!==pendingId){pendingId=q.id;pendingMs=math?6000:readingSeconds*1000;}
   const ms=Math.min(pendingMs,minutes*60000-elapsed);now+=ms;elapsed+=ms;pendingMs-=ms;
   Core.recordTime(s,ms,math?'math':'practice',now);
   if(math&&Core.tickMath(s,ms,now))continue;
   if(pendingMs>0)continue;
   if(math){mathAttempt++;Core.answerMath(s,mathAttempt%10?q.a*q.b:q.options.find(n=>n!==q.a*q.b),now);}
   else{
    attempt++;q.phase='choices';const correct=Math.ceil(attempt*accuracy)>Math.ceil((attempt-1)*accuracy);Core.answerBattle(s,correct?q.target:q.options.find(x=>x!==q.target),now);
    if(!q.correct){Core.startTeaching(s,q.target,'battle',now);Core.leaveTeaching(s,now);}
    Core.prepareBattle(s,now,random);
   }
  }
  if(s.dragon.stage>oldStage)growth.push({day,stage:s.dragon.stage,xp:s.dragon.xp});
  daily.push({day,xp:s.dragon.xp,earned:Math.round((s.dragon.xp-before)*100)/100,returning:s.rewards.xpDays[Core.dayKey(now)]?.consistency||0,chapters:s.story.clearedAreas.length,words:Object.values(s.learning.words).filter(w=>w.wordXPClaimed).length});
  s=Core.migrate(JSON.parse(JSON.stringify(s)));
 }
 return {minutes,days,readingSeconds,accuracy,speed,growth,daily,totalXP:s.dragon.xp,chapters:s.story.clearedAreas.length,campaigns:s.story.completedChapters.length,readingAttempts:attempt,mathAttempts:mathAttempt};
}
if(require.main===module){
 const scenarios=[{minutes:15},{minutes:30},{minutes:45},{minutes:30,readingSeconds:6},{minutes:30,readingSeconds:10},{minutes:30,readingSeconds:24},{minutes:30,accuracy:.8},{minutes:30,accuracy:1},{minutes:30,speed:'run'}];
 const baseline=process.argv[2]?require('./simulate-scheduling.cjs').fromCommit(process.argv[2]).Core:null;
 const results=scenarios.map(({minutes,...options})=>({before:baseline?simulate(minutes,7,{...options,core:baseline}):null,after:simulate(minutes,7,options)}));
 const growthForecasts=[15,30,45].map(minutes=>{const r=simulate(minutes,240);return {minutes,days:r.days,growth:r.growth};});
 console.log(JSON.stringify({reference:'Parent reports about 1,000 XP in 30 minutes; keep whole XP and make growth take about five times as much XP.',baseline:process.argv[2]||null,assumptions:{readingAttemptSeconds:8,readingAccuracy:.9,mathAnswerSeconds:6,mathAccuracy:.9,speed:'Walk',enemyHealth:6,wholeBoostedXP:{reading:5,reliableFastReading:7,math:2},noTeachingOrStoryTime:true},thresholds:[15000,45000,70000],results,growthForecasts},null,2));
}
module.exports={simulate};
