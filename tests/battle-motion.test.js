const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');require('../assets/battle-motion/manifest.js');const M=require('../battle-motion'),C=require('../content');
test('only the three approved adult enemy designs receive the new frame artwork',()=>{
  assert.equal(M.enemyKey(C.enemyAt('thornling--3')),'thornling');assert.equal(M.enemyKey(C.enemyAt('thornling--1')),null);
  assert.equal(M.enemyKey(C.enemyAt('moss-golem--3')),'golem');assert.equal(M.enemyKey(C.enemyAt('moss-golem--2')),null);
  assert.equal(M.enemyKey(C.enemyAt('bark-beetle--2')),'beetle');assert.equal(M.enemyKey(C.enemyAt('briar-bat')),null);
});
test('an enemy cannot recoil before the spell arrives at the existing 660 ms impact',()=>{
  const before=M.timeline(659),contact=M.timeline(660),after=M.timeline(780);
  assert.equal(M.timeline(380).spell,0,'spell waits for the extended palm');
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
      assert.ok(c.frames>=24,key+' '+action);assert.ok(c.crop[2]>0&&c.crop[3]>0);
      assert.equal(M.frameIndex(c,2),c.frames-1);assert.equal(M.frameIndex(c,-1),0);
      for(const url of c.sheets)assert.ok(fs.existsSync(path.join(root,url)),url);
    }
    const expected=key==='mage'?['cast','hit','defeat','victory']:key==='pip'?['fire']:['attack','hit','defeat','victory'];
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
