const test=require('node:test');
const assert=require('node:assert/strict');
const Core=require('../game-core.js');
const Content=require('../content.js');
const {AdventureStore,KEY,BACKUP_LIMIT,backupFile,readBackup,backupSummary}=require('../storage.js');
const START=Date.UTC(2026,8,24,9,12);
class MemoryStorage {
  constructor(){this.data=new Map();this.failKey=null;}
  getItem(k){return this.data.get(k)??null;}
  setItem(k,v){if(this.failKey===k)throw new Error('quota');this.data.set(k,String(v));}
  removeItem(k){this.data.delete(k);}
}
function progress(name,xp,words){
  const s=Core.migrate(Core.fresh());s.profile.name=name;s.assessment.done=true;s.dragon.xp=xp;
  for(const item of Content.words.slice(0,words))s.learning.words[item.w].introducedAt=new Date(START).toISOString();
  Core.startBattle(s,START);return s;
}
function saved(mem,s){const store=new AdventureStore(mem);store.load();store.save(s);return store;}
const refused=(text,message)=>assert.throws(()=>readBackup(text),e=>e.code==='backup'&&e.message===message+' Nothing was changed.');

test('a backup file holds the whole save with a dated, readable name',()=>{
  const s=progress('Éva Maria',1234.5,12),file=backupFile(s,{now:START,build:'backup-file-test'});
  assert.match(file.name,/^blitzword-backup-Eva-Maria-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
  const d=new Date(START),pad=n=>String(n).padStart(2,'0');
  assert.ok(file.name.includes(d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'-'+pad(d.getHours())+pad(d.getMinutes())));
  const data=JSON.parse(file.text);
  assert.equal(data.format,'blitzword-backup');assert.equal(data.version,1);assert.equal(data.exportedAt,new Date(START).toISOString());
  assert.equal(data.build,'backup-file-test');assert.equal(data.storageKey,KEY);assert.deepEqual(data.state,JSON.parse(JSON.stringify(s)));
  assert.match(backupFile(progress('',0,0),{now:START}).name,/^blitzword-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
});

test('reading a backup returns the migrated save and when it was made',()=>{
  const s=progress('Reader',400,20),file=backupFile(s,{now:START}),back=readBackup(file.text);
  assert.deepEqual(back.state,Core.migrate(JSON.parse(JSON.stringify(s))));assert.equal(back.exportedAt,new Date(START).toISOString());
  assert.deepEqual(back.state.battle,s.battle);assert.equal(back.state.dragon.xp,400);
  // A raw save copied from browser storage also restores, without an export date.
  const raw=readBackup(JSON.stringify(s));assert.deepEqual(raw.state,back.state);assert.equal(raw.exportedAt,null);
  // A v1 save keeps its profile and records.
  const legacy=Core.fresh();delete legacy.schemaVersion;legacy.profile.name='Old reader';legacy.campaign.battleRecords.push({task:'battle',target:'tree',correct:true,supported:false,at:new Date(START).toISOString()});
  const old=readBackup(JSON.stringify(legacy)).state;assert.equal(old.schemaVersion,2);assert.equal(old.profile.name,'Old reader');assert.equal(old.campaign.battleRecords.length,1);
});

test('files that are not BlitzWord saves are refused instead of becoming an empty adventure',()=>{
  const bad='This file is not a BlitzWord backup.',newer='This backup was made by a newer version of BlitzWord.';
  for(const text of ['not json','','[]','null','42','"text"','{}','{"name":"blitzword","version":"1.0.0"}','{"profile":{"name":"x"}}','{"profile":"x","learning":{}}'])refused(text,bad);
  const s=progress('Reader',10,2);
  refused(JSON.stringify({format:'blitzword-backup',version:2,state:s}),newer);
  refused(JSON.stringify({format:'blitzword-backup',version:1}),bad);
  refused(JSON.stringify({...s,schemaVersion:3}),newer);
  refused(JSON.stringify({...s,schemaVersion:'2'}),bad);
  refused(JSON.stringify({...s,campaign:{battleRecords:'broken'}}),'This backup could not be read.');
  refused('x'.repeat(BACKUP_LIMIT+1),'This file is too large to be a BlitzWord backup.');
});

test('restore keeps the current save first, then writes the backup with a newer revision',()=>{
  const mem=new MemoryStorage(),device=progress('Device',50,5),store=saved(mem,device);
  store.save(device);const current=mem.getItem(KEY),older=mem.getItem(KEY+'_backup');
  const backup=readBackup(backupFile(progress('Backup',900,30),{now:START}).text).state;backup.revision=0;
  const payload=store.restore(backup,device.revision);
  assert.equal(mem.getItem(KEY+'_before_restore'),current);assert.equal(mem.getItem(KEY),payload);assert.equal(mem.getItem(KEY+'_backup'),older);
  assert.equal(JSON.parse(payload).revision,device.revision+1);assert.equal(JSON.parse(payload).profile.name,'Backup');
  // The store that restored can keep saving without a false conflict; _backup rotates to the restored save.
  const after=JSON.parse(payload);store.save(after);assert.equal(JSON.parse(mem.getItem(KEY)).revision,after.revision);
  assert.equal(mem.getItem(KEY+'_backup'),payload);assert.equal(mem.getItem(KEY+'_before_restore'),current);
  // The next session loads the backup and leaves the kept copy alone.
  const next=new AdventureStore(mem),loaded=next.load();assert.equal(loaded.profile.name,'Backup');assert.equal(loaded.dragon.xp,900);
  next.save(loaded);assert.equal(mem.getItem(KEY+'_before_restore'),current);
});

test('a failed restore write changes nothing, including an earlier kept copy',()=>{
  for(const earlier of [null,'{"kept":"earlier"}']){
    const mem=new MemoryStorage(),device=progress('Device',50,5),store=saved(mem,device);
    if(earlier)mem.setItem(KEY+'_before_restore',earlier);
    const snapshot=new Map(mem.data),backup=progress('Backup',900,30);
    mem.failKey=KEY;
    assert.throws(()=>store.restore(backup,device.revision),e=>e.code==='space'&&/restore this backup\. Nothing was changed\.$/.test(e.message));
    assert.deepEqual(mem.data,snapshot);
    mem.failKey=KEY+'_before_restore';
    assert.throws(()=>store.restore(backup,device.revision),e=>e.code==='space'&&/keep a copy of the current progress\. Nothing was changed\.$/.test(e.message));
    assert.deepEqual(mem.data,snapshot);
    mem.failKey=null;store.save(device);assert.equal(JSON.parse(mem.getItem(KEY)).profile.name,'Device');
  }
});

test('restore refuses to overwrite a save another tab changed',()=>{
  const mem=new MemoryStorage(),device=progress('Device',50,5),first=saved(mem,device),second=new AdventureStore(mem),other=second.load();
  other.profile.name='Other tab';second.save(other);const snapshot=new Map(mem.data);
  assert.throws(()=>first.restore(progress('Backup',900,30),device.revision),e=>e.code==='conflict');
  assert.deepEqual(mem.data,snapshot);
});

test('the restore summary shows name, whole XP, introduced words and cleared chapters',()=>{
  const s=progress('Reader',1234.9,17);s.story.clearedAreas=Content.areas.slice(0,2).map(a=>a.id);
  assert.deepEqual(backupSummary(s,START),{name:'Reader',xp:1234,words:17,chapters:2});
  assert.equal(backupSummary(progress('',0,0),START).name,'No name yet');
});

test('a browser quota error becomes the storage problem, so the grown-up dialog can offer a backup file',()=>{
  const mem=new MemoryStorage(),s=progress('Device',50,5),store=saved(mem,s),before=mem.getItem(KEY);
  mem.setItem=()=>{throw new DOMException('The quota has been exceeded.','QuotaExceededError');};
  assert.throws(()=>store.save(s),e=>e.code==='storage'&&e.message==='Progress could not be saved. Keep this tab open and try saving again.');
  assert.equal(mem.getItem(KEY),before);
});
