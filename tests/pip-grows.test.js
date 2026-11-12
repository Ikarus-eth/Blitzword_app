// Pip Grows Up (12 November 2026): the XP hold at 44,000, the story-only chapter, parking a waiting quest,
// the exact crossing of 45,000 XP on the last right answer, and riding/flying stages.
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),A=C.Adventure,Content=require('../content'),G=require('../assets/adventures/pip-grows/campaign');
const NOW=Date.UTC(2026,10,12,1);
function fresh(xp=43990){const s=C.migrate(C.fresh());s.profile={name:'A',age:7,gender:'boy',heroClass:'Mage',heroIndex:0};s.assessment.done=true;
 for(const m of A.Data.missions)if(!A.isGrowth(m.id)&&m.campaign!=='moon-key')A.stats(s,m.id).completedAt=new Date(NOW).toISOString();Object.assign(s.dragon,{xp,stage:1,evolutionSeen:1});return s;}
function readPart(s,id,{wrongFirst=false}={}){
 if(A.of(s).current?.missionId!==id)assert.equal(C.startMission(s,id,NOW),true);
 A.beginStory(s,NOW,1);const st=A.currentStory(s);for(let p=1;p<st.pages.length;p++)A.turnStoryPage(s,p);
 const gained=[C.finishStoryReading(s,NOW).xpEarned];
 for(const q of st.questions){if(wrongFirst){A.chooseStory(s,q.options.find(o=>o.id!==q.answer).id,q.id);assert.equal(C.checkStory(s,NOW,q.id).correct,false);A.lookBack(s);A.backToQuestion(s);}
  A.chooseStory(s,q.answer,q.id);gained.push(C.checkStory(s,NOW,q.id).xpEarned);}
 return gained;
}
test('content: four story-only parts of about 1,000 words, three questions each, every picture present',()=>{
 assert.deepEqual(Content.dragonStages.map(x=>[x.name,x.xp]),[['Small Pip',0],['Big Pip',15000],['Ride on Pip',45000],['Flying Pip',70000]]);
 assert.deepEqual(Content.growth,{holdXP:44000,stage:2,campaign:'pip-grows'});
 assert.equal(G.missions.length,4);const words=G.missions.reduce((n,m)=>n+m.story.words,0);assert.ok(words>=900&&words<=1100,words);
 const fs=require('fs');
 for(const m of G.missions){assert.equal(m.storyOnly,true);assert.equal(m.story.questions.length,3);assert.deepEqual(m.families,[]);
  for(const a of [...m.story.art,G.campaign.scene])assert.ok(fs.existsSync(__dirname+'/../'+a),a);
  for(const q of m.story.questions){assert.ok(q.page>=1&&q.page<=m.story.pages.length);assert.ok(q.options.some(o=>o.id===q.answer));}}
 assert.deepEqual(Content.evolution.lines[2],['Hop on my back.','We can go far.']);
});
test('from 44,000 XP Pip’s XP is held and new quests pause until his story is read',()=>{
 const s=fresh(43990);assert.equal(A.growthDue(s),false);assert.equal(A.unlocked(s,'mk-owl'),true);assert.equal(A.unlocked(s,'grow-egg'),false);
 s.screen='parentDashboard';assert.equal(C.grantParentXP(s,NOW),10);assert.equal(s.dragon.xp,44000);assert.equal(C.grantParentXP(s,NOW),0);
 assert.equal(A.growthDue(s),true);assert.equal(A.unlocked(s,'mk-owl'),false);assert.equal(A.unlocked(s,'grow-egg'),true);assert.equal(A.unlocked(s,'grow-little'),false);
 s.dragon.xp=46000;C.syncProgress?.(s,NOW);const r=C.migrate(C.copy(s));assert.equal(r.dragon.stage,1,'no riding without the story');
});
test('the story chapter adds exactly 1,000 XP and its last right answer grows Pip to 45,000 XP',()=>{
 const s=fresh(44000);const all=[];
 for(const id of G.campaign.missions){const g=readPart(s,id,{wrongFirst:id==='grow-little'});all.push(...g);assert.equal(A.of(s).current.phase,'complete');
  if(id!=='grow-ride'){assert.equal(s.dragon.stage,1);assert.ok(s.dragon.xp<45000);}}
 assert.deepEqual(all,[100,50,50,50,100,50,50,50,100,50,50,50,100,50,50,50]);assert.equal(s.dragon.xp,45000);assert.equal(s.dragon.stage,2);
 assert.equal(A.growthDue(s),false);assert.equal(A.growthRead(s),true);assert.equal(A.unlocked(s,'mk-owl'),true);
 assert.equal(C.beginEvolution(s).stage,2);
 // Replays give no XP; after growing, XP is no longer held; flying waits for 70,000 XP.
 C.finishEvolution(s)||0;s.dragon.evolution=null;assert.equal(C.startMission(s,'grow-egg',NOW),true);assert.deepEqual(readPart(s,'grow-egg'),[undefined,undefined,undefined,undefined]);
 s.screen='parentDashboard';assert.equal(C.grantParentXP(s,NOW),1000);s.dragon.xp=70000;assert.equal(C.migrate(C.copy(s)).dragon.stage,3);
});
test('the boost never pushes the story XP past the gate, and only the last answer crosses 45,000',()=>{
 const s=fresh(44000);C.recordTime(s,600000,'practice',NOW);assert.equal(C.bonusProgress(s,NOW).active,true);
 for(const id of G.campaign.missions.slice(0,3))readPart(s,id);assert.equal(s.dragon.xp,44750);
 s.dragon.xp=44990;const g=readPart(s,'grow-ride');assert.deepEqual(g,[9,0,0,50]);assert.ok(s.dragon.xp>=45049,'plus any daily bonus');assert.equal(s.dragon.stage,2);
});
test('a quest waiting at 44,000 XP is parked for the story and resumed afterwards; a running fight is not parked',()=>{
 const s=fresh(43990);assert.equal(C.startMission(s,'mk-owl',NOW),true);s.dragon.xp=44000;
 assert.equal(C.startMission(s,'mk-owl',NOW),true,'the open quest can still be continued');
 A.of(s).current.phase='battle';assert.equal(A.blocking(s,'grow-egg'),true);A.of(s).current.phase='intro';
 assert.equal(C.startMission(s,'grow-egg',NOW),true);assert.equal(A.of(s).parked.missionId,'mk-owl');
 for(const id of G.campaign.missions)readPart(s,id);
 assert.equal(A.blocking(s,'mk-river'),true,'the parked quest comes first');
 assert.equal(C.startMission(s,'mk-owl',NOW),true);assert.equal(A.of(s).current.missionId,'mk-owl');assert.equal(A.of(s).current.phase,'intro');assert.equal(A.of(s).parked,null);
 const saved=C.migrate(C.copy(s));assert.equal(saved.expedition.current.missionId,'mk-owl');
});
test('older saves already past the riding stage are not held or sent back',()=>{
 const s=fresh(50000);s.dragon.stage=2;s.dragon.evolutionSeen=2;const r=C.migrate(C.copy(s));
 assert.equal(r.dragon.stage,2);assert.equal(A.growthHeld(r),false);assert.equal(A.unlocked(r,'mk-owl'),true);
 r.dragon.xp=70000;assert.equal(C.migrate(C.copy(r)).dragon.stage,3);
});
