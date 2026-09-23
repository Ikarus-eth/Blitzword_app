const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sound=require('../soundscape'),manifest=require('../assets/soundscape/manifest.json');
test('every runtime music layer is present, versioned and within the measured peak budget',()=>{
 let bytes=0;
 for(const [scene,duration] of Object.entries(sound.TRACKS)){
  const track=manifest.tracks[scene];assert.equal(track.duration,duration);
  for(const layer of ['bed','accents']){
   const info=track.layers[layer];assert.equal(info.file,`${scene}-${layer}.mp3`);
   const data=fs.readFileSync(path.join(__dirname,'../assets/soundscape',info.file));
   assert.equal(crypto.createHash('sha256').update(data).digest('hex'),info.sha256);assert.equal(data.length,info.bytes);assert.ok(info.peak_dbfs<-6);bytes+=data.length;
  }
 }
 assert.ok(bytes<5_000_000,'Music delivery should remain below 5 MB');
});
