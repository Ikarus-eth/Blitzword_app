const {test}=require('node:test'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const Sync=require('../assets/ui/progress-sync'),Core=require('../game-core');
const waitFor=async predicate=>{const deadline=Date.now()+5000;while(!predicate()){assert.ok(Date.now()<deadline,'sync acknowledgement timed out');await new Promise(resolve=>setTimeout(resolve,5));}};
function setup(){
 const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 let state=Core.migrate({}),now=100000,offline=false,serverSeq=0;const requests=[];
 state.profile.name='Private child';state.profile.age=7;state.dragon.name='Private dragon';
 const fetch=async(url,options)=>{requests.push({url,options});if(offline)throw new Error('offline');let body=options.body?JSON.parse(options.body):null;if(url.endsWith('/pair'))return Response.json({deviceId:'12345678-1234-1234-1234-123456789abc'});if(options.method==='DELETE')return Response.json({deleted:true});serverSeq=Math.max(serverSeq,body.sequence);return Response.json({sequence:serverSeq,receivedAt:new Date(now).toISOString()});};
 const build=()=>Sync.create({storage,readState:()=>state,fetch,crypto:webcrypto,now:()=>now,build:'test',pack:Core.packSave});
 const tick=()=>new Promise(r=>setTimeout(r,20));
 return {map,storage,requests,state,build,tick,offline:v=>offline=v,advance:()=>now+=31000};
}
test('unpaired device never sends progress',async()=>{const t=setup();await t.build().flush(true);assert.equal(t.requests.length,0);});
test('pairing sends redacted, compact progress without modifying playable save',async()=>{
 const t=setup(),sync=t.build(),before=JSON.stringify(t.state);assert.equal(sync.pair('a'.repeat(64)),true);await waitFor(()=>sync.status().lastSyncedAt);
 const p=JSON.parse(t.requests.at(-1).options.body);assert.equal(p.format,'blitzword-progress-v1');assert.equal(p.progress.schemaVersion,3);assert.equal(JSON.stringify(p).includes('Private'),false);assert.equal(p.progress.profile,undefined);assert.equal(JSON.stringify(t.state),before);assert.ok(sync.status().lastSyncedAt);
 t.advance();await sync.flush();assert.equal(t.requests.length,2,'unchanged state is not uploaded again');
});
test('offline updates survive reload and restore with lower game revision',async()=>{
 const t=setup();let sync=t.build();sync.pair('a'.repeat(64));await t.tick();t.offline(true);t.state.dragon.xp=40;t.advance();await sync.flush();const n=JSON.parse(t.storage.getItem(Sync.KEY)).sequence;
 sync=t.build();t.offline(false);t.state.revision=0;t.state.dragon.xp=50;await sync.flush(true);
 const p=JSON.parse(t.requests.at(-1).options.body);assert.ok(p.sequence>n);assert.equal(p.progress.dragon.xp,50);assert.ok(sync.status().lastSyncedAt);
});
test('pause prevents upload, resume catches up, delete does not change save',async()=>{
 const t=setup(),sync=t.build();sync.pair('a'.repeat(64));await waitFor(()=>sync.status().lastSyncedAt);sync.pause(true);const n=t.requests.length,previousAck=sync.status().lastSyncedAt;t.state.dragon.xp=30;t.advance();await sync.flush(true);assert.equal(t.requests.length,n);
 sync.pause(false);await waitFor(()=>sync.status().lastSyncedAt!==previousAck);assert.equal(t.requests.length,n+1);const before=JSON.stringify(t.state);sync.remove();await waitFor(()=>t.storage.getItem(Sync.KEY)===null);assert.equal(t.storage.getItem(Sync.KEY),null);assert.equal(JSON.stringify(t.state),before);
});
test('delete request survives offline reload and blocks further uploads',async()=>{
 const t=setup(),sync=t.build();sync.pair('a'.repeat(64));await t.tick();t.offline(true);sync.remove();await t.tick();assert.equal(sync.status().deleting,true);
 const fresh=t.build();t.offline(false);await fresh.flush(true);assert.equal(t.requests.at(-1).options.method,'DELETE');assert.equal(fresh.status().paired,false);
});
test('profile reset pauses sharing instead of overwriting old learner data',async()=>{
 const t=setup(),sync=t.build();sync.pair('a'.repeat(64));await t.tick();sync.detach();const n=t.requests.length;t.state.dragon.xp=0;t.advance();await sync.flush(true);assert.equal(t.requests.length,n);assert.equal(sync.status().paused,true);
});
test('storage failure never changes the playable state',async()=>{
 const t=setup(),before=JSON.stringify(t.state);t.storage.setItem=()=>{throw new Error('full');};const sync=t.build();assert.throws(()=>sync.pair('a'.repeat(64)));assert.equal(t.requests.length,0);assert.equal(JSON.stringify(t.state),before);
});

test('Home Screen pairing accepts only personal game links or exact codes',()=>{
 const code='a'.repeat(64);assert.equal(Sync.pairingCode('https://ikarus-eth.github.io/Blitzword_app/#sync='+code),code);
 assert.equal(Sync.pairingCode(' '+code+' '),code);assert.equal(Sync.pairingCode('https://other.test/#sync='+code),null);assert.equal(Sync.pairingCode('javascript:alert(1)'),null);assert.equal(Sync.pairingCode('https://ikarus-eth.github.io/Blitzword_app/#sync=short'),null);
});

test('durable event queue survives reload, compaction and duplicate capture',async()=>{
 const {IDBFactory}=require('fake-indexeddb'),History=require('../assets/ui/sync-history');const indexedDB=new IDBFactory();
 let queue=History.create(indexedDB);const s=Core.migrate({});
 s.campaign.battleRecords=[{id:'answer-1',at:'2026-10-11T01:00:00Z',target:'cat',correct:true,task:'battle'}];
 await queue.capture('device',s,'test');await queue.capture('device',s,'test');assert.equal((await queue.pending('device')).length,1);
 s.campaign.battleRecords=[];queue=History.create(indexedDB);const rows=await queue.pending('device');assert.equal(rows.length,1);
 await queue.acknowledge(rows.map(r=>r.key));assert.equal((await queue.pending('device')).length,0);
 s.campaign.battleRecords=[rows[0].data];await queue.capture('device',s,'test');assert.equal((await queue.pending('device')).length,0,'acknowledged events do not requeue');
 await queue.capture('other',s,'test');assert.equal((await queue.pending('other')).length,1);await queue.clear('other');assert.equal((await queue.pending('other')).length,0);
});
test('event acknowledgements are required before clearing offline queue',async()=>{
 const t=setup();let rows=[{key:'local',eventKey:'event',kind:'answer',at:'2026-10-11',data:{correct:true},build:'test'}],cleared=false,accept=false;
 const history={capture:async()=>{},pending:async()=>rows,acknowledge:async()=>{cleared=true;rows=[];},clear:async()=>{}};
 const sync=Sync.create({storage:t.storage,readState:()=>t.state,crypto:webcrypto,history,fetch:async(url,o)=>url.endsWith('/pair')?Response.json({deviceId:'12345678-1234-1234-1234-123456789abc'}):url.endsWith('/events')?Response.json({accepted:accept?['event']:[]}):Response.json({sequence:JSON.parse(o.body).sequence,receivedAt:new Date().toISOString(),historyVersion:2})});
 sync.pair('a'.repeat(64));await t.tick();assert.equal(cleared,false);accept=true;await sync.flush(true);assert.equal(cleared,true);assert.equal(sync.status().pendingEvents,0);
});
