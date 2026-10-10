const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const root=process.cwd(),C=require(root+'/game-core'),A=C.Adventure,base=process.env.TEST_URL||'http://127.0.0.1:8765/',live=!!process.env.TEST_URL;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});const errors=[],checks=[];
 for(const size of [{width:1180,height:820},{width:390,height:844},{width:844,height:390}]){
 const context=await browser.newContext({viewport:size,hasTouch:true});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 const state=()=>page.evaluate(()=>BlitzCore.unpackSave(JSON.parse(localStorage.getItem(BlitzStorage.KEY))));
 const loaded=()=>page.waitForFunction(()=>{const i=document.querySelector('.mapZoomImage');return i?.complete&&i.naturalWidth>=3072&&document.querySelector('.mapImageStatus').hidden;});
 for(const id of Object.keys(A.Maps)){
 const s=C.migrate(C.fresh());s.profile={name:'Map review',age:7,gender:'boy',heroClass:'Mage',heroIndex:0};s.assessment.done=true;
 for(const m of A.Data.missions)if(m.id!==id)A.stats(s,m.id).completedAt=new Date().toISOString();C.startMission(s,id,Date.now());s.expedition.current.step=3;s.expedition.current.phase='puzzle';s.expedition.current.puzzle={id:A.current(s).riddles[3].id,solved:true,selection:[],order:[]};
 await page.evaluate(s=>localStorage.setItem(BlitzStorage.KEY,JSON.stringify(s)),s);await page.reload();await page.locator('#missionResume').click();await page.getByRole('button',{name:'Open the search map',exact:true}).click();await loaded();
 assert.equal(await page.locator('#mission [role=progressbar]').getAttribute('aria-valuemax'),'9');assert.equal(await page.locator('.mapZoomImage').evaluate(i=>i.naturalWidth),A.Maps[id].width);const imageUrl=await page.locator('.mapZoomImage').getAttribute('src');
 const v=await page.locator('.mapZoomViewport').boundingBox();await page.mouse.click(v.x+v.width*.3,v.y+v.height*.4);assert.equal((await state()).expedition.current.search.selection,null);
 if(id==='crab-ferry'&&size.width===1180){
 const client=await context.newCDPSession(page),cx=v.x+v.width/2,cy=v.y+v.height/2,tp=(x,y,id)=>({x,y,id,radiusX:2,radiusY:2,force:1});
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[tp(cx-30,cy,1),tp(cx+30,cy,2)]});for(let i=1;i<=5;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[tp(cx-30-i*15,cy,1),tp(cx+30+i*15,cy,2)]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(parseFloat(await page.locator('.mapZoomBar output').textContent())>2);assert.equal((await state()).expedition.current.search.selection,null);
 await page.getByRole('button',{name:'Expand the map',exact:true}).click();assert.ok(await page.locator('.mapZoomExpanded').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('.mapZoomExpanded').count(),0);
 }
 await page.getByRole('button',{name:'Show the whole map',exact:true}).click();
 if(id==='high-nest'&&!live){await page.screenshot({path:root+'/docs/wimmelbild/river-search-'+size.width+'-overview.png',fullPage:true});await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.getByRole('button',{name:'Zoom in',exact:true}).click();const b=await page.locator('.mapZoomViewport').boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width*.9,b.y+b.height*.9,{steps:8});await page.mouse.up();await page.screenshot({path:root+'/docs/wimmelbild/river-search-'+size.width+'-zoom.png',fullPage:true});}
 for(let i=0;i<3;i++){
 const q=A.Maps[id].questions[i];assert.match(await page.locator('.searchHead').textContent(),new RegExp('Map question '+(i+1)+' of 3'));assert.equal(await page.locator('.mapZoomImage').getAttribute('src'),imageUrl);
 if(i===0){await page.locator('[data-map-choice="'+q.options.find(o=>o.id!==q.answer).id+'"]').click();await loaded();await page.getByRole('button',{name:'Check my answer',exact:true}).click();await loaded();assert.equal((await state()).expedition.current.hearts,3);assert.ok(await page.getByRole('button',{name:'Check my answer',exact:true}).isDisabled());}
 const camera=await page.locator('.mapZoomBar output').textContent();await page.locator('[data-map-choice="'+q.answer+'"]').click();await loaded();assert.equal(await page.locator('.mapZoomBar output').textContent(),camera);await page.getByRole('button',{name:'Check my answer',exact:true}).click();
 if(i<2){await loaded();if(i===0){await page.reload();await page.locator('#missionResume').click();await loaded();assert.equal((await state()).expedition.current.search.index,1);assert.equal((await state()).expedition.current.hearts,3);}}
 }
 assert.equal((await state()).expedition.current.phase,'complete');assert.equal(await page.locator('#mission [role=progressbar]').getAttribute('aria-valuenow'),'9');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checks.push({id,viewport:size,threeQuestions:'pass',pictureTapNeverAnswers:'pass',wrongCostsOneLife:'pass',reload:'pass',completion:'pass'});
 }
 await context.close();}
 assert.deepEqual(errors,[]);fs.writeFileSync(root+'/docs/wimmelbild/'+(live?'river-search-live-checks.json':'river-search-browser-checks.json'),JSON.stringify({date:new Date().toISOString(),url:base,checks,realTwoFingerEvents:'pass',physicalIPad:'not tested',errors},null,2));await browser.close();console.log(JSON.stringify(checks));
})().catch(e=>{console.error(e);process.exit(1)});
