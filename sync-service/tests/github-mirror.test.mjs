import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {encryptReport,decryptReport,mirrorLatest,withMirrorLock,deleteMirror} from '../lib/github-mirror.mjs';
const secret='a'.repeat(64),id='test-device';
function setup(){
 const sql=new DatabaseSync(':memory:');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')))sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
 const DB={prepare:q=>({bind:(...args)=>({first:async()=>sql.prepare(q).get(...args),all:async()=>({results:sql.prepare(q).all(...args)}),run:async()=>sql.prepare(q).run(...args)})})};
 const payload={sequence:5,capturedAt:'2026-11-08T00:00:00Z',progress:{learning:{words:{cat:{observations:4}}}},summary:{xp:42}};
 sql.prepare('INSERT INTO devices (id,sequence,snapshot,received_at,pair_hash,pair_expires) VALUES (?,?,?,?,?,?)').run(id,5,JSON.stringify(payload),payload.capturedAt,'pair',100000);
 const env={DB,GITHUB_MIRROR_TOKEN:'github-secret',PROGRESS_READING_KEY:secret,GITHUB_MIRROR_DEVICE_ID:id};
 let file=null,sha='0',fail=false,writes=0;
 const send=async(url,o)=>{
  assert.ok(url.startsWith('https://api.github.com/repos/Ikarus-eth/Blitzword_app/contents/latest.enc.json'));assert.equal(o.redirect,'manual');
  if(fail)return Response.json({message:'unavailable'},{status:503});
  if(o.method==='GET')return file?Response.json({sha,encoding:'base64',content:Buffer.from(file).toString('base64')}):Response.json({},{status:404});
  const b=JSON.parse(o.body);assert.equal(b.branch,'progress-data');assert.equal(b.sha,file?sha:undefined);
  if(o.method==='DELETE'){file=null;return Response.json({});}
  file=Buffer.from(b.content,'base64').toString();sha=String(+sha+1);writes++;return Response.json({},{status:201});
 };
 return {env,sql,send,get file(){return file},get writes(){return writes},fail:v=>fail=v};
}
test('reports use authenticated encryption, random IVs, gzip and no plaintext fields',async()=>{
 const report={summary:{xp:42},private:'learner words'};const a=await encryptReport(report,secret),b=await encryptReport(report,secret);
 assert.notEqual(a.iv,b.iv);assert.equal(JSON.stringify(a).includes('learner'),false);assert.deepEqual(await decryptReport(a,secret),report);
 await assert.rejects(()=>decryptReport(a,'b'.repeat(64)));a.ciphertext=(a.ciphertext[0]==='A'?'B':'A')+a.ciphertext.slice(1);await assert.rejects(()=>decryptReport(a,secret));
});
test('automatic mirror is idempotent, selected-device only, and does not mutate the game snapshot',async()=>{
 const t=setup(),before=t.sql.prepare('SELECT snapshot FROM devices').get().snapshot;
 assert.equal((await mirrorLatest(t.env,'other',1000,t.send)).status,'disabled');
 assert.equal((await mirrorLatest(t.env,id,1000,t.send)).status,'synced');assert.equal(t.writes,1);
 const report=await decryptReport(JSON.parse(t.file),secret);assert.equal(report.sequence,5);assert.equal(report.progress.learning.words.cat.observations,4);
 assert.equal(t.file.includes('observations'),false);assert.equal((await mirrorLatest(t.env,id,1001,t.send)).status,'synced');assert.equal(t.writes,1);assert.equal(t.sql.prepare('SELECT snapshot FROM devices').get().snapshot,before);
});
test('failed writes retry from saved snapshot; stale snapshots cannot overwrite newer remote reports',async()=>{
 const t=setup();t.fail(true);assert.equal((await mirrorLatest(t.env,id,1000,t.send)).status,'pending');t.fail(false);assert.equal((await mirrorLatest(t.env,id,1001,t.send)).status,'synced');
 t.sql.prepare('UPDATE devices SET snapshot=?').run(JSON.stringify({sequence:4,progress:{},capturedAt:'2026-11-07T00:00:00Z'}));assert.equal((await mirrorLatest(t.env,id,1002,t.send)).status,'pending');assert.equal(t.writes,1);
});
test('lock serializes mirror and deletion; revoked reports cannot be recreated',async()=>{
 const t=setup();await mirrorLatest(t.env,id,1000,t.send);
 await withMirrorLock(t.env,id,1001,async()=>{
  assert.equal((await mirrorLatest(t.env,id,1002,t.send)).status,'pending');
  await deleteMirror(t.env,id,t.send);t.sql.prepare('UPDATE devices SET revoked=1,snapshot=NULL').run();
 });
 assert.equal(t.file,null);assert.equal((await mirrorLatest(t.env,id,1003,t.send)).status,'empty');assert.equal(t.writes,1);
});
