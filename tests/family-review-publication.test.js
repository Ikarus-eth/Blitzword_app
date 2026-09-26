const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {parseHTML}=require('linkedom');
const {IDBFactory}=require('fake-indexeddb');
const root=path.join(__dirname,'..'),dir=path.join(root,'assets/family-review');
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json')));
const source=fs.readFileSync(path.join(dir,'image-library.js'),'utf8');
const bytes=fs.readFileSync(path.join(dir,'images/moss-golem-a.webp'));
const hash=crypto.createHash('sha256').update(bytes).digest('hex');
const record=()=>({id:hash,name:'moss-golem-a.webp',type:'image/webp',size:bytes.length,blob:new Blob([bytes],{type:'image/webp'}),slot:'moss-golem/a'});
const fixture=()=>{const c=structuredClone(catalog);c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a').originalSha256=hash;return c;};
async function seed(indexedDB,records){
 const db=await new Promise((resolve,reject)=>{const q=indexedDB.open('blitzword-family-art-images-v1',1);q.onupgradeneeded=()=>q.result.createObjectStore('images',{keyPath:'id'}).createIndex('slot','slot',{unique:true});q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});
 await new Promise((resolve,reject)=>{const tx=db.transaction('images','readwrite');for(const r of records)tx.objectStore('images').put(r);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();
}
async function harness(records=[],c=fixture()){
 const {document}=parseHTML(fs.readFileSync(path.join(dir,'index.html'),'utf8'));
 const indexedDB=new IDBFactory();await seed(indexedDB,records);
 let downloaded,restored,cleared=0;const urls=new Map();
 const create=document.createElement.bind(document);document.createElement=tag=>{const el=create(tag);if(tag==='a')el.click=()=>{downloaded=urls.get(el.href);};return el;};
 const context={window:{},document,indexedDB,Blob,TextEncoder,TextDecoder,DataView,Uint8Array,crypto:crypto.webcrypto,
  navigator:{},confirm:()=>true,Image:class {naturalWidth=100;naturalHeight=100;async decode(){}},
  URL:{createObjectURL:blob=>{const id='blob:test-'+urls.size;urls.set(id,blob);return id;},revokeObjectURL:()=>{}},
  setTimeout:(fn,ms)=>ms>=60000?0:setTimeout(fn,ms)};
 vm.createContext(context);vm.runInContext(source,context);
 const review={version:2,names:['Artus','Juna','Johanna','Ikarus'],rounds:{thornling:{comment:'Keep these ratings and notes.',ratings:{current:[1,2,3,4],a:[null,3,null,null],b:[null,null,null,null],c:[null,null,null,null],d:[null,null,null,null],e:[null,null,null,null]}}}};
 await context.window.BlitzImageLibrary.start({catalog:c,changed:()=>{},getReview:()=>review,validateReview:x=>x,restoreReview:x=>{restored=x;},clearRatings:()=>{cleared++;}});
 async function restore(blob){document.querySelector('#backup-file').onchange({target:{files:[{name:'review.zip',size:blob.size,slice:(...args)=>blob.slice(...args)}],value:''}});for(let i=0;i<500&&document.querySelector('#add-images').disabled;i++)await new Promise(r=>setTimeout(r,2));return document.querySelector('#import-status').textContent;}
 return {document,c,review,restore,get restored(){return restored;},get cleared(){return cleared;},async backup(){await document.querySelector('#backup-images').onclick();assert.ok(downloaded);return downloaded;}};
}
test('all 26 published rounds contain a current design and five available alternatives',()=>{
 assert.equal(catalog.entities.length,26);assert.deepEqual(catalog.reviewers,['Artus','Juna','Johanna','Ikarus']);
 for(const e of catalog.entities){assert.deepEqual(e.options.map(o=>o.id),['current','a','b','c','d','e']);for(const o of e.options){assert.ok(o.src);assert.ok(fs.existsSync(path.resolve(dir,o.src)),o.src);assert.match(o.originalSha256,/^[a-f0-9]{64}$/);}}
 const publication=JSON.parse(fs.readFileSync(path.join(dir,'publication.json')));assert.equal(publication.assets.filter(a=>a.origin==='recovered').length,119);assert.equal(publication.assets.filter(a=>a.origin==='generated-2026-09-26').length,6);
 for(const a of publication.assets)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,a.publishedFile))).digest('hex'),a.publishedSha256);
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'missing-images.json'))).missingAlternatives,0);
});
test('a published copy of an imported original keeps its slot without clearing ratings',async()=>{
 const h=await harness([record()]);const option=h.c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a');
 assert.equal(option.src,'images/moss-golem-a.webp');assert.equal(option.imageHash,hash);assert.equal(option.localImage,undefined);assert.equal(h.cleared,0);
});
test('a different local assignment keeps the original reviewed image after publication',async()=>{
 const c=fixture();c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a').originalSha256='f'.repeat(64);
 const h=await harness([record()],c);const option=h.c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a');
 assert.match(option.src,/^blob:/);assert.equal(option.imageHash,hash);assert.equal(option.localOverride,true);assert.equal(h.cleared,0);
});
test('an old full backup restores published originals and feedback into a fresh library',async()=>{
 const oldCatalog=fixture();oldCatalog.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a').src=null;
 const old=await harness([record()],oldCatalog),backup=await old.backup(),fresh=await harness();
 assert.equal(await fresh.restore(backup),'Restored 1 images and review feedback.');assert.deepEqual(JSON.parse(JSON.stringify(fresh.restored)),old.review);assert.equal(fresh.cleared,0);
 assert.equal(fresh.c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a').src,'images/moss-golem-a.webp');
});
test('backup restore preserves a different rated local version instead of attaching feedback to published art',async()=>{
 const old=await harness([record()]),backup=await old.backup(),c=fixture();c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a').originalSha256='f'.repeat(64);
 const fresh=await harness([],c);assert.equal(await fresh.restore(backup),'Restored 1 images and review feedback.');assert.equal(fresh.c.entities.find(e=>e.id==='moss-golem').options.find(o=>o.id==='a').localOverride,true);assert.deepEqual(JSON.parse(JSON.stringify(fresh.restored)),old.review);
});
test('backups cannot replace the approved current-design slot',async()=>{
 const bad=record();bad.slot='moss-golem/current';const old=await harness([bad]),backup=await old.backup(),fresh=await harness();
 assert.match(await fresh.restore(backup),/Invalid or repeated image slot/);assert.equal(fresh.restored,undefined);assert.equal(fresh.cleared,0);
});
