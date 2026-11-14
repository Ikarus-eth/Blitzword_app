const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../game-core'),A=C.Adventure,D=A.Data,Content=require('../content'),M=require('../assets/adventures/wizard-tower/campaign'),T=require('../assets/adventures/thunder-mountain/campaign'),K=require('../assets/adventures/moon-key/campaign');
const NOW=Date.UTC(2026,10,14,9);
const NAMES=new Set(['artus','pip','oren','gus']);
// Words outside the 1,000-word curriculum that the story needs; each has a meaning and is tappable.
const EXTRA=new Set(['tower','beard','boom','hello']);
const words=t=>(t.match(/[A-Za-z]+(?:[’'][a-z]+)?/g)||[]);
const key=w=>w.toLowerCase().replace(/’/g,"'").replace(/'s$/,'');
const forms=k=>[k,k.replace(/s$/,''),k.replace(/es$/,''),k.replace(/ies$/,'y')];
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;for(const m of D.missions.filter(m=>m.campaign!=='wizard-tower'))A.stats(s,m.id).completedAt=new Date(NOW).toISOString();return s;}
function win(s,now=NOW){
  assert.equal(C.startMissionBattle(s,now),true);s.battle.introPending=false;
  while(s.battle.enemyHealth>0){const q=C.prepareBattle(s,now);q.phase='choices';assert.equal(C.answerBattle(s,q.target,now+=8000).correct,true);}
  C.prepareBattle(s,now);assert.equal(s.result.victory,true);return now;
}
function readAll(s,now=NOW){const st=A.currentStory(s);for(let p=0;p<st.pages.length;p++)assert.equal(A.turnStoryPage(s,p),true);return C.finishStoryReading(s,now,()=>0.3);}
function answerAll(s,now=NOW){let r;for(const q of A.currentStory(s).questions){A.chooseStory(s,'0',q.id);r=C.checkStory(s,now,q.id);assert.equal(r.correct,true);}return r;}

test('Wizard’s Tower: eight story quests after the Moon Key, 64 new curriculum targets, mid and end stories',()=>{
  const i=D.campaigns.findIndex(c=>c.id==='wizard-tower');assert.equal(i,D.campaigns.filter(c=>!c.growth).length-1);assert.equal(D.campaigns[i-1].id,'moon-key');
  assert.equal(M.missions.length,8);assert.deepEqual(D.campaigns[i].missions,M.missions.map(m=>m.id));
  const targets=M.missions.flatMap(m=>m.story.targets);assert.equal(targets.length,64);assert.equal(new Set(targets).size,64);
  for(const w of targets)assert.ok(Content.words.some(i=>i.w===w),w);
  for(const w of targets)assert.ok(![...T.missions,...K.missions].some(m=>m.targets.includes(w)),'already taught: '+w);
  const s=fresh();delete s.expedition.missions['mk-moon'];assert.equal(A.unlocked(s,'wt-giant'),false);
  A.stats(s,'mk-moon').completedAt=new Date(NOW).toISOString();assert.equal(A.unlocked(s,'wt-giant'),true);assert.equal(A.unlocked(s,'wt-farm'),false);
  let total=0;const ids=new Set();
  for(const m of M.missions){
    assert.deepEqual(m.health,[10,11,12,14]);assert.equal(m.riddles.length,0);assert.deepEqual(m.stories,[m.mid,m.story]);
    assert.ok(m.mid.pages.length>=4&&m.story.pages.length>=4,m.id);assert.equal(m.mid.questions.length,2);assert.equal(m.story.questions.length,3);
    // Mid stories have at least 160 words and end stories at least 220.
    assert.ok(m.mid.words>=160,m.id+' mid '+m.mid.words);assert.ok(m.story.words>=220,m.id+' end '+m.story.words);total+=m.mid.words+m.story.words;
    for(const st of m.stories)for(const q of st.questions){ids.add(q.id);assert.equal(new Set(q.options.map(o=>o.id)).size,3);assert.ok(q.options.some(o=>o.id===q.answer));assert.ok(q.page>=1&&q.page<=st.pages.length);}
    for(const f of m.families)assert.ok(Content.creatures.some(e=>e.id===f),f);
  }
  assert.ok(total>=3500,String(total));assert.equal(ids.size,40);
});
test('Wizard’s Tower: every story word can be heard and every content word has a simple meaning',()=>{
  const fn=new Set('it was a and the by with to she you he is but at we him them an go in his they of i am too on that there from were can this are your have now be no one so her when my than for me not did all'.split(' '));
  // Same key as the reader's storyKey(): lower case, no possessive 's, letters only (can't -> cant).
  const readerKey=w=>w.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'');
  for(const m of M.missions)for(const p of m.stories.flatMap(st=>st.pages.flat()))for(const w of words(p)){const k=readerKey(w);if(fn.has(k))continue;assert.ok(D.glossary[k],m.id+': '+k);}
  for(const [w,[meaning,parts]] of Object.entries(M.glossary)){assert.ok(meaning.length>5,w);if(parts)assert.equal(parts.replace(/\|/g,'').toLowerCase(),w.replace(/'/g,''));}
});
test('Wizard’s Tower: every word is a name, a pre-taught target, a curriculum word or a listed story word',()=>{
  const curriculum=new Set(Content.words.map(i=>i.w.toLowerCase())),known=new Set([...NAMES,...EXTRA]);
  const ok=k=>forms(k).some(f=>known.has(f)||curriculum.has(f));
  for(const m of M.missions){m.targets.forEach(w=>known.add(w));for(const st of m.stories){
    for(const p of st.pages.flat())for(const w of words(p))assert.ok(ok(key(w)),m.id+' '+st.id+': '+w);
    for(const q of st.questions)for(const w of words(q.prompt+' '+q.options.map(o=>o.label).join(' ')))assert.ok(ok(key(w)),m.id+' question: '+w);
  }}
});
test('Wizard’s Tower: the whole campaign plays through fight, fight, story, fight, fight, story and survives saves',()=>{
  let s=fresh(),now=NOW;
  for(const id of M.missions.map(m=>m.id)){
    assert.equal(C.startMission(s,id,now),true);
    for(let k=0;k<2;k++)now=win(s,now);
    assert.equal(A.story(s).which,0);readAll(s,now);assert.equal(answerAll(s,now).storyDone,'mid');
    for(let k=0;k<2;k++)now=win(s,now);
    assert.equal(A.story(s).which,1);readAll(s,now);assert.equal(answerAll(s,now).storyDone,'end');
    s=C.migrate(JSON.parse(JSON.stringify(s)));
  }
  assert.equal(A.campaignComplete(s,'wizard-tower'),true);
});
test('Wizard’s Tower: every story page, quest card and the cover has its picture',()=>{
  const fs=require('node:fs'),path=require('node:path'),file=p=>path.join(__dirname,'..',p.split('?')[0]);
  assert.ok(fs.existsSync(file(M.campaign.scene)),M.campaign.scene);
  for(const m of M.missions){assert.equal(m.mid.art.length,m.mid.pages.length);assert.equal(m.story.art.length,m.story.pages.length);
    for(const a of [...m.mid.art,...m.story.art])assert.ok(fs.existsSync(file(a)),a);}
});
test('Wizard’s Tower: a parked growth hold still stops new tower quests at 44,000 XP',()=>{
  const s=fresh();for(const id of D.campaigns.find(c=>c.id===A.GROWTH.campaign).missions)delete s.expedition.missions[id];
  assert.ok(Number.isFinite(A.GROWTH.holdXP));s.dragon.stage=0;
  s.dragon.xp=A.GROWTH.holdXP;assert.equal(A.unlocked(s,'wt-giant'),false);
  s.dragon.xp=A.GROWTH.holdXP-1;assert.equal(A.unlocked(s,'wt-giant'),true);
});
