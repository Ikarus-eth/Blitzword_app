// Offline static QA uses the same SVG renderer as the game; it creates no new art.
const fs=require('node:fs'),path=require('node:path'),Art=require('../enemy-art');
const ids=Art.ids.sort((a,b)=>Art.data[a].selection.localeCompare(Art.data[b].selection));
const cols=4,cw=300,ch=335;
let svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="${Math.ceil(ids.length/cols)*ch+65}"><rect width="100%" height="100%" fill="#213f32"/><text x="35" y="42" fill="#f7e8c6" font-family="Georgia" font-size="28">BlitzWord · Assembled 2D enemies</text>`;
ids.forEach((id,i)=>{
 const art=Art.data[id],x=i%cols*cw,y=65+Math.floor(i/cols)*ch;
 let puppet=Art.render(id).replace(/width="100%" height="100%"/,'width="280" height="280"').replaceAll('class="face faceHit"','class="face faceHit" style="display:none"').replaceAll('class="face faceProud"','class="face faceProud" style="display:none"');
 const image='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'..',art.source)).toString('base64');
 svg+=`<defs><image id="texture-${id}" xlink:href="${image}" width="${art.width}" height="${art.height}"/></defs>`;
 puppet=puppet.replaceAll(`<image href="${art.source}" width="${art.width}" height="${art.height}"/>`,`<use xlink:href="#texture-${id}"/>`);
 svg+=`<g transform="translate(${x} ${y})"><rect x="7" y="5" width="286" height="323" rx="16" fill="#34523e" stroke="#758565"/><g transform="translate(10 9)">${puppet}</g><text x="150" y="310" text-anchor="middle" fill="#f6e6be" font-family="Georgia" font-size="17">${art.selection} ${art.name}</text></g>`;
});
fs.writeFileSync(process.argv[2]||'/workspace/scratch/89f94963e0ef/assembled-enemies.svg',svg+'</svg>');
