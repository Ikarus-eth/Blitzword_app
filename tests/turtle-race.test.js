const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const Core=require('../assets/turtle-race/race-core.js');
const Expert=Core.edition('expert');
const Data=require('../assets/turtle-race/items.js');
const root=path.resolve(__dirname,'..');
const seq=values=>{let i=0;return()=>values[i++%values.length];};

test('every item is valid, core sentences use recorded audio, and choices are text only',()=>{
  const core=Data.items.filter(i=>i.tier==='core'),later=Data.items.filter(i=>/^core[234]$/.test(i.tier)),core2=later.filter(i=>i.tier==='core2'),expert=Data.items.filter(i=>i.tier==='expert');
  assert.equal(core.length,51);for(const t of ['core2','core3','core4'])assert.equal(later.filter(i=>i.tier===t).length,50,t);
  assert.ok(expert.length>=30);assert.equal(core.length+later.length+expert.length,Data.items.length);
  assert.equal(new Set(Data.items.map(i=>i.s)).size,Data.items.length,'no sentence is used twice');
  for(const item of core){
    assert.ok(Core.validateItem(item),item.s);assert.ok(Core.validateParaphrase(item),item.s);
    assert.ok(fs.existsSync(path.join(root,item.audio.file)),item.audio.file);
  }
  // The second word set uses different key words from the first, and every sentence is recorded.
  const firstKeys=new Set(core.map(i=>i.a));
  assert.ok(core2.filter(i=>!firstKeys.has(i.a)).length>=40,'mostly new key words');
  for(const item of later){assert.ok(Core.validateItem(item),item.s);assert.ok(fs.existsSync(path.join(root,item.audio.file)),item.audio.file);}
  for(const item of expert){assert.ok(Core.validateExpert(item),item.s);assert.equal(item.audio,null);assert.ok(item.s.split(/\s+/).length>=9,item.s);}
  for(const item of Data.items)for(const mode of Core.MODES)for(const other of item.tier==='expert'?[true]:item.tier==='core'?[false,true]:[false]){
    const q=Core.buildQuestion(mode,item,Math.random,[],other);
    assert.ok(q.answer>=0&&q.answer<q.options.length);
    for(const o of q.options)assert.equal(typeof o,'string');
    assert.equal(new Set(q.options).size,q.options.length);
  }
});

