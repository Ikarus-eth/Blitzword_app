const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../content'),Core=require('../game-core');
const now=Date.UTC(2026,8,22),fresh=()=>Core.migrate(Core.fresh());
test('reviewed practice alternatives require more than first-letter or length guessing',()=>{
 for(const {w,d} of C.words){
  assert.equal(new Set(d).size,4,w);assert.equal(d.filter(x=>x===w).length,1,w);
  const wrong=d.filter(x=>x!==w);assert.ok(wrong.some(x=>x.length===w.length),'same-length alternative: '+w);
  if(w.length>1)assert.ok(wrong.filter(x=>x[0]===w[0]).length>=2,'same-initial alternatives: '+w);
 }
 assert.deepEqual(C.words.find(x=>x.w==='treasure').d,['treasure','traesure','trasure','treason']);
 // An in-flight old question retains its exact choices on reload.
 const s=fresh();Core.startBattle(s,now);const q=Core.prepareBattle(s,now);q.options=['on','in','an','no'];assert.deepEqual(Core.migrate(s).battle.question.options,q.options);
});
test('the full approved Core 200 is allocated exactly once across seven playable chapters',()=>{
 assert.equal(C.words.length,200);assert.equal(new Set(C.words.map(x=>x.w)).size,200);assert.equal(C.chapters.length,7);assert.equal(C.areas.length,35);
 assert.deepEqual(C.chapters.map(c=>c.words.length),[30,30,30,30,30,30,20]);
 assert.deepEqual(C.areas.flatMap(a=>a.words),C.words.map(w=>w.w));
 assert.ok(C.areas.every(a=>a.available));assert.ok(C.words.every(w=>new Set(w.d).size===4&&w.d.filter(d=>d===w.w).length===1));
 for(const item of C.words)assert.ok(new RegExp('\\b'+item.w+'\\b','i').test(item.sentence),'Whole target in sentence: '+item.w);
});
test('curated variants match selected HP; legacy encounters above 32 HP remain readable',()=>{
 const s=fresh();let last=null;
 for(let hp=3;hp<=55;hp++){
  const candidates=Core.enemyChoices(s,hp);assert.ok(candidates.length>=1);
  for(const e of candidates){assert.ok(hp>=e.minHealth&&hp<=e.maxHealth);if(hp>32)assert.equal(e.maxHealth-e.minHealth,2);}
  Core.startBattle(s,now,{strength:hp,enemyId:candidates[0].id});const chosen=C.enemyAt(s.battle.enemyId);assert.equal(s.battle.maxHealth,hp);assert.ok(hp>=chosen.minHealth&&hp<=chosen.maxHealth);last=chosen;
 }
});
test('the resolution guard cannot mark a living enemy and hero complete',()=>{
 const s=fresh();Core.startBattle(s,now);Core.resolveBattle(s,now);assert.equal(s.battle.resolved,false);assert.equal(s.result,null);
 s.session.elapsedMs=Core.TARGET_MS+10000;for(let i=0;i<10;i++){const q=Core.prepareBattle(s,now+i);q.phase='choices';Core.answerBattle(s,'?',now+i);Core.startTeaching(s,q.target,'battle',now+i);Core.leaveTeaching(s,now+i);}
 assert.equal(s.battle.heroHealth,3);assert.equal(s.battle.enemyHealth,3);assert.equal(s.activity,'battle');
});
test('old completed chapters migrate without erasing progress, and a new finale opens the next chapter map',()=>{
 let s=fresh();delete s.story.completedChapters;s.story.chapterComplete=true;s.story.clearedAreas=C.areas.slice(0,5).map(a=>a.id);s.dragon.xp=98;
 s=Core.migrate(s);assert.equal(Core.currentChapter(s).id,'chapter-2');assert.equal(s.dragon.xp,98);assert.equal(s.story.clearedAreas.length,5);
 const chapter=Core.currentChapter(s);for(const word of chapter.words){s.learning.words[word].introducedAt=new Date(now).toISOString();s.learning.words[word].practiceSuccesses=2;}
 s.campaign.wins=20;s.campaign.checkpointWins=20;for(const a of C.areas.filter(a=>a.chapterId===chapter.id))Object.assign(Core.chapterState(s,a.id),{wins:3,duels:1,activeMs:600000});s=Core.migrate(s);Core.startBattle(s,now);assert.equal(s.battle.finalEncounter,true);
 s.battle.enemyHealth=0;Core.resolveBattle(s,now);assert.equal(s.story.mapPending,true);assert.equal(s.result.chapterJustComplete,true);assert.equal(Core.currentChapter(s).id,'chapter-3');
});
test('battle rewards sum accepted answers and cannot count duplicated delivery',()=>{
 const s=fresh();Core.startBattle(s,now);for(let i=0;i<3;i++){const q=Core.prepareBattle(s,now+i);q.phase='choices';Core.answerBattle(s,q.target,now+i);Core.answerBattle(s,q.target,now+i);}
 Core.prepareBattle(s,now+10);assert.equal(s.result.xpEarned,9);assert.equal(s.dragon.xp,9);assert.equal(s.result.victory,true);
});
