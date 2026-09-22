const test=require('node:test');
const assert=require('node:assert/strict');
const Core=require('../game-core.js'),Content=require('../content.js');
const NOW=Date.UTC(2026,8,22),roundtrip=s=>Core.migrate(JSON.parse(JSON.stringify(s)));
function fresh(){return Core.migrate(Core.fresh());}
function respond(s,target,{correct=true,support=false,demo=false}={}){
 Core.startBattle(s,NOW,{demo});const q=Core.prepareBattle(s,NOW);q.target=target;q.options=Core.byWord[target].d;q.phase='choices';q.supportReasons=support?['help-request']:[];
 return Core.answerBattle(s,correct?target:q.options.find(x=>x!==target),NOW);
}
function practiced(s){for(const word of Content.words){s.learning.words[word.w].introducedAt=new Date(NOW).toISOString();s.learning.words[word.w].practiceSuccesses=2;}}
test('XP keeps rewarding independent review answers without a daily cap or duplicate delivery',()=>{
 let s=fresh();
 assert.equal(respond(s,'on').xpEarned,1);assert.equal(respond(s,'on').xpEarned,1);assert.equal(respond(s,'on').xpEarned,1);
 s.battle.question.responseMs=1;s=roundtrip(s);assert.equal(Core.dragonProgress(s).xp,3);
 const before=JSON.stringify(s.dragon);assert.equal(Core.answerBattle(s,'on',NOW),null);s=roundtrip(s);assert.equal(JSON.stringify(s.dragon),before);
});
test('help, wrong answers, demo and assessment give no XP; earned XP survives defeat',()=>{
 let s=fresh();respond(s,'on',{support:true});respond(s,'tree',{correct:false});respond(s,'rock',{demo:true});
 Core.startAssessment(s,NOW);const q=Core.prepareAssessment(s,NOW);q.phase='choices';Core.answerAssessment(s,q.target,NOW);
 assert.equal(Core.dragonProgress(roundtrip(s)).xp,0);
 respond(s,'on');s.battle.heroHealth=0;Core.resolveBattle(s,NOW);s=roundtrip(s);assert.equal(Core.dragonProgress(s).xp,1);assert.equal(s.result.victory,false);
});
test('old saves recover XP only from qualifying campaign observations, once',()=>{
 const s=fresh();delete s.dragon;delete s.story;
 s.campaign.battleRecords=[
 {id:'a',task:'battle',target:'on',correct:true,supported:false},
 {id:'b',task:'battle',target:'on',correct:true,supported:false},
 {id:'c',task:'battle',target:'on',correct:true,supported:false},
 {id:'d',task:'demoBattle',target:'tree',correct:true,supported:false},
 {id:'e',task:'battle',target:'rock',correct:true,supported:true},
 {id:'f',task:'battle',target:'green',correct:false,supported:false},
 {id:'g',target:'fox',correct:true,supported:false}
 ];
 const migrated=roundtrip(s);assert.equal(Core.dragonProgress(migrated).xp,10);assert.deepEqual(migrated.campaign.battleRecords,s.campaign.battleRecords);assert.deepEqual(roundtrip(migrated).dragon,migrated.dragon);
});
test('first growth requires XP AND 250 confirmed minutes AND 14 elapsed days',()=>{
 const now=Date.now();let s=fresh();s.dragon.xp=250;s.timing.firstPracticeAt=new Date(now-13*Core.DAY).toISOString();
 Core.recordTime(s,250*60000,'practice',now);assert.equal(s.dragon.stage,0);assert.equal(Core.dragonProgress(s,now).daysRemaining,1);
 s.timing.firstPracticeAt=new Date(now-14*Core.DAY).toISOString();s.timing.days={};Core.recordTime(s,249*60000,'practice',now);assert.equal(s.dragon.stage,0);
 Core.recordTime(s,60000,'practice',now);assert.equal(s.dragon.stage,1);assert.equal(Core.dragonProgress(s,now).current.name,'Young Pip');
 let missingXP=fresh();missingXP.dragon.xp=249;missingXP.timing.firstPracticeAt=new Date(now-14*Core.DAY).toISOString();Core.recordTime(missingXP,250*60000,'practice',now);assert.equal(missingXP.dragon.stage,0);
 missingXP.dragon.xp=250;missingXP=roundtrip(missingXP);assert.equal(missingXP.dragon.stage,1);
 s.dragon.xp=1500;Core.recordTime(s,1250*60000,'practice',now);assert.equal(s.dragon.stage,2);s.story.chapterComplete=true;s=roundtrip(s);assert.equal(s.dragon.stage,3);
});
test('area progress requires the words, practice and secured checkpoint; later areas unlock in story order',()=>{
 let s=fresh();practiced(s);s.campaign.wins=1;s=roundtrip(s);assert.equal(Core.storyProgress(s).cleared,0);
 s.campaign.wins=2;s.campaign.checkpointWins=2;s.learning.words.cave.introducedAt=null;s=roundtrip(s);assert.equal(Core.storyProgress(s).cleared,0);
 s.learning.words.cave.introducedAt=new Date(NOW).toISOString();s.learning.words.cave.practiceSuccesses=0;s.learning.words.fox.practiceSuccesses=0;s=roundtrip(s);assert.equal(Core.storyProgress(s).cleared,0);
 s.learning.words.fox.practiceSuccesses=2;s=roundtrip(s);const p=Core.storyProgress(s);assert.equal(p.cleared,1);assert.equal(p.total,5);assert.equal(p.areas[0].status,'cleared');assert.equal(p.areas[1].status,'current');assert.ok(p.areas.slice(2).every(a=>a.status==='locked'));assert.equal(p.complete,false);
});
test('cleared story areas remain explored after later mistakes and defeat without inventing the chapter finale',()=>{
 let s=fresh();practiced(s);s.campaign.wins=2;s.campaign.checkpointWins=2;s=roundtrip(s);
 respond(s,'on',{correct:false});s.campaign.wins=3;s.battle.heroHealth=0;Core.resolveBattle(s,NOW);s=roundtrip(s);
 assert.equal(s.learning.words.on.practiceSuccesses,0);assert.equal(s.campaign.wins,2);assert.equal(Core.storyProgress(s).cleared,1);
 Core.startBattle(s,NOW);s.battle.finalEncounter=true;s.battle.enemyHealth=0;Core.resolveBattle(s,NOW);assert.equal(s.story.chapterComplete,false);
});
