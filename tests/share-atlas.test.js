const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');const C=require('../assets/map-quest/core');
test('all seven maps play independently without main-game state',()=>{const s=C.fresh();for(const id of Object.keys(C.Maps)){assert.ok(C.start(s,id));for(let i=0;i<C.Maps[id].questions.length;i++){assert.ok(C.choose(s,id,C.Maps[id].questions[i].answer,i));assert.equal(C.check(s,id,i).correct,true);}assert.equal(s.maps[id].index,C.Maps[id].questions.length);}assert.deepEqual(C.restore(JSON.parse(JSON.stringify(s))),s);assert.ok(C.replay(s,'crab-ferry'));assert.equal(s.maps['crab-ferry'].index,0);assert.equal(s.maps['high-nest'].index,3);});
test('wrong answers cost one life, duplicate and stale submissions cannot progress or charge again',()=>{const s=C.fresh(),id='crab-ferry';C.start(s,id);C.choose(s,id,'red',0);C.check(s,id,0);assert.equal(s.maps[id].lives,3);assert.equal(C.check(s,id,0),false);assert.equal(s.maps[id].lives,3);C.choose(s,id,'green',0);C.check(s,id,0);assert.equal(C.choose(s,id,'blue',0),false);assert.equal(C.check(s,id,0),false);assert.equal(s.maps[id].index,1);});
test('zero-life retry and reload keep solved questions and other maps',()=>{let s=C.fresh(),id='crab-ferry';C.start(s,id);C.choose(s,id,'green',0);C.check(s,id,0);for(let i=0;i<4;i++){C.choose(s,id,'red',1);C.check(s,id,1);}assert.equal(C.choose(s,id,'blue',1),false);s=C.restore(JSON.parse(JSON.stringify(s)));assert.ok(C.retry(s,id));assert.equal(s.maps[id].index,1);assert.equal(s.maps[id].lives,4);assert.equal(s.maps[id].selection,null);});
test('corrupt saves rejected, standalone entry does not load or link main game',()=>{for(const s of [null,{}, {version:1,maps:{'crab-ferry':{index:7,lives:4,selection:null,wrong:false}}}])assert.throws(()=>C.restore(s));const html=fs.readFileSync('assets/map-quest/index.html','utf8');assert.doesNotMatch(html,/game-core|storage\.js|missions\.js|href="\.\.\/\.\.\//);assert.equal(C.KEY,'blitzword.hidden-atlas.v1');});
test('new scenes preserve old progress and lives while discarding obsolete selections',()=>{for(const id of Object.keys(C.Maps).filter(id=>C.Maps[id].revision)){for(const index of [0,1,2,3]){const old={version:1,maps:{[id]:{index,lives:2,selection:'old-answer',wrong:true}}};const s=C.restore(old);assert.equal(s.maps[id].index,index);assert.equal(s.maps[id].lives,2);assert.equal(s.maps[id].selection,null);assert.equal(s.maps[id].wrong,false);assert.equal(s.maps[id].revision,C.Maps[id].revision);if(index<3)C.choose(s,id,C.Maps[id].questions[index].answer,index);assert.deepEqual(C.restore(s),s);}}});
test('every continuous-map clue, option and hint has a German translation',()=>{const de=require('../assets/map-quest/german-river');for(const map of Object.values(C.Maps).filter(m=>m.revision&&!m.expert)){assert.equal(map.width,4096);for(const q of map.questions)for(const text of [q.region,...q.text,q.prompt,q.hint,...q.options.map(o=>o.label)])assert.ok(de[text]&&de[text]!==text,text);}});

test('expert maps have six solvable riddles, preserve progress after the third, and translate completely',()=>{
 const de=require('../assets/map-quest/german-expert');
 for(const [id,map] of Object.entries(C.Maps).filter(([,m])=>m.expert)){
  assert.equal(map.questions.length,6);let s=C.fresh();C.start(s,id);
  for(let i=0;i<6;i++){
   const q=map.questions[i];assert.equal(new Set(q.options.map(o=>o.id)).size,6);
   for(const t of [q.region,...q.text,q.prompt,q.hint,...q.options.map(o=>o.label)])assert.ok(de[t],t);
   assert.ok(C.choose(s,id,q.answer,i));const result=C.check(s,id,i);assert.equal(result.complete,i===5);
   s=C.restore(JSON.parse(JSON.stringify(s)));assert.equal(s.maps[id].index,i+1);
   if(i===2)assert.equal(C.replay(s,id),false);
  }
  assert.ok(C.replay(s,id));assert.equal(s.maps[id].index,0);
 }
});
test('expert retries retain five solved riddles and reject out-of-range saves',()=>{
 const id='clockwork-harbour',s=C.fresh();C.start(s,id);
 for(let i=0;i<5;i++){C.choose(s,id,C.Maps[id].questions[i].answer,i);C.check(s,id,i);}
 const wrong=C.Maps[id].questions[5].options.find(o=>o.id!==C.Maps[id].questions[5].answer).id;
 for(let i=0;i<4;i++){C.choose(s,id,wrong,5);C.check(s,id,5);}
 assert.equal(C.check(s,id,5),false);const restored=C.restore(s);assert.ok(C.retry(restored,id));assert.equal(restored.maps[id].index,5);
 restored.maps[id].index=7;assert.throws(()=>C.restore(restored));
});

test('unknown map replay cannot create a phantom saved map',()=>{const s=C.fresh();assert.equal(C.replay(s,'unknown'),false);assert.deepEqual(s,C.fresh());});

test('expert clarity revision preserves all earned steps and clears stale answer selections',()=>{
 for(const id of ['clockwork-harbour','underground-archive'])for(const index of [0,3,5,6]){
 const old={version:1,maps:{[id]:{revision:'expert-20261014-r1',index,lives:2,selection:'option-1',wrong:true}}};
 const restored=C.restore(old);assert.equal(restored.maps[id].index,index);assert.equal(restored.maps[id].lives,2);assert.equal(restored.maps[id].selection,null);assert.equal(restored.maps[id].wrong,false);assert.equal(C.check(restored,id,index),false);
 }
});
