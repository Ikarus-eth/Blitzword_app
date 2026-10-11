import {metadata,analyze} from './oral-analysis.mjs';
export const ORAL_TABLES=['oral_attempts','oral_parts','oral_quota'];
const configured=env=>!!env.AZURE_SPEECH_KEY&&/^[a-z0-9]{3,40}$/.test(env.AZURE_SPEECH_REGION||'');
export async function oralRoute(request,env,id,action,readJSON,reply,now,send=fetch){
 const DB=env.DB;
 if(request.method!=='POST')return reply({error:'Not found'},404);
 if(action==='status'){
   const rows=await DB.prepare('SELECT id, created_at, summary FROM oral_attempts WHERE device_id=? AND state=? ORDER BY created_at DESC LIMIT 25').bind(id,'complete').all();
   return reply({ready:configured(env),reports:(rows.results||[]).map(r=>({id:r.id,createdAt:r.created_at,...JSON.parse(r.summary)}))});
 }
 const b=await readJSON(request);
 if(action==='token'){
   if(!configured(env))return reply({error:'Azure Speech is not configured yet. Follow the setup instructions below.',code:'azure_setup_required'},503);
   let meta;try{meta=metadata(b);}catch(e){return reply({error:e.message},400);}
   const existing=await DB.prepare('SELECT id FROM oral_attempts WHERE id=? AND device_id=?').bind(meta.id,id).first();
   if(existing)return reply({error:'This assessment was already started. Retry saving its result, or start a new assessment.'},409);
   const bucket=new Date(now).toISOString().slice(0,10);
   const quota=await DB.prepare('INSERT INTO oral_quota (device_id,day,count) VALUES (?,?,1) ON CONFLICT(device_id,day) DO UPDATE SET count=count+1 WHERE count<10 RETURNING count').bind(id,bucket).first();
   if(!quota)return reply({error:'Daily limit reached (10 assessments). Try tomorrow.'},429);
   const response=await send(`https://${env.AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,{method:'POST',headers:{'Ocp-Apim-Subscription-Key':env.AZURE_SPEECH_KEY},signal:AbortSignal.timeout(12000),redirect:'error'});
   if(!response.ok)return reply({error:'Azure could not start the assessment. Check the Speech resource, region and quota.'},502);
   const token=await response.text();
   const inserted=await DB.prepare('INSERT INTO oral_attempts (id,device_id,created_at,state,metadata) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM devices WHERE id=? AND revoked=0) RETURNING id').bind(meta.id,id,new Date(now).toISOString(),'started',JSON.stringify(meta),id).first();
   if(!inserted)return reply({error:'Connection was deleted'},401);
   return reply({token,region:env.AZURE_SPEECH_REGION,id:meta.id,expiresIn:600});
 }
 if(action==='report'){
   if(typeof b.id!=='string')return reply({error:'Invalid assessment'},400);
   const row=await DB.prepare('SELECT state,metadata,summary FROM oral_attempts WHERE id=? AND device_id=?').bind(b.id,id).first();
   if(!row)return reply({error:'Assessment not found'},404);
   if(row.state==='complete')return reply({saved:true,id:b.id,summary:JSON.parse(row.summary)});
   let result;try{result=analyze(JSON.parse(row.metadata),b.phrases);}catch(e){return reply({error:e.message},400);}
   const serialized=JSON.stringify(result),chunks=[];for(let pos=0;pos<serialized.length;pos+=900)chunks.push(serialized.slice(pos,pos+900));
   const summary={title:result.title,recordedOn:result.recordedOn,assisted:result.assisted,reread:result.reread,...result.summary};
   // Conditional inserts/update make concurrent retries immutable; the transaction is all-or-nothing.
   const statements=chunks.map((data,part)=>DB.prepare("INSERT INTO oral_parts (device_id,assessment_id,part,parts,data) SELECT ?,?,?,?,? WHERE EXISTS (SELECT 1 FROM oral_attempts WHERE id=? AND device_id=? AND state='started') ON CONFLICT DO NOTHING").bind(id,b.id,part,chunks.length,data,b.id,id));
   statements.push(DB.prepare("UPDATE oral_attempts SET state='complete',summary=? WHERE id=? AND device_id=? AND state='started'").bind(JSON.stringify(summary),b.id,id));
   await DB.batch(statements);
   const saved=await DB.prepare('SELECT summary FROM oral_attempts WHERE id=? AND device_id=?').bind(b.id,id).first();
   return saved?reply({saved:true,id:b.id,summary:JSON.parse(saved.summary)}):reply({error:'Connection was deleted'},401);
 }
 return reply({error:'Not found'},404);
}
