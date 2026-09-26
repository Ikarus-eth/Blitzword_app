/* Original image blobs live separately from ratings. Every file is its own durable transaction. */
window.BlitzImageLibrary = (() => {
'use strict';
const DB = 'blitzword-family-art-images-v1', MAX = 30 * 1024 * 1024;
const TYPES = new Set(['image/png','image/jpeg','image/webp','image/gif']);
const $ = s => document.querySelector(s);
const pause = () => new Promise(resolve => setTimeout(resolve, 0));
const keyFor = (entity, option) => entity + '/' + option;
function download(blob, name) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('images', {keyPath:'id'}).createIndex('slot', 'slot', {unique:true});
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(Error('Close other review tabs, then reload to open image storage.'));
    req.onsuccess = () => { req.result.onversionchange = () => req.result.close(); resolve(req.result); };
  });
}
function readAll(db) {
  return new Promise((resolve, reject) => {
    const req = db.transaction('images').objectStore('images').getAll();
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
}
function writeImage(db, record, slot, move = false, strict = false) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images','readwrite'), store = tx.objectStore('images');
    let outcome, failure;
    tx.oncomplete = () => resolve(outcome);
    tx.onabort = () => reject(failure || tx.error || Error('Image was not saved.'));
    tx.onerror = () => {};
    const existing = store.get(record.id);
    existing.onsuccess = () => {
      const old = existing.result;
      if (old && !move) { if(strict && old.slot !== slot) { failure=Error('An image assignment changed in another tab. Feedback was not replaced.'); tx.abort(); } else outcome = {duplicate:true}; return; }
      const next = old ? {...old} : {...record};
      const put = () => { try { outcome = {duplicate:false, oldSlot:old?.slot}; store.put(next); } catch(error) { failure=error; tx.abort(); } };
      if (!slot) { delete next.slot; put(); return; }
      const taken = store.index('slot').get(slot);
      taken.onsuccess = () => {
        if (taken.result && taken.result.id !== record.id) {
          if (move || strict) { failure = Error('That slot was filled in another tab. Choose another letter.'); tx.abort(); }
          else { delete next.slot; put(); }
        } else { next.slot = slot; put(); }
      };
    };
  });
}
async function identify(blob, name) {
  if (!blob.size || blob.size > MAX) throw Error('Use images smaller than 30 MB.');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const sig = (...values) => values.every((v,i) => bytes[i] === v);
  const type = sig(137,80,78,71,13,10,26,10) ? 'image/png' : sig(255,216,255) ? 'image/jpeg' : sig(71,73,70,56) ? 'image/gif' : sig(82,73,70,70) && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP' ? 'image/webp' : '';
  if (!TYPES.has(type)) throw Error('Use PNG, JPG, WebP or GIF images.');
  const original = blob.slice(0, blob.size, type);
  const url = URL.createObjectURL(original), img = new Image();
  try {
    img.src = url; await img.decode();
    if (img.naturalWidth * img.naturalHeight > 32000000) throw Error('Image is too large; use at most 32 megapixels.');
  } finally { URL.revokeObjectURL(url); }
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return {id:Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join(''), name:name.slice(0,300), blob:original, size:blob.size, type, addedAt:new Date().toISOString()};
}
// Stored ZIP entries keep the originals byte-for-byte. Blob slices avoid loading a whole backup into RAM.
const crcTable = Array.from({length:256}, (_, n) => { for(let k=0;k<8;k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
async function crc32(blob) {
  let crc = 0xffffffff;
  const reader = blob.stream().getReader();
  while (true) { const {value,done} = await reader.read(); if(done) break; for(const b of value) crc = crcTable[(crc ^ b) & 255] ^ (crc >>> 8); }
  return (crc ^ 0xffffffff) >>> 0;
}
function header(size, fields) { const bytes = new Uint8Array(size), v = new DataView(bytes.buffer); for(const [offset,value,width] of fields) width === 2 ? v.setUint16(offset,value,true) : v.setUint32(offset,value,true); return bytes; }
async function makeZip(entries, progress) {
  const parts = [], central = []; let offset = 0, done = 0;
  for(const entry of entries) {
    const name = new TextEncoder().encode(entry.name), size = entry.blob.size, crc = await crc32(entry.blob);
    if(offset + size > 0xffffffff) throw Error('Backup exceeds the 4 GB archive limit.');
    const local = header(30, [[0,0x04034b50],[4,20,2],[6,0x800,2],[14,crc],[18,size],[22,size],[26,name.length,2]]);
    const directory = header(46, [[0,0x02014b50],[4,20,2],[6,20,2],[8,0x800,2],[16,crc],[20,size],[24,size],[28,name.length,2],[42,offset]]);
    parts.push(local,name,entry.blob); central.push(directory,name); offset += 30 + name.length + size;
    progress(++done,entries.length); await pause();
  }
  const length = central.reduce((n,b) => n + b.byteLength,0);
  return new Blob([...parts,...central,header(22, [[0,0x06054b50],[8,entries.length,2],[10,entries.length,2],[12,length],[16,offset]])], {type:'application/zip'});
}
async function readZip(blob) {
  const tailStart = Math.max(0,blob.size - 65557), tail = new DataView(await blob.slice(tailStart).arrayBuffer());
  let end = tail.byteLength - 22;
  for(;end >= 0;end--) if(tail.getUint32(end,true) === 0x06054b50 && end + 22 + tail.getUint16(end+20,true) === tail.byteLength) break;
  if(end < 0) throw Error('This is not a valid full backup ZIP.');
  const count = tail.getUint16(end+10,true), size = tail.getUint32(end+12,true), offset = tail.getUint32(end+16,true);
  if(count > 2000 || size > 2000000 || offset + size > tailStart + end) throw Error('Unsupported backup size.');
  const dir = new DataView(await blob.slice(offset,offset+size).arrayBuffer()), entries = new Map();
  let p = 0;
  for(let i=0;i<count;i++) {
    if(p+46 > dir.byteLength || dir.getUint32(p,true) !== 0x02014b50) throw Error('Damaged backup directory.');
    const flags = dir.getUint16(p+8,true), method = dir.getUint16(p+10,true), crc = dir.getUint32(p+16,true), packed = dir.getUint32(p+20,true), unpacked = dir.getUint32(p+24,true), n = dir.getUint16(p+28,true), extra = dir.getUint16(p+30,true), comment = dir.getUint16(p+32,true), start = dir.getUint32(p+42,true);
    if(method !== 0 || flags & 1 || packed !== unpacked || unpacked > MAX || p+46+n+extra+comment > dir.byteLength) throw Error('Use a full backup created by this dashboard, without recompressing it.');
    const name = new TextDecoder().decode(new Uint8Array(dir.buffer,p+46,n));
    if(entries.has(name) || start+30 > offset) throw Error('Damaged backup entry.');
    const local = new DataView(await blob.slice(start,start+30).arrayBuffer());
    if(local.getUint32(0,true) !== 0x04034b50) throw Error('Damaged image header.');
    const dataStart = start+30+local.getUint16(26,true)+local.getUint16(28,true);
    if(dataStart+packed > offset) throw Error('Incomplete backup image.');
    entries.set(name,{blob:blob.slice(dataStart,dataStart+packed),crc}); p += 46+n+extra+comment;
  }
  return entries;
}
async function start({catalog,changed,getReview,validateReview,restoreReview,clearRatings}) {
  let db, records = [], busy = false, stop = false, selectedSlot = null;
  const urls = new Map(), original = new Map(catalog.entities.flatMap(e => e.options.map(o => [keyFor(e.id,o.id),{src:o.src,hash:o.originalSha256}])));
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(DB) : null;
  const optionAt = slot => { const [eid,oid] = slot.split('/'); return catalog.entities.find(e => e.id === eid)?.options.find(o => o.id === oid); };
  const emptySlots = () => catalog.entities.flatMap(e => e.options.filter(o => !o.src && o.id !== 'current').map(o => ({slot:keyFor(e.id,o.id),label:e.name+' · '+o.id.toUpperCase()})));
  function message(text,error=false) { $('#import-status').textContent=text; $('#import-status').classList.toggle('error',error); }
  function setBusy(value) {
    busy=value; stop=false;
    for(const id of ['add-images','add-folder','backup-images','restore-images']) $('#'+id).disabled=value || !db;
    $('#stop-import').hidden=!value; $('#import-progress').hidden=!value;
    $('#library-items').querySelectorAll('button,select').forEach(el => { el.disabled=value; });
  }
  function progress(done,total) { $('#import-progress').max=total; $('#import-progress').value=done; }
  function urlFor(r) { if(!urls.has(r.id)) urls.set(r.id,URL.createObjectURL(r.blob)); return urls.get(r.id); }
  async function refresh() {
    records=await readAll(db);
    for(const e of catalog.entities) for(const o of e.options) { const published=original.get(keyFor(e.id,o.id)); o.src=published.src; o.imageHash=published.hash; delete o.localImage; delete o.localOverride; }
    // Publishing a recovered original must not change the identity of an already rated slot.
    // A different local assignment remains visible with its existing feedback.
    for(const r of records) if(r.slot) { const o=optionAt(r.slot), published=original.get(r.slot); if(o && o.id!=='current' && (!published.src || published.hash!==r.id)) { o.src=urlFor(r); o.imageHash=r.id; o.localImage=true; o.localOverride=Boolean(published.src); } }
    changed(); renderLibrary();
  }
  function renderLibrary() {
    const waiting=records.filter(r => !r.slot).length;
    const slots=emptySlots();
    $('#library-summary').textContent=`Your imported images · ${records.length} saved · ${waiting} ${slots.length?'to assign':'extra'}`;
    const publishedCopies=records.filter(r=>r.slot && original.get(r.slot)?.hash===r.id).length;
    $('#library-guidance').textContent=slots.length?'Choose an empty review slot for each extra image. Exact enemy/hero and letter filenames are placed automatically.':`${publishedCopies} saved originals are now included in the published gallery. Extra candidates remain below and in your full backup.`;
    $('#library-items').replaceChildren();
    if(!$('#library').open) return;
    for(const record of records.filter(r=>!r.slot || original.get(r.slot)?.hash!==r.id).sort((a,b)=>Number(Boolean(a.slot))-Number(Boolean(b.slot)))) {
      const row=document.createElement('article'); row.className='library-item'; row.dataset.imageId=record.id;
      const img=document.createElement('img'); img.src=urlFor(record); img.alt=record.name; img.loading='lazy';
      const name=document.createElement('p'); name.textContent=record.name;
      const current=document.createElement('p'); const [eid,oid]=(record.slot||'').split('/');
      const published=original.get(record.slot);
      current.textContent=record.slot ? (catalog.entities.find(e=>e.id===eid)?.name || eid)+' · '+oid.toUpperCase()+(published?.hash===record.id?' · now in the published gallery':'') : 'Saved extra · not assigned to a review slot';
      const select=document.createElement('select'); select.setAttribute('aria-label','Place '+record.name);
      select.add(new Option(record.slot?'Move to another empty slot…':'Choose enemy or hero and letter…',''));
      for(const item of emptySlots()) select.add(new Option(item.label,item.slot));
      const assign=document.createElement('button'); assign.type='button'; assign.textContent=record.slot?'Move image':'Place image';
      assign.onclick=async()=>{
        if(!select.value || busy) return;
        if(record.slot && !confirm('Move this image? Ratings for its old slot will be cleared. The original image stays saved.')) return;
        setBusy(true);
        try { const result=await writeImage(db,record,select.value,true); if(result.oldSlot) clearRatings(result.oldSlot); await refresh(); channel?.postMessage('changed'); message('Image placed and saved.'); }
        catch(error) { message(error.message,true); }
        finally { setBusy(false); }
      };
      row.append(img,name,current); if(slots.length)row.append(select,assign); $('#library-items').append(row);
    }
  }
  function autoSlot(name) {
    const stem=name.split('/').pop().replace(/\.[^.]+$/,'').toLowerCase().replace(/[ _]+/g,'-');
    return emptySlots().find(item=>item.slot.replace('/','-')===stem)?.slot;
  }
  async function importFiles(files, target) {
    if(busy || !db) return;
    const candidates=[...files].filter(f=>/\.(png|jpe?g|webp|gif)$/i.test(f.name)||TYPES.has(f.type));
    if(!candidates.length) { message('Choose PNG, JPG, WebP or GIF images.',true); return; }
    setBusy(true); navigator.storage?.persist?.().catch(()=>{});
    let added=0, duplicates=0, failed=0, done=0, lastError='';
    const failures=[];
    try {
      for(const file of candidates) {
        if(stop) break;
        message(`Saving image ${done+1} of ${candidates.length}: ${file.name}`); progress(done,candidates.length);
        try {
          const record=await identify(file,file.name), slot=(done===0&&target) || autoSlot(file.name);
          const result=await writeImage(db,record,slot);
          if(result.duplicate) duplicates++; else { added++; if(slot) { const o=optionAt(slot); if(o) o.src='pending'; } }
        } catch(error) {
          failed++; lastError=error.name==='QuotaExceededError'?'Browser storage is full. Download a backup and free space before resuming.':error.message;
          failures.push({file:file.name,error:lastError});
          if(error.name==='QuotaExceededError') stop=true;
        }
        done++; progress(done,candidates.length); await pause();
      }
      await refresh(); channel?.postMessage('changed');
      message(`${added} saved · ${duplicates} duplicates skipped · ${failed} failed${done<candidates.length?` · stopped after ${done} of ${candidates.length}; choose the files again to resume`:''}.${failed?' '+lastError:''}`,failed>0);
      if(failures.length) { const b=document.createElement('button'); b.textContent='Download import errors'; b.onclick=()=>download(new Blob([JSON.stringify(failures,null,2)],{type:'application/json'}),'blitzword-import-errors.json'); $('#import-status').append(' ',b); }
      if(records.some(r=>!r.slot)) $('#library').open=true;
    } catch(error) { message(error.message,true); }
    finally { setBusy(false); }
  }
  async function backup() {
    if(busy || !db) return; setBusy(true); $('#stop-import').hidden=true;
    try {
      const saved=await readAll(db), review=getReview();
      if(saved.length>1999) throw Error('This backup supports up to 1,999 imported images.');
      const manifest={format:'blitzword-family-images',version:1,exportedAt:new Date().toISOString(),review,images:saved.map(({blob,...r})=>({...r,path:'images/'+r.id+'.'+({ 'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'}[r.type])}))};
      const entries=[{name:'review.json',blob:new Blob([JSON.stringify(manifest,null,2)],{type:'application/json'})},...saved.map((r,i)=>({name:manifest.images[i].path,blob:r.blob}))];
      const zip=await makeZip(entries,(done,total)=>{message(`Preparing backup ${done} of ${total}…`);progress(done,total);});
      download(zip,'blitzword-family-review-'+new Date().toISOString().slice(0,10)+'.zip');
      message(`Backup download started: ${saved.length} original images plus all ratings and notes. Keep this ZIP safe.`);
    } catch(error) { message('Backup failed: '+error.message,true); }
    finally { setBusy(false); }
  }
  async function restore(file) {
    if(!file || busy || !db) return;
    setBusy(true); let restored=0;
    try {
      if(/\.json$/i.test(file.name)) {
        if(file.size>5*1024*1024) throw Error('Review JSON is too large. Use the full backup ZIP for images.');
        const review=validateReview(JSON.parse(await file.text()));
        if(confirm('Restore these ratings, reviewer names and comments? This replaces feedback on this device; images stay saved.')) { restoreReview(review); message('Review feedback restored.'); }
        return;
      }
      message('Reading backup…');
      const entries=await readZip(file), metadata=entries.get('review.json');
      if(!metadata || metadata.blob.size>5*1024*1024 || await crc32(metadata.blob)!==metadata.crc) throw Error('Missing or damaged backup manifest.');
      const manifest=JSON.parse(await metadata.blob.text());
      if(manifest.format!=='blitzword-family-images'||manifest.version!==1||!Array.isArray(manifest.images)||manifest.images.length>1999) throw Error('This is not a BlitzWord full backup.');
      const review=validateReview(manifest.review), ids=new Set(), slots=new Set();
      for(const r of manifest.images) {
        if(!/^[a-f0-9]{64}$/.test(r.id)||ids.has(r.id)||typeof r.name!=='string'||!TYPES.has(r.type)||!entries.has(r.path)||entries.get(r.path).blob.size!==r.size) throw Error('Invalid image entry in backup.');
        if(r.slot && (!optionAt(r.slot)||optionAt(r.slot).id==='current'||slots.has(r.slot))) throw Error('Invalid or repeated image slot in backup.');
        ids.add(r.id); if(r.slot) slots.add(r.slot);
      }
      const useFeedback=confirm(`Restore ${manifest.images.length} images and replace ratings, names and comments with this backup? Cancel keeps everything unchanged.`);
      if(!useFeedback) return;
      // Restore requires an unambiguous mapping; never attach old scores to a different local image.
      const existing=await readAll(db);
      if(existing.some(r=>r.slot && manifest.images.some(m=>m.slot===r.slot && m.id!==r.id))) throw Error('A backup slot already contains a different image. Restore in a fresh browser profile, or move that image to another slot first. Nothing was changed.');
      const manifestById=new Map(manifest.images.map(r=>[r.id,r]));
      if(existing.some(r=>manifestById.has(r.id) && r.slot!==manifestById.get(r.id).slot)) throw Error('An existing image has a different assignment. Restore in a fresh browser profile to preserve both versions. Nothing was changed.');
      for(const r of manifest.images) {
        if(stop) break;
        message(`Restoring ${restored+1} of ${manifest.images.length}…`);
        const entry=entries.get(r.path);
        if(await crc32(entry.blob)!==entry.crc) throw Error('Damaged image: '+r.name);
        const record=await identify(entry.blob,r.name);
        if(record.id!==r.id) throw Error('Image checksum mismatch: '+r.name);
        await writeImage(db,record,r.slot,false,true); restored++; progress(restored,manifest.images.length); await pause();
      }
      if(restored===manifest.images.length) { restoreReview(review); message(`Restored ${restored} images and review feedback.`); }
      else message(`Stopped after ${restored} images. Feedback was not replaced. Select this backup again to resume.`);
    } catch(error) { message(`Restore stopped. ${restored} images processed; earlier saved images are safe. ${error.message}`,true); }
    finally { await refresh().catch(()=>{}); channel?.postMessage('changed'); setBusy(false); }
  }
  $('#add-images').onclick=()=>{selectedSlot=null;$('#image-files').multiple=true;$('#image-files').click();};
  $('#add-folder').onclick=()=>$('#folder-files').click();
  $('#image-files').onchange=e=>{const target=selectedSlot;selectedSlot=null;importFiles(e.target.files,target);e.target.value='';};
  $('#folder-files').onchange=e=>{importFiles(e.target.files);e.target.value='';};
  $('#stop-import').onclick=()=>{stop=true;message('Stopping after the current image is safely saved…');};
  $('#backup-images').onclick=backup; $('#restore-images').onclick=()=>$('#backup-file').click();
  $('#backup-file').onchange=e=>{restore(e.target.files[0]);e.target.value='';};
  $('#library').ontoggle=()=>renderLibrary();
  const drop=$('#image-drop');
  drop.onclick=()=>$('#add-images').click(); drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();drop.click();}};
  drop.ondragover=e=>{e.preventDefault();drop.classList.add('dragging');}; drop.ondragleave=()=>drop.classList.remove('dragging');
  drop.ondrop=e=>{e.preventDefault();drop.classList.remove('dragging');importFiles(e.dataTransfer.files);};
  setBusy(false);
  try { db=await openDB(); await refresh(); message('Ready. Add saved images or drop a batch here.'); }
  catch(error) { message('Image storage is unavailable. '+error.message+' Try a regular browser window.',true); }
  setBusy(false);
  channel && (channel.onmessage=()=>{if(!busy)refresh().catch(error=>message(error.message,true));});
  return {choose(slot){if(!db||busy){message('Wait for image storage to be ready.',true);return;}selectedSlot=slot;$('#image-files').multiple=false;$('#image-files').click();}};
}
return {start};
})();
