// Deterministic scheduling model; no claim about a child's learning or enjoyment.
// Optional argument: baseline commit SHA. Both versions use the same play loop.
const {execFileSync}=require('node:child_process'),vm=require('node:vm');
function fromCommit(sha){
  if(!/^[a-f0-9]{7,40}$/.test(sha))throw new Error('Expected a baseline commit SHA');
  const load=(file,Content)=>{const module={exports:{}};vm.runInNewContext(execFileSync('git',['show',sha+':'+file],{encoding:'utf8'}),
    {module,require:name=>{if(name==='./content.js')return Content;throw new Error(name);}}, {filename:file});return module.exports;};
  const Content=load('content.js');return {Core:load('game-core.js',Content),Content};
}
function simulate({Core,Content},minutes,{review=false,days=30,answerMs=8000}={}){
  let s=Core.migrate(Core.fresh()),attempt=0,mathAttempt=0,pendingMs=0,pendingId=null,seed=42;
  const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const start=new Date(2026,0,1,12).getTime();
  s.assessment.done=true;s.settings.speed='walk';
  if(review){
    s.story.completedChapters=Content.chapters.map(c=>c.id);s.story.clearedAreas=Content.areas.map(a=>a.id);s.story.chapterComplete=true;
    for(const item of Content.words)Object.assign(s.learning.words[item.w],{introducedAt:new Date(start-40*Core.DAY).toISOString(),
      lastSeenAt:new Date(start-7*Core.DAY).toISOString(),independentCorrect:10,practiceSuccesses:4,reviewStage:2,dueAt:start-1});
  }
  const daily=[];
  for(let day=1;day<=days;day++){
    let elapsed=0,now=start+(day-1)*Core.DAY,turns=0,secured=0,currentSecured=0,speedRefill=0;
    const seen=new Map();
    while(elapsed<minutes*60000){
      if(s.activity==='mathIntro')Core.startMath(s,now);
      if(s.activity==='mathResult')Core.leaveMath(s,now);
      if(s.activity==='summary'||s.session?.completedAt)Core.beginSession(s,now);
      s.story.mapPending=false;
      if(!s.battle||s.battle.resolved&&s.activity!=='mathChallenge')Core.startBattle(s,now,{strength:6});
      const math=s.activity==='mathChallenge',q=math?Core.prepareMath(s,random):Core.prepareBattle(s,now,random);
      if(!q)continue;
      if(q.id!==pendingId){pendingId=q.id;pendingMs=math?6000:answerMs;}
      const ms=Math.min(pendingMs,minutes*60000-elapsed);now+=ms;elapsed+=ms;pendingMs-=ms;
      Core.recordTime(s,ms,math?'math':'practice',now);
      if(math&&Core.tickMath(s,ms,now))continue;
      if(pendingMs>0)continue;
      if(math){mathAttempt++;Core.answerMath(s,mathAttempt%10?q.a*q.b:q.options.find(n=>n!==q.a*q.b),now);}
      else{
        const w=s.learning.words[q.target],current=Core.storyProgress(s).areas.find(a=>a.status==='current');
        const alreadySecured=w.practiceSuccesses>=2&&w.dueAt>now;
        turns++;seen.set(q.target,(seen.get(q.target)||0)+1);
        if(alreadySecured){secured++;if(current?.words.includes(q.target))currentSecured++;}
        if(q.practiceKind==='speed-refill')speedRefill++;
        attempt++;q.phase='choices';q.responseMs=2000;
        Core.answerBattle(s,attempt%10?q.target:q.options.find(x=>x!==q.target),now);
        if(!q.correct){Core.startTeaching(s,q.target,'battle',now);Core.leaveTeaching(s,now);}
        Core.prepareBattle(s,now,random);
      }
    }
    daily.push({day,turns,alreadySecured:secured,currentChapterSecured:currentSecured,speedRefill,distinct:seen.size,maxRepeats:Math.max(0,...seen.values()),chapters:s.story.clearedAreas.length});
    s=Core.migrate(Core.copy(s));
  }
  const total=key=>daily.reduce((n,d)=>n+d[key],0),pct=n=>Number((100*n/total('turns')).toFixed(1));
  return {minutes,days,review,readingTurns:total('turns'),alreadySecuredPct:pct(total('alreadySecured')),
    currentChapterSecuredPct:pct(total('currentChapterSecured')),speedRefillPct:pct(total('speedRefill')),
    meanDistinctPerDay:Number((total('distinct')/days).toFixed(1)),maxRepeats:Math.max(...daily.map(d=>d.maxRepeats)),
    chapters:s.story.clearedAreas.length,daily};
}
function scenarios(modules){return [simulate(modules,15),simulate(modules,45),simulate(modules,15,{review:true})];}
if(require.main===module){
  const baseline=process.argv[2];
  console.log(JSON.stringify({assumptions:{readingAnswerMs:8000,mathAnswerMs:6000,independentAccuracy:.9,days:30,seed:42,speed:'Walk',enemyHealth:6,
    alreadySecured:'Before the answer: at least two practice successes and not due; includes faster fallback turns.',
    currentChapterSecured:'The same measure restricted to the current map field.',reviewStart:'All 200 words introduced, review stage 2, due at start; story complete.'},
    ...(baseline?{baseline, before:scenarios(fromCommit(baseline))}:{}),after:scenarios({Core:require('../game-core'),Content:require('../content')})},null,2));
}
module.exports={simulate,fromCommit};
