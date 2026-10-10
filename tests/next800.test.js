const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../content'),Core=require('../game-core'),Audio=require('../audio'),Storage=require('../storage');
const proposal=require('../curriculum/NEXT800_FIRST_BOOKS.json'),compiled=require('../curriculum/next800-content.json');
const NOW=Date.UTC(2026,9,9,2),fresh=()=>Core.migrate(Core.fresh());
test('lossless word tables preserve nulls, optional fields, legacy entries and raw backup readability',()=>{
 const s=fresh();s.learning.words.has.customNote='keep me';s.learning.words.sat.independentCorrect=17;
 s.archive={words:{has:{correct:3,wrong:{hat:2},positions:{start:0,end:2},kept7At:null},legacy:{custom:[1,null,'yes']}}};
 s.campaign.battleRecords.push({target:'has',correct:true,xpEarned:3,customNote:null});s.learning.teaching.push({target:'sat',at:'2026-10-09',custom:['keep']});
 const before=Core.copy(s),packed=Core.packSave(s);assert.deepEqual(s,before);assert.equal(packed.schemaVersion,3);
 assert.deepEqual(Core.unpackSave(JSON.parse(JSON.stringify(packed))),before);
 assert.deepEqual(Core.packSave(packed),packed,'already packed input is not double-encoded');
 assert.ok(JSON.stringify(packed).length<JSON.stringify(s).length/2);
 assert.deepEqual(JSON.parse(Storage.backupFile(s).text).state,s,'export remains ordinary JSON');
 const bad=Core.copy(packed);bad.learning.words.has=[99999];assert.throws(()=>Core.unpackSave(bad),/Invalid word table/);
 const future=Core.copy(packed);future.wordTables.version=99;assert.throws(()=>Core.unpackSave(future),/Unsupported/);
});
function completedCore(){const s=fresh();s.profile.name='Existing reader';s.assessment.done=true;s.dragon.xp=19000;s.dragon.stage=1;
 for(const item of C.coreWords)Object.assign(s.learning.words[item.w],{introducedAt:new Date(NOW-Core.DAY).toISOString(),practiceSuccesses:2,independentCorrect:4,reviewStage:1,dueAt:NOW+Core.DAY});
 s.story.completedChapters=C.chapters.map(x=>x.id);s.story.clearedAreas=C.areas.map(x=>x.id);s.story.chapterComplete=true;return s;}
