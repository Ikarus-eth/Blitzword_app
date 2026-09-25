const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../content'),Core=require('../game-core'),Art=require('../enemy-art');
const now=Date.UTC(2026,8,25);
function learner(){const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;return s;}
test('all 20 families have three approved variants, with broad overlap at ordinary HP',()=>{
  assert.equal(C.enemyVariants.length,60);
  for(const base of C.enemies)assert.equal(C.enemyVariants.filter(e=>e.family===base.id).length,3);
  for(let hp=15;hp<=25;hp++)assert.ok(new Set(C.enemiesForHealth(hp).map(e=>e.family)).size>=10);
  assert.deepEqual(C.enemyVariants.filter(e=>e.family==='bark-beetle').map(e=>[e.count,e.minHealth,e.maxHealth]),[[1,4,5],[3,12,15],[5,20,25]]);
  assert.deepEqual(C.enemyVariants.filter(e=>e.family==='moon-moth').map(e=>[e.count,e.minHealth,e.maxHealth]),[[1,5,8],[2,10,16],[3,15,24]]);
  assert.equal(C.enemyAt('fern-wolf--3').name,'2 young Fern Wolves');
});
test('group HP is conserved, assigned sequentially and derives identically after save/reload',()=>{
  for(const e of C.enemyVariants.filter(e=>e.count>1))for(let total=e.minHealth;total<=e.maxHealth;total++){
    let previous=e.count;
    for(let hp=total;hp>=0;hp--){
      const members=C.enemyMembers(e.id,total,hp);
      assert.equal(members.length,e.count);assert.equal(members.reduce((n,m)=>n+m.maxHealth,0),total);
      assert.equal(members.reduce((n,m)=>n+m.health,0),hp);
      const alive=members.filter(m=>m.health>0).length;assert.ok(previous-alive<=1);previous=alive;
      if(hp===Math.floor(total/2)){
        const s=learner();Core.startBattle(s,now,{enemyId:e.id,strength:total});s.battle.enemyHealth=hp;
        const saved=Core.migrate(JSON.parse(JSON.stringify(s)));
        assert.equal(saved.battle.enemyId,e.id);assert.deepEqual(C.enemyMembers(saved.battle.enemyId,saved.battle.maxHealth,saved.battle.enemyHealth),members);
      }
    }
  }
});
test('a five-member encounter spends one heart or one shield on a wrong answer',()=>{
  for(const shield of [false,true]){
    const s=learner();s.rewards.shield=shield;Core.startBattle(s,now,{enemyId:'bark-beetle--3',strength:25});
    const q=Core.prepareBattle(s,now);q.phase='choices';const answer=q.options.find(x=>x!==q.target);
    Core.answerBattle(s,answer,now+1000);assert.equal(s.battle.heroHealth,shield?3:2);
    assert.equal(s.battle.enemyHealth,25);assert.equal(s.rewards.shield,false);
    assert.equal(Core.answerBattle(s,answer,now+1001),null);assert.equal(s.battle.heroHealth,shield?3:2);
  }
});
test('new and legacy encounters retain identity and stage-specific anatomy',()=>{
  for(const e of C.enemyVariants){
    const html=Art.render(e.id,{stage:e.stage});assert.ok(html.includes('data-family="'+e.family+'"'));
    assert.ok(html.includes('data-stage="'+e.stage+'"'));
  }
  const baby=Art.render('stone-ram',{stage:'baby'}),adult=Art.render('stone-ram');
  assert.ok(baby.includes('scale(1.23)'));assert.ok(baby.includes('scale(0.78)'));assert.notEqual(baby,adult);
  const s=learner();Core.startBattle(s,now,{strength:44});s.battle.enemyId='moss-golem-tier-13';s.battle.enemyHealth=37;
  const saved=Core.migrate(JSON.parse(JSON.stringify(s)));assert.equal(saved.battle.maxHealth,44);assert.equal(saved.battle.enemyHealth,37);assert.equal(saved.battle.enemyId,s.battle.enemyId);
});
test('normal 20-HP rotation includes groups and different growth forms',()=>{
  const s=learner(),seen=new Set();
  for(let i=0;i<50;i++){Core.startBattle(s,now+i,{strength:20});seen.add(s.battle.enemyId);}
  assert.ok([...seen].some(id=>C.enemyAt(id).count===2));assert.ok([...seen].some(id=>C.enemyAt(id).count===3));assert.ok([...seen].some(id=>C.enemyAt(id).count===5));
  assert.ok([...seen].some(id=>C.enemyAt(id).stage==='young'));assert.ok([...seen].some(id=>C.enemyAt(id).stage==='adult'));
});
