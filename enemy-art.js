/* Painted 2D cutout rigs. Motion is enabled only by post-answer state classes. */
(function(root){
'use strict';
const data=typeof module!=='undefined'&&module.exports?require('./enemy-art-data'):root.BlitzEnemyArtData;
function render(id,{stage='adult',prefix=''}={}){
  const key=String(id||'').replace(/-tier-\d+$/,''),art=data[key];if(!art)return null;
  const src=prefix+art.source;
  function part(index,x,y,w,h,extra=''){
    const box=art.cells[index];if(!box)return '';
    return `<svg class="rigPart ${extra}" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${box.join(' ')}" preserveAspectRatio="none" overflow="hidden"><image href="${src}" width="${art.width}" height="${art.height}"/></svg>`;
  }
  const joint=(name,x,y,body,direction=1)=>`<g transform="translate(${x} ${y})"><g class="bone ${name}" style="--direction:${direction};--swing:${direction*24}deg;--bend:${direction*15}deg">${body}</g></g>`;
  const head=(x,y,w,h)=>joint('head',x+w*.5,y+h*.78,
    [1,2,3].map((n,i)=>`<g class="face face${['Neutral','Hit','Proud'][i]}">${part(n,-w*.5,-h*.78,w,h)}</g>`).join(''));
  const limb=(upper,lower,x,y,w,h,direction=1)=>joint('limb',x,y,part(upper,-w*.5,-8,w,h)+joint('knee',0,h*.76,part(lower,-w*.58,-8,w*1.16,h*.88),direction),direction);
  const arm=(upper,lower,x,y,w,h,direction=1)=>joint('arm',x,y,part(upper,-w*.5,-8,w,h)+joint('forearm',0,h*.78,part(lower,-w*.65,-9,w*1.3,h*1.05),direction),direction);
  let body='';
  if(art.rig==='biped'){
    const slender=key==='root-sprite'||key==='acorn-imp',wide=key==='moss-golem'||key==='cave-troll';
    const bw=slender?120:180,bx=(400-bw)/2,aw=slender?43:74,ah=slender?80:90;
    body=limb(10,11,235,264,slender?42:68,64,-1)+arm(6,7,bx+bw-(slender?26:5),167,aw,ah,-1)
      +limb(8,9,165,264,slender?42:68,64)+part(0,bx,137,bw,173)
      +arm(4,5,bx+(slender?26:7),169,aw,ah)+head(slender?126:112,wide?51:36,slender?150:176,wide?143:160);
    if(key==='moss-golem')body+=part(12,84,136,91,73)+part(13,230,137,92,71);
    if(key==='acorn-imp'||key==='mushroom-guard')body+=joint('shield',272,244,part(13,-34,-45,90,120),-1);
  }else if(art.rig==='quadruped'){
    const low=key==='thornling'||key==='bog-toad';
    const torsoY=low?161:130,torsoH=low?162:171;
    body=limb(6,7,169,257,51,67,-1)+limb(10,11,288,257,62,67,-1)
      +joint('tail',320,219,part(12,-5,-45,71,118),-1)+part(0,121,torsoY,220,torsoH)
      +limb(8,9,280,271,low?70:63,62)+limb(4,5,163,271,low?61:54,62)
      +head(low?40:35,low?166:110,low?177:180,low?137:172);
  }else if(art.rig==='moth'){
    body=joint('wing',201,191,part(4,-187,-140,191,180),-1)
      +joint('wing',199,191,part(6,-4,-140,191,180))
      +joint('wing lowerWing',187,217,part(5,-129,-15,139,155),-1)
      +joint('wing lowerWing',213,217,part(7,-10,-15,139,155))
      +joint('limb',177,276,part(8,-21,0,42,63))+joint('limb',223,276,part(9,-21,0,42,63),-1)
      +part(0,154,148,92,152)+head(143,73,114,112);
  }else if(art.rig==='beetle'){
    body=[7,8,9].map((n,i)=>joint('limb',177+i*38,231,part(n,-27,-4,69,118),-1)).join('')
      +part(0,119,151,218,139)+head(57,192,139,116)
      +[4,5,6].map((n,i)=>joint('limb',155+i*60,253,part(n,-38,-5,82,119),i===1?-1:1)).join('');
  }else if(art.rig==='serpent'){
    body=joint('tail',290,296,part(6,-3,-32,85,75),-1)+part(4,75,256,265,125)
      +joint('coil',188,285,part(5,-26,-100,72,143))
      +part(0,137,181,121,135)+head(112,71,184,170);
  }else if(art.rig==='wisp'){
    body=joint('tail',180,255,part(6,-47,-4,62,121),-1)+joint('tail',222,255,part(7,-15,-4,62,121))
      +joint('tail',202,285,part(12,-21,-5,41,94))
      +joint('arm',151,147,part(4,-80,-3,88,176),-1)+joint('arm',248,147,part(5,-8,-3,88,176))
      +head(131,92,140,207);
  }else if(art.rig==='crab'){
    body=[8,9,10,11].map((n,i)=>joint('limb',i<2?140:264,241+(i%2)*25,part(n,i<2?-67:-4,-8,72,104),i<2?-1:1)).join('')
      +head(120,128,180,171)
      +arm(4,5,123,216,67,75)+arm(6,7,283,216,67,75,-1);
  }else if(art.rig==='bird'||art.rig==='bat'){
    const bat=art.rig==='bat';
    const wing=(a,x,dir)=>joint('wing',x,bat?170:188,
      part(a,dir<0?(bat?-163:-93):-7,bat?-10:-36,bat?170:100,bat?199:176),dir);
    body=part(12,164,276,72,78)+wing(4,bat?169:177,-1)+wing(6,bat?231:223,1)
      +limb(8,9,173,292,35,38)+limb(10,11,228,292,35,38,-1)
      +part(0,145,142,110,167)+head(bat?143:135,bat?83:68,bat?114:130,bat?119:139);
  }else if(art.rig==='snail'){
    body=joint('tail',250,326,part(10,-20,-25,122,49),-1)+part(9,75,315,149,51)
      +part(0,70,252,233,111)+joint('shell',244,285,part(4,-111,-151,222,219),-1)
      +head(38,191,143,149);
  }else if(art.rig==='mimic'){
    body=joint('limb',142,295,part(10,-33,-6,66,69),-1)+joint('limb',269,295,part(11,-33,-6,66,69))
      +part(0,91,192,229,139)+part(5,110,229,185,51)
      +head(112,194,189,63)+joint('lid',303,198,part(4,-219,-101,229,118),-1)
      +joint('limb',132,303,part(8,-36,-6,72,76))+joint('limb',276,303,part(9,-36,-6,72,76),-1);
  }else if(art.rig==='griffin'){
    body=joint('wing',183,194,'<g transform="rotate(55)">'+part(4,-145,-5,159,208)+'</g>',-1)+joint('wing',239,194,'<g transform="rotate(-55)">'+part(5,-5,-5,159,208)+'</g>')
      +joint('tail',300,271,part(12,-8,-34,72,95))
      +part(0,145,180,175,124)+joint('limb',269,280,part(11,-27,-5,64,94),-1)
      +limb(8,9,175,268,41,55,-1)+joint('limb',270,284,part(10,-36,-5,68,94))
      +limb(6,7,139,268,44,55)+part(13,92,159,102,128)+head(77,98,131,113);
  }
  const transform=stage==='young'?'translate(20 46) scale(.9 .88)':stage==='baby'?'translate(36 91) scale(.82 .75)':'';
  // The griffin's spread wings extend beyond its body layout; keep them inside
  // the same square display footprint, with the feet anchored at the bottom.
  const viewBox=art.rig==='griffin'?'-90 -180 580 580':'0 0 400 400';
  return `<svg class="enemyRig rig-${art.rig}" data-family="${key}" data-stage="${stage}" viewBox="${viewBox}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><g transform="${transform}"><g class="rigBody">${body}</g></g></svg>`;
}
const api={render,ids:Object.keys(data),data};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.BlitzEnemyArt=api;
})(typeof window!=='undefined'?window:globalThis);
