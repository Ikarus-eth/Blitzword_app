// Isolated Chromium visual/regression check; never opens a personal browser profile.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const url=process.env.FIGHT_URL||'http://127.0.0.1:8779/',out=process.env.FIGHT_OUTPUT||'/tmp/blitzword-fight-art';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_EXECUTABLE});
 try{
 const page=await browser.newPage({viewport:{width:1100,height:760}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'assets/battle-motion/manifest.json');await page.setContent('<base href="'+url+'">');await page.addScriptTag({url:url+'assets/battle-motion/manifest.js'});await page.addScriptTag({url:url+'assets/battle-motion/runtime.js'});await page.evaluate(async()=>{await BlitzMotion.warm('mage');await BlitzMotion.warm('pip');await BlitzMotion.warm('thornling');});
 await page.evaluate(()=>{
  const M=BlitzMotion;document.body.innerHTML='<main style="display:flex;gap:30px;color:white;font:20px sans-serif"><section>Before<div id="before"></div></section><section>After<div id="after"></div></section></main>';
  document.body.style.cssText='margin:0;padding:20px;background:#18372c';
  const panel='<div style="display:flex;height:500px;background:#c9c4ae;padding:10px"><div style="width:270px;height:430px">'+M.render('mage')+'</div><div style="width:190px;height:230px;margin-top:220px">'+M.render('pip')+'</div></div>';
  document.querySelector('#after').innerHTML=panel;document.querySelector('#before').innerHTML=panel.replace(/ filter="url\(#[^)]+\)"/g,'').replace('pip-friendly.png','pip-still.webp');
 });
 await page.waitForTimeout(300);await page.screenshot({path:out+'/before-after.png'});
 const result=await page.evaluate(async()=>{
  const M=BlitzMotion,images={};
  for(const key of ['mage','pip','thornling']){const a=M.asset(key);for(const url of [a.still,...Object.values(a.clips).flatMap(c=>c.sheets)]){const im=new Image();im.src=url;await im.decode();images[url]=M.prepareImage(im,url);}}
  let residual=0,visible=0;for(const [url,im]of Object.entries(images).filter(([u])=>/mage-/.test(u))){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height).data;for(let i=0;i<d.length;i+=4){if(d[i+3]>0)visible++;if(d[i+3]>32&&2*d[i+2]-d[i]-d[i+1]>=90)residual++;}}
  document.body.innerHTML='';const c=document.createElement('canvas');c.width=1050;c.height=600;document.body.append(c);const ctx=c.getContext('2d');
  window.fightDraw=ms=>{ctx.fillStyle='#bdbba3';ctx.fillRect(0,0,c.width,c.height);M.drawBattle(ctx,images,{hero:{x:80,y:100,w:270,h:430},enemy:{x:710,y:250,w:290,h:280},pip:{x:400,y:295,w:220,h:235}},{correct:true,assist:true,enemy:'thornling',defeated:true},ms);};
  return {residual,visible,ready:['cast','assistCast','hit','defeat','victory'].every(c=>M.ready('mage',c))};
 });
 assert.equal(result.residual,0);assert.ok(result.visible>10000);assert.ok(result.ready);
 for(const ms of [0,500,950,1050,1200]){await page.evaluate(ms=>fightDraw(ms),ms);await page.screenshot({path:out+'/assist-'+ms+'.png'});}
 const Core=require('../game-core'),Storage=require('../storage');
 for(const viewport of [{width:820,height:1180},{width:390,height:844}]){
  const context=await browser.newContext({viewport}),game=await context.newPage();game.on('pageerror',e=>errors.push(e.message));
  const state=Core.migrate(Core.fresh()),now=Date.now();state.profile={name:'Preview',gender:'boy',heroClass:'Mage',age:7};state.assessment.done=true;state.settings.soundscape=false;state.settings.audio={muted:true};
  for(const w of Object.values(state.learning.words)){w.familiar=true;w.introducedAt=new Date(now).toISOString();}
  Core.startBattle(state,now,{strength:3,enemyId:'thornling'});
  await game.addInitScript(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:Storage.KEY,state});
  await game.goto(url);await game.locator('#mapContinue').click();await game.locator('#encounterStart').click();
  await game.waitForFunction(()=>document.querySelector('#battle .battlePip image')?.getAttribute('href').includes('pip-friendly'));
  await game.evaluate(()=>BlitzMotion.warm('mage'));await game.screenshot({path:out+'/battle-'+viewport.width+'.png'});
  assert.equal(await game.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/checks.json',JSON.stringify({...result,errors},null,2));console.log(result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
