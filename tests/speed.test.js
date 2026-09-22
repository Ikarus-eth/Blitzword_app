const test=require('node:test'),assert=require('node:assert/strict'),C=require('../game-core');
const NOW=Date.UTC(2026,8,22);
test('speed is voluntary, survives reload, and never alters the saved question or assessment calibration',()=>{
 let s=C.migrate(C.fresh());s.assessment.done=true;s.assessment.exposure=2200;C.startBattle(s,NOW);C.prepareBattle(s,NOW);
 const pending=C.copy(s.battle.question);assert.equal(pending.exposureMs,2200);
 assert.ok(C.chooseSpeed(s,'run'));assert.deepEqual(s.battle.question,pending);assert.equal(s.assessment.exposure,2200);
 s=C.migrate(C.copy(s));assert.equal(C.practiceExposure(s),950);assert.deepEqual(s.battle.question,pending);
 C.chooseSpeed(s,'crawl');assert.equal(C.practiceExposure(s),null);C.chooseSpeed(s,'walk');assert.equal(C.practiceExposure(s),1800);
});
test('ride and fly require the existing chapter and expansion gates plus rideable Pip',()=>{
 const s=C.migrate(C.fresh());assert.deepEqual(C.speedChoices(s).map(x=>x.locked),[false,false,false,true,true]);
 s.entitlements={expansion:true};s.story.chapterComplete=true;assert.equal(C.chooseSpeed(s,'ride'),false);
 s.dragon.stage=3;assert.equal(C.chooseSpeed(s,'ride'),true);assert.equal(C.practiceExposure(s),600);assert.equal(C.chooseSpeed(s,'fly'),true);
 s.entitlements.expansion=false;assert.equal(C.chooseSpeed(s,'fly'),false);assert.equal(C.practiceExposure(s),s.assessment.exposure);
});
