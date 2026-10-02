const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');require('../assets/battle-motion/manifest.js');const M=require('../assets/battle-motion/runtime'),C=require('../content');
// 2 October 2026: 19 champion forms extend the approved 60 variants to 79 (same 20 motion sets).
test('all 79 approved enemy variants and groups have four complete motions',()=>{
  assert.equal(C.enemyVariants.length,79);
  for(const enemy of C.enemyVariants){const key=M.enemyKey(enemy);assert.ok(key,enemy.id);assert.ok(M.render(key,{stage:enemy.stage}).includes('motionStill'));assert.deepEqual(Object.keys(M.asset(key).clips).sort(),['attack','defeat','hit','victory']);}
  assert.equal(new Set(C.enemyVariants.map(M.enemyKey)).size,20);
});
test('juvenile sizes preserve proportions and foot placement',()=>{
  const r={x:20,y:30,w:200,h:300};
  for(const stage of ['baby','young','adult']){const q=M.stageRect(r,stage);assert.equal(q.y+q.h,r.y+r.h);assert.equal(q.w/q.h,r.w/r.h);assert.equal(q.w/r.w,M.stageScale(stage));}
});
test('ranged enemies send their effect before contact without a melee lunge',()=>{
  for(const key of ['moon-moth','hollow-owl','briar-bat','storm-griffin','lantern-wisp']){
    const s=M.timeline(550,{correct:false,enemy:key,travel:300});assert.equal(s.enemy.x,0);assert.ok(s.enemyShot>0);assert.equal(s.hero.p,0);assert.equal(M.timeline(660,{correct:false,enemy:key}).enemyShot,1);
  }
  assert.ok(M.timeline(550,{correct:false,enemy:'cave-troll'}).shock>0);
});
test('an enemy cannot recoil before the spell arrives at the existing 660 ms impact',()=>{
  const before=M.timeline(659),contact=M.timeline(660),after=M.timeline(780);
  assert.equal(M.timeline(380).spell,0,'spell waits for the aimed staff');
  assert.equal(before.enemy.p,0);assert.ok(before.spell>.99);assert.equal(contact.impact,1);assert.ok(after.enemy.p>0);assert.equal(after.spell,0);
  assert.equal(M.DURATION,1200);assert.equal(M.IMPACT,660);
});
test('melee motion reaches the mage at impact and returns without moving other group members',()=>{
  for(const enemy of ['beetle','thornling']){
    assert.ok(Math.abs(M.timeline(0,{correct:false,enemy,travel:300}).enemy.x)<.001);
    assert.equal(M.timeline(660,{correct:false,enemy,travel:300}).enemy.x,-300);
    assert.ok(Math.abs(M.timeline(1200,{correct:false,enemy,travel:300}).enemy.x)<.001);
  }
  assert.equal(M.timeline(660,{correct:false,enemy:'golem',travel:300}).enemy.x,0);
});
test('last health, ordinary hits, shields and Pip assists select distinct motions',()=>{
  assert.equal(M.timeline(800,{defeated:true}).enemy.clip,'defeat');
  assert.equal(M.timeline(800,{correct:false,heroDefeated:true}).hero.clip,'defeat');
  assert.equal(M.timeline(800,{correct:false,shield:true}).hero.p,0);
  assert.equal(M.timeline(550).flame,0);assert.ok(M.timeline(550,{assist:true}).flame>0);
});
test('every shipped clip has complete, bounded atlas coordinates and local media',()=>{
  for(const [key,a]of Object.entries(global.BlitzMotionAssets)){
    assert.ok(fs.existsSync(path.join(root,a.still)),key);assert.equal(a.view.length,4);
    for(const [action,c]of Object.entries(a.clips)){
      assert.ok(c.frames>=24,key+' '+action);if(c.sequence){assert.equal(c.sequence.length,c.frames);for(const i of c.sequence)assert.ok(Number.isInteger(i)&&i>=0&&i<c.perSheet);}assert.ok(c.crop[2]>0&&c.crop[3]>0);
      assert.equal(M.frameIndex(c,2),c.frames-1);assert.equal(M.frameIndex(c,-1),0);
      for(const url of c.sheets)assert.ok(fs.existsSync(path.join(root,url)),url);
    }
    const expected=key==='mage'?['cast','assistCast','hit','defeat','victory']:key==='pip'?['fire']:['attack','hit','defeat','victory'];
    assert.deepEqual(Object.keys(a.clips).sort(),expected.sort());
  }
});
test('the viewport fit preserves aspect ratio and foot placement at tablet and phone sizes',()=>{
  for(const rect of [{x:30,y:100,w:280,h:420},{x:4,y:280,w:160,h:260}]){
    const a=M.asset('mage'),f=M.fit(a.view,rect);
    assert.equal(Math.round(f.y+(a.view[1]+a.view[3])*f.scale),rect.y+rect.h);
    assert.ok(f.scale>0);assert.ok(a.view[2]*f.scale<=rect.w+.01);
  }
});

test('solo and Pip-assisted spells leave their own held staff crystals',()=>{
  const rect={x:100,y:200,w:280,h:410},mage=M.asset('mage');
  for(const assist of [false,true]){
    const clip=assist?'assistCast':'cast';
    assert.equal(M.timeline(550,{assist}).hero.clip,clip);
    const origin=M.spellPoint(rect,assist);
    assert.deepEqual(origin,M.point('mage',rect,mage.clips[clip].spell));
    assert.ok(origin.x>rect.x+rect.w,'staff reaches beyond his torso toward the enemy');
    assert.equal(M.timeline(380,{assist}).spell,0);
    assert.equal(M.timeline(660,{assist}).spell,1);
  }
  assert.notDeepEqual(M.spellPoint(rect,false),M.spellPoint(rect,true));
  assert.notDeepEqual(mage.clips.cast.sheets,mage.clips.assistCast.sheets);
});
