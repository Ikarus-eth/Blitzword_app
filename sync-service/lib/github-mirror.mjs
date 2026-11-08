import {unpack} from './history.mjs';
export const REPOSITORY='Ikarus-eth/Blitzword_app', BRANCH='progress-data', FILE='latest.enc.json';
const AAD='blitzword-progress-mirror-v1';
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const base64=b=>{let s='';for(let i=0;i<b.length;i+=8192)s+=String.fromCharCode(...b.subarray(i,i+8192));return btoa(s);};
const key=hex=>{if(!/^[a-f0-9]{64}$/.test(hex||''))throw new Error('Invalid mirror key');return crypto.subtle.importKey('raw',Uint8Array.from(hex.match(/../g),x=>parseInt(x,16)),'AES-GCM',false,['encrypt','decrypt']);};
export async function encryptReport(report,secret){
 const zipped=new Uint8Array(await new Response(new Blob([JSON.stringify(report)]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode(AAD)},await key(secret),zipped);
 return {format:AAD,algorithm:'AES-256-GCM',compression:'gzip',iv:base64(iv),ciphertext:base64(new Uint8Array(ciphertext))};
}
export async function decryptReport(envelope,secret){
 if(envelope.format!==AAD||envelope.algorithm!=='AES-256-GCM'||envelope.compression!=='gzip')throw new Error('Unsupported report');
 const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv),additionalData:new TextEncoder().encode(AAD)},await key(secret),bytes(envelope.ciphertext));
 return JSON.parse(await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
}
const configured=(env,id)=>env.GITHUB_MIRROR_TOKEN&&env.PROGRESS_READING_KEY&&id===env.GITHUB_MIRROR_DEVICE_ID;
async function api(env,send,path,method='GET',body){
 const response=await send('https://api.github.com/repos/'+REPOSITORY+path,{method,redirect:'manual',signal:AbortSignal.timeout(10000),headers:{Authorization:'Bearer '+env.GITHUB_MIRROR_TOKEN,Accept:'application/vnd.github+json','Content-Type':'application/json','User-Agent':'BlitzWord-progress','X-GitHub-Api-Version':'2022-11-28'},body:body?JSON.stringify(body):undefined});
 const data=await response.json().catch(()=>({}));return {status:response.status,data};
}
export async function withMirrorLock(env,id,now,action){
 if(!configured(env,id))return action(false);
 const owner=crypto.randomUUID();
 const row=await env.DB.prepare('INSERT INTO github_mirror_locks (device_id,owner,expires_at) VALUES (?,?,?) ON CONFLICT(device_id) DO UPDATE SET owner=excluded.owner,expires_at=excluded.expires_at WHERE github_mirror_locks.expires_at<=? RETURNING owner').bind(id,owner,now+120000,now).first();
 if(row?.owner!==owner)throw new Error('Mirror busy');
 try{return await action(true);}finally{await env.DB.prepare('DELETE FROM github_mirror_locks WHERE device_id=? AND owner=?').bind(id,owner).run();}
}
async function existing(env,send){
 const r=await api(env,send,'/contents/'+FILE+'?ref='+BRANCH);
 if(r.status===404)return null;
 if(r.status!==200||r.data.encoding!=='base64')throw new Error('Cannot read encrypted mirror');
 return {sha:r.data.sha,report:await decryptReport(JSON.parse(new TextDecoder().decode(bytes(r.data.content.replace(/\s/g,'')))),env.PROGRESS_READING_KEY)};
}
export async function mirrorLatest(env,id,now=Date.now(),send=fetch){
 if(!configured(env,id))return {status:'disabled'};
 try{return await withMirrorLock(env,id,now,async()=>{
  const row=await env.DB.prepare('SELECT snapshot,received_at FROM devices WHERE id=? AND revoked=0').bind(id).first();
  if(!row?.snapshot)return {status:'empty'};
  const snapshot=JSON.parse(row.snapshot);
  const oralRows=(await env.DB.prepare('SELECT assessment_id AS record_key,part,parts,data FROM oral_parts WHERE device_id=? ORDER BY assessment_id,part').bind(id).all()).results;
  const groups=new Map();for(const r of oralRows){if(!groups.has(r.record_key))groups.set(r.record_key,[]);groups.get(r.record_key).push(r);}
  const oralReports=[...groups.values()].map(parts=>{if(parts.length!==parts[0].parts||parts.some((p,i)=>p.part!==i))throw new Error('Incomplete oral report');return JSON.parse(parts.map(p=>p.data).join(''));});
  const report={format:'blitzword-readable-progress-v1',sequence:snapshot.sequence,capturedAt:snapshot.capturedAt,receivedAt:row.received_at,build:snapshot.build,summary:snapshot.summary||{},reports:snapshot.reports||{},progress:unpack(snapshot.progress),oralReports,limitations:'Latest redacted snapshot and saved oral reports. Earlier compacted answers survive as aggregates; additional uploaded event history remains in the authenticated Sites database. Recognition response time is not oral reading speed. Daily totals use device-local dates; individual timestamps use UTC. This is not a restorable game backup.'};
  const old=await existing(env,send);
  if(old?.report.sequence>report.sequence)throw new Error('Remote report is newer');
  if(old&&JSON.stringify(old.report)===JSON.stringify(report))return {status:'synced',sequence:report.sequence,capturedAt:report.capturedAt};
  const envelope=await encryptReport(report,env.PROGRESS_READING_KEY);
  const result=await api(env,send,'/contents/'+FILE,'PUT',{message:'Refresh encrypted progress report',branch:BRANCH,...(old?{sha:old.sha}:{}),content:base64(new TextEncoder().encode(JSON.stringify(envelope)+'\n'))});
  if(![200,201].includes(result.status))throw new Error('Mirror write failed');
  return {status:'synced',sequence:report.sequence,capturedAt:report.capturedAt};
 });}catch{return {status:'pending'};}
}
// Called under the same lock as uploads. Git retains old ciphertext in history.
export async function deleteMirror(env,id,send=fetch){
 if(!configured(env,id))return;
 const old=await existing(env,send);if(!old)return;
 const r=await api(env,send,'/contents/'+FILE,'DELETE',{message:'Remove latest encrypted progress report',branch:BRANCH,sha:old.sha});
 if(r.status!==200)throw new Error('Mirror deletion pending');
}
