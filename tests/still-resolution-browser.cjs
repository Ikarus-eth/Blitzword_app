// Real app, isolated saves and a fresh browser context per map; no personal browser data.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const Core=require('../game-core'),C=require('../content'),Storage=require('../storage');
const base=process.env.IMAGE_URL||'http://127.0.0.1:8779/',out=process.env.IMAGE_OUTPUT||'/tmp/blitzword-still-resolution';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE}),results=[],errors=[];
try{
 for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:390,height:844}])for(let campaign=0;campaign<7;campaign++){
  const s=Core.migrate(Core.fresh());s.profile={name:'Preview',gender:'boy',heroClass:'Mage',age:7};s.assessment.done=true;s.settings.soundscape=false;s.settings.audio={muted:true};
  s.story.clearedAreas=C.areas.slice(0,campaign*5).map(a=>a.id);s.story.completedChapters=C.chapters.slice(0,campaign).map(c=>c.id);Core.startBattle(s,Date.now());
  const context=await browser.newContext({viewport,deviceScaleFactor:2,reducedMotion:'reduce'}),page=await context.newPage(),requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.addInitScript(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key:Storage.KEY,s});await page.goto(base);
  const src=C.campaignBackgrounds['chapter-'+(campaign+1)].src;
  const pixels=await page.evaluate(async src=>{const im=new Image();im.src=src;await im.decode();const el=document.querySelector('.mapTerrain'),r=el.getBoundingClientRect(),style=getComputedStyle(el);return{width:im.naturalWidth,height:im.naturalHeight,box:[r.width,r.height],size:style.backgroundSize,background:style.backgroundImage,overflow:document.documentElement.scrollWidth>innerWidth+1,underlayHidden:document.querySelector('#chapterScenery').hidden};},src);
  assert.ok(pixels.background.includes(src));assert.ok(pixels.size.startsWith('cover'));assert.equal(pixels.overflow,false);assert.equal(pixels.underlayHidden,true);
  assert.ok(!requests.some(u=>u.includes('chapter-scenes.webp')),'do not load a low-res atlas behind the map');
  assert.ok(pixels.width>=1200&&pixels.height>=1000);
  const continueBox=await page.locator('#mapContinue').boundingBox();assert.ok(continueBox&&continueBox.width>=40);
  if(campaign===0||campaign===1||campaign===6)await page.screenshot({path:out+`/map-${campaign+1}-${viewport.width}.png`});
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),Storage.KEY);assert.equal(saved.battle.id,s.battle.id);assert.deepEqual(saved.story.clearedAreas,s.story.clearedAreas);assert.equal(saved.dragon.xp,s.dragon.xp);
  results.push({campaign:campaign+1,viewport,...pixels});await context.close();
 }
 // Decode every audited still source and measure actual pixels; catch 404/corrupt assets.
 const p=await browser.newPage();await p.goto(base+'assets/battle-motion/manifest.json');
 const inventory=require('../docs/still-resolution/AUDIT.json');
 const decoded=await p.evaluate(async assets=>{const out=[];for(const [src,m]of Object.entries(assets)){const im=new Image();im.src=src;await im.decode();out.push({src,valid:im.naturalWidth===m.width&&im.naturalHeight===m.height});}return out;},Object.fromEntries(Object.entries(inventory.assets).map(([src,m])=>[new URL(src,base).href,m])));
 assert.ok(decoded.every(a=>a.valid));assert.deepEqual(errors,[]);fs.writeFileSync(out+'/browser-checks.json',JSON.stringify({maps:results,decodedStillAssets:decoded.length,errors},null,2));console.log(`${results.length} map checks; ${decoded.length} still files decoded; no browser errors`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
