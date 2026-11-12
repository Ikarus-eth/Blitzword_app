// Pip Grows Up in a real browser (12 November 2026): at 44,000 XP the camp shows Pip glowing, a waiting quest
// sends the child to Pip's story and is kept, the reader works, the last right answer makes Pip grow, and the
// next fight shows Artus riding Pip without page errors or sideways scrolling.
// Run: python3 -m http.server 8893 & GROW_URL=http://127.0.0.1:8893/ PLAYWRIGHT_MODULE=/opt/npm-tools/node_modules/playwright CHROME_EXECUTABLE=/usr/bin/google-chrome node tests/pip-grows-browser.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../game-core'),A=C.Adventure,S=require('../storage'),G=require('../assets/adventures/pip-grows/campaign');
const base=process.env.GROW_URL||'http://127.0.0.1:8893/',out=process.env.GROW_OUTPUT||'/tmp/blitzword-pip-grows';fs.mkdirSync(out,{recursive:true});
function seed(){
 const s=C.migrate(C.fresh()),now=Date.now();s.profile={name:'Artus',gender:'boy',heroClass:'Mage',heroIndex:0,age:7};s.assessment.done=true;s.settings.audio={muted:true};s.settings.soundscape=false;
 for(const m of A.Data.missions)if(!A.isGrowth(m.id)&&!['mk-storm','mk-castle','mk-nest','mk-moon'].includes(m.id))A.stats(s,m.id).completedAt=new Date(now).toISOString();
 s.expedition.selectedCampaign='moon-key';C.startMission(s,'mk-storm',now);
 // The quest was already open when Pip reached 44,000 XP.
 Object.assign(s.dragon,{xp:44000,stage:1,evolutionSeen:1,named:true,namingPromptSeen:true});return s;
}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE||'/usr/bin/google-chrome'}),errors=[],checks=[];
try{
 for(const viewport of [{width:1194,height:834},{width:820,height:1180},{width:390,height:844}]){
  const tag=viewport.width+'x'+viewport.height,ctx=await browser.newContext({viewport,reducedMotion:'reduce',hasTouch:true}),tab=await ctx.newPage();
  tab.on('pageerror',e=>errors.push(tag+': '+e.message));
  const wide=()=>tab.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  await tab.addInitScript(({key,s})=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem(key,JSON.stringify(s));sessionStorage.setItem('seeded','1');}},{key:S.KEY,s:seed()});
  await tab.goto(base);
  // Camp: Pip is glowing; the waiting quest offers his story.
  await tab.locator('#growthStart').waitFor();await tab.screenshot({path:out+'/hub-'+tag+'.png'});
  assert.equal(await tab.locator('.missionCard[data-mission="mk-castle"]').isDisabled(),true);
  await tab.locator('#missionResume').click();await tab.getByText('This quest will wait for you',{exact:false}).waitFor();await tab.locator('#mission .missionScene img').evaluate(i=>i.decode());await tab.screenshot({path:out+'/gate-'+tag+'.png'});
  await tab.locator('#growthStartQuest').click();await tab.getByRole('button',{name:'Read the story',exact:true}).click();
  await tab.locator('.storyText').waitFor();await tab.locator('.missionScene img').evaluate(i=>i.decode());await tab.screenshot({path:out+'/reader-'+tag+'.png'});
  assert.equal(await wide(),false,'reader fits '+tag);
  const words=await tab.locator('.storyText .storyWord').count();assert.ok(words>40,'tappable words '+words);
  // Jump to the last question of part 4 with the first three parts read (as if he had read them).
  const saved=await tab.evaluate(k=>JSON.parse(localStorage.getItem(k)),S.KEY),s=C.migrate(C.unpackSave(saved)),now=Date.now();
  assert.equal(A.of(s).parked?.missionId,'mk-storm');
  for(const id of G.campaign.missions.slice(0,3)){A.stats(s,id).completedAt=new Date(now).toISOString();}s.dragon.xp=44750;
  A.of(s).current=null;assert.equal(C.startMission(s,'grow-ride',now),true);A.beginStory(s,now,1);for(let p=1;p<4;p++)A.turnStoryPage(s,p);C.finishStoryReading(s,now);
  for(const q of A.currentStory(s).questions.slice(0,2)){A.chooseStory(s,q.answer,q.id);C.checkStory(s,now,q.id);}
  assert.equal(s.dragon.xp,44950);assert.equal(s.dragon.stage,1);
  await tab.evaluate(({k,v})=>localStorage.setItem(k,JSON.stringify(v)),{k:S.KEY,v:s});await tab.reload();await tab.locator('#missionResume').click();
  const q=A.currentStory(s).questions[2];await tab.locator('[data-story-choice="'+q.answer+'"]').click();await tab.getByRole('button',{name:'Check my answer'}).click();
  await tab.getByRole('button',{name:'Watch Pip grow'}).click();await tab.locator('#evolution.active').waitFor();
  await tab.locator('#evolutionNext').click();await tab.waitForTimeout(400);
  if(await tab.locator('#evolutionSkip').isVisible())await tab.locator('#evolutionSkip').click();
  await tab.locator('#evolutionLines p').first().waitFor();await tab.screenshot({path:out+'/evolution-'+tag+'.png'});
  assert.deepEqual(await tab.locator('#evolutionLines p').allTextContents(),['Hop on my back.','We can go far.']);
  await tab.locator('#evolutionNext').click();
  const back=tab.getByRole('button',{name:/Ride on Pip: back to The Storm/});await back.waitFor();await tab.screenshot({path:out+'/complete-'+tag+'.png'});
  await back.click();
  await tab.getByRole('button',{name:'Let’s go'}).or(tab.getByRole('button',{name:'Start the fight'})).first().click();
  const start=tab.locator('#encounterStart');if(await start.isVisible().catch(()=>false))await start.click();
  await tab.locator('#battle.riding .riderArt').waitFor();await tab.waitForTimeout(300);await tab.screenshot({path:out+'/battle-'+tag+'.png'});
  assert.equal(await wide(),false,'battle fits '+tag);
  const after=await tab.evaluate(k=>JSON.parse(localStorage.getItem(k)),S.KEY);const done=C.migrate(C.unpackSave(after));
  assert.equal(done.dragon.stage,2);assert.equal(done.dragon.xp,45000);assert.equal(done.expedition.current.missionId,'mk-storm');assert.equal(done.expedition.parked,null);
  checks.push({viewport,hub:'banner',gate:'parks quest',reader:words+' tappable words on page 1',evolution:'Hop on my back.',battle:'riding'});
  await ctx.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/checks.json',JSON.stringify({url:base,checks,errors,physicalIPad:'not tested'},null,2));console.log(JSON.stringify(checks));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
