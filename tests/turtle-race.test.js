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

const unlockAll=(p,mode,n)=>{p.progress[mode].unlocked=n;p.progress[mode].selected=n;return p;};

test('five turtles per race get steadily harder',()=>{
  assert.equal(Core.LEVEL_COUNT,5);
  for(const mode of Core.MODES)assert.equal(Core.LEVELS[mode].length,5);
  for(let i=1;i<5;i++){
    const [a,b]=[Core.LEVELS.dash[i-1],Core.LEVELS.dash[i]];assert.ok(b.goal>a.goal);
    const [f,g]=[Core.LEVELS.flash[i-1],Core.LEVELS.flash[i]];assert.ok(g.goal>f.goal&&g.flashMs<f.flashMs&&g.boostMs<=f.boostMs);
    const [d,e]=[Core.LEVELS.duel[i-1],Core.LEVELS.duel[i]];assert.ok(e.shell>d.shell&&e.timerMs<d.timerMs&&e.hearts<=d.hearts);
  }
  for(const mode of Core.MODES)for(let n=1;n<=5;n++){
    const pool=Core.itemsForLevel(Data.items,mode,n);assert.ok(pool.length>=25,mode+n);
    assert.ok(pool.every(i=>i.s.split(/\s+/).length<=Core.LEVELS[mode][n-1].maxWords));
  }
  assert.equal(Core.itemsForLevel(Data.items,'dash',5).length,Data.items.length);
});

test('turtle dash level 1 never slips back; level 3 does, but not below the start',()=>{
  const p=Core.defaultProfile(),easy=Core.newRun('dash',p);
  assert.equal(easy.goal,4);assert.equal(easy.levelName,'Sleepy Turtle');
  Core.answer(easy,true,900);assert.equal(Core.answer(easy,false,900).delta,0);assert.equal(easy.steps,1);
  unlockAll(p,'dash',3);const run=Core.newRun('dash',p);assert.equal(run.goal,8);
  assert.equal(Core.answer(run,false,900).delta,0);
  Core.answer(run,true,900);Core.answer(run,false,900);assert.equal(run.steps,0);
  Core.tick(run,20000);for(let i=0;i<8;i++)Core.answer(run,true,800);
  assert.equal(run.over,true);assert.equal(run.won,true);assert.equal(run.reason,'line');
});

test('the turtle reaches the line at sixty seconds and wins when Pip is short',()=>{
  const p=Core.defaultProfile(),run=Core.newRun('dash',p);
  Core.answer(run,true,1000);Core.tick(run,59999);assert.equal(run.over,false);
  assert.ok(Core.turtleProgress(run)<1);
  Core.tick(run,60000);assert.equal(run.over,true);assert.equal(run.won,false);assert.equal(run.reason,'time');
});

test('flash dash: right answers within the level boost window move two steps, slower ones one',()=>{
  const p=Core.defaultProfile(),easy=Core.newRun('flash',p);
  assert.equal(easy.flashMs,5000);assert.equal(easy.boostMs,5000);
  assert.equal(Core.answer(easy,true,4900).delta,2);assert.equal(Core.answer(easy,false,500).delta,0);
  unlockAll(p,'flash',5);const hard=Core.newRun('flash',p);
  assert.equal(hard.flashMs,2000);
  assert.deepEqual(Core.answer(hard,true,2500),{correct:true,timedOut:false,delta:2,boost:true});
  assert.equal(Core.answer(hard,true,2501).delta,1);assert.equal(hard.steps,3);
  assert.equal(Core.answer(hard,false,500).delta,-1);assert.equal(hard.flashMs,2000);
});

test('shell duel: fast right answers cost a shell, wrong or slow answers cost a heart; level 1 is forgiving',()=>{
  const p=Core.defaultProfile(),easy=Core.newRun('duel',p);
  assert.deepEqual([easy.shell,easy.hearts,easy.timerMs],[3,5,12000]);
  Core.answer(easy,true,1000);assert.equal(easy.shell,2);assert.equal(easy.timerMs,12000);
  assert.equal(Core.answer(easy,null,easy.timerMs).timedOut,true);assert.equal(easy.hearts,4);
  Core.answer(easy,false,800);assert.equal(easy.hearts,3);
  Core.answer(easy,true,700);Core.answer(easy,true,700);assert.equal(easy.over,true);assert.equal(easy.won,true);
  unlockAll(p,'duel',5);const lose=Core.newRun('duel',p);assert.deepEqual([lose.shell,lose.hearts,lose.timerMs],[9,3,5000]);
  for(let i=0;i<3;i++)Core.answer(lose,false,500);
  assert.equal(lose.won,false);assert.equal(lose.reason,'hearts');
});

