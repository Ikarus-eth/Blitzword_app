// Isolated browser checks for the 2 October 2026 challenge release. No personal browser or learner storage is used.
// Run: serve the checkout on localhost:8776, then
// PLAYWRIGHT_MODULE=<installed playwright> CHROME_EXECUTABLE=<chromium> node tests/challenge-browser.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),Core=require('../game-core'),Content=require('../content'),Storage=require('../storage');
const out=process.env.CHALLENGE_OUTPUT||'/tmp/blitzword-challenge-browser',url=process.env.CHALLENGE_URL||'http://127.0.0.1:8776/';
fs.mkdirSync(out,{recursive:true});
function save(build){
 const s=Core.migrate(Core.fresh()),now=Date.now();s.profile={name:'Preview',gender:'boy',heroClass:'Mage',age:7};s.assessment.done=true;
 s.settings.soundscape=false;s.settings.audio={muted:true};for(const w of Object.values(s.learning.words)){w.familiar=true;w.introducedAt=new Date(now).toISOString();}
 build(s,now);return s;
}
async function open(browser,viewport,s,extra={}){
 const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({key,s,extra})=>{if(!localStorage.getItem(key)){localStorage.setItem(key,JSON.stringify(s));for(const [k,v] of Object.entries(extra))localStorage.setItem(k,v);}},{key:Storage.KEY,s,extra});
 await page.goto(url);return {context,page,errors};
}
const overflow=page=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
async function parents(page){
 await page.locator('#mapParents').click();const prompt=await page.locator('#parentQuestion').textContent();
 const units='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' '),tens={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
 const number=text=>text.trim().split(/[ -]+/).reduce((n,w)=>w==='hundred'?n*100:w==='and'?n:n+(tens[w]??units.indexOf(w)),0);
 const [a,b]=prompt.replace(/^What is /,'').replace(/\?$/,'').split(' minus ');
 await page.locator('#parentAnswer').fill(String(number(a)-number(b)));await page.locator('#parentUnlock').click();
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE,args:['--disable-gpu']});
 const results=[],errors=[];
 try{
  for(const viewport of [{width:1180,height:820},{width:820,height:1180},{width:390,height:844}]){
   const w=viewport.width;
   // 1. Champion encounters at 32 HP: groups of five, a pack of three and a single Mighty creature.
   for(const id of ['moon-moth--4','acorn-imp--4','lantern-wisp--4','fern-wolf--4','cave-troll--4','briar-bat--4']){
    const enemy=Content.enemyAt(id),s=save((s,now)=>Core.startBattle(s,now,{strength:32,enemyId:id}));
    const {context,page,errors:e}=await open(browser,viewport,s);
    await page.locator('#mapContinue').click();await page.locator('#encounterStart').waitFor({state:'visible'});
    await page.screenshot({path:`${out}/${w}-${id}-encounter.png`});
    await page.locator('#encounterStart').click();
    await page.waitForFunction(()=>JSON.parse(localStorage.getItem('blitzword_state_v1')).battle.question?.phase==='choices');
    const members=await page.locator('#enemyFace .enemyMember').count(),hearts=await page.locator('#heroHearts').getAttribute('aria-label');
    assert.equal(members,enemy.count>1?enemy.count:0,id);assert.equal(hearts,'10 of 10 hearts');assert.equal(await overflow(page),false,id);
    const box=await page.locator('#enemyFace').boundingBox();assert.ok(box&&box.width>0&&box.x>=-1&&box.x+box.width<=w+1,id+' enemy inside viewport');
    await page.screenshot({path:`${out}/${w}-${id}-battle.png`});
    results.push({viewport:w,check:'champion',id,name:enemy.name,members,hearts});errors.push(...e);await context.close();
   }
   // 2. Ceiling result after a win: two different families, neither the adult griffin.
   {
    const s=save((s,now)=>{Core.startBattle(s,now,{strength:32,enemyId:'storm-griffin--3'});s.battle.enemyHealth=0;s.battle.heroHealth=6;Core.prepareBattle(s,now);});
    const {context,page,errors:e}=await open(browser,viewport,s);
    await page.locator('#mapContinue').click();await page.locator('#result.active').waitFor();
    const cards=await page.locator('#opponents .opponentCard').evaluateAll(cards=>cards.map(c=>({id:c.dataset.enemy,name:c.querySelector('.creatureName').textContent,label:c.querySelector('.opponentName').textContent.trim()})));
    assert.equal(cards.length,2);assert.notEqual(Content.enemyAt(cards[0].id).family,Content.enemyAt(cards[1].id).family);
    assert.ok(cards.every(c=>c.label==='= Same'&&Content.enemyAt(c.id).family!=='storm-griffin'));assert.equal(await overflow(page),false);
    // Both cards stay inside the result panel (the row overflowed by about 50 px at 390 px before this release).
    const fit=await page.evaluate(()=>{const panel=document.querySelector('.resultCard').getBoundingClientRect(),row=document.querySelector('#opponents');
      return row.scrollWidth<=row.clientWidth+1&&[...row.children].every(c=>{const r=c.getBoundingClientRect();return r.left>=panel.left-1&&r.right<=panel.right+1;});});
    assert.ok(fit,'ceiling cards fit at '+w);
    await page.screenshot({path:`${out}/${w}-ceiling-result.png`});
    results.push({viewport:w,check:'ceiling',cards});errors.push(...e);await context.close();
   }
   // 3. Parents: separate reading-riddle stat and column; familiar-word pace line.
   {
    const today=Core.dayKey(Date.now());
    const s=save((s,now)=>{s.timing.days={[today]:{practice:600000,math:60000,assessment:0,demo:0,idle:0}};s.settings.speed='walk';s.learning.challengePace={steps:2,since:0};s.screen='campaignMap';s.activity='route';});
    const pilot=JSON.stringify({version:2,revision:1,activeId:'x',stories:{},time:{days:{[today]:185000},idleMs:0}});
    const {context,page,errors:e}=await open(browser,viewport,s,{[Core.RIDDLE_KEY]:pilot});
    await parents(page);
    assert.equal(await page.locator('#parentRiddles').textContent(),'3 min 05 sec');assert.equal(await page.locator('#parentRiddlesToday').textContent(),'Today: 3 min 05 sec');
    const stat=await page.evaluate(()=>{const card=document.querySelector('#parentRiddles').closest('article');return card.scrollWidth<=card.clientWidth+1;});assert.ok(stat,'riddle stat fits its card');
    assert.match(await page.locator('#parentChallenge').textContent(),/75–85%.*Familiar words now flash for 1\.20 s/);
    const row=await page.locator('#parentDays tr').first().locator('td').allTextContents();assert.equal(row[2],'3 min 05 sec');
    assert.equal(await page.evaluate(k=>localStorage.getItem(k),Core.RIDDLE_KEY),pilot,'Parents does not write the story save');
    await page.locator('.parentStats').screenshot({path:`${out}/${w}-parents-stats.png`});
    await page.locator('#parentDays').locator('xpath=ancestor::article').screenshot({path:`${out}/${w}-parents-days.png`});
    results.push({viewport:w,check:'parents',row});errors.push(...e);await context.close();
   }
   // 4. Story adventures record tap-confirmed time in their own save.
   {
    const context=await browser.newContext({viewport}),page=await context.newPage(),e=[];page.on('pageerror',x=>e.push(x.message));
    await page.goto(url+'assets/story-pilot/');await page.waitForTimeout(1500);
    await page.locator('.choice').first().click();
    const time=await page.evaluate(()=>JSON.parse(localStorage.getItem('blitzword_story_pilot_v2')).time);
    const total=Object.values(time.days).reduce((a,b)=>a+b,0);assert.ok(total>=1000&&total<30000,JSON.stringify(time));
    results.push({viewport:w,check:'story-time',totalMs:total});errors.push(...e);await context.close();
   }
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,1));
  console.log(JSON.stringify({checks:results.length,errors:errors.length}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
