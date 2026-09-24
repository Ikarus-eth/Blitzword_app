const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Art=require('../enemy-art'),Content=require('../content');
test('every selectable enemy and legacy tier resolves to existing alpha artwork',()=>{
 assert.equal(Content.enemies.length,20);assert.equal(Art.ids.length,20);
 for(const enemy of Content.enemies){
  const art=Art.data[enemy.id];assert.ok(art,enemy.id);assert.equal(art.cells.length,16);
  const png=fs.readFileSync(path.join(__dirname,'..',art.source));assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),art.width);assert.equal(png.readUInt32BE(20),art.height);assert.equal(png[25],6,'RGBA PNG');
  for(const [x,y,w,h] of art.cells){assert.ok(w>0&&h>0&&x>=0&&y>=0&&x+w<=art.width&&y+h<=art.height,enemy.id);}
  assert.ok(Art.render(enemy.id).includes('faceHit'));assert.ok(Art.render(enemy.id+'-tier-5').includes('data-family="'+enemy.id+'"'));
 }
});
test('unknown art can fall back without breaking existing saves',()=>{assert.equal(Art.render('not-an-enemy'),null);});