test('winning the hardest open turtle opens the next; he chooses among open turtles only',()=>{
  const p=Core.defaultProfile(),now='2026-10-25T05:00:00Z';
  assert.throws(()=>Core.newRun('dash',p,2),/locked/);
  assert.equal(Core.selectLevel(p,'dash',2),false);
  const lose=Core.newRun('dash',p);Core.tick(lose,60000);assert.equal(Core.recordFinish(p,lose,now),null);
  assert.equal(p.progress.dash.unlocked,1);
  const win=Core.newRun('dash',p);for(let i=0;i<4;i++)Core.answer(win,true,500);
  assert.equal(Core.recordFinish(p,win,now),2);assert.equal(p.progress.dash.unlocked,2);
  assert.equal(p.progress.dash.selected,1,'the child picks the harder turtle himself');
  const again=Core.newRun('dash',p);for(let i=0;i<4;i++)Core.answer(again,true,500);
  assert.equal(Core.recordFinish(p,again,now),null,'replaying an easier turtle opens nothing new');
  assert.deepEqual(p.progress.dash.wins,[2,0,0,0,0]);assert.deepEqual(p.progress.dash.plays,[3,0,0,0,0]);
  assert.ok(Core.selectLevel(p,'dash',2));assert.equal(Core.newRun('dash',p).level,2);
  assert.equal(p.progress.flash.unlocked,1,'each race unlocks separately');
  p.progress.duel.unlocked=5;p.progress.duel.selected=5;const top=Core.newRun('duel',p);for(let i=0;i<9;i++)Core.answer(top,true,500);
  assert.equal(Core.recordFinish(p,top,now),null);assert.equal(p.progress.duel.unlocked,5);
});

test('stored profiles are repaired and earlier automatic difficulty is dropped',()=>{
  const old=Core.normalizeProfile({version:1,levels:{dash:{goal:14}},games:{dash:{started:3,finished:2,wins:1}}});
  assert.equal(old.levels,undefined);assert.equal(old.games.dash.started,3);
  assert.deepEqual(old.progress.dash,{unlocked:1,selected:1,wins:[0,0,0,0,0],plays:[0,0,0,0,0]});
  const q=Core.normalizeProfile({progress:{flash:{unlocked:1,selected:4,wins:[2,1,'x',-1,0]}}});
  assert.equal(q.progress.flash.unlocked,3,'wins prove level 3 is open');
  assert.equal(q.progress.flash.selected,2);assert.deepEqual(q.progress.flash.wins,[2,1,0,0,0]);
  assert.equal(Core.normalizeProfile({progress:{duel:{unlocked:99}}}).progress.duel.unlocked,5);
});

test('stats record starts, finishes, quits and accuracy under their own storage key',()=>{
  assert.equal(Core.STORAGE_KEY,'blitzword_turtle_race_v1');
  assert.ok(!Core.STORAGE_KEY.startsWith('blitzword_state_v1'));
  let p=Core.defaultProfile();
  p=Core.recordStart(p,'flash','2026-10-24T08:00:00Z');p=Core.recordStart(p,'flash','2026-10-24T08:02:00Z');
  const run=Core.newRun('flash',p);Core.answer(run,true,1000);Core.answer(run,false,2000);Core.tick(run,60000);
  Core.recordFinish(p,run,'2026-10-24T08:03:00Z');
  const row=Core.summary(p).find(r=>r.mode==='flash');
  assert.deepEqual({started:row.started,finished:row.finished,quit:row.quit,wins:row.wins,accuracy:row.accuracy,avgSeconds:row.avgSeconds,unlocked:row.unlocked},{started:2,finished:1,quit:1,wins:0,accuracy:50,avgSeconds:1.5,unlocked:1});
  assert.equal(p.history.length,1);assert.equal(p.history[0].level,1);
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
