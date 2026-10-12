const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../game-core'),A=C.Adventure,base=process.env.TEST_URL||'http://127.0.0.1:8893/';
const output=process.env.CHECK_OUTPUT||'/tmp/blitz-visual-checks';fs.mkdirSync(output,{recursive:true});
const fresh=()=>{const s=C.migrate(C.fresh());s.profile={name:'Layout review',age:7,gender:'boy',heroClass:'Mage',heroIndex:0};s.assessment.done=true;return s;};
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH}),checks=[],errors=[];
for(const viewport of [{width:1024,height:768},{width:1194,height:834},{width:1366,height:1024},{width:768,height:1024},{width:390,height:844},{width:844,height:390}]){
 const page=await browser.newPage({viewport,hasTouch:true});page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
 async function seed(s){await page.evaluate(s=>localStorage.setItem(BlitzStorage.KEY,JSON.stringify(s)),s);await page.reload();await page.locator('#missionResume').click();await page.evaluate(()=>document.fonts.ready);}
 async function contained(selector){const failures=await page.locator(selector).evaluateAll(es=>es.flatMap(e=>{const b=e.getBoundingClientRect();if(!b.width||!b.height)return [];const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;const bad=[];while(n=walker.nextNode()){if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const t of r.getClientRects())if(t.left<b.left-1||t.right>b.right+1||t.top<b.top-1||t.bottom>b.bottom+1)bad.push(n.textContent);}return bad;}));assert.deepEqual(failures,[],selector+' '+viewport.width);}
 const s=fresh();for(const m of A.Data.missions)if(m.id!=='stone-dam')A.stats(s,m.id).completedAt=new Date().toISOString();C.startMission(s,'stone-dam',Date.now());s.expedition.current.step=3;s.expedition.current.phase='puzzle';s.expedition.current.puzzle={solved:true};A.next(s,Date.now());s.expedition.current.search.index=1;await seed(s);
 await page.locator('.mapZoomImage').evaluate(i=>i.decode());await contained('.searchAnswer,.searchActions button,.questStep');
 // The reported answer and longest labels must fit even when selected or enlarged.
 await page.getByRole('button',{name:'In a bread basket',exact:true}).click();await contained('.searchAnswer');
 await page.addStyleTag({content:'.searchAnswer{font-size:30px}'});await contained('.searchAnswer');
 await page.locator('.searchReading').scrollIntoViewIfNeeded();await page.screenshot({path:output+'/map-'+viewport.width+'.png'});
 const team=fresh();C.startMission(team,'first-spark',Date.now());for(const f of ['moon-moth','moss-golem','fern-wolf','bark-beetle','thornling','reed-serpent','lantern-wisp','briar-bat'])A.reveal(team,f,Date.now());A.selectCompanion(team,'fern-wolf');C.startMissionBattle(team,Date.now());team.battle.introPending=false;for(const w of Object.values(team.learning.words)){w.familiar=true;w.independentCorrect=2;w.introducedAt=new Date().toISOString();}C.prepareBattle(team,Date.now());team.battle.question.phase='choices';team.battle.supportMeter={accurate:7,quick:0,earned:false};await seed(team);
 await page.getByRole('button',{name:team.battle.question.target,exact:true}).click();await page.locator('.supportChoice').first().waitFor();await contained('.supportChoice,.questDialogButton');
 assert.ok(await page.locator('.supportChoice').count()>4);assert.ok((await page.locator('.supportChoice .sceneSprite').first().boundingBox()).height>=99);
 await page.screenshot({path:output+'/friends-'+viewport.width+'.png'});await page.locator('.supportChoice').filter({hasText:'Moss Golem'}).click();await page.getByRole('button',{name:'Join my team',exact:true}).click();await page.waitForTimeout(250);
 const widths=await page.locator('#battleHeroImg,.battlePip,#battleCompanion,#battleSupport').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));assert.ok(widths[0]>=viewport.width*.26);assert.ok(widths[1]>=viewport.width*.16);assert.ok(widths[2]>=viewport.width*.23);assert.ok(widths[3]>=viewport.width*.23);
 await page.screenshot({path:output+'/team-'+viewport.width+'.png'});
 const encounter=fresh();for(const m of A.Data.missions)A.stats(encounter,m.id).completedAt=new Date().toISOString();C.startMission(encounter,'crab-ferry',Date.now());C.startMissionBattle(encounter,Date.now());await seed(encounter);await contained('#encounterChapter .questStep');await page.screenshot({path:output+'/encounter-'+viewport.width+'.png'});
 checks.push({viewport,mapButtons:'fit including 30px text',friendChooser:'scrollable full-size cards',battle:'four enlarged allies',nineSteps:'contained'});await page.close();
}
assert.deepEqual(errors,[]);fs.writeFileSync(output+'/checks.json',JSON.stringify({url:base,checks,errors,physicalIPad:'not tested'},null,2));await browser.close();console.log(JSON.stringify(checks));})().catch(e=>{console.error(e);process.exit(1)});
