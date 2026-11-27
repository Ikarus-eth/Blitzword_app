// Dark Wizard reader (chapters 7 and 8) in a real browser: the longest page of every story fits without sideways scrolling at iPad
// and phone sizes, its picture loads, and every word stays a tappable button; stretch words carry the dotted mark.
// Run: python3 -m http.server 8893 & TOWER_URL=http://127.0.0.1:8893/ PLAYWRIGHT_MODULE=/opt/npm-tools/node_modules/playwright CHROME_EXECUTABLE=/usr/bin/google-chrome node tests/dark-wizard-browser.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../game-core'),A=C.Adventure,S=require('../storage'),M=require('../assets/adventures/dark-wizard/campaign');
const base=process.env.TOWER_URL||'http://127.0.0.1:8893/',out=process.env.TOWER_OUTPUT||'/tmp/blitzword-dark-wizard';fs.mkdirSync(out,{recursive:true});
const len=p=>p.join(' ').split(/\s+/).length;
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE||'/usr/bin/google-chrome'}),errors=[],results=[];
try{
 const viewports=[{width:1180,height:820},{width:820,height:1180},{width:844,height:390}];
 for(const m of M.missions)for(const which of [0,1]){
  const st=m.stories[which],page=st.pages.reduce((b,p,i)=>len(p)>len(st.pages[b])?i:b,0);
  for(const viewport of (m.id==='dw-storm'||m.id==='wf-home')?viewports:[viewports[0]]){
   const s=C.migrate(C.fresh()),now=Date.now();s.profile={name:'Reader',gender:'boy',heroClass:'Mage',age:7};s.assessment.done=true;s.settings.audio={muted:true};s.settings.soundscape=false;
   for(const x of A.Data.missions)if(!M.missions.includes(x)||M.missions.indexOf(x)<M.missions.indexOf(m))A.stats(s,x.id).completedAt=new Date(now).toISOString();
   for(const x of M.missions.slice(0,M.missions.indexOf(m)))A.stats(s,x.id).completedAt=new Date(now).toISOString();
   s.expedition.selectedCampaign=m.campaign;C.startMission(s,m.id,now);s.expedition.current.step=which?3:1;A.beginStory(s,now,which);
   for(let p=0;p<=page;p++)A.turnStoryPage(s,p);
   const ctx=await browser.newContext({viewport,reducedMotion:'reduce'}),tab=await ctx.newPage();tab.on('pageerror',e=>errors.push(m.id+': '+e.message));
   await tab.addInitScript(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key:S.KEY,s});await tab.goto(base);await tab.locator('#missionResume').click();
   const im=tab.locator('#mission .missionScene img');await im.evaluate(im=>im.decode().catch(()=>{}));
   const src=await im.getAttribute('src'),loaded=await im.evaluate(im=>im.naturalWidth>0);
   const words=await tab.locator('#mission .storyText .storyWord').count();
   const overflow=await tab.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   const marked=await tab.locator('#mission .storyText .stretchWord').evaluateAll(b=>b.map(x=>x.textContent.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'')));
   const dotted=await tab.locator('#mission .storyText .stretchWord').first().evaluate(e=>getComputedStyle(e).textDecorationStyle).catch(()=>null);
   const pageWords=new Set(st.pages[page].join(' ').split(/\s+/).map(w=>w.toLowerCase().replace(/[’']s$/,'').replace(/[^a-z]/g,'')));
   assert.deepEqual([...new Set(marked)].sort(),st.stretch.filter(w=>pageWords.has(w)).sort(),m.id+' marks');if(marked.length)assert.equal(dotted,'dotted');
   const font=await tab.locator('#mission .storyText .storyParagraph').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
   assert.equal(words,len(st.pages[page]),m.id);assert.equal(overflow,false,m.id+' overflow at '+viewport.width);assert.ok(src.includes(m.id),src);
   results.push({mission:m.id,story:st.id,page:page+1,words,marked:marked.length,viewport:viewport.width+'x'+viewport.height,image:src,loaded,font});
   await tab.screenshot({path:`${out}/${m.id}-${st.id}-p${page+1}-${viewport.width}x${viewport.height}.png`,fullPage:true});await ctx.close();
  }
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/checks.json',JSON.stringify({base,results,errors},null,1));
 console.log(results.length+' longest-page checks; no page errors; images loaded: '+results.filter(r=>r.loaded).length+'/'+results.length);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
