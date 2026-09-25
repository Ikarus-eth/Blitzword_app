const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const rig = require('../assets/heroes/prototype/archer-rig');
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const close = (a, b, tolerance = .001) => assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);

test('archer joints retain limb lengths and feet remain planted throughout the attack', () => {
  const rest = rig.sample(0);
  for (let ms = 0; ms <= rig.DURATION; ms++) {
    const p = rig.sample(ms);
    for (const [a, b, length] of [
      [p.shoulderBow,p.elbowBow,58], [p.elbowBow,p.wristBow,64],
      [p.shoulderDraw,p.elbowDraw,60], [p.elbowDraw,p.wristDraw,62],
      [p.hipFar,p.kneeFar,59], [p.kneeFar,p.ankleFar,56],
      [p.hipNear,p.kneeNear,59], [p.kneeNear,p.ankleNear,56]
    ]) close(distance(a,b), length);
    assert.deepEqual(p.ankleFar, rest.ankleFar);
    assert.deepEqual(p.ankleNear, rest.ankleNear);
  }
});

test('arrow stays nocked, leaves continuously, and reaches the target at the existing impact time', () => {
  const target = [793,391];
  for (let ms = 0; ms <= rig.RELEASE; ms++) {
    const p = rig.sample(ms,target);
    assert.deepEqual(p.arrow.tail,p.nock);
    assert.equal(p.arrow.flying,false);
    assert.equal(p.impact,false);
  }
  const release=rig.sample(rig.RELEASE,target),first=rig.sample(rig.RELEASE+.001,target);
  assert.ok(distance(first.arrow.tail,release.nock)<.01);
  const last=rig.sample(rig.IMPACT-.001,target);
  const tip=[last.arrow.tail[0]+last.arrowLength*Math.cos(last.arrow.angle),last.arrow.tail[1]+last.arrowLength*Math.sin(last.arrow.angle)];
  assert.ok(distance(tip,target)<.01);
  assert.equal(rig.sample(rig.IMPACT).arrow.visible,false);
  assert.equal(rig.sample(rig.IMPACT).impact,true);
  assert.equal(rig.IMPACT,Math.round(rig.DURATION*.55));
});

test('draw increases string tension and recovers to the identical ready pose', () => {
  const ready=rig.sample(0),aim=rig.sample(470),end=rig.sample(rig.DURATION);
  assert.ok(distance(aim.grip,aim.nock)>2.5*distance(ready.grip,ready.nock));
  assert.ok(aim.grip[1]<ready.grip[1]-80);
  assert.ok(aim.bend>.95);
  for(const key of ['grip','nock','top','bottom','wristBow','wristDraw','head','lean'])assert.deepEqual(end[key],ready[key]);
  const element={innerHTML:'',dataset:{}},actor=rig.create(element);
  actor.paint(0);const readyArt=element.innerHTML;actor.paint(rig.DURATION);assert.equal(element.innerHTML,readyArt);
});

test('reduced motion renders only the ready pose, including when inspecting impact', () => {
  const element={innerHTML:'',dataset:{}};
  const actor=rig.create(element);
  actor.paint(0); const ready=element.innerHTML;
  for(const ms of [180,470,525,660,1000]){
    const p=actor.paint(ms,{reducedMotion:true});
    assert.equal(p.ms,0); assert.equal(element.innerHTML,ready);
    assert.equal(p.impact,false);
  }
});

test('prototype assets exist and the entry point does not import the app or storage', () => {
  const root=path.join(__dirname,'..');
  const bytes=fs.readFileSync(path.join(root,rig.atlas));
  assert.equal(bytes.readUInt32BE(16),1254); assert.equal(bytes.readUInt32BE(20),1254);
  assert.equal(bytes[25],6,'PNG must retain RGBA transparency');
  for(const [name,[x,y,w,h]]of Object.entries(rig.cells)){
    assert.ok(x>=0&&y>=0&&x+w<=1254&&y+h<=1254, name);
  }
  const reviewDir=path.join(root,'assets/heroes/prototype');
  const html=fs.readFileSync(path.join(reviewDir,'archer-review.html'),'utf8');
  for(const match of html.matchAll(/<script src="([^"?]+)/g))assert.ok(fs.existsSync(path.resolve(reviewDir,match[1])));
  assert.doesNotMatch(html,/<script[^>]+(?:app|storage|game-core)\.js/);
  const controller=fs.readFileSync(path.join(reviewDir,'archer-review.js'),'utf8');
  assert.doesNotMatch(controller,/\b(?:localStorage|sessionStorage|indexedDB)\b/);
});
