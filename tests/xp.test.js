const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),Content=require('../content');
const NOW=new Date(2026,8,23,12).getTime(),fresh=()=>C.migrate(C.fresh()),reload=s=>C.migrate(C.copy(s));
function response(s,word='on',{now=NOW,correct=true,support=false,retention=false,speed=null}={}){
 C.startBattle(s,now,{strength:5});const q=C.prepareBattle(s,now);Object.assign(q,{target:word,options:C.byWord[word].d,phase:'choices',supportReasons:support?['help-request']:[],retentionDue:retention,exposureMs:speed});
 return C.answerBattle(s,correct?word:q.options.find(x=>x!==word),now);
}
function readyChapter(s,minutes=8){
 const a=Content.areas[0];for(const w of a.words)Object.assign(s.learning.words[w],{introducedAt:new Date(NOW).toISOString(),practiceSuccesses:2});
 Object.assign(C.chapterState(s,a.id),{activeMs:minutes*60000,wins:3,duels:1,attempts:20,correct:18});return a;
}
test('daily reward fires once, boosted answer XP persists after 20 minutes and resets on a new date',()=>{
 let s=fresh();response(s);C.recordTime(s,599999,'practice',NOW);assert.equal(s.dragon.xp,3);assert.equal(C.bonusProgress(s,NOW).active,false);
 C.recordTime(s,1,'practice',NOW+1);assert.equal(s.dragon.xp,23);assert.equal(C.bonusProgress(s,NOW+1).multiplier,1.75);
 assert.equal(response(s,'tree',{now:NOW+2}).xpEarned,5.25);s=reload(s);C.recordTime(s,30*60000,'practice',NOW+30*60000);
 assert.equal(response(s,'rock',{now:NOW+30*60000}).xpEarned,5.25);assert.equal(s.rewards.xpDays[C.dayKey(NOW)].daily,20);
 assert.equal(C.bonusProgress(s,NOW+C.DAY).multiplier,1);assert.equal(response(s,'fox',{now:NOW+C.DAY}).xpEarned,3);
 C.recordTime(s,600000,'practice',NOW+C.DAY+600000);assert.equal(s.rewards.xpDays[C.dayKey(NOW+C.DAY)].daily,20);
});
test('demo, assessment and excluded idle time neither unlock the multiplier nor earn daily XP',()=>{
 const s=fresh();for(const kind of ['demo','assessment','idle'])C.recordTime(s,60*60000,kind,NOW);assert.equal(s.dragon.xp,0);assert.equal(C.bonusProgress(s,NOW).active,false);
});
test('midnight splits bonus eligibility between actual local dates and cannot pay twice after reload',()=>{
 let s=fresh();const midnight=new Date(2026,8,24).getTime();C.recordTime(s,599000,'practice',midnight-2000);C.recordTime(s,4000,'practice',midnight+1000);
 assert.equal(s.rewards.xpDays[C.dayKey(midnight-1)].daily,20);assert.equal(C.bonusProgress(s,midnight+1000).active,false);const xp=s.dragon.xp;
 s=reload(s);assert.equal(s.dragon.xp,xp);C.recordTime(s,1000,'practice',midnight+2000);assert.equal(s.dragon.xp,xp);
});
test('new word XP needs separated evidence in more than one battle and can only be claimed once',()=>{
 let s=fresh();const answers=['on','tree','rock','on','tree','rock','on'];let last;
 for(const word of answers)last=response(s,word);assert.equal(last.newWordXP,8);assert.equal(last.xpEarned,11);assert.ok(s.learning.words.on.securedAt);
 s=reload(s);assert.equal(response(s).xpEarned,3);assert.equal(s.learning.words.on.wordXPClaimed,true);
 const t=fresh();C.startBattle(t,NOW,{strength:12});for(let i=0;i<7;i++){const q=C.prepareBattle(t,NOW);Object.assign(q,{target:answers[i],options:C.byWord[answers[i]].d,phase:'choices'});C.answerBattle(t,q.target,NOW);}assert.equal(t.learning.words.on.wordXPClaimed,undefined);
});
test('retention is rewarded only once after a full day and a due, unaided correct response',()=>{
 let s=fresh();Object.assign(s.learning.words.on,{securedAt:new Date(NOW).toISOString(),wordXPClaimed:true});
 assert.equal(response(s,'on',{retention:true,now:NOW+C.DAY-1}).retentionXP,undefined);
 assert.equal(response(s,'on',{retention:true,now:NOW+C.DAY,support:true}).xpEarned,0);
 s.learning.words.on.lastHelpAt=null;assert.equal(response(s,'on',{retention:true,now:NOW+C.DAY}).retentionXP,4);
 s=reload(s);assert.equal(response(s,'on',{retention:true,now:NOW+2*C.DAY}).retentionXP,undefined);
});
test('speed XP uses the saved exposure and requires 18 of 20 correct independent responses on secured words',()=>{
 const s=fresh();Object.assign(s.learning.words.on,{securedAt:new Date(NOW-C.DAY).toISOString(),wordXPClaimed:true});
 for(let i=0;i<19;i++)assert.equal(response(s,'on',{speed:950}).speedXP,0);
 const good=response(s,'on',{speed:950});assert.equal(good.speedXP,1);assert.equal(good.xpEarned,4);
 assert.equal(response(s,'tree',{speed:950}).speedXP,0);assert.equal(response(s,'on',{speed:null}).speedXP,0);
 for(let i=0;i<3;i++)response(s,'on',{speed:950,correct:false});assert.equal(response(s,'on',{speed:950}).speedXP,0);
});
test('eight-minute chapter requires another battle; crossing ten minutes never completes a living fight',()=>{
 let s=fresh();const a=readyChapter(s);s=reload(s);assert.equal(C.storyProgress(s).cleared,0);
 C.startBattle(s,NOW);C.recordTime(s,2*60000,'practice',NOW+2*60000);assert.equal(C.storyProgress(s).cleared,0);C.resolveBattle(s,NOW);assert.equal(s.battle.resolved,false);
 s.battle.enemyHealth=0;C.resolveBattle(s,NOW+2*60000);assert.ok(s.story.clearedAreas.includes(a.id));assert.equal(s.result.fieldJustComplete,a.id);assert.equal(s.story.dailyChapters[C.dayKey(NOW)],1);assert.equal(s.rewards.xpDays[C.dayKey(NOW)].accuracy,10);
 const xp=s.dragon.xp;s=reload(s);C.resolveBattle(s,NOW);assert.equal(s.dragon.xp,xp);assert.equal(s.story.dailyChapters[C.dayKey(NOW)],1);
});
test('chapter waits for learning objectives and a played number duel, but a duel loss can finish it',()=>{
 let s=fresh();const a=readyChapter(s,10);const p=C.chapterState(s,a.id);p.duels=0;s=reload(s);assert.equal(C.storyProgress(s).cleared,0);
 C.startBattle(s,NOW);s.battle.enemyHealth=0;C.resolveBattle(s,NOW); // cycle offer may be at next third win
 s.math.winStreak=2;C.startBattle(s,NOW);s.battle.enemyHealth=0;C.resolveBattle(s,NOW);assert.equal(s.activity,'mathIntro');C.startMath(s,NOW);C.tickMath(s,60000,NOW+60000);assert.equal(s.math.round.beaten,false);assert.ok(s.story.clearedAreas.includes(a.id));
 const t=fresh();readyChapter(t,10);t.learning.words.on.practiceSuccesses=0;t.learning.words.tree.practiceSuccesses=0;assert.equal(C.storyProgress(reload(t)).cleared,0);
});
test('growth is XP-only and grandfathered forms and old completed chapters never regress',()=>{
 for(const [xp,stage] of [[2999,0],[3000,1],[8900,2],[13400,3]]){const s=fresh();s.dragon.xp=xp;assert.equal(reload(s).dragon.stage,stage);}
 const old=fresh();delete old.xpRulesVersion;delete old.chapterRulesVersion;old.dragon.xp=250;old.dragon.stage=1;old.story.clearedAreas=['lantern-trail'];C.startBattle(old,NOW);const q=C.copy(C.prepareBattle(old,NOW));
 const s=reload(old);assert.equal(s.dragon.stage,1);assert.equal(s.dragon.xp,250);assert.deepEqual(s.story.clearedAreas,old.story.clearedAreas);assert.deepEqual(s.battle.question,q);assert.equal(s.profile.name,old.profile.name);
});
test('naming unlocks at the second stage, preserves XP and safely round-trips the chosen name',()=>{
 let s=fresh();assert.equal(C.nameDragon(s,'Ember'),false);s.dragon.xp=3000;s=reload(s);assert.equal(C.nameDragon(s,'  Ember  '),true);assert.equal(C.nameDragon(s,'  '),false);s=reload(s);assert.equal(s.dragon.name,'Ember');assert.equal(s.dragon.named,true);assert.equal(s.dragon.xp,3000);
 C.nameDragon(s,'<Blaze>');assert.equal(s.dragon.name,'Blaze');
});
test('old reviews cannot monopolize every turn ahead of a new chapter’s targets',()=>{
 const s=fresh();s.story.clearedAreas=['lantern-trail'];const old=Content.areas[0].words;for(const word of old)Object.assign(s.learning.words[word],{introducedAt:new Date(NOW-C.DAY).toISOString(),practiceSuccesses:2,reviewStage:0,dueAt:NOW-1});
 const current=new Set(Content.areas[1].words);C.startBattle(s,NOW,{strength:12});let count=0;
 for(let i=0;i<9;i++){const q=C.prepareBattle(s,NOW);if(current.has(q.target))count++;q.phase='choices';C.answerBattle(s,q.target,NOW);}assert.ok(count>=6);
});
test('review chapters continue the ten-minute daily goal after the final campaign',()=>{
 let s=fresh();s.story.completedChapters=Content.chapters.map(c=>c.id);s.story.clearedAreas=Content.areas.map(a=>a.id);C.startBattle(s,NOW);assert.ok(s.battle.reviewId);
 Object.assign(s.story.review,{activeMs:600000,wins:2,duels:1,attempts:20,correct:18});s.battle.enemyHealth=0;C.resolveBattle(s,NOW);
 assert.equal(s.story.dailyChapters[C.dayKey(NOW)],1);assert.ok(s.story.review.completedAt);const id=s.story.review.id;s=reload(s);assert.equal(s.story.dailyChapters[C.dayKey(NOW)],1);C.startBattle(s,NOW);assert.notEqual(s.story.review.id,id);
});
test('old saved result retains its combined reading and multiplication reward display',()=>{
 const s=fresh();delete s.xpRulesVersion;C.startBattle(s,NOW);const b=s.battle;delete b.xpEarned;s.result={battleId:b.id,xpEarned:3};s.campaign.battleRecords=[{battleId:b.id,xpEarned:3}];s.math.records=[{battleId:b.id,correct:12}];s.dragon.xp=15;
 const migrated=reload(s);assert.equal(migrated.result.xpEarned,15);assert.equal(migrated.dragon.xp,15);assert.equal(reload(migrated).result.xpEarned,15);
});
test('pacing model reaches the requested growth weeks without elapsed-day gates',()=>{
 const {simulate}=require('../scripts/calibrate-xp.cjs'),steady=simulate(15),extended=simulate(45,21);
 assert.deepEqual(steady.growth.map(g=>g.day),[14,42,70]);assert.equal(extended.growth.at(-1).day,21);assert.equal(extended.growth.at(-1).stage,3);
});
