/* Run with PLAYWRIGHT_MODULE pointing to an installed playwright package. Uses an isolated browser profile. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const os=require('node:os');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),output=process.env.REVIEW_TEST_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'blitzword-review-'));
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.join(root,relative);if(relative.endsWith('/'))file=path.join(file,'index.html');if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,bytes)=>{if(error)res.writeHead(404).end();else res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(bytes);});});
const tests=[],errors=[];let browser;
async function check(name,fn){await fn();tests.push(name);console.log('PASS '+name);}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port+'/assets/family-review/';
 browser=await chromium.launch({headless:true,args:['--disable-gpu'],executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1280,height:960},acceptDownloads:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('test-seeded')){localStorage.setItem('test-seeded','1');localStorage.setItem('blitzword-save-v1','learner-sentinel');localStorage.setItem('blitzword-thornling-family-review-v1',JSON.stringify({version:1,names:['Artus','Juna','Johanna','Ikarus'],active:0,ratings:{current:[5,4,3,2],a:[1,2,3,4],b:[null,null,null,null],c:[null,null,null,null],d:[null,null,null,null],e:[null,null,null,null]},comment:'Keep these existing notes.'}));}});
 await page.goto(url);await page.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Ready.'));
 const art=name=>fs.readFileSync(path.join(root,'assets/family-review/images',name));
 const a=art('thornling-a.webp'),b=art('thornling-b.webp'),c=art('thornling-c.webp');
 const payload=(name,buffer)=>({name,mimeType:'image/webp',buffer});
 const done=()=>page.waitForFunction(()=>!document.querySelector('#add-images').disabled);
 await check('Legacy ratings and notes survive initialization',async()=>{assert.match(await page.locator('#comment').inputValue(),/existing notes/);assert.equal(await page.locator('[data-design=current] .others b').allTextContents().then(x=>x.join(',')),'5,4,3,2');});
 await check('Batch import auto-matches exact filenames and skips duplicate content',async()=>{
  await page.locator('#image-files').setInputFiles([payload('moss-golem-a.webp',a),payload('ChatGPT downloaded image.webp',b),payload('duplicate.webp',a)]);await done();
  assert.match(await page.locator('#import-status').textContent(),/2 saved · 1 duplicates skipped · 0 failed/);
  assert.match(await page.locator('.availability').textContent(),/32 images available/);
  assert.match(await page.locator('#library-summary').textContent(),/2 saved · 1 to assign/);
 });
 await check('Unnamed image can be previewed, assigned and rated',async()=>{
  const row=page.locator('.library-item').filter({has:page.getByText('ChatGPT downloaded image.webp',{exact:true})});
  await row.locator('select').selectOption('moss-golem/b');await row.getByRole('button',{name:'Place image'}).click();await done();
  await page.locator('#jump').selectOption('moss-golem');await page.locator('[data-design=b] .rating[data-score="5"]').click();
  await page.locator('#comment').fill('B has our favourite face.');
  assert.match(await page.locator('#round-availability').textContent(),/3 of 6/);
 });
 await check('Images, assignments, ratings and notes survive reload',async()=>{
  await page.reload();await page.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Ready.'));
  assert.equal(await page.locator('[data-design=b] .rating[data-score="5"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#comment').inputValue(),'B has our favourite face.');
  assert.ok(await page.locator('[data-design=b] img').evaluate(img=>img.complete&&img.naturalWidth>0));
 });
 await check('Each missing slot supports direct file selection',async()=>{
  const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Add Moss Golem option C',exact:true}).click();
  await (await chooser).setFiles(payload('generic-third.webp',c));await done();assert.equal(await page.locator('[data-design=c] .rating').count(),5);
 });
 await check('Corrupt images report failure without losing successful imports',async()=>{
  await page.locator('#image-files').setInputFiles([{name:'broken.png',mimeType:'image/png',buffer:Buffer.from('not an image')}]);await done();assert.match(await page.locator('#import-status').textContent(),/1 failed/);assert.match(await page.locator('.availability').textContent(),/34 images available/);
 });
 let zipPath;
 await check('Full backup downloads all original images and feedback',async()=>{
  const event=page.waitForEvent('download');await page.getByRole('button',{name:'Download full backup'}).click();const file=await event;zipPath=path.join(output,'backup.zip');await file.saveAs(zipPath);await done();assert.ok(fs.statSync(zipPath).size>a.length+b.length+c.length);
 });
 await check('Full backup restores into a fresh browser with exact original bytes',async()=>{
  const clean=await browser.newContext({acceptDownloads:true});const other=await clean.newPage();other.on('pageerror',e=>errors.push(e.message));
  await other.goto(url);await other.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Ready.'));other.on('dialog',d=>d.accept());
  await other.locator('#backup-file').setInputFiles(zipPath);await other.waitForFunction(()=>document.querySelector('#import-status').textContent==='Restored 3 images and review feedback.');
  await other.locator('#jump').selectOption('moss-golem');assert.equal(await other.locator('#comment').inputValue(),'B has our favourite face.');assert.equal(await other.locator('[data-design=b] .rating[data-score="5"]').getAttribute('aria-pressed'),'true');
  const hashes=await other.evaluate(async()=>{const db=await new Promise((r,j)=>{const q=indexedDB.open('blitzword-family-art-images-v1',1);q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});const rows=await new Promise(r=>{const q=db.transaction('images').objectStore('images').getAll();q.onsuccess=()=>r(q.result);});return Promise.all(rows.map(async x=>({id:x.id,hash:[...new Uint8Array(await crypto.subtle.digest('SHA-256',await x.blob.arrayBuffer()))].map(b=>b.toString(16).padStart(2,'0')).join('')})));});
  for(const row of hashes)assert.equal(row.id,row.hash);assert.equal(hashes.length,3);
  await other.reload();await other.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Ready.'));assert.match(await other.locator('.availability').textContent(),/34 images available/);await clean.close();
 });
 await check('Interrupted batches keep completed files and can resume without duplicates',async()=>{
  const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Add images',exact:true}).click();await (await chooser).setFiles(Array.from({length:80},(_,i)=>payload('duplicate-'+i+'.webp',a)));
  await page.waitForFunction(()=>!document.querySelector('#stop-import').hidden);await page.locator('#stop-import').click();await done();assert.match(await page.locator('#import-status').textContent(),/stopped after/);
  await page.locator('#image-files').setInputFiles([payload('moss-golem-a.webp',a)]);await done();assert.match(await page.locator('#import-status').textContent(),/1 duplicates skipped/);
 });
 await check('Import mapping is reflected in a second open tab',async()=>{
  const second=await context.newPage();await second.goto(url);await second.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Ready.'));
  await page.locator('#image-files').setInputFiles(payload('moon-moth-a.webp',art('thornling-d.webp')));await done();
  await second.waitForFunction(()=>document.querySelector('.availability').textContent.includes('35 images available'));await second.close();
 });
 await check('Corrupt backup reports damage without replacing feedback',async()=>{
  const damaged=Buffer.from(fs.readFileSync(zipPath));const at=damaged.indexOf(Buffer.from('RIFF'));assert.ok(at>0);damaged[at+100]^=255;
  const file=path.join(output,'damaged.zip');fs.writeFileSync(file,damaged);page.on('dialog',d=>d.accept());
  await page.locator('#backup-file').setInputFiles(file);await done();assert.match(await page.locator('#import-status').textContent(),/Damaged image/);assert.equal(await page.locator('#comment').inputValue(),'B has our favourite face.');
 });
 await check('Storage quota failures do not claim that an image was saved',async()=>{
  await page.evaluate(()=>{window.realPut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(){throw new DOMException('Full','QuotaExceededError');};});
  await page.locator('#image-files').setInputFiles(payload('moon-moth-b.webp',art('thornling-e.webp')));await done();assert.match(await page.locator('#import-status').textContent(),/storage is full/);assert.match(await page.locator('.availability').textContent(),/35 images available/);
  await page.evaluate(()=>{IDBObjectStore.prototype.put=window.realPut;});
 });
 await check('Phone and tablet layouts fit; production learner data is unchanged',async()=>{
  for(const [width,height] of [[390,844],[834,1194],[1366,1024]]){await page.setViewportSize({width,height});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.reload();await page.waitForFunction(()=>document.querySelector('#import-status').textContent.startsWith('Ready.'));assert.equal(await page.locator('header').count(),1);await page.setViewportSize({width:1280,height:960});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,'dashboard.png')});await page.locator('#round-title').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'cards.png')});await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,'phone.png')});
  assert.equal(await page.evaluate(()=>localStorage.getItem('blitzword-save-v1')),'learner-sentinel');assert.deepEqual(errors,[]);
 });
 fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify({passed:tests.length,tests,pageErrors:errors,output,backup:zipPath},null,2));
 console.log('OUTPUT '+output);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
