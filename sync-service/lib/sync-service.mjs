export const GAME_ORIGIN='https://ikarus-eth.github.io';
export const MAX_BYTES=1800000;
const validToken=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const hash=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
async function readJSON(request){
  if(Number(request.headers.get('content-length'))>MAX_BYTES)throw new Error('size');
  if(!request.body)throw new Error('body');
  const reader=request.body.getReader(),parts=[];let bytes=0;
  for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>MAX_BYTES){await reader.cancel();throw new Error('size');}parts.push(value);}
  const joined=new Uint8Array(bytes);let offset=0;for(const p of parts){joined.set(p,offset);offset+=p.length;}
  return JSON.parse(new TextDecoder().decode(joined));
}
export async function handle(request,{DB,ADMIN_KEY},now=Date.now()){
  const origin=request.headers.get('origin'),path=new URL(request.url).pathname;
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
  if(origin===GAME_ORIGIN){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, DELETE, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type, Authorization';headers['Access-Control-Max-Age']='600';}
  const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(origin&&origin!==GAME_ORIGIN)return reply({error:'Origin not allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(path==='/api/health'&&request.method==='GET')return reply({service:'BlitzWord progress',version:1});
  const bearer=request.headers.get('authorization')?.replace(/^Bearer /,'');
  try{
    if(path==='/api/admin/pair'&&request.method==='POST'){
      if(!validToken(ADMIN_KEY)||!validToken(bearer)||await hash(bearer)!==await hash(ADMIN_KEY))return reply({error:'Unauthorized'},401);
      const code=random(),id=crypto.randomUUID();
      await DB.prepare('INSERT INTO devices (id, pair_hash, pair_expires) VALUES (?, ?, ?)').bind(id,await hash(code),now+48*60*60*1000).run();
      return reply({deviceId:id,code,expiresAt:new Date(now+48*60*60*1000).toISOString()},201);
    }
    if(path==='/api/pair'&&request.method==='POST'){
      const b=await readJSON(request);
      if(!validToken(b.code)||!validToken(b.token))return reply({error:'Invalid pairing link'},400);
      const codeHash=await hash(b.code),tokenHash=await hash(b.token);
      // Repeating the same request after a lost response is safe; another device cannot reuse it.
      const row=await DB.prepare('UPDATE devices SET token_hash = ? WHERE pair_hash = ? AND pair_expires > ? AND revoked = 0 AND (token_hash IS NULL OR token_hash = ?) RETURNING id').bind(tokenHash,codeHash,now,tokenHash).first();
      return row?reply({deviceId:row.id}):reply({error:'Pairing link expired or already used'},401);
    }
    const match=path.match(/^\/api\/devices\/([0-9a-f-]{36})(\/snapshot)?$/);
    if(!match||!['POST','DELETE'].includes(request.method))return reply({error:'Not found'},404);
    if(!validToken(bearer))return reply({error:'Unauthorized'},401);
    const tokenHash=await hash(bearer),id=match[1];
    const device=await DB.prepare('SELECT id, sequence FROM devices WHERE id = ? AND token_hash = ? AND revoked = 0').bind(id,tokenHash).first();
    if(!device)return reply({error:'Unauthorized'},401);
    if(request.method==='DELETE'&&!match[2]){
      await DB.prepare('UPDATE devices SET snapshot = NULL, summary = NULL, received_at = NULL, token_hash = NULL, revoked = 1 WHERE id = ? AND token_hash = ?').bind(id,tokenHash).run();
      return reply({deleted:true});
    }
    if(request.method!=='POST'||!match[2])return reply({error:'Not found'},404);
    const b=await readJSON(request);
    if(!Number.isSafeInteger(b.sequence)||b.sequence<1||b.format!=='blitzword-progress-v1'||!b.progress||typeof b.progress!=='object'||Array.isArray(b.progress)||typeof b.build!=='string'||b.build.length>100||!Number.isFinite(Date.parse(b.capturedAt)))return reply({error:'Invalid snapshot'},400);
    // Only the strictly newer local generation can replace the latest snapshot, regardless of arrival order.
    const receivedAt=new Date(now).toISOString();
    await DB.prepare('UPDATE devices SET sequence = ?, received_at = ?, snapshot = ?, summary = ? WHERE id = ? AND token_hash = ? AND revoked = 0 AND sequence < ?').bind(b.sequence,receivedAt,JSON.stringify(b),JSON.stringify(b.summary||{}),id,tokenHash,b.sequence).run();
    const ack=await DB.prepare('SELECT sequence, received_at FROM devices WHERE id = ? AND token_hash = ? AND revoked = 0').bind(id,tokenHash).first();
    return ack?reply({sequence:ack.sequence,receivedAt:ack.received_at}):reply({error:'Unauthorized'},401);
  }catch(e){
    if(e instanceof SyntaxError||e.message==='body')return reply({error:'Invalid JSON'},400);
    if(e.message==='size')return reply({error:'Snapshot too large'},413);
    // Never log request headers, pairing codes, tokens or learner payloads.
    return reply({error:'Sync temporarily unavailable'},503);
  }
}
