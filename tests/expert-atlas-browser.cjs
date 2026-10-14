const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('../assets/map-quest/core'),de=require('../assets/map-quest/german-expert');
(async()=>{
 const base=process.env.TEST_URL||'http://127.0.0.1:8767/assets/map-quest/';
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});const results=[],errors=[];
 for(const lang of ['en','de'])for(const viewport of [{width:1180,height:820},{width:390,height:844},{width:844,height:390},{width:1024,height:768}]){
  const ctx=await browser.newContext({viewport,hasTouch:true}),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
  const requested=[];p.on('request',r=>requested.push(r.url()));await p.goto(base);
  await p.evaluate(()=>{
   const s=AtlasCore.fresh();AtlasCore.start(s,'crab-ferry');s.maps['crab-ferry'].index=3;s.maps['crab-ferry'].lives=2;
   AtlasCore.start(s,'stone-dam');s.maps['stone-dam'].index=2;s.maps['stone-dam'].lives=2;
   localStorage.setItem(AtlasCore.KEY,JSON.stringify(s));localStorage.setItem('blitzword.main.sentinel','preserve-me');
  });await p.reload();if(lang==='de')await p.locator('#language').click();
  assert.equal(await p.locator('[data-map]').count(),7);assert.equal(await p.locator('[data-map]').first().getAttribute('data-map'),'clockwork-harbour');
  assert.equal(requested.some(url=>/expert\/(clockwork-harbour|underground-archive)\.webp/.test(url)),false,'full-resolution maps not loaded on home');
  const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem(AtlasCore.KEY)));
  const original=(await saved()).maps;
  const closeDialog=async()=>{await p.locator('.questDialogButton').click();};
  const check=async()=>{await p.getByRole('button',{name:lang==='de'?'Antwort prüfen':'Check my answer',exact:true}).click();};
  for(const id of ['clockwork-harbour','underground-archive']){
   const map=C.Maps[id];await p.locator(`[data-map="${id}"]`).click();await p.waitForFunction(()=>document.querySelector('.mapZoomImage')?.naturalWidth===6144&&document.querySelector('.mapImageStatus')?.hidden);
   assert.equal(await p.locator('.mapZoomImage').evaluate(e=>e.naturalHeight),4096);
   await p.locator('.mapZoomViewport').click();assert.equal((await saved()).maps[id].selection,null);
   for(let i=0;i<10;i++)if(await p.getByRole('button',{name:'Zoom in',exact:true}).isEnabled())await p.getByRole('button',{name:'Zoom in',exact:true}).click();
   assert.equal(await p.locator('.mapZoomBar output').textContent(),'24×');
   await p.getByRole('button',{name:'Show the whole map',exact:true}).click();
   await p.getByRole('button',{name:'Zoom in',exact:true}).click();
   const view=p.locator('.mapZoomViewport'),b=await view.boundingBox();
   await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2-60,b.y+b.height/2-30);await p.mouse.up();
   const transform=await p.locator('.mapZoomImage').getAttribute('style');
   if(lang==='en'&&viewport.width===1180&&!process.env.TEST_URL)await p.screenshot({path:`docs/wimmelbild/expert/${id}-desktop.png`,fullPage:true});
   for(let i=0;i<6;i++){
    const q=map.questions[i];assert.match(await p.locator('.searchRegion').textContent(),new RegExp(`${i+1} ${lang==='de'?'von':'of'} 6`));
    assert.equal(await p.locator('.searchReading h2').textContent(),lang==='de'?de[q.prompt]:q.prompt);
    for(const o of q.options)assert.equal(await p.locator(`[data-choice="${o.id}"]`).textContent(),lang==='de'?de[o.label]:o.label);
    if(i===0){const wrong=q.options.find(o=>o.id!==q.answer);await p.locator(`[data-choice="${wrong.id}"]`).click();assert.equal(await p.locator('.mapZoomImage').getAttribute('style'),transform);await check();assert.equal((await saved()).maps[id].lives,3);await closeDialog();assert.equal(await p.getByRole('button',{name:lang==='de'?'Antwort prüfen':'Check my answer',exact:true}).isDisabled(),true);}
    if(i===2){await p.getByRole('button',{name:lang==='de'?'Ein Tipp, bitte':'A clue, please',exact:true}).click();assert.equal(await p.locator('.searchFeedback').textContent(),lang==='de'?de[q.hint]:q.hint);}
    if(i===4){const wrong=q.options.find(o=>o.id!==q.answer);while((await saved()).maps[id].lives>0){await p.locator(`[data-choice="${wrong.id}"]`).click();await check();if((await saved()).maps[id].lives===0)break;await closeDialog();}assert.equal((await saved()).maps[id].index,4);await closeDialog();assert.equal((await saved()).maps[id].lives,4);}
    await p.locator(`[data-choice="${q.answer}"]`).click();await check();assert.equal((await saved()).maps[id].index,i+1);await closeDialog();
    if(i===2){await p.reload();assert.equal((await saved()).maps[id].index,3);await p.locator(`[data-map="${id}"]`).click();await p.waitForFunction(()=>document.querySelector('.mapImageStatus')?.hidden);}
   }
   assert.equal((await saved()).maps[id].index,6);await p.reload();assert.equal((await saved()).maps[id].index,6);
   await p.locator(`[data-map="${id}"]`).click();await p.getByRole('button',{name:lang==='de'?'Diese Karte erneut spielen':'Play this map again',exact:true}).click();assert.equal((await saved()).maps[id].index,0);
   await p.getByRole('button',{name:lang==='de'?'← Karte wählen':'← Choose a map',exact:true}).click();
   results.push({id,lang,viewport,sixRiddles:true,reloadAfterThree:true,retryAfterFour:true,replay:true,nativeDimensions:[6144,4096],zoom:24});
  }
  assert.deepEqual((await saved()).maps['crab-ferry'],original['crab-ferry']);assert.deepEqual((await saved()).maps['stone-dam'],original['stone-dam']);
  assert.equal(await p.evaluate(()=>localStorage.getItem('blitzword.main.sentinel')),'preserve-me');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await ctx.close();
 }
 assert.deepEqual(errors,[]);await browser.close();fs.writeFileSync('docs/wimmelbild/expert/'+(process.env.TEST_URL?'live':'browser')+'-checks.json',JSON.stringify({url:base,results,errors},null,2));console.log('PASS 16 expert journeys: all 12 riddles in both languages at four viewports, reload/retry/replay and old saves preserved.');
})().catch(e=>{console.error(e);process.exit(1)});
