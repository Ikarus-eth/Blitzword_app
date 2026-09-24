const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),Content=require('../content'),Audio=require('../audio');
const NOW=Date.UTC(2026,8,23),fresh=()=>C.migrate(C.fresh()),reload=s=>C.migrate(C.copy(s));
function at(index){const s=fresh();s.assessment.done=true;s.story.clearedAreas=Content.areas.slice(0,index).map(a=>a.id);s.story.completedChapters=Content.chapters.slice(0,Math.floor(index/5)).map(c=>c.id);C.startBattle(s,NOW);return s;}
test('all 34 chapter transitions have short authored stories and readable sentences with existing scene crops',()=>{
 assert.equal(Content.areas.length,35);assert.equal(Object.keys(Content.chapterStories).length,35);
 for(let i=1;i<35;i++){
  const s=at(i),story=Content.chapterStories[s.battle.areaId];assert.ok(story.narration.split(/\s+/).length<=25);assert.ok(story.sentence.split(/\s+/).length<=7);
  assert.ok(story.scene===null||Number.isInteger(story.scene)&&story.scene>=0&&story.scene<6);
  assert.equal(C.beginChapterStory(s,NOW),true);assert.equal(s.story.scene.areaId,Content.areas[i].id);
  const p=C.chapterLocation(s,s.battle.areaId);assert.equal(p.campaignNumber,Math.floor(i/5)+1);assert.equal(p.chapterNumber,i%5+1);
 }
});
test('intro and reading phases persist; completion is idempotent and gives no scored credit',()=>{
 let s=at(1);C.beginChapterStory(s,NOW);const battle=C.copy(s.battle),xp=s.dragon.xp,words=C.copy(s.learning.words);
 assert.equal(C.advanceChapterStory(s,NOW),false);s=reload(s);assert.equal(s.story.scene.phase,'intro');
 s.story.scene.introHeard=true;assert.equal(C.advanceChapterStory(s,NOW),true);s.story.scene.helped=true;s=reload(s);
 assert.equal(s.story.scene.phase,'read');assert.equal(C.beginChapterStory(s,NOW),true);
 C.answerChapterStory(s,s.story.scene.reading.match,NOW+99);assert.equal(C.advanceChapterStory(s,NOW+100),true);assert.equal(C.advanceChapterStory(s,NOW+100),false);
 assert.equal(C.beginChapterStory(s,NOW+100),false);assert.equal(s.activity,'battle');assert.deepEqual(s.battle,battle);
 assert.equal(s.dragon.xp,xp);assert.deepEqual(s.learning.words,words);assert.equal(s.campaign.battleRecords.length,0);
 assert.equal(s.story.scenes['fox-crossing'].helped,true);assert.equal(C.parentProgress(s).activeMs,0);
 s=reload(s);assert.equal(C.beginChapterStory(s,NOW),false);
});
test('initial battle, saved questions, completed places and campaign finales are never interrupted by stories',()=>{
 assert.equal(C.beginChapterStory(at(0),NOW),false);
 const old=at(7);delete old.story.scenes;delete old.story.scene;C.prepareBattle(old,NOW);const q=C.copy(old.battle.question),s=reload(old);
 assert.deepEqual(s.battle.question,q);assert.equal(C.beginChapterStory(s,NOW),false);
 const complete=at(1);complete.story.clearedAreas.push(complete.battle.areaId);assert.equal(C.beginChapterStory(complete,NOW),false);
 for(const key of ['demo','finalEncounter','resolved']){const t=at(1);t.battle[key]=true;assert.equal(C.beginChapterStory(t,NOW),false);}
});
test('first evolution naming personalizes stories without changing their saved phase or scored learning',()=>{
 let s=at(7);assert.equal(C.nameDragon(s,'Ember'),false);s.dragon.xp=15000;s=reload(s);assert.equal(C.nameDragon(s,'Ember'),true);
 C.beginChapterStory(s,NOW);s.story.scene.introHeard=true;C.advanceChapterStory(s,NOW);s=reload(s);
 assert.equal(s.dragon.name,'Ember');assert.equal(s.story.scene.phase,'read');assert.equal(s.dragon.xp,15000);
});
test('new story speech uses the existing immediate fallback and cancellation blocks stale completion',()=>{
 const utterances=[];let downloads=0,finished=0;
 const synth={getVoices:()=>[],cancel(){},resume(){},speak:u=>utterances.push(u)};
 const narrator=Audio.narrator({synth,Utterance:function(text){this.text=text;},AudioContext:function(){},fetchAudio:()=>{downloads++;},clips:{},schedule:()=>1,unschedule(){}});
 narrator.speak(Content.chapterStories['fox-crossing'].narration,{onEnd:()=>finished++});assert.equal(downloads,0);assert.equal(utterances.length,1);
 narrator.cancel();utterances[0].onend();assert.equal(finished,0);
 narrator.speak(Content.chapterStories['fox-crossing'].sentence,{onEnd:()=>finished++});utterances[1].onend();assert.equal(finished,1);
});
