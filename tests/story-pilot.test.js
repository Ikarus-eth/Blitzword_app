'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {parseHTML}=require('linkedom');
const Core=require('../assets/story-pilot/core'),{stories}=require('../assets/story-pilot/stories');
const root=path.join(__dirname,'../assets/story-pilot');
function fill(state,correct=true){for(const q of Core.active(state).story.questions)Core.choose(state,q.id,correct?q.answer:q.choices.find(c=>c.id!==q.answer).id);}
function memory(initial=null){const values=new Map([['blitzword_v1','main learner data'],['blitzword_story_pilot_v1','old pilot results']]);if(initial!==null)values.set(Core.KEY,initial);const calls=[];let fail=false;return {values,calls,getItem(k){calls.push(['get',k]);return values.get(k)??null;},setItem(k,v){calls.push(['set',k]);if(fail)throw Error('Storage full');values.set(k,v);},fail(){fail=true;}};}
function boot(storage=memory()){
 const {window,document}=parseHTML(fs.readFileSync(path.join(root,'index.html'),'utf8'));
 window.localStorage=storage;window.innerWidth=1024;window.location={reload(){}};
 window.BlitzStoryPilotContent={stories};window.BlitzStoryPilot=Core;
 vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),{window,document});
 const get=id=>document.getElementById(id);
 const click=e=>{assert.ok(e&&!e.disabled);e.onclick();};
 const choose=(qid,id)=>click(document.querySelector(`[data-question="${qid}"][data-value="${id}"]`));
 return {window,document,get,click,choose,storage,state:()=>JSON.parse(storage.values.get(Core.KEY))};
}
test('five complete puzzles have unique choices, valid clues and local assets',()=>{
 assert.equal(stories.length,5);assert.equal(new Set(stories.map(s=>s.id)).size,5);
 for(const s of stories){
  for(const asset of [s.scene,s.guest,s.endingImage].filter(Boolean))assert.ok(fs.existsSync(path.resolve(root,asset)),asset);
  assert.equal(new Set(s.questions.map(q=>q.id)).size,s.questions.length);
  for(const q of s.questions){assert.equal(q.choices.filter(c=>c.id===q.answer).length,1);assert.equal(new Set(q.choices.map(c=>c.id)).size,q.choices.length);assert.ok(q.clues.length);q.clues.forEach(i=>assert.ok(s.paragraphs[i]));for(const c of q.choices)if(c.icon)assert.ok(fs.existsSync(path.join(root,'assets',c.icon+'.svg')),c.icon);}
 }
 assert.match(fs.readFileSync(path.join(root,'../../.github/workflows/pages.yml'),'utf8'),/cp -R assets _site\/assets/);
});
test('arithmetic answers and final logic have independently calculated unique solutions',()=>{
 const answers=[3-1,8-3+2,3*5-4,(24-6)/3];
 [stories[0].questions[1],stories[1].questions[1],stories[2].questions[1],stories[3].questions[1]].forEach((q,i)=>assert.equal(Number(q.answer),answers[i]));
 assert.deepEqual(Array.from({length:9},(_,i)=>51+i).filter(n=>n%7===0),[Number(stories[4].questions[1].answer)]);
 const safe=['sun','moon','star'].filter(door=>[door==='moon',door!=='moon',door!=='sun'].filter(Boolean).length===1);assert.deepEqual(safe,[stories[4].questions[0].answer]);
 assert.deepEqual(['sun','moon','star','leaf'].filter((name,i)=>i>0&&i<3&&name!=='star'),[stories[3].questions[0].answer]);
});
test('first attempt survives correction, reload and replay without new rewards',()=>{
 const state=Core.fresh(()=>0.5);Core.hint(state);fill(state,false);assert.equal(Core.check(state).complete,false);
 const first=structuredClone(Core.active(state).entry.first);fill(state);assert.equal(Core.check(state).complete,true);
 const restored=Core.restore(JSON.stringify(state));Core.replay(restored);fill(restored);Core.check(restored);
 assert.deepEqual(Core.active(restored).entry.first,first);assert.equal(Core.active(restored).entry.replays,1);assert.equal(Core.active(restored).entry.everComplete,true);
 assert.deepEqual(Object.keys(restored).sort(),['activeId','revision','stories','version']);
});
test('each story retains its choices and shuffled order when changing stories and reloading',()=>{
 const state=Core.fresh(()=>0.25);for(const story of stories){Core.selectStory(state,story.id);fill(state);}
 const restored=Core.restore(JSON.stringify(state),()=>0.9);assert.deepEqual(restored,state);
 for(const s of stories){Core.selectStory(restored,s.id);assert.equal(Core.check(restored).complete,true);}
});
test('tower doors keep physical order through old-save restore and replay without losing progress',()=>{
 const state=Core.fresh(()=>0);Core.selectStory(state,'last-door');fill(state);Core.check(state);
 const entry=state.stories['last-door'];entry.run.orders.door=['star','sun','moon'];
 const original=structuredClone(state),restored=Core.restore(JSON.stringify(state),()=>0);
 assert.deepEqual(restored.stories['last-door'].run.orders.door,['sun','moon','star']);
 original.stories['last-door'].run.orders.door=['sun','moon','star'];assert.deepEqual(restored,original);
 Core.replay(restored,()=>0);assert.deepEqual(restored.stories['last-door'].run.orders.door,['sun','moon','star']);
 assert.deepEqual(restored.stories['last-door'].first,entry.first);assert.equal(restored.stories['last-door'].everComplete,true);
});
test('tower signs and answer doors share left-to-right labels beside the illustration',()=>{
 const ui=boot();ui.click(ui.get('story-nav').children[4]);
 const cards=[...ui.get('story-arrangement').children];
 assert.equal(ui.get('story-arrangement').parentElement.id,'scene-clues');assert.equal(ui.get('scene-clues').hidden,false);
 assert.deepEqual(cards.map(c=>c.querySelector('strong').textContent),['Sun door','Moon door','Star door']);
 assert.deepEqual(cards.map(c=>c.querySelector('p').textContent),['“The moon door leads to the cub.”','“This door does not lead to the cub.”','“The sun door does not lead to the cub.”']);
 assert.deepEqual([...ui.document.querySelectorAll('[data-question="door"]')].map(b=>b.dataset.value),['sun','moon','star']);
 assert.match(ui.get('scene-image').getAttribute('src'),/gate-labelled/);
 ui.click(ui.get('hint'));assert.ok(ui.get('story-arrangement').classList.contains('clue'));assert.match(ui.get('feedback').textContent,/true sign need not/);
 ui.click(ui.get('story-nav').children[3]);assert.equal(ui.get('scene-clues').hidden,true);assert.equal(ui.get('scene-clues').children.length,0);assert.equal(ui.get('story-arrangement').parentElement.id,'story-text');
});
test('checks require every choice and reveal requires a first try',()=>{
 const state=Core.fresh();assert.throws(()=>Core.check(state));assert.throws(()=>Core.reveal(state));assert.throws(()=>Core.choose(state,'held','unknown'));
 fill(state,false);Core.check(state);Core.reveal(state);assert.equal(Core.active(state).entry.run.revealed,true);assert.equal(Core.active(state).entry.first.matches.held,false);assert.throws(()=>Core.choose(state,'held','torch'));
});
test('invalid orders, choices and completion are sanitized on restore',()=>{
 const state=Core.fresh();state.stories['fox-call'].run={choices:{held:'fake'},orders:{held:['torch','torch','torch']},complete:true,checks:-1,hints:['bad']};
 const run=Core.active(Core.restore(JSON.stringify(state))).entry.run;assert.equal(run.complete,false);assert.deepEqual(run.choices,{});assert.equal(new Set(run.orders.held).size,3);assert.equal(run.checks,0);assert.deepEqual(run.hints,[]);
});
test('pilot store only accesses its own key and refuses concurrent writes',()=>{
 const storage=memory(),a=Core.createStore(storage),b=Core.createStore(storage),one=a.load(),two=b.load();fill(one);a.save(one);assert.throws(()=>b.save(two),e=>e.code==='conflict');assert.equal(b.changed(),true);assert.equal(storage.values.get('blitzword_v1'),'main learner data');assert.equal(storage.values.get('blitzword_story_pilot_v1'),'old pilot results');assert.ok(storage.calls.every(([,key])=>key===Core.KEY));
});
test('unreadable or future save is preserved and failed write leaves revision unchanged',()=>{
 for(const text of ['broken','{"version":3,"stories":{}}']){const storage=memory(text),store=Core.createStore(storage);assert.throws(()=>store.load());assert.equal(storage.values.get(Core.KEY),text);}
 const storage=memory(),store=Core.createStore(storage),state=store.load();storage.fail();assert.throws(()=>store.save(state));assert.equal(state.revision,0);assert.equal(storage.values.has(Core.KEY),false);
});
test('all five UI puzzles can be completed; no speech controls or speech calls',()=>{
 const ui=boot();assert.equal(ui.get('story-nav').children.length,5);assert.ok(ui.get('submit').disabled);
 for(let i=0;i<stories.length;i++){
  const story=stories[i];assert.equal(ui.get('story-title').textContent,story.title);
  for(const q of story.questions)ui.choose(q.id,q.answer);
  ui.click(ui.get('submit'));assert.equal(ui.get('ending').hidden,false);assert.equal(ui.get('puzzle').hidden,true);assert.equal(ui.get('ending-title').textContent,story.endingTitle);
  if(i<4)ui.click(ui.get('next'));else{assert.equal(ui.get('next').hidden,true);assert.equal(ui.get('all-done').hidden,false);}
 }
 assert.equal(ui.get('progress').textContent,'5 of 5 stops');assert.ok(ui.storage.calls.every(([,key])=>key===Core.KEY));
 for(const f of ['index.html','app.js','core.js'])assert.doesNotMatch(fs.readFileSync(path.join(root,f),'utf8'),/speechSynthesis|SpeechSynthesisUtterance|<audio|\bListen\b|new Audio/i);
});
test('wrong choices show no answer ticks; help points to text and assisted ending is recorded',()=>{
 const ui=boot();ui.choose('held','shield');ui.choose('torches','3');ui.click(ui.get('submit'));
 assert.equal(ui.get('ending').hidden,true);assert.match(ui.get('feedback').textContent,/another look/);assert.equal(ui.document.querySelector('[data-value="shield"]').getAttribute('aria-pressed'),'true');
 ui.click(ui.get('hint'));assert.equal(ui.get('clue-2').classList.contains('clue'),true);
 ui.click(ui.get('show'));assert.equal(ui.document.querySelector('.answer-explanations').open,true);assert.equal(ui.state().stories['fox-call'].run.revealed,true);
 ui.click(ui.get('replay'));assert.equal(ui.state().stories['fox-call'].first.matches.held,false);assert.ok(ui.get('submit').disabled);
});
test('UI reload restores saved choice and read-only rendering does not rewrite storage',()=>{
 const storage=memory(),ui=boot(storage);ui.choose('held','torch');const text=storage.values.get(Core.KEY),again=boot(storage);
 assert.equal(again.document.querySelector('[data-value="torch"]').getAttribute('aria-pressed'),'true');assert.equal(storage.values.get(Core.KEY),text);
});
test('storage failure and another-tab change stop UI with visible recovery',()=>{
 const storage=memory('broken'),bad=boot(storage);assert.equal(bad.get('save-warning').hidden,false);assert.ok(bad.get('hint').disabled);assert.equal(storage.values.get(Core.KEY),'broken');
 const ui=boot();ui.storage.fail();ui.choose('held','torch');assert.equal(ui.get('save-warning').hidden,false);assert.ok(ui.get('hint').disabled);
 const conflict=boot();conflict.storage.values.set(Core.KEY,JSON.stringify(Core.fresh()));const event=new conflict.window.Event('storage');event.key=Core.KEY;conflict.window.dispatchEvent(event);assert.equal(conflict.get('save-warning').hidden,false);assert.match(conflict.get('save-message').textContent,/Another tab/);
});

test('revised content has one rescue goal and six integrated scenes without portrait overlays',()=>{
 assert.equal(require('../assets/story-pilot/stories').version,2);assert.equal(Core.fresh().version,2);
 assert.equal(Core.KEY,'blitzword_story_pilot_v2');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'../../docs/story-pilot/RESCUE_ARTWORK.json'),'utf8'));
 assert.equal(manifest.images.length,6);
 for(const story of stories){assert.match(story.scene,/^scenes\//);assert.equal(story.questions.length,2);assert.ok(!story.guest);}
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.doesNotMatch(html,/hero-tag|artus-portrait|class="pip"|id="guest"/);
 const ui=boot();assert.equal(ui.document.querySelectorAll('.scene img').length,1);assert.equal(ui.get('scene-image').getAttribute('src'),'scenes/fox-call.webp');
});
