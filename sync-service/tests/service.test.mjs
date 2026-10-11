import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {handle,GAME_ORIGIN,MAX_BYTES} from '../lib/sync-service.mjs';
const admin='a'.repeat(64),token='b'.repeat(64);
function setup(){
 const sql=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')))sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
 const DB={prepare(q){return {bind(...args){return {first:async()=>sql.prepare(q).get(...args),run:async()=>sql.prepare(q).run(...args)}}}}};
 const call=(path,body,auth,method='POST',origin=GAME_ORIGIN,now=1000)=>handle(new Request('https://service.test'+path,{method,headers:{Origin:origin,...(auth?{Authorization:'Bearer '+auth}:{}),'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),{DB,ADMIN_KEY:admin},now);
 return {sql,call};
}
const payload=n=>({format:'blitzword-progress-v1',sequence:n,build:'test',capturedAt:new Date(1000).toISOString(),progress:{learning:{sequence:n}},summary:{xp:n}});
async function paired(call){const issued=await(await call('/api/admin/pair',{},admin)).json();const r=await call('/api/pair',{code:issued.code,token});assert.equal(r.status,200);return {...issued,...await r.json()};}
test('only administrator issues pairing links; no public data reads',async()=>{
 const {call}=setup();assert.equal((await call('/api/admin/pair',{})).status,401);assert.equal((await call('/api/admin/pair',{},'c'.repeat(64))).status,401);assert.equal((await call('/api/devices',undefined,null,'GET')).status,404);
});
test('pairing is single-device, expiry checked, lost response can be retried',async()=>{
 const {call}=setup(),p=await paired(call);
 assert.equal((await call('/api/pair',{code:p.code,token})).status,200);
 assert.equal((await call('/api/pair',{code:p.code,token:'c'.repeat(64)})).status,401);
 assert.equal((await call('/api/pair',{code:p.code,token},null,'POST',GAME_ORIGIN,49*3600000)).status,401);
});
test('device authentication, durable upload, duplicate and out-of-order protection',async()=>{
 const {call,sql}=setup(),p=await paired(call),path='/api/devices/'+p.deviceId+'/snapshot';
 assert.equal((await call(path,payload(1),'c'.repeat(64))).status,401);
 assert.equal((await call(path,payload(2),token)).status,200);
 assert.equal((await(await call(path,payload(1),token)).json()).sequence,2);
 assert.equal((await(await call(path,payload(2),token)).json()).sequence,2);
 const row=sql.prepare('SELECT * FROM devices').get();assert.equal(JSON.parse(row.snapshot).sequence,2);assert.equal(JSON.parse(row.summary).xp,2);assert.notEqual(row.token_hash,token);
 assert.equal((await call(path,undefined,token,'GET')).status,404);
});
test('deletion revokes writes and erases payload and summary',async()=>{
 const {call,sql}=setup(),p=await paired(call),path='/api/devices/'+p.deviceId;
 await call(path+'/snapshot',payload(1),token);
 assert.equal((await call(path,undefined,token,'DELETE')).status,200);
 assert.equal((await call(path+'/snapshot',payload(2),token)).status,401);
 const row=sql.prepare('SELECT * FROM devices').get();assert.equal(row.snapshot,null);assert.equal(row.summary,null);assert.equal(row.token_hash,null);assert.equal(row.revoked,1);
});
test('CORS accepts only game origin and malformed/oversized snapshots are refused',async()=>{
 const {call}=setup(),p=await paired(call),path='/api/devices/'+p.deviceId+'/snapshot';
 assert.equal((await call(path,{},token,'POST','https://attacker.test')).status,403);
 const options=await call(path,undefined,null,'OPTIONS');assert.equal(options.status,204);assert.equal(options.headers.get('Access-Control-Allow-Origin'),GAME_ORIGIN);
 assert.equal((await call(path,{...payload(1),sequence:-1},token)).status,400);
 assert.equal((await call(path,{...payload(1),progress:{large:'x'.repeat(MAX_BYTES)}},token)).status,413);
});
