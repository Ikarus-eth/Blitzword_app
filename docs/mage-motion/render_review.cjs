// Offline export of the production frame renderer. UI layout follows current game CSS.
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const ROOT=process.env.BLITZ_MOTION_OUTPUT||path.join(__dirname,'renders'),REPO=path.join(__dirname,'../..');fs.mkdirSync(ROOT,{recursive:true});
require(path.join(REPO,'assets/battle-motion/manifest.js'));const M=require(path.join(REPO,'assets/battle-motion/runtime.js'));
GlobalFonts.registerFromPath(path.join(REPO,'assets/fonts/andika-latin.woff'),'Andika');
const W=1024,H=768,FPS=60;
function round(ctx,x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
function text(ctx,value,x,y,size=24,color='#fff4d9',font='Andika',align='left'){ctx.font=`${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);}
function layout(key,w=W,h=H){const portrait=h>w,foot=h-(portrait?220:124),hp={thornling:18,golem:24,beetle:12}[key],scale=.78+.65*(1-Math.exp(-(hp-3)/5)),eh=h*(portrait?.22:.31)*scale,ew=Math.min(eh,w*(portrait?.43:.42));const hero={x:w*.10,y:h-(portrait?221:126)-h*(portrait?.39:.58),w:w*(portrait?.37:.28),h:h*(portrait?.39:.58)},pip={x:w*.34,y:foot-h*(portrait?.22:.26),w:w*(portrait?.23:.17),h:h*(portrait?.22:.26)},enemy={x:w-w*.03-ew,y:foot-eh,w:ew,h:eh};const members=key==='beetle'?[{x:enemy.x+.25*ew,y:foot-.29*eh-.72*eh,w:.51*ew,h:.72*eh},{x:enemy.x,y:foot-.72*eh,w:.51*ew,h:.72*eh},{x:enemy.x+.49*ew,y:foot-.72*eh,w:.51*ew,h:.72*eh}]:[enemy];return {hero,pip,enemy,members,hp};}
const phaseList=key=>[
 {label:'Staff cast → impact → enemy recoil',type:'cast',hp:{thornling:18,golem:24,beetle:12}[key]},
 {label:'Enemy counterattack → mage recoil',type:'counter',hp:{thornling:17,golem:23,beetle:11}[key]},
 {label:'Braced staff cast + Pip’s fire',type:'assist',hp:{thornling:16,golem:22,beetle:10}[key]},
 {label:key==='beetle'?'One beetle is defeated · two remain':'Enemy defeat',type:'defeat',hp:key==='beetle'?9:1},
 ...(key==='beetle'?[{label:'A surviving beetle takes the next turn',type:'counter',hp:8,target:1},{label:'Final beetle · finishing spell',type:'defeat',hp:1,target:2}]:[]),
 {label:'Mage victory',type:'victory',hp:0},
 {label:'Alternate outcome · mage loses his last heart',type:'loss',hp:key==='beetle'?8:3,target:key==='beetle'?1:0},
 {label:'Enemy victory',type:'enemyvictory',hp:key==='beetle'?8:3,target:key==='beetle'?1:0}
];
async function main(){
 const images={};for(const a of Object.values(global.BlitzMotionAssets)){images[a.still]=await loadImage(path.join(REPO,a.still));for(const c of Object.values(a.clips))for(const file of c.sheets)images[file]=await loadImage(path.join(REPO,file));}
 const bg=await loadImage(path.join(REPO,'assets/forest-clearing.webp'));
 const canvas=createCanvas(W,H),ctx=canvas.getContext('2d');
 function still(key,r){const a=M.asset(key),f=M.fit(a.view,r);ctx.drawImage(images[a.still],f.x,f.y,512*f.scale,512*f.scale);}
 function scene(key,phase,local){const l=layout(key),target=phase.target||0,r=l.members[target],ms=Math.max(0,Math.min(1200,(local-.45)*1000)),acting=local>=.45&&local<1.65,correct=!['counter','loss'].includes(phase.type),defeated=phase.type==='defeat',assist=phase.type==='assist'||(defeated&&phase.hp===1),isVictory=['victory','enemyvictory'].includes(phase.type);
  const scale=Math.max(W/bg.width,H/bg.height);ctx.drawImage(bg,(W-bg.width*scale)/2,(H-bg.height*scale)/2,bg.width*scale,bg.height*scale);const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#102a2715');shade.addColorStop(.45,'#102a2700');shade.addColorStop(1,'#102a272c');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  // HUD, scroll and companions use the current game positions and artwork.
  round(ctx,24,24,150,48,24,'#13372cda','#c8b48777');const hearts=phase.type==='loss'?(ms>=660?0:1):phase.type==='counter'&&ms>=660?2:3;for(let i=0;i<3;i++)text(ctx,'♥',38+i*36,59,32,i<hearts?'#fb695b':'#647568','Arial');
  text(ctx,'Campaign 1 · Chapter 1',24,105,17);text(ctx,'Lantern Trail',24,130,18);
  round(ctx,350,28,155,42,21,'#153b2cda','#d5c29377');text(ctx,'Word battle',427,57,19,'#fff2d3','Georgia','center');
  const max=l.hp,shown=Math.max(0,phase.hp-(correct&&!isVictory&&ms>=660?1:0));round(ctx,549,33,180,22,11,'#132a22','#fff0d1');round(ctx,554,38,Math.max(1,170*shown/max),12,6,'#e55e42');text(ctx,shown+' / '+max,740,52,17);
  for(const [i,label]of ['♫','II','⌂'].entries()){round(ctx,847+i*55,22,46,46,23,'#183e32eb','#fbe8bb');text(ctx,label,870+i*55,54,25,'#fff9e9','Arial','center');}
  const sx=(W-390)/2,sy=H*.17+24;round(ctx,sx,sy,390,132,12,'#fcf0d3','#ddbd83');round(ctx,sx-10,sy-9,17,150,8,'#cb9d5b','#926730');round(ctx,sx+383,sy-9,17,150,8,'#cb9d5b','#926730');
  text(ctx,phase.type==='counter'||phase.type==='loss'?'The word was tree':'tree',W/2,sy+84,phase.type==='counter'||phase.type==='loss'?32:60,'#1c2e26','Andika','center');
  const visible=l.members.map((r,i)=>i>=target&&!(phase.type==='victory'));for(const [i,er]of l.members.entries())if(visible[i]&&i!==target&&phase.type!=='enemyvictory')still(key,er);
  if(isVictory){still('pip',l.pip);if(phase.type==='victory'){M.drawActor(ctx,images,'mage','victory',Math.min(1,local/1.6),l.hero);}else{M.drawActor(ctx,images,'mage','defeat',1,l.hero);for(const [i,er]of l.members.entries())if(visible[i])M.drawActor(ctx,images,key,'victory',Math.min(1,local/1.6),er);}}
  else if(acting||(phase.type==='loss'&&local>=1.65)){
    if(!assist)still('pip',l.pip);M.drawBattle(ctx,images,{hero:l.hero,enemy:r,pip:l.pip},{correct,enemy:key,defeated,heroDefeated:phase.type==='loss',assist},ms);
  }else{still('mage',l.hero);still('pip',l.pip);if(!defeated||local<1.65)still(key,r);}
  // Answers are cleared by the actual controller during feedback.
  if(local<.45&&!isVictory){for(const [i,word]of ['tree','three','free','see'].entries()){const x=28+i*225;round(ctx,x,H-90,211,78,13,'#f7e8c5','#d4b16e');text(ctx,word,x+105,H-38,34,'#20392d','Andika','center');}}
  round(ctx,130,H-61,W-260,44,22,'#14392bea','#c5b87f88');text(ctx,phase.label,W/2,H-32,21,'#fff3cd','Andika','center');
 }
 for(const key of process.argv.slice(2).filter(k=>k!=='--stills').length?process.argv.slice(2).filter(k=>k!=='--stills'):['thornling','golem','beetle']){
   const phases=phaseList(key),out=path.join(ROOT,'mage-'+key+'-game-preview.mp4');
   if(process.argv.includes('--stills')){for(const [i,p]of phases.entries()){scene(key,p,1.16);fs.writeFileSync(path.join(ROOT,`${key}-review-${i}.png`),canvas.toBuffer('image/png'));}continue;}
   const ff=spawn(process.env.FFMPEG_PATH||'ffmpeg',['-y','-hide_banner','-loglevel','error','-f','rawvideo','-pix_fmt','rgba','-s',W+'x'+H,'-r',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-crf','19','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',out]);ff.stderr.on('data',d=>process.stderr.write(d));
   const done=new Promise((resolve,reject)=>ff.on('exit',code=>code?reject(new Error('ffmpeg '+code)):resolve()));
   for(const phase of phases)for(let frame=0;frame<2*FPS;frame++){scene(key,phase,frame/FPS);if(!ff.stdin.write(Buffer.from(ctx.getImageData(0,0,W,H).data)))await new Promise(r=>ff.stdin.once('drain',r));}
   ff.stdin.end();await done;console.log(JSON.stringify({key,path:out,seconds:phases.length*2,bytes:fs.statSync(out).size}));
 }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
