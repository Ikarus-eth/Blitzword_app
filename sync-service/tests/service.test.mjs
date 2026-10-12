import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {handle,GAME_ORIGIN,MAX_BYTES} from '../lib/sync-service.mjs';
const admin='a'.repeat(64),token='b'.repeat(64);
function setup(extraEnv={},send=fetch){
 const sql=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')))sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
 const DB={prepare(q){return {bind(...args){return {first:async()=>sql.prepare(q).get(...args),all:async()=>({results:sql.prepare(q).all(...args)}),run:async()=>sql.prepare(q).run(...args)}}}},async batch(statements){sql.exec('BEGIN');try{const out=[];for(const s of statements)out.push(await s.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const call=(path,body,auth,method='POST',origin=GAME_ORIGIN,now=1000)=>handle(new Request('https://service.test'+path,{method,headers:{Origin:origin,...(auth?{Authorization:'Bearer '+auth}:{}),'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),{DB,ADMIN_KEY:admin,...extraEnv},now,send);
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

test('complete snapshot reconstructs exactly from bounded rows; reports and events are idempotent',async()=>{
 const {call,sql}=setup(),p=await paired(call),path='/api/devices/'+p.deviceId;
 const b=payload(1);b.progress={campaign:{battleRecords:[{id:'a1',at:'2026-10-11T06:00:00Z',target:'cat',firstResponse:'cat',correct:true,supported:false,task:'battle',responseMs:700}]},learning:{words:{cat:{observations:1}}},archive:{answers:{records:8},days:{'2026-10-10':{answers:8,independent:8,correct:6}}},timing:{days:{'2026-10-11':{practice:60000}}}};b.reports={words:[{word:'cat',correct:1,independent:1}],weeks:[]};
 const ack=await(await call(path+'/snapshot',b,token)).json();assert.equal(ack.historyVersion,2);assert.equal(ack.archivedAnswers,8);
 const parts=sql.prepare('SELECT data FROM progress_parts WHERE device_id=? ORDER BY part').all(p.deviceId);assert.deepEqual(JSON.parse(parts.map(p=>p.data).join('')),b);assert.ok(parts.every(p=>p.data.length<=900));
 const before=sql.prepare('SELECT COUNT(*) n FROM progress_events').get().n;
 await call(path+'/snapshot',b,token);assert.equal(sql.prepare('SELECT COUNT(*) n FROM progress_events').get().n,before);
 const events=[{key:'new-answer',kind:'answer',data:{target:'dog',correct:false},at:'2026-10-12T00:00:00Z'}];
 assert.deepEqual((await(await call(path+'/events',{events},token)).json()).accepted,['new-answer']);await call(path+'/events',{events},token);assert.equal(sql.prepare('SELECT COUNT(*) n FROM progress_events').get().n,before+1);
 assert.equal((await call('/api/admin/reindex',{deviceId:p.deviceId})).status,401);
 assert.equal((await call('/api/admin/reindex',{deviceId:p.deviceId},admin)).status,200);
 await call(path,undefined,token,'DELETE');for(const name of ['overview','days','weeks','words','sessions','events','parts','trends'])assert.equal(sql.prepare('SELECT COUNT(*) n FROM progress_'+name).get().n,0,name);
});
test('new snapshot removes obsolete report rows but retains historical events; stale snapshots cannot restore old rows',async()=>{
 const {call,sql}=setup(),p=await paired(call),path='/api/devices/'+p.deviceId+'/snapshot';
 const b={...payload(1),reports:{words:[{word:'cat',correct:1}]},progress:{campaign:{battleRecords:[{id:'old',at:'2026-10-01',task:'battle',target:'cat',correct:true}]}}};
 await call(path,b,token);await call(path,{...payload(2),reports:{words:[{word:'dog',correct:1}]}},token);await call(path,b,token);
 assert.deepEqual(sql.prepare('SELECT record_key FROM progress_words').all().map(r=>r.record_key),['dog']);assert.equal(sql.prepare('SELECT COUNT(*) n FROM progress_events').get().n,1);
});

test('multipart event remains immutable when replay metadata grows across a part boundary',async()=>{
 const {call,sql}=setup(),p=await paired(call),path='/api/devices/'+p.deviceId+'/events';
 const event={key:'immutable',kind:'answer',at:'2026-10-11',build:'short',data:{target:'cat',padding:'x'.repeat(760)}};
 await call(path,{events:[event]},token);const original=sql.prepare('SELECT * FROM progress_events ORDER BY part').all();
 await call(path,{events:[{...event,build:'long'.repeat(100)}]},token);
 const after=sql.prepare('SELECT * FROM progress_events ORDER BY part').all();assert.deepEqual(after,original);assert.deepEqual(JSON.parse(after.map(r=>r.data).join('')),event);
});

const oralMeta=()=>({id:crypto.randomUUID(),title:'Test passage',passage:'The cat sat.',duration:10,locale:'en-GB',recordedOn:'2026-10-11',audioHash:'a'.repeat(64)});
const oralPhrases=[{words:[{word:'the',offset:1,duration:.5,accuracy:95},{word:'cat',offset:2,duration:.5,accuracy:90},{word:'sat',offset:5,duration:.5,accuracy:95}]}];
test('oral setup status and all oral routes require a paired device',async()=>{
 const {call}=setup(),p=await paired(call),base='/api/devices/'+p.deviceId+'/oral/';
 assert.equal((await call(base+'status',{})).status,401);assert.equal((await call(base+'token',{},token)).status,503);
 assert.equal((await(await call(base+'status',{},token)).json()).ready,false);
});
test('oral token keeps key server-side; results are idempotent, private, readable and deleted with sharing',async()=>{
 let requests=0;const {call,sql}=setup({AZURE_SPEECH_KEY:'private-key',AZURE_SPEECH_REGION:'southeastasia'},async(url,options)=>{requests++;assert.equal(url,'https://southeastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken');assert.equal(options.headers['Ocp-Apim-Subscription-Key'],'private-key');return new Response('short-lived-token');});
 const p=await paired(call),base='/api/devices/'+p.deviceId+'/oral/',meta=oralMeta();
 const start=await call(base+'token',meta,token);assert.equal(start.status,200);assert.equal((await start.json()).token,'short-lived-token');
 assert.equal((await call(base+'report',{id:crypto.randomUUID(),phrases:oralPhrases},token)).status,404);
 const body={id:meta.id,phrases:oralPhrases};const r=await call(base+'report',body,token);assert.equal(r.status,200);assert.equal((await r.json()).saved,true);
 const rows=sql.prepare('SELECT * FROM oral_parts ORDER BY part').all();assert.ok(rows.every(r=>r.data.length<=900));const report=JSON.parse(rows.map(r=>r.data).join(''));assert.equal(report.passage,meta.passage);assert.equal(report.summary.match,3);
 await call(base+'report',{id:meta.id,phrases:[]},token);assert.deepEqual(sql.prepare('SELECT * FROM oral_parts ORDER BY part').all(),rows);assert.equal(requests,1);
 assert.equal((await call(base+'status',{},'c'.repeat(64))).status,401);assert.equal((await(await call(base+'status',{},token)).json()).reports.length,1);
 await call('/api/devices/'+p.deviceId,undefined,token,'DELETE');for(const t of ['oral_parts','oral_attempts','oral_quota'])assert.equal(sql.prepare('SELECT count(*) n FROM '+t).get().n,0);assert.equal((await call(base+'token',oralMeta(),token)).status,401);
});
test('oral daily start quota is enforced before Azure calls; failures never claim completion',async()=>{
 let requests=0;const {call,sql}=setup({AZURE_SPEECH_KEY:'key',AZURE_SPEECH_REGION:'southeastasia'},async()=>{requests++;return new Response('unavailable',{status:429});});const p=await paired(call),base='/api/devices/'+p.deviceId+'/oral/';
 assert.equal((await call(base+'token',{...oralMeta(),duration:181},token)).status,400);
 for(let i=0;i<10;i++)assert.equal((await call(base+'token',oralMeta(),token)).status,502);
 assert.equal((await call(base+'token',oralMeta(),token)).status,429);assert.equal(requests,10);assert.equal(sql.prepare('SELECT count(*) n FROM oral_attempts').get().n,0);
});
test('parent context updates after auto-upload preserve speech evidence and require the owning device',async()=>{
 const {call,sql}=setup({AZURE_SPEECH_KEY:'key',AZURE_SPEECH_REGION:'southeastasia'},async()=>new Response('token'));
 const p=await paired(call),base='/api/devices/'+p.deviceId+'/oral/',meta=oralMeta(),context={id:meta.id,assisted:true,reread:false,notes:'Parent supplied found; comprehension correct.'};
 await call(base+'token',meta,token);assert.equal((await call(base+'context',context,token)).status,409);
 await call(base+'report',{id:meta.id,phrases:oralPhrases},token);
 const read=()=>JSON.parse(sql.prepare('SELECT data FROM oral_parts ORDER BY part').all().map(p=>p.data).join(''));const before=read();
 assert.equal((await call(base+'context',context,'c'.repeat(64))).status,401);
 assert.equal((await call(base+'context',{...context,id:crypto.randomUUID()},token)).status,404);
 assert.equal((await call(base+'context',{...context,notes:'x'.repeat(1001)},token)).status,400);
 assert.equal((await call(base+'context',context,token)).status,200);const after=read();assert.deepEqual(after.words,before.words);assert.deepEqual(after.summary,before.summary);assert.equal(after.assisted,true);assert.equal(after.notes,context.notes);
 const history=await(await call(base+'status',{},token)).json();assert.equal(history.reports[0].assisted,true);
 await call(base+'report',{id:meta.id,phrases:[]},token);assert.deepEqual(read(),after,'report retries must preserve updated context');
 await call(base+'context',{...context,notes:'Short'},token);assert.equal(read().notes,'Short','rewritten report parts have no trailing old chunks');
});
