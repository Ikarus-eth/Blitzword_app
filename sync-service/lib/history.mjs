// Small, paginated rows keep the complete report readable through authenticated Sites tools.
export const TABLES=['progress_overview','progress_days','progress_weeks','progress_words','progress_sessions','progress_events','progress_parts','progress_trends'];
export function unpack(saved){
  const p=JSON.parse(JSON.stringify(saved));if(!p.wordTables)return p;
  const schemas=p.wordTables.schemas;
  const expand=row=>{const keys=schemas[row[0]];if(!Array.isArray(keys)||keys.length!==row.length-1||keys.some(k=>['__proto__','constructor','prototype'].includes(k)))throw new Error('Invalid event table');return Object.fromEntries(keys.map((k,i)=>[k,row[i+1]]));};
  for(const [parent,key] of [['learning','words'],['learning','dailyPractice'],['archive','words']])if(p[parent]?.[key])p[parent][key]=Object.fromEntries(Object.entries(p[parent][key]).map(([k,r])=>[k,expand(r)]));
  for(const [parent,key] of p.wordTables.arrays||[]){if(!['campaign.battleRecords','learning.teaching','learning.supportExposures'].includes(parent+'.'+key))throw new Error('Invalid event table');p[parent][key]=p[parent][key].map(expand);}
  delete p.wordTables;return p;
}
export function chunks(value){const s=JSON.stringify(value),out=[];for(let i=0;i<s.length;i+=900)out.push(s.slice(i,i+900));return out;}
export function events(p,build){return [['answer',p.campaign?.battleRecords],['assessment',p.assessment?.records],['teaching',p.learning?.teaching],['support',p.learning?.supportExposures],['session',p.sessions],['duel',p.math?.records]].flatMap(([kind,list])=>(list||[]).map(data=>({key:JSON.stringify([kind,data.id||'',data.at||data.startedAt||data.finishedAt||'']),kind,at:data.at||data.startedAt||data.finishedAt||null,build,data})));}
const day=at=>Number.isFinite(Date.parse(at))?new Date(at).toISOString().slice(0,10):'unknown';
const week=d=>{if(d==='unknown')return d;const date=new Date(d+'T12:00:00Z');date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);return date.toISOString().slice(0,10);};
const sumKeys=['answers','independent','correct','helped','timed','responseMs'];
export function projections(b){
  const p=unpack(b.progress),days={};
  for(const [date,data] of Object.entries(p.archive?.days||{}))(days[date] ||= {}).archivedDeviceLocal=data;
  for(const r of p.campaign?.battleRecords||[]){if(r.task!=='battle')continue;const d=(days[day(r.at)] ||= {}).retainedUTC ||= {};d.answers=(d.answers||0)+1;const k=r.supported?'helped':'independent';d[k]=(d[k]||0)+1;if(!r.supported&&r.correct)d.correct=(d.correct||0)+1;if(!r.supported&&r.timingValid!==false&&r.responseMs>0){d.timed=(d.timed||0)+1;d.responseMs=(d.responseMs||0)+r.responseMs;}}
  const weeks={};for(const [date,data] of Object.entries(days)){const w=weeks[week(date)] ||= {};for(const source of ['archivedDeviceLocal','retainedUTC'])if(data[source]){const totals=w[source] ||= {};for(const key of sumKeys)totals[key]=(totals[key]||0)+(data[source][key]||0);}}
  // Preserve clock provenance: historical local date offsets were not recorded.
  for(const [date,timing] of Object.entries(p.timing?.days||{})){(days[date] ||= {}).deviceLocalTiming=timing;}
  const words=b.reports?.words||Object.entries(p.learning?.words||{}).filter(([,v])=>v.observations||v.introducedAt||v.lastSeenAt).map(([word,state])=>({word,state,archived:p.archive?.words?.[word]||null,detail:'Legacy state plus archived totals; full retained answers are in progress_events.'}));
  const records={progress_days:Object.entries(days),progress_weeks:Object.entries(weeks),progress_words:words.map(w=>[w.word,w]),progress_sessions:(p.sessions||[]).map((s,i)=>[s.id||String(i),s]),progress_parts:[['snapshot',b]],progress_trends:[[day(b.capturedAt),{capturedAt:b.capturedAt,build:b.build,summary:b.summary||{},basis:'Latest synced observation on this UTC date; not reconstructed earlier progress.'}]]};
  const retained=p.campaign?.battleRecords||[],archived=p.archive?.answers?.records||0;
  records.progress_overview=[['latest',{capturedAt:b.capturedAt,build:b.build,summary:b.summary||{},history:{retainedAnswers:retained.length,archivedAnswers:archived,earliestRetainedAnswer:retained[0]?.at||null,firstPracticeAt:p.timing?.firstPracticeAt||null,limitations:'Older compacted answers survive only as totals unless uploaded earlier. Recognition response time is not oral reading speed. Retained answer dates are UTC; archived answer dates and active minutes are device-local. Historical timezone offsets are unknown; avoid exact daily comparisons across these sources. Snapshot build is not necessarily the build on which historical events occurred.',syncVersion:b.historyVersion||1}}]];
  if(b.reports?.weeks)records.progress_weeks.push(...b.reports.weeks.map(w=>['retention:'+w.week,{...w,metric:'First delayed check per word; device-local week'}]));
  return {records,events:events(p,b.build)};
}
// Bulk JSON inserts keep large saves within Workers/D1 per-request query limits.
function bulk(DB,table,id,rows,sequence,immutable=false){
 const statements=[];
 for(let i=0;i<rows.length;i+=60){
  const conflict=immutable?'DO NOTHING':`DO UPDATE SET parts=excluded.parts,sequence=excluded.sequence,data=excluded.data WHERE excluded.sequence>=${table}.sequence`;
  const guard=immutable?'':' AND sequence=?';
  const q=DB.prepare(`INSERT INTO ${table} (device_id,record_key,part,parts,sequence,data) SELECT ?,json_extract(value,'$[0]'),json_extract(value,'$[1]'),json_extract(value,'$[2]'),?,json_extract(value,'$[3]') FROM json_each(?) WHERE EXISTS (SELECT 1 FROM devices WHERE id=? AND revoked=0${guard}) ON CONFLICT(device_id,record_key,part) ${conflict}`);
  statements.push(q.bind(...[id,sequence,JSON.stringify(rows.slice(i,i+60)),id,...(immutable?[]:[sequence])]));
 }
 return statements;
}
export async function writeProjection(DB,id,b){
 const {records,events:tail}=projections(b),statements=[];
 for(const [table,rows] of Object.entries(records)){
  const parts=rows.flatMap(([key,value])=>{const list=chunks(value);return list.map((data,i)=>[key,i,list.length,data]);});
  statements.push(...bulk(DB,table,id,parts,b.sequence));
 }
 for(let i=0;i<statements.length;i+=20)await DB.batch(statements.slice(i,i+20));
 for(const table of TABLES.filter(t=>!['progress_events','progress_trends'].includes(t)))await DB.prepare(`DELETE FROM ${table} WHERE device_id=? AND sequence<? AND EXISTS (SELECT 1 FROM devices WHERE id=? AND sequence=? AND revoked=0)`).bind(id,b.sequence,id,b.sequence).run();
 await writeEvents(DB,id,tail);
 await DB.prepare('UPDATE devices SET history_sequence=? WHERE id=? AND sequence=? AND revoked=0').bind(b.sequence,id,b.sequence).run();
 return {historyVersion:2,historySince:tail.map(e=>e.at).filter(Boolean).sort()[0]||null,archivedAnswers:unpack(b.progress).archive?.answers?.records||0};
}
export async function writeEvents(DB,id,events){
 const rows=events.flatMap(e=>{const parts=chunks(e);return parts.map((data,i)=>[e.key,i,parts.length,data]);});
 const statements=bulk(DB,'progress_events',id,rows,0,true);
 for(let i=0;i<statements.length;i+=20)await DB.batch(statements.slice(i,i+20));
}
