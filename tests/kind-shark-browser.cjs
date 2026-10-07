const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../game-core'),A=C.Adventure,S=require('../storage');
const base=process.env.SHARK_URL||'http://127.0.0.1:8787/',out=process.env.SHARK_OUTPUT||'/tmp/blitzword-kind-shark';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],results=[];
try{for(const viewport of [{width:1180,height:820},{width:768,height:1024},{width:390,height:844}])for(let step=0;step<4;step++){
 const s=C.migrate(C.fresh()),now=Date.now();s.profile={name:'Reader',gender:'boy',heroClass:'Mage',age:7};s.assessment.done=true;s.settings.audio={muted:true};s.settings.soundscape=false;
 for(const id of A.Data.campaigns[0].missions.slice(0,5))A.stats(s,id).completedAt=new Date(now).toISOString();
 C.startMission(s,'oak-heart',now);s.expedition.current.step=step;
 const ctx=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key:S.KEY,s});await page.goto(base);await page.locator('#missionResume').click();
 const im=page.locator('#mission .missionScene img');await im.evaluate(im=>im.decode());assert.ok((await im.getAttribute('src')).includes('kind-shark-'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 await page.screenshot({path:out+`/scene-${step}-${viewport.width}.png`});
 await ctx.close();
 const puzzle=C.copy(s);C.startMissionBattle(puzzle,now);puzzle.battle.enemyHealth=0;C.resolveBattle(puzzle,now);A.startPuzzle(puzzle);
 const pc=await browser.newContext({viewport,reducedMotion:'reduce'}),p=await pc.newPage();p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key:S.KEY,s:puzzle});await p.goto(base);await p.locator('#missionResume').click();
 const q=A.Data.byId['oak-heart'].riddles[step];for(const id of [q.answer].flat())await p.locator('[data-choice="'+id+'"]').click();await p.getByRole('button',{name:'Try it',exact:true}).click();await p.getByRole('button',{name:step===3?'Claim the treasure':'Follow the trail',exact:true}).click();
 if(step===3){assert.ok((await p.locator('#mission').textContent()).includes('Thank you, kind shark'));await p.locator('#mission .missionScene img').evaluate(im=>im.decode());await p.screenshot({path:out+`/ending-${viewport.width}.png`});}
 results.push({viewport,step,scene:true,riddle:true,finale:step===3});await pc.close();
}assert.deepEqual(errors,[]);fs.writeFileSync(out+'/checks.json',JSON.stringify({base,results,errors},null,2));console.log(`${results.length} scene/riddle checks; no page errors`);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
