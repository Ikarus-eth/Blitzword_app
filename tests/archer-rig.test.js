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
      [p.shoulderBow,p.elbowBow,rig.BOW_UPPER], [p.elbowBow,p.wristBow,rig.ARM_LOWER],
      [p.hipFar,p.kneeFar,59], [p.kneeFar,p.ankleFar,56],
      [p.hipNear,p.kneeNear,59], [p.kneeNear,p.ankleNear,56]
    ]) close(distance(a,b), length);
    close(Math.hypot(distance(p.shoulderDraw,p.elbowDraw),p.elbowDepth),rig.DRAW_UPPER);
    close(Math.hypot(distance(p.elbowDraw,p.wristDraw),p.wristDepth-p.elbowDepth),rig.ARM_LOWER);
    assert.deepEqual(p.ankleFar, rest.ankleFar);
    assert.deepEqual(p.ankleNear, rest.ankleNear);
  }
});

test('the bow rises before the draw, with a stable shooting line and a nearly straight bow arm at aim', () => {
  const rest=rig.sample(0),raised=rig.sample(180),aim=rig.sample(470);
  assert.ok(raised.grip[1]<rest.grip[1]-45);
  close(distance(raised.grip,raised.nock),distance(rest.grip,rest.nock));
  close(rest.aim,aim.aim);
  assert.ok(distance(aim.shoulderBow,aim.wristBow)> .98*(rig.BOW_UPPER+rig.ARM_LOWER));
  assert.ok(aim.elbowDraw[0]<aim.shoulderDraw[0]-35);
  assert.ok(aim.wristDraw[0]>aim.elbowDraw[0]+55);
  const forearmAngle=Math.atan2(aim.wristDraw[1]-aim.elbowDraw[1],aim.wristDraw[0]-aim.elbowDraw[0]);
  assert.ok(Math.abs(forearmAngle-aim.aim)<.12,'draw forearm follows the shooting line');
  for(let ms=180;ms<=300;ms++){
    const p=rig.sample(ms);
    assert.ok(p.elbowDraw[1]>205,'elbow stays below the jaw during early draw');
  }
});

test('release moves the hand backward, holds the bow through impact and lowers the elbow under the shoulder', () => {
  const release=rig.sample(rig.RELEASE),follow=rig.sample(660);
  const axis=[Math.cos(release.aim),Math.sin(release.aim)];
  const moved=[follow.wristDraw[0]-release.wristDraw[0],follow.wristDraw[1]-release.wristDraw[1]];
  close(moved[0]*axis[0]+moved[1]*axis[1],-12);
  close(moved[0]*axis[1]-moved[1]*axis[0],0);
  for(let ms=rig.RELEASE;ms<=820;ms++) assert.deepEqual(rig.sample(ms).grip,release.grip);
  assert.ok(distance(follow.wristDraw,follow.nock)>100,'release hand must not chase the returning string');
  const lower=rig.sample(1050);
  assert.ok(lower.elbowDraw[1]>lower.shoulderDraw[1]+15,'recovery goes down, not over the head');
  let previous=rig.sample(0);
  for(let ms=1;ms<=rig.DURATION;ms++){
    const current=rig.sample(ms);
    assert.ok(distance(current.elbowDraw,previous.elbowDraw)<2,'elbow path must remain continuous');
    assert.ok(distance(current.wristDraw,previous.wristDraw)<2,'hand path must remain continuous');
    previous=current;
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
  assert.ok(aim.grip[1]<ready.grip[1]-55,'bow rises while keeping the cheek-to-target shooting line');
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
