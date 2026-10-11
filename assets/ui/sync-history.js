(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BlitzSyncHistory=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function events(s,build){
    const groups=[['answer',s.campaign?.battleRecords],['assessment',s.assessment?.records],['teaching',s.learning?.teaching],['support',s.learning?.supportExposures],['session',s.sessions],['duel',s.math?.records]];
    return groups.flatMap(([kind,list])=>(list||[]).map(data=>({key:JSON.stringify([kind,data.id||'',data.at||data.startedAt||data.finishedAt||'']),kind,at:data.at||data.startedAt||data.finishedAt||null,build,data})));
  }
  function create(indexedDB, name='blitzword_sync_history_v1'){
    let connection,chain=Promise.resolve(),seen=new Set(),owner=null;
    function open(){return connection ||= new Promise((resolve,reject)=>{if(!indexedDB)return reject(new Error('Detailed history storage is unavailable.'));const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{r.result.createObjectStore('queue',{keyPath:'key'});r.result.createObjectStore('seen',{keyPath:'key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
    const request=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    const done=tx=>new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('History transaction interrupted'));});
    const serial=fn=>{const next=chain.catch(()=>{}).then(fn);chain=next;return next;};
    return {
      capture(device,s,build){const rows=JSON.parse(JSON.stringify(events(s,build)));return serial(async()=>{const db=await open();if(owner!==device){owner=device;seen=new Set();const tx=db.transaction('seen');for(const row of await request(tx.objectStore('seen').getAll()))if(row.device===device)seen.add(row.key);}
        const fresh=rows.map(e=>({...e,eventKey:e.key,key:device+':'+e.key,device})).filter(e=>!seen.has(e.key));if(!fresh.length)return;
        const tx=db.transaction(['queue','seen'],'readwrite'),finished=done(tx);for(const e of fresh){tx.objectStore('queue').put(e);tx.objectStore('seen').put({key:e.key,device});}await finished;for(const e of fresh)seen.add(e.key);
      });},
      pending(device,limit=100){return serial(async()=>{const db=await open(),tx=db.transaction('queue');const rows=await request(tx.objectStore('queue').getAll());return rows.filter(e=>e.device===device).slice(0,limit);});},
      acknowledge(keys){return serial(async()=>{const db=await open(),tx=db.transaction('queue','readwrite'),finished=done(tx);for(const key of keys)tx.objectStore('queue').delete(key);await finished;});},
      clear(device){return serial(async()=>{const db=await open(),tx=db.transaction(['queue','seen'],'readwrite'),finished=done(tx);for(const name of ['queue','seen']){const r=tx.objectStore(name).openCursor();r.onsuccess=()=>{const c=r.result;if(c){if(c.value.device===device)c.delete();c.continue();}};}await finished;seen=new Set();owner=null;});}
    };
  }
  return {events,create};
});
