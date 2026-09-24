const test=require('node:test'),assert=require('node:assert/strict'),C=require('../game-core'),Content=require('../content');
test('evolution keeps the XP thresholds, queues each earned stage and changes no learning evidence',()=>{
 const s=C.migrate(C.fresh());s.dragon.xp=70000;const grown=C.migrate(s);
 assert.deepEqual(Content.dragonStages.map(x=>x.xp),[0,15000,45000,70000]);
 const learning=JSON.stringify(grown.learning),timing=JSON.stringify(grown.timing);
 for(let stage=1;stage<=3;stage++){
  assert.equal(C.beginEvolution(grown).stage,stage);assert.equal(C.finishEvolution(grown),null);
  for(let i=0;i<3;i++)assert.equal(C.advanceEvolution(grown),true);
  assert.equal(C.advanceEvolution(grown),false);assert.equal(C.finishEvolution(grown).stage,stage);
 }
 assert.equal(C.beginEvolution(grown),null);assert.equal(grown.dragon.xp,70000);assert.equal(grown.dragon.stage,3);
 assert.equal(JSON.stringify(grown.learning),learning);assert.equal(JSON.stringify(grown.timing),timing);
 assert.equal(C.beginEvolution(grown,{replay:true}).stage,3);
 for(let i=0;i<3;i++)C.advanceEvolution(grown);C.finishEvolution(grown);
 assert.equal(grown.dragon.evolutionSeen,3);assert.equal(grown.dragon.xp,70000);
});
test('old earned forms are preserved; pending evolution and its reading phase survive migration',()=>{
 const old=C.migrate(C.fresh());old.dragon.stage=2;old.dragon.xp=9000;delete old.dragon.evolutionSeen;delete old.dragon.evolution;
 const s=C.migrate(old);assert.equal(s.dragon.evolutionSeen,2);assert.equal(C.beginEvolution(s),null);
 C.beginEvolution(s,{replay:true});for(let i=0;i<3;i++)C.advanceEvolution(s);
 const resumed=C.migrate(s);assert.deepEqual(resumed.dragon.evolution,s.dragon.evolution);
 assert.equal(resumed.dragon.stage,2);assert.equal(resumed.dragon.xp,9000);
});
test('evolution waits for a battle and a pending number duel to finish',()=>{
 const s=C.migrate(C.fresh());s.dragon.stage=1;s.dragon.xp=3000;s.battle={resolved:false};
 assert.equal(C.beginEvolution(s),null);s.battle.resolved=true;s.math.round={status:'playing'};
 assert.equal(C.beginEvolution(s),null);s.math.round.status='result';assert.equal(C.beginEvolution(s).stage,1);
});
test('all evolution frames are nonempty WebP assets and every line has a matching recording',()=>{
 const fs=require('node:fs'),path=require('node:path'),N=require('../narration');
 for(const src of Content.evolution.frames){const b=fs.readFileSync(path.join(__dirname,'..',src));assert.ok(b.length>10000,src);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');}
 for(const line of [Content.evolution.intro,...Content.evolution.lines.slice(1).map(lines=>lines.join(' '))])assert.ok(N.clips[line],line);
});