test('hard and expert answers describe the key word in other words without reusing it',()=>{
  const item=Data.items.find(i=>i.s==='Pip is on the rock.');
  const dash=Core.buildQuestion('dash',item,()=>.3,[],true);
  assert.equal(dash.options[dash.answer],'on a big stone');assert.equal(dash.meaning,'on a big stone');assert.equal(dash.key,'rock');
  const flash=Core.buildQuestion('flash',item,()=>.3,[],true);
  assert.equal(flash.prompt,'Which one means the same?');assert.equal(flash.options[flash.answer],'Pip sits on top of a big stone.');
  const duel=Core.buildQuestion('duel',item,()=>.1,[],true);assert.equal(duel.prompt,'Is Pip on top of a big stone?');assert.equal(duel.answer,0);
  const hasWord=(t,w)=>new RegExp('\\b'+w+'\\b','i').test(t);
  for(const i of Data.items.filter(i=>i.g)){for(const t of [i.g[0],i.ps,i.pt])assert.ok(!hasWord(t,i.a),i.s+' → '+t);}
  assert.equal(Core.validateParaphrase({...item,ps:'Pip sits on the rock.'}),false,'reusing the key word is rejected');
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

test('main race: twenty turtles, every word set repeats the rules of turtles 1-5',()=>{
  assert.equal(Core.EDITION.id,'main');assert.equal(Core.LEVEL_COUNT,20);
  assert.deepEqual(Core.TIERS.map(t=>[t.from,t.to,t.pool]),[[1,5,'core'],[6,10,'core2'],[11,15,'core3'],[16,20,'core4']]);
  const rules=L=>{const {pool,maxWords,...r}=L;return r;};
  for(const mode of Core.MODES){
    assert.equal(Core.LEVELS[mode].length,20);
    for(const tier of Core.TIERS)for(let k=0;k<5;k++){
      assert.deepEqual(rules(Core.LEVELS[mode][tier.from-1+k]),rules(Core.LEVELS[mode][k]),mode+tier.id+k);
      assert.equal(Core.LEVELS[mode][tier.from-1+k].pool,tier.pool);
    }
    for(let n=1;n<=20;n++){
      const L=Core.LEVELS[mode][n-1],pool=Core.itemsForLevel(Data.items,mode,n);assert.ok(pool.length>=25,mode+n);
      assert.equal(L.paraphrase,false);assert.ok(pool.every(i=>i.tier===L.pool&&i.s.split(/\s+/).length<=L.maxWords));
    }
  }
  assert.equal(Core.NAMES[5],'River Turtle');assert.equal(Core.NAMES[10],'Sand Turtle');assert.equal(Core.NAMES[19],'Ocean Turtle');
  assert.match(Core.describeLevel('dash',6),/^4 steps to the finish · new words/);assert.match(Core.describeLevel('duel',16),/super words/);
});

test('sentence milestones follow the BlitzWord dashboard: secured, kept after 7 days, kept after 30 days',()=>{
  const day=86400000,t0=Date.UTC(2026,9,1),items=Data.items,a=items.find(i=>i.tier==='core2').s;
  const p=Core.defaultProfile(),filler=(n,run,t)=>{for(let i=0;i<n;i++)Core.recordAnswer(p,'filler'+run+i,true,t,run);};
  assert.equal(Core.sentenceStatus(p,a),'new');
  Core.recordAnswer(p,a,true,t0,'r1');assert.equal(Core.sentenceStatus(p,a),'learning');
  Core.recordAnswer(p,a,true,t0+1,'r1');assert.equal(p.words[a].trail.length,1,'answers must be at least three questions apart');
  filler(3,'r1',t0);Core.recordAnswer(p,a,true,t0+2,'r1');filler(3,'r1',t0);Core.recordAnswer(p,a,true,t0+3,'r1');
  assert.equal(Core.sentenceStatus(p,a),'learning','three right answers in one race are not enough');
  filler(3,'r2',t0);Core.recordAnswer(p,a,true,t0+4,'r2');assert.equal(Core.sentenceStatus(p,a),'secured');
  assert.equal(Core.reviewDue(p,items,t0+6*day).length,0);assert.deepEqual(Core.reviewDue(p,items,t0+7*day+4).map(i=>i.s),[a]);
  Core.recordAnswer(p,a,false,t0+8*day,'r3');assert.equal(Core.sentenceStatus(p,a),'secured','a miss after a week earns nothing');
  Core.recordAnswer(p,a,true,t0+14*day,'r4');assert.equal(Core.sentenceStatus(p,a),'secured','the gap counts from the latest answer');
  Core.recordAnswer(p,a,true,t0+22*day+1,'r5');assert.equal(Core.sentenceStatus(p,a),'kept7');
  assert.equal(Core.reviewDue(p,items,t0+40*day).length,0);
  Core.recordAnswer(p,a,false,t0+53*day,'r6');Core.recordAnswer(p,a,true,t0+84*day,'r7');assert.equal(Core.sentenceStatus(p,a),'kept30');
  Core.recordAnswer(p,a,false,t0+85*day,'r8');assert.equal(Core.sentenceStatus(p,a),'kept30','a later miss never erases a milestone');
  const m=Core.masteryByTier(p,items).find(x=>x.tier==='new');
  assert.deepEqual([m.kept30,m.mastered,m.kept7plus,m.new+m.learning+m.secured+m.kept7+m.kept30],[1,1,1,50]);
  assert.deepEqual(Core.masteryByTier(p,items).map(x=>x.total),[51,50,50,50]);
  const back=Core.normalizeProfile(JSON.parse(JSON.stringify(p)));assert.deepEqual(back.words,p.words);assert.equal(back.seq,p.seq);
  const old=Core.normalizeProfile({words:{x:{right:3,wrong:'a',last:true}}}).words.x;
  assert.deepEqual(old,{right:3,wrong:0,last:true,lastAt:null,trail:[],securedAt:null,kept7At:null,kept30At:null},'yesterday’s counts stay, without inventing milestones');
});

test('expert race: ten turtles of other-words and long sentences, each tier steadily harder, own save',()=>{
  assert.equal(Expert.EDITION.id,'expert');assert.equal(Expert.LEVEL_COUNT,10);assert.equal(Expert.STORAGE_KEY,'blitzword_turtle_race_expert_v1');
  assert.notEqual(Expert.STORAGE_KEY,Core.STORAGE_KEY);assert.equal(Expert.EDITION.dashboardTime,false);assert.equal(Core.EDITION.dashboardTime,true);
  for(const tier of Expert.TIERS)for(let n=tier.from+1;n<=tier.to;n++){
    const [a,b]=[Expert.LEVELS.dash[n-2],Expert.LEVELS.dash[n-1]];assert.ok(b.goal>a.goal);
    const [f,g]=[Expert.LEVELS.flash[n-2],Expert.LEVELS.flash[n-1]];assert.ok(g.goal>f.goal&&g.flashMs<f.flashMs&&g.boostMs<=f.boostMs);
    const [d,e]=[Expert.LEVELS.duel[n-2],Expert.LEVELS.duel[n-1]];assert.ok(e.shell>d.shell&&e.timerMs<d.timerMs&&e.hearts<=d.hearts);
  }
  for(const mode of Expert.MODES)for(let n=1;n<=10;n++){
    const L=Expert.LEVELS[mode][n-1],pool=Expert.itemsForLevel(Data.items,mode,n);assert.ok(pool.length>=25,mode+n);
    assert.equal(L.paraphrase,true);assert.ok(pool.every(i=>i.tier===(n>5?'expert':'core')));
  }
  assert.deepEqual(Expert.NAMES.slice(0,2),['River Turtle','Forest Turtle']);assert.equal(Expert.NAMES[9],'Legend Turtle');
  assert.match(Expert.describeLevel('flash',7),/long sentences · answers in other words/);
  const p=Expert.defaultProfile(),run=Expert.newRun('dash',p);assert.equal(run.paraphrase,true);assert.equal(run.goal,6);
});

test('main saves from before the split keep turtles 1-5 and drop the old other-words levels',()=>{
  const old=Core.normalizeProfile({version:2,progress:{dash:{unlocked:8,selected:7,wins:[1,1,1,1,1,1,1,0],plays:[1,1,1,1,1,2,1,1]},flash:{unlocked:3,selected:2,wins:[1,1,0]}}});
  assert.deepEqual(old.progress.dash.wins.slice(0,10),[1,1,1,1,1,0,0,0,0,0]);assert.deepEqual(old.progress.dash.plays.slice(0,10),[1,1,1,1,1,0,0,0,0,0]);
  assert.equal(old.progress.dash.unlocked,6,'Champion beaten opens River Turtle with new words');assert.equal(old.progress.dash.selected,5);
  assert.equal(old.progress.flash.unlocked,3);assert.equal(old.version,3);
  const saved=Core.normalizeProfile(JSON.parse(JSON.stringify({...old,version:3,progress:{...old.progress,dash:{...old.progress.dash,unlocked:9,wins:[1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]}}})));
  assert.equal(saved.progress.dash.unlocked,9,'new-format saves keep turtles 6-10');
  const x=Expert.normalizeProfile({progress:{duel:{unlocked:7,selected:7,wins:[1,1,1,1,1,1,0]}}});assert.equal(x.progress.duel.unlocked,7,'expert saves are never truncated');
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
  assert.deepEqual(p.progress.dash.wins.slice(0,5),[2,0,0,0,0]);assert.deepEqual(p.progress.dash.plays.slice(0,5),[3,0,0,0,0]);
  assert.ok(Core.selectLevel(p,'dash',2));assert.equal(Core.newRun('dash',p).level,2);
  assert.equal(p.progress.flash.unlocked,1,'each race unlocks separately');
  p.progress.duel.unlocked=5;p.progress.duel.selected=5;const five=Core.newRun('duel',p);for(let i=0;i<9;i++)Core.answer(five,true,500);
  assert.equal(Core.recordFinish(p,five,now),6,'beating Champion opens the first new-words turtle');
  p.progress.duel.unlocked=20;p.progress.duel.selected=20;const top=Core.newRun('duel',p);for(let i=0;i<9;i++)Core.answer(top,true,500);
  assert.equal(Core.recordFinish(p,top,now),null);assert.equal(p.progress.duel.unlocked,20);
  const all=Expert.unlockAll(Expert.defaultProfile());for(const m of Expert.MODES)assert.equal(all.progress[m].unlocked,10);
});

test('stored profiles are repaired and earlier automatic difficulty is dropped',()=>{
  const old=Core.normalizeProfile({version:1,levels:{dash:{goal:14}},games:{dash:{started:3,finished:2,wins:1}}});
  assert.equal(old.levels,undefined);assert.equal(old.games.dash.started,3);
  assert.deepEqual(old.progress.dash,{unlocked:1,selected:1,wins:Array(20).fill(0),plays:Array(20).fill(0)});
  const q=Core.normalizeProfile({progress:{flash:{unlocked:1,selected:4,wins:[2,1,'x',-1,0]}}});
  assert.equal(q.progress.flash.unlocked,3,'wins prove level 3 is open');
  assert.equal(q.progress.flash.selected,2);assert.deepEqual(q.progress.flash.wins.slice(0,5),[2,1,0,0,0]);
  assert.equal(Core.normalizeProfile({version:3,progress:{duel:{unlocked:99}}}).progress.duel.unlocked,20);
  const five=Core.normalizeProfile({progress:{dash:{unlocked:5,selected:5,wins:[1,1,1,1,1],plays:[1,1,1,1,2]}}});
  assert.equal(five.progress.dash.unlocked,6,'yesterday’s Champion win opens the first new turtle');assert.equal(five.progress.dash.plays.length,20);
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

test('race time is kept per local day, capped, and backfilled from earlier race history',()=>{
  const p=Core.defaultProfile(),t=new Date(2026,9,25,13,0).getTime();
  Core.addTime(p,61234.4,t);Core.addTime(p,0,t);Core.addTime(p,-5,t);Core.addTime(p,1000,t);
  assert.deepEqual(p.time.days,{'2026-10-25':62234});assert.equal(Core.totalTime(p),62234);
  Core.addTime(p,9e7,t);assert.equal(p.time.days['2026-10-25'],86400000);
  const old=Core.normalizeProfile({games:{},history:[{mode:'dash',at:new Date(2026,9,24,18,0).toISOString(),elapsed:41000},{mode:'duel',at:new Date(2026,9,24,19,0).toISOString(),elapsed:60000},{mode:'flash',at:'bad',elapsed:5}]});
  assert.deepEqual(old.time.days,{'2026-10-24':101000});
  const kept=Core.normalizeProfile({time:{days:{'2026-10-20':5000,'x':3,'2026-10-21':-1}},history:[{mode:'dash',at:new Date(2026,9,24).toISOString(),elapsed:41000}]});
  assert.deepEqual(kept.time.days,{'2026-10-20':5000},'tracked time is not double-counted from history');
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
  // The standalone expert page reuses the same files, chooses the expert edition and has no link into BlitzWord.
  const expert=fs.readFileSync(path.join(root,'assets/turtle-race-expert/index.html'),'utf8');
  assert.match(expert,/TURTLE_RACE_EDITION='expert'/);assert.ok(!expert.includes('href="../../"'));
  for(const f of ['../turtle-race/race-core.js','../turtle-race/items.js','../turtle-race/app.js','../turtle-race/style.css','../turtle-race/pip.webp'])assert.ok(expert.includes(f),f);
  const v=html.match(/app\.js\?v=([\w-]+)/)[1];assert.ok(expert.includes('app.js?v='+v),'both pages load the same release');
});

test('race cards show five stars for the current word set and one dot per set, never all turtles at once',()=>{
  const {parseHTML}=require('linkedom');
  const html=fs.readFileSync(path.join(root,'assets/turtle-race/index.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
  const {window,document}=parseHTML(html);
  const store=new Map([[Core.STORAGE_KEY,JSON.stringify({version:3,progress:{dash:{unlocked:8,selected:7,wins:[1,1,1,1,1,1,1]},flash:{unlocked:6,wins:[1,1,1,1,1]}}})]]);
  const ctx={window,document,localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)},performance:{now:()=>0},requestAnimationFrame:()=>0,cancelAnimationFrame(){},setTimeout:()=>0,console};
  window.localStorage=ctx.localStorage;window.TurtleRaceCore=Core;window.TurtleRaceData=Data;
  require('node:vm').runInNewContext(fs.readFileSync(path.join(root,'assets/turtle-race/app.js'),'utf8'),{...ctx,...window,window,document});
  const cards=[...document.querySelectorAll('.card')];assert.equal(cards.length,3);
  const dash=cards[0];
  assert.equal(dash.querySelectorAll('.cardStars i').length,5);assert.equal(dash.querySelectorAll('.cardStars i.on').length,2,'turtles 6 and 7 of New words');
  assert.equal(dash.querySelector('.cardSet').textContent,'New words');
  assert.deepEqual([...dash.querySelectorAll('.setDots i')].map(i=>i.className),['done','part','','']);
  assert.equal(cards[1].querySelector('.cardSet').textContent,'New words','beating Champion moves the card to the next set');
  assert.equal(cards[2].querySelectorAll('.cardStars i.on').length,0);
});
