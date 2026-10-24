const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const Core=require('../assets/turtle-race/race-core.js');
const Data=require('../assets/turtle-race/items.js');
const root=path.resolve(__dirname,'..');
const seq=values=>{let i=0;return()=>values[i++%values.length];};

test('every item is valid, uses recorded sentence audio and never shows artwork in choices',()=>{
  assert.ok(Data.items.length>=40);
  for(const item of Data.items){
    assert.ok(Core.validateItem(item),item.s);
    assert.ok(fs.existsSync(path.join(root,item.audio.file)),item.audio.file);
    for(const mode of Core.MODES){
      const q=Core.buildQuestion(mode,item,Math.random,[]);
      assert.ok(q.answer>=0&&q.answer<q.options.length);
      for(const o of q.options)assert.equal(typeof o,'string');
      assert.equal(new Set(q.options).size,q.options.length);
    }
  }
});

test('flash choices change exactly one word of the sentence',()=>{
  const item=Data.items.find(i=>i.s==='Pip is on the rock.');
  const q=Core.buildQuestion('flash',item,seq([.1,.7,.3]),[]);
  assert.equal(q.options[q.answer],'Pip is on the rock.');
  assert.deepEqual(q.options.slice().sort(),['Pip is on the cave.','Pip is on the rock.','Pip is on the tree.']);
  assert.equal(Core.wordSwap('Ducks swim.','ducks','cats'),'Cats swim.');
});

test('yes/no answers never repeat three times in a row',()=>{
  const item=Data.items[0];
  const q=Core.buildQuestion('duel',item,()=>.1,[true,true]);
  assert.equal(q.yes,false);assert.equal(q.options[q.answer],'No');
});

test('turtle dash: right moves forward, wrong moves back but not below the start, finishing first wins',()=>{
  const p=Core.defaultProfile();p.levels.dash.goal=5;
  const run=Core.newRun('dash',p);
  assert.equal(Core.answer(run,false,900).delta,0);
  Core.answer(run,true,900);Core.answer(run,false,900);assert.equal(run.steps,0);
  Core.tick(run,20000);for(let i=0;i<5;i++)Core.answer(run,true,800);
  assert.equal(run.over,true);assert.equal(run.won,true);assert.equal(run.reason,'line');
  const next=Core.adaptLevels(p.levels,run);assert.equal(next.dash.goal,6);
});

test('the turtle reaches the line at sixty seconds and wins when Pip is short',()=>{
  const p=Core.defaultProfile(),run=Core.newRun('dash',p);
  Core.answer(run,true,1000);Core.tick(run,59999);assert.equal(run.over,false);
  assert.ok(Core.turtleProgress(run)<1);
  Core.tick(run,60000);assert.equal(run.over,true);assert.equal(run.won,false);assert.equal(run.reason,'time');
  const next=Core.adaptLevels(p.levels,run);assert.equal(next.dash.goal,p.levels.dash.goal-2);
});

test('flash dash: fast right answers boost two steps, slow ones one; flash time adapts',()=>{
  const p=Core.defaultProfile(),run=Core.newRun('flash',p);
  const start=run.flashMs;
  assert.deepEqual(Core.answer(run,true,Core.BOOST_MS),{correct:true,timedOut:false,delta:2,boost:true});
  assert.equal(Core.answer(run,true,Core.BOOST_MS+1).delta,1);
  assert.equal(run.steps,3);assert.equal(run.flashMs,start-300);
  assert.equal(Core.answer(run,false,500).delta,-1);assert.equal(run.flashMs,start+100);
});

