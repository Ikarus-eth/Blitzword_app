const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),A=C.Adventure,D=A.Data,Content=require('../content'),T=require('../assets/adventures/thunder-mountain/campaign');
const NOW=Date.UTC(2026,10,2,9);
const NAMES=new Set(['artus','pip','jet','grandma']);
const words=t=>(t.match(/[A-Za-z]+(?:[’'][a-z]+)?/g)||[]);
const key=w=>w.toLowerCase().replace(/[’']s$/,'');
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;for(const m of D.missions.filter(m=>m.campaign!=='thunder-mountain'))A.stats(s,m.id).completedAt=new Date(NOW).toISOString();return s;}
function win(s,now=NOW){
  assert.equal(C.startMissionBattle(s,now),true);s.battle.introPending=false;const seen=[];
  while(s.battle.enemyHealth>0){const q=C.prepareBattle(s,now);q.phase='choices';seen.push(q);assert.equal(C.answerBattle(s,q.target,now+=8000).correct,true);}
  C.prepareBattle(s,now);assert.equal(s.result.victory,true);return {now,seen};
}
function solve(s,now=NOW){A.startPuzzle(s,()=>0.4);const q=D.puzzles[A.of(s).current.puzzle.id];for(const id of [q.answer].flat())A.choose(s,id);assert.equal(A.check(s,now).correct,true);A.next(s,now);}
function toStory(s,id,now=NOW){
  assert.equal(C.startMission(s,id,now),true);const seen=[];
  for(let step=0;step<4;step++){const r=win(s,now);now=r.now;seen.push(...r.seen);solve(s,now+=30000);}
  assert.equal(A.of(s).current.phase,'story');return {now,seen};
}
function readAll(s,now=NOW){const m=A.current(s);for(let p=0;p<m.story.pages.length;p++)assert.equal(A.turnStoryPage(s,p),true);return C.finishStoryReading(s,now,()=>0.3);}

test('six story quests: 48 curriculum target words, three pages and three questions each, after Sky stars',()=>{
  const c=D.campaigns.at(-1);assert.equal(c.id,'thunder-mountain');assert.equal(c.missions.length,6);assert.equal(T.missions.length,6);
  const targets=T.missions.flatMap(m=>m.story.targets);assert.equal(targets.length,48);assert.equal(new Set(targets).size,48);
  for(const w of targets)assert.ok(Content.words.some(i=>i.w===w),w);
  const s=fresh();delete s.expedition.missions['aurora-crown'];assert.equal(A.unlocked(s,'tm-jet-missing'),false);
  A.stats(s,'aurora-crown').completedAt=new Date(NOW).toISOString();assert.equal(A.unlocked(s,'tm-jet-missing'),true);assert.equal(A.unlocked(s,'tm-stream'),false);
  let total=0;
  for(const m of T.missions){
    assert.deepEqual(m.health,[10,11,12,14]);assert.equal(m.riddles.length,4);assert.equal(m.story.pages.length,3);assert.equal(m.story.questions.length,3);
    assert.ok(m.story.words>=110&&m.story.words<=150,m.id+' '+m.story.words);total+=m.story.words;
    for(const q of [...m.riddles,...m.story.questions]){assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);for(const id of [q.answer].flat())assert.ok(q.options.some(o=>o.id===id));}
    for(const q of m.story.questions)assert.ok([1,2,3].includes(q.page));
    for(const f of m.families){assert.ok(Content.creatures.some(e=>e.id===f));assert.equal(A.findMission(f).id,m.id);}
  }
  assert.ok(total>=780,String(total));
});
test('every story word can be heard; every content word and its part of speech has a simple meaning',()=>{
  const fn=new Set('it was a and the by with to she you he is but at we him them an go in his they of i am too on that there from were can this are your have now be no one so her when my than for me not did all'.split(' '));
  for(const m of T.missions)for(const p of m.story.pages.flat())for(const w of words(p)){const k=key(w);if(fn.has(k))continue;assert.ok(T.glossary[k],k);}
  for(const [w,[meaning,parts]] of Object.entries(T.glossary)){assert.ok(meaning.length>5,w);if(parts)assert.equal(parts.replace(/\|/g,'').toLowerCase(),w);}
});
test('each story text uses only names, earlier story words, pre-taught targets or curriculum words',()=>{
  const curriculum=new Set(Content.words.map(i=>i.w)),known=new Set(NAMES);
  for(const m of T.missions){m.story.targets.forEach(w=>known.add(w));
    for(const p of m.story.pages.flat())for(const w of words(p)){const k=key(w);assert.ok(known.has(k)||curriculum.has(k)||curriculum.has(k.replace(/s$/,'')),m.id+': '+k);known.add(k);}
    for(const q of m.story.questions)for(const w of words(q.prompt+' '+q.options.map(o=>o.label).join(' '))){const k=key(w);assert.ok(known.has(k)||known.has(k.replace(/s$/,''))||curriculum.has(k),m.id+' question: '+w);}
  }
});
test('story fights show the chapter words, opening new ones even past the open-word cap',()=>{
  const s=fresh(),open=Content.words.filter(i=>!T.missions[0].story.targets.includes(i.w)).slice(0,C.OPEN_WORD_CAP+5);
  for(const i of open)s.learning.words[i.w].introducedAt=new Date(NOW-86400000).toISOString();
  assert.ok(C.openWords(s)>=C.OPEN_WORD_CAP);
  const {seen}=toStory(s,'tm-jet-missing');const shown=new Set(seen.map(q=>q.target));
  for(const w of T.missions[0].story.targets){assert.ok(shown.has(w),w);assert.ok(s.learning.words[w].introducedAt,w);}
  assert.ok(seen.filter(q=>/^story/.test(q.practiceKind)).length>=seen.length/3);
  // Outside a story quest the cap still holds.
  const t=fresh();for(const i of open)t.learning.words[i.w].introducedAt=new Date(NOW-86400000).toISOString();
  C.startBattle(t,NOW);t.battle.introPending=false;
  for(let i=0;i<30&&!t.battle.resolved;i++){const q=C.prepareBattle(t,NOW+i*8000);if(!q)break;q.phase='choices';assert.ok(!/^story/.test(q.practiceKind||''));C.answerBattle(t,q.target,NOW+i*8000+4000);}
  for(const w of T.missions[0].story.targets)assert.equal(t.learning.words[w].introducedAt,null,w);
});
test('reading needs every page; questions keep their order through reloads; a miss sends the child back to the page, never costs a heart',()=>{
  let s=fresh(),{now}=toStory(s,'tm-jet-missing');const m=A.current(s),hearts=A.of(s).current.hearts;
  assert.equal(C.finishStoryReading(s,now),false);
  assert.equal(A.turnStoryPage(s,3),false);assert.equal(A.turnStoryPage(s,1),true);
  s=C.migrate(JSON.parse(JSON.stringify(s)));assert.equal(A.story(s).page,1);
  const done=readAll(s,now);assert.equal(done.first,true);assert.ok(done.xpEarned>=100);
  const order=[...A.story(s).orders[0]];s=C.migrate(JSON.parse(JSON.stringify(s)));assert.deepEqual(A.story(s).orders[0],order);
  const q=A.storyQuestion(s);assert.equal(A.chooseStory(s,'2',q.id),true);const miss=C.checkStory(s,now,q.id);
  assert.deepEqual(miss,{correct:false,page:q.page});assert.equal(A.of(s).current.hearts,hearts);
  assert.equal(C.checkStory(s,now,q.id),false,'cannot retry without looking back');
  assert.equal(A.lookBack(s),true);assert.equal(A.story(s).page,q.page-1);assert.equal(A.turnStoryPage(s,0),true);assert.equal(A.backToQuestion(s),true);
  A.chooseStory(s,'0',q.id);const right=C.checkStory(s,now,q.id);assert.equal(right.correct,true);assert.ok(right.xpEarned>=50);
  for(const next of m.story.questions.slice(1)){A.chooseStory(s,'0',next.id);assert.equal(C.checkStory(s,now,next.id).correct,true);}
  assert.equal(A.of(s).current.phase,'complete');assert.ok(A.stats(s,'tm-jet-missing').completedAt);
  assert.deepEqual(A.stats(s,'tm-jet-missing').storyLast,{words:m.story.words,taps:0,meanings:0,firstTry:2,at:new Date(now).toISOString()});
  assert.equal(A.unlocked(s,'tm-stream'),true);assert.equal(A.progress(s).done,9);
});
test('tapped words are noted as support and come back in the next chapter’s fights',()=>{
  let s=fresh(),{now}=toStory(s,'tm-jet-missing');
  assert.equal(C.noteStoryTap(s,'Grandma’s','sound',now),'grandma');
  assert.equal(C.noteStoryTap(s,'cousin.','sound',now),'cousin');assert.equal(C.noteStoryTap(s,'cousin','meaning',now),'cousin');
  assert.equal(s.learning.supportExposures.at(-1).kind,'story-tap');assert.equal(s.learning.supportExposures.at(-1).target,'cousin');
  readAll(s,now);for(const q of A.current(s).story.questions){A.chooseStory(s,'0',q.id);C.checkStory(s,now,q.id);}
  assert.equal(A.stats(s,'tm-jet-missing').storyLast.taps,2);assert.equal(A.stats(s,'tm-jet-missing').storyLast.meanings,1);
  C.startMission(s,'tm-stream',now);C.startMissionBattle(s,now);assert.ok(A.focusWords(s).includes('cousin'));assert.ok(A.focusWords(s).includes('stream'));
  A.switchTo(s,'legacy');assert.deepEqual(A.focusWords(s),[]);
});
test('story reading time is capped per page by its length and counts towards daily play',()=>{
  const s=fresh(),{now}=toStory(s,'tm-jet-missing'),m=A.current(s),words=m.story.pages[0].join(' ').split(/\s+/).length;
  const credited=C.recordRiddleTime(s,600000,now+600000);
  assert.equal(credited,words*A.STORY_PAGE_MS_PER_WORD);assert.equal(C.recordRiddleTime(s,5000,now+605000),0);
  A.turnStoryPage(s,1);assert.ok(C.recordRiddleTime(s,5000,now+610000)>0);
});
test('an in-progress Star Trail save migrates unchanged and the whole story campaign can be played after it',()=>{
  let s=fresh();delete s.expedition.missions['aurora-crown'];C.startMission(s,'aurora-crown',NOW);
  const before=JSON.stringify(s.expedition.current);s=C.migrate(JSON.parse(JSON.stringify(s)));assert.equal(JSON.stringify(s.expedition.current),before);
  A.stats(s,'aurora-crown').completedAt=new Date(NOW).toISOString();A.of(s).current.phase='complete';
  let now=NOW;for(const id of D.campaigns.at(-1).missions){({now}=toStory(s,id,now));readAll(s,now);for(const q of A.current(s).story.questions){A.chooseStory(s,'0',q.id);C.checkStory(s,now,q.id);}s=C.migrate(JSON.parse(JSON.stringify(s)));}
  assert.equal(A.campaignComplete(s,'thunder-mountain'),true);
});
