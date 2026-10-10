const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const C=require('../content'),Core=require('../game-core'),A=Core.Adventure,Art=require('../enemy-art'),R=require('../assets/enemies/approved-20261010/roster'),N=require('../narration'),Audio=require('../audio');
require('../assets/battle-motion/manifest');const M=require('../assets/battle-motion/runtime');
const ratings=require('../docs/enemies/ARTUS_FINAL_RATINGS.json'),plan=require('../docs/NARRATION_APPROVED_ENEMIES_REQUEST.json');
test('only Artus winners rated at least three become the 45 future families',()=>{
 const accepted=ratings.rounds.filter(r=>Math.max(...Object.values(r.scores))>=3);assert.equal(accepted.length,45);assert.equal(R.entries.length,45);assert.equal(C.creatures.length,65);assert.equal(C.enemies.length,20);
 for(const r of accepted){const e=R.entries.find(e=>e.conceptId===Number(r.id));assert.equal(e.option,r.selected);assert.equal(e.score,Math.max(...Object.values(r.scores)));assert.equal(e.availability,'future-chapter');assert.ok(A.Data.lore[e.id]);assert.equal(A.findMission(e.id),undefined);}
 assert.ok(!R.entries.some(e=>e.name==='Ore Ant'));assert.equal(R.byId['snow-owl'].option,'d');
});
test('new encounters retain identity through saves, without entering existing random pools',()=>{
 for(let hp=3;hp<=60;hp++)assert.ok(C.enemiesForHealth(hp).every(e=>!R.byId[e.family||e.id]));
 assert.equal(C.newEnemyVariants.length,180);
 for(const e of [...R.entries,...C.newEnemyVariants]){assert.equal(C.enemyAt(e.id).id,e.id);let s=Core.migrate(Core.fresh());s.assessment.done=true;Core.startBattle(s,0,{strength:e.minHealth,enemyId:e.id});s=Core.migrate(JSON.parse(JSON.stringify(s)));assert.equal(s.battle.enemyId,e.id);assert.equal(C.enemyMembers(e.id,e.minHealth).reduce((n,m)=>n+m.maxHealth,0),e.minHealth);}
});
test('future companions remain locked, and discovered entries and chosen friends survive migration',()=>{
 for(const e of R.entries){let s=Core.migrate(Core.fresh());assert.equal(A.selectCompanion(s,e.id),false);assert.equal(A.reveal(s,e.id,0),true);assert.equal(A.selectCompanion(s,e.id),true);s=Core.migrate(JSON.parse(JSON.stringify(s)));assert.equal(A.companion(s),e.id);assert.equal(A.report(s).seen,1);}
});
test('all approved sprites clip before scaling and all four motions draw only their own atlas region',()=>{
 for(const e of R.entries){const a=M.asset(e.id),[x,y,w,h]=e.art.view;assert.ok(x>=0&&y>=0&&x+w<=1536&&y+h<=1024);assert.equal(M.enemyKey(e),e.id);assert.deepEqual(Object.keys(a.clips).sort(),['attack','defeat','hit','victory']);
  const png=fs.readFileSync(path.join(__dirname,'..',e.art.source));assert.equal(png.readUInt32BE(16),1536);assert.equal(png.readUInt32BE(20),1024);assert.equal(png[25],6,'RGBA image');
  for(const stage of ['baby','young','adult']){assert.match(Art.render(e.id,{stage}),/overflow="hidden"><image/);assert.match(M.render(e.id,{stage}),/overflow="hidden"><image/);}
  for(const action of Object.keys(a.clips)){const draws=[],ctx={save(){},restore(){},translate(){},rotate(){},drawImage(...args){draws.push(args);}};M.drawActor(ctx,{[a.still]:{}},e.id,action,.5,{x:0,y:0,w:250,h:250});assert.equal(draws.length,1);assert.deepEqual(draws[0].slice(1,5),[x,y,w,h]);}
 }
});
test('all 141 new recorded segments are bounded, verified and cover names, secrets, intros and companion help',()=>{
 assert.equal(plan.segmentCount,141);assert.ok(plan.characters<=5500);const hashes=new Map();
 for(const b of plan.batches){const r=require('../docs/narration-approved-enemies/receipts/'+b.id+'.json');assert.equal(r.text,b.text);assert.equal(r.alignment.characters.join(''),b.text);for(const s of b.segments){const c=N.clips[s.key];assert.ok(c,s.key);if(!hashes.has(c.file))hashes.set(c.file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',c.file))).digest('hex'));assert.equal(c.sha256,hashes.get(c.file));assert.ok(c.offset>=0&&c.duration>.15);}}
 for(const e of R.entries)for(const t of [e.name,...e.lore,`${/^[AEIOU]/i.test(e.name)?'An':'A'} ${e.name} is on the path. Ready to battle?`,e.name+' is ready. Let’s play.',e.name+' stopped the hit.'])assert.ok(Audio.recordedParts(t,N.clips),t);
});
