// Every script and stylesheet that index.html loads from the top folder must be copied by the Pages workflow
// (12 November 2026: rider-fx.js was missing and returned 404 on the live site).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
test('the Pages workflow publishes every top-level file index.html loads',()=>{
 const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),yml=fs.readFileSync(path.join(root,'.github/workflows/pages.yml'),'utf8');
 const copied=new Set(yml.split('\n').filter(l=>/^\s*cp /.test(l)).flatMap(l=>l.trim().split(/\s+/).slice(1)));
 const loaded=[...html.matchAll(/(?:src|href)="([^"?#]+)/g)].map(m=>m[1]).filter(f=>!f.includes('/')&&!/^(https?:|data:|mailto:)/.test(f)&&/\.(js|css|webmanifest)$/.test(f));
 assert.ok(loaded.length>10);
 for(const f of loaded)assert.ok(copied.has(f),f+' is loaded by index.html but not copied by pages.yml');
});
