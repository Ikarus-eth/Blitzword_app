const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../game-core'),A=C.Adventure,D=A.Data,Content=require('../content'),M=require('../assets/adventures/dark-wizard/campaign');
const R=require('../assets/enemies/approved-20261121/roster'),Art=require('../enemy-art'),S=require('../docs/adventures/dark-wizard/story-source');
const NOW=Date.UTC(2026,10,21,9);
const NAMES=new Set(S.names),EXTRA=new Set(S.storyWords);
const words=t=>(t.match(/[A-Za-z]+(?:[’'][a-z]+)?/g)||[]);
const key=w=>w.toLowerCase().replace(/’/g,"'").replace(/'s$/,'');
const forms=k=>[k,k.replace(/s$/,''),k.replace(/es$/,''),k.replace(/ies$/,'y')];
const ids=new Set(M.missions.map(m=>m.id));
function fresh(){const s=C.migrate(C.fresh());s.assessment.done=true;s.dragon.xp=46000;s.dragon.stage=2;for(const m of D.missions.filter(m=>!ids.has(m.id)))A.stats(s,m.id).completedAt=new Date(NOW).toISOString();return s;}
function win(s,now=NOW){
  assert.equal(C.startMissionBattle(s,now),true);s.battle.introPending=false;
  while(s.battle.enemyHealth>0){const q=C.prepareBattle(s,now);q.phase='choices';assert.equal(C.answerBattle(s,q.target,now+=8000).correct,true);}
  C.prepareBattle(s,now);assert.equal(s.result.victory,true);return now;
}
function readAll(s,now=NOW){const st=A.currentStory(s);for(let p=0;p<st.pages.length;p++)assert.equal(A.turnStoryPage(s,p),true);return C.finishStoryReading(s,now,()=>0.3);}
function answerAll(s,now=NOW){let r;for(const q of A.currentStory(s).questions){A.chooseStory(s,'0',q.id);r=C.checkStory(s,now,q.id);assert.equal(r.correct,true);}return r;}

test('Dark Wizard: two chapters after the Wizard’s Tower, eleven quests, new curriculum targets, longer stories',()=>{
  const i=D.campaigns.findIndex(c=>c.id==='dark-wizard');assert.equal(D.campaigns[i-1].id,'wizard-tower');assert.equal(D.campaigns[i+1].id,'wizard-fall');
  assert.deepEqual(M.campaigns.map(c=>c.missions.length),[6,5]);
  const targets=M.missions.flatMap(m=>m.story.targets);assert.equal(new Set(targets).size,targets.length);assert.ok(targets.length>=80);
  for(const w of targets)assert.ok(Content.words.some(i=>i.w===w),w);
  const earlier=D.missions.filter(m=>!ids.has(m.id)).flatMap(m=>m.targets||m.story?.targets||[]);
  for(const w of targets)assert.ok(!earlier.includes(w),'already taught: '+w);
  const s=fresh();delete s.expedition.missions['wt-light'];assert.equal(A.unlocked(s,'dw-storm'),false);
  A.stats(s,'wt-light').completedAt=new Date(NOW).toISOString();assert.equal(A.unlocked(s,'dw-storm'),true);assert.equal(A.unlocked(s,'dw-trail'),false);assert.equal(A.unlocked(s,'wf-room'),false);
  let total=0;const qids=new Set();
  for(const m of M.missions){
    assert.equal(m.riddles.length,0);assert.deepEqual(m.stories,[m.mid,m.story]);assert.equal(m.voiceSet,'dark-wizard');
    assert.ok(m.mid.pages.length>=4&&m.story.pages.length>=6,m.id);assert.equal(m.mid.questions.length,2);assert.equal(m.story.questions.length,3);
    // Longer than the Wizard’s Tower (parent, 21 November 2026): mid stories at least 190 words, end stories at least 290.
    assert.ok(m.mid.words>=190,m.id+' mid '+m.mid.words);assert.ok(m.story.words>=290,m.id+' end '+m.story.words);total+=m.mid.words+m.story.words;
    for(const st of m.stories)for(const q of st.questions){qids.add(q.id);assert.equal(new Set(q.options.map(o=>o.id)).size,3);assert.ok(q.options.some(o=>o.id===q.answer));assert.ok(q.page>=1&&q.page<=st.pages.length);}
    for(const f of m.families)assert.ok(Content.creatures.some(e=>e.id===f),f);
  }
  assert.ok(total>=6500,String(total));assert.equal(qids.size,55);
});
test('Dark Wizard: every word is a name, a pre-taught target, a curriculum word or a listed story word',()=>{
  const curriculum=new Set(Content.words.map(i=>i.w.toLowerCase())),known=new Set([...NAMES,...EXTRA]);
  const ok=k=>forms(k).some(f=>known.has(f)||curriculum.has(f));
  for(const m of M.missions){m.targets.forEach(w=>known.add(w));for(const st of m.stories){
    for(const p of st.pages.flat())for(const w of words(p))assert.ok(ok(key(w)),m.id+' '+st.id+': '+w);
    for(const q of st.questions)for(const w of words(q.prompt+' '+q.options.map(o=>o.label).join(' ')))assert.ok(ok(key(w)),m.id+' question: '+w);
  }}
});
test('Dark Wizard: stretch words are real story words, never this quest’s targets, and story words are always marked',()=>{
  const readerKey=w=>w.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'');
  for(const m of M.missions)for(const st of m.stories){
    const inText=new Set(st.pages.flat().flatMap(words).map(readerKey));
    for(const w of st.stretch){assert.ok(inText.has(w),m.id+' '+w);assert.ok(!m.targets.map(readerKey).includes(w),m.id+' target marked: '+w);}
    for(const w of inText)if(EXTRA.has(w)||EXTRA.has(w.replace(/s$/,'')))assert.ok(st.stretch.includes(w),m.id+' story word not marked: '+w);
    // Few enough to stay calm on the page: at most 7 marked word types per 100 words.
    assert.ok(st.stretch.length/st.words<=0.07,m.id+' '+st.id+' '+st.stretch.length+'/'+st.words);
  }
});
test('Dark Wizard: every story word can be heard and every content word has a simple meaning',()=>{
  const fn=new Set('it was a and the by with to she you he is but at we him them an go in his they of i am too on that there from were can this are your have now be no one so her when my than for me not did all'.split(' '));
  const readerKey=w=>w.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'');
  for(const m of M.missions)for(const p of m.stories.flatMap(st=>st.pages.flat()))for(const w of words(p)){const k=readerKey(w);if(fn.has(k))continue;assert.ok(D.glossary[k],m.id+': '+k);}
  for(const [w,[meaning,parts]] of Object.entries(M.glossary)){assert.ok(meaning.length>5,w);if(parts)assert.equal(parts.replace(/\|/g,'').toLowerCase(),w.replace(/'/g,''));}
});
test('Dark Wizard: both chapters play through fight, fight, story, fight, fight, story and survive saves',()=>{
  let s=fresh(),now=NOW;
  for(const id of M.missions.map(m=>m.id)){
    assert.equal(C.startMission(s,id,now),true,id);
    for(let k=0;k<2;k++)now=win(s,now);
    assert.equal(A.story(s).which,0);readAll(s,now);assert.equal(answerAll(s,now).storyDone,'mid');
    for(let k=0;k<2;k++)now=win(s,now);
    assert.equal(A.story(s).which,1);readAll(s,now);assert.equal(answerAll(s,now).storyDone,'end');
    s=C.migrate(JSON.parse(JSON.stringify(s)));
  }
  assert.equal(A.campaignComplete(s,'dark-wizard'),true);assert.equal(A.campaignComplete(s,'wizard-fall'),true);
});
test('Dark Wizard: the eleven voted creatures are cut-outs, each first met in one of these quests, and keep identity in saves',()=>{
  assert.equal(R.november.length,11);
  for(const e of R.november){
    const png=fs.readFileSync(path.join(__dirname,'..',e.art.source));assert.equal(png.readUInt32BE(16),512);assert.equal(png.readUInt32BE(20),512);assert.equal(png[25],6,'RGBA image');
    assert.ok(M.missions.some(m=>m.families.includes(e.id)),e.id);assert.match(D.lore[e.id][0],/^Find me in the story quest /);
    assert.match(Art.render(e.id,{stage:'adult'}),/<image/);
    let s=C.migrate(C.fresh());s.assessment.done=true;C.startBattle(s,0,{strength:e.minHealth,enemyId:e.id});s=C.migrate(JSON.parse(JSON.stringify(s)));assert.equal(s.battle.enemyId,e.id);
  }
  assert.equal(Content.artFacing('guard-okapi'),'right');assert.equal(Content.artFacing('sun-tiger'),'left');
});
test('Dark Wizard: every picture the reader needs is there',()=>{
  const file=p=>path.join(__dirname,'..',p.split('?')[0]);
  for(const c of M.campaigns)assert.ok(fs.existsSync(file(c.scene)),c.scene);
  for(const m of M.missions){assert.equal(m.mid.art.length,m.mid.pages.length);assert.equal(m.story.art.length,m.story.pages.length);
    for(const a of new Set([...m.mid.art,...m.story.art]))assert.ok(fs.existsSync(file(a)),a);}
});
