const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../game-core'),A=C.Adventure,base=process.env.TEST_URL||'http://127.0.0.1:8879/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH}),errors=[],checks=[];
for(const viewport of [{width:1180,height:820},{width:820,height:1180},{width:390,height:844}]){
 const page=await browser.newPage({viewport,hasTouch:true});page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 const s=C.migrate(C.fresh());s.profile={name:'Chapter review',age:7,gender:'boy',heroClass:'Mage',heroIndex:0};s.assessment.done=true;for(const m of A.Data.missions.slice(0,12))A.stats(s,m.id).completedAt=new Date().toISOString();s.expedition.selectedCampaign='star-trail';
 await page.evaluate(s=>localStorage.setItem(BlitzStorage.KEY,JSON.stringify(s)),s);await page.reload();await page.locator('[data-mission="star-post"]').waitFor();
 assert.equal(await page.locator('.campaignTab').count(),3);assert.equal(await page.locator('.missionCard').count(),8);assert.match(await page.locator('#adventureHub').innerText(),/0\/8 treasures/i);
 await page.evaluate(()=>Promise.all([...document.querySelectorAll('#adventureHub svg image')].map(el=>new Promise(resolve=>{const i=new Image();i.onload=resolve;i.onerror=resolve;i.src=el.getAttribute('href')||el.getAttribute('xlink:href');}))));
 await page.screenshot({path:'docs/adventures/star-trail/hub-'+viewport.width+'.png'});await page.locator('[data-mission="star-post"]').click();await page.locator('.missionScene img').evaluate(i=>i.decode());assert.equal(await page.locator('#mission [role=progressbar]').getAttribute('aria-valuemax'),'9');
 const top=await page.locator('.missionTop').boundingBox(),body=await page.locator('.missionBody').boundingBox();assert.ok(top.y+top.height<=body.y,'tracker must not overlap chapter content');
 await page.screenshot({path:'docs/adventures/star-trail/intro-'+viewport.width+'.png'});await page.locator('.missionIntroEnemy').screenshot({path:'docs/adventures/star-trail/snow-owl-'+viewport.width+'.png'});await page.getByRole('button',{name:'Let’s go',exact:true}).click();await page.locator('#encounterStart').waitFor({state:'visible'});await page.locator('#encounterStart').click();
 await page.waitForFunction(()=>{const s=BlitzCore.unpackSave(JSON.parse(localStorage.getItem(BlitzStorage.KEY)));return s.battle?.enemyId?.startsWith('snow-owl');});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checks.push({viewport,hub:'pass',eightChapters:'pass',nineTasks:'pass',approvedSnowOwlBattle:'pass'});await page.close();}
assert.deepEqual(errors,[]);fs.writeFileSync('docs/adventures/star-trail/hub-checks.json',JSON.stringify({url:base,checks,errors},null,2));await browser.close();console.log(checks);})().catch(e=>{console.error(e);process.exit(1)});
