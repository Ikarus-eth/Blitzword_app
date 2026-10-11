(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();else root.BlitzProgressSync=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const KEY='blitzword_progress_sync_v1',ENDPOINT='https://blitzword-progress.ikarus-janzenoa.chatgpt.site';
  const tokenOK=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
  function pairingCode(value){
    const text=String(value||'').trim();if(tokenOK(text))return text;
    try{const url=new URL(text);if(url.origin!=='https://ikarus-eth.github.io'||url.pathname!=='/Blitzword_app/')return null;const code=new URLSearchParams(url.hash.slice(1)).get('sync');return tokenOK(code)?code:null;}catch{return null;}
  }
  function project(s){
    // Deliberate allowlist: no name, age, voice choice, device fingerprint or custom dragon name.
    const p={};for(const key of ['assessment','learning','campaign','timing','archive','sessions','session','story','expedition'])if(s[key])p[key]=s[key];
    p.dragon={xp:s.dragon?.xp||0,stage:s.dragon?.stage||0};
    p.math={best:s.math?.best||null,records:s.math?.records||[]};
    p.rewards={xpDays:s.rewards?.xpDays||{},speedHistory:s.rewards?.speedHistory||{}};
    return JSON.parse(JSON.stringify(p));
  }
  function create({storage,readState,fetch:send,crypto:crypt,now=Date.now,build='',onStatus=()=>{},locks=null,pack=x=>x,summary=()=>({}),reports=()=>({}),history=null}){
    let busy=false,nextAttempt=0,failures=0,pendingEvents=0,historyError='';
    const read=()=>JSON.parse(storage.getItem(KEY)||'null')||{};
    const write=m=>storage.setItem(KEY,JSON.stringify(m));
    const token=()=>Array.from(crypt.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const digest=async value=>Array.from(new Uint8Array(await crypt.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');
    function status(){try{const m=read();return {paired:!!m.deviceId,paused:!!m.paused,pendingPair:!!m.pairCode,lastSyncedAt:m.lastSyncedAt||null,message:m.message||(m.pairCode?'Connecting this game…':''),deleting:!!m.deleting,pendingEvents,historyError,historyVersion:m.historyVersion||1,historySince:m.historySince||null,archivedAnswers:m.archivedAnswers||0};}catch{return {paired:false,message:'Sharing settings cannot be read. Your game save is unchanged.'};}}
    function notify(){onStatus(status());}
    function change(update){const m=read();write({...m,...update});notify();}
    async function request(path,body,auth,method='POST'){
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
      try{
        const r=await send(ENDPOINT+path,{method,headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+auth}:{})},body:body?JSON.stringify(body):undefined,signal:controller.signal,credentials:'omit',cache:'no-store',redirect:'error'});
        if(!r.ok){const e=new Error(r.status===401?'The connection needs a new pairing link.':r.status===413?'This progress copy is too large to share.':'Waiting for a connection; progress is safe on this iPad.');e.status=r.status;throw e;}
        return await r.json();
      }finally{clearTimeout(timer);}
    }
    async function capture(s=readState()){
      try{const m=read();if(!history||!m.deviceId||m.deleting||m.detached||!s)return;await history.capture(m.deviceId,s,build);pendingEvents=(await history.pending(m.deviceId,Infinity)).length;historyError='';}catch{historyError='Detailed history could not be stored. Keep this game open and retry syncing.';}notify();
    }
    async function sendHistory(m){
      const current=read();if(!history||current.paused||current.deleting||current.deviceId!==m.deviceId)return;const rows=await history.pending(m.deviceId,100);pendingEvents=(await history.pending(m.deviceId,Infinity)).length;if(!rows.length)return;
      const events=rows.map(({eventKey,kind,at,build,data})=>({key:eventKey,kind,at,build,data}));
      const ack=await request('/api/devices/'+m.deviceId+'/events',{events},m.token);
      if(!Array.isArray(ack.accepted)||events.some(e=>!ack.accepted.includes(e.key)))throw new Error('History upload was not fully confirmed.');
      await history.acknowledge(rows.map(e=>e.key));pendingEvents=(await history.pending(m.deviceId,Infinity)).length;
    }
    async function work(force=false){
      if(busy||!force&&now()<nextAttempt)return;busy=true;
      try{
        let m=read();if(m.paused&&!m.deleting||!m.deviceId&&!m.pairCode)return;
        if(m.pairCode){
          const paired=await request('/api/pair',{code:m.pairCode,token:m.token});
          if(read().token!==m.token)return;
          if(!/^[0-9a-f-]{36}$/.test(paired.deviceId))throw new Error('The progress service returned an invalid pairing response.');
          write({...m,deviceId:paired.deviceId,pairCode:null,message:''});m=read();
        }
        if(m.deleting){
          try{await request('/api/devices/'+m.deviceId,null,m.token,'DELETE');}catch(e){if(e.status!==401)throw e;}
          if(history)await history.clear(m.deviceId);if(read().deviceId===m.deviceId)storage.removeItem(KEY);notify();return;
        }
        const s=readState();if(!s)return;
        await capture(s);const progress=project(s),fingerprint=await digest(JSON.stringify(progress)+'history-v2');m=read();
        if(m.paused||m.deleting||!m.deviceId)return;
        if(fingerprint===m.ackDigest){await sendHistory(m);notify();return;}
        const sequence=(m.sequence||0)+1,payload={format:'blitzword-progress-v1',sequence,build,capturedAt:new Date(now()).toISOString(),progress:pack(progress),summary:summary(s),historyVersion:2,reports:reports(s)};
        // Durable intent before sending; after a crash/reload the latest local save is the retry queue.
        write({...m,sequence,message:'Sharing the latest progress…'});notify();
        const ack=await request('/api/devices/'+m.deviceId+'/snapshot',payload,m.token);
        if(!Number.isSafeInteger(ack.sequence)||ack.sequence<sequence||!Number.isFinite(Date.parse(ack.receivedAt)))throw new Error('The progress service has not confirmed this update.');
        const latest=read();if(latest.deviceId!==m.deviceId||latest.sequence!==sequence)return;
        write({...latest,sequence:Math.max(sequence,ack.sequence),ackDigest:ack.sequence===sequence?fingerprint:null,lastSyncedAt:ack.receivedAt,historyVersion:ack.historyVersion||1,historySince:ack.historySince||null,archivedAnswers:ack.archivedAnswers||0,message:latest.paused?'Sharing paused.':''});
        await sendHistory(latest);failures=0;nextAttempt=now()+30000;notify();
      }catch(e){
        failures++;nextAttempt=now()+Math.min(300000,10000*2**Math.min(failures,5));
        try{change({message:e.message||'Sharing will retry. Your progress stays safe on this iPad.',...(e.status===401?{paused:true}:{})});}catch{onStatus({message:'Sharing could not save its settings. Your game save is unchanged.'});}
      }finally{busy=false;}
    }
    function flush(force=false){return locks?.request?locks.request(KEY,{ifAvailable:true},lock=>lock?work(force):undefined):work(force);}
    function pair(code){
      if(!tokenOK(code)){change({message:'This pairing link is invalid. Request a new personal link.'});return false;}
      const m=read();if(m.deviceId||m.deleting){change({message:'This iPad is already paired. Delete the shared copy before pairing it again.'});return false;}
      if(m.pairCode!==code)write({pairCode:code,token:token(),sequence:0,paused:false});
      else change({paused:false});notify();void flush(true);return true;
    }
    function pause(paused){change({paused,detached:false,message:paused?'Sharing paused.':''});if(!paused)void flush(true);}
    function remove(){const m=read();if(!m.deviceId){storage.removeItem(KEY);notify();return;}change({paused:true,deleting:true,message:'Deleting the shared copy…'});void flush(true);}
    function detach(){const m=read();if(m.deviceId)change({paused:true,detached:true,message:'Sharing paused after the local profile was reset. The previously shared copy is still available.'});}
    return {status,flush,pair,pause,remove,detach,capture};
  }
  return {KEY,ENDPOINT,project,pairingCode,create};
});
