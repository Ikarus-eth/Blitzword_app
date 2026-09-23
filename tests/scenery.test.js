const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const Content=require('../content'),Core=require('../game-core');
test('every saved chapter ID has distinct existing WebP scenery with bounded delivery size',()=>{
 assert.equal(Content.areas.length,35);
 assert.deepEqual(Object.keys(Content.chapterBackgrounds).sort(),Content.areas.map(a=>a.id).sort());
 const hashes=new Set(),paths=new Set();let total=0;
 for(const a of Content.areas){const bg=Content.chapterBackgrounds[a.id],bytes=fs.readFileSync(path.join(__dirname,'..',bg.src));
  assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length<950000,a.name+' image budget');
  hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));paths.add(bg.src);total+=bytes.length;
 }
 assert.equal(hashes.size,35);assert.equal(paths.size,35);assert.ok(total<16000000,'scenery total under 16MB');
});
test('scenery adds no migration or learner-state fields',()=>{
 const s=Core.migrate(Core.fresh());s.profile.name='Reader';s.assessment.done=true;
 s.story.clearedAreas=Content.areas.slice(0,6).map(a=>a.id);s.story.completedChapters=['chapter-1'];s.dragon.xp=3456;
 Core.startBattle(s,Date.now());const before=JSON.stringify(s);Core.migrate(s);assert.equal(JSON.stringify(s),before);
 assert.ok(!before.includes('assets/scenery'));assert.equal(s.battle.areaId,'chapter-2-place-2');
});
