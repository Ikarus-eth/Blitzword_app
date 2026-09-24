const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const C=require('../game-core'),Content=require('../content'),Storage=require('../storage');
const approved=require('../docs/story-review/proposal.json');
const NOW=Date.UTC(2026,8,24),reload=s=>C.migrate(C.copy(s));
function at(index=1){const s=C.migrate(C.fresh());s.assessment.done=true;s.story.clearedAreas=Content.areas.slice(0,index).map(a=>a.id);s.story.completedChapters=Content.chapters.slice(0,Math.floor(index/5)).map(c=>c.id);C.startBattle(s,NOW);return s;}
function reading(index=1){const s=at(index);C.beginChapterStory(s,NOW);s.story.scene.introHeard=true;C.advanceChapterStory(s,NOW);return s;}
function credit(s){return C.copy({battle:s.battle,learning:s.learning,dragon:s.dragon,timing:s.timing,rewards:s.rewards,chapters:s.story.chapters,cleared:s.story.clearedAreas,completed:s.story.completedChapters,math:s.math,campaign:s.campaign,session:s.session});}
test('all approved sentences and exact picture pairs ship; prior-field vocabulary has only the three approved exceptions',()=>{
 const known=new Set(['pip']);let exceptions=0,tokens=0,available=0;
 assert.equal(approved.entries.length,34);
 Content.areas.forEach((area,index)=>{
  if(index){
   const expected=approved.entries[index-1],story=Content.chapterStories[area.id];
   assert.equal(expected.areaId,area.id);assert.equal(story.sentence,expected.sentence);
   assert.deepEqual(story.check,{match:expected.match,other:expected.other,untaughtWord:expected.untaughtWord});
   const words=story.sentence.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g),missing=[...new Set(words.filter(w=>!known.has(w)))];
   assert.deepEqual(missing,expected.untaughtWord?[expected.untaughtWord]:[]);assert.ok(missing.length<=1);exceptions+=missing.length;
   tokens+=words.length;available+=words.filter(w=>known.has(w)).length;
   for(const key of [story.check.match,story.check.other]){
    const picture=Content.storyPictures[key],source=approved.assets[key];
    assert.deepEqual(picture,{src:source.src,width:source.width,height:source.height,crop:source.crop,alt:source.description});
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(require('node:path').join(__dirname,'..',picture.src))).digest('hex'),source.sha256);
    if(picture.crop){const [x,y,w,h]=picture.crop;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=picture.width&&y+h<=picture.height);}
   }
  }
  for(const word of area.words)known.add(word);
 });
 assert.equal(exceptions,3);assert.equal(tokens,161);assert.equal(available,158);
 assert.equal(Content.chapterStories[Content.areas[0].id].check,null);
});
test('picture order can put the match on either side and survives migration unchanged',()=>{
 const random=Math.random;let left,right;
 try{Math.random=()=>0;left=reading();Math.random=()=>.999;right=reading();}finally{Math.random=random;}
 assert.notDeepEqual(left.story.scene.reading.options,right.story.scene.reading.options);
 for(const s of [left,right]){const q=C.copy(s.story.scene.reading);assert.deepEqual(reload(s).story.scene.reading,q);C.beginChapterStory(s,NOW);assert.deepEqual(s.story.scene.reading,q);}
});
for(const correct of [true,false])test((correct?'matching':'other')+' picture saves the first answer once, reveals the match, continues and earns no credit',()=>{
 let s=reading(12);const before=credit(s),scene=s.story.scene,q=scene.reading;
 assert.equal(C.advanceChapterStory(s,NOW),false,'reading requires a choice');
 const chosen=correct?q.match:q.options.find(k=>k!==q.match),record=C.answerChapterStory(s,chosen,NOW+2);
 assert.equal(record.correct,correct);assert.equal(record.firstChoice,chosen);assert.equal(record.completedAt,null);assert.equal(scene.phase,'feedback');
 assert.equal(C.answerChapterStory(s,q.match,NOW+3),null);assert.equal(C.noteStoryHelp(s,'sentence'),false);assert.equal(C.storyPictureFailed(s,NOW+3),false);
 assert.deepEqual(C.parentProgress(s).storyChecks[0].firstChoice,chosen);assert.deepEqual(credit(s),before);
 s=reload(s);assert.equal(s.story.scene.phase,'feedback');assert.deepEqual(s.story.scene.reading,q);
 assert.equal(C.advanceChapterStory(s,NOW+4),true);assert.equal(C.advanceChapterStory(s,NOW+5),false);assert.equal(C.beginChapterStory(s,NOW+6),false);
 assert.deepEqual(credit(s),before);assert.equal(s.story.scenes[scene.areaId].firstChoice,chosen);assert.equal(s.story.scenes[scene.areaId].completedAt,new Date(NOW+4).toISOString());
 assert.equal(s.activity,'battle');assert.equal(s.story.scene,null);assert.equal(C.parentProgress(s).activeMs,0);
});
test('only sentence listening and the declared word count as help; replays stay bounded and do not teach words',()=>{
 let s=reading(3),before=credit(s);assert.equal(C.noteStoryHelp(s,'book'),false);assert.equal(C.answerChapterStory(s,'not-an-option',NOW),null);
 assert.equal(C.noteStoryHelp(s,'the'),true);assert.equal(C.noteStoryHelp(s,'the'),true);assert.equal(C.noteStoryHelp(s,'sentence'),true);s=reload(s);
 assert.equal(s.story.scene.helped,true);assert.deepEqual(s.story.scene.reading.listenedWords,['the']);assert.equal(s.story.scene.reading.listenedSentence,true);
 C.answerChapterStory(s,s.story.scene.reading.match,NOW);C.advanceChapterStory(s,NOW);
 const record=C.parentProgress(s).storyChecks[0];assert.equal(record.helped,true);assert.deepEqual(record.listenedWords,['the']);assert.equal(record.listenedSentence,true);assert.deepEqual(credit(s),before);
});
test('old intro/read scenes migrate in place; completed stories and saved battle questions stay untouched',()=>{
 for(const phase of ['intro','read']){
  const old=at(7),battle=C.copy(old.battle);old.story.scene={areaId:old.battle.areaId,battleId:old.battle.id,phase,introHeard:phase==='read',helped:true,startedAt:new Date(NOW).toISOString()};old.activity='chapterStory';
  const s=reload(old);assert.equal(s.story.scene.phase,phase);assert.equal(s.story.scene.introHeard,phase==='read');assert.equal(s.story.scene.reading.listenedSentence,true);assert.deepEqual(s.battle,battle);
  assert.equal(s.story.scene.reading.sentence,Content.chapterStories[s.battle.areaId].sentence);
 }
 const old=at(7);old.story.scenes[old.battle.areaId]={completedAt:new Date(NOW).toISOString(),helped:true};const records=C.copy(old.story.scenes),s=reload(old);
 assert.deepEqual(s.story.scenes,records);assert.equal(C.beginChapterStory(s,NOW),false);assert.equal(C.parentProgress(s).storyChecks[0].correct,undefined);
 const pending=at(8);C.prepareBattle(pending,NOW);const question=C.copy(pending.battle.question),r=reload(pending);assert.equal(C.beginChapterStory(r,NOW),false);assert.deepEqual(r.battle.question,question);
});
test('backup file round trips preserve reading order, first choice, feedback and help',()=>{
 for(const phase of ['read','feedback']){
  const s=reading(4);C.noteStoryHelp(s,'look');if(phase==='feedback')C.answerChapterStory(s,s.story.scene.reading.options.find(k=>k!==s.story.scene.reading.match),NOW);
  const file=Storage.backupFile(s,{now:NOW,build:'story-pictures-test'}),restored=Storage.readBackup(file.text).state;
  assert.deepEqual(restored.story,s.story);assert.deepEqual(restored.battle,s.battle);
 }
});
test('unavailable pictures allow continuation without fabricating an answer or awarding credit',()=>{
 const s=reading(),before=credit(s);assert.equal(C.storyPictureFailed(s,NOW),true);assert.equal(C.storyPictureFailed(s,NOW),false);
 assert.equal(C.answerChapterStory(s,s.story.scene.reading.match,NOW),null);assert.equal(s.story.scene.phase,'feedback');assert.equal(C.advanceChapterStory(s,NOW),true);
 const r=C.parentProgress(reload(s)).storyChecks[0];assert.equal(r.pictureUnavailable,true);assert.equal(r.firstChoice,null);assert.equal(r.correct,null);assert.equal(r.answeredAt,null);assert.deepEqual(credit(s),before);
});
