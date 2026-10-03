// Inventory actual bitmap dimensions and effective atlas crops, not declared SVG sizes.
// SHARP_MODULE may point to an existing sharp installation; this audit does not edit images.
const fs=require('node:fs'),path=require('node:path'),sharp=require(process.env.SHARP_MODULE||'sharp');
const C=require('../content'),A=require('../assets/battle-motion/manifest.json');
const root=path.join(__dirname,'..'),uses=[];
const add=(role,src,options={})=>uses.push({role,src,...options});
for(const [id,a]of Object.entries(C.campaignBackgrounds))add('campaign:'+id,a.src,{fullscreen:true});
for(const [id,a]of Object.entries(C.chapterBackgrounds))add('chapter:'+id,a.src,{fullscreen:true});
for(const [key,a]of Object.entries(A))add('character:'+key,a.still,{virtual:[512,512],crop:a.view});
for(const item of C.words)add('teaching:'+item.w,C.teachingSource(item),item.crop?{virtual:item.image==='core-teaching'?[1536,2048]:[1536,1024],crop:item.crop}:{});
for(const [key,a]of Object.entries(C.storyPictures))add('meaning-picture:'+key,a.src,{virtual:[a.width,a.height],crop:a.crop});
C.evolution.frames.forEach((src,i)=>add('evolution:'+i,src));
for(const [i,a]of C.dragonStages.entries())if(i)add('grown-pip:'+i,'assets/pip-growth.png',{virtual:[1536,1024],crop:a.crop});
for(const f of fs.readdirSync(path.join(root,'assets/story-pilot/scenes')).filter(f=>f.endsWith('.webp')))add('story-adventure:'+f,'assets/story-pilot/scenes/'+f);
for(const f of ['forest-characters.webp','rowanfire-boys-2026-09-21.png','hero4.webp','hero5.webp','hero6.webp','pip.webp','pip-forest-welcome.png','forest-clearing.webp','forest-opponents.png','campaign-forest.png','chapter-scenes.webp'])if(fs.existsSync(path.join(root,'assets',f)))add('shared-or-fallback:'+f,'assets/'+f);
(async()=>{
 const metadata={};for(const u of uses)if(!metadata[u.src]){const m=await sharp(path.join(root,u.src)).metadata();metadata[u.src]={width:m.width,height:m.height,bytes:fs.statSync(path.join(root,u.src)).size};}
 const records=uses.map(u=>{const m=metadata[u.src],w=u.crop?u.crop[2]*m.width/u.virtual[0]:m.width,h=u.crop?u.crop[3]*m.height/u.virtual[1]:m.height;return {...u,...m,effectivePixels:[Math.round(w),Math.round(h)],...(u.fullscreen?{pixelsPerCssPixelAt820x1180:+Math.min(w/820,h/1180).toFixed(3),pixelsPerDevicePixelAt2x:+(Math.min(w/820,h/1180)/2).toFixed(3)}:{})};});
 const result={date:'2026-10-03',uniqueAssets:Object.keys(metadata).length,usageRecords:records.length,notes:['All main-game still source categories audited, including atlas crop resolution.','Family-review alternatives, retired prototypes and animation sheets are excluded.','A 2x display needs twice as many source pixels per axis. Larger file size alone is not evidence of more detail.','The generator returned native sizes recorded below, not the larger requested output sizes.','Character/teaching atlas crops retain their native source resolution; not every existing still is Retina-native.'],assets:metadata,records};
 fs.writeFileSync(path.join(root,'docs/still-resolution/AUDIT.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({uniqueAssets:result.uniqueAssets,usageRecords:result.usageRecords,campaigns:records.filter(r=>r.role.startsWith('campaign:')).map(r=>({role:r.role,size:r.effectivePixels,cssRatio:r.pixelsPerCssPixelAt820x1180}))},null,2));
})().catch(e=>{console.error(e);process.exit(1);});
