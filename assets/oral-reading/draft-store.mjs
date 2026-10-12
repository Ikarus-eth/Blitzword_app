// Local audio recovery only. Never uploaded to the progress database.
let connection;
function open(){return connection ||= new Promise((resolve,reject)=>{const r=indexedDB.open('blitzword_reading_drafts',1);r.onupgradeneeded=()=>r.result.createObjectStore('drafts');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function operation(mode,fn){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('drafts',mode),r=fn(tx.objectStore('drafts'));tx.oncomplete=()=>resolve(r.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
export const loadDraft=()=>operation('readonly',s=>s.get('current'));
export const saveDraft=draft=>operation('readwrite',s=>s.put(draft,'current'));
export const clearDraft=()=>operation('readwrite',s=>s.delete('current'));