test('approved 800 are appended exactly once; core and story allocation stay fixed',()=>{
 assert.equal(C.words.length,1000);assert.equal(C.coreWords.length,200);
 assert.equal(new Set(C.words.map(x=>x.w.toLowerCase())).size,1000);
 assert.deepEqual(C.words.slice(200),compiled);
 assert.deepEqual(new Set(compiled.map(x=>x.w)),new Set(proposal.words.map(x=>x.word)));
 assert.deepEqual(C.areas.flatMap(x=>x.words),C.coreWords.map(x=>x.w));
 assert.deepEqual(C.chapters.map(x=>x.words.length),[30,30,30,30,30,30,20]);
 assert.deepEqual(C.words.slice(200,205).map(x=>x.w),['has','been','does','us','its']);
 for(const item of compiled){assert.deepEqual(Core.byWord[item.w],item);assert.match(item.sentence,new RegExp('\\b'+item.w+'\\b','i'));assert.ok(item.teaching.tip.length>8,item.w);assert.ok(item.teaching.pattern);assert.ok(item.batch>=1&&item.batch<=8);}
});
test('number words, ordinals, contractions and ambiguous pronunciations have teaching support',()=>{
 const numbers='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand first second third fourth fifth sixth seventh eighth ninth tenth'.split(' ');
 for(const w of numbers)assert.ok(Core.byWord[w],w);
 for(const w of numbers.filter(w=>!['one','two','first'].includes(w)))assert.ok(Core.byWord[w].teaching.symbol,w);
 assert.equal(Core.byWord.forty.teaching.symbol,'40');assert.match(Core.byWord.forty.teaching.tip,/no u/);
 assert.match(Core.byWord["can't"].teaching.tip,/cannot/);assert.match(Core.byWord.slept.teaching.tip,/sleep/);
 for(const w of ['live','wind','close','lead','reading','present'])assert.equal(Core.byWord[w].spoken,Core.byWord[w].sentence);
});
test('a legacy completed save opens new words without resetting evidence, rewards or pending choices',()=>{
 const s=completedCore();Core.startBattle(s,NOW,{strength:32});const q=Core.prepareBattle(s,NOW,()=>.3);assert.equal(q.target,'has');assert.equal(q.isNew,true);
 const pending=Core.copy(q),coreHistory=Core.copy(s.learning.words.on);
 // A pre-expansion save has no entries for the new targets.
 for(const item of compiled)delete s.learning.words[item.w];
 const restored=Core.migrate(Core.copy(s));assert.deepEqual(restored.learning.words.on,coreHistory);
 assert.deepEqual(restored.battle.question,pending);assert.equal(restored.dragon.xp,19000);assert.equal(restored.dragon.stage,1);
 assert.equal(restored.story.clearedAreas.length,35);assert.equal(restored.learning.words.thousand.introducedAt,null);
 assert.equal(restored.learning.words.thousand.independentCorrect,0);
 const backup=Storage.readBackup(Storage.backupFile(restored,{now:NOW}).text).state;
 assert.deepEqual(backup.battle.question,pending);assert.deepEqual(backup.learning.words,restored.learning.words);
});
test('all 800 are reachable through actual adaptive battles after the core is learned',()=>{
 const s=completedCore(),seen=new Set();let time=NOW;
 for(let turn=0;turn<5500&&seen.size<800;turn++){
  if(!s.battle||s.battle.resolved)Core.startBattle(s,time,{strength:32});
  const q=Core.prepareBattle(s,time,()=>.4);if(!q){time+=100;continue;}
  if(Core.byWord[q.target].expansion)seen.add(q.target);
  q.phase='choices';q.responseMs=1300;Core.answerBattle(s,q.target,time);time+=1000;
 }
 assert.equal(seen.size,800);assert.equal(s.story.clearedAreas.length,35);assert.ok(s.dragon.xp>19000);
});
test('new teaching survives reload and returns to its existing battle',()=>{
 const s=completedCore();Core.startBattle(s,NOW,{strength:32});const q=Core.prepareBattle(s,NOW);q.phase='choices';
 Core.answerBattle(s,'?',NOW);Core.startTeaching(s,q.target,'battle',NOW);
 const restored=Core.migrate(Core.copy(s));assert.equal(restored.teaching.target,'has');assert.equal(restored.battle.question.target,'has');
 Core.leaveTeaching(restored,NOW+1000);assert.equal(restored.activity,'battle');assert.equal(restored.battle.heroHealth,s.battle.heroHealth);
});
test('new speech uses existing local fallback without external generation, and cancellation still works',()=>{
 const spoken=[];let utterance=null,done=0;
 const synth={getVoices:()=>[{name:'Daniel',lang:'en-GB',voiceURI:'gb',localService:true}],cancel(){},resume(){},speak(u){utterance=u;spoken.push(u.text);}};
 const narrator=Audio.narrator({synth,Utterance:function(text){this.text=text;},clips:{},schedule:()=>1,unschedule(){}});
 for(const item of compiled){narrator.speak(item.spoken||item.w,{onEnd:()=>done++});assert.equal(utterance.lang,'en-GB');utterance.onend();}
 assert.equal(done,800);assert.ok(spoken.includes('We live in a small house.'));
 narrator.speak(Core.byWord.thousand.sentence,{onEnd:()=>done++});const old=utterance;narrator.cancel();old.onend();assert.equal(done,800);
});
