const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const root=process.cwd(),C=require(root+'/assets/wimmelbild/core'),D=require(root+'/assets/wimmelbild/data');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});const errors=[];const outputs=[];
 for(const size of [{width:1180,height:820},{width:1024,height:768},{width:390,height:844},{width:844,height:390}]){
  const context=await browser.newContext({viewport:size,hasTouch:true});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/assets/wimmelbild/');await page.waitForFunction(()=>document.querySelector('#image-status').hidden);
  await page.evaluate(()=>localStorage.setItem('main-save-sentinel','keep-me'));
  assert.ok(await page.locator('#go').isDisabled());
  await page.locator('[data-choice=cave]').click();await page.locator('#go').click();assert.match(await page.locator('#feedback').textContent(),/first line/);
  await page.locator('#plus').click();assert.notEqual(await page.locator('#zoom').textContent(),'1×');await page.locator('#reset').click();
  await page.locator('#expand').click();assert.equal(await page.locator('#expand').getAttribute('aria-pressed'),'true');await page.locator('#expand').click();
  await page.locator('[data-choice=tree]').click();await page.locator('#go').click();await page.waitForFunction(()=>document.querySelector('#image-status').hidden);
  assert.equal(await page.locator('#title').textContent(),'A door in the tree');await page.reload();await page.waitForFunction(()=>document.querySelector('#image-status').hidden);assert.equal(await page.locator('#title').textContent(),'A door in the tree');
  if(size.width===1180){
   // Actual two-touch browser events exercise the pointer gesture implementation.
   const client=await context.newCDPSession(page),b=await page.locator('#viewport').boundingBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;
   const tp=(x,y,id)=>({x,y,id,radiusX:2,radiusY:2,force:1});
   await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[tp(cx-35,cy,1),tp(cx+35,cy,2)]});
   for(let i=1;i<=5;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[tp(cx-35-i*12,cy,1),tp(cx+35+i*12,cy,2)]});
   await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   assert.ok(parseFloat(await page.locator('#zoom').textContent())>1.5);assert.ok(await page.locator('#go').isDisabled());
   const before=await page.locator('#surface').getAttribute('style');await page.mouse.move(cx,cy);await page.mouse.down();await page.mouse.move(cx+70,cy+20,{steps:5});await page.mouse.up();assert.notEqual(await page.locator('#surface').getAttribute('style'),before);assert.ok(await page.locator('#go').isDisabled());
   await page.locator('#reset').click();
   // Tap the real top-left door, using rendered image geometry.
   const s=await page.locator('#surface').boundingBox(),o=D.scenes[1].options.find(x=>x.id==='high');
   await page.mouse.click(s.x+(o.box[0]+o.box[2]/2)*s.width,s.y+(o.box[1]+o.box[3]/2)*s.height);assert.equal(await page.locator('[data-choice=high]').getAttribute('aria-pressed'),'false');assert.ok(await page.locator('#go').isDisabled());await page.locator('[data-choice=high]').click();
   await page.screenshot({path:root+'/docs/wimmelbild/tablet-village.png'});
  }else await page.locator('[data-choice=high]').click();
  await page.locator('#go').click();await page.waitForFunction(()=>document.querySelector('#image-status').hidden);assert.equal(await page.locator('#title').textContent(),'Find the dragon guide');assert.equal(await page.locator('#reading').evaluate(e=>e.scrollTop),0);
  await page.locator('#hint').click();assert.equal(await page.locator('#hint-text').isVisible(),true);
  await page.locator('[data-choice=short]').click();await page.locator('#go').click();assert.match(await page.locator('#feedback').textContent(),/tail/);
  if(size.width===1180||size.width===390){await page.evaluate(()=>{window.scrollTo(0,0);document.querySelector('#reading').scrollTop=0;});await page.screenshot({path:root+'/docs/wimmelbild/'+(size.width===1180?'tablet':'phone')+'-dragons.png',fullPage:true});}
  await page.locator('[data-choice=arch]').click();await page.locator('#go').click();await page.waitForFunction(()=>document.querySelector('#image-status').hidden);
  await page.locator('[data-choice=right]').click();await page.locator('#go').click();assert.equal(await page.locator('#ending').isVisible(),true);
  await page.reload();assert.equal(await page.locator('#ending').isVisible(),true);assert.equal(await page.evaluate(()=>localStorage.getItem('main-save-sentinel')),'keep-me');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
  outputs.push({viewport:size,journey:'pass',reload:'pass',completion:'pass'});await context.close();
 }
 // Chapter home launch, and return, use the real app with an isolated learner.
 const ctx=await browser.newContext({viewport:{width:1180,height:820}}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8765/');
 await page.evaluate(()=>{const s=BlitzCore.fresh();s.profile={name:'Review',age:7,gender:'boy',heroClass:'Mage',heroIndex:0};s.assessment.done=true;localStorage.setItem(BlitzStorage.KEY,JSON.stringify(s));});await page.reload();
 await page.getByRole('button',{name:'⌕ Dragon path',exact:true}).click();await page.waitForURL('**/assets/wimmelbild/');await page.locator('#home').click();await page.waitForURL('http://127.0.0.1:8765/');
 await page.getByRole('button',{name:'Word trails',exact:true}).click();await page.locator('#mapWimmelbild').click();await page.waitForURL('**/assets/wimmelbild/');outputs.push({launchBothHomes:'pass'});
 assert.deepEqual(errors,[]);fs.writeFileSync(root+'/docs/wimmelbild/browser-checks.json',JSON.stringify({date:'2026-10-10',browser:'Playwright Chromium',checks:outputs,realTwoFingerEvents:'pass',panDoesNotAnswer:'pass',pictureTapNeverAnswers:'pass',errors,physicalIPad:'not tested'},null,2));await browser.close();console.log(JSON.stringify(outputs));
})().catch(e=>{console.error(e);process.exit(1)});