test('shell duel: fast right answers cost the turtle a shell, wrong or slow answers cost a heart',()=>{
  const p=Core.defaultProfile();p.levels.duel.shell=2;
  const run=Core.newRun('duel',p),timer=run.timerMs;
  Core.answer(run,true,1000);assert.equal(run.shell,1);assert.equal(run.timerMs,timer-300);
  const out=Core.answer(run,null,run.timerMs);assert.equal(out.timedOut,true);assert.equal(run.hearts,2);
  Core.answer(run,false,800);assert.equal(run.hearts,1);
  Core.answer(run,true,700);assert.equal(run.over,true);assert.equal(run.won,true);
  const lose=Core.newRun('duel',p);for(let i=0;i<3;i++)Core.answer(lose,false,500);
  assert.equal(lose.won,false);assert.equal(lose.reason,'hearts');
  assert.equal(Core.adaptLevels(p.levels,lose).duel.shell,Core.LIMITS.duelShell.min);
  p.levels.duel.shell=6;const lose2=Core.newRun('duel',p);for(let i=0;i<3;i++)Core.answer(lose2,false,500);
  assert.equal(Core.adaptLevels(p.levels,lose2).duel.shell,5);
});

test('difficulty stays inside its limits',()=>{
  const p=Core.defaultProfile();p.levels.dash.goal=Core.LIMITS.dashGoal.max;
  const run=Core.newRun('dash',p);run.steps=run.goal;run.won=true;run.over=true;
  assert.equal(Core.adaptLevels(p.levels,run).dash.goal,Core.LIMITS.dashGoal.max);
  const q=Core.normalizeProfile({levels:{flash:{flashMs:1},duel:{timerMs:99999,shell:'x'}}});
  assert.equal(q.levels.flash.flashMs,Core.LIMITS.flashMs.min);
  assert.equal(q.levels.duel.timerMs,Core.LIMITS.duelMs.max);
  assert.equal(q.levels.duel.shell,Core.LIMITS.duelShell.start);
});

test('stats record starts, finishes, quits and accuracy under their own storage key',()=>{
  assert.equal(Core.STORAGE_KEY,'blitzword_turtle_race_v1');
  assert.ok(!Core.STORAGE_KEY.startsWith('blitzword_state_v1'));
  let p=Core.defaultProfile();
  p=Core.recordStart(p,'flash','2026-10-24T08:00:00Z');p=Core.recordStart(p,'flash','2026-10-24T08:02:00Z');
  const run=Core.newRun('flash',p);Core.answer(run,true,1000);Core.answer(run,false,2000);Core.tick(run,60000);
  p=Core.recordFinish(p,run,'2026-10-24T08:03:00Z');
  const row=Core.summary(p).find(r=>r.mode==='flash');
  assert.deepEqual({started:row.started,finished:row.finished,quit:row.quit,wins:row.wins,accuracy:row.accuracy,avgSeconds:row.avgSeconds},{started:2,finished:1,quit:1,wins:0,accuracy:50,avgSeconds:1.5});
  assert.equal(p.history.length,1);
  assert.deepEqual(Core.normalizeProfile(JSON.parse(JSON.stringify(p))),p);
  assert.deepEqual(Core.normalizeProfile('broken'),Core.defaultProfile());
});

test('the deck repeats no sentence until every sentence has appeared',()=>{
  const deck=Core.createDeck(Data.items,Math.random),seen=new Set();
  for(let i=0;i<Data.items.length;i++)seen.add(deck.next().s);
  assert.equal(seen.size,Data.items.length);
});

test('recorded voice-over is installed with matching receipts and the page does not touch the main save',()=>{
  const plan=require('../docs/turtle-race/NARRATION_REQUEST.json');
  assert.equal(Object.keys(Data.voice).length,plan.segmentCount);
  for(const batch of plan.batches){
    const bytes=fs.readFileSync(path.join(root,'assets/narration',batch.id+'.mp3'));
    const receipt=JSON.parse(fs.readFileSync(path.join(root,'docs/narration-turtle-race/receipts',batch.id+'.json'),'utf8'));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),receipt.sha256);
    assert.equal(receipt.text,batch.text);
  }
  for(const clip of Object.values(Data.voice))assert.ok(clip.duration>.15&&clip.file.startsWith('assets/narration/turtle-race-'));
  const app=fs.readFileSync(path.join(root,'assets/turtle-race/app.js'),'utf8');
  assert.ok(!app.includes('blitzword_state_v1'));
  const html=fs.readFileSync(path.join(root,'assets/turtle-race/index.html'),'utf8');
  for(const f of ['race-core.js','items.js','app.js','style.css','pip.webp','turtle.webp'])assert.ok(html.includes(f)||app.includes(f),f);
});
