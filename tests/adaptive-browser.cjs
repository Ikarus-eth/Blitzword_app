// Isolated browser checks. No personal browser or learner storage is used.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),Core=require('../game-core'),Storage=require('../storage');
const out=process.env.ADAPTIVE_OUTPUT||'/tmp/blitzword-adaptive-browser';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const errors=[],checks=[];
 try{
  for(const viewport of [{width:1180,height:820},{width:820,height:1180},{width:390,height:844}]){
   const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   const s=Core.migrate(Core.fresh()),now=Date.now();s.profile.name='Preview';s.assessment.done=true;s.settings.soundscape=false;s.settings.audio={muted:true};
   for(let i=0;i<20;i++)s.campaign.battleRecords.push({id:'check-'+i,task:'battle',target:'on',correct:true,supported:false,timingValid:true,at:new Date(now).toISOString()});
   Core.startBattle(s,now,{strength:32});
   await page.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key:Storage.KEY,s});
   await page.goto(process.env.ADAPTIVE_URL||'http://127.0.0.1:8776/');
   await page.locator('#mapContinue').click();
   await page.locator('#encounterStart').waitFor({state:'visible'});
   assert.equal(await page.locator('#heroHearts').getAttribute('aria-label'),'10 of 10 hearts');
   assert.match(await page.locator('#encounterLearning').textContent(),/10 hearts/);
   await page.screenshot({path:out+'/'+viewport.width+'-encounter.png'});
   await page.locator('#encounterStart').click();
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('blitzword_state_v1')).battle.question?.phase==='choices');
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('blitzword_state_v1'))),q=saved.battle.question;
   assert.equal(q.challengeMode,'stretch');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:out+'/'+viewport.width+'-battle.png'});
   await page.reload();await page.locator('#mapContinue').click();
   await page.waitForFunction(()=>document.querySelector('#battle').classList.contains('active'));
   const resumed=await page.evaluate(()=>JSON.parse(localStorage.getItem('blitzword_state_v1')).battle.question);
   assert.equal(resumed.id,q.id);assert.deepEqual(resumed.options,q.options);
   await page.locator('#homeBtn').click();await page.locator('#mapParents').click();
   const prompt=await page.locator('#parentQuestion').textContent();
   const units='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' '),tens={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
   const number=text=>text.trim().split(/[ -]+/).reduce((n,w)=>w==='hundred'?n*100:w==='and'?n:n+(tens[w]??units.indexOf(w)),0);
   const [a,b]=prompt.replace(/^What is /,'').replace(/\?$/,'').split(' minus ');
   await page.locator('#parentAnswer').fill(String(number(a)-number(b)));await page.locator('#parentUnlock').click();
   assert.match(await page.locator('#parentChallenge').textContent(),/20 \/ 20/);
   assert.match(await page.locator('#parentChallenge').textContent(),/Moving into new words sooner/);
   await page.screenshot({path:out+'/'+viewport.width+'-parents.png'});
   checks.push({viewport,hearts:true,adaptiveMode:true,pendingResume:true,parentSummary:true,noOverflow:true});await context.close();
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(out+'/checks.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
