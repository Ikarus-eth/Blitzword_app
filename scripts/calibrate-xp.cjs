// Deterministic pacing model, not a claim about human learning or enjoyment.
const Core=require('../game-core'),Content=require('../content');
function simulate(minutes,days=70){
 let s=Core.migrate(Core.fresh()),attempt=0,mathAttempt=0,pendingMs=0,pendingId=null,seed=42;
 const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 s.assessment.done=true;s.profile.name='Calibration';s.settings.speed='walk';
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
   if(q.id!==pendingId){pendingId=q.id;pendingMs=math?6000:24000;}
   const ms=Math.min(pendingMs,minutes*60000-elapsed);now+=ms;elapsed+=ms;pendingMs-=ms;
   Core.recordTime(s,ms,math?'math':'practice',now);
   if(math&&Core.tickMath(s,ms,now))continue;
   if(pendingMs>0)continue;
   if(math){mathAttempt++;Core.answerMath(s,mathAttempt%10?q.a*q.b:q.options.find(n=>n!==q.a*q.b),now);}
   else{
    attempt++;q.phase='choices';Core.answerBattle(s,attempt%10?q.target:q.options.find(x=>x!==q.target),now);
    if(!q.correct){Core.startTeaching(s,q.target,'battle',now);Core.leaveTeaching(s,now);}
    Core.prepareBattle(s,now,random);
   }
  }
  if(s.dragon.stage>oldStage)growth.push({day,stage:s.dragon.stage,xp:s.dragon.xp});
  daily.push({day,xp:s.dragon.xp,earned:s.dragon.xp-before,chapters:s.story.clearedAreas.length,words:Object.values(s.learning.words).filter(w=>w.wordXPClaimed).length});
  s=Core.migrate(JSON.parse(JSON.stringify(s)));
 }
 return {minutes,days,growth,daily,totalXP:s.dragon.xp,chapters:s.story.clearedAreas.length,campaigns:s.story.completedChapters.length,readingAttempts:attempt,mathAttempts:mathAttempt};
}
if(require.main===module){const results=[simulate(15),simulate(45,28)];console.log(JSON.stringify({assumptions:{readingAttemptSeconds:24,readingAccuracy:.9,mathAnswerSeconds:6,mathAccuracy:.9,speed:'Walk',enemyHealth:6,multiplier:Core.XP_MULTIPLIER},results},null,2));}
module.exports={simulate};
